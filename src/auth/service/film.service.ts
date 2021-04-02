/* 
* This program is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
*
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
*
* You should have received a copy of the GNU General Public License
* along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import { QueryOptions } from 'mongoose';
import { Film, FilmData } from '../../film/entity/film';
import { FilmModel } from '../../film/entity/film.model';
import { validateFilm } from '../../film/entity/validateFilm';
import { logger } from '../../shared';
import { FilmInvalid, FilmNotExists, FilmServiceError, TitelExists, VersionInvalid, VersionOutdated } from './errors';

export class FilmService {

    private static readonly UPDATE_OPTIONS: QueryOptions = { new: true };

    // ==============================================================
    //                           Utility
    // ==============================================================

    /**
     * Löscht die Zeitstempel eines FilmData Objekts
     * @param film Film vom Typ {@linkcode FilmData}
     */
    private deleteTimestamps(film: FilmData) {
        delete film.createdAt;
        delete film.updatedAt;
    }

    /**
     * Prüft, ob ein Filmtitel bereits existiert
     * @param film Film der überprüft werden soll vom Typ {@linkcode Film}
     * @returns Undefined wenn der Titel nicht vergeben ist, ansonsten {@linkcode TitelExists}
     */
    private async checkTitelExists(film: Film) {

        const { titel } = film;

        const result = await FilmModel.findOne({ titel }, { _id: true}).lean();
        if (result !== null) {
            const id = result._id;
            logger.debug('FilmService.checkTitelExists(): _id=%s', id);
            return new TitelExists(titel, id);
        }

        logger.debug("FilmService.checkTitelExists(): ok");
        return undefined;
    }

    /**
     * Prüft die Id und Version eines Films
     * @param id Die ID des Films
     * @param version Die Version des Films
     * @returns Undefined wenn OK, ansonsten
     * - {@linkcode FilmNotExists} Falls der Film nicht existiert
     * - {@linkcode VersionOutdated} Falls die Version nicht aktuell ist
     */
    private async checkIdAndVersion(id: string, version: number) {
        const filmDb: FilmData | null = await FilmModel.findById(id).lean();
        if (filmDb === null) {
            const result = new FilmNotExists(id);
            logger.debug("FilmService.checkIdAndVersion(): FilmNotExists=%o", result)
            return result;
        };

        const versionDb = filmDb.__v ?? 0;
        if (version < versionDb) {
            const result = new VersionOutdated(id, version);
            logger.debug("FilmService.checkIdAndVersion(): VersionOutdated=%o", result);
            return result;
        }

        return undefined;
    }

    // ==============================================================
    //                           Validation
    // ==============================================================

    /**
     * Validiert einen Film der erzeugt werden soll
     * @param film Ein Film vom Typ {@linkcode Film}
     * @returns Einen Fehler, falls z.B. der Filmtitel bereits vergeben ist.
     */
    private async validateCreate(film: Film) {
        const msg = validateFilm(film);

        if (msg !== undefined) {
            logger.debug(
                'FilmService.validateCreate(): Validation Message: %o',
                msg
            );
            return new FilmInvalid(msg);
        }

        const { titel } = film;

        if (await FilmModel.exists({ titel })) {
            return new TitelExists(titel);
        }
        
        logger.debug('FilmService.validateCreate(): ok');
        return undefined;

    }

    /**
     * Validiert die Version eines Films.
     * @param versionStr Die Version des Films
     * @returns Die Version, wenn OK. Ansonsten Fehlermeldung.
     */
    private validateVersion(versionStr: string | undefined) {
        if(versionStr === undefined) {
            const error = new VersionInvalid(versionStr);
            logger.debug(
                'FilmService.validateVersion(): VersionInvalid=%o',
                error
            );
            return error;
        }

        const version = Number.parseInt(versionStr, 10);
        if (Number.isNaN(version)) {
            const error = new VersionInvalid(versionStr);
            logger.debug('FilmService.validateVersion(): VersionInvalid=%o', error);

            return error;
        }

        return version;
    }

    /**
     * Validiert einen Film, der aktualisiert werden soll.
     * @param film Der zu aktualisierende Film vom Typ {@linkcade Film}
     * @param versionStr Die Versionsnummer
     * @returns Undefined, wenn OK. Ansonsten entsprechende Fehlermeldung.
     */
    private async validateUpdate(film: Film, versionStr: string) {
        const result = this.validateVersion(versionStr);
        if(typeof result !== 'number') {
            return result;
        }

        const version = result;
        logger.debug("FilmService.validateUpdate(): version=%d", version);
        logger.debug("FilmService.validateUpdate(): film=%o", film);

        const validationMsg = validateFilm(film);
        if (validationMsg !== undefined) {
            return new FilmInvalid(validationMsg);
        }

        const resultTitel = await this.checkTitelExists(film);
        if (resultTitel !== undefined && resultTitel.id !== film._id) {
            return resultTitel;
        }

        if (film._id === undefined) {
            return new FilmNotExists(undefined);
        }

        const resultIdAndVersion = await this.checkIdAndVersion(
            film._id,
            version
        );

        if ( resultIdAndVersion !== undefined) {
            return resultIdAndVersion;
        }

        logger.debug('FilmService.validateUpdate(): ok');
        return undefined;
    }

    // ==============================================================
    //                           CREATE
    // ==============================================================

    /**
     * 
     * @param film Der neu abzulegende Film
     * @returns Die ID des neu angeleten Films oder im Fehlerfall
     * - {@linkcode FilmInvalid} falls die Filmdaten gegen Constraints verstoßen
     * - {@linkcode TitelExists} falls der Filmtitel bereits existiert
     */
    async create(film: Film): Promise<FilmInvalid | TitelExists | string> {
        logger.debug('FilmService.create(): film=%o', film);
        const validateResult = await this.validateCreate(film);
        if (validateResult instanceof FilmServiceError) {
            return validateResult;
        }

        const filmModel = new FilmModel(film);
        const saved = await filmModel.save();
        const id = saved._id as string;
        logger.debug('FilmService.create(): id=%s');

        return id;
    }

    // ==============================================================
    //                            READ
    // ==============================================================

    /**
     * Einen Film asynchron anhand seiner ID suchen
     * @param id ID des gesuchten Films
     * @returns Den gefundenen Film vom Typ {@linkcode FilmData} oder undefined
     */
    async findById(id: string) {

        logger.debug('FilmService.findById(): id=%s', id);

        const film = await FilmModel.findById(id).lean<FilmData | null>();

        logger.debug('FilmService.findById() Ergebnis: film=%o', film);

        if(film === null) {
            return undefined;
        }

        this.deleteTimestamps(film);
        return film;
    }

    /**
     * Filme asynchron suchen
     * @param query Die DB-Query als JSON-Objekt
     * @returns Ein JSON Array mit den gefundenen Filmen oder ggf. ein leeres Array, 
     * wenn keine passenden Filme gefunden wurden.
     */
    async find(query?: any | undefined) {
        logger.debug('FilmService.find(): query=%o', query);

        if(query === undefined || Object.entries(query).length === 0) {
            logger.debug("FilmService.find(): Suche alle Filme");

            const filme = await FilmModel.find()
            .sort('titel')
            .lean<FilmData[]>();
            for await (const film of filme) {
                this.deleteTimestamps(film);
            }
            return filme;
        }

        const { titel, javascript, typescript, ...dbQuery } = query;

        // Schutz vor DDOS unseres Servers/DB, da REGEX Prüfung von Strings aufwändig ist
        if (titel !== undefined && titel.length < 10) {
            dbQuery.titel = new RegExp(titel, 'iu'); // eslint-disable-line security/detect-non-literal-regexp, security-node/non-literal-reg-expr
        }

        logger.debug("FilmService.find(): dbQuery=%o", dbQuery);

        const filme = await FilmModel.find(dbQuery).lean<FilmData[]>();

        for await (const film of filme) {
            this.deleteTimestamps(film);
        }

        return filme;
    }

    // ==============================================================
    //                            UPDATE
    // ==============================================================

    /**
     * Einen vorhandenen Film aktualisieren.
     * @param film Der zu aktualisierende Film vom Typ {@linkcode Film}
     * @param versionStr Die Versionsnummer für die optimistische Synchronisation
     * @returns Die neue Versionsnummer gemäß optimistischer Synchronisation oder im Fehlerfall
     * - {@linkcode FilmInvalid} falls Constraints verletzt sind
     * - {@linkcode TitelExists} falls der Filmtitel bereits existiert
     * - {@linkcode FilmNotExists} falls der Film nicht existiert
     * - {@linkcode VersionInvalid} falls die Versionsnummer nicht aktuell ist
     */
    async update(film: Film, versionStr: string): Promise<FilmInvalid | TitelExists | FilmNotExists | VersionInvalid | number> {


        logger.debug('FilmService.update(): film=%o', film);
        logger.debug('FilmService.update(): versionStr=%s', versionStr);

        const validateResult = await this.validateUpdate(film, versionStr);
        if (validateResult instanceof FilmServiceError) {
            return validateResult;
        }

        const filmModel = new FilmModel(film);
        const updated = await FilmModel.findByIdAndUpdate(
            film._id,
            filmModel,
            FilmService.UPDATE_OPTIONS).lean<FilmData | null>();
        
        if ( updated === null ) {
            return new FilmNotExists(film._id);
        }

        const version = updated.__v as number;
        logger.debug('FilmService.update(): version=%d', version);

        return Promise.resolve(version);
    }
}
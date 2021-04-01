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

import { Film, FilmData } from '../../film/entity/film';
import { FilmModel } from '../../film/entity/film.model';
import { validateFilm } from '../../film/entity/validateFilm';
import { logger } from '../../shared';
import { FilmInvalid, FilmServiceError, TitelExists } from './errors';

export class FilmService {


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
}
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

/* eslint-disable max-classes-per-file */
import type { ValidationErrorMsg } from '../entity';

/**
 * Allgemeine Basisklasse für {@linkcode FilmService}
 */
export class FilmServiceError {} // eslint-disable-line @typescript-eslint/no-extraneous-class

/**
 * Klasse für fehlerhafte Filmdaten. Die Fehlermeldungen sind in der Property "msg" gekapselt.
 */
export class FilmInvalid extends FilmServiceError {
    constructor(readonly msg: ValidationErrorMsg) {
        super();
    }
}

/**
 * Fehlerklasse für einen Titel, der bereits vergeben ist.
 */
export class TitelExists extends FilmServiceError {
    constructor(
        readonly titel: string | null | undefined,
        readonly id?: string,
    ) {
        super();
    }
}

/**
 * Union-Type für Fehler beim Neuanlegen eines Films.
 */
export type CreateError = FilmInvalid | TitelExists;

/**
 * Fehlerklasse für eine ungültige Versionsnummer beim Update.
 */
export class VersionInvalid extends FilmServiceError {
    constructor(readonly version: string | undefined) {
        super();
    }
}

/**
 * Fehlerklasse für einen nicht existierenden Film.
 */
export class FilmNotExists extends FilmServiceError {
    constructor(readonly id: string | undefined) {
        super();
    }
}

/**
 * Klasse für eine veraltete Versionsnummer beim Update.
 */
export class VersionOutdated extends FilmServiceError {
    constructor(readonly id: string, readonly version: number) {
        super();
    }
}

/**
 * Union-Type für Fehler beim Ändern eines Films.
 */
export type UpdateError =
    | FilmInvalid
    | FilmNotExists
    | TitelExists
    | VersionInvalid
    | VersionOutdated;

/**
 * Allgemeine Basisklasse für {@linkcode FilmFileService}
 */
export class FilmFileServiceError {} // eslint-disable-line @typescript-eslint/no-extraneous-class

/**
 * Klasse für eine nicht-vorhandenes Binärdatei.
 */
export class FileNotFound extends FilmFileServiceError {
    constructor(readonly filename: string) {
        super();
    }
}

/**
 * Klasse, falls es mehrere Binärdateien zu einem Film gibt.
 */
export class MultipleFiles extends FilmFileServiceError {
    constructor(readonly filename: string) {
        super();
    }
}

/**
 * Union-Type für Fehler beim Lesen eines Films.
 */
export type DownloadError = FileNotFound | FilmNotExists | MultipleFiles;

/* eslint-enable max-classes-per-file */

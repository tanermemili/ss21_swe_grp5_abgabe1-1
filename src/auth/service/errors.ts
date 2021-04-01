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

import { ValidationErrorMsg } from "../../film/entity";

/**
 * Allgemeine Basisklasse für {@linkcode FilmService}
 */
export class FilmServiceError {}

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
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

export type Genre = 'DOKUMENTATION' | 'DRAMA' | 'KOMOEDIE';

export type ProduktionsStudio = 'DISNEY' | 'UNIVERSAL' | 'WARNERBROS';

export interface Film {
    _id?: string; // eslint-disable-line @typescript-eslint/naming-convention
    __v?: number; // eslint-disable-line @typescript-eslint/naming-convention

    readonly titel: string | null | undefined;
    readonly bewertung: number | null | undefined;
    readonly genre: Genre | null | undefined;
    readonly produktionsStudio: ProduktionsStudio | null | undefined;
    readonly preis: number | null | undefined;
    readonly rabatt: number | null | undefined;
    readonly verfuegbarkeit: boolean | null | undefined;
    veroeffentlichung: Date | string | undefined;
    readonly beschreibung: string | null | undefined;
    readonly website: string | null | undefined;
    readonly schauspieler?: string[];
    readonly regisseur: unknown;
    readonly spieldauer: number | null | undefined;
}

export interface FilmData extends Film {
    createdAt?: Date;
    updatedAt?: Date;
}

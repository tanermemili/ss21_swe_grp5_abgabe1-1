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
import { Document, Schema, Model, model } from 'mongoose';
import { Film, Genre, ProduktionsStudio } from './film';
// RFC version 1: timestamps            https://github.com/uuidjs/uuid#uuidv1options-buffer-offset
// RFC version 3: namespace mit MD5     https://github.com/uuidjs/uuid#uuidv3name-namespace-buffer-offset
// RFC version 4: random                https://github.com/uuidjs/uuid#uuidv4options-buffer-offset
// RFC version 5: namespace mit SHA-1   https://github.com/uuidjs/uuid#uuidv5name-namespace-buffer-offset
import { v4 as uuid } from 'uuid';
import { autoIndex } from '../../shared';


export class FilmDocument extends Document<string> implements Film {

    readonly titel: string | null | undefined;
    readonly bewertung: number | null | undefined;
    readonly genre: Genre | null | undefined;
    readonly produktionsStudio: ProduktionsStudio | null | undefined;
    readonly preis: number | null | undefined;
    readonly rabatt: number | null | undefined;
    readonly verfuegbarkeit: boolean | null | undefined;
    veroeffentlichung: Date | null | undefined;
    readonly beschreibung: string | null | undefined;
    readonly website: string | null | undefined;
    readonly schauspieler?: string[];
    readonly regisseur: unknown;
    readonly spieldauer: number | null | undefined;
    readonly createdAt?: number;
    readonly updatedAt?: number;
}

export const filmSchema = new Schema<FilmDocument, Model<FilmDocument>>(
    {
        _id: { type: String, default: uuid },
        titel: { type: String, required: true, unique: true },
        bewertung: {type: Number, min: 0, max: 5 },
        genre: { type: String, enum: ['DOKUMENTATION', 'KOMOEDIE', 'DRAMA'] },
        produktionsStudio: {
            type: String,
            required: true,
            enum: ['TBD']
        },
        preis: { type: Number, required: true },
        rabatt: Number,
        verfuegbarkeit: Boolean,
        veroeffentlichung: Date,
        beschreibung: { type: String, required: true, unique: true, immutable: true },
        website: String,
        schauspieler: { type: [String], sparse: true },
        regisseur: [{}]
    },
    {
        timestamps: true,
        optimisticConcurrency: true,
        autoIndex
    }

    //TODO: optimistic implementieren

 )   
 
 export const FilmModel = model<FilmDocument>('Film', filmSchema);


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

import { Document, Schema, SchemaType, model } from 'mongoose';
import type { Film, Genre, ProduktionsStudio } from './film';
import { autoIndex, logColorConsole } from '../../shared';
import type { Model } from 'mongoose';
// RFC version 1: timestamps            https://github.com/uuidjs/uuid#uuidv1options-buffer-offset
// RFC version 3: namespace mit MD5     https://github.com/uuidjs/uuid#uuidv3name-namespace-buffer-offset
// RFC version 4: random                https://github.com/uuidjs/uuid#uuidv4options-buffer-offset
// RFC version 5: namespace mit SHA-1   https://github.com/uuidjs/uuid#uuidv5name-namespace-buffer-offset
import { v4 as uuid } from 'uuid';

if (logColorConsole) {
    SchemaType.set('debug', true);
}

export class FilmDocument extends Document<string> implements Film {
    readonly titel: string | null | undefined;

    readonly bewertung: number | null | undefined;

    readonly genre: Genre | null | undefined;

    readonly produktionsStudio: ProduktionsStudio | null | undefined;

    readonly preis: number | null | undefined;

    readonly rabatt: number | null | undefined;

    readonly verfuegbarkeit: boolean | null | undefined;

    readonly veroeffentlichung: Date | string | undefined;

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
        bewertung: { type: Number, min: 0, max: 5 },
        genre: { type: String, enum: ['DOKUMENTATION', 'KOMOEDIE', 'DRAMA'] },
        produktionsStudio: {
            type: String,
            required: true,
            enum: ['TBD'],
        },
        preis: { type: Number, required: true },
        rabatt: Number,
        verfuegbarkeit: Boolean,
        veroeffentlichung: Date,
        beschreibung: {
            type: String,
            required: true,
            unique: true,
            immutable: true,
        },
        website: String,
        schauspieler: { type: [String], sparse: true },
        regisseur: [{}],
    },
    {
        timestamps: true,
        optimisticConcurrency: true,
        autoIndex,
    },
);

// Optimistische Synchronisation durch das Feld __v fuer die Versionsnummer
// https://mongoosejs.com/docs/guide.html#versionKey
// https://github.com/Automattic/mongoose/issues/1265
const optimistic = (schema: Schema<FilmDocument, Model<FilmDocument>>) => {
    schema.pre('findOneAndUpdate', function () {
        // UpdateQuery ist abgeleitet von ReadonlyPartial<Schema<...>>
        const update = this.getUpdate(); // eslint-disable-line @typescript-eslint/no-invalid-this
        // eslint-disable-next-line no-null/no-null
        if (update === null) {
            return;
        }
        // eslint-disable-next-line no-null/no-null
        if (update.__v !== null) {
            // @ts-expect-error UpdateQuery laesst nur Lesevorgaenge zu: abgeleitet von ReadonlyPartial<...>
            delete update.__v;
        }
        const keys = ['$set', '$setOnInsert'];
        for (const key of keys) {
            // Optional Chaining
            /* eslint-disable security/detect-object-injection */
            // eslint-disable-next-line no-null/no-null
            if (update[key]?.__v !== null) {
                delete update[key].__v;
                if (Object.entries(update[key]).length === 0) {
                    // @ts-expect-error UpdateQuery laesst nur Lesevorgaenge zu: abgeleitet von ReadonlyPartial<...>
                    delete update[key]; // eslint-disable-line @typescript-eslint/no-dynamic-delete
                }
            }
            /* eslint-enable security/detect-object-injection */
        }
        update.$inc = update.$inc || {};
        // @ts-expect-error UpdateQuery laesst nur Lesevorgaenge zu: abgeleitet von ReadonlyPartial<...>
        update.$inc.__v = 1;
    });
};

filmSchema.plugin(optimistic);

export const FilmModel = model<FilmDocument>('Film', filmSchema); // eslint-disable-line @typescript-eslint/naming-convention

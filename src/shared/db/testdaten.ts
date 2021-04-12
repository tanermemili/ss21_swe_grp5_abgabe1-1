/*
 * Copyright (C) 2020 - present Juergen Zimmermann, Hochschule Karlsruhe
 *
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

/**
 * Das Modul enthält Funktionen für den DB-Zugriff einschließlich GridFS und
 * Neuladen der Test-DB.
 * @packageDocumentation
 */

import type { FilmData } from '../../film/entity';

/* eslint-disable @typescript-eslint/naming-convention */

/**
 * Die Testdaten, um die Test-DB neu zu laden, als JSON-Array.
 */
export const testdaten: FilmData[] = [
    {
        _id: '00000000-0000-0000-0000-000000000001',
        titel: 'Alpha',
        bewertung: 4,
        genre: 'DOKUMENTATION',
        produktionsStudio: 'DISNEY',
        preis: 11.1,
        rabatt: 0.011,
        verfuegbarkeit: true,
        veroeffentlichung: new Date('2020-02-01'),
        beschreibung: 'Dokumentation über die Tiere in Afrika',
        website: 'https://acme.at/',
        schauspieler: [''],
        regisseur: [
            {
                nachname: 'Bond',
                vorname: 'James',
            },
            {
                nachname: 'Bet',
                vorname: 'Alpha',
            },
        ],
        spieldauer: 100,
        __v: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        _id: '00000000-0000-0000-0000-000000000002',
        titel: 'Beta',
        bewertung: 2,
        genre: 'HORROR',
        produktionsStudio: 'WARNER BROS',
        preis: 22.2,
        rabatt: 0.022,
        verfuegbarkeit: true,
        veroeffentlichung: new Date('2020-02-02'),
        beschreibung: 'Horrofilm ab 18 Jahren',
        website: 'https://acme.biz/',
        schauspieler: ['MICHAEL', 'ANNA'],
        regisseur: [
            {
                nachname: 'SPIELBERG',
                vorname: 'STEVEN',
            },
        ],
        spieldauer: 105,
        __v: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        _id: '00000000-0000-0000-0000-000000000003',
        titel: 'Gamma',
        bewertung: 1,
        genre: 'KOMOEDIE',
        produktionsStudio: 'UNIVERSAL',
        preis: 33.3,
        rabatt: 0.033,
        verfuegbarkeit: true,
        veroeffentlichung: new Date('2020-02-03'),
        beschreibung: 'Unlustige Komoedie',
        website: 'https://acme.com/',
        schauspieler: ['PITT', 'CLOONEY'],
        regisseur: [
            {
                nachname: 'John',
                vorname: 'Johnson',
            },
        ],
        spieldauer: 99,
        __v: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        _id: '00000000-0000-0000-0000-000000000004',
        titel: 'Delta',
        bewertung: 3,
        genre: 'DOKUMENTATION',
        produktionsStudio: 'DISNEY',
        preis: 44.4,
        rabatt: 0.044,
        verfuegbarkeit: true,
        veroeffentlichung: new Date('2020-02-04'),
        beschreibung: 'Dokumentation über die Zeitalter der Erde',
        website: 'https://acme.de/',
        schauspieler: [],
        regisseur: [
            {
                nachname: 'Maier',
                vorname: 'Mark',
            },
        ],
        spieldauer: 62,
        __v: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        _id: '00000000-0000-0000-0000-000000000005',
        titel: 'Epsilon',
        bewertung: 2,
        genre: 'HORROR',
        produktionsStudio: 'WARNER BROS',
        preis: 55.5,
        rabatt: 0.055,
        verfuegbarkeit: true,
        veroeffentlichung: new Date('2020-02-05'),
        beschreibung: 'Horrorfilm ab 18 Jahren',
        website: 'https://acme.es/',
        schauspieler: ['MUELLER'],
        regisseur: [
            {
                nachname: 'Gamma',
                vorname: 'Gerd',
            },
        ],
        spieldauer: 111,
        __v: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
];
Object.freeze(testdaten);

/* eslint-enable @typescript-eslint/naming-convention */

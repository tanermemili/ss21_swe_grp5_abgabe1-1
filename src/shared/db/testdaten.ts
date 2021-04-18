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
        titel: 'Faszination Afrika - Tiere im Okavango Delta',
        bewertung: 4,
        genre: 'DOKUMENTATION',
        produktionsStudio: 'DISNEY',
        preis: 11.1,
        rabatt: 0.011,
        verfuegbarkeit: true,
        veroeffentlichung: new Date('2020-02-01'),
        beschreibung: 'test',
        website: 'https://acme.at/',
        schauspieler: [''],
        regisseur: [
            {
                nachname: 'Bond',
                vorname: 'James',
            },
            {
                nachname: 'Beta',

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
        titel: 'Die Entstehung des Hamburger Hafens',
        bewertung: 2,
        genre: 'DOKUMENTATION',
        produktionsStudio: 'WARNERBROS',
        preis: 22.2,
        rabatt: 0.022,
        verfuegbarkeit: true,
        veroeffentlichung: new Date('2020-02-02'),
        beschreibung: 'Er ist der größte Hafen Deutschlands, aber nicht allein das macht den Hamburger Hafen so außergewöhnlich: Er ist auch der einzige große Seehafen, der mitten in einer Großstadt liegt. Den Seefahrern bereitet genau das aber auch Sorgen. Seine Lage macht ihn nicht gerade zum günstigsten Anlaufpunkt für moderne Containerriesen, die Waren aus aller Welt bringen. Unsere Dokumentation zeigt den Hamburger Hafen von allen Seiten und begleitet den Arbeitsalltag zwischen Hafenbecken, Kaianlagen und Containern.',
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
        titel: 'Dinner for One',
        bewertung: 1,
        genre: 'KOMOEDIE',
        produktionsStudio: 'UNIVERSAL',
        preis: 33.3,
        rabatt: 0.033,
        verfuegbarkeit: true,
        veroeffentlichung: new Date('2020-02-03'),
        beschreibung: 'Anlässlich ihres 90. Geburtstages lädt Miss Sophie zum Geburtstagsdinner. Schlüpft nach- einander in die Rolle des Butlers James und spielt Szenen aus dem berühmten TV-Klassiker nach. Serviert Speis und Trank, sprecht einen Toast auf Miss Sophie aus – und vergesst nicht über den Tigerkopf zu stolpern!',
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
        titel: 'Unser blauer Planet',
        bewertung: 3,
        genre: 'DOKUMENTATION',
        produktionsStudio: 'DISNEY',
        preis: 44.4,
        rabatt: 0.044,
        verfuegbarkeit: true,
        veroeffentlichung: new Date('2020-02-04'),
        beschreibung: 'Unser blauer Planet (Originaltitel: The Blue Planet) ist eine achtteilige Dokumentation, die sich mit dem Lebensraum Meer beschäftigt. Die Serie, deren deutscher Untertitel Die Naturgeschichte der Meere lautet, entstand unter Federführung der BBC und war erstmals im September 2001 im britischen Fernsehen zu sehen. Das Material der Serie wurde, unter Verwendung unveröffentlichter Sequenzen, dazu genutzt, den Kino-Dokumentarfilm Deep Blue zu produzieren.',
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
        titel: 'Der Petersdom',
        bewertung: 2,
        genre: 'DOKUMENTATION',
        produktionsStudio: 'WARNERBROS',
        preis: 55.5,
        rabatt: 0.055,
        verfuegbarkeit: true,
        veroeffentlichung: new Date('2020-02-05'),
        beschreibung: '1506 traf Papst Julius II. die Entscheidung, die konstantinische Basilika, die 319 auf dem Grab des Apostels Petrus errichtet wurde, durch einen Neubau zu ersetzen. Doch erst 1626 wurde Neu-St. Peter vollendet. Die berühmtesten Architekten und Künstler jener Zeit waren an dem Bau beteiligt, darunter Bramante, Michelangelo und Bernini. Die Dokumentation "Der Petersdom" erzählt die Geschichte dieser Kirche und spürt der Faszination nach, die von der Basilika ausgeht.',
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

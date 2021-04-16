/*
 * Copyright (C) 2016 - present Juergen Zimmermann, Hochschule Karlsruhe
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

import { HttpMethod, agent, createTestserver } from '../../testserver';
import { HttpStatus, nodeConfig } from '../../../src/shared';
import { afterAll, beforeAll, describe, test } from '@jest/globals';
import fetch, { Headers, Request } from 'node-fetch';
import type { AddressInfo } from 'net';
import type { Film } from '../../../src/film/entity';
import { PATHS } from '../../../src/app';
import RE2 from 're2';
import type { Server } from 'http';
import chai from 'chai';
import { login } from '../../login';

const { expect } = chai;

// IIFE (= Immediately Invoked Function Expression) statt top-level await
// https://developer.mozilla.org/en-US/docs/Glossary/IIFE
(async () => {
    // startWith(), endWith()
    const chaiString = await import('chai-string');
    chai.use(chaiString.default);
})();

// -----------------------------------------------------------------------------
// T e s t d a t e n
// -----------------------------------------------------------------------------
const neuerFilm: Film = {
    titel: 'Neu',
    bewertung: 1,
    genre: 'DOKUMENTATION',
    produktionsStudio: 'UNIVERSAL',
    preis: 99.99,
    rabatt: 0.099,
    verfuegbarkeit: true,
    veroeffentlichung: '2016-02-28',
    beschreibung: '0-0070-0644-6',
    website: 'https://test.de/',
    schauspieler: ['JAVASCRIPT', 'TYPESCRIPT'],
    regisseur: [{ nachname: 'Test', vorname: 'Theo' }],
    spieldauer: 120
};
const neuerFilmInvalid: object = {
    titel: 'Neu',
    bewertung: 1,
    genre: 'DOKUMENTATION',
    produktionsStudio: 'UNIVERSAL',
    preis: 99.99,
    rabatt: 0.099,
    verfuegbarkeit: true,
    veroeffentlichung: '2016-02-28',
    beschreibung: '0-0070-0644-6',
    website: 'https://test.de/',
    schauspieler: ['JAVASCRIPT', 'TYPESCRIPT'],
    regisseur: [{ nachname: 'Test', vorname: 'Theo' }],
    spieldauer: 120
};
const neuerFilmTitelExistiert: Film = {
    titel: 'Neu',
    bewertung: 1,
    genre: 'DOKUMENTATION',
    produktionsStudio: 'UNIVERSAL',
    preis: 99.99,
    rabatt: 0.099,
    verfuegbarkeit: true,
    veroeffentlichung: '2016-02-28',
    beschreibung: '0-0070-0644-6',
    website: 'https://test.de/',
    schauspieler: ['JAVASCRIPT', 'TYPESCRIPT'],
    regisseur: [{ nachname: 'Test', vorname: 'Theo' }],
    spieldauer: 120
};

// -----------------------------------------------------------------------------
// T e s t s
// -----------------------------------------------------------------------------
let server: Server;
const path = PATHS.filme;
let filmeUri: string;
let loginUri: string;

// Test-Suite
describe('POST /api/filme', () => {
    // Testserver starten und dabei mit der DB verbinden
    beforeAll(async () => {
        server = await createTestserver();

        const address = server.address() as AddressInfo;
        const baseUri = `https://${nodeConfig.host}:${address.port}`;
        filmeUri = `${baseUri}${path}`;
        loginUri = `${baseUri}${PATHS.login}`;
    });

    // (done?: DoneFn) => Promise<void | undefined | unknown> | void | undefined
    // close(callback?: (err?: Error) => void): this
    afterAll(() => { server.close() });

    test('Neuer Film', async () => {
        // given
        const token = await login(loginUri);

        const headers = new Headers({
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        });
        const body = JSON.stringify(neuerFilm);
        const request = new Request(filmeUri, {
            method: HttpMethod.POST,
            headers,
            body,
            agent,
        });
        const uuidRegexp = new RE2(
            '[\\dA-Fa-f]{8}-[\\dA-Fa-f]{4}-[\\dA-Fa-f]{4}-[\\dA-Fa-f]{4}-[\\dA-Fa-f]{12}',
            'u',
        );

        // when
        const response = await fetch(request);

        // then
        const { status } = response;
        expect(status).to.be.equal(HttpStatus.CREATED);

        const location = response.headers.get('Location');
        expect(location).to.exist;
        expect(typeof location === 'string').to.be.true;
        expect(location).not.to.be.empty;

        // UUID: Muster von HEX-Ziffern
        const indexLastSlash: number = location?.lastIndexOf('/') as number;
        const idStr = location?.slice(indexLastSlash + 1);
        expect(idStr).not.to.be.empty;
        expect(uuidRegexp.test(idStr as string)).to.be.true;

        const responseBody = response.text();
        expect(responseBody).to.be.empty;
    });

    test('Neuer Film mit ungueltigen Daten', async () => {
        // given
        const token = await login(loginUri);
        const headers = new Headers({
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        });
        const body = JSON.stringify(neuerFilmInvalid);
        const request = new Request(filmeUri, {
            method: HttpMethod.POST,
            headers,
            body,
            agent,
        });

        // when
        const response = await fetch(request);

        // then
        expect(response.status).to.be.equal(HttpStatus.BAD_REQUEST);
        const { art, rating, verlag, datum, isbn } = await response.json();

        expect(art).to.be.equal(
            'Das Genre eines Filmes muss DOKUMENTATION, DRAMA oder KOMOEDIE sein',
        );
        expect(rating).to.be.equal('Eine Bewertung muss zwischen 0 und 5 liegen.');
        expect(verlag).to.be.equal(
            'das produktionsStudio eines Filmes muss DISNEY, UNIVERSAL oder WARNERBROS sein',
        );
        expect(datum).to.be.equal('Das Datum muss im Format yyyy-MM-dd sein.');
        expect(isbn).to.be.equal('Die ISBN-Nummer ist nicht korrekt.');
    });

    test('Neuer Film, aber der Titel existiert bereits', async () => {
        // given
        const token = await login(loginUri);
        const headers = new Headers({
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        });
        const body = JSON.stringify(neuerFilmTitelExistiert);
        const request = new Request(filmeUri, {
            method: HttpMethod.POST,
            headers,
            body,
            agent,
        });

        // when
        const response = await fetch(request);

        // then
        expect(response.status).to.be.equal(HttpStatus.BAD_REQUEST);
        const responseBody = await response.text();
        expect(responseBody).has.string('Titel');
    });

    test('Neuer Film, aber ohne Token', async () => {
        // given
        const headers = new Headers({ 'Content-Type': 'application/json' });
        const body = JSON.stringify(neuerFilmTitelExistiert);
        const request = new Request(filmeUri, {
            method: HttpMethod.POST,
            headers,
            body,
            agent,
        });

        // when
        const response = await fetch(request);

        // then
        expect(response.status).to.be.equal(HttpStatus.UNAUTHORIZED);
        const responseBody = await response.text();
        expect(responseBody).to.be.equalIgnoreCase('unauthorized');
    });

    test('Neuer Film, aber mit falschem Token', async () => {
        // given
        const token = 'FALSCH';
        const headers = new Headers({
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        });
        const body = JSON.stringify(neuerFilm);
        const request = new Request(filmeUri, {
            method: HttpMethod.POST,
            headers,
            body,
            agent,
        });

        // when
        const response = await fetch(request);

        // then
        expect(response.status).to.be.equal(HttpStatus.UNAUTHORIZED);
        const responseBody = await response.text();
        expect(responseBody).to.be.equalIgnoreCase('unauthorized');
    });

    test.todo('Test mit abgelaufenem Token');
});

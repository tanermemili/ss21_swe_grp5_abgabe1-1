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
import { HttpStatus, logger, nodeConfig } from '../../../src/shared';
import { afterAll, beforeAll, describe, test } from '@jest/globals';
import fetch, { Headers, Request } from 'node-fetch';
import type { AddressInfo } from 'net';
import type { Film } from '../../../src/film/entity';
import { MAX_RATING } from '../../../src/film/entity';
import { PATHS } from '../../../src/app';
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
const geaenderterFilm: Omit<Film, 'isbn'> = {
    // isbn wird nicht geaendet
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
const idVorhanden = '00000000-0000-0000-0000-000000000003';

const geaenderterFilmIdNichtVorhanden: Omit<Film, 'isbn' | 'homepage'> = {
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
const idNichtVorhanden = '00000000-0000-0000-0000-000000000999';

const geaenderterFilmInvalid: object = {
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

const veralterFilm: object = {
    // isbn wird nicht geaendet
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
const path = PATHS.filme;
let server: Server;
let filmeUri: string;
let loginUri: string;

// Test-Suite
describe('PUT /api/filme/:id', () => {
    // Testserver starten und dabei mit der DB verbinden
    beforeAll(async () => {
        server = await createTestserver();

        const address = server.address() as AddressInfo;
        const baseUri = `https://${nodeConfig.host}:${address.port}`;
        filmeUri = `${baseUri}${path}`;
        logger.info(`filmeUri = ${filmeUri}`);
        loginUri = `${baseUri}${PATHS.login}`;
    });

    afterAll(() => { server.close() });

    test('Vorhandener Film aendern', async () => {
        // given
        const token = await login(loginUri);
        const headers = new Headers({
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            'If-Match': '"0"',
        });
        const body = JSON.stringify(geaenderterFilm);
        const request = new Request(`${filmeUri}/${idVorhanden}`, {
            method: HttpMethod.PUT,
            headers,
            body,
            agent,
        });

        // when
        const response = await fetch(request);

        // then
        expect(response.status).to.be.equal(HttpStatus.NO_CONTENT);
        const responseBody = await response.text();
        expect(responseBody).to.be.empty;
    });

    test('Nicht-vorhandenen Film aendern', async () => {
        // given
        const token = await login(loginUri);
        const headers = new Headers({
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            'If-Match': '"0"',
        });
        const body = JSON.stringify(geaenderterFilmIdNichtVorhanden);
        const request = new Request(`${filmeUri}/${idNichtVorhanden}`, {
            method: HttpMethod.PUT,
            headers,
            body,
            agent,
        });

        // when
        const response = await fetch(request);

        // then
        expect(response.status).to.be.equal(HttpStatus.PRECONDITION_FAILED);
        const responseBody = await response.text();
        expect(responseBody).to.be.equal(
            `Es gibt keinen Film mit der ID "${idNichtVorhanden}".`,
        );
    });

    test('Vorhandener Film aendern, aber mit ungueltigen Daten', async () => {
        // given
        const token = await login(loginUri);
        const headers = new Headers({
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            'If-Match': '"0"',
        });
        const body = JSON.stringify(geaenderterFilmInvalid);
        const request = new Request(`${filmeUri}/${idVorhanden}`, {
            method: HttpMethod.PUT,
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
        expect(rating).to.be.equal(`Eine Bewertung muss zwischen 0 und ${MAX_RATING} liegen.`);
        expect(verlag).to.be.equal(
            'das produktionsStudio eines Filmes muss DISNEY, UNIVERSAL oder WARNERBROS sein',
        );
        expect(datum).to.be.equal('Das Datum muss im Format yyyy-MM-dd sein.');
        expect(isbn).to.be.equal('Die ISBN-Nummer ist nicht korrekt.');
    });

    test('Vorhandener Film aendern, aber ohne Versionsnummer', async () => {
        // given
        const token = await login(loginUri);
        const headers = new Headers({
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        });
        const body = JSON.stringify(geaenderterFilm);
        const request = new Request(`${filmeUri}/${idVorhanden}`, {
            method: HttpMethod.PUT,
            headers,
            body,
            agent,
        });

        // when
        const response = await fetch(request);

        // then
        expect(response.status).to.be.equal(HttpStatus.PRECONDITION_REQUIRED);
        const responseBody = await response.text();
        expect(responseBody).to.be.equal('Versionsnummer fehlt');
    });

    test('Vorhandener Film aendern, aber mit alter Versionsnummer', async () => {
        // given
        const token = await login(loginUri);
        const headers = new Headers({
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            'If-Match': '"-1"',
        });
        const body = JSON.stringify(veralterFilm);
        const request = new Request(`${filmeUri}/${idVorhanden}`, {
            method: HttpMethod.PUT,
            headers,
            body,
            agent,
        });

        // when
        const response = await fetch(request);

        // then
        expect(response.status).to.be.equal(HttpStatus.PRECONDITION_FAILED);
        const responseBody = await response.text();
        expect(responseBody).to.have.string('Die Versionsnummer');
    });

    test('Vorhandener Film aendern, aber ohne Token', async () => {
        // given
        const headers = new Headers({
            'Content-Type': 'application/json',
            'If-Match': '"0"',
        });
        const body = JSON.stringify(geaenderterFilm);
        const request = new Request(`${filmeUri}/${idVorhanden}`, {
            method: HttpMethod.PUT,
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

    test('Vorhandener Film aendern, aber mit falschem Token', async () => {
        // given
        const token = 'FALSCH';
        const headers = new Headers({
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            'If-Match': '"0"',
        });
        const body = JSON.stringify(geaenderterFilm);
        const request = new Request(`${filmeUri}/${idVorhanden}`, {
            method: HttpMethod.PUT,
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
});

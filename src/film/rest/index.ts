/**
 * Handler-Funktionen, um die REST-Schnittstelle mit Express zu realisieren. Die
 * einzelnen Handler-Funktionen delegieren an die jeweiligen Methoden der Klassen
 * {@linkcode BuchRequestHandler} und {@linkcode BuchFileRequestHandler}.
 * @packageDocumentation
 */

import type { Request, Response } from 'express';
import { FilmFileRequestHandler } from './film-file.request-handler';
import { FilmRequestHandler } from './film.request-handler';

const handler = new FilmRequestHandler();
const fileHandler = new FilmFileRequestHandler();

/**
 * Asynchrone Filmsuche anhand der ID als Pfadparameter
 * Rückgabe 304, 200 oder 404
 * 
 * @param req Request-Objekt von Express
 * @param res Leeres Response-Objekt von Express
 * @returns Leeres Promise-Objekt
 */

export const findById = (req: Request, res: Response) =>
    handler.findById(req, res);
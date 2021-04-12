/**
 * Das Modul besteht aus der Klasse {@linkcode FilmFileRequestHandler}, um die
 * Handler-Funktionen für die REST-Schnittstelle auf der Basis von Express
 * gebündelt bereitzustellen, damit Binärdateien hoch- und heruntergeladen
 * werden können.
 * @packageDocumentation
 */

import {
    FilmFileService,
    FilmFileServiceError,
    FilmNotExists,
    FileNotFound,
    MultipleFiles
} from './../service';
import { HttpStatus, logger } from '../../shared';
import type { Request, Response } from 'express';
import type { DownloadError } from '../service';


export class FilmFileRequestHandler {
    private readonly service = new FilmFileService();

    upload(req: Request, res: Response){
        const { id } = req.params;
        logger.debug('FilmFileRequestHandler.upload(): id=%s', id);
        if (id === undefined) {
            res.sendStatus(HttpStatus.INTERNAL_ERROR);
            return;
        }

        const data: Uint8Array[] = [];
        let totalBytesInBuffer = 0;

        req.on('data', (chunk: Uint8Array) => {
            const { length } = chunk;
            logger.debug('FilmFileRequestHandler.upload(): data %d', length);
            data.push(chunk);
            totalBytesInBuffer += length;
        })
            .on('aborted', () =>
                logger.debug('FilmFileRequestHandler.upload(): aborted'),
            )
            .on('end', () => {
                logger.debug(
                    'FilmFileRequestHandler.upload(): end %d',
                    totalBytesInBuffer,
                );
                const buffer = Buffer.concat(data, totalBytesInBuffer);

                // IIFE (= Immediately Invoked Function Expression) wegen await
                // https://developer.mozilla.org/en-US/docs/Glossary/IIFE
                // https://github.com/typescript-eslint/typescript-eslint/issues/647
                // https://github.com/typescript-eslint/typescript-eslint/pull/1799
                (async () => {
                    try {
                        await this.save(req, id, buffer);
                    } catch (err: unknown) {
                        logger.error('Fehler beim Abspeichern: %o', err);
                        return;
                    }

                    res.sendStatus(HttpStatus.NO_CONTENT);
                })();
            });
    }

    /**
     * Runterladen einer Binärdatei, ID muss in Pfad des Express Request-Objektes enthalten sein
     * 
     *
     * Bei erfolgreicher Durchführung: Statuscode `200`
     * Falls kein Film mit der ID vorhanden:  Statuscode `412`
     * Film existiert, aber keine Binärdatei: Statuscode '404
     * 
     * 
     *
     * @param req Request-Objekt von Express.
     * @param res Leeres Response-Objekt von Express.
     * @returns Leeres Promise-Objekt.
     */
     async download(req: Request, res: Response) {
        const { id } = req.params;
        logger.debug('FilmFileRequestHandler.downloadBinary(): %s', id);
        if (id === undefined) {
            res.sendStatus(HttpStatus.INTERNAL_ERROR);
            return;
        }

        const findResult = await this.service.find(id);
        if (
            findResult instanceof FilmFileServiceError ||
            findResult instanceof FilmNotExists
        ) {
            this.handleDownloadError(findResult, res);
            return;
        }

        const file = findResult;
        const { readStream, contentType } = file;
        res.contentType(contentType);
        // https://www.freecodecamp.org/news/node-js-streams-everything-you-need-to-know-c9141306be93
        readStream.pipe(res);
    }

    private async save(req: Request, id: string, buffer: Buffer) {
        const contentType = req.headers['content-type'];
        await this.service.save(id, buffer, contentType);
    }

    private handleDownloadError(
        err: FilmNotExists | DownloadError,
        res: Response,
    ) {
        if (err instanceof FilmNotExists) {
            const { id } = err;
            const msg = `Es gibt keinen Film mit der ID "${id}".`;
            logger.debug(
                'FilmFileRequestHandler.handleDownloadError(): msg=%s',
                msg,
            );
            res.status(HttpStatus.PRECONDITION_FAILED)
                .set('Content-Type', 'text/plain')
                .send(msg);
            return;
        }

        if (err instanceof FileNotFound) {
            const { filename } = err;
            const msg = `Es gibt kein File mit Name ${filename}`;
            logger.debug(
                'FilmFileRequestHandler.handleDownloadError(): msg=%s',
                msg,
            );
            res.status(HttpStatus.NOT_FOUND).send(msg);
            return;
        }

        if (err instanceof MultipleFiles) {
            const { filename } = err;
            const msg = `Es gibt mehr als ein File mit Name ${filename}`;
            logger.debug(
                'FilmFileRequestHandler.handleDownloadError(): msg=%s',
                msg,
            );
            res.status(HttpStatus.INTERNAL_ERROR).send(msg);
        }
    }
}





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

/* eslint-disable no-process-exit */

import { connect, connection, pluralize } from 'mongoose';
import type { ConnectOptions } from 'mongoose';
import { dbConfig } from '../config';
import { logger } from '../logger';


const { url } = dbConfig;

const useNewUrlParser = true;

const useFindAndModify = false;

const useCreateIndex = true;

const useUnifiedTopology = true;

// Name eines mongoose-Models = Name der Collection
// https://github.com/Automattic/mongoose/issues/5947#issuecomment-354381167
// eslint-disable-next-line line-comment-position, spaced-comment, unicorn/no-useless-undefined
pluralize(undefined); //NOSONAR

export const connectDB = async () => {
    logger.info(
        'URL fuer mongoose: %s',
        url.replace(/\/\/.*:/u, '//USERNAME:@').replace(/:[^:]*@/u, ':***@'),
    );

    const options: ConnectOptions = {
        useNewUrlParser,
        useFindAndModify,
        useCreateIndex,
        useUnifiedTopology,
    };

    try {
        await connect(url, options);
    } catch (err: any) {
        logger.error('%o', err);
        logger.error(
            'FEHLER beim Aufbau der DB-Verbindung: %s\n',
            err.message as string,
        );
        process.exit(0); // eslint-disable-line node/no-process-exit
    }

    logger.info('DB-Verbindung zu %s ist aufgebaut', connection.name);

    connection.on('disconnecting', () =>
        logger.info('DB-Verbindung wird geschlossen...'),
    );
    connection.on('disconnected', () =>
        logger.info('DB-Verbindung ist geschlossen.'),
    );
    connection.on('error', () => logger.error('Fehlerhafte DB-Verbindung'));
};

export const autoIndex = true;

/* eslint-enable no-process-exit */

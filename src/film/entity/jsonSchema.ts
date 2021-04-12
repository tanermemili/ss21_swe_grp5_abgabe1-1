import type { GenericJsonSchema } from './GenericJsonSchema';

export const MAX_RATING = 5;

export const jsonSchema: GenericJsonSchema = {
    $schema: 'https://json-schema.org/draft/2019-09/schema',
    $id: 'http://acme.com/film.json#',
    title: 'Film',
    description: 'Eigenschaften eines Filmes: Typen und Einschraenkungen',
    type: 'object',
    properties: {
        /* eslint-disable @typescript-eslint/naming-convention */
        _id: {
            type: 'string',
            pattern:
                '^[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{12}$',
        },
        __v: {
            type: 'number',
            minimum: 0,
        },
        /* eslint-enable @typescript-eslint/naming-convention */
        titel: {
            type: 'string',
            pattern: '^\\w.*',
        },
        bewertung: {
            type: 'number',
            minimum: 0,
            maximum: MAX_RATING,
        },
        genre: {
            type: 'string',
            enum: ['DOKUMENTATION', 'KOMOEDIE', 'DRAMA', 'HORROR', 'ACION', ''],
        },
        produktionsStudio: {
            type: 'string',
            enum: ['DISNEY', 'UNIVERSAL', 'WARNER BROS', ''],
        },
        preis: {
            type: 'number',
            minimum: 0,
        },
        rabatt: {
            type: 'number',
            exclusiveMinimum: 0,
            exclusiveMaximum: 1,
        },
        verfuegbarkeit: { type: 'boolean' },
        veroeffentlichung: { type: 'string', format: 'date' },
        beschreibung: {
            type: 'string',
            // TODO https://github.com/ajv-validator/ajv-formats/issues/14
            pattern: '^\\w.*',
        },
        website: { type: 'string', format: 'uri' },
        schauspieler: {
            type: 'array',
            items: { type: 'string' },
        },
        regisseur: {
            type: 'array',
            items: { type: 'string' },
        },
    },
    required: ['titel', 'genre', 'produktionsStudio'],
    errorMessage: {
        properties: {
            titel:
                'Ein Filmtitel muss mit einem Buchstaben, einer Ziffer oder _ beginnen.',
            bewertung: 'Eine Bewertung muss zwischen 0 und 5 liegen.',
            genre:
                'Das Genre eines Films kann nur DOKUMENTATION, KOMOEDIE, DRAMA, HORROR oder ACTION sein',
            produktionsStudio:
                'Das Produktionsstudio eines Filmes muss DISNEY, UNIVERSAL oder WARNER BROS sein.',
            preis: 'Der Preis darf nicht negativ sein.',
            rabatt: 'Der Rabatt muss ein Wert zwischen 0 und 1 sein.',
            verfuegbarkeit:
                'Die "verfuegbarkeit" muss auf true oder false gesetzt sein.',
            datum: 'Das Datum muss im Format yyyy-MM-dd sein.',
            beschreibung: 'Die Beschreibung ist nicht korrekt.',
            website: 'Die URL der Homepage ist nicht korrekt.',
        },
    },
    additionalProperties: false,
};

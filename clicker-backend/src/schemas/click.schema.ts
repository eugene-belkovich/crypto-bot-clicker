import {FastifySchema} from 'fastify';

const clickDataProperties = {
    timestamp: {type: 'string'},
    x: {type: 'number'},
    y: {type: 'number'},
    metadata: {
        type: 'object',
        properties: {
            userAgent: {type: 'string'},
            hasTouchEvents: {type: 'boolean'},
            hasOrientation: {type: 'boolean'},
            hasOrientationEvent: {type: 'boolean'},
            hasMotionEvent: {type: 'boolean'},
            timeZone: {type: 'string'},
        },
        additionalProperties: false,
    },
} as const;

export const saveClicksSchema: FastifySchema = {
    body: {
        type: 'array',
        minItems: 1,
        maxItems: 50,
        items: {
            type: 'object',
            required: ['timestamp', 'x', 'y'],
            properties: clickDataProperties,
            additionalProperties: false,
        },
    },
    response: {
        200: {
            type: 'object',
            properties: {
                score: {type: 'number'},
            },
        },
    },
};

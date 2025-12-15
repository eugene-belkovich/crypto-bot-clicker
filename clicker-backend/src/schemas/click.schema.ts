import {FastifySchema} from 'fastify';

const clickDataProperties = {
  timestamp: {type: 'string', format: 'date-time'},
  x: {type: 'number', minimum: -100000, maximum: 100000},
  y: {type: 'number', minimum: -100000, maximum: 100000},
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

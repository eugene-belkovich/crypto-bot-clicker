import {FastifySchema} from 'fastify';

export const getMeSchema: FastifySchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        user: {
          type: 'object',
          properties: {
            telegramId: {type: 'string'},
            username: {type: 'string'},
            firstName: {type: 'string'},
            lastName: {type: 'string'},
            createdAt: {type: 'string', format: 'date-time'},
            updatedAt: {type: 'string', format: 'date-time'},
          },
        },
        score: {type: 'number'},
      },
    },
  },
};

export const getScoreSchema: FastifySchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        score: {type: 'number'},
      },
    },
  },
};

const leaderboardEntryProperties = {
  rank: {type: 'number'},
  telegramId: {type: 'string'},
  username: {type: ['string', 'null']},
  firstName: {type: ['string', 'null']},
  photoUrl: {type: ['string', 'null']},
  score: {type: 'number'},
};

export const getLeaderboardSchema: FastifySchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        leaderboard: {
          type: 'array',
          items: {
            type: 'object',
            properties: leaderboardEntryProperties,
          },
        },
        me: {
          type: 'object',
          properties: leaderboardEntryProperties,
        },
      },
    },
  },
};

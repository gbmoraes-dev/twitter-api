import type { FastifyInstance } from 'fastify'

import { register } from './register.controller'

import { verifyAccount } from './verify-account.controller'

import { authenticate } from './authenticate.controller'

import { refresh } from './refresh.controller'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/register', {
    schema: {
      summary: 'Register a new user',
      tags: ['Auth'],
      body: {
        type: 'object',
        properties: {
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          bio: { type: 'string' },
          username: { type: 'string', minLength: 3 },
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 6 },
        },
        required: ['firstName', 'username', 'email', 'password'],
      },
      response: {
        201: {
          description: 'User registered successfully',
          type: 'object',
          properties: {
            user: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                firstName: { type: 'string' },
                lastName: { type: 'string' },
                bio: { type: 'string' },
                username: { type: 'string' },
                email: { type: 'string' },
                emailIsVerified: { type: 'boolean' },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' },
              },
            },
          },
        },
        409: {
          description: 'Usename or email already exists',
          type: 'object',
          properties: {
            message: { type: 'string' },
          },
        },
      },
    },
    handler: register,
  })

  app.patch('/verify-account', {
    schema: {
      summary: 'Verify an account',
      tags: ['Auth'],
      body: {
        type: 'object',
        properties: {
          token: { type: 'string' },
        },
        required: ['token'],
      },
      response: {
        200: {
          description: 'User verified successfully',
          type: 'object',
          properties: {
            user: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                emailIsVerified: { type: 'boolean' },
                updatedAt: { type: 'string', format: 'date-time' },
              },
            },
          },
        },
        409: {
          description: 'Account already verified',
          type: 'object',
          properties: {
            message: { type: 'string' },
          },
        },
      },
    },
    handler: verifyAccount,
  })

  app.post('/authenticate', {
    schema: {
      summary: 'Authenticate an account',
      tags: ['Auth'],
      body: {
        type: 'object',
        properties: {
          username: { type: 'string', minLength: 3 },
          password: { type: 'string', minLength: 6 },
        },
        required: ['username', 'password'],
      },
      response: {
        200: {
          description: 'User authenticated successfully',
          type: 'object',
          properties: {
            token: { type: 'string' },
          },
        },
        400: {
          description: 'Invalid Credentials',
          type: 'object',
          properties: {
            message: { type: 'string' },
          },
        },
        403: {
          description: 'Account not verified',
          type: 'object',
          properties: {
            message: { type: 'string' },
          },
        },
      },
    },
    handler: authenticate,
  })

  app.patch('/token/refresh', {
    schema: {
      summary: 'Refresh an account',
      tags: ['Auth'],
      response: {
        200: {
          description: 'User refreshed successfully',
          type: 'object',
          properties: {
            token: { type: 'string' },
          },
        },
      },
    },
    handler: refresh,
  })
}

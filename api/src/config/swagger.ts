import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Feedback API',
      version: '1.0.0',
      description: 'A comprehensive API for managing user feedback',
      contact: {
        name: 'API Support',
        email: 'support@example.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      schemas: {
        Feedback: {
          type: 'object',
          required: ['name', 'email', 'feedback', 'rating'],
          properties: {
            _id: {
              type: 'string',
              description: 'Unique identifier for the feedback',
              example: '507f1f77bcf86cd799439011',
            },
            name: {
              type: 'string',
              minLength: 2,
              maxLength: 50,
              description: 'Name of the person providing feedback',
              example: 'John Doe',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email address of the person providing feedback',
              example: 'john.doe@example.com',
            },
            feedback: {
              type: 'string',
              minLength: 10,
              description: 'The actual feedback text',
              example: 'Great service! Very satisfied with the experience.',
            },
            rating: {
              type: 'integer',
              minimum: 1,
              maximum: 5,
              description: 'Rating from 1 to 5',
              example: 5,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp when the feedback was created',
              example: '2023-12-01T10:30:00.000Z',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp when the feedback was last updated',
              example: '2023-12-01T10:30:00.000Z',
            },
          },
        },
        CreateFeedback: {
          type: 'object',
          required: ['name', 'email', 'feedback', 'rating'],
          properties: {
            name: {
              type: 'string',
              minLength: 2,
              maxLength: 50,
              description: 'Name of the person providing feedback',
              example: 'John Doe',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email address of the person providing feedback',
              example: 'john.doe@example.com',
            },
            feedback: {
              type: 'string',
              minLength: 10,
              description: 'The actual feedback text',
              example: 'Great service! Very satisfied with the experience.',
            },
            rating: {
              type: 'integer',
              minimum: 1,
              maximum: 5,
              description: 'Rating from 1 to 5',
              example: 5,
            },
          },
        },
        UpdateFeedback: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              minLength: 2,
              maxLength: 50,
              description: 'Name of the person providing feedback',
              example: 'John Doe',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email address of the person providing feedback',
              example: 'john.doe@example.com',
            },
            feedback: {
              type: 'string',
              minLength: 10,
              description: 'The actual feedback text',
              example: 'Updated feedback text.',
            },
            rating: {
              type: 'integer',
              minimum: 1,
              maximum: 5,
              description: 'Rating from 1 to 5',
              example: 4,
            },
          },
        },
        FeedbackResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            message: {
              type: 'string',
              example: 'Feedback created successfully',
            },
            data: {
              $ref: '#/components/schemas/Feedback',
            },
          },
        },
        FeedbackListResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            data: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Feedback',
              },
            },
            pagination: {
              type: 'object',
              properties: {
                currentPage: {
                  type: 'integer',
                  example: 1,
                },
                totalPages: {
                  type: 'integer',
                  example: 5,
                },
                totalFeedback: {
                  type: 'integer',
                  example: 50,
                },
                limit: {
                  type: 'integer',
                  example: 10,
                },
              },
            },
          },
        },
        FeedbackStats: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            data: {
              type: 'object',
              properties: {
                totalFeedback: {
                  type: 'integer',
                  description: 'Total number of feedback entries',
                  example: 150,
                },
                averageRating: {
                  type: 'number',
                  format: 'float',
                  description: 'Average rating across all feedback',
                  example: 4.2,
                },
                ratingDistribution: {
                  type: 'array',
                  description: 'Distribution of ratings',
                  items: {
                    type: 'object',
                    properties: {
                      _id: {
                        type: 'integer',
                        description: 'Rating value',
                        example: 5,
                      },
                      count: {
                        type: 'integer',
                        description: 'Number of feedbacks with this rating',
                        example: 45,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            message: {
              type: 'string',
              example: 'Error message',
            },
            error: {
              type: 'string',
              example: 'Detailed error information',
            },
          },
        },
        ValidationErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            message: {
              type: 'string',
              example: 'Validation error',
            },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  code: {
                    type: 'string',
                    example: 'too_small',
                  },
                  minimum: {
                    type: 'integer',
                    example: 2,
                  },
                  type: {
                    type: 'string',
                    example: 'string',
                  },
                  inclusive: {
                    type: 'boolean',
                    example: true,
                  },
                  exact: {
                    type: 'boolean',
                    example: false,
                  },
                  message: {
                    type: 'string',
                    example: 'Name must be at least 2 characters long',
                  },
                  path: {
                    type: 'array',
                    items: {
                      type: 'string',
                    },
                    example: ['name'],
                  },
                },
              },
            },
          },
        },
      },
      parameters: {
        IdParam: {
          name: 'id',
          in: 'path',
          required: true,
          description: 'Feedback ID',
          schema: {
            type: 'string',
            example: '507f1f77bcf86cd799439011',
          },
        },
        EmailParam: {
          name: 'email',
          in: 'path',
          required: true,
          description: 'Email address',
          schema: {
            type: 'string',
            format: 'email',
            example: 'john.doe@example.com',
          },
        },
        PageParam: {
          name: 'page',
          in: 'query',
          required: false,
          description: 'Page number for pagination',
          schema: {
            type: 'integer',
            minimum: 1,
            default: 1,
            example: 1,
          },
        },
        LimitParam: {
          name: 'limit',
          in: 'query',
          required: false,
          description: 'Number of items per page',
          schema: {
            type: 'integer',
            minimum: 1,
            maximum: 100,
            default: 10,
            example: 10,
          },
        },
        RatingParam: {
          name: 'rating',
          in: 'query',
          required: false,
          description: 'Filter by rating (1-5)',
          schema: {
            type: 'integer',
            minimum: 1,
            maximum: 5,
            example: 5,
          },
        },
      },
    },
    tags: [
      {
        name: 'Feedback',
        description: 'Feedback management endpoints',
      },
    ],
  },
  apis: ['./src/routes/*.ts'], // Path to the API files
};

const specs = swaggerJSDoc(options);

export const setupSwagger = (app: Express): void => {
  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(specs, {
      explorer: true,
      customCss: '.swagger-ui .topbar { display: none }',
      customSiteTitle: 'Feedback API Documentation',
    }),
  );
};

export default specs;

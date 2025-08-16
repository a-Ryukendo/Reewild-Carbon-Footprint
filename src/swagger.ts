import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Carbon Footprint API',
      version: '1.0.0',
      description: 'API for calculating and tracking carbon footprint of food items',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        basicAuth: {
          type: 'http',
          scheme: 'basic',
        },
      },
    },
    security: [
      {
        basicAuth: [],
      },
    ],
  },
  apis: ['./src/**/*.ts'],
};

const specs = swaggerJsdoc(options);

export const setupSwagger = (app: Express) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
  
  // Add route for raw JSON spec
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(specs);
  });

  console.log('📚 API Documentation available at /api-docs');
};

export default setupSwagger;

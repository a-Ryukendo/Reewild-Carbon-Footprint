import express, { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import cors from 'cors';
import basicAuth from 'express-basic-auth';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { setupSwagger } from './swagger';
import { validateDishInput, validateFileUpload } from './middleware/validation';
import { errorHandler, notFoundHandler, asyncHandler } from './middleware/errorHandler';
import 'dotenv/config';

const app = express();
const port = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use(limiter);

// Set security headers
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Basic Authentication
const authMiddleware = basicAuth({
  users: { [process.env.BASIC_AUTH_USER || 'admin']: process.env.BASIC_AUTH_PASSWORD || 'password' },
  challenge: true,
  realm: 'Carbon Footprint API',
});

// Middleware
app.use(cors());
app.use(express.json());

// Setup Swagger
setupSwagger(app);

// Basic health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API versioning
app.get('/api/version', (req: Request, res: Response) => {
  res.json({ 
    version: '1.0.0',
    status: 'active',
    timestamp: new Date().toISOString()
  });
});

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 1
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

interface Ingredient {
  name: string;
  carbon_kg: number;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     CarbonEstimate:
 *       type: object
 *       properties:
 *         dish:
 *           type: string
 *           description: Name of the dish
 *         estimated_carbon_kg:
 *           type: number
 *           format: float
 *           description: Estimated carbon footprint in kg CO2e
 *         ingredients:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               carbon_kg:
 *                 type: number
 *                 format: float
 */
interface CarbonEstimate {
  dish: string;
  estimated_carbon_kg: number;
  ingredients: Ingredient[];
}

// Mock function to simulate LLM inference for ingredients and carbon footprint
function estimateCarbonFromDish(dish: string): CarbonEstimate {
  // Mocked data for demonstration
  const ingredients: Ingredient[] = [];
  let totalCarbon = 0;

  // Example mock logic based on dish name
  if (dish.toLowerCase().includes('chicken biryani')) {
    ingredients.push({ name: 'Rice', carbon_kg: 1.1 });
    ingredients.push({ name: 'Chicken', carbon_kg: 2.5 });
    ingredients.push({ name: 'Spices', carbon_kg: 0.2 });
    ingredients.push({ name: 'Oil', carbon_kg: 0.4 });
  } else if (dish.toLowerCase().includes('salad')) {
    ingredients.push({ name: 'Lettuce', carbon_kg: 0.1 });
    ingredients.push({ name: 'Tomato', carbon_kg: 0.2 });
    ingredients.push({ name: 'Cucumber', carbon_kg: 0.1 });
  } else {
    // Default mock
    ingredients.push({ name: 'Ingredient1', carbon_kg: 0.5 });
    ingredients.push({ name: 'Ingredient2', carbon_kg: 0.3 });
  }

  totalCarbon = ingredients.reduce((sum, ing) => sum + ing.carbon_kg, 0);

  return {
    dish,
    estimated_carbon_kg: parseFloat(totalCarbon.toFixed(2)),
    ingredients,
  };
}

// Mock function to simulate vision model for image recognition
function estimateCarbonFromImage(imageBuffer: Buffer): CarbonEstimate {
  // For demo, we just return a fixed response as if the image was recognized as Chicken Biryani
  return estimateCarbonFromDish('Chicken Biryani');
}

/**
 * @swagger
 * /estimate:
 *   post:
 *     summary: Estimate carbon footprint for a dish
 *     tags: [Carbon]
 *     security:
 *       - basicAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - dish
 *             properties:
 *               dish:
 *                 type: string
 *                 description: Name of the dish to estimate carbon footprint for
 *     responses:
 *       200:
 *         description: Successful estimation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CarbonEstimate'
 *       400:
 *         description: Invalid input
 */
app.post('/estimate', 
  authMiddleware, 
  validateDishInput,
  asyncHandler(async (req: Request, res: Response) => {
    const { dish } = req.body;
    const estimate = estimateCarbonFromDish(dish);
    
    if (!estimate.ingredients || estimate.ingredients.length === 0) {
      return res.status(404).json({
        error: 'EstimationError',
        message: 'Could not estimate carbon footprint for the given dish',
        dish
      });
    }
    
    res.json(estimate);
  })
);

/**
 * @swagger
 * /upload:
 *   post:
 *     summary: Upload an image for carbon footprint estimation
 *     tags: [Carbon]
 *     security:
 *       - basicAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Successful estimation from image
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CarbonEstimate'
 *       400:
 *         description: No image provided or invalid image
 */
app.post('/upload', 
  authMiddleware, 
  upload.single('image'),
  validateFileUpload,
  asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) {
      throw new Error('No file uploaded');
    }

    const estimate = estimateCarbonFromImage(req.file.buffer);
    
    if (!estimate.ingredients || estimate.ingredients.length === 0) {
      return res.status(404).json({
        error: 'EstimationError',
        message: 'Could not estimate carbon footprint from the provided image',
        suggestion: 'Please try with a clearer image of the food item'
      });
    }
    
    res.json(estimate);
  })
);

// Handle 404 - Must be after all other routes
app.use(notFoundHandler);

// Global error handler - Must be after all other middleware
app.use(errorHandler);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err.name, err);
  // Close server & exit process
  server.close(() => {
    process.exit(1);
  });
});

// Start the server
let server: any;
if (process.env.NODE_ENV !== 'test') {
  server = app.listen(port, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${port}`);
    console.log(`API Documentation available at http://localhost:${port}/api-docs`);
  });
}

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Process terminated');
  });
});

export default app;

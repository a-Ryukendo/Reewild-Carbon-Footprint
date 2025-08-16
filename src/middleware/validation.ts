import { Request, Response, NextFunction } from 'express';

// Validate dish name input
export const validateDishInput = (req: Request, res: Response, next: NextFunction) => {
  const { dish } = req.body;
  
  if (dish === undefined) {
    return res.status(400).json({ 
      error: 'ValidationError',
      message: 'Dish name is required',
      field: 'dish'
    });
  }

  if (typeof dish !== 'string') {
    return res.status(400).json({ 
      error: 'ValidationError',
      message: 'Dish name must be a string',
      field: 'dish',
      received: typeof dish
    });
  }

  const trimmedDish = dish.trim();
  if (trimmedDish.length === 0) {
    return res.status(400).json({ 
      error: 'ValidationError',
      message: 'Dish name cannot be empty or whitespace',
      field: 'dish'
    });
  }

  if (trimmedDish.length > 100) {
    return res.status(400).json({ 
      error: 'ValidationError',
      message: 'Dish name must be 100 characters or less',
      field: 'dish',
      maxLength: 100,
      length: trimmedDish.length
    });
  }

  // Sanitize input to prevent XSS
  req.body.dish = trimmedDish.replace(/<[^>]*>?/gm, '');
  
  next();
};

// Validate file upload
export const validateFileUpload = (req: Request, res: Response, next: NextFunction) => {
  if (!req.file) {
    return res.status(400).json({ 
      error: 'ValidationError',
      message: 'Image file is required',
      field: 'image'
    });
  }

  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!allowedTypes.includes(req.file.mimetype)) {
    return res.status(400).json({
      error: 'ValidationError',
      message: 'Invalid file type. Only JPEG, JPG, and PNG are allowed',
      field: 'image',
      allowedTypes
    });
  }

  if (req.file.size > maxSize) {
    return res.status(400).json({
      error: 'ValidationError',
      message: 'File size too large. Maximum size is 5MB',
      field: 'image',
      maxSize: '5MB',
      actualSize: `${(req.file.size / (1024 * 1024)).toFixed(2)}MB`
    });
  }

  next();
};

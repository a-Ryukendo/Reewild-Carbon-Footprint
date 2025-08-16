# Carbon Footprint 🌱

A web application for calculating and tracking the carbon footprint of food items through a RESTful API.

## Features

- Calculate carbon footprint from dish names
- Image recognition for food items (coming soon)
- Track environmental impact over time
- RESTful API for integration
- Swagger/OpenAPI documentation
- Docker support for easy deployment
- Basic authentication for API security

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm 9+
- Docker (optional)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/carbon-footprint.git
   cd carbon-footprint
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env file with your configuration
   ```

## 🏃‍♂️ Running the Project

### Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   The API will be available at `http://localhost:3000`

### Using Docker

1. Build and start the containers:
   ```bash
   docker-compose up --build
   ```
   - API: `http://localhost:3000`
   - API Docs: `http://localhost:3000/api-docs`

2. For production:
   ```bash
   docker-compose -f docker-compose.prod.yml up --build -d
   ```

## 📝 Example Requests and Responses

### 1. Calculate Carbon Footprint

**Request:**
```http
POST /api/footprint
Content-Type: application/json
Authorization: Basic YWRtaW46cGFzc3dvcmQ=

{
  "dishName": "beef burger"
}
```

**Response:**
```json
{
  "dish": "beef burger",
  "carbonFootprint": 8.5,
  "unit": "kg CO2e",
  "ingredients": [
    {
      "name": "beef",
      "amount": 150,
      "unit": "g",
      "carbonFootprint": 8.1
    },
    {
      "name": "bun",
      "amount": 50,
      "unit": "g",
      "carbonFootprint": 0.4
    }
  ]
}
```

### 2. Get Dish Suggestions

**Request:**
```http
GET /api/suggestions?query=chick
Authorization: Basic YWRtaW46cGFzc3dvcmQ=
```

**Response:**
```json
{
  "suggestions": [
    "chicken curry",
    "chickpea salad",
    "chicken tikka masala"
  ]
}
```

## 🧠 Design Decisions

### Architecture
- **RESTful API Design**: Chosen for its simplicity, scalability, and ease of integration
- **TypeScript**: For type safety and better developer experience
- **Modular Structure**: Separated routes, controllers, and services for better maintainability

### Data Processing
- **Ingredient-based Calculation**: Breaks down dishes into ingredients for more accurate carbon footprint calculation
- **Caching**: Implements caching for frequently accessed data to improve performance
- **Validation**: Input validation at both API and service layers

### Security
- **Basic Authentication**: Simple yet effective for API access control
- **Environment-based Configuration**: Sensitive configuration stored in environment variables
- **Rate Limiting**: Implemented to prevent abuse (coming soon)

## 📦 Assumptions and Limitations

### Assumptions
1. Standard portion sizes are used for calculations
2. Ingredient carbon footprints are based on average values
3. All measurements are in metric units (grams, kilograms)
4. The API is primarily designed for single-dish calculations

### Limitations
1. Accuracy depends on the completeness of the ingredient database
2. Doesn't account for food preparation methods
3. Limited to food items with known carbon footprint data
4. No user accounts or persistent storage in the current version

## 🏭 Production Considerations

### Scalability
- **Horizontal Scaling**: Stateless design allows easy scaling
- **Caching Layer**: Redis could be added for better performance
- **Load Balancing**: Can be placed behind a load balancer

### Monitoring and Logging
- **Centralized Logging**: Implement ELK stack or similar
- **Metrics Collection**: Prometheus + Grafana for monitoring
- **Error Tracking**: Services like Sentry or Rollbar

### Security Enhancements
- **JWT Authentication**: Replace basic auth for production
- **HTTPS**: Enforce secure connections
- **Input Sanitization**: Additional layers of input validation
- **API Gateway**: For rate limiting and request validation

### Database
- **Persistence Layer**: Add MongoDB/PostgreSQL for user data and history
- **Migrations**: Database migration system for schema changes
- **Backup Strategy**: Regular automated backups

### CI/CD
- **Automated Testing**: GitHub Actions or similar
- **Container Registry**: Store Docker images in a private registry
- **Blue-Green Deployment**: For zero-downtime updates

## 🌐 API Documentation

Interactive API documentation is available at `/api-docs` when the server is running. The documentation includes:
- Available endpoints
- Request/response schemas
- Example requests
- Authentication requirements

## 🔒 Authentication

Basic authentication is required for all API endpoints. Configure credentials in the `.env` file.

Example `.env` configuration:
```
AUTH_USER=admin
AUTH_PASSWORD=securepassword
```

## 🧪 Testing

Run tests using:
```bash
npm test
```

## 🛠 Technologies Used

- Node.js
- TypeScript
- Express
- CORS
- Docker
- Swagger/OpenAPI
- Jest (for testing)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ☁️ Deployment

For detailed deployment instructions to various cloud providers, see the [DEPLOYMENT.md](DEPLOYMENT.md) file.

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting pull requests.

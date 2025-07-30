# SmartFit Project Setup Guide

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or higher)
- **Python** (v3.9 or higher)
- **Docker** and **Docker Compose**
- **PostgreSQL** (if running locally)
- **Redis** (if running locally)

### Option 1: Docker Setup (Recommended)

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd SmartFit
   ```

2. **Set up environment variables**
   ```bash
   # Backend
   cp backend/env.example backend/.env
   # Edit backend/.env with your configuration
   
   # Frontend
   cp frontend/.env.example frontend/.env
   # Edit frontend/.env with your configuration
   ```

3. **Start all services**
   ```bash
   docker-compose up -d
   ```

4. **Initialize database**
   ```bash
   docker-compose exec backend npm run db:migrate
   docker-compose exec backend npm run db:generate
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - ML Service: http://localhost:8000
   - API Documentation: http://localhost:3001/api

### Option 2: Local Development Setup

#### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

4. **Set up database**
   ```bash
   # Install PostgreSQL and create database
   createdb smartfit_db
   
   # Run Prisma migrations
   npm run db:migrate
   npm run db:generate
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

#### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start development server**
   ```bash
   npm start
   ```

#### ML Service Setup

1. **Navigate to ml-service directory**
   ```bash
   cd ml-service
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Start ML service**
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

## 🛠️ Development Workflow

### Code Quality

1. **Linting and Formatting**
   ```bash
   # Backend
   cd backend
   npm run lint
   npm run format
   
   # Frontend
   cd frontend
   npm run lint
   npm run format
   
   # ML Service
   cd ml-service
   black app/
   flake8 app/
   ```

2. **Type Checking**
   ```bash
   # Backend
   cd backend
   npx tsc --noEmit
   
   # Frontend
   cd frontend
   npm run type-check
   ```

### Testing

1. **Backend Tests**
   ```bash
   cd backend
   npm test
   npm run test:coverage
   ```

2. **Frontend Tests**
   ```bash
   cd frontend
   npm test
   ```

3. **ML Service Tests**
   ```bash
   cd ml-service
   pytest
   ```

### Database Management

1. **View database with Prisma Studio**
   ```bash
   cd backend
   npm run db:studio
   ```

2. **Reset database**
   ```bash
   cd backend
   npm run db:migrate:reset
   ```

## 🚀 Production Deployment

### AWS Deployment

1. **Set up AWS infrastructure**
   - Create EC2 instances or use ECS/Fargate
   - Set up RDS for PostgreSQL
   - Set up ElastiCache for Redis
   - Set up S3 for image storage
   - Set up CloudFront for CDN

2. **Environment variables for production**
   ```bash
   NODE_ENV=production
   DATABASE_URL=postgresql://user:pass@rds-endpoint:5432/smartfit_db
   REDIS_URL=redis://elasticache-endpoint:6379
   AWS_S3_BUCKET=your-production-bucket
   ```

3. **Build and deploy**
   ```bash
   # Build production images
   docker-compose -f docker-compose.prod.yml build
   
   # Deploy to production
   docker-compose -f docker-compose.prod.yml up -d
   ```

### CI/CD Pipeline

1. **GitHub Actions workflow**
   - Automatic testing on pull requests
   - Build and deploy on merge to main
   - Security scanning
   - Performance testing

2. **Environment-specific deployments**
   - Development: Automatic deployment
   - Staging: Manual approval required
   - Production: Manual approval required

## 📊 Monitoring and Logging

### Application Monitoring

1. **Health checks**
   - Backend: http://localhost:3001/health
   - ML Service: http://localhost:8000/health
   - Frontend: Built-in React health check

2. **Performance metrics**
   - Response times
   - Error rates
   - Database query performance
   - ML model inference times

### Logging

1. **Structured logging**
   - JSON format for easy parsing
   - Log levels (debug, info, warn, error)
   - Request correlation IDs

2. **Log aggregation**
   - Centralized logging with ELK stack
   - Real-time log monitoring
   - Alerting on errors

## 🔒 Security

### Authentication & Authorization

1. **JWT tokens**
   - Access tokens (short-lived)
   - Refresh tokens (long-lived)
   - Secure token storage

2. **Role-based access control**
   - Customer: Basic features
   - MSME Owner: Product management
   - Admin: Full access

### Data Protection

1. **Input validation**
   - Request validation with Joi
   - SQL injection prevention
   - XSS protection

2. **File upload security**
   - File type validation
   - Size limits
   - Virus scanning

## 🧪 Testing Strategy

### Unit Tests

1. **Backend**
   - API endpoint testing
   - Service layer testing
   - Database operations testing

2. **Frontend**
   - Component testing
   - Hook testing
   - Utility function testing

3. **ML Service**
   - Model testing
   - Service testing
   - API endpoint testing

### Integration Tests

1. **API integration**
   - End-to-end API testing
   - Database integration
   - External service integration

2. **Frontend integration**
   - User flow testing
   - API integration testing
   - Browser compatibility testing

### Performance Tests

1. **Load testing**
   - API performance under load
   - Database performance
   - ML model inference performance

2. **Stress testing**
   - System limits testing
   - Recovery testing

## 📈 Performance Optimization

### Frontend Optimization

1. **Code splitting**
   - Route-based splitting
   - Component lazy loading
   - Bundle size optimization

2. **Caching**
   - Browser caching
   - Service worker caching
   - API response caching

### Backend Optimization

1. **Database optimization**
   - Query optimization
   - Indexing strategy
   - Connection pooling

2. **Caching strategy**
   - Redis caching
   - In-memory caching
   - CDN caching

### ML Service Optimization

1. **Model optimization**
   - Model quantization
   - Batch processing
   - GPU acceleration

2. **Inference optimization**
   - Model caching
   - Preprocessing optimization
   - Async processing

## 🐛 Troubleshooting

### Common Issues

1. **Database connection issues**
   ```bash
   # Check database status
   docker-compose ps postgres
   
   # Check logs
   docker-compose logs postgres
   ```

2. **Redis connection issues**
   ```bash
   # Check Redis status
   docker-compose ps redis
   
   # Check logs
   docker-compose logs redis
   ```

3. **ML service issues**
   ```bash
   # Check ML service status
   docker-compose ps ml-service
   
   # Check logs
   docker-compose logs ml-service
   ```

### Debug Mode

1. **Enable debug logging**
   ```bash
   # Backend
   DEBUG=* npm run dev
   
   # ML Service
   LOG_LEVEL=debug uvicorn app.main:app --reload
   ```

2. **Database debugging**
   ```bash
   # Connect to database
   docker-compose exec postgres psql -U smartfit_user -d smartfit_db
   ```

## 📚 Additional Resources

- [Project Documentation](./README.md)
- [API Documentation](http://localhost:3001/api)
- [ML Service Documentation](http://localhost:8000/docs)
- [Contributing Guidelines](./CONTRIBUTING.md)
- [Architecture Documentation](./docs/ARCHITECTURE.md)

## 🤝 Support

For support and questions:
- Create an issue on GitHub
- Contact the development team
- Check the troubleshooting section above 
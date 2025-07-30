# SmartFit: AI-Powered Virtual Try-On System

## 🎯 Project Overview

SmartFit is an AI-powered virtual try-on system designed for MSME clothing brands. It enables users to visualize how garments will look and fit on their own body using just a smartphone camera, leveraging AI-based body scanning, pose estimation, and augmented reality.

## 🏗️ System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React App     │    │   Express API   │    │   ML Service    │
│   (Frontend)    │◄──►│   (Backend)     │◄──►│   (Python)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
    ┌─────────┐            ┌─────────┐            ┌─────────┐
    │   S3    │            │PostgreSQL│            │  Redis  │
    │(Images) │            │(Database)│            │(Cache)  │
    └─────────┘            └─────────┘            └─────────┘
```

## 🛠️ Technology Stack

### Frontend
- **React.js** with TypeScript
- **TensorFlow.js** for client-side pose estimation
- **Three.js** for 3D visualization
- **Material-UI** for UI components
- **Redux Toolkit** for state management

### Backend
- **Node.js** with Express.js
- **TypeScript** for type safety
- **JWT** for authentication
- **Multer** for file uploads
- **Jest** for testing

### Database
- **PostgreSQL** for relational data
- **Redis** for caching and sessions
- **Prisma** as ORM

### AI/ML
- **Python** with FastAPI
- **MediaPipe** for pose estimation
- **OpenCV** for image processing
- **TensorFlow** for custom models

### Infrastructure
- **Docker** for containerization
- **AWS S3** for image storage
- **AWS CloudFront** for CDN
- **GitHub Actions** for CI/CD

## 🚀 Features

### Core Features
- [ ] Real-time body pose estimation using smartphone camera
- [ ] Virtual garment overlay with AR visualization
- [ ] Size recommendation based on body measurements
- [ ] Product catalog management for MSMEs
- [ ] User authentication and profiles
- [ ] Shopping cart and checkout integration

### Advanced Features
- [ ] AI-powered size prediction
- [ ] Virtual fitting room with multiple angles
- [ ] Social sharing of virtual try-ons
- [ ] Analytics dashboard for MSMEs
- [ ] Mobile-responsive design
- [ ] Offline capability with PWA

## 📁 Project Structure

```
Smart-outfit/
├── frontend/                 # React.js application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── store/           # Redux store
│   │   ├── utils/           # Utility functions
│   │   └── types/           # TypeScript types
│   ├── public/              # Static assets
│   └── package.json
├── backend/                  # Express.js API
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── middleware/      # Custom middleware
│   │   ├── models/          # Database models
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   └── utils/           # Utility functions
│   ├── tests/               # Unit and integration tests
│   └── package.json
├── ml-service/              # Python ML service
│   ├── app/
│   │   ├── models/          # ML models
│   │   ├── services/        # ML services
│   │   └── utils/           # ML utilities
│   ├── tests/               # ML tests
│   └── requirements.txt
├── docker-compose.yml       # Docker configuration
├── .github/                 # GitHub Actions workflows
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Python (v3.9+)
- Docker
- PostgreSQL
- Redis

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/babneek/Smart-outfit.git
   cd Smart-outfit
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start with Docker**
   ```bash
   docker-compose up -d
   ```

4. **Or start services individually**
   ```bash
   # Backend
   cd backend && npm install && npm run dev
   
   # Frontend
   cd frontend && npm install && npm start
   
   # ML Service
   cd ml-service && pip install -r requirements.txt && uvicorn app.main:app --reload
   ```

## 🧪 Testing

```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test

# ML service tests
cd ml-service && pytest
```

## 📊 API Documentation

- **Backend API**: http://localhost:3001/api/docs
- **ML Service API**: http://localhost:8000/docs

## 🔧 Development

### Code Quality
- **ESLint** and **Prettier** for JavaScript/TypeScript
- **Black** and **Flake8** for Python
- **Husky** for pre-commit hooks

### Git Workflow
- Feature branches from `develop`
- Pull requests with code review
- Automated testing and deployment

## 📈 Performance Metrics

- **Frontend**: Lighthouse score > 90
- **Backend**: Response time < 200ms
- **ML Service**: Inference time < 500ms
- **Database**: Query optimization with indexes

## 🔒 Security

- JWT authentication
- Input validation and sanitization
- Rate limiting
- CORS configuration
- Environment variable management

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📞 Contact

- **Email**: your.email@example.com
- **LinkedIn**: [Your LinkedIn](https://linkedin.com/in/yourprofile)
- **GitHub**: [Your GitHub](https://github.com/babneek) 
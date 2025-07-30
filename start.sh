#!/bin/bash

# SmartFit Quick Start Script
# This script will set up and start the SmartFit application

set -e

echo "🚀 SmartFit Quick Start Script"
echo "================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is installed
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    print_success "Docker and Docker Compose are installed"
}

# Check if required files exist
check_files() {
    if [ ! -f "docker-compose.yml" ]; then
        print_error "docker-compose.yml not found. Please run this script from the project root."
        exit 1
    fi
    
    if [ ! -f "backend/env.example" ]; then
        print_error "backend/env.example not found."
        exit 1
    fi
    
    print_success "Required files found"
}

# Set up environment variables
setup_env() {
    print_status "Setting up environment variables..."
    
    # Backend environment
    if [ ! -f "backend/.env" ]; then
        cp backend/env.example backend/.env
        print_success "Created backend/.env from template"
    else
        print_warning "backend/.env already exists, skipping..."
    fi
    
    # Frontend environment
    if [ ! -f "frontend/.env" ]; then
        cat > frontend/.env << EOF
REACT_APP_API_URL=http://localhost:3001
REACT_APP_ML_SERVICE_URL=http://localhost:8000
GENERATE_SOURCEMAP=false
EOF
        print_success "Created frontend/.env"
    else
        print_warning "frontend/.env already exists, skipping..."
    fi
}

# Start services
start_services() {
    print_status "Starting SmartFit services..."
    
    # Stop any existing containers
    docker-compose down 2>/dev/null || true
    
    # Build and start services
    docker-compose up -d --build
    
    print_success "Services started successfully"
}

# Wait for services to be ready
wait_for_services() {
    print_status "Waiting for services to be ready..."
    
    # Wait for PostgreSQL
    print_status "Waiting for PostgreSQL..."
    until docker-compose exec -T postgres pg_isready -U smartfit_user -d smartfit_db > /dev/null 2>&1; do
        sleep 2
    done
    print_success "PostgreSQL is ready"
    
    # Wait for Redis
    print_status "Waiting for Redis..."
    until docker-compose exec -T redis redis-cli ping > /dev/null 2>&1; do
        sleep 2
    done
    print_success "Redis is ready"
    
    # Wait for Backend
    print_status "Waiting for Backend API..."
    until curl -f http://localhost:3001/health > /dev/null 2>&1; do
        sleep 5
    done
    print_success "Backend API is ready"
    
    # Wait for ML Service
    print_status "Waiting for ML Service..."
    until curl -f http://localhost:8000/health > /dev/null 2>&1; do
        sleep 5
    done
    print_success "ML Service is ready"
    
    # Wait for Frontend
    print_status "Waiting for Frontend..."
    until curl -f http://localhost:3000 > /dev/null 2>&1; do
        sleep 5
    done
    print_success "Frontend is ready"
}

# Initialize database
init_database() {
    print_status "Initializing database..."
    
    # Run database migrations
    docker-compose exec -T backend npm run db:generate
    docker-compose exec -T backend npm run db:migrate
    
    print_success "Database initialized"
}

# Show status
show_status() {
    echo ""
    echo "🎉 SmartFit is now running!"
    echo "================================"
    echo ""
    echo "📱 Frontend:     http://localhost:3000"
    echo "🔧 Backend API:  http://localhost:3001"
    echo "🤖 ML Service:   http://localhost:8000"
    echo "📚 API Docs:     http://localhost:3001/api"
    echo "🔬 ML Docs:      http://localhost:8000/docs"
    echo ""
    echo "📊 Service Status:"
    docker-compose ps
    echo ""
    echo "📝 Useful Commands:"
    echo "  View logs:     docker-compose logs -f [service]"
    echo "  Stop services: docker-compose down"
    echo "  Restart:       docker-compose restart"
    echo "  Database:      docker-compose exec backend npm run db:studio"
    echo ""
    echo "🔍 Troubleshooting:"
    echo "  If services fail to start, check the logs:"
    echo "  docker-compose logs [service-name]"
    echo ""
}

# Main execution
main() {
    echo "Starting SmartFit setup..."
    echo ""
    
    check_docker
    check_files
    setup_env
    start_services
    wait_for_services
    init_database
    show_status
}

# Handle script interruption
trap 'print_error "Setup interrupted. Run 'docker-compose down' to clean up."; exit 1' INT

# Run main function
main 
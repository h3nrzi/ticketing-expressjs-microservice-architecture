# Ticketing Platform

[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/h3nrzi/ticketing)

A scalable microservices-based ticketing platform built with Node.js, TypeScript, React, and Kubernetes. This platform enables users to create, buy, and manage event tickets with real-time order processing and payment integration.

## 🏗️ Architecture

This application follows a microservices architecture with the following services:

- **Auth Service** - User authentication and authorization
- **Tickets Service** - Ticket creation and management
- **Orders Service** - Order processing and management
- **Payments Service** - Payment processing with Stripe integration
- **Expiration Service** - Order expiration handling with Redis/Bull
- **Client** - Next.js frontend application
- **Common Library** - Shared utilities and types across services

## 🚀 Tech Stack

### Backend Services
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Message Broker**: NATS Streaming Server
- **Queue System**: Redis with Bull (for expiration service)
- **Authentication**: JWT with cookie sessions
- **Validation**: Express Validator
- **Testing**: Jest with Supertest
- **API Documentation**: Swagger/OpenAPI

### Frontend
- **Framework**: Next.js 14 with React 18
- **Styling**: Bootstrap 4 with RTL support
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast
- **Payments**: React Stripe Checkout

### Infrastructure
- **Containerization**: Docker
- **Orchestration**: Kubernetes
- **Development**: Skaffold
- **CI/CD**: GitHub Actions
- **Ingress**: NGINX Ingress Controller

## 📁 Project Structure

```
ticketing/
├── auth/                 # Authentication service
├── tickets/              # Ticket management service
├── orders/               # Order processing service
├── payments/             # Payment processing service
├── expirations/          # Order expiration service
├── client/               # Next.js frontend application
├── common/               # Shared library (@h3nrzi-ticket/common)
├── infra/k8s/           # Kubernetes manifests
├── .github/workflows/    # CI/CD workflows
└── skaffold.yaml        # Skaffold configuration
```

## 🛠️ Prerequisites

- Node.js 18+
- Docker Desktop
- Kubernetes (Docker Desktop or Minikube)
- Skaffold
- NGINX Ingress Controller

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd ticketing
```

### 2. Install Dependencies
```bash
# Install dependencies for each service
cd auth && npm install && cd ..
cd tickets && npm install && cd ..
cd orders && npm install && cd ..
cd payments && npm install && cd ..
cd expirations && npm install && cd ..
cd client && npm install && cd ..
cd common && npm install && cd ..
```

### 3. Set up Kubernetes Ingress
```bash
# Enable ingress addon (for Minikube)
minikube addons enable ingress

# Or install NGINX Ingress Controller for Docker Desktop
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.1/deploy/static/provider/cloud/deploy.yaml
```

### 4. Configure Hosts File
Add the following to your `/etc/hosts` file:
```
127.0.0.1 ticketing.dev
```

### 5. Create Kubernetes Secrets
```bash
# JWT secret
kubectl create secret generic jwt-secret --from-literal=JWT_KEY=your-jwt-secret

# Stripe secret (for payments)
kubectl create secret generic stripe-secret --from-literal=STRIPE_KEY=your-stripe-secret-key
```

### 6. Start Development Environment
```bash
# Start all services with Skaffold
skaffold dev
```

## 🔧 Development

### Running Individual Services
```bash
# Auth service
cd auth && npm start

# Tickets service
cd tickets && npm start

# Orders service
cd orders && npm start

# Payments service
cd payments && npm start

# Expiration service
cd expirations && npm start

# Client application
cd client && npm run dev
```

### Running Tests
```bash
# Run tests for all services
cd auth && npm test
cd tickets && npm test
cd orders && npm test
cd payments && npm test

# Run CI tests
npm run test:ci
```

## 📚 API Documentation

Each service provides Swagger documentation:

- Auth Service: `http://ticketing.dev/api/users/docs`
- Tickets Service: `http://ticketing.dev/api/tickets/docs`
- Orders Service: `http://ticketing.dev/api/orders/docs`
- Payments Service: `http://ticketing.dev/api/payments/docs`

## 🔐 Environment Variables

### Required Environment Variables
```bash
# JWT Configuration
JWT_KEY=your-jwt-secret-key

# MongoDB Connection
MONGO_URI=mongodb://localhost:27017/auth

# NATS Configuration
NATS_CLIENT_ID=unique-client-id
NATS_URL=http://nats-srv:4222
NATS_CLUSTER_ID=ticketing

# Stripe Configuration (Payments Service)
STRIPE_KEY=your-stripe-secret-key

# Redis Configuration (Expiration Service)
REDIS_HOST=expirations-redis-srv
```

## 🏃‍♂️ Usage

1. **Access the Application**: Navigate to `http://ticketing.dev`
2. **Sign Up/Sign In**: Create an account or sign in
3. **Create Tickets**: Navigate to "My Tickets" → "New Ticket"
4. **Browse Tickets**: View available tickets on the homepage
5. **Purchase Tickets**: Click on a ticket to view details and purchase
6. **Manage Orders**: View your orders and payment status

## 🧪 Testing

The project includes comprehensive test suites:

- **Unit Tests**: Individual component and service testing
- **Integration Tests**: API endpoint testing
- **Event Testing**: NATS event handling testing

### Test Commands
```bash
# Watch mode (development)
npm test

# CI mode (single run)
npm run test:ci
```

## 🚀 Deployment

### Production Deployment
1. Build and push Docker images to your registry
2. Update Kubernetes manifests with production configurations
3. Apply manifests to your production cluster
4. Configure production secrets and environment variables

### CI/CD Pipeline
GitHub Actions workflows automatically run tests on pull requests:
- `tests-auth.yml` - Auth service tests
- `tests-orders.yml` - Orders service tests
- `tests-tickets.yml` - Tickets service tests

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the [ISC License](LICENSE).

## 👨‍💻 Author

**Hossein Rezaei** - [@h3nrzi](https://github.com/h3nrzi)

## 🙏 Acknowledgments

- Built with modern microservices patterns
- Implements event-driven architecture
- Follows clean architecture principles
- Comprehensive testing strategy
- Production-ready Kubernetes deployment
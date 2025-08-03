# University Information System (UIS)

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15.3.5-blue.svg)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-green.svg)](https://www.mongodb.com/)
[![Azure](https://img.shields.io/badge/Cloud-Azure-blue.svg)](https://azure.microsoft.com/)
[![Docker](https://img.shields.io/badge/Container-Docker-blue.svg)](https://www.docker.com/)

> A comprehensive Learning Management System connecting all universities across Sri Lanka through modern web technology.

## 📋 Project Overview

The University Information System (UIS) is a cloud-based Learning Management System designed to digitally transform higher education in Sri Lanka. It provides a unified platform for students, faculty, and administrators to manage courses, assignments, communication, and academic resources.

### 🎯 Key Features

- **User Management**: Secure registration, authentication, and role-based access control
- **Course Management**: Create, manage, and enroll in courses across universities
- **Assignment System**: Submit, review, and grade assignments with file upload support
- **Communication Tools**: Real-time messaging, announcements, and collaboration features
- **University Directory**: Comprehensive information about Sri Lankan universities
- **Responsive Design**: Mobile-first design with dark/light theme support
- **Real-time Updates**: Live notifications and status updates
- **Multi-language Support**: Built with internationalization in mind

## 🛠️ Technologies Used

### Frontend
- **Framework**: Next.js 15.3.5 with App Router
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS 3.4.17
- **UI Components**: Custom components with Lucide React icons
- **Animations**: Lottie React for interactive animations
- **State Management**: React Context API
- **HTTP Client**: Fetch API with custom retry logic

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js 4.18.2
- **Language**: TypeScript 5.3.3
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens) with refresh token strategy
- **Security**: Helmet, CORS, bcryptjs for password hashing
- **Validation**: Express Validator
- **Logging**: Winston logger with file rotation
- **Email**: Nodemailer with Gmail SMTP support

### DevOps & Infrastructure
- **Containerization**: Docker & Docker Compose
- **Cloud Platform**: Microsoft Azure
- **Container Registry**: Azure Container Registry
- **App Services**: Azure Web Apps for Containers
- **CI/CD**: Azure deployment scripts
- **Database Hosting**: MongoDB Atlas
- **Monitoring**: Built-in health checks and logging

### Development Tools
- **Package Manager**: npm
- **Code Quality**: ESLint, Prettier
- **Build Tools**: TypeScript compiler, Next.js build system
- **Development**: Nodemon for hot reloading
- **Testing**: Custom integration test scripts

## 🚀 Setup Instructions

### Prerequisites

Before setting up the project, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (version 18 or higher)
- [Docker Desktop](https://www.docker.com/products/docker-desktop)
- [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli) (for Azure deployment)
- [Git](https://git-scm.com/)

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/KasunCSB/University-Information-System.git
   cd University-Information-System
   ```

2. **Install dependencies**
   ```bash
   # Install frontend dependencies
   npm install
   
   # Install backend dependencies
   cd backend
   npm install
   cd ..
   ```

3. **Environment Configuration**
   
   Create `.env.local` in the root directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001/api
   ```
   
   Create `.env` in the `backend` directory:
   ```env
   NODE_ENV=development
   PORT=3001
   MONGODB_URI=your-mongodb-connection-string
   JWT_SECRET=your-jwt-secret-key
   JWT_REFRESH_SECRET=your-refresh-secret-key
   SESSION_SECRET=your-session-secret-key
   EMAIL_USER=your-gmail-email
   EMAIL_PASS=your-gmail-app-password
   EMAIL_FROM=University System <your-email@domain.com>
   FRONTEND_URL=http://localhost:3000
   CORS_ORIGIN=http://localhost:3000
   ```

4. **Quick Start (Recommended)**
   
   Use the provided development scripts:
   
   **Windows:**
   ```cmd
   start-dev.bat
   ```
   
   **PowerShell:**
   ```powershell
   .\start-dev.ps1
   ```
   
   **Linux/macOS:**
   ```bash
   ./start-dev.sh
   ```

5. **Manual Start**
   
   If you prefer to start services manually:
   ```bash
   # Terminal 1: Start backend
   cd backend
   npm run dev
   
   # Terminal 2: Start frontend
   cd ..
   npm run dev
   ```

6. **Docker Development (Alternative)**
   ```bash
   docker-compose up --build
   ```

### Accessing the Application

Once the development servers are running:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001/api
- **Backend Health Check**: http://localhost:3001/health

## 📊 API Usage

### API Endpoints

The backend provides a comprehensive REST API for all system functionality:

#### Authentication Endpoints
- `POST /api/auth/send-verification` - Send email verification
- `POST /api/auth/verify-token` - Verify email token
- `POST /api/auth/complete-registration` - Complete user registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh-token` - Refresh access token
- `POST /api/auth/logout` - User logout
- `POST /api/auth/request-password-reset` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `GET /api/auth/profile` - Get user profile (protected)

#### Health Check Endpoints
- `GET /health` - Basic health check
- `GET /health/detailed` - Detailed system health
- `GET /health/db` - Database connection health

### API Documentation (Swagger/OpenAPI)

The API documentation is available through Swagger UI when the backend is running in development mode:

**Local Development:**
- Swagger UI: http://localhost:3001/api-docs (when `ENABLE_API_DOCS=true`)

**Production:**
- Backend API Base URL: https://uis-backend-app.azurewebsites.net/api
- Health Check: https://uis-backend-app.azurewebsites.net/health

### API Response Format

All API responses follow a consistent format:

```json
{
  "success": boolean,
  "message": string,
  "data": object | array | null,
  "error": string | null
}
```

### Authentication

The API uses JWT-based authentication with refresh tokens:

1. **Registration Flow**: Send verification email → Verify token → Complete registration
2. **Login**: Receive access token (7 days) and refresh token (30 days)
3. **Protected Routes**: Include `Authorization: Bearer <token>` header
4. **Token Refresh**: Automatically handled by the frontend service

### Rate Limiting

API endpoints are protected with rate limiting:
- Account creation: 5 requests per 15 minutes
- Login attempts: 10 requests per 15 minutes
- Password reset: 3 requests per hour
- Email verification: 5 requests per hour

## 🌐 Deployment

### Azure Cloud Deployment

The application is deployed on Microsoft Azure using containerized web apps:

**Production URLs:**
- **Frontend Application**: https://lk-uis.azurewebsites.net
- **Backend API**: https://uis-backend-app.azurewebsites.net/api
- **Backend Health**: https://uis-backend-app.azurewebsites.net/health

### Deployment Scripts

Several deployment scripts are available:

1. **Quick Deployment**:
   ```bash
   # Windows
   full-deploy.bat
   
   # Linux/macOS  
   ./deploy.sh
   ```

2. **Azure Container Deployment**:
   ```bash
   deploy-azure-containers.bat
   ```

3. **Smart Fix** (for existing deployments):
   ```bash
   smart-fix-azure.bat
   ```

### Manual Deployment

For detailed manual deployment instructions, see:
- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Quick deployment guide
- [MANUAL_DEPLOYMENT_STEPS.md](./MANUAL_DEPLOYMENT_STEPS.md) - Comprehensive manual steps
- [DEPLOY_COMMANDS.md](./DEPLOY_COMMANDS.md) - Copy-paste deployment commands

### Environment Variables (Production)

The following environment variables must be configured in Azure App Settings:

**Backend App Settings:**
```env
NODE_ENV=production
PORT=80
WEBSITES_PORT=3001
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=your-production-jwt-secret
JWT_REFRESH_SECRET=your-production-refresh-secret
SESSION_SECRET=your-production-session-secret
EMAIL_USER=your-production-email
EMAIL_PASS=your-production-email-password
EMAIL_FROM=University System <your-email@domain.com>
FRONTEND_URL=https://lk-uis.azurewebsites.net
CORS_ORIGIN=https://lk-uis.azurewebsites.net
```

**Frontend App Settings:**
```env
NODE_ENV=production
PORT=80
WEBSITES_PORT=3000
NEXT_PUBLIC_API_URL=https://uis-backend-app.azurewebsites.net/api
```

## 👥 Team Member Contributions

### Development Team

This project is developed and maintained by the **UIS Development Team**:

- **Kasun Chanaka** ([@KasunCSB](https://github.com/KasunCSB))
- **Bodhana Jayawickrama** ([@bodhana23](https://github.com/bodhana23))
- **Sandali Alahakoon** ([@sna2299](https://github.com/sna2299))
- **Harishchandran** ([@HarishCN11](https://github.com/HarishCN11))
- **Paboda Kaushali** ([@kaushali24](https://github.com/kaushali24))
- **Thilanga Nimesh** ([@Thilanga24](https://github.com/Thilanga24))

#### **Core Contributions**

**Backend Development:**
- RESTful API design with Express.js and TypeScript
- JWT-based authentication system with refresh tokens
- MongoDB database schema design and optimization
- Email service integration with Nodemailer
- Comprehensive error handling and logging
- Rate limiting and security middleware
- Health check and monitoring endpoints

**Frontend Development:**
- Modern React application with Next.js App Router
- Responsive UI design with Tailwind CSS
- Dark/light theme implementation
- Real-time API integration with retry logic
- Form validation and user experience optimization
- Accessibility and performance optimization

**DevOps & Infrastructure:**
- Docker containerization for both frontend and backend
- Azure cloud deployment with Web Apps for Containers
- Automated deployment scripts and CI/CD pipeline
- MongoDB Atlas integration
- SSL/HTTPS configuration
- Performance monitoring and logging

**Documentation & Testing:**
- Comprehensive project documentation
- API documentation and usage examples
- Integration testing scripts
- Deployment guides for multiple environments
- Security best practices documentation

### Contributing

We welcome contributions from the community! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

#### Contribution Guidelines

- Follow the existing code style and conventions
- Write clear, concise commit messages
- Include tests for new features
- Update documentation as needed
- Ensure your code passes all existing tests

#### Areas for Contributions

- 🐛 Bug fixes and performance improvements
- 🎨 UI/UX enhancements
- 📚 Documentation improvements
- 🧪 Additional testing coverage
- 🌐 Internationalization and localization
- ♿ Accessibility improvements
- 🔒 Security enhancements

## 📝 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 🤝 Support

If you encounter any issues or have questions:

1. **Check the documentation**: Review the deployment guides and troubleshooting sections
2. **Search existing issues**: Look through the [GitHub Issues](https://github.com/KasunCSB/University-Information-System/issues)
3. **Create a new issue**: If you can't find a solution, create a detailed issue report
4. **Contact the team**: Reach out through the repository's discussion section

## 🎓 About

The University Information System is an open-source project aimed at revolutionizing higher education management in Sri Lanka. It provides a unified platform for universities to manage their academic processes digitally, fostering collaboration and improving educational outcomes.

### Vision

To create a comprehensive, accessible, and modern platform that connects all Sri Lankan universities and enhances the educational experience for students, faculty, and administrators.

### Mission

- Digitize university processes and reduce administrative overhead
- Provide equal access to educational resources across all institutions
- Foster collaboration between universities and students
- Support Sri Lanka's digital transformation in education
- Create an open-source solution that can be adapted globally

---

**Made with ❤️ by the UIS Development Team**

*Connecting Sri Lankan Universities through Technology*


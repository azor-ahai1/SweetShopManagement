# 🍭 Sweet Shop Management System

[![GitHub Repository](https://img.shields.io/badge/GitHub-Repository-blue?logo=github)](https://github.com/azor-ahai1/SweetShopManagement)
[![Live Demo](https://img.shields.io/badge/Live-Demo-green?logo=vercel)](https://sweetshopmanagement-vedx.onrender.com)
[![License](https://img.shields.io/badge/License-ISC-yellow.svg)](LICENSE)

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Setup Instructions](#-setup-instructions)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Screenshots](#-screenshots)
- [My AI Usage](#-my-ai-usage)
- [API Documentation](#-api-documentation)
- [Contributing](#-contributing)
- [License](#-license)

## 🎯 Project Overview

The **Sweet Shop Management System** is a full-stack web application designed to manage a sweet shop's inventory, user authentication, and purchase operations. This system provides a comprehensive solution for sweet shop owners to manage their products, track inventory, and handle customer interactions efficiently.

### Key Functionalities:
- **User Management**: Registration, login, and authentication with JWT tokens
- **Sweet Inventory**: Add, update, delete, and view sweet products
- **Category Management**: Organize sweets by categories
- **Purchase Tracking**: Record and manage customer purchases
- **Image Upload**: Cloudinary integration for product images
- **Responsive Design**: Mobile-friendly interface built with React and Tailwind CSS

## ✨ Features

### Backend Features
- 🔐 **JWT Authentication** with refresh token mechanism
- 🍬 **CRUD operations** for sweet products
- 👤 **User management** with role-based access
- 📦 **Purchase tracking** and history
- ☁️ **Cloudinary integration** for image uploads
- 🧪 **Comprehensive testing** with Jest and Supertest
- 🔒 **Secure password hashing** with bcrypt
- 🌐 **CORS configuration** for cross-origin requests

### Frontend Features
- ⚛️ **React 19** with modern hooks and components
- 🎨 **Tailwind CSS** for responsive styling
- 🔄 **Redux Toolkit** for state management
- 📱 **Responsive design** for all device sizes
- 🧪 **Component testing** with React Testing Library
- 🚀 **Vite** for fast development and building
- 🎯 **React Hook Form** for form validation
- 🔗 **React Router** for navigation

## 🛠 Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer + Cloudinary
- **Testing**: Jest + Supertest
- **Security**: bcrypt, CORS, cookie-parser

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit + Redux Persist
- **HTTP Client**: Axios
- **Testing**: Jest + React Testing Library
- **Icons**: React Icons
- **Forms**: React Hook Form

## 🚀 Setup Instructions

### Prerequisites

Before running this application, make sure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas)
- **Git**

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/azor-ahai1/SweetShopManagement.git
   cd SweetShopManagement/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the backend directory with the following variables:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/sweetshop
   # or for MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sweetshop

   # JWT Configuration
   ACCESS_TOKEN_SECRET=your_access_token_secret_here
   ACCESS_TOKEN_EXPIRY=1d
   REFRESH_TOKEN_SECRET=your_refresh_token_secret_here
   REFRESH_TOKEN_EXPIRY=10d

   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret

   # Server Configuration
   PORT=8000
   CORS_ORIGIN=http://localhost:5173
   FRONTEND_URL=http://localhost:5173
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

   The backend server will start on `http://localhost:8000`

5. **Run tests**
   ```bash
   npm test
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd ../frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the frontend directory:
   ```env
   VITE_API_BASE_URL=http://localhost:8000/api/v1
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

   The frontend application will start on `http://localhost:5173`

5. **Build for production**
   ```bash
   npm run build
   ```

6. **Run tests**
   ```bash
   npm test
   ```

### Running the Complete Application

1. **Start MongoDB** (if running locally)
2. **Start the backend server** in one terminal:
   ```bash
   cd backend && npm run dev
   ```
3. **Start the frontend server** in another terminal:
   ```bash
   cd frontend && npm run dev
   ```
4. **Access the application** at `http://localhost:5173`

## 📸 Screenshots

### Home Page
![Home Page](./screenshots/home-page.png)
*The landing page showcasing featured sweets and navigation*

### Dashboard
![Dashboard](./screenshots/dashboard.png)
*Admin dashboard for managing sweets and inventory*

### Sweet Management
![Sweet Management](./screenshots/sweets.png)
*Interface for adding and editing sweet products*

### User Authentication
![Login Page](./screenshots/sign-up.png)
*User login and registration interface*

> **Note**: Screenshots will be added once the application is fully deployed and tested.

## 🤖 My AI Usage

Throughout the development of this Sweet Shop Management System, I leveraged several AI tools to enhance productivity and code quality:

### AI Tools Used:
- **ChatGPT (OpenAI)** - Primary AI assistant for code generation and problem-solving
- **Claude (Anthropic)** - Secondary AI tool for code review and optimization
- **Gemini (Google)** - Used for brainstorming and architectural decisions

### How I Used AI:

#### 1. **Test Generation** 🧪
- **Primary Use**: I used ChatGPT and Claude extensively for generating unit tests and integration tests
- **Specific Examples**:
  - Generated Jest test cases for backend controllers and services
  - Created React Testing Library tests for frontend components
  - Helped with mock function concepts, which I was still learning
- **Impact**: AI significantly accelerated my testing workflow since I was new to mocking concepts and test patterns

#### 2. **Frontend HTML & CSS Development** 🎨
- **Primary Use**: Used all three AI tools (ChatGPT, Claude, Gemini) for UI/UX design and styling
- **Specific Examples**:
  - Generated Tailwind CSS classes for responsive layouts
  - Created component structures and styling patterns
  - Helped with React component architecture and best practices
- **Reason**: I'm not particularly interested in UI design, so AI helped me create professional-looking interfaces quickly

#### 3. **Bug Fixing & Debugging** 🐛
- **Limited Use**: Used AI minimally for debugging, primarily for understanding error messages
- **Specific Examples**:
  - Helped identify issues with JWT token handling
  - Assisted with CORS configuration problems
  - Provided insights on MongoDB connection issues
- **Approach**: I preferred to debug most issues myself but used AI as a second opinion

### Reflection on AI Impact:

**Positive Impacts:**
- **Learning Acceleration**: AI helped me understand testing concepts, especially mocking, much faster than traditional learning methods
- **Productivity Boost**: Significantly reduced time spent on repetitive tasks like writing boilerplate tests and styling components
- **Code Quality**: AI suggestions often included best practices I might have missed
- **Confidence Building**: Having AI as a coding partner made me more confident to experiment with new patterns

**Challenges & Limitations:**
- **Over-reliance Risk**: Had to be careful not to become too dependent on AI for problem-solving
- **Code Understanding**: Made sure to understand every piece of AI-generated code before implementing
- **Context Awareness**: AI sometimes provided generic solutions that needed customization for my specific use case

**Key Learning:**
AI tools were most valuable for tasks I was less experienced with (testing, UI design) and least necessary for core logic where I had strong fundamentals. The combination of AI assistance with personal code review created an effective development workflow.


## 📚 API Documentation

### Base URL
```
http://localhost:8000/api/v1
```

### Authentication Endpoints
- `POST /users/register` - Register new user
- `POST /users/login` - User login
- `POST /users/logout` - User logout
- `POST /users/refresh-token` - Refresh access token

### Sweet Management Endpoints
- `GET /sweets` - Get all sweets
- `POST /sweets` - Create new sweet (Admin only)
- `GET /sweets/:id` - Get sweet by ID
- `PUT /sweets/:id` - Update sweet (Admin only)
- `DELETE /sweets/:id` - Delete sweet (Admin only)

### User Management Endpoints
- `GET /users/profile` - Get current user profile
- `PUT /users/profile` - Update user profile
- `POST /users/change-password` - Change password

For detailed API documentation with request/response examples, see [API_DOCS.md](./API_DOCS.md)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

---

## 🔗 Links

- **Repository**: [https://github.com/azor-ahai1/SweetShopManagement](https://github.com/azor-ahai1/SweetShopManagement)
- **Live Demo**: [Deploy your app and add the link here]
- **Author**: Aashish Shukla
- **Contact**: [Add your email or social links]

---

**Made with ❤️ and AI assistance for learning and productivity**

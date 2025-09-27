# 🎬 CreatorVerse

**A comprehensive video sharing and content creation platform built with Node.js, Express, and MongoDB**

![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)
![Express](https://img.shields.io/badge/Express-5.1.0-blue.svg)
![MongoDB](https://img.shields.io/badge/MongoDB-8.18.2-green.svg)
![JWT](https://img.shields.io/badge/JWT-9.0.2-orange.svg)

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [API Documentation](#-api-documentation)
- [Database Schema](#-database-schema)
- [Authentication](#-authentication)
- [File Upload](#-file-upload)
- [Testing](#-testing)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### 🔐 **Authentication & User Management**
- JWT-based authentication with access & refresh tokens
- Secure password hashing with bcrypt
- Cookie-based session management
- Profile management with avatar/cover image upload
- User watch history tracking

### 📹 **Video Management**
- Video upload and streaming
- Thumbnail generation and management
- Video metadata (title, description, duration, views)
- Video publishing/unpublishing
- Advanced video search and filtering

### 🎭 **Social Features**
- User subscriptions and subscriber management
- Video likes and dislikes
- Comment system with nested sub-comments
- User playlists creation and management
- Watch history and recommendations

### 📊 **Advanced Analytics**
- User profile statistics (subscriber count, video count)
- Video analytics (views, likes, comments)
- Watch history with detailed video information
- Aggregated data reporting

## 🛠 Tech Stack

### **Backend**
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **MongoDB** - Database with Mongoose ODM
- **JWT** - Authentication tokens
- **Bcrypt** - Password hashing

### **File Storage & Processing**
- **Cloudinary** - Image and video cloud storage
- **Multer** - File upload middleware

### **Additional Tools**
- **Cookie-Parser** - Cookie management
- **CORS** - Cross-origin resource sharing
- **Dotenv** - Environment variable management
- **Nodemon** - Development server

## 📁 Project Structure

```
creatorVerse/
├── 📁 controllers/           # Request handlers
│   ├── user.controller.js    # User management & auth
│   └── subscriber.controller.js
├── 📁 models/               # Database schemas
│   ├── user.model.js        # User schema with JWT methods
│   ├── video.model.js       # Video content schema
│   ├── comment.model.js     # Comment system
│   ├── like.model.js        # Like/dislike system
│   ├── playlist.model.js    # User playlists
│   ├── subscriber.model.js  # Subscription relationships
│   └── subcomment.model.js  # Nested comments
├── 📁 middlewares/          # Custom middleware
│   ├── auth.middleware.js   # JWT verification
│   └── multer.middleware.js # File upload handling
├── 📁 utils/               # Utility functions
│   ├── asyncwrapper.js     # Async error handling
│   ├── cloudinary.util.js  # Cloud storage operations
│   ├── errorHandler.js     # Custom error classes
│   ├── extract.util.js     # Data extraction helpers
│   └── trim.util.js        # Data validation helpers
├── 📁 routes/              # API route definitions
├── 📁 db/                  # Database configuration
├── 📁 public/              # Static files
├── app.js                  # Express app configuration
├── index.js               # Server entry point
├── completeMockData.js    # Database seeding script
└── .env                   # Environment variables
```

## 🚀 Installation

### **Prerequisites**
- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- Cloudinary account for file storage

### **Setup Steps**

1. **Clone the repository**
   ```bash
   git clone https://github.com/Sujaljain-08/CreatorVerse.git
   cd creatorVerse
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

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Seed the database (optional)**
   ```bash
   node completeMockData.js
   ```

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/creatorverse
DB_NAME=creatorverse

# JWT Secrets
ACCESS_TOKEN_SECRET=your_access_token_secret_here
REFRESH_TOKEN_SECRET=your_refresh_token_secret_here
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_EXPIRY=10d

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# CORS
CORS_ORIGIN=http://localhost:3000
```

## 📚 API Documentation

### **Authentication Endpoints**

#### **Register User**
```http
POST /api/v1/users/register
Content-Type: multipart/form-data

Body:
- fullName: string (required)
- username: string (required)
- email: string (required)
- password: string (required)
- avatar: file (required)
- coverImage: file (optional)
```

#### **Login User**
```http
POST /api/v1/users/login
Content-Type: application/json

{
  "username": "johndoe", // or email
  "password": "password123"
}
```

#### **Logout User**
```http
POST /api/v1/users/logout
Authorization: Bearer <access_token>
```

### **User Management**

#### **Get User Profile**
```http
GET /api/v1/users/profile
Authorization: Bearer <access_token>
```

#### **Update User Details**
```http
PATCH /api/v1/users/update
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "fullName": "New Name",
  "username": "newusername"
}
```

#### **Get Watch History**
```http
GET /api/v1/users/watch-history
Authorization: Bearer <access_token>
```

#### **Get Watch History (Advanced)**
```http
GET /api/v1/users/watch-history-advanced
Authorization: Bearer <access_token>

Query Parameters:
- page: number (default: 1)
- limit: number (default: 10)
- sortBy: string (default: 'createdAt')
- sortOrder: 'asc' | 'desc' (default: 'desc')
```

### **Response Format**

#### **Success Response**
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    // Response data here
  }
}
```

#### **Error Response**
```json
{
  "success": false,
  "message": "Error description",
  "error": {
    "code": 400,
    "details": "Detailed error information"
  }
}
```

## 🗃 Database Schema

### **User Model**
```javascript
{
  _id: ObjectId,
  username: String (unique, required),
  email: String (unique, required),
  fullName: String (required),
  Password: String (hashed, required),
  avatar: String (Cloudinary URL, required),
  coverImage: String (Cloudinary URL, optional),
  watchHistory: [ObjectId] (references Video),
  refreshToken: String,
  createdAt: Date,
  updatedAt: Date
}
```

### **Video Model**
```javascript
{
  _id: ObjectId,
  videoFile: String (Cloudinary URL, required),
  thumbnail: String (Cloudinary URL, required),
  title: String (required),
  description: String (required),
  duration: Number (required),
  views: Number (default: 0),
  isPublished: Boolean (default: true),
  owner: ObjectId (references User, required),
  createdAt: Date,
  updatedAt: Date
}
```

### **Key Relationships**
- **User ↔ Video**: One-to-many (owner relationship)
- **User ↔ Subscriber**: Many-to-many (subscription system)
- **Video ↔ Comment**: One-to-many
- **Comment ↔ SubComment**: One-to-many (nested comments)
- **User/Video ↔ Like**: Many-to-many

## 🔐 Authentication

The application uses a **dual-token JWT system**:

### **Access Token**
- Short-lived (1 day)
- Used for API authentication
- Stored in HTTP-only cookies

### **Refresh Token**
- Long-lived (10 days)
- Used to generate new access tokens
- Stored in database and HTTP-only cookies

### **Password Security**
- Passwords are hashed using bcrypt with salt rounds
- Pre-save middleware automatically hashes passwords
- Password comparison using secure bcrypt methods

### **Usage Example**
```javascript
// Middleware automatically verifies JWT tokens
app.get('/protected', verifyJWT, (req, res) => {
  // req.user contains the authenticated user data
  res.json({ user: req.user });
});
```

## 📤 File Upload

### **Cloudinary Integration**
- **Images**: Profile avatars, cover images, video thumbnails
- **Videos**: Main video content with automatic optimization
- **Features**: Auto-compression, format conversion, CDN delivery

### **Upload Process**
1. Files uploaded via multer to temporary local storage
2. Files processed and uploaded to Cloudinary
3. Local temporary files cleaned up
4. Cloudinary URLs stored in database

### **Supported Formats**
- **Images**: JPG, PNG, WEBP, GIF
- **Videos**: MP4, MOV, AVI, WEBM

## 🧪 Testing

### **Mock Data Generation**
The project includes a comprehensive mock data generator:

```bash
# Generate test data (8 users, 14 videos, relationships)
node completeMockData.js
```

### **Test Data Includes**
- 8 users with hashed passwords
- 14 videos with realistic metadata
- Subscription relationships
- Comments and likes
- User playlists
- Watch history

### **API Testing**
Use tools like Postman or Thunder Client with the provided endpoints. Import the collection:

```bash
# Example API calls
curl -X POST http://localhost:3000/api/v1/users/register \
  -F "fullName=John Doe" \
  -F "username=johndoe" \
  -F "email=john@example.com" \
  -F "password=password123" \
  -F "avatar=@/path/to/image.jpg"
```

## 📈 Performance Features

### **Database Optimization**
- **Indexes**: Strategic indexing on frequently queried fields
- **Aggregation Pipelines**: Efficient data aggregation for complex queries
- **Pagination**: Built-in pagination for large datasets

### **Security Features**
- **Input Validation**: Comprehensive data validation and sanitization
- **Rate Limiting**: API rate limiting (ready to implement)
- **CORS**: Configurable cross-origin resource sharing
- **Secure Headers**: HTTP security headers
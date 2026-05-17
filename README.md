## Bloggin' 📝

A modern full-stack blogging platform built with React, Express, Prisma, PostgreSQL, and Cloudinary.\
Users can create, edit, publish, search, and manage blogs with authentication, profiles, likes, drafts, image uploads, and a rich text editor.

------------------------------------------------------------------------

### Features

#### Authentication

-   JWT authentication with HTTP-only cookies
-   Login / Register
-   Forgot password with OTP verification
-   Password reset
-   Protected routes

#### Blog Features

-   Create blogs
-   Save drafts
-   Edit published blogs
-   Delete blogs
-   Rich text editor (Tiptap)
-   Image uploads
-   Blog categories
-   Search functionality
-   Recent blogs
-   Popular blogs
-   Views counter
-   Likes system

#### User Features

-   User profile
-   Update profile image
-   Update name/email/password
-   Delete account
-   Automatic cleanup of uploaded images and user blogs

#### UI Features

-   Responsive design
-   Search suggestions
-   Category fallback images
-   Dashboard with tabs
-   Loading states
-   Error handling UI

------------------------------------------------------------------------

### Tech Stack

#### Frontend

-   React
-   Vite
-   Tailwind CSS
-   React Router
-   Zustand
-   Axios
-   Tiptap Editor

#### Backend

-   Node.js
-   Express.js
-   Prisma ORM
-   JWT Authentication

#### Database

-   PostgreSQL
-   Supabase

#### Media Storage

-   Cloudinary

------------------------------------------------------------------------

### Installation

#### Clone repository

``` bash
git clone <your-repository-url>
cd bloggin
```

#### Client

``` bash
cd client
npm install
npm run dev
```

#### Server

``` bash
cd server
npm install
npm run dev
```

------------------------------------------------------------------------

### Environment Variables

#### Server (.env)

``` env
DATABASE_URL=
DIRECT_URL=

JWT_SECRET=

JWT_EXPIRE=7d

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

GMAIL_EMAIL=
GMAIL_APP_PASSWORD=
NODE_ENV=
```

#### Client (.env)

``` env
VITE_API_URL=http://localhost:8080
```

------------------------------------------------------------------------

### Project Structure

``` txt
bloggin/
│
├── client/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── server/
│   ├── src/
│   ├── prisma/
│   └── package.json
│
└── README.md
```

------------------------------------------------------------------------

### Future Improvements

-   Comments system
-   Follow users
-   Notifications
-   Newsletter emails
-   Bookmarks
-   Dark mode
-   AI-powered blog suggestions

------------------------------------------------------------------------

### Author

Harsh Yadav

Built with ❤️ using React + Express
# TumiNol-Backend

TumiNol-Backend is a prototype project of the backend of the famous video-sharing social media app, YouTube. This project is built using Node.js, Express.js, Cloudinary and MongoDB.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)

## Features

### Completed Features
- User registration, authentication and authorization
- Change password
- Upload and update avatar and cover image
- Get channel info
- Toggle channel subscription
- Get subscribers list and list of subscribed channels
- Get individual posts and posts by owner with pagination
- Create, update, and delete posts
- Video upload and streaming
- Update thumbnail
- Get individual, all and owner videos with sorting and pagination
- Search, update, delete, and manage videos

### Planned Features
- Comment and like management
- Playlist management

## Installation

1. Clone the repository:

    ```sh
    git clone https://github.com/Samonto-Karmaker/TumiNol-Backend.git
    cd tuminol-backend
    ```

2. Install dependencies:

    ```sh
    npm install
    ```

3. Set up environment variables:

    Create a `.env` file in the root directory and add the necessary environment variables. Refer to the [Environment Variables](#environment-variables) section for more details.

4. Start the development server:

    ```sh
    npm start
    ```

## Usage

To start the server in development mode:

```sh
npm start
```

To start the server in production mode:
```sh
npm run prod
```

## API Endpoints
Here are some of the main API endpoints:

- User Routes:

    ```http
    POST /api/v1/users/register - Register a new user
    POST /api/v1/users/login - Login a user
    POST /api/v1/users/refresh-token - Refresh access token
    POST /api/v1/users/logout - Logout a user
    GET /api/v1/users/me - Get authenticated user details
    PATCH /api/v1/users/update-avatar - Update user avatar
    PATCH /api/v1/users/update-cover-image - Update user cover image
    GET /api/v1/users/channel/:userName - Get channel profile
    PATCH /api/v1/users/change-password - Change password
    ```

- Subscription Routes:

    ```http
    POST /api/v1/subscriptions/channel/:channelId - Toggle subscription
    GET /api/v1/subscriptions/subscribers - Get the list of users subscribed to your channel
    GET /api/v1/subscriptions/subscribed - Get the list of channels you are subscribed to
    ```

- Post Routes:

    ```http
    POST /api/v1/posts/ - Create a new post
    GET /api/v1/posts/:postId - Get a post by its ID
    GET /api/v1/posts/user/:ownerName - Get posts by owner name with pagination
    PATCH /api/v1/posts/:postId - Edit a post by its ID
    DELETE /api/v1/posts/:postId - Delete a post by its ID
    ```

- Video Routes:

    ```http
    POST /api/v1/videos/ - Upload a new video
    GET /api/v1/videos/ - Get all videos with sorting and pagination
    GET /api/v1/videos/search - Search videos by title with sorting and pagination
    GET /api/v1/videos/channel/:ownerId - Get videos by owner ID with sorting and pagination
    GET /api/v1/videos/:videoId - Get a video by its ID
    DELETE /api/v1/videos/:videoId - Delete a video by its ID
    PATCH /api/v1/videos/publish/:videoId - Toggle publish status of a video
    PATCH /api/v1/videos/update-details/:videoId - Update video details
    PATCH /api/v1/videos/update-thumbnail/:videoId - Update video thumbnail
    ```

- Test Routes:

    ```http
    GET /api/v1/test - Test endpoint
    ```

**Pagination and Sorting:**

For endpoints that support pagination and sorting, you can use the following query parameters:

- _page_: The page number to retrieve (default is `1`).
- _limit_: The number of items per page (default is `10`).
- _sortBy_: The field to sort by (e.g., createdAt, views, likeCount, duration).
- _sortType_: The sort order (asc for ascending, desc for descending).

**Search:**
For endpoints related to searching, you can use the following query parameters:

- _searchQuery_: The search query string to filter results by title.

**Example:**

```http
GET /api/v1/videos/channel/:ownerId?page=1&limit=10&sortBy=createdAt&sortType=desc
GET /api/v1/videos/search?searchQuery=example&page=1&limit=10&sortBy=createdAt&sortType=desc
```


## Environment Variables

<table>
    <thead>
        <tr>
            <th>Variable</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>PORT</td>
            <td>The port number on which the server runs (e.g., 3000)</td>
        </tr>
        <tr>
            <td>CORS_ORIGIN</td>
            <td>Allowed origins for Cross-Origin Resource Sharing (CORS)</td>
        </tr>
        <tr>
            <td>MONGODB_CONNECTION_STRING</td>
            <td>The MongoDB connection URI</td>
        </tr>
        <tr>
            <td>ACCESS_TOKEN_SECRET</td>
            <td>Secret key for signing access tokens</td>
        </tr>
        <tr>
            <td>ACCESS_TOKEN_EXPIRES_IN</td>
            <td>Expiration time for access tokens (e.g., 15m, 1h)</td>
        </tr>
        <tr>
            <td>REFRESH_TOKEN_SECRET</td>
            <td>Secret key for signing refresh tokens</td>
        </tr>
        <tr>
            <td>REFRESH_TOKEN_EXPIRES_IN</td>
            <td>Expiration time for refresh tokens (e.g., 7d)</td>
        </tr>
        <tr>
            <td>COOKIE_SECRET</td>
            <td>Secret key for signing cookies</td>
        </tr>
        <tr>
            <td>CLOUDINARY_CLOUD_NAME</td>
            <td>The Cloudinary cloud name for image uploads</td>
        </tr>
        <tr>
            <td>CLOUDINARY_API_KEY</td>
            <td>The API key for Cloudinary</td>
        </tr>
        <tr>
            <td>CLOUDINARY_API_SECRET</td>
            <td>The API secret for Cloudinary</td>
        </tr>
        <tr>
            <td>NODE_ENV</td>
            <td>Defines the environment in which the app is running (e.g., development, production)</td>
        </tr>
    </tbody>
</table>

# Have a nice day!

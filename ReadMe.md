# Kwolity Backend

This is the backend API for Kwolity Group, a real estate and investment platform. The backend is built with Node.js, Express, and MongoDB (via Mongoose), and provides RESTful endpoints for managing users, properties, investments, bookings, and payments.

## Features

- **User Authentication**: Register, login, and manage user profiles with JWT-based authentication.
- **Property Management**: CRUD operations for properties, with filtering by status, location, price, and more.
- **Investment Management**: Create and manage investment opportunities, track investors and funding status.
- **Booking System**: Book properties, manage bookings, and view booking history.
- **Payment Processing**: Record and verify payments for bookings and investments.
- **Role-based Access Control**: Admin and client/investor roles with protected routes.

## Project Structure
.env
index.js 
controller/ 
bookingController.js 
investmentController.js 
paymentController.js 
propertyController.js 
userController.js 
model/ 
Booking.js 
Investment.js 
Payment.js 
Property.js 
User.js 
routes/ 
bookingRoute.js 
investmentRoute.js
paymentRoute.js
propertyRoute.js
userRoute.js

## Getting Started

### Prerequisites

- Node.js (v14+ recommended)
- MongoDB instance (local or cloud)

### Installation

1. Clone the repository:
    ```sh
    git clone <repo-url>
    cd kwolity_backend
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

3. Create a `.env` file in the root directory and set your environment variables:
    ```
    JWT_SECRET=your_jwt_secret
    ```

4. Start the server:
    ```sh
    npm start
    ```

5. The API will be running at [http://localhost:3000](http://localhost:3000).

## API Endpoints

### Users

- `POST /api/users/register` — Register a new user
- `POST /api/users/login` — Login user
- `GET /api/users/profile` — Get user profile (auth required)
- `PUT /api/users/profile/:userId` — Update user profile (auth required)

### Properties

- `POST /api/properties/` — Create property (admin only)
- `GET /api/properties/` — List all properties
- `GET /api/properties/:id` — Get property by ID
- `PUT /api/properties/:id` — Update property (admin only)
- `DELETE /api/properties/:id` — Delete property (admin only)
- Additional filters: `/status/:status`, `/location/:location`, `/price`, `/title/:title`, `/user/:userId`, `/count`

### Investments

- `POST /api/investments/` — Create investment (admin only)
- `GET /api/investments/` — List all investments
- `GET /api/investments/:id` — Get investment by ID
- `PUT /api/investments/:id` — Update investment (admin only)
- `DELETE /api/investments/:id` — Delete investment (admin only)
- `GET /api/investments/user/:userId` — Get investments by user
- `GET /api/investments/count` — Get investment count

### Bookings

- `POST /api/bookings/` — Create booking (auth required)
- `GET /api/bookings/` — List all bookings (admin only)
- `GET /api/bookings/:id` — Get booking by ID (auth required)
- `PUT /api/bookings/:id` — Update booking (admin only)
- `DELETE /api/bookings/:id` — Delete booking (admin only)

### Payments

- `POST /api/payment/` — Create payment (auth required)
- `GET /api/payment/` — List all payments (admin only)
- `GET /api/payment/:id` — Get payment by ID (auth required)
- `PUT /api/payment/:id` — Update payment (admin only)
- `DELETE /api/payment/:id` — Delete payment (admin only)

## License

ISC

## Author

Taiwo Ayomide


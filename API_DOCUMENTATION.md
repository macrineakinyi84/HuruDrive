# HuruDrive API Documentation

## Base URL
- **Development:** `http://localhost:3000`
- **Production:** (To be configured)

## Authentication
Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:
```
Authorization: Bearer <your-token>
```

---

## Public Endpoints

### Health Check
- **GET** `/api/health`
- **Description:** Check if the server and database are running
- **Response:** `{ "status": "ok" }`

### Vehicle Endpoints

#### Get All Vehicles
- **GET** `/api/vehicles`
- **Query Parameters:**
  - `location` (optional): Filter by location
  - `make` (optional): Filter by make
  - `category` (optional): Filter by category
  - `minSeats` (optional): Minimum number of seats
  - `minPrice` (optional): Minimum daily price
  - `maxPrice` (optional): Maximum daily price
- **Example:** `GET /api/vehicles?location=Nairobi&category=SUV`
- **Response:** Array of vehicles with images

#### Get Single Vehicle
- **GET** `/api/vehicles/:id`
- **Example:** `GET /api/vehicles/bfa2e852-388c-48cb-9f4d-c54b5c2d8049`
- **Response:** Vehicle details with images and bookings

### Authentication Endpoints

#### Register User
- **POST** `/api/auth/register`
- **Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "0712345678",
    "password": "password123"
  }
  ```
- **Response:** User data and JWT token

#### Login
- **POST** `/api/auth/login`
- **Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response:** User data and JWT token

#### Get Current User
- **GET** `/api/auth/me`
- **Headers:** `Authorization: Bearer <token>`
- **Response:** Current user data

---

## Authenticated Endpoints

### Booking Endpoints

#### Create Booking
- **POST** `/api/bookings`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "vehicleId": "bfa2e852-388c-48cb-9f4d-c54b5c2d8049",
    "pickupLocation": "Nairobi CBD",
    "returnLocation": "Nairobi CBD",
    "pickupAt": "2024-01-25T10:00:00Z",
    "returnAt": "2024-01-28T10:00:00Z"
  }
  ```
- **Response:** Created booking with user and vehicle details

### Payment Endpoints

#### Process Payment
- **POST** `/api/payments`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "bookingId": "713c8b76-c449-4a3d-9284-e39f66568e3b",
    "provider": "mpesa",
    "amount": 7875
  }
  ```
- **Response:** Payment confirmation and updated booking

### Feedback Endpoints

#### Submit Feedback
- **POST** `/api/feedback`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "bookingId": "713c8b76-c449-4a3d-9284-e39f66568e3b",
    "rating": 5,
    "comment": "Great service!"
  }
  ```
- **Response:** Created feedback

---

## User Dashboard Endpoints

All require: `Authorization: Bearer <token>`

### Get User Bookings
- **GET** `/api/user/bookings`
- **Query Parameters:**
  - `status` (optional): Filter by status (PENDING, CONFIRMED, CANCELLED, COMPLETED)
- **Response:** Array of user's bookings

### Get Single Booking
- **GET** `/api/user/bookings/:id`
- **Response:** Booking details with vehicle and payment

### Cancel Booking
- **PATCH** `/api/user/bookings/:id/cancel`
- **Response:** Updated booking

### Get Payment History
- **GET** `/api/user/payments`
- **Response:** Array of user's payments

### Get User Statistics
- **GET** `/api/user/stats`
- **Response:** Dashboard statistics (total bookings, upcoming, completed, total spent)

### Update Profile
- **PATCH** `/api/user/profile`
- **Body:**
  ```json
  {
    "name": "John Doe",
    "phone": "0712345678"
  }
  ```
- **Response:** Updated user data

### Change Password
- **PATCH** `/api/user/password`
- **Body:**
  ```json
  {
    "currentPassword": "oldpassword",
    "newPassword": "newpassword123"
  }
  ```
- **Response:** Success message

### Get User Feedback
- **GET** `/api/user/feedback`
- **Response:** Array of user's feedback submissions

---

## Admin Endpoints

All require: `Authorization: Bearer <token>` and `role: ADMIN`

### Get All Bookings
- **GET** `/api/admin/bookings`
- **Query Parameters:**
  - `status` (optional): Filter by status
  - `startDate` (optional): Filter by start date
  - `endDate` (optional): Filter by end date
- **Response:** Array of all bookings

### Update Booking Status
- **PATCH** `/api/admin/bookings/:id`
- **Body:**
  ```json
  {
    "status": "CONFIRMED"
  }
  ```
- **Response:** Updated booking

### Get Admin Statistics
- **GET** `/api/admin/stats`
- **Response:** Dashboard statistics (total bookings, revenue, users, etc.)

### Get All Feedback
- **GET** `/api/admin/feedback`
- **Query Parameters:**
  - `status` (optional): Filter by status (PENDING, APPROVED, REJECTED)
- **Response:** Array of all feedback

### Update Feedback Status
- **PATCH** `/api/admin/feedback/:id`
- **Body:**
  ```json
  {
    "status": "APPROVED"
  }
  ```
- **Response:** Updated feedback

---

## Testing with Postman

### Setup Instructions:

1. **Import Collection:**
   - Open Postman
   - Click "Import" button
   - Create a new collection called "HuruDrive API"

2. **Set Base URL:**
   - Create an environment variable: `base_url` = `http://localhost:3000`

3. **Authentication Flow:**
   - First, register or login to get a token
   - Copy the token from the response
   - Set it as a collection variable: `token`
   - Use `{{token}}` in Authorization header for authenticated requests

### Example Postman Setup:

**Environment Variables:**
- `base_url`: `http://localhost:3000`
- `token`: (will be set after login)

**Collection Variables:**
- `base_url`: `http://localhost:3000`

**Request Examples:**

1. **Health Check:**
   - Method: GET
   - URL: `{{base_url}}/api/health`

2. **Login:**
   - Method: POST
   - URL: `{{base_url}}/api/auth/login`
   - Body (JSON):
     ```json
     {
       "email": "admin@hurudrive.com",
       "password": "admin123"
     }
     ```
   - Save token from response to `token` variable

3. **Get Vehicles:**
   - Method: GET
   - URL: `{{base_url}}/api/vehicles?location=Nairobi`

4. **Create Booking (Authenticated):**
   - Method: POST
   - URL: `{{base_url}}/api/bookings`
   - Headers:
     - `Authorization`: `Bearer {{token}}`
     - `Content-Type`: `application/json`
   - Body (JSON):
     ```json
     {
       "vehicleId": "bfa2e852-388c-48cb-9f4d-c54b5c2d8049",
       "pickupLocation": "Nairobi CBD",
       "returnLocation": "Nairobi CBD",
       "pickupAt": "2024-01-25T10:00:00Z",
       "returnAt": "2024-01-28T10:00:00Z"
     }
     ```

---

## Response Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing or invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

---

## Error Response Format

```json
{
  "error": "Error message here",
  "details": "Additional error details (if available)"
}
```

---

## Notes

- All dates should be in ISO 8601 format (e.g., `2024-01-25T10:00:00Z`)
- Amounts are in KES (Kenyan Shillings) and should be integers
- Payment providers: `mpesa`, `card`, `airtelmoney`, `bank`
- Booking statuses: `PENDING`, `CONFIRMED`, `CANCELLED`, `COMPLETED`
- Payment statuses: `PENDING`, `PAID`, `FAILED`
- Feedback statuses: `PENDING`, `APPROVED`, `REJECTED`

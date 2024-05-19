
# Sleep Tracker

RESTful APIs using Node.js and Express for Sleep tracker apllication that allows a mobile app to store and retrieve user sleep data.


## How to setup and run the APIs

After getting the repo locally 
**Install the Dependencies** by running the command

   ```
    npm install
    ```

## Running the API

1. **Start the Backend Server** by running the following command in bash  

    ```
    node backend/index.js
    ```

    The server should be running on `http://localhost:3000`.

## Running Tests

1. **Navigate to the Test Directory** using the command

    ```
    cd test
    ```

2. **Run the Tests** using the command

    ```
    npm test
    ```

  # Sleep Tracker APIs

The Sleep Tracker APIs are RESTful APIs designed to track sleep records for users.



## User Endpoints

### 1. POST /api/v1/user/signup

Creates a new user account.

**Request Body:**

- `userName` (string, required): Email address of the user.
- `firstName` (string, required): First name of the user.
- `lastName` (string, required): Last name of the user.
- `password` (string, required): Password for the user account (min. 6 characters).

**Response:**

- `message` (string): Indicates success or failure of the operation.
- `token` (string): JWT token for authentication.

### 2. POST /api/v1/user/signin

Logs in an existing user.

**Request Body:**

- `userName` (string, required): Email address of the user.
- `password` (string, required): Password for the user account.

**Response:**

- `message` (string): Indicates success or failure of the operation.
- `token` (string): JWT token for authentication.

## Sleep Endpoints

### 1. POST /api/v1/sleep

Creates a new sleep record for the authenticated user.

**Authorization Header:**

- `Authorization: Bearer <token>`

**Request Body:**

- `hours` (number, required): Number of hours slept (must be a positive number).
- `timestamp` (string, optional): Timestamp of the sleep record.
- `userId` (string, required): ID of the user.

**Response:**

- `message` (string): Indicates success or failure of the operation.
- `sleep` (object, optional): Details of the created sleep record.

**Error Responses:**

- `404 Not Found`: User not found.
- `411 Length Required`: Invalid credentials (negative hours).
- `500 Internal Server Error`: Internal server error.

### 2. GET /api/v1/sleep/:userId

Retrieves sleep records for a specific user.

**Authorization Header:**

- `Authorization: Bearer <token>`

**Path Parameter:**

- `userId` (string, required): ID of the user.

**Query Parameters:**

- `page` (number, optional): Page number for pagination (default: 1).
- `limit` (number, optional): Maximum number of records per page (default: 3).

**Response:**

- `message` (string): Indicates success or failure of the operation.
- `sleepRecords` (array): Array of sleep records.
- `currentPage` (number): Current page number.

**Error Responses:**

- `404 Not Found`: User not found.
- `401 Unauthorized`: Invalid page credentials.
- `500 Internal Server Error`: Internal server error.

### 3. DELETE /api/v1/sleep/:recordId

Deletes a sleep record.

**Authorization Header:**

- `Authorization: Bearer <token>`

**Path Parameter:**

- `recordId` (string, required): ID of the sleep record to delete.

**Response:**

- `message` (string): Indicates success or failure of the operation.

**Error Responses:**

- `404 Not Found`: Sleep record not found.
- `500 Internal Server Error`: Internal server error.

---


# POST /api/v1/auth/login

## Description

Authenticates an existing RentHub user using email and password.

If the credentials are valid, the server creates an authenticated session.

---

## Endpoint

```http
POST /api/v1/auth/login
```

---

## Authentication

Not required.

---

## Request Headers

```http
Content-Type: application/json
```

---

## Request Body

| Field | Type | Required | Description |
|---|---|---:|---|
| `email` | string | Yes | User's registered email |
| `password` | string | Yes | User's account password |

### Example Request

```json
{
  "email": "bao@example.com",
  "password": "Password123"
}
```

---

## Validation Rules

### `email`

- Must be a valid email address.
- Leading and trailing spaces must be removed.
- Must be converted to lowercase.

### `password`

- Must be a string.
- Must not be empty.

---

## Business Rules

1. The account must exist.
2. The password must match the stored password hash.
3. The account status must be `active`.
4. Suspended or deactivated users cannot log in.
5. The API must not reveal whether the email or password was incorrect.
6. Successful login creates an authenticated session.
7. Password and password hash must never appear in the response.

---

## Success Response

### Code

```http
200 OK
```

### JSON

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "4d52c887-b07a-40f4-b829-b8f513bd1ab7",
      "fullName": "Nguyen Thai Bao",
      "email": "bao@example.com",
      "phone": "0901234567",
      "role": "host",
      "status": "active"
    }
  }
}
```

The authenticated session should normally be stored using a secure HTTP-only cookie.

---

## Error Responses

### Invalid Request Data

```http
400 Bad Request
```

```json
{
  "success": false,
  "message": "Invalid login data",
  "errors": {
    "email": [
      "Please enter a valid email address"
    ],
    "password": [
      "Password is required"
    ]
  }
}
```

### Invalid Credentials

```http
401 Unauthorized
```

```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

The response must not specify whether the email or password was incorrect.

### Account Suspended

```http
403 Forbidden
```

```json
{
  "success": false,
  "message": "This account has been suspended"
}
```

### Account Deactivated

```http
403 Forbidden
```

```json
{
  "success": false,
  "message": "This account is not active"
}
```

### Unsupported Media Type

```http
415 Unsupported Media Type
```

```json
{
  "success": false,
  "message": "Content-Type must be application/json"
}
```

### Too Many Login Attempts

```http
429 Too Many Requests
```

```json
{
  "success": false,
  "message": "Too many login attempts. Please try again later"
}
```

### Internal Server Error

```http
500 Internal Server Error
```

```json
{
  "success": false,
  "message": "Unable to log in"
}
```

---

## Processing Flow

```text
Receive request
    ↓
Check Content-Type
    ↓
Parse JSON body
    ↓
Validate email and password
    ↓
Normalize email
    ↓
Find user by email
    ↓
Check account status
    ↓
Compare password with password hash
    ↓
Create session
    ↓
Return safe user information
```

---

## Security Requirements

- Use the same generic error for an unknown email and an incorrect password.
- Never return the password hash.
- Use secure, HTTP-only, same-site cookies.
- Apply rate limiting to reduce brute-force attempts.
- Do not expose internal authentication errors.
# GET /api/v1/auth/me

## Description

Returns the currently authenticated RentHub user's safe profile information.

This endpoint is used by the frontend to determine:

- Whether the user is logged in
- The user's identity
- The user's role
- Which dashboard or protected features should be displayed

---

## Endpoint

```http
GET /api/v1/auth/me
```

---

## Authentication

Required.

The browser must send a valid session cookie.

---

## Request Headers

No special JSON header is required because this endpoint has no request body.

---

## Request Body

None.

---

## Business Rules

1. The request must contain a valid authenticated session.
2. The user account must still exist.
3. The account status must be `active`.
4. Only safe user fields may be returned.
5. Password and password hash must never be returned.
6. The frontend may use the returned role for navigation, but backend authorization must still be checked independently.

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
  "data": {
    "user": {
      "id": "4d52c887-b07a-40f4-b829-b8f513bd1ab7",
      "fullName": "Nguyen Thai Bao",
      "email": "bao@example.com",
      "phone": "0901234567",
      "role": "host",
      "status": "active",
      "createdAt": "2026-08-05T02:00:00.000Z"
    }
  }
}
```

---

## Error Responses

### Authentication Required

```http
401 Unauthorized
```

```json
{
  "success": false,
  "message": "Authentication required"
}
```

### Invalid or Expired Session

```http
401 Unauthorized
```

```json
{
  "success": false,
  "message": "Invalid or expired session"
}
```

### Account Forbidden

```http
403 Forbidden
```

```json
{
  "success": false,
  "message": "This account is not active"
}
```

### User Not Found

```http
404 Not Found
```

```json
{
  "success": false,
  "message": "User account not found"
}
```

### Internal Server Error

```http
500 Internal Server Error
```

```json
{
  "success": false,
  "message": "Unable to retrieve account information"
}
```

---

## Processing Flow

```text
Receive request
    ↓
Read session cookie
    ↓
Validate session
    ↓
Get authenticated user ID
    ↓
Find user in database
    ↓
Check account status
    ↓
Remove sensitive fields
    ↓
Return safe profile information
```

---

## Security Requirements

- Never return the password or password hash.
- Never rely only on frontend role checks.
- Always verify the current session on the server.
- Do not return another user's information.
- Do not expose session secrets or internal database errors.
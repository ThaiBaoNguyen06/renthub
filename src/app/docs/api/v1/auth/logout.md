# POST /api/v1/auth/logout

## Description

Ends the current authenticated RentHub session.

The server invalidates or removes the user's session cookie.

---

## Endpoint

```http
POST /api/v1/auth/logout
```

---

## Authentication

Required.

The user must have a valid authenticated session.

---

## Request Headers

No JSON request body is required.

The session cookie is sent automatically by the browser.

---

## Request Body

None.

---

## Business Rules

1. The current session must be invalidated.
2. The authentication cookie must be removed or expired.
3. Logout must not delete the user account.
4. Logout must not change the user's account status.
5. After logout, protected endpoints must return `401 Unauthorized`.

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
  "message": "Logout successful"
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

Depending on the authentication implementation, logging out without a current session may also be treated as a successful idempotent operation.

### Internal Server Error

```http
500 Internal Server Error
```

```json
{
  "success": false,
  "message": "Unable to log out"
}
```

---

## Processing Flow

```text
Receive request
    ↓
Read current session
    ↓
Invalidate session
    ↓
Remove or expire authentication cookie
    ↓
Return success response
```

---

## Security Requirements

- Authentication cookies must be cleared securely.
- Do not return session secrets or tokens.
- After logout, the previous session must no longer provide access to protected routes.
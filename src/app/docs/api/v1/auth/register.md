# POST /api/v1/auth/register

## Description

Creates a new RentHub user account.

Public users may register with one of these roles:

- `client`
- `host`
- `agent`

The `admin` role cannot be created through public registration.

---

## Endpoint

```http
POST /api/v1/auth/register
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
| `fullName` | string | Yes | User's full name |
| `email` | string | Yes | Email used for login |
| `password` | string | Yes | Account password |
| `phone` | string | No | User's phone number |
| `role` | string | Yes | `client`, `host`, or `agent` |

### Example Request

```json
{
  "fullName": "Nguyen Thai Bao",
  "email": "bao@example.com",
  "password": "Password123",
  "phone": "0901234567",
  "role": "host"
}
```

---

## Validation Rules

### `fullName`

- Must be a string.
- Must contain between 2 and 120 characters.
- Leading and trailing spaces must be removed.

### `email`

- Must be a valid email address.
- Must be converted to lowercase.
- Must be unique.

### `password`

- Must contain at least 8 characters.
- Must not be stored as plain text.
- Must be hashed before insertion into the database.

### `phone`

- Optional.
- Must be stored as a string.
- Leading and trailing spaces must be removed.

### `role`

Must be one of:

```text
client
host
agent
```

The following role is forbidden:

```text
admin
```

---

## Business Rules

1. Email comparison is case-insensitive.
2. Duplicate email addresses are not allowed.
3. Public registration cannot create an admin account.
4. The default account status is `active`.
5. Passwords must be securely hashed.
6. Password and password hash must never appear in the response.

---

## Success Response

### Code

```http
201 Created
```

### JSON

```json
{
  "success": true,
  "message": "Account created successfully",
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

### Invalid Request Data

```http
400 Bad Request
```

```json
{
  "success": false,
  "message": "Invalid registration data",
  "errors": {
    "email": [
      "Please enter a valid email address"
    ],
    "password": [
      "Password must contain at least 8 characters"
    ]
  }
}
```

### Email Already Exists

```http
409 Conflict
```

```json
{
  "success": false,
  "message": "An account with this email already exists"
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

### Internal Server Error

```http
500 Internal Server Error
```

```json
{
  "success": false,
  "message": "Unable to create account"
}
```

---

## Database Operation

Creates one record in the `users` table.

Expected fields:

```text
id
full_name
email
password_hash
phone
role
status
created_at
updated_at
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
Validate fields
    ↓
Normalize name, email, and phone
    ↓
Check duplicate email
    ↓
Hash password
    ↓
Create user
    ↓
Return safe user information
```

---

## Security Requirements

- Never store plain-text passwords.
- Never return the password or password hash.
- Never allow public users to register as admin.
- Never trust frontend validation alone.
- Do not expose database errors or stack traces.
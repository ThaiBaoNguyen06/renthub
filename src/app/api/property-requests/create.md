# POST /api/v1/property-requests

## Description

Creates a new rental property request submitted by an authenticated Host.

The request is reviewed by an Agent before a public listing is created.

---

## Endpoint

```http
POST /api/v1/property-requests
```

---

## Authentication

Required.

The user must be logged in.

---

## Authorization

Host only.

Allowed role:

```text
host
```

If the user is logged in but is not a Host, return:

```http
403 Forbidden
```

---

## Request Headers

```http
Content-Type: application/json
```

The authentication session cookie is sent automatically by the browser.

---

## Request Body

| Field | Type | Required | Description |
|---|---|---:|---|
| `propertyType` | string | Yes | Type of rental property |
| `title` | string | Yes | Short property title |
| `description` | string | Yes | Property description |
| `addressLine` | string | Yes | Street/building address |
| `ward` | string | No | Ward |
| `district` | string | Yes | District |
| `city` | string | Yes | City |
| `expectedRent` | number | Yes | Expected rental price in VND |
| `pricePeriod` | string | Yes | Rental period, initially `month` |
| `bedrooms` | integer | Yes | Number of bedrooms |
| `bathrooms` | integer | Yes | Number of bathrooms |
| `areaSqm` | number | No | Property area in square metres |
| `hostNotes` | string | No | Additional information for Agent |

---

## Important

The frontend must NOT send:

```text
hostUserId
assignedAgentId
status
agentNotes
acceptedAt
```

These values are controlled by the backend.

`hostUserId` must be taken from:

```text
session.user.id
```

---

## Property Types

Initially supported:

```text
apartment
house
room
studio
villa
townhouse
office
shop
```

---

## Example Request

```json
{
  "propertyType": "apartment",
  "title": "2 Bedroom Apartment in District 7",
  "description": "Modern apartment near Crescent Mall with balcony and furnished interior.",
  "addressLine": "Nguyen Luong Bang",
  "ward": "Tan Phu",
  "district": "District 7",
  "city": "Ho Chi Minh City",
  "expectedRent": 18000000,
  "pricePeriod": "month",
  "bedrooms": 2,
  "bathrooms": 2,
  "areaSqm": 75,
  "hostNotes": "Available from September"
}
```

---

## Validation Rules

### `propertyType`

Must be one of:

```text
apartment
house
room
studio
villa
townhouse
office
shop
```

### `title`

- Must be a string.
- Must not be empty.
- Recommended maximum length: 200 characters.

### `description`

- Must be a string.
- Must not be empty.

### `addressLine`

- Required.
- Must not be empty.

### `district`

- Required.
- Must not be empty.

### `city`

- Required.
- Must not be empty.

### `expectedRent`

- Must be greater than 0.
- Stored as VND.
- Example:

```text
18000000
```

not:

```text
18 million
18 triệu
18,000,000 VND
```

### `pricePeriod`

For MVP:

```text
month
```

### `bedrooms`

- Must be an integer.
- Must be 0 or greater.

### `bathrooms`

- Must be an integer.
- Must be 0 or greater.

### `areaSqm`

- Optional.
- Must be greater than 0 if supplied.

### `hostNotes`

- Optional.
- Must be a string.

---

## Business Rules

1. The user must be authenticated.
2. The authenticated user must have the `host` role.
3. `hostUserId` must come from the authenticated session.
4. The client cannot choose an Agent when initially submitting the request.
5. `assignedAgentId` starts as `null`.
6. New requests always start with status:

```text
pending
```

7. `acceptedAt` starts as `null`.
8. The Host cannot create the public Listing directly.
9. An Agent must review the request before a Listing can be created.
10. The backend must ignore or reject protected fields sent by the client.

---

## Database Operation

Creates one record in:

```text
property_requests
```

The backend supplies:

```text
host_user_id = session.user.id
assigned_agent_id = null
status = pending
submitted_at = current timestamp
created_at = current timestamp
updated_at = current timestamp
```

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
  "message": "Property request submitted successfully",
  "data": {
    "propertyRequest": {
      "id": "f5acfa3f-430a-43f2-a9ba-3bf28ee8f040",
      "hostUserId": "8eeac9a6-2a63-4ebc-96fc-288611278456",
      "assignedAgentId": null,
      "propertyType": "apartment",
      "title": "2 Bedroom Apartment in District 7",
      "district": "District 7",
      "city": "Ho Chi Minh City",
      "expectedRent": "18000000",
      "pricePeriod": "month",
      "bedrooms": 2,
      "bathrooms": 2,
      "status": "pending",
      "submittedAt": "2026-08-10T11:30:00.000Z"
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
  "message": "Invalid property request data",
  "errors": {
    "expectedRent": [
      "Expected rent must be greater than 0"
    ]
  }
}
```

---

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

---

### Forbidden

```http
403 Forbidden
```

```json
{
  "success": false,
  "message": "Only Hosts can submit property requests"
}
```

---

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

---

### Internal Server Error

```http
500 Internal Server Error
```

```json
{
  "success": false,
  "message": "Unable to submit property request"
}
```

---

## Processing Flow

```text
Receive HTTP request
        ↓
Check Content-Type
        ↓
Read authenticated session
        ↓
Session exists?
        ├── No → 401
        ↓
Check role
        ↓
role == host?
        ├── No → 403
        ↓
Parse JSON body
        ↓
Validate request with Zod
        ↓
Get hostUserId from session
        ↓
Create property request
        ↓
status = pending
        ↓
Insert into PostgreSQL
        ↓
Return 201 Created
```

---

## Security Requirements

- Never trust `hostUserId` from the request body.
- Always get the Host identity from the authenticated session.
- Always perform authorization on the backend.
- Do not allow the frontend to set request status.
- Do not allow the frontend to assign an Agent.
- Do not expose database errors or stack traces.
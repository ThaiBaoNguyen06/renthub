# Users Table

## Purpose

Stores account information for RentHub users.

## Columns

| Column | Type | Required | Description |
|---|---|---:|---|
| `id` | UUID | Yes | Unique identifier |
| `full_name` | VARCHAR(120) | Yes | User's full name |
| `email` | VARCHAR(255) | Yes | Login email |
| `password_hash` | TEXT | Yes | Hashed password |
| `phone` | VARCHAR(20) | No | Phone number |
| `role` | ENUM | Yes | `client`, `host`, `agent`, `admin` |
| `status` | ENUM | Yes | `active`, `suspended`, `deactivated` |
| `created_at` | TIMESTAMP | Yes | Creation time |
| `updated_at` | TIMESTAMP | Yes | Last update time |

## Constraints

- `id` is the primary key.
- `email` must be unique.
- `email` must not be null.
- `password_hash` must not be null.
- `role` defaults according to registration input.
- `status` defaults to `active`.
- Public registration must not create `admin`.

## Relationships

The `users.id` column will later be referenced by:

- `property_requests.host_id`
- `property_requests.assigned_agent_id`
- `listings.host_id`
- `listings.agent_id`
- `enquiries.client_id`
- `enquiries.agent_id`
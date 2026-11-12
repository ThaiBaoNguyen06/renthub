# RentHub — MVP Specification v1.0

> English version of `output/pdf/RentHub-Dac-ta-MVP-v1.0.pdf` (the Vietnamese original).
> Scope and rules agreed with the project owner. This document describes the product to build, not features already implemented.
> Any scope change must update this document.

## 1. Goals and scope

A rental platform for District 7 that lets Hosts submit property details to Agents, lets Agents review and publish listings, and lets Clients search listings and send contact enquiries.

**Main flow:** Host submits a request → Agent claims it → approves → creates a draft listing → publishes → Client sends an enquiry.

### Roles

| Role | Main permissions |
|---|---|
| **Host** | Submit requests; view their own requests; edit when allowed; cancel before approval. |
| **Agent** | View the queue; claim requests; request changes; approve or reject; manage listings and enquiries. |
| **Client** | View and search public listings; log in to save listings and send enquiries. |

- Guests who are not logged in can still view listings.
- Only Host or Client accounts can self-register. Agent accounts are provisioned separately.
- **Out of MVP scope:** sales, payments, e-contracts, live chat, and advanced maps.

## 2. Two independent objects

- **Property Request:** the submission a Host sends for Agent review.
- **Listing:** the public post managed by an Agent; only visible to the public once published.

Approving a request does **not** mean publishing a listing. The Property Request stays `approved` when its Listing is published.

## 3. Property Request workflow

| Status | Meaning and next actions |
|---|---|
| `pending` | No Agent has claimed it. Agent claims → `accepted`. Host can edit or cancel. |
| `accepted` | An Agent is assigned. Agent requests changes → `needs_changes`; approves → `approved`; rejects → `rejected`. Host can cancel. |
| `needs_changes` | Host edits and resubmits → `accepted`, or cancels → `cancelled`. The assigned Agent stays the same. |
| `approved` | Approved. The Agent may create a draft Listing. |
| `rejected` | Rejected; final. The Host may create a new request. |
| `cancelled` | Cancelled by the Host; final. |

```
pending ──claim──▶ accepted ──approve──▶ approved
   │                 │  ▲  └──reject──▶ rejected
   │                 │  │
   │      request    │  │ resubmit
   │      changes    ▼  │
   │             needs_changes
   │                 │
   └──── cancel ─────┴──── (also from accepted) ──▶ cancelled
```

### Mandatory rules

- A Host can only view and act on their own requests.
- A Host can only edit content while the status is `pending` or `needs_changes`.
- A Host can cancel while the status is `pending`, `accepted` or `needs_changes`. Final statuses cannot be cancelled.
- Only the Agent who claimed a request can review it.
- Requesting changes and rejecting both require a reason.
- If two Agents claim the same request, only one succeeds.
- The backend controls the owner, assigned Agent and status; users must not be able to set these fields through content data.
- Store a status change history: who made the change, when, and the reason.

## 4. Listing workflow

Lifecycle: `draft → published → archived`.
An `archived` listing can go back to `draft` to be edited and republished.

- A Listing can only be created from an `approved` Property Request.
- MVP: each Property Request has at most one Listing.
- The assigned Agent creates and manages the Listing.
- The Listing stores its own public content: title, description, price, location and photos. Internal notes are never made public.
- A Listing can only be published when all required fields are filled and it has at least one photo.
- Only `published` listings appear on the marketplace; a listing is taken down by archiving it.

## 5. Enquiry workflow

Client logs in → opens a published listing → submits a contact message → the assigned Agent receives it.

Statuses: `new → contacted → closed`.

- A Client can only view their own enquiries.
- An Agent can only handle enquiries for listings they manage.

## 6. MVP completion criteria

The following real-world flow must work end to end:

> Host registers → submits a request → Agent requests changes → Host resubmits → Agent approves → creates and publishes a listing → Client finds the listing and sends an enquiry → Agent handles it.

The system must also be verified to block access to other users' data and to block invalid status transitions.

## Next step

Design the database tables and relationships based on this spec, then implement each feature with tests.

---
title: Stay Specification
description: Technical specification for the booking lifecycle state machine—states, transitions, holds, modifications, cancellations, and webhooks.
---

# Stay Specification

> **v0.1.0 Draft**

The booking lifecycle for hospitality reservations.

**Namespace URI:** `https://agenticbooking.org/stay/v1`

---

## 1. Overview

Stay defines the state machine for hospitality bookings—from availability request through post-stay completion.

```
REQUEST → AVAILABLE → HELD → BOOKED → CONFIRMED → BALANCED → ARRIVED → STAYED → COMPLETED
                                ↓          ↓           ↓
                           MODIFIED   CANCELLED     NO_SHOW
```

---

## 2. States

### 2.1 Primary States

| State | Meaning | Trigger |
|-------|---------|---------|
| `request` | Availability query initiated | Agent checks dates/units |
| `available` | Can be booked | Inventory check passed |
| `unavailable` | Cannot be booked | Inventory check failed |
| `held` | Temporarily reserved | Hold created (time-limited) |
| `booked` | Booking created, awaiting payment | Booking confirmed |
| `confirmed` | Deposit received | Deposit captured |
| `balanced` | Full payment received | Balance captured |
| `arrived` | Checked in | Check-in recorded |
| `stayed` | Checked out | Check-out recorded |
| `completed` | Stay closed | Post-stay processing done |

### 2.2 Branch States

| State | Meaning | Can Occur From |
|-------|---------|----------------|
| `modified` | Booking changed | booked, confirmed, balanced |
| `cancelled` | Booking cancelled | held, booked, confirmed, balanced |
| `no_show` | Guest did not arrive | confirmed, balanced |

---

## 3. Transitions

```
request     → available | unavailable
available   → held | booked | unavailable
held        → booked | cancelled | available (expired)
booked      → confirmed | cancelled | modified
confirmed   → balanced | cancelled | modified
balanced    → arrived | cancelled | modified | no_show
arrived     → stayed
stayed      → completed
```

---

## 4. Stay Object

```json
{
  "stay": {
    "id": "stay_8kf2m9xp",
    "status": "confirmed",
    "created_at": "2026-01-10T14:30:00Z",
    "updated_at": "2026-01-10T14:35:00Z",

    "venue": {
      "id": "the-roste-burnton",
      "ref": "https://theroste.co.uk/.well-known/agent.json"
    },

    "dates": {
      "check_in": "2026-03-15",
      "check_out": "2026-03-17",
      "nights": 2
    },

    "guests": {
      "adults": 2,
      "children": 0,
      "names": [{ "first": "Jane", "last": "Smith", "primary": true }]
    },

    "units": [{
      "id": "garden-view-double",
      "name": "Garden View Double",
      "quantity": 1
    }],

    "payment": {
      "total": { "amount": 29000, "currency": "GBP" },
      "deposit": { "amount": 5000, "status": "captured" },
      "balance": { "amount": 24000, "status": "pending", "due_date": "2026-03-01" }
    },

    "history": [
      { "timestamp": "2026-01-10T14:30:00Z", "from_status": null, "to_status": "request", "actor": "agent:claude" },
      { "timestamp": "2026-01-10T14:35:00Z", "from_status": "booked", "to_status": "confirmed", "actor": "payment:stripe" }
    ]
  }
}
```

### 4.1 Required Fields

| Field | Description |
|-------|-------------|
| `stay.id` | Unique identifier. Format: `stay_{random}` |
| `stay.status` | Current lifecycle state |
| `stay.venue.ref` | URI to venue's Bookable record |
| `stay.dates` | Check-in, check-out, nights |
| `stay.guests.adults` | Number of adult guests |
| `stay.history` | Immutable audit trail |

---

## 5. Holds

Temporary inventory reservation before booking commitment.

```json
{
  "hold": {
    "id": "hold_abc789",
    "stay_id": "stay_8kf2m9xp",
    "status": "active",
    "expires_at": "2026-01-10T14:46:00Z",
    "duration_minutes": 15
  }
}
```

- Holds MUST have configurable expiry (typically 10-30 minutes)
- Holds auto-release on expiry
- Holds convert to booking on confirmation

---

## 6. Modifications

```json
{
  "modification": {
    "modified_at": "2026-02-15T09:00:00Z",
    "modified_by": "agent:claude",
    "changes": [
      { "field": "dates.check_out", "from": "2026-03-17", "to": "2026-03-18" }
    ],
    "price_difference": { "amount": 14500, "currency": "GBP" }
  }
}
```

After modification, stay returns to its previous primary state.

---

## 7. Cancellations

```json
{
  "cancellation": {
    "cancelled_at": "2026-02-20T10:00:00Z",
    "cancelled_by": "user",
    "reason": "change_of_plans",
    "days_before_check_in": 23,
    "refund": { "amount": 5000, "currency": "GBP", "percent": 100, "status": "processed" }
  }
}
```

Refund calculation is venue-defined based on cancellation policy.

---

## 8. Webhooks

| Event | Trigger |
|-------|---------|
| `stay.created` | New stay created |
| `stay.status_changed` | Status transition |
| `stay.modified` | Booking modified |
| `stay.cancelled` | Booking cancelled |
| `stay.no_show` | No-show detected |
| `hold.created` | Hold created |
| `hold.expired` | Hold expired |

---

## 9. Transport Bindings

### REST

```
POST /stays              Create stay
GET  /stays/{id}         Get stay
POST /stays/{id}/hold    Create hold
POST /stays/{id}/book    Confirm booking
POST /stays/{id}/cancel  Cancel
POST /stays/{id}/modify  Modify
```

### MCP

```json
{
  "method": "tools/call",
  "params": {
    "name": "create_stay",
    "arguments": {
      "venue_id": "the-roste-burnton",
      "check_in": "2026-03-15",
      "check_out": "2026-03-17",
      "adults": 2
    }
  }
}
```

---

## 10. Actor Types

| Pattern | Description |
|---------|-------------|
| `agent:{name}` | AI agent (e.g., `agent:claude`) |
| `user` | Human user |
| `system` | Automated process |
| `payment:{provider}` | Payment processor |
| `venue` | Venue staff/system |
| `pms:{name}` | Property management system |

---

## Related Specifications

- [Bookable Spec](../bookable/spec.md) — Base pattern
- [Venue Spec](../venue/spec.md) — Hospitality extension
- [Folio Spec](../folio/spec.md) — Payment semantics

---

> Stay is an open specification under MIT license.

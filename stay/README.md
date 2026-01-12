# Stay

The booking lifecycle.

---

## What Stay is

Stay tracks a booking through its lifecycle — from request to completion.

Where retail orders move through `placed → shipped → delivered`, hospitality bookings move through a different sequence tied to future dates, payments, and physical arrival.

---

## Lifecycle states

```
                    ┌─────────────┐
                    │   REQUEST   │
                    └──────┬──────┘
                           │
              ┌────────────┼────────────┐
              ▼                         ▼
      ┌─────────────┐           ┌─────────────┐
      │  AVAILABLE  │           │ UNAVAILABLE │
      └──────┬──────┘           └─────────────┘
             │
             ▼
      ┌─────────────┐
      │    HELD     │ (optional, time-limited)
      └──────┬──────┘
             │
             ▼
      ┌─────────────┐
      │   BOOKED    │
      └──────┬──────┘
             │
             ▼
      ┌─────────────┐
      │  CONFIRMED  │ (deposit received)
      └──────┬──────┘
             │
             ▼
      ┌─────────────┐
      │  BALANCED   │ (full payment received)
      └──────┬──────┘
             │
             ▼
      ┌─────────────┐
      │   ARRIVED   │ (checked in)
      └──────┬──────┘
             │
             ▼
      ┌─────────────┐
      │   STAYED    │ (checked out)
      └──────┬──────┘
             │
             ▼
      ┌─────────────┐
      │  COMPLETED  │
      └─────────────┘


Branch states (can occur from multiple points):

      ┌─────────────┐
      │  MODIFIED   │
      └─────────────┘

      ┌─────────────┐
      │  CANCELLED  │
      └─────────────┘

      ┌─────────────┐
      │   NO_SHOW   │
      └─────────────┘
```

---

## State definitions

### Primary states

| State | Meaning | Triggers |
|-------|---------|----------|
| `request` | Availability query initiated | Agent checks dates/units |
| `available` | Requested dates/unit can be booked | Inventory check passed |
| `unavailable` | Requested dates/unit cannot be booked | Inventory check failed |
| `held` | Temporarily reserved, pending booking | Hold created (time-limited) |
| `booked` | Booking created, awaiting payment | Booking confirmed |
| `confirmed` | Deposit received | Deposit payment captured |
| `balanced` | Full payment received | Balance payment captured |
| `arrived` | Guest checked in | Check-in recorded |
| `stayed` | Guest checked out | Check-out recorded |
| `completed` | Stay fully closed | Post-stay processing done |

### Branch states

| State | Meaning | Can occur from |
|-------|---------|----------------|
| `modified` | Booking changed (dates, room, guests) | booked, confirmed, balanced |
| `cancelled` | Booking cancelled | held, booked, confirmed, balanced |
| `no_show` | Guest did not arrive | confirmed, balanced |

---

## State transitions

### Valid transitions

```
request     → available | unavailable
available   → held | booked | unavailable (if inventory changes)
held        → booked | cancelled | available (if hold expires)
booked      → confirmed | cancelled | modified
confirmed   → balanced | cancelled | modified
balanced    → arrived | cancelled | modified | no_show
arrived     → stayed
stayed      → completed
```

### Transition triggers

| Transition | Trigger | Actor |
|------------|---------|-------|
| request → available | Inventory check | System |
| available → held | Hold request | Agent |
| held → booked | Booking confirmation | Agent |
| booked → confirmed | Deposit captured | Payment handler |
| confirmed → balanced | Balance captured | Payment handler |
| balanced → arrived | Check-in | Venue/PMS |
| arrived → stayed | Check-out | Venue/PMS |
| stayed → completed | Post-stay processing | System |
| * → cancelled | Cancellation request | Agent/User |
| * → modified | Modification request | Agent/User |
| balanced → no_show | No arrival after threshold | System |

---

## Stay object

```json
{
  "stay": {
    "id": "stay_abc123",
    "status": "confirmed",
    "created_at": "2026-01-10T14:30:00Z",
    "updated_at": "2026-01-10T14:35:00Z",
    
    "venue": {
      "id": "white-lion-blakeney",
      "ref": "https://whitelionblakeney.co.uk/.well-known/ucp"
    },
    
    "dates": {
      "check_in": "2026-03-15",
      "check_out": "2026-03-17",
      "nights": 2
    },
    
    "guests": {
      "adults": 2,
      "children": 0,
      "names": [
        { "first": "Jane", "last": "Smith", "primary": true }
      ]
    },
    
    "units": [
      {
        "id": "harbour-view-double",
        "name": "Harbour View Double",
        "quantity": 1
      }
    ],
    
    "payment": {
      "total": {
        "amount": 29000,
        "currency": "GBP"
      },
      "deposit": {
        "amount": 5000,
        "status": "captured",
        "captured_at": "2026-01-10T14:35:00Z"
      },
      "balance": {
        "amount": 24000,
        "status": "pending",
        "due_date": "2026-03-01"
      }
    },
    
    "folio_ref": "https://whitelionblakeney.co.uk/.well-known/ucp#folio",
    "mandate_ref": "ap2:mandate:xyz789",
    
    "history": [
      {
        "timestamp": "2026-01-10T14:30:00Z",
        "from_status": null,
        "to_status": "request",
        "actor": "agent:claude"
      },
      {
        "timestamp": "2026-01-10T14:30:05Z",
        "from_status": "request",
        "to_status": "available",
        "actor": "system"
      },
      {
        "timestamp": "2026-01-10T14:32:00Z",
        "from_status": "available",
        "to_status": "booked",
        "actor": "agent:claude"
      },
      {
        "timestamp": "2026-01-10T14:35:00Z",
        "from_status": "booked",
        "to_status": "confirmed",
        "actor": "payment:stripe",
        "details": { "payment_intent": "pi_xxx" }
      }
    ]
  }
}
```

---

## Holds

Optional temporary reservation before booking:

```json
{
  "hold": {
    "id": "hold_xyz",
    "stay_id": "stay_abc123",
    "status": "active",
    "created_at": "2026-01-10T14:31:00Z",
    "expires_at": "2026-01-10T14:46:00Z",
    "duration_minutes": 15
  }
}
```

Holds:
- Reserve inventory temporarily
- Have configurable expiry (typically 10-30 minutes)
- Auto-release on expiry
- Convert to booking on confirmation

---

## Cancellation

When a stay is cancelled:

```json
{
  "stay": {
    "id": "stay_abc123",
    "status": "cancelled",
    "cancellation": {
      "cancelled_at": "2026-02-20T10:00:00Z",
      "cancelled_by": "user",
      "reason": "change_of_plans",
      "days_before_check_in": 23,
      "refund": {
        "amount": 5000,
        "currency": "GBP",
        "percent": 100,
        "status": "processed"
      }
    }
  }
}
```

Refund amount calculated from booking terms cancellation policy.

---

## Modification

When a stay is modified:

```json
{
  "stay": {
    "id": "stay_abc123",
    "status": "modified",
    "modification": {
      "modified_at": "2026-02-15T09:00:00Z",
      "modified_by": "agent:claude",
      "changes": [
        {
          "field": "dates.check_out",
          "from": "2026-03-17",
          "to": "2026-03-18"
        }
      ],
      "fee": {
        "amount": 2500,
        "currency": "GBP"
      },
      "price_difference": {
        "amount": 14500,
        "currency": "GBP"
      }
    }
  }
}
```

After modification, stay returns to its previous primary state (e.g., `confirmed`).

---

## No-show

When guest doesn't arrive:

```json
{
  "stay": {
    "id": "stay_abc123",
    "status": "no_show",
    "no_show": {
      "detected_at": "2026-03-16T15:00:00Z",
      "hours_after_check_in": 24,
      "charge": {
        "amount": 29000,
        "currency": "GBP",
        "percent": 100,
        "status": "captured"
      }
    }
  }
}
```

---

## Comparison to retail

| Retail order | Hospitality stay |
|--------------|------------------|
| placed | booked |
| payment_pending | booked |
| paid | confirmed / balanced |
| processing | — |
| shipped | — |
| in_transit | — |
| delivered | stayed |
| completed | completed |
| cancelled | cancelled |
| refunded | cancelled (with refund) |

---

## Webhooks

Venues notify agents of state changes via webhooks:

```json
{
  "type": "stay.status_changed",
  "stay_id": "stay_abc123",
  "from_status": "booked",
  "to_status": "confirmed",
  "timestamp": "2026-01-10T14:35:00Z",
  "details": {
    "payment_intent": "pi_xxx"
  }
}
```

### Webhook events

| Event | Trigger |
|-------|---------|
| `stay.created` | New stay created |
| `stay.status_changed` | Status transition |
| `stay.modified` | Booking modified |
| `stay.cancelled` | Booking cancelled |
| `stay.no_show` | No-show detected |
| `hold.created` | Hold created |
| `hold.expired` | Hold expired |
| `hold.converted` | Hold converted to booking |

---

## Transport bindings

### REST

```
POST /stays
GET  /stays/{id}
POST /stays/{id}/hold
POST /stays/{id}/book
POST /stays/{id}/cancel
POST /stays/{id}/modify
POST /stays/{id}/check-in
POST /stays/{id}/check-out
```

### MCP

```json
{
  "method": "get_stay",
  "params": {
    "stay_id": "stay_abc123"
  }
}
```

```json
{
  "method": "cancel_stay",
  "params": {
    "stay_id": "stay_abc123",
    "reason": "change_of_plans"
  }
}
```

---

## Status

**Version:** 0.1.0 (Draft)  
**License:** MIT

---

## Related

- [Venue](/venue): The bookable entity
- [Folio](/folio): Payment semantics
- [UCP Integration](/docs/ucp-integration.md): Protocol integration

# Stay Specification

**Version:** 0.1.0 (Draft)  
**Namespace:** `dev.ucp.hospitality.stay` (proposed)  
**License:** MIT

---

## 1. Purpose

Stay defines the lifecycle states for hospitality bookings within UCP.

See [README](../README.md) for full documentation.

---

## 2. States

### 2.1 Primary States

| State | Description |
|-------|-------------|
| `request` | Availability query initiated |
| `available` | Dates/unit can be booked |
| `unavailable` | Dates/unit cannot be booked |
| `held` | Temporarily reserved (time-limited) |
| `booked` | Booking created, awaiting payment |
| `confirmed` | Deposit received |
| `balanced` | Full payment received |
| `arrived` | Guest checked in |
| `stayed` | Guest checked out |
| `completed` | Stay fully closed |

### 2.2 Branch States

| State | Description |
|-------|-------------|
| `modified` | Booking changed |
| `cancelled` | Booking cancelled |
| `no_show` | Guest did not arrive |

---

## 3. Schema

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://ucp.dev/schemas/hospitality/stay.json",
  
  "type": "object",
  "properties": {
    "id": { "type": "string" },
    "status": {
      "type": "string",
      "enum": [
        "request", "available", "unavailable", "held",
        "booked", "confirmed", "balanced",
        "arrived", "stayed", "completed",
        "modified", "cancelled", "no_show"
      ]
    },
    "venue": {
      "type": "object",
      "properties": {
        "id": { "type": "string" },
        "ref": { "type": "string", "format": "uri" }
      }
    },
    "dates": {
      "type": "object",
      "properties": {
        "check_in": { "type": "string", "format": "date" },
        "check_out": { "type": "string", "format": "date" },
        "nights": { "type": "integer" }
      }
    },
    "guests": {
      "type": "object",
      "properties": {
        "adults": { "type": "integer" },
        "children": { "type": "integer" }
      }
    },
    "units": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "id": { "type": "string" },
          "name": { "type": "string" },
          "quantity": { "type": "integer" }
        }
      }
    },
    "history": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "timestamp": { "type": "string", "format": "date-time" },
          "from_status": { "type": "string" },
          "to_status": { "type": "string" },
          "actor": { "type": "string" }
        }
      }
    }
  },
  "required": ["id", "status", "venue", "dates"]
}
```

---

## 4. Webhooks

| Event | Description |
|-------|-------------|
| `stay.created` | New stay created |
| `stay.status_changed` | Status transition |
| `stay.modified` | Booking modified |
| `stay.cancelled` | Booking cancelled |
| `stay.no_show` | No-show detected |
| `hold.created` | Hold created |
| `hold.expired` | Hold expired |
| `hold.converted` | Hold converted to booking |

---

## 5. Transport Bindings

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
  "params": { "stay_id": "stay_abc123" }
}
```

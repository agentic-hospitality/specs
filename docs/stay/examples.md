---
title: Stay Examples
description: Working JSON examples for the complete booking lifecycle—availability, holds, confirmations, modifications, and cancellations.
---

# Stay Examples

Lifecycle flow from request to completion.

---

## Booking Flow

### 1. Request → Available

```json
{
  "stay": {
    "id": "stay_8kf2m9xp",
    "status": "available",
    "venue": {
      "id": "the-roste-burnton",
      "ref": "https://theroste.co.uk/.well-known/agent.json"
    },
    "dates": { "check_in": "2026-03-15", "check_out": "2026-03-17", "nights": 2 },
    "guests": { "adults": 2 },
    "units": [{
      "id": "garden-view-double",
      "name": "Garden View Double",
      "rate": { "amount": 14500, "currency": "GBP", "per": "night" }
    }],
    "payment": { "total": { "amount": 29000, "currency": "GBP" } }
  }
}
```

### 2. Booked → Confirmed

```json
{
  "stay": {
    "id": "stay_8kf2m9xp",
    "status": "confirmed",
    "payment": {
      "total": { "amount": 29000, "currency": "GBP" },
      "deposit": { "amount": 5000, "status": "captured", "captured_at": "2026-01-10T14:35:00Z" },
      "balance": { "amount": 24000, "status": "pending", "due_date": "2026-03-01" }
    },
    "history": [
      { "timestamp": "2026-01-10T14:30:00Z", "from_status": null, "to_status": "request", "actor": "agent:claude" },
      { "timestamp": "2026-01-10T14:30:05Z", "from_status": "request", "to_status": "available", "actor": "system" },
      { "timestamp": "2026-01-10T14:32:00Z", "from_status": "available", "to_status": "booked", "actor": "agent:claude" },
      { "timestamp": "2026-01-10T14:35:00Z", "from_status": "booked", "to_status": "confirmed", "actor": "payment:stripe" }
    ]
  }
}
```

### 3. Balanced → Arrived → Stayed → Completed

```json
{
  "stay": {
    "id": "stay_8kf2m9xp",
    "status": "completed",
    "arrival": { "checked_in_at": "2026-03-15T15:30:00Z", "room_assigned": "Room 7" },
    "departure": { "checked_out_at": "2026-03-17T10:45:00Z" },
    "history": [
      { "timestamp": "2026-03-15T15:30:00Z", "from_status": "balanced", "to_status": "arrived", "actor": "pms:opera" },
      { "timestamp": "2026-03-17T10:45:00Z", "from_status": "arrived", "to_status": "stayed", "actor": "pms:opera" },
      { "timestamp": "2026-03-17T12:00:00Z", "from_status": "stayed", "to_status": "completed", "actor": "system" }
    ]
  }
}
```

---

## Branch States

### Modification

```json
{
  "stay": {
    "id": "stay_8kf2m9xp",
    "status": "confirmed",
    "dates": { "check_in": "2026-03-15", "check_out": "2026-03-18", "nights": 3 },
    "modification": {
      "modified_at": "2026-02-15T09:00:00Z",
      "modified_by": "agent:claude",
      "changes": [{ "field": "dates.check_out", "from": "2026-03-17", "to": "2026-03-18" }],
      "price_difference": { "amount": 14500, "currency": "GBP" }
    }
  }
}
```

### Cancellation

```json
{
  "stay": {
    "id": "stay_8kf2m9xp",
    "status": "cancelled",
    "cancellation": {
      "cancelled_at": "2026-02-20T10:00:00Z",
      "cancelled_by": "user",
      "reason": "change_of_plans",
      "days_before_check_in": 23,
      "refund": { "amount": 5000, "currency": "GBP", "percent": 100, "status": "processed" }
    }
  }
}
```

### No-Show

```json
{
  "stay": {
    "id": "stay_noshow456",
    "status": "no_show",
    "no_show": {
      "detected_at": "2026-03-16T15:00:00Z",
      "hours_after_check_in": 24,
      "charge": { "amount": 29000, "currency": "GBP", "percent": 100, "status": "captured" }
    }
  }
}
```

---

## Webhooks

### Status Changed

```json
{
  "type": "stay.status_changed",
  "stay_id": "stay_8kf2m9xp",
  "timestamp": "2026-01-10T14:35:00Z",
  "from_status": "booked",
  "to_status": "confirmed",
  "details": { "deposit_amount": 5000 }
}
```

### Cancelled

```json
{
  "type": "stay.cancelled",
  "stay_id": "stay_8kf2m9xp",
  "timestamp": "2026-02-20T10:00:00Z",
  "cancelled_by": "user",
  "refund": { "amount": 5000, "status": "processed" }
}
```

---

## Restaurant Booking

Stay applies to any reservation, including restaurants:

```json
{
  "stay": {
    "id": "stay_dinner456",
    "status": "confirmed",
    "venue": {
      "id": "the-rambling-duck",
      "ref": "https://ramblingduck.co.uk/.well-known/agent.json",
      "type": "restaurant"
    },
    "dates": {
      "check_in": "2026-02-14",
      "check_out": "2026-02-14",
      "nights": 0,
      "time": "19:30",
      "duration_minutes": 120
    },
    "guests": { "adults": 4 },
    "units": [{ "id": "table-garden-room", "name": "Garden Room Table", "covers": 4 }],
    "payment": {
      "deposit": { "amount": 2000, "status": "captured", "note": "No-show guarantee" }
    }
  }
}
```

> **Tip:** For restaurants, `nights` is 0 and `time` + `duration_minutes` define the reservation window.

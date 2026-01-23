---
title: Folio Specification
description: Technical specification for payment semantics—schedules, cancellation tiers, no-show policies, modifications, and mandate integration.
---

# Folio Specification

> **v0.1.0 Draft**

Payment semantics for hospitality bookings.

**Namespace URI:** `https://agenticbooking.org/folio/v1`

---

## 1. Overview

Folio defines the financial terms of a Stay—when money moves and under what conditions.

```json
{
  "folio": {
    "venue_ref": "https://theroste.co.uk/.well-known/agent.json",
    "stay_dates": { "check_in": "2026-03-15", "check_out": "2026-03-17" },
    "payment_schedule": [...],
    "cancellation_policy": {...},
    "no_show_policy": {...},
    "modification_policy": {...}
  }
}
```

---

## 2. Payment Schedule

Defines when money moves:

```json
{
  "payment_schedule": [
    {
      "type": "deposit",
      "amount": { "amount": 5000, "currency": "GBP" },
      "due": "on_booking",
      "status": "captured"
    },
    {
      "type": "balance",
      "amount": { "amount": 24000, "currency": "GBP" },
      "due": "14_days_before",
      "due_date": "2026-03-01",
      "status": "pending"
    }
  ]
}
```

### 2.1 Due Values

| Value | Meaning |
|-------|---------|
| `on_booking` | Charge immediately |
| `N_days_before` | Charge N days before check-in |
| `on_arrival` | Charge at check-in |
| `on_departure` | Charge at check-out |
| ISO date | Charge on specific date |

### 2.2 Payment Types

| Type | Description |
|------|-------------|
| `verification` | Small charge (£1-5) to confirm card validity |
| `deposit` | Partial payment at booking time |
| `balance` | Remaining payment before or at arrival |
| `incidentals` | Additional charges during stay |

---

## 3. Cancellation Policy

Tiered refund decay based on days before check-in:

```json
{
  "cancellation_policy": {
    "policy_hash": "sha256:a1b2c3...",
    "tiers": [
      { "days_before": 14, "refund_percent": 100 },
      { "days_before": 7, "refund_percent": 50 },
      { "days_before": 0, "refund_percent": 0 }
    ]
  }
}
```

The `policy_hash` is a SHA-256 of the policy JSON, ensuring terms can't change after booking.

### 3.1 Cancellation Flow

1. Agent requests cancellation
2. System checks tiers against days remaining
3. Calculates refund amount
4. Executes refund via payment handler
5. Mandate provides audit trail

---

## 4. No-Show Policy

What happens if the guest doesn't arrive:

```json
{
  "no_show_policy": {
    "charge_percent": 100,
    "detect_after_hours": 24,
    "proof_method": "pms_attestation"
  }
}
```

### 4.1 Proof Methods

| Method | Description |
|--------|-------------|
| `pms_attestation` | Signed record from Property Management System |
| `keycard_inactive` | No room key activated by detection time |
| `checkin_system_log` | Timestamped check-in system records |
| `front_desk_declaration` | Staff attestation (lowest evidentiary weight) |

---

## 5. Modification Policy

Rules for changing bookings after confirmation:

```json
{
  "modification_policy": {
    "allowed": true,
    "fee": { "amount": 2500, "currency": "GBP" },
    "restrictions": [
      "no_date_change_within_7_days",
      "no_room_downgrade"
    ],
    "requires_mandate_amendment_if_increase": true
  }
}
```

If modifications increase the total liability, the mandate may require re-signing.

---

## 6. Mandate Integration

Booking terms are captured in an AP2 mandate—cryptographic proof of what was authorized:

```json
{
  "authorized_charges": [
    {
      "type": "deposit",
      "max_amount": { "amount": 5000, "currency": "GBP" }
    },
    {
      "type": "balance",
      "max_amount": { "amount": 24000, "currency": "GBP" },
      "valid_from": "2026-03-01"
    },
    {
      "type": "no_show",
      "max_amount": { "amount": 29000, "currency": "GBP" },
      "valid_from": "2026-03-16"
    }
  ]
}
```

The signed mandate proves the user authorized specific charges at specific times.

---

## 7. Payment Execution Modes

| Mode | How It Works | Use Case |
|------|--------------|----------|
| **Immediate** | Charge captured now | Same-day bookings, prepaid rates |
| **Deferred** | Card stored, scheduled charges later | Future bookings |

```
Deferred flow:

1. User authorizes via AP2 mandate
2. SetupIntent stores payment method
3. On due date: PaymentIntent charges stored method
4. Mandate provides proof of authorization
```

---

## 8. Transport Bindings

### REST

```
POST /checkout              Create booking with folio
POST /checkout/{id}/cancel  Cancel booking
POST /checkout/{id}/modify  Modify booking
```

### MCP

```json
{
  "method": "tools/call",
  "params": {
    "name": "create_booking",
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

## Related Specifications

- [Bookable Spec](../bookable/spec.md) — Base pattern
- [Venue Spec](../venue/spec.md) — Venue identity and policies
- [Stay Spec](../stay/spec.md) — Booking lifecycle

---

> Folio is an open specification under MIT license.

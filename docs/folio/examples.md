---
title: Folio Examples
description: Working JSON examples for payment schedules, cancellation scenarios, no-show handling, modifications, and restaurant bookings.
---

# Folio Examples

Payment schedules, cancellation policies, and complete booking examples.

---

## Complete Booking with Folio

A confirmed booking with deposit, balance, and full policy terms:

```json
{
  "booking": {
    "id": "bkg_8kf2m9xp",
    "status": "confirmed",
    "total": { "amount": 29000, "currency": "GBP" },

    "folio": {
      "venue_ref": "https://theroste.co.uk/.well-known/agent.json",
      "stay_dates": {
        "check_in": "2026-03-15",
        "check_out": "2026-03-17"
      },

      "payment_schedule": [
        {
          "type": "deposit",
          "amount": { "amount": 5000, "currency": "GBP" },
          "due": "on_booking",
          "status": "captured",
          "captured_at": "2026-01-10T14:35:00Z"
        },
        {
          "type": "balance",
          "amount": { "amount": 24000, "currency": "GBP" },
          "due": "14_days_before",
          "due_date": "2026-03-01",
          "status": "pending"
        }
      ],

      "cancellation_policy": {
        "policy_hash": "sha256:a1b2c3def456...",
        "tiers": [
          { "days_before": 14, "refund_percent": 100 },
          { "days_before": 7, "refund_percent": 50 },
          { "days_before": 0, "refund_percent": 0 }
        ]
      },

      "no_show_policy": {
        "charge_percent": 100,
        "detect_after_hours": 24,
        "proof_method": "pms_attestation"
      },

      "modification_policy": {
        "allowed": true,
        "fee": { "amount": 2500, "currency": "GBP" },
        "restrictions": ["no_date_change_within_7_days"]
      }
    }
  }
}
```

---

## Payment Schedule Variants

### Prepaid (No Refund)

```json
{
  "payment_schedule": [
    {
      "type": "full_payment",
      "amount": { "amount": 25000, "currency": "GBP" },
      "due": "on_booking",
      "status": "captured"
    }
  ],
  "cancellation_policy": {
    "tiers": [{ "days_before": 0, "refund_percent": 0 }]
  }
}
```

### Pay at Hotel

```json
{
  "payment_schedule": [
    {
      "type": "verification",
      "amount": { "amount": 100, "currency": "GBP" },
      "due": "on_booking",
      "status": "captured",
      "refundable": true
    },
    {
      "type": "balance",
      "amount": { "amount": 29000, "currency": "GBP" },
      "due": "on_arrival",
      "status": "pending"
    }
  ]
}
```

---

## Cancellation Scenarios

### Cancelled 14+ Days Before (Full Refund)

```json
{
  "cancellation": {
    "cancelled_at": "2026-02-28T10:00:00Z",
    "days_before_check_in": 15,
    "tier_applied": { "days_before": 14, "refund_percent": 100 },
    "refund": {
      "amount": { "amount": 5000, "currency": "GBP" },
      "status": "processed"
    }
  }
}
```

### Cancelled 3 Days Before (No Refund)

```json
{
  "cancellation": {
    "cancelled_at": "2026-03-12T10:00:00Z",
    "days_before_check_in": 3,
    "tier_applied": { "days_before": 0, "refund_percent": 0 },
    "refund": null,
    "retained": { "amount": 5000, "currency": "GBP" }
  }
}
```

---

## No-Show

```json
{
  "no_show": {
    "detected_at": "2026-03-16T15:00:00Z",
    "hours_after_check_in": 24,
    "proof": {
      "method": "pms_attestation",
      "pms": "opera",
      "attestation_id": "att_xyz789"
    },
    "charge": {
      "amount": { "amount": 29000, "currency": "GBP" },
      "status": "captured"
    }
  }
}
```

---

## Modification

### Date Extension with Fee

```json
{
  "modification": {
    "modified_at": "2026-02-15T09:00:00Z",
    "changes": [
      { "field": "check_out", "from": "2026-03-17", "to": "2026-03-18" }
    ],
    "fee": { "amount": 2500, "currency": "GBP" },
    "price_difference": { "amount": 14500, "currency": "GBP" },
    "new_total": { "amount": 46000, "currency": "GBP" },
    "mandate_amended": true
  }
}
```

---

## Restaurant Booking

Folio applies to any reservation type:

```json
{
  "booking": {
    "id": "bkg_dinner456",
    "folio": {
      "venue_ref": "https://ramblingduck.co.uk/.well-known/agent.json",
      "stay_dates": {
        "check_in": "2026-02-14",
        "check_out": "2026-02-14",
        "time": "19:30"
      },

      "payment_schedule": [
        {
          "type": "deposit",
          "amount": { "amount": 2000, "currency": "GBP" },
          "due": "on_booking",
          "note": "No-show guarantee, £5 per cover"
        }
      ],

      "cancellation_policy": {
        "tiers": [
          { "hours_before": 24, "refund_percent": 100 },
          { "hours_before": 0, "refund_percent": 0 }
        ]
      },

      "no_show_policy": {
        "charge_percent": 100,
        "detect_after_hours": 1
      }
    }
  }
}
```

> **Tip:** For restaurants, cancellation tiers may use `hours_before` instead of `days_before`.

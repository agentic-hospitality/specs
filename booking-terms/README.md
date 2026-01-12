# Booking Terms

Hospitality booking obligations and lifecycle semantics.

---

## What Booking Terms is

Booking Terms defines what hospitality transactions mean, independent of how those obligations are executed or paid for.

Hospitality transactions are agreements governing future-conditional payment execution, not immediate exchanges of value. When you book a hotel, you might pay a deposit now, balance at check-in, get a refund if you cancel, or be charged if you don't show up.

Booking Terms defines:

- Deposit schedules
- Balance timing
- Cancellation tiers
- No-show policies
- Modification rules

These terms can be carried over:

Payment authorization systems
Commerce orchestration layers
Direct PSP integrations
However you process payments

Same semantics, many carriers.

---

## Why hospitality is different

| Aspect | Retail | Hospitality |
|--------|--------|-------------|
| Payment timing | At purchase | Split across dates |
| Fulfilment | Days after payment | Weeks/months after booking |
| Cancellation | Rarely allowed | Core feature with refund decay |
| No-show | N/A | Triggers penalty charge |

```
Retail:      Intent → Cart → Pay → Ship → Done

Hospitality: Intent → Book → Deposit → [weeks] → Balance → Stay
                                  ↓
                            Cancel? Modify? No-show?
```

---

## Structure

Booking Terms is defined as a JSON Schema. When mapped onto UCP, it composes with checkout via `allOf`:

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://agentic-hospitality.org/schemas/booking-terms.json",
  
  "type": "object",
  "properties": {
    "stay_dates": {
      "type": "object",
      "properties": {
        "check_in": { "type": "string", "format": "date" },
        "check_out": { "type": "string", "format": "date" }
      },
      "required": ["check_in", "check_out"]
    },
    "payment_schedule": {
      "type": "array",
      "items": { "$ref": "#/$defs/scheduled_payment" }
    },
    "cancellation_policy": { "$ref": "#/$defs/cancellation_policy" },
    "no_show_policy": { "$ref": "#/$defs/no_show_policy" },
    "modification_policy": { "$ref": "#/$defs/modification_policy" }
  },
  "required": ["stay_dates", "payment_schedule", "cancellation_policy"]
}
```

---

## Complete example

A booking with deposit, balance, and cancellation terms:

```json
{
  "booking": {
    "id": "bkg_abc123",
    "status": "confirmed",
    "total": {
      "amount": 29000,
      "currency": "GBP"
    },
    
    "booking_terms": {
      "venue_ref": "https://whitelionblakeney.co.uk/.well-known/venue.json",
      "stay_dates": {
        "check_in": "2026-03-15",
        "check_out": "2026-03-17"
      },
      
      "payment_schedule": [
        {
          "type": "deposit",
          "amount": 5000,
          "currency": "GBP",
          "due": "on_booking",
          "status": "captured"
        },
        {
          "type": "balance",
          "amount": 24000,
          "currency": "GBP",
          "due": "14_days_before",
          "due_date": "2026-03-01",
          "status": "pending"
        }
      ],
      
      "cancellation_policy": {
        "policy_hash": "sha256:a1b2c3...",
        "tiers": [
          { "days_before": 14, "refund_percent": 100 },
          { "days_before": 7, "refund_percent": 50 },
          { "days_before": 0, "refund_percent": 0 }
        ]
      },
      
      "no_show_policy": {
        "charge_percent": 100,
        "detect_after_hours": 24
      },
      
      "modification_policy": {
        "allowed": true,
        "fee": {
          "amount": 2500,
          "currency": "GBP"
        },
        "restrictions": ["no_date_change_within_7_days"]
      }
    }
  },
  
  "payment": {
    "ap2_mandate": "eyJ...",
    "handler": "com.stripe.connect",
    "payment_method_id": "pm_xxx"
  }
}
```

---

## Payment schedule

Defines when money moves:

```json
{
  "payment_schedule": [
    {
      "type": "deposit",
      "amount": 5000,
      "currency": "GBP",
      "due": "on_booking",
      "status": "captured"
    },
    {
      "type": "balance",
      "amount": 24000,
      "currency": "GBP",
      "due": "14_days_before",
      "due_date": "2026-03-01",
      "status": "pending"
    }
  ]
}
```

| Due value | Meaning |
|-----------|---------|
| `on_booking` | Charge immediately |
| `N_days_before` | Charge N days before check-in |
| `on_arrival` | Charge at check-in |
| `on_departure` | Charge at check-out |
| ISO date | Charge on specific date |

---

## Cancellation policy

Refund decay by days before arrival:

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

The `policy_hash` is a SHA-256 of the policy JSON. This ensures terms can't change after booking.

### Cancellation flow

```
1. Agent requests cancellation
2. System checks tiers against days remaining
3. Calculates refund amount
4. Executes refund via payment handler
5. AP2 mandate provides audit trail
```

---

## No-show policy

What happens if guest doesn't arrive:

```json
{
  "no_show_policy": {
    "charge_percent": 100,
    "detect_after_hours": 24
  }
}
```

After `detect_after_hours` past check-in time, venue can trigger no-show charge.

---

## Modification policy

Rules for changing bookings:

```json
{
  "modification_policy": {
    "allowed": true,
    "fee": {
      "amount": 2500,
      "currency": "GBP"
    },
    "restrictions": [
      "no_date_change_within_7_days",
      "no_room_downgrade"
    ]
  }
}
```

---

## AP2 mandate integration

The booking terms are captured in an AP2 mandate — cryptographic proof of what was authorized:

```json
{
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://ap2-protocol.org/v1",
    "https://ucp.dev/hospitality/v1"
  ],
  "type": ["VerifiableCredential", "PaymentMandate"],
  "issuer": "did:web:agent.example",
  "credentialSubject": {
    "user_did": "did:web:user.example",
    "merchant_did": "did:web:whitelionblakeney.co.uk",
    "booking_terms": {
      "stay_dates": {
        "check_in": "2026-03-15",
        "check_out": "2026-03-17"
      },
      "total_amount": {
        "amount": 29000,
        "currency": "GBP"
      },
      "cancellation_policy_hash": "sha256:a1b2c3..."
    },
    "authorized_charges": [
      {
        "type": "deposit",
        "max_amount": 5000,
        "currency": "GBP"
      },
      {
        "type": "balance",
        "max_amount": 24000,
        "currency": "GBP",
        "valid_from": "2026-03-01"
      },
      {
        "type": "no_show",
        "max_amount": 29000,
        "currency": "GBP",
        "valid_from": "2026-03-16"
      }
    ]
  },
  "proof": { }
}
```

The signed mandate proves the user authorized:
- Deposit charge now
- Balance charge on specific date
- No-show charge if applicable

---

## Payment execution modes

Two modes work today:

| Mode | How it works | Use case |
|------|--------------|----------|
| **Immediate** | Charge captured now | Same-day bookings, prepaid rates |
| **Deferred** | SetupIntent stores card, scheduled charges later | Future bookings |

```
Deferred flow:

1. User authorizes via AP2 mandate
2. SetupIntent stores payment method
3. Mandate references the stored method
4. On due date: PaymentIntent charges stored method
5. Mandate provides proof of authorization
```

---

## UCP mapping

| Retail checkout | Hospitality booking-terms |
|-----------------|---------------------------|
| Cart total | Total booking amount |
| Payment | Deposit |
| — | Balance (deferred) |
| Refund | Cancellation refund |
| — | No-show charge |
| Order modification | Booking modification |

---

## Transport bindings

### REST

```
POST /checkout
{
  "checkout": { ... },
  "booking_terms": { ... }
}

POST /checkout/{id}/cancel
{
  "reason": "change_of_plans"
}

POST /checkout/{id}/modify
{
  "changes": { "check_out": "2026-03-18" }
}
```

### MCP

```json
{
  "method": "create_booking",
  "params": {
    "venue_id": "white-lion-blakeney",
    "unit_id": "harbour-view-double",
    "check_in": "2026-03-15",
    "check_out": "2026-03-17",
    "guests": 2
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
- [Stay](/stay): Lifecycle states
- [UCP Integration](/docs/ucp-integration.md): Protocol integration

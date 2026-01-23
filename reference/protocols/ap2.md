---
title: Agent Payments Protocol (AP2)
description: How Agentic Booking uses Google's AP2 protocol—cryptographic mandates, payment handlers, and hospitality-specific authorization flows.
order: 3
---

# Agent Payments Protocol (AP2)

Google's protocol for cryptographic payment authorization.

---

## What is AP2?

AP2 (Agent Payments Protocol) is part of Google's UCP stack. It provides cryptographic proof of what a user authorized an agent to charge—a "mandate" that merchants can verify independently.

::card-group{cols="2"}
  ::card{title="Mandates" icon="ph:seal-check"}
  Cryptographically signed authorization documents.
  ::
  ::card{title="Payment Handlers" icon="ph:credit-card"}
  Pluggable payment providers (Stripe, Google Pay, etc.).
  ::
  ::card{title="Proof of Authorization" icon="ph:shield-check"}
  Verifiable evidence that the user consented to specific charges.
  ::
  ::card{title="Dispute Resolution" icon="ph:scales"}
  Clear audit trail for chargebacks and disputes.
  ::
::

---

## Why Mandates Matter for Hospitality

Hospitality has unique authorization challenges:

- **Future charges**: User authorizes today for charges weeks later
- **Conditional charges**: No-show charges only trigger if guest doesn't arrive
- **Variable amounts**: Modification fees, incidental charges

AP2 mandates capture exactly what was authorized, when, and under what conditions.

---

## Mandate Structure

### Basic Mandate

```json
{
  "mandate": {
    "id": "mnd_abc123",
    "created_at": "2026-01-10T14:30:00Z",
    "user_id": "did:web:user.example.com",
    "merchant_id": "did:web:theroste.co.uk",

    "authorized_charges": [
      {
        "type": "deposit",
        "max_amount": { "amount": 5000, "currency": "GBP" },
        "description": "Booking deposit"
      }
    ],

    "proof": {
      "type": "EcdsaSecp256k1Signature2019",
      "created": "2026-01-10T14:30:00Z",
      "verificationMethod": "did:web:user.example.com#key-1",
      "jws": "eyJhbGciOiJFUzI1NksifQ..."
    }
  }
}
```

### Hospitality Extended Mandate

```json
{
  "mandate": {
    "id": "mnd_abc123",
    "booking_ref": "bkg_8kf2m9xp",

    "authorized_charges": [
      {
        "type": "deposit",
        "max_amount": { "amount": 5000, "currency": "GBP" },
        "execute_at": "on_creation"
      },
      {
        "type": "balance",
        "max_amount": { "amount": 24000, "currency": "GBP" },
        "valid_from": "2026-03-01",
        "valid_until": "2026-03-15"
      },
      {
        "type": "no_show",
        "max_amount": { "amount": 29000, "currency": "GBP" },
        "valid_from": "2026-03-16",
        "condition": "guest_did_not_arrive",
        "requires_proof": ["pms_attestation", "keycard_inactive"]
      },
      {
        "type": "incidentals",
        "max_amount": { "amount": 10000, "currency": "GBP" },
        "valid_from": "2026-03-15",
        "valid_until": "2026-03-18",
        "condition": "itemized_charges"
      }
    ],

    "cancellation_terms": {
      "policy_hash": "sha256:a1b2c3...",
      "tiers": [
        { "days_before": 14, "refund_percent": 100 },
        { "days_before": 7, "refund_percent": 50 },
        { "days_before": 0, "refund_percent": 0 }
      ]
    },

    "proof": {
      "type": "EcdsaSecp256k1Signature2019",
      "created": "2026-01-10T14:30:00Z",
      "verificationMethod": "did:web:user.example.com#key-1",
      "jws": "eyJhbGciOiJFUzI1NksifQ..."
    }
  }
}
```

---

## Charge Types

| Type | When Valid | Condition |
|------|------------|-----------|
| `deposit` | On creation | None (immediate) |
| `balance` | After valid_from date | None (scheduled) |
| `no_show` | After check-in time | Guest didn't arrive + proof |
| `incidentals` | During stay | Itemized charges |
| `modification_fee` | On modification | Terms changed |
| `cancellation_fee` | On cancellation | Per tier in policy |

---

## Verification Flow

```
1. User authorizes booking → Mandate created and signed

2. Merchant stores mandate → Links to booking record

3. Charge event occurs (balance due, no-show, etc.)

4. Merchant verifies:
   - Mandate signature valid
   - Charge type authorized
   - Amount within max_amount
   - Timing within valid window
   - Conditions met (if any)

5. Execute charge via payment handler

6. Log charge against mandate for audit trail
```

---

## Policy Hash

The `policy_hash` is a SHA-256 hash of the cancellation/terms JSON. This ensures:

- Terms can't change after mandate signed
- Disputes can verify original terms
- Both parties have proof of agreement

```json
{
  "cancellation_terms": {
    "policy_hash": "sha256:a1b2c3def456...",
    "tiers": [...]
  }
}
```

---

## Mandate Amendment

If a booking is modified and liability increases, the mandate may need re-signing:

```json
{
  "mandate_amendment": {
    "original_mandate": "mnd_abc123",
    "amendment_id": "amd_xyz789",
    "reason": "date_extension",

    "changes": [
      {
        "field": "authorized_charges.balance.max_amount",
        "from": { "amount": 24000, "currency": "GBP" },
        "to": { "amount": 38500, "currency": "GBP" }
      }
    ],

    "proof": {
      "type": "EcdsaSecp256k1Signature2019",
      "created": "2026-02-15T09:00:00Z",
      "verificationMethod": "did:web:user.example.com#key-1",
      "jws": "eyJhbGciOiJFUzI1NksifQ..."
    }
  }
}
```

---

## Relationship to Folio

[Folio](/building-blocks/folio) defines the payment semantics (what should be charged when). AP2 provides the authorization mechanism (proof the user agreed).

```
Folio          "Deposit now, balance 14 days before, no-show = 100%"
  │
  ▼
AP2 Mandate    Signed proof user authorized these specific charges
  │
  ▼
Payment Handler    Stripe, Google Pay, etc. executes the charge
```

---

## Implementation Concerns

This specification defines **what** gets authorized (mandate structure) and **how** authorization is verified (signatures, policy hashes). It does not define:

| Concern | Description | Left to Implementation |
|---------|-------------|------------------------|
| **Payment method storage** | Where user's card/bank details live | Agent wallet, browser, device |
| **Mandate approval UI** | How users review and sign mandates | Agent app, browser extension |
| **User authentication** | How users prove identity to sign | Biometrics, passkeys, passwords |
| **Key management** | Where signing keys are stored | Secure enclave, HSM, cloud |

### Expected Architecture

A compliant implementation typically requires a **user-side application** (agent wallet, browser extension, or mobile app) that:

1. Stores the user's payment credentials securely
2. Presents mandate terms for user approval
3. Signs mandates with the user's cryptographic key
4. Communicates with payment handlers to execute charges

```
User App (wallet)          Agent                    Venue
      │                      │                        │
      │ ◄─── terms ──────────│◄──── negotiate ────────│
      │                      │                        │
      │ ── approve+sign ────►│                        │
      │                      │                        │
      │                      │──── signed mandate ───►│
      │                      │                        │
      │ ◄──────────────── charge via payment handler ─│
```

The separation between agent (negotiates) and user app (authorizes) is intentional—users maintain control over what they authorize regardless of which agent they use.

---

## Resources

- [AP2 Protocol](https://ap2-protocol.org/)
- [UCP Payment Architecture](https://ucp.dev/specification/payments)

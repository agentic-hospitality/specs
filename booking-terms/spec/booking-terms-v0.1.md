# Booking Terms: A Hospitality Profile for ACP and AP2

**Version:** 0.1 (Draft)  
**Status:** Request for Comment  
**Authors:** Selfe  
**Date:** January 2025

---

## Plain English Summary

When you buy something online today, AI agents can help. Two big protocols have emerged to make this work:

- **ACP** (from OpenAI and Stripe): Handles the shopping cart, checkout flow, and payment execution
- **AP2** (from Google): Handles trust and proof — cryptographically signing what you agreed to buy

Both work brilliantly for "buy now, get it shipped" commerce. But hospitality is different.

> **Hospitality transactions are agreements governing future-conditional payment execution, not immediate exchanges of value.**

When you book a hotel room, you're not buying a product. You're entering into an **agreement about the future**:
- You might pay a small deposit now, with the balance due at check-in
- You can cancel and get a refund, but the refund shrinks as check-in approaches  
- If you don't show up, you get charged anyway
- If you change the dates, there might be a fee

Neither ACP nor AP2 currently has a way to express these rules. **Booking Terms** adds that vocabulary.

**The good news:** 99% of what's needed already exists. AP2's "mandate" structure can encode hospitality rules today with a simple extension. The mandate IS the contract — cryptographic proof that the user authorized a specific payment schedule.

**What works today:** For future-dated payments, use SetupIntent to store the payment method, then schedule PaymentIntents against it. The mandate authorizes the charges; the stored payment method executes them.

**What would be cleaner:** If Stripe's SharedPaymentToken (SPT) had `valid_from` and `valid_until` parameters, it becomes a single primitive for scheduled payments — no stored payment methods, no scheduled intents, just one token per capture:

```
Signed Mandate ──references──▶ SPT_balance ──has──▶ valid_from: March 15
```

The mandate says "I authorized this." The SPT says "Execute on this date." Stripe holds both. One clean, cryptographically-linked flow.

**Bottom line:** Booking Terms works today. The SPT enhancement makes it elegant.

---

## The Three Protocols Explained

For readers unfamiliar with the emerging agent commerce landscape:

### ACP — Agentic Commerce Protocol
*Created by: OpenAI and Stripe*

Think of ACP as the "shopping cart" layer. When an AI agent helps you buy something, ACP defines:
- How to create a cart and add items
- How to update quantities, shipping options, etc.
- How to complete the purchase
- How to handle the payment

ACP uses Stripe's **SharedPaymentToken (SPT)** — a secure, one-time-use token that lets an agent pay on your behalf without ever seeing your card number.

**Limitation:** SPT expires after 30 days. You can't use it for a hotel booking 3 months from now.

### AP2 — Agent Payments Protocol  
*Created by: Google, with Mastercard, PayPal, and 60+ partners*

Think of AP2 as the "proof" layer. When an AI agent acts on your behalf, how does the merchant know you really authorised it? AP2 defines:
- **Intent Mandate:** What you told the agent to do ("book me a hotel in London")
- **Cart Mandate:** What you specifically agreed to buy ("Room 204, March 15-17, £360")
- **Payment Mandate:** Signals to banks that this is a legitimate agent transaction

All mandates are cryptographically signed — tamper-proof evidence of what was agreed.

**Limitation:** No vocabulary for hospitality-specific terms (cancellation policies, deposit schedules, no-show rules).

### Venue — Venue Identity for Agents
*Created by: Selfe*

Venue is a hospitality extension to Google's A2A (Agent-to-Agent) protocol. It answers the question: "How does an AI agent understand what a hotel, restaurant, or bar actually offers?"

An Venue is a structured description of a venue that includes:
- **Identity:** Name, location, verification by trusted bodies (DMOs, industry associations)
- **Capabilities:** What can be booked, how, through which systems
- **Evidence:** Why an agent should recommend this venue (reviews, awards, features)
- **Policies:** Cancellation terms, payment requirements, house rules

When a Booking Terms booking is made, the mandate references the venue's Venue — creating a trust chain from verified venue identity through to signed payment agreement.

---

## What Works Today vs What's Needed

| Component | Status | Notes |
|-----------|--------|-------|
| ACP checkout flow | ✅ Works today | Booking Terms line item extensions (defined in this spec) |
| AP2 Intent Mandate | ✅ Works today | `bookingTerms:hospitality_constraints` extension (defined in this spec) |
| AP2 Cart Mandate | ✅ Works today | `bookingTerms:booking_terms` extension (defined in this spec) |
| AP2 Payment Mandate | ✅ Works today | `bookingTerms:payment_signals` extension (defined in this spec) |
| Venue venue identity | ✅ Works today | Already defined in Venue spec |
| **Payment execution** | | |
| Mode A: Immediate (SPT) | ✅ Works today | Same-day bookings, prepaid rates |
| Mode B: Deferred (SetupIntent) | ✅ Works today | Future captures via stored payment method |
| Mode C: Deferred (Enhanced SPT) | 🔶 Proposed | `valid_from` / `valid_until` on SPT |

**Summary:** Booking Terms works today using Mode B (SetupIntent + stored payment method). Mode C (date-windowed SPT) provides stronger cryptographic binding and cleaner architecture, but is not required for implementation.

---

## The Ask

This specification defines everything needed for hospitality transactions in the agent economy. The AP2 mandate provides cryptographic proof of authorization. The question is how to execute scheduled payments cleanly.

### The Core Constraint

**SPT and stored payment methods are mutually exclusive paths.**

Stripe's SharedPaymentToken (SPT) is intentionally:
- One-time use
- Non-derivable (cannot mint another SPT from it)
- Non-reusable (cannot create SetupIntent from it)

Once consumed, you cannot schedule future charges from it. This is a feature, not a bug — SPT answers exactly one question: *"Is the user authorising this specific payment right now?"*

This means:

| Strategy | Can verify card | Can charge later | Cryptographically bound to mandate |
|----------|-----------------|------------------|-----------------------------------|
| SPT-only | ✅ | ❌ | ✅ |
| Stored PM (SetupIntent) | ✅ | ✅ | ⚠️ Mandate-referenced, not token-bound |
| Enhanced SPT (proposed) | ✅ | ✅ | ✅ |

### What Works Today (Mode A & B)

**Mode A: Immediate-settlement hospitality (SPT)**

For same-day bookings, prepaid rates, restaurants with same-day penalties — use SPT. No future capture required.

**Mode B: Deferred-settlement hospitality (SetupIntent)**

For bookings with future balance capture:

```
BOOKING TIME (January)
────────────────────────────
1. User signs AP2 mandate (authorizes full amount)
2. SetupIntent → produces stored payment method (pm_xxx)
3. £1 PaymentIntent for verification → immediately refund
4. Deposit PaymentIntent if required → captured
5. Scheduled PaymentIntent for balance → created but not captured

MARCH 15 (platform-triggered or Stripe Billing)
────────────────────────────
6. Balance PaymentIntent captured against stored pm_xxx
```

The mandate is the authority. The stored payment method is the execution mechanism. They are linked by reference (mandate hash in PaymentIntent metadata), not cryptographic binding.

> **Normative rule:** If a Booking Terms payment schedule includes future-dated captures beyond SPT validity, the implementation MUST use a stored payment method obtained via SetupIntent, not SPT.

### Why Date-Windowed SPT is Still the Right Ask (Mode C)

The SetupIntent pattern works. But it has weaker properties:

| Property | SetupIntent + scheduled PI | Date-windowed SPT |
|----------|---------------------------|-------------------|
| Mandate binding | Reference only (metadata) | Cryptographic (mandate signs SPT reference) |
| Execution timing | Platform manages schedule | Stripe manages schedule |
| Single primitive | ❌ Multiple objects | ✅ One token per capture |
| Audit trail | Reconstructed from parts | Inherent in token chain |

We are not misusing SPT. We are forced onto stored payment methods because SPT cannot express future authority.

### To Stripe

We request two optional parameters on SharedPaymentToken:

```json
{
  "id": "spt_xxx",
  "amount": 25900,
  "currency": "gbp",
  "merchant": "acct_xxx",
  "valid_from": "2025-03-15T00:00:00Z",   // NEW
  "valid_until": "2025-03-17T23:59:59Z"   // NEW
}
```

**Why:** This makes SPT the native primitive for future-dated payments. The mandate signs references to specific SPTs. The SPTs encode when execution is permitted. One clean chain of trust.

**The ideal flow (Mode C):**

```
BOOKING TIME (January)
────────────────────────────
1. User signs AP2 mandate (authorizes full amount, references SPTs)
2. SPT_verification: £1, valid now → captured immediately  
3. SPT_deposit: £100, valid now → captured immediately
4. SPT_balance: £259, valid_from: March 15 → issued but dormant

MARCH 15 (automatic)
────────────────────────────
5. SPT_balance window opens → Stripe auto-captures (or venue triggers within window)
```

No stored payment methods. No scheduled intents. No platform cron. One mechanism.

### To Google (AP2)

We propose `bookingTerms:hospitality_constraints` as a standard extension to IntentMandate, CartMandate, and PaymentMandate. This spec defines the schema. We'd like to contribute it to the AP2 specification as a hospitality vertical.

### To OpenAI (ACP)

We propose `bookingTerms:` extensions to ACP checkout objects for hospitality line items, payment schedules, and cancellation terms. We'd like to contribute these to the ACP specification as a hospitality vertical.

---

## Abstract

The Agentic Commerce Protocol (ACP) and Agent Payments Protocol (AP2) provide foundational infrastructure for AI agents to execute commerce on behalf of users. However, both protocols assume instant-fulfilment transactions where payment and delivery occur in close temporal proximity.

Hospitality operates differently. A hotel booking, restaurant reservation, or experience ticket represents a **future conditional payment**—a contract where payment timing, amounts, and even whether payment occurs at all depends on conditions that unfold over time.

**Booking Terms** is a hospitality profile that specifies how ACP and AP2 work together to support these transactions. It defines:

- How ACP checkout objects represent hospitality bookings
- How AP2 mandates encode hospitality-specific constraints
- How Stripe's SharedPaymentToken (SPT) should be enhanced to support date-windowed validity
- How venue identity (via Venue) anchors trust in the transaction

Booking Terms does not replace ACP or AP2. It profiles their combined use for a vertical that didn't fully model future-conditional payments.

---

## Terminology Note

This specification introduces **Payment Agreement** as an ACP-layer construct. AP2 separately defines **PaymentMandate**. To avoid confusion:

> A Booking Terms **Payment Agreement** is an ACP-side operational representation derived from, and cryptographically bound to, an AP2 **PaymentMandate**.

The Payment Agreement tracks execution state (scheduled captures, completed captures, refunds). The PaymentMandate provides the cryptographic proof of authorization that the Payment Agreement references.

| Term | Protocol | Purpose |
|------|----------|---------|
| PaymentMandate | AP2 | Cryptographic proof of user authorization |
| Payment Agreement | ACP (Booking Terms) | Operational state of payment execution |
| Relationship | — | Payment Agreement references PaymentMandate hash |

Implementers must not treat these as independent authorities. The PaymentMandate is the source of truth for authorization; the Payment Agreement is the execution record.

---

## 1. Problem Statement

### 1.1 The Instant-Commerce Assumption

Both ACP and AP2 were designed with a specific transaction model in mind:

```
User Intent → Cart → Payment → Fulfilment → Done
     │                  │            │
     └──── seconds ─────┴── days ────┘
```

This model works for e-commerce. You buy a product, payment is captured, the product ships. The transaction is complete.

### 1.2 The Hospitality Reality

Hospitality transactions follow a fundamentally different pattern:

```
User Intent → Booking → Deposit → [Time Passes] → Balance → Fulfilment
     │            │         │           │             │          │
     │            │         │           │             │          │
     │            │         │      Cancellation?      │          │
     │            │         │      Modification?      │          │
     │            │         │      No-show?           │          │
     └── now ─────┴─ now ───┴────── weeks/months ─────┴── later ─┘
```

Key differences:

| Aspect | Instant Commerce | Hospitality |
|--------|------------------|-------------|
| Payment timing | At purchase | Split across multiple dates |
| Fulfilment timing | Days after payment | Weeks/months after booking |
| Cancellation | Rarely allowed | Core feature with decay |
| Modification | Exchange/return | Date changes, guest changes |
| No-show | N/A | Triggers penalty capture |
| Inventory | Physical goods | Perishable capacity |

### 1.3 Protocol Gaps

**ACP (OpenAI/Stripe)** provides rich checkout orchestration but:
- No cryptographic proof of user intent
- No mechanism for future conditional captures
- SharedPaymentToken expires in 30 days (fixed)
- No cancellation policy semantics

**AP2 (Google)** provides trust and signing but:
- Focused on authorisation, not commerce orchestration
- Intent Mandate TTL is simple expiry, not conditional triggers
- No checkout state management
- No standard hospitality constraint vocabulary

**Neither protocol** addresses:
- Tiered cancellation refund decay
- Deposit vs balance capture scheduling
- No-show detection and charge triggers
- Modification fee structures
- The relationship between booking policies and payment execution

### 1.4 The Consequence

Without a standard profile, every hospitality platform must:
- Build custom payment orchestration outside the agent protocols
- Lose the benefits of cryptographic intent verification
- Create proprietary integrations that don't interoperate
- Miss the trust signals that help issuers assess transaction legitimacy

---

## 2. Design Principles

### 2.1 Extend, Don't Replace

Booking Terms is a **profile**, not a protocol. It specifies how existing protocols are used together, adding only the minimum extensions necessary.

### 2.2 ACP for Commerce, AP2 for Trust

ACP handles what it's good at: checkout state, cart management, fulfilment options, merchant communication.

AP2 handles what it's good at: cryptographic proof of intent, signed mandates, audit trails, issuer signals.

Booking Terms bridges them with hospitality semantics.

### 2.3 SPT Enhancement Over Replacement

Rather than propose a new payment primitive, Booking Terms requests a minimal enhancement to SharedPaymentToken: date-windowed validity.

### 2.4 Venue as Trust Anchor

Venue identity and policy verification comes from Venue (the hospitality extension to A2A Agent Cards). Booking Terms mandates reference Venue for:
- Venue identity verification
- Policy consistency checking
- Evidence for dispute resolution

### 2.5 Extension Durability

Booking Terms relies on ACP's ability to carry namespaced extensions through the checkout lifecycle. To ensure interoperability:

> Booking Terms extensions (`bookingTerms:*` namespaced fields) MUST be treated as opaque but durable by ACP implementations. They MUST be preserved end-to-end and round-tripped to webhooks without modification or loss.

This prevents accidental data loss in early implementations and ensures the hospitality semantics survive the full transaction flow.

---

## 3. Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         AGENT LAYER                                 │
│                                                                     │
│   User ←→ Shopping Agent ←→ Venue Agent                            │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    ACP LAYER: Commerce Orchestration                │
│  ───────────────────────────────────────────────────────────────    │
│                                                                     │
│   POST /checkout_sessions                                           │
│     → Creates booking with Booking Terms line item schema                   │
│                                                                     │
│   PUT /checkout_sessions/{id}                                       │
│     → Updates dates, guests, fulfillment options                    │
│                                                                     │
│   POST /checkout_sessions/{id}/complete                             │
│     → Initiates Booking Terms payment agreement                             │
│                                                                     │
│   Webhook: booking.confirmed, booking.cancelled, booking.modified   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    AP2 LAYER: Trust & Signing                       │
│  ───────────────────────────────────────────────────────────────    │
│                                                                     │
│   IntentMandate                                                     │
│     + bookingTerms:hospitality_constraints                                 │
│     + bookingTerms:payment_agreement                                       │
│     + bookingTerms:cancellation_terms                                      │
│                                                                     │
│   CartMandate                                                       │
│     + Binds specific venue, dates, room, price                      │
│     + References venue Venue for verification                        │
│                                                                     │
│   PaymentMandate                                                    │
│     + Signals "hospitality/deferred" to issuer                      │
│     + Includes payment schedule reference                           │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    SPT LAYER: Payment Execution                     │
│  ───────────────────────────────────────────────────────────────    │
│                                                                     │
│   SPT (Enhanced)                                                    │
│     + valid_from: datetime                                          │
│     + valid_until: datetime                                         │
│     + revocation_conditions: CancellationTermsRef                   │
│                                                                     │
│   Verification SPT: £1-5, immediate capture, card confirmation      │
│   Deposit SPT: Amount per policy, immediate capture                 │
│   Balance SPT: Remaining amount, valid_from: check-in date          │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    VENUE LAYER: Venue Trust                          │
│  ───────────────────────────────────────────────────────────────    │
│                                                                     │
│   Venue Agent Card                                                   │
│     + Venue identity and verification                               │
│     + Published cancellation policies                               │
│     + Published payment terms                                       │
│     + Evidence set for agent decision-making                        │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 4. Specification

### 4.1 Booking Terms Namespace

All Booking Terms extensions use the namespace prefix `bookingTerms:` within their respective protocol contexts.

```
Namespace: https://open-hospitality.org/payment-contract/v0.1
Prefix: folio
```

### 4.2 ACP Extensions

#### 4.2.1 Checkout Session: Hospitality Line Item

Standard ACP line items are extended with hospitality-specific fields:

```json
{
  "id": "checkout_abc123",
  "status": "pending",
  "items": [
    {
      "id": "item_room_001",
      "sku": "standard-double",
      "name": "Standard Double Room",
      "quantity": 1,
      "unit_price": {
        "amount": 15000,
        "currency": "GBP"
      },
      "bookingTerms:hospitality_item": {
        "type": "accommodation",
        "check_in": "2025-03-15",
        "check_out": "2025-03-17",
        "guests": {
          "adults": 2,
          "children": 0
        },
        "room_nights": 2,
        "rate_type": "flexible",
        "policies": {
          "cancellation_ref": "policy:cancel_flex_48h",
          "modification_ref": "policy:mod_standard"
        }
      }
    }
  ],
  "totals": {
    "subtotal": {"amount": 30000, "currency": "GBP"},
    "taxes": {"amount": 6000, "currency": "GBP"},
    "total": {"amount": 36000, "currency": "GBP"}
  },
  "bookingTerms:payment_schedule": {
    "verification": {
      "amount": {"amount": 100, "currency": "GBP"},
      "timing": "on_checkout_complete",
      "purpose": "card_verification",
      "refundable": true
    },
    "deposit": {
      "amount": {"amount": 10000, "currency": "GBP"},
      "timing": "on_checkout_complete",
      "refund_policy": "per_cancellation_terms"
    },
    "balance": {
      "amount": {"amount": 25900, "currency": "GBP"},
      "timing": "2025-03-15T15:00:00Z",
      "capture_method": "automatic"
    }
  },
  "bookingTerms:cancellation_terms": {
    "type": "tiered_decay",
    "tiers": [
      {
        "until": "2025-03-13T23:59:59Z",
        "refund_percent": 100,
        "description": "Free cancellation until 48 hours before check-in"
      },
      {
        "until": "2025-03-14T23:59:59Z",
        "refund_percent": 50,
        "description": "50% refund 24-48 hours before check-in"
      },
      {
        "after": "2025-03-14T23:59:59Z",
        "refund_percent": 0,
        "description": "No refund within 24 hours of check-in"
      }
    ],
    "refund_currency_basis": "original_payment_currency",  // or "merchant_local_currency"
    "no_show": {
      "detection_time": "2025-03-15T22:00:00Z",
      "charge_percent": 100,
      "proof_method": "pms_attestation",  // Property Management System signed attestation
      "description": "Full charge if no arrival by 10pm on check-in date"
    }
  },
  "bookingTerms:incidentals_authority": {
    "permitted": true,
    "max_variance_percent": 15,
    "categories": ["minibar", "room_service", "damage_deposit"],
    "requires_itemised_receipt": true
  },
  "bookingTerms:modification_terms": {
    "date_change": {
      "permitted": true,
      "fee": {"amount": 2500, "currency": "GBP"},
      "constraint": "subject_to_availability",
      "advance_notice": "24h",
      "requires_mandate_amendment": true
    },
    "guest_change": {
      "permitted": true,
      "repricing": "per_occupancy_rates"
    },
    "room_upgrade": {
      "permitted": true,
      "repricing": "differential",
      "requires_mandate_amendment_if_increase": true
    }
  },
  "bookingTerms:venue_ref": {
    "venue_id": "venue:the-grand-hotel-london",
    "verification_url": "https://venue.selfe.ai/v/the-grand-hotel-london"
  }
}
```

#### 4.2.2 Checkout Complete: Payment Agreement Initiation

When `POST /checkout_sessions/{id}/complete` is called, the response includes the Booking Terms payment agreement:

```json
{
  "id": "checkout_abc123",
  "status": "confirmed",
  "order": {
    "id": "order_xyz789",
    "confirmation_number": "GH-2025-ABC123"
  },
  "bookingTerms:payment_agreement": {
    "id": "fpa_def456",
    "status": "active",
    "created": "2025-01-04T14:30:00Z",
    "booking_ref": "order_xyz789",
    "total_liability": {"amount": 36000, "currency": "GBP"},
    "captured": [
      {
        "id": "cap_verification",
        "type": "verification",
        "amount": {"amount": 100, "currency": "GBP"},
        "captured_at": "2025-01-04T14:30:00Z",
        "spt_id": "spt_ver_001",
        "status": "captured"
      },
      {
        "id": "cap_deposit",
        "type": "deposit",
        "amount": {"amount": 10000, "currency": "GBP"},
        "captured_at": "2025-01-04T14:30:01Z",
        "spt_id": "spt_dep_001",
        "status": "captured"
      }
    ],
    "scheduled": [
      {
        "id": "cap_balance",
        "type": "balance",
        "amount": {"amount": 25900, "currency": "GBP"},
        "scheduled_for": "2025-03-15T15:00:00Z",
        "spt_id": "spt_bal_001",
        "status": "pending"
      }
    ],
    "cancellation_terms_hash": "sha256:abc123...",
    "mandate_ref": "ap2:mandate_ghi789"
  }
}
```

#### 4.2.3 New Webhooks

Booking Terms defines additional webhook events:

| Event | Trigger | Payload |
|-------|---------|---------|
| `bookingTerms.capture.precheck` | 72 hours before scheduled capture | Payment agreement, payment method status |
| `bookingTerms.capture.scheduled` | Balance capture scheduled | Payment agreement, capture details |
| `bookingTerms.capture.completed` | Scheduled capture executed | Payment agreement, capture result |
| `bookingTerms.capture.failed` | Scheduled capture failed | Payment agreement, error details |
| `bookingTerms.cancellation.requested` | Guest requests cancellation | Booking, refund calculation |
| `bookingTerms.cancellation.processed` | Cancellation completed | Booking, refunds issued |
| `bookingTerms.modification.requested` | Guest requests change | Booking, proposed changes |
| `bookingTerms.modification.processed` | Modification completed | Booking, price adjustments |
| `bookingTerms.noshow.detected` | No-show trigger fired | Booking, PMS attestation, charge details |

---

### 4.3 AP2 Extensions

#### 4.3.1 Intent Mandate: Hospitality Constraints

The AP2 `IntentMandate` is extended with Booking Terms-specific constraints:

```json
{
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://ap2-protocol.org/v1",
    "https://open-hospitality.org/payment-contract/v0.1"
  ],
  "type": ["VerifiableCredential", "IntentMandate"],
  "issuer": "did:key:user_123",
  "issuanceDate": "2025-01-04T14:00:00Z",
  "credentialSubject": {
    "id": "did:key:shopping_agent_456",
    "intent": {
      "action": "book_accommodation",
      "prompt_playback": "Book a room at The Grand Hotel London for March 15-17, 2 adults",
      "constraints": {
        "merchant_allowlist": ["did:venue:the-grand-hotel-london"],
        "max_total": {"amount": 50000, "currency": "GBP"},
        "date_range": {
          "check_in": "2025-03-15",
          "check_out": "2025-03-17"
        },
        "guests": {"adults": 2, "children": 0}
      },
      "bookingTerms:hospitality_constraints": {
        "booking_type": "accommodation",
        "acceptable_cancellation_terms": {
          "min_free_cancellation_hours": 24,
          "max_no_refund_penalty_percent": 100
        },
        "acceptable_payment_terms": {
          "max_deposit_percent": 50,
          "balance_timing": "at_checkin_or_later"
        },
        "bookingTerms:payment_agreement_authority": {
          "verification_capture": {
            "max_amount": {"amount": 500, "currency": "GBP"},
            "authorised": true
          },
          "deposit_capture": {
            "max_percent": 30,
            "authorised": true
          },
          "balance_capture": {
            "timing_constraint": "not_before_checkin",
            "authorised": true
          },
          "cancellation_refund": {
            "per_published_terms": true,
            "authorised": true
          }
        }
      }
    },
    "ttl": "2025-03-17T12:00:00Z"
  },
  "proof": {
    "type": "EcdsaSecp256k1Signature2019",
    "created": "2025-01-04T14:00:00Z",
    "verificationMethod": "did:key:user_123#key-1",
    "proofPurpose": "assertionMethod",
    "jws": "eyJhbGciOiJFUzI1NksifQ..."
  }
}
```

**TTL Semantics Note:** The `ttl` field bounds **agent authority**, not booking fulfilment. For hospitality:

- TTL represents how long the agent may act on this intent
- It is typically set to check-out time (when the booking completes)
- It does not constrain when payment capture occurs (that's governed by the CartMandate payment schedule)
- Long-range bookings (e.g., 6 months out) should set TTL accordingly

Example: A booking made in January for March stay would have:
- `issuanceDate`: January 4
- `ttl`: March 17 (check-out)
- Payment captures: January (deposit), March 15 (balance)

#### 4.3.2 Cart Mandate: Booking Confirmation

The `CartMandate` binds the user's signature to specific booking terms:

```json
{
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://ap2-protocol.org/v1",
    "https://open-hospitality.org/payment-contract/v0.1"
  ],
  "type": ["VerifiableCredential", "CartMandate"],
  "issuer": "did:venue:the-grand-hotel-london",
  "issuanceDate": "2025-01-04T14:30:00Z",
  "credentialSubject": {
    "id": "did:key:user_123",
    "cart": {
      "merchant": {
        "id": "did:venue:the-grand-hotel-london",
        "name": "The Grand Hotel London",
        "venue_verification": "https://venue.selfe.ai/v/the-grand-hotel-london"
      },
      "items": [
        {
          "sku": "standard-double",
          "description": "Standard Double Room, 2 nights",
          "check_in": "2025-03-15",
          "check_out": "2025-03-17",
          "guests": 2,
          "unit_price": {"amount": 15000, "currency": "GBP"},
          "quantity": 2,
          "line_total": {"amount": 30000, "currency": "GBP"}
        }
      ],
      "totals": {
        "subtotal": {"amount": 30000, "currency": "GBP"},
        "taxes": {"amount": 6000, "currency": "GBP"},
        "total": {"amount": 36000, "currency": "GBP"}
      },
      "bookingTerms:booking_terms": {
        "confirmation_number": "GH-2025-ABC123",
        "payment_schedule": {
          "verification": {"amount": 100, "currency": "GBP", "timing": "immediate"},
          "deposit": {"amount": 10000, "currency": "GBP", "timing": "immediate"},
          "balance": {"amount": 25900, "currency": "GBP", "timing": "2025-03-15T15:00:00Z"}
        },
        "policy_snapshot": {
          "venue_version": "venue:the-grand-hotel-london@2025-01-04T14:30:00Z",
          "cancellation_terms_hash": "sha256:abc123def456...",
          "cancellation_terms_url": "https://thegrandhotel.com/policies/cancel_flex_48h",
          "modification_terms_hash": "sha256:789ghi012jkl...",
          "snapshot_timestamp": "2025-01-04T14:30:00Z"
        },
        "guest_agrees_to_terms": true,
        "liability_increases_require_re_signature": true
      }
    },
    "payment_method": {
      "token_type": "stripe_spt",
      "token_refs": ["spt_ver_001", "spt_dep_001", "spt_bal_001"]
    },
    "intent_mandate_ref": "urn:uuid:intent_abc123"
  },
  "proof": {
    "type": "EcdsaSecp256k1Signature2019",
    "created": "2025-01-04T14:30:00Z",
    "verificationMethod": "did:key:user_123#key-1",
    "proofPurpose": "assertionMethod",
    "jws": "eyJhbGciOiJFUzI1NksifQ..."
  }
}
```

#### 4.3.3 Payment Mandate: Issuer Signals

The `PaymentMandate` signals to the payment network that this is a hospitality transaction:

```json
{
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://ap2-protocol.org/v1",
    "https://open-hospitality.org/payment-contract/v0.1"
  ],
  "type": ["VerifiableCredential", "PaymentMandate"],
  "issuer": "did:credentials:provider_789",
  "issuanceDate": "2025-01-04T14:30:00Z",
  "credentialSubject": {
    "transaction_type": "bookingTerms:hospitality_booking",
    "modality": "human_present",
    "agent_id": "did:key:shopping_agent_456",
    "payer": "did:key:user_123",
    "payee": "did:venue:the-grand-hotel-london",
    "bookingTerms:payment_signals": {
      "booking_type": "accommodation",
      "fulfilment_date": "2025-03-15",
      "payment_structure": "deposit_plus_deferred_balance",
      "cancellation_protected": true,
      "capture_schedule": [
        {"type": "verification", "amount": 100, "timing": "immediate"},
        {"type": "deposit", "amount": 10000, "timing": "immediate"},
        {"type": "balance", "amount": 25900, "timing": "2025-03-15T15:00:00Z"}
      ]
    },
    "cart_mandate_hash": "sha256:cart_xyz789...",
    "risk_signals": {
      "device_binding": true,
      "biometric_auth": true,
      "known_customer": true
    }
  },
  "proof": {
    "type": "EcdsaSecp256k1Signature2019",
    "created": "2025-01-04T14:30:00Z",
    "verificationMethod": "did:credentials:provider_789#key-1",
    "proofPurpose": "assertionMethod",
    "jws": "eyJhbGciOiJFUzI1NksifQ..."
  }
}
```

---

### 4.4 Payment Execution Modes

Booking Terms supports three payment execution modes. Mode A and B work today; Mode C is a proposed enhancement.

#### 4.4.1 Mode A: Immediate Settlement (SPT)

For same-day bookings, prepaid/non-refundable rates, or any hospitality transaction where all captures occur immediately:

```
BOOKING TIME
────────────────────────────
1. User signs AP2 mandate
2. SPT → full amount captured immediately
3. Done
```

Use SPT as designed. No future captures required.

#### 4.4.2 Mode B: Deferred Settlement (SetupIntent) — Works Today

For bookings with future-dated captures, use SetupIntent to store the payment method:

```
BOOKING TIME (January)
────────────────────────────
1. User signs AP2 mandate (references payment schedule)
2. SetupIntent (user present, SCA) → produces pm_xxx
3. PaymentIntent £1 verification against pm_xxx → capture & refund
4. PaymentIntent deposit against pm_xxx → capture (if required)
5. Record scheduled balance capture in Booking Terms Payment Agreement

MARCH 15 (platform-triggered)
────────────────────────────
6. PaymentIntent balance against pm_xxx → capture
   (with mandate_hash in metadata for audit trail)
```

**Key constraint:** SPT cannot be used here. SPT is one-time-use and non-derivable — once consumed, you cannot create future payment capabilities from it.

**Mandate binding:** The stored payment method (pm_xxx) is linked to the mandate by reference. The PaymentIntent metadata includes the mandate hash, but the binding is not cryptographic — it's reconstructed from separate objects.

```json
{
  "bookingTerms:payment_execution": {
    "mode": "B",
    "payment_method_id": "pm_xxx",
    "setup_intent_id": "seti_xxx",
    "mandate_ref": "ap2:mandate_ghi789",
    "scheduled_captures": [
      {
        "id": "cap_balance",
        "amount": {"amount": 25900, "currency": "GBP"},
        "scheduled_for": "2025-03-15T15:00:00Z",
        "payment_intent_id": null,
        "status": "scheduled"
      }
    ]
  }
}
```

#### 4.4.3 Mode C: Deferred Settlement (Enhanced SPT) — Proposed

This is the cleaner architecture, requiring SPT enhancement.

**Current SPT limitation:** Fixed 30-day validity window, one-time use.

```json
{
  "id": "spt_abc123",
  "amount": 36000,
  "currency": "gbp",
  "merchant": "acct_xxx",
  "expires_at": "2025-02-03T14:30:00Z"
}
```

**Proposed enhancement:** Add `valid_from` and `valid_until`:

```json
{
  "id": "spt_balance_001",
  "amount": 25900,
  "currency": "gbp",
  "merchant": "acct_xxx",
  "valid_from": "2025-03-15T00:00:00Z",
  "valid_until": "2025-03-17T23:59:59Z",
  "revocation_conditions": {
    "on_cancellation": true,
    "cancellation_terms_ref": "sha256:abc123..."
  },
  "auto_capture_at": "2025-03-15T15:00:00Z"
}
```

**Why this is better than Mode B:**

| Property | Mode B (SetupIntent) | Mode C (Enhanced SPT) |
|----------|---------------------|----------------------|
| Mandate binding | Reference only (metadata) | Cryptographic (mandate signs SPT reference) |
| Execution timing | Platform manages schedule | Stripe manages schedule |
| Single primitive | ❌ Multiple objects | ✅ One token per capture |
| Audit trail | Reconstructed from parts | Inherent in token chain |

**Mode C lifecycle:**

```
Booking Created (Jan 4)
    │
    ├── SPT_verification: £1, valid now, captured immediately
    │
    ├── SPT_deposit: £100, valid now, captured immediately
    │
    └── SPT_balance: £259, valid_from: Mar 15, valid_until: Mar 17
            │
            │ (Time passes — Stripe holds the SPT)
            │
            ├── [If cancelled before Mar 13] → SPT_balance revoked, refunds per policy
            │
            ├── [If cancelled Mar 13-14] → SPT_balance revoked, partial refund
            │
            ├── [If cancelled after Mar 14] → SPT_balance revoked, no refund
            │
            ├── [If modified] → SPT_balance updated or replaced
            │
            ├── [Mar 15 15:00] → SPT_balance auto-captured (or venue triggers within window)
            │
            └── [If no-show Mar 15 22:00] → SPT_balance captured as penalty
```

No cron jobs. No subscription infrastructure. Stripe holds the token and executes at the right time.

#### 4.4.4 Liveness Risk & Pre-check (Mode B and C)

**The Problem:** If a booking is made 6 months in advance, the underlying credit card might expire, be reported lost, or hit its limit before the `valid_from` date.

**Solution:** Booking Terms specifies a `bookingTerms.capture.precheck` webhook triggered 72 hours before the `valid_from` date:

```json
{
  "type": "bookingTerms.capture.precheck",
  "data": {
    "booking_ref": "order_xyz789",
    "spt_id": "spt_balance_001",
    "scheduled_capture": "2025-03-15T15:00:00Z",
    "payment_method_status": "valid",  // or "expiring", "failed_validation"
    "action_required": false
  }
}
```

If the payment method is invalid or expiring:
1. Agent notifies user proactively
2. User provides alternative payment method
3. New SPT issued, mandate amended (user re-signs if liability changes)
4. Original SPT revoked

This prevents failed captures on check-in day and gives all parties time to resolve issues.

#### 4.4.5 Mode Selection Guidance

| Booking Type | Recommended Mode | Rationale |
|--------------|------------------|-----------|
| Same-day / prepaid | Mode A (SPT) | No future captures needed |
| Standard flexible rate | Mode B (SetupIntent) | Works today, full functionality |
| Standard flexible rate | Mode C (Enhanced SPT) | When available — cleaner architecture |
| Long-range booking (6+ months) | Mode B (SetupIntent) | Liveness checks more important |

> **Normative rule:** If a Booking Terms payment schedule includes future-dated captures, implementations MUST use Mode B (SetupIntent) until Mode C (Enhanced SPT) is available. Mode A (SPT) MUST NOT be used for deferred captures.

---

### 4.5 Venue Integration

#### 4.5.1 Venue Venue Requirements

For a venue to participate in Booking Terms transactions, its Venue must include:

```json
{
  "venue_id": "venue:the-grand-hotel-london",
  "version": "1.0",
  "identity": {
    "name": "The Grand Hotel London",
    "type": "accommodation",
    "verified_by": ["visit_london", "aa_hospitality"],
    "did": "did:venue:the-grand-hotel-london"
  },
  "capabilities": {
    "booking": {
      "protocols": ["bookingTerms:v0.1"],
      "realtime_availability": true,
      "instant_confirmation": true
    },
    "payment": {
      "methods": ["card"],
      "processors": ["stripe"],
      "folio_compatible": true
    }
  },
  "bookingTerms:policies": {
    "cancellation_policies": [
      {
        "id": "cancel_flex_48h",
        "name": "Flexible - 48 hour",
        "hash": "sha256:abc123...",
        "tiers": [
          {"until_hours_before": 48, "refund_percent": 100},
          {"until_hours_before": 24, "refund_percent": 50},
          {"until_hours_before": 0, "refund_percent": 0}
        ],
        "no_show_charge_percent": 100
      },
      {
        "id": "cancel_nonrefund",
        "name": "Non-refundable",
        "hash": "sha256:def456...",
        "tiers": [
          {"until_hours_before": 0, "refund_percent": 0}
        ],
        "no_show_charge_percent": 100
      }
    ],
    "modification_policies": [
      {
        "id": "mod_standard",
        "date_change_fee": {"amount": 2500, "currency": "GBP"},
        "date_change_notice_hours": 24,
        "guest_change_repricing": "per_occupancy"
      }
    ],
    "payment_policies": [
      {
        "id": "pay_standard",
        "verification_amount": {"amount": 100, "currency": "GBP"},
        "deposit_percent": 0,
        "balance_timing": "at_checkin"
      },
      {
        "id": "pay_deposit",
        "verification_amount": {"amount": 100, "currency": "GBP"},
        "deposit_percent": 30,
        "balance_timing": "at_checkin"
      }
    ]
  }
}
```

#### 4.5.2 Mandate-Venue Binding

The Cart Mandate references the venue Venue, enabling:

1. **Policy verification**: Agent can verify that cancellation terms in the mandate match those published in the Venue
2. **Dispute evidence**: In disputes, the signed mandate + Venue snapshot provides proof of agreed terms
3. **Trust chain**: Venue verification (by DMOs, industry bodies) extends trust to the mandate

---

## 5. Transaction Flows

### 5.1 Standard Booking Flow

```
┌─────────┐     ┌──────────────┐     ┌─────────────┐     ┌──────────┐
│  User   │     │Shopping Agent│     │ Venue Agent │     │  Stripe  │
└────┬────┘     └──────┬───────┘     └──────┬──────┘     └────┬─────┘
     │                 │                    │                  │
     │ "Book Grand Hotel Mar 15-17"         │                  │
     │────────────────>│                    │                  │
     │                 │                    │                  │
     │                 │ Fetch Venue         │                  │
     │                 │───────────────────>│                  │
     │                 │                    │                  │
     │                 │ Venue + Policies    │                  │
     │                 │<───────────────────│                  │
     │                 │                    │                  │
     │                 │ CreateCheckout     │                  │
     │                 │ (ACP + Booking Terms)      │                  │
     │                 │───────────────────>│                  │
     │                 │                    │                  │
     │                 │ Checkout State     │                  │
     │                 │ (rooms, prices,    │                  │
     │                 │  payment schedule) │                  │
     │                 │<───────────────────│                  │
     │                 │                    │                  │
     │ "Room options,  │                    │                  │
     │  £360 total,    │                    │                  │
     │  £100 deposit"  │                    │                  │
     │<────────────────│                    │                  │
     │                 │                    │                  │
     │ "Book standard  │                    │                  │
     │  double"        │                    │                  │
     │────────────────>│                    │                  │
     │                 │                    │                  │
     │                 │ Generate IntentMandate               │
     │                 │ (bookingTerms:hospitality_constraints)      │
     │                 │──────────────────────────────────────>│
     │                 │                    │                  │
     │ Sign mandate    │                    │                  │
     │ (device key)    │                    │                  │
     │<────────────────│                    │                  │
     │                 │                    │                  │
     │ [User signs]    │                    │                  │
     │────────────────>│                    │                  │
     │                 │                    │                  │
     │                 │ CompleteCheckout   │                  │
     │                 │ + Signed mandates  │                  │
     │                 │───────────────────>│                  │
     │                 │                    │                  │
     │                 │                    │ Create SPTs      │
     │                 │                    │────────────────>│
     │                 │                    │                  │
     │                 │                    │ SPT_ver (immed)  │
     │                 │                    │ SPT_dep (immed)  │
     │                 │                    │ SPT_bal (Mar 15) │
     │                 │                    │<────────────────│
     │                 │                    │                  │
     │                 │                    │ Capture ver+dep  │
     │                 │                    │────────────────>│
     │                 │                    │                  │
     │                 │                    │ Captured         │
     │                 │                    │<────────────────│
     │                 │                    │                  │
     │                 │ Booking Confirmed  │                  │
     │                 │ + Payment Agreement│                  │
     │                 │<───────────────────│                  │
     │                 │                    │                  │
     │ "Confirmed!     │                    │                  │
     │  Ref: GH-123    │                    │                  │
     │  £101 charged,  │                    │                  │
     │  £259 on Mar 15"│                    │                  │
     │<────────────────│                    │                  │
     │                 │                    │                  │
```

### 5.2 Cancellation Flow

```
┌─────────┐     ┌──────────────┐     ┌─────────────┐     ┌──────────┐
│  User   │     │Shopping Agent│     │ Venue Agent │     │  Stripe  │
└────┬────┘     └──────┬───────┘     └──────┬──────┘     └────┬─────┘
     │                 │                    │                  │
     │ "Cancel my      │                    │                  │
     │  Grand Hotel    │                    │                  │
     │  booking"       │                    │                  │
     │────────────────>│                    │                  │
     │                 │                    │                  │
     │                 │ Lookup booking     │                  │
     │                 │ + payment agreement│                  │
     │                 │───────────────────>│                  │
     │                 │                    │                  │
     │                 │ Booking details    │                  │
     │                 │ + cancellation     │                  │
     │                 │   calculation      │                  │
     │                 │<───────────────────│                  │
     │                 │                    │                  │
     │ "Cancel now =   │                    │                  │
     │  50% refund     │                    │                  │
     │  (£50 back).    │                    │                  │
     │  Confirm?"      │                    │                  │
     │<────────────────│                    │                  │
     │                 │                    │                  │
     │ "Yes, cancel"   │                    │                  │
     │────────────────>│                    │                  │
     │                 │                    │                  │
     │                 │ CancelBooking      │                  │
     │                 │ + Signed request   │                  │
     │                 │───────────────────>│                  │
     │                 │                    │                  │
     │                 │                    │ Revoke SPT_bal   │
     │                 │                    │────────────────>│
     │                 │                    │                  │
     │                 │                    │ Revoked          │
     │                 │                    │<────────────────│
     │                 │                    │                  │
     │                 │                    │ Refund 50% dep   │
     │                 │                    │────────────────>│
     │                 │                    │                  │
     │                 │                    │ Refunded £50     │
     │                 │                    │<────────────────│
     │                 │                    │                  │
     │                 │ Cancellation       │                  │
     │                 │ confirmed          │                  │
     │                 │<───────────────────│                  │
     │                 │                    │                  │
     │ "Cancelled.     │                    │                  │
     │  £50 refunded." │                    │                  │
     │<────────────────│                    │                  │
```

### 5.3 No-Show Flow

```
┌─────────────┐     ┌──────────┐     ┌──────────┐
│ Venue Agent │     │  Stripe  │     │   User   │
└──────┬──────┘     └────┬─────┘     └────┬─────┘
       │                 │                 │
       │ [Mar 15 22:00]  │                 │
       │ No check-in     │                 │
       │ detected        │                 │
       │                 │                 │
       │ Trigger no-show │                 │
       │ per Booking Terms       │                 │
       │ agreement       │                 │
       │                 │                 │
       │ Capture SPT_bal │                 │
       │────────────────>│                 │
       │                 │                 │
       │ Captured £259   │                 │
       │<────────────────│                 │
       │                 │                 │
       │                 │ Charge notif    │
       │                 │────────────────>│
       │                 │                 │
       │ Webhook:        │                 │
       │ bookingTerms.noshow    │                 │
       │ .detected       │                 │
       │                 │                 │
```

---

## 6. Security Considerations

### 6.1 Mandate Integrity

All Booking Terms mandates inherit AP2's cryptographic protections:
- ECDSA signatures on all mandates
- Hardware-backed keys where available
- Tamper-evident JSON-LD structure
- Verifiable credential chain

### 6.2 Policy Snapshot Binding

Cancellation and modification terms are snapshot-bound in mandates:
- `policy_snapshot` in CartMandate captures exact terms at signing time
- Hash prevents venue from changing policies after booking but before stay
- Venue versioning (`venue:venue@timestamp`) provides point-in-time reference
- Disputes reference the signed snapshot, not current Venue state

### 6.3 SPT Revocation

Enhanced SPTs must support revocation:
- On cancellation, pending SPTs are revoked
- Revocation is logged with mandate reference
- Partial revocation for partial refunds

### 6.4 SPT Liveness

For long-dated bookings, payment method validity must be verified:
- `bookingTerms.capture.precheck` webhook 72 hours before `valid_from`
- Agent proactively notifies user if payment method is invalid/expiring
- New SPT issued with mandate amendment if payment method changes
- Original SPT revoked only after replacement is confirmed

### 6.5 No-Show Detection

No-show triggers must be:
- Defined at booking time (in mandate)
- Proved via declared trigger source
- Logged with timestamp evidence
- Subject to dispute if guest disputes non-arrival

**Trigger Source Declaration:** The exact mechanism of no-show detection is out of scope for this protocol. However, Booking Terms normatively requires that:

1. The `proof_method` field must be declared at booking time
2. The trigger source must be a verifiable system of record
3. Evidence must be available for dispute resolution

Acceptable `proof_method` values:
- `pms_attestation`: Signed record from venue's Property Management System
- `keycard_inactive`: No room key activated by detection time
- `checkin_system_log`: Timestamped check-in system records
- `front_desk_declaration`: Staff attestation (lowest evidentiary weight)

This prevents arbitrary penalty capture while keeping implementation flexible across venue types.

### 6.6 Incidentals & Variance

For charges beyond the original booking (minibar, room service, damages):
- `bookingTerms:incidentals_authority` must be present in Intent Mandate
- Maximum variance (e.g., 15%) prevents runaway charges
- Itemised receipt required for any additional capture
- Guest can dispute incidentals via standard chargeback process

### 6.7 Modification & Re-signature

When modifications increase total liability:
- `requires_mandate_amendment_if_increase: true` enforces re-signature
- User must explicitly approve increased charges
- New CartMandate issued, referencing original Intent Mandate
- Prevents "bait and switch" pricing scenarios

### 6.8 Currency & Exchange Rate Risk

For international bookings:
- `refund_currency_basis` specifies whether refunds are in original payment currency or merchant local currency
- If `original_payment_currency`: guest bears no FX risk on refunds
- If `merchant_local_currency`: guest accepts FX variance
- Recommendation: default to `original_payment_currency` for consumer protection

### 6.9 Dispute Resolution

Booking Terms transactions provide a complete evidence chain:
- Signed Intent Mandate (user's stated requirements)
- Signed Cart Mandate (exact terms agreed, with policy snapshot)
- Payment Mandate (issuer visibility)
- Venue snapshot (venue's published policies at booking time)
- Capture/refund audit trail
- PMS attestation (for no-show disputes)

The CartMandate serves as the **Digital Contract** in any chargeback mediation. The policy snapshot hash proves what terms were agreed, regardless of subsequent changes to venue policies.

---

## 7. Implementation Guidance

### 7.1 For Venues

1. **Publish Venue with Booking Terms policies**: Define your cancellation, modification, and payment policies in your Venue
2. **Implement ACP endpoints**: Standard ACP with Booking Terms line item extensions
3. **Integrate mandate verification**: Validate AP2 mandates on checkout completion
4. **Connect to payment orchestration**: Use Booking Terms payment agreement to schedule captures

### 7.2 For Agents

1. **Fetch and verify Venue**: Before presenting options, verify venue Venue is valid
2. **Generate compliant mandates**: Include all Booking Terms hospitality constraints
3. **Present terms clearly**: Ensure user understands cancellation terms before signing
4. **Handle lifecycle events**: Process cancellation, modification, no-show appropriately

### 7.3 For Payment Providers

1. **Support date-windowed SPTs**: Implement `valid_from` / `valid_until`
2. **Implement revocation**: Support cancellation-triggered SPT revocation
3. **Process Payment Mandates**: Use `bookingTerms:payment_signals` for risk assessment
4. **Provide scheduled capture APIs**: Enable balance capture on future dates

---

## 8. Roadmap

### Phase 1: Specification (Current)
- Booking Terms profile specification
- Reference schemas
- Example flows

### Phase 2: Implementation
- Reference implementation (Selfe platform)
- Venue publisher tools
- Agent SDK extensions

### Phase 3: Adoption
- Stripe SPT enhancement proposal
- AP2 hospitality extension contribution
- DMO pilot deployments

### Phase 4: Standardisation
- Submit to ACP working group
- Submit to AP2 working group
- Industry body review (HTNG, OTA)

---

## 9. References

- [Agentic Commerce Protocol (ACP)](https://agenticcommerce.dev)
- [Agent Payments Protocol (AP2)](https://ap2-protocol.org)
- [Stripe SharedPaymentToken](https://docs.stripe.com/agentic-commerce)
- [Venue Specification](https://selfe.ai/venue) (forthcoming)
- [A2A Agent Cards](https://a2a-protocol.org)

---

## Appendix A: Schema Definitions

Full JSON Schema definitions are available at:
`https://open-hospitality.org/payment-contract/v0.1/schemas/`

- `folio-checkout-session.schema.json`
- `folio-payment-agreement.schema.json`
- `folio-intent-mandate.schema.json`
- `folio-cart-mandate.schema.json`
- `folio-payment-mandate.schema.json`
- `folio-venue-policies.schema.json`

---

## Appendix B: Glossary

| Term | Definition |
|------|------------|
| **Booking Terms** | Hospitality profile for ACP and AP2 |
| **Payment Agreement** | Contract governing future payment events |
| **Verification Capture** | Small charge to confirm card validity |
| **Deposit** | Partial payment at booking time |
| **Balance** | Remaining payment, typically at check-in |
| **Cancellation Decay** | Reducing refund percentage over time |
| **No-Show** | Guest fails to arrive, triggering penalty |
| **PMS Attestation** | Signed proof from Property Management System confirming no-show |
| **Venue** | Venue identity and capability descriptor |
| **Mandate** | Cryptographically signed statement of intent |
| **SPT** | Stripe SharedPaymentToken |
| **Policy Snapshot** | Point-in-time capture of venue policies, hash-bound in mandate |
| **Liveness Check** | Pre-capture verification that payment method is still valid |
| **Incidentals Authority** | User authorization for additional charges (minibar, damages, etc.) |

---

## Appendix C: Change Log

| Version | Date | Changes |
|---------|------|---------|
| 0.1 | 2025-01-04 | Initial draft |
| 0.1.1 | 2025-01-04 | Added: Liveness precheck webhook, policy snapshot binding, PMS attestation for no-show proof, incidentals authority, FX risk handling, mandate re-signature requirements |

---

*This specification is released under Apache 2.0 license.*

*For questions or contributions: folio@selfe.ai*

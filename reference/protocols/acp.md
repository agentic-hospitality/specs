---
title: Agentic Commerce Protocol (ACP)
description: How Agentic Booking relates to OpenAI and Stripe's commerce protocol—checkout sessions, payment elements, and hospitality extensions.
order: 4
---

# Agentic Commerce Protocol (ACP)

OpenAI and Stripe's protocol for AI-native commerce.

---

## What is ACP?

ACP (Agentic Commerce Protocol) is a joint initiative from OpenAI and Stripe announced in 2025 to enable AI agents to complete purchases. It focuses on the checkout flow—how agents acquire payment credentials and execute transactions.

::card-group{cols="2"}
  ::card{title="Checkout Sessions" icon="ph:shopping-cart"}
  Structured checkout flows agents can navigate programmatically.
  ::
  ::card{title="Payment Elements" icon="ph:credit-card"}
  UI components for human-in-the-loop payment confirmation.
  ::
  ::card{title="Cart Management" icon="ph:list-bullets"}
  Standardised cart operations (add, remove, update).
  ::
  ::card{title="SPT (SharedPaymentToken)" icon="ph:key"}
  Secure payment credential sharing between agents and merchants.
  ::
::

---

## ACP vs Hospitality

ACP was designed for retail commerce: immediate payment, immediate fulfillment. Hospitality differs:

| ACP (Retail) | Hospitality |
|--------------|-------------|
| Pay now, ship later | Deposit now, balance later |
| Single payment | Multiple payment events |
| Simple cancellation | Tiered refund policies |
| No "no-show" concept | No-show penalties |

ACP provides the payment rails. [Folio](/building-blocks/folio) adds hospitality payment semantics.

---

## Extending ACP for Hospitality

### Payment Schedule Extension

ACP's checkout assumes single payment. We extend with a payment schedule:

```json
{
  "acp_checkout": {
    "session_id": "cs_abc123",
    "total": { "amount": 29000, "currency": "GBP" }
  },
  "hospitality_extension": {
    "payment_schedule": [
      {
        "type": "deposit",
        "amount": { "amount": 5000, "currency": "GBP" },
        "due": "on_booking"
      },
      {
        "type": "balance",
        "amount": { "amount": 24000, "currency": "GBP" },
        "due": "14_days_before"
      }
    ]
  }
}
```

### Cancellation Policy Extension

ACP doesn't model cancellation. We add tiered refund policies:

```json
{
  "hospitality_extension": {
    "cancellation_policy": {
      "tiers": [
        { "days_before": 14, "refund_percent": 100 },
        { "days_before": 7, "refund_percent": 50 },
        { "days_before": 0, "refund_percent": 0 }
      ]
    }
  }
}
```

---

## SPT for Hospitality

ACP's SharedPaymentToken (SPT) allows agents to store and reuse payment credentials. For hospitality, we extend SPT to support:

### Deferred Charges

```json
{
  "spt": {
    "token_id": "spt_xyz789",
    "payment_method": "pm_abc123"
  },
  "authorized_charges": [
    {
      "type": "deposit",
      "max_amount": { "amount": 5000, "currency": "GBP" },
      "execute_at": "on_creation"
    },
    {
      "type": "balance",
      "max_amount": { "amount": 24000, "currency": "GBP" },
      "valid_from": "2026-03-01"
    }
  ]
}
```

### No-Show Authorization

```json
{
  "authorized_charges": [
    {
      "type": "no_show",
      "max_amount": { "amount": 29000, "currency": "GBP" },
      "valid_from": "2026-03-16",
      "requires_proof": true
    }
  ]
}
```

---

## Implementation Pattern

```
1. Agent creates booking → Venue returns ACP checkout session

2. User completes checkout → SPT stored with hospitality extensions

3. Deposit captured immediately via SPT

4. Balance captured on due date via scheduled charge

5. If cancelled → Refund calculated per policy, executed via SPT

6. If no-show → Charge executed with proof attestation
```

---

## Relationship to AP2

ACP and [AP2](/reference/protocols/ap2) solve similar problems differently:

| Aspect | ACP | AP2 |
|--------|-----|-----|
| Origin | OpenAI + Stripe | Google + UCP |
| Focus | Checkout flow | Authorization proof |
| Strength | Stripe integration | Cryptographic mandates |
| Hospitality fit | Needs extension | Needs extension |

Both need hospitality extensions. Folio provides the vocabulary; either protocol can execute it.

---

## Resources

- [Stripe Agentic Toolkit](https://stripe.com/docs/agentic)
- [OpenAI Commerce Plugins](https://platform.openai.com/docs/plugins/commerce)

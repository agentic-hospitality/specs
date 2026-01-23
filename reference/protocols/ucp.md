---
title: Universal Commerce Protocol (UCP)
description: How Agentic Booking relates to Google's Universal Commerce Protocol—capability negotiation, transport bindings, and hospitality semantics.
order: 2
---

# Universal Commerce Protocol (UCP)

How Agentic Booking relates to the Universal Commerce Protocol.

---

## What is UCP?

The [Universal Commerce Protocol](https://ucp.dev) is an open standard for agentic commerce launched by Google in January 2026. Co-developed with Shopify, Walmart, Target, Etsy, and Wayfair, endorsed by Stripe, Visa, Mastercard, PayPal, and 20+ others.

::card-group{cols="2"}
  ::card{title="Capability Negotiation" icon="ph:handshake"}
  How agents and businesses agree on what's supported.
  ::
  ::card{title="Transport Bindings" icon="ph:plugs-connected"}
  REST, MCP, A2A—same capability, multiple transports.
  ::
  ::card{title="Payment Architecture" icon="ph:credit-card"}
  AP2 mandates and payment handlers.
  ::
  ::card{title="Lifecycle Management" icon="ph:arrows-clockwise"}
  Order states and webhooks.
  ::
::

UCP is the orchestration layer. It defines *how* commerce happens.

---

## Agentic Booking + UCP

```
┌─────────────────────────────────────────────────────────────┐
│  Curator                                                    │
│  Discovery + Trust                                          │
│  (Upstream of any commerce protocol)                        │
└─────────────────────────────┬───────────────────────────────┘
                              │ feeds venue references into
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  UCP (Universal Commerce Protocol)                          │
│                                                             │
│  ┌─────────────────────┐    ┌─────────────────────┐         │
│  │ dev.ucp.shopping.*  │    │dev.ucp.hospitality.*│         │
│  │ (Retail vertical)   │    │(Hospitality mapping)│         │
│  └─────────────────────┘    └─────────────────────┘         │
│                                                             │
│  Orchestration: Capability negotiation, state machines      │
│  Transport: REST | MCP | A2A                                │
│  Payment: AP2 mandates + handlers                           │
└─────────────────────────────────────────────────────────────┘
```

Agentic Booking defines *what* hospitality commerce means. UCP is one way to implement it.

---

## The Hospitality Gap

UCP's roadmap includes "Travel, Services" as future verticals. Their initial focus is retail.

| Retail | Hospitality |
|--------|-------------|
| Immediate fulfillment | Future-dated stays |
| Product inventory | Temporal availability |
| Simple payment (pay now) | Complex payment (deposit, balance, refunds) |
| Shipped → Delivered | Confirmed → Stayed |
| Returns | Cancellations with tiers |

Same orchestration. Different vocabulary.

---

## What UCP Provides

### Capability Negotiation

```json
{
  "capabilities": [
    {
      "name": "dev.ucp.hospitality.venue",
      "version": "2026-01-11"
    },
    {
      "name": "dev.ucp.hospitality.booking-terms",
      "version": "2026-01-11",
      "extends": "dev.ucp.shopping.checkout"
    }
  ]
}
```

### Transport Bindings

| Transport | Description |
|-----------|-------------|
| **REST** | OpenAPI-defined HTTP endpoints |
| **A2A** | Agent-to-agent messaging |

### Profile Discovery

Venues publish at `/.well-known/ucp`:

```json
{
  "ucp": {
    "version": "2026-01-11",
    "services": {
      "dev.ucp.hospitality": {
        "rest": { "endpoint": "https://api.venue.com/ucp/v1" }
      }
    },
    "capabilities": [...]
  }
}
```

---

## What Agentic Booking Provides

### Curator (Discovery)

UCP explicitly doesn't standardize discovery. Hospitality needs:

- Regional authorities (DMOs)
- Trust through convergence
- Verification beyond self-assertion

Curator sits above UCP and feeds venue references into it.

### Venue Vocabulary

UCP's `shop` doesn't capture what makes hospitality different:

- **Vibe**: Subjective character
- **Fit**: What it's good for and not
- **Units**: Rooms, tables with temporal availability
- **Evidence**: Claims with provenance

### Booking Terms

UCP's `checkout` handles immediate payment. [Folio](/building-blocks/folio) adds:

- Deposit schedules
- Balance timing
- Cancellation tiers
- No-show policies

### Stay Lifecycle

UCP's `order` tracks Placed → Shipped → Delivered. [Stay](/building-blocks/stay) adds:

```
Request → Available → Held → Booked → Confirmed → Arrived → Stayed → Completed
```

---

## UCP Capability Mapping

| Agentic Booking | UCP Capability |
|-----------------|----------------|
| Curator | Above UCP (discovery layer) |
| Venue | `dev.ucp.hospitality.venue` |
| Folio | `dev.ucp.hospitality.booking-terms` |
| Stay | `dev.ucp.hospitality.stay` |

---

## Resources

- [UCP Specification](https://ucp.dev/specification/overview)
- [UCP GitHub](https://github.com/Universal-Commerce-Protocol/ucp)
- [AP2 Protocol](/reference/protocols/ap2)

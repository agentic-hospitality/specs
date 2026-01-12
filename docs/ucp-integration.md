# UCP Integration

How Agentic Hospitality relates to the Universal Commerce Protocol.

---

## What is UCP?

The [Universal Commerce Protocol](https://ucp.dev) is an open standard for agentic commerce launched by Google in January 2026. Co-developed with Shopify, Walmart, Target, Etsy, and Wayfair, endorsed by Stripe, Visa, Mastercard, PayPal, and 20+ others.

UCP provides:

- **Capability negotiation**: How agents and businesses agree on what's supported
- **Transport bindings**: REST, MCP, A2A
- **Payment architecture**: AP2 mandates, payment handlers
- **Lifecycle management**: Order states, webhooks

UCP is the orchestration layer. It defines *how* commerce happens.

---

## What is Agentic Hospitality?

Agentic Hospitality provides:

- **Discovery**: Curator layer for finding and trusting venues
- **Vocabulary**: What a venue is, what booking terms mean, what lifecycle states exist

Agentic Hospitality defines *what* hospitality commerce means. It can be implemented using UCP, or other commerce protocols.

---

## How they could fit together

UCP is one way to implement Agentic Hospitality. Here's how the mapping would work:

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

This is one binding. The same semantics can be implemented using other commerce stacks.

---

## The gap we fill

UCP's roadmap explicitly includes "Travel, Services" as future verticals. Their initial focus is retail.

Hospitality differs from retail:

| Retail | Hospitality |
|--------|-------------|
| Immediate fulfillment | Future-dated stays |
| Product inventory | Temporal availability |
| Simple payment (pay now) | Complex payment (deposit, balance, refunds) |
| Shipped → Delivered | Confirmed → Stayed |
| Returns | Cancellations with tiers |

Same orchestration. Different vocabulary.

---

## What UCP provides (that we use)

### Capability negotiation

Agents and venues declare what they support:

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

### Transport bindings

Venues can expose hospitality capabilities via any UCP transport:

- **REST**: OpenAPI-defined HTTP endpoints
- **MCP**: JSON-RPC for LLM tool calling
- **A2A**: Agent-to-agent messaging

Same capability, multiple transports.

### Payment architecture

UCP separates:

- **Payment handlers**: How to acquire credentials (Stripe, Google Pay, etc.)
- **AP2 mandates**: Cryptographic proof of authorization

We extend AP2 mandates with booking-specific terms (deposits, cancellation, no-show).

### Profile discovery

Venues publish at `/.well-known/ucp`:

```json
{
  "ucp": {
    "version": "2026-01-11",
    "services": {
      "dev.ucp.hospitality": {
        "rest": {
          "endpoint": "https://api.venue.com/ucp/v1"
        }
      }
    },
    "capabilities": [...]
  }
}
```

---

## What we provide (that UCP doesn't)

### Curator (discovery layer)

UCP explicitly doesn't standardize discovery:

> "UCP uses existing Merchant Center feeds and Shopping Graph data for discovery."

That works for retail. Hospitality needs:

- Regional authorities (DMOs)
- Trust through convergence
- Verification beyond self-assertion

Curator sits above UCP and feeds venue references into it.

### Venue vocabulary

UCP's `shop` doesn't capture what makes hospitality venues different:

- **Vibe**: Subjective character (quiet, lively, romantic)
- **Fit**: What it's good for and not
- **Units**: Rooms, tables, experiences with temporal availability
- **Neighbourhood**: Location context
- **Evidence**: Claims with provenance and verification

### Booking terms

UCP's `checkout` handles immediate payment. Hospitality needs:

- Deposit schedules
- Balance timing
- Cancellation tiers
- No-show policies
- Modification rules

Booking Terms defines these semantics. Within UCP, they augment checkout.

### Stay lifecycle

UCP's `order` tracks Placed → Shipped → Delivered. Hospitality needs:

```
Request → Available → Held → Booked → Confirmed → Arrived → Stayed → Completed
```

Plus branch states: Modified, Cancelled, No-Show.

---

## How UCP would consume these semantics

When implemented within UCP, these specs map to UCP's capability model.

### Booking Terms → Checkout augmentation

UCP's `extends` mechanism allows capabilities to augment others:

```json
{
  "name": "dev.ucp.hospitality.booking-terms",
  "extends": "dev.ucp.shopping.checkout"
}
```

This declares: "Booking Terms adds hospitality payment semantics to UCP's checkout flow."

Schema composition uses `allOf`:

```json
{
  "$defs": {
    "hospitality_checkout": {
      "allOf": [
        {"$ref": "https://ucp.dev/schemas/shopping/checkout.json"},
        {
          "type": "object",
          "properties": {
            "booking_terms": {
              "$ref": "#/$defs/booking_terms"
            }
          }
        }
      ]
    }
  }
}
```

---

## Implementation path

### For venues

1. **Publish UCP profile** at `/.well-known/ucp`
2. **Declare hospitality capabilities** in the profile
3. **Expose endpoints** via REST, MCP, or A2A
4. **Register with Curators** for discovery

### For agents

1. **Query Curators** for venue recommendations
2. **Fetch UCP profiles** from recommended venues
3. **Negotiate capabilities** with venue
4. **Execute booking** via negotiated transport
5. **Handle lifecycle** via stay states

### For Curators

1. **Index venues** with UCP profiles
2. **Verify claims** using evidence
3. **Expose Curator endpoint** for agent queries
4. **Feed venue references** into UCP ecosystem

---

## Namespace governance

UCP uses reverse-domain naming:

| Namespace | Authority |
|-----------|-----------|
| `dev.ucp.*` | UCP governing body |
| `com.google.*` | Google |
| `com.stripe.*` | Stripe |

We're proposing `dev.ucp.hospitality.*` as an official UCP vertical.

Until accepted, implementations can use provisional namespaces (e.g., `ai.selfe.hospitality.*`).

---

## Status

| Component | UCP Relationship |
|-----------|------------------|
| Curator | Above UCP (discovery layer) |
| Venue | Proposed: `dev.ucp.hospitality.venue` |
| Booking Terms | Proposed: `dev.ucp.hospitality.booking-terms` |
| Stay | Proposed: `dev.ucp.hospitality.stay` |
| Bookable | Proposed: `dev.ucp.bookable` (base pattern) |

We're actively proposing these specs to UCP's GitHub discussions.

---

## Resources

- [UCP Specification](https://ucp.dev/specification/overview)
- [UCP GitHub](https://github.com/Universal-Commerce-Protocol/ucp)
- [AP2 Protocol](https://ap2-protocol.org/)
- [Google's UCP Announcement](https://blog.google/products/ads-commerce/agentic-commerce-ai-tools-protocol-retailers-platforms/)

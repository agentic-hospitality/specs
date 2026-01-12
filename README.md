# Agentic Hospitality

Domain semantics for AI agent discovery and booking in hospitality. Defines venues, booking terms, trust, and lifecycle — what Ai agents need to understand and book places to eat, drink, stay, and play.

---

## The shift

In 2026, finding places to eat, drink, stay or play starts with a question, not a search.

*"Find me a pub with rooms near Blakeney, the kind of place locals actually go, dog-friendly, nothing too formal."*

For an AI agent to answer that well, it needs structured ways to discover venues, understand what they're actually like, verify claims, and complete bookings. That's what these specs provide.

---

## The specs

### Curator

How agents find trusted sources.

Curator defines how authorities (DMOs, portfolios, editorial guides) express what they know about collections of venues.

Curator exists specifically because commerce protocols intentionally avoid defining trust, authority, and taste.

```
Agent: "Dog-friendly hotel in Norfolk?"
    │
    ▼
Agent queries Curators (Visit Norfolk, Great British Hotels)
    │
    ▼
Curators return venue references
    │
    ▼
Agent fetches Venue definitions
    │
    ▼
Agent evaluates fit, recommends, books
```

**[→ Curator specification](/curator)**

---

### Venue

What a hospitality venue publishes to be understood by AI agents.

```
Venue
├── Identity        Who this is, proof of control
├── Vibe            What it feels like
├── Attributes      Rooms, facilities, policies
├── Evidence        Claims with provenance
├── Fit             What it's good for (and not)
├── Units           Rooms, tables, experiences
├── Neighbourhood   What's nearby
├── Presentation    UI components
└── Answers         Quotable explanations
```

**[→ Venue specification](/venue)**

---

### Booking Terms

Hospitality booking obligations and lifecycle semantics.

Booking Terms defines what hospitality transactions mean, independent of how those obligations are executed or paid for.

Hospitality isn't instant commerce. A booking is an agreement about the future:

- Deposit now, balance at check-in
- Refund if cancelled, but less as date approaches
- Charge if no-show
- Fee if modified

```
Booking Terms
├── Payment schedule    Deposit, balance, timing
├── Cancellation        Refund tiers by days before
├── No-show policy      When and how much
├── Modification terms  What changes cost
└── Mandate             Proof of agreement
```

These terms can be carried over:
- Payment authorization systems
- Commerce orchestration layers  
- Direct PSP integrations
- However you process payments

Same semantics, many carriers.

**[→ Booking Terms specification](/booking-terms)**

---

### Stay

The booking lifecycle.

```
Request → Available → Held → Booked → Confirmed → Arrived → Stayed → Completed
```

Plus: `Modified`, `Cancelled`, `No-Show` as branch states.

**[→ Stay specification](/stay)**

---

### Bookable

The base pattern underlying Venue.

Venue is Bookable for hospitality. Bookable is the domain-agnostic pattern:

```
Bookable
├── Identity       Who this is
├── Evidence       Claims with provenance
├── Fit            What it's good for
├── Actions        What an agent can do
└── Answers        Quotable explanations
```

Could apply beyond hospitality.

**[→ Bookable specification](/bookable)**

---

## How they connect

```
┌───────────────────────────────────────────────────────────────┐
│                      CURATOR INDEX                             │
│           (Which Curators exist? Geographic routing)           │
└───────────────────────────┬───────────────────────────────────┘
                            │
         ┌──────────────────┼──────────────────┐
         ▼                  ▼                  ▼
  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
  │Visit Norfolk│    │  Cottages   │    │  Good Food  │
  │   (DMO)     │    │ (Portfolio) │    │ (Editorial) │
  └──────┬──────┘    └──────┬──────┘    └──────┬──────┘
         │                  │                  │
         └──────────────────┼──────────────────┘
                            │
                            ▼
              ┌───────────────────────┐
              │        VENUE          │
              │   + Booking Terms     │
              │   + Stay lifecycle    │
              └───────────────────────┘
```

**Discovery flows down.** Index → Curators → Venue references → Venues.

**Trust flows up.** Venue publishes → Curators verify → Convergence = confidence.

---

## Epistemic separation

Each layer speaks only to what it can credibly claim:

| Layer | Who speaks | What they claim |
|-------|------------|-----------------|
| **Venue** | The venue | "This is who I am" |
| **Curator** | The authority | "This is what I know about them" |
| **Booking Terms** | The transaction | "This is what was agreed" |

Venues don't claim authority. Authorities don't claim to be venues. This separation is load-bearing.

---

## Protocol bindings

These specs define hospitality semantics. They are designed to be expressed over existing agent and commerce protocols, including:

| Protocol | Role |
|----------|------|
| [A2A](https://google.github.io/A2A/) / [MCP](https://modelcontextprotocol.io/) | Transport |
| [AP2](https://ap2-protocol.org/) | Payment authorization |
| [UCP](https://ucp.dev) | Commerce lifecycle orchestration |
| [ACP](https://stripe.com/docs/acp) | Agent coordination |
| REST | Direct HTTP |

The specs define WHAT hospitality commerce means. Protocols define HOW it moves.

### UCP integration

Google's [Universal Commerce Protocol](https://ucp.dev) launched January 2026 as an orchestration layer for agentic commerce. We're proposing these specs as a hospitality vertical. This is one binding, not the only one.:

| Our spec | UCP capability |
|----------|----------------|
| Venue | `dev.ucp.hospitality.venue` |
| Booking Terms | `dev.ucp.hospitality.booking_terms` |
| Stay | `dev.ucp.hospitality.stay` |

See [UCP Integration](/docs/ucp-integration.md) for details.

---

## Getting started

**If you're a venue** wanting to be AI-bookable:
→ Start with [Venue](/venue)

**If you're a DMO or authority** wanting to curate venues:
→ Start with [Curator](/curator)

**If you're integrating payments**:
→ Start with [Booking Terms](/booking-terms)

**If you're building agent tooling**:
→ Start with [Bookable](/bookable)

---

## Repository structure

```
/
├── README.md
├── LICENSE.md
├── CONTRIBUTING.md
│
├── /bookable                    # Base pattern
│   ├── README.md
│   └── /spec
│
├── /curator                     # Discovery layer
│   ├── README.md
│   └── /spec
│
├── /venue                       # Hospitality identity
│   ├── README.md
│   └── /spec
│
├── /booking-terms               # Payment semantics
│   ├── README.md
│   └── /spec
│
├── /stay                        # Lifecycle states
│   ├── README.md
│   └── /spec
│
└── /docs
    ├── getting-started.md
    ├── identity-and-trust.md
    ├── for-dmos.md
    ├── ucp-integration.md
    ├── curator-manifesto.md
    └── roadmap.md
```

---

## Status

| Spec | Version | Status |
|------|---------|--------|
| Curator | 0.2.0 | Draft |
| Venue | 0.1.0 | Draft |
| Booking Terms | 0.1.0 | Draft |
| Stay | 0.1.0 | Draft |
| Bookable | 0.1.0 | Draft |

**License:** MIT

These are working specifications. They will evolve based on feedback and implementation experience.

---

## Contributing

Open an issue. Submit a PR. Tell us what's wrong or missing.

We're not precious about this. If something doesn't work, say so.

---

<p align="center">
  <br />
  <em>Domain semantics for agentic hospitality</em>
  <br /><br />
  <a href="./docs/getting-started.md">Get Started</a> · <a href="./docs/roadmap.md">Roadmap</a> · <a href="./CONTRIBUTING.md">Contribute</a>
</p>


## About

Developed by [Selfe](https://selfe.ai) as part of the Agentic Norfolk project, supported by Innovate UK.

If you're implementing these specs and need help, [get in touch](mailto:hello@selfe.ai).

---
title: Bookable Pattern
description: The base pattern for AI-bookable entities—identity, evidence, fit, actions, presentation, and answers that enable defensible agent recommendations.
order: 1
---

# Bookable Pattern

The base pattern for anything an AI agent can discover, trust, and transact with.

---

::callout{type="info"}
Bookable is not a protocol—it's a **pattern** that domain-specific extensions inherit from. Think of it as the DNA that all bookable entities share.
::

## The Problem

::card-group{cols="3"}
  ::card{title="1. Determine Fit" icon="search"}
  Does this entity match what the user actually wants? Not just availability—true alignment with intent.
  ::

  ::card{title="2. Defend the Choice" icon="shield"}
  Can the agent explain *why* it recommended this? With citations, not vibes.
  ::

  ::card{title="3. Complete the Transaction" icon="circle-check"}
  Can it actually make the booking? With proper authentication and error handling.
  ::
::

Traditional APIs give agents data. Bookable gives agents **understanding**.

---

## The Six Blocks

Every Bookable record is built from six interconnected blocks:

::steps
### Identity

Verifiable existence. Who is this entity, where are they, and can we cryptographically prove they control this record?

```json
{
  "identity": {
    "name": "The Griffin Inn",
    "location": {
      "address": "Beacon Vale, Beaconshire LD3 0UB",
      "coordinates": [51.9634, -3.3842]
    },
    "domain": "griffininn.co.uk",
    "did": "did:web:griffininn.co.uk"
  }
}
```

### Evidence

Proof supporting claims. Every assertion links to sources with confidence scores and verification status. No more "trust me, it's dog-friendly".

```json
{
  "evidence": {
    "dogFriendly": {
      "claim": "Dogs welcome in all areas including restaurant",
      "confidence": 0.95,
      "convergence": "strong",
      "sources": [
        { "type": "human_observation", "sourceRef": "DMO site visit Oct 2024" },
        { "type": "curator_certification", "sourceRef": "Visit Beaconshire credential" }
      ]
    }
  }
}
```

### Fit

Explicit intent alignment. What the entity is good for—and critically, what it's **not** good for.

```json
{
  "fit": {
    "strong": [
      { "intent": "romantic getaway", "confidence": 0.95 }
    ],
    "weak": [
      { "intent": "family with young children", "reason": "Adult-focused atmosphere" }
    ]
  }
}
```

### Actions

What operations can an agent perform? Check availability, get rates, book, modify, cancel.

```json
{
  "actions": {
    "capabilities": ["check-availability", "get-rates", "book", "modify", "cancel"],
    "endpoint": "https://example.com/api/agent",
    "protocol": "jsonrpc"
  }
}
```

### Presentation

UI components for human confirmation. Agents choose, humans confirm.

```json
{
  "presentation": {
    "components": {
      "summary": { "type": "card", "template": { ... } },
      "gallery": { "type": "image-grid", "template": { ... } }
    },
    "layouts": {
      "detail": ["gallery", "summary"]
    }
  }
}
```

### Answers

Pre-computed responses to common questions, linked to evidence for citation.

```json
{
  "answers": [
    {
      "question": "Is this place dog friendly?",
      "answer": "Yes, dogs welcome in all areas including the restaurant.",
      "confidence": 0.98,
      "basedOn": ["evidence.dogFriendly"]
    }
  ]
}
```
::

---

## Why Evidence Matters

::card-group{cols="2"}
  ::card{title="Traditional Approach" icon="circle-x"}
  Hotel says "dog-friendly". Agent trusts it. Guest arrives with dog to find they're only allowed in one annexe room and banned from the restaurant.

  **Result:** Frustrated guest, complaint, refund request.
  ::

  ::card{title="Evidence-Based Approach" icon="circle-check"}
  Evidence block shows DMO site visit confirming dogs welcome throughout, Visit Beaconshire accessibility credential, and photos of water bowls in the bar.

  **Result:** Agent can cite verifiable sources. Reality matches the claim.
  ::
::

Now the agent can say: *"I recommend The Griffin because Visit Beaconshire verified dogs are welcome in all areas during their October inspection, and the DMO confirmed water bowls are provided in the restaurant"*—not just *"it says it's dog-friendly"*.

---

## Declaring Weak Fit

::callout{type="tip"}
Most systems only describe what they're good at. Bookable encourages entities to declare what they're **not** good for.
::

This is counterintuitive but powerful:

::card-group{cols="3"}
  ::card{title="Prevents Bad Matches" icon="shield-off"}
  A romantic adults-only hotel shouldn't be recommended for a family trip—even if it has availability.
  ::

  ::card{title="Reduces Friction" icon="refresh-cw"}
  No more book-then-complain-then-refund cycles. Set expectations upfront.
  ::

  ::card{title="Builds Trust" icon="heart"}
  Honesty about limitations signals integrity. Guests trust venues that are upfront.
  ::
::

---

## Extensions

Bookable is the base. Extensions add domain-specific vocabulary:

| Extension | Domain | What It Adds |
|-----------|--------|--------------|
| [Venue](/building-blocks/venue) | Physical locations | Facilities, vibe, neighbourhood context |
| [Stay](/building-blocks/stay) | Booking lifecycle | States, transitions, holds, cancellations |
| [Folio](/building-blocks/folio) | Financial records | Charges, payments, refunds |
| [Curator](/building-blocks/curator) | Aggregators | Curation, distribution, attribution |

::callout{type="info"}
An agent can interact with any extension as a Bookable without knowing its specific type. The base pattern is universal.
::

---

## Type Hierarchy

```
Bookable (base)
└── Venue (hospitality)
    ├── Hotel, BnB, Hostel
    ├── Restaurant, Cafe, Bar
    ├── Museum, Tour, Activity
    └── Spa, Salon
```

Stay, Folio, and Curator are complementary specs—not venue types. Stay tracks the booking lifecycle, Folio handles payments, Curator manages aggregation.

---

::card-group
  ::card{title="Specification" to="/reference/bookable/spec" icon="file-code"}
  Full technical specification with schemas, requirements, and conformance rules.
  ::
  ::card{title="Venue Examples" to="/reference/venue/examples" icon="code"}
  See Bookable in practice through complete Venue records.
  ::
::

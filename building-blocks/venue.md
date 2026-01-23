---
title: Venue Extension
description: The hospitality extension for physical locations—hotels, restaurants, bars with vibe, attributes, units, and neighbourhood context for AI discovery.
order: 2
---

# Venue Extension

The hospitality extension for describing physical locations where bookings take place.

---

## What is Venue?

A **Venue** represents any physical establishment that offers Bookables—hotels, restaurants, bars, spas, activity centres. It's the container that holds inventory and provides the context for what guests can expect.

Venue is a namespace extension to A2A Agent Cards that defines what AI agents need hospitality venues to express in order to make defensible recommendations and complete bookings.

::callout{type="info"}
Venue does not define a new protocol. It defines a structured vocabulary within existing A2A Agent Cards, extending the base Bookable pattern with hospitality-specific concepts.
::

---

## Core Concepts

Venue extends the Bookable base pattern with additional blocks specific to physical hospitality establishments.

::card-group{cols="3"}
  ::card{title="Identity" to="/reference/venue/spec#3-identity" icon="id-card"}
  Verifiable existence: name, location, coordinates, domain ownership, and company registration.
  ::
  ::card{title="Vibe" to="/reference/venue/spec#4-vibe" icon="sparkles"}
  Subjective character structured for matching: essence, atmosphere, energy, formality.
  ::
  ::card{title="Attributes" to="/reference/venue/spec#5-attributes" icon="clipboard-list"}
  Factual, quantified characteristics: rooms, facilities, accessibility, policies.
  ::
::

::card-group{cols="3"}
  ::card{title="Evidence" to="/reference/venue/spec#6-evidence" icon="badge-check"}
  Proof supporting claims with provenance, verification status, and confidence scores.
  ::
  ::card{title="Fit" to="/reference/venue/spec#7-fit" icon="target"}
  Explicit intent alignment—what the venue is good for, and critically, what it is not.
  ::
  ::card{title="Units" to="/reference/venue/spec#9-units" icon="bed"}
  Bookable sub-entities: rooms, tables, areas. Each inherits from venue level.
  ::
::

::card-group{cols="2"}
  ::card{title="Neighbourhood" to="/reference/venue/spec#10-neighbourhood" icon="map-pin"}
  Location context beyond coordinates: setting, walkability, proximity to points of interest.
  ::
  ::card{title="Presentation" to="/reference/venue/spec#11-presentation" icon="layout-template"}
  A2UI components for human-in-the-loop confirmation when agents present options.
  ::
::

---

## Type Hierarchy

Venue defines a polymorphic type system enabling agents to work at different levels of abstraction.

```
Bookable (base)
└── Venue (hospitality)
    ├── Accommodation (Hotel, BnB, Hostel)
    ├── Eat (Restaurant, Cafe, Bar)
    ├── Experience (Museum, Tour, Activity)
    └── Service (Spa, Salon)
```

All types inherit from `Bookable`. Agents MAY interact with any `Bookable` without knowing its specific type—if it's Bookable, you can book it.

::callout{type="info"}
Note: [Stay](/building-blocks/stay) is the booking lifecycle spec, not a venue type. When you book an Accommodation venue, the booking record follows the Stay lifecycle.
::

---

## How Agents Use Venues

When planning a trip, agents query Venue data to make defensible recommendations.

::steps
### Match Intent to Fit

Query `fit.strong` and `fit.weak` to find venues that align with user intent. A "romantic weekend" request should match venues declaring that intent as strong fit.

### Verify Evidence Quality

Check `evidence` blocks for convergence, confidence, and verification status. Prefer claims with DMO verification or human observation over unverified self-reports.

### Understand the Vibe

Use `vibe` to match subjective preferences. Is the guest looking for "lively" or "peaceful"? "Formal" or "casual"?

### Check Facilities

Query `attributes` for specific requirements: pet-friendly, EV charging, accessible rooms, check-in times.

### Present with Confidence

Use `presentation` components to render rich UI for human confirmation. Quote from `answers` to explain why this venue was recommended.
::

---

## Venue Conformance Levels

Not every implementation needs everything. Venue defines progressive conformance levels.

| Level | Required Blocks | Use Case |
|-------|-----------------|----------|
| **Venue Core** | identity, evidence, fit, actions | Minimum viable implementation |
| **Venue Extended** | Core + vibe, attributes, units, neighbourhood | Rich discovery |
| **Venue Complete** | Extended + presentation, answers | Full agent experience |

::callout{type="tip"}
Start with Venue Core. The additional blocks accelerate agent decision-making but aren't required for basic functionality.
::

---

## Why Declare Weak Fit?

Most hospitality systems only describe what venues are good for. Venue requires declaring what venues are NOT good for.

This matters because:
- Prevents bad recommendations before they happen
- Reduces book-then-complain-then-refund friction
- Signals honesty, which builds trust
- Improves agent recommendation precision

A venue declaring `fit.weak: nightlife` signals to agents not to recommend it for hen parties—before anyone books and is disappointed.

---

## Learn More

::card-group
  ::card{title="Specification" to="/reference/venue/spec" icon="file-code"}
  Full technical specification with all field definitions and requirements.
  ::
  ::card{title="Examples" to="/reference/venue/examples" icon="code"}
  Working JSON examples and complete venue payloads.
  ::
::

---
title: Roadmap
description: Current state and future direction of the Agentic Booking specifications.
order: 3
---

# Roadmap

What's done, what's next, what we're considering.

---

## Current state (v0.1)

::accordion{title="Venue"}
- ✅ Identity and verification
- ✅ Vibe (subjective character)
- ✅ Attributes (factual characteristics)
- ✅ Evidence (claims with provenance)
- ✅ Fit (strong and weak intent matching)
- ✅ Units (rooms, tables)
- ✅ Neighbourhood (location context)
- ✅ Answers (quotable explanations)
::

::accordion{title="Booking Terms"}
- ✅ Payment schedules (deposit, balance)
- ✅ Cancellation tiers
- ✅ No-show policies
- ✅ Modification terms
- ✅ AP2 mandate structure
::

::accordion{title="Stay"}
- ✅ Lifecycle states (request → completed)
- ✅ Branch states (modified, cancelled, no-show)
- ✅ Webhooks
::

::accordion{title="Curator"}
- ✅ DMO, Portfolio, Editorial types
- ✅ Stories (venue narratives)
- ✅ Certification
- ✅ Transparency requirements
- ✅ Trust hierarchy
::

---

## Next priorities

::card-group{cols=2}
  ::card{title="Real-time availability" icon="ph:clock"}
  The current specs define what a venue is. They don't yet define how agents query live availability.

  **Needed:** Availability query schema, rate/pricing response format, inventory hold protocol, calendar-based availability windows.
  ::

  ::card{title="Multi-venue itineraries" icon="ph:map-trifold"}
  People don't book one hotel. They plan trips.

  **Needed:** Itinerary container, sequential booking coordination, partial failure handling, cross-venue payment aggregation.
  ::

  ::card{title="Guest context" icon="ph:user-circle"}
  Agents need to pass user context to venues without exposing unnecessary personal data.

  **Needed:** Preference schema, privacy-preserving context passing, repeat guest recognition.
  ::

  ::card{title="Group bookings" icon="ph:users-three"}
  Business travel, weddings, events.

  **Needed:** Group request schema, room block holds, rooming list management, group payment terms.
  ::
::

---

## Considering

::accordion{title="Loyalty integration"}
How do agents check member status, apply member rates, accrue points? This overlaps with UCP's loyalty roadmap.
::

::accordion{title="Dynamic pricing"}
Seasonal variation, event-based surges, length-of-stay discounts. Needed: Rate plan vocabulary that agents can reason about.
::

::accordion{title="Add-ons and upsells"}
Room upgrades, breakfast packages, late checkout, experiences. Units with dependencies.
::

::accordion{title="Reviews and reputation"}
Review ingestion format, cross-platform aggregation, freshness signals.
::

::accordion{title="Post-stay"}
Feedback collection, issue resolution, loyalty point posting, return visit prompting.
::

---

## What we're not building

::warning
These are explicitly out of scope for Agentic Booking:
::

| Area | Why not |
|------|---------|
| **Payment processing** | That's AP2, Stripe. We define *what* should be charged *when*. |
| **Discovery infrastructure** | We define what Curators publish. We don't build the index. |
| **Agent behaviour** | We define what venues say. How agents interpret is agent responsibility. |
| **Rendering** | We define presentation components. How they render is implementation. |

---

## Contributing

::note
If something's missing or wrong, open an issue. Real-world implementation drives the roadmap.
::

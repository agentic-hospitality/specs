---
title: For Agent Builders
description: Technical quickstart for developers building AI agents that book hospitality.
order: 5
---

# For Agent Builders

Technical quickstart for developers building AI agents that book hospitality.

---

## The agent flow

::steps
  ::step{title="Understand intent"}
  Parse "romantic weekend away" into actionable criteria: location, dates, vibe, constraints.
  ::

  ::step{title="Discover venues"}
  Query Curator endpoints to find matching venues, filtered by trust and endorsement.
  ::

  ::step{title="Compare and recommend"}
  Evaluate options against guest preferences. Explain why each venue fits.
  ::

  ::step{title="Check and book"}
  Query availability, get pricing, hold inventory, confirm reservation.
  ::

  ::step{title="Manage the stay"}
  Handle modifications, cancellations, webhooks, and post-stay settlement.
  ::
::

## The building block stack

| Building Block | Purpose | What you get |
|----------------|---------|--------------|
| [Curator](/building-blocks/curator) | Discovery & trust | Find venues, filter by endorsement, weight by reputation |
| [Venue](/building-blocks/venue) | Understanding | Profiles, facilities, vibe, pre-composed answers |
| [Bookable](/building-blocks/bookable) | Availability | Query dates/slots, pricing, hold inventory |
| [Connect](/building-blocks/connect) | Integration | Real-time PMS data, live inventory, instant confirmations |
| [Stay](/building-blocks/stay) | Lifecycle | State changes, modifications, webhooks |
| [Folio](/building-blocks/folio) | Money | Charges, payments, refunds |

## Integration patterns

| Pattern | What it means | Protocols needed |
|---------|---------------|------------------|
| **Read-only** | Find and recommend; booking happens elsewhere | Curator, Venue |
| **Full booking** | End-to-end from search to checkout | All protocols |
| **Aggregator** | Index layer providing discovery for other agents | Curator, Venue |

## Key decisions

::note
These are agent decisions, not protocol decisions. The specs give you the vocabulary; you decide the behaviour.
::

| Decision | What to consider |
|----------|------------------|
| **Trust policy** | How do you weight different Curators? DMO vs blog vs chain? |
| **Caching** | Venue profiles change rarely; availability changes constantly |
| **Error handling** | What happens when booking fails? How do you communicate? |
| **Payment flow** | Handle payment yourself or hand off to venue? |

## Getting started

::steps
  ::step{title="Learn the building blocks"}
  Read the [building block overviews](/building-blocks/bookable) to understand concepts and relationships.
  ::

  ::step{title="Check the specs"}
  Review [reference specifications](/reference/venue/spec) for schema details and examples.
  ::

  ::step{title="Try the sandbox"}
  Test against sample venues and Curators. *(Coming soon)*
  ::

  ::step{title="Join the community"}
  Connect with other builders, share patterns, get help. *(Coming soon)*
  ::
::

---
title: What is this?
description: Domain semantics for AI agent discovery and booking in hospitality - extending A2A and UCP protocols.
order: 1
---

# What is Agentic Booking?

Domain semantics for AI agent discovery and booking in hospitality.

---

Agentic Booking extends [A2A (Agent-to-Agent)](https://google.github.io/A2A/) and [UCP (Universal Commerce Protocol)](https://www.ucprotocol.org/) for the hospitality vertical. It defines what AI agents need to understand and book places to eat, drink, stay, and play.

## The problem

AI agents are getting good at conversation. But when it comes to actually *doing* things—booking a hotel, reserving a table, finding the right venue—they hit a wall.

::note
Every venue has different systems. Different APIs. Different ways of describing what they offer. An agent that can book one hotel can't necessarily book another.
::

## The solution

A shared vocabulary. Open specs that define:

::card-group{cols=3}
  ::card{title="What venues publish" icon="ph:building"}
  So agents can understand them
  ::

  ::card{title="How bookings work" icon="ph:calendar-check"}
  So agents can make them
  ::

  ::card{title="Who to trust" icon="ph:shield-check"}
  So agents know which venues are legitimate
  ::
::

## The six building blocks

::card-group{cols=2}
  ::card{title="Venue" icon="ph:map-pin" href="/building-blocks/venue"}
  What a hospitality venue publishes to be understood by AI agents.
  ::

  ::card{title="Bookable" icon="ph:calendar" href="/building-blocks/bookable"}
  The base pattern for anything that can be reserved.
  ::

  ::card{title="Folio" icon="ph:wallet" href="/building-blocks/folio"}
  The guest account. Payments, charges, refunds.
  ::

  ::card{title="Stay" icon="ph:bed" href="/building-blocks/stay"}
  The booking lifecycle from request to checkout.
  ::

  ::card{title="Curator" icon="ph:sparkle" href="/building-blocks/curator"}
  Discovery and trust. How agents find and verify venues.
  ::

  ::card{title="Connect" icon="ph:plugs-connected" href="/building-blocks/connect"}
  Real-time integration. How venue systems expose live data.
  ::
::

## The architecture

Three principles shape this design:

::card-group{cols=3}
  ::card{title="Venues own identity" icon="ph:building"}
  Every venue controls its own record—hosted on its domain, signed with its keys. [DIDs](/trust/identity) let venues prove who they are without depending on any platform.
  ::

  ::card{title="Guests own data" icon="ph:wallet"}
  Booking history, preferences, and credentials belong to the guest. Stored in their wallet, presented with consent, portable across venues and agents.
  ::

  ::card{title="Curators are transparent" icon="ph:eye"}
  Who endorsed a venue? Why? [Verifiable Credentials](/trust/credentials) make trust signals cryptographically provable—not hidden algorithms.
  ::
::

This isn't decentralisation for ideology. It's for data quality. When venues control their records, they keep them current. When guests own their history, it follows them. When trust is transparent, agents can cite their reasoning.

The mechanisms: [DIDs](/trust/identity) for identity, [VCs](/trust/credentials) for claims, and [Folio](/building-blocks/folio) for portable financial records.

---

## Built on standards

This isn't a new protocol from scratch. It's an extension layer:

::card-group{cols=2}
  ::card{title="A2A (Agent-to-Agent)" icon="ph:plugs-connected" href="https://a2a-protocol.org/"}
  Google's standard for agent communication. Defines how agents discover each other and exchange messages.
  ::

  ::card{title="UCP (Universal Commerce Protocol)" icon="ph:shopping-cart" href="https://ucp.dev/"}
  The commercial transaction layer. Handles payments, lifecycle, and business logic.
  ::
::

::tip
We add the booking-specific semantics on top. Venue types, booking patterns, trust hierarchies—the vocabulary agents need for hospitality.
::

---

## Get involved

This is an open standard. We welcome contributions from venues, technology providers, and anyone building AI agents for hospitality.

- **GitHub**: [AgenticBooking/specs](https://github.com/AgenticBooking/specs)
- **Contact**: [hello@agenticbooking.org](mailto:hello@agenticbooking.org)

---

Led by [Selfe](https://selfe.ai) · 20-22 Wenlock Road, London, N1 7GU, UK

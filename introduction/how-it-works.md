---
title: How it works
description: The six building blocks of Agentic Booking - Venue, Bookable, Folio, Stay, Curator, and Connect.
order: 2
---

# How it works

The architecture of Agentic Booking.

---

## The six building blocks

Agentic Booking defines six interconnected building blocks:

| Building Block | Purpose                                                                                      |
|----------------|----------------------------------------------------------------------------------------------|
| **Venue**      | What a hospitality venue publishes to be understood by AI agents. Profile, evidence, facilities, capabilities. |
| **Bookable**   | The base pattern for anything that can be booked—rooms, tables, tickets, experiences.        |
| **Folio**      | The guest account. What's owed, what's paid, what happens if plans change.                   |
| **Stay**       | The booking lifecycle. From request through check-in, during the stay, to checkout.          |
| **Curator**    | The discovery and trust layer. How agents find venues, and know which to trust.              |
| **Connect**    | Real-time integration. How venue systems expose live availability and accept bookings.       |

## How they fit together

::steps
  ::step{title="Discovery"}
  A guest tells their agent what they want. The agent queries **Curator** for trusted venues matching the request.
  ::

  ::step{title="Evaluation"}
  The agent reads **Venue** profiles to understand options—facilities, vibe, evidence of claims.
  ::

  ::step{title="Booking"}
  The agent uses **Bookable** to check availability and make a reservation.
  ::

  ::step{title="Payment"}
  **Folio** handles the money—deposits, balance, charges during the stay.
  ::

  ::step{title="Lifecycle"}
  **Stay** manages the booking from confirmation through checkout and beyond.
  ::
::

## Extension model

Each building block extends the A2A Agent Card:

::card-group{cols=2}
  ::card{title="Standard A2A" icon="ph:identification-card"}
  Identity, capabilities, and communication endpoints from the base spec.
  ::

  ::card{title="Venue extension" icon="ph:building"}
  Profile, facilities, vibe, evidence—everything that describes the property.
  ::

  ::card{title="Bookable extension" icon="ph:calendar"}
  Inventory, availability, rates—everything needed to make a reservation.
  ::

  ::card{title="Curator endorsements" icon="ph:seal-check"}
  Trust signals from DMOs, portfolios, and editorial curators.
  ::

  ::card{title="Connect integration" icon="ph:plugs-connected"}
  Real-time APIs to the venue's property management system.
  ::
::

::tip
The extensions are additive—a venue can support any combination based on what it offers.
::

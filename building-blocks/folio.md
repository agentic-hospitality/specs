---
title: Folio Payments
description: Payment semantics for hospitality—deposit schedules, cancellation refund tiers, no-show policies, and cryptographic payment mandates.
order: 4
---

# Folio Payments

The payment semantics for hospitality bookings.

---

## What is Folio?

**Folio** defines the financial terms of a booking—what's owed, when it's due, and what happens if plans change. Where Stay tracks lifecycle states, Folio tracks money.

Hospitality transactions are agreements governing future-conditional payment execution, not immediate exchanges of value. When you book a hotel, you might pay a deposit now, balance at check-in, get a refund if you cancel, or be charged if you don't show up.

::callout{type="info"}
Folio is a vocabulary, not a payment processor. It defines how to express hospitality payment terms within existing protocols.
::

---

## Why Hospitality is Different

| Aspect | Retail | Hospitality |
|--------|--------|-------------|
| Payment timing | At purchase | Split across dates |
| Fulfilment | Days after payment | Weeks/months after booking |
| Cancellation | Rarely allowed | Core feature with refund decay |
| No-show | N/A | Triggers penalty charge |

```
Retail:      Intent → Cart → Pay → Ship → Done

Hospitality: Intent → Book → Deposit → [weeks] → Balance → Stay
                                  ↓
                            Cancel? Modify? No-show?
```

---

## Core Concepts

::card-group{cols="3"}
  ::card{title="Payment Schedule" to="/reference/folio/spec#2-payment-schedule" icon="calendar"}
  Defines when money moves: deposit at booking, balance before arrival.
  ::
  ::card{title="Cancellation Policy" to="/reference/folio/spec#3-cancellation-policy" icon="x"}
  Tiered refund decay based on days before check-in.
  ::
  ::card{title="No-Show Policy" to="/reference/folio/spec#4-no-show-policy" icon="user-x"}
  What happens if the guest doesn't arrive.
  ::
::

::card-group{cols="2"}
  ::card{title="Modification Policy" to="/reference/folio/spec#5-modification-policy" icon="pencil"}
  Rules for changing dates, rooms, or guests after booking.
  ::
  ::card{title="Mandate Integration" to="/reference/folio/spec#6-mandate-integration" icon="shield-check"}
  Cryptographic proof of what the user authorized.
  ::
::

---

## How Agents Use Folio

::steps
### Check Terms Before Booking

Query the venue's Folio policies to understand payment schedule, cancellation terms, and modification rules before presenting options.

### Present Terms Clearly

Ensure the user understands when money will be charged and what happens if plans change before confirming the booking.

### Handle Cancellations

Calculate refund amount based on cancellation tier and days before arrival. Execute refund via payment handler.

### Process Modifications

Check modification policy, apply any fees, and update the booking. If liability increases, the mandate may need re-signing.
::

---

## Guest-Owned Records

Folio isn't just venue policy—it's also the guest's record of what happened.

When a stay completes, the guest receives a signed Folio record in their wallet:

::card-group{cols="3"}
  ::card{title="Portable" icon="ph:arrows-left-right"}
  The guest's Folio moves with them. Previous stays at any venue are accessible to their agent for future bookings.
  ::

  ::card{title="Verifiable" icon="ph:seal-check"}
  Each Folio is signed by the issuing venue. Agents can verify authenticity without contacting the venue.
  ::

  ::card{title="Private" icon="ph:lock"}
  Stored in the guest's wallet, shared only with their consent. No central database of travel history.
  ::
::

This is what "guests own their data" means in practice. A guest's booking history, payment records, and stay preferences belong to them—portable across venues, agents, and time.

---

## Learn More

::card-group
  ::card{title="Specification" to="/reference/folio/spec" icon="file-code"}
  Full technical specification with schema definitions.
  ::
  ::card{title="Examples" to="/reference/folio/examples" icon="code"}
  Working JSON examples for payment schedules and policies.
  ::
::

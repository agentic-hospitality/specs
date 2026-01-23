---
title: Stay Lifecycle
description: The booking lifecycle state machine—from availability check through hold, confirmation, arrival, and completion with modification and cancellation handling.
order: 3
---

# Stay Lifecycle

The booking lifecycle for hospitality reservations.

---

## What is Stay?

**Stay** tracks a booking through its lifecycle—from initial request to completion. Where retail orders move through `placed → shipped → delivered`, hospitality bookings move through a different sequence tied to future dates, payments, and physical arrival.

Stay is not a venue description or inventory system. It is a state machine that tracks the journey of a single reservation from availability check through post-stay closure.

::callout{type="info"}
Stay does not define how to discover venues or check inventory. It defines what happens after a user decides they want to book something.
::

---

## Lifecycle Overview

```
REQUEST → AVAILABLE → HELD → BOOKED → CONFIRMED → BALANCED → ARRIVED → STAYED → COMPLETED
                                ↓          ↓           ↓
                           MODIFIED   CANCELLED     NO_SHOW
```

The lifecycle has two types of states:

::card-group{cols="2"}
  ::card{title="Primary States" icon="list"}
  Sequential progression from request to completion. Each state has clear entry and exit conditions.
  ::
  ::card{title="Branch States" icon="git-branch"}
  Modified, cancelled, or no-show. These can occur from multiple points in the primary flow.
  ::
::

---

## Core Concepts

::card-group{cols="3"}
  ::card{title="States" to="/reference/stay/spec#3-states" icon="list-checks"}
  Defined lifecycle states with clear triggers and transitions.
  ::
  ::card{title="Transitions" to="/reference/stay/spec#4-transitions" icon="arrow-right"}
  Valid state changes and what triggers them.
  ::
  ::card{title="Stay Object" to="/reference/stay/spec#5-stay-object" icon="file-text"}
  The complete booking record with venue, dates, guests, units, and payment.
  ::
::

::card-group{cols="3"}
  ::card{title="Holds" to="/reference/stay/spec#6-holds" icon="clock"}
  Temporary reservations with configurable expiry before booking commitment.
  ::
  ::card{title="Modifications" to="/reference/stay/spec#7-modifications" icon="pencil"}
  Date changes, room swaps, guest count adjustments with fee handling.
  ::
  ::card{title="Cancellations" to="/reference/stay/spec#8-cancellations" icon="x"}
  Booking cancellation with policy-based refund calculation.
  ::
::

::card-group{cols="2"}
  ::card{title="Webhooks" to="/reference/stay/spec#10-webhooks" icon="webhook"}
  Event notifications for state changes, holds, and modifications.
  ::
  ::card{title="Transport Bindings" to="/reference/stay/spec#11-transport-bindings" icon="plug"}
  REST and MCP endpoints for booking operations.
  ::
::

---

## How Agents Use Stays

::steps
### Check Availability

Agent sends a `request` with desired dates and unit type. System responds with `available` or `unavailable`.

### Create Hold (Optional)

If available, agent can request a `hold` to temporarily reserve inventory while awaiting user confirmation. Holds expire automatically.

### Book

Agent converts hold to `booked` or books directly from available. The booking is created but unpaid.

### Confirm Payment

When deposit is captured, stay moves to `confirmed`. When balance is paid, it moves to `balanced`.

### Track Arrival

Venue records check-in (→ `arrived`) and check-out (→ `stayed`). Post-stay processing completes the lifecycle.

### Handle Changes

Throughout the lifecycle, agents can handle modification requests, cancellations, and respond to no-show events.
::

---

## Comparison to Retail Orders

| Retail Order | Hospitality Stay |
|--------------|------------------|
| placed | booked |
| payment_pending | booked |
| paid | confirmed / balanced |
| shipped | — |
| delivered | stayed |
| completed | completed |
| cancelled | cancelled |
| refunded | cancelled (with refund) |

Hospitality has no "shipping" phase but adds payment milestones (deposit vs balance) and physical presence tracking (arrived, stayed).

---

## Why Separate Deposit and Balance?

Many hospitality bookings require:
1. **Deposit** at booking time (typically 10-50%)
2. **Balance** before or at arrival

Stay tracks these separately because:
- Refund policies differ based on when cancellation occurs
- Agents need to know if a booking is "secured" vs "fully paid"
- Venues have different balance due timelines

---

## Learn More

::card-group
  ::card{title="Specification" to="/reference/stay/spec" icon="file-code"}
  Full technical specification with state definitions, schemas, and protocol bindings.
  ::
  ::card{title="Examples" to="/reference/stay/examples" icon="code"}
  Working JSON examples for the complete booking lifecycle.
  ::
::

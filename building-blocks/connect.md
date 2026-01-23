---
title: Connect Integration
description: Real-time integration between venue systems and the agent layer—why freshness matters and what PMS vendors need to implement.
order: 6
---

# Connect Integration

Real-time integration between venue systems and the agent layer.

---

::callout{type="info"}
Connect defines how venue property management systems surface live data to AI agents. Fresh availability, accurate rates, instant confirmations—all from the source.
::

## Why Freshness Matters

AI agents making booking recommendations need data they can trust. Not data from yesterday. Not data aggregated through three intermediaries. Data from the venue, right now.

::card-group{cols="3"}
  ::card{title="Accuracy" icon="ph:target"}
  Agents quote rates and availability. If the data is stale, the booking fails. Failed bookings destroy user trust in the agent.
  ::

  ::card{title="Speed" icon="ph:lightning"}
  Agents work in conversation time. A user asks "is there a room tonight?"—the agent needs an answer in seconds, not hours.
  ::

  ::card{title="Confidence" icon="ph:shield-check"}
  When agents cite prices or confirm bookings, they stake their reputation. Direct data means they can stand behind the answer.
  ::
::

---

## The Direct Connection Model

Connect enables venues to expose their inventory directly to the agent layer:

::steps
### Venue publishes availability

The property management system exposes real-time inventory through a standardised API. Room types, rates, restrictions—live from the source of truth.

### Agent queries directly

When evaluating a venue, the agent calls the venue's endpoint. No intermediary cache. No aggregator delay.

### Booking confirms instantly

When the user approves, the agent creates the booking against the venue's system. The PMS confirms in real-time.

### Folio syncs continuously

Charges, payments, and modifications flow through the same direct connection throughout the stay lifecycle.
::

---

## What This Enables

Direct integration unlocks capabilities beyond the booking moment:

::card-group{cols="2"}
  ::card{title="Last-room availability" icon="ph:bed"}
  Agents can confidently offer the last available room because they're reading live inventory, not a cache that might be stale.
  ::

  ::card{title="Dynamic pricing" icon="ph:chart-line-up"}
  Revenue management decisions reflect in agent queries immediately. No waiting for rates to propagate through the distribution chain.
  ::

  ::card{title="Real-time modifications" icon="ph:pencil-simple"}
  Guests can modify bookings through their agent with instant confirmation. No "we'll confirm within 24 hours."
  ::

  ::card{title="Live folio access" icon="ph:receipt"}
  Agents can show current charges, process payments, and handle disputes with accurate, up-to-date information.
  ::
::

---

## The Guest Journey

Direct connection isn't just about availability—it's about the entire stay.

When a venue connects through Connect and implements [Stay](/building-blocks/stay), the guest's agent becomes a companion throughout their journey:

::steps
### Before arrival

Guest tells their agent about preferences. Agent relays room requests, dietary needs, special occasions to the venue in advance.

### During the stay

Guest asks their agent "what's on my bill?" or "can I extend one more night?" Agent queries the venue directly and handles it.

### After checkout

Agent receives the final folio. Guest has a complete record of their stay, portable to future bookings anywhere.
::

This is what direct connection enables. Not just a booking channel—a continuous relationship between guest, agent, and venue.

---

## The Standardisation Opportunity

When PMS vendors implement Connect, something powerful happens: any AI agent can work with any venue.

::card-group{cols="2"}
  ::card{title="For Venues" icon="ph:building"}
  Your PMS handles agent integration automatically. No custom development, no per-agent setup. Upgrade your software, gain access to every agent.
  ::

  ::card{title="For Agents" icon="ph:robot"}
  Query any Connect-enabled venue the same way. No special handling per PMS vendor. One integration covers the ecosystem.
  ::
::

This is why standardisation matters. Not for philosophical reasons—for practical ones. A fragmented ecosystem means agents can only book venues with custom integrations. A standardised one means any agent can book any venue.

::callout{type="info"}
The goal: a venue's PMS vendor adds Connect support once, and that venue becomes bookable by any AI agent, immediately.
::

---

## The Protocol

Connect uses **JSON-RPC 2.0** as the transport protocol. Agents call venue endpoints using standard JSON-RPC requests and receive structured responses.

```json
// Request
{
  "jsonrpc": "2.0",
  "method": "availability.check",
  "params": {
    "checkIn": "2025-06-15",
    "checkOut": "2025-06-17",
    "guests": 2
  },
  "id": 1
}

// Response
{
  "jsonrpc": "2.0",
  "result": {
    "available": true,
    "rooms": [...]
  },
  "id": 1
}
```

The tool schemas—what methods exist, what parameters they accept, what responses they return—follow the patterns established by Model Context Protocol. This gives agents a consistent way to understand what any venue can do, while JSON-RPC provides the reliable transport.

---

## PMS Integration Requirements

For property management systems to support Connect:

### Required Capabilities

| Capability | Purpose |
|------------|---------|
| **Availability API** | Return live inventory for date ranges by room type |
| **Rate API** | Return current rates with restrictions and policies |
| **Booking API** | Accept reservation requests and return confirmations |
| **Folio API** | Expose charges, payments, and balance |

### Authentication

Venues authenticate agents using the standard A2A capability exchange. The PMS validates the agent's credentials and authorisation level before exposing inventory.

### Response Times

::callout{type="tip"}
Agent conversations happen in real-time. APIs should respond within 500ms for availability queries and 2 seconds for booking creation.
::

---

## Evidence of Connection

When a venue connects directly, this surfaces in their Bookable record:

```json
{
  "actions": {
    "capabilities": ["check-availability", "get-rates", "book", "modify", "cancel"],
    "endpoint": "https://api.venue.example/agent",
    "protocol": "jsonrpc",
    "connection": {
      "type": "direct",
      "latency": "realtime",
      "source": "pms"
    }
  }
}
```

Agents can see the connection type and factor it into their confidence when making recommendations.

---

## For PMS Vendors

If you build property management software, Connect defines how your system participates in the agent economy:

::card-group{cols="2"}
  ::card{title="Implementation Guide" to="/reference/connect/implementation" icon="ph:code"}
  Technical specification for PMS integration endpoints.
  ::

  ::card{title="Certification" to="/reference/connect/certification" icon="ph:seal-check"}
  Conformance testing and certification programme for PMS vendors.
  ::
::

::callout{type="info"}
Venues using certified PMS systems automatically inherit Connect capabilities. The venue doesn't need to build anything—their software handles it.
::

---

## Learn More

::card-group
  ::card{title="For Venues" to="/audiences/venues" icon="ph:building"}
  What hospitality businesses need to know about connecting their systems.
  ::
  ::card{title="Specification" to="/reference/connect/spec" icon="ph:file-code"}
  Full technical specification for Connect integration.
  ::
::

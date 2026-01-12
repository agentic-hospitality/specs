# Roadmap

What's done, what's next, what we're considering.

---

## Current state (v0.1)

### Venue
- ✅ Identity and verification
- ✅ Vibe (subjective character)
- ✅ Attributes (factual characteristics)
- ✅ Evidence (claims with provenance)
- ✅ Fit (strong and weak intent matching)
- ✅ Units (rooms, tables)
- ✅ Neighbourhood (location context)
- ✅ Answers (quotable explanations)

### Booking Terms
- ✅ Payment schedules (deposit, balance)
- ✅ Cancellation tiers
- ✅ No-show policies
- ✅ Modification terms
- ✅ AP2 mandate structure

### Stay
- ✅ Lifecycle states (request → completed)
- ✅ Branch states (modified, cancelled, no-show)
- ✅ Webhooks

### Curator
- ✅ DMO, Portfolio, Editorial types
- ✅ Stories (venue narratives)
- ✅ Certification
- ✅ Transparency requirements
- ✅ Trust hierarchy

---

## Next priorities

### Real-time availability
The current specs define what a venue is. They don't yet define how agents query live availability.

Needed:
- Availability query schema
- Rate/pricing response format
- Inventory hold protocol (temporary reservation)
- Calendar-based availability windows

This is where commerce protocols (UCP, ACP) provide the lifecycle. We provide the query vocabulary.

### Multi-venue itineraries
People don't book one hotel. They plan trips.

Needed:
- Itinerary container (multiple venues, dates)
- Sequential booking coordination
- Partial failure handling (what if venue 2 of 3 fails?)
- Cross-venue payment aggregation

### Guest context
Agents need to pass user context to venues without exposing unnecessary personal data.

Needed:
- Preference schema (dietary, accessibility, room preferences)
- Privacy-preserving context passing
- Repeat guest recognition (without full identity)

### Group bookings
Business travel, weddings, events.

Needed:
- Group request schema
- Room block holds
- Rooming list management
- Group payment terms (master account, individual)

---

## Considering

### Loyalty integration
Hotels have loyalty programs. How do agents:
- Check member status?
- Apply member rates?
- Accrue points?

This overlaps with UCP's loyalty roadmap. We should align rather than duplicate.

### Dynamic pricing
Hospitality pricing is complex:
- Seasonal variation
- Event-based surges
- Length-of-stay discounts
- Last-minute rates

Needed: Rate plan vocabulary that agents can reason about.

### Add-ons and upsells
- Room upgrades
- Breakfast packages
- Late checkout
- Experiences and activities

These are units with dependencies. The Venue spec supports units; we need to define unit relationships.

### Reviews and reputation
Evidence currently captures review signals (counts, sentiment). Could we standardise:
- Review ingestion format?
- Cross-platform aggregation?
- Freshness and recency signals?

### Post-stay
The Stay lifecycle ends at "completed". But:
- Feedback collection
- Issue resolution
- Loyalty point posting
- Return visit prompting

These are venue-side concerns but agents may need visibility.

---

## What we're not building

### Payment processing
That's AP2, Stripe, payment handlers. We define what should be charged when. They move the money.

### Discovery infrastructure
We define what Curators publish. We don't build the index or the routing. That's implementation.

### Agent behaviour
We define what venues say. How agents interpret, weight, and choose is agent responsibility.

### Rendering
We define presentation components. How they render is client implementation (A2UI, native, web).

---

## Contributing

If something's missing or wrong, open an issue.

If you're implementing and hit a gap, tell us. Real-world implementation drives the roadmap.

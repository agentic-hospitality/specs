# Getting Started

## Understanding the architecture

Agentic Hospitality is the hospitality vertical for the [Universal Commerce Protocol](https://ucp.dev).

```
Curator                    Discovery + Trust (above UCP)
    ↓
UCP Hospitality            Venue, Booking Terms, Stay
    ↓
UCP Core                   Orchestration, Payment, Transport
```

## Which spec do you need?

| You are... | Start with |
|------------|------------|
| A DMO or authority wanting to curate venues | [Curator](/curator) |
| A venue wanting to be AI-bookable | [Venue](/venue) |
| A developer building agent tooling | [Bookable](/bookable) |
| Integrating payments for bookings | [Folio](/folio) |
| Integrating with UCP | [UCP Integration](/docs/ucp-integration.md) |

---

## For DMOs and authorities: Setting up a Curator

1. **Create your Curator Agent Card**

   Declare your:
   - Identity and jurisdiction
   - Coverage (geographic or thematic)
   - Verification capabilities
   - Story publishing endpoint
   - Actions (recommend, verify, etc.)

2. **Publish at well-known endpoint**

   ```
   https://yourdomain.com/.well-known/agent.json
   ```

3. **Build your verification workflow**

   Verification means adding your authority's weight to a venue's evidence. Two things:
   
   - **Confirm existence**: Venue is real and matches its Venue
   - **Capture the story**: Interview the people. This is the key. Not a quality inspection, but a conversation that surfaces the insider details, the human texture, the things only locals know. These become evidence AI agents can cite.

   The technical implementation depends on your scale and existing systems. [Selfe](https://selfe.ai) provides tooling for DMOs getting started.

See also: [Curator for DMOs](/docs/for-dmos.md) for a non-technical overview.

---

## For venues: Publishing a Venue

1. **Create your UCP profile**

   Create a JSON file following the [Venue schema](/venue). Include:
   - UCP capability declarations
   - Identity (name, location, DID)
   - Vibe (what it feels like)
   - Attributes (factual characteristics)
   - Evidence (proof for claims)
   - Fit (what you're good for, what you're not)
   - Payment handler configuration

2. **Publish at well-known endpoint**

   ```
   https://yourdomain.com/.well-known/ucp
   ```

3. **Register with a Curator** (optional)

   Contact your regional DMO or relevant Portfolio curator to be listed and verified.

---

## For developers: Understanding the pattern

All specs share a common pattern:

```
Identity   →  Who this is
Evidence   →  Proof for claims
Fit        →  What it's good for (and not)
Actions    →  What can be done
```

[Bookable](/bookable) defines this base pattern. [Venue](/venue) adds hospitality vocabulary. Your domain may need different vocabulary on the same base.

---

## For payment integration: Using Booking Terms

Booking Terms extends UCP checkout with hospitality payment semantics.

1. **Read the [Booking Terms spec](/booking-terms)**
2. **Implement AP2 mandate signing** with booking terms extensions
3. **Handle payment schedules** (deposits, balance, cancellation)

See also: [UCP Integration](/docs/ucp-integration.md) for the full protocol relationship.

---

## For everyone: Identity and verification

All participants need verifiable identity. The simplest approach:

1. **Get a DID**: If you control a domain, publish a DID document at `/.well-known/did.json`
2. **Your DID is `did:web:yourdomain.com`**: No registration, no approval

Authority comes from who issues credentials about you:
- Government credentials (FSA hygiene rating) = highest trust
- Industry credentials (IATA TIDS) = high trust  
- Regional authority (DMO verification) = high trust
- Self-asserted claims = need corroboration

See: [Identity and Trust](/docs/identity-and-trust.md) for full details on DIDs, VCs, and becoming a verifier.

---

## Questions?

Open an issue. We're happy to help.

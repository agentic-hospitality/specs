# Venue: Hospitality Extension for A2A Agent Cards

**Version:** 0.1.0 (Draft)  
**Namespace URI:** `https://agentic-hospitality.org/venue/v1`  
**Status:** Draft Specification  
**License:** MIT  

---

## Abstract

Venue is a namespace extension to the [A2A Protocol](https://a2a-protocol.org) Agent Card that defines what AI agents need hospitality venues to express in order to make defensible recommendations and complete bookings.

Venue does not define a new protocol. It defines a structured vocabulary within existing A2A Agent Cards.

---

## 1. Introduction

### 1.1 Purpose

AI agents making hospitality recommendations require structured, verifiable information to:

1. Determine whether a venue fits a user's intent
2. Defend the recommendation if challenged
3. Complete a booking without friction

Venue provides this information in a machine-readable format that extends A2A Agent Cards.

### 1.2 Scope

Venue defines:
- **Identity** - Verifiable venue existence
- **Vibe** - Subjective character, structured for matching
- **Attributes** - Factual, quantified characteristics
- **Evidence** - Proof supporting claims
- **Fit** - Explicit intent alignment (positive and negative)
- **Actions** - Available operations (not their implementation)
- **Units** - Bookable sub-entities
- **Neighbourhood** - Location context
- **Presentation** - A2UI components for human confirmation

Venue does NOT define:
- Transport protocols (use A2A)
- Booking request/response schemas (endpoint-specific)
- Discovery mechanisms (topology-neutral)
- Rendering implementation (use A2UI)

### 1.3 Conformance

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in [RFC 2119](https://tools.ietf.org/html/rfc2119).

### 1.4 Design Principles

See [Appendix C: Design Rationale](#appendix-c-design-rationale) for the reasoning behind key design decisions.

---

## 2. Venue Structure

An Venue-conformant Agent Card MUST include the `venue` extension declaration and the `venue` data block.

### 2.1 Extension Declaration

```json
{
  "capabilities": {
    "extensions": [{
      "uri": "https://agentic-hospitality.org/venue/v1",
      "required": true
    }]
  }
}
```

### 2.2 Type Hierarchy

Venue defines a type hierarchy enabling polymorphic agent behaviour:

```
Bookable (base)
    ├── Stay
    │     ├── Hotel
    │     ├── BnB
    │     └── Hostel
    ├── Eat
    │     ├── Restaurant
    │     ├── Cafe
    │     └── Bar
    ├── Experience
    │     ├── Museum
    │     ├── Tour
    │     └── Activity
    └── Service
          ├── Spa
          └── Salon
```

All types inherit from `Bookable`. Agents MAY interact with any `Bookable` without knowing its specific type.

The `Bookable` base type represents the domain-general pattern: Identity + Evidence + Fit + Actions. Hospitality types demonstrate one application; the same structure applies to any bookable entity.

### 2.3 Venue Data Block

```json
{
  "venue": {
    "schemaVersion": "0.1.0",
    "type": "venue:hotel",
    "extends": "venue:bookable",
    "identity": { },
    "vibe": { },
    "attributes": { },
    "evidence": { },
    "fit": { },
    "actions": { },
    "units": [ ],
    "neighbourhood": { },
    "presentation": { },
    "answers": [ ]
  }
}
```

### 2.4 Type Declaration

The `type` field declares the specific Venue type using namespaced values:

```json
{ "type": "venue:hotel" }
{ "type": "venue:restaurant" }
{ "type": "venue:museum" }
```

The `extends` field indicates inheritance:

```json
{ "extends": "venue:bookable" }
{ "extends": "venue:stay" }
```

Agents MUST treat any Venue with `extends: "venue:bookable"` as bookable, regardless of specific type.

### 2.5 Polymorphic Behaviour

All Bookable types guarantee:
- `identity` - Verifiable existence
- `vibe` - Subjective character
- `evidence` - Proof for claims
- `fit` - Intent alignment
- `actions` - Available operations (including book)
- `answers` - Quotable explanations

Type-specific fields extend but do not replace base fields:

| Type | Additional Fields |
|------|-------------------|
| Hotel | units (rooms), checkInTime, checkOutTime |
| Restaurant | units (tables), cuisine, mealPeriods, covers |
| Museum | exhibitions, collections, ticketTypes |
| Spa | services, duration, specialists |

### 2.6 Required Fields

An Venue block MUST include:
- `schemaVersion`
- `type`
- `identity`
- `actions`

All other fields are OPTIONAL but RECOMMENDED.

### 2.7 Venue Plurality

Multiple Venues MAY exist for the same venue, issued by different parties. Venues MAY disagree. This is expected, not a defect.

Venue defines no single source of truth. There is no "authoritative Venue" for a venue—only Venues with varying evidence quality and provenance.

Agents resolve conflicts via evidence weighting, not protocol authority. Venue is a field of competing truth claims, not a canonical registry.

This is intentional. Venue avoids centralisation by design:
- No central authority determines which Venue is correct
- No governance body adjudicates disputes
- Agents MUST make their own trust decisions based on evidence

When multiple Venues exist for the same venue, agents SHOULD:
- Compare evidence quality and recency
- Weight by verification status
- Prefer convergent claims across Venues
- Disclose uncertainty to users when Venues conflict

### 2.8 Minimum Venue Core

**Venue Core** = `identity` + `evidence` + `fit` + `actions`

Everything else is optional acceleration.

| Level | Required Blocks | Use Case |
|-------|-----------------|----------|
| **Venue Core** | identity, evidence, fit, actions | Minimum viable implementation |
| **Venue Extended** | Core + vibe, attributes, units, neighbourhood | Rich discovery |
| **Venue Complete** | Extended + presentation, answers | Full agent experience |

A minimal compliant implementation requires only Venue Core. Agents MUST handle Venues at any conformance level.

This ensures Venue is:
- **Composable** — blocks can be adopted incrementally
- **Subsettable** — implementations choose their depth
- **Adoptable in slices** — no requirement to "buy the whole worldview"

---

## 3. Identity

The `identity` block establishes verifiable venue existence.

### 3.1 Structure

```json
{
  "identity": {
    "name": "string, REQUIRED",
    "legalName": "string, OPTIONAL",
    "venueType": "string, REQUIRED",
    "location": {
      "address": "string, REQUIRED",
      "coordinates": "[lat, lng], REQUIRED"
    },
    "domain": "string, RECOMMENDED",
    "did": "string, OPTIONAL",
    "registration": {
      "jurisdiction": "string, OPTIONAL",
      "companyNumber": "string, OPTIONAL",
      "vatNumber": "string, OPTIONAL"
    }
  }
}
```

### 3.2 Requirements

- `identity.name` MUST be the public trading name
- `identity.location.coordinates` MUST be [latitude, longitude] in WGS84
- `identity.domain` SHOULD match the domain hosting the Agent Card
- `identity.did` SHOULD use the `did:web` method when present

### 3.3 Verification

Agents MAY verify identity by cross-referencing:
- Domain ownership (Agent Card URL matches `identity.domain`)
- Company registries (e.g., Companies House, state registrations)
- DID resolution

---

## 4. Vibe

The `vibe` block captures subjective venue character in structured form.

### 4.1 Structure

```json
{
  "vibe": {
    "essence": "string, OPTIONAL",
    "character": ["string"],
    "atmosphere": {
      "energy": "string",
      "formality": "string",
      "crowd": "string",
      "pace": "string"
    },
    "personality": {
      "warmth": "number 0-1",
      "quirkiness": "number 0-1",
      "luxury": "number 0-1",
      "authenticity": "number 0-1"
    }
  }
}
```

### 4.2 Derivation

Vibe fields MAY be:
- **Venue-declared** - Asserted by the venue
- **Agent-derived** - Computed from evidence by consuming agents
- **Registry-derived** - Provided by third-party registries or tooling

Consumers SHOULD prefer evidence-backed or third-party-derived vibe signals where available. See [Appendix C.2](#c2-vibe-derivation) for rationale.

### 4.3 Character Vocabulary

The `character` array SHOULD use values from Appendix A. Custom values are permitted but MAY reduce interoperability.

---

## 5. Attributes

The `attributes` block contains factual, quantified characteristics.

### 5.1 Structure

```json
{
  "attributes": {
    "accommodation": {
      "totalRooms": "integer",
      "roomTypes": ["string"],
      "checkIn": "HH:MM",
      "checkOut": "HH:MM"
    },
    "dining": {
      "restaurants": "integer",
      "bars": "integer",
      "cuisineStyle": ["string"],
      "meals": ["string"]
    },
    "facilities": {
      "parking": { "available": "boolean", "spaces": "integer", "evCharging": "boolean" },
      "wifi": { "available": "boolean", "free": "boolean" },
      "pets": { "allowed": "boolean", "types": ["string"], "fee": "number" },
      "pool": { "available": "boolean", "type": "string" },
      "spa": { "available": "boolean" },
      "gym": { "available": "boolean" }
    },
    "accessibility": {
      "wheelchairAccess": "boolean",
      "accessibleRooms": "integer",
      "lift": "boolean"
    },
    "policies": {
      "cancellation": { "freeCancellationHours": "integer" },
      "children": { "allowed": "boolean", "minimumAge": "integer" },
      "smoking": "boolean"
    }
  }
}
```

### 5.2 Requirements

- Numeric values MUST be integers or decimals, not strings
- Boolean values MUST be `true` or `false`, not strings
- Time values MUST be in 24-hour HH:MM format

### 5.3 Extensibility

Additional attribute fields MAY be added. Field names SHOULD be camelCase. Vendor-specific extensions SHOULD use namespaced keys:

```json
{
  "attributes": {
    "selfe:sustainabilityScore": 0.82
  }
}
```

---

## 6. Evidence

The `evidence` block provides proof for claims, enabling defensible recommendations.

### 6.1 Structure

```json
{
  "evidence": {
    "claimKey": {
      "claim": "string, REQUIRED",
      "value": "any, OPTIONAL",
      "confidence": "number 0-1, REQUIRED",
      "convergence": "string, REQUIRED",
      "sources": [ ],
      "lastVerified": "ISO-8601, RECOMMENDED"
    }
  }
}
```

### 6.2 Source Structure

```json
{
  "sources": [
    {
      "type": "string, REQUIRED",
      "sourceRef": "string or array, REQUIRED",
      "method": "string, REQUIRED",
      "capturedAt": "ISO-8601, REQUIRED",
      "capturedBy": "string, RECOMMENDED",
      "platform": "string, OPTIONAL",
      "count": "integer, OPTIONAL",
      "sentiment": "number 0-1, OPTIONAL",
      "verification": {
        "status": "string, REQUIRED",
        "verifiedBy": "string, OPTIONAL",
        "verifiedAt": "ISO-8601, OPTIONAL"
      }
    }
  ]
}
```

### 6.3 Source Types

| Type | Description | Example |
|------|-------------|---------|
| `web_scrape` | Automated extraction from website | "WiFi mentioned on amenities page" |
| `json_ld` | Structured data parse | "Schema.org says 4-star" |
| `llm_inference` | Derived from text by LLM | "Vibe: romantic, based on descriptions" |
| `review_aggregation` | Pattern across reviews | "Guests mention 'quiet' 47 times" |
| `third_party` | External authority | "Green Tourism says Bronze" |
| `human_observation` | DMO visit / interview | "Dog greets at breakfast" |
| `self_report` | Venue-provided | "We source fish from Morston" |
| `computed` | Cross-referenced / calculated | "Walk time to station: 8 mins" |

#### 6.3.1 Extensible Type Namespacing

Source types MAY be extended using colon-namespaced values:

```json
{ "type": "third_party:aa-rosettes" }
{ "type": "third_party:green-tourism" }
{ "type": "registry:selfe:confidence-score" }
{ "type": "regional:uk-fsa-hygiene" }
```

Consumers MUST treat unknown namespaced types as informational.

### 6.4 Capture Methods

| Method | Used with | Description |
|--------|-----------|-------------|
| `html_extraction` | web_scrape | Parsed from HTML |
| `structured_parse` | json_ld | Parsed from JSON-LD/schema.org |
| `llm_classification` | llm_inference | LLM classified from text |
| `keyword_count` | review_aggregation | Keyword frequency analysis |
| `sentiment_analysis` | review_aggregation | Sentiment scoring |
| `api_lookup` | third_party | Retrieved via API |
| `interview` | human_observation | Captured during visit |
| `photo_capture` | human_observation | Photographic evidence |
| `owner_input` | self_report | Venue-provided directly |
| `cross_reference` | computed | Derived from multiple sources |

### 6.5 Verification Status

| Status | Meaning |
|--------|---------|
| `unverified` | Captured but not verified |
| `machine_verified` | Automatically validated |
| `human_verified` | Human reviewed |
| `dmo_verified` | Tourism board certified |

Agents SHOULD weight evidence by verification status when scoring fit.

### 6.6 Convergence Values

| Value | Meaning |
|-------|---------|
| `strong` | Multiple source types agree |
| `moderate` | Two or more sources agree with minor inconsistencies |
| `weak` | Limited corroboration |
| `conflicting` | Sources disagree |

Agents SHOULD treat `conflicting` convergence as a signal to reduce confidence or seek clarification.

### 6.7 Evidence Example

```json
{
  "evidence": {
    "dogFriendly": {
      "claim": "Welcomes dogs with dedicated amenities",
      "value": true,
      "confidence": 0.94,
      "convergence": "strong",
      "sources": [
        {
          "type": "review_aggregation",
          "sourceRef": "reviews:google:thehoste",
          "method": "keyword_count",
          "capturedAt": "2025-12-15T10:00:00Z",
          "capturedBy": "groundry:sentiment/v1.0",
          "platform": "google",
          "count": 127,
          "sentiment": 0.91,
          "verification": { "status": "machine_verified" }
        },
        {
          "type": "review_aggregation",
          "sourceRef": "reviews:tripadvisor:thehoste",
          "method": "keyword_count",
          "capturedAt": "2025-12-15T10:00:00Z",
          "capturedBy": "groundry:sentiment/v1.0",
          "platform": "tripadvisor",
          "count": 89,
          "sentiment": 0.88,
          "verification": { "status": "machine_verified" }
        },
        {
          "type": "web_scrape",
          "sourceRef": "https://thehoste.com/dogs",
          "method": "html_extraction",
          "capturedAt": "2025-12-14T08:00:00Z",
          "capturedBy": "groundry:scraper/v2.1",
          "verification": { "status": "machine_verified" }
        },
        {
          "type": "human_observation",
          "sourceRef": "visit:visitnorfolk:2025-11-15",
          "method": "interview",
          "capturedAt": "2025-11-15T14:30:00Z",
          "capturedBy": "did:web:visitnorfolk.co.uk",
          "verification": {
            "status": "dmo_verified",
            "verifiedBy": "did:web:visitnorfolk.co.uk",
            "verifiedAt": "2025-11-15T14:30:00Z"
          }
        }
      ],
      "lastVerified": "2025-12-28T14:00:00Z"
    }
  }
}
```

### 6.8 Evidence Hierarchy

See [Appendix C.3](#c3-evidence-hierarchy) for the recommended evidence weighting rationale.

---

## 7. Fit

The `fit` block declares explicit intent alignment—what the venue is good for, and what it is not.

### 7.1 Structure

```json
{
  "fit": {
    "strong": [
      {
        "intent": "string, REQUIRED",
        "confidence": "number 0-1, REQUIRED",
        "signals": ["string"]
      }
    ],
    "weak": [
      {
        "intent": "string, REQUIRED",
        "reason": "string, REQUIRED"
      }
    ]
  }
}
```

### 7.2 Requirements

- `fit.strong` lists intents the venue is well-suited for
- `fit.weak` lists intents the venue is poorly-suited for
- Both arrays MAY be empty but SHOULD NOT be omitted

### 7.3 Intent Vocabulary

The `intent` field SHOULD use values from Appendix B. Custom values are permitted.

### 7.4 Weak Fit

Venues SHOULD declare weak fit where known. Absence of weak fit declarations SHOULD NOT be interpreted as universal suitability.

---

## 8. Actions

The `actions` block declares what operations an agent can perform.

### 8.1 Structure

```json
{
  "actions": {
    "capabilities": ["string"],
    "endpoint": "string, REQUIRED",
    "protocol": "string, REQUIRED",
    "authentication": {
      "type": "string",
      "flows": ["string"]
    },
    "constraints": {
      "maxLeadTimeDays": "integer",
      "minLeadTimeHours": "integer",
      "maxNights": "integer",
      "maxGuests": "integer"
    }
  }
}
```

### 8.2 Capability Values

| Capability | Description |
|------------|-------------|
| `check-availability` | Query availability |
| `get-rates` | Retrieve pricing |
| `hold` | Temporarily reserve |
| `book` | Create confirmed reservation |
| `modify` | Change existing reservation |
| `cancel` | Cancel reservation |

### 8.3 Scope Limitation

Venue declares WHAT actions exist, not HOW they behave.

Venue does NOT define booking request or response schemas. Actions reference A2A-compatible endpoints that define their own operational semantics.

---

## 9. Units

The `units` array contains bookable sub-entities. Each unit is a partial Venue with inheritance from the venue level.

### 9.1 Structure

```json
{
  "units": [
    {
      "id": "string, REQUIRED",
      "type": "string, REQUIRED",
      "name": "string, REQUIRED",
      "vibe": { },
      "attributes": { },
      "evidence": { },
      "fit": { },
      "pricing": {
        "from": {
          "amount": "number",
          "currency": "string",
          "per": "string"
        }
      },
      "media": [ ]
    }
  ]
}
```

### 9.2 Unit Types

| Venue Type | Unit Type | Examples |
|------------|-----------|----------|
| hotel | `room` | Standard, Suite, Cottage |
| restaurant | `table` | Indoor 2-top, Private dining |
| bar | `area` | Main bar, Garden |
| experience | `slot` | Morning session |

### 9.3 Inheritance

Units inherit venue-level `vibe`, `attributes`, and `evidence` unless explicitly overridden.

A venue declaring `pets.allowed: true` applies to all units unless a unit declares `pets.allowed: false`.

---

## 10. Neighbourhood

The `neighbourhood` block provides location context beyond coordinates.

### 10.1 Structure

```json
{
  "neighbourhood": {
    "setting": "string",
    "character": ["string"],
    "walkability": "number 0-1",
    "proximity": [
      {
        "name": "string, REQUIRED",
        "type": "string, REQUIRED",
        "distance": { "value": "number", "unit": "string" },
        "travelTime": { "value": "number", "unit": "string", "mode": "string" },
        "relevance": ["string"]
      }
    ],
    "region": {
      "name": "string",
      "knownFor": ["string"]
    }
  }
}
```

### 10.2 Relevance Tags

Proximity items SHOULD include `relevance` tags indicating why the nearby item matters for intent matching.

```json
{
  "name": "Holkham Beach",
  "type": "beach",
  "relevance": ["dog-walking", "family-day-out", "nature"]
}
```

---

## 11. Presentation

> **Note:** Presentation is defined in the [Bookable base specification](../../spec/bookable-v0.1.md). This section describes hospitality-specific usage.

The `presentation` block defines A2UI components for human-in-the-loop confirmation.

### 11.1 Purpose

AI agents choose. Humans confirm. The presentation block enables rich UI rendering for that confirmation step, avoiding chat-based friction.

### 11.2 Structure

```json
{
  "presentation": {
    "a2uiVersion": "string",
    "components": {
      "componentId": {
        "type": "string, REQUIRED",
        "template": { }
      }
    },
    "layouts": {
      "layoutName": ["componentId"]
    }
  }
}
```

### 11.3 Component Types

| Type | Purpose |
|------|---------|
| `card` | Venue summary |
| `carousel` | Browse rooms/options |
| `form` | Collect booking details |
| `map` | Location context |
| `image-grid` | Photo gallery |
| `pricing-table` | Rate comparison |
| `calendar` | Availability display |

### 11.4 Layouts

| Layout | Context |
|--------|---------|
| `summary` | Agent presenting shortlist |
| `detail` | User exploring venue |
| `booking` | User ready to book |
| `confirmation` | Pre-booking review |

### 11.5 A2UI Integration

Presentation components MUST conform to [A2UI](https://a2ui.org) specification. Consuming agents render components using their native UI framework.

### 11.6 Progressive Enhancement

Agents without A2UI support SHOULD fall back to structured text derived from `vibe`, `attributes`, and `evidence`. The `presentation` block is OPTIONAL.

---

## 12. Verifiable Credentials

Claims MAY be elevated to cryptographically signed Verifiable Credentials.

### 12.1 Structure

```json
{
  "credentials": [
    {
      "@context": ["https://www.w3.org/2018/credentials/v1"],
      "type": ["VerifiableCredential", "string"],
      "issuer": "did:string",
      "issuanceDate": "ISO-8601",
      "credentialSubject": {
        "id": "did:string"
      },
      "proof": { }
    }
  ]
}
```

### 12.2 Usage

Verifiable Credentials provide cryptographic proof where URL-based evidence is insufficient. They are OPTIONAL and complement, not replace, the `evidence` block.

---

## 13. Discovery

### 13.1 Well-Known Endpoint

Venue-conformant Agent Cards SHOULD be published at:

```
https://{domain}/.well-known/agent.json
```

### 13.2 Topology Neutrality

Venue makes no assumptions about discovery topology. Agent Cards MAY be discovered via:
- Direct fetch from well-known endpoint
- Private registries
- Federated registries
- Peer exchange
- Search indices

Venue does not define registry protocols or discovery mechanisms.

---

## 14. Protocol Relationships

```
MCP   = Agent ↔ Tools (how agents connect to data sources)
A2A   = Agent ↔ Agent (how agents communicate)
A2UI  = Agent → Human (how agents present UI)
Venue  = Hospitality vocabulary within A2A Agent Cards
```

| Protocol | Layer | Venue Relationship |
|----------|-------|-------------------|
| MCP | Agent-Tool | MCP servers MAY expose Venue data |
| A2A | Agent-Agent | Venue extends A2A Agent Card |
| A2UI | Agent-Human | Venue declares A2UI components |

---

## 15. Answers

> **Note:** Answers is defined in the [Bookable base specification](../../spec/bookable-v0.1.md). This section describes hospitality-specific usage.

The `answers` block provides quotable, evidence-linked explanations for common agent questions.

### 15.1 Purpose

Agents need to explain recommendations, not just make them.

The `answers` block provides canonical responses to questions agents actually ask, each tied to Venue evidence. This enables:
- Quotable explanations for human-in-the-loop confirmation
- Audit trails for recommendation decisions
- Defensible justifications that trace to evidence

### 15.2 Structure

```json
{
  "answers": [
    {
      "question": "string, REQUIRED",
      "answer": "string, REQUIRED",
      "confidence": "number 0-1, REQUIRED",
      "basedOn": ["string"],
      "citations": [ ],
      "lastVerified": "ISO-8601"
    }
  ]
}
```

### 15.3 Citation Structure

```json
{
  "citations": [
    {
      "type": "string",
      "source": "string",
      "url": "string",
      "count": "integer",
      "venuePath": "string"
    }
  ]
}
```

The `venuePath` field references the Venue evidence block (e.g., `evidence.dogFriendly`, `fit.strong[0]`).

### 15.4 Canonical Questions

Answers SHOULD address questions agents commonly ask:

| Category | Example Questions |
|----------|-------------------|
| Fit | "Is this good for a romantic weekend?" |
| Vibe | "Is it quiet or lively?" |
| Capability | "Is this genuinely dog-friendly?" |
| Suitability | "Would this suit families with toddlers?" |
| Guest profile | "What kind of guest is happiest here?" |
| Anti-fit | "Who should NOT stay here?" |

### 15.5 Example

```json
{
  "answers": [
    {
      "question": "Is The Hoste genuinely dog-friendly?",
      "answer": "Yes. Dogs are welcomed across most rooms and public areas, with beds, bowls, and treats provided. The village location offers excellent walks, and nearby Holkham Beach allows dogs year-round.",
      "confidence": 0.94,
      "basedOn": [
        "evidence.dogFriendly",
        "attributes.facilities.pets",
        "neighbourhood.proximity[0]"
      ],
      "citations": [
        {
          "type": "aggregated-signal",
          "source": "google-reviews",
          "count": 127,
          "venuePath": "evidence.dogFriendly.sources[0]"
        },
        {
          "type": "first-party",
          "url": "https://thehoste.com/dogs",
          "venuePath": "evidence.dogFriendly.sources[2]"
        }
      ],
      "lastVerified": "2026-01-01"
    },
    {
      "question": "Is this a good choice for a romantic weekend?",
      "answer": "Yes. The intimate village setting, excellent restaurant with 2 AA rosettes, and calm atmosphere make it well-suited for couples. Rooms are tasteful rather than flashy, and the pace is deliberately slow.",
      "confidence": 0.91,
      "basedOn": [
        "fit.strong[0]",
        "vibe.atmosphere",
        "evidence.foodQuality"
      ],
      "citations": [
        {
          "type": "fit-signal",
          "venuePath": "fit.strong[0]"
        },
        {
          "type": "third-party:aa-rosettes",
          "venuePath": "evidence.foodQuality.sources[2]"
        }
      ],
      "lastVerified": "2026-01-01"
    },
    {
      "question": "Who should NOT stay here?",
      "answer": "Not ideal for those seeking nightlife (village is quiet after 10pm), budget travellers (average £180/night), or large party groups (intimate setting, max group ~12).",
      "confidence": 0.88,
      "basedOn": [
        "fit.weak"
      ],
      "citations": [
        {
          "type": "fit-signal",
          "venuePath": "fit.weak"
        }
      ],
      "lastVerified": "2026-01-01"
    }
  ]
}
```

### 15.6 Referencing

Answers MAY be inline or externally referenced:

```json
{
  "answers": {
    "$ref": "https://thehoste.com/.well-known/venue-answers.json"
  }
}
```

External referencing is RECOMMENDED when:
- Answers update more frequently than identity
- Registries cache answers separately
- Agents need selective re-fetch

### 15.7 Agent Usage

Agents MAY quote answers directly when explaining recommendations:

> "I'm recommending The Hoste because: 'Dogs are welcomed across most rooms and public areas, with beds, bowls, and treats provided.' This is based on 127 positive Google reviews mentioning dogs, plus their published pet policy."

The answer text is designed to be quotable in natural language contexts.

### 15.8 Regenerability Requirement

Answers MUST be fully regenerable from Evidence + Fit + Context.

Answers are a convenience layer, not an independent truth source. They exist to accelerate agent response, not to replace evidence inspection.

Agents MUST NOT trust answers that contradict underlying evidence. If regeneration from current evidence would produce a different answer, the Answer is stale and SHOULD be ignored.

This ensures answers never drift from their evidence basis and cannot become "FAQs with confidence scores."

---

## 16. Conformant Agent Behaviour

This section defines minimum expectations for agents consuming Venue data.

### 16.1 Fit Handling

Agents MUST NOT book when `fit.weak` matches user intent without disclosing the weak fit signal.

Example: User requests "nightlife hotel", Venue declares `fit.weak: nightlife`. Agent MUST inform user before booking.

### 16.2 Evidence Staleness

Agents SHOULD warn users when `lastVerified` exceeds 90 days for material claims.

Agents MAY refuse to assert claims with `lastVerified` exceeding 180 days.

### 16.3 High-Consequence Claims

For safety-critical claims (accessibility, allergens, medical facilities), agents MUST NOT assert claims at confidence < 0.8 without explicit caveat.

Agents SHOULD prefer evidence with `verification.status` of `human_verified` or `dmo_verified` for high-consequence decisions.

### 16.4 Conflict Handling

When `convergence` = `conflicting`, agents SHOULD:
- Disclose uncertainty to users
- Present the conflict rather than choosing silently
- Avoid strong assertions

### 16.5 Verification Weighting

Agents SHOULD weight evidence by verification status:

| Status | Recommended Weight |
|--------|-------------------|
| `dmo_verified` | Highest |
| `human_verified` | High |
| `machine_verified` | Medium |
| `unverified` | Low |

This is guidance, not mandate. Agents MAY apply different weighting based on context.

---

## 17. Security Considerations

### 17.1 Trust Model

Venue assumes good-faith actors but does not enforce behaviour. Malicious or negligent agents may:
- Misrepresent evidence
- Ignore fit signals
- Assert claims without basis

Venue cannot prevent misuse. It makes misuse observable.

Evidence provenance enables post-hoc audit of recommendation decisions. When an agent makes a bad recommendation, the evidence trail shows whether the agent ignored available signals or whether the Venue itself was deficient.

### 17.2 Venue Authentication

Venue does not authenticate agents. Any agent may read and act on Venue data.

Trust in agent behaviour is orthogonal to trust in Venue data quality. A high-quality Venue consumed by a malicious agent may still produce poor outcomes.

### 17.3 Venue Integrity

Venues SHOULD be served over HTTPS. Venues with `identity.did` provide cryptographic verification of issuer.

Consumers SHOULD verify DID signatures when present. Unsigned Venues offer no integrity guarantee beyond transport security.

### 17.4 Venue Impersonation

Multiple Venues may claim to represent the same venue. Venue provides no mechanism to determine which is "official."

Agents SHOULD prefer Venues where:
- `identity.did` matches the venue's domain
- Evidence includes `dmo_verified` sources
- Multiple independent sources converge

### 17.5 Liability Shifting

Venue functions as a liability-shifting layer.

When an agent ignores Venue signals (weak fit, conflicting evidence, stale claims) and produces a bad outcome, the fault is traceable. The Venue provided the signal. The agent ignored it.

This protects:
- **Venues** — who provided accurate evidence via their Venue
- **Users** — who can audit why they received a bad recommendation  
- **Platforms** — who can demonstrate good-faith data provision
- **Venue providers** — who can show the signal was present

Venue does not prevent bad outcomes. It assigns responsibility for them.

This framing matters for regulatory contexts. When a regulator asks "why did this recommendation fail?", the evidence trail answers:
- What the Venue said
- What the agent saw
- What the agent did

Negligence becomes observable. That is Venue's security model.

---

## 18. Internal Use

Venue MAY be used internally by hospitality groups to align autonomous systems, independent of external exposure.

Internal use cases include:
- Venue descriptor standardisation across properties
- Internal recommendation engine alignment
- Multi-brand agent coordination
- Quality assurance automation

---

## Appendix A: Character Vocabulary (Normative)

```
intimate, lively, peaceful, buzzy, traditional, contemporary,
quirky, refined, casual, formal, family-oriented, adults-only,
romantic, social, secluded, central, rustic, modern, historic,
boutique, grand, minimal, cosy, airy, dark, bright
```

## Appendix B: Intent Vocabulary (Normative)

```
romantic-weekend, family-holiday, dog-friendly-trip,
business-travel, foodie-escape, quiet-retreat, celebration,
group-gathering, accessible-travel, budget-friendly,
luxury-treat, solo-travel, active-adventure, cultural-exploration,
workation, hen-party, stag-do, anniversary, honeymoon,
pet-friendly-coastal, walking-holiday, cycling-trip
```

## Appendix C: Design Rationale (Informative)

This appendix explains the reasoning behind key design decisions. It is non-normative.

### C.1 Why Agent-Centric Framing

Venue is designed around what agents need, not what venues want to say.

Traditional hospitality schemas model venue properties. Venue models defensibility—what an agent requires to make and justify a recommendation.

This framing:
- Aligns with how recommendation systems actually reason
- Makes adoption requirements clear to venues
- Enables quality metrics based on agent success

### C.2 Vibe Derivation

Vibe captures subjective truth: what a venue feels like, not just what it has.

Venues may declare intended vibe, but declared vibe can diverge from experienced vibe. A venue claiming "lively atmosphere" with reviews consistently describing "quiet and peaceful" has a vibe mismatch.

The specification allows multiple derivation sources to enable:
- Venue intent (declared)
- Aggregated guest perception (derived from reviews)
- Third-party assessment (registry-derived)

Consumers should weight evidence-backed vibe over declarations.

### C.3 Evidence Hierarchy

The recommended evidence weighting:

1. **Convergent** - Multiple independent sources agree
2. **Aggregated signal** - High-volume review patterns
3. **Verifiable official** - Government/regulatory sources
4. **Third-party credential** - Industry certifications
5. **First-party corroborated** - Venue claim with supporting evidence
6. **First-party alone** - Venue claim without corroboration

This hierarchy reflects:
- Aggregated signal is statistically robust and hard to fake at scale
- Official sources are verifiable but may be outdated or narrow in scope
- Industry credentials vary in rigour and may involve pay-to-play dynamics
- First-party claims gain weight only through corroboration

### C.4 Weak Fit Declarations

Explicit weak fit is unusual in hospitality systems but essential for agents.

Declaring what a venue is NOT good for:
- Prevents bad recommendations
- Reduces book-then-complain-then-refund friction
- Signals honesty, which builds trust
- Improves agent recommendation precision

Venues are incentivised to declare weak fit because bad matches damage reputation more than lost bookings.

### C.5 Scope Boundaries

Venue deliberately excludes:
- Booking protocol semantics (endpoint-specific)
- Transport mechanisms (use A2A)
- Discovery topology (registry-neutral)
- Rendering implementation (use A2UI)

These boundaries:
- Prevent scope creep
- Enable adoption alongside existing systems
- Allow specialised protocols to evolve independently

### C.6 Answers as Explainability Layer

Venue provides decision metadata. Answers provide explanation metadata.

Agents can make good decisions from Venue alone. But humans in the loop need explanations—not just "I chose this" but "I chose this because..."

The Answers block:
- Provides quotable, pre-computed explanations
- Ties each answer to specific evidence
- Enables audit trails for recommendations
- Supports regulatory transparency requirements

This is not FAQ for humans. It's justification for agents to quote.

The distinction from schema.org is important:
- Schema.org describes entities (what is here)
- Venue describes decisions (is this a good choice)
- Answers describe justifications (why am I recommending this)

### C.7 Type Hierarchy as Polymorphism

The type hierarchy enables agents to work at the appropriate level of abstraction:

- Generic agents interact with `venue:bookable` without knowing specific types
- Specialist agents leverage type-specific fields
- New types inherit base behaviour automatically

This mirrors object-oriented polymorphism: "If it's Bookable, I can book it."

Benefits:
- Agents don't need hospitality-specific code to book a hotel
- Same patterns apply to restaurants, spas, tours
- Extensibility without protocol changes

### C.8 Evidence Provenance as Audit Trail

Every claim in Venue has provenance:
- What was claimed
- Where it came from (sourceRef)
- How it was captured (method)
- When it was captured (capturedAt)
- Who captured it (capturedBy)
- What verification status it has

This enables:
- Agents to weight evidence by source type
- Agents to filter by verification status
- Humans to audit recommendation decisions
- Regulators to trace claims to sources

The key insight: Evidence is evidence. Whether scraped by a robot or observed by a human, same schema, different provenance. AI agents can filter and weight accordingly.

Venue provides evidence. Agents interpret semantics. Claim equivalence (e.g., "dog-friendly" vs "pets welcome") is agent responsibility, not protocol concern. This is intentional: semantic interpretation varies by context, and agents are better positioned than specifications to handle nuance.

### C.9 Known Open Problems

**Claim Reconciliation**

Determining that `dogFriendly`, `petsAllowed`, and `welcomes dogs` refer to the same concept is a known hard problem. Venue v0.1 does not solve this.

Agents must handle semantic equivalence:
- Heuristically (string matching, synonyms)
- Via external ontologies
- Through vendor-specific normalisation

This is intentional deferral, not omission. Claim normalisation is where vendors differentiate. Premature standardisation would constrain innovation and lock in potentially suboptimal solutions.

Future versions MAY define:
- Optional claim identifiers
- Reference vocabularies
- Canonical attribute names

For v0.1, the market should experiment.

**Cross-Venue Reconciliation**

When multiple Venues exist for the same venue with conflicting claims, Venue provides no reconciliation mechanism. Agents must:
- Weight by evidence quality
- Prefer convergent claims
- Disclose uncertainty

This is also intentional. Reconciliation implies authority. Venue has no authority by design.

---

## Appendix D: Type Hierarchy (Normative)

### D.1 Base Types

```
venue:bookable     Base type for all bookable entities
```

### D.2 Category Types

```
venue:stay         Accommodation (inherits bookable)
venue:eat          Food & drink (inherits bookable)
venue:experience   Activities & attractions (inherits bookable)
venue:service      Personal services (inherits bookable)
```

### D.3 Concrete Types

```
venue:hotel        (inherits stay)
venue:bnb          (inherits stay)
venue:hostel       (inherits stay)
venue:holiday-let  (inherits stay)
venue:resort       (inherits stay)

venue:restaurant   (inherits eat)
venue:cafe         (inherits eat)
venue:bar          (inherits eat)
venue:pub          (inherits eat)

venue:museum       (inherits experience)
venue:tour         (inherits experience)
venue:activity     (inherits experience)
venue:attraction   (inherits experience)

venue:spa          (inherits service)
venue:salon        (inherits service)
```

### D.4 Inheritance Rules

- All types MUST inherit from `venue:bookable` directly or transitively
- Agents MAY interact with any type as `venue:bookable`
- Type-specific fields extend but do not replace inherited fields
- Unknown types SHOULD be treated as `venue:bookable`

---

## Appendix E: Complete Example

```json
{
  "name": "The Hoste",
  "description": "Historic coaching inn in North Norfolk",
  "version": "1.0.0",
  "protocolVersion": "1.0",
  "capabilities": {
    "extensions": [{
      "uri": "https://agentic-hospitality.org/venue/v1",
      "required": true
    }]
  },
  "skills": [
    {
      "id": "check-availability",
      "name": "Check Availability",
      "description": "Check room availability for dates"
    },
    {
      "id": "book",
      "name": "Make Reservation",
      "description": "Create a confirmed booking"
    }
  ],
  
  "venue": {
    "schemaVersion": "0.1.0",
    "type": "venue:hotel",
    "extends": "venue:bookable",
    
    "identity": {
      "name": "The Hoste",
      "legalName": "The Hoste Arms Limited",
      "location": {
        "address": "The Green, Burnham Market, Norfolk PE31 8HD",
        "coordinates": [52.9456, 0.7234]
      },
      "domain": "thehoste.com",
      "did": "did:web:thehoste.com",
      "registration": {
        "jurisdiction": "GB",
        "companyNumber": "03456789"
      }
    },
    
    "vibe": {
      "essence": "Relaxed coastal elegance",
      "character": ["intimate", "foodie", "understated", "dog-friendly"],
      "atmosphere": {
        "energy": "calm",
        "formality": "smart-casual",
        "crowd": "couples, foodies, dog-owners",
        "pace": "slow"
      }
    },
    
    "attributes": {
      "accommodation": {
        "totalRooms": 62,
        "roomTypes": ["double", "suite", "cottage"],
        "checkIn": "15:00",
        "checkOut": "11:00"
      },
      "facilities": {
        "parking": { "available": true, "spaces": 30, "evCharging": true },
        "wifi": { "available": true, "free": true },
        "pets": { "allowed": true, "types": ["dogs"], "fee": 15 }
      }
    },
    
    "evidence": {
      "dogFriendly": {
        "claim": "Genuinely welcoming to dogs",
        "value": true,
        "confidence": 0.94,
        "convergence": "strong",
        "sources": [
          {
            "type": "review_aggregation",
            "sourceRef": "reviews:google:thehoste",
            "method": "keyword_count",
            "capturedAt": "2025-12-15T10:00:00Z",
            "capturedBy": "groundry:sentiment/v1.0",
            "platform": "google",
            "count": 127,
            "sentiment": 0.91,
            "verification": { "status": "machine_verified" }
          },
          {
            "type": "review_aggregation",
            "sourceRef": "reviews:tripadvisor:thehoste",
            "method": "keyword_count",
            "capturedAt": "2025-12-15T10:00:00Z",
            "capturedBy": "groundry:sentiment/v1.0",
            "platform": "tripadvisor",
            "count": 89,
            "sentiment": 0.88,
            "verification": { "status": "machine_verified" }
          },
          {
            "type": "web_scrape",
            "sourceRef": "https://thehoste.com/dogs",
            "method": "html_extraction",
            "capturedAt": "2025-12-14T08:00:00Z",
            "capturedBy": "groundry:scraper/v2.1",
            "verification": { "status": "machine_verified" }
          },
          {
            "type": "human_observation",
            "sourceRef": "visit:visitnorfolk:2025-11-15",
            "method": "interview",
            "capturedAt": "2025-11-15T14:30:00Z",
            "capturedBy": "did:web:visitnorfolk.co.uk",
            "verification": {
              "status": "dmo_verified",
              "verifiedBy": "did:web:visitnorfolk.co.uk",
              "verifiedAt": "2025-11-15T14:30:00Z"
            }
          }
        ],
        "lastVerified": "2026-01-01"
      },
      "foodQuality": {
        "claim": "Known for excellent food",
        "confidence": 0.89,
        "convergence": "strong",
        "sources": [
          {
            "type": "review_aggregation",
            "sourceRef": "reviews:google:thehoste",
            "method": "sentiment_analysis",
            "capturedAt": "2025-12-15T10:00:00Z",
            "capturedBy": "groundry:sentiment/v1.0",
            "platform": "google",
            "count": 342,
            "sentiment": 0.87,
            "verification": { "status": "machine_verified" }
          },
          {
            "type": "third_party:uk-fsa-hygiene",
            "sourceRef": "https://ratings.food.gov.uk/thehoste",
            "method": "api_lookup",
            "capturedAt": "2025-12-01T00:00:00Z",
            "capturedBy": "groundry:integrations/fsa",
            "value": "5",
            "verification": { "status": "machine_verified" }
          },
          {
            "type": "third_party:aa-rosettes",
            "sourceRef": "https://aa.com/restaurants/thehoste",
            "method": "api_lookup",
            "capturedAt": "2025-12-01T00:00:00Z",
            "capturedBy": "groundry:integrations/aa",
            "value": "2",
            "verification": { "status": "machine_verified" }
          }
        ]
      },
      "romanticVibe": {
        "claim": "Intimate and romantic atmosphere",
        "confidence": 0.72,
        "convergence": "moderate",
        "sources": [
          {
            "type": "llm_inference",
            "sourceRef": ["https://thehoste.com/about", "reviews:google:thehoste"],
            "method": "llm_classification",
            "capturedAt": "2025-12-15T12:00:00Z",
            "capturedBy": "groundry:nova-classifier/v1.2",
            "verification": { "status": "unverified" }
          },
          {
            "type": "human_observation",
            "sourceRef": "visit:visitnorfolk:2025-11-15",
            "method": "interview",
            "capturedAt": "2025-11-15T14:30:00Z",
            "capturedBy": "did:web:visitnorfolk.co.uk",
            "verification": {
              "status": "dmo_verified",
              "verifiedBy": "did:web:visitnorfolk.co.uk",
              "verifiedAt": "2025-11-15T14:30:00Z"
            }
          }
        ]
      }
    },
    
    "fit": {
      "strong": [
        {
          "intent": "romantic-weekend",
          "confidence": 0.91,
          "signals": ["intimate atmosphere", "excellent dining", "quiet village"]
        },
        {
          "intent": "dog-friendly-coastal",
          "confidence": 0.94,
          "signals": ["dogs genuinely welcome", "near beaches", "countryside walks"]
        },
        {
          "intent": "foodie-escape",
          "confidence": 0.88,
          "signals": ["AA rosettes", "local sourcing", "notable restaurant"]
        }
      ],
      "weak": [
        {
          "intent": "nightlife",
          "reason": "Village location, quiet after 10pm"
        },
        {
          "intent": "budget-friendly",
          "reason": "Premium pricing, avg £180/night"
        },
        {
          "intent": "stag-do",
          "reason": "Intimate setting, not suitable for large groups"
        }
      ]
    },
    
    "actions": {
      "capabilities": ["check-availability", "get-rates", "book", "modify", "cancel"],
      "endpoint": "https://api.thehoste.com/a2a",
      "protocol": "a2a-jsonrpc",
      "authentication": {
        "type": "oauth2",
        "flows": ["client-credentials"]
      },
      "constraints": {
        "maxLeadTimeDays": 365,
        "minLeadTimeHours": 24,
        "maxNights": 14
      }
    },
    
    "units": [
      {
        "id": "cottage-suite",
        "type": "room",
        "name": "Garden Cottage Suite",
        "vibe": {
          "essence": "Private retreat",
          "character": ["secluded", "self-contained", "peaceful"]
        },
        "attributes": {
          "beds": [{ "type": "super-king", "count": 1 }],
          "maxOccupancy": { "adults": 2, "children": 2 },
          "size": { "value": 55, "unit": "sqm" },
          "features": ["private-entrance", "garden", "kitchen"]
        },
        "fit": {
          "strong": [
            { "intent": "dog-owners", "confidence": 0.94, "signals": ["private garden", "own entrance"] }
          ],
          "weak": [
            { "intent": "mobility-impaired", "reason": "Steps at entrance" }
          ]
        },
        "pricing": {
          "from": { "amount": 280, "currency": "GBP", "per": "night" }
        }
      }
    ],
    
    "neighbourhood": {
      "setting": "village-centre",
      "character": ["quiet", "upmarket", "traditional"],
      "walkability": 0.7,
      "proximity": [
        {
          "name": "Holkham Beach",
          "type": "beach",
          "distance": { "value": 3, "unit": "miles" },
          "travelTime": { "value": 8, "unit": "minutes", "mode": "car" },
          "relevance": ["dog-walking", "family-beach", "nature"]
        }
      ],
      "region": {
        "name": "North Norfolk Coast",
        "knownFor": ["AONB", "beaches", "birdwatching", "seafood"]
      }
    },
    
    "presentation": {
      "a2uiVersion": "0.8",
      "components": {
        "venue": {
          "type": "card",
          "template": {
            "header": { "image": "{{media.hero}}", "title": "{{identity.name}}" },
            "body": { "subtitle": "{{vibe.essence}}", "location": "{{neighbourhood.setting}}" }
          }
        },
        "bookingForm": {
          "type": "form",
          "fields": [
            { "id": "checkIn", "type": "date", "required": true },
            { "id": "checkOut", "type": "date", "required": true },
            { "id": "guests", "type": "stepper", "min": 1, "max": 10 }
          ],
          "submitAction": "check-availability"
        }
      },
      "layouts": {
        "summary": ["venue"],
        "booking": ["bookingForm"]
      }
    },
    
    "answers": [
      {
        "question": "Is The Hoste genuinely dog-friendly?",
        "answer": "Yes. Dogs are welcomed across most rooms and public areas, with beds, bowls, and treats provided. The village location offers excellent walks, and nearby Holkham Beach allows dogs year-round.",
        "confidence": 0.94,
        "basedOn": ["evidence.dogFriendly", "attributes.facilities.pets", "neighbourhood.proximity[0]"],
        "citations": [
          { "type": "aggregated-signal", "source": "google-reviews", "count": 127, "venuePath": "evidence.dogFriendly.sources[0]" },
          { "type": "first-party", "url": "https://thehoste.com/dogs", "venuePath": "evidence.dogFriendly.sources[2]" }
        ],
        "lastVerified": "2026-01-01"
      },
      {
        "question": "Is this a good choice for a romantic weekend?",
        "answer": "Yes. The intimate village setting, excellent restaurant with 2 AA rosettes, and calm atmosphere make it well-suited for couples. Rooms are tasteful rather than flashy, and the pace is deliberately slow.",
        "confidence": 0.91,
        "basedOn": ["fit.strong[0]", "vibe.atmosphere", "evidence.foodQuality"],
        "citations": [
          { "type": "fit-signal", "venuePath": "fit.strong[0]" },
          { "type": "third-party:aa-rosettes", "venuePath": "evidence.foodQuality.sources[2]" }
        ],
        "lastVerified": "2026-01-01"
      },
      {
        "question": "Who should NOT stay here?",
        "answer": "Not ideal for those seeking nightlife (village is quiet after 10pm), budget travellers (average £180/night), or large party groups (intimate setting, max group ~12).",
        "confidence": 0.88,
        "basedOn": ["fit.weak"],
        "citations": [
          { "type": "fit-signal", "venuePath": "fit.weak" }
        ],
        "lastVerified": "2026-01-01"
      }
    ]
  }
}
```

---

*Venue is an open specification under MIT license. Contributions welcome at [github.com/agentic-hospitality/agentic-hospitality](https://github.com/agentic-hospitality/agentic-hospitality).*

*Selfe provides tooling to generate Venue-conformant Agent Cards at scale.*

---
title: Specification
description: Technical specification for hospitality venues—identity, vibe, attributes, evidence, fit, actions, units, and neighbourhood with conformance levels.
order: 1
---

# Venue v0.1 Specification

Full technical specification for the Venue hospitality extension.

::badge{type="info"}
Version 0.1.0 (Draft)
::

**Namespace URI:** `https://agenticbooking.org/venue/v1`

---

## 1. Introduction

### 1.1 Purpose

AI agents making hospitality recommendations require structured, verifiable information to:

1. Determine whether a venue fits a user's intent
2. Defend the recommendation if challenged
3. Complete a booking without friction

Venue provides this information in a machine-readable format that extends A2A Agent Cards.

### 1.2 Scope

::card-group{cols="2"}
  ::card{title="Venue Defines" icon="check"}
  - **Identity** — Verifiable venue existence
  - **Vibe** — Subjective character, structured for matching
  - **Attributes** — Factual, quantified characteristics
  - **Evidence** — Proof supporting claims
  - **Fit** — Explicit intent alignment (positive and negative)
  - **Actions** — Available operations (not their implementation)
  - **Units** — Bookable sub-entities
  - **Neighbourhood** — Location context
  - **Presentation** — A2UI components for human confirmation
  ::
  ::card{title="Venue Does NOT Define" icon="x"}
  - Transport protocols (use A2A)
  - Booking request/response schemas (endpoint-specific)
  - Discovery mechanisms (topology-neutral)
  - Rendering implementation (use A2UI)
  ::
::

### 1.3 Conformance

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in RFC 2119.

---

## 2. Venue Structure

A Venue-conformant Agent Card MUST include the `venue` extension declaration and the `venue` data block.

### 2.1 Extension Declaration

```json
{
  "capabilities": {
    "extensions": [{
      "uri": "https://agenticbooking.org/venue/v1",
      "required": true
    }]
  }
}
```

### 2.2 Type Hierarchy

Venue defines a type hierarchy enabling polymorphic agent behaviour:

```
Bookable (base)
└── Venue (hospitality)
    ├── Accommodation (Hotel, BnB, Hostel)
    ├── Eat (Restaurant, Cafe, Bar)
    ├── Experience (Museum, Tour, Activity)
    └── Service (Spa, Salon)
```

All types inherit from `Bookable`. Agents MAY interact with any `Bookable` without knowing its specific type.

Note: The [Stay spec](/reference/stay/spec) defines the booking lifecycle, not a venue type. When booking an Accommodation venue, the booking record follows the Stay state machine.

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
- `identity` — Verifiable existence
- `vibe` — Subjective character
- `evidence` — Proof for claims
- `fit` — Intent alignment
- `actions` — Available operations (including book)
- `answers` — Quotable explanations

Type-specific fields extend but do not replace base fields:

| Type | Additional Fields |
|------|-------------------|
| Hotel | units (rooms), checkInTime, checkOutTime |
| Restaurant | units (tables), cuisine, mealPeriods, covers |
| Museum | exhibitions, collections, ticketTypes |
| Spa | services, duration, specialists |

### 2.6 Required Fields

A Venue block MUST include:
- `schemaVersion`
- `type`
- `identity`
- `actions`

All other fields are OPTIONAL but RECOMMENDED.

### 2.7 Venue Plurality

Multiple Venues MAY exist for the same venue, issued by different parties. Venues MAY disagree. This is expected, not a defect.

::callout{type="warning"}
Venue defines no single source of truth. There is no "authoritative Venue" for a venue—only Venues with varying evidence quality and provenance.
::

Agents resolve conflicts via evidence weighting, not protocol authority. Venue is a field of competing truth claims, not a canonical registry.

When multiple Venues exist for the same venue, agents SHOULD:
- Compare evidence quality and recency
- Weight by verification status
- Prefer convergent claims across Venues
- Disclose uncertainty to users when Venues conflict

### 2.8 Conformance Levels

**Venue Core** = `identity` + `evidence` + `fit` + `actions`

| Level | Required Blocks | Use Case |
|-------|-----------------|----------|
| **Venue Core** | identity, evidence, fit, actions | Minimum viable implementation |
| **Venue Extended** | Core + vibe, attributes, units, neighbourhood | Rich discovery |
| **Venue Complete** | Extended + presentation, answers | Full agent experience |

A minimal compliant implementation requires only Venue Core. Agents MUST handle Venues at any conformance level.

---

## 3. Identity

The `identity` block establishes verifiable venue existence.

### 3.1 Structure

::field-group
  ::field{name="name" type="string" required}
  Public trading name. MUST be the name customers use.
  ::
  ::field{name="legalName" type="string"}
  Registered company name if different from trading name.
  ::
  ::field{name="venueType" type="string" required}
  Primary venue classification.
  ::
  ::field{name="location" type="object" required}
  Physical location with `address` (string) and `coordinates` ([lat, lng] in WGS84).
  ::
  ::field{name="domain" type="string" recommended}
  Primary domain. SHOULD match the domain hosting the Agent Card.
  ::
  ::field{name="did" type="string"}
  Decentralised identifier. SHOULD use `did:web` method when present.
  ::
  ::field{name="registration" type="object"}
  Legal registration with `jurisdiction`, `companyNumber`, `vatNumber`.
  ::
::

### 3.2 Example

```json
{
  "identity": {
    "name": "The Roste",
    "legalName": "The Roste Arms Limited",
    "venueType": "hotel",
    "location": {
      "address": "The Green, Burnton Market, Eastshire PE31 8HD",
      "coordinates": [52.9456, 0.7234]
    },
    "domain": "theroste.com",
    "did": "did:web:theroste.com",
    "registration": {
      "jurisdiction": "GB",
      "companyNumber": "03456789"
    }
  }
}
```

### 3.3 Verification

Agents MAY verify identity by cross-referencing:
- Domain ownership (Agent Card URL matches `identity.domain`)
- Company registries (e.g., Companies House, state registrations)
- DID resolution

---

## 4. Vibe

The `vibe` block captures subjective venue character in structured form.

### 4.1 Structure

::field-group
  ::field{name="essence" type="string"}
  One-line summary of the venue's character.
  ::
  ::field{name="character" type="string[]"}
  Array of character descriptors from the vocabulary.
  ::
  ::field{name="atmosphere" type="object"}
  Structured atmosphere with `energy`, `formality`, `crowd`, `pace`.
  ::
  ::field{name="personality" type="object"}
  Numeric scores (0-1) for `warmth`, `quirkiness`, `luxury`, `authenticity`.
  ::
::

### 4.2 Example

```json
{
  "vibe": {
    "essence": "Relaxed coastal elegance",
    "character": ["intimate", "foodie", "understated", "dog-friendly"],
    "atmosphere": {
      "energy": "calm",
      "formality": "smart-casual",
      "crowd": "couples, foodies, dog-owners",
      "pace": "slow"
    },
    "personality": {
      "warmth": 0.8,
      "quirkiness": 0.4,
      "luxury": 0.7,
      "authenticity": 0.9
    }
  }
}
```

### 4.3 Derivation

Vibe fields MAY be:
- **Venue-declared** — Asserted by the venue
- **Agent-derived** — Computed from evidence by consuming agents
- **Registry-derived** — Provided by third-party registries or tooling

Consumers SHOULD prefer evidence-backed or third-party-derived vibe signals where available.

### 4.4 Character Vocabulary

The `character` array SHOULD use values from the normative vocabulary:

```
intimate, lively, peaceful, buzzy, traditional, contemporary,
quirky, refined, casual, formal, family-oriented, adults-only,
romantic, social, secluded, central, rustic, modern, historic,
boutique, grand, minimal, cosy, airy, dark, bright
```

Custom values are permitted but MAY reduce interoperability.

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
    "vendor:sustainabilityScore": 0.82
  }
}
```

---

## 6. Evidence

The `evidence` block provides proof for claims, enabling defensible recommendations.

### 6.1 Structure

::field-group
  ::field{name="claim" type="string" required}
  Human-readable statement of what is being evidenced.
  ::
  ::field{name="value" type="any"}
  The actual value if applicable (boolean, number, string).
  ::
  ::field{name="confidence" type="number" required}
  Confidence score from 0 to 1.
  ::
  ::field{name="convergence" type="string" required}
  Source agreement: `strong`, `moderate`, `weak`, or `conflicting`.
  ::
  ::field{name="sources" type="array" required}
  Array of source objects providing the evidence.
  ::
  ::field{name="lastVerified" type="ISO-8601" recommended}
  When the evidence was last verified.
  ::
::

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

Source types identify **who** provided the evidence:

| Type | Description | Example |
|------|-------------|---------|
| `third_party` | External authority | "Green Tourism says Bronze" |
| `human_observation` | Site visit or interview | "Dog greets at breakfast" |
| `self_report` | Venue-provided | "We source fish from Morston" |
| `curator_certification` | Authority certification | "Tourism board accreditation" |
| `derived` | Computed or inferred | "Walk time to station: 8 mins" |

Source types MAY be extended using colon-namespaced values:

```json
{ "type": "third_party:aa-rosettes" }
{ "type": "third_party:green-tourism" }
{ "type": "regional:uk-fsa-hygiene" }
```

### 6.4 Capture Methods

The `method` field is implementation-defined. Implementers SHOULD use descriptive values that indicate how evidence was obtained. Common patterns include site visits, form submissions, API lookups, and document review.

### 6.5 Verification Status

| Status | Meaning |
|--------|---------|
| `unverified` | Captured but not verified |
| `machine_verified` | Automatically validated |
| `human_verified` | Human reviewed |
| `authority_verified` | Official body certified |

Agents SHOULD weight evidence by verification status when scoring fit.

### 6.6 Convergence Values

| Value | Meaning |
|-------|---------|
| `strong` | Multiple source types agree |
| `moderate` | Two or more sources agree with minor inconsistencies |
| `weak` | Limited corroboration |
| `conflicting` | Sources disagree |

::callout{type="warning"}
When `convergence` is `conflicting`, agents SHOULD disclose uncertainty to users rather than making definitive claims.
::

### 6.7 Evidence Hierarchy

Recommended evidence weighting:

1. **Convergent** — Multiple independent sources agree
2. **Authority verified** — Government/regulatory sources, DMO certification
3. **Third-party credential** — Industry certifications (AA, Green Tourism)
4. **Human observation** — DMO site visits, inspections
5. **First-party corroborated** — Venue claim with supporting evidence
6. **First-party alone** — Venue claim without corroboration

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

The `intent` field SHOULD use values from the normative vocabulary:

```
romantic-weekend, family-holiday, dog-friendly-trip,
business-travel, foodie-escape, quiet-retreat, celebration,
group-gathering, accessible-travel, budget-friendly,
luxury-treat, solo-travel, active-adventure, cultural-exploration,
workation, hen-party, stag-do, anniversary, honeymoon,
pet-friendly-coastal, walking-holiday, cycling-trip
```

### 7.4 Weak Fit

Venues SHOULD declare weak fit where known. Absence of weak fit declarations SHOULD NOT be interpreted as universal suitability.

::callout{type="info"}
Explicit weak fit is unusual in hospitality systems but essential for agents. Bad matches damage reputation more than lost bookings.
::

---

## 8. Actions

The `actions` block declares what operations an agent can perform.

### 8.1 Structure

::field-group
  ::field{name="capabilities" type="string[]" required}
  Array of available operations.
  ::
  ::field{name="endpoint" type="string" required}
  URL for the A2A endpoint.
  ::
  ::field{name="protocol" type="string" required}
  Protocol identifier (e.g., `a2a-jsonrpc`).
  ::
  ::field{name="authentication" type="object"}
  Auth configuration with `type` and `flows`.
  ::
  ::field{name="constraints" type="object"}
  Booking constraints like `maxLeadTimeDays`, `minLeadTimeHours`, `maxNights`.
  ::
::

### 8.2 Capability Values

| Capability | Description |
|------------|-------------|
| `assess-fit` | Query fit for user intent |
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

::field-group
  ::field{name="setting" type="string"}
  Location type: `village-centre`, `rural`, `city-centre`, `coastal`, etc.
  ::
  ::field{name="character" type="string[]"}
  Area character descriptors.
  ::
  ::field{name="walkability" type="number"}
  Walkability score from 0 to 1.
  ::
  ::field{name="proximity" type="array"}
  Array of nearby points of interest.
  ::
  ::field{name="region" type="object"}
  Regional context with `name` and `knownFor`.
  ::
::

### 10.2 Proximity Structure

```json
{
  "proximity": [
    {
      "name": "Holkbury Beach",
      "type": "beach",
      "distance": { "value": 3, "unit": "miles" },
      "travelTime": { "value": 8, "unit": "minutes", "mode": "car" },
      "relevance": ["dog-walking", "family-day-out", "nature"]
    }
  ]
}
```

Proximity items SHOULD include `relevance` tags indicating why the nearby item matters for intent matching.

---

## 11. Presentation

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

### 11.5 Progressive Enhancement

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
      "expirationDate": "ISO-8601",
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

## 14. Answers

The `answers` block provides quotable, evidence-linked explanations for common agent questions.

### 14.1 Purpose

Agents need to explain recommendations, not just make them.

The `answers` block provides canonical responses to questions agents actually ask, each tied to Venue evidence. This enables:
- Quotable explanations for human-in-the-loop confirmation
- Audit trails for recommendation decisions
- Defensible justifications that trace to evidence

### 14.2 Structure

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

### 14.3 Citation Structure

```json
{
  "citations": [
    {
      "type": "string",
      "source": "string",
      "url": "string",
      "venuePath": "string"
    }
  ]
}
```

The `venuePath` field references the Venue evidence block (e.g., `evidence.dogFriendly`, `fit.strong[0]`).

### 14.4 Canonical Questions

Answers SHOULD address questions agents commonly ask:

| Category | Example Questions |
|----------|-------------------|
| Fit | "Is this good for a romantic weekend?" |
| Vibe | "Is it quiet or lively?" |
| Capability | "Is this genuinely dog-friendly?" |
| Suitability | "Would this suit families with toddlers?" |
| Guest profile | "What kind of guest is happiest here?" |
| Anti-fit | "Who should NOT stay here?" |

### 14.5 Regenerability Requirement

Answers MUST be fully regenerable from Evidence + Fit + Context.

Answers are a convenience layer, not an independent truth source. They exist to accelerate agent response, not to replace evidence inspection.

::callout{type="warning"}
Agents MUST NOT trust answers that contradict underlying evidence. If regeneration from current evidence would produce a different answer, the Answer is stale and SHOULD be ignored.
::

---

## 15. Agent Behaviour Requirements

This section defines minimum expectations for agents consuming Venue data.

### 15.1 Fit Handling

Agents MUST NOT book when `fit.weak` matches user intent without disclosing the weak fit signal.

Example: User requests "nightlife hotel", Venue declares `fit.weak: nightlife`. Agent MUST inform user before booking.

### 15.2 Evidence Staleness

- Agents SHOULD warn users when `lastVerified` exceeds 90 days for material claims
- Agents MAY refuse to assert claims with `lastVerified` exceeding 180 days

### 15.3 High-Consequence Claims

For safety-critical claims (accessibility, allergens, medical facilities):
- Agents MUST NOT assert claims at confidence < 0.8 without explicit caveat
- Agents SHOULD prefer evidence with `verification.status` of `human_verified` or `authority_verified`

### 15.4 Conflict Handling

When `convergence` = `conflicting`, agents SHOULD:
- Disclose uncertainty to users
- Present the conflict rather than choosing silently
- Avoid strong assertions

### 15.5 Verification Weighting

Recommended evidence weighting by verification status:

| Status | Recommended Weight |
|--------|-------------------|
| `authority_verified` | Highest |
| `human_verified` | High |
| `machine_verified` | Medium |
| `unverified` | Low |

---

## 16. Security Considerations

### 16.1 Trust Model

Venue assumes good-faith actors but does not enforce behaviour. Malicious or negligent agents may:
- Misrepresent evidence
- Ignore fit signals
- Assert claims without basis

Venue cannot prevent misuse. It makes misuse observable.

Evidence provenance enables post-hoc audit of recommendation decisions.

### 16.2 Venue Integrity

- Venues SHOULD be served over HTTPS
- Venues with `identity.did` provide cryptographic verification of issuer
- Consumers SHOULD verify DID signatures when present

### 16.3 Venue Impersonation

Multiple Venues may claim to represent the same venue. Venue provides no mechanism to determine which is "official."

Agents SHOULD prefer Venues where:
- `identity.did` matches the venue's domain
- Evidence includes `authority_verified` sources
- Multiple independent sources converge

### 16.4 Liability Shifting

Venue functions as a liability-shifting layer.

When an agent ignores Venue signals (weak fit, conflicting evidence, stale claims) and produces a bad outcome, the fault is traceable. The Venue provided the signal. The agent ignored it.

This protects:
- **Venues** — who provided accurate evidence
- **Users** — who can audit why they received a bad recommendation
- **Platforms** — who can demonstrate good-faith data provision

---

## 17. Internal Use

Venue MAY be used internally by hospitality groups to align autonomous systems, independent of external exposure.

Internal use cases include:
- Venue descriptor standardisation across properties
- Internal recommendation engine alignment
- Multi-brand agent coordination
- Quality assurance automation

---

## 18. Protocol Relationships

```
MCP   = Agent ↔ Tools (how agents connect to data sources)
A2A   = Agent ↔ Agent (how agents communicate)
A2UI  = Agent → Human (how agents present UI)
Venue = Hospitality vocabulary within A2A Agent Cards
```

| Protocol | Layer | Venue Relationship |
|----------|-------|-------------------|
| MCP | Agent-Tool | MCP servers MAY expose Venue data |
| A2A | Agent-Agent | Venue extends A2A Agent Card |
| A2UI | Agent-Human | Venue declares A2UI components |

---

## Related Specifications

::card-group
  ::card{title="Bookable" to="/reference/bookable/spec" icon="file-code"}
  Base pattern that Venue extends. Defines Identity, Evidence, Fit, Actions core.
  ::
  ::card{title="Stay" to="/reference/stay/spec" icon="calendar"}
  Accommodation-specific extension with room types, check-in/out, and overnight policies.
  ::
::

---
title: Venue Specification
description: Technical specification for hospitality venues—identity, vibe, attributes, evidence, fit, actions, units, and neighbourhood with conformance levels.
---

# Venue v0.1 Specification

Full technical specification for the Venue hospitality extension.

> **Version 0.1.0 (Draft)**

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

**Venue Defines:**
- **Identity** — Verifiable venue existence
- **Vibe** — Subjective character, structured for matching
- **Attributes** — Factual, quantified characteristics
- **Evidence** — Proof supporting claims
- **Fit** — Explicit intent alignment (positive and negative)
- **Actions** — Available operations (not their implementation)
- **Units** — Bookable sub-entities
- **Neighbourhood** — Location context
- **Presentation** — A2UI components for human confirmation

**Venue Does NOT Define:**
- Transport protocols (use A2A)
- Booking request/response schemas (endpoint-specific)
- Discovery mechanisms (topology-neutral)
- Rendering implementation (use A2UI)

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

> **Warning:** Venue defines no single source of truth. There is no "authoritative Venue" for a venue—only Venues with varying evidence quality and provenance.

Agents resolve conflicts via evidence weighting, not protocol authority.

### 2.8 Conformance Levels

**Venue Core** = `identity` + `evidence` + `fit` + `actions`

| Level | Required Blocks | Use Case |
|-------|-----------------|----------|
| **Venue Core** | identity, evidence, fit, actions | Minimum viable implementation |
| **Venue Extended** | Core + vibe, attributes, units, neighbourhood | Rich discovery |
| **Venue Complete** | Extended + presentation, answers | Full agent experience |

---

## 3. Identity

The `identity` block establishes verifiable venue existence.

### 3.1 Structure

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Public trading name |
| `legalName` | string | No | Registered company name |
| `venueType` | string | Yes | Primary venue classification |
| `location` | object | Yes | Address and coordinates (WGS84) |
| `domain` | string | Recommended | Primary domain |
| `did` | string | No | Decentralised identifier |
| `registration` | object | No | Legal registration details |

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

---

## 4. Vibe

The `vibe` block captures subjective venue character in structured form.

### 4.1 Structure

| Field | Type | Description |
|-------|------|-------------|
| `essence` | string | One-line summary of character |
| `character` | string[] | Character descriptors from vocabulary |
| `atmosphere` | object | energy, formality, crowd, pace |
| `personality` | object | Numeric scores (0-1) for warmth, quirkiness, luxury, authenticity |

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

### 4.3 Character Vocabulary

```
intimate, lively, peaceful, buzzy, traditional, contemporary,
quirky, refined, casual, formal, family-oriented, adults-only,
romantic, social, secluded, central, rustic, modern, historic,
boutique, grand, minimal, cosy, airy, dark, bright
```

---

## 5. Attributes

The `attributes` block contains factual, quantified characteristics.

```json
{
  "attributes": {
    "accommodation": {
      "totalRooms": 16,
      "checkIn": "15:00",
      "checkOut": "11:00"
    },
    "facilities": {
      "parking": { "available": true, "evCharging": true },
      "wifi": { "available": true, "free": true },
      "pets": { "allowed": true, "fee": 25 }
    },
    "accessibility": {
      "wheelchairAccess": true,
      "accessibleRooms": 2
    }
  }
}
```

---

## 6. Evidence

The `evidence` block provides proof for claims, enabling defensible recommendations.

### 6.1 Structure

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `claim` | string | Yes | Human-readable statement |
| `value` | any | No | The actual value |
| `confidence` | number | Yes | Score from 0 to 1 |
| `convergence` | string | Yes | strong, moderate, weak, conflicting |
| `sources` | array | Yes | Array of source objects |
| `lastVerified` | ISO-8601 | Recommended | When last verified |

### 6.2 Source Types

Source types identify **who** provided the evidence:

| Type | Description |
|------|-------------|
| `third_party` | External authority |
| `human_observation` | Site visit or interview |
| `self_report` | Venue-provided |
| `curator_certification` | Authority certification |
| `derived` | Computed or inferred |

### 6.3 Verification Status

| Status | Meaning |
|--------|---------|
| `unverified` | Captured but not verified |
| `machine_verified` | Automatically validated |
| `human_verified` | Human reviewed |
| `authority_verified` | Official body certified |

### 6.4 Evidence Hierarchy

Recommended weighting:

1. **Convergent** — Multiple independent sources agree
2. **Authority verified** — Government/regulatory sources
3. **Third-party credential** — Industry certifications
4. **Human observation** — DMO site visits
5. **First-party corroborated** — Venue claim with support
6. **First-party alone** — Venue claim without corroboration

---

## 7. Fit

The `fit` block declares explicit intent alignment.

```json
{
  "fit": {
    "strong": [
      {
        "intent": "dog-friendly-trip",
        "confidence": 0.95,
        "signals": ["dedicated dog menu", "dog beds in rooms"]
      }
    ],
    "weak": [
      {
        "intent": "nightlife",
        "reason": "Quiet village location, bar closes at 11pm"
      }
    ]
  }
}
```

### Intent Vocabulary

```
romantic-weekend, family-holiday, dog-friendly-trip,
business-travel, foodie-escape, quiet-retreat, celebration,
group-gathering, accessible-travel, budget-friendly,
luxury-treat, solo-travel, active-adventure
```

> Explicit weak fit is unusual in hospitality systems but essential for agents. Bad matches damage reputation more than lost bookings.

---

## 8. Actions

The `actions` block declares what operations an agent can perform.

| Capability | Description |
|------------|-------------|
| `assess-fit` | Query fit for user intent |
| `check-availability` | Query availability |
| `get-rates` | Retrieve pricing |
| `hold` | Temporarily reserve |
| `book` | Create confirmed reservation |
| `modify` | Change existing reservation |
| `cancel` | Cancel reservation |

---

## 9. Units

Bookable sub-entities (rooms, tables, etc.):

```json
{
  "units": [
    {
      "id": "garden-suite",
      "type": "room",
      "name": "Garden Suite",
      "pricing": {
        "from": { "amount": 295, "currency": "GBP", "per": "night" }
      }
    }
  ]
}
```

---

## 10. Neighbourhood

Location context beyond coordinates:

```json
{
  "neighbourhood": {
    "setting": "village-centre",
    "walkability": 0.7,
    "proximity": [
      {
        "name": "Holkbury Beach",
        "type": "beach",
        "distance": { "value": 3, "unit": "miles" },
        "relevance": ["dog-walking", "nature"]
      }
    ]
  }
}
```

---

## 11. Agent Behaviour Requirements

### 11.1 Fit Handling

Agents MUST NOT book when `fit.weak` matches user intent without disclosing the weak fit signal.

### 11.2 Evidence Staleness

- Agents SHOULD warn users when `lastVerified` exceeds 90 days
- Agents MAY refuse to assert claims with `lastVerified` exceeding 180 days

### 11.3 High-Consequence Claims

For safety-critical claims (accessibility, allergens):
- Agents MUST NOT assert claims at confidence < 0.8 without caveat
- Agents SHOULD prefer `human_verified` or `authority_verified` evidence

---

## 12. Discovery

### Well-Known Endpoint

```
https://{domain}/.well-known/agent.json
```

Venue makes no assumptions about discovery topology. Agent Cards MAY be discovered via direct fetch, registries, or search indices.

---

## Related Specifications

- [Bookable Spec](../bookable/spec.md) — Base pattern
- [Stay Spec](../stay/spec.md) — Booking lifecycle
- [Curator Spec](../curator/spec.md) — Third-party verification

---

> Venue is an open specification under MIT license.

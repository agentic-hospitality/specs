---
title: Bookable Specification
description: Technical specification for AI-bookable entities—identity, evidence, fit, actions, presentation, and answers with conformance requirements.
---

# Bookable Specification

> **v0.1.0 Draft**

The base pattern for AI-bookable entities.

---

## Abstract

Bookable defines the base pattern for any entity that AI agents can discover, understand, trust, and transact with. It is not a protocol—it is a pattern that domain-specific extensions inherit from.

---

## 1. Introduction

### 1.1 Purpose

AI agents making recommendations and bookings require structured, verifiable information to:

1. Determine whether an entity fits a user's intent
2. Defend the recommendation if challenged
3. Complete a transaction without friction

Bookable provides this structure in a domain-neutral form.

### 1.2 Scope

**Bookable Defines:**
- **Identity** — Verifiable existence
- **Evidence** — Proof supporting claims
- **Fit** — Explicit intent alignment
- **Actions** — Available operations
- **Presentation** — UI components
- **Answers** — Quotable explanations

**Bookable Does NOT Define:**
- Domain-specific vocabulary (use extensions)
- Transport protocols (use A2A)
- Discovery mechanisms (topology-neutral)

### 1.3 Conformance

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in [RFC 2119](https://tools.ietf.org/html/rfc2119).

---

## 2. Bookable Structure

A Bookable-conformant record MUST include:

```json
{
  "bookable": {
    "schemaVersion": "0.1.0",
    "type": "string",
    "identity": { },
    "evidence": { },
    "fit": { },
    "actions": { }
  }
}
```

The `presentation` and `answers` blocks are RECOMMENDED but OPTIONAL.

---

## 3. Identity

The `identity` block establishes verifiable existence.

```json
{
  "identity": {
    "name": "The Griffin Inn",
    "location": {
      "address": "Beacon Vale, Beaconshire LD3 0UB",
      "coordinates": [51.9634, -3.3842]
    },
    "domain": "griffininn.co.uk",
    "did": "did:web:griffininn.co.uk"
  }
}
```

### 3.1 Requirements

| Field | Required | Description |
|-------|----------|-------------|
| `identity.name` | Yes | Public trading name |
| `identity.location.coordinates` | Yes | [latitude, longitude] in WGS84 |
| `identity.domain` | Recommended | Should match hosting domain |
| `identity.did` | Optional | Should use `did:web` method |

### 3.2 Decentralized Identifiers

Bookable uses [DIDs](https://www.w3.org/TR/did-core/) for cryptographic identity. A DID proves the entity controls its Bookable record.

---

## 4. Evidence

The `evidence` block provides proof for claims, enabling defensible recommendations.

### 4.1 Structure

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

### 4.2 Source Types

Source types identify **who** provided the evidence:

| Type | Description |
|------|-------------|
| `third_party` | External authority |
| `human_observation` | Site visit or interview |
| `self_report` | Entity-provided |
| `curator_certification` | Certified by a Curator |
| `derived` | Computed or inferred |

### 4.3 Verification Status

| Status | Meaning |
|--------|---------|
| `unverified` | Captured but not verified |
| `machine_verified` | Automatically validated |
| `human_verified` | Human reviewed |
| `authority_verified` | Certified by recognised authority |

### 4.4 Convergence Values

| Value | Meaning |
|-------|---------|
| `strong` | Multiple source types agree |
| `moderate` | Two or more sources agree with minor inconsistencies |
| `weak` | Limited corroboration |
| `conflicting` | Sources disagree |

### 4.5 Verifiable Credentials

Claims MAY be elevated to [Verifiable Credentials](https://www.w3.org/TR/vc-data-model/)—cryptographically signed attestations from trusted issuers.

---

## 5. Fit

The `fit` block declares explicit intent alignment—what the entity is good for, and what it is not.

```json
{
  "fit": {
    "strong": [
      {
        "intent": "dog-friendly-trip",
        "confidence": 0.95,
        "signals": ["dedicated dog menu", "dog beds"]
      }
    ],
    "weak": [
      {
        "intent": "nightlife",
        "reason": "Quiet village location"
      }
    ]
  }
}
```

> Entities SHOULD declare weak fit where known. Declaring what an entity is NOT good for prevents bad recommendations and signals honesty.

---

## 6. Actions

The `actions` block declares what operations an agent can perform.

```json
{
  "actions": {
    "capabilities": ["assess-fit", "check-availability", "book"],
    "endpoint": "https://example.com/api/agent",
    "protocol": "a2a-jsonrpc",
    "authentication": {
      "type": "oauth2",
      "flows": ["client_credentials"]
    }
  }
}
```

### 6.1 Base Capabilities

| Capability | Description |
|------------|-------------|
| `assess-fit` | Check if entity matches intent |
| `check-availability` | Query availability |
| `get-rates` | Retrieve pricing |
| `book` | Create reservation |
| `modify` | Change existing reservation |
| `cancel` | Cancel reservation |

---

## 7. Presentation

The `presentation` block defines UI components for human-in-the-loop confirmation.

AI agents choose. Humans confirm. The presentation block enables rich UI rendering for that confirmation step.

### 7.1 Component Types

| Type | Purpose |
|------|---------|
| `card` | Entity summary |
| `carousel` | Browse options |
| `form` | Collect details |
| `map` | Location context |
| `calendar` | Availability display |

---

## 8. Answers

The `answers` block provides quotable, evidence-linked explanations.

```json
{
  "answers": [
    {
      "question": "Is this genuinely dog-friendly?",
      "answer": "Yes—dogs get their own menu at breakfast and beds in rooms.",
      "confidence": 0.95,
      "basedOn": ["evidence.dogFriendly"],
      "lastVerified": "2026-01-15"
    }
  ]
}
```

> Answers MUST be fully regenerable from Evidence + Fit + Context. They are a convenience layer, not an independent truth source.

---

## 9. Discovery

### Well-Known Endpoint

Bookable-conformant records SHOULD be published at:

```
https://{domain}/.well-known/agent.json
```

---

## 10. Extensions

Bookable is a base pattern. Domain-specific extensions add vocabulary:

| Extension | Domain | Adds |
|-----------|--------|------|
| [Venue](../venue/spec.md) | Hospitality | Vibe, attributes, units, neighbourhood |
| [Stay](../stay/spec.md) | Accommodation | Booking lifecycle, preferences |
| [Folio](../folio/spec.md) | Financial | Charges, payments, refunds |
| [Curator](../curator/spec.md) | Aggregation | Curation, distribution |

### Type Hierarchy

```
Bookable (base)
└── Venue (hospitality)
    ├── Accommodation (Hotel, BnB, Hostel)
    ├── Eat (Restaurant, Cafe, Bar)
    ├── Experience (Museum, Tour, Activity)
    └── Service (Spa, Salon)
```

---

## 11. Conformant Agent Behaviour

### 11.1 Fit Handling

Agents MUST NOT book when `fit.weak` matches user intent without disclosing the weak fit signal.

### 11.2 Evidence Staleness

Agents SHOULD warn users when `lastVerified` exceeds 90 days for material claims.

### 11.3 Conflict Handling

When `convergence` = `conflicting`, agents SHOULD:
- Disclose uncertainty to users
- Present the conflict rather than choosing silently
- Avoid strong assertions

---

## 12. Security Considerations

### 12.1 Trust Model

Bookable assumes good-faith actors but does not enforce behaviour. Evidence provenance enables post-hoc audit of recommendation decisions.

### 12.2 Multiple Records

Multiple Bookable records MAY exist for the same entity, issued by different parties. Records MAY disagree—this is expected, not a defect.

Agents resolve conflicts via evidence weighting, not protocol authority.

---

> Bookable is an open specification under MIT license.

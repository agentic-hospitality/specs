---
title: Specification
description: Technical specification for AI-bookable entities—identity, evidence, fit, actions, presentation, and answers with conformance requirements.
order: 1
---

# Bookable Specification

::badge{type="warning"}
v0.1.0 Draft
::

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

::card-group{cols="2"}
  ::card{title="Bookable Defines" icon="check"}
  - **Identity** — Verifiable existence
  - **Evidence** — Proof supporting claims
  - **Fit** — Explicit intent alignment
  - **Actions** — Available operations
  - **Presentation** — UI components
  - **Answers** — Quotable explanations
  ::

  ::card{title="Bookable Does NOT Define" icon="x"}
  - Domain-specific vocabulary (use extensions)
  - Transport protocols (use A2A)
  - Discovery mechanisms (topology-neutral)
  ::
::

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

### 3.1 Structure

::code-group
```json [Schema]
{
  "identity": {
    "name": "string, REQUIRED",
    "location": {
      "address": "string, REQUIRED",
      "coordinates": "[lat, lng], REQUIRED"
    },
    "domain": "string, RECOMMENDED",
    "did": "string, OPTIONAL"
  }
}
```

```json [Example]
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
::

### 3.2 Requirements

::field-group
  ::field{name="identity.name" type="required"}
  MUST be the public trading name.
  ::

  ::field{name="identity.location.coordinates" type="required"}
  MUST be [latitude, longitude] in WGS84.
  ::

  ::field{name="identity.domain" type="recommended"}
  SHOULD match the domain hosting the record.
  ::

  ::field{name="identity.did" type="optional"}
  SHOULD use the `did:web` method when present.
  ::
::

### 3.3 Decentralized Identifiers

Bookable uses [DIDs](https://www.w3.org/TR/did-core/) for cryptographic identity. A DID proves the entity controls its Bookable record.

The `did:web` method ties identity to domain ownership. For higher trust requirements, other DID methods (`did:ion`, `did:ethr`) provide verification independent of DNS.

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

### 4.2 Source Structure

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

### 4.3 Source Types

Source types identify **who** provided the evidence:

| Type | Description |
|------|-------------|
| `third_party` | External authority |
| `human_observation` | Site visit or interview |
| `self_report` | Entity-provided |
| `curator_certification` | Certified by a Curator |
| `derived` | Computed or inferred |

### 4.4 Verification Status

| Status | Meaning |
|--------|---------|
| `unverified` | Captured but not verified |
| `machine_verified` | Automatically validated |
| `human_verified` | Human reviewed |
| `authority_verified` | Certified by recognised authority |

### 4.5 Convergence Values

| Value | Meaning |
|-------|---------|
| `strong` | Multiple source types agree |
| `moderate` | Two or more sources agree with minor inconsistencies |
| `weak` | Limited corroboration |
| `conflicting` | Sources disagree |

### 4.6 Verifiable Credentials

Claims MAY be elevated to [Verifiable Credentials](https://www.w3.org/TR/vc-data-model/)—cryptographically signed attestations from trusted issuers.

```json
{
  "credentials": [
    {
      "@context": ["https://www.w3.org/2018/credentials/v1"],
      "type": ["VerifiableCredential", "AccessibilityCredential"],
      "issuer": "did:web:visitbeaconshire.gov.uk",
      "issuanceDate": "2024-03-15T00:00:00Z",
      "credentialSubject": {
        "id": "did:web:griffininn.co.uk"
      },
      "proof": { }
    }
  ]
}
```

**Issuer Trust Levels:**

| Issuer Type | Trust Level |
|-------------|-------------|
| Government | Highest |
| Industry body | High |
| Regional authority | High |
| Platform | Medium |
| Self-asserted | Low (needs corroboration) |

---

## 5. Fit

The `fit` block declares explicit intent alignment—what the entity is good for, and what it is not.

### 5.1 Structure

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

### 5.2 Requirements

- `fit.strong` lists intents the entity is well-suited for
- `fit.weak` lists intents the entity is poorly-suited for
- Both arrays MAY be empty but SHOULD NOT be omitted

### 5.3 Weak Fit

::callout{type="tip"}
Entities SHOULD declare weak fit where known. Declaring what an entity is NOT good for prevents bad recommendations, reduces friction, and signals honesty.
::

Absence of weak fit declarations SHOULD NOT be interpreted as universal suitability.

---

## 6. Actions

The `actions` block declares what operations an agent can perform.

### 6.1 Structure

```json
{
  "actions": {
    "capabilities": ["string"],
    "endpoint": "string, REQUIRED",
    "protocol": "string, REQUIRED",
    "authentication": {
      "type": "string",
      "flows": ["string"]
    }
  }
}
```

### 6.2 Base Capabilities

| Capability | Description |
|------------|-------------|
| `assess-fit` | Check if entity matches intent |
| `check-availability` | Query availability |
| `get-rates` | Retrieve pricing |
| `book` | Create reservation |
| `modify` | Change existing reservation |
| `cancel` | Cancel reservation |

Domain extensions MAY define additional capabilities.

### 6.3 Protocol

Actions use [JSON-RPC](https://www.jsonrpc.org/), the same transport as [MCP](https://modelcontextprotocol.io/).

---

## 7. Presentation

The `presentation` block defines UI components for human-in-the-loop confirmation.

### 7.1 Purpose

AI agents choose. Humans confirm. The presentation block enables rich UI rendering for that confirmation step.

### 7.2 Structure

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

### 7.3 Component Types

| Type | Purpose |
|------|---------|
| `card` | Entity summary |
| `carousel` | Browse options |
| `form` | Collect details |
| `map` | Location context |
| `image-grid` | Photo gallery |
| `pricing-table` | Rate comparison |
| `calendar` | Availability display |

### 7.4 Layouts

| Layout | Context |
|--------|---------|
| `summary` | Agent presenting shortlist |
| `detail` | User exploring entity |
| `booking` | User ready to book |
| `confirmation` | Pre-booking review |

### 7.5 Progressive Enhancement

Agents without A2UI support SHOULD fall back to structured text derived from `identity`, `evidence`, and `fit`. The `presentation` block is OPTIONAL.

---

## 8. Answers

The `answers` block provides quotable, evidence-linked explanations for common agent questions.

### 8.1 Purpose

Agents need to explain recommendations, not just make them. The answers block provides canonical responses tied to evidence.

### 8.2 Structure

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

### 8.3 Citation Structure

```json
{
  "citations": [
    {
      "type": "string",
      "source": "string",
      "venuePath": "string"
    }
  ]
}
```

The `venuePath` field references the evidence block (e.g., `evidence.dogFriendly`, `fit.strong[0]`).

### 8.4 Regenerability Requirement

::callout{type="warning"}
Answers MUST be fully regenerable from Evidence + Fit + Context. Answers are a convenience layer, not an independent truth source.
::

Agents MUST NOT trust answers that contradict underlying evidence.

---

## 9. Discovery

### 9.1 Well-Known Endpoint

Bookable-conformant records SHOULD be published at:

```
https://{domain}/.well-known/agent.json
```

### 9.2 DCAT Integration

Bookable supports [DCAT](https://www.w3.org/TR/vocab-dcat-3/) for catalog and registry integration:

```json
{
  "meta": {
    "catalogRef": "https://visitbeaconshire.gov.uk/catalog/venues",
    "datasetId": "felin-fach-griffin",
    "lastUpdated": "2024-10-20T00:00:00Z"
  }
}
```

This enables authorities to maintain catalogs of Bookables for discovery.

---

## 10. Extensions

Bookable is a base pattern. Domain-specific extensions add vocabulary:

| Extension | Domain | Adds |
|-----------|--------|------|
| [Venue](/reference/venue/spec) | Hospitality | Vibe, attributes, units, neighbourhood |
| [Stay](/reference/stay/spec) | Accommodation | Booking lifecycle, preferences |
| [Folio](/reference/folio/spec) | Financial | Charges, payments, refunds |
| [Curator](/reference/curator/spec) | Aggregation | Curation, distribution |

### 10.1 Extension Declaration

```json
{
  "bookable": {
    "type": "bookable:hotel",
    "extends": "bookable:bookable"
  }
}
```

### 10.2 Type Hierarchy

```
Bookable (base)
└── Venue (hospitality)
    ├── Accommodation (Hotel, BnB, Hostel)
    ├── Eat (Restaurant, Cafe, Bar)
    ├── Experience (Museum, Tour, Activity)
    └── Service (Spa, Salon)
```

Note: [Stay](/reference/stay/spec) defines the booking lifecycle, not a venue type.

---

## 11. Conformant Agent Behaviour

### 11.1 Fit Handling

Agents MUST NOT book when `fit.weak` matches user intent without disclosing the weak fit signal.

### 11.2 Evidence Staleness

Agents SHOULD warn users when `lastVerified` exceeds 90 days for material claims.

### 11.3 High-Consequence Claims

For safety-critical claims, agents MUST NOT assert claims at confidence < 0.8 without explicit caveat.

### 11.4 Conflict Handling

When `convergence` = `conflicting`, agents SHOULD:
- Disclose uncertainty to users
- Present the conflict rather than choosing silently
- Avoid strong assertions

---

## 12. Security Considerations

### 12.1 Trust Model

Bookable assumes good-faith actors but does not enforce behaviour. Evidence provenance enables post-hoc audit of recommendation decisions.

### 12.2 Integrity

Records SHOULD be served over HTTPS. Records with `identity.did` provide cryptographic verification of issuer.

### 12.3 Multiple Records

Multiple Bookable records MAY exist for the same entity, issued by different parties. Records MAY disagree—this is expected, not a defect.

Agents resolve conflicts via evidence weighting, not protocol authority.

---

## Related Specifications

- [Venue Spec](/reference/venue/spec) — Hospitality extension
- [Stay Spec](/reference/stay/spec) — Booking lifecycle
- [Folio Spec](/reference/folio/spec) — Financial records
- [Curator Spec](/reference/curator/spec) — Authority curation

::callout{type="tip"}
For complete working examples of Bookable in practice, see [Venue Examples](/reference/venue/examples). Venue is the primary implementation of the Bookable pattern.
::

---

::callout{type="info"}
Bookable is an open specification under MIT license.
::

# Bookable: Base Pattern for AI-Bookable Entities

**Version:** 0.1.0 (Draft)  
**Status:** Draft Specification  
**License:** MIT  

---

## Abstract

Bookable defines the base pattern for any entity that AI agents can discover, understand, trust, and transact with.

It is not a protocol. It is a pattern that domain-specific extensions inherit from.

---

## 1. Introduction

### 1.1 Purpose

AI agents making recommendations and bookings require structured, verifiable information to:

1. Determine whether an entity fits a user's intent
2. Defend the recommendation if challenged
3. Complete a transaction without friction

Bookable provides this structure in a domain-neutral form.

### 1.2 Scope

Bookable defines:
- **Identity** — Verifiable existence
- **Evidence** — Proof supporting claims
- **Fit** — Explicit intent alignment (positive and negative)
- **Actions** — Available operations
- **Presentation** — UI components for human confirmation
- **Answers** — Quotable explanations tied to evidence

Bookable does NOT define:
- Domain-specific vocabulary (use extensions like Venue)
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

### 3.1 Structure

```json
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

### 3.2 Requirements

- `identity.name` MUST be the public trading name
- `identity.location.coordinates` MUST be [latitude, longitude] in WGS84
- `identity.domain` SHOULD match the domain hosting the record
- `identity.did` SHOULD use the `did:web` method when present

### 3.3 Decentralized Identifiers (DIDs)

Bookable uses [DIDs](https://www.w3.org/TR/did-core/) for cryptographic identity. A DID proves the entity controls its Bookable record.

```json
{
  "identity": {
    "did": "did:web:example.com"
  }
}
```

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

| Type | Description |
|------|-------------|
| `web_scrape` | Automated extraction from website |
| `json_ld` | Structured data parse (Schema.org) |
| `llm_inference` | Derived from text by LLM |
| `review_aggregation` | Pattern across reviews |
| `third_party` | External authority |
| `human_observation` | Site visit or interview |
| `self_report` | Entity-provided |
| `computed` | Cross-referenced or calculated |
| `curator_certification` | Certified by a Curator |

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

Claims MAY be elevated to [Verifiable Credentials](https://www.w3.org/TR/vc-data-model/) — cryptographically signed attestations from trusted issuers.

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

| Issuer type | Trust level |
|-------------|-------------|
| Government | Highest |
| Industry body | High |
| Regional authority | High |
| Platform | Medium |
| Self-asserted | Low (needs corroboration) |

VCs complement Evidence. Evidence shows provenance. VCs provide cryptographic proof.

---

## 5. Fit

The `fit` block declares explicit intent alignment — what the entity is good for, and what it is not.

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

Entities SHOULD declare weak fit where known. Absence of weak fit declarations SHOULD NOT be interpreted as universal suitability.

Declaring what an entity is NOT good for:
- Prevents bad recommendations
- Reduces friction (no book-then-complain-then-refund cycles)
- Signals honesty, which builds trust

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

```json
{
  "actions": {
    "protocol": "jsonrpc"
  }
}
```

---

## 7. Presentation

The `presentation` block defines [A2UI](https://a2ui.org) / MCP-UI components for human-in-the-loop confirmation.

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

The `venuePath` field references the evidence block (e.g., `evidence.claimKey`, `fit.strong[0]`).

### 8.4 Regenerability Requirement

Answers MUST be fully regenerable from Evidence + Fit + Context.

Answers are a convenience layer, not an independent truth source. They exist to accelerate agent response, not to replace evidence inspection.

Agents MUST NOT trust answers that contradict underlying evidence.

---

## 9. Discovery

### 9.1 Well-Known Endpoint

Bookable-conformant records SHOULD be published at:

```
https://{domain}/.well-known/agent.json
```

### 9.2 DCAT Integration

Bookable supports [DCAT](https://www.w3.org/TR/vocab-dcat-3/) for catalog and registry integration.

```json
{
  "meta": {
    "catalogRef": "https://authority.example/catalog/entities",
    "datasetId": "example-bookable",
    "lastUpdated": "ISO-8601"
  }
}
```

This enables authorities to maintain catalogs of Bookables for discovery.

---

## 10. Extensions

Bookable is a base pattern. Domain-specific extensions add vocabulary:

| Extension | Domain | Adds |
|-----------|--------|------|
| [Venue](../venue/spec/venue-v0.1.md) | Hospitality | Vibe, attributes, units, neighbourhood |

Extensions inherit all Bookable blocks and add domain-specific fields.

### 10.1 Extension Declaration

Extensions declare their relationship to Bookable:

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
    ├── Stay (Hotel, BnB, Hostel)
    ├── Eat (Restaurant, Cafe, Bar)
    ├── Experience (Museum, Tour, Activity)
    └── Service (Spa, Salon)
```

Agents MAY interact with any extension as a Bookable without knowing its specific type.

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

Multiple Bookable records MAY exist for the same entity, issued by different parties. Records MAY disagree. This is expected, not a defect.

Agents resolve conflicts via evidence weighting, not protocol authority.

---

## Appendix A: Related Specifications

- [Venue](../venue/spec/venue-v0.1.md) — Hospitality extension
- [Booking Terms](../booking-terms/spec/booking-terms-v0.1.md) — Payment protocol for Bookables
- [Curator](../../curator/spec/curator-spec.md) — Authority curation of Bookables

---

*Bookable is an open specification under MIT license.*

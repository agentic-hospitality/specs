# Bookable

The base pattern for AI-bookable entities.

---

## What Bookable is

Bookable defines what an AI agent needs to discover, understand, trust, and transact with any bookable entity.

It is not a protocol. It is a pattern that domain-specific extensions inherit from.

---

## The pattern

```
Bookable
├── Identity       Who this is, where it is, proof of control
├── Evidence       Claims with provenance, confidence, verification
├── Fit            What it's good for, and what it's not
├── Actions        What an agent can do
├── Presentation   UI components for human confirmation
└── Answers        Quotable explanations tied to evidence
```

Any entity that follows this pattern can be understood and booked by an AI agent.

---

## Identity

Verifiable existence. An agent needs to confirm: this entity exists, and this record represents it.

```json
{
  "identity": {
    "name": "string",
    "location": {
      "address": "string",
      "coordinates": [lat, lng]
    },
    "domain": "string",
    "did": "did:web:example.com"
  }
}
```

| Field | Purpose |
|-------|---------|
| `name` | Public trading name |
| `location` | Where it is (address + coordinates) |
| `domain` | Website domain |
| `did` | Decentralized Identifier for cryptographic verification |

Identity can be verified by cross-referencing domain ownership, company registries, and DID resolution.

---

## Evidence

Proof for claims. An agent needs to trace any assertion back to its source.

```json
{
  "evidence": {
    "claimKey": {
      "claim": "string",
      "confidence": 0.0-1.0,
      "convergence": "strong|moderate|weak|conflicting",
      "sources": [
        {
          "type": "string",
          "sourceRef": "string",
          "method": "string",
          "capturedAt": "ISO-8601",
          "capturedBy": "string",
          "verification": {
            "status": "unverified|machine_verified|human_verified|authority_verified"
          }
        }
      ],
      "lastVerified": "ISO-8601"
    }
  }
}
```

| Field | Purpose |
|-------|---------|
| `claim` | The assertion being evidenced |
| `confidence` | How certain (0-1) |
| `convergence` | Do sources agree? |
| `sources` | Where the evidence came from, how, when, who captured it |
| `verification.status` | Level of verification |

Evidence enables defensible recommendations. When asked "why did you choose this?", the agent can trace the answer.

### Evidence source types

| Type | Description | Example |
|------|-------------|---------|
| `web_scrape` | Extracted from website | "WiFi mentioned on amenities page" |
| `json_ld` | Parsed from structured data | "Schema.org says 4-star" |
| `review_aggregation` | Pattern across reviews | "47 reviews mention 'quiet'" |
| `photo` | Visual evidence | Photo of dog bed in room |
| `third_party` | External authority | "Green Tourism Bronze" |
| `human_observation` | Site visit or interview | "Chef sources from Morston" |
| `self_report` | Venue-provided | "We allow dogs in all rooms" |

### Photos as evidence

Photos are evidence with provenance. A claim like "sea view" or "dog-friendly" is stronger when backed by photographic proof:

```json
{
  "type": "photo",
  "sourceRef": "https://example.com/photos/room-3-sea-view.jpg",
  "method": "human_capture",
  "capturedAt": "2025-10-20T14:30:00Z",
  "capturedBy": "did:web:visitnorfolk.co.uk",
  "depicts": "View from Room 3 window",
  "geotagged": [52.9412, 1.0274],
  "verification": { 
    "status": "dmo_verified",
    "verifiedBy": "did:web:visitnorfolk.co.uk"
  }
}
```

Photos captured by Curators during site visits carry more weight than venue-supplied marketing images. Geotags and timestamps provide additional verification.

---

## Fit

Intent alignment. An agent needs to know what this entity is good for, and what it isn't.

```json
{
  "fit": {
    "strong": [
      {
        "intent": "string",
        "confidence": 0.0-1.0,
        "signals": ["string"]
      }
    ],
    "weak": [
      {
        "intent": "string",
        "reason": "string"
      }
    ]
  }
}
```

| Field | Purpose |
|-------|---------|
| `strong` | Intents this entity is well-suited for |
| `weak` | Intents this entity is poorly-suited for |

Weak fit is as important as strong fit. An agent that knows what NOT to recommend avoids bad matches.

---

## Actions

Executable operations. An agent needs to know what it can do.

```json
{
  "actions": {
    "capabilities": ["assess-fit", "check-availability", "book", "modify", "cancel"],
    "endpoint": "string",
    "protocol": "jsonrpc",
    "authentication": {
      "type": "string",
      "flows": ["string"]
    }
  }
}
```

| Capability | Purpose |
|------------|---------|
| `assess-fit` | Check if entity matches intent |
| `check-availability` | Query availability |
| `get-rates` | Get pricing |
| `book` | Create reservation |
| `modify` | Change reservation |
| `cancel` | Cancel reservation |

Actions use JSON-RPC ([MCP](https://modelcontextprotocol.io/)).

---

## Standards

Bookable can be expressed using existing protocols and standards:

### Decentralized Identifiers (DIDs)

[DIDs](https://www.w3.org/TR/did-core/) provide cryptographic identity. A DID proves the entity controls its Bookable record.

```json
{
  "identity": {
    "did": "did:web:example.com"
  }
}
```

The `did:web` method ties identity to domain ownership. For higher trust requirements, other DID methods (`did:ion`, `did:ethr`) provide verification independent of DNS.

### Verifiable Credentials (VCs)

[Verifiable Credentials](https://www.w3.org/TR/vc-data-model/) are cryptographically signed attestations from trusted issuers.

```json
{
  "credentials": [
    {
      "@context": ["https://www.w3.org/2018/credentials/v1"],
      "type": ["VerifiableCredential", "SafetyRatingCredential"],
      "issuer": "did:web:authority.gov.uk",
      "credentialSubject": {
        "id": "did:web:example.com",
        "rating": 5
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

### DCAT (Discovery)

[DCAT](https://www.w3.org/TR/vocab-dcat-3/) enables catalog and registry integration.

```json
{
  "meta": {
    "catalogRef": "https://authority.example/catalog/entities",
    "datasetId": "example-bookable",
    "lastUpdated": "2026-01-01T00:00:00Z"
  }
}
```

This enables authorities to maintain catalogs of Bookables, registries to index them for discovery, and agents to query catalogs rather than crawling individual entities.

### A2UI / MCP-UI (Presentation)

[A2UI](https://a2ui.org) and MCP-UI provide human-in-the-loop confirmation. AI agents choose. Humans confirm.

```json
{
  "presentation": {
    "a2uiVersion": "0.8",
    "components": {
      "entityCard": {
        "type": "card",
        "template": {
          "header": { "title": "{{identity.name}}" },
          "body": { "location": "{{identity.location.address}}" }
        }
      },
      "bookingForm": {
        "type": "form",
        "fields": [
          { "id": "date", "type": "date", "required": true }
        ],
        "submitAction": "check-availability"
      }
    },
    "layouts": {
      "summary": ["entityCard"],
      "booking": ["bookingForm"]
    }
  }
}
```

The `presentation` block declares UI components: cards, forms, calendars, maps. Agents without A2UI support fall back to structured text.

### JSON-RPC (MCP)

[JSON-RPC](https://www.jsonrpc.org/) handles action execution, the same transport used by [MCP](https://modelcontextprotocol.io/).

---

## Answers

Pre-computed quotable explanations tied to evidence.

```json
{
  "answers": [
    {
      "question": "Is this accessible?",
      "answer": "Yes. Step-free access throughout, accessible facilities available.",
      "confidence": 0.89,
      "basedOn": ["evidence.accessibility"],
      "citations": [
        { "type": "authority-verified", "source": "access-scheme", "path": "evidence.accessibility.sources[0]" }
      ],
      "lastVerified": "2025-12-01T00:00:00Z"
    }
  ]
}
```

Agents can quote answers when explaining recommendations. Citations trace back to evidence.

Answers must be regenerable from Evidence + Fit. They are a convenience layer, not an independent truth source.

---

## Extensions

Bookable is a base. Domain-specific extensions add vocabulary:

| Extension | Domain | Adds |
|-----------|--------|------|
| [Venue](/venue) | Hospitality | Vibe, attributes, units, neighbourhood |

Future extensions could cover other bookable domains using the same base pattern.

---

## Type hierarchy

```
Bookable (base)
├── Venue (hospitality)
│   ├── Hotel
│   ├── Restaurant
│   ├── Experience
│   └── Service
└── [Future domains]
```

Agents can interact with any Bookable without knowing its specific type. The base pattern guarantees Identity, Evidence, Fit, and Actions.

---

## Specification

**[→ Bookable specification](./spec/bookable-v0.1.md)**

---

## Repository

```
/bookable
├── README.md
└── /spec
    ├── bookable-v0.1.md
    └── bookable-context.jsonld
```

---

## Related

- [Venue](/venue): Hospitality extension
- [Booking Terms](/booking-terms): Payment protocol for Bookables
- [Curator](/curator): Authority curation of Bookables
- [Identity and Trust](/docs/identity-and-trust.md): DIDs, VCs, and authority hierarchy

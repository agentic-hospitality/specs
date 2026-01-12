# Curator

The discovery and trust layer for agentic hospitality.

---

## What Curator is

Curator defines how authorities express their knowledge about collections of venues.

[Venue](/venue) defines what venues say about themselves. Curator defines what **authorities say about them**.

```
Venue      →  "This is who I am" (venue self-knowledge)
Curator    →  "This is what I know about them" (third-party observation)
```

Curator exists specifically because commerce protocols intentionally avoid defining trust, authority, and taste.

---

## Why Curator exists

Individual venue claims lack regional context and third-party validation. Questions that require more than a single Venue:

- "Where should I stay in Norfolk?" (requires regional knowledge)
- "Is this hotel actually good?" (requires third-party verification)
- "What's special about this area?" (requires local narrative)

Curators provide this context.

---

## Curator types

```
Curator (base)
├── Curator:DMO        Regional destination authority
├── Curator:Portfolio  Curated collection
└── Curator:Editorial  Critics, guides, awards
```

| Type | Examples | Authority basis |
|------|----------|-----------------|
| **DMO** | Visit Norfolk, Visit Cornwall | Geographic scope, official recognition |
| **Portfolio** | Cottages.com, Great British Hotels, Unmissable England | Curated selection, booking relationships |
| **Editorial** | Michelin, AA Rosettes, Good Food Guide | Reputation, editorial judgment |

---

## The chorus principle

> "The destination doesn't describe itself. Its people do. The Curator's job is to listen and amplify."

Curators create **stories**: narratives that reveal place through people. Not marketing copy. Real voices, specific details, the texture of a place.

```json
{
  "story": {
    "id": "white-lion-interview-2025",
    "type": "venue-interview",
    
    "about": {
      "venueId": "white-lion-blakeney",
      "venueName": "The White Lion",
      "venueEndpoint": "https://whitelionblakeney.co.uk/.well-known/agent.json"
    },
    
    "createdBy": {
      "curatorId": "visit-norfolk",
      "curatorName": "Visit Norfolk",
      "curatorEndpoint": "https://visitnorfolk.co.uk/.well-known/agent.json"
    },
    
    "content": {
      "headline": "Where the sailors drink",
      "summary": "Third-generation publican on keeping the quayside spirit alive.",
      "quotes": [
        {
          "text": "The harbour's been here longer than the building. We're just caretakers.",
          "attribution": "James Morton",
          "role": "Publican"
        }
      ],
      "localContext": "Blakeney was a working port before it was a tourist destination. The White Lion still serves the people who sail, not just the people who watch.",
      "insiderTip": "The crab comes off the boat at 6am. Be at breakfast by 8 if you want it."
    },
    
    "editorialWeight": {
      "depth": "comprehensive",
      "confidence": "high",
      "basis": "ongoing-relationship"
    }
  }
}
```

Stories create evidence that venues can't create for themselves.

---

## Verification

Curators stamp venues with certification. This appears as evidence on the venue's Venue:

```json
{
  "evidence": {
    "dmoCertified": {
      "claim": "Certified by Visit Norfolk",
      "confidence": 0.95,
      "sources": [
        {
          "type": "curator_certification",
          "sourceRef": "https://visitnorfolk.co.uk/.well-known/agent.json",
          "curatorId": "visit-norfolk",
          "certificationLevel": "verified",
          "certifiedAt": "2025-10-20T00:00:00Z",
          "verification": {
            "status": "authority_verified",
            "verifiedBy": "did:web:visitnorfolk.co.uk"
          }
        }
      ]
    }
  }
}
```

| Certification level | Meaning |
|---------------------|---------|
| `listed` | Appears in catalog, existence confirmed |
| `verified` | Story captured, insider details documented |
| `recommended` | Actively recommended by the Curator |

### What verification involves

Verification is the process of adding your authority's weight to a venue's evidence. Two activities:

1. **Confirm existence**: Venue matches its Venue (location, identity, business registration)

2. **Capture the story**: Interview the people. This is where the real value lies.

   Not a quality assessment. Not a checklist inspection. A conversation that surfaces the insider details, the human texture, the things only locals know.

   Why does the chef source from that particular farm? What happens at the bar on Friday nights? Who actually comes here?

   The destination doesn't describe itself. Its people do. The Curator's job is to listen and amplify.

   These details become evidence that AI agents can cite. They're what make a recommendation defensible and a place discoverable for the right reasons.

The technical implementation varies by scale. A small DMO might interview 50 venues over a year. A national authority needs field staff coordination and structured capture tooling.

[Selfe](https://selfe.ai) provides Curator tooling for DMOs, including story capture workflows and evidence publishing.

For details on DIDs, Verifiable Credentials, and how authority hierarchies work, see [Identity and Trust](/docs/identity-and-trust.md).

Certification is separate from stories. A venue can be certified without a story, or have a story without certification.

---

## Mutual validation

Curators and venues validate each other:

```
Venue validates Curator:
  847 venues certified by Visit Norfolk
  → "This DMO has comprehensive coverage"
  → "They know this region"

Curator validates Venue:
  Visit Norfolk certified The White Lion
  Visit Norfolk published a story about The White Lion
  → Evidence on the venue's Venue
  → Third-party credibility
```

This creates natural resistance to spam and fake authorities. A Curator with no venues has no credibility. A venue with no third-party validation relies only on self-claims.

---

## Curator schema

```json
{
  "agentCard": {
    "name": "Visit Norfolk",
    "description": "Official tourism authority for Norfolk, UK",
    "endpoint": "https://visitnorfolk.co.uk/api/agent",
    "skills": ["recommend", "answer", "narrate", "verify"]
  },
  "curator": {
    "schemaVersion": "0.2.0",
    "type": "curator:dmo",
    
    "identity": {
      "id": "visit-norfolk",
      "name": "Visit Norfolk",
      "established": 1972,
      "jurisdiction": "Norfolk, UK",
      "website": "https://visitnorfolk.co.uk"
    },
    
    "coverage": {
      "geographic": {
        "regions": ["Norfolk"],
        "country": "GB"
      },
      "venueTypes": ["hotel", "restaurant", "bar", "experience"],
      "totalVenues": 847,
      "certifiedVenues": 612,
      "storiesPublished": 234
    },
    
    "stories": {
      "endpoint": "https://visitnorfolk.co.uk/api/stories",
      "count": 234,
      "types": ["venue-interview", "local-guide", "seasonal", "hidden-gem"]
    },
    
    "verification": {
      "canCertify": true,
      "certificationLevels": ["listed", "verified", "recommended"],
      "verificationMethods": ["site-visit", "documentation", "ongoing-monitoring"]
    },
    
    "actions": {
      "capabilities": ["recommend", "answer", "getStory", "listVenues", "verify"],
      "endpoint": "https://visitnorfolk.co.uk/api/agent",
      "protocol": "jsonrpc"
    },
    
    "presentation": {
      "a2uiVersion": "0.8",
      "components": {
        "venueList": {
          "type": "carousel",
          "dataSource": "recommendations",
          "itemTemplate": {
            "title": "{{name}}",
            "subtitle": "{{vibe.essence}}",
            "image": "{{media.hero}}"
          }
        },
        "regionMap": {
          "type": "map",
          "center": "{{coverage.geographic.center}}",
          "markers": "{{recommendations}}"
        }
      },
      "layouts": {
        "recommendations": ["venueList", "regionMap"],
        "story": ["storyCard"]
      }
    }
  }
}
```

---

## Actions

Curators respond to agent queries:

| Action | Purpose |
|--------|---------|
| `recommend` | "Where should I stay in Norfolk for a dog-friendly coastal weekend?" |
| `answer` | "What's special about the North Norfolk coast?" |
| `getStory` | Retrieve a specific story about a venue |
| `listVenues` | List venues matching criteria |
| `verify` | Check certification status of a venue |

---

## Standards

Curators are agents. They use the same protocols as Bookables:

### A2A (Agent-to-Agent)

Curators publish an [A2A](https://google.github.io/A2A/) Agent Card at `/.well-known/agent.json`. Other agents discover and query them through this endpoint.

### A2UI / MCP-UI (Presentation)

When a Curator returns recommendations, it includes [A2UI](https://a2ui.org) components for human confirmation: venue carousels, region maps, story cards. See the `presentation` block in the schema above.

### JSON-RPC (MCP)

Actions use [JSON-RPC](https://www.jsonrpc.org/), the same transport as [MCP](https://modelcontextprotocol.io/). See the `actions` block in the schema above.

### DCAT (Discovery)

A Curator is fundamentally a catalog of venues. [DCAT](https://www.w3.org/TR/vocab-dcat-3/) (Data Catalog Vocabulary) is the W3C standard for describing catalogs and datasets, already used by government open data portals, research repositories, and enterprise data catalogs.

Where Schema.org describes individual things ("this is a Hotel"), DCAT describes collections ("this catalog contains these datasets"). Curators need both: Schema.org-style vocabulary for venues, DCAT-style vocabulary for the catalog itself.

We extend DCAT with agentic hospitality properties:

```turtle
@prefix dcat: <http://www.w3.org/ns/dcat#> .
@prefix ah: <https://open-hospitality.org/ns#> .

<https://visitnorfolk.co.uk/catalog>
  a dcat:Catalog ;
  ah:curatorType "dmo" ;
  ah:verificationCapability true ;
  dcat:dataset <https://whitelionblakeney.co.uk/.well-known/agent.json> .
```

| DCAT provides | We extend with |
|---------------|----------------|
| Catalog, Dataset, Distribution | `ah:curatorType` (dmo, portfolio, editorial) |
| Spatial/temporal coverage | `ah:verificationCapability` |
| Publisher, access rights | `ah:certificationLevels` |

This means Curator catalogs can integrate with existing data infrastructure while adding the agent-specific semantics we need.

A formal DCAT Application Profile ("DCAT-AH") is a future consideration once implementation patterns stabilize.

---

## How Curator relates to Bookable

```
                    ┌─────────────────┐
                    │     Curator     │
                    │    (verifies)   │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              │              ▼              │
              │  ┌───────────────────────┐  │
              │  │       Bookable        │  │
              │  │   ┌───────────────┐   │  │
              │  │   │     Venue      │   │  │
              │  │   └───────────────┘   │  │
              │  └───────────────────────┘  │
              │              │              │
              └──────────────┼──────────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │      Booking Terms      │
                    │     (pays)      │
                    └─────────────────┘
```

Curator sits above Bookable. It doesn't replace venue identity: it adds third-party perspective.

---

## Epistemic separation

Each spec speaks only to what it can credibly claim:

| Spec | Who speaks | What they claim |
|------|------------|-----------------|
| **Venue** | The venue | "This is who I am" |
| **Curator** | The authority | "This is what I know about them" |
| **Booking Terms** | The transaction layer | "This is what was agreed" |

Venues don't claim authority. Authorities don't claim to be venues. This separation is load-bearing.

---

## Power and accountability

Large-scale curation creates structural advantage. A Curator with 10 million verified venues will be weighted differently than one with 50. This is unavoidable.

Open standards do not eliminate power asymmetries. They make them legible, contestable, and accountable.

See the **[Curator Manifesto](/docs/curator-manifesto.md)** for public commitments on neutrality, disputes, and how others can compete.

---

## Status

**Version:** 0.2.0 (Draft)  
**Specification:** [./spec/curator-spec.md](./spec/curator-spec.md)  
**License:** MIT

For security considerations and how Curator resists spam, SEO farms, and fake authorities, see the [threat model](./spec/curator-threat-model.md).

---

## Repository

```
/curator
├── README.md
└── /spec
    ├── curator-spec.md
    ├── curator-context.jsonld
    └── curator-threat-model.md
```

---

## Related

- [Bookable](/bookable): Base pattern for bookable entities
- [Venue](/venue): Hospitality extension (venue identity)
- [Booking Terms](/booking-terms): Payment protocol
- [Identity and Trust](/docs/identity-and-trust.md): DIDs, VCs, and becoming a verifier

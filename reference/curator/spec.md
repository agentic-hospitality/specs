---
title: Specification
description: Technical specification for authority extensions—coverage, stories, verification, actions, and transparency requirements for DMOs and curators.
order: 1
---

# Curator Specification

::badge{type="warning"}
v0.2.0 Draft
::

Authority extension for A2A Agent Cards.

**Namespace URI:** `https://agenticbooking.org/curator/v1`

---

## 1. Overview

Curator defines how regional authorities, brand groups, and editorial curators express their collections, stories, and verification capabilities to AI agents.

```json
{
  "agentCard": {
    "name": "Visit Norfolk",
    "endpoint": "https://visitnorfolk.co.uk/api/agent",
    "skills": ["recommend", "answer", "narrate", "verify"]
  },
  "curator": {
    "schemaVersion": "0.2.0",
    "type": "curator:dmo",
    "identity": {...},
    "coverage": {...},
    "stories": {...},
    "verification": {...},
    "actions": {...},
    "transparency": {...}
  }
}
```

### 1.1 Curator Types

| Type | Description | Authority basis |
|------|-------------|-----------------|
| `curator:dmo` | Regional destination authority | Geographic scope, official recognition |
| `curator:portfolio` | Curated collection with booking relationships | Selection criteria, commercial relationships |
| `curator:editorial` | Critics, guides, awards | Reputation, editorial judgment |

---

## 2. Coverage

Defines what the Curator knows about:

```json
{
  "coverage": {
    "totalVenues": 847,
    "certified": 612,
    "withStories": 234,
    "categories": ["stay", "eat", "drink", "experience"],
    "bounds": {
      "type": "geographic",
      "regions": ["Norfolk"],
      "country": "GB"
    },
    "lastUpdated": "2026-01-15",
    "narrativeDensity": 0.38
  }
}
```

### 2.1 Narrative Density

```
narrativeDensity = withStories / certified
```

A Curator with 612 certified venues and 234 stories (density: 0.38) demonstrates deeper engagement than one with 1000 certified and 12 stories (density: 0.012).

---

## 3. Stories

Stories are the Curator's primary value creation—narratives that reveal place through people.

```json
{
  "story": {
    "id": "white-lion-interview-2026",
    "type": "venue-interview",
    "created": "2026-01-20T00:00:00Z",

    "about": {
      "venueId": "white-lion-blakeney",
      "venueName": "The White Lion",
      "venueEndpoint": "https://whitelionblakeney.co.uk/.well-known/agent.json"
    },

    "content": {
      "headline": "Where the sailors drink",
      "summary": "Third-generation publican on keeping the quayside spirit alive.",
      "quotes": [{
        "text": "The harbour's been here longer than the building. We're just caretakers.",
        "attribution": "James Morton",
        "role": "Publican"
      }],
      "localContext": "Blakeney was a working port before it was a tourist destination.",
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

### 3.1 Story Types

| Type | Description |
|------|-------------|
| `venue-interview` | Conversation with venue owner/staff |
| `local-guide` | Area/neighbourhood overview |
| `seasonal` | Time-specific recommendations |
| `hidden-gem` | Lesser-known discovery |
| `insider-tip` | Specific local knowledge |

### 3.2 Editorial Weight

| Field | Values | Meaning |
|-------|--------|---------|
| `depth` | brief, standard, comprehensive | Level of engagement |
| `confidence` | low, medium, high | Reliability of information |
| `basis` | single-visit, ongoing-relationship, reader-reports | How knowledge was acquired |

---

## 4. Verification

Split into procedural certification and editorial badges:

```json
{
  "verification": {
    "certificationLevels": [
      { "level": "listed", "description": "Appears in catalog", "procedural": true },
      { "level": "verified", "description": "Story captured, details documented", "procedural": true },
      { "level": "recommended", "description": "Actively recommended", "procedural": true }
    ],
    "editorialBadges": [
      { "badge": "featured", "description": "Editor's choice", "editorial": true },
      { "badge": "hidden-gem", "description": "Lesser-known discovery", "editorial": true }
    ],
    "canCertify": ["venue:hotel", "venue:restaurant", "venue:bar"],
    "certificationCriteria": "https://visitnorfolk.co.uk/criteria"
  }
}
```

### 4.1 Certification on Venue

When a Curator certifies a venue, it appears as evidence:

```json
{
  "evidence": {
    "dmoCertified": {
      "claim": "Certified by Visit Norfolk",
      "confidence": 0.95,
      "sources": [{
        "type": "curator_certification",
        "curatorId": "visit-norfolk",
        "certificationLevel": "verified",
        "editorialBadges": ["hidden-gem"],
        "certifiedAt": "2026-01-20T00:00:00Z"
      }]
    }
  }
}
```

---

## 5. Actions

What agents can ask the Curator to do:

```json
{
  "actions": {
    "capabilities": ["recommend", "answer", "getStory", "listVenues", "verify"],
    "endpoint": "https://visitnorfolk.co.uk/api/agent",
    "protocol": "jsonrpc"
  }
}
```

| Action | Purpose |
|--------|---------|
| `recommend` | "Where should I stay in Norfolk?" |
| `answer` | "What's special about the North Norfolk coast?" |
| `getStory` | Retrieve a specific story about a venue |
| `listVenues` | List venues matching criteria |
| `verify` | Check certification status of a venue |

---

## 6. Transparency

Required for Portfolio Curators, recommended for all:

```json
{
  "transparency": {
    "economicRelationship": "none | partner | owner",
    "disclosureStatement": "All listed properties are independently operated",
    "rankingDisclosure": {
      "primaryFactors": ["editorial-judgment", "certification-level", "narrative-density"],
      "methodology": "https://visitnorfolk.co.uk/ranking"
    }
  }
}
```

Portfolio Curators with `economicRelationship: owner` MUST disclose this prominently.

---

## 7. Trust Hierarchy

When multiple Curators conflict, agents apply this hierarchy:

| Priority | Source | Reason |
|----------|--------|--------|
| 1 | Official DMO | Geographic authority, accountability |
| 2 | Industry body | Standards-based verification |
| 3 | Editorial | Reputation-based credibility |
| 4 | Portfolio Curator | Self-interest requires scrutiny |
| 5 | Venue self-claim | Primary source but unverified |

---

## 8. Transport Bindings

### A2A Agent Card

```
https://{domain}/.well-known/agent.json
```

### MCP

```json
{
  "method": "tools/call",
  "params": {
    "name": "recommend",
    "arguments": {
      "intent": "dog-friendly coastal weekend",
      "region": "Norfolk",
      "party": { "adults": 2, "dogs": 1 }
    }
  }
}
```

---

## Related Specifications

- [Bookable Spec](/reference/bookable/spec) — Base pattern
- [Venue Spec](/reference/venue/spec) — What venues say about themselves
- [Identity Spec](/reference/identity/spec) — DIDs and verification

---

::callout{type="info"}
Curator is an open specification under MIT license.
::

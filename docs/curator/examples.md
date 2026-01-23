---
title: Curator Examples
description: Working JSON examples for Curator Agent Cards, regional stories, venue interviews, and verification flows.
---

# Curator Examples

Agent Cards, stories, and verification flows.

---

## DMO Agent Card

A complete Curator Agent Card for a regional DMO:

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
      "website": "https://visitnorfolk.co.uk",
      "did": "did:web:visitnorfolk.co.uk"
    },

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
    },

    "stories": {
      "endpoint": "https://visitnorfolk.co.uk/api/stories",
      "count": 234,
      "types": ["venue-interview", "local-guide", "seasonal", "hidden-gem"]
    },

    "verification": {
      "certificationLevels": [
        { "level": "listed", "description": "Verified business in our region", "procedural": true },
        { "level": "verified", "description": "Story captured, insider details documented", "procedural": true },
        { "level": "recommended", "description": "Actively recommended by our team", "procedural": true }
      ],
      "editorialBadges": [
        { "badge": "hidden-gem", "description": "Lesser-known discovery worth seeking out", "editorial": true },
        { "badge": "editors-choice", "description": "Top recommendation in category", "editorial": true }
      ],
      "canCertify": ["venue:hotel", "venue:restaurant", "venue:bar", "venue:experience"]
    },

    "actions": {
      "capabilities": ["recommend", "answer", "getStory", "listVenues", "verify"],
      "endpoint": "https://visitnorfolk.co.uk/api/agent",
      "protocol": "jsonrpc"
    },

    "transparency": {
      "economicRelationship": "none",
      "rankingDisclosure": {
        "primaryFactors": ["editorial-judgment", "certification-level", "narrative-density"],
        "includesUncertified": true
      }
    }
  }
}
```

---

## Portfolio Curator

A curated collection with booking relationships:

```json
{
  "agentCard": {
    "name": "Great British Hotels",
    "description": "Curated collection of independent British hotels",
    "endpoint": "https://greatbritishhotels.co.uk/api/agent",
    "skills": ["recommend", "answer", "book"]
  },
  "curator": {
    "schemaVersion": "0.2.0",
    "type": "curator:portfolio",

    "identity": {
      "id": "great-british-hotels",
      "name": "Great British Hotels",
      "established": 2015,
      "jurisdiction": "United Kingdom"
    },

    "coverage": {
      "totalVenues": 156,
      "certified": 156,
      "withStories": 89,
      "categories": ["stay"],
      "bounds": { "type": "geographic", "country": "GB" },
      "narrativeDensity": 0.57
    },

    "transparency": {
      "economicRelationship": "partner",
      "venueRelationshipTypes": ["member"],
      "disclosureStatement": "All listed hotels are members who pay an annual fee. Rankings are based on guest feedback and editorial assessment.",
      "rankingDisclosure": {
        "primaryFactors": ["guest-rating", "editorial-judgment"],
        "includesUncertified": false
      }
    }
  }
}
```

---

## Story

A venue interview capturing local knowledge:

```json
{
  "story": {
    "id": "the-roste-interview-2026",
    "type": "venue-interview",
    "created": "2026-01-20T00:00:00Z",

    "about": {
      "venueId": "the-roste-burnton",
      "venueName": "The Roste",
      "venueType": "hotel",
      "venueEndpoint": "https://theroste.co.uk/.well-known/agent.json"
    },

    "createdBy": {
      "curatorId": "visit-eastshire",
      "curatorName": "Visit Eastshire",
      "curatorEndpoint": "https://visiteastshire.co.uk/.well-known/agent.json"
    },

    "content": {
      "headline": "The pub that became a destination",
      "summary": "How a market-town coaching inn evolved into one of Eastshire's most sought-after hotels.",
      "quotes": [
        {
          "text": "We're not trying to be fancy. We're trying to be the best version of what a market-town hotel should be.",
          "attribution": "Sarah Chen",
          "role": "General Manager"
        },
        {
          "text": "The breakfast room used to be the stables. You can still see the original beams.",
          "attribution": "Tom Wright",
          "role": "Head Chef"
        }
      ],
      "localContext": "Burnton Market has traded on Thursdays since 1286. The Roste's position overlooking the square means guests wake to the sound of stallholders setting up.",
      "bestFor": ["couples", "foodies", "history-lovers"],
      "insiderTip": "Ask for a room overlooking the square on Thursday night—the market setup at dawn is worth the early wake-up."
    },

    "editorialWeight": {
      "depth": "comprehensive",
      "confidence": "high",
      "basis": "ongoing-relationship"
    }
  }
}
```

---

## Certification on Venue

How Curator verification appears on a venue's record:

```json
{
  "venue": {
    "id": "the-roste-burnton",
    "name": "The Roste",

    "evidence": {
      "dmoCertified": {
        "claim": "Certified by Visit Eastshire",
        "confidence": 0.95,
        "convergence": "strong",
        "sources": [{
          "type": "curator_certification",
          "sourceRef": "https://visiteastshire.co.uk/.well-known/agent.json",
          "curatorId": "visit-eastshire",
          "certificationLevel": "verified",
          "editorialBadges": ["editors-choice"],
          "certifiedAt": "2026-01-20T00:00:00Z",
          "storyUrl": "https://visiteastshire.co.uk/stories/the-roste"
        }]
      }
    }
  }
}
```

---

## Recommendation Request

An agent querying a Curator:

```json
{
  "method": "recommend",
  "params": {
    "intent": "romantic weekend with good food",
    "region": "Eastshire",
    "party": {
      "adults": 2
    },
    "constraints": {
      "dates": { "checkIn": "2026-03-14", "checkOut": "2026-03-16" },
      "budget": { "max": 300, "currency": "GBP", "per": "night" }
    },
    "preferences": {
      "vibe": ["intimate", "characterful"],
      "mustHave": ["restaurant-on-site"]
    }
  }
}
```

### Response

```json
{
  "recommendations": [
    {
      "venue": {
        "id": "the-roste-burnton",
        "name": "The Roste",
        "endpoint": "https://theroste.co.uk/.well-known/agent.json"
      },
      "reason": "Editors' choice for romantic stays. The market-square setting and acclaimed restaurant make it ideal for a food-focused weekend.",
      "certificationLevel": "verified",
      "editorialBadges": ["editors-choice"],
      "storyUrl": "https://visiteastshire.co.uk/stories/the-roste",
      "fit": {
        "matches": ["romantic", "foodie", "characterful"],
        "caveats": ["Market noise on Thursday mornings"]
      }
    }
  ],
  "curatorContext": {
    "id": "visit-eastshire",
    "totalInRegion": 234,
    "matchingCriteria": 12
  }
}
```

> **Tip:** Agents should cite the Curator and story when presenting recommendations: "Visit Eastshire recommends The Roste, noting its position overlooking the historic market square."

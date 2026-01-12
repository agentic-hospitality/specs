# Curator: Authority Extension for A2A Agent Cards

**Version:** 0.2.0 (Draft)  
**Namespace URI:** `https://agentic-hospitality.org/curator/v1`  
**Status:** Draft Specification  
**License:** MIT  

---

## Abstract

Curator is a namespace extension to the [A2A Protocol](https://a2a-protocol.org) Agent Card that defines how regional authorities, brand groups, and editorial curators express their collections, stories, and verification capabilities to AI agents.

While Venue defines what individual venues say about themselves, Curator defines what **authorities say about collections of venues** — enabling AI agents to query trusted sources for recommendations, access verified narratives, and understand regional or thematic context.

**Core Insight:** Trust is not asserted. It emerges from structure, incentives, and evidence.

**Design Principle:** The destination doesn't describe itself. Its people do. Curator enables the chorus, not the narrator.

---

## 1. Introduction

### 1.1 The Problem

AI agents making hospitality recommendations face a challenge: individual venue claims (even well-structured Venue data) lack regional context and third-party validation.

Questions agents struggle to answer:
- "Where should I stay in Norfolk?" (requires regional knowledge)
- "Is this hotel actually good?" (requires third-party verification)
- "What's special about this area?" (requires local narrative)

### 1.2 The Solution

Curator provides a structured way for authorities to:
1. **Curate** — maintain collections of verified venues
2. **Narrate** — tell stories that reveal place through people
3. **Verify** — certify venue claims with regional authority
4. **Answer** — respond to agent queries about their domain

### 1.3 Epistemic Separation Principle

Curator is built on a foundational principle of **epistemic separation** — each actor in the system speaks only to what they can credibly claim:

| Spec | Who speaks | What they claim | Epistemic basis |
|------|------------|-----------------|-----------------|
| **Venue** | The venue | "This is who I am" | Self-knowledge |
| **Curator** | The authority | "This is what I know about them" | Third-party observation |
| **Booking Terms** | The transaction layer | "This is what's available" | Real-time inventory |

Future extensions SHOULD maintain this separation. Actors SHOULD NOT make claims outside their epistemic basis.

### 1.4 Relationship to Venue

Curator and Venue create a **mutual validation loop**:
- Venues validate Curators (comprehensive coverage proves authority)
- Curators validate venues (certification + stories provide evidence)

This creates natural resistance to spam, SEO farms, and fake authorities. See Section 15: Threat Model.

---

## 2. Curator Types

Curator is the base type. Specific subtypes inherit from it:

```
Curator (base)
    ├── Curator:DMO        (regional destination authority)
    ├── Curator:Portfolio      (curated collection: Cottages.com, Great British Hotels)
    └── Curator:Editorial  (guides, critics, curated lists)
```

### 2.1 Curator:DMO

Regional destination marketing organisations with geographic authority.

**Characteristics:**
- Geographic bounds define scope
- Official/governmental recognition
- Membership-based venue relationships
- Local knowledge and context
- Comprehensive coverage expected

### 2.2 Curator:Portfolio

Curated collections of venues with booking relationships.

**Characteristics:**
- Collection identity defines scope
- Booking or membership relationships with venues
- May have quality or style criteria
- Central booking/reservation systems
- **Economic incentives require transparency** (see Section 4.3)

**Examples:** Cottages.com, Great British Hotels, Unmissable England

### 2.3 Curator:Editorial

Guides, critics, awards, and curated recommendations.

**Characteristics:**
- Editorial criteria define scope
- Selection-based (not comprehensive)
- Reputation-based authority
- May include ratings/rankings
- Editorial judgment is the value

---

## 3. Schema Structure

A Curator extension lives within an A2A Agent Card:

```json
{
  "agentCard": {
    "name": "string",
    "description": "string", 
    "endpoint": "url",
    "skills": ["recommend", "answer", "narrate", "verify"]
  },
  "curator": {
    "schemaVersion": "0.2.0",
    "type": "curator:dmo | curator:brand | curator:editorial",
    "identity": { },
    "coverage": { },
    "stories": { },
    "verification": { },
    "actions": { },
    "evidence": { },
    "transparency": { }
  }
}
```

---

## 4. Identity Block

Establishes who the Curator is and their basis for authority.

```json
"identity": {
  "id": "string (unique identifier)",
  "name": "string",
  "type": "dmo | brand | editorial",
  "established": "year",
  "jurisdiction": "string (geographic or thematic scope)",
  "description": "string",
  "website": "url",
  "logo": "url"
}
```

### 4.1 DMO Identity Example

```json
"identity": {
  "id": "visit-norfolk",
  "name": "Visit Norfolk",
  "type": "dmo",
  "established": "1972",
  "jurisdiction": "Norfolk, United Kingdom",
  "description": "Official destination marketing organisation for Norfolk",
  "website": "https://visitnorfolk.co.uk"
}
```

### 4.2 Editorial Identity Example

```json
"identity": {
  "id": "good-hotel-guide",
  "name": "The Good Hotel Guide",
  "type": "editorial",
  "established": "1978",
  "jurisdiction": "United Kingdom and Ireland",
  "description": "Independent hotel reviews based on reader reports and anonymous inspections",
  "website": "https://goodhotelguide.com"
}
```

### 4.3 Portfolio Identity Example (with required transparency)

```json
"identity": {
  "id": "marriott-international",
  "name": "Marriott International",
  "type": "brand",
  "established": "1927",
  "jurisdiction": "Global hospitality brand",
  "description": "World's largest hotel company"
},
"transparency": {
  "economicRelationship": "owner",
  "venueRelationshipTypes": ["owned", "franchised", "managed"],
  "disclosureStatement": "All listed properties are owned, franchised, or managed by Marriott International"
}
```

**Portfolio Curator Requirement:** Curators of type `brand` MUST include a `transparency` block disclosing their economic relationship with listed venues. See Section 11.

---

## 5. Coverage Block

Defines what the Curator knows about — their collection.

```json
"coverage": {
  "totalVenues": "number",
  "certified": "number",
  "withStories": "number",
  "categories": ["stay", "eat", "drink", "experience"],
  "bounds": {
    "type": "geographic | thematic | brand",
    "geo": "GeoJSON (if geographic)",
    "theme": "string (if thematic)",
    "brands": ["array (if brand)"]
  },
  "lastUpdated": "ISO 8601 date",
  "narrativeDensity": "number (computed: withStories / certified)"
}
```

### 5.1 Coverage Quality Signals

The relationship between `totalVenues`, `certified`, and `withStories` signals Curator quality:

| Ratio | Signal |
|-------|--------|
| High certified/total | Active verification programme |
| High withStories/certified | Deep engagement, rich narratives |
| Low certified/total | Passive registry, less trustworthy |

### 5.2 Narrative Density

**Narrative Density** is a key quality metric:

```
narrativeDensity = withStories / certified
```

Agents SHOULD use Narrative Density as:
- A ranking prior when choosing between Curators
- A trust amplifier for recommendations
- A signal of editorial investment

A Curator with 847 certified venues and 234 stories (density: 0.28) demonstrates deeper engagement than one with 1000 certified and 12 stories (density: 0.012).

### 5.3 Comparing Curators

Agents SHOULD compare coverage metrics *between* Curators, not just read them in isolation:

```
When choosing between DMOs for overlapping region:
  - Compare narrativeDensity
  - Compare certified/totalVenues ratio
  - Consider recency of lastUpdated
```

---

## 6. Stories Block

Stories are the Curator's primary value creation. They transform venues from data points into places with meaning.

```json
"stories": {
  "endpoint": "url",
  "count": "number",
  "types": ["venue-interview", "local-guide", "seasonal", "hidden-gem", "insider-tip"],
  "format": "structured | narrative | mixed",
  "languages": ["en", "de", "fr"]
}
```

### 6.1 Story Object Schema

Individual stories follow this structure:

```json
{
  "story": {
    "id": "string",
    "type": "venue-interview | local-guide | seasonal | hidden-gem | insider-tip",
    "created": "ISO 8601 date",
    "updated": "ISO 8601 date",
    
    "about": {
      "venueId": "string (Venue ID)",
      "venueName": "string",
      "venueType": "hotel | restaurant | bar | experience",
      "venueEndpoint": "url (venue's agent.json)"
    },
    
    "createdBy": {
      "curatorId": "string",
      "curatorName": "string",
      "curatorEndpoint": "url (curator's agent.json)"
    },
    
    "content": {
      "headline": "string",
      "summary": "string (2-3 sentences)",
      "narrative": "string (full story)",
      "quotes": [
        {
          "text": "string",
          "attribution": "string",
          "role": "string"
        }
      ],
      "localContext": "string (why this place matters here)",
      "bestFor": ["couples", "families", "solo", "business"],
      "insiderTip": "string"
    },
    
    "media": {
      "heroImage": "url",
      "gallery": ["url"],
      "video": "url"
    },
    
    "editorialWeight": {
      "depth": "brief | standard | comprehensive",
      "confidence": "low | medium | high",
      "basis": "single-visit | ongoing-relationship | reader-reports"
    }
  }
}
```

### 6.2 Editorial Weight

Stories MAY include an `editorialWeight` block to help agents distinguish:

| Depth | Meaning |
|-------|---------|
| `brief` | Quick mention, limited engagement |
| `standard` | Full interview or review |
| `comprehensive` | Deep, ongoing relationship |

| Confidence | Meaning |
|------------|---------|
| `low` | Single data point, limited verification |
| `medium` | Multiple sources, reasonable confidence |
| `high` | Extensive engagement, high confidence |

| Basis | Meaning |
|-------|---------|
| `single-visit` | One-time inspection/interview |
| `ongoing-relationship` | Repeated engagement over time |
| `reader-reports` | Aggregated third-party feedback |

### 6.3 Story as Evidence

Stories create bidirectional evidence:

**On the venue's Venue:**
```json
"evidence": {
  "thirdParty": [
    {
      "type": "curator-story",
      "curatorId": "visit-norfolk",
      "storyId": "the-hoste-interview-2025",
      "storyUrl": "https://visitnorfolk.co.uk/stories/the-hoste",
      "created": "2025-11-15"
    }
  ]
}
```

**On the Curator's collection:**
```json
"stories": {
  "about": [
    {
      "venueId": "the-hoste-burnham-market",
      "storyId": "the-hoste-interview-2025"
    }
  ]
}
```

### 6.4 The Chorus Principle

> "The destination doesn't describe itself. Its people do. The Curator's job is to listen and amplify."

Stories SHOULD:
- Feature venue voices, not Curator marketing copy
- Reveal specifics that only locals know
- Connect venues to place (why THIS venue in THIS location)
- Surface hidden gems alongside established names

**Anti-pattern:** Generic descriptions ("lovely hotel, friendly staff") add no value. Agents will learn to ignore low-quality Curator stories.

---

## 7. Verification Block (Revised)

Verification is now split into **procedural certification** and **editorial badges** to avoid conflating objective verification with editorial judgment.

```json
"verification": {
  "certificationLevels": [
    {
      "level": "string",
      "description": "string",
      "requirements": ["string"],
      "procedural": true
    }
  ],
  "editorialBadges": [
    {
      "badge": "string",
      "description": "string",
      "requiresStory": true,
      "editorial": true
    }
  ],
  "canCertify": ["venue:hotel", "venue:restaurant", "venue:bar", "venue:experience"],
  "certificationCriteria": "url (public criteria document)",
  "lastAudit": "ISO 8601 date",
  "auditFrequency": "annual | biannual | continuous"
}
```

### 7.1 Certification Levels (Procedural)

Certification levels represent **objective, procedural verification**:

```json
"certificationLevels": [
  {
    "level": "member",
    "description": "Verified business in our region",
    "requirements": ["active-business", "location-verified"],
    "procedural": true
  },
  {
    "level": "certified",
    "description": "Quality-assured venue meeting our standards",
    "requirements": ["member", "quality-assessment", "site-visit"],
    "procedural": true
  }
]
```

These answer: "Does this venue exist and meet objective criteria?"

### 7.2 Editorial Badges

Editorial badges represent **subjective editorial judgment**:

```json
"editorialBadges": [
  {
    "badge": "featured",
    "description": "Editor's choice with published story",
    "requiresStory": true,
    "editorial": true
  },
  {
    "badge": "hidden-gem",
    "description": "Lesser-known discovery worth seeking out",
    "requiresStory": true,
    "editorial": true
  },
  {
    "badge": "editors-choice",
    "description": "Top recommendation in category",
    "requiresStory": true,
    "editorial": true
  }
]
```

These answer: "Does the Curator think this venue is special?"

### 7.3 Certification on Venue Venue (Revised)

When a Curator certifies a venue, the venue's Venue includes:

```json
"verification": {
  "certifications": [
    {
      "curatorId": "visit-norfolk",
      "curatorName": "Visit Norfolk",
      "curatorEndpoint": "https://visitnorfolk.co.uk/.well-known/agent.json",
      "certificationLevel": "certified",
      "editorialBadges": ["featured", "hidden-gem"],
      "certified": "2025-11-15",
      "expires": "2026-11-15",
      "storyUrl": "https://visitnorfolk.co.uk/stories/the-hoste"
    }
  ]
}
```

Now agents can distinguish:
- "Visit Norfolk verified this exists" (`certificationLevel: certified`)
- "Visit Norfolk thinks this is special" (`editorialBadges: ["featured"]`)

### 7.4 Mutual Validation

The certification creates a two-way trust relationship:

| Direction | Mechanism |
|-----------|-----------|
| Curator → Venue | Certification level, editorial badges, story |
| Venue → Curator | Existence in collection, coverage completeness |

A Curator's authority is validated by the comprehensiveness and quality of their collection.

---

## 8. Actions Block (with Ranking Disclosure)

Defines what agents can ask the Curator to do.

```json
"actions": {
  "ask": {
    "endpoint": "/ask",
    "method": "POST",
    "description": "Natural language query about the Curator's domain",
    "accepts": ["where-to-stay", "where-to-eat", "what-to-do", "itinerary", "comparison"],
    "returns": "recommendation[]"
  },
  
  "getStory": {
    "endpoint": "/stories/{venue_id}",
    "method": "GET",
    "description": "Retrieve story for a specific venue",
    "returns": "story"
  },
  
  "listVenues": {
    "endpoint": "/venues",
    "method": "GET",
    "description": "List venues with optional filters",
    "filters": ["category", "vibe", "location", "certification-level", "has-story"],
    "returns": "venue[]"
  },
  
  "verify": {
    "endpoint": "/verify/{venue_id}",
    "method": "GET",
    "description": "Check certification status of a venue",
    "returns": "certification"
  },
  
  "recommend": {
    "endpoint": "/recommend",
    "method": "POST",
    "description": "Get structured recommendations based on criteria",
    "accepts": {
      "intent": "string",
      "party": "object",
      "constraints": "object",
      "preferences": "object"
    },
    "returns": "recommendation[]",
    "rankingDisclosure": { }
  }
}
```

### 8.1 Ranking Disclosure (Required)

Curators MUST disclose how recommendations are ranked:

```json
"rankingDisclosure": {
  "primaryFactors": ["editorial-judgment", "certification-level", "narrative-density"],
  "secondaryFactors": ["recency", "availability"],
  "includesUncertified": false,
  "diversityPolicy": "category-balanced | best-match-only | geographic-spread",
  "methodology": "url (optional link to detailed methodology)"
}
```

| Factor | Meaning |
|--------|---------|
| `editorial-judgment` | Staff picks, subjective quality |
| `certification-level` | Higher certification = higher rank |
| `narrative-density` | Venues with stories ranked higher |
| `popularity` | Booking volume, review counts |
| `availability` | Currently bookable venues prioritised |
| `recency` | Recently updated venues prioritised |

This helps agents reason about potential bias without forcing implementation details.

### 8.2 DMO-Specific Rule

DMOs SHOULD include uncertified member venues in comprehensive listings to fulfil their regional mandate:

```json
"rankingDisclosure": {
  "includesUncertified": true,
  "uncertifiedDisclosure": "Member venues without full certification are included but ranked lower"
}
```

---

## 9. Evidence Block

Establishes the Curator's own credibility.

```json
"evidence": {
  "authority": {
    "type": "official | industry | editorial | community",
    "recognisedBy": ["VisitEngland", "UK Government", "ETOA"],
    "memberOf": ["European DMO Alliance", "Destination International"],
    "accreditations": ["DMMO Accredited", "Green Tourism Partner"]
  },
  
  "trackRecord": {
    "established": "1972",
    "venuesServed": 847,
    "storiesPublished": 234,
    "lastUpdated": "2025-01-04"
  },
  
  "transparency": {
    "certificationCriteria": "url",
    "membershipTerms": "url",
    "editorialPolicy": "url",
    "rankingMethodology": "url"
  }
}
```

---

## 10. Transparency Block (Required for Portfolio Curators)

All Curators SHOULD include transparency information. Portfolio Curators MUST include it.

```json
"transparency": {
  "economicRelationship": "none | sponsor | partner | owner",
  "venueRelationshipTypes": ["owned", "franchised", "managed", "affiliated", "independent"],
  "disclosureStatement": "string (human-readable disclosure)",
  "conflictOfInterestPolicy": "url"
}
```

### 10.1 Economic Relationship Types

| Type | Meaning | Required for |
|------|---------|--------------|
| `none` | No economic relationship with venues | DMO, Editorial |
| `sponsor` | Venues pay for inclusion/prominence | Editorial (if applicable) |
| `partner` | Commercial partnership | Any |
| `owner` | Curator owns/operates venues | Portfolio (required) |

### 10.2 Venue Relationship Types (Portfolio Curators)

Portfolio Curators MUST specify the relationship type for each venue:

```json
"venueRelationship": {
  "venueId": "marriott-norwich",
  "relationship": "franchised",
  "since": "2019"
}
```

| Relationship | Meaning |
|--------------|---------|
| `owned` | Curator directly owns venue |
| `franchised` | Venue operates under Curator's brand |
| `managed` | Curator manages but doesn't own |
| `affiliated` | Looser brand affiliation |
| `independent` | No ownership relationship |

---

## 11. Distribution

Curators can expose their capabilities through multiple channels:

```json
"distribution": {
  "agentCard": "/.well-known/agent.json",
  "mcp": {
    "enabled": true,
    "endpoint": "/mcp"
  },
  "api": {
    "enabled": true,
    "endpoint": "/api/v1",
    "documentation": "/api/docs"
  },
  "integrations": {
    "chatgpt": "https://chat.openai.com/g/g-xxx",
    "claude": "https://claude.ai/project/xxx"
  }
}
```

All distribution channels serve the same underlying data. The Curator's identity and stories remain the source of truth.

---

## 12. Agent Behaviour

How AI agents should use Curator data:

### 12.1 Discovery

```
Agent receives: "Where should I stay in Norfolk?"

1. Identify region → Norfolk, UK
2. Find Curator(s) → Visit Norfolk, Good Hotel Guide (via registry or .well-known)
3. Evaluate Curator credibility:
   - Type: DMO (official) vs Editorial (independent)
   - Coverage: certified count, narrative density
   - Authority: recognitions, track record
4. Compare Curators if multiple available
5. Query chosen Curator → POST /recommend with user criteria
6. Receive recommendations with stories + certification
7. Present to human with Curator context as evidence
```

### 12.2 Verification

```
Agent evaluating venue: The Hoste

1. Read venue Venue
2. Check verification block → certified by visit-norfolk
3. Parse: certificationLevel (procedural) vs editorialBadges (subjective)
4. Fetch Curator → Visit Norfolk
5. Validate Curator credibility
6. Fetch story → /stories/the-hoste
7. Use story + editorial weight as third-party evidence
```

### 12.3 Trust Hierarchy

When multiple sources conflict, agents SHOULD apply this hierarchy:

| Priority | Source | Reason |
|----------|--------|--------|
| 1 | Official DMO | Geographic authority, accountability |
| 2 | Industry body | Standards-based verification |
| 3 | Editorial | Reputation-based credibility |
| 4 | Portfolio Curator | Self-interest requires scrutiny |
| 5 | Venue self-claim | Primary source but unverified |

### 12.4 Curator Conflict Resolution

When two Curators provide conflicting information about the same venue or region:

**Tiebreak rules (in order):**

1. **Geographic containment:** Curator whose jurisdiction more precisely contains the venue wins
2. **Recency:** More recently verified information wins
3. **Coverage density:** Curator with higher `certified / totalVenues` ratio in the relevant area wins
4. **Narrative density:** Curator with higher `withStories / certified` ratio wins
5. **Authority type:** Apply trust hierarchy (12.3)

**Example:**
```
Venue: The Hoste, Burnham Market, Norfolk

Curator A: Visit Norfolk (DMO, jurisdiction: Norfolk)
Curator B: Visit England (DMO, jurisdiction: England)

→ Visit Norfolk wins on geographic containment
```

**Example:**
```
Venue: The Hoste, Burnham Market, Norfolk

Curator A: Visit Norfolk (DMO, certified 2024-06-01)
Curator B: Good Hotel Guide (Editorial, certified 2025-01-15)

→ Good Hotel Guide wins on recency
→ But agents SHOULD present both, noting the DMO verification + editorial endorsement
```

---

## 13. Relationship to Other Specs

```
┌─────────────────────────────────────────────────┐
│                   A2A Protocol                  │
│            (Agent ↔ Agent communication)        │
└─────────────────────────────────────────────────┘
                        │
        ┌───────────────┼───────────────┐
        ▼               ▼               ▼
   ┌─────────┐    ┌──────────┐    ┌─────────┐
   │  Venue   │◄──►│  Curator │    │  Booking Terms  │
   │(venue)  │    │(authority)│   │(booking)│
   └─────────┘    └──────────┘    └─────────┘
        │               │               │
        └───────────────┴───────────────┘
                        │
                        ▼
              ┌──────────────────┐
              │   Booking Flow   │
              │ (Booking Terms handles)  │
              └──────────────────┘
```

### 13.1 Venue ↔ Curator

- Curator certifies Venue (adds verification evidence)
- Curator creates stories about Venue venues
- Venue references Curator certifications
- Bidirectional links create trust web

### 13.2 Curator ↔ Booking Terms

- Curator recommends venues
- Booking Terms handles booking transaction
- Curator may aggregate availability across venues
- Booking confirmation may reference Curator source

---

## 14. Implementation Notes

### 14.1 Hosting

Curators SHOULD host their Agent Card at:
```
https://{domain}/.well-known/agent.json
```

### 14.2 Updates

- Stories: Update when new content published
- Coverage: Update daily or when certifications change
- Verification: Update when certification criteria change

### 14.3 Caching

Agents MAY cache Curator data with these TTLs:
- Identity: 7 days
- Coverage: 1 day
- Stories: 1 hour (check for updates)
- Verification status: 1 day

---

## 15. Threat Model

How Curator resists spam, SEO farms, and fake authorities.

### 15.1 Threat: Fake DMOs

**Attack:** Create a "Visit Norfolk" clone to capture agent traffic.

**Defences:**
- `evidence.authority.recognisedBy` requires verifiable third-party recognition
- Agents SHOULD verify recognition claims against authoritative registries
- Coverage metrics expose thin operations (low certified/total ratio)
- Official DMOs can register in public directories

### 15.2 Threat: SEO Farm Curators

**Attack:** Create "Best Hotels in Norfolk" editorial Curator, stuff with affiliate links.

**Defences:**
- Narrative Density exposes thin content (many "certified", few stories)
- `transparency.economicRelationship` requires disclosure
- Stories require structured content, not just links
- Agent trust hierarchy places editorial below official DMOs
- Track record (`established`, `storiesPublished`) rewards longevity

### 15.3 Threat: Portfolio Curator Gaming

**Attack:** Portfolio Curator ranks own properties above competitors.

**Defences:**
- `transparency.economicRelationship: owner` is mandatory disclosure
- Agent trust hierarchy places Portfolio below DMO/Editorial
- Agents can weight Portfolio recommendations lower by default
- `rankingDisclosure` exposes methodology

### 15.4 Threat: Certification Mills

**Attack:** Curator certifies anyone who pays, devaluing certification.

**Defences:**
- `certification/total` ratio exposes non-selective Curators
- `withStories/certified` ratio exposes shallow engagement
- Public `certificationCriteria` allows scrutiny
- Stories require actual content creation (expensive to fake at scale)

### 15.5 Threat: Story Spam

**Attack:** Generate low-quality AI stories at scale to inflate Narrative Density.

**Defences:**
- `editorialWeight.basis` distinguishes visit-based from generated
- `editorialWeight.confidence` signals reliability
- Quotes with attribution are harder to fabricate credibly
- Agents can learn to detect low-quality story patterns
- Reputation damage from exposure

### 15.6 Threat: Stale Data

**Attack:** Curator stops maintaining data but remains indexed.

**Defences:**
- `coverage.lastUpdated` signals freshness
- `verification.lastAudit` shows active maintenance
- Agents SHOULD penalise stale Curators
- Stories have `updated` timestamps

### 15.7 Summary: Trust Emergence

Curator doesn't try to prevent bad actors through access control. Instead, it creates **structural conditions where trust emerges from behaviour**:

- Comprehensive coverage requires real work
- Stories require genuine engagement
- Transparency exposes conflicts
- Metrics enable comparison
- Longevity rewards consistency

> "You can buy membership. You can't buy a good story."

---

## 16. Appendices

### Appendix A: Story Types

| Type | Description | Use |
|------|-------------|-----|
| `venue-interview` | Conversation with venue owner/staff | Primary value — the chorus |
| `local-guide` | Area/neighbourhood overview | Context for multiple venues |
| `seasonal` | Time-specific recommendations | "Christmas in Norfolk" |
| `hidden-gem` | Lesser-known discovery | Surfacing small venues |
| `insider-tip` | Specific local knowledge | "Best table", "secret menu" |

### Appendix B: Certification Levels (Suggested)

Suggested standard levels (Curators may customise):

| Level | Type | Meaning | Requirements |
|-------|------|---------|--------------|
| `listed` | Procedural | Appears in directory | Basic verification |
| `member` | Procedural | Paid/registered member | Active relationship |
| `certified` | Procedural | Quality verified | Met standards |

### Appendix C: Editorial Badges (Suggested)

| Badge | Meaning | Requires Story |
|-------|---------|----------------|
| `featured` | Editor's choice | Yes |
| `hidden-gem` | Lesser-known discovery | Yes |
| `editors-choice` | Top in category | Yes |
| `rising` | New and promising | No |

### Appendix D: Query Types

Standard query intents for `ask` action:

- `where-to-stay` — Accommodation recommendations
- `where-to-eat` — Restaurant/dining recommendations  
- `what-to-do` — Activities and experiences
- `itinerary` — Multi-day trip planning
- `comparison` — Compare specific venues
- `availability` — Check what's open/bookable
- `hidden-gem` — Off-the-beaten-path suggestions

---

## Changelog

### v0.2.0 (Draft)
- Split verification into procedural certification + editorial badges
- Added Editorial Weight to stories
- Added Transparency block (required for Portfolio Curators)
- Added Ranking Disclosure requirement
- Added Curator Conflict Resolution rules
- Added Narrative Density as named metric
- Added comprehensive Threat Model
- Introduced Epistemic Separation Principle
- Added Portfolio Curator venue relationship disclosure

### v0.1.0 (Draft)
- Initial specification

---

## Authors

Selfe — https://selfe.ai

## License

MIT License

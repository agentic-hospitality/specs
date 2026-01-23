---
title: Curator Trust
description: The discovery and trust layer—DMOs, portfolios, and editorial authorities that verify venue claims and provide regional context for agents.
order: 5
---

# Curator Trust

The discovery and trust layer for agentic booking.

---

## What is Curator?

**Curator** defines how authorities express their knowledge about collections of venues. Where Venue defines what venues say about themselves, Curator defines what **authorities say about them**.

```
Venue      →  "This is who I am" (venue self-knowledge)
Curator    →  "This is what I know about them" (third-party observation)
```

Individual venue claims lack regional context and third-party validation. Curators provide this context.

::callout{type="info"}
Curator is a namespace extension to A2A Agent Cards. Curators are agents that can answer questions, recommend venues, and verify claims.
::

---

## Curator Types

```
Curator (base)
├── Curator:DMO        Regional destination authority
├── Curator:Portfolio  Curated collection
└── Curator:Editorial  Critics, guides, awards
```

| Type | Examples | Authority basis |
|------|----------|-----------------|
| **DMO** | Visit Norfolk, Visit Cornwall | Geographic scope, official recognition |
| **Portfolio** | Cottages.com, Great British Hotels | Curated selection, booking relationships |
| **Editorial** | Michelin, AA Rosettes, Good Food Guide | Reputation, editorial judgment |

---

## Core Concepts

::card-group{cols="3"}
  ::card{title="Stories" to="/reference/curator/spec#3-stories" icon="book-open"}
  Narratives that reveal place through people. Not marketing copy—real voices, specific details.
  ::
  ::card{title="Verification" to="/reference/curator/spec#4-verification" icon="badge-check"}
  Certification levels and editorial badges that create evidence for venue claims.
  ::
  ::card{title="Coverage" to="/reference/curator/spec#2-coverage" icon="map"}
  What the Curator knows about—venue counts, geographic bounds, narrative density.
  ::
::

::card-group{cols="2"}
  ::card{title="Actions" to="/reference/curator/spec#5-actions" icon="settings"}
  What agents can ask: recommend, answer, getStory, listVenues, verify.
  ::
  ::card{title="Transparency" to="/reference/curator/spec#6-transparency" icon="eye"}
  Required disclosure of economic relationships and ranking methodology.
  ::
::

---

## The Chorus Principle

> "The destination doesn't describe itself. Its people do. The Curator's job is to listen and amplify."

Stories create evidence that venues can't create for themselves:

```json
{
  "story": {
    "type": "venue-interview",
    "about": { "venueId": "white-lion-blakeney", "venueName": "The White Lion" },
    "content": {
      "headline": "Where the sailors drink",
      "quotes": [{
        "text": "The harbour's been here longer than the building. We're just caretakers.",
        "attribution": "James Morton",
        "role": "Publican"
      }],
      "insiderTip": "The crab comes off the boat at 6am. Be at breakfast by 8 if you want it."
    }
  }
}
```

---

## The Curator Index

Agents need to discover which Curators exist. The **Curator Index** is the discovery layer above individual Curators.

::callout{type="warning"}
The specs define what Curators publish. They do not define who operates the index.
::

However, the index layer SHOULD be:

| Principle | Why |
|-----------|-----|
| **Open** | Queryable by any agent without gatekeeping |
| **Plural** | Multiple indexes can exist and compete |
| **Transparent** | Index operators publish inclusion criteria |
| **Accountable** | Index operators are subject to the same principles as Curators |

Whoever operates an index has power over discovery. That power should be legible, contestable, and distributed.

---

## Mutual Validation

Curators and venues validate each other:

```
Venue validates Curator:
  847 venues certified by Visit Norfolk
  → "This DMO has comprehensive coverage"

Curator validates Venue:
  Visit Norfolk certified The White Lion
  → Evidence on the venue's record
  → Third-party credibility
```

This creates natural resistance to spam and fake authorities.

---

## Learn More

::card-group{cols="3"}
  ::card{title="Specification" to="/reference/curator/spec" icon="file-code"}
  Full technical specification with schema definitions.
  ::
  ::card{title="Examples" to="/reference/curator/examples" icon="code"}
  Working JSON examples for Curator Agent Cards and stories.
  ::
  ::card{title="Principles" to="/reference/curator/principles" icon="scale"}
  Public commitments on power, accountability, and disputes.
  ::
::

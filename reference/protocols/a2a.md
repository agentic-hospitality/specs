---
title: Agent-to-Agent Protocol (A2A)
description: How Agentic Booking uses Google's A2A protocol—agent cards, skills, authentication, and namespace extensions for hospitality.
order: 1
---

# Agent-to-Agent Protocol (A2A)

How Agentic Booking uses Google's Agent-to-Agent protocol.

---

## What is A2A?

[A2A](https://google.github.io/A2A/) (Agent-to-Agent) is Google's open protocol for agent interoperability. It defines how AI agents discover each other, negotiate capabilities, and communicate.

::card-group{cols="2"}
  ::card{title="Agent Cards" icon="ph:identification-card"}
  JSON documents describing what an agent can do, published at `/.well-known/agent.json`.
  ::
  ::card{title="Skills" icon="ph:lightning"}
  Declared capabilities like `recommend`, `book`, `verify`, `answer`.
  ::
  ::card{title="Message Format" icon="ph:chat-circle-text"}
  Standardised request/response patterns for agent communication.
  ::
  ::card{title="Discovery" icon="ph:magnifying-glass"}
  Well-known endpoints for finding and validating agents.
  ::
::

---

## Agent Cards in Agentic Booking

Both Venues and Curators publish A2A Agent Cards:

### Venue Agent Card

```json
{
  "agentCard": {
    "name": "The Roste",
    "description": "Historic coaching inn in Burnton Market",
    "endpoint": "https://theroste.co.uk/api/agent",
    "skills": ["check-availability", "get-rates", "book", "modify", "cancel"]
  },
  "venue": {
    "schemaVersion": "0.1.0",
    "type": "hotel",
    "identity": {...},
    "vibe": {...},
    "units": [...]
  }
}
```

### Curator Agent Card

```json
{
  "agentCard": {
    "name": "Visit Eastshire",
    "description": "Official tourism authority for Eastshire",
    "endpoint": "https://visiteastshire.co.uk/api/agent",
    "skills": ["recommend", "answer", "getStory", "listVenues", "verify"]
  },
  "curator": {
    "schemaVersion": "0.2.0",
    "type": "curator:dmo",
    "coverage": {...},
    "stories": {...}
  }
}
```

---

## Discovery Flow

```
1. Agent receives: "Book a dog-friendly hotel in Eastshire"

2. Find Curator → fetch https://visiteastshire.co.uk/.well-known/agent.json

3. Query Curator → POST /recommend { intent: "dog-friendly", region: "Eastshire" }

4. Receive recommendations with venue endpoints

5. Fetch venue → https://theroste.co.uk/.well-known/agent.json

6. Check availability → POST /check-availability

7. Book → POST /book
```

---

## Skills

### Venue Skills

| Skill | Purpose |
|-------|---------|
| `check-availability` | Query dates/units for availability |
| `get-rates` | Get pricing for specific dates |
| `book` | Create a booking |
| `modify` | Change an existing booking |
| `cancel` | Cancel a booking |

### Curator Skills

| Skill | Purpose |
|-------|---------|
| `recommend` | Get venue recommendations based on intent |
| `answer` | Answer questions about the region/collection |
| `getStory` | Retrieve a specific story |
| `listVenues` | List venues matching criteria |
| `verify` | Check certification status |

---

## Message Format

A2A uses JSON-RPC style messages:

### Request

```json
{
  "method": "recommend",
  "params": {
    "intent": "romantic weekend with good food",
    "region": "Eastshire",
    "party": { "adults": 2 },
    "constraints": {
      "dates": { "checkIn": "2026-03-14", "checkOut": "2026-03-16" }
    }
  }
}
```

### Response

```json
{
  "result": {
    "recommendations": [
      {
        "venue": {
          "id": "the-roste-burnton",
          "name": "The Roste",
          "endpoint": "https://theroste.co.uk/.well-known/agent.json"
        },
        "reason": "Editors' choice for romantic stays",
        "storyUrl": "https://visiteastshire.co.uk/stories/the-roste"
      }
    ]
  }
}
```

---

## Well-Known Endpoints

| Endpoint | Purpose |
|----------|---------|
| `/.well-known/agent.json` | A2A Agent Card |
| `/.well-known/did.json` | DID document for identity |
| `/.well-known/ucp` | UCP profile (if using UCP) |

---

## Relationship to Other Protocols

```
A2A                    Agent discovery + communication
 │
 └── UCP               Commerce orchestration (optional)
      └── AP2          Payment authorization
```

A2A provides the agent layer. [UCP](/reference/protocols/ucp) provides commerce orchestration. They can be used together or independently.

---

## Resources

- [A2A Protocol](https://google.github.io/A2A/)
- [A2A GitHub](https://github.com/google/A2A)

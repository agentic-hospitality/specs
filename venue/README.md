# Venue

What a hospitality venue publishes to be understood by AI agents.

---

## What a Venue is

A Venue is a [Bookable](/bookable) specifically for hospitality. It inherits the base pattern (Identity, Evidence, Fit, Actions, Answers) and adds vocabulary specific to hotels, restaurants, and experiences.

```
Venue : Bookable
├── Vibe            What it feels like (not just what it has)
├── Attributes      Hospitality-specific characteristics
├── Units           Rooms, tables, each with their own fit
└── Neighbourhood   What's nearby and why it matters
```

---

## Publishing

Publish your Venue at `/.well-known/venue.json` (or integrate with your preferred protocol).

---

## Complete example

```json
{
  "schemaVersion": "0.1.0",
  "type": "venue:hotel",
  "extends": "bookable",
  
  "identity": {
    "name": "The White Lion",
    "legalName": "White Lion Inn Ltd",
    "location": {
      "address": "High Street, Blakeney, Norfolk NR25 7AL",
      "coordinates": [52.9412, 1.0274]
    },
    "domain": "whitelionblakeney.co.uk",
    "did": "did:web:whitelionblakeney.co.uk",
    "registration": {
      "jurisdiction": "GB",
      "companyNumber": "04567890"
    }
  },
  
  "vibe": {
    "essence": "Unpretentious coastal comfort",
    "character": ["relaxed", "dog-friendly", "seafood-focused", "traditional"],
    "atmosphere": {
      "energy": "calm",
      "formality": "casual",
      "crowd": "walkers, sailors, dog owners, families",
      "pace": "slow"
    }
  },
  
  "attributes": {
    "accommodation": {
      "totalRooms": 14,
      "roomTypes": ["double", "twin", "family"],
      "checkIn": "15:00",
      "checkOut": "10:30"
    },
    "dining": {
      "restaurants": 1,
      "cuisineStyle": ["british", "seafood", "local"],
        "meals": ["breakfast", "lunch", "dinner"]
      },
      "facilities": {
        "parking": { "available": true, "spaces": 12 },
        "wifi": { "available": true, "free": true },
        "pets": { "allowed": true, "types": ["dogs"], "fee": 10 }
      },
      "accessibility": {
        "wheelchairAccess": true,
        "accessibleRooms": 2,
        "lift": false
      },
      "policies": {
        "cancellation": { "freeCancellationHours": 48 },
        "children": { "allowed": true, "minimumAge": 0 },
        "smoking": false
      }
    },
    
    "evidence": {
      "dogFriendly": {
        "claim": "Welcomes dogs throughout the pub and in most rooms",
        "value": true,
        "confidence": 0.91,
        "convergence": "strong",
        "sources": [
          {
            "type": "review_aggregation",
            "sourceRef": "reviews:google:whitelionblakeney",
            "method": "keyword_count",
            "capturedAt": "2025-12-10T10:00:00Z",
            "capturedBy": "groundry:sentiment/v1.0",
            "platform": "google",
            "count": 84,
            "sentiment": 0.89,
            "verification": { "status": "machine_verified" }
          },
          {
            "type": "human_observation",
            "sourceRef": "visit:visitnorfolk:2025-10-20",
            "method": "interview",
            "capturedAt": "2025-10-20T11:30:00Z",
            "capturedBy": "did:web:visitnorfolk.co.uk",
            "verification": {
              "status": "dmo_verified",
              "verifiedBy": "did:web:visitnorfolk.co.uk",
              "verifiedAt": "2025-10-20T11:30:00Z"
            }
          }
        ],
        "lastVerified": "2025-12-15T00:00:00Z"
      }
    },
    
    "fit": {
      "strong": [
        {
          "intent": "dog-friendly-coastal",
          "confidence": 0.91,
          "signals": ["dogs welcome throughout", "coastal walks from door", "dog-friendly rooms"]
        },
        {
          "intent": "seafood-pub",
          "confidence": 0.87,
          "signals": ["local crab and oysters", "daily catch", "harbour location"]
        }
      ],
      "weak": [
        {
          "intent": "luxury-treat",
          "reason": "Traditional pub rooms, comfortable not luxurious"
        },
        {
          "intent": "quiet-retreat",
          "reason": "Busy pub downstairs, harbour noise in summer"
        }
      ]
    },
    
    "units": [
      {
        "id": "harbour-view-double",
        "type": "room",
        "name": "Harbour View Double",
        "vibe": {
          "essence": "Watch the boats come in",
          "character": ["bright", "views", "traditional"]
        },
        "attributes": {
          "beds": [{ "type": "king", "count": 1 }],
          "maxOccupancy": { "adults": 2, "children": 1 },
          "size": { "value": 22, "unit": "sqm" },
          "features": ["harbour-view", "ensuite", "tea-coffee"]
        },
        "fit": {
          "strong": [
            { "intent": "couples", "confidence": 0.88, "signals": ["king bed", "views", "quiet side"] }
          ],
          "weak": [
            { "intent": "dog-owners", "reason": "No dog-friendly rooms on this floor" }
          ]
        },
        "pricing": {
          "from": { "amount": 145, "currency": "GBP", "per": "night" }
        }
      }
    ],
    
    "neighbourhood": {
      "setting": "harbour-front",
      "character": ["quiet", "maritime", "traditional"],
      "walkability": 0.8,
      "proximity": [
        {
          "name": "Blakeney Point",
          "type": "nature-reserve",
          "distance": { "value": 0.5, "unit": "miles" },
          "relevance": ["seal-watching", "birdwatching", "walking"]
        }
      ],
      "region": {
        "name": "North Norfolk Coast",
        "knownFor": ["AONB", "seals", "sailing", "seafood"]
      }
    },
    
    "presentation": {
      "a2uiVersion": "0.8",
      "components": {
        "venueCard": {
          "type": "card",
          "template": {
            "header": { "image": "{{media.hero}}", "title": "{{identity.name}}" },
            "body": { "subtitle": "{{vibe.essence}}", "location": "{{neighbourhood.setting}}" }
          }
        }
      },
      "layouts": {
        "summary": ["venueCard"],
        "booking": ["bookingForm"]
      }
    },
    
    "answers": [
      {
        "question": "Is The White Lion dog-friendly?",
        "answer": "Yes. Dogs are welcomed throughout the pub and in most rooms. They provide water bowls and can recommend local walks. Blakeney Point seal trips and coastal paths are nearby.",
        "confidence": 0.91,
        "basedOn": ["evidence.dogFriendly", "neighbourhood.proximity"],
        "lastVerified": "2025-12-15"
      }
    ],
    
    "actions": {
      "capabilities": ["check-availability", "get-rates", "book", "modify", "cancel"],
      "endpoint": "https://api.whitelionblakeney.co.uk/booking",
      "authentication": {
        "type": "oauth2",
        "flows": ["client-credentials"]
      }
    }
}
```

---

## Venue blocks

A Venue is a [Bookable](/bookable) with hospitality-specific blocks:

| Block | Purpose |
|-------|---------|
| **vibe** | Subjective character. What it feels like, not just what it has. |
| **attributes** | Hospitality-specific facts: accommodation, dining, facilities, accessibility, policies. |
| **units** | Bookable sub-entities (rooms, tables), each with their own vibe, attributes, and fit. |
| **neighbourhood** | Location context. What's nearby and why it matters. |

---

## Vibe

Vibe captures subjective character — what a venue *feels* like.

```json
{
  "vibe": {
    "essence": "Unpretentious coastal comfort",
    "character": ["relaxed", "dog-friendly", "seafood-focused", "traditional"],
    "atmosphere": {
      "energy": "calm",
      "formality": "casual",
      "crowd": "walkers, sailors, dog owners, families",
      "pace": "slow"
    }
  }
}
```

Two hotels can both be "4-star, dog-friendly, coastal." But one is quiet and romantic, the other lively and social. Attributes don't capture this. Vibe does.

---

## Attributes

Hospitality-specific factual characteristics:

```json
{
  "attributes": {
    "accommodation": {
      "totalRooms": 14,
      "roomTypes": ["double", "twin", "family"],
      "checkIn": "15:00",
      "checkOut": "10:30"
    },
    "dining": {
      "restaurants": 1,
      "cuisineStyle": ["british", "seafood", "local"]
    },
    "facilities": {
      "parking": { "available": true, "spaces": 12 },
      "wifi": { "available": true, "free": true },
      "pets": { "allowed": true, "types": ["dogs"], "fee": 10 }
    },
    "accessibility": {
      "wheelchairAccess": true,
      "accessibleRooms": 2
    },
    "policies": {
      "cancellation": { "freeCancellationHours": 48 }
    }
  }
}
```

Quantified, not marketed. Boolean values, integers, structured objects.

---

## Units

Bookable sub-entities. Rooms, tables, each with their own vibe, attributes, and fit.

```json
{
  "units": [
    {
      "id": "harbour-view-double",
      "type": "room",
      "name": "Harbour View Double",
      "vibe": { "essence": "Watch the boats come in" },
      "attributes": { "beds": [{ "type": "king", "count": 1 }] },
      "fit": {
        "strong": [{ "intent": "couples", "confidence": 0.88 }],
        "weak": [{ "intent": "dog-owners", "reason": "No dogs on this floor" }]
      },
      "pricing": { "from": { "amount": 145, "currency": "GBP", "per": "night" } }
    }
  ]
}
```

Units inherit venue-level attributes unless overridden. A venue declaring `pets.allowed: true` applies to all units unless a unit declares otherwise.

---

## Neighbourhood

Location context. Not just where, but what's around and why it matters.

```json
{
  "neighbourhood": {
    "setting": "harbour-front",
    "character": ["quiet", "maritime", "traditional"],
    "walkability": 0.8,
    "proximity": [
      {
        "name": "Blakeney Point",
        "type": "nature-reserve",
        "distance": { "value": 0.5, "unit": "miles" },
        "relevance": ["seal-watching", "birdwatching", "walking"]
      }
    ],
    "region": {
      "name": "North Norfolk Coast",
      "knownFor": ["AONB", "seals", "sailing", "seafood"]
    }
  }
}
```

Proximity items include `relevance` tags for intent matching. An agent looking for "dog-friendly coastal" can match on nearby beaches with `dog-walking` relevance.

---

## Type hierarchy

Venue defines hospitality types that inherit from Bookable:

```
Bookable
└── Venue
    ├── Stay
    │   ├── Hotel
    │   ├── BnB
    │   └── Hostel
    ├── Eat
    │   ├── Restaurant
    │   ├── Cafe
    │   └── Bar
    ├── Experience
    │   ├── Museum
    │   ├── Tour
    │   └── Activity
    └── Service
        ├── Spa
        └── Salon
```

Agents can interact with any Venue as a Bookable. Type-specific fields extend but don't replace inherited fields.

### Booking patterns by type

| Type | Unit | Booking pattern |
|------|------|-----------------|
| **Stay** | Room, cottage | Nights, check-in/check-out times |
| **Eat** | Table, area | Time slots, party size, covers |
| **Experience** | Ticket, slot | Timed entry, capacity, duration |
| **Service** | Appointment | Time slots, practitioner, duration |

---

## Protocol bindings

Venues can be exposed via multiple protocols:

### REST

```
GET  /venues/{id}
POST /venues/{id}/availability
POST /venues/{id}/book
```

### MCP

```json
{
  "method": "check_availability",
  "params": {
    "venue_id": "white-lion-blakeney",
    "check_in": "2026-03-15",
    "check_out": "2026-03-17",
    "guests": 2
  }
}
```

### A2A

Venues can publish as A2A Agent Cards with the Venue extension.

### UCP

For UCP integration, see [UCP Integration](/docs/ucp-integration.md).

---

## Curator integration

Venues can be verified by [Curators](/curator). Curator evidence appears in the `evidence` block:

```json
{
  "evidence": {
    "dogFriendly": {
      "sources": [
        {
          "type": "human_observation",
          "capturedBy": "did:web:visitnorfolk.co.uk",
          "verification": {
            "status": "dmo_verified",
            "verifiedBy": "did:web:visitnorfolk.co.uk"
          }
        }
      ]
    }
  }
}
```

DMO verification adds trust. Multiple Curators = higher confidence.

---

## Status

**Version:** 0.1.0 (Draft)  
**License:** MIT

---

## Related

- [Bookable](/bookable): Base pattern Venue inherits from
- [Booking Terms](/booking-terms): Payment semantics
- [Stay](/stay): Lifecycle states
- [Curator](/curator): Discovery and verification

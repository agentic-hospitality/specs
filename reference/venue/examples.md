---
title: Examples
description: Working JSON examples for hotels and restaurants—complete venue records, evidence with credentials, conflicting evidence handling.
order: 2
---

# Venue Examples

Working examples and complete JSON payloads.

---

## Complete Hotel Example

A full Venue record for a boutique hotel with all blocks:

::code-group
```json [Full Record]
{
  "name": "The Roste",
  "description": "Historic coaching inn in East Coastshire",
  "version": "1.0.0",
  "protocolVersion": "1.0",
  "capabilities": {
    "extensions": [{
      "uri": "https://agenticbooking.org/venue/v1",
      "required": true
    }]
  },

  "venue": {
    "schemaVersion": "0.1.0",
    "type": "venue:hotel",
    "extends": "venue:bookable",

    "identity": {
      "name": "The Roste",
      "legalName": "The Roste Arms Limited",
      "location": {
        "address": "The Green, Burnton Market, Eastshire PE31 8HD",
        "coordinates": [52.9456, 0.7234]
      },
      "domain": "theroste.com",
      "did": "did:web:theroste.com",
      "registration": {
        "jurisdiction": "GB",
        "companyNumber": "03456789"
      }
    },

    "vibe": {
      "essence": "Relaxed coastal elegance",
      "character": ["intimate", "foodie", "understated", "dog-friendly"],
      "atmosphere": {
        "energy": "calm",
        "formality": "smart-casual",
        "crowd": "couples, foodies, dog-owners",
        "pace": "slow"
      }
    },

    "attributes": {
      "accommodation": {
        "totalRooms": 62,
        "roomTypes": ["double", "suite", "cottage"],
        "checkIn": "15:00",
        "checkOut": "11:00"
      },
      "facilities": {
        "parking": { "available": true, "spaces": 30, "evCharging": true },
        "wifi": { "available": true, "free": true },
        "pets": { "allowed": true, "types": ["dogs"], "fee": 15 }
      }
    },

    "evidence": {
      "dogFriendly": {
        "claim": "Genuinely welcoming to dogs with dedicated amenities",
        "value": true,
        "confidence": 0.96,
        "convergence": "strong",
        "sources": [
          {
            "type": "human_observation",
            "sourceRef": "visit:visitnorfolk:2025-11-15",
            "method": "on_site_inspection",
            "capturedAt": "2025-11-15T14:30:00Z",
            "capturedBy": "did:web:visiteastshire.co.uk",
            "verification": {
              "status": "authority_verified",
              "verifiedBy": "did:web:visiteastshire.co.uk",
              "verifiedAt": "2025-11-15T14:30:00Z"
            }
          },
          {
            "type": "derived",
            "sourceRef": "https://theroste.com/dogs",
            "method": "website-review",
            "capturedAt": "2025-12-14T08:00:00Z",
            "verification": { "status": "machine_verified" }
          }
        ],
        "lastVerified": "2025-12-14T00:00:00Z"
      },
      "foodQuality": {
        "claim": "Known for excellent food with AA rosette recognition",
        "confidence": 0.94,
        "convergence": "strong",
        "sources": [
          {
            "type": "curator_certification",
            "sourceRef": "AA Rosette Award",
            "method": "accreditation_audit",
            "capturedAt": "2024-09-15T00:00:00Z",
            "capturedBy": "AA",
            "verification": {
              "status": "authority_verified",
              "verifiedBy": "AA",
              "verifiedAt": "2024-09-15T00:00:00Z"
            }
          },
          {
            "type": "third_party:uk-fsa-hygiene",
            "sourceRef": "https://ratings.food.gov.uk/thehoste",
            "method": "api_lookup",
            "capturedAt": "2025-12-01T00:00:00Z",
            "capturedBy": "automated-capture",
            "value": "5",
            "verification": { "status": "machine_verified" }
          }
        ]
      }
    },

    "fit": {
      "strong": [
        {
          "intent": "romantic-weekend",
          "confidence": 0.91,
          "signals": ["intimate atmosphere", "excellent dining", "quiet village"]
        },
        {
          "intent": "dog-friendly-coastal",
          "confidence": 0.94,
          "signals": ["dogs genuinely welcome", "near beaches", "countryside walks"]
        },
        {
          "intent": "foodie-escape",
          "confidence": 0.88,
          "signals": ["AA rosettes", "local sourcing", "notable restaurant"]
        }
      ],
      "weak": [
        {
          "intent": "nightlife",
          "reason": "Village location, quiet after 10pm"
        },
        {
          "intent": "budget-friendly",
          "reason": "Premium pricing, avg £180/night"
        },
        {
          "intent": "stag-do",
          "reason": "Intimate setting, not suitable for large groups"
        }
      ]
    },

    "actions": {
      "capabilities": ["assess-fit", "check-availability", "get-rates", "book", "modify", "cancel"],
      "endpoint": "https://api.theroste.com/a2a",
      "protocol": "a2a-jsonrpc",
      "authentication": {
        "type": "oauth2",
        "flows": ["client-credentials"]
      },
      "constraints": {
        "maxLeadTimeDays": 365,
        "minLeadTimeHours": 24,
        "maxNights": 14
      }
    },

    "units": [
      {
        "id": "cottage-suite",
        "type": "room",
        "name": "Garden Cottage Suite",
        "vibe": {
          "essence": "Private retreat",
          "character": ["secluded", "self-contained", "peaceful"]
        },
        "attributes": {
          "beds": [{ "type": "super-king", "count": 1 }],
          "maxOccupancy": { "adults": 2, "children": 2 },
          "size": { "value": 55, "unit": "sqm" },
          "features": ["private-entrance", "garden", "kitchen"]
        },
        "fit": {
          "strong": [
            { "intent": "dog-owners", "confidence": 0.94, "signals": ["private garden", "own entrance"] }
          ],
          "weak": [
            { "intent": "mobility-impaired", "reason": "Steps at entrance" }
          ]
        },
        "pricing": {
          "from": { "amount": 280, "currency": "GBP", "per": "night" }
        }
      }
    ],

    "neighbourhood": {
      "setting": "village-centre",
      "character": ["quiet", "upmarket", "traditional"],
      "walkability": 0.7,
      "proximity": [
        {
          "name": "Holkbury Beach",
          "type": "beach",
          "distance": { "value": 3, "unit": "miles" },
          "travelTime": { "value": 8, "unit": "minutes", "mode": "car" },
          "relevance": ["dog-walking", "family-beach", "nature"]
        }
      ],
      "region": {
        "name": "East Coastshire",
        "knownFor": ["AONB", "beaches", "birdwatching", "seafood"]
      }
    },

    "presentation": {
      "a2uiVersion": "0.8",
      "components": {
        "venue": {
          "type": "card",
          "template": {
            "header": { "image": "{{media.hero}}", "title": "{{identity.name}}" },
            "body": { "subtitle": "{{vibe.essence}}", "location": "{{neighbourhood.setting}}" }
          }
        }
      },
      "layouts": {
        "summary": ["venue"]
      }
    },

    "answers": [
      {
        "question": "Is The Roste genuinely dog-friendly?",
        "answer": "Yes. Dogs are welcomed across most rooms and public areas, with beds, bowls, and treats provided. This was confirmed during a Visit Eastshire site inspection in November 2025. The village location offers excellent walks, and nearby Holkbury Beach allows dogs year-round.",
        "confidence": 0.96,
        "basedOn": ["evidence.dogFriendly", "attributes.facilities.pets", "neighbourhood.proximity[0]"],
        "citations": [
          {
            "type": "authority-verification",
            "source": "Visit Eastshire site inspection",
            "venuePath": "evidence.dogFriendly.sources[0]"
          },
          {
            "type": "first-party",
            "url": "https://theroste.com/dogs",
            "venuePath": "evidence.dogFriendly.sources[1]"
          }
        ],
        "lastVerified": "2025-12-14T00:00:00Z"
      },
      {
        "question": "Who should NOT stay here?",
        "answer": "Not ideal for those seeking nightlife (village is quiet after 10pm), budget travellers (average £180/night), or large party groups (intimate setting, max group ~12).",
        "confidence": 0.88,
        "basedOn": ["fit.weak"],
        "citations": [
          { "type": "fit-signal", "venuePath": "fit.weak" }
        ],
        "lastVerified": "2025-12-14T00:00:00Z"
      }
    ]
  }
}
```

```json [Identity Block]
{
  "identity": {
    "name": "The Roste",
    "legalName": "The Roste Arms Limited",
    "location": {
      "address": "The Green, Burnton Market, Eastshire PE31 8HD",
      "coordinates": [52.9456, 0.7234]
    },
    "domain": "theroste.com",
    "did": "did:web:theroste.com",
    "registration": {
      "jurisdiction": "GB",
      "companyNumber": "03456789"
    }
  }
}
```

```json [Evidence Block]
{
  "evidence": {
    "dogFriendly": {
      "claim": "Genuinely welcoming to dogs",
      "value": true,
      "confidence": 0.96,
      "convergence": "strong",
      "sources": [
        {
          "type": "human_observation",
          "sourceRef": "visit:visitnorfolk:2025-11-15",
          "method": "on_site_inspection",
          "capturedAt": "2025-11-15T14:30:00Z",
          "capturedBy": "did:web:visiteastshire.co.uk",
          "verification": {
            "status": "authority_verified",
            "verifiedBy": "did:web:visiteastshire.co.uk",
            "verifiedAt": "2025-11-15T14:30:00Z"
          }
        }
      ]
    }
  }
}
```

```json [Fit Block]
{
  "fit": {
    "strong": [
      {
        "intent": "dog-friendly-coastal",
        "confidence": 0.94,
        "signals": ["dogs genuinely welcome", "near beaches"]
      }
    ],
    "weak": [
      {
        "intent": "nightlife",
        "reason": "Village location, quiet after 10pm"
      }
    ]
  }
}
```
::

---

## Evidence with Verifiable Credential

When a claim is backed by a cryptographic credential from an authority:

```json
{
  "evidence": {
    "greenTourism": {
      "claim": "Gold certified sustainable tourism operator",
      "confidence": 0.99,
      "convergence": "strong",
      "sources": [
        {
          "type": "curator_certification",
          "sourceRef": "Green Tourism Gold Award",
          "method": "accreditation_audit",
          "capturedAt": "2024-09-15T00:00:00Z",
          "capturedBy": "Green Tourism",
          "verification": {
            "status": "authority_verified",
            "verifiedBy": "Green Tourism Ltd",
            "verifiedAt": "2024-09-15T00:00:00Z"
          }
        }
      ]
    }
  },
  "credentials": [
    {
      "@context": [
        "https://www.w3.org/2018/credentials/v1",
        "https://greentourism.com/credentials/v1"
      ],
      "type": ["VerifiableCredential", "SustainabilityCredential"],
      "issuer": "did:web:greentourism.com",
      "issuanceDate": "2024-09-15T00:00:00Z",
      "expirationDate": "2026-09-15T00:00:00Z",
      "credentialSubject": {
        "id": "did:web:theroste.com",
        "certification": "Gold",
        "auditDate": "2024-09-10"
      },
      "proof": {
        "type": "Ed25519Signature2020",
        "created": "2024-09-15T00:00:00Z",
        "verificationMethod": "did:web:greentourism.com#key-1",
        "proofPurpose": "assertionMethod",
        "proofValue": "z58DAdFfa9SkqZMVPxAQpic6..."
      }
    }
  ]
}
```

---

## Conflicting Evidence

How to represent disagreement between sources:

```json
{
  "evidence": {
    "quietness": {
      "claim": "Quiet, peaceful location",
      "confidence": 0.65,
      "convergence": "conflicting",
      "sources": [
        {
          "type": "self_report",
          "sourceRef": "Property description",
          "method": "form_submission",
          "capturedAt": "2024-01-01T00:00:00Z",
          "verification": { "status": "unverified" }
        },
        {
          "type": "human_observation",
          "sourceRef": "DMO site visit noted A-road proximity",
          "method": "on_site_inspection",
          "capturedAt": "2025-10-15T00:00:00Z",
          "capturedBy": "did:web:visiteastshire.co.uk",
          "verification": {
            "status": "authority_verified",
            "verifiedBy": "did:web:visiteastshire.co.uk"
          }
        }
      ],
      "lastVerified": "2025-10-15T00:00:00Z"
    }
  }
}
```

::callout{type="warning"}
When `convergence` is `conflicting`, agents should disclose the uncertainty to users rather than making definitive claims.
::

---

## Accessibility Evidence with DMO Verification

Proper accessibility claims require authoritative verification:

```json
{
  "evidence": {
    "wheelchairAccess": {
      "claim": "Full wheelchair access to ground floor and restaurant",
      "confidence": 0.98,
      "convergence": "strong",
      "sources": [
        {
          "type": "curator_certification",
          "sourceRef": "National Tourism Board Access Statement",
          "method": "accreditation_audit",
          "capturedAt": "2025-03-20T00:00:00Z",
          "capturedBy": "National Tourism Board",
          "verification": {
            "status": "authority_verified",
            "verifiedBy": "National Tourism Board Accessibility Assessor",
            "verifiedAt": "2025-03-20T00:00:00Z"
          }
        },
        {
          "type": "human_observation",
          "sourceRef": "DMO site visit - measured doorways, checked ramps",
          "method": "on_site_inspection",
          "capturedAt": "2025-03-20T00:00:00Z",
          "capturedBy": "did:web:nationaltourismboard.gov.uk",
          "verification": {
            "status": "human_verified"
          }
        }
      ]
    }
  },
  "credentials": [
    {
      "@context": [
        "https://www.w3.org/2018/credentials/v1",
        "https://nationaltourismboard.gov.uk/accessibility/v1"
      ],
      "type": ["VerifiableCredential", "AccessibilityCredential"],
      "issuer": "did:web:nationaltourismboard.gov.uk",
      "issuanceDate": "2025-03-20T00:00:00Z",
      "credentialSubject": {
        "id": "did:web:theroste.com",
        "accessibilityLevel": "full_ground_floor",
        "features": ["ramp_access", "accessible_toilet", "wide_doorways"]
      },
      "proof": { }
    }
  ]
}
```

---

## Restaurant Example

A restaurant Venue showing table units and meal periods:

```json
{
  "venue": {
    "schemaVersion": "0.1.0",
    "type": "venue:restaurant",
    "extends": "venue:eat",

    "identity": {
      "name": "The Rambling Duck",
      "location": {
        "address": "11 Abbey Road, Great Marsingham, Eastshire PE32 2HN",
        "coordinates": [52.7891, 0.7123]
      },
      "domain": "theramblingduck.co.uk",
      "did": "did:web:theramblingduck.co.uk"
    },

    "vibe": {
      "essence": "Village pub with serious food",
      "character": ["relaxed", "foodie", "dog-friendly", "traditional"],
      "atmosphere": {
        "energy": "warm",
        "formality": "casual",
        "pace": "relaxed"
      }
    },

    "attributes": {
      "dining": {
        "covers": 45,
        "cuisineStyle": ["British", "seasonal", "local"],
        "meals": ["lunch", "dinner"]
      },
      "facilities": {
        "parking": { "available": true, "spaces": 15 },
        "pets": { "allowed": true, "types": ["dogs"] }
      }
    },

    "evidence": {
      "localSourcing": {
        "claim": "Menu features locally-sourced Eastshire ingredients",
        "confidence": 0.94,
        "convergence": "strong",
        "sources": [
          {
            "type": "human_observation",
            "sourceRef": "DMO site visit - menu inspection and kitchen tour",
            "method": "on_site_inspection",
            "capturedAt": "2025-10-10T00:00:00Z",
            "capturedBy": "did:web:visiteastshire.co.uk",
            "verification": {
              "status": "authority_verified",
              "verifiedBy": "Visit Eastshire",
              "verifiedAt": "2025-10-10T00:00:00Z"
            }
          },
          {
            "type": "derived",
            "sourceRef": "https://theramblingduck.co.uk/our-suppliers",
            "method": "website-review",
            "capturedAt": "2025-12-01T00:00:00Z",
            "verification": { "status": "machine_verified" }
          }
        ]
      },
      "dogFriendly": {
        "claim": "Dogs welcome in bar area",
        "value": true,
        "confidence": 0.92,
        "convergence": "strong",
        "sources": [
          {
            "type": "human_observation",
            "sourceRef": "DMO site visit confirmed dogs in bar",
            "method": "on_site_inspection",
            "capturedAt": "2025-10-10T00:00:00Z",
            "verification": {
              "status": "authority_verified"
            }
          }
        ]
      }
    },

    "fit": {
      "strong": [
        {
          "intent": "foodie-escape",
          "confidence": 0.91,
          "signals": ["quality cooking", "local ingredients", "good wine list"]
        },
        {
          "intent": "dog-friendly-trip",
          "confidence": 0.88,
          "signals": ["dogs welcome in bar", "water bowls provided"]
        }
      ],
      "weak": [
        {
          "intent": "fine-dining",
          "reason": "Pub setting, not white-tablecloth"
        },
        {
          "intent": "late-night",
          "reason": "Kitchen closes at 9pm"
        }
      ]
    },

    "units": [
      {
        "id": "bar-table-2",
        "type": "table",
        "name": "Bar Table (2 covers)",
        "attributes": {
          "covers": 2,
          "area": "bar"
        },
        "fit": {
          "strong": [
            { "intent": "dog-owners", "confidence": 0.92, "signals": ["dogs allowed in bar"] }
          ]
        }
      },
      {
        "id": "restaurant-table-4",
        "type": "table",
        "name": "Restaurant Table (4 covers)",
        "attributes": {
          "covers": 4,
          "area": "restaurant"
        },
        "fit": {
          "weak": [
            { "intent": "dog-owners", "reason": "Dogs not permitted in restaurant area" }
          ]
        }
      }
    ],

    "actions": {
      "capabilities": ["check-availability", "book", "cancel"],
      "endpoint": "https://api.theramblingduck.co.uk/agent",
      "protocol": "jsonrpc"
    }
  }
}
```

---

## Units with Inheritance

Showing how unit-level evidence overrides venue defaults:

```json
{
  "venue": {
    "attributes": {
      "facilities": {
        "pets": { "allowed": true, "types": ["dogs"] }
      }
    },

    "units": [
      {
        "id": "main-house-room",
        "type": "room",
        "name": "Main House Double",
        "attributes": {}
      },
      {
        "id": "cottage",
        "type": "room",
        "name": "Garden Cottage",
        "attributes": {
          "features": ["private-garden", "separate-entrance"]
        },
        "evidence": {
          "dogFriendly": {
            "claim": "Particularly suited for dogs with private garden",
            "value": true,
            "confidence": 0.98,
            "convergence": "strong",
            "sources": [
              {
                "type": "human_observation",
                "sourceRef": "DMO inspection noted secure garden",
                "method": "on_site_inspection",
                "capturedAt": "2025-11-15T00:00:00Z",
                "verification": { "status": "authority_verified" }
              }
            ]
          }
        }
      },
      {
        "id": "penthouse",
        "type": "room",
        "name": "Penthouse Suite",
        "attributes": {
          "facilities": {
            "pets": { "allowed": false }
          }
        }
      }
    ]
  }
}
```

::callout{type="info"}
The `main-house-room` inherits `pets.allowed: true` from the venue. The `cottage` has additional evidence specific to dog suitability. The `penthouse` overrides the venue default to disallow pets.
::

---

## Discovery via Well-Known

Publishing a Venue at the well-known endpoint:

```bash
# The record should be available at:
curl https://theroste.com/.well-known/agent.json
```

Response:
```json
{
  "@context": "https://agenticbooking.org/venue/v0.1/context.jsonld",
  "venue": {
    "schemaVersion": "0.1.0",
    "type": "venue:hotel",
    "identity": { },
    "evidence": { },
    "fit": { },
    "actions": {
      "capabilities": ["assess-fit", "check-availability", "get-rates", "book"],
      "endpoint": "https://theroste.com/api/agent",
      "protocol": "jsonrpc"
    }
  }
}
```

---

## Neighbourhood Context

Complete neighbourhood block with proximity relevance:

```json
{
  "neighbourhood": {
    "setting": "village-centre",
    "character": ["quiet", "upmarket", "traditional", "affluent"],
    "walkability": 0.7,
    "proximity": [
      {
        "name": "Holkbury Beach",
        "type": "beach",
        "distance": { "value": 3, "unit": "miles" },
        "travelTime": { "value": 8, "unit": "minutes", "mode": "car" },
        "relevance": ["dog-walking", "family-beach", "nature", "photography"]
      },
      {
        "name": "Burnton Market Village",
        "type": "village",
        "distance": { "value": 0, "unit": "miles" },
        "relevance": ["shopping", "galleries", "restaurants"]
      },
      {
        "name": "Holkbury Hall",
        "type": "historic-house",
        "distance": { "value": 2, "unit": "miles" },
        "travelTime": { "value": 5, "unit": "minutes", "mode": "car" },
        "relevance": ["cultural-exploration", "family-day-out", "gardens"]
      },
      {
        "name": "Welling-next-the-Sea",
        "type": "town",
        "distance": { "value": 5, "unit": "miles" },
        "travelTime": { "value": 12, "unit": "minutes", "mode": "car" },
        "relevance": ["harbour", "fish-and-chips", "boat-trips"]
      }
    ],
    "region": {
      "name": "East Coastshire",
      "knownFor": ["AONB", "beaches", "birdwatching", "seafood", "big-skies"]
    }
  }
}
```

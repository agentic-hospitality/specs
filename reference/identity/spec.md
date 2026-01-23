---
title: Specification
description: Technical specification for decentralized identifiers and verifiable credentials—DIDs, VCs, trust chains, and selective disclosure.
order: 1
---

# Identity Specification

::badge{type="warning"}
v0.1.0 Draft
::

Decentralized identifiers and verifiable credentials for hospitality.

**Namespace URI:** `https://agenticbooking.org/identity/v1`

---

## 1. Overview

Identity establishes who venues and authorities are, enabling agents to verify claims and build trust chains.

---

## 2. Decentralized Identifiers (DIDs)

A DID is a globally unique identifier that the subject controls. No central authority grants it.

### 2.1 did:web

For most venues and Curators, `did:web` is sufficient:

```
did:web:theroste.co.uk
did:web:visitnorfolk.co.uk
```

### 2.2 DID Document

Publish at `https://yourdomain.com/.well-known/did.json`:

```json
{
  "@context": "https://www.w3.org/ns/did/v1",
  "id": "did:web:theroste.co.uk",
  "verificationMethod": [{
    "id": "did:web:theroste.co.uk#key-1",
    "type": "JsonWebKey2020",
    "controller": "did:web:theroste.co.uk",
    "publicKeyJwk": {
      "kty": "EC",
      "crv": "P-256",
      "x": "...",
      "y": "..."
    }
  }]
}
```

Domain ownership proves identity. No registration, no approval, no fees.

### 2.3 DID Methods

| Method | Best for | Trade-offs |
|--------|----------|------------|
| `did:web` | Most venues and Curators | Simple; depends on domain control |
| `did:ion` | Long-term identity anchoring | More complex; Bitcoin-anchored |
| `did:ethr` | Crypto-native ecosystems | Ethereum-based; gas costs |

For hospitality, `did:web` is the practical choice.

---

## 3. Verifiable Credentials (VCs)

A DID proves identity. A Verifiable Credential proves something *about* that identity.

### 3.1 Structure

```json
{
  "@context": ["https://www.w3.org/2018/credentials/v1"],
  "type": ["VerifiableCredential", "HygieneRatingCredential"],
  "issuer": "did:web:ratings.food.gov.uk",
  "issuanceDate": "2026-01-15T00:00:00Z",
  "credentialSubject": {
    "id": "did:web:theroste.co.uk",
    "hygieneRating": 5
  },
  "proof": {
    "type": "EcdsaSecp256k1Signature2019",
    "created": "2026-01-15T00:00:00Z",
    "verificationMethod": "did:web:ratings.food.gov.uk#key-1",
    "proofPurpose": "assertionMethod",
    "jws": "eyJhbGciOiJFUzI1NksifQ..."
  }
}
```

The credential is cryptographically signed by the issuer. Anyone can verify it came from them.

### 3.2 Credential Types

| Type | Issuer | Purpose |
|------|--------|---------|
| `HygieneRatingCredential` | Food Standards Agency | Food safety rating |
| `CuratorVerificationCredential` | DMO/Curator | Venue verified |
| `IATARegistrationCredential` | IATA | Travel industry registration |
| `AccessibilityCredential` | Accessibility body | Accessibility features verified |
| `SustainabilityCredential` | Green Tourism | Environmental standards |

---

## 4. Trust Hierarchy

Trust comes from the issuer's authority:

```
Government credential (FSA hygiene rating)
    ↓ highest trust
Industry credential (IATA TIDS)
    ↓
Regional authority (DMO verification)
    ↓
Established platform (verified listing)
    ↓
Self-asserted claim (needs corroboration)
    ↓ lowest trust alone
```

| Issuer type | Examples | Why agents trust it |
|-------------|----------|---------------------|
| **Government** | Food Standards Agency, Companies House | Legal mandate, public accountability |
| **Industry body** | IATA TIDS, ABTA, AA | Professional standards, membership requirements |
| **Regional authority** | DMOs, tourism boards | Geographic mandate, local knowledge |
| **Established platform** | TripAdvisor verified, Google Business | Scale, verification processes |
| **Self-asserted** | Venue's own claims | Low trust alone; needs corroboration |

---

## 5. IATA TIDS

[IATA TIDS](https://www.iata.org/en/services/accreditation/tids/) (Travel Industry Designator Service) provides unique identifiers for travel industry entities.

```json
{
  "type": ["VerifiableCredential", "IATARegistrationCredential"],
  "issuer": "did:web:iata.org",
  "credentialSubject": {
    "id": "did:web:theroste.co.uk",
    "tidsNumber": "12345678"
  }
}
```

A venue with an IATA TIDS number has been verified through an established industry process.

---

## 6. Becoming a Verifier

No permission is required to become a Curator. Authority comes from doing the work:

1. **Publish a Curator Agent Card** at your well-known endpoint
2. **Define your coverage** (geographic region, thematic focus)
3. **Start verifying venues** (confirm existence, capture stories)
4. **Issue credentials** that appear on venue evidence blocks

Authority grows through:
- Verifying more venues consistently
- Maintaining accuracy over time
- Building reputation through the mutual validation loop

A new Curator with 10 verified venues has less weight than an established DMO with 500. That's not gatekeeping; that's earned trust.

---

## Related Specifications

- [Bookable Spec](/reference/bookable/spec) — Base pattern with evidence block
- [Venue Spec](/reference/venue/spec) — Venue identity requirements
- [Curator Spec](/reference/curator/spec) — Curator verification

---

::callout{type="info"}
Identity is an open specification under MIT license.
::

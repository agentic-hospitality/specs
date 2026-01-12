# Identity and Trust

How venues and authorities establish verifiable identity.

---

## Decentralized Identifiers (DIDs)

A DID is a globally unique identifier that you control. No central authority grants it.

For most venues and Curators, `did:web` is sufficient:

```
did:web:thehoste.com
did:web:visitnorfolk.co.uk
```

### Getting a did:web

If you control a domain, you can have a DID:

1. Create a DID document at `https://yourdomain.com/.well-known/did.json`
2. Your DID is `did:web:yourdomain.com`

Example DID document:

```json
{
  "@context": "https://www.w3.org/ns/did/v1",
  "id": "did:web:thehoste.com",
  "verificationMethod": [{
    "id": "did:web:thehoste.com#key-1",
    "type": "JsonWebKey2020",
    "controller": "did:web:thehoste.com",
    "publicKeyJwk": {
      "kty": "EC",
      "crv": "P-256",
      "x": "...",
      "y": "..."
    }
  }]
}
```

That's it. No registration, no approval, no fees. Domain ownership proves identity.

---

## Verifiable Credentials (VCs)

A DID proves identity. A Verifiable Credential proves something *about* that identity.

```json
{
  "@context": ["https://www.w3.org/2018/credentials/v1"],
  "type": ["VerifiableCredential", "HygieneRatingCredential"],
  "issuer": "did:web:ratings.food.gov.uk",
  "credentialSubject": {
    "id": "did:web:thehoste.com",
    "hygieneRating": 5
  },
  "proof": { "..." }
}
```

The credential is cryptographically signed by the issuer. Anyone can verify it came from them.

---

## Why authority matters

Anyone can issue a Verifiable Credential. The question is: why should an agent trust it?

Trust comes from the issuer's authority:

| Issuer type | Examples | Why agents trust it |
|-------------|----------|---------------------|
| **Government** | Food Standards Agency, Companies House | Legal mandate, public accountability |
| **Industry body** | IATA TIDS, ABTA, AA | Professional standards, membership requirements |
| **Regional authority** | DMOs, tourism boards | Geographic mandate, local knowledge |
| **Established platform** | TripAdvisor verified, Google Business | Scale, verification processes |
| **Self-asserted** | Venue's own claims | Low trust alone; needs corroboration |

### IATA TIDS

[IATA TIDS](https://www.iata.org/en/services/accreditation/tids/) (Travel Industry Designator Service) provides unique identifiers for travel industry entities. A venue with an IATA TIDS number has been verified through an established industry process.

```json
{
  "type": ["VerifiableCredential", "IATARegistration"],
  "issuer": "did:web:iata.org",
  "credentialSubject": {
    "id": "did:web:thehoste.com",
    "tidsNumber": "12345678"
  }
}
```

### DMO verification

A regional DMO has authority because:
- They have geographic mandate (official tourism body)
- They have local knowledge (they visit, they interview)
- They have accountability (public body, reputation at stake)

When Visit Norfolk verifies a venue, that carries weight because Visit Norfolk's authority is itself verifiable.

---

## The trust cascade

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

This isn't about bureaucracy. It's about evidence quality.

A venue claiming "5-star hygiene" is assertion. The same claim backed by a VC from `did:web:ratings.food.gov.uk` is proof.

---

## Becoming a verifier

There is no permission required to become a Curator. Authority comes from doing the work:

1. **Publish a Curator Agent Card** at your well-known endpoint
2. **Define your coverage** (geographic region, thematic focus)
3. **Start verifying venues** (confirm existence, capture stories)
4. **Issue credentials** that appear on venue evidence blocks

Your authority grows as you:
- Verify more venues consistently
- Maintain accuracy over time
- Build reputation through the mutual validation loop

A new Curator with 10 verified venues has less weight than an established DMO with 500. That's not gatekeeping; that's earned trust.

---

## Which DID method?

| Method | Best for | Trade-offs |
|--------|----------|------------|
| `did:web` | Most venues and Curators | Simple; depends on domain control |
| `did:ion` | Long-term identity anchoring | More complex; Bitcoin-anchored |
| `did:ethr` | Crypto-native ecosystems | Ethereum-based; gas costs |

For hospitality, `did:web` is the practical choice. You already have a domain. Use it.

Higher-trust scenarios (government credentials, cross-border verification) may warrant blockchain-anchored methods, but start simple.

---

## Summary

1. **DIDs are free**: Control a domain, publish a DID document
2. **VCs prove claims**: Cryptographically signed by issuers
3. **Authority matters**: Government > Industry body > Regional authority > Platform > Self
4. **No permission needed**: Anyone can curate; authority is earned
5. **Start with did:web**: Simple, practical, sufficient for most uses

---

*For technical details on DID documents and VC issuance, see [W3C DID Core](https://www.w3.org/TR/did-core/) and [W3C VC Data Model](https://www.w3.org/TR/vc-data-model/).*

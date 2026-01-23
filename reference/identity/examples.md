---
title: Examples
description: Working JSON examples for DID documents, verifiable credentials, loyalty credentials, and trust chain verification.
order: 2
---

# Identity Examples

DID documents, verifiable credentials, and trust chains.

---

## DID Document

A venue's DID document at `https://theroste.co.uk/.well-known/did.json`:

```json
{
  "@context": [
    "https://www.w3.org/ns/did/v1",
    "https://w3id.org/security/suites/jws-2020/v1"
  ],
  "id": "did:web:theroste.co.uk",
  "verificationMethod": [{
    "id": "did:web:theroste.co.uk#key-1",
    "type": "JsonWebKey2020",
    "controller": "did:web:theroste.co.uk",
    "publicKeyJwk": {
      "kty": "EC",
      "crv": "P-256",
      "x": "f83OJ3D2xF1Bg8vub9tLe1gHMzV76e8Tus9uPHvRVEU",
      "y": "x_FEzRu9m36HLN_tue659LNpXW6pCyStikYjKIWI5a0"
    }
  }],
  "authentication": ["did:web:theroste.co.uk#key-1"],
  "assertionMethod": ["did:web:theroste.co.uk#key-1"]
}
```

---

## Curator DID Document

A DMO's DID document with service endpoints:

```json
{
  "@context": "https://www.w3.org/ns/did/v1",
  "id": "did:web:visitnorfolk.co.uk",
  "verificationMethod": [{
    "id": "did:web:visitnorfolk.co.uk#key-1",
    "type": "JsonWebKey2020",
    "controller": "did:web:visitnorfolk.co.uk",
    "publicKeyJwk": {
      "kty": "EC",
      "crv": "P-256",
      "x": "...",
      "y": "..."
    }
  }],
  "service": [{
    "id": "did:web:visitnorfolk.co.uk#curator",
    "type": "CuratorService",
    "serviceEndpoint": "https://visitnorfolk.co.uk/.well-known/agent.json"
  }]
}
```

---

## Verifiable Credentials

### Hygiene Rating

```json
{
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://agenticbooking.org/identity/v1"
  ],
  "type": ["VerifiableCredential", "HygieneRatingCredential"],
  "issuer": "did:web:ratings.food.gov.uk",
  "issuanceDate": "2026-01-15T00:00:00Z",
  "expirationDate": "2027-01-15T00:00:00Z",
  "credentialSubject": {
    "id": "did:web:theroste.co.uk",
    "hygieneRating": 5,
    "inspectionDate": "2026-01-10",
    "businessName": "The Roste",
    "address": "Market Place, Burnton, Eastshire"
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

### Curator Verification

```json
{
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://agenticbooking.org/identity/v1"
  ],
  "type": ["VerifiableCredential", "CuratorVerificationCredential"],
  "issuer": "did:web:visitnorfolk.co.uk",
  "issuanceDate": "2026-01-20T00:00:00Z",
  "credentialSubject": {
    "id": "did:web:theroste.co.uk",
    "verificationStatus": "verified",
    "verificationMethod": "site_visit",
    "claims": [
      { "claim": "venue_exists", "verified": true },
      { "claim": "dog_friendly", "verified": true, "note": "Dogs welcome in all areas" },
      { "claim": "garden_seating", "verified": true }
    ]
  },
  "proof": {
    "type": "EcdsaSecp256k1Signature2019",
    "created": "2026-01-20T00:00:00Z",
    "verificationMethod": "did:web:visitnorfolk.co.uk#key-1",
    "proofPurpose": "assertionMethod",
    "jws": "eyJhbGciOiJFUzI1NksifQ..."
  }
}
```

### IATA Registration

```json
{
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://agenticbooking.org/identity/v1"
  ],
  "type": ["VerifiableCredential", "IATARegistrationCredential"],
  "issuer": "did:web:iata.org",
  "issuanceDate": "2025-06-01T00:00:00Z",
  "credentialSubject": {
    "id": "did:web:theroste.co.uk",
    "tidsNumber": "12345678",
    "entityType": "accommodation",
    "registrationStatus": "active"
  },
  "proof": {
    "type": "EcdsaSecp256k1Signature2019",
    "created": "2025-06-01T00:00:00Z",
    "verificationMethod": "did:web:iata.org#key-1",
    "proofPurpose": "assertionMethod",
    "jws": "eyJhbGciOiJFUzI1NksifQ..."
  }
}
```

---

## Trust Chain

A venue with multiple credentials showing trust convergence:

```json
{
  "venue": {
    "id": "did:web:theroste.co.uk",
    "name": "The Roste"
  },
  "credentials": [
    {
      "type": "HygieneRatingCredential",
      "issuer": "did:web:ratings.food.gov.uk",
      "trust_level": "government",
      "claim": "Hygiene rating 5"
    },
    {
      "type": "CuratorVerificationCredential",
      "issuer": "did:web:visitnorfolk.co.uk",
      "trust_level": "regional_authority",
      "claim": "Venue verified, dog-friendly confirmed"
    },
    {
      "type": "IATARegistrationCredential",
      "issuer": "did:web:iata.org",
      "trust_level": "industry_body",
      "claim": "TIDS registered"
    }
  ],
  "trust_summary": {
    "convergence": "strong",
    "independent_sources": 3,
    "highest_trust_level": "government"
  }
}
```

::callout{type="tip"}
Multiple independent credentials from different trust levels create strong convergence. Agents weight this higher than single-source verification.
::

---

## Verification Flow

How an agent verifies a credential:

```json
{
  "verification": {
    "credential_id": "urn:uuid:abc123",
    "steps": [
      {
        "step": "resolve_issuer_did",
        "did": "did:web:visitnorfolk.co.uk",
        "result": "resolved",
        "public_key": "did:web:visitnorfolk.co.uk#key-1"
      },
      {
        "step": "verify_signature",
        "algorithm": "ES256K",
        "result": "valid"
      },
      {
        "step": "check_expiration",
        "expiration_date": "2027-01-20T00:00:00Z",
        "result": "not_expired"
      },
      {
        "step": "check_revocation",
        "revocation_list": "https://visitnorfolk.co.uk/revocations",
        "result": "not_revoked"
      }
    ],
    "final_result": "verified"
  }
}
```

---
title: Evidence
description: How claims are backed by proof - evidence nodes, provenance, and confidence scoring.
order: 2
---

# Evidence

How claims are backed by proof, not assertion.

---

::warning
Self-reported information is unreliable. "We're pet-friendly" means nothing without evidence.
::

## Evidence over assertion

The system prioritises **evidence nodes** — claims with provenance:

| Evidence type | Example |
|---------------|---------|
| **Curator attestation** | DMO confirms venue location and operation |
| **Third-party review** | TripAdvisor rating with link to source |
| **Certification** | AA 4-star rating, Green Tourism badge |
| **Booking history** | Pattern of successful stays |

Every claim should answer: **Who said this? When? Can I verify it?**

## DMO verification

Destination Marketing Organisations are natural trust anchors:

::card-group{cols=2}
  ::card{title="Local knowledge" icon="ph:map-pin"}
  DMOs know their territory. Visit Cornwall can verify Cornish venues in ways no global platform can.
  ::

  ::card{title="Ongoing relationship" icon="ph:handshake"}
  DMOs work with venues continuously. They spot changes, closures, and quality shifts.
  ::

  ::card{title="Public accountability" icon="ph:buildings"}
  DMOs are public bodies with reputation at stake. Their endorsement carries weight.
  ::

  ::card{title="Structured verification" icon="ph:clipboard-text"}
  DMOs can verify: existence, location, accessibility, sustainability credentials.
  ::
::

## Curator attestation

Curators (including DMOs) vouch for venues with signed, verifiable attestations:
- "This venue exists and operates"
- "We have verified their identity"
- "They meet our standards"

## Trust scoring

Agents can weight trust signals:

| Signal | Weight |
|--------|--------|
| Multiple Curator endorsements | Higher trust |
| Recent verification | Higher trust |
| Specific claims | Higher than generic |

::note
Agents decide how to weight signals. The specs provide the data; the agent applies judgement.
::

## Implementation

See the [Identity Specification](/reference/identity/spec) for technical details.

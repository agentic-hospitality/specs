---
title: Identity
description: How venues establish verifiable identity for AI agents - DIDs, domain verification, and business registries.
order: 1
---

# Identity

How venues establish who they are.

---

For agents to act on behalf of guests, they need to trust that venues are who they claim to be.

## The identity problem

::note
Anyone can claim to be "The Grand Hotel." How does an agent know this is a real business, this website/API represents them, and the information is authoritative?
::

## Verification layers

Identity is established through multiple layers:

::card-group{cols=3}
  ::card{title="Domain" icon="ph:globe"}
  The venue controls the domain they claim. Standard web PKI.
  ::

  ::card{title="Business" icon="ph:buildings"}
  The venue is a registered business. Verified through company registries, business identity providers, or Curator attestation.
  ::

  ::card{title="Operational" icon="ph:check-circle"}
  The venue actually operates. Evidence: booking system integration, review presence, Curator site visits.
  ::
::

## Decentralised identity (DIDs)

Venues can establish identity through DIDs:

| Property | What it means |
|----------|---------------|
| **Self-sovereign** | Venue controls their identifier |
| **Verifiable** | Cryptographic proof of control |
| **Portable** | Not locked to any platform |

::tip
DIDs let venues prove identity without depending on any single platform or authority.
::

## Next steps

Identity is just the foundation. The trust layer builds on it:

::card-group{cols=2}
  ::card{title="Evidence" icon="ph:check-circle" href="/trust/evidence"}
  How claims are backed by proof, not assertion. DMO verification and trust scoring.
  ::

  ::card{title="Credentials" icon="ph:seal-check" href="/trust/credentials"}
  Verifiable Credentials for venues and guests. The cryptographic mechanism.
  ::
::

## Implementation

See the [Identity Specification](/reference/identity/spec) for technical details.

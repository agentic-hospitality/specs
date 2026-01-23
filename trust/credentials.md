---
title: Credentials
description: Verifiable credentials for hospitality—cryptographic proof of venue certifications and guest identity claims with selective disclosure and user consent.
order: 3
---

# Verifiable Credentials

Cryptographic proof that claims are true.

---

VCs provide cryptographic proof that a claim is true, issued by a trusted authority. They're the mechanism that makes evidence portable and verifiable.

## Two types of credentials

::card-group{cols=2}
  ::card{title="Venue credentials" icon="ph:seal-check"}
  Curators issue VCs to venues: "This hotel is 4-star rated", "This restaurant holds a hygiene certificate". Agents verify these instantly.
  ::

  ::card{title="Guest credentials" icon="ph:user-check"}
  Users hold VCs in their wallet app: loyalty status, accessibility needs, dietary requirements. Shared with venues only when needed.
  ::
::

## How VCs flow

::steps
  ::step{title="Issuance"}
  A Curator verifies a venue and issues a signed VC. A loyalty program issues a membership VC to a guest.
  ::

  ::step{title="Storage"}
  Venues store their VCs. Guests store theirs in a wallet app (the "user app").
  ::

  ::step{title="Presentation"}
  When booking, the agent requests relevant VCs. The guest's wallet presents them with consent. The venue's VCs are already public.
  ::

  ::step{title="Verification"}
  The agent cryptographically verifies each VC: valid signature, trusted issuer, not expired, not revoked.
  ::
::

## User app integration

The guest's wallet app is the bridge between their identity and agent actions:

| Function | What it enables |
|----------|-----------------|
| **VC storage** | Guest holds credentials they've earned |
| **Selective disclosure** | Share only what's needed (e.g., "over 18" not birthdate) |
| **Consent management** | Guest approves what the agent can share |
| **Portable identity** | Same credentials work across agents and venues |

## Privacy by design

::card-group{cols=2}
  ::card{title="Minimal disclosure" icon="ph:eye-slash"}
  Share only what's needed. Prove you're over 18 without revealing your birthdate.
  ::

  ::card{title="User consent" icon="ph:hand-palm"}
  Nothing shared without the guest's approval. The wallet asks before presenting.
  ::

  ::card{title="No central store" icon="ph:database"}
  Credentials live in the user's wallet, not a central database. No honeypot.
  ::

  ::card{title="Revocable" icon="ph:x-circle"}
  Issuers can revoke credentials. Agents check revocation status on verification.
  ::
::

::note
VCs let guests prove claims without revealing unnecessary personal data. The agent acts on verified facts, not self-assertions.
::

## Implementation

See the [Identity Specification](/reference/identity/spec) for technical details.

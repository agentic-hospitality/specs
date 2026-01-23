---
title: Threat Model
description: Security analysis for agentic booking—defences against fake venues, SEO manipulation, review fraud, and bait-and-switch attacks.
order: 4
---

# Threat Model

How the system resists spam, fake venues, and manipulation.

---

::warning
Any system that influences where people stay and spend money will attract bad actors.
::

## Threats and defences

::accordion{title="Fake venues"}
**Attack:** Create listings for venues that don't exist to collect payments.

**Defence:** Curator verification requires real-world evidence. Multiple Curator endorsement increases trust. Payment through established processors with fraud protection. Booking confirmation requires venue-side acknowledgment.
::

::accordion{title="SEO manipulation"}
**Attack:** Stuff venue descriptions with keywords to rank for queries.

**Defence:** Structured data (not free text) limits manipulation surface. Curator endorsements are for specific claims, not general ranking. Agent behaviour is agent-controlled, not venue-controlled.
::

::accordion{title="Fake Curators"}
**Attack:** Create a "Curator" that endorses fake or low-quality venues.

**Defence:** Curator reputation is earned over time. Curators must declare interests (portfolio ownership). Agents can weight Curators by track record. Bad endorsements damage Curator standing.
::

::accordion{title="Review manipulation"}
**Attack:** Fake reviews to inflate venue quality signals.

**Defence:** Evidence nodes cite sources (reviewers can verify). Multiple source requirement (not single-platform dependent). Curator assessment independent of reviews. Recency weighting (old reviews decay).
::

::accordion{title="Bait and switch"}
**Attack:** Advertise one thing, deliver another.

**Defence:** Structured commitments (not just descriptions). Post-stay feedback loops. Curator ongoing monitoring. Dispute resolution paths.
::

## Design principles

::card-group{cols=2}
  ::card{title="Multiple attestation" icon="ph:users-three"}
  No single point of trust. Convergent evidence from independent sources.
  ::

  ::card{title="Transparency" icon="ph:eye"}
  Interests declared, sources cited. Nothing hidden.
  ::

  ::card{title="Earned reputation" icon="ph:medal"}
  Trust built through behaviour over time, not self-assertion.
  ::

  ::card{title="Graceful degradation" icon="ph:shield-check"}
  System works even if some actors are bad.
  ::
::

## Full analysis

See the [Curator Threat Model](/reference/curator-threat-model) for detailed analysis.

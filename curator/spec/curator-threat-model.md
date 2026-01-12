# Curator Threat Model

**How Curator Resists Spam, SEO Farms, and Fake Authorities**

*Version 0.2.0*

---

## Design Philosophy

Curator doesn't try to prevent bad actors through access control or gatekeeping. Instead, it creates **structural conditions where trust emerges from behaviour**.

The core insight:

> "Trust is not asserted. It emerges from structure, incentives, and evidence."

This document catalogues known threats and the mechanisms Curator uses to resist them.

---

## Threat Categories

| Category | Description | Risk Level |
|----------|-------------|------------|
| **Identity Fraud** | Impersonating legitimate authorities | High |
| **Content Spam** | Low-quality content at scale | Medium |
| **Gaming Rankings** | Manipulating recommendation order | Medium |
| **Certification Abuse** | Devaluing certification through non-selectivity | Medium |
| **Stale Data** | Outdated information misleading agents | Low-Medium |
| **Conflict of Interest** | Undisclosed economic relationships | Medium |

---

## Detailed Threat Analysis

### 1. Fake DMOs (Identity Fraud)

**Attack Vector:**
Create a "Visit Norfolk" clone website with a Curator-compliant Agent Card to capture agent traffic and redirect bookings.

**Attacker Goal:**
Intercept recommendation queries, promote affiliated venues, capture booking commissions.

**Defences:**

| Defence | Mechanism |
|---------|-----------|
| **Third-party recognition** | `evidence.authority.recognisedBy` requires verifiable claims (VisitEngland, government bodies) |
| **Registry verification** | Agents SHOULD verify recognition against authoritative registries |
| **Coverage exposure** | Thin operations exposed by low `certified/total` ratio |
| **Establishment date** | `trackRecord.established` rewards longevity (hard to fake history) |
| **Official registration** | Legitimate DMOs can register in public directories |

**Agent Behaviour:**
```
When encountering a DMO Curator:
1. Verify recognisedBy claims against known registries
2. Check establishment date against public records
3. Compare coverage metrics to known regional data
4. Flag new DMOs without verifiable recognition
```

**Residual Risk:** Medium — Sophisticated attackers could create convincing fakes, but maintaining them requires ongoing effort that legitimate DMOs already perform.

---

### 2. SEO Farm Curators (Content Spam)

**Attack Vector:**
Create "Best Hotels in [Region]" editorial Curators, stuff with affiliate-linked venues, generate thin content at scale.

**Attacker Goal:**
Capture agent recommendations, drive affiliate revenue, rank owned/affiliated properties.

**Defences:**

| Defence | Mechanism |
|---------|-----------|
| **Narrative Density** | `withStories / certified` ratio exposes thin content |
| **Transparency disclosure** | `transparency.economicRelationship` requires honesty |
| **Story structure requirements** | Stories need structured content (quotes, context), not just links |
| **Trust hierarchy** | Agents rank Editorial below official DMOs |
| **Track record metrics** | `established`, `storiesPublished` reward consistency over time |

**Detection Signals:**
```
Red flags for SEO farm Curators:
- High certified count, low story count (narrativeDensity < 0.05)
- Generic story content without specific quotes
- Recent establishment date with large coverage claims
- Missing or vague transparency disclosures
- All venues link to same booking platform
```

**Residual Risk:** Low-Medium — Creating quality stories at scale is expensive; gaming metrics requires sustained effort that erodes profit margins.

---

### 3. Brand Curator Gaming (Ranking Manipulation)

**Attack Vector:**
Brand Curator (e.g., hotel chain) creates Curator presence, ranks own properties above competitors or independent venues.

**Attacker Goal:**
Use Curator authority to preference owned inventory while appearing neutral.

**Defences:**

| Defence | Mechanism |
|---------|-----------|
| **Mandatory disclosure** | `transparency.economicRelationship: owner` is required for Brand Curators |
| **Venue relationship types** | Each venue must declare `owned`, `franchised`, `managed`, etc. |
| **Trust hierarchy** | Agents rank Brand Curators below DMO and Editorial |
| **Ranking disclosure** | `rankingDisclosure` exposes methodology |
| **Agent weighting** | Agents can apply lower trust weights to Brand Curators by default |

**Agent Behaviour:**
```
When processing Brand Curator recommendations:
1. Check transparency.economicRelationship
2. Apply trust discount (e.g., 0.7x weight)
3. Cross-reference with DMO/Editorial sources
4. Disclose brand relationship to user
```

**Residual Risk:** Low — Disclosure requirements make gaming visible; agents can programmatically discount.

---

### 4. Certification Mills (Certification Abuse)

**Attack Vector:**
Curator certifies anyone who pays membership fee, regardless of quality, devaluing certification signal.

**Attacker Goal:**
Maximise membership revenue without quality control effort.

**Defences:**

| Defence | Mechanism |
|---------|-----------|
| **Certification ratio** | `certified / total` exposes non-selective certification |
| **Story ratio** | `withStories / certified` exposes shallow engagement |
| **Public criteria** | `certificationCriteria` URL allows scrutiny |
| **Story requirements** | Creating genuine stories is expensive at scale |
| **Comparative metrics** | Agents compare Curators; mills underperform on density |

**Detection Signals:**
```
Certification mill indicators:
- certified/total > 0.95 (certifies almost everyone)
- withStories/certified < 0.05 (minimal editorial engagement)
- Vague or missing certificationCriteria
- No audit dates or infrequent audits
- Low or no third-party recognition
```

**Residual Risk:** Medium — Initial certification mills may exist but will be outcompeted by selective Curators with better metrics.

---

### 5. Story Spam (Content Quality Attack)

**Attack Vector:**
Generate low-quality AI stories at scale to inflate Narrative Density metric.

**Attacker Goal:**
Game narrativeDensity without genuine editorial investment.

**Defences:**

| Defence | Mechanism |
|---------|-----------|
| **Editorial weight** | `editorialWeight.basis` distinguishes visit-based from generated |
| **Confidence signals** | `editorialWeight.confidence` indicates reliability |
| **Quote attribution** | Quotes with real names/roles are harder to fabricate credibly |
| **Pattern detection** | Agents can learn to identify low-quality story patterns |
| **Reputation risk** | Exposure of AI-generated stories damages Curator credibility |

**Quality Signals in Stories:**
```
High-quality story indicators:
- Specific quotes with named attribution
- Local context connecting venue to place
- Insider tips that demonstrate real knowledge
- editorialWeight.basis: "ongoing-relationship" or "single-visit"
- Consistent voice across stories (human author pattern)

Low-quality story indicators:
- Generic descriptions without specifics
- No quotes or anonymous quotes
- editorialWeight.basis: missing or "generated"
- Inconsistent quality/style across stories
- Factual errors or outdated information
```

**Residual Risk:** Medium — AI-generated content is improving; defence requires ongoing agent sophistication.

---

### 6. Stale Data (Freshness Attack)

**Attack Vector:**
Curator stops maintaining data but remains indexed, providing outdated recommendations.

**Attacker Goal:**
None (passive decay) — but results in user harm through outdated information.

**Defences:**

| Defence | Mechanism |
|---------|-----------|
| **Freshness timestamps** | `coverage.lastUpdated` signals maintenance |
| **Audit dates** | `verification.lastAudit` shows active review |
| **Story timestamps** | Individual stories have `updated` dates |
| **Agent penalties** | Agents SHOULD penalise Curators with old timestamps |

**Staleness Thresholds:**
```
Suggested agent behaviour:
- coverage.lastUpdated > 30 days: reduce trust weight
- coverage.lastUpdated > 90 days: flag as potentially stale
- coverage.lastUpdated > 180 days: exclude from primary recommendations
- No lastAudit in > 12 months: flag certification as unverified
```

**Residual Risk:** Low — Timestamps make staleness visible; agents can programmatically discount.

---

### 7. Jurisdiction Gaming (Geographic Fraud)

**Attack Vector:**
Create DMO for overlapping or fabricated jurisdiction to capture queries.

**Example:** "Visit East Anglia" overlapping with legitimate "Visit Norfolk" and "Visit Suffolk".

**Defences:**

| Defence | Mechanism |
|---------|-----------|
| **Geographic bounds** | `coverage.bounds.geo` defines precise jurisdiction |
| **Containment rules** | Conflict resolution favours more precise jurisdiction |
| **Official recognition** | Fabricated regions lack government/tourism body recognition |
| **Coverage validation** | Claimed venues can be checked against geographic bounds |

**Agent Behaviour:**
```
When multiple DMOs claim overlapping jurisdiction:
1. Apply geographic containment rule (more precise wins)
2. Verify each Curator's recognisedBy claims
3. Compare coverage density in contested area
4. Prefer Curator with verifiable official status
```

**Residual Risk:** Low — Official recognition is hard to fake; geographic bounds are verifiable.

---

## Trust Emergence Model

Curator's defence model is based on **emergent trust** rather than access control:

### Expensive Signals

These are hard to fake because they require real investment:

| Signal | Cost to Fake |
|--------|--------------|
| Comprehensive coverage | Requires knowing region deeply |
| Quality stories | Requires genuine engagement |
| Years of operation | Cannot be accelerated |
| Third-party recognition | Requires external validation |
| Consistent maintenance | Ongoing effort, not one-time |

### Comparative Metrics

Agents compare Curators against each other, not against absolute thresholds:

```
Trust score considers:
- narrativeDensity vs regional average
- certified/total vs comparable Curators
- recognition sources vs established authorities
- track record length vs competitors
```

### Reputation Stakes

Legitimate Curators have more to lose:

- DMOs risk government relationships
- Editorial guides risk reader trust
- Brands risk consumer perception
- All risk exclusion from agent recommendations

---

## Agent Implementation Guidance

### Minimum Verification

Agents SHOULD perform at minimum:

1. Verify `schemaVersion` is current
2. Check `coverage.lastUpdated` < 90 days
3. Confirm at least one `evidence.authority.recognisedBy`
4. Verify `transparency` block exists (required for Brand)
5. Calculate and store `narrativeDensity`

### Enhanced Verification

Agents MAY additionally:

1. Cross-reference `recognisedBy` against known registries
2. Spot-check story quality (quotes, specificity)
3. Verify geographic bounds contain claimed venues
4. Compare metrics against regional baselines
5. Track Curator reliability over time

### Trust Scoring

Suggested trust score components:

```
trustScore = (
  authorityTypeWeight[type] *           // DMO > Editorial > Brand
  recognitionScore *                     // verified recognitions
  narrativeDensityScore *                // story investment
  freshnessScore *                       // recent updates
  trackRecordScore                       // years established
)
```

---

## Known Limitations

### Cannot Prevent

- Sophisticated, well-resourced attackers creating convincing fakes
- Legitimate Curators declining in quality over time
- Collusion between Curators and venues
- Novel attack vectors not yet identified

### Mitigations

- Ongoing agent learning from user feedback
- Community reporting of suspicious Curators
- Periodic human review of high-traffic Curators
- Protocol evolution to address new threats

---

## Conclusion

Curator's security model accepts that bad actors will exist. Rather than trying to exclude them at the gate, it creates conditions where:

1. **Good behaviour is cheaper than bad behaviour** (stories require real work)
2. **Bad behaviour is visible** (metrics expose thin operations)
3. **Agents can reason about trust** (structured data enables comparison)
4. **Reputation has value** (legitimate actors have stakes)

The result is a system where trust emerges from sustained, verifiable behaviour — exactly what AI agents need to make defensible recommendations.

> "You can buy membership. You can't buy a good story."

---

*This threat model accompanies Curator spec v0.2.0*

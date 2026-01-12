Curator for DMOs
If you're a destination marketing organisation, regional tourism board, or hospitality authority, you're a natural Curator.

What a Curator is
A Curator is an authority that can answer questions about venues in a region or collection.
AI agents making recommendations need third-party signals — not just what venues say about themselves. Your knowledge becomes evidence they can cite.

What you'd publish
A Curator manifest at /.well-known/curator.json containing:
json{
  "id": "visit-norfolk",
  "type": "dmo",
  "name": "Visit Norfolk",
  "jurisdiction": {
    "type": "region",
    "name": "Norfolk",
    "country": "GB"
  },
  "venues": [
    {
      "id": "the-hoste",
      "venueEndpoint": "https://thehoste.com/.well-known/venue.json",
      "certification": {
        "status": "verified",
        "verifiedAt": "2025-11-15"
      }
    }
  ],
  "stories": {
    "endpoint": "https://visitnorfolk.co.uk/api/stories"
  }
}

Three things you provide
1. Certification
You verify venues exist and meet your standards. This becomes evidence:
json{
  "certification": {
    "status": "verified",
    "verifiedBy": "did:web:visitnorfolk.co.uk",
    "verifiedAt": "2025-11-15",
    "methodology": "site-visit"
  }
}
2. Stories
Local knowledge that only you have. Why the chef sources from that farm. What happens at the bar on Friday nights. Who actually comes here.
json{
  "story": {
    "venue": "the-hoste",
    "title": "The dog that greets you at breakfast",
    "content": "...",
    "capturedBy": "did:web:visitnorfolk.co.uk",
    "capturedAt": "2025-11-15"
  }
}
Stories become evidence AI agents cite when explaining recommendations.
3. Answers
AI agents can query you directly: "Dog-friendly hotel near the coast?" Your response draws on everything you know.

How agents use this
Agent receives: "Where should I stay in Norfolk with my dog?"
    │
    ▼
Agent queries Visit Norfolk Curator
    │
    ▼
Curator returns: venues with dog-friendly certification + stories
    │
    ▼
Agent recommends with citation: "Visit Norfolk suggests The Hoste — 
they note the resident dog greets guests at breakfast"
Your expertise flows into the recommendation. You're cited as the source.

What you control

Your data stays on your infrastructure
You decide which venues to certify
You decide what stories to tell
You set your verification methodology

Curator is a specification, not a platform. You publish; agents query.

Getting started

Read the Curator specification
Publish a manifest at /.well-known/curator.json
Add venue certifications
Add stories as you capture them

Start with a handful of venues. The structure matters more than completeness.

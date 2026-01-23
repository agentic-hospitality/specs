# Agentic Booking Schemas

TypeScript type definitions for the Agentic Booking specifications.

## Usage

### TypeScript

```typescript
import type { Venue, Stay, Folio, Curator } from '@agentic-booking/schemas';

const venue: Venue = {
  id: 'the-roste-burnton',
  name: 'The Roste',
  type: 'hotel',
  identity: {
    ref: 'https://theroste.co.uk/.well-known/agent.json'
  },
  location: {
    address: {
      locality: 'Burnton',
      country: 'GB'
    }
  }
};
```

### Generate JSON Schema

```bash
npm install
npm run generate:all
```

This creates JSON Schema files in `./generated/` for use with validators.

## Files

| File | Description |
|------|-------------|
| `common.ts` | Shared types (Money, Address, etc.) |
| `bookable.ts` | Base bookable entity pattern |
| `venue.ts` | Hospitality venue types |
| `curator.ts` | Discovery and trust layer |
| `stay.ts` | Booking lifecycle |
| `folio.ts` | Payment semantics |

## License

MIT

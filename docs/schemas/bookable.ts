/**
 * Bookable Specification
 * Base pattern for AI-bookable entities
 *
 * @see https://agenticbooking.org/reference/bookable/spec
 */

import type { URI, Contact, Address, Coordinates } from './common';

/** Base bookable entity - anything an AI agent can book */
export interface Bookable {
  /** Unique identifier */
  id: string;

  /** Human-readable name */
  name: string;

  /** Entity type */
  type: string;

  /** Canonical identity reference */
  identity: BookableIdentity;

  /** What this entity offers */
  capabilities?: BookableCapabilities;
}

/** Identity block for discovery and verification */
export interface BookableIdentity {
  /** URI to agent.json discovery document */
  ref: URI;

  /** Registered legal name */
  legal_name?: string;

  /** Business registration number */
  registration_number?: string;

  /** Tax identification */
  tax_id?: string;
}

/** What a bookable entity can do */
export interface BookableCapabilities {
  /** Supported booking methods */
  booking_methods?: BookingMethod[];

  /** Supported payment methods */
  payment_methods?: string[];

  /** Languages supported */
  languages?: string[];

  /** Timezone */
  timezone?: string;
}

/** How bookings can be made */
export interface BookingMethod {
  /** Method type */
  type: 'mcp' | 'rest' | 'email' | 'phone';

  /** Endpoint or contact for this method */
  endpoint?: string;

  /** Whether this is the preferred method */
  preferred?: boolean;
}

/** Discovery document at /.well-known/agent.json */
export interface AgentDiscoveryDocument {
  /** Schema version */
  schema_version: string;

  /** Entity name */
  name: string;

  /** Entity type */
  type: string;

  /** Location information */
  location?: {
    address?: Address;
    coordinates?: Coordinates;
  };

  /** Contact information */
  contact?: Contact;

  /** MCP server configuration */
  mcp?: {
    endpoint: URI;
    transport: 'sse' | 'stdio' | 'websocket';
    authentication?: {
      type: string;
      [key: string]: unknown;
    };
  };

  /** Available tools */
  tools?: string[];

  /** Link to full catalog */
  catalog_url?: URI;

  /** Curator endorsements */
  curators?: URI[];
}

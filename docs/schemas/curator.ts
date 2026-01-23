/**
 * Curator Specification
 * Discovery and trust layer for AI booking
 *
 * @see https://agenticbooking.org/reference/curator/spec
 */

import type { URI, ISODateTime, Coordinates } from './common';

/** Curator - entity that maintains verified venue collections */
export interface Curator {
  /** Unique identifier */
  id: string;

  /** Display name */
  name: string;

  /** Curator type */
  type: CuratorType;

  /** Geographic or thematic jurisdiction */
  jurisdiction: CuratorJurisdiction;

  /** How this curator verifies venues */
  verification_methods?: VerificationMethod[];

  /** Public commitments */
  principles?: URI;

  /** Contact for disputes/corrections */
  contact?: {
    email?: string;
    disputes_url?: URI;
  };

  /** Venues in this curator's collection */
  venues?: VenueReference[];
}

/** Types of curators */
export type CuratorType =
  | 'dmo'           // Destination Marketing Organization
  | 'portfolio'     // Hotel group, restaurant chain
  | 'editorial'     // Guide, review platform
  | 'certification' // Standards body
  | 'aggregator';   // Technical aggregator

/** Curator's area of authority */
export interface CuratorJurisdiction {
  /** Geographic scope */
  geographic?: {
    /** Country codes */
    countries?: string[];
    /** Region names */
    regions?: string[];
    /** Bounding box */
    bounds?: {
      ne: Coordinates;
      sw: Coordinates;
    };
  };

  /** Thematic scope */
  thematic?: {
    /** Venue types covered */
    venue_types?: string[];
    /** Special focus areas */
    specializations?: string[];
  };
}

/** How a curator verifies venue claims */
export interface VerificationMethod {
  /** Method identifier */
  id: string;

  /** Human-readable name */
  name: string;

  /** What this method verifies */
  verifies: string[];

  /** How often re-verification occurs */
  frequency?: 'continuous' | 'annual' | 'on_change' | 'once';

  /** Description of the process */
  description?: string;
}

/** Reference to a venue in curator's collection */
export interface VenueReference {
  /** URI to venue's agent.json */
  ref: URI;

  /** Curator's local identifier for this venue */
  local_id?: string;

  /** When this venue was added */
  added_at?: ISODateTime;

  /** When last verified */
  verified_at?: ISODateTime;

  /** Verification status */
  status?: 'verified' | 'pending' | 'suspended';

  /** Curator's endorsement level */
  endorsement?: {
    level?: 'listed' | 'verified' | 'recommended' | 'featured';
    badges?: string[];
    notes?: string;
  };
}

/** Curator Index - discovery layer for finding curators */
export interface CuratorIndex {
  /** Index identifier */
  id: string;

  /** Index name */
  name: string;

  /** Index operator */
  operator: {
    name: string;
    contact?: string;
  };

  /** Inclusion criteria - how curators get listed */
  inclusion_criteria?: string;

  /** Curators in this index */
  curators: CuratorIndexEntry[];
}

/** Entry in a curator index */
export interface CuratorIndexEntry {
  /** URI to curator's discovery document */
  ref: URI;

  /** Curator type */
  type: CuratorType;

  /** Geographic coverage summary */
  coverage?: {
    countries?: string[];
    regions?: string[];
  };

  /** When indexed */
  indexed_at?: ISODateTime;
}

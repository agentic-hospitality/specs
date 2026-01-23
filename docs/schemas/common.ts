/**
 * Common types used across Agentic Booking specifications
 */

/** Monetary amount with currency */
export interface Money {
  /** Amount in minor units (e.g., pence, cents) */
  amount: number;
  /** ISO 4217 currency code */
  currency: string;
}

/** Geographic coordinates */
export interface Coordinates {
  /**
   * Latitude in decimal degrees
   * @minimum -90
   * @maximum 90
   */
  latitude: number;
  /**
   * Longitude in decimal degrees
   * @minimum -180
   * @maximum 180
   */
  longitude: number;
}

/** Physical address */
export interface Address {
  street?: string;
  locality: string;
  region?: string;
  postal_code?: string;
  country: string;
}

/** Contact information */
export interface Contact {
  email?: string;
  phone?: string;
  website?: string;
}

/** ISO 8601 date string (YYYY-MM-DD) */
export type ISODate = string;

/** ISO 8601 datetime string */
export type ISODateTime = string;

/** URI reference to another entity */
export type URI = string;

/** Evidence source for a claim */
export interface EvidenceSource {
  /** Source type */
  type: 'third_party' | 'human_observation' | 'self_report' | 'curator_certification' | 'derived';
  /** Where the evidence came from */
  origin?: string;
  /** When captured */
  captured_at?: ISODateTime;
  /**
   * Confidence level
   * @minimum 0
   * @maximum 1
   */
  confidence?: number;
}

/** Actor identifier pattern */
export type Actor =
  | `agent:${string}`
  | `user`
  | `system`
  | `payment:${string}`
  | `venue`
  | `pms:${string}`;

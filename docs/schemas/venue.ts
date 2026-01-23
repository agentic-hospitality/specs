/**
 * Venue Specification
 * Hospitality extension for hotels, restaurants, bars
 *
 * @see https://agenticbooking.org/reference/venue/spec
 */

import type { URI, Money, Address, Coordinates, Contact, EvidenceSource, ISODate } from './common';
import type { Bookable, BookableIdentity } from './bookable';

/** Hospitality venue - hotel, restaurant, or bar */
export interface Venue extends Bookable {
  type: 'hotel' | 'restaurant' | 'bar' | 'pub' | 'cafe';

  /** Physical location */
  location: VenueLocation;

  /** Contact information */
  contact?: Contact;

  /** Bookable units (rooms, tables, etc.) */
  units?: Unit[];

  /** Venue-level facilities */
  facilities?: Facility[];

  /** Operating hours */
  hours?: OperatingHours;

  /** Evidence-backed claims */
  evidence?: VenueEvidence;

  /** What this venue is NOT good for */
  weak_fit?: string[];
}

/** Venue location details */
export interface VenueLocation {
  address: Address;
  coordinates?: Coordinates;

  /** What3Words address */
  what3words?: string;

  /** Directions or access notes */
  directions?: string;
}

/** Bookable unit within a venue */
export interface Unit {
  /** Unique identifier within venue */
  id: string;

  /** Display name */
  name: string;

  /** Unit type */
  type: 'room' | 'table' | 'space' | 'seat';

  /** Description */
  description?: string;

  /** Maximum occupancy */
  capacity?: {
    /**
     * Minimum occupancy
     * @minimum 1
     */
    min?: number;
    /**
     * Maximum occupancy
     * @minimum 1
     */
    max: number;
  };

  /** Pricing */
  rate?: {
    amount: Money;
    per: 'night' | 'hour' | 'person' | 'booking';
  };

  /** Unit-specific amenities (use CommonAmenity values or custom strings) */
  amenities?: Amenity[];

  /** Accessibility features (use CommonAccessibility values or custom strings) */
  accessibility?: AccessibilityFeature[];

  /** Media */
  images?: MediaItem[];
}

/** Facility available at venue level */
export interface Facility {
  /** Facility identifier */
  id: string;

  /** Display name */
  name: string;

  /** Category */
  category: 'dining' | 'wellness' | 'business' | 'leisure' | 'accessibility' | 'parking';

  /** Description */
  description?: string;

  /** Whether advance booking required */
  requires_booking?: boolean;

  /** Additional charge */
  charge?: Money | 'included' | 'on_request';
}

/** Operating hours */
export interface OperatingHours {
  /** Default hours by day */
  regular?: {
    [day: string]: DayHours;
  };

  /** Special dates */
  exceptions?: {
    date: ISODate;
    hours?: DayHours;
    closed?: boolean;
    reason?: string;
  }[];
}

/** Hours for a single day */
export interface DayHours {
  open: string;  // HH:MM format
  close: string; // HH:MM format
  breaks?: { from: string; to: string }[];
}

/** Media item */
export interface MediaItem {
  url: URI;
  type: 'image' | 'video';
  alt?: string;
  caption?: string;
}

/** Evidence-backed claims about venue */
export interface VenueEvidence {
  /** Pet policy with evidence */
  pets?: EvidencedClaim<PetPolicy>;

  /** Dining options with evidence */
  dining?: EvidencedClaim<DiningInfo>;

  /** Atmosphere/vibe with evidence */
  vibe?: EvidencedClaim<VibeInfo>;

  /** Accessibility with evidence */
  accessibility?: EvidencedClaim<AccessibilityInfo>;
}

/** A claim with its evidence source */
export interface EvidencedClaim<T> {
  /** The claim data */
  data: T;

  /** Evidence supporting this claim */
  source: EvidenceSource;
}

/** Pet policy details */
export interface PetPolicy {
  allowed: boolean;
  restrictions?: string[];
  fee?: Money;
  notes?: string;
}

/** Dining information */
export interface DiningInfo {
  cuisine?: string[];
  dietary_options?: string[];
  meal_periods?: ('breakfast' | 'lunch' | 'dinner')[];
  reservation_required?: boolean;
}

/** Vibe/atmosphere information */
export interface VibeInfo {
  ambiance?: string[];
  noise_level?: 'quiet' | 'moderate' | 'lively';
  dress_code?: string;
  good_for?: string[];
}

/** Accessibility information */
export interface AccessibilityInfo {
  wheelchair_accessible?: boolean;
  features?: AccessibilityFeature[];
  notes?: string;
}

/**
 * Common amenities (extensible - custom strings also allowed)
 * Based on schema.org/LocationFeatureSpecification
 */
export type CommonAmenity =
  | 'wifi'
  | 'parking'
  | 'air_conditioning'
  | 'heating'
  | 'tv'
  | 'minibar'
  | 'safe'
  | 'desk'
  | 'coffee_maker'
  | 'kettle'
  | 'iron'
  | 'hairdryer'
  | 'toiletries'
  | 'bathrobe'
  | 'slippers'
  | 'balcony'
  | 'terrace'
  | 'sea_view'
  | 'garden_view'
  | 'pool_access'
  | 'gym_access'
  | 'spa_access'
  | 'room_service'
  | 'breakfast_included'
  | 'kitchen'
  | 'kitchenette'
  | 'washer'
  | 'dryer';

/** Amenity - use CommonAmenity values or custom strings */
export type Amenity = CommonAmenity | string;

/**
 * Common accessibility features (extensible - custom strings also allowed)
 */
export type CommonAccessibility =
  | 'wheelchair_accessible'
  | 'step_free_access'
  | 'elevator'
  | 'accessible_bathroom'
  | 'grab_rails'
  | 'roll_in_shower'
  | 'lowered_sink'
  | 'visual_aids'
  | 'hearing_loop'
  | 'braille_signage'
  | 'service_animals_welcome'
  | 'accessible_parking';

/** Accessibility feature - use CommonAccessibility values or custom strings */
export type AccessibilityFeature = CommonAccessibility | string;

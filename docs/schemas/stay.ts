/**
 * Stay Specification
 * Booking lifecycle state machine
 *
 * @see https://agenticbooking.org/reference/stay/spec
 */

import type { URI, Money, ISODate, ISODateTime, Actor } from './common';

/** Stay - a hospitality booking through its lifecycle */
export interface Stay {
  /**
   * Unique identifier
   * @pattern ^stay_[a-z0-9]+$
   */
  id: string;

  /** Current lifecycle state */
  status: StayStatus;

  /** When created */
  created_at?: ISODateTime;

  /** When last updated */
  updated_at?: ISODateTime;

  /** Venue being booked */
  venue: {
    /** Venue identifier */
    id: string;
    /** URI to venue's agent.json */
    ref: URI;
    /** Venue type (for restaurants, etc.) */
    type?: string;
  };

  /** Booking dates */
  dates: StayDates;

  /** Guest information */
  guests: GuestInfo;

  /** Booked units */
  units?: BookedUnit[];

  /** Payment information */
  payment?: StayPayment;

  /** Arrival/departure details */
  arrival?: {
    checked_in_at?: ISODateTime;
    room_assigned?: string;
  };

  departure?: {
    checked_out_at?: ISODateTime;
  };

  /** Modification record */
  modification?: StayModification;

  /** Cancellation record */
  cancellation?: StayCancellation;

  /** No-show record */
  no_show?: StayNoShow;

  /** Immutable audit trail */
  history: StayHistoryEntry[];
}

/** Primary stay states */
export type StayStatus =
  | 'request'     // Availability query initiated
  | 'available'   // Can be booked
  | 'unavailable' // Cannot be booked
  | 'held'        // Temporarily reserved
  | 'booked'      // Booking created, awaiting payment
  | 'confirmed'   // Deposit received
  | 'balanced'    // Full payment received
  | 'arrived'     // Checked in
  | 'stayed'      // Checked out
  | 'completed'   // Stay closed
  | 'modified'    // Booking changed (branch state)
  | 'cancelled'   // Booking cancelled (branch state)
  | 'no_show';    // Guest did not arrive (branch state)

/** Booking date information */
export interface StayDates {
  /** Check-in date */
  check_in: ISODate;

  /** Check-out date */
  check_out: ISODate;

  /** Number of nights (0 for same-day like restaurants) */
  nights: number;

  /** Time for same-day bookings (restaurants) */
  time?: string;

  /** Duration in minutes (restaurants) */
  duration_minutes?: number;
}

/** Guest information */
export interface GuestInfo {
  /**
   * Number of adults
   * @minimum 1
   */
  adults: number;

  /**
   * Number of children
   * @minimum 0
   */
  children?: number;

  /** Guest names */
  names?: GuestName[];
}

/** Guest name */
export interface GuestName {
  first: string;
  last: string;
  primary?: boolean;
}

/** Booked unit details */
export interface BookedUnit {
  /** Unit identifier */
  id: string;

  /** Unit name */
  name: string;

  /** Quantity booked */
  quantity?: number;

  /** Rate at time of booking */
  rate?: {
    amount: Money;
    per: 'night' | 'hour' | 'person' | 'booking';
  };

  /** For restaurant tables */
  covers?: number;
}

/** Payment state within a stay */
export interface StayPayment {
  /** Total amount */
  total: Money;

  /** Deposit payment */
  deposit?: {
    amount: Money;
    status: PaymentStatus;
    captured_at?: ISODateTime;
    note?: string;
  };

  /** Balance payment */
  balance?: {
    amount: Money;
    status: PaymentStatus;
    due_date?: ISODate;
  };
}

/** Payment status values */
export type PaymentStatus = 'pending' | 'captured' | 'failed' | 'refunded';

/** Record of a booking modification */
export interface StayModification {
  modified_at: ISODateTime;
  modified_by: Actor;
  changes: FieldChange[];
  price_difference?: Money;
}

/** A single field change */
export interface FieldChange {
  field: string;
  from: unknown;
  to: unknown;
}

/** Record of a cancellation */
export interface StayCancellation {
  cancelled_at: ISODateTime;
  cancelled_by: Actor | 'user';
  reason?: string;
  days_before_check_in: number;
  refund?: {
    amount: Money;
    percent: number;
    status: 'pending' | 'processed' | 'failed';
  };
}

/** Record of a no-show */
export interface StayNoShow {
  detected_at: ISODateTime;
  hours_after_check_in: number;
  charge?: {
    amount: Money;
    percent: number;
    status: PaymentStatus;
  };
}

/** Audit trail entry */
export interface StayHistoryEntry {
  timestamp: ISODateTime;
  from_status: StayStatus | null;
  to_status: StayStatus;
  actor: Actor;
  details?: Record<string, unknown>;
}

/** Temporary hold on inventory */
export interface Hold {
  /** Hold identifier */
  id: string;

  /** Associated stay */
  stay_id: string;

  /** Hold status */
  status: 'active' | 'converted' | 'expired' | 'cancelled';

  /** When hold expires */
  expires_at: ISODateTime;

  /** Hold duration */
  duration_minutes: number;
}

/** Webhook event types */
export type StayWebhookType =
  | 'stay.created'
  | 'stay.status_changed'
  | 'stay.modified'
  | 'stay.cancelled'
  | 'stay.no_show'
  | 'hold.created'
  | 'hold.expired';

/** Base webhook payload */
export interface StayWebhookBase {
  stay_id: string;
  timestamp: ISODateTime;
}

/** Webhook: stay.created */
export interface StayCreatedWebhook extends StayWebhookBase {
  type: 'stay.created';
  venue_id: string;
  check_in: ISODate;
  check_out: ISODate;
}

/** Webhook: stay.status_changed */
export interface StayStatusChangedWebhook extends StayWebhookBase {
  type: 'stay.status_changed';
  from_status: StayStatus;
  to_status: StayStatus;
  actor: Actor;
}

/** Webhook: stay.modified */
export interface StayModifiedWebhook extends StayWebhookBase {
  type: 'stay.modified';
  changes: FieldChange[];
  price_difference?: Money;
}

/** Webhook: stay.cancelled */
export interface StayCancelledWebhook extends StayWebhookBase {
  type: 'stay.cancelled';
  cancelled_by: Actor | 'user';
  refund?: {
    amount: Money;
    status: 'pending' | 'processed';
  };
}

/** Webhook: stay.no_show */
export interface StayNoShowWebhook extends StayWebhookBase {
  type: 'stay.no_show';
  hours_after_check_in: number;
  charge?: {
    amount: Money;
    status: PaymentStatus;
  };
}

/** Webhook: hold.created */
export interface HoldCreatedWebhook extends StayWebhookBase {
  type: 'hold.created';
  hold_id: string;
  expires_at: ISODateTime;
}

/** Webhook: hold.expired */
export interface HoldExpiredWebhook extends StayWebhookBase {
  type: 'hold.expired';
  hold_id: string;
}

/** Union of all webhook payloads */
export type StayWebhook =
  | StayCreatedWebhook
  | StayStatusChangedWebhook
  | StayModifiedWebhook
  | StayCancelledWebhook
  | StayNoShowWebhook
  | HoldCreatedWebhook
  | HoldExpiredWebhook;

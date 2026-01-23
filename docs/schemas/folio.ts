/**
 * Folio Specification
 * Payment semantics for hospitality bookings
 *
 * @see https://agenticbooking.org/reference/folio/spec
 */

import type { URI, Money, ISODate, ISODateTime } from './common';

/** Folio - financial terms of a booking */
export interface Folio {
  /** URI to venue's agent.json */
  venue_ref: URI;

  /** Stay dates this folio covers */
  stay_dates: {
    check_in: ISODate;
    check_out: ISODate;
  };

  /** When payments are due */
  payment_schedule: PaymentScheduleItem[];

  /** Refund terms */
  cancellation_policy: CancellationPolicy;

  /** What happens on no-show */
  no_show_policy?: NoShowPolicy;

  /** Rules for modifications */
  modification_policy?: ModificationPolicy;
}

/** A scheduled payment */
export interface PaymentScheduleItem {
  /** Payment type */
  type: PaymentType;

  /** Amount to charge */
  amount: Money;

  /** When payment is due */
  due: PaymentDue;

  /** Computed due date (for relative dues) */
  due_date?: ISODate;

  /** Current status */
  status: PaymentItemStatus;

  /** When captured */
  captured_at?: ISODateTime;

  /** Whether this charge is refundable */
  refundable?: boolean;

  /** Additional notes */
  note?: string;
}

/** Types of payments */
export type PaymentType =
  | 'verification'  // Small charge to confirm card validity
  | 'deposit'       // Partial payment at booking
  | 'balance'       // Remaining payment
  | 'full_payment'  // Full amount at once
  | 'incidentals';  // Additional charges during stay

/**
 * When a payment is due.
 * Use semantic values or N_days_before pattern (e.g., "7_days_before", "14_days_before")
 */
export type PaymentDue =
  | 'on_booking'       // Charge immediately
  | 'on_arrival'       // Charge at check-in
  | 'on_departure'     // Charge at check-out
  | '7_days_before'    // Common: 7 days before check-in
  | '14_days_before'   // Common: 14 days before check-in
  | '30_days_before'   // Common: 30 days before check-in
  | RelativeDue        // Pattern: N_days_before
  | ISODate;           // Specific date (YYYY-MM-DD)

/**
 * Relative due date pattern
 * @pattern ^[0-9]+_days_before$
 */
export type RelativeDue = string;

/** Payment item status */
export type PaymentItemStatus =
  | 'pending'
  | 'captured'
  | 'failed'
  | 'refunded'
  | 'partially_refunded';

/** Cancellation policy with tiered refunds */
export interface CancellationPolicy {
  /** SHA-256 hash of policy JSON for immutability proof */
  policy_hash?: string;

  /** Refund tiers */
  tiers: CancellationTier[];
}

/** A cancellation refund tier */
export interface CancellationTier {
  /**
   * Days before check-in (use this OR hours_before)
   * @minimum 0
   */
  days_before?: number;

  /**
   * Hours before check-in (for restaurants)
   * @minimum 0
   */
  hours_before?: number;

  /**
   * Refund percentage at this tier
   * @minimum 0
   * @maximum 100
   */
  refund_percent: number;
}

/** No-show policy */
export interface NoShowPolicy {
  /**
   * Percentage of booking to charge on no-show
   * @minimum 0
   * @maximum 100
   */
  charge_percent: number;

  /**
   * Hours after check-in time before no-show is detected
   * @minimum 0
   */
  detect_after_hours: number;

  /** How no-show is proven */
  proof_method: NoShowProofMethod;
}

/** Methods to prove no-show */
export type NoShowProofMethod =
  | 'pms_attestation'        // Signed record from PMS
  | 'keycard_inactive'       // No room key activated
  | 'checkin_system_log'     // Timestamped check-in records
  | 'front_desk_declaration'; // Staff attestation

/** Modification policy */
export interface ModificationPolicy {
  /** Whether modifications are allowed */
  allowed: boolean;

  /** Fee for modifications */
  fee?: Money;

  /** Restrictions on modifications */
  restrictions?: ModificationRestriction[];

  /** Whether mandate needs re-signing if total increases */
  requires_mandate_amendment_if_increase?: boolean;
}

/** Modification restrictions */
export type ModificationRestriction =
  | 'no_date_change_within_7_days'
  | 'no_date_change_within_14_days'
  | 'no_room_downgrade'
  | 'no_guest_reduction'
  | string;

/** Mandate for authorized charges (AP2 integration) */
export interface AuthorizedCharges {
  charges: AuthorizedCharge[];
}

/** A single authorized charge */
export interface AuthorizedCharge {
  /** Charge type */
  type: PaymentType | 'no_show';

  /** Maximum amount authorized */
  max_amount: Money;

  /** When this charge becomes valid */
  valid_from?: ISODate | ISODateTime;

  /** When this authorization expires */
  valid_until?: ISODate | ISODateTime;
}

/** Cancellation event record */
export interface CancellationRecord {
  cancelled_at: ISODateTime;
  days_before_check_in: number;
  tier_applied: CancellationTier;
  refund?: {
    amount: Money;
    status: 'pending' | 'processed' | 'failed';
  };
  retained?: Money;
}

/** No-show event record */
export interface NoShowRecord {
  detected_at: ISODateTime;
  hours_after_check_in: number;
  proof: {
    method: NoShowProofMethod;
    pms?: string;
    attestation_id?: string;
  };
  charge: {
    amount: Money;
    status: PaymentItemStatus;
  };
}

/** Modification event record */
export interface ModificationRecord {
  modified_at: ISODateTime;
  changes: {
    field: string;
    from: unknown;
    to: unknown;
  }[];
  fee?: Money;
  price_difference?: Money;
  new_total?: Money;
  mandate_amended?: boolean;
}

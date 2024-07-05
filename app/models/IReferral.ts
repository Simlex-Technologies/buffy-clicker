export interface ReferralCreationRequest {
  /**
   * The referrer ID of the user who referred someone
   */
  referrerId: string;

  /**
   * The username of the user who was referred
   */
  username: string;
}

/**
 * The API routes endpoints
 */
export class ApiRoutes {
  /**
   * The dev base url for the application
   */
  static BASE_URL_DEV: string = "http://localhost:4040/";
  // static BASE_URL_DEV: string = "http://192.168.1.226:4040/";

  /**
   * The test base url for the application
   */
  static BASE_URL_TEST: string = "https://buffy-clicker.netlify.app/";

  /**
   * The live base url for the application
   */
  static BASE_URL_LIVE: string = "https://buffy-clicker.netlify.app/";

  /**
   * The route to Users endpoint
   */
  static Users: string = "api/users";

  /**
   * The route to Points endpoint
   */
  static Points: string = "api/points";

  /**
   * The route to Referral endpoint
   */
  static Referrals: string = "api/referrals";

  /**
   * The route to Leaderboard endpoint
   */
  static Leaderboard: string = "api/leaderboard";
}

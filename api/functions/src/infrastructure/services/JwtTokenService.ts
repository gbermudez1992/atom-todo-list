import jwt, { JwtPayload } from "jsonwebtoken";

/**
 * Service for handling JSON Web Token (JWT) operations.
 * Implements token signing and verification.
 */
export class JwtTokenService {
  /**
   * Lazily reads JWT_SECRET so the check fires at request time,
   * not at module-load time (which would break the Firebase emulator).
   */
  private get secret(): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET environment variable is not set.");
    return secret;
  }

  /**
   * Signs a payload object into a JWT token.
   *
   * @param {object} payload - The data to include in the token.
   * @return {string} The generated JWT token.
   */
  signToken(payload: JwtPayload): string {
    return jwt.sign(payload, this.secret, { expiresIn: "1h" });
  }

  /**
   * Verifies a JWT token and returns the decoded payload.
   *
   * @param {string} token - The JWT token to verify.
   * @return {string | JwtPayload} The decoded payload of the token.
   */
  verifyToken(token: string): string | JwtPayload {
    return jwt.verify(token, this.secret);
  }
}

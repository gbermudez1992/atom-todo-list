import jwt, { JwtPayload } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret-key";

/**
 * Service for handling JSON Web Token (JWT) operations.
 * Implements token signing and verification.
 */
export class JwtTokenService {
  /**
   * Signs a payload object into a JWT token.
   *
   * @param {object} payload - The data to include in the token.
   * @return {string} The generated JWT token.
   */
  signToken(payload: JwtPayload): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
  }

  /**
   * Verifies a JWT token and returns the decoded payload.
   *
   * @param {string} token - The JWT token to verify.
   * @return {string | JwtPayload} The decoded payload of the token.
   */
  verifyToken(token: string): string | JwtPayload {
    return jwt.verify(token, JWT_SECRET);
  }
}

import express from "express";
import { JwtTokenService } from "../../infrastructure/services/JwtTokenService";

export interface AuthenticatedRequest extends express.Request {
  user?: {
    id: string;
    email: string;
  };
}

export const authenticateToken = (
  req: AuthenticatedRequest,
  res: express.Response,
  next: express.NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    res.status(401).json({ error: "Access token is missing" });
    return;
  }

  try {
    const jwtService = new JwtTokenService();
    const user = jwtService.verifyToken(token);
    req.user = user as { id: string; email: string };
    next();
  } catch (err) {
    res.status(403).json({ error: "Invalid token" });
  }
};

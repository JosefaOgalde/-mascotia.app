import type { Request, Response, NextFunction } from "express";
import { auth as adminAuth } from "firebase-admin";

export interface AuthedRequest extends Request {
  user?: import("firebase-admin/auth").DecodedIdToken;
}

export const requireAuth = async (req: AuthedRequest, res: Response, next: NextFunction) => {
  const h = req.headers.authorization || "";
  const m = h.match(/^Bearer (.+)$/i);
  if (!m) return res.status(401).json({ error: "NO_AUTH" });
  try {
    req.user = await adminAuth().verifyIdToken(m[1], true);
    return next();
  } catch {
    return res.status(401).json({ error: "INVALID_TOKEN" });
  }
};

export const requireRole = (...roles: string[]) =>
  (req: AuthedRequest, res: Response, next: NextFunction) => {
    const role = (req.user as any)?.role;
    if (!role || !roles.includes(role)) return res.status(403).json({ error: "FORBIDDEN" });
    return next();
  };

// Solo en emulador (evita que /admin se use en producción)
export const emulatorOnly = (_req: Request, res: Response, next: NextFunction) => {
  if (process.env.FUNCTIONS_EMULATOR === "true") return next();
  return res.status(403).json({ error: "EMU_ONLY" });
};

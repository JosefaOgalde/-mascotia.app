"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emulatorOnly = exports.requireRole = exports.requireAuth = void 0;
const firebase_admin_1 = require("firebase-admin");
const requireAuth = async (req, res, next) => {
    const h = req.headers.authorization || "";
    const m = h.match(/^Bearer (.+)$/i);
    if (!m)
        return res.status(401).json({ error: "NO_AUTH" });
    try {
        req.user = await (0, firebase_admin_1.auth)().verifyIdToken(m[1], true);
        return next();
    }
    catch {
        return res.status(401).json({ error: "INVALID_TOKEN" });
    }
};
exports.requireAuth = requireAuth;
const requireRole = (...roles) => (req, res, next) => {
    const role = req.user?.role;
    if (!role || !roles.includes(role))
        return res.status(403).json({ error: "FORBIDDEN" });
    return next();
};
exports.requireRole = requireRole;
// Solo en emulador (evita que /admin se use en producción)
const emulatorOnly = (_req, res, next) => {
    if (process.env.FUNCTIONS_EMULATOR === "true")
        return next();
    return res.status(403).json({ error: "EMU_ONLY" });
};
exports.emulatorOnly = emulatorOnly;

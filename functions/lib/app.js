"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = require("firebase-admin/auth");
// ...
app.post("/admin/setRole", (req, res) => {
    if (process.env.FUNCTIONS_EMULATOR !== "true")
        return res.status(403).json({ error: "EMU_ONLY" });
    const { uid, role } = req.body || {};
    if (!uid || !role)
        return res.status(400).json({ error: "VALIDATION" });
    return (0, auth_1.getAuth)().setCustomUserClaims(uid, { role }).then(() => res.json({ ok: true, uid, role }));
});

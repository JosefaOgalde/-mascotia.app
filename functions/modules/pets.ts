import { Router } from "express";
import { getFirestore } from "firebase-admin/firestore";
import { requireAuth, requireRole } from "../middleware/auth";

export const petsRouter = Router();
const db = getFirestore();

petsRouter.post("/", requireAuth, requireRole("vet", "admin"), async (req, res) => {
  const { name, species, tutorUid, clinicId, birthdate } = req.body || {};
  if (!name || !species) {
    return res.status(400).json({ error: "VALIDATION", message: "`name` y `species` son requeridos" });
  }
  const now = new Date();
  const ref = await db.collection("pets").add({
    name, species,
    tutorUid: tutorUid ?? null,
    clinicId: clinicId ?? null,
    birthdate: birthdate ?? null,
    createdAt: now, updatedAt: now
  });
  const snap = await ref.get();
  return res.status(201).json({ id: ref.id, ...snap.data() });
});

petsRouter.get("/:id", async (req, res) => {
  const snap = await db.collection("pets").doc(req.params.id).get();
  if (!snap.exists) return res.status(404).json({ error: "NOT_FOUND" });
  return res.json({ id: snap.id, ...snap.data() });
});

petsRouter.get("/", async (_req, res) => {
  const snaps = await db.collection("pets").orderBy("createdAt", "desc").limit(50).get();
  return res.json({ items: snaps.docs.map(d => ({ id: d.id, ...d.data() })) });
});

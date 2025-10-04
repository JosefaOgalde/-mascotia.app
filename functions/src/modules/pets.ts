import { Router } from "express";
import { getFirestore } from "firebase-admin/firestore";

export const petsRouter = Router();
const db = getFirestore();

petsRouter.post("/", async (req, res) => {
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
    createdAt: now, updatedAt: now,
  });
  const snap = await ref.get();
  return res.status(201).json({ id: ref.id, ...snap.data() });
});

petsRouter.get("/:id", async (req, res) => {
  const snap = await db.collection("pets").doc(req.params.id).get();
  if (!snap.exists) return res.status(404).json({ error: "NOT_FOUND" });
  return res.json({ id: snap.id, ...snap.data() });
});

petsRouter.get("/", async (req, res) => {
  const { tutorUid, clinicId } = req.query as { tutorUid?: string; clinicId?: string };
  let q: FirebaseFirestore.Query = db.collection("pets").orderBy("createdAt", "desc");
  if (tutorUid) q = q.where("tutorUid", "==", tutorUid);
  if (clinicId) q = q.where("clinicId", "==", clinicId);
  const snaps = await q.limit(50).get();
  return res.json({ items: snaps.docs.map(d => ({ id: d.id, ...d.data() })) });
});

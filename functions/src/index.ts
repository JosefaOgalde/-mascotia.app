import { onRequest } from "firebase-functions/v2/https";
import { initializeApp } from "firebase-admin/app";
import app from "./app";

initializeApp();
export const api = onRequest({ region: "us-central1" }, app);

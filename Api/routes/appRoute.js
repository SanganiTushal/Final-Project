import express from "express";
import {
  googleController,
  registerController,
  signinController,
  signOutController,
  updateDataController,
  verifyJWT,
  deleteController,
} from "../controllers/userController.js";
import {
  createListing,
  getListing,
  deleteListing,
  editListing,
  getAllListing,
  searchListing,
} from "../controllers/listController.js";

const router = express.Router();

router.get("/api/allListing", verifyJWT, getAllListing);
router.get("/api/listing/:listingId", getListing);
router.get("/api/sign-out", signOutController);
router.get("/api/search", searchListing);
router.post("/api/register", registerController);
router.post("/api/signin", signinController);
router.post("/api/google", googleController);
router.post("/api/listing/create", createListing);
router.put("/api/update-data", verifyJWT, updateDataController);
router.put("/api/listing/:listingId", editListing);
router.delete("/api/delete-account", verifyJWT, deleteController);
router.delete("/api/deleteListing/:listingId", deleteListing);

export default router;

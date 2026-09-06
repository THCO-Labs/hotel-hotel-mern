import { Router } from "express";
import { requireStaff } from "../../common/middleware/auth.js";
import {
  createHotelHandler,
  getHotelHandler,
  listAllHotelsHandler,
  listHotelsHandler,
  searchHotelsHandler,
  updateHotelHandler,
} from "./hotel.controller.js";

export const hotelRoutes = Router();

// Public catalogue. `/search` and `/all` are declared before the slug route.
hotelRoutes.get("/", listHotelsHandler);
hotelRoutes.get("/search", searchHotelsHandler);
hotelRoutes.get("/all", requireStaff, listAllHotelsHandler);
hotelRoutes.get("/:slugOrId", getHotelHandler);

// Staff-only mutations.
hotelRoutes.post("/", requireStaff, createHotelHandler);
hotelRoutes.put("/:id", requireStaff, updateHotelHandler);

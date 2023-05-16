import express from "express";
import { Food, FoodCatalog } from "../models/index";
import mongoose from "mongoose";

const router = express.Router();


// GET all FoodCatalog
router.get("/", async (req, res) => {
    try {
        const result = await FoodCatalog.find({});
        res.json(result);
    } catch (err) {
        res.json(err);
    }
});

// GET a single FoodCatalog
router.get("/:id", async (req, res) => {
  try {
    console.log(req.params.id);
    const foodCatalog = await FoodCatalog.findById(req.params.id);
    res.json(foodCatalog);
  } catch (error) {
    res.json(error);
  }
});

export const FoodCatalogRoutes = router;

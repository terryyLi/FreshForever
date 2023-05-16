import express from "express";
import { FoodCatalog, Food } from "../models/index";
import { Model, Schema, model } from "mongoose";

const router = express.Router();

// return number of all food, number of food that its status is "undone" but has expired, number of status is "undone"
router.get("/:userID/00", async (req, res) => {
  try {
    const userID = req.params.userID;
    const foods = await Food.find({ user: userID });
    const result = foods.reduce(
      (acc: any, food: any) => {
        if (food.status === "undone") {
          acc.undone += 1;
          if (food.expiration_date < new Date()) {
            acc.expired += 1;
          }
        }
        acc.total += 1;
        return acc;
      },
      { total: 0, expired: 0, undone: 0 }
    );
    res.json(result);
  } catch (error) {
    res.json(error);
  }
});



// return number of food that's going to expire per date.
router.get("/:userID/01", async (req, res) => {
  try {
    const userID = req.params.userID;
    const foods = await Food.find({ user: userID });
    const result = foods.reduce((acc: any, food: any) => {
      const date = new Date(food.expiration_date).toISOString().slice(0, 10);
      if (acc[date]) {
        acc[date] += 1;
      } else {
        acc[date] = 1;
      }
      return acc;
    }, {});

    const finalResult = Object.keys(result).map((key) => {
      return {
        expiration_date: key,
        count: result[key],
      };
    });
    // sort by date
    finalResult.sort((a: any, b: any) => {
      return a.expiration_date > b.expiration_date ? 1 : -1;
    });
    res.json(finalResult);
  } catch (error) {
    res.json(error);
  }
});

// return user's all food count per category.
router.get("/:userID/02", async (req, res) => {
  try {
    const userID = req.params.userID;
    const foods = await Food.find({ user: userID });
    const foodCatalogs = await FoodCatalog.find({});
    const result = foods.reduce((acc: any, food: any) => {
      const foodCatalog = foodCatalogs.find((foodCatalog) => {
        return foodCatalog._id.toString() === food.food.toString();
      });
      const category = foodCatalog ? foodCatalog.category : "unknown";
      if (acc[category]) {
        acc[category] += 1;
      } else {
        acc[category] = 1;
      }
      return acc;
    }, {});

    const finalResult = Object.keys(result).map((key) => {
      return {
        category: key,
        count: result[key],
      };
    });
    // sort by count
    finalResult.sort((a: any, b: any) => {
      return a.count < b.count ? 1 : -1;
    });
    res.json(finalResult);
  } catch (error) {
    res.json(error);
  }
});

export const StatRoutes = router;

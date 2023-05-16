import express from "express";
import { Food, FoodCatalog, User } from "../models/index";

interface FoodParams {
  days_to_expiration: number;
  user: string;
  food: string;
  expiration_date: string;
  status: string;
}

const router = express.Router();

// GET all foods of a user. insert an extra column freshness indicating whether the food is “danger”, “spoiled”, “normal”.
// insert another column "days_to_expire", where the value is the number of days from today to the expiration date.
// insert another column "foodname", where the value is the name of the food, get from FoodCatalog.
// sort the output by days_to_expire.
// danger: expiration_date is less than 3 days
// spoiled: means the expiration_date passes the current date
// normal: the default status.
router.get("/:userID", async (req, res) => {
  try {
    const user = await User.findById(req.params.userID);
    const result = await Food.find({ user: req.params.userID });
    const foodCatalogs = await FoodCatalog.find({});
    const newResult = result.map(async (food: any) => {
      console.log(foodCatalogs);
      const freshness =
        food.expiration_date < new Date()
          ? "spoiled"
          : food.expiration_date <
            new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
          ? "danger"
          : "normal";
      const days_to_expire = Math.floor(
        (food.expiration_date.getTime() - Date.now()) / (24 * 60 * 60 * 1000)
      );

      const foodCatalog = foodCatalogs.find((foodCatalog) => {
        return foodCatalog._id.toString() === food.food.toString();
      });
      const foodname = foodCatalog ? foodCatalog.foodname : "unknown";
      // if food expired and not scored, user score -5 and mark food as scored
      if (food.expiration_date < new Date() && !food.scored) {
        if (user) {
          await User.updateOne({ _id: user._id }, {$set: { score: user.score - 5}})
        }
        food.scored = true;
        await food.save();
      }
      return {
        _id: food._id,
        user: food.user,
        food: food.food,
        foodname: foodname,
        expiration_date: food.expiration_date,
        days_to_expire: days_to_expire,
        status: food.status,
        freshness: freshness,
      };
    });
    const finalResult = await Promise.all(newResult);
    finalResult.sort((a: any, b: any) => a.days_to_expire - b.days_to_expire);
    res.json(finalResult);
  } catch (error) {
    res.json(error);
  }
});

// GET all undone foods of a user with the same return as above.
router.get("/:userID/undone", async (req, res) => {
  try {
    const user = await User.findById(req.params.userID);
    const result = await Food.find({ user: req.params.userID, status: "undone" });
    const foodCatalogs = await FoodCatalog.find({});
    const newResult = result.map(async (food: any) => {
      console.log(foodCatalogs);
      const freshness =
        food.expiration_date < new Date()
          ? "spoiled"
          : food.expiration_date <
            new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
          ? "danger"
          : "normal";
      const days_to_expire = Math.floor(
        (food.expiration_date.getTime() - Date.now()) / (24 * 60 * 60 * 1000)
      );

      const foodCatalog = foodCatalogs.find((foodCatalog) => {
        return foodCatalog._id.toString() === food.food.toString();
      });
      const foodname = foodCatalog ? foodCatalog.foodname : "unknown";
      // if food expired and not scored, user score -5 and mark food as scored
      if (food.expiration_date < new Date() && !food.scored) {
        if (user) {
          await User.updateOne({ _id: user._id }, {$set: { score: user.score - 5}})
        }
        food.scored = true;
        await food.save();
      }
      return {
        _id: food._id,
        user: food.user,
        food: food.food,
        foodname: foodname,
        expiration_date: food.expiration_date,
        days_to_expire: days_to_expire,
        status: food.status,
        freshness: freshness,
      };
    });
    const finalResult = await Promise.all(newResult);
    finalResult.sort((a: any, b: any) => a.days_to_expire - b.days_to_expire);
    res.json(finalResult);
  } catch (error) {
    res.json(error);
  }
});

// CREATE (multiple) Food logs.
router.post("/", async (req, res) => {
  try {
    console.log(req.body);
    const result = req.body.map(async (food: FoodParams) => {
      const newFood = new Food({
        user: food.user,
        food: food.food,
        expiration_date: new Date(Date.now() + food.days_to_expiration * 24 * 60 * 60 * 1000),
        status: "undone",
      });
      await newFood.save();
      return newFood;
    });
    const finalResult = await Promise.all(result);
    res.json(finalResult);
  } catch (error) {
    res.json(error);
  }
});


// [post] api/food/:userID/:foodID. Mark food as “done”. When a unexpired food is marked done, the score of the user should be increased by 1.
// Return the user object.
router.post("/:userID/:foodID", async (req, res) => {
  try {
    const user = await User.findById(req.params.userID);
    if (user) {
      const food = await Food.findById(req.params.foodID);
      if (food) {
        food.status = "done";
        await food.save();
        if (food.expiration_date > new Date() && !food.scored) {
          await User.updateOne({ _id: user._id }, {$set: { score: user.score + 5}})
        }
        const newUser = await User.findById(req.params.userID);
        res.json(newUser);
      } else {
        res.sendStatus(404);
      }
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    res.json(error);
  }
});

export const FoodRoutes = router;

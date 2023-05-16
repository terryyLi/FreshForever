import * as bodyParser from "body-parser";
import express, { type Express, type Request, type Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import {
  UserRoutes,
  FoodCatalogRoutes,
  FoodRoutes,
  ShoppingListItemRoutes,
  StatRoutes,
} from "./routes/index";

const app: Express = express();
const port = 3001;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// replace to the endpoint of our database
const mongodbEndpoint = '<your-mongodb-endpoint>';
mongoose
  .connect(mongodbEndpoint)
  .then(() => {
    console.log("mongodb is connected");
  })
  .catch(() => {
    console.log("error in connection");
  });

mongoose.set("strictQuery", false);

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE");
  next();
});

// Create appropriate API endpoints
app.use("/api/food", FoodRoutes);
app.use("/api/foodcatalog", FoodCatalogRoutes);
app.use("/api/shoppinglist", ShoppingListItemRoutes);
app.use("/api/stat", StatRoutes);

// Or allow specific origins
const whitelist = ["http://localhost:3000", "https://ffproto-frontend.fly.dev"];
app.use(
  cors({
    origin: function (origin, callback) {
      if (origin !== undefined && whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

// Create appropriate API endpoints

app.use("/api/user", UserRoutes);
app.use(cors());

app.listen(port, () => {
  console.log(`FreshForever listening on localhost:${port}`);
});


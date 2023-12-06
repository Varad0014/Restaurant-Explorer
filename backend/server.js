import express from "express"
import cors from "cors"
import restaurants from "./api/restaurants.route.js"

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/restaurants", restaurants);
//any other route
app.use("*", (req, res) => (res.status(404).json({error: "route does not exist"})));


export default app;


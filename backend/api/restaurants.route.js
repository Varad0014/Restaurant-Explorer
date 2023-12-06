import express from "express"
import RestaurantsController from "./restaurants.controller.js"
import ReviewsController from "./reviews.controller.js"


const router = express.Router()
router.route("/").get(RestaurantsController.getRestaurantsAPI);
router.route("/id/:id").get(RestaurantsController.getRestaurantByIdAPI)
router.route("/cuisines").get(RestaurantsController.getRestaurantCuisinesAPI)


router
  .route("/reviews")
  .post(ReviewsController.postReviewAPI)
  .put(ReviewsController.updateReviewAPI)
  .delete(ReviewsController.deleteReviewAPI)


export default router
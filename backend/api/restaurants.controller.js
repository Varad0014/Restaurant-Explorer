import RestaurantsDataAccess from "../data_access/restaurants_data_access.js"

export default class RestaurantsController {
  static async getRestaurantsAPI(req, res, next) {
    let restaurantsPerPage = 20
    let page = 0
    if(req.query.restaurantsPerPage){
      restaurantsPerPage = parseInt(req.query.restaurantsPerPage, 10)
    }

    if(req.query.page){
      page = parseInt(req.query.page, 10)
    }
   
    
    let filters = {}
    if (req.query.cuisine) {
      filters.cuisine = req.query.cuisine
    } else if (req.query.zipcode) {
      filters.zipcode = req.query.zipcode
    } else if (req.query.name) {
      filters.name = req.query.name
    }

    const { restaurantsList, totalNumRestaurants } = await RestaurantsDataAccess.getRestaurants({
      filters,
      page,
      restaurantsPerPage,
    })

    let response = {
      restaurants: restaurantsList,
      page: page,
      filters: filters,
      entries_per_page: restaurantsPerPage,
      total_results: totalNumRestaurants,
    }
    
    res.json(response)
  }
  static async getRestaurantByIdAPI(req, res, next) {
    try {
      let id = req.params.id || {}
      let restaurant = await RestaurantsDataAccess.getRestaurantByID(id)
      if (!restaurant) {
        res.status(404).json({ error: "Not found" })
        return
      }
      res.json(restaurant)
    } catch (e) {
      console.log(`api, ${e}`)
      res.status(500).json({ error: e })
    }
  }

  static async getRestaurantCuisinesAPI(req, res, next) {
    try {
      let cuisines = await RestaurantsDataAccess.getCuisines()
      res.json(cuisines)
    } catch (e) {
      console.log(`api, ${e}`)
      res.status(500).json({ error: e })
    }
  }
  
}

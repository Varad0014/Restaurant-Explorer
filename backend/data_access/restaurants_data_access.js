import { ObjectId} from 'mongodb'
let restaurants
let reviews
let db

export default class RestaurantsDataAccess {
  //call this before server starts
  static async injectDB(conn) {
    db = conn.db(process.env.RESTAURANT_REVIEWS_DB);
    if (restaurants && reviews) {
      return
    }
    try {
      //get reference to database collection
      if (!restaurants) {
        restaurants = await db.collection("restaurants")
      }
      if (!reviews) {
        reviews = await db.collection("reviews")
      }

    } catch (err) {
      console.error(
        `Connection cannot be established, error: ${err}`,
      )
    }
  }

  static async getRestaurants({
    filters = null,
    page = 0,
    restaurantsPerPage = 10,
  } = {}) {
    let query
    if (filters) {
      if ("name" in filters) {
        query = { "name": { $regex: filters["name"] } }
      } else if ("cuisine" in filters) {
        query = { "cuisine": { $eq: filters["cuisine"] } }
      } else if ("zipcode" in filters) {
        query = { "address.zipcode": { $eq: filters["zipcode"] } }
      }
    }

    let data

    try {
      data = await restaurants.find(query)
    } catch (e) {
      console.error(`Not able to retrieve, ${e}`)
      return { restaurantsList: [], totalNumRestaurants: 0 }
    }

    const dataToBeDisplayed = data.limit(restaurantsPerPage).skip(restaurantsPerPage * page)

    try {
      const restaurantsList = await dataToBeDisplayed.toArray()
      const totalNumRestaurants = await restaurants.countDocuments(query)

      return { restaurantsList, totalNumRestaurants }
    } catch (e) {
      console.error(
        `data cannot be converted to array: ${e}`,
      )
      return { restaurantsList: [], totalNumRestaurants: 0 }
    }
  }

  static async getRestaurantByID(id) {
    try {
      
      // const rest_id = new ObjectId(id);

      // const mapReview = function () {
      //   if (this.restaurant_id === rest_id) {
      //     console.log(this)
      //     emit(this.restaurant_id, this)
      //   }
      // }
      // let restaurant_info = await restaurants.find({ _id: rest_id }).next()
      // const reduceFunction = function (key, values) {
      //   return (values)
      // }
      
      // // return await reviews.find({restaurant_id: rest_id}).toArray()
    
      // return await reviews.mapReduce(mapReview, reduceFunction).toArray()
      

          const pipeline = [
            {
              $match: {
                _id: new ObjectId(id),
              },
            },
            {
              $lookup: {
                from: "reviews",
                let: {
                  id: "$_id",
                },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $eq: ["$restaurant_id", "$$id"],
                      },
                    },
                  },
                  {
                    $sort: {
                      date: -1,
                    },
                  },
                ],
                as: "reviews",
              },
            },
            {
              $addFields: {
                reviews: "$reviews",
              },
            },
          ]
          return await restaurants.aggregate(pipeline).next()
    } catch (e) {
      console.error(`Something went wrong in getRestaurantByID: ${e}`)
      throw e
    }
  }

  static async getCuisines() {
    let cuisines = []
    try {
      cuisines = await restaurants.distinct("cuisine")
      return cuisines
    } catch (e) {
      console.error(`Unable to get cuisines, ${e}`)
      return cuisines
    }
  }
}



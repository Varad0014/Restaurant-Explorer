import app from "./server.js"
import mongodb from "mongodb"
import dotenv from "dotenv"
import RestaurantsDataAccess from "./data_access/restaurants_data_access.js"
import ReviewsDataAccess from "./data_access/reviews_data_access.js"

dotenv.config()
const MongoClient = mongodb.MongoClient

const port = process.env.PORT || 8080

MongoClient.connect(
    process.env.RESTAURANT_REVIEWS_DB_URI,
    {
        maxPoolSize: 50,
        wtimeoutMS: 3000,
        useNewUrlParser: true
    }
)
    .catch(err => {
        console.error(err.stack)
        process.exit(1)
    })
    .then(async client => {
        await RestaurantsDataAccess.injectDB(client);
        await ReviewsDataAccess.injectDB(client)
        //start server at port 4000
        app.listen(port, () => {
            console.log(`listening on port ${port}`) 
        })
    })

import React, { useState, useEffect } from "react";
import RestaurantDataService from "../services/restaurants.js";
import {  Link, useParams, useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css'


const Restaurant = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const initialRestaurantState = {
    id: null,
    name: "",
    address: {},
    cuisine: "",
    reviews: [],
  };
  const [restaurant, setRestaurant] = useState(initialRestaurantState);

  const getRestaurant = async (id) => {
    try {
      const response = await RestaurantDataService.get(id);
      setRestaurant(response.data);
      console.log(response.data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getRestaurant(id);
  }, [id]);

  const deleteReview = async (reviewId, index) => {
    try {
      await RestaurantDataService.deleteReview(reviewId, user.id);
      setRestaurant((prevState) => {
        prevState.reviews.splice(index, 1);
        return {
          ...prevState,
        };
      });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div>
      {restaurant ? (
        <div >
          <h3>{restaurant.name}</h3>
          <p>
            <b>Cuisine: </b>
            {restaurant.cuisine}
            <br />
            <b>Address: </b>
            {restaurant.address.building} {restaurant.address.street},{" "}
            {restaurant.address.zipcode}
          </p>
          <Link
            to={`/restaurants/${id}/review`}
            className="btn btn-primary" style={{"backgroundColor":"rgb(102, 16, 242)"}}
          >
            Add Review
          </Link>
          <h4> Reviews </h4>
          <div className="row">
            {restaurant.reviews.length > 0 ? (
              restaurant.reviews.map((review, index) => {
                return (
                  <div className="col-lg-4 pb-1" key={index}>
                    <div className="card">
                      <div className="card-body">
                        <p className="card-text">
                          {review.text}
                          <br />
                          <b>User: </b>
                          {review.name}
                          <br />
                          <b>Date: </b>
                          {review.date}
                        </p>
                        {user && user.id === review.user_id && (
                          <div className="row">
                            <button 
                              style={{"backgroundColor":"rgb(102, 16, 242)"}}
                              className="btn btn-primary col-lg-5 mx-1 mb-1" 
                              onClick={() => deleteReview(review._id, index)} 
                            >
                              Delete
                            </button>
                            <Link
                              to={{
                                pathname: `/restaurants/${id}/review`,
                                state: {
                                  currentReview: review,
                                },
                              }}
                              className="btn btn-primary col-lg-5 mx-1 mb-1"
                              style={{"backgroundColor":"rgb(102, 16, 242)"}}
                            >
                              Edit
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-sm-4">
                <p>No reviews yet.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div>
          <br />
          <p>No restaurant selected.</p>
        </div>
      )}
    </div>
  );
};

export default Restaurant;

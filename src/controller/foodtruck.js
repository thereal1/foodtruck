import mongoose from 'mongoose';
import { Router } from 'express';
import FoodTruck from '../model/foodtruck';
import Review from '../model/review';
import bodyParser from 'body-parser';

import { authenticate } from '../middleware/authMiddleware';

export default ({ config, db }) => {
  let api = Router();

  api.post('/add', authenticate, (req, res) => {
    let newFoodTruck = new FoodTruck();
    newFoodTruck.name = req.body.name;
    newFoodTruck.foodtype = req.body.foodtype;
    newFoodTruck.avgcost = req.body.avgcost;
    newFoodTruck.geometry.coordinates = req.body.geometry.coordinates;

    newFoodTruck.save(err => {
      if (err) {
        res.send(err);
      }
      res.json({'Message': 'FoodTruck saved successfully'});
    });
  });

  api.get('/', (req, res) => {
    FoodTruck.find({}, (err, foodtrucks) => {
      if (err) {
        res.send(err);
      }
      res.json(foodtrucks);
    });
  });

  api.get('/:id', (req, res) => {
    FoodTruck.findById(req.params.id, (err, foodtruck) => {
      if (err) {
        res.send(err);
      }
      res.json(foodtruck);
    });
  });

  api.put('/:id', authenticate, (req, res) => {
    FoodTruck.findById(req.params.id, (err, foodtruck) => {
      if (err) {
        res.send(err);
      }
      foodtruck.name = req.body.name;
      foodtruck.foodtype = req.body.foodtype;
      foodtruck.avgcost = req.body.avgcost;
      foodtruck.geometry.coordinates = req.body.geometry.coordinates;
      foodtruck.save(function(err) {
        if (err) {
          res.send(err);
        }
        res.json({ message: 'Food Truck info updated' });
      });
    });
  });

  api.delete('/:id', authenticate, (req, res) => {
    FoodTruck.remove({
      _id: req.params.id
    }, (err, foodtruck) => {
      if (err) {
        res.send(err);
      }
      Review.remove({
        foodtruck: req.params.id
      }, (err, review) => {
        if (err) {
          res.send(err);
        }
        res.json({ message: 'Food truck reviews removed success' })
      });
    });
  });

  api.post('/reviews/add/:id', authenticate, (req, res) => {
    FoodTruck.findById(req.params.id, (err, foodtruck) => {
      if (err) {
        res.send(err);
      }
      let newReview = new Review();
      newReview.title = req.body.title;
      newReview.text = req.body.text;
      newReview.foodtruck = foodtruck._id;

      newReview.save((err, review) => {
        if (err) {
          res.send(err);
        }
        foodtruck.reviews.push(newReview);
        foodtruck.save(err => {
          if (err) {
            res.send(err);
          }
          res.json({message: 'Food truck review saved!'});
        });
      });
    });
  });

  api.get('/reviews/:id', (req, res) => {
    Review.find({foodtruck: req.params.id}, (err, reviews) => {
      if (err) {
        res.send(err);
      }
      res.json(reviews);
    })
  })

  return api;
};

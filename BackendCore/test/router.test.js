const request = require('supertest');
const express = require('express');
const router = require('../RoutingComponent.js'); // Adjust the path as necessary

// Mock the controllers to avoid performing actual logic like database calls
jest.mock('../SentimentController', () => {
  return {
    SentimentController: jest.fn().mockImplementation(() => {
      return { askForSentiment: (req, res) => res.status(200).send("Sentiment received") };
    })
  };
});

jest.mock('../DishController', () => {
  return {
    DishController: jest.fn().mockImplementation(() => {
      return {
        getAllMenu: (req, res) => res.status(200).send(["Dish 1", "Dish 2"]),
        askForDish: (req, res) => res.status(200).send("Dish recommendation")
      };
    })
  };
});

jest.mock('../TimeController', () => {
  return {
    TimeController: jest.fn().mockImplementation(() => {
      return { askSchedule: (req, res) => res.status(200).send("Schedule recommended") };
    })
  };
});

const app = express();
app.use(express.json());
app.use(router);

describe('API route tests', () => {
  test('GET /Sentiment/:feedback?', async () => {
    const response = await request(app).get('/Sentiment/positive');
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe("Sentiment received");
  });

  test('GET /food/menu', async () => {
    const response = await request(app).get('/food/menu');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(["Dish 1", "Dish 2"]);
  });

  test('POST /recomendation/time', async () => {
    const postData = { time: "12:00" }; // Adjust mock data as necessary for the endpoint
    const response = await request(app)
      .post('/recomendation/time')
      .send(postData);
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe("Schedule recommended");
  });

  test('POST /food/recomendation', async () => {
    const postData = { dishType: "Vegetarian" }; // Adjust mock data as necessary for the endpoint
    const response = await request(app)
      .post('/food/recomendation')
      .send(postData);
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe("Dish recommendation");
  });
});

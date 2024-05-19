const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const sleepRouter = require('../routes/sleep');
const { User, Sleep } = require('../db/db');
const { connect, close } = require('../db/db');
const { generateToken } = require('../routes/user');


const app = express();
app.use(express.json());
app.use('/api/v1/sleep', sleepRouter);

// Connecting to the test database
beforeAll(async () => {
  await connect();
});

// Clearing the database after each test
afterEach(async () => {
  await User.deleteMany();
  await Sleep.deleteMany();
});

// Closing the database connection after all tests
afterAll(async () => {
  await close();
});

describe('Sleep API', () => {
  let userId;
  let jwtToken;

  beforeEach(async () => {
    const user = new User({ userName: 'testuser', password: 'password', firstName: 'Test', lastName: 'User' });
    await user.save();
    userId = user._id;
    jwtToken = generateToken(userId);
  });

  describe('POST /api/v1/sleep', () => {
    it('should create a new sleep record', async () => {
      const response = await request(app)
        .post('/api/v1/sleep')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({
          hours: 7,
          timestamp: new Date(),
          userId: userId.toString(),
        });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Sleep data saved successfully!');
    });

    it('should return 411 for invalid input', async () => {
      const response = await request(app)
        .post('/api/v1/sleep')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({
          hours: -1,
          timestamp: new Date(),
          userId: userId.toString(),
        });

      expect(response.status).toBe(411);
      expect(response.body.message).toBe('Invalid credentials!');
    });
  });

  describe('GET /api/v1/sleep/:userId', () => {
    it('should return sleep records for a user', async () => {
      await Sleep.create({ hours: 8, timestamp: new Date(), userId });

      const response = await request(app)
        .get(`/api/v1/sleep/${userId}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .query({ page: 1, limit: 3 });

      expect(response.status).toBe(200);
      expect(response.body.sleepRecords.length).toBe(1);
    });

    it('should return 404 for non-existent user', async () => {
      const nonExistentUserId = new mongoose.Types.ObjectId();

      const response = await request(app)
        .get(`/api/v1/sleep/${nonExistentUserId}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .query({ page: 1, limit: 3 });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('User not found');
    });
  });

  describe('DELETE /api/v1/sleep/:recordId', () => {
    it('should delete a sleep record', async () => {
      const sleepRecord = await Sleep.create({ hours: 8, timestamp: new Date(), userId });

      const response = await request(app)
        .delete(`/api/v1/sleep/${sleepRecord._id}`)
        .set('Authorization', `Bearer ${jwtToken}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Sleep record deleted successfully');
    });

    it('should return 404 for non-existent sleep record', async () => {
      const nonExistentRecordId = new mongoose.Types.ObjectId();

      const response = await request(app)
        .delete(`/api/v1/sleep/${nonExistentRecordId}`)
        .set('Authorization', `Bearer ${jwtToken}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Sleep record not found');
    });
  });
});

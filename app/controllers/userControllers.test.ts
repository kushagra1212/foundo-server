import request from 'supertest';
import { app } from '../../server';
import User from '../models/User';
import UserSetting from '../models/UserSetting';
import promisePool from '../db';
import bcrypt from 'bcrypt';
import { createToken } from '../utils/index';
import logger from '../logger/logger';
import { Routes, TEST_JWT_TOKEN } from '../constants';

const salt = process.env.SALT;
const jwtSecret = process.env.JWT_SECRET;
const maxAgeOfToken = 3 * 24 * 60 * 60; // 3 days
const user_base_url = Routes.v1 + Routes.users.base;
const x_auth_token = 'x-auth-token';
describe('User Controller', () => {
  let userId;
  let token;

  beforeAll(async () => {
    // create a test user
    const hashedPassword = await bcrypt.hash('testpassword', parseInt(salt));
    const user = new User({
      firstName: 'Test',
      lastName: 'User',
      email: 'testuser@test.com',
      password: hashedPassword,
    });
    const [result, _] = await user.save();
    const userSetting = new UserSetting({
      fk_userId: result.insertId,
    });
    await userSetting.save();
    userId = result.insertId;

    // create a JWT token for the test user
    token = createToken({
      id: userId,
      jwtSecret,
      maxAgeOfToken,
    });
  });

  afterAll(async () => {
    // delete the test user
    const [result, _] = await User.deleteUser({ userId });
    expect(result.affectedRows).toBe(1);
  });

  describe('signupUser', () => {
    it('should create a new user', async () => {
      const res = await request(app)
        .post(user_base_url + Routes.users.signupUser)
        .send({
          firstName: 'New',
          lastName: 'User',
          email: 'newuser@test.com',
          password: 'newpassword',
        });
      expect(res.status).toBe(201);
      expect(res.body.user.firstName).toBe('New');
      expect(res.body.user.lastName).toBe('User');
      expect(res.body.user.email).toBe('newuser@test.com');
      expect(res.body.message).toBe('Account Created !');
    });

    it('should return an error if required fields are missing', async () => {
      const res = await request(app)
        .post(user_base_url + Routes.users.signupUser)
        .send({});
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Bad Request');
      expect(res.body.errorMessage).toBe(
        'firstName, lastName, email and password are required',
      );
    });

    it('should return an error if email is already in use', async () => {
      const res = await request(app)
        .post(user_base_url + Routes.users.signupUser)
        .send({
          firstName: 'Test',
          lastName: 'User',
          email: 'testuser@test.com',
          password: 'testpassword',
        });
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Bad Request');
      expect(res.body.errorMessage).toBe('This Email is already in use !');
    });
  });

  describe('deleteUserById', () => {
    it('should delete a user', async () => {
      const res = await request(app)
        .delete(user_base_url + `/1`)
        .set(x_auth_token, `${TEST_JWT_TOKEN}`);
      expect(res.status).toBe(200);
      expect(res.body.user.id).toBe(1);
      expect(res.body.success).toBe(true);
    });



    it('should return an error if user is not found', async () => {
      const res = await request(app)
        .delete(user_base_url +`/1`)
        .set(x_auth_token, `${TEST_JWT_TOKEN}`)
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('not found');
      expect(res.body.errorMessage).toBe('user not found');
    });
  });

  describe('signinUser', () => {
    it('should sign in a user', async () => {
      const res = await request(app)
        .post(user_base_url + Routes.users.signinUser)
        .send({ email: 'testuser@test.com', password: 'testpassword' });
      expect(res.status).toBe(200);
      expect(res.body.jwtToken).toBeDefined();
      expect(res.body.message).toBe('successfully loggedin');
      expect(res.body.user.firstName).toBe('Test');
      expect(res.body.user.lastName).toBe('User');
      expect(res.body.user.email).toBe('testuser@test.com');
      expect(res.body.user.password).toBe('');
    });

    it('should return an error if email is missing', async () => {
      const res = await request(app)
        .post(user_base_url + Routes.users.signinUser)
        .send({ password: 'testpassword' });
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Bad Request');
      expect(res.body.errorMessage).toBe('email and password are required');
    });

    it('should return an error if password is missing', async () => {
      const res = await request(app)
        .post(user_base_url + Routes.users.signinUser)
        .send({ email: 'testuser@test.com' });
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Bad Request');
      expect(res.body.errorMessage).toBe('email and password are required');
    });

    it('should return an error if user is not found', async () => {
      const res = await request(app)
        .post(user_base_url + Routes.users.signinUser)
        .send({ email: 'nonexistent@test.com', password: 'testpassword' });
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Bad Request');
      expect(res.body.errorMessage).toBe('Please check your email again !');
    });

    it('should return an error if password is incorrect', async () => {
      const res = await request(app)
        .post(user_base_url + Routes.users.signinUser)
        .send({ email: 'testuser@test.com', password: 'wrongpassword' });
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Bad Request');
      expect(res.body.errorMessage).toBe('password is incorrect');
    });
  });
});

import express from 'express';
import { ApiResponse } from './utils/ApiResponse';

const app = express();

app.get('/', (req, res) => {
  res.status(200).json(new ApiResponse(200, null, 'Welcome to Sweet Shop API'));
});

export { app };
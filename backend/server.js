import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';

import connect from './db/connection.js';
import userRoutes from './api/routes/userRoutes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use('/api/user', userRoutes);

app.get('/', (req, res) => {
  res.send('API is working!');
});

connect()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error('❌ Database connection failed:', err.message);
  });

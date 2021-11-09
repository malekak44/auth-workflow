require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();
const cors = require('cors');
const xss = require('xss-clean');
const helmet = require('helmet');
const rateLimiter = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const connectDB = require('./db/connect');
const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');
const cookieParser = require('cookie-parser');
const notFound = require('./middleware/not-found');
const errorHandler = require('./middleware/error-handler');

// middleware
app.set('trust proxy', 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 60,
  })
);
app.use(xss());
app.use(cors({ credentials: true, origin: 'https://auth-workflow.netlify.app' }));
app.use(helmet());
app.use(mongoSanitize());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/user', userRouter);
app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
}

start();
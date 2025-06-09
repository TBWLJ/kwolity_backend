const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB } = require('./utils/db');
const session = require('express-session');

// Import routes
const propertyRoute = require('./routes/propertyRoute');
const userRoute = require('./routes/userRoute');
const bookingRoute = require('./routes/bookingRoute');
const paymentRoute = require('./routes/paymentRoute');
const investmentRoute = require('./routes/investmentRoute');



// Initialize the Express application
const app = express();
dotenv.config();
const port = 3000;

app.set('trust proxy', 1); // Trust the first proxy
// Database connection
connectDB();

// Middleware setup
// CORS Configuration
const allowedOrigins = [
  "http://localhost:3000",
  "https://kwolitygroupltd.vercel.app",
];

app.use(cors({
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // allow session cookies
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: true, // on HTTPS
    sameSite: 'none',
    maxAge: 24 * 60 * 60 * 1000,
  },
}));


// Use routes
app.use('/api/properties', propertyRoute);
app.use('/api/users', userRoute);
app.use('/api/bookings', bookingRoute);
app.use('/api/payment', paymentRoute);
app.use('/api/investments', investmentRoute);

// Default route

app.get('/', (req, res) => {
  res.send('Hello World!');
});


app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
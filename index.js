const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const { connectDB } = require('./utils/db');

// Routes
const propertyRoute = require('./routes/propertyRoute');
const userRoute = require('./routes/userRoute');
const bookingRoute = require('./routes/bookingRoute');
const paymentRoute = require('./routes/paymentRoute');
const investmentRoute = require('./routes/investmentRoute');

dotenv.config();
const app = express();
const port = 3000;

// Database
connectDB();

// CORS
const allowedOrigins = [
  "http://localhost:3000",
  "https://kwolitygroupltd.com.ng"
  "https://admin.kwolitygroupltd.com.ng",
];

app.use(cors({
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) callback(null, true);
    else callback(new Error("Not allowed by CORS"));
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/api/properties', propertyRoute);
app.use('/api/users', userRoute);
app.use('/api/bookings', bookingRoute);
app.use('/api/payment', paymentRoute);
app.use('/api/investments', investmentRoute);

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(port, () => console.log(`Server running at http://localhost:${port}`));

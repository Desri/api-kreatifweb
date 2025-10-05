const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('../src/config/database');

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = process.env.NODE_ENV === 'production'
      ? [
          'https://admin-kreatifweb.vercel.app',
          'https://kreatifweb.vercel.app',
          'https://kreatifweb.id',
          'https://www.kreatifweb.id',
          process.env.FRONTEND_URL,
          process.env.ADMIN_URL
        ].filter(Boolean)
      : [
          'http://localhost:3000',
          'http://localhost:3001',
          'http://127.0.0.1:3000',
          'http://127.0.0.1:3001',
          'http://localhost:5000',
          'http://127.0.0.1:5000',
          'https://admin-kreatifweb.vercel.app'
        ];

    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    console.log('Checking origin:', origin);
    console.log('Allowed origins:', allowedOrigins);

    if (allowedOrigins.indexOf(origin) !== -1) {
      console.log('Origin allowed:', origin);
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
    'Access-Control-Request-Method',
    'Access-Control-Request-Headers'
  ],
  exposedHeaders: ['Content-Length', 'X-Requested-With'],
  optionsSuccessStatus: 200,
  preflightContinue: false
};

app.use(cors(corsOptions));

// Handle preflight requests explicitly
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS request for:', req.url);
  }
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Kreatif Web API' });
});

app.use('/api/users', require('../src/routes/userRoutes'));
app.use('/api/blogs', require('../src/routes/blogRoutes'));
app.use('/api/categories', require('../src/routes/categoryRoutes'));
app.use('/api/upload', require('../src/routes/uploadRoutes'));
app.use('/api/contacts', require('../src/routes/contactRoutes'));

module.exports = app;
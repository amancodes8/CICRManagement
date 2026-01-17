const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect MongoDB
connectDB();

const app = express();

/* ==================================================
   1. CORS CONFIGURATION
   Allows frontend (Vite) to communicate with Backend
================================================== */
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.header(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, DELETE, OPTIONS'
    );

    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }

    next();
});

app.use(cors());

/* ==================================================
   2. BODY PARSERS
================================================== */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ==================================================
   3. HEALTH CHECK
================================================== */
app.get('/', (req, res) => {
    res.send('CICR Connect API is running...');
});

/* ==================================================
   4. API ROUTES
   Ensure these files exist in your /routes folder
================================================== */
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/meetings', require('./routes/meetingRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/chatbot', require('./routes/chatbotRoutes'));
app.use('/api/inventory', require('./routes/inventoryRoutes')); 
app.use('/api/community', require('./routes/postRoutes'));

/* ==================================================
   5. GLOBAL ERROR HANDLER
================================================== */
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

const PORT = process.env.PORT || 4000; 
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 Inventory system active at /api/inventory`);
});
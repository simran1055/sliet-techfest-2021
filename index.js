<<<<<<< HEAD
// Import Modules
import 'dotenv/config';
import express from 'express';

const cors = require("cors");
const cookieParser = require("cookie-parser");
// Import Files
import './db/index';
import sponsorRoutes from './routes/sponsor';
import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import domainRoutes from './routes/domain';
import eventRoutes from './routes/event';

// Constatns 
const PORT = process.env.PORT || 4000; //Server Port
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(cors());

// Routes
app.use("/api", authRoutes);
app.use('/api', userRoutes);
app.use('/api', sponsorRoutes);
app.use('/api', domainRoutes);
app.use('/api', eventRoutes)
app.use('//', (req, res) => {
    res.send('Welcome');
});

// Server Connection
app.listen(PORT, () => {
    console.log(`Server is running at Port ${PORT}`);
});
=======
// Import Modules
import 'dotenv/config';
import express from 'express';

const cors = require("cors");
const cookieParser = require("cookie-parser");
// Import Files
import './db/index';
import authRoutes from './routes/auth'
import userRoutes from './routes/user'
import domainRoutes from './routes/domain'
import coordinatorRoutes from './routes/coordinator'

// Constatns 
const PORT = process.env.PORT || 4000; //Server Port
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use(cookieParser());
app.use(cors());

// Routes
app.use("/api", authRoutes);
app.use('/api', userRoutes);
app.use('/api', domainRoutes);
app.use('/api', coordinatorRoutes);
app.use('//', (req, res) => {
    res.send('Welcome')
});

// Server Connection
app.listen(PORT, () => {
    console.log(`Server is running at Port ${PORT}`);
})
>>>>>>> ec4e36d34c5611fba82e2870c6d0297fbefd04b7

// Import Modules
import 'dotenv/config';
import express from 'express';

const cors = require("cors");
const cookieParser = require("cookie-parser");
// Import Files
import './db/index';
import sponsorRoutes from './routes/sponsor';
import authRoutes from './routes/auth'
import userRoutes from './routes/user'

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
app.use('/api', sponsorRoutes);
app.use('//', (req, res) => {
    res.send('Welcome')
});

// Server Connection
app.listen(PORT, () => {
    console.log(`Server is running at Port ${PORT}`);
})
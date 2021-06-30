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
import path from "path"
const sponsorRoutes = require('./routes/sponsor');
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
app.use('/api', sponsorRoutes);
// app.use('/uploads', express.static(path.join(__dirname, "uploads")));
app.use(express.static(path.join(__dirname, "uploads")));
app.use('//', (req, res) => {
    res.send('Welcome')
});



// Server Connection
app.listen(PORT, () => {
    console.log(`Server is running at Port ${PORT}`);
})

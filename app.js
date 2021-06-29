// Import Modules
require('dotenv').config();
const express = require('express');;

const cors = require("cors");
const cookieParser = require("cookie-parser");
// Import Files
require('./db/index');
const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/user')
const domainRoutes = require('./routes/domain')
const coordinatorRoutes = require('./routes/coordinator')
const sponsorRoutes = require('./routes/sponsor')
const eventsRoutes = require('./routes/event')

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
app.use('/api', eventsRoutes);
app.use('/api', sponsorRoutes);
app.use('//', (req, res) => {
    res.send('Welcome :)')
});

// Server Connection
app.listen(PORT, () => {
    console.log(`Server is running at Port ${PORT}`);
})

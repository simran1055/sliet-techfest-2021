require('dotenv').config();
require('./db/index');

// Import Modules
const express = require('express');;
const cors = require("cors");
const cookieParser = require("cookie-parser");

// Import Files
const path = require("path");
const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/user')
const domainRoutes = require('./routes/domain')
const coordinatorRoutes = require('./routes/coordinator')
const sponsorRoutes = require('./routes/sponsor')
const eventsRoutes = require('./routes/event')
const paymentRoutes = require('./routes/payment')
const workshopRoutes = require('./routes/workshop')
const workshopSessionRoutes = require('./routes/workshopSession')

// Constatns 
const PORT = process.env.PORT || 4000; //Server Port
const app = express();

app.set('views', './public');
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, "uploads")));
app.use(express.static(path.join(__dirname, "public")));
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
app.use('/api', eventsRoutes);
app.use('/api', paymentRoutes);
app.use('/api', workshopRoutes);
app.use('/api', workshopSessionRoutes);
app.use('//', (req, res) => {
    res.send('Welcome :)')
});

// Server Connection
app.listen(PORT, () => {
    console.log(`Server is running at Port ${PORT}`);
})


// Import Modules
import express from 'express';
import bodyParser from 'body-parser';

// Import Files
import './db/index';
import routers from './api/index';

// Constatns 
const PORT = 4000; //Server Port
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

// Routes
app.use('/api', routers);
app.use('/', (req, res)=>{
    res.send('Welcome')
});

// Server Connection
app.listen(PORT, ()=>{
    console.log(`Server is running at Port ${PORT}`);
})
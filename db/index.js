import mongoose from 'mongoose';
import os from 'os';

import 'dotenv/config';

const databaseUrl = process.env.DB_USER && os.hostname().indexOf("local") > -1 ?
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.yytvp.mongodb.net/slietTechFest?retryWrites=true&w=majority`
    :
    `mongodb://localhost:27017/slietTechFest`;
;

console.log(databaseUrl);

mongoose.connect(databaseUrl, {
    'useCreateIndex': true,
    'useNewUrlParser': true,
    'useUnifiedTopology': true,
    'useFindAndModify': false
});

mongoose.connection.on('connected', function () {
    console.log('Mongoose connected! ');
});

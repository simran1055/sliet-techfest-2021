const mongoose = require('mongoose');

const databaseUrl = process.env.MONGODB_URL || `mongodb://localhost:27017/slietTechFest`;

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

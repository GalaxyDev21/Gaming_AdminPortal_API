// Configuring the database
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

// Connecting to the database  config.dbURL
mongoose
  .connect('mongodb://localhost:27017/gaming_provider_admin', {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('Successfully connected to the database');
  })
  .catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
  });

require('../models/Users');
require('../models/Accounts');
require('../models/Api_keys');
require('../models/Game_Account');

require('../models/Live_Bets');

require('../models/Suppport_Tickets');
require('../models/Message_Support_Tickets');

module.exports = mongoose;

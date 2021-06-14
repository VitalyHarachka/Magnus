const userRoutes = require('./user_routes');
module.exports = function(app, database) {
  userRoutes(app, database);
};
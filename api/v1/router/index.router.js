const TaskRoutes = require('./task.router')
const UserRoutes = require('./user.router')
const authMiddleware = require("../middleware/auth.middleware")

module.exports = (app) => {
    const version = '/api/v1';

    app.use(version + '/tasks',authMiddleware.requestAuth,TaskRoutes);
    app.use(version + '/user', UserRoutes);
}
const TaskRoutes = require('./task.router')
const UserRoutes = require('./user.router')

module.exports = (app) => {
    const version = '/api/v1';

    app.use(version + '/tasks', TaskRoutes);
    app.use(version + '/user', UserRoutes);
}
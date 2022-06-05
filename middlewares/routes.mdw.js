module.exports = (app) => {
    app.use('/api/users', require('../routes/user.route'));
    app.use('/api/parkings',require('../routes/parking.route'));
    app.use('/api/bookings',require('../routes/booking.route'));
};
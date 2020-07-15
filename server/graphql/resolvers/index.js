const authResolver = require('./auth');
const eventsResolver = require('./events');
const bookingResolver = require('./booking');
const { events } = require('./merge');

const rootResolver = {
    ...authResolver,
    ...eventsResolver,
    ...bookingResolver,
};

module.exports = rootResolver;
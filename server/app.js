const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');

const Event = require('./models/event')

const app = express();

app.use(bodyParser.json());

app.use('/api', graphqlHttp({
    schema: buildSchema(`
        type Event {
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String!
            venue: String!
        }

        input EventInput {
            title: String!
            description: String!
            price: Float!
            date: String!
            venue: String!
        }

        type RootQuery {
            events: [Event!]!
        }

        type RootMutation {
            createEvent(eventInput: EventInput): Event
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    
    //resolvers
    rootValue: {
        events: () => {
            return Event.find().then(events => {
                return events.map(event => {
                    return { ...event._doc, _id: event.id };
                })
            }).catch(err => {
                throw err;
            });
        },
        createEvent: (args) => {
            
            const event = new Event({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: new Date(args.eventInput.date),
                venue: args.eventInput.venue
            });

            return event.save()
            .then(result => {
                console.log(result);
                return { ...result._doc, _id: result._doc._id.toString() }; //long method in getting ID
            }).catch(err => {
                console.log(err);
                throw err;
            });
        }
    },
    graphiql: true
}));

app.get('/', (req, res, next) => {
    res.send('Event Booking');
});

//DB Connection
mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${
    process.env.MONGO_PASSWORD
}@cluster0.o59il.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
)
.then(() => {
    app.listen(3000);
}).catch(err => {
    console.log(err);
});


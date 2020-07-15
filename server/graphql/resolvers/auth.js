const bcrypt = require('bcryptjs');
const User = require('../../models/user');

// const events = eventIds => {
//     return Event.find({_id: {$in: eventIds}}).then(events => {
//         return events.map(event => {
//             return { ...event._doc, _id: event.id, date: new Date(event._doc.date).toISOString(), creator: user.bind(this, event.creator) };
//         });
//     }).catch(err => {
//         throw err;
//     })
// }

// const user = userId => {
//     return User.findById(userId).then(user => {
//         return { ...user._doc, _id: user.id, createdEvents: events.bind(this, user._doc.createdEvents) }
//     }).catch(err => {
//         throw err;
//     })
// }


module.exports = {
    createUser: async args => {
        try{
            const existingUser = await User.findOne({email: args.userInput.email})
                if(existingUser){
                    throw new Error('User exists!')
                }
                const hashedPassword = await bcrypt.hash(args.userInput.password, 12)
            
                const user = new User({
                    name: args.userInput.name,
                    email: args.userInput.email,
                    password: hashedPassword
                });
                const result = await user.save();
                return {...result._doc, password: null, _id: result.id}
        }catch(err) {
            throw err;
        }
    },
};
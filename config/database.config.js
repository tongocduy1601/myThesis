require('dotenv').config()
module.exports = { 
    uri:`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.iyqgl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
};
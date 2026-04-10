require('dotenv').config()

const app = require('./src/app')
const ConnectDB = require('./src/db/db')

const PORT = process.env.PORT || 5000

ConnectDB()

app.listen(PORT,"0.0.0.0",()=>{
    console.log('Server running on port ',PORT);
})
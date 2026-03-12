import 'dotenv/config'
import { connectToDB } from './src/config/database.js'
import {app} from './src/app.js'


connectToDB()  // calling the function to connect to the database

const port = process.env.PORT || 2000
app.listen(port, () => {
    console.log(`Server is listening on the port ${port}`)
})
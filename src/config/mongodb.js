import { MongoClient, ServerApiVersion } from 'mongodb'
import { env } from '*/config/environment'

let dbInstance = null

export const connectDB = async () => {
    const client = new MongoClient(env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 })
    // Connect the client to the server
    await client.connect()

    //Assign clientDB to our dbInstance
    dbInstance = client.db(env.DATABASE_NAME)
}

//Get Database Instance
export const getDB = () => {
    if (!dbInstance) throw new Error('Must connect to Database first!')
    return dbInstance
}
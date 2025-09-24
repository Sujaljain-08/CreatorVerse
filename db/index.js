import 'dotenv/config'
import mongoose from "mongoose"
import express from "express"

const app = express();

export const connectDB = async () => {
    try {

        const connection = await mongoose.connect(`${process.env.DATABASE_URI}/${process.env.DB_NAME}`)
        console.log("DB connection established successfully")

    } catch (err) {

        console.error("database connection failed error: " + err)

    }
}


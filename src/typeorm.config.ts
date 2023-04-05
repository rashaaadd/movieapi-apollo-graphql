import { DataSource } from "typeorm";
import dotenv from 'dotenv';
dotenv.config();
import 'reflect-metadata';
import * as entities from './entities'

export default new DataSource({
    type: "postgres",
    url: process.env.CONNECTION_STRING,
    entities,
    synchronize:true
})
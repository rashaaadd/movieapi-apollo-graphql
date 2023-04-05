import 'reflect-metadata';
import { ApolloServer } from 'apollo-server'
import { schema } from './schema.js'
import typeormConfig from './typeorm.config.js'
import { Context } from './types/Context.js';
import { auth } from './middlewares/auth.js';

const boot = async () => {

    const conn = await typeormConfig.initialize()

    const server = new ApolloServer({
        schema,
        context: ({req}) : Context => {
            const token = req?.headers?.authorization ? 
            auth(req.headers.authorization)
            :
            null

            return { conn, userId: token?.userId }
        }
    })
    server.listen(5000).then(({url})=>{
        console.log(`🚀 Server ready at ${url}`);    
    })

}

boot();
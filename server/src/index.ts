import { Hono } from 'hono'
import { cors } from 'hono/cors'

const app = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        JWT_SECRETKEY: string
    }
}>()

import userRouter from '../routes/user'
import blogRouter from '../routes/blog'

app.use("/*", cors())



app.route("/api/v1/user", userRouter)
app.route("api/v1/blog", blogRouter)

export default app

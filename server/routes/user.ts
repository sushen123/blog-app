import { Hono } from "hono"
import { PrismaClient } from "@prisma/client/edge"
import { withAccelerate } from "@prisma/extension-accelerate"
import { sign } from "hono/jwt"

import { signUpInput } from "@sushen1234/blog-common"
import { signInInput } from "@sushen1234/blog-common"
import { verify } from "hono/jwt"

const userRouter = new Hono<{
    Bindings: {
       DATABASE_URL: string,
       JWT_SECRETKEY: string
    },
    Variables: {
        userId: string 
    }
}>()

userRouter.use("/name", async (c, next) => {
    const authHeader = c.req.header("authorization") || ""
    const user = await verify(authHeader, c.env.JWT_SECRETKEY) ?? ""

    if(user) {
        c.set("userId", user.id as string)
       await  next()
    }
    else {
        c.status(403)
        return c.json({
            message: "You are not logged in "
        })
    }
})

userRouter.post('/signup', async(c) => { 
const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
}).$extends(withAccelerate())

    const body = await c.req.json()
    const { success} = signUpInput.safeParse(body)
    if(!success) {
       
        return c.json({
            message: "Input incorrect"
        }, 401)
    }
 

    try {

        const userExist = await prisma.user.findFirst({
            where: {
              username: body.username
            }
          })
      
          if (userExist) {
            return c.json({
              message: "User already exists"
            }, 405)
          }
          
   const user =  await prisma.user.create({
        data: {
            username: body.username,
            password: body.password,
            name: body.name
        }
    })

    

    const token = await sign({
        id: user.id
    }, c.env.JWT_SECRETKEY)

    return c.json({
        token: token
    })
}
catch(e){
    c.status(403)
    return c.json({error: e})
}

   
  })
  
  
  userRouter.post('/signin', async(c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    const body = await c.req.json()
    const { success} = signInInput.safeParse(body)
    if(!success) {
        c.status(411)
        return c.json({
            message: "Input incorrect"
        })
    }
    try {
        const user = await prisma.user.findUnique({
            where: {
                username: body.username,
                password: body.password
            }
        })

        if(!user) {
            c.status(403)
            return c.json({
                message: "Incorrect Username of Password"
            })
        }

        const token = await sign({
            id: user.id
        }, c.env.JWT_SECRETKEY);

        return c.json({
            token: token
        })
    }
    catch(error) {
       c.status(411)
       return c.json({
        error: error
       })
    }

  })

  userRouter.get("/name", async(c) => {
    const userId = c.get("userId") 
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    
    try {
        const user = await prisma.user.findFirst({
            where: {
               id: Number(userId)
            }
        })

       console.log(user?.name)
        return c.json({
            userName: user?.name
        })
    }
    catch(error) {
       c.status(411)
       return c.json({
        error: error
       })
    }

  })

  export default userRouter
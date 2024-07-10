import { PrismaClient } from "@prisma/client/edge";

import { withAccelerate } from "@prisma/extension-accelerate";
import { verify } from "hono/jwt";
import { Hono } from "hono";

import { createBlogInput } from "@sushen1234/blog-common";
import { updateBlogInput } from "@sushen1234/blog-common";


const blogRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        JWT_SECRETKEY: string
    },
    Variables: {
        userId: string 
    }
}> ()

blogRouter.use("/*", async (c, next) => {
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


blogRouter.post('/write', async(c) => {
    const body = await c.req.json();
    const userId = c.get("userId")

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const { success} = createBlogInput.safeParse(body)
    if(!success) {
        c.status(411)
        return c.json({
            message: "Input incorrect"
        })
    }

   const blog =  await prisma.blog.create({
        data: {
            title: body.title,
            content: body.content,
            authorId: parseInt(userId),
            name: body.name
        }
    })

    return c.json({
        id: blog.id
    })
})

blogRouter.put('/update', async(c) => {
    const body = await c.req.json();
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const { success} = updateBlogInput.safeParse(body)
    if(!success) {
        c.status(411)
        return c.json({
            message: "Input incorrect"
        })
    }

    const blog = await prisma.blog.update({
        where: {
            id: body.id
        },
        data: {
            title: body.title,
            content: body.content,
        
        }
    })

    return c.json({
        id: blog.id
    })
})

blogRouter.put('/updatePublish', async(c) => {
    const body = await c.req.json();
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

   

    const blog = await prisma.blog.update({
        where: {
            id: Number(body.id)
        },
        data: {
          published: true
        }
    })

    return c.json({
        id: blog.id
    })
})

blogRouter.put('/unPublish', async(c) => {
    const body = await c.req.json();
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

   

    const blog = await prisma.blog.update({
        where: {
            id: Number(body.id)
        },
        data: {
          published: false
        }
    })

    return c.json({
        id: blog.id
    })
})



blogRouter.get('/userPublished', async(c) => {
    const userId = c.get("userId")
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    
    const blog = await prisma.blog.findMany({
        where: {
            authorId: Number(userId),
            published: true
        }
    })

    return c.json({
        blog
    })

})


blogRouter.get('/search', async(c) => {
    const query = c.req.query('object')
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    
    const blog = await prisma.blog.findMany({
        where: {
            AND: [
                {
                    published: true
                },
                {
                    OR: [
                        {
                            title: {
                                contains: query,
                                mode: 'insensitive'
                            }
                        },
                        {
                            name: {
                                contains: query,
                                mode: 'insensitive'
                            }
                        }
                    ]
                }
            ]
        }
    })

    return c.json({
        blog
    })

})

blogRouter.get('/draft', async(c) => {
    const userId = c.get("userId")
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    
    const blog = await prisma.blog.findMany({
        where: {
            authorId: Number(userId),
            published: false
        }
    })

    return c.json({
        blog
    })

})

blogRouter.get("/bulk", async(c) => {
    const query = c.req.query("page")
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const page = parseInt(query) || 1
    const pageSize = 5
      
    const offset= (page -1) * pageSize
    
    const blog = await prisma.blog.findMany({
        where: {
            published: true
        },
        skip: offset,
        take: pageSize,
        include: {
            author: {
                select: {
                    name: true
                }
            }
        }
    })


   

    const totalBlogs = await prisma.blog.count({
        where: {
            published: true
        }
    })

    const totalPages = Math.ceil(totalBlogs / pageSize)

    return c.json({
        blog,
        totalPages,
        currentPage: page,
        pageSize
    })
} )








export default blogRouter
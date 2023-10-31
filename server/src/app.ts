import "dotenv"
import { db } from "db";
import express, { NextFunction, Request, RequestHandler, Response } from "express";
import "express-async-errors"
import { ZodError, z } from "zod";
import bcrypt from "bcrypt"
import { Prisma, User } from "@prisma/client";
import jwt from "jsonwebtoken"
import cookieParser from "cookie-parser"
import createHttpError, { HttpError } from "http-errors"
import cors from 'cors'

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors())

// HTTP POST request to /api/signup url
// Routing (HTTP Method + URL)
app.post('/api/signup', async (req, res) => {
    // validation start
    const userSchema = z.object({
        email: z.string().email(),
        password: z.string(),
        name: z.string(),
    })
    const newUser = await userSchema.parseAsync(req.body)
    // validation end
    // db query start
    const newUserDb = await db.user.create({
        data: {
            email: newUser.email,
            passwordHash: await bcrypt.hash(newUser.password, 10),
            name: newUser.name
        }
    })
    // db query end
    // send response to user
    res.status(201).send(newUserDb)
})

app.post('/api/signin', async (req, res) => {
    const userSchema = z.object({
        email: z.string().email(),
        password: z.string(),
    })
    const user = await userSchema.parseAsync(req.body)
    const userFromDb = await db.user.findUnique({
        where: {
            email: user.email
        }
    })
    if (userFromDb) {
        if (await bcrypt.compare(user.password, userFromDb.passwordHash)) {
            // TODO: send JWT token
            const token = jwt.sign({
                id: userFromDb.id
            }, process.env.SECRET ?? 'TopSecret', {
                expiresIn: '1 day'
            })
            res.cookie('token', token, {
                httpOnly: true
            })
            return res.send({
                message: 'Success'
            })
        }
    }
    res.status(401).send({
        error: "Wrong credentials"
    })
})

const auth: RequestHandler = (req, res, next) => {
    const token = req.cookies.token
    if (token) {
        jwt.verify(token, process.env.SECRET ?? 'TopSecret', async (err: unknown, decodedToken: unknown) => {
            if (err) return next(createHttpError.Unauthorized('Wrong token'))
            const token = z.object({
                id: z.number()
            }).safeParse(decodedToken)
            if (token.success) {
                // @ts-ignore
                req.user = await db.user.findUnique({
                    where: {
                        id: token.data.id
                    }
                })
                return next()
            }
            next (createHttpError.Unauthorized('Wrong token'))
        })
    } else {
        next (createHttpError.Unauthorized('Wrong token'))
    }
}

// CRUD resource for
// create, Read, Update, Delete operations
//RESTful API
// Read all tasks (HTTP method - GET)
app.get('/api/tasks', auth, async (req, res) => {
    // @ts-ignore
    const user: User = req.user
    const tasks = await db.task.findMany({
        where: {
            id:user.id
        }
    })
})

// Read one task (HTTP method - GET)
app.get('/api/tasks/:id', auth, async (req, res, next) => {
    // @ts-ignore
    const user: User = req.user
    const id = +req.params.id
    if(Number.isInteger(+id) && +id > 0) {
        const task = await db.task.findFirst({
            where: {
                id,
                userId: user.id
            }
        })
        res.send(task)
    } else {
        next (createHttpError.BadRequest('Wrong id'))
    }

})

// Creat task (HTTP method - POST)
app.post('/api/tasks', auth, async(req, res) => {
     // @ts-ignore
     const user: User = req.user
    const taskSchema = z.object({
        title: z.string(),
        done: z.boolean()        
    })
    const task = await taskSchema.parseAsync(req.body)
    const taskFromDb = await db.task.create({
        data: {...task, userId: user.id}
    })
    res.status(201).send(taskFromDb)
})

// Update task (HTTP method - PATCH)
app.patch('/api/tasks', auth, async (req, res) => {
    // @ts-ignore
    const user: User = req.user
    const id = +req.params.id
    if(Number.isInteger(+id) && +id > 0) {
        const taskSchema = z.object({
            title: z.string().optional(),
            done: z.boolean().optional()        
        })
        const task = await taskSchema.parseAsync(req.body)
        const taskFromDb = await db.task.update({
            data: task,
            where: {
                id,
                userId: user.id
            }
        })
        res.send(taskFromDb)
    } else {
        throw (createHttpError.BadRequest('Wrong id'))
    }
})

// Delete task ((HTTP method - DELET))
app.delete('/api/tasks', auth, async (req, res) => {
     // @ts-ignore
     const user: User = req.user
     const id = +req.params.id
     if(Number.isInteger(+id) && +id > 0) {
         const task = await db.task.delete({
             where: {
                 id,
                 userId: user.id
             }
         })
         res.send(task)
     } else {
         throw (createHttpError.BadRequest('Wrong id'))
     }

})
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    let statusCode = 500
    if (err instanceof ZodError) {
        statusCode = 400
    } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
            statusCode = 409
        } else {
            statusCode = 400
        }
    } else if (err instanceof HttpError) {
        statusCode = err.statusCode
    }
    res.status(statusCode).send({
        error: err.message
    })
})

app.listen(3000, () => {
    console.log('Server started at http://localhost:3000')
})
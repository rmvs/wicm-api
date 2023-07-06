import 'dotenv/config'
import express from 'express';
import cors from 'cors'
import apiRoutes from "@src/routes/Api";
import middleware from "@src/middleware";
import { expressjwt } from 'express-jwt';
import cookieParser from 'cookie-parser'

const app = express()

app.use(cors({
    credentials: true,
    preflightContinue: true,
    origin: process.env.APP_URL
}))
app.use(express.json())
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// app.use(middleware)
// middleware

app.use(function(err: any,req: any,res: any,next: any){
    if(err.name === 'UnauthorizedError'){
        res.status(403).end()
    }
})

app.use("/api",expressjwt({ 
                secret: process.env.SECRET!, 
                algorithms: ["HS256"],
                getToken: (req) => {
                    if(req.headers.authorization?.includes('Bearer')){
                        return req.headers.authorization.split(' ')[1]
                    }else{
                        const accessToken = req.headers.cookie?.split('=')[1]
                        return accessToken?.substring(0,accessToken.indexOf(';'))
                    }
                }
            }).unless({ path: ['/api/auth','/api/signup'] }),
            apiRoutes)

app.listen(process.env.PORT || 3001, () => {
    console.log(`server listening at ${process.env.PORT || 3000}`)
})

export default app
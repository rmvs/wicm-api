import appDbContext from "@prisma/index";
import { generateUUID, hashMD5 } from "@src/lib/utils";
import { userService } from "@src/services";
import { Router } from "express";
import sign from 'jwt-encode'

const authRoute = Router()

authRoute.post('/',async(req,res,next) => {
    const b64 = req.headers.authorization?.substring('basic'.length+1)!
    const [ username, password ] = atob(b64)?.split(':')
    try{
        const user = await appDbContext.user.findFirst({
            where: {
                login: username,
                password: hashMD5(password)
            },
            include: {
                userRole: {
                    select: {
                        roleName: true
                    }
                }
            }
        })
        if(user){
            const actual = new Date();
            actual.setHours(actual.getHours() + 2);
            const token = sign({ exp: actual.getTime(), ...user },process.env.SECRET!);
            userService.setToken(user.id,token);
            res.json({ accessToken: token })
        }else{
            throw "Credenciais inválidas"
        }
    }catch(ex){
        res.status(403).json({ error: ex })
    }
})

export default authRoute
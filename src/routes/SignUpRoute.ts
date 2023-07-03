import appDbContext from '@prisma/index';
import { hashMD5 } from '@src/lib/utils';
import { Response, Router } from 'express';

const signUpRoute = Router()


signUpRoute.post("/",async(req,res) => {
    try{
        const { login, password, email, givenName, familyName } = req.body
        let user = await appDbContext.user.findFirst({
            where: {
                login
            }
        })
        if(user){
            throw "Usuário já  existe"
        }else{
            user = await appDbContext.user.create({
                data: {
                    login,
                    password: hashMD5(password),
                    userRole: {
                        connectOrCreate: {
                            where: {
                                roleName: "GUEST"
                            },
                            create: {
                                roleName: "GUEST"
                            }
                        }
                    }
                }
            });
            res.json({ user })
        }

    }catch(ex){
        res.sendStatus(500).json({ error: String(ex) })
    }
})

export default signUpRoute
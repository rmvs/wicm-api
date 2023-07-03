import { Request, Response, NextFunction } from "express"

const authorizedUrls = new Set(['/auth','/services'])

const middleware = (req: Request, res: Response, next: NextFunction) => {    
    try{
        if(authorizedUrls.has(req.url)){
            next()
        }else{
            if(req.headers.authorization){
                const token = req.headers.authorization?.split('Bearer')[1]?.trim()
                if(token){                    
                    next()
                }
            }
            throw "Token inválido"
        }
    }catch(ex){
        res.sendStatus(403)
    }
}

export default middleware
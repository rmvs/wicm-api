import { PrismaClient } from "@prisma/client"

let appDbContext:PrismaClient

if(process.env.NODE_ENV === 'production'){    
    appDbContext = new PrismaClient()
}else{
    if(!(global as any).appDbContext){
        (global as any).appDbContext = new PrismaClient()
    }
    appDbContext = (global as any).appDbContext
}

export default appDbContext
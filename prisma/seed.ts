import { hashMD5, generateUUID } from "../src/lib/utils"
import appDbContext from "."
import { Prisma } from "@prisma/client"


async function main(){ 
    await appDbContext.$transaction(async(tx) => {
        const userRoles = ['ADMIN','OPERATOR']
        const userNames = ['admin','operator']  
        
        const roles: string[] = []
        for(let i = 0;i < userRoles.length; i++){
            let role = await tx.userRole.findFirst({
                where: {
                    roleName: userRoles[i]
                }
            })
            if(!role){
                role = await tx.userRole.create({
                    data: {
                        roleName: userRoles[i]
                    }
                })
            }
            roles.push(role.id)
        }

        const users: any[] = []
        for(let i = 0; i < userNames.length; i++){
            let user = await tx.user.findFirst({
                where: {
                    login: userNames[i]
                }
            })
            if(!user){
                user = await tx.user.create({
                    data: {
                        login: userNames[i],
                        password: hashMD5(userNames[i]),
                        userRole: {
                            connect: {
                                id: roles[i]
                            }
                        }
                    }
                })
            }
            users.push(user)
        }

        // const stacks = [
        //     {
        //         environment: 'PRODUCTION',
        //         name: generateUUID(),
        //         user: users.find( s => s.login === 'admin'),
        //         services: [
        //             {
        //                 name: 'nginx',
        //                 image: 'nginx',
        //                 volume: {
        //                     name: generateUUID()
        //                 }
        //             },
        //             {
        //                 name: 'ubuntu',
        //                 image: 'ubuntu',
        //                 volume: {
        //                     name: generateUUID()
        //                 }
        //             },
        //             {
        //                 name: 'keycloak',
        //                 image: 'keycloak',
        //                 volume: {
        //                     name: generateUUID()
        //                 }
        //             }
        //         ],
        //         network: generateUUID()
        //     },
        //     {
        //         environment: 'TEST',
        //         name: generateUUID(),
        //         user: users.find( s => s.login === 'operator'),
        //         services: [
        //             {
        //                 name: 'mysql',
        //                 image: 'mysql',
        //                 volume: {
        //                     name: generateUUID()
        //                 }
        //             },
        //             {
        //                 name: 'windows-server',
        //                 image: 'windowsserver',
        //                 volume: {
        //                     name: generateUUID()
        //                 }
        //             },
        //         ],
        //         network: generateUUID()
        //     },
        // ]

        // const servicesCreated: any[] = []

        // for(let i = 0;i < stacks.length; i++){  

        //     let environment = await tx.environment.findFirst({
        //         where: {
        //             name: stacks[i].environment
        //         }
        //     })
        //     if(!environment){
        //         environment = await tx.environment.create({
        //             data: {
        //                 name: stacks[i].environment,
        //             }
        //         })
        //     }

        //     let network = await tx.network.findFirst({
        //         where: {
        //             name: stacks[i].network
        //         }
        //     })

        //     if(!network){
        //         network = await tx.network.create({
        //             data: {
        //                 name: stacks[i].network
        //             }
        //         })
        //     }

        //     let stack = await tx.stack.findFirst({
        //         where: {
        //             name: stacks[i].name
        //         }
        //     })
            
        //     if(!stack){
        //         stack = await tx.stack.create({
        //             data: {
        //                 name: stacks[i].name,
        //                 network: {
        //                     connect: {
        //                         id: network.id
        //                     }
        //                 }
        //             }
        //         })
        //     }

        //     for(let j = 0; j < stacks[i].services.length; j++){
        //         let image = await tx.image.findFirst({
        //             where: {
        //                 name: stacks[i].services[j].image
        //             }
        //         })
        //         if(!image){
        //             image = await tx.image.create({
        //                 data: {
        //                     name: stacks[i].services[j].image
        //                 }
        //             })
        //         }

        //         let volume = await tx.volume.findFirst({
        //             where: {
        //                 name: stacks[i].services[j].name
        //             }
        //         })
        //         if(!volume){
        //             volume = await tx.volume.create({
        //                 data: {
        //                     name: stacks[i].services[j].volume.name
        //                 }
        //             })
        //         }            
                
        //         let service: any = await tx.service.findFirst({
        //             where: {
        //                 name: stacks[i].services[j].name,
        //             }
        //         })
        //         if(!service){
        //             service = await tx.service.create({
        //                 data: {
        //                     name: stacks[i].services[j].name,
        //                     environment: {
        //                         connect: {
        //                             id: environment.id
        //                         }
        //                     },
        //                     stack: {
        //                         connect: {
        //                             id: stack.id
        //                         }
        //                     },
        //                     volume: {
        //                         connect: {
        //                             id: volume.id
        //                         }
        //                     },
        //                     serviceImage: {
        //                         connect: {
        //                             id: image.id
        //                         }
        //                     }
        //                 }
        //             })
        //             servicesCreated.push(service)
        //         } 
        //     }
        // }

        users.length > 0 && console.log(`${users.length} users has been created`)
        // servicesCreated.length > 0 && console.log(`${servicesCreated.length} services has been created`)
        // users.length === 0 && servicesCreated.length === 0 && console.log('nothing to create')
    },{
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        maxWait: 1000 * 60 * 30,
        timeout: 1000 * 60 * 30
    })   
}

main().then(async() => {
    await appDbContext.$disconnect()
}).catch(async (err) => {
    console.error(err)
    await appDbContext.$disconnect()
    process.exit(1)
})
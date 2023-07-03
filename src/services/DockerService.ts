import Docker from 'dockerode'
import fs from 'fs'
import path from 'path'

export default class DockerService {

    constructor(private docker = new Docker({
        host: process.env.DKCR_HOST,
        port: process.env.DCKR_PORT,
        protocol: 'https',
        ca: fs.readFileSync(path.join(__dirname,'/certs/ca.pem')),
        cert: fs.readFileSync(path.join(__dirname,'certs/cert.pem')),
        key: fs.readFileSync(path.join(__dirname,'certs/key.pem'))
    })){
        
    }

    listServices(options?: Docker.ServiceListOptions){
        return this.docker.listServices(options)
    }

    createService(options: Docker.CreateServiceOptions){
        return this.docker.createService(options)
    }

    deleteService(id: any){
        return this.docker.getService(id).remove()
    }

    getService(id: any){
        return this.docker.getService(id) 
    }

    updateService(id: any,options: any){
        return this.docker.getService(id).update(options)
    }
}
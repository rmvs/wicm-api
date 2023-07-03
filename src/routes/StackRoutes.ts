import { dockerService } from '@src/services';
import { Router } from 'express';
import multer from 'multer';
import yaml from 'js-yaml';
import appDbContext from '@prisma/index';

const stackRoutes = Router()
const upload = multer()

stackRoutes.get("/",async(req: any,res,next) => {
    let filters: any = {
        label: [
            'com.docker.stack.namespace',
        ],
    }
    if(!['ADMIN','GUEST'].includes(req.auth.userRole.roleName)){
        filters['label'] = [
            ...filters['label'],
            `owner=${req.auth.login}`
        ]
    }
    const services = await dockerService.listServices({
        filters
    })
    res.json({services})
})

stackRoutes.post("/",upload.any(),async(req: any,res,next) => {
    try{
        const file = (req.files as any).shift();
        const yamlFile: any = yaml.load(file.buffer)
        const serviceKeys = Object.keys(yamlFile.services)
        let stackName = undefined
        const servicesCreated = []
        for(const key of serviceKeys){
            const { deploy, image, networks, ports, volumes,command, environment }: any = yamlFile.services[key];
            const deployMode = deploy.mode === 'replicated' ? { Replicated: { Replicas: deploy.replicas } } : { }            
            let labels: any = {}
            let _ports:any[] = []
            let _volumes: any[] = []
            volumes.forEach((volume: any) => {
                const [Source, Target] = volume.split(':')
                _volumes.push({
                    type: 'volume',
                    Source,
                    Target
                })
            })            
            deploy.labels.forEach((label: any) => {
                const [key,value] = label.split('=')
                labels[key] = value;
            })
            labels['owner'] = req.auth.login;
            if(!stackName){
                stackName = labels['com.docker.stack.namespace']
            }
            ports.forEach((port: any) => {
                const [ TargetPort, PublishedPort ] = port.split(':')
                _ports.push({
                    Protocol: 'tcp',
                    TargetPort: Number(TargetPort),
                    PublishedPort: Number(PublishedPort),
                    PublishMode: 'ingress'
                })
            })
            const response = await dockerService.createService({
                Name: `${labels['com.docker.stack.namespace']}_${key}`,
                TaskTemplate: {
                    ContainerSpec: {
                        Image: image,
                        Command: command,
                        Mounts: _volumes,
                        Env: environment
                    },
                    Placement: {
                        Constraints: deploy?.placement?.constraints
                    }
                },
                Labels: { ...labels },
                Mode: { ...deployMode  },
                Networks: [
                    {
                        Target: process.env.SWARM_NETWORK_ID
                    }
                ],
                EndpointSpec: {
                    Ports: _ports
                }
            })
            servicesCreated.push(response)            
        }
        if(servicesCreated.length > 0){
            appDbContext.stack.create({
                data: {
                    name: stackName,
                    stackId: stackName,
                    user: {
                        connect: {
                            id: req.auth.id
                        }
                    }
                }
            })
        }
        res.json({servicesCreated})        
    }catch(ex){
        res.status(500).json({ error: ex })
    }
})

// stackRoutes.delete('/:id',(req: any,res) => {
//     const { id } = req.query;    
// })


export default stackRoutes

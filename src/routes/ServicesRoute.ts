import { Response, Router } from 'express';
import { dockerService } from '@src/services';
import { Request as JWTRequest } from "express-jwt";

const servicesRoute = Router()

servicesRoute.get("/",async(req:JWTRequest,res: Response) => {
    const services = await dockerService.listServices({
        filters: {
            label: [
                `owner=${req.auth?.id}`
            ]
        }
    })
    res.json({services})
})

servicesRoute.get("/:id",async(req:JWTRequest,res: Response) => {
    const { id } = req.params
    try{
        const service = await dockerService.getService(id)
        const inspect = await service.inspect()
        // const services = await dockerService.listServices({
        //     filters: {
        //         label: [
        //             `owner=${req.auth?.id}`
        //         ]
        //     }
        // })
        res.json({service: inspect})
    }catch(ex){
        res.status(500).json({ error: String(ex) })
    }
})

servicesRoute.delete("/:id",async(req:JWTRequest,res: Response) => {
    const { id } = req.params    
    const response = await dockerService.deleteService(id)
    res.json({ response })
})

servicesRoute.patch("/:id",async(req: JWTRequest, res: Response) => {
    const { id } = req.params
    const { replicas, ports } = req.body
    const payload: any = {}
    if(replicas){
        payload['Mode'] = {
            Replicated: {
                Replicas: parseInt(replicas)
            }
        }
    }
    const _ports: any[] = []
    if(ports){
        ports.forEach((port: any) => {
            const [PublishedPort, TargetPort] = ports.split(':')
            _ports.push({
                Protocol: 'tcp',
                PublishedPort: parseInt(PublishedPort),
                TargetPort: parseInt(TargetPort),
                PublishMode: 'ingress'
            })
        })        
        payload['EndpointSpec'] = {
            Ports: _ports
        }
    }
    const service = await dockerService.getService(id);
    const inspectService = await service.inspect()
    const response = await service.update({
        version: inspectService.Version.Index,
        ...inspectService.Spec,
        ...payload
    })
    res.json({ response })
})


export default servicesRoute
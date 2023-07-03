export default class UserService {

    constructor(private tokenRepository: any[] = []){
        
    }

    public setToken(userId: any, token: any){
        this.tokenRepository[userId] = token;       
    }

    public remToken(userId: any){
        delete this.tokenRepository[userId]
    }
    
    public isValid(userId: any){
        if(this.tokenRepository[userId] === undefined){
            return false;
        }        
    }

}
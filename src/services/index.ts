import DockerService from "./DockerService";
import UserService from "./UserService";

const dockerService = new DockerService()
const userService = new UserService()

export { dockerService, userService }

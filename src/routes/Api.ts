import { Router } from "express";
import servicesRoute from "@src/routes/ServicesRoute";
import stackRoutes from "@src/routes/StackRoutes";
import deployRoutes from "@src/routes/DeployRoutes";
import signUpRoute from '@src/routes/SignUpRoute';
import authRoute from "./AuthRoute";

const apiRoutes = Router()

apiRoutes.use("/auth",authRoute)
apiRoutes.use("/stacks",stackRoutes)
apiRoutes.use("/services",servicesRoute)
apiRoutes.use("/deploy",deployRoutes)
apiRoutes.use("/signup",signUpRoute)

export default apiRoutes
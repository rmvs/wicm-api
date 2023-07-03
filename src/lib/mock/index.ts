import User, { UserRole } from "../business/user";

const adminUserMock = new User(UserRole.ADMIN,'admin','21232f297a57a5a743894a0e4a801fc3',{ givenName: 'Admin', familyName: 'admin' })
const operatorUserMock = new User(UserRole.OPERATOR,'operator','4b583376b2767b923c3e1da60d10de59',{ givenName: 'Operator', familyName: 'operator' })

export const usersMock = [
    adminUserMock,
    operatorUserMock
]
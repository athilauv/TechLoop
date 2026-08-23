import { USER_ROLE_ID } from "../constants/roles.constants.ts";


interface HasUserRoleId {
    userRoleId: number;
}


export function isMentor(entity: HasUserRoleId): boolean {
    return entity.userRoleId === USER_ROLE_ID.MENTOR;
}

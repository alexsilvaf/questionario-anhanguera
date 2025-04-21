export interface UserPermissionModel {
    id: number;
    name: string;
    description: string;
    userPermissionList: UserPermissionModel[];
}
import { UserPermissionModel } from "./UserPermissionModel";

export interface UserGroupModel {
  id: number;
  name: string;
  permissionList: UserPermissionModel[];
}
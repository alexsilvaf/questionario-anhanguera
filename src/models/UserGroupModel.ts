import { UserPermissionModel } from "./UserPermissionModel";

export interface UserGroupModel {
  id: number;
  name: string;
  managedGroupList: UserGroupModel[];
  permissionList: UserPermissionModel[];
}
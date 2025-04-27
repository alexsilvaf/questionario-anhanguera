import { UserGroupModel } from "./UserGroupModel";

export type UserDataModel = {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    userGroup: UserGroupModel;
  };
  
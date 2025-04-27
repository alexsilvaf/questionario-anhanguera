import { UserGroupModel } from "./UserGroupModel";

export type UserAuthenticationModel = {
    email: string;
    userGroup: UserGroupModel;
    courseClassName: string;
  };
  
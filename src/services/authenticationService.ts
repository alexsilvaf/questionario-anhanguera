import http from './http';
import { LoginModel } from '../models/LoginModel';
import { RegisterModel } from '../models/RegisterModel';
import { AxiosResponse } from 'axios';
import { UserGroupModel } from '../models/UserGroupModel';
import { UserPermissionModel } from '../models/UserPermissionModel';
import { UserGroupCreateUpdateModel } from '../models/UserGroupCreateUpdateModel';

export const login = (data: LoginModel) => {
    return http.post('/auth/login', data, { withCredentials: true });
};

export const register = (data: RegisterModel) => {
    return http.post('/user/register', data, { withCredentials: true });
};

export const logout = () => {
    return http.post('/auth/logout', {}, { withCredentials: true });
};

export const getCurrentUser = () => {
    return http.get('/auth/me', { withCredentials: true });
};

export const sendPasswordResetEmail = (email: string): Promise<string> => {
    return http
        .post<string, AxiosResponse<string>>(
            '/auth/forgot-password',
            { email },
            { withCredentials: true }
        )
        .then(res => res.data);
}

export const resetPassword = (
    token: string,
    newPassword: string
): Promise<string> => {
    return http
        .post<string, AxiosResponse<string>>(
            '/auth/reset-password',
            { token, password: newPassword },
            { withCredentials: true }
        )
        .then(res => res.data);
};

export const findAllGroups = (): Promise<UserGroupModel[]> => {
    return http
        .get<UserGroupModel[], AxiosResponse<UserGroupModel[]>>(
            '/auth/group/findall',
            { withCredentials: true }
        )
        .then(res => res.data);
};

export const findAllPermissions = (): Promise<UserPermissionModel[]> => {
    return http
        .get<UserPermissionModel[], AxiosResponse<UserPermissionModel[]>>(
            '/auth/permission/findall',
            { withCredentials: true }
        )
        .then(res => res.data);
}

export const findPermissionsByGroup = (id: number): Promise<UserPermissionModel[]> => {
    return http
        .get<UserPermissionModel[], AxiosResponse<UserPermissionModel[]>>(
            '/auth/permission/findbygroup/' + id,
            { withCredentials: true }
        )
        .then(res => res.data);
}

export const updateGroupPermissions = (group: UserGroupCreateUpdateModel): Promise<void> => {
    return http
        .put<void, AxiosResponse<void>>(
            '/auth/group/update/' + group.groupId,
            group,
            { withCredentials: true }
        )
        .then(res => res.data);
}

const authenticationService = {
    login,
    register,
    logout,
    getCurrentUser,
    sendPasswordResetEmail,
    resetPassword,
    findAllGroups,
    findAllPermissions,
    findPermissionsByGroup,
    updateGroupPermissions,
};

export default authenticationService;

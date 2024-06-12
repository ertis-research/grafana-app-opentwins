import { getBackendSrv } from '@grafana/runtime';

export enum Roles {
    VIEWER = 'viewer',
    ADMIN = 'admin',
    EDITOR = 'editor'
}

export const getCurrentUserRole = async (): Promise<string> => {
    try {
        const user = await getBackendSrv().get('/api/user');
        console.log('Current User:', user);
        return (user.login) ? user.login : Roles.VIEWER;
    } catch (error) {
        console.error('Error fetching user role:', error);
        return Roles.VIEWER;
    }
}

export const checkIsEditor = async (): Promise<boolean> => {
    const role = await getCurrentUserRole()
    return isEditor(role)
}

export const isEditor = (role: string): boolean => {
    return role === Roles.ADMIN || role === Roles.EDITOR
}

export const hasAuth = (role: string, minRole: Roles): boolean => {
    if (role === minRole || minRole === Roles.VIEWER) {
        return true
    } else if (minRole === Roles.EDITOR) {
        return role === Roles.ADMIN
    } else {
        return false
    }
}

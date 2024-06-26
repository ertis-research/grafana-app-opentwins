import { getBackendSrv } from '@grafana/runtime';

export enum Roles {
    VIEWER = 'Viewer',
    ADMIN = 'Admin',
    EDITOR = 'Editor'
}

export const getCurrentUserRole = async (): Promise<string> => {
    try {
        const currentOrg: any = await getBackendSrv().get('/api/org');
        const currentUserOrgs: any[] = await getBackendSrv().get('/api/user/orgs');
        const currentInfo = currentUserOrgs.find((org: any) => org.orgId === currentOrg.id)
        console.log('Current info:', currentInfo);
        return (currentInfo.role) ? currentInfo.role : Roles.VIEWER;
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

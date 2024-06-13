import { AppRootProps, IconName } from '@grafana/data'
import { TwinsPage } from './twinsPage'
import { PoliciesPage } from './policiesPage'
import { TypesPage } from './typesPage'
import { ConnectionsPage } from './connectionsPage'
import { AgentsPage } from './agentsPage'

export type PageDefinition = {
  component: React.FC<AppRootProps>;
  icon: IconName;
  id: string;
  text: string;
  showIf: (meta: AppRootProps['meta']) => boolean;
};

export const pages: PageDefinition[] = [
  {
    component: TwinsPage,
    icon: 'file-alt',
    id: 'twins',
    text: 'Twins',
    showIf: (meta: AppRootProps['meta']) => true
  },
  {
    component: TypesPage,
    icon: 'folder-plus',
    id: 'types',
    text: 'Types',
    showIf: (meta: AppRootProps['meta']) => true
  },
  {
    component: AgentsPage,
    icon: 'users-alt',
    id: 'agents',
    text: 'Agents',
    showIf: ((meta: AppRootProps['meta']) => {return meta.jsonData !== undefined && meta.jsonData.agentsURL !== undefined && meta.jsonData.agentsURL !== null && meta.jsonData.agentsURL.trim() !== ''})
  },
  {
    component: ConnectionsPage,
    icon: 'plug',
    id: 'connections',
    text: 'Connections',
    showIf: (meta: AppRootProps['meta']) => true
  },
  {
    component: PoliciesPage,
    icon: 'shield',
    id: 'policies',
    text: 'Policies',
    showIf: (meta: AppRootProps['meta']) => true
  }
];

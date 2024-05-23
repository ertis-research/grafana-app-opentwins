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
};

export const pages: PageDefinition[] = [
  {
    component: TwinsPage,
    icon: 'file-alt',
    id: 'twins',
    text: 'Twins',
  },
  {
    component: TypesPage,
    icon: 'folder-plus',
    id: 'types',
    text: 'Types',
  },
  {
    component: AgentsPage,
    icon: 'users-alt',
    id: 'agents',
    text: 'Agents',
  },
  {
    component: PoliciesPage,
    icon: 'shield',
    id: 'policies',
    text: 'Policies',
  },
  {
    component: ConnectionsPage,
    icon: 'plug',
    id: 'connections',
    text: 'Connections',
  }
];

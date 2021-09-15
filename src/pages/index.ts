import { AppRootProps } from '@grafana/data';
import { TwinsPage } from './TwinsPage';
import { PoliciesPage } from './PoliciesPage';
import { TypesPage } from './TypesPage';

export type PageDefinition = {
  component: React.FC<AppRootProps>;
  icon: string;
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
    component: PoliciesPage,
    icon: 'shield',
    id: 'policies',
    text: 'Policies',
  },
];

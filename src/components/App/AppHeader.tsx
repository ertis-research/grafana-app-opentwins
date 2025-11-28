import React, { useEffect, useState } from 'react';
import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';
import { useStyles2, TabsBar, Tab, IconName } from '@grafana/ui';
import { useLocation, useHistory } from 'react-router-dom';
import logoSrc from '../../img/logo.svg'; 

interface NavItem {
  label: string;
  id: string;
  icon: IconName; 
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Twins', id: 'twins', icon: 'cube' },
  { label: 'Types', id: 'types', icon: 'sitemap' },
  { label: 'Agents', id: 'agents', icon: 'users-alt' },
  { label: 'Connections', id: 'connections', icon: 'plug' },
  { label: 'Policies', id: 'policies', icon: 'shield' },
];

// 1. Definimos la interfaz de las props
interface AppHeaderProps {
  basePath: string; // Recibimos la ruta base segura desde el padre
}

export const AppHeader = ({ basePath }: AppHeaderProps) => {
  const styles = useStyles2(getStyles);
  const location = useLocation();
  const history = useHistory();

  const [activeTabId, setActiveTabId] = useState('twins');

  useEffect(() => {
    const relativePath = location.pathname.replace(basePath, '');
    const section = relativePath.split('/')[1];

    const foundTab = NAV_ITEMS.find(item => item.id === section);
    
    if (foundTab) {
        setActiveTabId(foundTab.id);
    } else {
        setActiveTabId('twins');
    }
  }, [location.pathname, basePath]);

  const onNavigate = (tabId: string) => {
    console.log("HOLA")
    console.log(`${basePath}/${tabId}`)
    history.push(`${basePath}/${tabId}`);
  };

  return (
    <header className={styles.header}>
      <div className={styles.logoSection}>
        <div className={styles.logoContainer}>
          <img src={logoSrc} alt="OpenTwins Logo" className={styles.logoImage} />
        </div>
        <h1 className={styles.appName}>OpenTwins</h1>
      </div>

      <div className={styles.navSection}>
        <TabsBar className={styles.tabsBar} hideBorder={true}>
          {NAV_ITEMS.map((item) => (
            <Tab
              key={item.id}
              label={item.label}
              icon={item.icon}
              active={activeTabId === item.id}
              onChangeTab={() => onNavigate(item.id)}
              className={styles.tabItem}
            />
          ))}
        </TabsBar>
      </div>
    </header>
  );
};

const getStyles = (theme: GrafanaTheme2) => ({
  header: css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 56px;
    padding: 0 ${theme.spacing(2)};
    background: ${theme.colors.background.primary}; 
    border-bottom: 1px solid ${theme.colors.border.weak};
    flex-shrink: 0;
    width: 100%;
    box-sizing: border-box;
    overflow-x: hidden;
  `,
  logoSection: css`
    display: flex;
    align-items: center;
    gap: ${theme.spacing(1.5)};
    flex-shrink: 0;
  `,
  logoContainer: css`
     display: flex;
     align-items: center;
     justify-content: center;
     background: ${theme.colors.background.primary};
     padding: 8px;
     border-radius: ${theme.shape.borderRadius()};
     box-shadow: ${theme.shadows.z1};
  `,
  logoImage: css`
    height: 24px; 
    width: auto; 
    display: block; 
  `,
  appName: css`
    margin: 0;
    font-size: 18px;
    font-weight: ${theme.typography.fontWeightMedium};
    color: ${theme.colors.text.primary};
    line-height: 1;
    letter-spacing: -0.01em;
    white-space: nowrap;
  `,
  navSection: css`
    height: 100%;
    display: flex;
    align-items: flex-end;
    flex-grow: 1;       
    min-width: 0;      
    justify-content: flex-end;
  `,
  tabsBar: css`
    margin-bottom: 0 !important; 
    border-bottom: none !important;
    max-width: 100%; 
    overflow-x: auto; 
    &::-webkit-scrollbar { display: none; }
    scrollbar-width: none;
  `,
  tabItem: css`
    padding-top: ${theme.spacing(1.5)} !important;
    padding-bottom: ${theme.spacing(1)} !important;
    margin-bottom: -1px;
    white-space: nowrap;
  `
});

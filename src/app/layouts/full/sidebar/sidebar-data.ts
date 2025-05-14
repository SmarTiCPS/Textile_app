import { NavItem } from './nav-item/nav-item';

export const navItems: NavItem[] = [
  {
    navCap: 'Home',
  },
  {
    displayName: 'Main',
    iconName: 'layout-dashboard',
    route: '/main',
  },
  {
    displayName: 'Dashboard',
    iconName: 'layout-dashboard',
    route: '/dashboard/dashboard',
  },
  {
    displayName: 'HistoricData',
    iconName: 'layout-dashboard',
    route: '/dashboard/historic',
  },
  {
    displayName: 'workers',
    iconName: 'layout-dashboard',
    route: '/workers',
  },
  {
    displayName: 'Devices',
    iconName: 'layout-dashboard',
    route: '/devices',
  },
  {
    displayName: 'overview',
    iconName: 'layout-dashboard',
    route: '/dashboard/overview',
  },
  {
    displayName: 'VideoViewer',
    iconName: 'aperture',
    route: '/video-page/video',
  },
  {
    displayName: 'planViewer',
    iconName: 'aperture',
    route: '/video-page/plan',
  },
  {
    navCap: 'Ui Components',
  },
  {
    displayName: 'Badge',
    iconName: 'rosette',
    route: '/ui-components/badge',
  },
  {
    displayName: 'Chips',
    iconName: 'poker-chip',
    route: '/ui-components/chips',
  },
  {
    displayName: 'Lists',
    iconName: 'list',
    route: '/ui-components/lists',
  },
  {
    displayName: 'Menu',
    iconName: 'layout-navbar-expand',
    route: '/ui-components/menu',
  },
  {
    displayName: 'Tooltips',
    iconName: 'tooltip',
    route: '/ui-components/tooltips',
  },
  {
    navCap: 'Auth',
  },
  {
    displayName: 'Login',
    iconName: 'lock',
    route: '/authentication/login',
  },
  {
    displayName: 'Register',
    iconName: 'user-plus',
    route: '/authentication/register',
  },
  {
    navCap: 'Extra',
  },
  {
    displayName: 'Icons',
    iconName: 'mood-smile',
    route: '/extra/icons',
  },
  {
    displayName: 'Sample Page',
    iconName: 'aperture',
    route: '/extra/sample-page',
  },
];

import { createElement } from 'react';
import dynamic from 'dva/dynamic';
import pathToRegexp from 'path-to-regexp';
import { getMenuData } from './menu';

let routerDataCache;

const modelNotExisted = (app, model) => (
  // eslint-disable-next-line
  !app._models.some(({ namespace }) => {
    return namespace === model.substring(model.lastIndexOf('/') + 1);
  })
);

// wrapper of dynamic
const dynamicWrapper = (app, models, component) => {
  // () => require('module')
  // transformed by babel-plugin-dynamic-import-node-sync
  if (component.toString().indexOf('.then(') < 0) {
    models.forEach((model) => {
      if (modelNotExisted(app, model)) {
        // eslint-disable-next-line
        app.model(require(`../models/${model}`).default);
      }
    });
    return (props) => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }
      return createElement(component().default, {
        ...props,
        routerData: routerDataCache,
      });
    };
  }
  // () => import('module')
  return dynamic({
    app,
    models: () => models.filter(
      model => modelNotExisted(app, model)).map(m => import(`../models/${m}.js`)
    ),
    // add routerData prop
    component: () => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }
      return component().then((raw) => {
        const Component = raw.default || raw;
        return props => createElement(Component, {
          ...props,
          routerData: routerDataCache,
        });
      });
    },
  });
};

function getFlatMenuData(menus) {
  let keys = {};
  menus.forEach((item) => {
    if (item.children) {
      keys[item.path] = { ...item };
      keys = { ...keys, ...getFlatMenuData(item.children) };
    } else {
      keys[item.path] = { ...item };
    }
  });
  return keys;
}

export const getRouterData = (app) => {
  const routerConfig = {
    '/': {
      component: dynamicWrapper(app, ['seeuser/login'], () => import('../layouts/BasicLayout')),
    },
    '/result/success': {
      component: dynamicWrapper(app, [], () => import('../routes/Result/Success')),
    },
    '/result/fail': {
      component: dynamicWrapper(app, [], () => import('../routes/Result/Error')),
    },
    '/exception/403': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/403')),
    },
    '/exception/404': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/404')),
    },
    '/exception/500': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/500')),
    },
    '/exception/trigger': {
      component: dynamicWrapper(app, ['error'], () => import('../routes/Exception/triggerException')),
    },
    '/user': {
      component: dynamicWrapper(app, [], () => import('../layouts/UserLayout')),
    },
    '/user/login': {
      component: dynamicWrapper(app, ['seeuser/login'], () => import('../routes/User/Login')),
    },
    // '/user/register': {
    //   component: dynamicWrapper(app, ['register'], () => import('../routes/User/Register')),
    // },
    // '/user/register-result': {
    //   component: dynamicWrapper(app, [], () => import('../routes/User/RegisterResult')),
    // },
    // '/user/:id': {
    //   component: dynamicWrapper(app, [], () => import('../routes/User/SomeComponent')),
    // },
    '/material/audio': {
      component: dynamicWrapper(app, ['material/audio'], () => import('../routes/Material/Audio/Audio')),
    },
    '/material/picture': {
      component: dynamicWrapper(app, ['material/picture'], () => import('../routes/Material/Picture/Picture')),
    },
    '/material/video': {
      component: dynamicWrapper(app, ['material/video'], () => import('../routes/Material/Video/Video')),
    },
    '/show': {
      component: dynamicWrapper(app, ['show/showmain'], () => import('../routes/Show/ShowPanel')),
    },
    '/folder': {
      component: dynamicWrapper(app, ['material/folder'], () => import('../routes/Material/ModalForFolder')),
    },
    '/beacon/beacon': {
      component: dynamicWrapper(app, ['beacon/installBeacon'], () => import('../routes/BeaconInstalled/Beacon')),
    },
    '/beacon/show/:showId/maps/:showTitle': {
      component: dynamicWrapper(app, ['beacon/showmap'], () => import('../routes/BeaconInstalled/ShowMap')),
    },
    '/beacon/show-maps': {
      component: dynamicWrapper(app, ['beacon/showmap'], () => import('../routes/BeaconInstalled/ShowPanel2Map')),
    },
    '/beacon/show/:showId/beacons/:showTitle': {
      component: dynamicWrapper(app, ['beacon/installBeacon2Show'], () => import('../routes/BeaconInstalled/ShowBeacon')),
    },
    '/beacon/show-beacons': {
      component: dynamicWrapper(app, ['beacon/showmap'], () => import('../routes/BeaconInstalled/ShowPanel2Beacon')),
    },
    '/shows/:showId': {
      component: dynamicWrapper(app, ['resources/resourcesgroup', 'resources/wxasync'], () => import('../routes/ResourcesGroup/ResourcesGroupTabPanel')),
    },
    '/shows/:showId/all': {
      component: dynamicWrapper(app, ['resources/resourcesgroup', 'beacon/beacon'], () => import('../routes/ResourcesGroup/NormalList')),
    },
    '/shows/:showId/ar': {
      component: dynamicWrapper(app, ['resources/resourcesgroup'], () => import('../routes/ResourcesGroup/ARList')),
    },
    '/shows/:showId/beacons': {
      component: dynamicWrapper(app, ['resources/resourcesgroup', 'beacon/beacon'], () => import('../routes/ResourcesGroup/BeaconList')),
    },
    '/shows/:showId/qrcode': {
      component: dynamicWrapper(app, ['resources/resourcesgroup'], () => import('../routes/ResourcesGroup/QRCodeList')),
    },
    '/show-resources/:groupId/show/:showId/items/:groupName': {
      component: dynamicWrapper(app, ['resources/resourceitem'], () => import('../routes/ResourceItem/ResourceItem')),
    },
    '/show-resources/:groupId/show/:showId/editor': {
      component: dynamicWrapper(app, ['material/webpage'], () => import('../routes/ResourceItem/WebEditor')),
    },
    '/show-resources/:groupId/show/:showId/items/editor/:itemId/update': {
      component: dynamicWrapper(app, ['material/webpage'], () => import('../routes/ResourceItem/WebEditor2Edit')),
    },
    '/users/appusers': {
      component: dynamicWrapper(app, ['seeuser/seeuser'], () => import('../routes/SEEUser/User')),
    },
    '/users/admins': {
      component: dynamicWrapper(app, ['seeuser/seeuadmin'], () => import('../routes/SEEUser/UserAdmin')),
    },
    '/record/device': {
      component: dynamicWrapper(app, ['record/record'], () => import('../routes/Record/Devices')),
    },
    '/record/user': {
      component: dynamicWrapper(app, ['record/record'], () => import('../routes/Record/Users')),
    },
    '/record/view': {
      component: dynamicWrapper(app, ['record/record'], () => import('../routes/Record/RecordTabPanel')),
    },
    '/record/view/show': {
      component: dynamicWrapper(app, ['record/record'], () => import('../routes/Record/Shows')),
    },
    '/record/view/resource-group': {
      component: dynamicWrapper(app, ['record/record'], () => import('../routes/Record/ResourceGroups')),
    },
    '/record/view/resource-item': {
      component: dynamicWrapper(app, ['record/record'], () => import('../routes/Record/ResourceItems')),
    },
  };
  // Get name from ./menu.js or just set it in the router data.
  const menuData = getFlatMenuData(getMenuData());

  // Route configuration data
  // eg. {name,authority ...routerConfig }
  const routerData = {};
  // The route matches the menu
  Object.keys(routerConfig).forEach((path) => {
    // Regular match item name
    // eg.  router /user/:id === /user/chen
    const pathRegexp = pathToRegexp(path);
    const menuKey = Object.keys(menuData).find(key => pathRegexp.test(`/${key}`));
    let menuItem = {};
    // If menuKey is not empty
    if (menuKey) {
      menuItem = menuData[menuKey];
    }
    let router = routerConfig[path];
    // If you need to configure complex parameter routing,
    // https://github.com/ant-design/ant-design-pro-site/blob/master/docs/router-and-nav.md#%E5%B8%A6%E5%8F%82%E6%95%B0%E7%9A%84%E8%B7%AF%E7%94%B1%E8%8F%9C%E5%8D%95
    // eg . /list/:type/user/info/:id
    router = {
      ...router,
      name: router.name || menuItem.name,
      authority: router.authority || menuItem.authority,
    };
    routerData[path] = router;
  });
  return routerData;
};

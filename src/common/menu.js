import { isUrl } from '../utils/utils';

const menuData = [{
  name: '展览管理',
  icon: 'desktop',
  path: 'show',
  authority: ['user', 'admin'],
}, {
  name: '素材库',
  icon: 'folder',
  path: 'material',
  authority: ['user', 'admin'],
  children: [{
    name: '图片',
    path: 'picture',
  }, {
    name: '声音',
    path: 'audio',
  }, {
    name: '视频',
    path: 'video',
  }],
}, {
  name: 'Beacon 管理',
  icon: 'environment',
  path: 'beacon',
  authority: 'admin',
  children: [{
    name: '基础 Beacon 管理',
    path: 'beacon',
  }, {
    name: '展览 Beacon 管理',
    path: 'show-beacons',
  }, {
    name: '展览地图',
    path: 'show-maps',
  }],
}, {
  name: '用户管理',
  icon: 'user',
  path: 'users',
  children: [{
    name: '普通用户',
    path: 'appusers',
    authority: ['user', 'admin'],
  }, {
    name: '管理员',
    path: 'admins',
    authority: 'admin',
  }],
}, {
  name: '统计分析',
  icon: 'area-chart',
  path: 'record',
  authority: ['user', 'admin'],
  children: [{
    name: '设备使用情况',
    path: 'device',
  }, {
    name: '用户统计',
    path: 'user',
  }, {
    name: '浏览量统计',
    path: 'view/show',
  }],
// }, {
//   name: 'dashboard',
//   icon: 'dashboard',
//   path: 'dashboard',
//   children: [{
//     name: '分析页',
//     path: 'analysis',
//   }, {
//     name: '监控页',
//     path: 'monitor',
//   }, {
//     name: '工作台',
//     path: 'workplace',
//     // hideInMenu: true,
//   }],
// }, {
//   name: '表单页',
//   icon: 'form',
//   path: 'form',
//   children: [{
//     name: '基础表单',
//     path: 'basic-form',
//   }, {
//     name: '分步表单',
//     path: 'step-form',
//   }, {
//     name: '高级表单',
//     authority: 'admin',
//     path: 'advanced-form',
//   }],
// }, {
//   name: '列表页',
//   icon: 'table',
//   path: 'list',
//   children: [{
//     name: '查询表格',
//     path: 'table-list',
//   }, {
//     name: '标准列表',
//     path: 'basic-list',
//   }, {
//     name: '卡片列表',
//     path: 'card-list',
//   }, {
//     name: '搜索列表',
//     path: 'search',
//     children: [{
//       name: '搜索列表（文章）',
//       path: 'articles',
//     }, {
//       name: '搜索列表（项目）',
//       path: 'projects',
//     }, {
//       name: '搜索列表（应用）',
//       path: 'applications',
//     }],
//   }],
// }, {
//   name: '详情页',
//   icon: 'profile',
//   path: 'profile',
//   children: [{
//     name: '基础详情页',
//     path: 'basic',
//   }, {
//     name: '高级详情页',
//     path: 'advanced',
//     authority: 'admin',
//   }],
// }, {
//   name: '结果页',
//   icon: 'check-circle-o',
//   path: 'result',
//   children: [{
//     name: '成功',
//     path: 'success',
//   }, {
//     name: '失败',
//     path: 'fail',
//   }],
// }, {
//   name: '异常页',
//   icon: 'warning',
//   path: 'exception',
//   children: [{
//     name: '403',
//     path: '403',
//   }, {
//     name: '404',
//     path: '404',
//   }, {
//     name: '500',
//     path: '500',
//   }, {
//     name: '触发异常',
//     path: 'trigger',
//     hideInMenu: true,
//   }],
// }, {
//   name: '账户',
//   icon: 'user',
//   path: 'user',
//   authority: 'guest',
//   children: [{
//     name: '登录',
//     path: 'login',
//   }, {
//     name: '注册',
//     path: 'register',
//   }, {
//     name: '注册结果',
//     path: 'register-result',
//   }],
}];

function formatter(data, parentPath = '/', parentAuthority) {
  return data.map((item) => {
    let { path } = item;
    if (!isUrl(path)) {
      path = parentPath + item.path;
    }
    const result = {
      ...item,
      path,
      authority: item.authority || parentAuthority,
    };
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority);
    }
    return result;
  });
}

export const getMenuData = () => formatter(menuData);

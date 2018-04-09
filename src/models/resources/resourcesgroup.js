/**
 * Created by neo on 16/3/2018.
 */
import { message } from 'antd';
import {
  getResourceGroup,
  listResourceGroup,
  listResourceGroupByAR,
  listResourceGroupByBeacon,
  listResourceGroupByQRCode,
  addResourseGroup,
  changeName,
  deleteResourceGroup,
  bindAR,
  removeAR,
  bindBeacons,
  removeBeacon,
} from '../../services/api_resourcesgroup';

export default {
  namespace: 'resourcesgroup',

  state: {
    // type: 'normal', // 'ar', 'beacon', 'qrcode', 'normal'
    page: {},
    list: [],
    pagination: {
      total: 0,
      current: 1,
      pageSize: 10,
      showSizeChanger: true,
    },
  },

  effects: {
    *getGroup({ payload }, { call, put }) {
      const { showId, groupId } = payload;
      const response = yield call(getResourceGroup, { showId, groupId });
      yield put({
        type: 'refreshUI',
        payload: response.data,
      });
    },
    *listGroup({ payload }, { call, put }) {
      const { showId, page, size } = payload;
      const response = yield call(listResourceGroup, { showId, page, size });
      yield put({
        type: 'refreshUI',
        payload: response.data,
      });
    },
    *listGroupByAR({ payload }, { call, put }) {
      const { showId, page, size } = payload;
      const response = yield call(listResourceGroupByAR, { showId, page, size });
      yield put({
        type: 'refreshUI',
        payload: response.data,
      });
    },
    *listGroupByBeacon({ payload }, { call, put }) {
      const { showId, page, size } = payload;
      const response = yield call(listResourceGroupByBeacon, { showId, page, size });
      yield put({
        type: 'refreshUI',
        payload: response.data,
      });
    },
    *listGroupByQRCode({ payload }, { call, put }) {
      const { showId, page, size } = payload;
      const response = yield call(listResourceGroupByQRCode, { showId, page, size });
      yield put({
        type: 'refreshUI',
        payload: response.data,
      });
    },
    *addGroup({ payload }, { call, put }) {
      const { showId, name } = payload;
      const response = yield call(addResourseGroup, { showId, name });
      if (response.status === 201) {
        message.info('添加成功！');
        const response2 = yield call(listResourceGroup, { page: 0, size: 10 });
        yield put({
          type: 'refreshUI',
          payload: response2.data,
        });
      }
    },
    *changeName({ payload }, { call, put, select }) {
      const { showId, groupId, name } = payload;
      const response = yield call(changeName, { showId, groupId, name });
      if (response.status === 200) {
        message.info('修改成功！');
        const page = yield select(state => state.resourcesgroup.page.number);
        const size = yield select(state => state.resourcesgroup.page.size);
        const response2 = yield call(listResourceGroup, { showId, page, size });
        yield put({
          type: 'refreshUI',
          payload: response2.data,
        });
      }
    },
    *deleteGroup({ payload }, { call, put, select }) {
      const { showId, groupId } = payload;
      const response = yield call(deleteResourceGroup, { showId, groupId });
      if (response.status === 200) {
        message.info('删除成功！');
        const page = yield select(state => state.resourcesgroup.page.number);
        const size = yield select(state => state.resourcesgroup.page.size);
        const response2 = yield call(listResourceGroup, { showId, page, size });
        yield put({
          type: 'refreshUI',
          payload: response2.data,
        });
      }
    },
    *bindAR({ payload }, { call, put, select }) {
      const { showId, groupId, imageId } = payload;
      const response = yield call(bindAR, { showId, groupId, imageId });
      if (response.status === 200) {
        message.info('绑定成功！');
        const page = yield select(state => state.resourcesgroup.page.number);
        const size = yield select(state => state.resourcesgroup.page.size);
        const response2 = yield call(listResourceGroup, { showId, page, size });
        yield put({
          type: 'refreshUI',
          payload: response2.data,
        });
      }
    },
    *removeAR({ payload }, { call, put, select }) {
      const { showId, groupId, type } = payload;
      const response = yield call(removeAR, { showId, groupId });
      if (response.status === 200) {
        message.info('取消绑定成功！');
        if (type === 'normalList') {
          const page = yield select(state => state.resourcesgroup.page.number);
          const size = yield select(state => state.resourcesgroup.page.size);
          const response2 = yield call(listResourceGroup, { showId, page, size });
          yield put({
            type: 'refreshUI',
            payload: response2.data,
          });
        } else if (type === 'arList') {
          const page = yield select(state => state.resourcesgroup.page.number);
          const size = yield select(state => state.resourcesgroup.page.size);
          const response2 = yield call(listResourceGroupByAR, { showId, page, size });
          yield put({
            type: 'refreshUI',
            payload: response2.data,
          });
        }
      }
    },
    *bindBeacons({ payload }, { call, put, select }) {
      const { showId, groupId, uuids } = payload;
      const response = yield call(bindBeacons, { showId, groupId, uuids });
      if (response.status === 200) {
        message.info('绑定信息修改成功！');
        const page = yield select(state => state.resourcesgroup.page.number);
        const size = yield select(state => state.resourcesgroup.page.size);
        const response2 = yield call(listResourceGroup, { showId, page, size });
        yield put({
          type: 'refreshUI',
          payload: response2.data,
        });
      }
    },
    *removeBeacon({ payload }, { call, put, select }) {
      const { showId, groupId, uuid } = payload;
      const response = yield call(removeBeacon, { showId, groupId, uuid });
      if (response.status === 200) {
        message.info('取消绑定成功！');
        const page = yield select(state => state.resourcesgroup.page.number);
        const size = yield select(state => state.resourcesgroup.page.size);
        const response2 = yield call(listResourceGroup, { showId, page, size });
        yield put({
          type: 'refreshUI',
          payload: response2.data,
        });
      }
    },
  },

  reducers: {
    refreshUI(state, action) {
      return {
        ...state,
        page: action.payload,
        list: action.payload.content,
        pagination: {
          total: action.payload.totalElements,
          current: action.payload.number + 1,
          pageSize: action.payload.size,
          showSizeChanger: true,
        },
      };
    },
  },
};

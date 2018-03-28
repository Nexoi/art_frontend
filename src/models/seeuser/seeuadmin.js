/**
 * Created by neo on 19/3/2018.
 */
import { message } from 'antd';
import {
  listAdmins,
  addAdmin,
  deleteAdmin,
  listShowAuths,
  updateShowAuths,
  deleteAllShowAuths,
} from '../../services/api_user';

export default {
  namespace: 'seeuadmin',

  state: {
    word: '',
    page: {},
    list: [],
    pagination: {
      total: 0,
      current: 1,
      pageSize: 10,
      showSizeChanger: true,
    },
    shows: [], // 当前管理员所能操控的展览列表
  },

  effects: {
    *listAllAdmins({ payload }, { call, put }) {
      const { word, page, size } = payload;
      const response = yield call(listAdmins, { word, page, size });
      yield put({
        type: 'refreshUI',
        payload: {
          word,
          data: response.data,
        },
      });
    },
    *addAdmin({ payload }, { call, put, select }) {
      const { username, password, phone, gender } = payload;
      const response = yield call(addAdmin, { username, password, phone, gender });
      if (response.status === 201) {
        message.info('添加成功！');
        const page = yield select(state => state.seeuadmin.page.number);
        const size = yield select(state => state.seeuadmin.page.size);
        const response2 = yield call(listAdmins, { page, size });
        yield put({
          type: 'refreshUI',
          payload: {
            word: '',
            data: response2.data,
          },
        });
      }
    },
    *deleteAdmin({ payload }, { call, put, select }) {
      const { uid } = payload;
      const response = yield call(deleteAdmin, uid);
      if (response.status === 200) {
        message.info('删除成功');
        const page = yield select(state => state.seeuadmin.page.number);
        const size = yield select(state => state.seeuadmin.page.size);
        const word = yield select(state => state.seeuadmin.word);
        const response2 = yield call(listAdmins, { page, size, word });
        yield put({
          type: 'refreshUI',
          payload: {
            word,
            data: response2.data,
          },
        });
      }
    },
    *listOneShowAuths({ payload }, { call, put }) {
      console.log(payload);
      const { uid } = payload;
      const response = yield call(listShowAuths, uid);
      if (response.status === 200) {
        yield put({
          type: 'refreshShows',
          payload: response.data,
        });
      }
    },
    *updateShowAuths({ payload }, { call, put }) {
      const { uid, showIds } = payload;
      const response = yield call(updateShowAuths, { uid, showIds });
      if (response.status === 200) {
        message.info('权限更新成功！');
        const response2 = yield call(listShowAuths, uid);
        if (response2.status === 200) {
          yield put({
            type: 'refreshShows',
            payload: response2.data,
          });
        }
      }
    },
    *cleanShowAuths({ payload }, { call, put }) {
      const { uid } = payload;
      const response = yield call(deleteAllShowAuths, uid);
      if (response.status === 200) {
        message.info('权限更新成功！');
        const response2 = yield call(listShowAuths, uid);
        if (response2.status === 200) {
          yield put({
            type: 'refreshShows',
            payload: response2.data,
          });
        }
      }
    },
  },

  reducers: {
    refreshUI(state, action) {
      return {
        ...state,
        word: action.payload.word,
        page: action.payload.data,
        list: action.payload.data.content,
        pagination: {
          total: action.payload.data.totalElements,
          current: action.payload.data.number + 1,
          pageSize: action.payload.data.size,
          showSizeChanger: true,
        },
      };
    },
    refreshShows(state, action) {
      return {
        ...state,
        shows: action.payload,
      };
    },
  },
};

/**
 * Created by neo on 25/2/2018.
 */
import { message } from 'antd';
import {
  listFolders,
  addFolder,
  changeFolderName,
  deleteFolder,
} from '../../services/api_material';

export default {
  namespace: 'folder',

  state: {
    list: [],
  },

  effects: {
    *list({ payload }, { call, put }) {
      console.log(payload);
      const { type } = payload;
      const response = yield call(listFolders, type);
      yield put({
        type: 'refreshUI',
        payload: response.data,
      });
    },
    *changeName({ payload }, { call, put }) {
      const { type, folderId, folderName } = payload;
      const response = yield call(changeFolderName, { type, folderId, folderName });
      if (response.status === 200) {
        message.info('修改成功！');
      }
    },
    *deleteFolder({ payload }, { call, put }) {
      const { type, folderId } = payload;
      const response = yield call(deleteFolder, { type, folderId });
      if (response.status === 200) {
        const response2 = yield call(listFolders, type);
        yield put({
          type: 'refreshUI',
          payload: response2.data,
        });
        message.info('删除成功！');
      }
    },
    // ??
    *addFolder({ payload }, { call, put }) {
      const { type, folderName } = payload;
      const response = yield call(addFolder, { type, folderName });
      if (response.status === 201) {
        message.info('添加成功！请及时刷新该页面更新数据');
        const response2 = yield call(listFolders, type);
        yield put({
          type: 'refreshUI',
          payload: response2.data,
        });
      }
      // if (response.status === 400) {
      //   message.error(response.message);
      // }
    },
  },

  reducers: {
    refreshUI(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
  },
};

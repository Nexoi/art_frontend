/**
 * Created by neo on 25/2/2018.
 */
import { message } from 'antd';
import {
  listFolders,
  listAudios,
  addAudio,
  getAudio,
  changeAudioName,
  deleteAudio,
  deleteAllAudios,
} from '../../services/api_material';

export default {
  namespace: 'audio',

  state: {
    currentFolder: {},
    page: {},
    list: [],
    folders: [{
      name: '-',
      id: '0',
    }],
    pagination: {
      total: 0,
      current: 1,
      pageSize: 10,
      showSizeChanger: true,
    },
    modalVisible: false,
  },

  effects: {
    *initFolders(_, { call, put }) {
      const response = yield call(listFolders, 'audio');
      yield put({
        type: 'refreshFolderList',
        payload: response.data,
      });
    },
    *initList(_, { call, put }) {
      const response = yield call(
        listAudios,
        { folderId: 0, page: 0, size: 10 }
      ); // folderId, page, size
      yield put({
        type: 'refreshUI',
        payload: response.data,
      });
      // console.log(response);
    },
    *listByFolder({ payload }, { call, put }) {
      console.log(payload);
      const { folderId, page, size } = payload;
      const response = yield call(listAudios, { folderId, page, size });
      yield put({
        type: 'refreshUI',
        payload: response.data,
      });
    },
    *changeName({ payload }, { call, put }) {
      const { audioId, name } = payload;
      const response = yield call(changeAudioName, { audioId, name });
      // yield put({
      //   type: 'changeNameResult',
      //   payload: response.data,
      // });
      if (response.status === 200) {
        message.info('修改成功！');
      }
    },
    *deleteAudio({ payload }, { call, put, select }) {
      const { audioId } = payload;
      const response = yield call(deleteAudio, audioId);
      if (response.status === 200) {
        const folderId = yield select(state => state.audio.currentFolder.id);
        const page = yield select(state => state.audio.page.number);
        const size = yield select(state => state.audio.page.size);
        const response2 = yield call(listAudios, { folderId, page, size });
        yield put({
          type: 'refreshUI',
          payload: response2.data,
        });
        message.info('删除成功！');
      }
    },
    // ??
    *addAudio({ payload }, { call, put, select }) {
      console.log(payload);
      const response = yield call(addAudio, payload);
      // yield put({
      //   type: 'refreshUI',
      //   payload: response,
      // });
      if (response.status === 201) {
        message.info('添加成功！');
        const folderId = yield select(state => state.audio.currentFolder.id);
        const page = yield select(state => state.audio.page.number);
        const size = yield select(state => state.audio.page.size);
        const response2 = yield call(listAudios, { folderId, page, size });
        yield put({
          type: 'refreshUI',
          payload: response2.data,
        });
      }
    },
  },

  reducers: {
    refreshUI(state, action) {
      console.log(action);
      const { currentFolder, page } = action.payload;
      return {
        ...state,
        currentFolder,
        page,
        list: page.content,
        pagination: {
          total: page.totalElements,
          current: page.number + 1,
          pageSize: page.size,
          showSizeChanger: true,
        },
      };
    },
    refreshFolderList(state, action) {
      console.log(action);
      return {
        ...state,
        folders: action.payload,
      };
    },
    changeNameResult(state, action) {
      return {
        ...state,
        changeNameResult: action.payload.status === 200,
      };
    },
  },
};

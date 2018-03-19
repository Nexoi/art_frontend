/**
 * Created by neo on 25/2/2018.
 */
import { message } from 'antd';
import {
  listFolders,
  listVideos,
  addVideo,
  getVideo,
  changeVideoName,
  deleteVideo,
  deleteAllVideos,
} from '../../services/api_material';

export default {
  namespace: 'video',

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
      const response = yield call(listFolders, 'video');
      yield put({
        type: 'refreshFolderList',
        payload: response.data,
      });
    },
    *initList(_, { call, put }) {
      const response = yield call(
        listVideos,
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
      const response = yield call(listVideos, { folderId, page, size });
      yield put({
        type: 'refreshUI',
        payload: response.data,
      });
    },
    *changeName({ payload }, { call, put }) {
      const { videoId, name } = payload;
      const response = yield call(changeVideoName, { videoId, name });
      // yield put({
      //   type: 'changeNameResult',
      //   payload: response.data,
      // });
      if (response.status === 200) {
        message.info('修改成功！');
      }
    },
    *deleteVideo({ payload }, { call, put, select }) {
      const { videoId } = payload;
      const response = yield call(deleteVideo, videoId);
      if (response.status === 200) {
        const folderId = yield select(state => state.video.currentFolder.id);
        const page = yield select(state => state.video.page.number);
        const size = yield select(state => state.video.page.size);
        const response2 = yield call(listVideos, { folderId, page, size });
        yield put({
          type: 'refreshUI',
          payload: response2.data,
        });
        message.info('删除成功！');
      }
      if (response.status === 423) {
        message.info('删除失败！该资源在其余地方被使用，请先解除关联');
      }
    },
    // ??
    *addVideo({ payload }, { call, put, select }) {
      console.log(payload);
      const response = yield call(addVideo, payload);
      // yield put({
      //   type: 'refreshUI',
      //   payload: response,
      // });
      if (response.status === 201) {
        message.info('添加成功！');
        const folderId = yield select(state => state.video.currentFolder.id);
        const page = yield select(state => state.video.page.number);
        const size = yield select(state => state.video.page.size);
        const response2 = yield call(listVideos, { folderId, page, size });
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

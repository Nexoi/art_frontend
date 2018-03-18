/**
 * Created by neo on 25/2/2018.
 */
import { message } from 'antd';
import {
  listFolders,
  listImages,
  addImage,
  getImage,
  changeImageName,
  deleteImage,
  deleteAllImages,
} from '../../services/api_material';

export default {
  namespace: 'picture',

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
      pageSize: 8,
      showSizeChanger: true,
    },
    modalVisible: false,
    selectedPictureIdsShouldClean: true,
  },

  effects: {
    *initFolders(_, { call, put }) {
      const response = yield call(listFolders, 'picture');
      yield put({
        type: 'refreshFolderList',
        payload: response.data,
      });
    },
    *initList(_, { call, put }) {
      const response = yield call(
        listImages,
        { folderId: 0, page: 0, size: 8 }
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
      const response = yield call(listImages, { folderId, page, size });
      yield put({
        type: 'refreshUI',
        payload: response.data,
      });
    },
    *changeName({ payload }, { call, put }) {
      const { imageId, name } = payload;
      const response = yield call(changeImageName, { imageId, name });
      // yield put({
      //   type: 'changeNameResult',
      //   payload: response.data,
      // });
      if (response.status === 200) {
        message.info('修改成功！');
      }
    },
    *deleteImages({ payload }, { call, put, select }) {
      const { imageIds } = payload;
      const response = yield call(deleteAllImages, imageIds);
      if (response.status === 200) {
        const folderId = yield select(state => state.picture.currentFolder.id);
        const page = yield select(state => state.picture.page.number);
        const size = yield select(state => state.picture.page.size);
        const response2 = yield call(listImages, { folderId, page, size });
        yield put({
          type: 'refreshUI',
          payload: response2.data,
        });
        message.info('删除成功！');
      }
      if (response.status === 423) {
        message.info('删除失败！存在图片在其余地方被使用，请先解除关联');
      }
    },
    // ??
    *addImage({ payload }, { call, put, select }) {
      console.log(payload);
      const response = yield call(addImage, payload);
      // yield put({
      //   type: 'refreshUI',
      //   payload: response,
      // });
      if (response.status === 201) {
        message.info('添加成功！');
        const folderId = yield select(state => state.picture.currentFolder.id);
        const page = yield select(state => state.picture.page.number);
        const size = yield select(state => state.picture.page.size);
        const response2 = yield call(listImages, { folderId, page, size });
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
        selectedPictureIdsShouldClean: true,
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

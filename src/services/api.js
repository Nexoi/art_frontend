import {stringify} from 'qs';
import request from '../utils/request';

export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function queryActivities() {
  return request('/api/activities');
}

export async function queryRule(params) {
  return request(`/api/rule?${stringify(params)}`);
}

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    body: params,
  });
}

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function queryTags() {
  return request('/api/tags');
}

export async function queryBasicProfile() {
  return request('/api/profile/basic');
}

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/api/fake_list?${stringify(params)}`);
}

export async function fakeAccountLogin(params) {
  return request('/api/login/account', {
    method: 'POST',
    body: params,
  });
}

export async function fakeRegister(params) {
  return request('/api/register', {
    method: 'POST',
    body: params,
  });
}

export async function queryNotices() {
  return request('/api/notices');
}

/* art_admin  */

export async function queryAudios() {
  return request('/api/admin/v1/material/audio/list');
}
export async function queryAudiosByFolderName(folder) {
  return request(`/api/material/audios/${folder}`);
}
export async function uploadAudio(payload) {
  return request('/api/material/upload/audio', {
    method: 'POST',
    body: payload,
  });
}

export async function queryPictures() {
  return request('/api/material/pictures');
}

export async function queryPicturesByFolderName(folder) {
  return request(`/api/material/pictures/${folder}`);
}
export async function uploadPicture(payload) {
  return request('/api/material/upload/picture', {
    method: 'POST',
    body: payload,
  });
}

export async function queryVideos() {
  return request('/api/material/videos');
}

export async function queryVideosByFolderName(folder) {
  return request(`/api/material/videos/${folder}`);
}
export async function uploadVideo(payload) {
  return request('/api/material/upload/video', {
    method: 'POST',
    body: payload,
  });
}

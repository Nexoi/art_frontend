/**
 * Created by neo on 15/3/2018.
 */
import request from '../utils/request';

export async function listResourceItems(payload) {
  const { showId, groupId } = payload;
  const showId2 = showId === undefined || showId < 1 ? 0 : showId;
  return request(`/api/admin/v1/show/${showId2}/resources-group/${groupId}/item`, {
    method: 'GET',
  });
}
export async function addResourceAudio(payload) {
  const { showId, groupId, audioId } = payload;
  const showId2 = showId === undefined || showId < 1 ? 0 : showId;
  return request(`/api/admin/v1/show/${showId2}/resources-group/${groupId}/item/audio?audioId=${audioId}`, {
    method: 'POST',
  });
}
export async function addResourceVideo(payload) {
  const { showId, groupId, videoId } = payload;
  const showId2 = showId === undefined || showId < 1 ? 0 : showId;
  return request(`/api/admin/v1/show/${showId2}/resources-group/${groupId}/item/video?videoId=${videoId}`, {
    method: 'POST',
  });
}
export async function addResourceImage(payload) {
  const { showId, groupId, imageId } = payload;
  const showId2 = showId === undefined || showId < 1 ? 0 : showId;
  return request(`/api/admin/v1/show/${showId2}/resources-group/${groupId}/item/image?imageId=${imageId}`, {
    method: 'POST',
  });
}
export async function addResourceWebPage(payload) {
  const { showId, groupId, title, author, link, coverImageUrl, introduce, contentHtml } = payload;
  const showId2 = showId === undefined || showId < 1 ? 0 : showId;
  return request(`/api/admin/v1/show/${showId2}/resources-group/${groupId}/item/web`, {
    method: 'POST',
    body: {
      title,
      author,
      link,
      coverImageUrl,
      introduce,
      contentHtml,
    },
  });
}

export async function changeName(payload) {
  const { showId, groupId, itemId, name } = payload;
  const showId2 = showId === undefined || showId < 1 ? 0 : showId;
  const groupId2 = groupId === undefined || groupId < 1 ? 0 : groupId;
  return request(`/api/admin/v1/show/${showId2}/resources-group/${groupId2}/item/${itemId}?name=${name}`, {
    method: 'PUT',
  });
}

export async function deleteResourceItem(payload) {
  const { showId, groupId, itemId } = payload;
  const showId2 = showId === undefined || showId < 1 ? 0 : showId;
  const groupId2 = groupId === undefined || groupId < 1 ? 0 : groupId;
  return request(`/api/admin/v1/show/${showId2}/resources-group/${groupId2}/item/${itemId}`, {
    method: 'DELETE',
  });
}

export async function getWebPage(itemId) {
  return request(`/api/admin/v1/webpage/${itemId}`, {
    method: 'GET',
  });
}

export async function updateWebPage(payload) {
  const { itemId, author, link, contentHtml, coverImageUrl, introduce, title } = payload;
  return request(`/api/admin/v1/webpage/${itemId}`, {
    method: 'PUT',
    body: {
      author,
      link,
      contentHtml,
      coverImageUrl,
      introduce,
      title,
    },
  });
}

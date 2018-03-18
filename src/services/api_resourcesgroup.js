/**
 * Created by neo on 15/3/2018.
 */
import request from '../utils/request';

export async function addResourseGroup(payload) {
  const { showId, name } = payload;
  return request(`/api/admin/v1/show/${showId}/resources-group?&name=${name}`, {
    method: 'POST',
  });
}

export async function listResourceGroup(payload) {
  const { showId, page, size } = payload;
  return request(`/api/admin/v1/show/${showId}/resources-group/list?page=${page}&size=${size}`, {
    method: 'GET',
  });
}
export async function listResourceGroupByAR(payload) {
  const { showId, page, size } = payload;
  return request(`/api/admin/v1/show/${showId}/resources-group/list/by-ar?page=${page}&size=${size}`, {
    method: 'GET',
  });
}
export async function listResourceGroupByBeacon(payload) {
  const { showId, page, size } = payload;
  return request(`/api/admin/v1/show/${showId}/resources-group/list/by-beacon?page=${page}&size=${size}`, {
    method: 'GET',
  });
}
export async function listResourceGroupByQRCode(payload) {
  const { showId, page, size } = payload;
  return request(`/api/admin/v1/show/${showId}/resources-group/list/by-qrcode?page=${page}&size=${size}`, {
    method: 'GET',
  });
}

export async function getResourceGroup(payload) {
  const { showId, groupId } = payload;
  const showId2 = showId === undefined || showId < 1 ? 0 : showId;
  return request(`/api/admin/v1/show/${showId2}/resources-group/${groupId}`, {
    method: 'GET',
  });
}

export async function changeName(payload) {
  const { showId, groupId, name } = payload;
  const showId2 = showId === undefined || showId < 1 ? 0 : showId;
  return request(`/api/admin/v1/show/${showId2}/resources-group/${groupId}?name=${name}`, {
    method: 'PUT',
  });
}

export async function deleteResourceGroup(payload) {
  const { showId, groupId } = payload;
  const showId2 = showId === undefined || showId < 1 ? 0 : showId;
  return request(`/api/admin/v1/show/${showId2}/resources-group/${groupId}`, {
    method: 'DELETE',
  });
}

// operations

export async function bindAR(payload) {
  const { showId, groupId, imageId } = payload;
  const showId2 = showId === undefined || showId < 1 ? 0 : showId;
  return request(`/api/admin/v1/show/${showId2}/resources-group/${groupId}/bind-ar?imageId=${imageId}`, {
    method: 'PUT',
  });
}

export async function removeAR(payload) {
  const { showId, groupId } = payload;
  const showId2 = showId === undefined || showId < 1 ? 0 : showId;
  return request(`/api/admin/v1/show/${showId2}/resources-group/${groupId}/remove-ar`, {
    method: 'DELETE',
  });
}

export async function bindBeacons(payload) {
  const { showId, groupId, uuids } = payload;
  // uuids = '1232423,3124323,132432,23144432' split by ','
  const showId2 = showId === undefined || showId < 1 ? 0 : showId;
  return request(`/api/admin/v1/show/${showId2}/resources-group/${groupId}/bind-beacons?uuids=${uuids}`, {
    method: 'PUT',
  });
}

export async function removeBeacon(payload) {
  const { showId, groupId, uuid } = payload;
  const showId2 = showId === undefined || showId < 1 ? 0 : showId;
  return request(`/api/admin/v1/show/${showId2}/resources-group/${groupId}/remove-beacons?uuid=${uuid}`, {
    method: 'DELETE',
  });
}

/**
 * Created by neo on 12/3/2018.
 */
import request from '../utils/request';

export async function listDevices(payload) {
  const { startDay, endDay } = payload;
  return request(`/api/admin/v1/record/devices?start=${startDay}&end=${endDay}`, {
    method: 'GET',
  });
}

export async function listResourceGroups(payload) {
  const { groupIds, startDay, endDay } = payload;
  return request(`/api/admin/v1/record/resource-groups?groupIds=${groupIds}&start=${startDay}&end=${endDay}`, {
    method: 'GET',
  });
}

export async function listResourceItems(payload) {
  const { itemIds, startDay, endDay } = payload;
  return request(`/api/admin/v1/record/resource-items?itemIds=${itemIds}&start=${startDay}&end=${endDay}`, {
    method: 'GET',
  });
}

export async function listShows(payload) {
  const { showIds, startDay, endDay } = payload;
  return request(`/api/admin/v1/record/shows?showIds=${showIds}&start=${startDay}&end=${endDay}`, {
    method: 'GET',
  });
}

export async function listUsers(payload) {
  const { startDay, endDay } = payload;
  return request(`/api/admin/v1/record/users?start=${startDay}&end=${endDay}`, {
    method: 'GET',
  });
}

export async function listAr(payload) {
  const { startDay, endDay } = payload;
  return request(`/api/admin/v1/record/ar?start=${startDay}&end=${endDay}`, {
    method: 'GET',
  });
}

export async function listBeacon(payload) {
  const { startDay, endDay } = payload;
  return request(`/api/admin/v1/record/beacon?start=${startDay}&end=${endDay}`, {
    method: 'GET',
  });
}

export async function listQRCode(payload) {
  const { startDay, endDay } = payload;
  return request(`/api/admin/v1/record/qrcode?start=${startDay}&end=${endDay}`, {
    method: 'GET',
  });
}

export async function listResourceGroup(payload) {
  const { groupId, startDay, endDay } = payload;
  return request(`/api/admin/v1/record/resource-group/${groupId}?start=${startDay}&end=${endDay}`, {
    method: 'GET',
  });
}

export async function listResourceItem(payload) {
  const { itemId, startDay, endDay } = payload;
  return request(`/api/admin/v1/record/resource-item/${itemId}?start=${startDay}&end=${endDay}`, {
    method: 'GET',
  });
}

export async function listShow(payload) {
  const { showId, startDay, endDay } = payload;
  return request(`/api/admin/v1/record/show/${showId}?start=${startDay}&end=${endDay}`, {
    method: 'GET',
  });
}

export async function listUser(payload) {
  const { type, startDay, endDay } = payload;
  return request(`/api/admin/v1/record/users/${type}?start=${startDay}&end=${endDay}`, {
    method: 'GET',
  });
}

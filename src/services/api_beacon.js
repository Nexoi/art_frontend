/**
 * Created by neo on 12/3/2018.
 */
import request from '../utils/request';

export async function listBeacons(payload) {
  const { page, size } = payload;
  return request(`/api/admin/v1/beacons?page=${page}&size=${size}`, {
    method: 'GET',
  });
}

export async function addBeacon(payload) {
  const {
    name,
    uuid,
    majorValue,
    minorValue,
    availableRange,
    status,
    mapId,
    width,
    height,
  } = payload;
  return request(`/api/admin/v1/beacons?name=${name}&uuid=${uuid}&majorValue=${majorValue}&minorValue=${minorValue}&availableRange=${availableRange}&status=${status}&width=${width}&height=${height}&mapId=${mapId}`, {
    method: 'POST',
  });
}

export async function getBeacon(uuid) {
  return request(`/api/admin/v1/beacons/${uuid}`, {
    method: 'GET',
  });
}

export async function updateBeacon(payload) {
  const {
    name,
    uuid,
    majorValue,
    minorValue,
    availableRange,
    status,
    mapId,
    width,
    height,
  } = payload;
  return request(`/api/admin/v1/beacons/${uuid}?name=${name}&majorValue=${majorValue}&minorValue=${minorValue}&availableRange=${availableRange}&status=${status}&width=${width}&height=${height}&mapId=${mapId}`, {
    method: 'PUT',
  });
}

export async function changeBeaconStatus(uuid) {
  return request(`/api/admin/v1/beacons/${uuid}/change-status`, {
    method: 'PUT',
  });
}

export async function deleteBeacon(uuid) {
  return request(`/api/admin/v1/beacons/${uuid}`, {
    method: 'DELETE',
  });
}

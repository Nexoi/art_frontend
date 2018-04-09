/**
 * Created by neo on 12/3/2018..
 */
import request from '../utils/request';

export async function listBeacons(payload) {
  const { showId, page, size } = payload;
  return request(`/api/admin/v1/show/${showId}/beacons?page=${page}&size=${size}`, {
    method: 'GET',
  });
}

export async function getBeacon(payload) {
  const {
    showId,
    uuid,
  } = payload;
  return request(`/api/admin/v1/show/${showId}/beacons/${uuid}`, {
    method: 'GET',
  });
}

export async function updateBeacon(payload) {
  const {
    showId,
    name,
    uuid,
    availableRange,
    status,
    mapId,
    width,
    height,
  } = payload;

  if (availableRange === undefined && status === undefined) {
    return request(`/api/admin/v1/show/${showId}/beacons/${uuid}?name=${name}&width=${width}&height=${height}&mapId=${mapId}`, {
      method: 'PUT',
    });
  } else if (availableRange === undefined) {
    return request(`/api/admin/v1/show/${showId}/beacons/${uuid}?name=${name}&status=${status}&width=${width}&height=${height}&mapId=${mapId}`, {
      method: 'PUT',
    });
  } else if (status === undefined) {
    return request(`/api/admin/v1/show/${showId}/beacons/${uuid}?name=${name}&availableRange=${availableRange}&width=${width}&height=${height}&mapId=${mapId}`, {
      method: 'PUT',
    });
  } else {
    return request(`/api/admin/v1/show/${showId}/beacons/${uuid}?name=${name}&availableRange=${availableRange}&status=${status}&width=${width}&height=${height}&mapId=${mapId}`, {
      method: 'PUT',
    });
  }
}

export async function changeBeaconStatus(payload) {
  const {
    showId,
    uuid,
  } = payload;
  return request(`/api/admin/v1/show/${showId}/beacons/${uuid}/change-status`, {
    method: 'PUT',
  });
}

export async function removeBeacon(payload) {
  const {
    showId,
    uuid,
  } = payload;
  return request(`/api/admin/v1/show/${showId}/beacons/${uuid}/remove-beacon`, {
    method: 'DELETE',
  });
}

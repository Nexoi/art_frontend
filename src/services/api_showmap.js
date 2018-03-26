/**
 * Created by neo on 12/3/2018.
 */
import request from '../utils/request';

export async function listShowMaps(payload) {
  const { showId, page, size } = payload;
  return request(`/api/admin/v1/show/${showId}/maps?page=${page}&size=${size}`, {
    method: 'GET',
  });
}

export async function addShowMap(payload) {
  const { showId, floor, name, showHallName, width, height, imageId } = payload;
  return request(`/api/admin/v1/show/${showId}/maps?floor=${floor}&name=${name}&showHallName=${showHallName}&width=${width}&height=${height}&imageId=${imageId}`, {
    method: 'POST',
  });
}

export async function getShowMap(mapId) {
  return request(`/api/admin/v1/show/0/maps/${mapId}`, {
    method: 'GET',
  });
}

export async function updateShowMap(payload) {
  const { showId, mapId, floor, name, showHallName, width, height, imageId } = payload;
  return request(`/api/admin/v1/show/${showId}/maps/${mapId}?floor=${floor}&name=${name}&showHallName=${showHallName}&width=${width}&height=${height}&imageId=${imageId}`, {
    method: 'PUT',
  });
}

export async function deleteShowMap(mapId) {
  return request(`/api/admin/v1/show/0/maps/${mapId}`, {
    method: 'DELETE',
  });
}

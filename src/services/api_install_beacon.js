/**
 * Created by neo on 12/3/2018.
 */
import request from '../utils/request';

export async function listBeacons(payload) {
  const { page, size } = payload;
  return request(`/api/admin/v1/install-beacons?page=${page}&size=${size}`, {
    method: 'GET',
  });
}

export async function addBeacon(payload) {
  const {
    uuid,
    majorValue,
    minorValue,
  } = payload;
  return request(`/api/admin/v1/install-beacons?&uuid=${uuid}&majorValue=${majorValue}&minorValue=${minorValue}`, {
    method: 'POST',
  });
}

export async function getBeacon(id) {
  return request(`/api/admin/v1/install-beacons/${id}`, {
    method: 'GET',
  });
}

export async function updateBeacon(payload) {
  const {
    id,
    uuid,
    majorValue,
    minorValue,
  } = payload;
  return request(`/api/admin/v1/install-beacons/${id}?&uuid=${uuid}&majorValue=${majorValue}&minorValue=${minorValue}`, {
    method: 'PUT',
  });
}

export async function deleteBeacon(id) {
  return request(`/api/admin/v1/install-beacons/${id}`, {
    method: 'DELETE',
  });
}

export async function listWithShow(payload) {
  const {
    showId,
    page,
    size,
  } = payload;
  return request(`/api/admin/v1/install-beacons/list/${showId}?page=${page}&size=${size}`, {
    method: 'GET',
  });
}

export async function listWithShowReverse(payload) {
  const {
    showId,
    page,
    size,
  } = payload;
  return request(`/api/admin/v1/install-beacons/list-reverse/${showId}?page=${page}&size=${size}`, {
    method: 'GET',
  });
}

export async function appendInShow(payload) {
  const {
    showId,
    beaconIds,
  } = payload;
  return request(`/api/admin/v1/install-beacons/append/${showId}?beaconIds=${beaconIds}`, {
    method: 'POST',
  });
}

export async function removeFromShow(payload) {
  const {
    showId,
    beaconId,
  } = payload;
  return request(`/api/admin/v1/install-beacons/remove/${showId}?beaconId=${beaconId}`, {
    method: 'DELETE',
  });
}

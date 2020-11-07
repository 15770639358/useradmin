import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

export function getInfo(params) {
  return request({
    url: '/info',
    method: 'get',
    params
  })
}

export function getAllUser() {
  return request({
    url: '/AllUser',
    method: 'get',
  })
}

export function logout() {
  return 0
}

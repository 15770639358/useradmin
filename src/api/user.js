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
//getAllUser
export function getAllUsers() {
  return request({
    url: '/getAllUser',
    method: 'get',
  })
}
//removeUserRole
export function removeUserRole(params) {
  return request({
    url: '/removeUserRole',
    method: 'post',
    data:params
  })
}
//addUserRole
export function addUserRole(params) {
  return request({
    url: '/addUserRoles',
    method: 'post',
    data:params
  })
}
//getUserRole
export function getUserRole(params) {
  return request({
    url: '/getUserRole',
    method: 'post',
    data:params
  })
}
//getCountUser
export function getCountUser(params) {
  return request({
    url: '/getCountUser',
    method: 'post',
    data:params
  })
}
//addUser
export function addUser(params) {
  return request({
    url: '/addUser',
    method: 'post',
    data:params
  })
}
//updatePassword
export function updatePassword(params) {
  return request({
    url: '/updatePassword',
    method: 'post',
    data:params
  })
}
export function logout() {
  return 0
}

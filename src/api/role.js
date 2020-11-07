import request from '@/utils/request'

export function getRoleId(params) {
  return request({
    url: '/getRoleId',
    method: 'get',
    params
  })
}

export function addRole(params) {
  return request({
    url: '/addUserRole',
    method: 'get',
    params
  })
}

export function removeRole(params) {
  return request({
    url: '/removeUserRole',
    method: 'get',
    params
  })
}

export function getAllAuth() {
  return request({
    url: '/getAllAuth',
    method: 'get',
  })
}

export function getAuthInfo() {
  return request({
    url: '/getAuthInfo',
    method: 'get',
  })
}

//添加权限
export function addAuth(params) {
  return request({
    url: '/addAuth',
    method: 'get',
    params
  })
}

//删除权限
export function removeAuth(params) {
  return request({
    url: '/removeAuth',
    method: 'get',
    params
  })
}


//查询所有角色
export function getAllRoles() {
  return request({
    url: 'getAllRoles',
    method: 'get',
  })
}

//根据角色id查询所有权限
export function getAuthByRoleId(params) {
  return request({
    url: 'getAuthByRoleId',
    method: 'get',
    params
  })
}

//查询所有权限
export function getAllAuths() {
  return request({
    url: 'getAllAuths',
    method: 'get'
  })
}

import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'

export function getToken() {
  return window.sessionStorage.getItem('token')
}

export function setToken(token) {
  return window.sessionStorage.setItem('token',token)
}
  

export function removeToken() {
  return window.sessionStorage.removeItem('token')
}

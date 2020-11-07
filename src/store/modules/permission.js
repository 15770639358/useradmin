import { asyncRoutes, constantRoutes } from '@/router'
import {console} from "vuedraggable/src/util/helper";
import {getAllAuth} from '../../api/role'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })
  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      let accessedRoutes
      if (roles.includes('admin')) {
        accessedRoutes = asyncRoutes || []
        commit('SET_ROUTES', accessedRoutes)
        resolve(accessedRoutes)
      } else {
        setTimeout(() => {
          accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
          commit('SET_ROUTES', accessedRoutes)
          resolve(accessedRoutes)
        },500)
      }
    })
  },

  async addPathAuth() {
    let data = await getAllAuth()
    asyncRoutes.forEach(router => {
      let path = router.path
      addAuth(router, path, data)
      getPath(router, path, data)
    })
  }

}

function getPath(router, parentPath, data) {
  if(router.children) {
    router.children.forEach(async route => {
      let path = parentPath + "/" + route.path
      await addAuth(route, path, data)
      getPath(route, path, data)
    })
  }else{
    return
  }
}


async function addAuth(router, path, data) {
  let auths = data.data
  auths.forEach(authInfo => {
    authInfo.auths.forEach(auth => {
      if(auth.authpath === path) {
        router.meta.roles.push(authInfo.rolename)
      }
    })
  })
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

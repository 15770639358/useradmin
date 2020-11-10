import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: 'dashboard', icon: 'dashboard', affix: true }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [

  {
    path: '/user',
    component: Layout,
    redirect: '/user/page',
    alwaysShow: true, // will always show the root menu
    name: 'user',
    meta: {
      title: '用户信息',
      icon: 'lock',
      roles: [] // you can set roles in root nav
    },
    children: [
      {
        path: 'page',
        component: () => import('@/views/user/page'),
        name: 'PageUser',
        meta: {
          title: '用户基本信息',
          roles: [], // or you can only set roles in sub nav
          noCache: true
        }
      },
      {
        path: 'userManage',
        component: () => import('@/views/user/userManage'),
        name: 'userManage',
        meta: {
          title: '用户管理',
          roles: [], // or you can only set roles in sub nav
          noCache: true
        }
      }
    ]
  },

  {
    path: '/role',
    component: Layout,
    redirect: '/role/page',
    alwaysShow: true, // will always show the root menu
    name: 'role',
    meta: {
      title: '权限信息',
      icon: 'lock',
      roles: [] // you can set roles in root nav
    },
    children: [
      {
        path: 'page',
        component: () => import('@/views/role/page'),
        name: 'PageRole',
        meta: {
          title: '权限基本信息',
          roles: [], // or you can only set roles in sub nav
          noCache: true
        }
      },
      {
        path: 'roleManage',
        component: () => import('@/views/role/roleManage'),
        name: 'roleManage',
        meta: {
          title: '角色管理',
          roles: [], // or you can only set roles in sub nav
          noCache: true
        }
      },
      {
        path: 'authManage',
        component: () => import('@/views/role/authManage'),
        name: 'authManage',
        meta: {
          title: '角色权限管理',
          roles: [], // or you can only set roles in sub nav
          noCache: true
        }
      }
    ]
  },

  {
    path: '/btn',
    component: Layout,
    redirect: '/btn/page',
    alwaysShow: true, // will always show the root menu
    name: 'btn',
    meta: {
      title: '按钮权限',
      icon: 'lock',
      roles: [] // you can set roles in root nav
    },
    children: [
      {
        path: 'page',
        component: () => import('@/views/btn/page'),
        name: 'PageBtn',
        meta: {
          title: '按钮权限Test',
          roles: [], // or you can only set roles in sub nav
          noCache: true
        }
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router

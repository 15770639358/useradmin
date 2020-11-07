
import user from "@/store/modules/user";
import btnAuthList from '@/btnControl/btnAuthList'
import {getAllAuth} from '@/api/role'

const state = {
  btnAuth: []
}

const mutations = {

  SET_BTN: (state, btnAuths) => {
    state.btnAuth = btnAuths
  }
}

const actions = {
  async addBtn({ commit, state }) {
    let {data} = await getAllAuth()
    const roles =  user.state.roles
    let btnAuths = []
    data.forEach(authsInfo => {
      if(roles.includes(authsInfo.rolename)){
        authsInfo.auths.forEach(auth => {
          if(!btnAuths.includes(auth.authpath)){
            btnAuths.push(auth.authpath);
          }
        })
      }

    })
    console.log(btnAuths);
    commit('SET_BTN',btnAuths)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

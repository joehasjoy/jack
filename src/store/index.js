import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import user from './modules/user'
import permission from './modules/permission'
import kube from './modules/kubernetes'
import cicd from './modules/cicd'
import settings from './modules/settings'
import ecs from './modules/ecs'
import getters from './getters'
import application from './modules/application'
import env from './modules/env'
import slb from './modules/slb'
import vswitch from './modules/vswitch'
import domain from './modules/domain'
import org from './modules/org'
import pwd from './modules/password'
import alert from './modules/alert'
import ons from './modules/ons'
import ticket from './modules/ticket'
import rds from './modules/rds'
import redis from './modules/redis'
import cdn from './modules/cdn'
import flow from './modules/flow'
import createPersistedState from 'vuex-persistedstate'
import authLogin from "./modules/authLogin";

Vue.use(Vuex)

const store = new Vuex.Store({
  // plugins: [createPersistedState({
  //   storage: window.sessionStorage,
  //   // reducer(val) {
  //   //   return {
  //   //     // 只储存state中的user
  //   //     menus: val.menus
  //   //   }
  //   // }
  // })],
  modules: {
    app,
	  authLogin,
    user,
    permission,
    settings,
    kube,
    ecs,
    application,
    env,
    slb,
    vswitch,
    domain,
    org,
    pwd,
    alert,
    ticket,
    rds,
    redis,
    ons,
    cicd,
    cdn,
    flow,
  },
  getters,
})

export default store

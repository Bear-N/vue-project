import Vue from "vue"
import Vuex from "vuex"
Vue.use(Vuex)

import actions from "./actions"
import{state,mutations,getters} from "./mutations"

import menu from "./modules/menu"
import role from "./modules/role"
import manage from "./modules/manage"
import member from "./modules/member"
import cate from "./modules/cate"
import spec from "./modules/spec"
import banner from "./modules/banner"
import goods from "./modules/goods"
import user from "./modules/user"

export default new Vuex.Store({
    state,
    mutations,
    getters,
    actions,
    modules:{
        menu,
        role,
        manage,
        member,
        cate,
        spec,
        banner,
        goods,
        user
    }
})

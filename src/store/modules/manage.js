import { reqUserList, reqUserNum, reqUserLogin } from "../../util/request"
const state = {
    list: [],
    //一页的条数
    size: 2,
    //管理员总数
    total: 0,
    //当前访问的页码
    page: 1
}

const mutations = {
    changeList(state, arr) {
        state.list = arr;
    },
    changeTotal(state, num) {
        state.total = num;
    },
    changePage(state, page) {
        state.page = page
    }
}

const actions = {
    //请求列表
    reqListAction(context) {
        reqUserList({
            page: context.state.page,
            size: context.state.size
        }).then(res => {
            let arr = res.data.list ? res.data.list : []
            context.commit("changeList", arr)
        })
    },
    //获取总数的请求
    reqListNum(context) {
        reqUserNum().then(res => {
            context.commit("changeTotal", res.data.list[0].total)
        })
    },
    //修改page
    changePageAction(context, page) {
        context.commit("changePage", page)
        context.dispatch("reqListAction")
    },
    //登录
    reqUserAction(context) {
        reqUserLogin({ username: context.state.list.username, password: context.state.list.password }).then(res => {
            let arr = res.data.list ? res.data.list : []
            context.commit("changeList", arr)
        })
    },
}

const getters = {
    list(state) {
        return state.list;
    },
    size(state) {
        return state.size;
    },
    total(state) {
        return state.total;
    },
    page(state) {
        return state.page;
    },
}

export default {
    state,
    mutations,
    actions,
    getters,
    namespaced: true
}
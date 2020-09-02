import { reqSpecsList, reqSpecsNum } from "../../util/request"
const state = {
    list: [],
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
    reqListAction(context, bool) {
        let params = bool ? {} : { size: context.state.size, page: context.state.page }
        reqSpecsList(params).then(res => {
            let arr = res.data.list ? res.data.list : []
            arr.forEach(item => {
                item.attrs = JSON.parse(item.attrs)
            })
            context.commit("changeList", arr)
        })
    },
    //获取总数的请求
    reqListNum(context) {
        reqSpecsNum().then(res => {
            context.commit("changeTotal", res.data.list[0].total)
        })
    },
    //修改page
    changePageAction(context, page) {
        context.commit("changePage", page)
        context.dispatch("reqListAction")
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
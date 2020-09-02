const state = {
    info:sessionStorage.getItem("info")?JSON.parse(sessionStorage.getItem("info")):{}
}

const mutations = {
    changeInfo(state,info){
        state.info=info;
        if(info.username){
            sessionStorage.setItem("info",JSON.stringify(info))
        }else{
            sessionStorage.removeItem("info")
        }
    }
}

const actions = {
    changeInfoAction({
        commit
    },info){
        commit("changeInfo",info)
    }
}

const getters = {
    info(state){
        return state.info
    }
}

export default {
    state,
    mutations,
    actions,
    getters,
    namespaced: true
}
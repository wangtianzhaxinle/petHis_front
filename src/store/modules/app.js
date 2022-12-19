import Cookies from 'js-cookie'

const state = {
  sidebar: {
    // 这里如果sidebarStatus="1"，则!!+Cookies.get('sidebarStatus')=true;
    // 如果sidebarStatus="0"，则!!+Cookies.get('sidebarStatus')=false;
    // 详情看这里：https://blog.csdn.net/weixin_46873254/article/details/119808205
    // 另外注意当Cookies.get('sidebarStatus')="0"时，Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true结果是false
    // 也就是说if("0"){}里面是true，可成立。因为"0"需要转换为布尔类型才能判断if条件是否为真。而字符串只有空字符串""会被转换为false，其余都为true
    // 而如果是"0"==false,因为false会被转换为数字0，"0"也会被转换为数字0，所以结果是true
    // 详情在 https://blog.csdn.net/yjy_191/article/details/125777990
    opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
    // 控制.withoutAnimation样式是否开启，开启后折叠展开侧边栏没有过度动画
    withoutAnimation: false

  },
  device: 'desktop'
}

const mutations = {
  TOGGLE_SIDEBAR: state => {
    // 侧边栏的折叠以及展开之间切换
    state.sidebar.opened = !state.sidebar.opened
    state.sidebar.withoutAnimation = false
    if (state.sidebar.opened) {
      // 如果侧边栏展开了则设置sidebarStatus为1，否则为0
      Cookies.set('sidebarStatus', 1)
      // console.log('sidebarStatus=1')
      // console.log("Cookies.get('sidebarStatus')="+Cookies.get('sidebarStatus') )
      // console.log("!!+Cookies.get('sidebarStatus')="+!!+Cookies.get('sidebarStatus') )
      // console.log(Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true)
    } else {
      Cookies.set('sidebarStatus', 0)
      // console.log('sidebarStatus=0')
      // console.log("Cookies.get('sidebarStatus')="+Cookies.get('sidebarStatus') )
      // console.log("!!+Cookies.get('sidebarStatus')="+!!+Cookies.get('sidebarStatus') )
      // console.log(Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true)
    }
  },
  CLOSE_SIDEBAR: (state, withoutAnimation) => {
    // 侧边栏折叠以及设置sidebarStatus为0
    Cookies.set('sidebarStatus', 0)
    state.sidebar.opened = false
    state.sidebar.withoutAnimation = withoutAnimation
  },
  TOGGLE_DEVICE: (state, device) => {
    // 修改当前所用设备
    state.device = device
  }
}

const actions = {
  toggleSideBar({ commit }) {
    commit('TOGGLE_SIDEBAR')
  },
  // 折叠侧边栏
  closeSideBar({ commit }, { withoutAnimation }) {
    commit('CLOSE_SIDEBAR', withoutAnimation)
  },
  // 修改当前所用设备类型
  toggleDevice({ commit }, device) {
    commit('TOGGLE_DEVICE', device)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

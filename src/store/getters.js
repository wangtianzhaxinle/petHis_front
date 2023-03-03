const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,

  address: state => state.user.address,
  age: state => state.user.age,
  sex: state => state.user.sex,
  userId: state => state.user.userId,
  username: state => state.user.username,
  email: state => state.user.email,
  createtime: state => state.user.createtime,
  phoneNumber: state => state.user.phoneNumber,
  role: state => state.user.role
}
export default getters

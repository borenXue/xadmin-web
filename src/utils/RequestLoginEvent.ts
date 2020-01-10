
export default class RequestLoginEvent extends Event {
  loginParams: {
    userName: string,
    password: string,
  } = {
    userName: '',
    password: '',
  }
  loginClose: Function = () => {}
  loginDone: Function = () => {}

  constructor(userName: string, password: string, loginClose: Function, loginDone: Function) {
    super('RequestLoginEvent');
    this.loginParams.userName = userName;
    this.loginParams.password = password;
    this.loginClose = loginClose;
    this.loginDone = loginDone;
  }
}

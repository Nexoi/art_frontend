import React, { Component } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Checkbox, Alert, message } from 'antd';
import Login from '../../components/Login';
import styles from './Login.less';

const { UserName, Password, Submit } = Login;

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))
export default class LoginPage extends Component {
  state = {
    type: 'account',
    autoLogin: true,
    username: '',
    password: '',
  }

  componentDidMount() {
    const args = this.props.match.url.slice(this.props.match.url.indexOf('#/user/login') + 12);
    if ((args === undefined || args.indexOf('rebuild=false') === -1)) {
      // if (args !== '?rebuild=false') {
      window.location.href='/#/user/login?rebuild=false';
      // }
    }
  }

  onTabChange = (type) => {
    this.setState({ type });
  }
  //
  // signin = () => {
  //   const { username, password } = this.state;
  //   if (username === undefined || username.length < 1) {
  //     message.warn('请输入账户名');
  //     return;
  //   }
  //   if (password === undefined || password.length < 1) {
  //     message.warn('请输入密码');
  //     return;
  //   }
  //   console.log({ username, password });
  //   this.props.dispatch({
  //     type: 'login/login',
  //     payload: {
  //       username,
  //       password,
  //       // type,
  //       // rememberMe: autoLogin, // 记住我
  //     },
  //   });
  // }

  handleSubmit = (err, values) => {
    const { type, autoLogin } = this.state;
    if (true) {
      // if (!err) {
      const { username, password } = values;
      if (username === undefined || username.length < 1) {
        message.warn('请输入账户名');
        return;
      }
      if (password === undefined || password.length < 1) {
        message.warn('请输入密码');
        return;
      }
      // console.log({ username, password });
      // console.log(this.props.dispatch);
      this.props.dispatch({
        type: 'login/login',
        payload: {
          username,
          password,
          // type,
          // rememberMe: autoLogin, // 记住我
        },
      });
    }
  }

  onUserNameChange =  (e) => {
    const { value } = e.target;
    this.setState({
      username: value,
    });
  }
  onPasswordChange =  (e) => {
    const { value } = e.target;
    this.setState({
      password: value,
    });
  }

  changeAutoLogin = (e) => {
    this.setState({
      autoLogin: e.target.checked,
    });
  }

  renderMessage = (content) => {
    return (
      <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
    );
  }

  render() {
    const { login, submitting } = this.props;
    const { type } = this.state;
    return (
      <div className={styles.main}>
        <Login
          defaultActiveKey={type}
          onTabChange={this.onTabChange}
          onSubmit={this.handleSubmit}
        >
          {
            login.status === 'error' &&
            login.type === 'account' &&
            !login.submitting &&
            this.renderMessage('账户或密码错误')
          }
          <UserName name="username" placeholder="请输入账号" onChange={this.onUserNameChange} />
          <Password name="password" placeholder="请输入密码" onChange={this.onPasswordChange} />
          <Submit loading={submitting}>登录</Submit>
          {/*<Submit onClick={this.signin}>登录</Submit>*/}
        </Login>
      </div>
    );
  }
}

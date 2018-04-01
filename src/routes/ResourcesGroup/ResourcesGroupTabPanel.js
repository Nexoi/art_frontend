import React, { Component } from 'react';
import { routerRedux, Route, Switch } from 'dva/router';
import { connect } from 'dva';
import { Button, Modal, Input } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { getRoutes } from '../../utils/utils';
import AsyncWeChatPanel from './AsyncWeChatPanel';

@connect()
export default class ResourcesGroupTabPanel extends Component {
  state = {
    showId: this.props.match.url.slice(this.props.match.url.indexOf('/shows/') + 7),
    selectedKey: this.props.location.pathname.replace(`${this.props.match.path}/`, '') || 'all',
    addNewGroupVisible: false,
    addNewGroupInputValue: '',
    asyncWeChatModalVisible: false,
  }
  componentDidMount() {
    const key = this.props.location.pathname.replace(`${this.props.match.path}/`, '');
    // console.log(key);
    let finalKey = 'all';
    if (key.indexOf('all') !== -1) {
      finalKey = 'all';
    } else if (key.indexOf('beacon') !== -1) {
      finalKey = "beacon";
    } else if (key.indexOf('ar') !== -1) {
      finalKey = "ar";
    } else if (key.indexOf('qrcode') !== -1) {
      finalKey = "qrcode";
    }
    this.setState({
      selectedKey: finalKey,
    });
  }
  handleTabChange = (key) => {
    const { dispatch, match } = this.props;
    // console.log('=====tab key=====');
    // console.log(this.props.match.url.indexOf('/shows/'));
    // console.log(this.state.showId);
    this.setState({
      selectedKey: key,
    });
    switch (key) {
      case 'all':
        dispatch(routerRedux.push(`${match.url}/all`));
        break;
      case 'beacon':
        dispatch(routerRedux.push(`${match.url}/beacons`));
        break;
      case 'ar':
        dispatch(routerRedux.push(`${match.url}/ar`));
        break;
      case 'qrcode':
        dispatch(routerRedux.push(`${match.url}/qrcode`));
        break;
      default:
        break;
    }
  }
  openAddGroupModal = () => {
    this.setState({
      addNewGroupVisible: true,
    });
  }
  closeAddGroupModal = () => {
    this.setState({
      addNewGroupVisible: false,
    });
  }
  onNewGroupInputChange = (e) => {
    const { value } = e.target;
    this.setState({
      addNewGroupInputValue: value,
    });
  }
  addNewGroup = () => {
    // console.log(this.state.addNewGroupInputValue);
    const that = this;
    this.props.dispatch({
      type: 'resourcesgroup/addGroup',
      payload: {
        showId: this.state.showId,
        name: this.state.addNewGroupInputValue,
      },
    }).then(() => {
      that.props.dispatch({
        type: 'resourcesgroup/listGroup',
        payload: {
          showId: this.state.showId,
          page: 0,
          size: 10,
        },
      });
      that.closeAddGroupModal();
    });
  }

  // 同步微信
  openAsyncWxModal = () => {
    this.setState({
      asyncWeChatModalVisible: true,
    });
  }
  closeAsyncWxModal = () => {
    this.setState({
      asyncWeChatModalVisible: false,
    });
  }
  render() {
    const tabList = [{
      key: 'all',
      tab: '资源组',
    }, {
      key: 'beacon',
      tab: 'Beacon',
    }, {
      key: 'ar',
      tab: 'AR',
    }, {
      key: 'qrcode',
      tab: '二维码',
    }];

    const { match, routerData, location } = this.props;
    const routes = getRoutes(match.path, routerData);
    const mainSearch = (
      <div>
        <span style={{ fontSize: 20, fontWeight: 500, color: '#000000' }}>展览资源组</span>
        {this.state.selectedKey === 'all' &&
          (<div style={{ marginBottom: 0, float: 'right' }}>
            <Button size="large" style={{ marginRight: 20 }} onClick={this.openAsyncWxModal}> 微信同步 </Button>
            <Button size="large" onClick={this.openAddGroupModal}> 新建资源组 </Button>
          </div>)
        }
      </div>
    );
    const newGroupModal = (
      <Modal
        title="新建资源组"
        visible={this.state.addNewGroupVisible}
        onCancel={this.closeAddGroupModal}
        onOk={this.addNewGroup}
      >
        <Input
          style={{ marginTop: 16, marginBottom: 16 }}
          placeholder="请输入资源组名称"
          onChange={this.onNewGroupInputChange}
          onPressEnter={this.addNewGroup}
        />
      </Modal>);
    const asyncWeChatModal = (
      <AsyncWeChatPanel
        visible={this.state.asyncWeChatModalVisible}
        showId={this.state.showId}
        onCloseModal={this.closeAsyncWxModal}
      />
    );
    return (
      <PageHeaderLayout
        tabList={tabList}
        // tabActiveKey={location.pathname.replace(`${match.path}/`, '')}
        tabActiveKey={this.state.selectedKey}
        content={mainSearch}
        onTabChange={this.handleTabChange}
      >
        <Switch>
          {
            routes.map(item =>
              (
                <Route
                  key={item.key}
                  path={item.path}
                  component={item.component}
                  exact={item.exact}
                />
              )
            )
          }
        </Switch>
        {this.state.addNewGroupVisible ? newGroupModal : ''}
        {/*{this.state.asyncWeChatModalVisible ? asyncWeChatModal : ''}*/}
        {asyncWeChatModal} {/*保持长期维护，不能删去该组件*/}
      </PageHeaderLayout>
    );
  }
}

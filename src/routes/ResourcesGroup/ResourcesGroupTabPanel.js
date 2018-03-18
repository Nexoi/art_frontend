import React, { Component } from 'react';
import { routerRedux, Route, Switch } from 'dva/router';
import { connect } from 'dva';
import { Button, Modal, Input } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { getRoutes } from '../../utils/utils';

@connect()
export default class ResourcesGroupTabPanel extends Component {
  state = {
    showId: this.props.match.url.slice(this.props.match.url.indexOf('/shows/') + 7),
    addNewGroupVisible: false,
    addNewGroupInputValue: '',
  }
  handleTabChange = (key) => {
    const { dispatch, match } = this.props;
    console.log('=====tab key=====');
    console.log(this.props.match.url.indexOf('/shows/'));
    console.log(this.state.showId);
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
    this.props.dispatch({
      type: 'resourcesgroup/addGroup',
      payload: {
        showId: this.state.showId,
        name: this.state.addNewGroupInputValue,
      },
    });
    this.closeAddGroupModal();
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
    const key = location.pathname.replace(`${match.path}/`, '');
    const activeKey = key.length > 0 ? key : 'all';
    const mainSearch = (
      <div>
        <span style={{ fontSize: 20, fontWeight: 500, color: '#000000' }}>展览资源组</span>
        <div style={{ marginBottom: 0, float: 'right' }}>
          <Button size="large" onClick={this.openAddGroupModal}> 新建资源组 </Button>
        </div>
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
    return (
      <PageHeaderLayout
        tabList={tabList}
        tabActiveKey={activeKey}
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
        {newGroupModal}
      </PageHeaderLayout>
    );
  }
}

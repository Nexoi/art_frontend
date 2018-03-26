import React, { Component } from 'react';
import { routerRedux, Route, Switch } from 'dva/router';
import { connect } from 'dva';
import { Button, Modal, Input } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { getRoutes } from '../../utils/utils';

@connect()
export default class RecordTabPanel extends Component {
  state = {
    selectedKey: 'show',
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
      case 'show':
        dispatch(routerRedux.push(`${match.url}/show`));
        break;
      case 'resource-group':
        dispatch(routerRedux.push(`${match.url}/resource-group`));
        break;
      case 'resource-item':
        dispatch(routerRedux.push(`${match.url}/resource-item`));
        break;
      default:
        break;
    }
  }
  render() {
    const tabList = [{
      key: 'show',
      tab: '展览',
    }, {
      key: 'resource-group',
      tab: '资源组',
    }, {
      key: 'resource-item',
      tab: '资源',
    }];

    const { match, routerData, location } = this.props;
    const routes = getRoutes(match.path, routerData);
    return (
      <PageHeaderLayout
        tabList={tabList}
        tabActiveKey={location.pathname.replace(`${match.path}/`, '')}
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
      </PageHeaderLayout>
    );
  }
}

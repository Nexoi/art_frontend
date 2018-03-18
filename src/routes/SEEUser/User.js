/**
 * Created by neo on 18/3/2018.
 */

import React, { PureComponent } from 'react';
import { Avatar, Card, Table, Modal, message, List, Input, Dropdown, Menu, Button, Icon } from 'antd';
import { connect } from 'dva';
import { getTimeString } from '../../utils/utils';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import MaterialSelecter from '../Material/MaterialSelecter';
import EditableCell from '../Material/EditableCell';

/* 主界面 */
@connect(({ seeuser, loading }) => ({
  seeuser,
  loading: loading.effects['seeuser/listUsers'],
}))
export default class User extends PureComponent {
  componentWillMount() {
    this.props.dispatch({
      type: 'seeuser/listUsers',
      payload: {
        page: 0,
        size: 10,
      },
    });
  }
  onClickSearch = (value) => {
    this.props.dispatch({
      type: 'seeuser/listUsers',
      payload: {
        word: value,
        page: 0,
        size: 10,
      },
    });
  }

  columns = [{
    title: '头像',
    dataIndex: 'headIconUrl',
    key: 'headIconUrl',
    render: text => (<Avatar src={text} />),
  }, {
    title: '#',
    dataIndex: 'uid',
    key: 'uid',
  }, {
    title: '昵称',
    dataIndex: 'nickname',
    key: 'nickname',
  }, {
    title: '手机',
    dataIndex: 'phone',
    key: 'phone',
  }, {
    title: '用户状态',
    dataIndex: 'memberStatus',
    key: 'memberStatus',
    render: text => (
      <Button size="small" type="primary">
        {text === 'OK' ? '正常' : text === 'UNACTIVED' ? '未激活' : text === 'DISTORY' ? '已注销' : text === 'BAD' ? '恶意用户' : text}
      </Button>),
  }];
  render() {
    const mainSearch = (
      <div>
        <Input.Search
          placeholder="请输入用户昵称或手机号"
          enterButton="搜索"
          size="large"
          onSearch={this.onClickSearch}
          style={{ width: 360, float: 'left' }}
        />
      </div>
    );

    return (
      <div>
        <PageHeaderLayout
          title="用户列表"
          content={mainSearch}
        >
          <Card border="false">
            <Table
              rowKey="id"
              columns={this.columns}
              dataSource={this.props.seeuser.list}
              pagination={{
                ...this.props.seeuser.pagination,
              }}
            />
          </Card>
        </PageHeaderLayout>
      </div>);
  }
}

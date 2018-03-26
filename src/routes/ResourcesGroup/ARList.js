/**
 * Created by neo on 17/3/2018.
 */
import React, { PureComponent } from 'react';
import { Card, Table, Modal, message, List, Input, Dropdown, Menu, Button, Icon } from 'antd';
import { connect } from 'dva';
import { getTimeString } from '../../utils/utils';

/* 主界面 */
@connect(({ resourcesgroup, loading }) => ({
  resourcesgroup,
  loading: loading.effects['resourcesgroup/listGroupByAR'],
}))
export default class ARList extends PureComponent {
  state = {
    showId: this.props.match.url.slice(this.props.match.url.indexOf('/shows/') + 7, this.props.match.url.indexOf('/ar')),
  }
  componentWillMount() {
    this.props.dispatch({
      type: 'resourcesgroup/listGroupByAR',
      payload: {
        showId: this.state.showId,
        page: 0,
        size: 10,
      },
    });
  }
  handleMenuClick = (record, e) => {
    if (e.key === '1') {
      const that = this;
      Modal.confirm({
        title: '确定要解除与该资源组的绑定吗？',
        cancelText: '取消',
        okText: '确定',
        onOk() {
          that.removeAR(record.showId, record.id);
        },
      });
    }
  }
  removeAR = (showId, groupId) => {
    this.props.dispatch({
      type: 'resourcesgroup/removeAR',
      payload: {
        groupId,
        showId,
        type: 'arList',
      },
    });
  }
  /* 分页数据改变 */
  onSizeChange = (current, pageSize) => {
    this.props.dispatch({
      type: 'resourcesgroup/listGroupByAR',
      payload: {
        page: current - 1,
        size: pageSize,
        showId: this.state.showId,
      },
    });
  }
  onPageChange = (page, pageSize) => {
    this.props.dispatch({
      type: 'resourcesgroup/listGroupByAR',
      payload: {
        page: page - 1,
        size: pageSize,
        showId: this.state.showId,
      },
    });
  }
  columns = [{
    title: 'AR 图片名称',
    dataIndex: 'ar.name',
    key: 'ar.name',
    render: (text, record) => (<a target="blank" href={`${record.ar.url}`}> {text} </a>),
  }, {
    title: '绑定资源组',
    dataIndex: 'name',
    key: 'name',
    render: (text, record) => (<a href={`#/show-resources/${record.id}/items/${record.name}`}> {text} </a>),
  }, {
    title: '更新时间',
    dataIndex: 'updateTime',
    key: 'updateTime',
    render: text => (<div> {getTimeString(text)} </div>),
  }, {
    title: '操作',
    key: 'operation',
    render: (text, record) => (
      <Dropdown overlay={
        <Menu onClick={e => this.handleMenuClick(record, e)}>
          <Menu.Item key="1">解除绑定</Menu.Item>
        </Menu>}
      >
        <Button style={{ marginLeft: 8 }}>
          操作 <Icon type="down" />
        </Button>
      </Dropdown>),
  }];
  render() {
    return (
      <div>
        <Card border="false">
          <Table
            rowKey="id"
            columns={this.columns}
            dataSource={this.props.resourcesgroup.list}
            pagination={{
              ...this.props.resourcesgroup.pagination,
              onShowSizeChange: this.onSizeChange,
              onChange: this.onPageChange,
            }}
          />
        </Card>
      </div>);
  }
}

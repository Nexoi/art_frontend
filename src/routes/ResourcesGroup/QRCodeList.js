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
  loading: loading.effects['resourcesgroup/listGroupByQRCode'],
}))
export default class QRCodeList extends PureComponent {
  state = {
    showId: this.props.match.url.slice(this.props.match.url.indexOf('/shows/') + 7, this.props.match.url.indexOf('/qrcode')),
  }
  componentWillMount() {
    this.props.dispatch({
      type: 'resourcesgroup/listGroupByQRCode',
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
          that.deleteShow(record.id);
        },
      });
    }
  }
  /* 分页数据改变 */
  onSizeChange = (current, pageSize) => {
    this.props.dispatch({
      type: 'resourcesgroup/listGroupByQRCode',
      payload: {
        page: current - 1,
        size: pageSize,
        showId: this.state.showId,
      },
    });
  }
  onPageChange = (page, pageSize) => {
    this.props.dispatch({
      type: 'resourcesgroup/listGroupByQRCode',
      payload: {
        page: page - 1,
        size: pageSize,
        showId: this.state.showId,
      },
    });
  }
  columns = [{
    title: '资源组名称',
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
          <Menu.Item key="1">查看二维码</Menu.Item>
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

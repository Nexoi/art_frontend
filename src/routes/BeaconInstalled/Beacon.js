/**
 * Created by neo on 15/3/2018.
 */
import React, { PureComponent } from 'react';
import { Switch, Card, Table, Modal, message, List, Input, Dropdown, Menu, Button, Icon } from 'antd';
import { connect } from 'dva';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import BeaconAddForm from './BeaconAddForm';
import BeaconEditForm from './BeaconEditForm';

@connect(({ installBeacon, loading }) => ({
  installBeacon,
  loading: loading.effects['installBeacon/initList'],
}))
export default class Beacon extends PureComponent {
  state = {
    addModalVisible: false,
    editModalVisible: false,
    currentSelectedBeacon: {
      //
    },
  }
  componentWillMount() {
    this.props.dispatch({
      type: 'installBeacon/initList',
    });
  }
  handleMenuClick = (record, e) => {
    if (e.key === '1') {
      this.openEditBeaconPage(record);
    }
    if (e.key === '2') {
      const that = this;
      Modal.confirm({
        title: '确定要删除该 Beacon 信息吗？',
        cancelText: '取消',
        okText: '确定',
        onOk() {
          that.deleteBeacon(record.id);
        },
      });
    }
  }
  deleteBeacon = (id) => {
    this.props.dispatch({
      type: 'installBeacon/deleteBeacon',
      payload: {
        id,
      },
    });
  }
  openAddBeaconPage = () => {
    this.setState({
      addModalVisible: true,
    });
  }
  closeAddBeaconPage = (needReFlush) => {
    if (needReFlush) {
      this.props.dispatch({
        type: 'installBeacon/initList',
      });
    }
    this.setState({
      addModalVisible: false,
    });
  }
  openEditBeaconPage = (record) => {
    this.setState({
      editModalVisible: true,
      currentSelectedBeacon: record,
    });
  }
  closeEditBeaconPage = (needReFlush) => {
    if (needReFlush) {
      this.props.dispatch({
        type: 'installBeacon/initList',
      });
    }
    this.setState({
      editModalVisible: false,
    });
  }
  /* 分页数据改变 */
  onSizeChange = (current, pageSize) => {
    this.props.dispatch({
      type: 'installBeacon/fetchList',
      payload: {
        page: current - 1,
        size: pageSize,
      },
    });
  }
  onPageChange = (page, pageSize) => {
    this.props.dispatch({
      type: 'installBeacon/fetchList',
      payload: {
        page: page - 1,
        size: pageSize,
      },
    });
  }
  columns = [{
    title: 'UUID',
    dataIndex: 'uuid',
    key: 'uuid',
  }, {
    title: 'MajorValue',
    dataIndex: 'majorValue',
    key: 'majorValue',
  }, {
    title: 'MinorValue',
    dataIndex: 'minorValue',
    key: 'minorValue',
  }, {
    title: '操作',
    key: 'operation',
    render: (text, record) => (
      <div>
        <Menu onClick={e => this.handleMenuClick(record, e)}
              mode="vertical"
              style={{ float: 'left', border: 'none', background: 'rgba(0, 0, 0, 0)' }}>
          <Menu.Item key="1" style={{ float: 'left', backgroundColor: 'rgba(0, 0, 0, 0)', color: 'rgba(0, 0, 0, 0.65)' }}>编辑</Menu.Item>
          <Menu.Item key="2" style={{ float: 'left', backgroundColor: 'rgba(0, 0, 0, 0)', color: 'rgba(0, 0, 0, 0.65)' }}>删除</Menu.Item>
        </Menu>
        {/*<Button style={{ marginLeft: 8 }}>*/}
          {/*操作 <Icon type="down" />*/}
        {/*</Button>*/}
      </div>),
  }];
  render() {
    const modalAdd = (
      <Modal
        style={{ minWidth: 800 }}
        visible={this.state.addModalVisible}
        title="新增 Beacon"
        onCancel={this.closeAddBeaconPage}
        footer={null}
      >
        <BeaconAddForm
          onCloseModal={this.closeAddBeaconPage}
        />
      </Modal>);
    const modalEdit = (
      <Modal
        style={{ minWidth: 800 }}
        visible={this.state.editModalVisible}
        title="编辑 Beacon"
        onCancel={this.closeEditBeaconPage}
        footer={null}
      >
        <BeaconEditForm
          sourceData={this.state.currentSelectedBeacon}
          onCloseModal={this.closeEditBeaconPage}
        />
      </Modal>);
    const mainSearch = (
      <div>
        <div style={{ float: 'right' }}>
          <Button size="large" onClick={this.openAddBeaconPage}> 添加 Beacon </Button>
        </div>
      </div>
    );
    return (
      <div>
        <PageHeaderLayout
          title="Beacon 管理"
          content={mainSearch}
        >
          <Card border="false">
            <Table
              rowKey="id"
              columns={this.columns}
              dataSource={this.props.installBeacon.list}
              pagination={{
                ...this.props.installBeacon.pagination,
                onShowSizeChange: this.onSizeChange,
                onChange: this.onPageChange,
              }}
            />
          </Card>
        </PageHeaderLayout>
        {this.state.addModalVisible ? modalAdd : ''}
        {this.state.editModalVisible ? modalEdit : ''}
      </div>);
  }
}

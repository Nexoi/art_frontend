/**
 * Created by neo on 15/3/2018.
 */
import React, { PureComponent } from 'react';
import { Switch, Card, Table, Modal, message, List, Input, Dropdown, Menu, Button, Icon } from 'antd';
import { connect } from 'dva';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { getTimeString } from '../../utils/utils';
import BeaconAddForm from '../Beacon/BeaconAddForm';
import BeaconEditForm from '../Beacon/BeaconEditForm';

@connect(({ beacon, loading }) => ({
  beacon,
  loading: loading.effects['beacon/initList'],
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
      type: 'beacon/initList',
    });
  }
  onSwitch = (record, e) => {
    this.props.dispatch({
      type: 'beacon/changeStatus',
      payload: {
        uuid: record.uuid,
      },
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
          that.deleteBeacon(record.uuid);
        },
      });
    }
  }
  deleteBeacon = (uuid) => {
    this.props.dispatch({
      type: 'beacon/deleteBeacon',
      payload: {
        uuid,
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
        type: 'beacon/initList',
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
        type: 'beacon/initList',
      });
    }
    this.setState({
      editModalVisible: false,
    });
  }
  /* 分页数据改变 */
  onSizeChange = (current, pageSize) => {
    this.props.dispatch({
      type: 'beacon/fetchList',
      payload: {
        page: current - 1,
        size: pageSize,
      },
    });
  }
  onPageChange = (page, pageSize) => {
    this.props.dispatch({
      type: 'beacon/fetchList',
      payload: {
        page: page - 1,
        size: pageSize,
      },
    });
  }
  columns = [{
    title: 'Beacon 名称',
    dataIndex: 'name',
    key: 'name',
  }, {
    title: 'UUID',
    dataIndex: 'uuid',
    key: 'uuid',
  }, {
    title: '展馆',
    dataIndex: 'showMap.showHallName',
    key: 'showMap.showHallName',
  }, {
    title: '地图',
    dataIndex: 'showMap.name',
    key: 'showMapName',
  }, {
    title: '触发范围',
    dataIndex: 'availableRange',
    key: 'availableRange',
    render: (text) => {
      if (text === 'one') {
        return (<Button size="small" type="primary" ghost> 一米 </Button>);
      } else {
        return (<Button size="small" type="primary" ghost> 五米 </Button>);
      }
    },
  }, {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    render: (text, record) => {
      if (text === 'on') {
        return (<Switch defaultChecked onChange={e => this.onSwitch(record, e)} />);
      } else {
        return (<Switch onChange={e => this.onSwitch(record, e)} />);
      }
    },
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
          <Menu.Item key="1">编辑</Menu.Item>
          <Menu.Item key="2">删除</Menu.Item>
        </Menu>}
      >
        <Button style={{ marginLeft: 8 }}>
          操作 <Icon type="down" />
        </Button>
      </Dropdown>),
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
              rowKey="uuid"
              columns={this.columns}
              dataSource={this.props.beacon.list}
              pagination={{
                ...this.props.beacon.pagination,
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

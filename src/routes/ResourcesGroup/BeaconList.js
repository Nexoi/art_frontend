/**
 * Created by neo on 15/3/2018.
 */
import React, { PureComponent } from 'react';
import { Switch, Card, Table, Modal, message, Tooltip, Input, Dropdown, Menu, Button, Icon } from 'antd';
import { connect } from 'dva';
import { getTimeString } from '../../utils/utils';
import BeaconEditForm from '../Beacon/BeaconEditForm';

@connect(({ beacon, loading }) => ({
  beacon,
  loading: loading.effects['beacon/fetchList'],
}))
export default class Beacon extends PureComponent {
  state = {
    showId: this.props.match.url.slice(this.props.match.url.indexOf('/shows/') + 7, this.props.match.url.indexOf('/beacons')),
    editModalVisible: false,
    currentSelectedBeacon: {
      //
    },
  }
  componentDidMount() {
    this.props.dispatch({
      type: 'beacon/fetchList',
      payload: {
        showId: this.state.showId,
        page: 0,
        size: 10,
      }
    });
  }
  onSwitch = (record, e) => {
    if (record.resourcesGroupId === undefined) {
      message.warn('请先绑定一个资源组');
      return;
    }
    if (record.showMap === undefined) {
      message.warn('请先将 Beacon 添加到地图');
      return;
    }
    this.props.dispatch({
      type: 'beacon/changeStatus',
      payload: {
        showId: this.state.showId,
        uuid: record.basicInfo.id,
      },
    });
  }
  handleMenuClick = (record, e) => {
    if (e.key === '1') {
      this.openEditBeaconPage(record);
    }
  }
  deleteBeacon = (uuid) => {
    this.props.dispatch({
      type: 'beacon/deleteBeacon',
      payload: {
        showId: this.state.showId,
        uuid,
      },
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
        type: 'beacon/fetchList',
        payload: {
          showId: this.state.showId,
          page: 0,
          size: 10,
        }
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
        showId: this.state.showId,
        page: current - 1,
        size: pageSize,
      },
    });
  }
  onPageChange = (page, pageSize) => {
    this.props.dispatch({
      type: 'beacon/fetchList',
      payload: {
        showId: this.state.showId,
        page: page - 1,
        size: pageSize,
      },
    });
  }
  columns = [{
    title: 'Beacon 名称',
    dataIndex: 'name',
    key: 'name',
    render: (text) => {
      return text === undefined || text === '' ? '未命名' : text;
    },
  }, {
    title: 'UUID',
    dataIndex: 'basicInfo.uuid',
    key: 'basicInfo.uuid',
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
      const styles = {
        display: 'block',
        padding: '0 2px',
        cursor: 'initial',
        border: 'solid 1px #40a9ff',
        color: '#40a9ff',
        borderRadius: 4,
        whiteSpace: 'nowrap',
      }
      if (text === 'one') {
        return (<label size="small" type="primary" style={styles}> 一米 </label>);
      } else {
        return (<label size="small" type="primary" style={styles}> 五米 </label>);
      }
    },
  }, {
    title: '绑定状态',
    dataIndex: 'resourcesGroupId',
    key: 'resourcesGroupId',
    render: (text, record) => {
      const styles = {
        display: 'block',
        padding: '0 2px',
        cursor: 'initial',
        border: 'solid 1px #40a9ff',
        color: '#40a9ff',
        borderRadius: 4,
        whiteSpace: 'nowrap',
      }
      if (text === undefined) {
        return (<label size="small" type="primary" style={styles}> 未绑定 </label>);
      } else {
        return record.resourceGroup === undefined
          ? (<label size="small" type="primary" style={styles}> 已绑定 </label>)
          : (<a href={`#/show-resources/${record.resourcesGroupId}/show/${this.state.showId}/items/${record.resourceGroup.name}`}
                size="small"
                type="primary"
          > { `${record.resourceGroup.name}` } </a>);
      }
    },
  }, {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    render: (text, record) => {
      const disabled = record.resourcesGroupId === undefined || record.showMap === undefined;
      if (disabled) {
        return (
          <Tooltip title="请先绑定一个资源组并为该 Beacon 设定地图信息" overlay="">
            <div>
              { text === 'on'
                ? (<Switch defaultChecked disabled={true} onChange={e => this.onSwitch(record, e)} />)
                : (<Switch disabled={true} onChange={e => this.onSwitch(record, e)} />)
              }
            </div>
          </Tooltip>);
      } else {
        return text === 'on'
          ? (<Switch defaultChecked disabled={false} onChange={e => this.onSwitch(record, e)} />)
          : (<Switch disabled={false} onChange={e => this.onSwitch(record, e)} />)
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
      <div>
        <Menu onClick={e => this.handleMenuClick(record, e)}
              mode="vertical"
              style={{ float: 'left', border: 'none', background: 'rgba(0, 0, 0, 0)' }}>
          <Menu.Item key="1" style={{ float: 'left', backgroundColor: 'rgba(0, 0, 0, 0)', color: 'rgba(0, 0, 0, 0.65)' }}>编辑</Menu.Item>
        </Menu>
        {/*<Button style={{ marginLeft: 8 }}>*/}
          {/*操作 <Icon type="down" />*/}
        {/*</Button>*/}
      </div>),
  }];
  render() {
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
    return (
      <div>
        <Card border="false">
          <Table
            rowKey="id"
            columns={this.columns}
            dataSource={this.props.beacon.list}
            pagination={{
              ...this.props.beacon.pagination,
              onShowSizeChange: this.onSizeChange,
              onChange: this.onPageChange,
            }}
          />
        </Card>
        {this.state.editModalVisible ? modalEdit : ''}
      </div>);
  }
}

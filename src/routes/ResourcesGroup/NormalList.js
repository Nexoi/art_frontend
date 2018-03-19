/**
 * Created by neo on 17/3/2018.
 */
import React, { PureComponent } from 'react';
import { Card, Table, Modal, message, List, Input, Dropdown, Menu, Button, Icon } from 'antd';
import { connect } from 'dva';
import { getTimeString } from '../../utils/utils';
import MapPositionViewer from './MapPositionViewer';
import MaterialSelecter from '../Material/MaterialSelecter';
import BeaconSelector from '../Beacon/BeaconSelector';

/* 主界面 */
@connect(({ resourcesgroup, loading }) => ({
  resourcesgroup,
  loading: loading.effects['resourcesgroup/listGroup'],
}))
export default class NormalList extends PureComponent {
  state = {
    showId: this.props.match.url.slice(this.props.match.url.indexOf('/shows/') + 7, this.props.match.url.indexOf('/all')),
    mapViewerVisible: false,
    mapViewerData: {
      width: undefined,
      height: undefined,
      imageUrl: '',
      imageWidth: undefined,
      imageHeight: undefined,
    },
    arSelectorVisible: false,
    currentSelectedGroupId: -1,
    beaconSelectorVisible: false,
    currentSelectedBeacons: [],
    editGroupNameVisible: false,
    editGroupNameValue: '',
  }
  componentWillMount() {
    this.props.dispatch({
      type: 'resourcesgroup/listGroup',
      payload: {
        showId: this.state.showId,
        page: 0,
        size: 10,
      },
    });
  }
  handleMenuClick = (record, e) => {
    if (e.key === '1') {
      this.openMapViewer(
        record.positionWidth,
        record.positionHeight,
        record.showMap.width,
        record.showMap.height,
        record.showMap.image.url);
    }
    if (e.key === '2') { // reset beacons
      this.setState({
        currentSelectedGroupId: record.id,
        currentSelectedBeacons: [],
      });
      this.openBeaconSelector();
    }
    if (e.key === '3') {
      this.setState({
        currentSelectedGroupId: record.id,
        currentSelectedBeacons: record.beacons,
      });
      this.openBeaconSelector();
    }
    if (e.key === '4') {
      // 绑定 AR
      this.setState({
        currentSelectedGroupId: record.id,
      });
      this.openARSelector();
    }
    if (e.key === '5') {
      const that = this;
      Modal.confirm({
        title: '确定要解除 AR 的绑定吗？',
        cancelText: '取消',
        okText: '确定',
        onOk() {
          that.removeAR(record.showId, record.id);
        },
      });
    }
    if (e.key === '6') {
      const that = this;
      Modal.confirm({
        title: '确定要删除该资源组所有信息吗？',
        cancelText: '取消',
        okText: '确定',
        onOk() {
          that.deleteGroup(record.showId, record.id);
        },
      });
    }
    if (e.key === '7') {
      this.openEditGroupNameModal(record.id, record.name);
    }
  }
  bindAR = (showId, groupId, imageId) => {
    this.props.dispatch({
      type: 'resourcesgroup/bindAR',
      payload: {
        groupId,
        showId,
        imageId,
      },
    });
  }
  removeAR = (showId, groupId) => {
    this.props.dispatch({
      type: 'resourcesgroup/removeAR',
      payload: {
        groupId,
        showId,
      },
    });
  }
  deleteGroup = (showId, groupId) => {
    this.props.dispatch({
      type: 'resourcesgroup/deleteGroup',
      payload: {
        showId,
        groupId,
      },
    });
  }

  openMapViewer = (positionWidth, positionHeight, width, height, imageUrl) => {
    this.setState({
      mapViewerVisible: true,
      mapViewerData: {
        // width: positionWidth / width,
        // height: positionHeight / height,
        width: positionWidth,
        height: positionHeight,
        imageUrl,
        imageWidth: width,
        imageHeight: height,
      },
    });
  }
  closeMapViewer = () => {
    this.setState({
      mapViewerVisible: false,
    });
  }
  openARSelector = () => {
    this.setState({
      arSelectorVisible: true,
    });
  }
  closeARSelector = () => {
    this.setState({
      arSelectorVisible: false,
    });
  }
  handleARSelected = (type, value) => {
    if (type === 'picture') {
      this.closeARSelector();
      const { showId } = this.state;
      const groupId = this.state.currentSelectedGroupId;
      const imageId = value[0].id;
      // bind it
      this.bindAR(showId, groupId, imageId);
    }
  }
  openBeaconSelector = () => {
    this.setState({
      beaconSelectorVisible: true,
    });
  }
  closeBeaconSelector = (needReFlush) => {
    this.setState({
      beaconSelectorVisible: false,
    });
    this.props.dispatch({
      type: 'resourcesgroup/listGroup',
      payload: {
        page: this.props.resourcesgroup.page.number,
        size: this.props.resourcesgroup.page.size,
        showId: this.state.showId,
      },
    });
  }
  /* 分页数据改变 */
  onSizeChange = (current, pageSize) => {
    this.props.dispatch({
      type: 'resourcesgroup/listGroup',
      payload: {
        page: current - 1,
        size: pageSize,
        showId: this.state.showId,
      },
    });
  }
  onPageChange = (page, pageSize) => {
    this.props.dispatch({
      type: 'resourcesgroup/listGroup',
      payload: {
        page: page - 1,
        size: pageSize,
        showId: this.state.showId,
      },
    });
  }
  /* 名称修改 */
  openEditGroupNameModal = (id, initName) => {
    this.setState({
      editGroupNameVisible: true,
      currentSelectedGroupId: id,
      editGroupNameValue: initName,
    });
  }
  closeEditGroupNameModal = () => {
    this.setState({
      editGroupNameVisible: false,
    });
  }
  onEditGroupInputChange = (e) => {
    const { value } = e.target;
    this.setState({
      editGroupNameValue: value,
    });
  }
  updateGroupName = () => {
    // console.log(this.state.addNewGroupInputValue);
    this.props.dispatch({
      type: 'resourcesgroup/changeName',
      payload: {
        showId: this.state.showId,
        groupId: this.state.currentSelectedGroupId,
        name: this.state.editGroupNameValue,
      },
    });
    this.closeEditGroupNameModal();
  }
  columns = [{
    title: '#ID',
    dataIndex: 'id',
    key: 'id',
  }, {
    title: '资源组名称',
    dataIndex: 'name',
    key: 'name',
    render: (text, record) => (<a href={`#/show-resources/${record.id}/items/${record.name}`}> {text} </a>),
  }, {
    title: '地图',
    dataIndex: 'showMap.name',
    key: 'showMap.name',
  }, {
    title: '浏览量',
    dataIndex: 'viewTimes',
    key: 'viewTimes',
  }, {
    title: '点赞数',
    dataIndex: 'likeTimes',
    key: 'likeTimes',
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
          <Menu.Item key="7">修改名称</Menu.Item>
          {record.showMap === undefined
            ? ''
            : (<Menu.Item key="1">查看位置</Menu.Item>)}
          {record.beacons === undefined || record.beacons.length === 0
            ? (<Menu.Item key="2">绑定 Beacon</Menu.Item>)
            : (<Menu.Item key="3">修改 Beacon</Menu.Item>)}
          {record.ar === undefined || record.ar.id === undefined
            ? (<Menu.Item key="4">绑定 AR</Menu.Item>)
            : (<Menu.Item key="5">解绑 AR</Menu.Item>)}
          <Menu.Item key="6">删除</Menu.Item>
        </Menu>}
      >
        <Button style={{ marginLeft: 8 }}>
          操作 <Icon type="down" />
        </Button>
      </Dropdown>),
  }];
  render() {
    const mapViewer = (
      <Modal
        style={{ minWidth: 858 }}
        visible={this.state.mapViewerVisible}
        onCancel={this.closeMapViewer}
        footer={null}
      >
        <MapPositionViewer
          positionWidth={this.state.mapViewerData.width}
          positionHeight={this.state.mapViewerData.height}
          imageWidth={this.state.mapViewerData.imageWidth}
          imageHeight={this.state.mapViewerData.imageHeight}
          imageUrl={this.state.mapViewerData.imageUrl}
        />
      </Modal>);
    const ARSelector = (
      <MaterialSelecter
        visible={this.state.arSelectorVisible}
        handleSelected={this.handleARSelected}
        onCancel={this.closeARSelector}
        isSingleSelect="true"
        availableType={['picture']}
      />);
    const beaconSelector = (
      <BeaconSelector
        visible={this.state.beaconSelectorVisible}
        showId={this.state.showId}
        groupId={this.state.currentSelectedGroupId}
        initialData={this.state.currentSelectedBeacons}
        closeSelector={this.closeBeaconSelector}
      />
    );
    const editGroupNameModal = (
      <Modal
        title="修改资源组名称"
        visible={this.state.editGroupNameVisible}
        onCancel={this.closeEditGroupNameModal}
        onOk={this.updateGroupName}
      >
        <Input
          style={{ marginTop: 16, marginBottom: 16 }}
          placeholder="请输入资源组名称"
          // initialValue={this.state.editGroupNameValue}
          onChange={this.onEditGroupInputChange}
          onPressEnter={this.updateGroupName}
        />
      </Modal>);
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
        {this.state.mapViewerVisible ? mapViewer : ''}
        {this.state.arSelectorVisible ? ARSelector : ''}
        {this.state.beaconSelectorVisible ? beaconSelector : ''}
        {this.state.editGroupNameVisible ? editGroupNameModal : ''}
      </div>);
  }
}

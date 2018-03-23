/**
 * Created by neo on 18/3/2018.
 */

import React, { PureComponent } from 'react';
import { Card, Table, Modal, message, List, Input, Dropdown, Menu, Button, Icon } from 'antd';
import { connect } from 'dva';
import { getTimeString } from '../../utils/utils';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import MaterialSelecter from '../Material/MaterialSelecter';
import EditableCell from '../Material/EditableCell';

/* 主界面 */
@connect(({ resourceitem, loading }) => ({
  resourceitem,
  loading: loading.effects['resourceitem/listItems'],
}))
export default class ResourceItem extends PureComponent {
  state = {
    groupId: this.props.match.url.slice(this.props.match.url.indexOf('/show-resources/') + 16, this.props.match.url.indexOf('/items')),
    groupName: this.props.match.url.slice(this.props.match.url.indexOf('/items/') + 7),
    selectorVisible: false,
    selectorType: [],
  }
  componentWillMount() {
    this.props.dispatch({
      type: 'resourceitem/listItems',
      payload: {
        showId: -1,
        groupId: this.state.groupId,
      },
    });
  }
  handleMenuClick = (record, e) => {
    if (e.key === '1') {
      const that = this;
      Modal.confirm({
        title: '确定要删除该资源吗？',
        cancelText: '取消',
        okText: '确定',
        onOk() {
          that.deleteItem(record.id);
        },
      });
    }
  }
  deleteItem = (itemId) => {
    this.props.dispatch({
      type: 'resourceitem/deleteItem',
      payload: {
        showId: -1,
        groupId: this.state.groupId,
        itemId,
      },
    });
  }
  handleAddItemClick = (e) => {
    const { key } = e;
    if (key === '4') {
      // 打开网页编辑器页面
      return;
    }
    const type = key === '1' ? 'audio' : key === '2' ? 'video' : key === '3' ? 'picture' : '';
    if (type.length > 1) {
      this.openSelectorModal(type);
    }
  }
  openSelectorModal = (type) => {
    this.setState({
      selectorVisible: true,
      selectorType: [type],
    });
  }
  closeSelectorModal = () => {
    this.setState({
      selectorVisible: false,
    });
  }
  handleSelected = (type, values) => {
    const { id } = values[0];
    const data = {
      showId: -1,
      groupId: this.state.groupId,
    };
    if (type === 'audio') {
      this.props.dispatch({
        type: 'resourceitem/addAudio',
        payload: {
          ...data,
          audioId: id,
        },
      });
    }
    if (type === 'video') {
      this.props.dispatch({
        type: 'resourceitem/addVideo',
        payload: {
          ...data,
          videoId: id,
        },
      });
    }
    if (type === 'picture') {
      this.props.dispatch({
        type: 'resourceitem/addImage',
        payload: {
          ...data,
          imageId: id,
        },
      });
    }
    this.closeSelectorModal();
  }
  onItemEditableUpdate = (id, value) => {
    this.props.dispatch({
      type: 'resourceitem/changeName',
      payload: {
        showId: -1,
        groupId: this.state.groupId,
        itemId: id,
        name: value,
      },
    });
  }

  columns = [{
    title: '资源名称',
    dataIndex: 'name',
    key: 'name',
    render: (text, record) => (
      <EditableCell
        id={record.id}
        value={text}
        onChange={this.onItemEditableUpdate}
      />),
  }, {
    title: '类型',
    dataIndex: 'type',
    key: 'type',
    render: text => (
      <Button size="small" type="primary">
        {text === 'AUDIO' ? '音频' : text === 'VIDEO' ? '视频' : text === 'PICTURE' ? '图片' : text === 'WEB' ? '网页' : '未知'}
      </Button>),
  }, {
    title: '资源地址',
    dataIndex: 'url',
    key: 'url',
    render: text => (<a target="blank" href={text}> {text} </a>),
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
          <Menu.Item key="1">删除</Menu.Item>
        </Menu>}
      >
        <Button style={{ marginLeft: 8 }}>
          操作 <Icon type="down" />
        </Button>
      </Dropdown>),
  }];
  render() {
    const mainSearch = (
      <div>
        <div style={{ float: 'right' }}>
          <Dropdown overlay={
            <Menu onClick={e => this.handleAddItemClick(e)}>
              <Menu.Item key="1">添加音频</Menu.Item>
              <Menu.Item key="2">添加视频</Menu.Item>
              <Menu.Item key="3">添加图片</Menu.Item>
              <Menu.Item key="4"><a href={`#/show-resources/${this.state.groupId}/editor`}>添加网页</a></Menu.Item>
            </Menu>}
          >
            <Button size="large" onClick={this.openAddResourceItem}> 添加资源 <Icon type="down" /></Button>
          </Dropdown>
        </div>
      </div>
    );

    const selector = (
      <MaterialSelecter
        visible={this.state.selectorVisible}
        handleSelected={this.handleSelected}
        onCancel={this.closeSelectorModal}
        isSingleSelect="true"
        availableType={this.state.selectorType}
      />);
    return (
      <div>
        <PageHeaderLayout
          title={`资源「${this.state.groupName}」详情列表`}
          content={mainSearch}
        >
          <Card border="false">
            <Table
              rowKey="id"
              columns={this.columns}
              dataSource={this.props.resourceitem.list}
              pagination={{
                ...this.props.resourceitem.pagination,
              }}
            />
          </Card>
        </PageHeaderLayout>
        {this.state.selectorVisible ? selector : ''}
      </div>);
  }
}

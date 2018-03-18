/* eslint-disable no-param-reassign */
/**
 * Created by neo on 25/2/2018.
 */
import React, { PureComponent } from 'react';
import { Table, Input, Button, Card, message, Select, Dropdown, Icon, Menu, Modal, Form, Upload } from 'antd';
import { connect } from 'dva';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import { getTimeString, getSizeOfFile } from '../../../utils/utils';
import ModalForFolder from '../ModalForFolder';

/* 主界面 */
@connect(({ video, loading }) => ({
  video,
  loading: loading.effects['video/initFolders'],
}))
export default class VideoSelector extends PureComponent {
  state = {
    selectedRowKeys: [],
  }

  componentWillMount() {
    this.props.dispatch({
      type: 'video/initFolders',
    });
    this.props.dispatch({
      type: 'video/initList',
    });
  }

  componentDidMount() {
  }

  /* 选择文件夹 */
  handleChange = (folder) => {
    // message.info(`当前选中文件夹为： ${folder}`);
    this.props.dispatch({
      type: 'video/listByFolder',
      payload: {
        folderId: folder,
        page: 0,
        size: this.props.video.page.size,
      },
    });
  };
  /* 分页数据改变 */
  onShowSizeChange = (current, pageSize) => {
    // this.setState({
    //   pagination: {
    //     ...this.state.pagination,
    //     current,
    //     pageSize,
    //   },
    // });
    this.props.dispatch({
      type: 'video/listByFolder',
      payload: {
        folderId: this.props.video.currentFolder.id,
        page: current - 1,
        size: pageSize,
      },
    });
  }
  onPageChange = (page, pageSize) => {
    this.props.dispatch({
      type: 'video/listByFolder',
      payload: {
        folderId: this.props.video.currentFolder.id,
        page: page - 1,
        size: pageSize,
      },
    });
  }

  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
    this.props.onSelectedChange(this.queryItems(selectedRowKeys));
  }
  queryItems = (ids) => {
    const items = this.props.video.list.filter(
      (item) => {
        return (ids.indexOf(item.id) !== -1);
      });
    return items;
  }
  /* 表 */
  columns = [{
    title: '视频名称',
    dataIndex: 'name',
    key: 'name',
  }, {
    title: '时长',
    dataIndex: 'length',
    key: 'length',
    render: text => (<div> {`${text} 秒`} </div>),
  }, {
    title: '大小',
    dataIndex: 'size',
    key: 'size',
    render: text => (<div> {getSizeOfFile(text)} </div>),
  }, {
    title: '创建时期',
    dataIndex: 'createTime',
    key: 'createTime',
    render: text => (<div> {getTimeString(text)} </div>),
  }];
  render() {
    const folderOption = this.props.video.folders
      .map(folder => <Select.Option key={folder.id}>{folder.name}</Select.Option>);

    const mainSearch = (
      <div>
        <div style={{ marginBottom: 20 }}>
          <Select
            size="large"
            placeholder="选择一个素材组"
            defaultValue={this.props.video.currentFolder.name || '-'}
            style={{ width: 120, marginRight: 20 }}
            onChange={this.handleChange}
          >
            {folderOption}
          </Select>
        </div>
      </div>
    );

    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    return (
      <div>
        <Card border="false">
          {mainSearch}
          <Table
            rowSelection={rowSelection}
            rowKey="id"
            columns={this.columns}
            dataSource={this.props.video.list}
            pagination={{
              ...this.props.video.pagination,
              onShowSizeChange: this.onShowSizeChange,
              onChange: this.onPageChange,
            }}
          />
        </Card>
      </div>);
  }
}

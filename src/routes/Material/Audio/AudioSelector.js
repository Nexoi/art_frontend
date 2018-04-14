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
@connect(({ audio, loading }) => ({
  audio,
  loading: loading.effects['audio/initFolders'],
}))
export default class AudioSelector extends PureComponent {
  state = {
    selectedRowKeys: [],
    showId: this.props.showId,
    folderId: undefined,
  }

  componentWillMount() {
    this.props.dispatch({
      type: 'audio/initFolders',
    }).then(() => {
      // 确定加载模式，是否只列出该展览数据
      const { showId } = this.state;
      if (showId === undefined) {
        return;
      }
      const folders = this.props.picture.folders;
      const theFolder = folders.filter(it => parseInt(it.showId) === parseInt(showId));
      if (theFolder === undefined || theFolder.length === 0) {
        return;
      }
      const folderId = theFolder[0].id;
      if (folderId === undefined || folderId <= 0) {
        this.setState({
          folderId: undefined,
        });
        // 加载全部数据
        this.props.dispatch({
          type: 'audio/initList',
        });
      } else {
        this.setState({
          folderId,
        });
        this.handleChange(folderId); // 加载某一个文件夹下的数据
      }
    });
  }

  componentDidMount() {
  }
  /* 选择文件夹 */
  handleChange = (folder) => {
    // message.info(`当前选中文件夹为： ${folder}`);
    this.props.dispatch({
      type: 'audio/listByFolder',
      payload: {
        folderId: folder,
        page: 0,
        size: this.props.audio.page.size || 10,
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
      type: 'audio/listByFolder',
      payload: {
        folderId: this.props.audio.currentFolder.id,
        page: current - 1,
        size: pageSize,
      },
    });
  }
  onPageChange = (page, pageSize) => {
    this.props.dispatch({
      type: 'audio/listByFolder',
      payload: {
        folderId: this.props.audio.currentFolder.id,
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
    const items = this.props.audio.list.filter(
      (item) => {
        return (ids.indexOf(item.id) !== -1);
      });
    return items;
  }
  /* 表 */
  columns = [{
    title: '音频名称',
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
    // const { list } = this.props.audio;
    const folderOption = this.props.audio.folders
      .map(folder => <Select.Option key={folder.id}>{folder.name}</Select.Option>);

    const mainSearch = (
      <div>
        <div style={{ marginBottom: 20 }}>
          <Select
            size="large"
            placeholder="选择一个素材组"
            defaultValue={this.props.audio.currentFolder.name || '-'}
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
          { this.state.folderId === undefined ? mainSearch : '' }
          <Table
            rowSelection={rowSelection}
            rowKey="id"
            columns={this.columns}
            dataSource={this.props.audio.list}
            pagination={{
                ...this.props.audio.pagination,
                onShowSizeChange: this.onShowSizeChange,
                onChange: this.onPageChange,
              }}
          />
        </Card>
      </div>);
  }
}

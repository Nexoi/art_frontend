/* eslint-disable no-param-reassign */
/**
 * Created by neo on 25/2/2018.
 */
import React, { PureComponent } from 'react';
import { Input, Button, Card, message, Select, Checkbox, Icon, Pagination, Modal, Form, Upload, List } from 'antd';
import { connect } from 'dva';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import ModalForFolder from '../ModalForFolder';

/* 主界面 */
@connect(({ picture, loading }) => ({
  picture,
  loading: loading.effects['picture/initFolders'],
}))
export default class PictureSelector extends PureComponent {
  state = {
    selectedPictureIds: [],
  }

  componentWillMount() {
    this.props.dispatch({
      type: 'picture/initFolders',
    });
    this.props.dispatch({
      type: 'picture/initList',
    });
  }

  componentDidMount() {
    // this.props.dispatch({
    //   type: 'picture/fetchList',
    // });
  }

  /* 选择文件夹 */
  handleChange = (folder) => {
    // message.info(`当前选中文件夹为： ${folder}`);
    this.props.dispatch({
      type: 'picture/listByFolder',
      payload: {
        folderId: folder,
        page: 0,
        size: this.props.picture.page.size,
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
      type: 'picture/listByFolder',
      payload: {
        folderId: this.props.picture.currentFolder.id,
        page: current - 1,
        size: pageSize,
      },
    });
  }
  onPageChange = (page, pageSize) => {
    this.props.dispatch({
      type: 'picture/listByFolder',
      payload: {
        folderId: this.props.picture.currentFolder.id,
        page: page - 1,
        size: pageSize,
      },
    });
  }
  /* 选中按钮 - 删除预操作 */
  onCheckChange = (checkedValues) => {
    this.setState({
      selectedPictureIds: checkedValues,
    });
    this.props.onSelectedChange(this.queryItems(checkedValues));
  };
  queryItems = (ids) => {
    const items = this.props.picture.list.filter(
      (item) => {
        return (ids.indexOf(item.id) !== -1);
      });
    return items;
  }

  render() {
    // const { list } = this.props.picture;
    const folderOption = this.props.picture.folders
      .map(folder => <Select.Option key={folder.id}>{folder.name}</Select.Option>);

    const mainSearch = (
      <div>
        <div style={{ marginBottom: 20 }}>
          <Select
            size="large"
            placeholder="选择一个素材组"
            defaultValue={this.props.picture.currentFolder.name || '-'}
            style={{ width: 120, marginRight: 20 }}
            onChange={this.handleChange}
          >
            {folderOption}
          </Select>
        </div>
      </div>
    );

    return (
      <div>
        <Card border="false">
          {mainSearch}
          <Checkbox.Group
            onChange={this.onCheckChange}
            value={this.state.selectedPictureIds}
          >
            <List
              grid={{ gutter: 32, xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 4 }}
              dataSource={this.props.picture.list}
              style={
                  (this.props.picture.list.length < 4 && { minWidth: 900 })
                  ||
                  { minWidth: 0 } // 如果列表大于 4，则控制宽度
                }
              renderItem={item => (
                <List.Item
                  style={{ height: 300 }}
                >
                  <Card
                    hoverable
                    style={{ width: 160, padding: 0 }}
                    cover={
                      <div
                        style={{ overflow: 'hidden', width: 158, height: 160, lineHeight: '200px' }}
                      >
                        { item.width < item.height
                          ? (<img
                            alt="图片"
                            style={{ width: 158 }}
                            src={item.url}
                          />)
                          : (<img
                            alt="图片"
                            style={{ height: 160 }}
                            src={item.url}
                          />) }
                      </div>}
                  >
                    <Checkbox value={item.id} style={{ margin: 0, display: 'inline-flex' }}>
                      {item.name.toString().length > 6 ? `${item.name.slice(0, 3)}..${item.name.slice(-3)}` : item.name}
                    </Checkbox>
                  </Card>
                </List.Item>
                )}
            />
          </Checkbox.Group>
          <Pagination
            {...this.props.picture.pagination}
            showSizeChanger
            onShowSizeChange={this.onShowSizeChange}
            onChange={this.onPageChange}
          />
        </Card>
      </div>);
  }
}

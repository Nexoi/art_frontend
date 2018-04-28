/* eslint-disable no-param-reassign */
/**
 * Created by neo on 25/2/2018.
 */
import React, { PureComponent } from 'react';
import { Input, Button, Card, message, Select, Checkbox, Icon, Pagination, Modal, Form, Upload, List } from 'antd';
import { connect } from 'dva';
import { domain_api } from '../../../utils/utils';

/* 主界面 */
@connect(({ picture, loading }) => ({
  picture,
  loading: loading.effects['picture/initFolders'],
}))
export default class PictureSelector extends PureComponent {
  state = {
    selectedPictureIds: [],
    showId: this.props.showId,
    folderId: undefined,
    /* 文件上传 */
    modalVisible: false,
    uploadProps: {
      name: 'file',
      action: `${domain_api}/api/admin/v1/upload/image`,
      // fileList: [{
      //   uid: -1,
      //   name: 'demo.png',
      //   status: 'done',
      //   url: 'http://www.baidu.com/demo.png',
      // }],
      fileList: [],
    },
    uploadFileAvailable: false,
    // data: {
    //   name: '',
    //   length: 1213,
    //   size: 2132,
    // },
    data: {
      name: `${new Date().getTime()}.png`,
    },
  }

  componentWillMount() {
    console.log('======folder======')
    console.log(this.state);
    console.log('======folder======^')
    this.props.dispatch({
      type: 'picture/initFolders',
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
          type: 'picture/initList',
        });
      } else {
        this.setState({
          folderId,
        });
        this.handleChange(folderId); // 加载某一个文件夹下的数据
      }
      // console.log(folderId)
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
        size: this.props.picture.page.size || 10,
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
  ////////// uploader /////////

  showModal = () => {
    this.setState({
      modalVisible: true,
    });
  };
  /* Modal 框 */
  handleModalOk = () => {
    if (!this.state.uploadFileAvailable) {
      message.error('请上传正确的图片文件');
      return;
    }
    if (this.state.uploadProps.fileList.length !== 1) {
      message.error('请先上传图片文件');
      return;
    }
    const url = this.state.uploadProps.fileList[0].url;
    if (url === undefined || url.length < 2) {
      message.warn('请先上传图片');
      return;
    }
    const data = {
      folderId: this.props.picture.currentFolder.id,
      name: this.state.data.name,
      // length: this.state.data.length,
      // size: this.state.uploadProps.fileList[0].size,
      url: this.state.uploadProps.fileList[0].url,
      width: this.state.uploadProps.fileList[0].width,
      height: this.state.uploadProps.fileList[0].height,
    };
    // request by data
    const that = this;
    this.props.dispatch({
      type: 'picture/addImage',
      payload: data,
    }).then(() => {
      // 下面两行会执行吗？
      // message.info('添加成功！');
      that.setState({
        // ...this.props.picture,
        modalVisible: false,
      });
    });
  };
  /* Modal 框 */
  handleModalCancel = () => {
    this.setState({
      // ...this.props.picture,
      modalVisible: false,
    });
  }
  /* 表单上传数据 在这里汇合 */
  onFormDataChange = (changedFields) => {
    if (!changedFields.file) {
      this.setState({
        data: { ...this.state.data, ...changedFields },
      });
    } else {
      this.setState({
        data: { ...this.state.data, url: changedFields.file.url },
      });
    }
  }
  /* 文件上传前验证 */
  beforeUpload = (file) => {
    const isPicture = file.type.slice(0, 5) === 'image';
    if (!isPicture) {
      message.error('请上传正确的图片文件');
      this.setState({
        uploadFileAvailable: false,
      });
    }
    return isPicture;
  };
  /* 文件上传监听 */
  onUploadChange = (info) => {
    console.log(info);
    // 只允许上传一个文件
    let { fileList } = info;
    fileList = fileList.slice(-1);
    // 转化为 state 标准格式
    let flag = false;
    fileList = fileList.map((file) => {
      if (file.response) {
        if(file.response === undefined || file.response.status === undefined || file.response.status !== 200) {
          // message.warn('图片信息读取失败，请确认图片格式正确');
          flag = true;
          return;
        }
        // Component will show file.url as link
        file.url = file.response.data.url;
        file.width = file.response.data.width;
        file.height = file.response.data.height;
        flag = false;
      }
      return file;
    });
    if (flag){
      message.warn('图片信息读取失败，请确认图片格式正确');
      return;
    }
    //
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} 文件上传成功！`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} 文件上传失败！`);
    }
    // 更新 Component 数据
    const { uploadProps } = this.state;
    this.setState({
      uploadProps: {
        ...uploadProps,
        fileList,
      },
      uploadFileAvailable: true, // 上传的文件可用
    });
  };
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
            defaultValue={this.props.picture.currentFolder.name || '选择一个素材组'}
            style={{ width: 120, marginRight: 20 }}
            onChange={this.handleChange}
          >
            {folderOption}
          </Select>
        </div>
      </div>
    );
    const modal = (
      <CollectionCreateForm
        title="添加图片"
        visible={this.state.modalVisible}
        onCreate={this.handleModalOk}
        onCancel={this.handleModalCancel}
        uploadProps={this.state.uploadProps}
        uploadChange={this.onUploadChange}
        beforeUpload={this.beforeUpload}
        okText="添加"
        {...this.state.data} /* 表单数据 */
        onChange={this.onFormDataChange}
        defaultPictureName={this.state.data.name}
      />
    );
    return (
      <div>
        <Card border="false">
          <Button size="large" onClick={this.showModal} style={{ marginBottom: 2 }}> 上传图片 </Button>
          { this.state.folderId === undefined ? mainSearch : ''}
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
        {modal}
      </div>);
  }
}

const FormItem = Form.Item;

const CollectionCreateForm = Form.create({
  onFieldsChange(props, changedFields) {
    // props.onChange(changedFields);
  },
  onValuesChange(props, values) {
    console.log(values);
    props.onChange(values);
  },
})((props) => {
    const {
      title, visible, onCancel, onCreate, form, okText,
      uploadProps, uploadChange, beforeUpload, defaultPictureName,
    } = props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        visible={visible}
        title={title}
        okText={okText}
        onCancel={onCancel}
        onOk={onCreate}
      >
        <Form layout="vertical">
          <FormItem label="图片名称（自动生成，可手动修改）">
            {getFieldDecorator('name', {
              rules: [{ required: false, message: '请输入文件名称！' }],
              initialValue: defaultPictureName,
            })(<Input />)}
          </FormItem>
          <FormItem>
            {getFieldDecorator('file', {
              rules: [{ required: true, message: '请上传文件！' }],
            })(
              <Upload {...uploadProps} onChange={uploadChange} beforeUpload={beforeUpload}>
                <Button><Icon type="upload" /> 上传文件</Button>
              </Upload>)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
);

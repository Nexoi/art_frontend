/* eslint-disable no-param-reassign */
/**
 * Created by neo on 25/2/2018.
 */
import React, { PureComponent } from 'react';
import { Table, Input, Button, Card, message, Select, Dropdown, Icon, Menu, Modal, Form, Upload } from 'antd';
import { connect } from 'dva';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import { getTimeString, getSizeOfFile, domain_api } from '../../../utils/utils';
import ModalForFolder from '../ModalForFolder';

/* 可编辑单元格 */
class EditableCell extends PureComponent {
  state = {
    value: this.props.value,
    editable: false,
  }
  handleChange = (e) => {
    const { value } = e.target;
    this.setState({ value });
  }
  check = () => {
    this.setState({ editable: false });
    if (this.props.onChange) {
      this.props.onChange(this.state.value);
    }
  }
  edit = () => {
    this.setState({ editable: true });
  }

  render() {
    const { value, editable } = this.state;
    return (
      <div className="editable-cell">
        {
          editable ? (
            <div className="editable-cell-input-wrapper">
              <Input
                value={value}
                onChange={this.handleChange}
                onPressEnter={this.check}
              />
              <Icon
                type="check"
                className="editable-cell-icon-check"
                onClick={this.check}
              />
            </div>
          ) : (
            <div className="editable-cell-text-wrapper">
              {value || ' '}
              <Icon
                type="edit"
                className="editable-cell-icon"
                onClick={this.edit}
              />
            </div>
          )}
      </div>
    );
  }
}

/* 弹出 Modal 添加内容 */
const FormItem = Form.Item;

const CollectionCreateForm = Form.create({
  onFieldsChange(props, changedFields) {
    // props.onChange(changedFields);
  },
  onValuesChange(props, values) {
    console.log(values);
    props.onChange(values);
  },
  // mapPropsToFields(props) {
  //   return {
  //     name: Form.createFormField({
  //       ...props,
  //       value: props.name,
  //     }),
  //     length: Form.createFormField({
  //       ...props,
  //       value: props.length,
  //     }),
  //     size: Form.createFormField({
  //       ...props,
  //       value: props.size,
  //     }),
  //   };
  // },
})((props) => {
  const {
    title, visible, onCancel, onCreate, form, okText,
    uploadProps, uploadChange, beforeUpload,
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
        <FormItem label="文件名称">
          {getFieldDecorator('name', {
              rules: [{ required: true, message: '请输入文件名称！' }],
            })(<Input />)}
        </FormItem>
        <FormItem label="视频时长（单位：秒）">
          {getFieldDecorator('length', {
              rules: [{ required: true, message: '请输入视频长度！' }],
            })(<Input type="number" />)}
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

/* 主界面 */
@connect(({ video, loading }) => ({
  video,
  loading: loading.effects['video/initFolders'],
}))
export default class Video extends PureComponent {
  state = {
    modalVisible: false,
    folderModalVisible: false,
    /* 文件上传 */
    uploadProps: {
      name: 'file',
      action: `${domain_api}/api/admin/v1/upload`,
      // headers: {
      //   authorization: 'authorization-text',
      // },
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
    data: {},
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

  /* 文件上传前验证 */
  beforeUpload = (file) => {
    const isAUDIO = file.type.slice(0, 5) === 'video';
    if (!isAUDIO) {
      message.error('请上传正确的视频文件');
      this.setState({
        uploadFileAvailable: false,
      });
    }
    return isAUDIO;
  };
  /* 文件上传监听 */
  onUploadChange = (info) => {
    console.log(info);
    // 只允许上传一个文件
    let { fileList } = info;
    fileList = fileList.slice(-1);
    // 转化为 state 标准格式
    fileList = fileList.map((file) => {
      if (file.response) {
        // Component will show file.url as link
        file.url = file.response.data.url;
        file.size = file.response.data.size;
      }
      return file;
    });
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
  /* 选择操作 - 删除 */
  onDeleteItem = (id) => {
    // message.info(`正在删除：ID = ${id}`);
    this.props.dispatch({
      type: 'video/deleteVideo',
      payload: {
        videoId: id,
      },
    });
  };
  /* 编辑名称 */
  onCellChange = (key) => {
    return (value) => {
      const dataSource = [...this.props.video.page.content];
      const target = dataSource.find(item => item.key === key);
      if (target) {
        target.name = value;
        this.setState(dataSource);
      }
      // message.info(`名称被修改了：${key} | ${value}`);
      // request
      this.props.dispatch({
        type: 'video/changeName',
        payload: {
          videoId: key,
          name: value,
        },
      });
    };
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
  /* 选择操作 - 删除 */
  handleMenuClick = (record, e) => {
    if (e.key === '1') {
      const that = this;
      Modal.confirm({
        title: '确定要删除该视频文件吗？',
        cancelText: '取消',
        okText: '确定',
        onOk() {
          that.onDeleteItem(record.id);
        },
      });
    }
  };
  /* Modal 框 */
  showModal = () => {
    this.setState({
      // ...this.props.video,
      modalVisible: true,
    });
  };
  /* Modal 框 */
  handleModalOk = () => {
    if (!this.state.uploadFileAvailable) {
      message.error('请上传正确的视频文件');
      return;
    }
    if (this.state.uploadProps.fileList.length !== 1) {
      message.error('请先上传视频文件');
      return;
    }
    const url = this.state.uploadProps.fileList[0].url;
    if (url === undefined || url.length < 2) {
      message.warn('请先上传视频文件');
      return;
    }
    const data = {
      folderId: this.props.video.currentFolder.id,
      name: this.state.data.name,
      length: this.state.data.length,
      size: this.state.uploadProps.fileList[0].size,
      url: this.state.uploadProps.fileList[0].url,
    };
    // request by data
    const that = this;
    this.props.dispatch({
      type: 'video/addVideo',
      payload: data,
    }).then(() => {
      // 下面两行会执行吗？
      // message.info('添加成功！');
      that.setState({
        modalVisible: false,
      });
    });
  };
  /* Modal 框 */
  handleModalCancel = () => {
    this.setState({
      // ...this.props.video,
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

  /* 表 */
  columns = [{
    title: '视频名称',
    dataIndex: 'name',
    key: 'name',
    render: (text, record) => (
      <EditableCell
        value={text}
        onChange={this.onCellChange(record.id)}
      />
    ),
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
  }, {
    title: '操作',
    key: 'operation',
    render: (text, record) => (
      <div>
        <Menu onClick={e => this.handleMenuClick(record, e)}
              mode="vertical"
              style={{ float: 'left', border: 'none', background: 'rgba(0, 0, 0, 0)' }}>
          <Menu.Item key="1" style={{ float: 'left', backgroundColor: 'rgba(0, 0, 0, 0)', color: 'rgba(0, 0, 0, 0.65)' }}>删除</Menu.Item>
        </Menu>
        {/*<Button style={{ marginLeft: 8 }}>*/}
          {/*操作 <Icon type="down" />*/}
        {/*</Button>*/}
      </div>),
  }];
  showFolder = () => {
    this.setState({
      folderModalVisible: true,
    });
  }
  render() {
    // const { list } = this.props.video;
    const folderOption = this.props.video.folders
      .map(folder => <Select.Option key={folder.id}>{folder.name}</Select.Option>);

    const mainSearch = (
      <div>
        {/* <Input.Search */}
        {/* placeholder="请输入视频文件名" */}
        {/* enterButton="搜索" */}
        {/* size="large" */}
        {/* onSearch={this.onClickSearch} */}
        {/* style={{ width: 360, float: 'left' }} */}
        {/* /> */}
        <div style={{ float: 'right' }}>
          <Select
            size="large"
            placeholder="选择一个素材组"
            defaultValue={this.props.video.currentFolder.name}
            style={{ width: 120, marginRight: 20 }}
            onChange={this.handleChange}
          >
            {folderOption}
          </Select>
          {/*<Button size="large" onClick={this.showFolder} style={{ marginRight: 20 }}> 修改分组 </Button>*/}
          <Button size="large" onClick={this.showModal}> 上传视频 </Button>
        </div>
      </div>
    );

    const modal = (
      <CollectionCreateForm
        title="添加视频文件"
        visible={this.state.modalVisible}
        onCreate={this.handleModalOk}
        onCancel={this.handleModalCancel}
        uploadProps={this.state.uploadProps}
        uploadChange={this.onUploadChange}
        beforeUpload={this.beforeUpload}
        okText="添加"
        {...this.state.data} /* 表单数据 */
        onChange={this.onFormDataChange}
      />
    );
    return (
      <div>
        <PageHeaderLayout
          title="视频文件"
          content={mainSearch}
          onTabChange={this.handleTabChange}
        >
          <Card border="false">
            <Table
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
        </PageHeaderLayout>
        {modal}
        <ModalForFolder that={this} visible={this.state.folderModalVisible} label="video" />
      </div>);
  }
}

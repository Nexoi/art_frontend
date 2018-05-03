/* eslint-disable no-param-reassign */
/**
 * Created by neo on 25/2/2018.
 */
import React, { PureComponent } from 'react';
import { Table, Input, Button, Card, message, Select, Dropdown, Icon, Menu, Modal, Form, Upload } from 'antd';
import { connect } from 'dva';
import { getTimeString, getSizeOfFile, domain_api } from '../../../utils/utils';


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
    /* 文件上传 */
    modalVisible: false,
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
      type: 'audio/initFolders',
    }).then(() => {
      // 确定加载模式，是否只列出该展览数据
      const { showId } = this.state;
      if (showId === undefined) {
        return;
      }
      const folders = this.props.audio.folders;
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

  /////////// uploader ///////////

  /* Modal 框 */
  showModal = () => {
    this.setState({
      // ...this.props.audio,
      modalVisible: true,
    });
  };
  /* Modal 框 */
  handleModalOk = () => {
    if (!this.state.uploadFileAvailable) {
      message.error('请上传正确的音频文件');
      return;
    }
    if (this.state.uploadProps.fileList.length !== 1) {
      message.error('请先上传音频文件');
      return;
    }
    const url = this.state.uploadProps.fileList[0].url;
    if (url === undefined || url.length < 2) {
      message.warn('请先上传音频文件');
      return;
    }
    const data = {
      folderId: this.props.audio.currentFolder.id,
      name: this.state.data.name,
      length: this.state.data.length || -1,
      size: this.state.uploadProps.fileList[0].size,
      url: this.state.uploadProps.fileList[0].url,
    };
    // request by data
    const that = this;
    this.props.dispatch({
      type: 'audio/addAudio',
      payload: data,
    }).then(() => {
      // 下面两行会执行吗？
      that.setState({
        modalVisible: false,
      });
      // message.info('添加成功！');
    });
  };
  /* Modal 框 */
  handleModalCancel = () => {
    this.setState({
      // ...this.props.audio,
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
    const isAUDIO = file.type.slice(0, 5) === 'audio';
    if (!isAUDIO) {
      message.error('请上传正确的音频文件');
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

  /* 表 */
  columns = [{
    title: '音频名称',
    dataIndex: 'name',
    key: 'name',
  }, {
  //   title: '时长',
  //   dataIndex: 'length',
  //   key: 'length',
  //   render: text => (<div> {`${text} 秒`} </div>),
  // }, {
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
    const modal = (
      <CollectionCreateForm
        title="添加音频文件"
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
        <Card border="false">
          <Button size="large" onClick={this.showModal} style={{ marginBottom: 20 }}> 上传音频 </Button>
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
        {modal}
      </div>);
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
          {/*<FormItem label="音频时长（单位：秒）">*/}
            {/*{getFieldDecorator('length', {*/}
              {/*rules: [{ required: true, message: '请输入声音长度！' }],*/}
            {/*})(<Input type="number" />)}*/}
          {/*</FormItem>*/}
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

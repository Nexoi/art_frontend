/* eslint-disable no-param-reassign */
/**
 * Created by neo on 25/2/2018.
 */
import React, { PureComponent } from 'react';
import { Input, Button, Card, message, Select, Checkbox, Icon, Pagination, Modal, Form, Upload, List } from 'antd';
import { connect } from 'dva';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import ModalForFolder from '../ModalForFolder';

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
    uploadProps, uploadChange, beforeUpload, defaultPictureName,
  } = props;
  const { getFieldDecorator } = form;
  // const inputProps = {
  //   addonAfter: (
  //     <Select defaultValue=".jpg" style={{ width: 80 }}>
  //       <Select.Option value=".png">.png</Select.Option>
  //       <Select.Option value=".jpg">.jpg</Select.Option>
  //       <Select.Option value=".jpeg">.jpeg</Select.Option>
  //       <Select.Option value=".bmp">.bmp</Select.Option>
  //       <Select.Option value=".gif">.gif</Select.Option>
  //     </Select>
  //   ),
  // };
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

/* 主界面 */
@connect(({ picture, loading }) => ({
  picture,
  loading: loading.effects['picture/initFolders'],
}))
export default class Picture extends PureComponent {
  state = {
    modalVisible: false,
    folderModalVisible: false,
    deleteBtnShow: 'disabled',
    selectedPictureIds: this.props.picture.selectedPictureIds,
    pagination: {
      total: 80,
      current: 2,
      pageSize: 3,
      showSizeChanger: true,
    },
    /* 文件上传 */
    uploadProps: {
      name: 'file',
      action: '//art.seeuio.com/api/admin/v1/upload',
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
    fileList = fileList.map((file) => {
      if (file.response) {
        // Component will show file.url as link
        file.url = file.response.data.url;
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
  /* Modal 框 */
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
    const data = {
      folderId: this.props.picture.currentFolder.id,
      name: this.state.data.name,
      // length: this.state.data.length,
      // size: this.state.uploadProps.fileList[0].size,
      url: this.state.uploadProps.fileList[0].url,
    };
    // request by data
    this.props.dispatch({
      type: 'picture/addImage',
      payload: data,
    });
    // 下面两行会执行吗？
    this.setState({
      // ...this.props.picture,
      modalVisible: false,
    });
    // message.info('添加成功！');
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
    // console.log('checked = ', checkedValues);
    // console.log(this.props.picture.selectedPictureIdsShouldClean)
    let checkedVs = checkedValues;
    if (this.props.picture.selectedPictureIdsShouldClean) {
      // clean it
      this.props.picture.selectedPictureIdsShouldClean =
        !this.props.picture.selectedPictureIdsShouldClean;
      checkedVs = [checkedValues[checkedValues.length - 1]];
    }
    // console.log('checked = ', checkedVs);
    if (checkedVs.length === 0) {
      this.setState({
        deleteBtnShow: 'disabled',
      });
      // this.props.picture.selectedPictureIds = [];
    } else {
      this.setState({
        deleteBtnShow: '',
      });
    }
    this.setState({
      selectedPictureIds: checkedVs,
    });
    // message.info(checkedVs);
  };
  /* 删除多条记录 */
  onClickDelete = () => {
    const ids = this.state.selectedPictureIds;
    // request
    let idStr = '';
    for (let i = 0; i < ids.length;) {
      if (i === ids.length - 1) {
        idStr += `${ids[i]}`;
      } else {
        idStr += `${ids[i]},`;
      }
      i += 1;
    }
    console.log(idStr);
    this.props.picture.selectedPictureIdsShouldClean = true;
    this.props.dispatch({
      type: 'picture/deleteImages',
      payload: {
        imageIds: idStr,
      },
    });
    this.setState({
      deleteBtnShow: 'disabled',
    });
    // message.info(`删除成功！共删除 ${ids.length} 张图片`);
  };

  showFolder = () => {
    this.setState({
      folderModalVisible: true,
    });
  }

  render() {
    // const { list } = this.props.picture;
    const folderOption = this.props.picture.folders
      .map(folder => <Select.Option key={folder.id}>{folder.name}</Select.Option>);

    const mainSearch = (
      <div>
        {/* <Input.Search */}
        {/* placeholder="请输入图片文件名" */}
        {/* enterButton="搜索" */}
        {/* size="large" */}
        {/* onSearch={this.onClickSearch} */}
        {/* style={{ width: 360, float: 'left' }} */}
        {/* /> */}
        <div style={{ float: 'right' }}>
          <Button
            size="large"
            type="danger"
            style={{ marginRight: 20 }}
            disabled={this.state.deleteBtnShow}
            onClick={this.onClickDelete}
          >
            删除选中图片
          </Button>
          <Select
            size="large"
            placeholder="选择一个素材组"
            defaultValue={this.props.picture.currentFolder.name || '-'}
            style={{ width: 120, marginRight: 20 }}
            onChange={this.handleChange}
          >
            {folderOption}
          </Select>
          <Button size="large" onClick={this.showFolder} style={{ marginRight: 20 }}> 修改分组 </Button>
          <Button size="large" onClick={this.showModal}> 上传图片 </Button>
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
        <PageHeaderLayout
          title="图片"
          content={mainSearch}
          onTabChange={this.handleTabChange}
        >
          <Card border="false">
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
                      style={{ width: 200, padding: 0 }}
                      cover={<img
                        alt="图片"
                        style={{ width: 198, height: 200 }}
                        src={item.url}
                      />}
                    >
                      <Checkbox value={item.id} style={{ margin: 0, display: 'inline-flex' }}>
                        {item.name.toString().length > 10 ? `${item.name.slice(0, 6)}...${item.name.slice(-4)}` : item.name}
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
        </PageHeaderLayout>
        {modal}
        <ModalForFolder that={this} visible={this.state.folderModalVisible} label="picture" />
      </div>);
  }
}

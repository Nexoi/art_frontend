import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Form, Input, DatePicker, Button, Card, message, Upload, Icon,
} from 'antd';
import moment from 'moment';
import { domain_api } from '../../utils/utils';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

@connect(({ loading }) => ({
  submitting: loading.effects['showmain/addShow'],
}))
@Form.create()
export default class ShowEditForm extends PureComponent {
  state = {
    // selectorModalVisible: false,
    sourceData: this.props.sourceData,
    uploadProps: {
      name: 'file',
      action: `${domain_api}/api/admin/v1/upload/image`,
      fileList: [],
    },
    uploadFileAvailable: false,
  }
  componentWillMount() {
    // this.setState({
    //   uploadProps: {
    //     ...this.state.uploadProps,
    //     fileList: [{
    //       url: this.props.sourceData.posterImage.url,
    //       thumbUrl: this.props.sourceData.posterImage.thumbUrl,
    //       width: this.props.sourceData.posterImage.width,
    //       height: this.props.sourceData.posterImage.height,
    //     }],
    //   },
    // });
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      console.log(values);
      if (!err) {
        let data = {};
        if (this.state.uploadFileAvailable) {
          console.warn('海报被修改') //
          data = {
            showId: this.state.sourceData.id,
            title: values.title,
            introduceText: values.introduceText,
            // posterImageId: this.state.selectedImage.id,
            startTime: values.date[0].format('YYYY-MM-DD'),
            endTime: values.date[1].format('YYYY-MM-DD'),
            imageHeight: this.state.uploadProps.fileList[0].height,
            imageWidth: this.state.uploadProps.fileList[0].width,
            imageUrl: this.state.uploadProps.fileList[0].url,
            imageThumbUrl: this.state.uploadProps.fileList[0].thumbUrl,
          }
        } else {
          data = {
            showId: this.state.sourceData.id,
            title: values.title,
            introduceText: values.introduceText,
            // posterImageId: this.state.selectedImage.id,
            startTime: values.date[0].format('YYYY-MM-DD'),
            endTime: values.date[1].format('YYYY-MM-DD'),
            imageHeight: this.props.sourceData.posterImage.height,
            imageWidth: this.props.sourceData.posterImage.width,
            imageUrl: this.props.sourceData.posterImage.url,
            imageThumbUrl: this.props.sourceData.posterImage.thumbUrl,
          }
        }
        this.props.dispatch({
          type: 'showmain/updateShow',
          payload: data,
        });
        this.props.onCloseModal(true);
      }
    });
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
        file.thumbUrl = file.response.data.thumbUrl;
        file.width = file.response.data.width;
        file.height = file.response.data.height;
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
  // openSelector = () => {
  //   this.setState({
  //     selectorModalVisible: true,
  //   });
  // }
  // closeSelector = () => {
  //   this.setState({
  //     selectorModalVisible: false,
  //   });
  // }
  // handlePictureSelected = (type, values) => {
  //   console.log(values);
  //   const data = values[0];
  //   this.setState({
  //     selectedImage: data,
  //   });
  //   this.state.selectedImage = data;
  //   this.closeSelector();
  // }
  render() {
    const { submitting } = this.props;
    const { getFieldDecorator, getFieldValue } = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };

    // const selector = (
    //   <MaterialSelecter
    //     visible={this.state.selectorModalVisible}
    //     handleSelected={this.handlePictureSelected}
    //     onCancel={this.closeSelector}
    //     isSingleSelect="true"
    //     availableType={['picture']}
    //   />);
    return (
      <div>
        <Card bordered={false}>
          <Form
            onSubmit={this.handleSubmit}
            hideRequiredMark
            style={{ marginTop: 8 }}
          >
            <FormItem
              {...formItemLayout}
              label="展览名称"
            >
              {getFieldDecorator('title', {
              rules: [{
                required: true, message: '请输入展览名称',
              }],
              initialValue: this.state.sourceData.title,
            })(
              <Input placeholder="展览名称" />
            )}
            </FormItem>
            {/*<FormItem*/}
              {/*{...formItemLayout}*/}
              {/*label="展厅名称"*/}
            {/*>*/}
              {/*{getFieldDecorator('showHallName', {*/}
                {/*rules: [{*/}
                  {/*required: true, message: '请输入展厅名称',*/}
                {/*}],*/}
                {/*initialValue: this.state.sourceData.showHallName,*/}
              {/*})(*/}
                {/*<Input placeholder="展厅名称" />*/}
              {/*)}*/}
            {/*</FormItem>*/}
            <FormItem
              {...formItemLayout}
              label="开展日期"
            >
              {getFieldDecorator('date', {
              rules: [{
                required: true, message: '请选择起止日期',
              }],
                initialValue: [moment(new Date(this.state.sourceData.startTime)),
                moment(new Date(this.state.sourceData.endTime))],
            })(
              <RangePicker style={{ width: '100%' }} placeholder={['开始日期', '结束日期']} />
            )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="海报"
            >
              {getFieldDecorator('file', {
              // rules: [{
              //   required: this.state.selectedImage.id === -1, message: '请选择展览海报',
              // }],
            })(
              <div>
                <Upload {...this.state.uploadProps} onChange={this.onUploadChange} beforeUpload={this.beforeUpload}>
                  <Button><Icon type="upload" /> 上传文件</Button>
                </Upload>
                {/*<Button onClick={this.openSelector}> 选择图片 </Button>*/}
                {this.state.uploadFileAvailable
                  ? this.state.uploadProps.fileList.length > 0 &&
                (<img alt="预览图片" style={{ width: 300 }} src={this.state.uploadProps.fileList[0].url} />)
                :(<img alt="预览图片" style={{ width: 300 }} src={this.state.sourceData.posterImage.url} />)
                }
              </div>
            )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="文字介绍"
            >
              {getFieldDecorator('introduceText', {
              rules: [{
                required: true, message: '请输入简要的文字介绍',
              }],
                initialValue: this.state.sourceData.introduceText,
            })(
              <TextArea style={{ minHeight: 32 }} placeholder="请输入简要的文字介绍" rows={4} />
            )}
            </FormItem>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit" loading={submitting}>
              确定
              </Button>
            </FormItem>
          </Form>
        </Card>
      </div>
    );
  }
}

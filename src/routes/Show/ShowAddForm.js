import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Form, Input, DatePicker, Button, Card, message,
} from 'antd';
import MaterialSelecter from '../Material/MaterialSelecter';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

@connect(({ loading }) => ({
  submitting: loading.effects['showmain/addShow'],
}))
@Form.create()
export default class ShowAddForm extends PureComponent {
  state = {
    selectorModalVisible: false,
    selectedImage: {
      id: -1,
      url: '',
    },
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      console.log(values);
      if (!err) {
        if (this.state.selectedImage.id === -1) {
          message.warn('请选择一张海报图片');
          return;
        }
        const data = {
          title: values.title,
          showHallName: values.showHallName,
          introduceText: values.introduceText,
          posterImageId: this.state.selectedImage.id,
          startTime: values.date[0].format('YYYY-MM-DD'),
          endTime: values.date[1].format('YYYY-MM-DD'),
        }
        this.props.dispatch({
          type: 'showmain/addShow',
          payload: data,
        });
        this.props.onCloseModal(true);
      }
    });
  }
  openSelector = () => {
    this.setState({
      selectorModalVisible: true,
    });
  }
  closeSelector = () => {
    this.setState({
      selectorModalVisible: false,
    });
  }
  handlePictureSelected = (type, values) => {
    console.log(values);
    const data = values[0];
    this.setState({
      selectedImage: data,
    });
    this.state.selectedImage = data;
    this.closeSelector();
  }
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

    const selector = (
      <MaterialSelecter
        visible={this.state.selectorModalVisible}
        handleSelected={this.handlePictureSelected}
        onCancel={this.closeSelector}
        isSingleSelect="true"
        availableType={['picture']}
      />);
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
              label="展馆"
            >
              {getFieldDecorator('showHallName', {
              rules: [{
                required: true, message: '请输入展馆名称',
              }],
            })(
              <Input placeholder="展馆名称" />
            )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="展览名称"
            >
              {getFieldDecorator('title', {
              rules: [{
                required: true, message: '请输入展览名称',
              }],
            })(
              <Input placeholder="展览名称" />
            )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="开展日期"
            >
              {getFieldDecorator('date', {
              rules: [{
                required: true, message: '请选择起止日期',
              }],
            })(
              <RangePicker style={{ width: '100%' }} placeholder={['开始日期', '结束日期']} />
            )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="海报"
            >
              {getFieldDecorator('picture', {
              // rules: [{
              //   required: this.state.selectedImage.id === -1, message: '请选择展览海报',
              // }],
            })(
              <div>
                <Button onClick={this.openSelector}> 选择图片 </Button>
                {this.state.selectedImage.url.length > 1 &&
                (<img alt="预览图片" style={{ width: 300 }} src={this.state.selectedImage.url} />)}
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
        {selector}
      </div>
    );
  }
}

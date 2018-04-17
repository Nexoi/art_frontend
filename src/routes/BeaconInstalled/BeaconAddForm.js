import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Form, Input, Button, Card, Modal, Radio, Icon, Tooltip, Switch, message, InputNumber,
} from 'antd';

const FormItem = Form.Item;

@connect(({ loading }) => ({
  submitting: loading.effects['installBeacon/addBeacon'],
}))
@Form.create()
export default class BeaconAddForm extends PureComponent {
  state = {
    // data: {
    //   uuid: '',
    //   majorValue: -1,
    //   minorValue: -1,
    // },
  }
  handleSubmit = (e) => {
    const that = this;
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log(values);
        // this.props.dispatch({
        //   type: 'beacon/addBeacon',
        //   payload: values,
        // });
        // f7826da6-4fa2-4e98-8024-bc5b71e0893e
        if (values.uuid === undefined || values.uuid.length !== 36) {
          message.warn('UUID 长度必须为 36 位（含分隔符）');
          return;
        }
        const reg = /^[A-Za-z0-9]{8}-[A-Za-z0-9]{4}-[A-Za-z0-9]{4}-[A-Za-z0-9]{4}-[A-Za-z0-9]{12}$/;
        if (!reg.exec(values.uuid)) {
          message.warn('UUID 格式错误，请检查后再输入');
          return;
        }
        if (values.majorValue < 0 || values.majorValue > 9999) {
          message.warn('MajorValue 必须在 0～9999 之间！');
          return;
        }
        if (values.minorValue < 0 || values.minorValue > 9999) {
          message.warn('MinorValue 必须在 0～9999 之间！');
          return;
        }
        const data = {
          uuid: values.uuid,
          majorValue: values.majorValue,
          minorValue: values.minorValue,
        };
        this.props.dispatch({
          type: 'installBeacon/addBeacon',
          payload: {
            ...data,
          },
        }).then(() => {
          const needReFlush = true;
          that.props.onCloseModal(needReFlush); // 关闭自己
        });
      }
    });
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
    return (
      <Card bordered={false}>
        <Form
          onSubmit={this.handleSubmit}
          hideRequiredMark
          style={{ marginTop: 8 }}
        >
          <FormItem
            {...formItemLayout}
            label="UUID"
          >
            {getFieldDecorator('uuid', {
              rules: [{
                required: true, message: '请输入UUID',
              }],
              pattern: /^[A-Za-z0-9]{8}-[A-Za-z0-9]{4}-[A-Za-z0-9]{4}-[A-Za-z0-9]{4}-[A-Za-z0-9]{12}$/,
            })(
              <Input placeholder="12345678-abcd-88cc-1111aaaa2222" />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="Major Value"
          >
            {getFieldDecorator('majorValue', {
              rules: [{
                required: true, message: '请输入 Major Value',
              }],
            })(
              <InputNumber placeholder="8000" />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="Minor Value"
          >
            {getFieldDecorator('minorValue', {
              rules: [{
                required: true, message: '请输入 Minor Value',
              }],
            })(
              <InputNumber placeholder="8000" />
            )}
          </FormItem>
          <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
            <Button type="primary" htmlType="submit" loading={submitting}>
              保存
            </Button>
          </FormItem>
        </Form>
      </Card>
    );
  }
}

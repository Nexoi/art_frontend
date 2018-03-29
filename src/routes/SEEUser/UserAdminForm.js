import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Form, Input, DatePicker, Select, Button, Card, InputNumber, Radio, Icon, Tooltip,
} from 'antd';

const FormItem = Form.Item;
const { Option } = Select;

@connect(({ loading }) => ({
  submitting: loading.effects['seeuadmin/addAdmin'],
}))
@Form.create()
export default class UserAdminForm extends PureComponent {
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        // if (this.props.type === undefined) {
        //   return;
        // }
        // if (this.props.type === 'add') {
        //
        // } else if (this.props.type === 'edit') {
        //
        // }
        const that = this;
        this.props.dispatch({
          type: 'seeuadmin/addAdmin',
          payload: values,
        }).then(() => {
          if (that.props.onCancel !== undefined) {
            that.props.onCancel();
          }
        });
      }
    });
  }
  render() {
    const { submitting, initValues } = this.props;
    const { getFieldDecorator, getFieldValue } = this.props.form;

    return (
      <Form
        onSubmit={this.handleSubmit}
        hideRequiredMark
        style={{ marginTop: 8 }}
      >
        <FormItem label="用户名">
          {getFieldDecorator('username', {
            rules: [{ required: true, message: '请输入用户名！' }],
            initialValue: initValues.username,
          })(<Input />)}
        </FormItem>
        <FormItem label="初始密码">
          {getFieldDecorator('password', {
            rules: [{ required: true, message: '请输入初始密码！' }],
            initialValue: initValues.password,
          })(<Input />)}
        </FormItem>
        <FormItem label="手机号码">
          {getFieldDecorator('phone', {
            rules: [{ required: true, message: '请输入手机号码！' }],
            initialValue: initValues.phone,
            pattern: !/^1[3|4|5|7|8][0-9]{9}$/,
          })(<Input />)}
        </FormItem>
        <FormItem label="性别">
          {getFieldDecorator('gender', {
            rules: [{ required: true, message: '请选择性别！' }],
            initialValue: initValues.gender,
          })
          (<Select>
            <Option value="male"> 男 </Option>
            <Option value="female"> 女 </Option>
          </Select>)
          }
        </FormItem>
        <FormItem>
          <Button style={{ float: 'right' }} type="primary" htmlType="submit" loading={submitting}>
            确定
          </Button>
        </FormItem>
      </Form>
    );
  }
}

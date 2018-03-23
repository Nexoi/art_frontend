import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Form, Input, DatePicker, Select, Button, Card, InputNumber, Radio, Icon, Tooltip, message,
} from 'antd';
import { routerRedux, Route, Switch } from 'dva/router';
import BraftEditor from 'braft-editor'
import 'braft-editor/dist/braft.css'
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import MaterialSelecter from '../Material/MaterialSelecter';

const FormItem = Form.Item;
const { TextArea } = Input;

@connect(({ resourceitem, loading }) => ({
  resourceitem,
  submitting: loading.effects['resourceitem/addWebPage'],
}))
@Form.create()
export default class WebEditor extends PureComponent {
  state = {
    groupId: this.props.match.url.slice(this.props.match.url.indexOf('/show-resources/') + 16, this.props.match.url.indexOf('/editor')),
    selectorVisible: false,
    selectedImageUrl: undefined,
    htmlContent: '',
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.resourceitem.webSaveSuccess === true) {
      nextProps.resourceitem.webSaveSuccess = false;
      this.props.dispatch(routerRedux.goBack());
    }
  }
  handleSubmit = (e) => {
    const { dispatch } = this.props;
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (this.state.selectedImageUrl === undefined || this.state.selectedImageUrl.length < 2){
          message.warn('请选择一张封面图片');
          return;
        }
        if (this.state.htmlContent === undefined || this.state.htmlContent.length < 15){
          message.warn('正文内容必须大于 15 字');
          return;
        }
        const data = {
          showId: -1,
          groupId: this.state.groupId,
          title: values.title,
          author: values.author,
          coverImageUrl: this.state.selectedImageUrl,
          introduce: values.introduce,
          contentHtml: this.state.htmlContent,
        }
        dispatch({
          type: 'resourceitem/addWebPage',
          payload: data,
        });
      }
    });
  }

  handleChange = (content) => {
    this.setState({
      htmlContent: content,
    });
    console.log(content)
  }

  handleRawChange = (rawContent) => {
    //...
  }

  openSelector = () => {
    this.setState({
      selectorVisible: true,
    });
  }
  closeSelectorModal = () => {
    this.setState({
      selectorVisible: false,
    });
  }
  handleSelected = (type, values) => {
    this.setState({
      selectedImageUrl: values[0].url,
    });
    this.closeSelectorModal();
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

    const editorProps = {
      height: 600,
      width: 600,
      contentFormat: 'html',
      initialContent: '<p>请在这里输入正文</p>',
      onChange: this.handleChange,
      onRawChange: this.handleRawChange
    }

    const content = (
      <Button
        onClick={this.handleSubmit}
        style={{ marginTop: -40, float: 'right', minWidth: 100 }}
        type="primary"
        htmlType="submit"
        loading={submitting}>
        保存
      </Button>
    );

    const selector = (
      <MaterialSelecter
        visible={this.state.selectorVisible}
        handleSelected={this.handleSelected}
        onCancel={this.closeSelectorModal}
        isSingleSelect="true"
        availableType={['picture']}
      />);

    return (
      <PageHeaderLayout title="网页编辑" content={content}>
        <Card border="false">
          <Form
            onSubmit={this.handleSubmit}
            hideRequiredMark
            style={{ marginTop: 8, minWidth: 600, float: 'left', padding: 0 }}
          >
            <FormItem
              {...formItemLayout}
              label="标题"
            >
              {getFieldDecorator('title', {
                rules: [{
                  required: true, message: '请输入标题',
                }],
              })(
                <Input style={{ width: 400 }} placeholder="请在这里输入文章标题" />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="作者"
            >
              {getFieldDecorator('author', {
                rules: [{
                  required: true, message: '请输入作者',
                }],
              })(
                <Input style={{ width: 400 }} placeholder="请输入作者" />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="摘要"
            >
              {getFieldDecorator('introduce', {
                rules: [{
                  required: true, message: '请输入摘要',
                }],
              })(
                <TextArea style={{ minHeight: 32, minWidth: 400 }} placeholder="请输入摘要（ 50 字左右）" rows={4} />
              )}
            </FormItem>
          </Form>
          <Card
            onClick={this.openSelector}
            style={{ float: 'right', overflow: 'hidden', cursor: 'pointer', maxHeight: 216, maxWidth: 200, margin: 12, marginRight: 48 }}
            cover={
              <div style={{ float: 'right', overflow: 'hidden', height: 216, width: 200, textAlign: 'center' }}>
                { this.state.selectedImageUrl === undefined || this.state.selectedImageUrl.length < 2
                  ? (<div style={{ marginTop: 80 }}><Icon type="plus" /> 添加封面 </div>)
                  : (<img style = {{ maxHeight: 400 }} src={this.state.selectedImageUrl} />)
                }
              </div>
            }
          />
        </Card>

        <Card border="false" style={{ marginTop: 24, textAlign: 'center' }}>
          <div className="demo" style={{ width: 660, margin: 'auto', border: '1px #eee solid' }}>
            <BraftEditor {...editorProps}/>
          </div>
        </Card>
        {this.state.selectorVisible ? selector : ''}
      </PageHeaderLayout>
    );
  }
}

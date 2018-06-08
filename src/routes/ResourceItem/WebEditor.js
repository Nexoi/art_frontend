import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Form, Input, DatePicker, Select, Button, Card, InputNumber, Radio, Icon, Tooltip, message,
} from 'antd';
import { routerRedux, Route, Switch } from 'dva/router';
import 'braft-editor/dist/braft.css'
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import MaterialSelecter from '../Material/MaterialSelecter';
import { domain_api } from '../../utils/utils';
import styles from './editor.less';
import Editor from './Editor'

const FormItem = Form.Item;
const { TextArea } = Input;

@connect(({ webpage, global, loading }) => ({
  webpage,
  global,
  submitting: loading.effects['webpage/addWebPage'],
}))
@Form.create()
export default class WebEditor extends PureComponent {
  state = {
    showId: this.props.match.url.slice(this.props.match.url.indexOf('/show/') + 6, this.props.match.url.indexOf('/editor')),
    groupId: this.props.match.url.slice(this.props.match.url.indexOf('/show-resources/') + 16, this.props.match.url.indexOf('/show/')),
    selectorVisible: false,
    selectedImageUrl: undefined,
    htmlContent: '<p>请在此输入正文</p>',
  }
  // componentWillReceiveProps(nextProps) {
  //   if (nextProps.webpage.webSaveSuccess === true) {
  //     nextProps.webpage.webSaveSuccess = false;
  //     this.props.dispatch(routerRedux.goBack());
  //   }
  // }

  componentWillMount() {
    const args = this.props.match.url.slice(this.props.match.url.indexOf('/editor') + 7);
    if ((args === undefined || args.indexOf('rebuild=false') === -1)) {
      // if (args !== '?rebuild=false') {
      const url = this.props.match.url.slice(0, this.props.match.url.indexOf('/editor'))
      // console.log(url);
      window.location.href= '/#' + url + '/editor?rebuild=false';
      // }
    }
    this.props.dispatch({
      type: 'global/changeCollapsed',
      payload: {
        collapsed: true,
      },
    });
  }
  componentDidMount() {
    this.props.dispatch({
      type: 'global/changeCollapsed',
      payload: {
        collapsed: true,
      },
    });
  }

  handleSubmit = (e) => {
    const { dispatch } = this.props;
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (this.state.selectedImageUrl === undefined || this.state.selectedImageUrl.length < 2) {
          message.warn('请选择一张封面图片');
          return;
        }
        var previewDiv = document.getElementById("preview");
        const content = previewDiv.innerHTML;
        if (content === undefined || content.length < 15){
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
          // contentHtml: this.state.htmlContent,
          contentHtml: content,
          link: values.link,
        }
        dispatch({
          type: 'webpage/addWebPage',
          payload: data,
        });
      }
    });
  }

  flushHtmlContent = (ref) => {
    if (ref != undefined)
      ref.setContent(this.state.htmlContent)
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

    const content = (
      <div>
        <Button
          onClick={this.handleSubmit}
          style={{ marginTop: -40, float: 'right', minWidth: 100 }}
          type="primary"
          htmlType="submit"
          loading={submitting}>
          保存
        </Button>
        <Button
          style={{ marginTop: -40, float: 'right', minWidth: 100, marginRight: 120 }}
          className="xphone"
          type="info">预览</Button>
      </div>
    );

    const selector = (
      <MaterialSelecter
        visible={this.state.selectorVisible}
        handleSelected={this.handleSelected}
        onCancel={this.closeSelectorModal}
        showId={this.state.showId}
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
              label="超链接"
            >
              {getFieldDecorator('link', {
                rules: [{
                  required: true, message: '请输入超链接：http://',
                }],
              })(
                <Input style={{ width: 400 }} placeholder="请输入超链接：http://" />
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
          <div className="demo" style={{ width: 1000, height: 800, margin: 'auto' }}>
            <Editor
              content={this.state.htmlContent}
              callback={this.flushHtmlContent}
            />
          </div>
        </Card>
        {this.state.selectorVisible ? selector : ''}
      </PageHeaderLayout>
    );
  }
}

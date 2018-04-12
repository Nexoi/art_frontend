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

@connect(({ webpage, loading }) => ({
  webpage,
  submitting: loading.effects['webpage/getWebPage'],
}))
@Form.create()
export default class WebEditor2Edit extends PureComponent {
  state = {
    itemId: this.props.match.url.slice(this.props.match.url.indexOf('/editor/') + 8),
    selectorVisible: false,
    selectedImageUrl: '',
    htmlContent: '',
    currentSourceData: {}, // resourceItemId, author, contentHtml, coverImageUrl, introduce, title
  }

  componentWillMount() {
    // console.log('component did mount')
    // console.log(`${this.state.itemId}`)
    // console.log(`${this.state.currentSourceData.resourceItemId}`)
    // console.log(`${this.props.webpage.currentWebPage.resourceItemId}`)
    // console.log('component did mount')
    // const itemId = this.props.match.url.slice(this.props.match.url.indexOf('/editor/') + 8);
    // if (parseInt(this.state.currentSourceData.resourceItemId) !== parseInt(this.state.itemId)) {
    //   console.log('updating!!!')
    //
    //   this.forceUpdate(this.flushPage);
    // }
    this.props.dispatch({
      type: 'webpage/getWebPage',
      payload: {
        itemId: this.state.itemId,
      },
    }).then(() => {
      console.log(this.props.webpage.currentWebPage)
      this.setState({
        selectedImageUrl: this.props.webpage.currentWebPage.coverImageUrl,
        htmlContent: this.props.webpage.currentWebPage.contentHtml,
        currentSourceData: this.props.webpage.currentWebPage,
      });
    });
    // this.setState({
    //   itemId: this.props.match.url.slice(this.props.match.url.indexOf('/editor/') + 8),
    //   selectedImageUrl: undefined,
    //   htmlContent: undefined,
    //   currentSourceData: {},
    // });
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
          itemId: this.state.itemId,
          title: values.title,
          author: values.author,
          coverImageUrl: this.state.selectedImageUrl,
          introduce: values.introduce,
          contentHtml: this.state.htmlContent,
        }
        dispatch({
          type: 'webpage/updateWebPage',
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
    const validateFn = (file) => {
      // console.log(file);
      const { type, size } = file;
      if (type.indexOf('image') !== -1) {
        if (size < 1024 * 2000) {
          return true;
        }
        message.warn('图片大小不可超过 2 M')
        return false;
      }
      if (type.indexOf('video') !== -1) {
        if (size < 1024 * 10000) {
          return true;
        }
        message.warn('视频大小不可超过 10 M')
        return false;
      }
      if (type.indexOf('audio') !== -1) {
        if (size < 1024 * 2000) {
          return true;
        }
        message.warn('音频大小不可超过 2 M')
        return false;
      }
      return false;
    }
    const uploadFn = (param) => {
      const serverURL = `${domain_api}/api/admin/v1/upload`
      const xhr = new XMLHttpRequest
      const fd = new FormData()

      // libraryId可用于通过mediaLibrary示例来操作对应的媒体内容
      console.log(param.libraryId)

      const successFn = (response) => {
        // 假设服务端直接返回文件上传后的地址
        // 上传成功后调用param.success并传入上传后的文件地址
        const rsp = JSON.parse(xhr.response);
        console.log(rsp.status);
        if (rsp.status === 200) {
          param.success({
            url: rsp.data.url,
          })
        } else {
          message.error('上传失败！');
        }
      }

      const progressFn = (event) => {
        // 上传进度发生变化时调用param.progress
        param.progress(event.loaded / event.total * 100)
      }

      const errorFn = (response) => {
        // 上传发生错误时调用param.error
        param.error({
          msg: '上传失败！'
        })
      }

      xhr.upload.addEventListener("progress", progressFn, false)
      xhr.addEventListener("load", successFn, false)
      xhr.addEventListener("error", errorFn, false)
      xhr.addEventListener("abort", errorFn, false)

      fd.append('file', param.file)
      xhr.open('POST', serverURL, true)
      xhr.send(fd)

    }

    const editorProps = {
      height: 600,
      width: 600,
      contentId: this.state.currentSourceData.resourceItemId,
      contentFormat: 'html',
      initialContent: this.state.currentSourceData.contentHtml || '请在这里输入正文',
      onChange: this.handleChange,
      onRawChange: this.handleRawChange,
      media: {
        allowPasteImage: true, // 是否允许直接粘贴剪贴板图片（例如QQ截图等）到编辑器
        image: true, // 开启图片插入功能
        video: true, // 开启视频插入功能
        audio: true, // 开启音频插入功能
        validateFn: validateFn, // 指定本地校验函数，说明见下文
        uploadFn: uploadFn, // 指定上传函数，说明见下文
        removeConfirmFn: null, // 指定删除前的确认函数，说明见下文
        onRemove: null, // 指定媒体库文件被删除时的回调，参数为被删除的媒体文件列表(数组)
        onChange: null, // 指定媒体库文件列表发生变化时的回调，参数为媒体库文件列表(数组)
        onInsert: null, // 指定从媒体库插入文件到编辑器时的回调，参数为被插入的媒体文件列表(数组)
        externalMedias: {
          image: true,
          audio: true,
          video: true,
        },
      },
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
                initialValue: this.state.currentSourceData.title || '',
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
                initialValue: this.state.currentSourceData.author || '',
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
                initialValue: this.state.currentSourceData.introduce || '',
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
                {this.state.selectedImageUrl === undefined
                || this.state.selectedImageUrl.length < 2
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

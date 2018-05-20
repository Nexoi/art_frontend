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
import { domain_api } from '../../utils/utils';
import styles from './editor.less';

const FormItem = Form.Item;
const { TextArea } = Input;

@connect(({ webpage, loading }) => ({
  webpage,
  submitting: loading.effects['webpage/addWebPage'],
}))
@Form.create()
export default class WebEditor extends PureComponent {
  state = {
    showId: this.props.match.url.slice(this.props.match.url.indexOf('/show/') + 6, this.props.match.url.indexOf('/editor')),
    groupId: this.props.match.url.slice(this.props.match.url.indexOf('/show-resources/') + 16, this.props.match.url.indexOf('/show/')),
    selectorVisible: false,
    selectedImageUrl: undefined,
    htmlContent: '',
  }
  // componentWillReceiveProps(nextProps) {
  //   if (nextProps.webpage.webSaveSuccess === true) {
  //     nextProps.webpage.webSaveSuccess = false;
  //     this.props.dispatch(routerRedux.goBack());
  //   }
  // }
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
          link: values.link,
        }
        dispatch({
          type: 'webpage/addWebPage',
          payload: data,
        });
      }
    });
  }

  handleChange = (content) => {
    this.setState({
      htmlContent: content,
    });
    // console.log(content)
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
      contentFormat: 'html',
      initialContent: `<p><div id="preview" style="height:350px; overflow-y:scroll;"><section style="border-color: rgb(89, 195, 249); color: rgb(255, 255, 255); margin: 10px 0px; padding: 35px; background-color: rgb(237, 61, 61);" class="wxqq-bg wxqq-border"><h2 class="135title" style="font-size: 24px; font-weight: bold; border-color: rgb(89, 195, 249); color: inherit;">关注我们宅官方微信，免费分享更多超值</h2><section class="unieditor" style="border: 1px dotted rgb(255, 68, 1); padding: 2px;"><p class="wxqq-borderTopColor wxqq-color" style="margin: 25px 0px 20px; font-weight: 100; font-size: 22px; max-width: 100%; white-space: normal; padding: 5px 0px 10px 7px; border-top: 2px solid rgb(158, 46, 46); font-family: 微软雅黑; line-height: 35px; color: rgb(158, 46, 46); background-image: url(&quot;http://v.unihi.cn/tuwen/aticletitBg.png&quot;); background-color: rgb(255, 255, 255); background-position: 0px 100%; background-repeat: repeat-x; word-wrap: break-word !important; box-sizing: border-box !important;">一、sssdw</p></section><p><br></p><h2 class="135title" style="font-size: 24px; font-weight: bold; border-color: rgb(89, 195, 249); color: inherit;">微信自媒体运营干货<br></h2><section class="135brush" style="border-color: rgb(89, 195, 249); color: inherit;"><section class="unieditor">
							<p><img width="100%" src="http://www.unihi.cn/mmbiz/gz/101.gif"></p>
							</section><p><br></p><section class="unieditor">
							<p><img width="100%" src="http://www.unihi.cn/mmbiz/gz/100.jpg"></p>
							</section><p><br></p><p style="text-align:center"><img src="http://img03.store.sogou.com/net/a/04/link?appid=100520031&amp;w=710&amp;url=https://mmbiz.qlogo.cn/mmbiz/iaXDmvibibwTLVXa2ZSt7UR2KFNXz1ephTSoQWNbxv7Mltba6n8jjMaHric2cc7qr15s91S8IiaHPtskTuibN5JFMGXQ/0?wx_fmt=jpeg"><br></p><p style="border-color: rgb(89, 195, 249); color: inherit; line-height: 1.75em;"><span style="font-size: 16px;">PS：扫描以上二维码，并进行关注，回复“我们宅”，有您意想不到的惊喜哦，欢迎大家进入实用。谢谢！</span></p><p style="border-color: rgb(89, 195, 249); color: inherit; line-height: 1.75em;"><span style="font-size: 16px;">TO：我们宅微信编辑器已经更新至2015-11-28【新】</span></p><p style="border-color: rgb(89, 195, 249); color: inherit; line-height: 1.75em;"><span style="font-size: 16px;"><br></span></p><p style="border-color: rgb(89, 195, 249); color: inherit; line-height: 1.75em; text-align: center;"><span style="font-size: 18px;"><strong>我们宅微信编辑器，免费微信编辑第一平台。</strong></span></p></section></section><div><a style="font-size:12px;color:#607fa6" href="http://weixin.sogou.com/gzh?openid=oIWsFt8725gXE_NmUXhnm11I9jJM" target="_blank" id="post-user">阅读原文</a> <em style="color:#8c8c8c;font-style:normal;font-size:12px;">阅读 100000+</em><span class="fr"><a style="font-size:12px;color:#607fa6" href="http://wpa.qq.com/msgrd?v=3&amp;uin=276116565&amp;site=qq&amp;menu=yes" target="_blank">我要举报</a></span></div></div></p>`,
      onChange: this.handleChange,
      onRawChange: this.handleRawChange,
      onHTMLChange: this.handleHtmlChange,
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
      // extendControls: [{
      //   type: 'button',
      //   text: 'Hello',
      //   html: '<span style="color: #6a6f7b; margin: 0 6px;">一键居中</span>',
      //   hoverTitle: 'Hello World!',
      //   className: 'preview-button',
      //   onClick: () => console.log('Hello World!')
      // }],
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
          <div className="demo" style={{ width: 660, margin: 'auto', border: '1px #eee solid' }}>
            <BraftEditor {...editorProps}/>
          </div>
        </Card>
        {this.state.selectorVisible ? selector : ''}
      </PageHeaderLayout>
    );
  }
}

/**
 * Created by neo on 18/3/2018.
 */

import React, { PureComponent } from 'react';
import { routerRedux, Route, Switch } from 'dva/router';
import { Card, Table, Modal, message, List, Input, Dropdown, Menu, Button, Icon } from 'antd';
import { connect } from 'dva';
import QRCode from 'qrcode-react';
import domtoimage from 'dom-to-image';
import JSZip from 'jszip';
import FileSaver from 'file-saver';
import { getTimeString } from '../../utils/utils';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import MaterialSelecter from '../Material/MaterialSelecter';
import EditableCell from '../Material/EditableCell';

/* 主界面 */
@connect(({ resourceitem, loading }) => ({
  resourceitem,
  loading: loading.effects['resourceitem/listItems'],
}))
export default class ResourceItem extends PureComponent {
  state = {
    showId: this.props.match.url.slice(this.props.match.url.indexOf('/show/') + 6, this.props.match.url.indexOf('/items')),
    groupId: this.props.match.url.slice(this.props.match.url.indexOf('/show-resources/') + 16, this.props.match.url.indexOf('/show/')),
    groupName: this.props.match.url.slice(this.props.match.url.indexOf('/items/') + 7),
    selectorVisible: false,
    selectorType: [],
    qrcodeModalVisible: false,
    currentSelectedTitle: '',
    currentSelectedUrl: '',
    downloadAllButtonVisible: false,
    selectedRows: [],
  }
  componentWillMount() {
    this.props.dispatch({
      type: 'resourceitem/listItems',
      payload: {
        showId: -1,
        groupId: this.state.groupId,
      },
    });
  }
  handleMenuClick = (record, e) => {
    if (e.key === '1') {
      console.log(record.url)
      this.setState({
        qrcodeModalVisible: true,
        currentSelectedTitle: `${record.name}`,
        currentSelectedUrl: `${record.url}`,
      })
    }
    if (e.key === '2') {
      this.props.dispatch(routerRedux.push(`editor/${record.id}`));
      console.log('-=-==-=-=-=-=-=-=')
      this.props.dispatch({
        type: 'resourceitem/getWebPage',
        payload: {
          itemId: record.id,
        },
      });
    }
    if (e.key === '3') {
      const that = this;
      Modal.confirm({
        title: '确定要删除该资源吗？',
        cancelText: '取消',
        okText: '确定',
        onOk() {
          that.deleteItem(record.id);
        },
      });
    }
  }
  deleteItem = (itemId) => {
    this.props.dispatch({
      type: 'resourceitem/deleteItem',
      payload: {
        showId: -1,
        groupId: this.state.groupId,
        itemId,
      },
    });
  }
  handleAddItemClick = (e) => {
    const { key } = e;
    if (key === '4') {
      // 打开网页编辑器页面
      return;
    }
    const type = key === '1' ? 'audio' : key === '2' ? 'video' : key === '3' ? 'picture' : '';
    if (type.length > 1) {
      this.openSelectorModal(type);
    }
  }
  openSelectorModal = (type) => {
    this.setState({
      selectorVisible: true,
      selectorType: [type],
    });
  }
  closeSelectorModal = () => {
    this.setState({
      selectorVisible: false,
    });
  }
  handleSelected = (type, values) => {
    const { id } = values[0];
    const data = {
      showId: -1,
      groupId: this.state.groupId,
    };
    if (type === 'audio') {
      this.props.dispatch({
        type: 'resourceitem/addAudio',
        payload: {
          ...data,
          audioId: id,
        },
      });
    }
    if (type === 'video') {
      this.props.dispatch({
        type: 'resourceitem/addVideo',
        payload: {
          ...data,
          videoId: id,
        },
      });
    }
    if (type === 'picture') {
      this.props.dispatch({
        type: 'resourceitem/addImage',
        payload: {
          ...data,
          imageId: id,
        },
      });
    }
    this.closeSelectorModal();
  }
  onItemEditableUpdate = (id, value) => {
    this.props.dispatch({
      type: 'resourceitem/changeName',
      payload: {
        showId: -1,
        groupId: this.state.groupId,
        itemId: id,
        name: value,
      },
    });
  }
  //--------------------------------------//
  closeQRCodeModal = () => {
    this.setState({
      qrcodeModalVisible: false,
    });
  }
// 点击下载一张图
  downloadQRCode = () => {
    const that = this;
    let qrDiv = document.getElementById('qrcode');
    let qrSpan = document.getElementById('qrcode_text');
    let marginTop = qrSpan.offsetHeight > 79 ? 120 : 140;
    qrSpan.style = `position: absolute;
                    background-color: white;
                    margin-top: ${marginTop}px;
                    left: 136px;
                    width: 200px;
                    min-height: 40px;
                    line-height: 40px;
                    font-size: 26px;`; // xx border: solid;
    domtoimage.toJpeg(qrDiv, { quality: 0.95 })
      .then(function (dataUrl) {
        var link = document.createElement('a');
        link.download = `${that.state.currentSelectedTitle}.jpeg`;
        link.href = dataUrl;
        link.click();
        qrSpan.style = `position: absolute;
                        background-color: white;
                        ${qrSpan.offsetHeight > 79 ? 'margin-top: 160px' : 'margin-top: 170px'};
                        left: 164px;
                        width: 200px;
                        min-height: 40px;
                        line-height: 40px;
                        font-size: 26px;`; // xx border: solid;
      });
  }
  // 点击下载选中的所有列表
  downloadAllQRCode = () => {
    // 设为可见
    let container = document.getElementById('qrcode_container');
    container.style = `position: absolute;`; // 可见
    // 开始准备下载
    const that = this;
    const { selectedRows } = this.state;
    const images = [];
    for (let i = 0; i < selectedRows.length; i += 1) {
      let qrDiv = document.getElementById(`qrcodeDownload${selectedRows[i].id}`);
      let qrSpan = document.getElementById(`qrcodeDownload${selectedRows[i].id}_text`);
      let marginTop = qrSpan.offsetHeight > 79 ? 140 : 160;
      qrSpan.style = `position: absolute;
                      background-color: white;
                      margin-top: ${marginTop}px;
                      left: 136px;
                      width: 200px;
                      min-height: 40px;
                      line-height: 40px;
                      font-size: 26px;`; // xx border: solid;
      console.log('---exchange...---')
      domtoimage.toBlob(qrDiv)
        .then(function (blob) {
          images.push({
            name: `${selectedRows[i].name}_${selectedRows[i].id}.jpeg`,
            data: blob,
          });
          // 判断是否可以下载了
          if (images.length === selectedRows.length) {
            // 下载
            console.log('downloading ... ')
            var zip = new JSZip();
            // zip.file("Hello.txt", "Hello World\n");
            for (let i = 0; i < images.length; i += 1) {
              // var img = zip.folder("qrcode_images");
              zip.file(images[i].name, images[i].data, {base64: true});
            }
            zip.generateAsync({type: "blob"})
              .then(function (content) {
                // see FileSaver.js
                FileSaver.saveAs(content, "qrcode_网页二维码.zip");
              });
            that.setState({
              selectedRows: [],
              downloadAllButtonVisible: false,
            });
            container.style = `visibility: hidden; position: absolute;`; // 不可见
          }
        });
    }
  }
  columns = [{
    title: '资源名称',
    dataIndex: 'name',
    key: 'name',
    render: (text, record) => (
      <EditableCell
        id={record.id}
        value={text}
        onChange={this.onItemEditableUpdate}
      />),
  }, {
    title: '类型',
    dataIndex: 'type',
    key: 'type',
    render: text => (
      <Button size="small" type="primary">
        {text === 'AUDIO' ? '音频' : text === 'VIDEO' ? '视频' : text === 'PICTURE' ? '图片' : text === 'WEB' ? '网页' : '未知'}
      </Button>),
  }, {
    title: '资源地址',
    dataIndex: 'url',
    key: 'url',
    render: text => (<a target="blank" href={text}> {text} </a>),
  }, {
    title: '浏览量',
    dataIndex: 'viewTimes',
    key: 'viewTimes',
  }, {
    title: '点赞数',
    dataIndex: 'likeTimes',
    key: 'likeTimes',
  }, {
    title: '更新时间',
    dataIndex: 'updateTime',
    key: 'updateTime',
    render: text => (<div> {getTimeString(text)} </div>),
  }, {
    title: '操作',
    key: 'operation',
    render: (text, record) => (
      <div>
        <Menu onClick={e => this.handleMenuClick(record, e)}
              mode="vertical"
              style={{ float: 'left', border: 'none', background: 'rgba(0, 0, 0, 0)' }}>
          { record.type === 'WEB' && (<Menu.Item key="1" style={{ float: 'left', backgroundColor: 'rgba(0, 0, 0, 0)', color: 'rgba(0, 0, 0, 0.65)' }}>查看二维码</Menu.Item>)}
          { record.type === 'WEB' && (<Menu.Item key="2" style={{ float: 'left', backgroundColor: 'rgba(0, 0, 0, 0)', color: 'rgba(0, 0, 0, 0.65)' }}>编辑</Menu.Item>)}
          <Menu.Item key="3" style={{ float: 'left', backgroundColor: 'rgba(0, 0, 0, 0)', color: 'rgba(0, 0, 0, 0.65)' }}>删除</Menu.Item>
        </Menu>
        {/*<Button style={{ marginLeft: 8 }}>*/}
          {/*操作 <Icon type="down" />*/}
        {/*</Button>*/}
      </div>),
  }];
  render() {
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        if (selectedRows.length !== 0) {
          this.setState({
            downloadAllButtonVisible: true,
            selectedRows,
          });
        } else {
          this.setState({
            downloadAllButtonVisible: false,
            selectedRows,
          });
        }
      },
      getCheckboxProps: record => ({
        disabled: record.type !== 'WEB', // Column configuration not to be checked
        name: record.name,
      }),
    };
    const modalQRCode = (
      <Modal
        style={{ width: 800 }}
        visible={this.state.qrcodeModalVisible}
        onCancel={this.closeQRCodeModal}
        onOk={this.downloadQRCode}
        okText="下载二维码"
      >
        <div id="qrcode" style={{ padding: 36, textAlign: 'center', backgroundColor: 'white' }}>
          <span id="qrcode_text" style={{
            position: 'absolute',
            backgroundColor: 'white',
            marginTop: 170,
            left: 164,
            width: 200,
            minHeight: 40,
            lineHeight: '40px',
            fontSize: '26px',
            // border: 'double',
          }}>{this.state.currentSelectedTitle}</span>
          <QRCode
            style={{ margin: 'auto 0' }}
            size={400}
            value={this.state.currentSelectedUrl}
            level={'H'}
          />
        </div>
      </Modal>
    );
    // div 不能设为 display: 'none'，否则输出图片为空白
    const hiddenDiv = (
      <div style={{ height: 0, width: 0 }}>
        <div id="qrcode_container" style={{ visibility: 'hidden', position: 'absolute' }}>
          {this.state.selectedRows.map(item => {
            return (
              <div id={`qrcodeDownload${item.id}`} style={{ padding: 36, textAlign: 'center', backgroundColor: 'white' }}>
              <span id={`qrcodeDownload${item.id}_text`} style={{
                position: 'absolute',
                backgroundColor: 'white',
                marginTop: 170,
                left: 136,
                width: 200,
                minHeight: 40,
                lineHeight: '40px',
                fontSize: '26px',
                border: 'solid',
              }}>
                {item.name}
              </span>
                <QRCode
                  style={{ margin: 'auto 0' }}
                  size={400}
                  value={`${item.url}`}
                  level={'H'}
                />
              </div>
            );
          })}
        </div>
      </div>
    );
    const downloadAllButton = (
      <div style={{ marginBottom: 60 }}>
        <Button size="large" type="primary" style={{ float: 'right' }} onClick={this.downloadAllQRCode}> 下载选中的二维码 </Button>
      </div>
    );
    const mainSearch = (
      <div>
        <div style={{ float: 'right' }}>
          <Dropdown overlay={
            <Menu onClick={e => this.handleAddItemClick(e)}>
              <Menu.Item key="1">添加音频</Menu.Item>
              <Menu.Item key="2">添加视频</Menu.Item>
              <Menu.Item key="3">添加图片</Menu.Item>
              <Menu.Item key="4"><a href={`#/show-resources/${this.state.groupId}/editor`}>添加网页</a></Menu.Item>
            </Menu>}
          >
            <Button size="large" onClick={this.openAddResourceItem}> 添加资源 <Icon type="down" /></Button>
          </Dropdown>
        </div>
      </div>
    );

    const selector = (
      <MaterialSelecter
        visible={this.state.selectorVisible}
        handleSelected={this.handleSelected}
        onCancel={this.closeSelectorModal}
        isSingleSelect="true"
        showId={this.state.showId}
        availableType={this.state.selectorType}
      />);
    return (
      <div>
        <PageHeaderLayout
          title={`资源「${this.state.groupName}」详情列表`}
          content={mainSearch}
        >
          <Card border="false">
            {this.state.downloadAllButtonVisible ? downloadAllButton : ''}
            <Table
              rowSelection={rowSelection}
              rowKey="id"
              columns={this.columns}
              dataSource={this.props.resourceitem.list}
              pagination={{
              }}
            />
          </Card>
        </PageHeaderLayout>
        {this.state.selectorVisible ? selector : ''}
        {this.state.qrcodeModalVisible ? modalQRCode : ''}
        {hiddenDiv}
      </div>);
  }
}

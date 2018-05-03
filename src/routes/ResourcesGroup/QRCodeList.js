/**
 * Created by neo on 17/3/2018.
 */
import React, { PureComponent } from 'react';
import { Card, Table, Modal, message, List, Input, Dropdown, Menu, Button, Icon } from 'antd';
import { connect } from 'dva';
import QRCode from 'qrcode-react';
import domtoimage from 'dom-to-image';
import JSZip from 'jszip';
import FileSaver from 'file-saver';
import { getTimeString, domain_api } from '../../utils/utils';
import QrcodeResGroupSelector from './QrcodeResGroupSelector';
import QrcodeWebItemSelector from './QrcodeWebItemSelector';

/* 主界面 */
@connect(({ resourcesgroup, loading }) => ({
  resourcesgroup,
  loading: loading.effects['resourcesgroup/listGroupByQRCode'],
}))
export default class QRCodeList extends PureComponent {
  state = {
    showId: this.props.match.url.slice(this.props.match.url.indexOf('/shows/') + 7, this.props.match.url.indexOf('/qrcode')),
    qrcodeModalVisible: false,
    currentSelectedTitle: '',
    currentSelectedUrl: '',
    downloadAllButtonVisible: false,
    selectedRows: [],
    exportQrcodeSwitchModalVisible: false,
    exportQrcodeResGroupModalVisible: false,
    exportQrcodeWebItemModalVisible: false,
  }
  componentWillMount() {
    this.props.dispatch({
      type: 'resourcesgroup/listGroupByQRCode',
      payload: {
        showId: this.state.showId,
        page: 0,
        size: 10,
      },
    });
  }
  handleMenuClick = (record, e) => {
    if (e.key === '1') {
      // 打开二维码 modal
      console.log(`${domain_api}/api/v1/show/${record.showId}/resources/${record.id}?type=QRCODE`)
      this.setState({
        qrcodeModalVisible: true,
        currentSelectedTitle: `${record.name}`,
        currentSelectedUrl: `${domain_api}/api/v1/show/${record.showId}/resources/${record.id}?type=QRCODE`,
      })
    }
  }
  /* 分页数据改变 */
  onSizeChange = (current, pageSize) => {
    this.props.dispatch({
      type: 'resourcesgroup/listGroupByQRCode',
      payload: {
        page: current - 1,
        size: pageSize,
        showId: this.state.showId,
      },
    });
  }
  onPageChange = (page, pageSize) => {
    this.props.dispatch({
      type: 'resourcesgroup/listGroupByQRCode',
      payload: {
        page: page - 1,
        size: pageSize,
        showId: this.state.showId,
      },
    });
  }
  closeQRCodeModal = () => {
    this.setState({
      qrcodeModalVisible: false,
    });
  }
  //
  // 导出二维码选择框（两种二维码选择按钮）
  openExportQRCodeSwitchModal = () => {
    this.setState({
      exportQrcodeSwitchModalVisible: true,
    });
  }
  closeExportQRCodeSwitchModal = () => {
    this.setState({
      exportQrcodeSwitchModalVisible: false,
    });
  }
  openExportQRCodeResGroupModal = () => {
    this.setState({
      exportQrcodeResGroupModalVisible: true,
    });
  }
  closeExportQRCodeResGroupModal = () => {
    this.setState({
      exportQrcodeResGroupModalVisible: false,
    });
  }
  openExportQRCodeWebItemModal = () => {
    this.setState({
      exportQrcodeWebItemModalVisible: true,
    });
  }
  closeExportQRCodeWebItemModal = () => {
    this.setState({
      exportQrcodeWebItemModalVisible: false,
    });
  }
  //...

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
                    font-size: 26px;`; // xx border: double;
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
                        font-size: 26px;`; // xx border: double;
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
    if (selectedRows.length === 0) {
      message.warn('请至少选择一张二维码进行下载');
      return;
    }
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
                      font-size: 26px;`; // xx border: double;
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
                FileSaver.saveAs(content, "qrcode_资源二维码.zip");
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
    title: '资源组名称',
    dataIndex: 'name',
    key: 'name',
    render: (text, record) => (<a href={`#/show-resources/${record.id}/show/${this.state.showId}/items/${record.name}`}> {text} </a>),
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
          <Menu.Item key="1" style={{ float: 'left', backgroundColor: 'rgba(0, 0, 0, 0)', color: 'rgba(0, 0, 0, 0.65)' }}>查看二维码</Menu.Item>
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
      // getCheckboxProps: record => ({
      //   disabled: record.name === 'Disabled User', // Column configuration not to be checked
      //   name: record.name,
      // }),
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
                // border: 'double',
              }}>
                {item.name}
              </span>
                <QRCode
                  style={{ margin: 'auto 0' }}
                  size={400}
                  value={`${domain_api}/api/v1/show/${item.showId}/resources/${item.id}?type=QRCODE`}
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
        {/*<Button size="large" type="primary" style={{ float: 'right' }} onClick={this.downloadAllQRCode}> 下载选中的二维码 </Button>*/}
        <Button size="large" type="primary" style={{ float: 'right' }} onClick={this.openExportQRCodeSwitchModal}> 导出二维码 </Button>
      </div>
    );
    const exportSwatchModal = (
      <Modal
        style={{ width: 1000 }}
        title="选择二维码类型"
        visible={this.state.exportQrcodeSwitchModalVisible}
        onCancel={this.closeExportQRCodeSwitchModal}
        footer={null}
      >
        <div style={{ textAlign: 'center' }}>
          <Button size="large" type="primary" style={{ margin: 20 }} onClick={this.openExportQRCodeResGroupModal}>资源二维码</Button>
          <Button size="large" type="primary" style={{ margin: 20 }} onClick={this.openExportQRCodeWebItemModal}>网页二维码</Button>
        </div>
      </Modal>);
    const qrCode_ResGroupModal = (
      <Modal
        style={{ width: 1000 }}
        title="资源二维码"
        visible={this.state.exportQrcodeResGroupModalVisible}
        onCancel={this.closeExportQRCodeResGroupModal}
        footer={null}
      >
        <QrcodeResGroupSelector
          style={{ width: 1000 }}
          showId={this.state.showId}
        />
      </Modal>
    );
    const qrCode_WebItempModal = (
      <Modal
        style={{ width: 1000 }}
        title="网页二维码"
        visible={this.state.exportQrcodeWebItemModalVisible}
        onCancel={this.closeExportQRCodeWebItemModal}
        footer={null}
      >
        <QrcodeWebItemSelector
          style={{ width: 1000 }}
          showId={this.state.showId}
        />
      </Modal>
    );
    return (
      <div>
        <Card border="false">
          {/*{this.state.downloadAllButtonVisible ? downloadAllButton : ''}*/}
          {downloadAllButton}
          <Table
            // rowSelection={rowSelection}
            rowKey="id"
            columns={this.columns}
            dataSource={this.props.resourcesgroup.list}
            pagination={{
              ...this.props.resourcesgroup.pagination,
              onShowSizeChange: this.onSizeChange,
              onChange: this.onPageChange,
            }}
          />
        </Card>
        {this.state.qrcodeModalVisible ? modalQRCode : ''}
        {hiddenDiv}
        {exportSwatchModal}
        {this.state.exportQrcodeResGroupModalVisible ? qrCode_ResGroupModal : ''}
        {this.state.exportQrcodeWebItemModalVisible ? qrCode_WebItempModal : ''}
      </div>);
  }
}

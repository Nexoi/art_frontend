/**
 * Created by neo on 12/3/2018.
 */

import React, { PureComponent } from 'react';
import { Card, Table, Button, Modal, message } from 'antd';
import { connect } from 'dva';
import { getTimeString, domain_api } from '../../utils/utils';

/* 主界面 */
@connect(({ resourcesgroup, loading }) => ({
  resourcesgroup,
  loading: loading.effects['resourcesgroup/listAllWebItems'],
}))
export default class QrcodeWebItemSelector extends PureComponent {
  state = {
    showId: this.props.showId,
    currentSelectedId: -1,
    currentSelectedTitle: '',
    previewModalVisible: false,
    selectedRows: [],
  }
  componentWillMount() {
    this.props.dispatch({
      type: 'resourcesgroup/listAllWebItems',
      payload: {
        showId: this.state.showId,
      },
    });
    console.log(this.props);
  }
  onSelect = (record, e) => {
    const { id, name } = record;
    this.setState({
      currentSelectedId: id,
      currentSelectedTitle: name,
    });
    this.openPreviewModal();
  }
  openPreviewModal = () => {
    this.setState({
      previewModalVisible: true,
    });
  }
  closePreviewModal = () => {
    this.setState({
      previewModalVisible: false,
    });
  }
  downloadZip = () => {
    const { selectedRows } = this.state;
    // ids:
    if (selectedRows.length === 0) {
      message.warn('请至少选择一个二维码进行下载');
      return;
    }
    let ids = '';
    for (let i = 0; i < selectedRows.length; i += 1) {
      ids += i == selectedRows.length - 1 ? `${selectedRows[i].id}` : `${selectedRows[i].id},`;
    }
    // click:
    var a = document.createElement('a');
    a.href = `${domain_api}/api/admin/v1/qrcode/webitems?itemIds=${ids}`;
    a.target = '_blank';
    a.click();
  }
  columns = [{
    title: '网页名称',
    dataIndex: 'name',
    key: 'name',
  }, {
    title: '地址',
    dataIndex: 'url',
    key: 'url',
    render: text => (<a target="_blank" href={text}> {text} </a>),
  }, {
    title: '更新时间',
    dataIndex: 'updateTime',
    key: 'updateTime',
    render: text => (<div> {getTimeString(text)} </div>),
  }, {
    title: '操作',
    key: 'operation',
    render: (text, record) => (
      <Button style={{ marginLeft: 8 }} onClick={e => this.onSelect(record, e)}>
        查看二维码
      </Button>
    ),
  }];
  render() {
    const previewQrCodeModal = (
      <Modal
        style={{ width: 800 }}
        title={this.state.currentSelectedTitle}
        visible={this.state.previewModalVisible}
        onCancel={this.closePreviewModal}
        footer={null}
      >
        <img style={{ height: '100%', width: '100%' }} src={`${domain_api}/api/admin/v1/qrcode/webitems/${this.state.currentSelectedId}`}/>
      </Modal>
    );
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        if (selectedRows.length !== 0) {
          this.setState({
            selectedRows,
          });
        } else {
          this.setState({
            selectedRows,
          });
        }
      },
    };
    return (
      <div>
        <Card border="false">
          <Button type="primary" style={{ marginBottom: 20 }} onClick={this.downloadZip}>下载</Button>
          <Table
            rowKey="id"
            rowSelection={rowSelection}
            columns={this.columns}
            dataSource={this.props.resourcesgroup.webList}
          />
        </Card>
        {this.state.previewModalVisible ? previewQrCodeModal : ''}
      </div>
    );
  }
}



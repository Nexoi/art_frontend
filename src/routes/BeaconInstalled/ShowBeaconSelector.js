/**
 * Created by neo on 6/4/2018.
 */
import React, { PureComponent } from 'react';
import { Form, Card, Table, Modal, message, InputNumber, Input, Dropdown, Menu, Button, Icon } from 'antd';
import { connect } from 'dva';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { getTimeString } from '../../utils/utils';
import MaterialSelecter from '../Material/MaterialSelecter';
import { transNum2ZhongWen } from '../../utils/utils';

@connect(({ installBeacon2Show, loading }) => ({
  installBeacon2Show,
  loading: loading.effects['installBeacon2Show/fetchListReverse'],
}))
export default class ShowBeaconSelector extends PureComponent {
  state = {
    showId: this.props.showId,
    selectedRows: [],
  }
  componentWillMount() {
    this.props.dispatch({
      type: 'installBeacon2Show/fetchListReverse',
      payload: {
        showId: this.state.showId,
        page: 0,
        size: 10,
      },
    });
  }
  onOkAppend = () => {
    if (this.state.selectedRows.length === 0) {
      message.warn('请选择至少一个 Beacon 再进行添加！');
      return;
    }
    let beaconIds = '';
    const { selectedRows } = this.state;
    for (let i = 0; i < selectedRows.length; i += 1) {
      beaconIds += i == selectedRows.length - 1 ? `${selectedRows[i].id}` :`${selectedRows[i].id},`;
    }
    this.props.dispatch({
      type: 'installBeacon2Show/appendInShow',
      payload: {
        showId: this.state.showId,
        beaconIds,
      },
    }).then(() => {
      if (this.props.closeAppendBox !== undefined) {
        this.props.closeAppendBox(true);
      }
    });
  }
  onCancel = () => {
    if (this.props.closeAppendBox !== undefined) {
      this.props.closeAppendBox(false);
    }
  }
  onSizeChange = (current, pageSize) => {
    this.props.dispatch({
      type: 'installBeacon2Show/fetchListReverse',
      payload: {
        showId: this.state.showId,
        page: current - 1,
        size: pageSize,
      },
    });
  }
  onPageChange = (page, pageSize) => {
    this.props.dispatch({
      type: 'installBeacon2Show/fetchListReverse',
      payload: {
        showId: this.state.showId,
        page: page - 1,
        size: pageSize,
      },
    });
  }
  columns = [{
    title: 'UUID',
    dataIndex: 'uuid',
    key: 'uuid',
  }, {
    title: 'MajorValue',
    dataIndex: 'majorValue',
    key: 'majorValue',
  }, {
    title: 'MinorValue',
    dataIndex: 'minorValue',
    key: 'minorValue',
  }];
  render() {
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
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
      // getCheckboxProps: record => ({
      //   disabled: record.name === 'Disabled User', // Column configuration not to be checked
      //   name: record.name,
      // }),
    };
    return (
      <div>
        <Modal
          title="添加 Beacon"
          visible={this.props.visible}
          onCancel={this.onCancel}
          onOk={this.onOkAppend}
          okText="添加"
        >
          <Table
            rowSelection={rowSelection}
            rowKey="id"
            columns={this.columns}
            dataSource={this.props.installBeacon2Show.appendBox.list}
            pagination={{
              ...this.props.installBeacon2Show.appendBox.pagination,
              onShowSizeChange: this.onSizeChange,
              onChange: this.onPageChange,
            }}
          />
        </Modal>
      </div>
    );
  }
}

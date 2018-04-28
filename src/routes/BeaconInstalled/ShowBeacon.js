/**
 * Created by neo on 6/4/2018.
 */
import React, { PureComponent } from 'react';
import { Form, Card, Table, Modal, message, InputNumber, Input, Dropdown, Menu, Button, Icon } from 'antd';
import { connect } from 'dva';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { getTimeString } from '../../utils/utils';
import ShowBeaconSelector from './ShowBeaconSelector';
import { transNum2ZhongWen } from '../../utils/utils';

@connect(({ installBeacon2Show, loading }) => ({
  installBeacon2Show,
  loading: loading.effects['installBeacon2Show/fetchList'],
}))
export default class ShowBeacon extends PureComponent {
  state = {
    showId: this.props.match.url.slice(this.props.match.url.indexOf('/beacon/show/') + 13, this.props.match.url.indexOf('/beacons/')),
    showTitle: this.props.match.url.slice(this.props.match.url.indexOf('/beacons/') + 9),
    appendBoxVisible: false,
  }
  componentWillMount() {
    this.props.dispatch({
      type: 'installBeacon2Show/fetchList',
      payload: {
        showId: this.state.showId,
        page: 0,
        size: 10,
      },
    });
  }
  handleMenuClick = (record, e) => {
    if (e.key === '1') {
      const that = this;
      Modal.confirm({
        title: '确定要从展览移除该 Beacon 吗？',
        cancelText: '取消',
        okText: '确定',
        onOk() {
          that.removeBeacon(that.state.showId, record.id);
        },
      });
    }
  }
  removeBeacon = (showId, beaconId) => {
    this.props.dispatch({
      type: 'installBeacon2Show/removeBeacon',
      payload: {
        showId,
        beaconId,
      },
    });
  }
  openAppendBox = () => {
    this.setState({
      appendBoxVisible: true,
    });
  }
  closeAppendBox = (needReFresh) => {
    if (needReFresh) {
      this.props.dispatch({
        type: 'installBeacon2Show/fetchList',
        payload: {
          showId: this.state.showId,
          page: 0,
          size: 10,
        },
      });
    }
    this.setState({
      appendBoxVisible: false,
    });
  }
  onSizeChange = (current, pageSize) => {
    this.props.dispatch({
      type: 'installBeacon2Show/fetchList',
      payload: {
        showId: this.state.showId,
        page: current - 1,
        size: pageSize,
      },
    });
  }
  onPageChange = (page, pageSize) => {
    this.props.dispatch({
      type: 'installBeacon2Show/fetchList',
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
  }, {
    title: '操作',
    key: 'operation',
    render: (text, record) => (
      <div>
        <Menu onClick={e => this.handleMenuClick(record, e)}
              mode="vertical"
              style={{ float: 'left', border: 'none', background: 'rgba(0, 0, 0, 0)' }}>
          <Menu.Item key="1" style={{ float: 'left', backgroundColor: 'rgba(0, 0, 0, 0)', color: 'rgba(0, 0, 0, 0.65)' }}>移除</Menu.Item>
        </Menu>
        {/*<Button style={{ marginLeft: 8 }}>*/}
          {/*操作 <Icon type="down" />*/}
        {/*</Button>*/}
      </div>),
  }];
  render() {
    const mainSearch = (
      <div>
        <div style={{float: 'right'}}>
          <Button size="large" onClick={this.openAppendBox}> 添加 Beacon </Button>
        </div>
      </div>
    );
    const appendBox = (
      <ShowBeaconSelector
        showId={this.state.showId}
        visible={this.state.appendBoxVisible}
        closeAppendBox={this.closeAppendBox}
      />
    );
    return (
      <div>
        <PageHeaderLayout
          title={`「${this.state.showTitle}」展览 Beacon`}
          content={mainSearch}
        >
          <Card border="false">
            <Table
              rowKey="id"
              columns={this.columns}
              dataSource={this.props.installBeacon2Show.list}
              pagination={{
                ...this.props.installBeacon2Show.pagination,
                onShowSizeChange: this.onSizeChange,
                onChange: this.onPageChange,
              }}
            />
          </Card>
        </PageHeaderLayout>
        { this.state.appendBoxVisible ? appendBox : '' }
      </div>
    );
  }
}

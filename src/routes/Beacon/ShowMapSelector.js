/**
 * Created by neo on 12/3/2018.
 */

import React, { PureComponent } from 'react';
import { Card, Table, Button } from 'antd';
import { connect } from 'dva';
import { getTimeString } from '../../utils/utils';

/* 主界面 */
@connect(({ showmap, loading }) => ({
  showmap,
  loading: loading.effects['showmap/initList'],
}))
export default class ShowMapSelector extends PureComponent {
  state = {
    showId: this.props.showId,
  }
  componentWillMount() {
    this.props.dispatch({
      type: 'showmap/initList',
      payload: {
        showId: this.state.showId,
      },
    });
    console.log(this.props);
  }
  onSizeChange = (current, pageSize) => {
    this.props.dispatch({
      type: 'showmap/fetchList',
      payload: {
        showId: this.state.showId,
        page: current - 1,
        size: pageSize,
      },
    });
  }
  onPageChange = (page, pageSize) => {
    this.props.dispatch({
      type: 'showmap/fetchList',
      payload: {
        showId: this.state.showId,
        page: page - 1,
        size: pageSize,
      },
    });
  }
  onSelect = (record, e) => {
    this.props.onSelect(record);
  }
  columns = [{
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
  }, {
    title: '地图名称',
    dataIndex: 'name',
    key: 'name',
  }, {
    title: '展馆',
    dataIndex: 'showHallName',
    key: 'showHallName',
  }, {
    title: '地图尺寸（长）',
    dataIndex: 'height',
    key: 'height',
  }, {
    title: '地图尺寸（宽）',
    dataIndex: 'width',
    key: 'width',
  }, {
    title: '修改时间',
    dataIndex: 'updateTime',
    key: 'updateTime',
    render: text => (<div> {getTimeString(text)} </div>),
  }, {
    title: '',
    key: 'operation',
    render: (text, record) => (
      <Button style={{ marginLeft: 8 }} onClick={e => this.onSelect(record, e)}>
        选择
      </Button>
    ),
  }];
  render() {
    return (
      <div>
        <Card border="false">
          <Table
            rowKey="id"
            columns={this.columns}
            dataSource={this.props.showmap.list}
            pagination={{
            ...this.props.showmap.pagination,
            onShowSizeChange: this.onSizeChange,
            onChange: this.onPageChange,
          }}
          />
        </Card>
      </div>
    );
  }
}



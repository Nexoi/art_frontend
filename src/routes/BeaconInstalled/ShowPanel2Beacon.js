/**
 * Created by neo on 2/3/2018.
 * 展览主面板
 */
import React, { PureComponent } from 'react';
import { Card, Table, Modal, message, List, Input, Dropdown, Menu, Button, Icon } from 'antd';
import { connect } from 'dva';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { getTimeStringSimple, getTimeString } from '../../utils/utils';

/* 主界面 */
@connect(({ showmain, loading }) => ({
  showmain,
  loading: loading.effects['showmain/initList'],
}))
export default class ShowPanel2Beacon extends PureComponent {
  componentWillMount() {
    this.props.dispatch({
      type: 'showmain/initList',
    });
  }
  onClickSearch = (value) => {
    this.props.dispatch({
      type: 'showmain/searchShowList',
      payload: {
        word: value,
        page: 0,
        size: 10,
      },
    });
  }
  /* 分页数据改变 */
  onSizeChange = (current, pageSize) => {
    this.props.dispatch({
      type: 'showmain/searchShowList',
      payload: {
        page: current - 1,
        size: pageSize,
      },
    });
  }
  onPageChange = (page, pageSize) => {
    this.props.dispatch({
      type: 'showmain/searchShowList',
      payload: {
        page: page - 1,
        size: pageSize,
      },
    });
  }
  columns = [{
    title: '展览名称',
    dataIndex: 'title',
    key: 'title',
    render: (text, record) => (<a href={`#/beacon/show/${record.id}/beacons/${record.title}`}> {text} </a>),
  }, {
    title: '开展时间',
    dataIndex: 'startTime',
    key: 'startTime',
    render: (text, record) => {
      return (<div> {`${getTimeStringSimple(record.startTime)} - ${getTimeStringSimple(record.endTime)}`} </div>);
    },
  }, {
    title: '更新时间',
    dataIndex: 'updateTime',
    key: 'updateTime',
    render: text => (<div> {getTimeString(text)} </div>),
  }];
  render() {
    const mainSearch = (
      <div>
        <Input.Search
          placeholder="请输入展览名称"
          enterButton="搜索"
          size="large"
          onSearch={this.onClickSearch}
          style={{ width: 360, float: 'left' }}
        />
      </div>
    );
    return (
      <div>
        <PageHeaderLayout
          title="展览列表"
          content={mainSearch}
        >
          <Card border="false">
            <Table
              rowKey="id"
              columns={this.columns}
              dataSource={this.props.showmain.list}
              pagination={{
                ...this.props.showmain.pagination,
                onShowSizeChange: this.onSizeChange,
                onChange: this.onPageChange,
              }}
            />
          </Card>
        </PageHeaderLayout>
      </div>);
  }
}

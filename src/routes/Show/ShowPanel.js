/**
 * Created by neo on 2/3/2018.
 * 展览主面板
 */
import React, { PureComponent } from 'react';
import { Card, Table, Modal, message, List, Input, Dropdown, Menu, Button, Icon } from 'antd';
import { connect } from 'dva';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { getTimeStringSimple, getTimeString } from '../../utils/utils';
import ShowAddForm from './ShowAddForm';
import ShowEditForm from './ShowEditForm';

/* 主界面 */
@connect(({ showmain, loading }) => ({
  showmain,
  loading: loading.effects['showmain/initList'],
}))
export default class ShowPanel extends PureComponent {
  state = {
    addModalVisible: false,
    editModalVisible: false,
    currentSelectedShow: {
    },
  }
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
  openAddModal = () => {
    this.setState({
      addModalVisible: true,
    });
  }
  closeAddModal = (needReFlush) => {
    if (needReFlush) {
      this.props.dispatch({
        type: 'showmain/initList',
      });
    }
    this.setState({
      addModalVisible: false,
    });
  }
  openEditModal = (record) => {
    this.setState({
      currentSelectedShow: record,
      editModalVisible: true,
    });
  }
  closeEditModal = (needReFlush) => {
    if (needReFlush) {
      this.props.dispatch({
        type: 'showmain/initList',
      });
    }
    this.setState({
      editModalVisible: false,
    });
  }
  handleMenuClick = (record, e) => {
    if (e.key === '1') {
      this.openEditModal(record);
    }
    if (e.key === '2') {
      const that = this;
      Modal.confirm({
        title: '确定要删除该展览所有信息吗？',
        cancelText: '取消',
        okText: '确定',
        onOk() {
          that.deleteShow(record.id);
        },
      });
    }
  }
  deleteShow = (id) => {
    this.props.dispatch({
      type: 'showmain/deleteShow',
      payload: {
        showId: id,
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
    render: (text, record) => (<a href={`#/shows/${record.id}/all`}> {text} </a>),
  }, {
    title: '开展时间',
    dataIndex: 'startTime',
    key: 'startTime',
    render: (text, record) => {
      return (<div> {`${getTimeStringSimple(record.startTime)} - ${getTimeStringSimple(record.endTime)}`} </div>);
    },
  }, {
    title: '展厅名称',
    dataIndex: 'showHallNames',
    key: 'showHallNames',
    render: (text, record) => {
      if (record.showHallNames === undefined) {
        return (
          <Button style={{ marginLeft: 8 }}>
            未添加展厅
          </Button>);
      } else {
        const items = record.showHallNames
          .map(item => <Menu.Item style={{ cursor: 'initial' }} key={item}>{item}</Menu.Item>);
        return (
          <Dropdown style={{ cursor: 'initial' }} overlay={
            <Menu>
              {items}
            </Menu>}
          >
            <label style={{ marginLeft: 8, display: 'inline-block', minWidth: 100 }}>
              查看展厅 <Icon type="down" />
            </label>
          </Dropdown>)
      }
    },
  }, {
    title: '浏览量',
    dataIndex: 'viewTimes',
    key: 'viewTimes',
  }, {
    title: '更新时间',
    dataIndex: 'updateTime',
    key: 'updateTime',
    render: text => (<div> {getTimeString(text)} </div>),
  }, {
    title: '操作',
    key: 'operation',
    render: (text, record) => (
      <Dropdown overlay={
        <Menu onClick={e => this.handleMenuClick(record, e)}>
          <Menu.Item key="1">编辑</Menu.Item>
          <Menu.Item key="2">删除</Menu.Item>
        </Menu>}
      >
        <Button style={{ marginLeft: 8 }}>
          操作 <Icon type="down" />
        </Button>
      </Dropdown>),
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
        <div style={{ float: 'right' }}>
          <Button size="large" onClick={this.openAddModal}> 新建展览 </Button>
        </div>
      </div>
    );
    const modalAdd = (
      <Modal
        style={{ minWidth: 800 }}
        visible={this.state.addModalVisible}
        title="新增展览"
        onCancel={this.closeAddModal}
        footer={null}
      >
        <ShowAddForm
          onCloseModal={this.closeAddModal}
        />
      </Modal>);
    const modalEdit = (
      <Modal
        style={{ minWidth: 800 }}
        visible={this.state.editModalVisible}
        title="编辑展览"
        onCancel={this.closeEditModal}
        footer={null}
      >
        <ShowEditForm
          sourceData={this.state.currentSelectedShow}
          onCloseModal={this.closeEditModal}
        />
      </Modal>);
    return (
      <div>
        <PageHeaderLayout
          title="展览管理"
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
        {modalAdd}
        {this.state.editModalVisible ? modalEdit : ''}
      </div>);
  }
}

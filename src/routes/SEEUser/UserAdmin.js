/**
 * Created by neo on 18/3/2018.
 */

import React, { PureComponent } from 'react';
import { Avatar, Card, Table, Modal, message, Form, Input, Dropdown, Menu, Button, Icon, Select } from 'antd';
import { connect } from 'dva';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import ShowAuthSelector from './ShowAuthSelector';
import UserAdminForm from './UserAdminForm';

const { Option } = Select;

/* 主界面 */
@connect(({ seeuadmin, loading }) => ({
  seeuadmin,
  loading: loading.effects['seeuadmin/listUsers'],
}))
export default class UserAdmin extends PureComponent {
  state = {
    authSelectorVisible: false,
    currentUid: undefined,
    data: {},
    addModalVisible: false,
    editModalVisible: false,
  }
  componentWillMount() {
    this.props.dispatch({
      type: 'seeuadmin/listAllAdmins',
      payload: {
        page: 0,
        size: 10,
      },
    });
  }
  onClickSearch = (value) => {
    this.props.dispatch({
      type: 'seeuadmin/listAllAdmins',
      payload: {
        word: value,
        page: 0,
        size: 10,
      },
    });
  }
  handleMenuClick = (record, e) => {
    if (e.key === '1') {
      this.openAuthSelector(record.uid);
    }
    if (e.key === '2') {
    }
    if (e.key === '3') {
      const that = this;
      Modal.confirm({
        title: '确定要删除该管理员所有信息吗？',
        cancelText: '取消',
        okText: '确定',
        onOk() {
          that.deleteAdmin(record.uid);
        },
      });
    }
  }
  openAuthSelector = (uid) => {
    // this.props.dispatch({
    //   type: 'seeuadmin/listOneShowAuths',
    //   payload: {
    //     uid,
    //   },
    // });
    this.setState({
      currentUid: uid,
      authSelectorVisible: true,
    });
  }
  closeAuthSelector = (needReFlush) => {
    // 不需要做刷新处理（权限列表是动态加载信息的）
    this.setState({
      authSelectorVisible: false,
    });
  }
  deleteAdmin = (uid) => {
    this.props.dispatch({
      type: 'seeuadmin/deleteAdmin',
      payload: {
        uid,
      },
    });
  }
  /* 表单上传数据 在这里汇合 */
  onFormDataChange = (changedFields) => {
    this.setState({
      data: { ...this.state.data, ...changedFields },
    });
  }
  openAddModal = (record) => {
    this.setState({
      data: record,
      addModalVisible: true,
    });
  }
  closeAddModal = () => {
    this.setState({
      addModalVisible: false,
    });
  }
  handleAddModalOk = () => {
    // 添加管理员
  }

  columns = [{
    title: '头像',
    dataIndex: 'headIconUrl',
    key: 'headIconUrl',
    render: text => (<Avatar src={text} />),
  }, {
    title: '#ID',
    dataIndex: 'uid',
    key: 'uid',
  }, {
    title: '昵称',
    dataIndex: 'nickname',
    key: 'nickname',
  }, {
    title: '手机',
    dataIndex: 'phone',
    key: 'phone',
  }, {
    title: '用户状态',
    dataIndex: 'memberStatus',
    key: 'memberStatus',
    render: text => (
      <Button size="small" type="primary">
        {text === 'OK' ? '正常' : text === 'UNACTIVED' ? '未激活' : text === 'DISTORY' ? '已注销' : text === 'BAD' ? '违规用户' : text}
      </Button>),
  }, {
    title: '操作',
    key: 'operation',
    render: (text, record) => (
      <div>
        <Menu onClick={e => this.handleMenuClick(record, e)}
              mode="vertical"
              style={{ float: 'left', border: 'none', background: 'rgba(0, 0, 0, 0)' }}>
          <Menu.Item key="1" style={{ float: 'left', backgroundColor: 'rgba(0, 0, 0, 0)', color: 'rgba(0, 0, 0, 0.65)' }}>修改权限</Menu.Item>
          {/*<Menu.Item key="2">编辑</Menu.Item>*/}
          <Menu.Item key="3" style={{ float: 'left', backgroundColor: 'rgba(0, 0, 0, 0)', color: 'rgba(0, 0, 0, 0.65)' }}>删除</Menu.Item>
        </Menu>
        {/*<Button style={{ marginLeft: 8 }}>*/}
          {/*操作 <Icon type="down" />*/}
        {/*</Button>*/}
      </div>),
  }];
  render() {
    const mainSearch = (
      <div>
        <Input.Search
          placeholder="请输入用户昵称或手机号"
          enterButton="搜索"
          size="large"
          onSearch={this.onClickSearch}
          style={{ width: 360, float: 'left' }}
        />
        <div style={{ float: 'right' }}>
          <Button size="large" onClick={this.openAddModal}> 添加管理员 </Button>
        </div>
      </div>
    );
    const showSelector = (
      <ShowAuthSelector
        visible={this.state.authSelectorVisible}
        uid={this.state.currentUid}
        initialData={this.props.seeuadmin.shows}
        closeSelector={this.closeAuthSelector}
        // updateShowAuths={this.updateShowAuths}
      />
    );
    const addModal = (
      <Modal
        title="添加管理员"
        visible={this.state.addModalVisible}
        onCreate={this.handleAddModalOk}
        onCancel={this.closeAddModal}
        footer={null}
      >
        <UserAdminForm
          initValues={this.state.data}
          onCancel={this.closeAddModal}
          type="add"
        />
      </Modal>
    );
    // const editModal = (
    //   <Modal
    //     title="编辑管理员"
    //     visible={this.state.addModalVisible}
    //     onCreate={this.handleAddModalOk}
    //     onCancel={this.closeAddModal}
    //     footer={null}
    //   >
    //     <UserAdminForm
    //       initValues={this.state.data}
    //       type="edit"
    //     />
    //   </Modal>
    // );
    return (
      <div>
        <PageHeaderLayout
          title="管理员列表"
          content={mainSearch}
        >
          <Card border="false">
            <Table
              rowKey="uid"
              columns={this.columns}
              dataSource={this.props.seeuadmin.list}
              pagination={{
                ...this.props.seeuadmin.pagination,
              }}
            />
          </Card>
        </PageHeaderLayout>
        { this.state.authSelectorVisible ? showSelector : '' }
        { this.state.addModalVisible ? addModal : '' }
      </div>);
  }
}

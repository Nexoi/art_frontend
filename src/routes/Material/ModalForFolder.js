/**
 * Created by neo on 28/2/2018.
 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Modal, message, List, Input, Dropdown, Menu, Button, Icon } from 'antd';
import EditableCell from './EditableCell';

/**
 * @param that
 * @param label 只能是 'audio', 'picture', 'video' 任中一个
 * @param visible
 * @returns {XML}
 */
@connect(({ folder, loading }) => ({
  folder,
  loading: loading.effects['folder/initFolders'],
}))
export default class ModalForFolder extends React.Component {
  state = {
    type: this.props.label,
  };
  // that = this.props.that; // 外部引用这个组件的 this

  componentWillMount() {
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'folder/list',
      payload: {
        type: this.state.type,
      },
    });
  }

  addItem = (e) => {
    const { value } = e.target;
    // console.log(e);
    // message.info(`add ${value}`);
    this.props.dispatch({
      type: 'folder/addFolder',
      payload: {
        type: this.state.type,
        folderName: value,
      },
    });
  }

  updateItem = (id, name) => {
    // console.log(`EEEEE ${id}`);
    // message.info(`update: ${name}`);
    this.props.dispatch({
      type: 'folder/changeName',
      payload: {
        type: this.state.type,
        folderId: id,
        folderName: name,
      },
    });
  }

  deleteItem = (id) => {
    // message.info(`delete: ${id}`);
    this.props.dispatch({
      type: 'folder/deleteFolder',
      payload: {
        folderId: id,
        type: this.state.type,
      },
    });
  }

  onOk = () => {
    // message.info('ok');
    this.props.that.setState({
      folderModalVisible: false,
    });
  };

  handleMenuClick = (id, e) => {
    const that = this;
    if (e.key === '1') {
      Modal.confirm({
        title: '确定要删除该分组吗？（会一并删除该分组下所有内容）',
        onOk() {
          that.deleteItem(id);
        },
      });
    }
  }
  /* update modal */
  // onUpdateOk = () => {
  //   const value = this.state.currentItemName;
  //   message.info(`更新名字... ${value}`);
  //   this.setState({
  //     updateModalVisible: false,
  //   });
  // }

  render() {
    // const updateModal = (
    //   <Modal
    //     visible={this.state.updateModalVisible}
    //     // visible="true"
    //     title="请输入修改后的名字"
    //     okText="确认修改"
    //     onOk={this.onUpdateOk}
    //   >
    //     <Input defaultValue={this.state.currentItemName} />
    //   </Modal>
    // );

    return (
      <Modal
        visible={this.props.visible}
        title="修改分组"
        okText="确定"
        onCancel={this.onOk}
        onOk={this.onOk}
      >
        <Input placeholder="新建分组，按回车键确认添加" onPressEnter={this.addItem} style={{ marginBottom: 20 }} />
        <List
          bordered
          className="demo-loadmore-list"
          itemLayout="horizontal"
          dataSource={this.props.folder.list}
          renderItem={item => (
            <List.Item>
              <List.Item.Meta
                title={
                  <EditableCell
                    id={item.id}
                    value={item.name}
                    onChange={this.updateItem}
                  />
                }
              />
              <Dropdown
                overlay={
                  <Menu onClick={e => this.handleMenuClick(item.id, e)}>
                    <Menu.Item key="1"> 删除 </Menu.Item>
                  </Menu>}
              >
                <Button style={{ marginLeft: 8 }}>
                  操作 <Icon type="down" />
                </Button>
              </Dropdown>
            </List.Item>
          )}
        />
        {/*{updateModal}*/}
      </Modal>
    );
  }
}


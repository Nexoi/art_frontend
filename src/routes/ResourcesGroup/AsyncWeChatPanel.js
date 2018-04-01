/**
 * Created by neo on 1/4/2018.
 */
import React, { Component } from 'react';
import { routerRedux, Route, Switch } from 'dva/router';
import { connect } from 'dva';
import { Button, Modal, Input, List } from 'antd';

let isAsync = false; // 在更新中
let countAsync = 0;
const timeOut = [1, 1, 1, 1, 1, 1, 1, 2, 3, 5, 5, 7, 11, 13, 17, 23, 29];

@connect(({ wxasync, loading }) => ({
  wxasync,
  loading: loading.effects['wxasync/listAsyncResult'],
}))
export default class AsyncWeChatPanel extends Component {
  state = {
    showId: this.props.showId,
    currentList: this.props.wxasync.list.slice(0, 8),
    isSynchronizing: false,
    currentPage: 1,
    currentBtnTitle: '开始同步',
  }

  onCancel = () => {
    if (this.props.onCloseModal !== undefined) {
      this.props.onCloseModal();
    }
  }
  componentDidMount() {
    this.listAsyncResult();
  }
  startAsync = () => {
    // 先 get 一下，看看有没有任务在进行中
    this.props.dispatch({
      type: 'wxasync/listAsyncResult',
      payload: {
        showId: this.state.showId,
      },
    }).then(() => {
      const list = this.props.wxasync.list.filter(it => it.status === 'ING');
      if (list.length !== 0) {
        // 还有任务在进行中，需要列出来
        this.setState({
          currentList: this.props.wxasync.list.slice(0, 8),
        });
        // 询问用户是否需要同步
        const that = this;
        Modal.confirm({
          title: '有正在同步的网页，确认要重新同步吗？',
          cancelText: '取消',
          okText: '确定',
          onOk() {
            that.asyncWxOk();
          },
          onCancel() {
            // 开启刷新，用户可能是来看进度的
            isAsync = true;
            countAsync = 0;
            that.startFlushResult();
          },
        });
      } else {
        // 直接开始同步！
        // 准备开始
        this.asyncWxOk();
      }
      // if (list.length === 0) {
      // // if (true) {
      //   // 以前的任务都是完成了的，说明用户要重新同步
      //   // this.setState({
      //   //   isSynchronizing: false,
      //   // });
      //   // 准备开始
      //   isAsync = true;
      //   // 开启同步
      //   this.props.dispatch({
      //     type: 'wxasync/startAsync',
      //     payload: {
      //       showId: this.state.showId,
      //     },
      //   }).then(() => {
      //     this.setState({
      //       isSynchronizing: true,
      //     });
      //     // 开启定时刷新直至全部同步完成
      //     this.startFlsuhResult();
      //   });
      // } else {
      //   // 还有任务在进行中，只需要列出来即可
      //   this.setState({
      //     currentList: this.props.wxasync.list.slice(0, 8),
      //   });
      // }
    });
  }
  asyncWxOk = () => {
    isAsync = true;
    countAsync = 0;
    // 开启同步
    this.props.dispatch({
      type: 'wxasync/startAsync',
      payload: {
        showId: this.state.showId,
      },
    }).then(() => {
      this.setState({
        isSynchronizing: true,
      });
      // 开启定时刷新直至全部同步完成
      this.startFlushResult();
    });
  }
  listAsyncResult = () => {
    this.props.dispatch({
      type: 'wxasync/listAsyncResult',
      payload: {
        showId: this.state.showId,
      },
    });
  }

  startFlushResult = () => {
    if (isAsync && countAsync < 60) { // 刷新一分钟！不怂
      // 刷新
      this.props.dispatch({
        type: 'wxasync/listAsyncResult',
        payload: {
          showId: this.state.showId,
        },
      }).then(() => {
        const list = this.props.wxasync.list.filter(it => it.status === 'ING');
        if (list.length === 0) {
          // 停止更新
          this.setState({
            isSynchronizing: false,
            currentBtnTitle: '已完成（点击可再次同步）',
          });
          isAsync = false;
        } else {
          // 刷新页面
          this.setState({
            currentList: this.props.wxasync.list.slice(0, 8),
          });
        }
      });
      countAsync += 1;
      setTimeout(this.startFlushResult, 1000); // 素数倍刷新频率机制
    }
  }

  onPageChange = (page, pageSize) => {
    // pageSize = 8 固定的
    let page2 = page - 1;
    let pageSize2 = 8;
    // if (page * pageSize > this.props.wxasync.list.length) {
    //   page2 = this.props.wxasync.list.length / pageSize;
    // } else {
    //   page2 = page - 1;
    // }
    const start = page2 * pageSize2;
    this.setState({
      currentList: this.props.wxasync.list.slice(start, start + pageSize2),
      currentPage: page2 + 1,
    });
  }
  render() {
    return (
      <Modal
        title="微信文章同步"
        visible={this.props.visible}
        onCancel={this.onCancel}
        footer={null}
      >
        {this.state.isSynchronizing ? (<Button disabled type="danger">正在同步</Button>) : (<Button onClick={this.startAsync} type="primary">{this.state.currentBtnTitle}</Button>)}
        <List
          locale={{ emptyText: '没有同步任务在进行中' }}
          style={{ marginTop: 20 }}
          size="small"
          bordered="true"
          itemLayout="horizontal"
          rowKey="itemId"
          dataSource={this.state.currentList}
          renderItem={item => (
            <List.Item actions={[<div>{item.type === 'ADD' ? '新增' : '同步'}</div>,
              <div>{item.status === 'FINISH' ? '已完成' : '进行中'}</div>]}>
              <List.Item.Meta
                title={item.itemName}
                description={item.message}
              />
            </List.Item>
          )}
          pagination={{
            onChange: this.onPageChange,
            total: this.props.wxasync.list.length,
            pageSize: 8,
            current: this.state.currentPage,
            // showSizeChanger: true,
          }}
        />
      </Modal>
    );
  }
}

/**
 * Created by neo on 15/3/2018.
 */
import React, { PureComponent } from 'react';
import { Switch, Card, Table, Modal, message, List, Input, Dropdown, Menu, Button, Icon } from 'antd';
import { connect } from 'dva';
import styles from './selector.less';

@connect(({ showmain, seeuadmin, loading }) => ({
  showmain,
  seeuadmin,
  loading: loading.effects['showmain/initList'],
}))
export default class ShowAuthSelector extends PureComponent {
  state = {
    selectedShows: [],
    uid: this.props.uid,
  }
  componentWillMount() {
    const that = this;
    console.log('=--=-=-=-=-=-=-=-=-=-')
    this.props.dispatch({
      type: 'showmain/initList',
    });
    this.props.dispatch({
      type: 'seeuadmin/listOneShowAuths',
      payload: {
        uid: this.state.uid,
      },
    }).then(() => {
      that.setState({
        selectedShows: this.props.seeuadmin.shows.map((item) => { return { id: item.id, title: item.title }; }) || [],
      });
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
  onCancel = (needReFlush) => {
    if (this.props.closeSelector !== undefined) {
      this.props.closeSelector(needReFlush);
    }
  }
  selectIt = (id, title) => {
    console.log(this.state.selectedShows)
    if (this.contains(this.state.selectedShows, {id, title})) {
      // 删去
      const shows = this.state.selectedShows.filter((item) => { return item.id !== id; })
      this.setState({
        selectedShows: shows,
      });
    } else {
      // 添加
      const shows = this.state.selectedShows.concat([{id, title}]);
      this.setState({
        selectedShows: shows,
      });
    }
  }
  // 根据 id 做比较
  contains = (datas, item) => {
    if (datas === undefined || datas.length === 0) {
      return false;
    }
    const shows = this.state.selectedShows.filter((it) => { return it.id === item.id; });
    console.log(shows);
    return shows.length !== 0;
  }
  updateShowAuths = (uid, shows) => {
    console.log(uid);
    console.log(shows);
    if (uid === undefined) {
      return;
    }
    if (shows.length === 0) {
      const that = this;
      Modal.confirm({
        title: '确定要清空该管理员所有展览权限吗？',
        cancelText: '取消',
        okText: '确定',
        onOk() {
          that.cleanShowAuths(uid);
        },
      });
    } else {
      let idStr = '';
      for (let i = 0; i < shows.length; i += 1) {
        idStr += i === shows.length - 1 ? `${shows[i].id}` : `${shows[i].id},`;
      }
      this.props.dispatch({
        type: 'seeuadmin/updateShowAuths',
        payload: {
          uid,
          showIds: idStr,
        },
      });
      // close modal
      this.onCancel(true);
    }
  }
  cleanShowAuths = (uid) => {
    this.props.dispatch({
      type: 'seeuadmin/cleanShowAuths',
      payload: {
        uid,
      },
    });
    // close modal
    this.onCancel(true);
  }
  onOk = () => {
    const { uid, selectedShows } = this.state;
    this.updateShowAuths(uid, selectedShows);
  }
  render() {
    const { visible } = this.props;
    console.log({ visible });

    return (
      <div>
        <Modal
          style={{ minWidth: 800 }}
          title="配置展览权限（注：终极管理员默认可操作所有展览）"
          visible={this.props.visible}
          onCancel={this.onCancel}
          onOk={this.onOk}
        >
          <Card border="false">
            <List
              style={{ width: 400, float: 'left' }}
              bordered="true"
              itemLayout="horizontal"
              dataSource={this.props.showmain.list}
              renderItem={item => (
                <List.Item
                  className={styles.listItem}
                  style={this.state.selectedShows.indexOf({ id:item.id, title: item.title }) !== -1 ? { backgroundColor: '#DDDDDD' } : {}}
                  onClick={e => this.selectIt(item.id, item.title)}
                >
                  <List.Item.Meta
                    title={item.title}
                    // description={item.title}
                  />
                </List.Item>
              )}
              pagination={{
                ...this.props.showmain.pagination,
                onShowSizeChange: this.onSizeChange,
                onChange: this.onPageChange,
              }}
            />
            <List
              locale={{ emptyText: '暂未选中任何展览' }}
              style={{ width: 280, float: 'right' }}
              bordered="true"
              itemLayout="horizontal"
              dataSource={this.state.selectedShows}
              renderItem={item => (
                <List.Item
                  onClick={e => this.selectIt(item.id, item.title)}
                >
                  <List.Item.Meta
                    title={item.title}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Modal>
      </div>);
  }
}

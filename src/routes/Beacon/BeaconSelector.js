/**
 * Created by neo on 15/3/2018.
 */
import React, { PureComponent } from 'react';
import { Switch, Card, Table, Modal, message, List, Input, Dropdown, Menu, Button, Icon } from 'antd';
import { connect } from 'dva';
import { getTimeString } from '../../utils/utils';
import styles from './beaconselector.less';

@connect(({ beacon, loading }) => ({
  beacon,
  loading: loading.effects['beacon/fetchList'],
}))
export default class BeaconSelector extends PureComponent {
  state = {
    selectedUUIDs: this.props.initialData.map((item) => { return item.basicInfo.id; }) || [], // 不再以 uuid 为键
    showId: this.props.showId,
    groupId: this.props.groupId,
  }
  componentWillMount() {
    this.props.dispatch({
      type: 'beacon/fetchList',
      payload: {
        showId: this.state.showId,
        page: 0,
        size: 10,
      },
    });
  }
  /* 分页数据改变 */
  onSizeChange = (current, pageSize) => {
    this.props.dispatch({
      type: 'beacon/fetchList',
      payload: {
        showId: this.state.showId,
        page: current - 1,
        size: pageSize,
      },
    });
  }
  onPageChange = (page, pageSize) => {
    this.props.dispatch({
      type: 'beacon/fetchList',
      payload: {
        showId: this.state.showId,
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
  // selectIt = (uuid) => {
  //   if (this.state.selectedUUIDs.indexOf(uuid) !== -1) {
  //     // 删去
  //     const uuids = this.state.selectedUUIDs.filter((item) => { return item !== uuid; })
  //     this.setState({
  //       selectedUUIDs: uuids,
  //     });
  //   } else {
  //     // 添加
  //     const uuids = this.state.selectedUUIDs.concat([uuid]);
  //     this.setState({
  //       selectedUUIDs: uuids,
  //     });
  //   }
  // }
  selectIt = (id) => {
    if (this.state.selectedUUIDs.indexOf(id) !== -1) {
      // 删去
      const uuids = this.state.selectedUUIDs.filter((item) => { return item !== id; })
      this.setState({
        selectedUUIDs: uuids,
      });
    } else {
      // 添加
      const uuids = this.state.selectedUUIDs.concat([id]);
      this.setState({
        selectedUUIDs: uuids,
      });
    }
  }
  // getBeaconByUUID = (uuid) => {
  //   const beacons = this.props.beacon.list.filter(
  //     (item) => { return item.uuid === uuid; }
  //   );
  //   return beacons.length === 0 ? { name: uuid } : beacons[0];
  // }
  getBeaconByUUID = (id) => {
    const beacons = this.props.beacon.list.filter(
      (item) => { return item.basicInfo.id === id; }
    );
    return beacons.length === 0
      ?
      { name: 'UNKNOW',
        basicInfo: {
          id: 'UNKNOW',
        }
      }
      : beacons[0].name === undefined
      ?
      { name: `未命名`,
        basicInfo: {
          id: beacons[0].basicInfo.id,
        }
      } : beacons[0];
  }
  bindBeacons = (showId, groupId, beaconIds) => {
    const that = this;
    if (beaconIds === undefined || beaconIds.length === 0) {
      // return;
      beaconIds = [];
    }
    let beaconIdStr = '';
    for (let i = 0; i < beaconIds.length; i += 1) {
      beaconIdStr += i === beaconIds.length - 1 ? `${beaconIds[i]}` : `${beaconIds[i]},`;
    }
    this.props.dispatch({
      type: 'resourcesgroup/bindBeacons',
      payload: {
        showId,
        groupId,
        // uuids: uuidStr,
        beaconIds: beaconIdStr,
      },
    }).then(() => {
      // close modal
      that.onCancel(true);
    });
  }
  onOk = () => {
    const { showId, groupId, selectedUUIDs } = this.state;
    this.bindBeacons(showId, groupId, selectedUUIDs);
  }
  render() {
    const { visible } = this.props;
    console.log({ visible });

    return (
      <div>
        <Modal
          style={{ minWidth: 800 }}
          title="选择 Beacon"
          visible={this.props.visible}
          onCancel={this.onCancel}
          onOk={this.onOk}
        >
          <Card border="false">
            <List
              style={{ width: 400, float: 'left' }}
              bordered="true"
              itemLayout="horizontal"
              dataSource={this.props.beacon.list}
              renderItem={item => (
                <List.Item
                  className={styles.listItem}
                  style={this.state.selectedUUIDs.indexOf(item.basicInfo.id) !== -1 ? { backgroundColor: '#DDDDDD' }
                  : item.resourcesGroupId === undefined ? {} : { backgroundColor: '#B0C4DE' }}
                  onClick={e => this.selectIt(item.basicInfo.id)}
                >
                  <List.Item.Meta
                    title={item.name || '未命名'}
                    description={`B${item.basicInfo.id}`}
                  />
                </List.Item>
              )}
              pagination={{
                ...this.props.beacon.pagination,
                onShowSizeChange: this.onSizeChange,
                onChange: this.onPageChange,
              }}
            />
            <List
              locale={{ emptyText: '暂未选中任何 Beacon' }}
              style={{ width: 280, float: 'right' }}
              bordered="true"
              itemLayout="horizontal"
              dataSource={this.state.selectedUUIDs}
              renderItem={id => (
                <List.Item
                  onClick={e => this.selectIt(id)}
                >
                  <List.Item.Meta
                    title={ `${this.getBeaconByUUID(id).name} B${this.getBeaconByUUID(id).basicInfo.id}` }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Modal>
      </div>);
  }
}

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
  loading: loading.effects['beacon/initList'],
}))
export default class BeaconSelector extends PureComponent {
  state = {
    selectedUUIDs: this.props.initialData.map((item) => { return item.uuid; }) || [],
    showId: this.props.showId,
    groupId: this.props.groupId,
  }
  componentWillMount() {
    this.props.dispatch({
      type: 'beacon/initList',
    });
  }
  /* 分页数据改变 */
  onSizeChange = (current, pageSize) => {
    this.props.dispatch({
      type: 'beacon/fetchList',
      payload: {
        page: current - 1,
        size: pageSize,
      },
    });
  }
  onPageChange = (page, pageSize) => {
    this.props.dispatch({
      type: 'beacon/fetchList',
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
  selectIt = (uuid) => {
    if (this.state.selectedUUIDs.indexOf(uuid) !== -1) {
      // 删去
      const uuids = this.state.selectedUUIDs.filter((item) => { return item !== uuid; })
      this.setState({
        selectedUUIDs: uuids,
      });
    } else {
      // 添加
      const uuids = this.state.selectedUUIDs.concat([uuid]);
      this.setState({
        selectedUUIDs: uuids,
      });
    }
  }
  getBeaconByUUID = (uuid) => {
    const beacons = this.props.beacon.list.filter(
      (item) => { return item.uuid === uuid; }
    );
    return beacons.length === 0 ? { name: uuid } : beacons[0];
  }
  bindBeacons = (showId, groupId, uuids) => {
    if (uuids === undefined || uuids.length === 0) {
      return;
    }
    let uuidStr = '';
    for (let i = 0; i < uuids.length; i += 1) {
      uuidStr += i === uuids.length - 1 ? `${uuids[i]}` : `${uuids[i]},`;
    }
    this.props.dispatch({
      type: 'resourcesgroup/bindBeacons',
      payload: {
        showId,
        groupId,
        uuids: uuidStr,
      },
    });
    // close modal
    this.onCancel(true);
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
                  style={this.state.selectedUUIDs.indexOf(item.uuid) !== -1 ? { backgroundColor: '#DDDDDD' } : {}}
                  onClick={e => this.selectIt(item.uuid)}
                >
                  <List.Item.Meta
                    title={item.name}
                    description={item.uuid}
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
              renderItem={uuid => (
                <List.Item
                  onClick={e => this.selectIt(uuid)}
                >
                  <List.Item.Meta
                    title={this.getBeaconByUUID(uuid).name}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Modal>
      </div>);
  }
}

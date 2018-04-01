import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Form, Input, Button, Card, Modal, Radio, Icon, Tooltip, Switch,
} from 'antd';
import styles from './style.less';
import ShowMapSelector from './ShowMapSelector';
import MapPositionEditor from './MapPositionEditor';

const FormItem = Form.Item;

@connect(({ loading }) => ({
  submitting: loading.effects['beacon/addBeacon'],
}))
@Form.create()
export default class BeaconEditForm extends PureComponent {
  state = {
    mapSelectModalVisible: false,
    mapEditModalVisible: false,
    selectedMap: {
      image: {
        createTime: '',
        name: '',
        id: 4,
        thumbUrl: '',
        folderId: 18,
        url: '',
      },
      showHallName: '',
      name: '',
      width: 80,
      updateTime: '',
      id: 1,
      height: 100,
    },
    // data: {
    //   name: '',
    //   uuid: '',
    //   availableRange: 'one',
    //   majorValue: -1,
    //   minorValue: -1,
    //   status: '',
    //   height: -1,
    //   width: -1,
    //   showMap: {
    //     id: 1,
    //   },
    // },
    position: {
      width: -1,
      height: -1,
    },
  }
  handleSubmit = (e) => {
    const that = this;
    e.preventDefault();
    console.log(this.state.selectedMap);
    const { width, height } = this.state.position;
    const { id } = this.state.selectedMap;
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log(values);
        // this.props.dispatch({
        //   type: 'beacon/addBeacon',
        //   payload: values,
        // });
        const data = {
          name: values.name,
          uuid: values.uuid,
          availableRange: values.availableRange,
          majorValue: values.majorValue,
          minorValue: values.minorValue,
          status: values.status === undefined ? 'off' : values.status === true ? 'on' : 'off',
          height: parseInt(height, 10),
          width: parseInt(width, 10),
          mapId: id,
        }
        this.props.dispatch({
          type: 'beacon/addBeacon',
          payload: {
            ...data,
          },
        }).then(() => {
          const needReFlush = true;
          that.props.onCloseModal(needReFlush); // 关闭自己
        });
      }
    });
  }
  openMapSelectModal = () => {
    this.setState({
      mapSelectModalVisible: true,
    });
  }
  closeMapSelectModal = () => {
    this.setState({
      mapSelectModalVisible: false,
    });
  }
  selectMap = (record) => {
    console.log(record)
    this.closeMapSelectModal();
    const data = {
      image: {
        createTime: record.image.createTime,
        name: record.image.name,
        id: record.image.id,
        thumbUrl: record.image.thumbUrl,
        folderId: record.image.folderId,
        url: record.image.url,
      },
      showHallName: record.showHallName,
      name: record.name,
      width: record.width,
      updateTime: record.updateTime,
      id: record.id,
      height: record.height,
    };
    //
    this.state.selectedMap = data;
    //
    this.setState({
      selectedMap: data,
    });
    // console.log('========map===========')
    // console.log(this.state.selectedMap);
    // TODO 弹出地图地理位置添加器
    this.openMapEditModal();
  }
  openMapEditModal = () => {
    this.setState({
      mapEditModalVisible: true,
    });
  }
  closeMapEditModal = () => {
    this.setState({
      mapEditModalVisible: false,
    });
  }
  editMapPosition = (x, y) => {
    this.closeMapSelectModal();
    this.setState({
      position: {
        width: (x * this.state.selectedMap.width),
        height: (y * this.state.selectedMap.height),
      },
    });
    // console.log({ x, y });
    // console.log({ m: this.state.selectedMap.width, n: this.state.selectedMap.height });
    // console.log(`==>>>>> ${this.state.position.width}===${this.state.position.height}`);
  }


  render() {
    const { submitting } = this.props;
    const { getFieldDecorator, getFieldValue } = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };
    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };
    const modalMapSelector = (
      <Modal
        style={{ minWidth: 1000 }}
        visible={this.state.mapSelectModalVisible}
        title="选择地图"
        onCancel={this.closeMapSelectModal}
        onOk={this.closeMapSelectModal}
        footer={null}
      >
        <ShowMapSelector
          onSelect={this.selectMap}
        />
      </Modal>
    );
    const modalMapEditor = (
      <Modal
        style={{ minWidth: 852 }}
        visible={this.state.mapEditModalVisible}
        title="设置 Beacon 位置"
        onCancel={this.closeMapEditModal}
        onOk={this.closeMapEditModal}
      >
        <MapPositionEditor
          positionWidth={this.state.position.width > 0 && this.state.selectedMap.width > 0
            ? this.state.position.width / this.state.selectedMap.width
            : 0}
          positionHeight={this.state.position.height > 0 && this.state.selectedMap.height > 0
            ? this.state.position.height / this.state.selectedMap.height
            : 0}
          onSelect={this.editMapPosition}
          imageUrl={this.state.selectedMap.image.url}
          imageWidth={this.state.selectedMap.width}
          imageHeight={this.state.selectedMap.height}
        />
      </Modal>
    );
    return (
      <Card bordered={false}>
        <Form
          onSubmit={this.handleSubmit}
          hideRequiredMark
          style={{ marginTop: 8 }}
        >
          <FormItem
            {...formItemLayout}
            label="Beacon 名称"
          >
            {getFieldDecorator('name', {
              rules: [{
                required: true, message: '请输入名称',
              }],
            })(
              <Input placeholder="如：一层大门出口处" />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="UUID"
          >
            {getFieldDecorator('uuid', {
              rules: [{
                required: true, message: '请输入UUID',
              }],
            })(
              <Input placeholder="12345678-abcd-88cc-1111aaaa2222" />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="Major Value"
          >
            {getFieldDecorator('majorValue', {
              rules: [{
                required: true, message: '请输入 Major Value',
              }],
            })(
              <Input placeholder="8000" />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="Minor Value"
          >
            {getFieldDecorator('minorValue', {
              rules: [{
                required: true, message: '请输入 Minor Value',
              }],
            })(
              <Input placeholder="8888" />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="设定地图"
          >
            {getFieldDecorator('map')(
              <div>
                <Button placeholder="8888" onClick={this.openMapSelectModal}> 设置地图 </Button>
                { this.state.selectedMap.id !== -1 && (<div> {this.state.selectedMap.name} </div>)}
              </div>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="触发范围"
          >
            {getFieldDecorator('availableRange', {
              initialValue: '1',
            })(
              <Radio.Group>
                <Radio value="one">1 米</Radio>
                <Radio value="five">5 米</Radio>
              </Radio.Group>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={
              <span>
                开关
                <em className={styles.optional}>
                  <span style={{ width: 8 }}>  </span>
                  <Tooltip title="默认设置为关，需要开启后才能正常使用">
                    <Icon type="info-circle-o" style={{ marginRight: 4 }} />
                  </Tooltip>
                </em>
              </span>
            }
          >
            {getFieldDecorator('status')(
              <Switch onChange={this.onSwitch} />
            )}
          </FormItem>
          <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
            <Button type="primary" htmlType="submit" loading={submitting}>
              保存
            </Button>
          </FormItem>
        </Form>
        {modalMapSelector}
        {this.state.mapEditModalVisible ? modalMapEditor : ''}
      </Card>
    );
  }
}

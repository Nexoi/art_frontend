/**
 * Created by neo on 12/3/2018.
 */

import React, { PureComponent } from 'react';
import { Form, Card, Table, Modal, message, InputNumber, Input, Dropdown, Menu, Button, Icon } from 'antd';
import { connect } from 'dva';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { getTimeString } from '../../utils/utils';
import MaterialSelecter from '../Material/MaterialSelecter';
import { transNum2ZhongWen } from '../../utils/utils';

/* 主界面 */
@connect(({ showmap, loading }) => ({
  showmap,
  loading: loading.effects['showmap/initList'],
}))
export default class ShowMap extends PureComponent {
  state = {
    showId: this.props.match.url.slice(this.props.match.url.indexOf('/beacon/show/') + 13, this.props.match.url.indexOf('/maps/')),
    showTitle: this.props.match.url.slice(this.props.match.url.indexOf('/maps/') + 6),
    viewModalVisible: false,
    viewModalImageUrl: '', // 图片预览
    modalVisible: false,
    selectorModalVisible: false, // 素材选择器
    selectedShowMapImgUrl: '', // 素材选择器结果
    operation: 'add', // or: 'update'
    data: {
      mapId: -1,
      name: '',
      showHallName: '',
      floor: 1,
      width: -1,
      height: -1,
      imageId: -1,
      imageWidth: -1,
      imageHeight: -1,
    },
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
  /* 表单上传数据 在这里汇合 */
  onFormDataChange = (changedFields) => {
    this.setState({
      data: { ...this.state.data, ...changedFields },
    });
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
  openAddMapModal = () => {
    this.setState({
      operation: 'add',
      data: {
        mapId: -1,
        name: '',
        showHallName: '',
        floor: 1,
        width: '',
        height: '',
        imageId: -1,
        imageWidth: -1,
        imageHeight: -1,
      },
      selectedShowMapImgUrl: '',
    });
    this.setState({
      modalVisible: true,
    });
  }
  handleModalOk = () => {
    const { data } = this.state;
    if (this.state.operation === 'add') {
      // 增加
      this.props.dispatch({
        type: 'showmap/addOneShowMap',
        payload: {
          showId: this.state.showId,
          name: data.name,
          showHallName: data.showHallName,
          floor: data.floor,
          width: data.imageWidth,
          height: data.imageHeight,
          imageId: data.imageId,
        },
      });
    } else if (this.state.operation === 'update') {
      // 修改
      this.props.dispatch({
        type: 'showmap/updateOneShowMap',
        payload: {
          showId: this.state.showId,
          mapId: data.mapId,
          name: data.name,
          showHallName: data.showHallName,
          floor: data.floor,
          width: data.imageWidth,
          height: data.imageHeight,
          imageId: data.imageId,
        },
      });
    }
    this.setState({
      modalVisible: false,
    });
  }
  handleModalCancel = () => {
    this.setState({
      modalVisible: false,
    });
  }
  handleMenuClick = (record, e) => {
    console.log(record)
    if (e.key === '1') {
      this.setState({
        viewModalImageUrl: record.image.url,
      });
      this.openViewModal();
    }
    if (e.key === '2') {
      this.setState({
        data: {
          mapId: record.id,
          name: record.name,
          showHallName: record.showHallName,
          floor: record.floor,
          width: record.width || 1000,
          height: record.height || 1000,
          imageId: record.image.id,
          imageWidth: record.width || 1000,
          imageHeight: record.height || 1000,
        },
        selectedShowMapImgUrl: record.image.url,
      });
      console.log(this.state.data);
      this.setState({
        operation: 'update',
        modalVisible: true,
      });
    }
    if (e.key === '3') {
      const that = this;
      Modal.confirm({
        title: '确定要删除该地图信息吗？',
        cancelText: '取消',
        okText: '确定',
        onOk() {
          that.deleteShowMap(record.id);
        },
      });
    }
  };
  deleteShowMap = (id) => {
    this.props.dispatch({
      type: 'showmap/deleteShowMap',
      payload: {
        showId: this.state.showId,
        mapId: id,
      },
    });
  }
  openSelectorModal = () => {
    this.setState({
      selectorModalVisible: true,
    });
  }
  closeSelectorModal = () => {
    this.setState({
      selectorModalVisible: false,
    });
  }
  handleShowMapSelected = (type, value) => {
    if (type === 'picture') {
      //
      // message.info(value[0].url);
      this.setState({
        selectedShowMapImgUrl: value[0].url,
        selectorModalVisible: false,
        data: {
          ...this.state.data,
          imageId: value[0].id,
          imageWidth: value[0].width,
          imageHeight: value[0].height,
        },
      });
    }
  }
  // view 地图图片
  closeViewModal = () => {
    this.setState({
      viewModalVisible: false,
    });
  }
  openViewModal = () => {
    this.setState({
      viewModalVisible: true,
    });
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
    title: '展厅',
    dataIndex: 'showHallName',
    key: 'showHallName',
  }, {
    title: '楼层',
    dataIndex: 'floor',
    key: 'floor',
    render: text => {
      return (<label style={{ cursor: 'initial' }} size="small">{`${transNum2ZhongWen(text)}楼`}</label>);
    },
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
    title: '操作',
    key: 'operation',
    render: (text, record) => (
      <div>
        <Menu onClick={e => this.handleMenuClick(record, e)}
              mode="vertical"
              style={{ float: 'left', border: 'none', background: 'rgba(0, 0, 0, 0)' }}>
          <Menu.Item key="1" style={{ float: 'left', backgroundColor: 'rgba(0, 0, 0, 0)', color: 'rgba(0, 0, 0, 0.65)' }}>查看</Menu.Item>
          <Menu.Item key="2" style={{ float: 'left', backgroundColor: 'rgba(0, 0, 0, 0)', color: 'rgba(0, 0, 0, 0.65)' }}>修改</Menu.Item>
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
        <div style={{ float: 'right' }}>
          <Button size="large" onClick={this.openAddMapModal}><a href={`#/shows/${this.state.showId}/all`}> 回到展览 </a></Button>
          <Button size="large" onClick={this.openAddMapModal} style={{ marginLeft: 20 }}> 添加地图 </Button>
        </div>
      </div>
    );
    const modal = (
      <CollectionCreateForm
        title="展览地图"
        visible={this.state.modalVisible}
        onCreate={this.handleModalOk}
        onCancel={this.handleModalCancel}
        okText="确定"
        {...this.state.data} /* 表单数据 */
        onChange={this.onFormDataChange}
        selectMap={this.openSelectorModal}
        imgUrl={this.state.selectedShowMapImgUrl}
        initValues={this.state.data}
      />
    );
    const viewModal = (
      <Modal
        style={{ minWidth: 800 }}
        visible={this.state.viewModalVisible}
        title="查看地图"
        onCancel={this.closeViewModal}
        onOk={this.closeViewModal}
      >
        <img alt="地图图片" style={{ width: '96%' }} src={this.state.viewModalImageUrl} />
      </Modal>
    );
    const selector = (
      <MaterialSelecter
        visible={this.state.selectorModalVisible}
        handleSelected={this.handleShowMapSelected}
        onCancel={this.closeSelectorModal}
        isSingleSelect="true"
        availableType={['picture']}
        showId={this.state.showId}
      />);
    return (
      <div>
        <PageHeaderLayout
          title={`「${this.state.showTitle}」展览地图`}
          content={mainSearch}
        >
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
        </PageHeaderLayout>
        {this.state.modalVisible ? modal : ''}
        {this.state.viewModalVisible ? viewModal : ''}
        {this.state.selectorModalVisible ? selector : ''}
      </div>
    );
  }
}

/* 弹出 Modal 添加内容 */
const FormItem = Form.Item;

const CollectionCreateForm = Form.create({
  onFieldsChange(props, changedFields) {
    // props.onChange(changedFields);
  },
  onValuesChange(props, values) {
    console.log(values);
    props.onChange(values);
  },
  // mapPropsToFields(props) {
  //   return {
  //     name: Form.createFormField({
  //       ...props,
  //       value: props.name,
  //     }),
  //     length: Form.createFormField({
  //       ...props,
  //       value: props.length,
  //     }),
  //     size: Form.createFormField({
  //       ...props,
  //       value: props.size,
  //     }),
  //   };
  // },
})((props) => {
  const {
    title, visible, onCancel, onCreate, form, okText, selectMap, imgUrl, initValues,
  } = props;
  const { getFieldDecorator } = form;
  return (
    <Modal
      visible={visible}
      title={title}
      okText={okText}
      onCancel={onCancel}
      onOk={onCreate}
    >
      <Form layout="vertical">
        <FormItem label="地图名称">
          {getFieldDecorator('name', {
            rules: [{ required: true, message: '请输入地图名称！' }],
            initialValue: initValues.name,
          })(<Input />)}
        </FormItem>
        <FormItem label="展厅名称">
          {getFieldDecorator('showHallName', {
            rules: [{ required: true, message: '请输入展厅名称！' }],
            initialValue: initValues.showHallName,
          })(<Input />)}
        </FormItem>
        <FormItem label="所在楼层">
          {getFieldDecorator('floor', {
            rules: [{ required: true, message: '请输入所在楼层！' }],
            initialValue: initValues.floor,
          })(<InputNumber style={{ width: '50%' }} placeholder="请输入所在楼层" />)}
        </FormItem>
        {/*<FormItem label="地图尺寸【长】（单位：厘米，整数）">*/}
          {/*{getFieldDecorator('height', {*/}
            {/*rules: [{ required: true, message: '请输入长度！' }],*/}
            {/*initialValue: initValues.height,*/}
          {/*})(<Input type="number" />)}*/}
        {/*</FormItem>*/}
        {/*<FormItem label="地图尺寸【宽】（单位：厘米，整数）">*/}
          {/*{getFieldDecorator('width', {*/}
            {/*rules: [{ required: true, message: '请输入宽度！' }],*/}
            {/*initialValue: initValues.width,*/}
          {/*})(<Input type="number" />)}*/}
        {/*</FormItem>*/}
        <FormItem>
          <Button onClick={selectMap}> 选择地图 </Button>
          { imgUrl !== undefined && imgUrl.length > 1 &&
          (<img style={{ marginTop: 20, width: '100%' }} alt="请选择地图" src={imgUrl} />)}
        </FormItem>
      </Form>
    </Modal>
  );
}
);


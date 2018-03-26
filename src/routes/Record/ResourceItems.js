/**
 * Created by neo on 18/3/2018.
 */

import React, {PureComponent} from 'react';
import {Form, Select, Card, DatePicker, message, List, Input, Dropdown, Menu, Button, Icon} from 'antd';
import {connect} from 'dva';
import moment from 'moment';
import {Chart, Axis, Geom, Tooltip, Legend} from 'bizcharts';
import {View, DataSet} from '@antv/data-set';
import {getTimeYYYYMMDD} from '../../utils/utils';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;

/* 主界面 */
@connect(({record, loading}) => ({
  record,
  loading: loading.effects['record/listResourceItems'],
}))
@Form.create()
export default class ResourceItems extends PureComponent {
  state = {
    startDay: getTimeYYYYMMDD(new Date(new Date().getTime() - 8 * (60 * 60 * 24 * 1000))),
    endDay: getTimeYYYYMMDD(new Date(new Date().getTime() - (60 * 60 * 24 * 1000))),
  }

  componentWillMount() {
    this.props.dispatch({
      type: 'record/getShowsData',
    });
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { selectedItemIds } = values;
        let itemIds = '';
        for (let i = 0; i < selectedItemIds.length; i += 1) {
          if (i < selectedItemIds.length - 1) {
            itemIds += `${selectedItemIds[i]},`;
          } else {
            itemIds += `${selectedItemIds[i]}`;
          }
        }
        const start = values.date[0].format('YYYYMMDD');
        const end = values.date[1].format('YYYYMMDD');
        this.setState({
          startDay: start,
          endDay: end,
        });
        this.props.dispatch({
          type: 'record/listResourceItems',
          payload: {
            startDay: start,
            endDay: end,
            itemIds,
          },
        });
      }
    });
  }
  handleChange = (value) => {
    console.log(`selected ${value}`);
    this.props.dispatch({
      type: 'record/getResourceGroupsData',
      payload: {
        showId: value,
      },
    });
  }

  handleChange2 = (value) => {
    console.log(`selected ${value}`);
    this.props.dispatch({
      type: 'record/getResourceItemsData',
      payload: {
        groupId: value,
      },
    });
  }

  transferData = (data) => {
    if (data === undefined || data.length === 0){
      return { data: [], fields: [] };
    }
    const dd = [];
    const fields = [];
    for (let i = 0; i < data[0].records.length; i += 1) {
      let item = {
        date: data[0].records[i].day,
      };
      for (let k = 0; k < data.length; k += 1) {
        item[data[k].name] = data[k].records[i].times;
      }
      dd.push(item);
    }
    // fields
    for (let k = 0; k < data.length; k += 1) {
      fields.push(data[k].name);
    }
    return {
      data: dd,
      fields,
    };
  }

  render() {
    const { data, fields } = this.transferData(this.props.record.resourceItems);
    const ds = new DataSet();
    const dv = ds.createView().source(data);
    dv.transform({
      type: 'fold',
      fields, // 展开字段集
      key: '访问量', // key字段
      value: '浏览次数', // value字段
    });
    console.log(dv);
    const cols = {
      date: {
        range: [0, 1]
      }
    }

    const { submitting } = this.props;
    const { getFieldDecorator, getFieldValue } = this.props.form;

    return (
      <div>
        <Card border="false">
          <Form
            onSubmit={this.handleSubmit}
            hideRequiredMark
            style={{ marginTop: 8, width: '50%' }}
          >
            <FormItem style={{ marginBottom: 0 }}
              // label="起止日期"
            >
              {getFieldDecorator('date', {
                rules: [{
                  required: true, message: '请选择起止日期',
                }],
              })(
                <RangePicker style={{ margin: '8px 0', width: '100%' }} placeholder={['开始日期', '结束日期']} />
              )}
            </FormItem>
            <FormItem style={{ marginBottom: 0 }}>
              {getFieldDecorator('selectedShowId')(
                <Select
                  // mode="multiple"
                  placeholder="选择需要展示的展览"
                  onChange={this.handleChange}
                  style={{
                    margin: '8px 0',
                  }}
                >
                  { this.props.record.showsData.map(item => (<Option value={item.id}>{`${item.title}`}</Option>)) }
                </Select>
              )}
            </FormItem>
            <FormItem style={{ marginBottom: 0 }}>
              {getFieldDecorator('selectedGroupId')(
                <Select
                  // mode="multiple"
                  placeholder="选择需要展示的资源组"
                  onChange={this.handleChange2}
                  style={{
                    margin: '8px 0',
                  }}
                >
                  { this.props.record.resourceGroupsData.map(item => (<Option value={item.id}>{`${item.title}`}</Option>)) }
                </Select>
              )}
            </FormItem>
            <FormItem style={{ marginBottom: 0 }}>
              {getFieldDecorator('selectedItemIds')(
                <Select
                  mode="multiple"
                  placeholder="选择需要展示的资源"
                  style={{
                    margin: '8px 0',
                  }}
                  value={this.state.groupIds}
                >
                  { this.props.record.resourceItemsData.map(item => (<Option value={item.id}>{`${item.title}`}</Option>)) }
                </Select>
              )}
            </FormItem>
            <FormItem style={{ marginBottom: 32 }}>
              <Button type="primary" htmlType="submit" loading={submitting}>
                确认
              </Button>
            </FormItem>
          </Form>

          <Chart height={400} data={dv} scale={cols} forceFit>
            <Legend />
            <Axis name="date"/>
            <Axis name="浏览次数" title="浏览次数" label={{formatter: val => `${val}`}}/>
            <Tooltip crosshairs={{type: "y"}}/>
            <Geom type="line" position="date*浏览次数" size={2} color={'访问量'} shape={'smooth'}/>
            <Geom type='point' position="date*浏览次数" size={4} shape={'circle'} color={'访问量'}
                  style={{stroke: '#fff', lineWidth: 1}}/>
          </Chart>
        </Card>
      </div>);
  }
}

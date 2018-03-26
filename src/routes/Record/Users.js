/**
 * Created by neo on 18/3/2018.
 */

import React, { PureComponent } from 'react';
import { Row, Col, Card, DatePicker, message, List, Input, Dropdown, Menu, Button, Icon } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import { Chart, Axis, Geom, Tooltip, Legend } from 'bizcharts';
import { View, DataSet } from '@antv/data-set';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { getTimeYYYYMMDD } from '../../utils/utils';

/* 主界面 */
@connect(({ record, loading }) => ({
  record,
  loading: loading.effects['record/listUsers'],
}))
export default class Users extends PureComponent {
  state = {
    startDay: getTimeYYYYMMDD(new Date(new Date().getTime() - 8*(60*60*24*1000))),
    endDay: getTimeYYYYMMDD(new Date(new Date().getTime() - (60*60*24*1000))),
  }
  componentWillMount() {
    this.props.dispatch({
      type: 'record/listUsers',
      payload: {
        startDay: getTimeYYYYMMDD(new Date(new Date().getTime() - 8*(60*60*24*1000))),
        endDay: getTimeYYYYMMDD(new Date(new Date().getTime() - (60*60*24*1000))),
      },
    });
  }
  onChange = (date, dateString) => {
    console.log(date, dateString);
    if (date.length < 2) {
      return;
    }
    const start = date[0].format('YYYYMMDD');
    const end = date[1].format('YYYYMMDD');
    this.setState({
      startDay: start,
      endDay: end,
    });
    this.props.dispatch({
      type: 'record/listUsers',
      payload: {
        startDay: start,
        endDay: end,
      },
    });
  }

  transferData = (data) => {
    const dd = [];
    if (data.nick === undefined || data.nick.length === 0
    || data.registed === undefined || data.registed.length === 0) {
      return [];
    }
    let dayCounts = data.nick.length;
    for (let i = 0; i < dayCounts; i += 1) {
      dd.push({
        date: data.nick[i].day,
        匿名用户: data.nick[i].times,
        已注册用户: data.registed[i].times,
      });
    }
    return dd;
  }

  render() {
    const ds = new DataSet();
    const dv = ds.createView().source(this.transferData(this.props.record.users));
    dv.transform({
      type: 'fold',
      fields: [ '匿名用户', '已注册用户' ], // 展开字段集
      key: '用户数', // key字段
      value: '日活跃人数', // value字段
    });
    // console.log(dv);
    const cols = {
      date: {
        range: [ 0, 1 ]
      }
    }
    const mainSearch = (
      <div>
        <DatePicker.RangePicker
          onChange={this.onChange}
          initialValue={[ moment(new Date(new Date().getTime() - 8*(60*60*24*1000))), moment(new Date(new Date().getTime() - (60*60*24*1000))) ]}
        />
      </div>
    );

    return (
      <div>
        <PageHeaderLayout
          title="用户活跃情况"
          content={mainSearch}
        >
          <Card border="false">
            <Chart height={400} data={dv} scale={cols} forceFit>
              <Legend />
              <Axis name="date" />
              <Axis name="日活跃人数" title="日活跃人数" label={{formatter: val => `${val}`}}/>
              <Tooltip crosshairs={{type : "y"}}/>
              <Geom type="line" position="date*日活跃人数" size={2} color={'用户数'} shape={'smooth'} />
              <Geom type='point' position="date*日活跃人数" size={4} shape={'circle'} color={'用户数'} style={{ stroke: '#fff', lineWidth: 1}} />
            </Chart>
          </Card>
        </PageHeaderLayout>
      </div>);
  }
}

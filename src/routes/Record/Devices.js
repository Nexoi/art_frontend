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
  loading: loading.effects['record/listDevices'],
}))
export default class Devices extends PureComponent {
  state = {
    // startDay: getTimeYYYYMMDD(new Date(new Date().getTime() - 8*(60*60*24*1000))),
    // endDay: getTimeYYYYMMDD(new Date(new Date().getTime() - (60*60*24*1000))),
    data: [],
    startMoment: moment(new Date(new Date().getTime() - 8*(60*60*24*1000))),
    endMoment: moment(new Date(new Date().getTime() - (60*60*24*1000))),
  }
  componentWillMount() {
    this.props.dispatch({
      type: 'record/listDevices',
      payload: {
        startDay: this.state.startMoment.format('YYYYMMDD'),
        endDay: this.state.endMoment.format('YYYYMMDD'),
      },
    });
  }
  componentWillReceiveProps(nextProps) {
    const data = nextProps.record.devices;
    // this.loadChart(data);
  }
  componentDidMount() {
    const data = this.props.record.devices;
    // this.loadChart(data);
  }
  // loadChart = (data) => {
  //   if (data === undefined || data.ars === undefined) {
  //     return;
  //   }
  //   const days = [];
  //   const ar = [];
  //   const beacon = [];
  //   const qrcode = [];
  //   const day = parseInt(this.state.endDay) - parseInt(this.state.startDay);
  //   for (let i = 0; i < day; i += 1) {
  //     let currentDay = '';
  //     if (i < data.ars.length) {
  //       ar.push(data.ars[i].times);
  //       currentDay = data.ars[i].day;
  //     } else {
  //       ar.push(0);
  //       currentDay = undefined;
  //     }
  //     if (i < data.beacons.length) {
  //       beacon.push(data.beacons[i].times);
  //       if (currentDay === undefined) {
  //         currentDay = data.beacons[i].day;
  //       }
  //     } else {
  //       beacon.push(0);
  //       currentDay = undefined;
  //     }
  //     if (i < data.qrcodes.length) {
  //       qrcode.push(data.qrcodes[i].times);
  //       if (currentDay === undefined) {
  //         currentDay = data.qrcodes[i].day;
  //       }
  //     } else {
  //       qrcode.push(0);
  //       currentDay = '';
  //     }
  //     days.push(currentDay);
  //   }
  // }
  onChange = (date, dateString) => {
    console.log(date, dateString);
    if (date.length < 2) {
      return;
    }
    this.setState({
      startMoment: date[0],
      endMoment: date[1],
    });
    this.props.dispatch({
      type: 'record/listDevices',
      payload: {
        startDay: date[0].format('YYYYMMDD'),
        endDay: date[1].format('YYYYMMDD'),
      },
    });
  }

  transferData = (data) => {
    const dd = [];
    if (data.ars === undefined || data.ars.length === 0
    || data.beacons === undefined || data.beacons.length === 0
    || data.qrcodes === undefined || data.qrcodes.length === 0) {
      return [];
    }
    let dayCounts = data.ars.length;
    for (let i = 0; i < dayCounts; i += 1) {
      dd.push({
        date: data.ars[i].day,
        AR: data.ars[i].times,
        Beacon: data.beacons[i].times,
        二维码: data.qrcodes[i].times,
      });
    }
    return dd;
  }

  render() {
    const ds = new DataSet();
    const dv = ds.createView().source(this.transferData(this.props.record.devices));
    dv.transform({
      type: 'fold',
      fields: [ 'AR', 'Beacon', '二维码' ], // 展开字段集
      key: '设备', // key字段
      value: '触发次数', // value字段
    });
    console.log(dv);
    const cols = {
      date: {
        range: [ 0, 1 ]
      }
    }
    const mainSearch = (
      <div>
        <DatePicker.RangePicker
          onChange={this.onChange}
          value={[ this.state.startMoment, this.state.endMoment ]}
        />
      </div>
    );

    return (
      <div>
        <PageHeaderLayout
          title="设备使用情况"
          content={mainSearch}
        >
          <Card border="false">
            <Chart height={400} data={dv} scale={cols} forceFit>
              <Legend />
              <Axis name="date" />
              <Axis name="触发次数" label={{formatter: val => `${val}`}}/>
              <Tooltip crosshairs={{type : "y"}}/>
              <Geom type="line" position="date*触发次数" size={2} color={'设备'} shape={'smooth'} />
              <Geom type='point' position="date*触发次数" size={4} shape={'circle'} color={'设备'} style={{ stroke: '#fff', lineWidth: 1}} />
            </Chart>
          </Card>
        </PageHeaderLayout>
      </div>);
  }
}

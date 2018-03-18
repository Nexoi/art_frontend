/**
 * Created by neo on 15/3/2018.
 */

import React, { PureComponent } from 'react';

export default class MapPositionEditor extends PureComponent {
  state = {
    // url: 'http://p2l82fhwg.bkt.clouddn.com/artshowac2490ba-f147-4425-b570-a44b1b8c8602',
    width: this.props.positionWidth || 0,
    height: this.props.positionHeight || 0,
    url: this.props.imageUrl,
  }
  componentDidMount() {
    const canvas = document.getElementById('canvas');
    const context2D = canvas.getContext('2d');
    const pic = new Image();
    pic.src = this.state.url;
    pic.onload = function () {
      context2D.drawImage(pic, 0, 0, 800, 600);
    }
    // 初始化 icon
    if (this.state.width !== 0) {
      context2D.font = '28px FontAwesome';
      context2D.fillStyle = '#DD3322';
      context2D.shadowOffsetX = 3;
      context2D.shadowOffsetY = 3;
      context2D.shadowColor = 'rgba(0,0,0,0.3)';
      context2D.fillText('\uF041', this.state.width * 800, this.state.height * 600);
    }
    canvas.addEventListener('mousedown', (e) => {
      // 清空画布内容
      context2D.clearRect(0, 0, canvas.width, canvas.height);
      context2D.drawImage(pic, 0, 0, 800, 600);
      // 画 icon
      const eve = e || window.event;
      function getPointOnCanvas() {
        const bbox = canvas.getBoundingClientRect();
        return {
          x: eve.clientX - (bbox.left * (canvas.width / bbox.width)) - 10,
          y: eve.clientY - (bbox.top * (canvas.height / bbox.height)),
        };
      }
      const { x, y } = getPointOnCanvas();
      console.log({ x, y });
      context2D.font = '28px FontAwesome';
      context2D.fillStyle = '#DD3322';
      context2D.shadowOffsetX = 3;
      context2D.shadowOffsetY = 3;
      context2D.shadowColor = 'rgba(0,0,0,0.3)';
      context2D.fillText('\uF041', x, y);
      // 外界回调
      if (this.props.onSelect !== undefined) {
        this.props.onSelect(x / 800, y / 600);
      }
    }, false);
  }
  render() {
    return (
      <canvas id="canvas" width="800px" height="600px">
        <p>Your browser does not support the canvas element!</p>
      </canvas>
    );
  }
}

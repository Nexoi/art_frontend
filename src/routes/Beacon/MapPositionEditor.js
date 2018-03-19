/**
 * Created by neo on 15/3/2018.
 */

import React, { PureComponent } from 'react';

export default class MapPositionEditor extends PureComponent {
  state = {
    // url: 'http://p2l82fhwg.bkt.clouddn.com/artshowac2490ba-f147-4425-b570-a44b1b8c8602',
    width: this.props.positionWidth || 0,
    height: this.props.positionHeight || 0,
    imageWidth: this.props.imageWidth || 800,
    imageHeight: this.props.imageHeight || 800,
    url: this.props.imageUrl,
  }
  componentDidMount() {
    const { imageWidth, imageHeight } = this.state;
    console.log({ imageWidth, imageHeight })
    const suit = this.getSuitRect(imageWidth, imageHeight);
    const canvas = document.getElementById('canvas');
    const context2D = canvas.getContext('2d');
    const pic = new Image();
    pic.src = this.state.url;
    pic.onload = function () {
      context2D.drawImage(pic, 0, 0, suit.width, suit.height);
    }
    // 初始化 icon
    if (this.state.width !== 0) {
      context2D.font = '28px FontAwesome';
      context2D.fillStyle = '#DD3322';
      context2D.shadowOffsetX = 3;
      context2D.shadowOffsetY = 3;
      context2D.shadowColor = 'rgba(0,0,0,0.3)';
      context2D.fillText('\uF041', this.state.width * suit.width, this.state.height * suit.height);
    }
    canvas.addEventListener('mousedown', (e) => {
      // 清空画布内容
      context2D.clearRect(0, 0, canvas.width, canvas.height);
      context2D.drawImage(pic, 0, 0, suit.width, suit.height);
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
        this.props.onSelect(x / suit.width, y / suit.height);
      }
    }, false);
  }
  getSuitRect = (width, height) => {
    if ( width < 800 && height < 800) {
      return { width, height };
    }
    if ( width > height) {
      let ratio = 800 / width;
      let h = height * ratio;
      return { width: 800, height: h };
    }
    if ( width < height) {
      let ratio = 800 / height;
      let w = width * ratio;
      return { width: w, height: 800 };
    }
  }
  render() {
    const { imageWidth, imageHeight } = this.state;
    const suit = this.getSuitRect(imageWidth, imageHeight);
    return (
      <canvas id="canvas" width={`${suit.width}px`} height={`${suit.height}px`}>
        <p>Your browser does not support the canvas element!</p>
      </canvas>
    );
  }
}

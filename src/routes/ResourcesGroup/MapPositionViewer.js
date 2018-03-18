/**
 * Created by neo on 15/3/2018.
 */

import React, { PureComponent } from 'react';

export default class MapPositionViewer extends PureComponent {
  state = {
    // url: 'http://p2l82fhwg.bkt.clouddn.com/artshowac2490ba-f147-4425-b570-a44b1b8c8602',
    width: 740 * (this.props.positionWidth || 0),
    height: 560 * (this.props.positionHeight || 0),
    url: this.props.imageUrl,
  }
  componentDidMount() {
    const { width, height } = this.state;
    const x = width + 30;
    const y = height + 20;
    console.log({ x, y })
    const canvas = document.getElementById('canvas');
    const context2D = canvas.getContext('2d');
    const pic = new Image();
    pic.src = this.state.url;
    pic.onload = function () {
      context2D.drawImage(pic, 30, 20, 740, 560);
      // 画 icon
      context2D.font = '28px FontAwesome';
      context2D.fillStyle = '#DD3322';
      context2D.shadowOffsetX = 3;
      context2D.shadowOffsetY = 3;
      context2D.shadowColor = 'rgba(0,0,0,0.3)';
      context2D.fillText('\uF041', x, y);
    };
  }
  render() {
    return (
      <canvas id="canvas" width="800px" height="600px">
        <p>Your browser does not support the canvas element!</p>
      </canvas>
    );
  }
}

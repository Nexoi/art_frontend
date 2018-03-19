/**
 * Created by neo on 15/3/2018.
 */

import React, { PureComponent } from 'react';

export default class MapPositionViewer extends PureComponent {
  state = {
    // url: 'http://p2l82fhwg.bkt.clouddn.com/artshowac2490ba-f147-4425-b570-a44b1b8c8602',
    positionWidth: this.props.positionWidth || 0,
    positionHeight: this.props.positionHeight || 0,
    imageWidth: this.props.imageWidth || 728,
    imageHeight: this.props.imageHeight || 728,
    url: this.props.imageUrl,
  }
  componentDidMount() {
    // const { positionWidth, positionHeight, imageWidth, imageHeight } = this.state;
    const { width, height, positionWidth, positionHeight } = this.getSuitRect(
      this.state.imageWidth,
      this.state.imageHeight,
      this.state.positionWidth,
      this.state.positionHeight
    );
    const x = positionWidth + 36;
    const y = positionHeight + 36;
    // console.log({
    //     a: this.state.imageWidth,
    //     b: this.state.imageHeight,
    //     c: this.state.positionWidth,
    //     d: this.state.positionHeight,
    // })
    // console.log({ x, y, width, height })
    const canvas = document.getElementById('canvas');
    const context2D = canvas.getContext('2d');
    const pic = new Image();
    pic.src = this.state.url;
    pic.onload = function () {
      context2D.drawImage(pic, 36, 36, width, height);
      // 画 icon
      context2D.font = '28px FontAwesome';
      context2D.fillStyle = '#DD3322';
      context2D.shadowOffsetX = 3;
      context2D.shadowOffsetY = 3;
      context2D.shadowColor = 'rgba(0,0,0,0.3)';
      context2D.fillText('\uF041', x, y);
    };
  }
  getSuitRect = (width, height, positionWidth, positionHeight) => {
    if ( width < 728 && height < 728) {
      return { width, height, positionWidth, positionHeight };
    }
    if ( width > height) {
      let ratio = 728 / width;
      let h = height * ratio;
      return { width: 728, height: h, positionWidth: positionWidth * ratio, positionHeight: positionHeight * ratio };
    }
    if ( width < height) {
      let ratio = 728 / height;
      let w = width * ratio;
      return { width: w, height: 728, positionWidth: positionWidth * ratio, positionHeight: positionHeight * ratio };
    }
  }
  render() {
    const { imageWidth, imageHeight } = this.state;
    const suit = this.getSuitRect(imageWidth, imageHeight, 0, 0 );
    return (
      <canvas id="canvas" width={`${suit.width + 72}px`} height={`${suit.height + 72}px`}>
        <p>Your browser does not support the canvas element!</p>
      </canvas>
    );
  }
}

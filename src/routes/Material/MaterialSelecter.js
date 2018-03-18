/**
 * Created by neo on 13/3/2018.
 */
import React, { PureComponent } from 'react';
import { Tabs, Modal, message } from 'antd';
import AudioSelector from './Audio/AudioSelector';
import PictureSelector from './Picture/PictureSelector';
import VideoSelector from './Video/VideoSelector';

export default class MaterialSelecter extends PureComponent {
  state = {
    type: 'audio', // default
    selectedItems: [],
    availableType: ['audio', 'picture', 'video'],
  }

  componentWillMount() {
    if (this.props.availableType !== undefined && this.props.availableType.length > 0) {
      this.setState({
        type: this.props.availableType[0],
        availableType: this.props.availableType,
      });
    }
  }
  onOk = () => {
    if (this.state.selectedItems.length === 0) {
      message.warn('请选择素材');
      return;
    }
    if (this.props.isSingleSelect === 'true') {
      //
      if (this.state.selectedItems.length > 1) {
        message.warn('只能选择一个素材');
        return;
      }
    }
    this.props.handleSelected(this.state.type, this.state.selectedItems);
  }
  onCancel = () => {
    this.props.onCancel();
  }
  onTabChange = (key) => {
    this.setState({
      type: key,
    });
  }
  //
  onSelectedChange = (selectedItems) => {
    this.setState({
      selectedItems,
    });
  }
  render() {
    return (
      <div>
        <Modal
          style={{ minWidth: 800 }}
          visible={this.props.visible}
          title="选择素材"
          okText="确定"
          onCancel={this.onCancel}
          onOk={this.onOk}
        >
          <Tabs defaultActiveKey={this.state.availableType[0]} onChange={this.onTabChange}>
            {this.state.availableType.indexOf('audio') !== -1 && (
              <Tabs.TabPane tab="音频" key="audio">
                <AudioSelector
                  onSelectedChange={this.onSelectedChange}
                />
              </Tabs.TabPane>
            )}
            {this.state.availableType.indexOf('picture') !== -1 && (
              <Tabs.TabPane tab="图片" key="picture">
                <PictureSelector
                  onSelectedChange={this.onSelectedChange}
                />
              </Tabs.TabPane>
            )}
            {this.state.availableType.indexOf('video') !== -1 && (
              <Tabs.TabPane tab="视频" key="video">
                <VideoSelector
                  onSelectedChange={this.onSelectedChange}
                />
              </Tabs.TabPane>
            )}
          </Tabs>
        </Modal>
      </div>
    );
  }
}

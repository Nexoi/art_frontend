/**
 * Created by neo on 28/2/2018.
 */
import React, { PureComponent } from 'react';
import { Input, Icon } from 'antd';

/* 可编辑单元格 */
export default class EditableCell extends PureComponent {
  state = {
    id: this.props.id,
    value: this.props.value,
    editable: false,
  }
  handleChange = (e) => {
    const { id, value } = e.target;
    this.setState({ id, value });
  }
  check = () => {
    this.setState({ editable: false });
    if (this.props.onChange) {
      this.props.onChange(this.state.id, this.state.value);
    }
  }
  edit = () => {
    this.setState({ editable: true });
  }

  render() {
    const { id, value, editable } = this.state;
    return (
      <div className="editable-cell">
        {
          editable ? (
            <div className="editable-cell-input-wrapper">
              <Input
                id={id}
                value={value}
                onChange={this.handleChange}
                onPressEnter={this.check}
              />
              <Icon
                type="check"
                className="editable-cell-icon-check"
                onClick={this.check}
              />
            </div>
          ) : (
            <div className="editable-cell-text-wrapper">
              {value || ' '}
              <Icon
                type="edit"
                className="editable-cell-icon"
                onClick={this.edit}
              />
            </div>
          )}
      </div>
    );
  }
}

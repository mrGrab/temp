import React from "/vendor/react";
import PropTypes from "prop-types";
import ResizeObserver from "/vendor/react-resize-observer";

import Context from "./context";

class Item extends React.PureComponent {
  static displayName = "ToolbarMenu.Item";

  static propTypes = {
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
    onResize: PropTypes.func,
    visible: PropTypes.oneOf(["if-room", "always", "never"]), // eslint-disable-line react/no-unused-prop-types
  };

  static defaultProps = {
    children: undefined,
    onResize: null,
    visible: "if-room",
  };

  render() {
    const { children: childrenProp } = this.props;

    let children = childrenProp;
    if (typeof children === "function") {
      children = <Context.Consumer>{childrenProp}</Context.Consumer>;
    }

    if (this.props.onResize) {
      return (
        <div style={{ position: "relative", display: "inline" }}>
          <ResizeObserver onResize={this.props.onResize} />
          {children}
        </div>
      );
    }

    return children;
  }
}

export default Item;

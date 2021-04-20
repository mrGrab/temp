import React from "/vendor/react";
import ReactDOM from "/vendor/react-dom";
import PropTypes from "prop-types";

import { Popover, MenuList } from "/vendor/@material-ui/core";

class OverflowMenu extends React.Component {
  static propTypes = {
    anchorEl: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired,
    id: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
  };

  menuListRef = null;

  componentDidMount() {
    this.focus();
  }

  focus = () => {
    if (this.menuListRef && this.menuListRef.selectedItemRef) {
      // eslint-disable-next-line react/no-find-dom-node
      ReactDOM.findDOMNode(this.menuListRef.selectedItemRef).focus();
      return;
    }

    // eslint-disable-next-line react/no-find-dom-node
    const menuList = ReactDOM.findDOMNode(this.menuListRef);
    if (menuList && menuList.firstChild) {
      menuList.firstChild.focus();
    }
  };

  handleEnter = () => {
    // const { disableAutoFocusItem, theme } = this.props;
    this.focus();

    // const menuList = ReactDOM.findDOMNode(this.menuListRef);

    // Let's ignore that piece of logic if users are already overriding the width
    // of the menu.
    // if (menuList && element.clientHeight < menuList.clientHeight && !menuList.style.width) {
    //   const size = `${getScrollbarSize()}px`;
    //   menuList.style[theme.direction === 'rtl' ? 'paddingLeft' : 'paddingRight'] = size;
    //   menuList.style.width = `calc(100% + ${size})`;
    // }
  };

  handleListKeyDown = (event, key) => {
    if (key === "tab") {
      event.preventDefault();

      if (this.props.onClose) {
        this.props.onClose(event);
      }
    }
  };

  render() {
    const { id, anchorEl, children, onClose } = this.props;

    return (
      <Popover
        id={id}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open
        onEnter={this.handleEnter}
        onClose={onClose}
      >
        <MenuList
          onKeyDown={this.handleListKeyDown}
          ref={ref => {
            this.menuListRef = ref;
          }}
        >
          {children}
        </MenuList>
      </Popover>
    );
  }
}
export default OverflowMenu;

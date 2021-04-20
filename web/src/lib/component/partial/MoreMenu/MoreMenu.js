import React from "/vendor/react";
import PropTypes from "prop-types";

import { IconButton, Menu, RootRef } from "/vendor/@material-ui/core";

import { MenuController } from "/lib/component/controller";
import { KebabIcon } from "/lib/component/icon";

class MoreMenu extends React.PureComponent {
  static propTypes = {
    renderMenu: PropTypes.func.isRequired,
  };

  renderMenu = ({ anchorEl, idx, close }) => {
    const { renderMenu } = this.props;

    return (
      <Menu id={idx} anchorEl={anchorEl} open onClose={close}>
        {renderMenu({ close })}
      </Menu>
    );
  };

  renderButton = renderProps => {
    const { idx, open, ref } = renderProps;

    return (
      <RootRef rootRef={ref}>
        <IconButton
          aria-label="More"
          aria-owns={idx}
          aria-haspopup="true"
          color="inherit"
          onClick={open}
        >
          <KebabIcon />
        </IconButton>
      </RootRef>
    );
  };

  render() {
    return (
      <MenuController renderMenu={this.renderMenu}>
        {this.renderButton}
      </MenuController>
    );
  }
}

export default MoreMenu;

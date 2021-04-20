import React from "/vendor/react";
import PropTypes from "prop-types";

import { ToolbarMenuContext } from "/lib/component/partial/ToolbarMenu";

import Button from "./Button";
import CollapsedItem from "./CollapsedItem";

class Item extends React.Components {
  static displayName = "ToolbarMenuItems.Item";

  static propTypes = {
    autoClose: PropTypes.bool,
    description: PropTypes.node,
    icon: PropTypes.node,
    title: PropTypes.node,
    onClick: PropTypes.func,
  };

  static defaultProps = {
    autoClose: true,
    description: null,
    icon: null,
    title: null,
    onClick: () => null,
  };

  render() {
    const {
      autoClose,
      description,
      icon,
      title,
      onClick: onClickProp,
      ...props
    } = this.props;

    return (
      <ToolbarMenuContext.Consumer>
        {({ collapsed, close }) => {
          const onClick = ev => {
            onClickProp(ev);
            if (autoClose) {
              close(ev);
            }
          };

          if (collapsed) {
            return (
              <CollapsedItem
                icon={icon}
                onClick={onClick}
                primary={title}
                {...props}
              />
            );
          }

          return (
            <Button
              description={description}
              icon={icon}
              label={title}
              onClick={onClick}
              {...props}
            />
          );
        }}
      </ToolbarMenuContext.Consumer>
    );
  }
}

export default Item;

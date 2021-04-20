import React from "/vendor/react";
import PropTypes from "prop-types";
import classnames from "/vendor/classnames";
import { NavLink } from "/vendor/react-router-dom";
import { withStyles } from "/vendor/@material-ui/core";

const styles = () => ({
  root: {
    color: "inherit",
    "&:hover": {
      textDecoration: "underline",
    },
  },
});

class InlineLink extends React.Component {
  static propTypes = {
    ...NavLink.propTypes,
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    component: PropTypes.func,
  };

  static defaultProps = {
    className: null,
    component: NavLink,
  };

  render() {
    const {
      children,
      classes,
      className: classNameProp,
      component: Component,
      ...props
    } = this.props;
    const className = classnames(classes.root, classNameProp);

    return (
      <Component className={className} {...props}>
        {children}
      </Component>
    );
  }
}

export default withStyles(styles)(InlineLink);

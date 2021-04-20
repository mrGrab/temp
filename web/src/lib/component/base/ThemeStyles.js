import React from "/vendor/react";
import { withStyles } from "/vendor/@material-ui/core";

const styles = theme => ({
  "@global": {
    html: {
      // Background
      background: theme.palette.background.default,

      // Ensure text is antialiased
      WebkitFontSmoothing: "antialiased",
      MozOsxFontSmoothing: "grayscale",

      height: "100%",
    },

    body: {
      minHeight: "100%",
      display: "flex",
      flexDirection: "column",
    },

    "body > div.root": {
      display: "flex",
      flexDirection: "column",
      flex: 1,
      flexBasis: "auto",
    },

    button: {
      cursor: "pointer",
    },

    strong: {
      fontWeight: 600,
    },
  },
});

class ThemeStyles extends React.PureComponent {
  render() {
    return null;
  }
}

export default withStyles(styles)(ThemeStyles);

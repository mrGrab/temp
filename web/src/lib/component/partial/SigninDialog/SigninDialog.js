import React from "/vendor/react";
import PropTypes from "prop-types";
import { withApollo } from "/vendor/react-apollo";

import {
  withMobileDialog,
  Dialog,
  DialogContent,
  LinearProgress,
  Slide,
  Typography,
} from "/vendor/@material-ui/core";

import compose from "/lib/util/compose";

import { when } from "/lib/util/promise";
import { UnauthorizedError } from "/lib/error/FetchError";
import createTokens from "/lib/mutation/createTokens";
import { createStyledComponent } from "/lib/component/util";
import { SensuLogo } from "/lib/component/base/";

import Form from "./SigninForm";

const Branding = createStyledComponent({
  component: Typography,
  styles: theme => ({
    marginBottom: theme.spacing(3),

    "& svg": {
      marginRight: theme.spacing(0.5),
    },
  }),
});

const Headline = createStyledComponent({
  component: "div",
  styles: theme => ({
    marginBottom: theme.spacing(3),
  }),
});

const Container = createStyledComponent({
  component: DialogContent,
  styles: theme => ({
    padding: theme.spacing(6),
    height: "auto",
    minHeight: 500,
  }),
});

class SignInView extends React.Component {
  static propTypes = {
    client: PropTypes.object.isRequired,
    fullScreen: PropTypes.bool,
    TransitionComponent: PropTypes.func,
    onSuccess: PropTypes.func,
    open: PropTypes.bool,
  };

  static defaultProps = {
    fullScreen: false,
    TransitionComponent: props => <Slide {...props} direction="up" />,
    onSuccess: () => {},
    open: true,
  };

  state = {
    authError: null,
    loading: false,
  };

  handleSubmit = ({ username, password }) => {
    this.setState({ loading: true });

    createTokens(this.props.client, { username, password })
      .then(this.props.onSuccess)
      .catch(
        when(UnauthorizedError, () => {
          this.setState({
            loading: false,
            authError: "Bad username or password.",
          });
          // TODO: Handle other fetch error cases to show an inline error state
          // instead of triggering global error modal.
        }),
      );
  };

  render() {
    const {
      fullScreen,
      TransitionComponent,
      onSuccess,
      open,
      ...props
    } = this.props;
    const { authError, loading } = this.state;

    return (
      <Dialog
        fullScreen={fullScreen}
        open={open}
        TransitionComponent={TransitionComponent}
        {...props}
      >
        <LinearProgress
          variant={loading ? "indeterminate" : "determinate"}
          value={0}
        />
        <Container>
          <Branding color="secondary">
            <SensuLogo />
          </Branding>
          <Headline>
            <Typography variant="h5">Sign in</Typography>
            <Typography variant="subtitle1">with your Sensu Account</Typography>
          </Headline>
          <Form
            disabled={loading}
            error={authError}
            onSubmit={this.handleSubmit}
          />
        </Container>
      </Dialog>
    );
  }
}

const enhance = compose(
  withApollo,
  withMobileDialog({ breakpoint: "xs" }),
);
export default enhance(SignInView);

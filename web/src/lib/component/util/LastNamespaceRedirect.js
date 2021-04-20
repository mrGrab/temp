import React from "/vendor/react";
import PropTypes from "prop-types";
import { Redirect, withRouter } from "/vendor/react-router-dom";
import { SearchParamKey } from "/lib/constant";
import gql from "/vendor/graphql-tag";

import { defaultNamespace } from "/lib/constant/namespace";

import Query from "/lib/component/util/Query";

const primaryQuery = gql`
  query LastNamespaceQuery {
    lastNamespace @client
  }
`;

const fallbackQuery = gql`
  query LastNamespaceFallbackQuery {
    viewer {
      namespaces {
        name
      }
    }
  }
`;

class LastNamespaceRedirect extends React.PureComponent {
  static propTypes = {
    // from withRouter HOC
    location: PropTypes.object.isRequired,
  };

  renderFallback = ({ data, aborted, loading }) => {
    if (loading || aborted) {
      return null;
    }

    if (data.viewer && data.viewer.namespaces.length === 0) {
      return <Redirect to={`/${defaultNamespace}`} />;
    }

    const firstSpace = data.viewer.namespaces[0];
    return <Redirect to={`/${firstSpace.name}`} />;
  };

  renderRedirect = ({ data }) => {
    const { location } = this.props;

    // 1. if 'redirect-to' query parameter is present use given path.
    const queryParams = new URLSearchParams(location.search);
    const redirectQueryParam = queryParams.get(SearchParamKey.redirect);
    if (redirectQueryParam) {
      return <Redirect to={redirectQueryParam} />;
    }

    // 2. if the user's last environment was not recovered from localStorage
    // we fetch all the user's namespaces and redirect to first result.
    const { lastNamespace } = data;
    if (!lastNamespace) {
      return <Query query={fallbackQuery}>{this.renderFallback}</Query>;
    }

    // 3. if the user's last environment is available, build path.
    const nextPath = lastNamespace;
    return <Redirect to={nextPath} />;
  };

  render() {
    return <Query query={primaryQuery}>{this.renderRedirect}</Query>;
  }
}

export default withRouter(LastNamespaceRedirect);

import React from "react";
import { Route, Switch } from "react-router";
import get from "lodash/get";
import querystring from 'querystring'
import { routes } from "./routeParams";

export const renderRoutes = (routes) => {
  return routes.map((route, index) => {
    const { path, DynComponent, isExact = true, childRoutes = [] } = route;
    return (
      <Route
        key={route.key || index}
        path={path}
        exact={isExact}
        strict
        render={(routeProps) => {
          const locationQueryString = get(routeProps, "location.search", "{}");
          const domainName = get(routeProps, "staticContext.requestDomain", "");
          const queryParams = querystring.parse(locationQueryString.slice(1));
          routeProps.location.queryParams = queryParams;
          routeProps.location.domainName = domainName;
          return <DynComponent {...routeProps} childRoutes={childRoutes} />;
        }}
      />
    );
  });
};

export function Routes(props) {
  return (
    <React.Fragment>
      <Switch>{renderRoutes(routes)}</Switch>
    </React.Fragment>
  );
}

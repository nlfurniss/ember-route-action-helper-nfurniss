import { A as emberArray } from "@ember/array";
import Helper from "@ember/component/helper";
import { get } from "@ember/object";
import { getOwner } from "@ember/application";
import { run } from "@ember/runloop";
import { assert } from "@ember/debug";
import { ACTION } from "../-private/internals";

function getCurrentInfos(router) {
  let routerLib = router._routerMicrolib || router.router;

  return {
    currentInfos: routerLib.currentRouteInfos || routerLib.currentHandlerInfos,
    mapBy: (routerLib.currentRouteInfos && "route") || "handler"
  };
}

function getRoutes(router) {
  const { currentInfos, mapBy } = getCurrentInfos(router);
  return emberArray(currentInfos)
    .mapBy(mapBy)
    .reverse();
}

function getRouteWithAction(router, actionName) {
  let action;
  let handler = emberArray(getRoutes(router)).find(route => {
    let actions = route.actions || route._actions;
    action = actions[actionName];

    return typeof action === "function";
  });

  return { action, handler };
}

export default class RouteAction extends Helper {
  get router() {
    return getOwner(this).lookup("router:main");
  }

  compute([actionName, ...params]) {
    let router = get(this, "router");
    assert("[ember-route-action-helper] Unable to lookup router", router);

    let action = function(...invocationArgs) {
      let args = params.concat(invocationArgs);
      let { action, handler } = getRouteWithAction(router, actionName);
      assert(
        `[ember-route-action-helper] Unable to find action ${actionName}`,
        handler
      );

      return run.join(handler, action, ...args);
    };

    action[ACTION] = true;

    return action;
  }
}

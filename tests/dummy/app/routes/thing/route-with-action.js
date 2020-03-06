import Route from "@ember/routing/route";
import { action, set } from "@ember/object";

export default class RouteWithAction extends Route {
  @action updateFoo(...args) {
    let applicationController = this.controllerFor("application");
    return set(
      applicationController,
      "foo",
      `Set via route-with-action: ${args.join(" ")}`
    );
  }
}

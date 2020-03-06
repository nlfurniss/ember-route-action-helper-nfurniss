import Route from "@ember/routing/route";
import { action, set } from "@ember/object";

export default class ApplicationRoute extends Route {
  @action updateFoo(...args) {
    return set(
      this,
      "controller.foo",
      args.filter(a => !(a instanceof Event)).join(" ")
    );
  }

  @action getMax(...numbers) {
    numbers = numbers.filter(n => !(n instanceof Event));
    return Math.max.apply([], numbers);
  }
}

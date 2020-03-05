import Component from "@ember/component";
import { action, set } from "@ember/object";

export default class FooBar extends Component {
  max = 0;

  // This is a workaround for not having a Glimmer component with its namespaced
  // arguments here.
  @action _getMax(...numbers) {
    numbers = numbers.filter(n => !(n instanceof Event));
    // contrived example, but demonstrates that the closure action has a
    // return value.
    return set(this, "max", this.getMax(...numbers));
  }
}

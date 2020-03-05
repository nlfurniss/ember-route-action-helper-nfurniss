import Route from "@ember/routing/route";
import Component from "@ember/component";
import { action } from "@ember/object";
import { module, test } from "qunit";
import { setupApplicationTest } from "ember-qunit";
import { click, currentURL, visit } from "@ember/test-helpers";
import hbs from "htmlbars-inline-precompile";

module("Acceptance | main", function(hooks) {
  setupApplicationTest(hooks);

  test("it bubbles a route action", async function(assert) {
    await visit("/thing");

    assert.equal(currentURL(), "/thing", "gets to `/thing`");
    await click(".foo-button");
    assert.dom(".foo-value").hasText("Hello world Bob!");
  });

  test("it has a return value", async function(assert) {
    await visit("/thing");

    assert.equal(currentURL(), "/thing", "gets to `/thing`");
    await click(".thing .max-button");

    assert.dom(".thing .max-value").hasText("20");

    await visit("/thing/show");
    assert.equal(currentURL(), "/thing/show", "gets to `/thing/show`");
    await click(".thing-show .max-button");

    assert.dom(".thing .max-value").hasText("20");
    assert.dom(".thing-show .max-value").hasText("300");
  });

  test('it can be used without rewrapping with (action (route-action "foo"))', async function(assert) {
    assert.expect(1);

    this.owner.register(
      "route:dynamic",
      class Dynamic extends Route {
        @action foo() {
          assert.ok(true, "action was properly triggered on the route");
        }
      }
    );
    this.owner.register(
      "route:dynamic3",
      class Dynamic3 extends Route {
        @action async bar() {
          assert.ok(true, "async functions are found");
        }
      }
    );
    this.owner.register(
      "template:dynamic",
      hbs`<ParentComponent @go={{route-action 'foo'}} />`
    );
    this.owner.register(
      "template:components/parent-component",
      hbs`<ChildComponent @go={{@go}} />`
    );
    this.owner.register(
      "template:components/child-component",
      hbs`<button class="do-it" {{on "click" this.onClick}}>GO!</button>`
    );
    this.owner.register(
      "component:child-component",
      class ChildComponent extends Component {
        @action onClick() {
          this.go();
        }
      }
    );

    await visit("/dynamic");
    await click(".do-it");
  });
});

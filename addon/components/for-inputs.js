import Ember from 'ember';
import layout from '../templates/components/for-inputs';

const { set, run, get, computed } = Ember;
const BACKSPACE = 8;
const DELETE = 46;
const LEFT = 37;
const RIGHT = 39;

const ForInputsComponent = Ember.Component.extend({
  layout,

  input: '',

  _inputs: computed('input', {
    get() {
      let input = get(this, 'input') + '';

      return input.split('').map((c) => c !== ' ' ? c : '');
    }
  }).readOnly(),

  replaceCharAt(target, replacement, idx) {
    return target.substring(0, idx) + replacement + target.substring(idx + 1);
  },

  focusAt(idx) {
    let input = get(this, 'input');
    let $el = this.$('input')[idx];

    if (idx < input.length) {
      $el.focus();
      $el.select();
    }
  },

  actions: {
    'focus-all'(evt) {
      evt.target.select();
    },

    'key-up'(idx, evt) {
      let value = evt.target.value;
      let $target = this.$('input').eq(idx);

      if (evt.keyCode === LEFT) {
        $target.prev().focus();
      }
      else if (evt.keyCode === RIGHT) {
        $target.next().focus();
      }
      else if (value.length && evt.key.length === 1) {
        $target.blur();
      }
    },

    'update-at'(idx, evt) {
      evt.preventDefault();

      let input = get(this, 'input');
      let replacement = evt.target.value;
      let was_delete = false;

      if (!replacement) {
        was_delete = true;
        replacement = ' ';
      }

      let output = this.replaceCharAt(input, replacement, idx);

      if (typeof this.attrs['on-change'] === 'function') {
        return this.attrs['on-change'](idx, output);
      }

      set(this, 'input', output);

      // focus on the next input if it's empty
      !was_delete && run.scheduleOnce('afterRender', this, 'focusAt', ++idx);
    }
  }
});

ForInputsComponent.reopenClass({
  positionalParams: ['input']
});

export default ForInputsComponent;

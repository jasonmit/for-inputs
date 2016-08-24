import Ember from 'ember';
import layout from '../templates/components/for-inputs';

const { set, run, get, computed } = Ember;

const ForInputsComponent = Ember.Component.extend({
  classNames: ['for-input'],
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

  inputAt(idx) {
    return this.$('input').eq(idx);
  },

  focusAt(idx) {
    let input = get(this, 'input');
    let $target = this.inputAt(idx);

    if (idx < input.length) {
      $target.focus();
      $target.select();
    }
  },

  actions: {
    'focus-all'(evt) {
      evt.target.select();
    },

    'key-up'(idx, evt) {
      let value = evt.target.value;
      let $target = this.inputAt(idx);

      if (evt.keyCode === 37 /* left arrow */) {
        $target.prev().focus();
      }
      else if (evt.keyCode ===  39 /* right arrow */) {
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
      if (!was_delete) {
        run.scheduleOnce('afterRender', this, 'focusAt', ++idx);
      }
    }
  }
});

ForInputsComponent.reopenClass({
  positionalParams: ['input']
});

export default ForInputsComponent;

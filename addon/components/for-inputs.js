import Ember from 'ember';
import layout from '../templates/components/for-inputs';

const { set, run, get, computed } = Ember;

const ForInputsComponent = Ember.Component.extend({
  classNames: ['for-input'],
  layout,

  input: '',
  length: null,

  _inputs: computed('input', {
    get() {
      let input = get(this, 'input') + '';
      let output = input.split('').map((c) => c !== ' ' ? c : '');
      let length = get(this, 'length');

      if (typeof length === 'number' && output.length < length) {
        let padding = new Array(length - output.length);

        for (var i=0;i<padding.length;i++) {
          padding[i] = '';
        }

        output = output.concat(padding);
      }

      return output;
    }
  }).readOnly(),

  inputAt(idx) {
    return this.$('input[type="text"]').eq(idx);
  },

  focusAt(idx) {
    let $target = this.inputAt(idx);
    let len = get(this, 'length') || get(this, 'input.length');

    if (idx < len) {
      $target.select();
    }
  },

  actions: {
    'select-text'(evt) {
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

    'handle-on-change'(idx, evt) {
      let input = get(this, '_inputs');
      let len = input.length;
      let replacement = evt.target.value;
      let was_delete = false;

      if (!replacement) {
        was_delete = true;
        replacement = ' ';
      }

      input[idx] = replacement;

      let out = '';

      for (let i=0;i<len;i++) {
        let char = input[i];
        out += char === '' ? ' ':  char;
      }

      if (this.attrs['on-change']) {
        this.attrs['on-change'](out);
      }

      set(this, 'input', out);

      if (!was_delete) {
        run.scheduleOnce('render', this, 'focusAt', ++idx);
      }
    }
  }
});

ForInputsComponent.reopenClass({
  positionalParams: ['input']
});

export default ForInputsComponent;

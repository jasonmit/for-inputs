import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    tokenChanged(newToken) {
      this.set('token', newToken);
    }
  },

  token: ''
});

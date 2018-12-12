import Component from '@ember/component';
import layout from '../../../templates/components/comite-aanstelling/artikel-3/status-selector';

export default Component.extend({
  layout,

  actions: {
    select(status) {
      this.mandataris.set('status', status);
    }
  }

});

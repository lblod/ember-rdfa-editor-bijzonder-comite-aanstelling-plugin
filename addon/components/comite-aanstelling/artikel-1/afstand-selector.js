import Component from '@ember/component';
import layout from '../../../templates/components/comite-aanstelling/artikel-1/afstand-selector';
import { afstandMandaatStatus } from '../../../models/mandataris-to-create';
import { computed } from '@ember/object';

export default Component.extend({
  layout,
  options:afstandMandaatStatus,
  actions: {
    select(status) {
      debugger;
      this.mandataris.set('afstandVanMandaatStatus', status);
    }
  }
});

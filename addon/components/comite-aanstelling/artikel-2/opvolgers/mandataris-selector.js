import Component from '@ember/component';
import layout from '../../../../templates/components/comite-aanstelling/artikel-2/opvolgers/mandataris-selector';
import { computed } from '@ember/object';

export default Component.extend({
  layout,

  actions: {
    select(persoon){
      this.onSelect(persoon);
    }
  }
});

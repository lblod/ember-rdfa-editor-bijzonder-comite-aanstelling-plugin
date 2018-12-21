import Component from '@ember/component';
import layout from '../../../templates/components/comite-aanstelling/artikel-2/mandataris-selector';

export default Component.extend({
  layout,

  actions: {
    select(persoon){
      this.onSelect(persoon);
    }
  }
});

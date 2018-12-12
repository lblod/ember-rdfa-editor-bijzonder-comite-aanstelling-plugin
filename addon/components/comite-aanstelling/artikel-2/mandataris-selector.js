import Component from '@ember/component';
import layout from '../../../templates/components/comite-aanstelling/artikel-2/mandataris-selector';
import { computed } from '@ember/object';

export default Component.extend({
  layout,

  options: computed('mandatarissen', 'mandatarissen.@each.isEffectief', function(){
    return this.mandatarissen.filter(m => m.isEffectief == false);
  }),

  actions: {
    select(mandataris){
      this.set('mandataris', mandataris);
      this.onSelect(mandataris);
    }
  }
});

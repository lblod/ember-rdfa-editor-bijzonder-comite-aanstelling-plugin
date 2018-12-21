import Component from '@ember/component';
import layout from '../../../templates/components/comite-aanstelling/artikel-2/table';
import { computed } from '@ember/object';
import sortName from '../../../utils/sort-mandataris-name';

export default Component.extend({
  layout,
  sortedMandatarissen: computed('mandatarissen.[]', 'mandatarissen.@each.{status}', function(){
    return this.mandatarissen.sort(sortName);
  }),

  actions: {

    onRemove(mandataris){
      this.mandatarissen.removeObject(mandataris);
    },
    addMandataris(){
      this.set('addMandatarisMode', true);
    },

    cancelAddMandataris(){
      this.set('addMandatarisMode', false);
    },

    saveAddMandataris(mandataris){
      mandataris.set('isEffectief', true);
      this.mandatarissen.pushObject(mandataris);
      this.set('addMandatarisMode', false);
    }
  }
});

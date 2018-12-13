import Component from '@ember/component';
import layout from '../../../templates/components/comite-aanstelling/artikel-2/table';
import { computed } from '@ember/object';
import sortName from '../../../utils/sort-mandataris-name';

export default Component.extend({
  layout,
  sortedMandatarissen: computed('mandatarissen.[]', 'mandatarissen.@each.{isEffectief,neemtAfstand,afstandVanMandaatStatus}', function(){
    return this.mandatarissen.filter(m => m.afstandVanMandaatStatus.key == 'geen').sort(sortName).filter(m =>  m.isEffectief);
  }),

  actions: {
    addMandataris(){
      this.set('addMandatarisMode', true);
    },

    cancelAddMandataris(){
      this.set('addMandatarisMode', false);
    },

    saveAddMandataris(mandataris){
      mandataris.set('isEffectief', true);
      this.set('addMandatarisMode', false);
    }
  }
});

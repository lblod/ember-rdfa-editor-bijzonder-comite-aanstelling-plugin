import Component from '@ember/component';
import layout from '../../../templates/components/comite-aanstelling/artikel-3/table';
import { computed } from '@ember/object';
import sortName from '../../../utils/sort-mandataris-name';

export default Component.extend({
  layout,
  sortedMandatarissen: computed('mandatarissen.[]', 'mandatarissen.@each.{isEffectief,status}', function(){
    return this.mandatarissen.filter(m => m.afstandVanMandaatStatus.key == 'geen').sort(sortName).filter(m =>  m.isEffectief);
  })
});

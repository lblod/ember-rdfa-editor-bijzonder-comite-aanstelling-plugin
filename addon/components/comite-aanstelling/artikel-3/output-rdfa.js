import Component from '@ember/component';
import layout from '../../../templates/components/comite-aanstelling/artikel-3/output-rdfa';
import { computed } from '@ember/object';
import sortMandataris from '../../../utils/sort-mandataris-name';
export default Component.extend({
  layout,

  sortedMandatarissen: computed(
    'mandatarissen.[]', 'mandatarissen.@each.isEffectief', 'mandatarissen.@each.status',
    'opvolgers.[]', 'opvolgers.@each.isEffectief', 'opvolgers.@each.status',
    function(){
      let combinedList = [...this.mandatarissen.toArray(), ...this.opvolgers.toArray()];
      return combinedList.filter(m => m.afstandVanMandaatStatus.key == 'geen')
        .sort(sortMandataris)
        //verhinderde
        .filter(m => m.status && m.status.uri == "http://data.vlaanderen.be/id/concept/MandatarisStatusCode/c301248f-0199-45ca-b3e5-4c596731d5fe");
  }),

  hasVerhinderd: computed('sortedMandatarissen.[]', function(){
    return this.sortedMandatarissen.length > 0;
  })
});

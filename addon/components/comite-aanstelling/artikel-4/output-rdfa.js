import Component from '@ember/component';
import layout from '../../../templates/components/comite-aanstelling/artikel-4/output-rdfa';
import { computed } from '@ember/object';
import sortName from '../../../utils/sort-mandataris-name';

export default Component.extend({
  layout,

  sortedMandatarissen: computed(
    'mandatarissen.[]',
    'mandatarissen.@each.status',
    'opvolgers.[]',
    'opvolgers.@each.status', function(){
      let combinedList = [...this.mandatarissen.toArray(), ...this.opvolgers.toArray()];
      return combinedList
      //waarnemende
        .filter(m => m.status && m.status.uri == "http://data.vlaanderen.be/id/concept/MandatarisStatusCode/e1ca6edd-55e1-4288-92a5-53f4cf71946a")
        .sort(sortName);;
  }),

  hasWaarnemend: computed('sortedMandatarissen.[]', function(){
    return this.sortedMandatarissen.length > 0;
  })
});

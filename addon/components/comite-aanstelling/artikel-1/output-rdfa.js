import Component from '@ember/component';
import layout from '../../../templates/components/comite-aanstelling/artikel-1/output-rdfa';
import { computed } from '@ember/object';
import sortMandataris from '../../../utils/sort-mandataris-name';
import { A } from '@ember/array';

export default Component.extend({
  layout,

  combinedMandatarissen: computed('mandatarissen.[]', 'opvolgers.[]',
                                  'mandatarissen.@each.status',
                                  'opvolgers.@each.status',
                                  function(){
                                    return A([...this.mandatarissen.toArray(), ...this.opvolgers.toArray()]);
                                  }),

  artikel1Geen: computed('combinedMandatarissen.[]', 'combinedMandatarissen.@each.status', function(){
    return this.artikel1A.length == 0
      && this.artikel1AK.length == 0
      && this.artikel1AZK.length == 0
      && this.artikel1VK.length == 0
      && this.artikel1OV.length == 0;
  }),

  artikel1A: computed('combinedMandatarissen.[]', 'combinedMandatarissen.@each.status', function(){
    return this.combinedMandatarissen.sort(sortMandataris).filter(m => m.status.key == 'afstand');
  }),

  artikel1AK: computed('combinedMandatarissen.[]', 'combinedMandatarissen.@each.status', function(){
    return this.combinedMandatarissen.sort(sortMandataris).filter(m => m.status.key == 'afwezigKennis');
  }),

  artikel1AZK: computed('combinedMandatarissen.[]', 'combinedMandatarissen.@each.status', function(){
    return this.combinedMandatarissen.sort(sortMandataris).filter(m => m.status.key == 'afwezigZonderKennis');
  }),

  artikel1VK: computed('combinedMandatarissen.[]', 'combinedMandatarissen.@each.status', function(){
    return this.combinedMandatarissen.sort(sortMandataris).filter(m => m.status.key == 'verkiesbaarheid');
  }),

  artikel1OV: computed('combinedMandatarissen.[]', 'combinedMandatarissen.@each.status', function(){
    return this.combinedMandatarissen.sort(sortMandataris).filter(m => m.status.key == 'onverenigbaarheid');
  })
});

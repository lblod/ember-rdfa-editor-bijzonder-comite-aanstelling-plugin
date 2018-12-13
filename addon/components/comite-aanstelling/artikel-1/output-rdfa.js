import Component from '@ember/component';
import layout from '../../../templates/components/comite-aanstelling/artikel-1/output-rdfa';
import { computed } from '@ember/object';
import sortMandataris from '../../../utils/sort-mandataris-name';

export default Component.extend({
  layout,

  artikel1Geen: computed('mandatarissen.[]', 'mandatarissen.@each.afstandVanMandaatStatus', function(){
    return this.mandatarissen.sort(sortMandataris).filter(m => m.afstandVanMandaatStatus.key == 'geen').length == this.mandatarissen.length;
  }),

  artikel1A: computed('mandatarissen.[]', 'mandatarissen.@each.afstandVanMandaatStatus', function(){
    return this.mandatarissen.sort(sortMandataris).filter(m => m.afstandVanMandaatStatus.key == 'afstand');
  }),

  artikel1AK: computed('mandatarissen.[]', 'mandatarissen.@each.afstandVanMandaatStatus', function(){
    return this.mandatarissen.sort(sortMandataris).filter(m => m.afstandVanMandaatStatus.key == 'afwezigKennis');
  }),

  artikel1AZK: computed('mandatarissen.[]', 'mandatarissen.@each.afstandVanMandaatStatus', function(){
    return this.mandatarissen.sort(sortMandataris).filter(m => m.afstandVanMandaatStatus.key == 'afwezigZonderKennis');
  }),

  artikel1VK: computed('mandatarissen.[]', 'mandatarissen.@each.afstandVanMandaatStatus', function(){
    return this.mandatarissen.sort(sortMandataris).filter(m => m.afstandVanMandaatStatus.key == 'verkiesbaarheid');
  }),

  artikel1OV: computed('mandatarissen.[]', 'mandatarissen.@each.afstandVanMandaatStatus', function(){
    return this.mandatarissen.sort(sortMandataris).filter(m => m.afstandVanMandaatStatus.key == 'onverenigbaarheid');
  })
});

import Component from '@ember/component';
import layout from '../../../../templates/components/comite-aanstelling/artikel-2/opvolgers/table';
import { computed } from '@ember/object';
import plaatsSort from '../../../../utils/opvolger-plaats-sort';
import getOpvolgers from '../../../../utils/get-opvolgers';

export default Component.extend({
  layout,

  sortedMandatarissen: computed('mandatarissen.[]', 'mandatarissen.@each.{status,opvolgerPlaats,opvolgerVan}', function(){
    return getOpvolgers(this.mandatarissen, this.mandataris).sort(plaatsSort);
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
      mandataris.set('opvolgerVan', this.mandataris);
      this.mandatarissen.pushObject(mandataris);
      this.set('addMandatarisMode', false);
    }
  }
});

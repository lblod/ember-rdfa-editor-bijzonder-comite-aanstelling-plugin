import Component from '@ember/component';
import layout from '../../../../templates/components/comite-aanstelling/artikel-2/opvolgers/table';
import { computed } from '@ember/object';
import plaatsSort from '../../../../utils/opvolger-plaats-sort';
import getOpvolgers from '../../../../utils/get-opvolgers';

export default Component.extend({
  layout,

  sortedMandatarissen: computed('mandatarissen.[]', 'mandatarissen.@each.{opvolgerVan,opvolgerPlaats,opvolgerVan}', function(){
    return getOpvolgers(this.mandatarissen, this.mandataris).sort(plaatsSort);
  }),

  actions: {
    addMandataris(){
      this.set('addMandatarisMode', true);
    },

    cancelAddMandataris(){
      this.set('addMandatarisMode', false);
    },

    saveAddMandataris(mandataris){
      mandataris.set('opvolgerVan', this.mandataris);
      this.set('addMandatarisMode', false);
    }
  }
});

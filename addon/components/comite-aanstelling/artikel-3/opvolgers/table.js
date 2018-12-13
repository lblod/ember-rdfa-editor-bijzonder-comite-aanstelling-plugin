import Component from '@ember/component';
import layout from '../../../../templates/components/comite-aanstelling/artikel-3/opvolgers/table';
import { computed } from '@ember/object';
import { opvolgerPlaatsValues } from '../../../../models/mandataris-to-create';

export default Component.extend({
  layout,
  sortedMandatarissen: computed('mandatarissen.[]', 'mandatarissen.@each.{opvolgerVan,opvolgerPlaats,opvolgerVan}', function(){
    return this.mandatarissen.filter(this.isOpvolger(this.mandataris)).sort(this.opvolgerPlaatsSort);
  }),

  opvolgerPlaatsSort(a,b){

  },

  isOpvolger(currentMandataris){
    return (m) => {
      if(!m.opvolgerVan) return false;
      return m.opvolgerVan.uri == currentMandataris.uri;
    };
  }
});

import Component from '@ember/component';
import layout from '../../../../templates/components/comite-aanstelling/artikel-3/opvolgers/table';
import { computed } from '@ember/object';
import { opvolgerPlaatsValues } from '../../../../models/mandataris-to-create';

export default Component.extend({
  layout,
  sortedMandatarissen: computed('mandatarissen.[]', 'mandatarissen.@each.opvolgerVan', 'mandatarissen.@each.opvolgerPlaats', function(){
    return this.mandatarissen.filter(this.isOpvolger(this.mandataris)).sort(this.opvolgerPlaatsSort);
  }),

  opvolgerPlaatsSort(a,b){
    //without opvolgerPlaats put them down
    if(opvolgerPlaatsValues.indexOf((a.opvolgerPlaats || '').trim()) == -1){
      return opvolgerPlaatsValues.length + 1;
    }
    if(opvolgerPlaatsValues.indexOf((b.opvolgerPlaats ||'').trim()) == -1){
      return -(opvolgerPlaatsValues.length + 1);
    }
    return opvolgerPlaatsValues.indexOf((a.opvolgerPlaats || '').trim()) - opvolgerPlaatsValues.indexOf((b.opvolgerPlaats || '' ).trim());
  },

  isOpvolger(currentMandataris){
    return (m) => {
      if(!m.opvolgerVan) return false;
      return m.opvolgerVan.uri == currentMandataris.uri;
    };
  }
});

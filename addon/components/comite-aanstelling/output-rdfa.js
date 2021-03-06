import Component from '@ember/component';
import layout from '../../templates/components/comite-aanstelling/output-rdfa';
import { computed } from '@ember/object';
import sortMandataris from '../../utils/sort-mandataris-name';

export default Component.extend({
  layout,

  artikel2Mandatarissen: computed('mandatarissen.[]', 'mandatarissen.@each.{status,opvolgerVan,opvolgerPlaats}', function(){
    return this.mandatarissen.filter(m => m.status.uri).sort(sortMandataris);
  })
});

import Component from '@ember/component';
import layout from '../../../templates/components/comite-aanstelling/artikel-1/output-rdfa-row';
import { computed } from '@ember/object';
export default Component.extend({
  layout,

  isOpvolger: computed('mandataris', function(){
    return this.mandataris.opvolgerVan;
  })

});

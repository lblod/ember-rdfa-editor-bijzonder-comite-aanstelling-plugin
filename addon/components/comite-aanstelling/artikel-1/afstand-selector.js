import Component from '@ember/component';
import layout from '../../../templates/components/comite-aanstelling/artikel-1/afstand-selector';
import { afstandMandaatStatus } from '../../../models/mandataris-to-create';
import { computed } from '@ember/object';
import getOpvolgers from '../../../utils/get-opvolgers';

export default Component.extend({
  layout,
  options:afstandMandaatStatus,
  actions: {
    select(status) {
      if(status.key !== 'geen'){
        this.mandataris.set('neemtAfstand', true);
        this.mandataris.set('isEffectief', false);
        this.mandataris.set('opvolgerVan', null);
        this.mandataris.set('opvolgerPlaats', null);
        getOpvolgers(this.mandatarissen, this.mandataris).forEach(m => {
        m.set('opvolgerVan', null);
          m.set('opvolgerPlaats', null);
        });
      }
      else{
        this.mandataris.set('neemtAfstand', false);
      }
      this.mandataris.set('afstandVanMandaatStatus', status);
    }
  }
});

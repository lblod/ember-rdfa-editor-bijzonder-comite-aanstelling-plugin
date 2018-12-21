import Component from '@ember/component';
import layout from '../../../templates/components/comite-aanstelling/artikel-2/output-rdfa';
import { computed } from '@ember/object';
import plaatsSort from '../../../utils/opvolger-plaats-sort';
import getOpvolgers from '../../../utils/get-opvolgers';

export default Component.extend({
  layout,
  tagName: 'li',
  sortedOpvolgers: computed('opvolgers.[]', 'opvolgers.@each.{isEffectief,afstandVanMandaatStatus,opvolgerVan,opvolgerPlaats,status}', function(){
    return getOpvolgers(this.opvolgers, this.mandataris).sort(plaatsSort);
  })
});

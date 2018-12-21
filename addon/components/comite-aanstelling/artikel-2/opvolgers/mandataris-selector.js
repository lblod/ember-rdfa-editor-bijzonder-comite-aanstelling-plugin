import Component from '@ember/component';
import layout from '../../../../templates/components/comite-aanstelling/artikel-2/opvolgers/mandataris-selector';
import { computed } from '@ember/object';

export default Component.extend({
  layout,

  options: computed('kandidaatOpvolgers', 'kandidaatOpvolgers.@each.{isEffectief,opvolgerVan,opvolgerPlaats,status,neemtAfstand}',
                    function(){
                      return this.kandidaatOpvolgers.filter(m => !m.neemtAfstand);
  }),

  actions: {
    select(mandataris){
      this.set('mandataris', mandataris);
      this.onSelect(mandataris);
    }
  }
});

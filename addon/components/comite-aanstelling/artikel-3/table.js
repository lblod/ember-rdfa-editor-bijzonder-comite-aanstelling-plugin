import Component from '@ember/component';
import layout from '../../../templates/components/comite-aanstelling/artikel-3/table';
import { computed } from '@ember/object';

export default Component.extend({
  layout,
  sortedMandatarissen: computed('mandatarissenZonderAfstand.[]', 'mandatarissenZonderAfstand.@each.isEffectief', function(){
    return this.mandatarissenZonderAfstand.sort(this.sortMandataris).filter(m =>  m.isEffectief);
  }),

  sortMandataris(a,b){
    return a.get('isBestuurlijkeAliasVan.gebruikteVoornaam').trim()
      .localeCompare(b.get('isBestuurlijkeAliasVan.gebruikteVoornaam').trim());
  },

  didReceiveAttrs(){
    this._super(...arguments);
    if(!this.mandatarissen) return;

    this.set('mandatarissenZonderAfstand', this.mandatarissen.filter(m => m.afstandVanMandaatStatus.key == 'geen'));
  }
  
});

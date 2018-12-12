import Component from '@ember/component';
import layout from '../../../templates/components/comite-aanstelling/artikel-2/table';
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
    this.mandatarissenZonderAfstand.forEach(m =>  {
      if(m.isEffectief == null)
        m.set('isEffectief', true);
      });
  },

  actions: {
    addMandataris(){
      this.set('addMandatarisMode', true);
    },

    cancelAddMandataris(){
      this.set('addMandatarisMode', false);
    },

    saveAddMandataris(mandataris){
      mandataris.set('isEffectief', true);
      this.set('addMandatarisMode', false);
    }
  }
});

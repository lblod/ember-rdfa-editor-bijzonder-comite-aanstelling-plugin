import Component from '@ember/component';
import layout from '../../../templates/components/comite-aanstelling/artikel-1/table';

export default Component.extend({
  layout,

  actions: {
    remove(mandataris){
      this.mandatarissen.removeObject(mandataris);
    },
    addMandataris(){
      this.set('addMandatarisMode', true);
    },
    cancelAddMandataris(){
      this.set('addMandatarisMode', false);
    },

    saveAddMandataris(mandataris){
      //remove potential duplicate
      let toDelete = this.mandatarissen.find(m => m.get('isBestuurlijkeAliasVan.uri' == mandataris.get('isBestuurlijkeAliasVan.uri')));
      if(toDelete)
        this.mandatarissen.removeObject(toDelete);
      this.mandatarissen.pushObject(mandataris);
      this.set('addMandatarisMode', false);
      }
    }
});

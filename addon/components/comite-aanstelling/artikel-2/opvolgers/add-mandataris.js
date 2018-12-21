import Component from '@ember/component';
import layout from '../../../../templates/components/comite-aanstelling/artikel-2/opvolgers/add-mandataris';
import  MandatarisToCreate from '../../../../models/mandataris-to-create';
import { afstandMandaatStatus } from '../../../../models/mandataris-to-create';


export default Component.extend({
  layout,
  tagName: 'tr',

  createNewMandataris(templateMandataris) {
    const mandataris = MandatarisToCreate.create({});
    mandataris.set('isBestuurlijkeAliasVan', templateMandataris.get('isBestuurlijkeAliasVan'));
    mandataris.set('afstandVanMandaatStatus', afstandMandaatStatus.find(s => s.key == 'geen'));
    mandataris.set('isEffectief', false);
    mandataris.set('neemtAfstand', false);
    return mandataris;
  },


  actions: {
    select(mandataris){
      this.set('selectedMandataris', mandataris);
    },

    save(){
      let newM = this.createNewMandataris(this.selectedMandataris);
      this.onSave(newM);
      this.set('selectedMandataris', null);
    },

    cancel(){
      this.set('selectedMandataris', null);
      this.onCancel();
    }
  }
});

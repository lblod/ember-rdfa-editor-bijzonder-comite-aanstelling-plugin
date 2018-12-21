import Component from '@ember/component';
import layout from '../../../../templates/components/comite-aanstelling/artikel-2/opvolgers/add-mandataris';
import  MandatarisToCreate from '../../../../models/mandataris-to-create';
import { afstandMandaatStatus } from '../../../../models/mandataris-to-create';


export default Component.extend({
  layout,
  tagName: 'tr',

  createNewMandataris(persoon) {
    const mandataris = MandatarisToCreate.create({});
    mandataris.set('isBestuurlijkeAliasVan', persoon);
    mandataris.set('status', {});
    mandataris.set('bekleedt', this.comiteMandaat);
    return mandataris;
   },

  actions: {
    select(persoon){
      this.set('selectedMandataris', this.createNewMandataris(persoon));
    },

    save(){
      this.onSave(this.selectedMandataris);
      this.set('selectedMandataris', null);
    },

    cancel(){
      this.set('selectedMandataris', null);
      this.onCancel();
    }
  }
});

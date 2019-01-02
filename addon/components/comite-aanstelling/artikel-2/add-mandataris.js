import Component from '@ember/component';
import layout from '../../../templates/components/comite-aanstelling/artikel-2/add-mandataris';
import  MandatarisToCreate from '../../../models/mandataris-to-create';
import { afstandMandaatStatus } from '../../../models/mandataris-to-create';

export default Component.extend({
  layout,
  tagName: 'tr',

  createNewMandataris(persoon) {
    const mandataris = MandatarisToCreate.create({});
    mandataris.set('isBestuurlijkeAliasVan', persoon);
    //default opname mandaat
    mandataris.set('status',
               this.statusCodes
                   .find(c => c.uri == 'http://data.vlaanderen.be/id/concept/MandatarisStatusCode/21063a5b-912c-4241-841c-cc7fb3c73e75'));
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

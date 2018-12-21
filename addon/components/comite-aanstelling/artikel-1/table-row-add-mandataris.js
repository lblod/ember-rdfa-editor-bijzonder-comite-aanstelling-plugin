import Component from '@ember/component';
import layout from '../../../templates/components/comite-aanstelling/artikel-1/table-row-add-mandataris';
import  MandatarisToCreate from '../../../models/mandataris-to-create';
import { afstandMandaatStatus } from '../../../models/mandataris-to-create';

export default Component.extend({
  tagName: 'tr',
  layout,

  initNewMandataris(persoon) {
    const mandataris = MandatarisToCreate.create({});
    // mandataris.set('bekleedt', this.comiteMandaat);
    // mandataris.set('rangorde', '');
    // mandataris.set('status', {label: '', uri: ''});
    mandataris.set('isBestuurlijkeAliasVan', persoon);
    mandataris.set('afstandVanMandaatStatus', afstandMandaatStatus.find(s => s.key == 'geen'));
    mandataris.set('isEffectief', true);
    mandataris.set('neemtAfstand', false);
    this.set('selectedMandataris', mandataris);
  },

  actions: {
    select(persoon){
      this.initNewMandataris(persoon);
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

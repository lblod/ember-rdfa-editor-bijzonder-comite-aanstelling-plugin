import Component from '@ember/component';
import layout from '../../../templates/components/comite-aanstelling/artikel-2/add-mandataris';

export default Component.extend({
  layout,
  tagName: 'tr',

  actions: {
    select(mandataris){
      this.set('selectedMandataris', mandataris);
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

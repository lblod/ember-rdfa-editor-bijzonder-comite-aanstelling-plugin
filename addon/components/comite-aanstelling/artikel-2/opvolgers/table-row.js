import Component from '@ember/component';
import layout from '../../../../templates/components/comite-aanstelling/artikel-2/opvolgers/table-row';

export default Component.extend({
  layout,
  tagName: 'tr',
  actions: {
    remove(){
      //TODO: required?
      this.mandataris.set('opvolgerVan', null);
      this.mandataris.set('opvolgerPlaats', null);
      this.mandataris.set('start', null);
      this.mandataris.set('einde', null);
      
      this.onRemove(this.mandataris);
    }
  }
});

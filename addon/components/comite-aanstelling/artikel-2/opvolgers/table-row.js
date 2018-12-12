import Component from '@ember/component';
import layout from '../../../../templates/components/comite-aanstelling/artikel-2/opvolgers/table-row';

export default Component.extend({
  layout,
  tagName: 'tr',
  actions: {
    remove(){
      this.mandataris.set('opvolgerVan', null);
      this.mandataris.set('opvolgerPlaats', null);
    }
  }
});

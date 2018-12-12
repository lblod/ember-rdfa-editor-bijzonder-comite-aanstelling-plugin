import Component from '@ember/component';
import layout from '../../../templates/components/comite-aanstelling/artikel-1/table-row';

export default Component.extend({
  layout,
  tagName: 'tr',

  actions: {
    remove(){
      this.onRemove(this.mandataris);
    }
  }
});

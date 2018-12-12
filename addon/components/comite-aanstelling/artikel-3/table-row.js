import Component from '@ember/component';
import layout from '../../../templates/components/comite-aanstelling/artikel-3/table-row';

export default Component.extend({
  layout,
  tagName: 'tr',
  actions: {
    toggleOpvolgers(){
      this.toggleProperty('showOpvolgers');
    }
  }
});

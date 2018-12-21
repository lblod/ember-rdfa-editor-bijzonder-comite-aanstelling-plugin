import Component from '@ember/component';
import layout from '../../../templates/components/comite-aanstelling/artikel-2/table-row';
import isOpvolgerFilter from '../../../utils/is-opvolger-filter';

export default Component.extend({
  layout,
  tagName: 'tr',

  actions: {
    remove(){
      //TODO:  this still needed?
      this.mandataris.set('start', null);
      this.mandataris.set('einde', null);
      this.mandataris.set('isEffectief', false);
      this.mandatarissen.filter(isOpvolgerFilter(this.mandataris)).forEach(m => {
        m.set('opvolgerVan', null);
        m.set('opvolgerPlaats', null);
      });
      this.onRemove(this.mandataris);
    },
    toggleOpvolgers(){
      this.toggleProperty('showOpvolgers');
    }
  }
});

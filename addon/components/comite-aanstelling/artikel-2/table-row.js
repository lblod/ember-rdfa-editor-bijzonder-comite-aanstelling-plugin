import Component from '@ember/component';
import layout from '../../../templates/components/comite-aanstelling/artikel-2/table-row';

export default Component.extend({
  layout,
  tagName: 'tr',

  isOpvolger(currentMandataris){
    return (m) => {
      if(!m.opvolgerVan) return false;
      return m.opvolgerVan.uri == currentMandataris.uri;
    };
  },
  actions: {
    remove(){
      this.mandataris.set('isEffectief', false);
      this.mandatarissen.filter(this.isOpvolger(this.mandataris)).forEach(m => {
        m.set('opvolgerVan', null);
        m.set('opvolgerPlaats', null);
      });
    },
    toggleOpvolgers(){
      this.toggleProperty('showOpvolgers');
    }
  }
});

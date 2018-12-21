import Component from '@ember/component';
import layout from '../../templates/components/comite-aanstelling/aanstelling-container';
import { computed } from '@ember/object';

export default Component.extend({
  layout,

  didReceiveAttrs(){
    this._super(...arguments);
    this.set('artikel', 2);
  },

  actions: {

    getArtikel(number){
      this.set('artikel', number);
    }
  }

});

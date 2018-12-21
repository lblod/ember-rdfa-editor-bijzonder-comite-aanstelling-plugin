import Component from '@ember/component';
import layout from '../../../templates/components/comite-aanstelling/artikel-1/table';
import { computed } from '@ember/object';
import sortName from '../../../utils/sort-mandataris-name';
import getOpvolgers from '../../../utils/get-opvolgers';

export default Component.extend({
  layout,

  sortedMandatarissen: computed('mandatarissen.[]', function(){
    //Personen moeten maar een keer goed verschijnen.
    let persoonUris = this.mandatarissen.map(m => m.isBestuurlijkeAliasVan.uri).toArray();
    persoonUris = [...new Set(persoonUris)];
    return persoonUris.map(p => this.mandatarissen.find(m => m.isBestuurlijkeAliasVan.uri == p));
  }),

  actions: {
    remove(mandataris){
      getOpvolgers(this.mandatarissen, mandataris).forEach(m => {
        m.set('opvolgerVan', null);
        m.set('opvolgerPlaats', null);
      });

      this.mandatarissen.removeObject(mandataris);
    },
    addMandataris(){
      this.set('addMandatarisMode', true);
    },
    cancelAddMandataris(){
      this.set('addMandatarisMode', false);
    },

    saveAddMandataris(mandataris){
      //remove potential duplicate
      let toDelete = this.mandatarissen.find(m => m.get('isBestuurlijkeAliasVan.uri') == mandataris.get('isBestuurlijkeAliasVan.uri'));
      if(toDelete)
        this.mandatarissen.removeObject(toDelete);
      this.mandatarissen.pushObject(mandataris);
      this.set('addMandatarisMode', false);
      }
    }
});

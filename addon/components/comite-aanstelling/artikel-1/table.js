import Component from '@ember/component';
import layout from '../../../templates/components/comite-aanstelling/artikel-1/table';
import { computed } from '@ember/object';
import sortName from '../../../utils/sort-mandataris-name';
import getOpvolgers from '../../../utils/get-opvolgers';

export default Component.extend({
  layout,

  sortedMandatarissen: computed('mandatarissen.[]', 'opvolgers.[]', function(){
    //Personen moeten maar een keer verschijnen.
    let combinedList = [...this.mandatarissen.toArray(), ... this.opvolgers.toArray()];
    let persoonUris = combinedList.map(m => m.isBestuurlijkeAliasVan.uri);
    persoonUris = [...new Set(persoonUris)];
    return persoonUris.map(p => combinedList.find(m => m.isBestuurlijkeAliasVan.uri == p)).sort(sortName);
  }),

  actions: {
    remove(mandataris){
      getOpvolgers(this.opvolgers, mandataris).forEach(m => {
        this.opvolgers.removeObject(m);
      });

      //find opvolgers with same persoon
      this.opvolgers.filter(m => m.isBestuurlijkeAliasVan.uri == mandataris.isBestuurlijkeAliasVan.uri).forEach(m => {
        this.opvolgers.removeObject(m);
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

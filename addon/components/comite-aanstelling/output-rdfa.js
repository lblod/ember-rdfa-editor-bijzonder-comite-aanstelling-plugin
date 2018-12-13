import Component from '@ember/component';
import layout from '../../templates/components/comite-aanstelling/output-rdfa';
import { computed } from '@ember/object';
import sortMandataris from '../../utils/sort-mandataris-name';

export default Component.extend({
  layout,

  artikel2Mandatarissen: computed('mandatarissen.[]', 'mandatarissen.@each.{isEffectief,afstandVanMandaatStatus,opvolgerVan,opvolgerPlaats}', function(){
    return this.mandatarissen.filter(m => m.afstandVanMandaatStatus.key == 'geen').sort(sortMandataris).filter(m =>  m.isEffectief);
  }),

  artikel3Mandatarissen: computed('mandatarissen.[]', 'mandatarissen.@each.isEffectief', 'mandatarissen.@each.status', function(){
    return this.mandatarissen.filter(m => m.afstandVanMandaatStatus.key == 'geen')
      .sort(sortMandataris)
      .filter(m =>  m.isEffectief)
       //verhinderde
      .filter(m => m.status && m.status.uri == "http://data.vlaanderen.be/id/concept/MandatarisStatusCode/c301248f-0199-45ca-b3e5-4c596731d5fe");
  }),

  artikel4Mandatarissen: computed('mandatarissen.[]', 'mandatarissen.@each.isEffectief',
                                  'mandatarissen.@each.status',  function(){
    return this.mandatarissen.filter(m => m.afstandVanMandaatStatus.key == 'geen')
      .sort(sortMandataris)
      .filter(m =>  m.opvolgerVan)
       //waarnemend
      .filter(m => m.status && m.status.uri == "http://data.vlaanderen.be/id/concept/MandatarisStatusCode/e1ca6edd-55e1-4288-92a5-53f4cf71946a");
  })
});

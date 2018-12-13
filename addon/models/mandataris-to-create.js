import EmberObject from '@ember/object';
import uuid from 'uuid/v4';

const afstandMandaatStatus =
        [
          { key: 'afstand', value: 'afstand Mandaat '},
          { key: 'afwezigKennis', value: 'awezigheid met kennisgeving'},
          { key: 'afwezigZonderKennis', value: 'afwezigheid zonder kennisgeving'},
          { key: 'verkiesbaarheid', value: 'niet voldoen aan de verkiesbaarheidsvoorwaarden'},
          { key: 'onverenigbaarheid', value: 'onverenigbaarheid'},
          { key: 'geen', value: 'geen afstand'}
        ];

const opvolgerPlaatsValues  = ['Eerste opvolger', 'Tweede opvolger'];

export {
  afstandMandaatStatus,
  opvolgerPlaatsValues
}



export default EmberObject.extend({
  uri: null,
  isBestuurlijkeAliasVan: null,
  bekleedt: null,
  status: null,
  start: null,
  einde: null,
  heeftLidmaatschap: null,
  afstandVanMandaatStatus: null,
  opvolgerVan: null,
  opvolgerPlaats: null,
  isEffectief: null,

  //only for this plugin
  opvolgers: null,

  rdfaBindings: { // eslint-disable-line ember/avoid-leaking-state-in-ember-objects
    class: "http://data.vlaanderen.be/ns/mandaat#Mandataris",
    rangorde: "http://data.vlaanderen.be/ns/mandaat#rangorde",
    start: "http://data.vlaanderen.be/ns/mandaat#start",
    einde: "http://data.vlaanderen.be/ns/mandaat#einde",
    bekleedt: "http://www.w3.org/ns/org#holds",
    isBestuurlijkeAliasVan: "http://data.vlaanderen.be/ns/mandaat#isBestuurlijkeAliasVan",
    heeftLidmaatschap: "http://www.w3.org/ns/org#hasMembership",
    status: "http://data.vlaanderen.be/ns/mandaat#status"
  },

  init() {
    this._super(...arguments);
    if (! this.uri)
      this.set('uri', `http://data.lblod.info/id/mandatarissen/${uuid()}`);
  }
});

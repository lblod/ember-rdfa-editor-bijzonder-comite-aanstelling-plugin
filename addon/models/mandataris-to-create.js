import EmberObject from '@ember/object';
import uuid from 'uuid/v4';

const afstandMandaatStatus =
        [
          { key: 'afstand', value: 'Afstand mandaat '},
          { key: 'afwezigKennis', value: 'Afwezigheid met kennisgeving'},
          { key: 'afwezigZonderKennis', value: 'Afwezigheid zonder kennisgeving'},
          { key: 'onverenigbaarheid', value: 'Situatie van onverenigbaarheid'}
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

  //only for this plugin
  opvolgerVan: null,
  opvolgerPlaats: null,
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

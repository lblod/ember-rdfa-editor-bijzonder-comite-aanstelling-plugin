import Mixin from '@ember/object/mixin';
import RdfaContextScanner from '@lblod/ember-rdfa-editor/utils/rdfa-context-scanner';
import { A } from '@ember/array';
import { inject as service } from '@ember/service';
import MandatarisToCreate from '../../models/mandataris-to-create';


export default Mixin.create({
  store: service(),
  expandedExt: 'http://mu.semte.ch/vocabularies/ext/',
  oudMandaatPredicate: 'http://mu.semte.ch/vocabularies/ext/oudMandaat',
  lidClassificatieUri: 'http://data.vlaanderen.be/id/concept/BestuursfunctieCode/5ab0e9b8a3b2ca7c5e000019',
  comiteClassificatieUri: 'http://data.vlaanderen.be/id/concept/BestuursorgaanClassificatieCode/5ab0e9b8a3b2ca7c5e000009',
  verkozenGevolgUri: 'http://data.vlaanderen.be/id/concept/VerkiezingsresultaatGevolgCode/89498d89-6c68-4273-9609-b9c097727a0f',

  async setProperties() {
    let bestuurseenheid = ( await this.store.query('bestuurseenheid',
                                           { 'filter[bestuursorganen][heeft-tijdsspecialisaties][:uri:]': this.bestuursorgaanUri }
                                                 )).firstObject;
    this.set('bestuurseenheid', bestuurseenheid);

    let bestuursorgaan = (await this.store.query('bestuursorgaan',
                                                  { 'filter[:uri:]': this.bestuursorgaanUri }
                                                )).firstObject;
    this.set('bestuursorgaan', bestuursorgaan);

    await this.setMandaatComite();
    await this.setCachedPersonen();
    await this.setMandatarisStatusCodes();
  },

  //TODO: check from where this should come
  getMandatarisTableNode(){
    return  document.querySelectorAll("[property='ext:mandatarisTabelInput']")[0]
      ||  document.querySelectorAll(`[property='${this.expandedExt}/mandatarisTabelInput']`)[0];
  },

  //TODO  is this required?
  async setMandatarisStatusCodes(){
    let codes = await this.store.findAll('mandataris-status-code');
    //Remove titelVoerend
    codes = codes.filter(c => c.uri != 'http://data.vlaanderen.be/id/concept/MandatarisStatusCode/aacb3fed-b51d-4e0b-a411-f3fa641da1b3');
    this.set('mandatarisStatusCodes', codes);
  },

  //TODO: will they come from there
  async setCachedPersonen(){
    //a subset of peronen of interest
    let personen = await this.store.query('persoon',
                     {
                       filter: {
                         'is-kandidaat-voor': {
                           'rechtstreekse-verkiezing': {
                             'stelt-samen': {
                               ':uri:': this.bestuursorgaan.uri
                             }
                           }
                         },
                         'verkiezingsresultaten': {
                           'gevolg': {
                             ':uri:': this.verkozenGevolgUri
                           },
                           'is-resultaat-voor': {
                             'rechtstreekse-verkiezing': {
                               'stelt-samen': {
                                 ':uri:': this.bestuursorgaan.uri
                               }
                             }
                           }
                         }
                       },
                       include: 'geboorte',
                       page: { size: 1000 },
                       sort:'gebruikte-voornaam'
                     });
    this.set('cachedPersonen', personen.toArray() || A());
  },

  async smartFetchPersoon(subjectUri){
    let persoon = this.cachedPersonen.find(p => p.uri == subjectUri);
    if(persoon)
      return persoon;
    //if not existant try to create it on based on information in triples

    persoon = (await this.store.query('persoon', { 'filter[:uri:]': subjectUri })).firstObject;
    if(!persoon)
      return null;

   //set cache so it may be found later
   this.cachedPersonen.pushObject(persoon);
   return persoon;
},

  async setMandaatComite(){
    if(this.comiteMandaat)
      return;
    //take mandaat comite from latest bestuursorgaan in tijd
    let query = {
      'filter[bevat-in][is-tijdsspecialisatie-van][bestuurseenheid][:uri:]': this.bestuurseenheid.uri,
      'filter[bevat-in][is-tijdsspecialisatie-van][classificatie][:uri:]': this.comiteClassificatieUri,
      'filter[bestuursfunctie][:uri:]': this.lidClassificatieUri,
      'sort': '-bevat-in.binding-start'
    };
    let comiteMandaat = (await this.store.query('mandaat', query)).firstObject;
    this.set('comiteMandaat', comiteMandaat);
  },

  serializeTableToTriples(table){
    const contextScanner = RdfaContextScanner.create({});
    const contexts = contextScanner.analyse(table).map((c) => c.context);
    return Array.concat(...contexts);
  },

  async instantiateComite(triples){
    await this.setProperties();
    const resources = triples.filter((t) => t.predicate === 'a');
    const mandatarissen = A();
    for (let resource of resources) {
      if(!this.isResourceNewMandataris(resource, triples, mandatarissen))
        continue;
      mandatarissen.pushObject(await this.loadComiteFromTriples(triples.filter((t) => t.subject === resource.subject)));
    }
    return mandatarissen;
   },

  async instantiateNewComite(triples){
    await this.setProperties();
    const persons = triples.filter(t => t.predicate === 'http://data.vlaanderen.be/ns/mandaat#isBestuurlijkeAliasVan').map(t => t.object);
    let personUris = Array.from(new Set(persons));
    const mandatarissen = A();
    for (let personUri of personUris) {
      mandatarissen.pushObject(await this.initNewComite(personUri));
    }
    return mandatarissen;
  },

  async initNewComite(persoonURI) {
    const mandataris = MandatarisToCreate.create({});
    mandataris.set('bekleedt', this.comiteMandaat);
    mandataris.set('rangorde', '');
    mandataris.set('status', {label: '', uri: ''});
    mandataris.set('isBestuurlijkeAliasVan', await this.smartFetchPersoon(persoonURI));
    return mandataris;
  },

  async loadComiteFromTriples(triples){
    const mandataris = MandatarisToCreate.create({ uri: triples[0].subject});
    mandataris.set('bekleedt', this.comiteMandaat);
    mandataris.set('rangorde', (triples.find(t => t.predicate === mandataris.rdfaBindings.rangorde) || {}).object || '');
    mandataris.set('start', ((triples.find(t => t.predicate === mandataris.rdfaBindings.start)) || {}).object);
    mandataris.set('einde', ((triples.find(t => t.predicate === mandataris.rdfaBindings.einde)) || {}).object);
    const persoonURI = triples.find((t) => t.predicate === mandataris.rdfaBindings.isBestuurlijkeAliasVan);

    if (persoonURI) {
      mandataris.set('isBestuurlijkeAliasVan', await this.smartFetchPersoon(persoonURI.object));
    }

    let statusUri = ((triples.find(t => t.predicate === mandataris.rdfaBindings.status)) || {}).object;
    mandataris.set('status', {label: '', uri: ''});
    if(statusUri){
      let status  = this.mandatarisStatusCodes.find(c => c.uri == statusUri);
      mandataris.set('status', status || {label: '', uri: ''});
    }

    return mandataris;
  },

  isResourceNewMandataris(resource, triples, loadedMandatarissen){
    return resource.object === 'http://data.vlaanderen.be/ns/mandaat#Mandataris' &&
      ! loadedMandatarissen.some( (m) => m.uri === resource.subject) &&
      ! triples.some((t) => t.predicate === this.oudMandaatPredicate && t.object === resource.subject);
  }

});

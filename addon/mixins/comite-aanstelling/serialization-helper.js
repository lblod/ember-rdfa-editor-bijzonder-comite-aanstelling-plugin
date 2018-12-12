import Mixin from '@ember/object/mixin';
import RdfaContextScanner from '@lblod/ember-rdfa-editor/utils/rdfa-context-scanner';
import { A } from '@ember/array';
import { inject as service } from '@ember/service';
import MandatarisToCreate from '../../models/mandataris-to-create';
import { afstandMandaatStatus  } from '../../models/mandataris-to-create';


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
  
  async setMandatarisStatusCodes(){
    let codes = await this.store.findAll('mandataris-status-code');
    //Remove titelVoerend
    codes = codes.filter(c => c.uri != 'http://data.vlaanderen.be/id/concept/MandatarisStatusCode/aacb3fed-b51d-4e0b-a411-f3fa641da1b3');
    this.set('mandatarisStatusCodes', codes);
  },

  async getOcmwRaadsLeden(){
    let mandatarissen = await this.store.query('mandataris',
                 {
                   filter: {
                     'bekleedt': {
                       'bestuursfunctie': {
                         ':uri:' : 'http://data.vlaanderen.be/id/concept/BestuursfunctieCode/5ab0e9b8a3b2ca7c5e000015'
                       },
                       'bevat-in': {
                           ':uri:' : this.bestuursorgaan.uri
                       }
                     }
                   },
                   include: 'is-bestuurlijke-alias-van,is-bestuurlijke-alias-van.geboorte',
                   page: { size: 1000 },
                   sort:'is-bestuurlijke-alias-van.gebruikte-voornaam'
                 });
    return mandatarissen;
  },

  async setCachedPersonen(){
    //List is based on an intial sync from gemeenteraadsleden
    let ocmwRaadsleden = await this.getOcmwRaadsLeden();
    let personen = ocmwRaadsleden.map(m => m.get('isBestuurlijkeAliasVan'));
    this.set('cachedPersonen',  personen || A());
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

  async instantiateNewComite(){
    await this.setProperties();
    let mandatarissen = A();
    for(let persoon of this.cachedPersonen){
      mandatarissen.pushObject(await this.initNewComite(persoon));
    }
    this.set('mandatarissen', mandatarissen);
  },

  async initNewComite(persoon) {
    const mandataris = MandatarisToCreate.create({});
    // mandataris.set('bekleedt', this.comiteMandaat);
    // mandataris.set('rangorde', '');
    // mandataris.set('status', {label: '', uri: ''});
    mandataris.set('isBestuurlijkeAliasVan', persoon);
    mandataris.set('afstandVanMandaatStatus', afstandMandaatStatus.find(s => s.key == 'geen'));
    mandataris.set('isEffectief', true);
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

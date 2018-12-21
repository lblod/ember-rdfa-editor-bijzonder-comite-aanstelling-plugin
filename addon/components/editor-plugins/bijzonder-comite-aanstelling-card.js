import { reads } from '@ember/object/computed';
import Component from '@ember/component';
import layout from '../../templates/components/editor-plugins/bijzonder-comite-aanstelling-card';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
import SerializationHelper from '../../mixins/comite-aanstelling/serialization-helper';
import uuid from 'uuid/v4';
import { A } from '@ember/array';

/**
* Card displaying a hint of the Date plugin
*
* @module editor-bijzonder-comite-aanstelling-plugin
* @class BijzonderComiteAanstellingCard
* @extends Ember.Component
*/
export default Component.extend(SerializationHelper, {
  layout,

  /**
   * Region on which the card applies
   * @property location
   * @type [number,number]
   * @private
  */
  location: reads('info.location'),

  /**
   * Unique identifier of the event in the hints registry
   * @property hrId
   * @type Object
   * @private
  */
  hrId: reads('info.hrId'),

  /**
   * The RDFa editor instance
   * @property editor
   * @type RdfaEditor
   * @private
  */
  editor: reads('info.editor'),

  /**
   * Hints registry storing the cards
   * @property hintsRegistry
   * @type HintsRegistry
   * @private
  */
  hintsRegistry: reads('info.hintsRegistry'),

  outputId: computed('id', function() {
    return `output-comite-aanstelling-${this.elementId}`;
  }),

  rdfaEditorBijzonderComiteAanstellingPlugin: service(),
  bestuursorgaanUri: reads('rdfaEditorBijzonderComiteAanstellingPlugin.bestuursorgaanUri'),

 loadData: task(function *(){
    yield this.setProperties();
   if(this.info.editMode){
     try{
       yield this.loadDataEditMode();
       if(this.mandatarissen.length == 0){
         //user might have broken the table. Reload it here
         yield this.loadDataInitialMode();
       }
     }
     catch(error){
       console.log('------ issues loading mandatarissen bijzonder comite');
       //issues might occur because of big refactoring of code.
       //So silent fallback reload this.
       yield this.loadDataInitialMode();
     }
   }
    else
      yield this.loadDataInitialMode();
  }),

  async loadDataInitialMode(){
    await this.instantiateNewComite();
  },

  async loadDataEditMode(){
    let table = document.querySelectorAll('[property="ext:comiteAanstellingTable"]')[0];
    if(!table)
      return;

    let triples = this.serializeTableToTriples(table);
    if(triples.length == 0)
      return;

    let mandatarissen = await this.instantiateComite(triples);
    this.set('mandatarissen', mandatarissen);
  },

  didReceiveAttrs() {
    this._super(...arguments);
    if(this.bestuursorgaanUri)
      this.loadData.perform();
  },

  createWrappingHTML(innerHTML){
    //adds uuid to trigger diff. Do it both on top and down the table to make sure everything gets triggered properly
    return `<div property="ext:comiteAanstellingTable">
             <span class="u-hidden">${uuid()}</span>
             ${innerHTML}
             <span class="u-hidden">${uuid()}</span>
            </div>`;
  },

  tableReset: task(function *(){
     yield this.setProperties();
     yield this.loadDataInitialMode();
  }),


  actions: {
    resetTable(){
      this.tableReset.perform();
    },
    insert(){
      const html = this.createWrappingHTML(document.getElementById(this.outputId).innerHTML);
      this.hintsRegistry.removeHintsAtLocation(this.location, this.hrId, this.info.who);
      this.get('editor').replaceNodeWithHTML(this.info.domNodeToUpdate, html);
    },
    togglePopup(){
       this.toggleProperty('popup');
    },
    toggleNieuweStijl(){
      this.toggleProperty('nieuweStijl');
    }
  }
});

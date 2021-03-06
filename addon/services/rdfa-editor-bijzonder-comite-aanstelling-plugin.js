import { getOwner } from '@ember/application';
import Service from '@ember/service';
import EmberObject, { computed } from '@ember/object';
import { task } from 'ember-concurrency';
import { isArray } from '@ember/array';
import { warn } from '@ember/debug';

/**
 * Service responsible for correct annotation of bijzonder comite
 *
 * @module editor-bijzonder-comite-aanstelling-plugin
 * @class RdfaEditorBijzonderComiteAanstellingPlugin
 * @constructor
 * @extends EmberService
 */
const RdfaEditorBijzonderComiteAanstellingPlugin = Service.extend({
  insertComiteAanstellingText: 'http://mu.semte.ch/vocabularies/ext/comiteAanstellingText',
  comiteAanstellingTable: 'http://mu.semte.ch/vocabularies/ext/comiteAanstellingTable',

  /**
   * Restartable task to handle the incoming events from the editor dispatcher
   *
   * @method execute
   *
   * @param {string} hrId Unique identifier of the event in the hintsRegistry
   * @param {Array} contexts RDFa contexts of the text snippets the event applies on
   * @param {Object} hintsRegistry Registry of hints in the editor
   * @param {Object} editor The RDFa editor instance
   *
   * @public
   */
  execute: task(function * (hrId, contexts, hintsRegistry, editor) {
    if (contexts.length === 0) return [];

    const hints = [];
    for(let context of contexts){
      this.setBestuursorgaanIfSet(context.context);
      let triple = this.detectRelevantContext(context);
      if(!triple) continue;

      let domNode = this.findDomNodeForContext(editor, context, this.domNodeMatchesRdfaInstructive(triple));

      if(!domNode) continue;

      if(triple.predicate == this.insertComiteAanstellingText){
        hintsRegistry.removeHintsInRegion(context.region, hrId, this.who);
        hints.pushObjects(this.generateHintsForContext(context, triple, domNode, editor));
      }
      let domNodeRegion = [ editor.getRichNodeFor(domNode).start, editor.getRichNodeFor(domNode).end ];
      //sometimes it gets a double hint
      if(triple.predicate == this.comiteAanstellingTable && !hints.find(h => h.location[0] == domNodeRegion[0] && h.location[1] == domNodeRegion[1])){
        hintsRegistry.removeHintsInRegion(domNodeRegion, hrId, this.who);
        hints.pushObjects(this.generateHintsForContext(context, triple, domNode, editor));
      }
    }

    const cards = hints.map( (hint) => this.generateCard(hrId, hintsRegistry, editor, hint, this.who));
    if(cards.length > 0){
      hintsRegistry.addHints(hrId, this.who, cards);
    }
  }).keepLatest(),

  /**
   * Given context object, tries to detect a context the plugin can work on
   *
   * @method detectRelevantContext
   *
   * @param {Object} context Text snippet at a specific location with an RDFa context
   *
   * @return {String} URI of context if found, else empty string.
   *
   * @private
   */
  detectRelevantContext(context){
    if(context.context.slice(-1)[0].predicate == this.insertComiteAanstellingText){
      return context.context.slice(-1)[0];
    }
    if(context.context.slice(-1)[0].predicate == this.comiteAanstellingTable){
      return context.context.slice(-1)[0];
    }
    return null;
  },

  /**
   * Generates a card given a hint
   *
   * @method generateCard
   *
   * @param {string} hrId Unique identifier of the event in the hintsRegistry
   * @param {Object} hintsRegistry Registry of hints in the editor
   * @param {Object} editor The RDFa editor instance
   * @param {Object} hint containing the hinted string and the location of this string
   *
   * @return {Object} The card to hint for a given template
   *
   * @private
   */
  generateCard(hrId, hintsRegistry, editor, hint, cardName){
    return EmberObject.create({
      info: {
        label: 'Voeg tabel van bijzonder comité',
        plainValue: hint.text,
        location: hint.location,
        domNodeToUpdate: hint.domNode,
        instructiveUri: hint.instructiveUri,
        editMode: hint.options.editMode,
        hrId, hintsRegistry, editor
      },
      location: hint.location,
      options: hint.options,
      card: cardName
    });
  },

  /**
   * Generates a hint, given a context
   *
   * @method generateHintsForContext
   *
   * @param {Object} context Text snippet at a specific location with an RDFa context
   *
   * @return {Object} [{dateString, location}]
   *
   * @private
   */
  generateHintsForContext(context, instructiveTriple, domNode, editor, options = {}){
    const hints = [];
    const text = context.text;
    let location = context.region;
    if(instructiveTriple.predicate == this.comiteAanstellingTable){
      location = [ editor.getRichNodeFor(domNode).start, editor.getRichNodeFor(domNode).end ];
      options.noHighlight = true;
      options.editMode = true;
    }
    hints.push({text, location, domNode, instructiveUri: instructiveTriple.predicate, options});
    return hints;
  },

  ascendDomNodesUntil(rootNode, domNode, condition){
    if(!domNode || rootNode.isEqualNode(domNode)) return null;
    if(!condition(domNode))
      return this.ascendDomNodesUntil(rootNode, domNode.parentElement, condition);
    return domNode;
  },

  domNodeMatchesRdfaInstructive(instructiveRdfa){
    let ext = 'http://mu.semte.ch/vocabularies/ext/';
    return (domNode) => {
      if(!domNode.attributes || !domNode.attributes.property)
        return false;
      let expandedProperty = domNode.attributes.property.value.replace('ext:', ext);
      if(instructiveRdfa.predicate == expandedProperty)
        return true;
      return false;
    };
  },

  findDomNodeForContext(editor, context, condition){
    let richNodes = isArray(context.richNode) ? context.richNode : [ context.richNode ];
    let domNode = richNodes
          .map(r => this.ascendDomNodesUntil(editor.rootNode, r.domNode, condition))
          .find(d => d);
    if(!domNode){
      warn(`Trying to work on unattached domNode. Sorry can't handle these...`, {id: 'comiteAanstelling.domNode'});
    }
    return domNode;
  },

  setBestuursorgaanIfSet(triples) {
    const zitting = triples.find((triple) => triple.object === 'http://data.vlaanderen.be/ns/besluit#Zitting');
    if (zitting) {
      const bestuursorgaan = triples.find((triple) => triple.subject === zitting.subject && triple.predicate === 'http://data.vlaanderen.be/ns/besluit#isGehoudenDoor');
      if (bestuursorgaan){
        this.set('bestuursorgaanUri', bestuursorgaan.object);
      }
    }
  }
});

RdfaEditorBijzonderComiteAanstellingPlugin.reopen({
  who: 'editor-plugins/bijzonder-comite-aanstelling-card'
});
export default RdfaEditorBijzonderComiteAanstellingPlugin;

import Component from '@ember/component';
import layout from '../../templates/components/comite-aanstelling/output-article';
import { computed } from '@ember/object';
import uuid from 'uuid/v4';

export default Component.extend({
  layout,
  typeof: 'besluit:Artikel',
  articleUri: computed('computed', function(){
    return `http://data.lblod.info/artikels/${uuid()}`;
  })
});

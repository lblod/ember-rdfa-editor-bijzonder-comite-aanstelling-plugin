import Component from '@ember/component';
import layout from '../../../../templates/components/comite-aanstelling/artikel-2/opvolgers/output-rdfa';
import { computed } from '@ember/object';

export default Component.extend({
  layout,
  tagName:'tr',
  isMandatarisEffectief: computed('mandataris', 'mandataris.status', function(){
    return this.mandataris.status;
  })
});

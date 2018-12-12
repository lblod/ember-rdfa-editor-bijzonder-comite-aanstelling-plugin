import Component from '@ember/component';
import layout from '../../../../templates/components/comite-aanstelling/artikel-2/opvolgers/rangorde-selector';
import { opvolgerPlaatsValues } from '../../../../models/mandataris-to-create';

export default Component.extend({
  layout,
  options: opvolgerPlaatsValues,
  actions: {
    select(rangorde) {
      this.mandataris.set('opvolgerPlaats', rangorde);
    }
}
});

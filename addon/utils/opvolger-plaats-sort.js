import { opvolgerPlaatsValues } from '../models/mandataris-to-create';

export default function opvolgerPlaatsSort(a,b) {
    //without opvolgerPlaats put them down
    if(opvolgerPlaatsValues.indexOf((a.opvolgerPlaats || '').trim()) == -1){
      return opvolgerPlaatsValues.length + 1;
    }
    if(opvolgerPlaatsValues.indexOf((b.opvolgerPlaats ||'').trim()) == -1){
      return -(opvolgerPlaatsValues.length + 1);
    }
    return opvolgerPlaatsValues.indexOf((a.opvolgerPlaats || '').trim()) - opvolgerPlaatsValues.indexOf((b.opvolgerPlaats || '' ).trim());
}

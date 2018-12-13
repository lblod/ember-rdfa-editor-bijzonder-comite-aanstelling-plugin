import { helper } from '@ember/component/helper';
import getOpvolgersUtil from '../utils/get-opvolgers';

export function getOpvolgers( mandatarissen, mandataris ) {
  return getOpvolgersUtil(mandatarissen, mandataris);
}

export default helper(getOpvolgers);

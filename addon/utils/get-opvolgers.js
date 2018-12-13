import isOpvolgerFilter from './is-opvolger-filter';

export default function getOpvolgers(mandatarissen, mandataris) {
  return mandatarissen.filter(isOpvolgerFilter(mandataris));
}

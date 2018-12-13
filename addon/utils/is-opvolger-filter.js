export default function isOpvolgerFilter(mandataris) {
  return (m) => {
      if(!m.opvolgerVan) return false;
      return m.opvolgerVan.uri == mandataris.uri;
    };
}

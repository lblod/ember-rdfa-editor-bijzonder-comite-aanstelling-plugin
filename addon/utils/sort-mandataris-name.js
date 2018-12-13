export default function sortMandatarisName(a,b) {
  return a.get('isBestuurlijkeAliasVan.gebruikteVoornaam').trim()
      .localeCompare(b.get('isBestuurlijkeAliasVan.gebruikteVoornaam').trim());
}

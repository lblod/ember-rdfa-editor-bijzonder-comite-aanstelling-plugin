export default function sortMandatarisName(a,b) {
  return a.get('isBestuurlijkeAliasVan.achternaam').trim()
      .localeCompare(b.get('isBestuurlijkeAliasVan.achternaam').trim());
}

const templates = {
  CREATECUSTOMER:
    '<div><h3>Welkom bij Ball.com</h3><hr><p>Hallo %s! Je hebt zojuist een account aangemaakt op onze website, gefelciteerd! Veel plezier met kopen, geef ons geld.</p></div>',
  DELETECUSTOMER:
    '<div><h3>Account verwijderd bij Ball.com</h3><hr><p>Hallo %s. Helaas wil je ons geen geld meer geven. Je account is succesvol verwijderd uit onze database. k bye.</p></div>',
};

const subjects = {
  CREATECUSTOMER: 'Welkom bij Ball.com!',
  DELETECUSTOMER: 'Account verwijderd',
};

module.exports = { templates, subjects };

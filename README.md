angular-card-input
==================

adds new form input types:

    <input type='credit card' ng-model="user.card.number" />
    <input type='cvc' ng-model="user.card.cvc" />

these provide helpful formatting e.g. ```4242 4242 4242 4242``` and proper validation, including mod10(luhn algorithm) validation of credit card numbers

available through bower

    bower install angular-card-input

documentation to come...

for now, checkout the (demo)[http://outlawandy.github.io/angular-card-input] and read the source code.
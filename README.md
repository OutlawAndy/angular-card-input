angular-card-input
==================

adds new form input types:

    <input type='credit card' ng-model="user.card.number" />
    <input type='cvc' ng-model="user.card.cvc" />

Using these new input types automatically gives you the following

* helpful formatting
  * e.g. ```4242 4242 4242 4242```
  * e.g. ```3734 123456 78900```
* validation, including mod10(luhn algorithm) validation of credit card numbers
* css class hooks for special formating per card brand i.e. ```visa mastercard amex discover```

available through bower

    bower install angular-card-input

documentation to come...

for now, checkout the [demo](http://outlawandy.github.io/angular-card-input) and read the source code.
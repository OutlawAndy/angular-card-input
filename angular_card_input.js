// Generated by CoffeeScript 1.6.3
(function() {
  angular.module('creditCardInput', []).provider('creditCardInput', function() {
    var _amex, _discover, _inputWrapperClass, _master, _visa;
    _inputWrapperClass = 'input';
    _amex = 'amex';
    _visa = 'visa';
    _master = 'master';
    _discover = 'discover';
    this.setInputWrapperClass = function(className) {
      return _inputWrapperClass = className;
    };
    this.setCardClasses = function(cardClassObj) {
      _amex = cardClassObj.americanExpress || 'amex';
      _visa = cardClassObj.visa || 'visa';
      _master = cardClassObj.masterCard || 'master';
      return _discover = cardClassObj.discoverCard || 'discover';
    };
    this.$get = function() {
      return {
        inputWrapperClass: _inputWrapperClass,
        americanExpressClass: _amex,
        visaClass: _visa,
        masterCardClass: _master,
        discoverCardClass: _discover,
        cardClasses: [_amex, _visa, _master, _discover].join(' ')
      };
    };
    return this;
  }).directive('type', [
    'creditCardInput', function(creditCardInput) {
      return {
        require: '?ngModel',
        link: function(scope, el, attrs, ngModel) {
          var amexFormat, cvcParse, easeDelete, formField, format, parse, standardFormat, validity;
          if (!ngModel) {
            return;
          }
          if (!(attrs.type === 'credit card' || attrs.type === 'cvc')) {
            return;
          }
          if (attrs.type === 'cvc') {
            el.on('blur keyup change', function(e) {
              return scope.$apply(function() {
                var text;
                if (!(text = el.val())) {
                  return;
                }
                ngModel.$setViewValue(text);
                return el.val(cvcParse(ngModel.$viewValue));
              });
            });
            cvcParse = function(val) {
              return val != null ? val.replace(/([^\d])*/g, '').slice(0, 4) : void 0;
            };
            return ngModel.$parsers.push(cvcParse);
          } else {
            formField = el.parent();
            el.on('blur keyup change', function(e) {
              return scope.$apply(function() {
                var text;
                if (!(text = el.val())) {
                  return;
                }
                ngModel.$setViewValue(text);
                return el.val(format(ngModel.$viewValue));
              });
            });
            parse = function(val) {
              var _ref, _ref1;
              validity(val);
              if (formField.hasClass(creditCardInput.americanExpressClass)) {
                return (_ref = val.replace(/([^\d])*/g, '').slice(0, 15)) != null ? _ref : '';
              } else {
                return (_ref1 = val.replace(/([^\d])*/g, '').slice(0, 16)) != null ? _ref1 : '';
              }
            };
            ngModel.$parsers.push(parse);
            format = function(text) {
              var num, regAmex, regDisc, regMast, regVisa;
              if (!text) {
                return;
              }
              num = text.replace(/([^\d\s])*/g, '');
              regAmex = new RegExp("^(34|37)");
              regVisa = new RegExp("^4");
              regMast = new RegExp("^5[1-5]");
              regDisc = new RegExp("^60");
              if (num.length < 2) {
                formField.removeClass(creditCardInput.cardClasses);
              }
              if (num.length === 2) {
                formField.addClass((function() {
                  switch (false) {
                    case !regAmex.test(num):
                      return creditCardInput.americanExpressClass;
                    case !regVisa.test(num):
                      return creditCardInput.visaClass;
                    case !regMast.test(num):
                      return creditCardInput.masterCardClass;
                    case !regDisc.test(num):
                      return creditCardInput.discoverCardClass;
                  }
                })());
              }
              if (regAmex.test(num)) {
                return amexFormat(num);
              } else {
                return standardFormat(num);
              }
            };
            standardFormat = function(num) {
              if (num[14] === ' ' ? num.length > 18 : void 0) {
                return num.slice(0, 19);
              }
              if ((num.length === 5 || num.length === 10 || num.length === 15) && num[num.length - 1] !== ' ') {
                return num.slice(0, -1) + ' ' + num[num.length - 1];
              } else if ((num.length === 6 || num.length === 11 || num.length === 16) && num[num.length - 2] !== ' ') {
                return num.slice(0, -2) + ' ' + num.slice(num.length - 2);
              } else if ((num.length === 7 || num.length === 12 || num.length === 17) && num[num.length - 3] !== ' ') {
                return num.slice(0, -3) + ' ' + num.slice(num.length - 3);
              } else if ((num.length === 8 || num.length === 13 || num.length === 18) && num[num.length - 4] !== ' ') {
                return num.slice(0, -4) + ' ' + num.slice(num.length - 4);
              } else if ((num.length === 9 || num.length === 14 || num.length === 19) && num[num.length - 5] !== ' ') {
                return num.slice(0, -5) + ' ' + num.slice(num.length - 5);
              } else {
                return easeDelete(num);
              }
            };
            amexFormat = function(num) {
              if (num.length > 16) {
                return num.slice(0, 17);
              }
              if ((num.length === 5 || num.length === 12) && num[num.length - 1] !== ' ') {
                return num.slice(0, -1) + ' ' + num[num.length - 1];
              } else if ((num.length === 6 || num.length === 13) && num[num.length - 2] !== ' ') {
                return num.slice(0, -2) + ' ' + num.slice(num.length - 2);
              } else if ((num.length === 7 || num.length === 14) && num[num.length - 3] !== ' ') {
                return num.slice(0, -3) + ' ' + num.slice(num.length - 3);
              } else if ((num.length === 8 || num.length === 15) && num[num.length - 4] !== ' ') {
                return num.slice(0, -4) + ' ' + num.slice(num.length - 4);
              } else if ((num.length === 9 || num.length === 16) && num[num.length - 5] !== ' ') {
                return num.slice(0, -5) + ' ' + num.slice(num.length - 5);
              } else {
                return easeDelete(num);
              }
            };
            easeDelete = function(num) {
              if (num[num.length - 1] === ' ') {
                return num.slice(0, -1);
              } else {
                return num;
              }
            };
            return validity = function(text) {
              var luhnArr, sum;
              luhnArr = [[0, 2, 4, 6, 8, 1, 3, 5, 7, 9], [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]];
              sum = 0;
              text.replace(/\D+/g, "").replace(/[\d]/g, function(c, p, o) {
                return sum += luhnArr[(o.length - p) & 1][parseInt(c, 10)];
              });
              return ngModel.$setValidity('card', !!(sum % 10 === 0 && sum > 0));
            };
          }
        }
      };
    }
  ]);

}).call(this);

angular.module('creditCardInput',[])

.provider 'creditCardInput', ->
  _amex = 'amex'
  _visa = 'visa'
  _master = 'master'
  _discover = 'discover'

  this.setCardClasses = (cardClassObj) ->
    _amex     = cardClassObj.americanExpress || 'amex'
    _visa     = cardClassObj.visa            || 'visa'
    _master   = cardClassObj.masterCard      || 'master'
    _discover = cardClassObj.discoverCard    || 'discover'

  this.$get = ->
    return {
      americanExpressClass: _amex
      visaClass: _visa
      masterCardClass: _master
      discoverCardClass: _discover
      cardClasses: [_amex, _visa, _master, _discover].join(' ')
    }
  return this
.directive 'type', [ 'creditCardInput', (creditCardInput) ->
  require: '?ngModel'
  link: (scope, el, attrs, ngModel) ->
    ##
    #  support ng-type and type
    #
    inputType = attrs.ngType || attrs.type;

    return unless ngModel
    return unless (inputType is 'credit card' || inputType is 'cvc')

    ##
    #  input[type="cvc"]
    #
    if inputType is 'cvc'
      el.on 'blur keyup change', (e) ->
        scope.$apply ->
          return unless text = el.val()
          ngModel.$setViewValue(text)
          el.val(cvcParse ngModel.$viewValue)

      cvcParse = (val) ->
        value = val?.replace(/([^\d])*/g,'')[0..3]
        ngModel.$setValidity 'minlength', value.length >= 3 || ngModel.$isEmpty(value)
        return value

      ngModel.$parsers.push(cvcParse)


    ##
    #  input[type="credit card"]
    #
    else
      formField = el.parent()

      el.on 'blur keyup change', (e) ->
        scope.$apply ->
          return unless text = el.val()
          ngModel.$setViewValue(text)
          el.val(format ngModel.$viewValue)

      parse = (val) ->
        validity(val)
        if formField.hasClass creditCardInput.americanExpressClass
          return val.replace(/([^\d])*/g,'')[..14] ? ''
        else
          return val.replace(/([^\d])*/g,'')[..15] ? ''

      ngModel.$parsers.push(parse)

      format = (text) ->
        unless text
          ngModel.$setPristine()
          return

        num = text.replace(/([^\d\s])*/g,'')
        regAmex = new RegExp("^(34|37)") #American Express
        regVisa = new RegExp("^4")       #Visa
        regMast = new RegExp("^5[1-5]")  #Master Card
        regDisc = new RegExp("^60")    #Discover Card
        if num.length < 2
          formField.removeClass creditCardInput.cardClasses

        if num.length is 2
          formField.addClass switch
            when regAmex.test(num) then creditCardInput.americanExpressClass
            when regVisa.test(num) then creditCardInput.visaClass
            when regMast.test(num) then creditCardInput.masterCardClass
            when regDisc.test(num) then creditCardInput.discoverCardClass
        if regAmex.test(num)
          amexFormat(num)
        else
          standardFormat(num)

      standardFormat = (num) ->
        return num[..18] if num.length > 18 unless num[14] isnt ' '
        if ( num.length is 5 or num.length is 10 or num.length is 15 ) and num[num.length - 1] isnt ' '
          return num[..-2] + ' ' + num[num.length - 1]
        else if  ( num.length is 6 or num.length is 11 or num.length is 16 ) and num[num.length - 2] isnt ' '
          return num[..-3] + ' ' + num[(num.length - 2)..]
        else if  ( num.length is 7 or num.length is 12 or num.length is 17 ) and num[num.length - 3] isnt ' '
          return num[..-4] + ' ' + num[(num.length - 3)..]
        else if  ( num.length is 8 or num.length is 13 or num.length is 18 ) and num[num.length - 4] isnt ' '
          return num[..-5] + ' ' + num[(num.length - 4)..]
        else if  ( num.length is 9 or num.length is 14 or num.length is 19 ) and num[num.length - 5] isnt ' '
          return num[..-6] + ' ' + num[(num.length - 5)..]
        else
          easeDelete num

      amexFormat = (num) ->
        return num[..16] if num.length > 16
        if ( num.length is 5 or num.length is 12 ) and num[num.length - 1] isnt ' '
          return num[..-2] + ' ' + num[num.length - 1]
        else if ( num.length is 6 or num.length is 13 ) and num[num.length - 2] isnt ' '
          return num[..-3] + ' ' + num[(num.length - 2)..]
        else if ( num.length is 7 or num.length is 14 ) and num[num.length - 3] isnt ' '
          return num[..-4] + ' ' + num[(num.length - 3)..]
        else if ( num.length is 8 or num.length is 15 ) and num[num.length - 4] isnt ' '
          return num[..-5] + ' ' + num[(num.length - 4)..]
        else if ( num.length is 9 or num.length is 16 ) and num[num.length - 5] isnt ' '
          return num[..-6] + ' ' + num[(num.length - 5)..]
        else
          easeDelete num

      easeDelete = (num) ->
        if num[num.length - 1] is ' ' then num[..-2] else num

      validity = (text) ->
        luhnArr = [[0,2,4,6,8,1,3,5,7,9],[0,1,2,3,4,5,6,7,8,9]]
        sum = 0
        text.replace(/\D+/g,"").replace /[\d]/g, (c, p, o) ->
          sum += luhnArr[ (o.length-p)&1 ][ parseInt(c,10) ]
        ngModel.$setValidity 'mod10', !!(sum % 10 is 0 && sum > 0) || ngModel.$isEmpty(text)
]

;(function($, Shopify, Currency, window, document, undefined) {

  // Check that the required Javascript modules have been loaded before proceeding.
  if(Shopify === undefined) {
    window.console && window.console.error('shopify.i18n.js: Shopify module has not been loaded.');
    return;
  }
  if(Currency === undefined) {
    window.console && window.console.error('shopify.i18n.js: Currency module has not been loaded.');
    return;
  }

  // Define the i18n module, which will be exported.
  var i18n = {};

  // Hash for storing locale data retrieved by Ajax.
  var _locales = {};

  // The default locale.
  var _defaultLocale = null;

  // The default locale asset URL.
  var _defaultLocaleAssetUrl = null;

  // The default currency.
  var _defaultCurrency = null;

  // Create a locale cookie in a similar pattern to that provided by the Currency module's currency cookie.
  var localeCookie = {
    configuration: {
      expires: 365,
      path: '/',
      domain: window.location.hostname
    },
    name: 'locale',
    write: function(locale) {
      jQuery.cookie(this.name, locale, this.configuration);
    },
    read: function() {
      return jQuery.cookie(this.name);
    },
    destroy: function() {
      jQuery.cookie(this.name, null, this.configuration);
    }
  };

  /**
   * Get the URL to a locale's JSON asset, based on the default locale JSON asset URL.
   *
   * @param locale
   */
  function getLocaleAssetUrl(locale) {
    return _defaultLocaleAssetUrl.replace(_defaultLocale + '.json', locale + '.json');
  }

  /**
   * Initialise the i18n module.
   *
   * @param defaultLocale
   * @param defaultLocaleAssetUrl
   * @param defaultCurrency
   */
  function init(defaultLocale, defaultLocaleAssetUrl, defaultCurrency) {
    // Store default/initial settings.
    _defaultLocale = defaultLocale;
    _defaultLocaleAssetUrl = defaultLocaleAssetUrl;
    _defaultCurrency = defaultCurrency;

    // Store default currency against the Currency object.
    Currency.currentCurrency = _defaultCurrency;

    // See if we have a saved locale in our cookie that's different to our current one. If so, translate to it.
    var cookieLocale = localeCookie.read();
    if(cookieLocale && cookieLocale.length && (cookieLocale != _defaultLocale)) {
      translate(cookieLocale);
    }

    // See if we have a saved currency in our cookie that's different to our current one. If so, convert to it.
    var cookieCurrency = Currency.cookie.read();
    if(cookieCurrency && cookieCurrency.length && (cookieCurrency != _defaultCurrency)) {
      convert(cookieCurrency);
    }

    // Create event listeners.
    $(document).on('change', '[data-change="locale"]', localeChangedHandler);
    $(document).on('change', '[data-change="currency"]', currencyChangedHandler);
    $(document).on('click', '[data-toggle="currency"]', currencyToggledHandler);
  }


  /**********
   * LOCALES
   **********/

  /**
   * Event handler for a locale change.
   */
  function localeChangedHandler() {
    var $this = $(this), locale = $this.val();
    translate(locale);
  }

  /**
   * Get a translation from a dot-notated keypath.
   * This currently uses evil eval().
   *
   * @param keyPath
   * @param locale
   */
  function getTranslation(keyPath, locale) {
    var translation = eval('_locales.' + locale + '.' + keyPath);
    if(!translation || (translation === undefined)) {
      return null;
    }
    return translation;
  }

  /**
   * Translate a specific element to the given locale.
   *
   * @param element
   * @param locale
   */
  function translateElement(element, locale) {
    var $element = $(element),
        keyPath = $element.data('translate');

    var translation = getTranslation(keyPath, locale);
    if(translation) {
      $(element).text(translation);
    }
  }

  /**
   * Translate all elements on the page marked up with data-translate attributes to the given locale.
   *
   * @param locale
   */
  function translate(locale) {
    // Check to see if we have the locale translation data available. If not, fetch it via Ajax.
    if(_locales[locale] === undefined) {
      $.getJSON(getLocaleAssetUrl(locale), function (localeData) {
        // Store the returned locale data.
        _locales[locale] = localeData;
        // Try to perform translation again.
        translate(locale);
      });
      return;
    }

    // Translate elements to the given locale.
    $('[data-translate]').each(function(i, element) {
      translateElement(element, locale);
    });

    // Save the chosen locale in a cookie.
    localeCookie.write(locale);
  }


  /*************
   * CURRENCIES
   *************/

  /**
   * Event handler for a currency change.
   */
  function currencyChangedHandler() {
    var $this = $(this), currency = $this.val();
    convert(currency);
  }

  /**
   * Event handler for a currency toggle.
   */
  function currencyToggledHandler() {
    var $this = $(this), currency = $this.data('currency');
    convert(currency);
  }

  /**
   * Convert all elements on the page marked up with data-convert attributes to the given currency.
   *
   * @param currency
   */
  function convert(currency) {
    // Call convertAll with all possible formats. Currency.currentCurrency will be set as a side effect.
    Currency.convertAll(Currency.currentCurrency, currency, '[data-convert="money"]', 'money_format');
    Currency.convertAll(Currency.currentCurrency, currency, '[data-convert="money_with_currency"]', 'money_with_currency_format');
    Currency.convertAll(Currency.currentCurrency, currency, '[data-convert="money_without_currency"]', 'money_without_currency_format');

    // Save the chosen currency in a cookie.
    Currency.cookie.write(currency);
  }


  /**********
   * EXPORTS
   **********/

  i18n.init = init;
  Shopify.i18n = i18n;

})(jQuery, Shopify, Currency, window, document);

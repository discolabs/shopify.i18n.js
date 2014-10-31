shopify.i18n.js
===============

A small (experimental) Javascript library for adding dynamic i18n features to Shopify themes.
Incorporates and builds on Caroline Schnapp's [jquery.currencies.js][].

To see this in action, check out the very in-progress [Bootstrap for Shopify 4][] development store.


### Features
- Allow dynamic switching of locales using DOM elements marked up with `data-translate`;
- Allow dynamic switching of currencies using DOM elements marked up with `data-convert`;
- Store locale and currency preference in a user cookie for persistence.


### Assumptions
- You have a recent version of jQuery available;
- You've pulled in Shopify's recent current data through `currencies.js` (see example below);
- You've copied all `.json` files from your theme's `locales` directory into `assets` so that they're accessible via a `$.getJSON` request.


### Usage

This is probably *not* ready for production use.
If you'd like to use it, you can copy the files from the `dist` directory or install via bower:

```
bower install shopify.i18n.js
```

Then incorporate it at the bottom of your `theme.liquid` like this:

```html
    <!-- Javascript -->
    {{ 'jquery.min.js' | asset_url | script_tag }}
    {{ '/services/javascripts/currencies.js' | script_tag }}
    {{ 'shopify.i18n.min.js' | asset_url | script_tag }}

    <script type="text/javascript">
      Shopify.i18n.init("{{ shop.locale }}", "{{ shop.locale | append: '.json' | asset_url }}", "{{ shop.currency }}");
    </script>
  </body>
</html>
```

[jquery.currencies.js]: https://github.com/carolineschnapp/currencies
[Bootstrap for Shopify 4]: http://bootstrap-4.myshopify.com

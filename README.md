# Xola Backbone SDK

Xola Backbone SDK is intended to help development of Xola apps by providing all the standard Xola models and collections.

## Dependencies

Since this a Backbone SDK, it requires *BackboneJS* in order to work which indirectly requires *jQuery* and *UnderscoreJS*. 

* [jQuery](http://jquery.com)
* [Underscore](http://underscorejs.org)
* [Backbone](http://backbonejs.org)

## Installation

You can [download the latest builds directly](https://github.com/mightytroll/xola-backbone-sdk/tree/master/dist) or using npm.

### Node

When installing through NPM, all dependencies will automatically be resolved.

```bash
# NPM
npm install mightytroll/xola-backbone-sdk
```

As soon as the first stable release is ready, SDK will be available as npm package.

```javascript
// javascript
import XolaBackboneSDK from "xola-backbone-sdk";
```

### Browser

When including the SDK directly in your browser, you will also need to include all of it's dependencies.

```html
<html>
  <head>
    <meta charset="UTF-8">
    <title>Xola Backbone SDK</title>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/backbone.js/1.3.3/backbone.js"></script>
    <script src="/xola-backbone-sdk.js"></script>
  </head>
  <body>
    <script>
      // Global XolaBackboneSDK variable is available here
    </script>
  </body>
</html>
```

## Usage

Regardless of how you choose to install the SDK, you can use it as you would any *Backbone* model or collection.

**Example**

```javascript
var seller = new XolaBackboneSDK.Model.Seller({id: SELLER_ID});
seller.fetch();

var experiences = new XolaBackboneSDK.Collection.Experiences();
experiences.fetch({
  data: {
    seller: seller.id
  }
});
```

### Setting the API key

To set your API key simply call `XolaBackboneSDK.setApiKey(API_KEY);` when initializing you app. To obtain an API key follow the instructions in [Xola API documentation](https://developers.xola.com/v1.0/reference#section-get-your-api-key). 

### Sandbox environment

You can change base url prepended to all API requests by calling `XolaBackboneSDK.setBaseUrl("https://sandbox.xola.com/api");`. Make sure you include `/api` part without trailing slash `/`.
 
## Development

Library is still in development and missing many essential classes. Feel free to add new models and collections as you find need for them.

### Models

All models extend `Xola.BaseModel` which provides basic functionalities shared across all Xola models like parsing and url generation.

**URL**

In most cases, there is no need to override  `url()` method. You should only define `urlRoot` property as a relative path (e.g. "/experiences"). If your model has a nested url structure, you only need to assign `parent` attribute to your model and `BaseModel.url()` will figure out the correct url for you.

**Parsing**

Unless you are building something very specific, there is no need to implement `parse()` method. `BaseModel` figures it out for you.

### Collections

All collection extend `Xola.BaseCollection` which provides basic functionalities shared across all Xola collections like parsing and url generation.

**URL**

In most cases, there is no need to override  `url()` method as it is derived from model's `urlRoot` property. You should only define `model` property to your collections.

**Parsing**

`BaseCollection` can figure out if you are working with paged or non-pages collections and will parse data accordingly.
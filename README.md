# backbone-super-class
Plugin to Backbone.js to enable super class functionality.

The super method allows for a function to call the same method from its inherited class. The super method is available in the Model, Collection, Router and View classes in Backbone and in any class that extends those base classes.

## Usage

The super method is called from within a prototype method of a class. The method will immediately call the method of the same name as the calling method in the inherited class. This allows for a class to override the behavior of a base class but still programatically allow access to the overrided method.

```javascript
Model.extend({
	someMethod: function( param ) {
		// do something special
		return this._super( param );
	}
});
```

## Adding super class to existing classes

To add the super class functionality to classes that do not extend from the four base classes of Backbone (Model, Collection, View and Router), `Backbone.__superClass__` can be used.

```javascript
SomeCustomClass = function ( options ) {
	// ... some really awesome stuff

	this.initialize.appy( this, arguments );
}
_.extend( SomeCustomClass, Backbone.Events, Backbone.__superClass__, {
	// some more really awesome stuff
});
```

## noConflict

In the case where the existing functionality of the base classes should not be clobbered, `noConflict` can be called to revert classes back to their original values. The call will also return an object that contains the references to all the super classes for use.

```javascript
var supers = Backbone.__superClass__.noConflict(),
	someSuperModel = new supers.Model( /* model data */ );
```

## API

**_super** _this._super( *parameters )_ The super method can only be called from within an overrided method in the class. Any parameters passed to the `_super` call will be in turn passed to the method of the inherited class. The return will be the returned value from the call to the inherited class method.

**Backbone.__superClass__** Reference to the super class implementation that can be used to add functionality to any class. 

**Backbone.__superClass__.noConflict** Returns an `object` that contains the references to the super class versions of the Backbone base classes. You can use the return value of `Backbone.__superClass__.noConflict()` to keep a local reference to super class implementation. This is useful when embedding in sites that use Backbone and you don't want to change their existing implementation.

## Support

To suggest a feature, report a bug, or general discussion: http://github.com/huffingtonpost/backbone-super-class/issues/


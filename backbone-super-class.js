/**
 * backbone-super-class
 *
 * (c) 2012 Sai Wong, Huffington Post
 * backbone-super-class may be freely distributed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Plugin to Backbone.js to enable super class functionality.
 *
 * @version 0.1.0
 * @url http://github.com/huffingtonpost/backbone-super-class
 */
;( function ( B, _ ) {
	if ( !B || B.__superClass__ ) return;

	var superWrapper = function ( func, superFunc ) {
			// create a function that has the superFunc as a closure and
			// temporarily expose it as _super on the class.
			// Lifted partially from Ember.js (http://emberjs.com/).
			var newFunc = function () {
				var ret, sup = this._super;
				this._super = superFunc || K;
				ret = func.apply( this, arguments );
				this._super = sup;
				return ret;
			};
			return newFunc;
		},
		ExtendMethod = B.Model.extend,
		SuperClass = {
			//=====================================
			// Initialize
			//=====================================

			initialize: function () {
				// wrap each function to support _super
				var superClass = this,
					options = this instanceof _Model || this instanceof _Collection ? arguments[ 1 ] : arguments[ 0 ];

				_.each( options, function ( value, key ) {
					if ( _.isFunction( value ) ) {
						var func = value,
							superFunc = superClass[ key ];

						options[ key ] = superWrapper( func, superFunc );
					}
				});

				_.extend( this, options );
			},

			//=====================================
			// Common extend method
			//=====================================

			extend: function ( protoProps, classProps ) {
				var superClass = this.prototype;
				_.each( protoProps, function ( value, key ) {
					if ( _.isFunction( value ) && !_.has( value, '__super__' ) ) {
						var func = value,
							superFunc = superClass[ key ];

						protoProps[ key ] = superWrapper( func, superFunc );
					}
				});
				return ExtendMethod.call( this, protoProps, classProps );
			}
		},

		// store copies of the original classes
		_Model = B.Model,
		_Collection = B.Collection,
		_Router = B.Router,
		_View = B.View,
		__superClass__ = B.__superClass__,

		// create the super versions of all base classes
		SuperModel = B.Model.extend( _.clone( SuperClass ) ),
		SuperCollection = B.Collection.extend( _.clone( SuperClass ) ),
		SuperRouter = B.Router.extend( _.clone( SuperClass ) ),
		SuperView = B.Router.extend( _.clone( SuperClass ) );

	// ensure that all extends from the super class will use the SuperClass's extend
	SuperModel.extend = SuperCollection.extend = SuperRouter.extend = SuperView.extend = SuperClass.extend;

	B.__superClass__ = SuperClass;
	B.__superClass__.noConflict = function () {
		// revert previous class functionality
		B.Model = _Model;
		B.Collection = _Collection;
		B.Router = _Router;
		B.View = _View;
		B.__superClass__ = __superClass__;

		// return references to the super classes
		return {
			__superClass__: SuperClass,
			Model: SuperModel,
			Collection: SuperCollection,
			Router: SuperRouter,
			View: SuperView
		};
	};
})( this.Backbone, this._ );
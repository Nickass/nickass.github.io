/*
	Base.js, version 1.1a
	Copyright 2006-2010, Dean Edwards
	License: http://www.opensource.org/licenses/mit-license.php
*/

var Base = function() {
	// dummy
};

Base.extend = function(_instance, _static) { // subclass
	
	"use strict";
	
	var extend = Base.prototype.extend;
	
	// build the prototype
	Base._prototyping = true;
	
	var proto = new this();
	
	extend.call(proto, _instance);
	
	proto.base = function() {
	// call this method from any other method to invoke that method's ancestor
	};

	delete Base._prototyping;
	
	// create the wrapper for the constructor function
	//var constructor = proto.constructor.valueOf(); //-dean
	var constructor = proto.constructor;
	var klass = proto.constructor = function() {
		if (!Base._prototyping) {
			if (this._constructing || this.constructor == klass) { // instantiation
				this._constructing = true;
				constructor.apply(this, arguments);
				delete this._constructing;
			} else if (arguments[0] !== null) { // casting
				return (arguments[0].extend || extend).call(arguments[0], proto);
			}
		}
	};
	
	// build the class interface
	klass.ancestor = this;
	klass.extend = this.extend;
	klass.forEach = this.forEach;
	klass.implement = this.implement;
	klass.prototype = proto;
	klass.toString = this.toString;
	klass.valueOf = function(type) {
		//return (type == "object") ? klass : constructor; //-dean
		return (type == "object") ? klass : constructor.valueOf();
	};
	extend.call(klass, _static);
	// class initialisation
	if (typeof klass.init == "function") klass.init();
	return klass;
};

Base.prototype = {	
	extend: function(source, value) {
		if (arguments.length > 1) { // extending with a name/value pair
			var ancestor = this[source];
			if (ancestor && (typeof value == "function") && // overriding a method?
				// the valueOf() comparison is to avoid circular references
				(!ancestor.valueOf || ancestor.valueOf() != value.valueOf()) &&
				/\bbase\b/.test(value)) {
				// get the underlying method
				var method = value.valueOf();
				// override
				value = function() {
					var previous = this.base || Base.prototype.base;
					this.base = ancestor;
					var returnValue = method.apply(this, arguments);
					this.base = previous;
					return returnValue;
				};
				// point to the underlying method
				value.valueOf = function(type) {
					return (type == "object") ? value : method;
				};
				value.toString = Base.toString;
			}
			this[source] = value;
		} else if (source) { // extending with an object literal
			var extend = Base.prototype.extend;
			// if this object has a customised extend method then use it
			if (!Base._prototyping && typeof this != "function") {
				extend = this.extend || extend;
			}
			var proto = {toSource: null};
			// do the "toString" and other methods manually
			var hidden = ["constructor", "toString", "valueOf"];
			// if we are prototyping then include the constructor
			var i = Base._prototyping ? 0 : 1;
			while (key = hidden[i++]) {
				if (source[key] != proto[key]) {
					extend.call(this, key, source[key]);

				}
			}
			// copy each of the source object's properties to this object
			for (var key in source) {
				if (!proto[key]) extend.call(this, key, source[key]);
			}
		}
		return this;
	}
};

// initialise
Base = Base.extend({
	constructor: function() {
		this.extend(arguments[0]);
	}
}, {
	ancestor: Object,
	version: "1.1",
	
	forEach: function(object, block, context) {
		for (var key in object) {
			if (this.prototype[key] === undefined) {
				block.call(context, object[key], key, object);
			}
		}
	},
		
	implement: function() {
		for (var i = 0; i < arguments.length; i++) {
			if (typeof arguments[i] == "function") {
				// if it's a function, call it
				arguments[i](this.prototype);
			} else {
				// add the interface using the extend method
				this.prototype.extend(arguments[i]);
			}
		}
		return this;
	},
	
	toString: function() {
		return String(this.valueOf());
	}
});
/*jshint smarttabs:true */

var FlipClock;
	
/**
 * FlipClock.js
 *
 * @author     Justin Kimbrell
 * @copyright  2013 - Objective HTML, LLC
 * @licesnse   http://www.opensource.org/licenses/mit-license.php
 */
	
(function($) {
	
	"use strict";
	
	/**
	 * FlipFlock Helper
	 *
	 * @param  object  A jQuery object or CSS select
	 * @param  int     An integer used to start the clock (no. seconds)
	 * @param  object  An object of properties to override the default	
	 */
	 
	FlipClock = function(obj, digit, options) {
		if(digit instanceof Object && digit instanceof Date === false) {
			options = digit;
			digit = 0;
		}

		return new FlipClock.Factory(obj, digit, options);
	};

	/**
	 * The global FlipClock.Lang object
	 */

	FlipClock.Lang = {};
	
	/**
	 * The Base FlipClock class is used to extend all other FlipFlock
	 * classes. It handles the callbacks and the basic setters/getters
	 *	
	 * @param 	object  An object of the default properties
	 * @param 	object  An object of properties to override the default	
	 */

	FlipClock.Base = Base.extend({
		
		/**
		 * Build Date
		 */
		 
		buildDate: '2014-12-12',
		
		/**
		 * Version
		 */
		 
		version: '0.7.7',
		
		/**
		 * Sets the default options
		 *
		 * @param	object 	The default options
		 * @param	object 	The override options
		 */
		 
		constructor: function(_default, options) {
			if(typeof _default !== "object") {
				_default = {};
			}
			if(typeof options !== "object") {
				options = {};
			}
			this.setOptions($.extend(true, {}, _default, options));
		},
		
		/**
		 * Delegates the callback to the defined method
		 *
		 * @param	object 	The default options
		 * @param	object 	The override options
		 */
		 
		callback: function(method) {
		 	if(typeof method === "function") {
				var args = [];
								
				for(var x = 1; x <= arguments.length; x++) {
					if(arguments[x]) {
						args.push(arguments[x]);
					}
				}
				
				method.apply(this, args);
			}
		},
		 
		/**
		 * Log a string into the console if it exists
		 *
		 * @param 	string 	The name of the option
		 * @return	mixed
		 */		
		 
		log: function(str) {
			if(window.console && console.log) {
				console.log(str);
			}
		},
		 
		/**
		 * Get an single option value. Returns false if option does not exist
		 *
		 * @param 	string 	The name of the option
		 * @return	mixed
		 */		
		 
		getOption: function(index) {
			if(this[index]) {
				return this[index];
			}
			return false;
		},
		
		/**
		 * Get all options
		 *
		 * @return	bool
		 */		
		 
		getOptions: function() {
			return this;
		},
		
		/**
		 * Set a single option value
		 *
		 * @param 	string 	The name of the option
		 * @param 	mixed 	The value of the option
		 */		
		 
		setOption: function(index, value) {
			this[index] = value;
		},
		
		/**
		 * Set a multiple options by passing a JSON object
		 *
		 * @param 	object 	The object with the options
		 * @param 	mixed 	The value of the option
		 */		
		
		setOptions: function(options) {
			for(var key in options) {
	  			if(typeof options[key] !== "undefined") {
		  			this.setOption(key, options[key]);
		  		}
		  	}
		}
		
	});
	
}(jQuery));

/*jshint smarttabs:true */

/**
 * FlipClock.js
 *
 * @author     Justin Kimbrell
 * @copyright  2013 - Objective HTML, LLC
 * @licesnse   http://www.opensource.org/licenses/mit-license.php
 */
	
(function($) {
	
	"use strict";
	
	/**
	 * The FlipClock Face class is the base class in which to extend
	 * all other FlockClock.Face classes.
	 *
	 * @param 	object  The parent FlipClock.Factory object
	 * @param 	object  An object of properties to override the default	
	 */
	 
	FlipClock.Face = FlipClock.Base.extend({
		
		/**
		 * Sets whether or not the clock should start upon instantiation
		 */
		 
		autoStart: true,

		/**
		 * An array of jQuery objects used for the dividers (the colons)
		 */
		 
		dividers: [],

		/**
		 * An array of FlipClock.List objects
		 */		
		 
		factory: false,
		
		/**
		 * An array of FlipClock.List objects
		 */		
		 
		lists: [],

		/**
		 * Constructor
		 *
		 * @param 	object  The parent FlipClock.Factory object
		 * @param 	object  An object of properties to override the default	
		 */
		 
		constructor: function(factory, options) {
			this.dividers = [];
			this.lists = [];
			this.base(options);
			this.factory = factory;
		},
		
		/**
		 * Build the clock face
		 */
		 
		build: function() {
			if(this.autoStart) {
				this.start();
			}
		},
		
		/**
		 * Creates a jQuery object used for the digit divider
		 *
		 * @param	mixed 	The divider label text
		 * @param	mixed	Set true to exclude the dots in the divider. 
		 *					If not set, is false.
		 */
		 
		createDivider: function(label, css, excludeDots) {
			if(typeof css == "boolean" || !css) {
				excludeDots = css;
				css = label;
			}

			var dots = [
				'<span class="'+this.factory.classes.dot+' top"></span>',
				'<span class="'+this.factory.classes.dot+' bottom"></span>'
			].join('');

			if(excludeDots) {
				dots = '';	
			}

			label = this.factory.localize(label);

			var html = [
				'<span class="'+this.factory.classes.divider+' '+(css ? css : '').toLowerCase()+'">',
					'<span class="'+this.factory.classes.label+'">'+(label ? label : '')+'</span>',
					dots,
				'</span>'
			];	
			
			var $html = $(html.join(''));

			this.dividers.push($html);

			return $html;
		},
		
		/**
		 * Creates a FlipClock.List object and appends it to the DOM
		 *
		 * @param	mixed 	The digit to select in the list
		 * @param	object  An object to override the default properties
		 */
		 
		createList: function(digit, options) {
			if(typeof digit === "object") {
				options = digit;
				digit = 0;
			}

			var obj = new FlipClock.List(this.factory, digit, options);
		
			this.lists.push(obj);

			return obj;
		},
		
		/**
		 * Triggers when the clock is reset
		 */

		reset: function() {
			this.factory.time = new FlipClock.Time(
				this.factory, 
				this.factory.original ? Math.round(this.factory.original) : 0,
				{
					minimumDigits: this.factory.minimumDigits
				}
			);

			this.flip(this.factory.original, false);
		},

		/**
		 * Append a newly created list to the clock
		 */

		appendDigitToClock: function(obj) {
			obj.$el.append(false);
		},

		/**
		 * Add a digit to the clock face
		 */
		 
		addDigit: function(digit) {
			var obj = this.createList(digit, {
				classes: {
					active: this.factory.classes.active,
					before: this.factory.classes.before,
					flip: this.factory.classes.flip
				}
			});

			this.appendDigitToClock(obj);
		},
		
		/**
		 * Triggers when the clock is started
		 */
		 
		start: function() {},
		
		/**
		 * Triggers when the time on the clock stops
		 */
		 
		stop: function() {},
		
		/**
		 * Auto increments/decrements the value of the clock face
		 */
		 
		autoIncrement: function() {
			if(!this.factory.countdown) {
				this.increment();
			}
			else {
				this.decrement();
			}
		},

		/**
		 * Increments the value of the clock face
		 */
		 
		increment: function() {
			this.factory.time.addSecond();
		},

		/**
		 * Decrements the value of the clock face
		 */

		decrement: function() {
			if(this.factory.time.getTimeSeconds() == 0) {
	        	this.factory.stop()
			}
			else {
				this.factory.time.subSecond();
			}
		},
			
		/**
		 * Triggers when the numbers on the clock flip
		 */
		 
		flip: function(time, doNotAddPlayClass) {
			var t = this;

			$.each(time, function(i, digit) {
				var list = t.lists[i];

				if(list) {
					if(!doNotAddPlayClass && digit != list.digit) {
						list.play();	
					}

					list.select(digit);
				}	
				else {
					t.addDigit(digit);
				}
			});
		}
					
	});
	
}(jQuery));

/*jshint smarttabs:true */

/**
 * FlipClock.js
 *
 * @author     Justin Kimbrell
 * @copyright  2013 - Objective HTML, LLC
 * @licesnse   http://www.opensource.org/licenses/mit-license.php
 */
	
(function($) {
	
	"use strict";
	
	/**
	 * The FlipClock Factory class is used to build the clock and manage
	 * all the public methods.
	 *
	 * @param 	object  A jQuery object or CSS selector used to fetch
	 				    the wrapping DOM nodes
	 * @param 	mixed   This is the digit used to set the clock. If an 
	 				    object is passed, 0 will be used.	
	 * @param 	object  An object of properties to override the default	
	 */
	 	
	FlipClock.Factory = FlipClock.Base.extend({
		
		/**
		 * The clock's animation rate.
		 * 
		 * Note, currently this property doesn't do anything.
		 * This property is here to be used in the future to
		 * programmaticaly set the clock's animation speed
		 */		

		animationRate: 1000,

		/**
		 * Auto start the clock on page load (True|False)
		 */	
		 
		autoStart: true,
		
		/**
		 * The callback methods
		 */		
		 
		callbacks: {
			destroy: false,
			create: false,
			init: false,
			interval: false,
			start: false,
			stop: false,
			reset: false
		},
		
		/**
		 * The CSS classes
		 */		
		 
		classes: {
			active: 'flip-clock-active',
			before: 'flip-clock-before',
			divider: 'flip-clock-divider',
			dot: 'flip-clock-dot',
			label: 'flip-clock-label',
			flip: 'flip',
			play: 'play',
			wrapper: 'flip-clock-wrapper'
		},
		
		/**
		 * The name of the clock face class in use
		 */	
		 
		clockFace: 'HourlyCounter',
		 
		/**
		 * The name of the clock face class in use
		 */	
		 
		countdown: false,
		 
		/**
		 * The name of the default clock face class to use if the defined
		 * clockFace variable is not a valid FlipClock.Face object
		 */	
		 
		defaultClockFace: 'HourlyCounter',
		 
		/**
		 * The default language
		 */	
		 
		defaultLanguage: 'english',
		 
		/**
		 * The jQuery object
		 */		
		 
		$el: false,

		/**
		 * The FlipClock.Face object
		 */	
		 
		face: true,
		 
		/**
		 * The language object after it has been loaded
		 */	
		 
		lang: false,
		 
		/**
		 * The language being used to display labels (string)
		 */	
		 
		language: 'english',
		 
		/**
		 * The minimum digits the clock must have
		 */		

		minimumDigits: 0,

		/**
		 * The original starting value of the clock. Used for the reset method.
		 */		
		 
		original: false,
		
		/**
		 * Is the clock running? (True|False)
		 */		
		 
		running: false,
		
		/**
		 * The FlipClock.Time object
		 */		
		 
		time: false,
		
		/**
		 * The FlipClock.Timer object
		 */		
		 
		timer: false,
		
		/**
		 * The jQuery object (depcrecated)
		 */		
		 
		$wrapper: false,
		
		/**
		 * Constructor
		 *
		 * @param   object  The wrapping jQuery object
		 * @param	object  Number of seconds used to start the clock
		 * @param	object 	An object override options
		 */
		 
		constructor: function(obj, digit, options) {

			if(!options) {
				options = {};
			}

			this.lists = [];
			this.running = false;
			this.base(options);	

			this.$el = $(obj).addClass(this.classes.wrapper);

			// Depcrated support of the $wrapper property.
			this.$wrapper = this.$el;

			this.original = (digit instanceof Date) ? digit : (digit ? Math.round(digit) : 0);

			this.time = new FlipClock.Time(this, this.original, {
				minimumDigits: this.minimumDigits,
				animationRate: this.animationRate 
			});

			this.timer = new FlipClock.Timer(this, options);

			this.loadLanguage(this.language);
			
			this.loadClockFace(this.clockFace, options);

			if(this.autoStart) {
				this.start();
			}

		},
		
		/**
		 * Load the FlipClock.Face object
		 *
		 * @param	object  The name of the FlickClock.Face class
		 * @param	object 	An object override options
		 */
		 
		loadClockFace: function(name, options) {	
			var face, suffix = 'Face', hasStopped = false;
			
			name = name.ucfirst()+suffix;

			if(this.face.stop) {
				this.stop();
				hasStopped = true;
			}

			this.$el.html('');

			this.time.minimumDigits = this.minimumDigits;
			
			if(FlipClock[name]) {
				face = new FlipClock[name](this, options);
			}
			else {
				face = new FlipClock[this.defaultClockFace+suffix](this, options);
			}
			
			face.build();

			this.face = face

			if(hasStopped) {
				this.start();
			}
			
			return this.face;
		},
				
		/**
		 * Load the FlipClock.Lang object
		 *
		 * @param	object  The name of the language to load
		 */
		 
		loadLanguage: function(name) {	
			var lang;
			
			if(FlipClock.Lang[name.ucfirst()]) {
				lang = FlipClock.Lang[name.ucfirst()];
			}
			else if(FlipClock.Lang[name]) {
				lang = FlipClock.Lang[name];
			}
			else {
				lang = FlipClock.Lang[this.defaultLanguage];
			}
			
			return this.lang = lang;
		},
					
		/**
		 * Localize strings into various languages
		 *
		 * @param	string  The index of the localized string
		 * @param	object  Optionally pass a lang object
		 */

		localize: function(index, obj) {
			var lang = this.lang;

			if(!index) {
				return null;
			}

			var lindex = index.toLowerCase();

			if(typeof obj == "object") {
				lang = obj;
			}

			if(lang && lang[lindex]) {
				return lang[lindex];
			}

			return index;
		},
		 

		/**
		 * Starts the clock
		 */
		 
		start: function(callback) {
			var t = this;

			if(!t.running && (!t.countdown || t.countdown && t.time.time > 0)) {
				t.face.start(t.time);
				t.timer.start(function() {
					t.flip();
					
					if(typeof callback === "function") {
						callback();
					}	
				});
			}
			else {
				t.log('Trying to start timer when countdown already at 0');
			}
		},
		
		/**
		 * Stops the clock
		 */
		 
		stop: function(callback) {
			this.face.stop();
			this.timer.stop(callback);
			
			for(var x in this.lists) {
				if (this.lists.hasOwnProperty(x)) {
					this.lists[x].stop();
				}
			}	
		},
		
		/**
		 * Reset the clock
		 */
		 
		reset: function(callback) {
			this.timer.reset(callback);
			this.face.reset();
		},
		
		/**
		 * Sets the clock time
		 */
		 
		setTime: function(time) {
			this.time.time = time;
			this.flip(true);		
		},
		
		/**
		 * Get the clock time
		 *
		 * @return  object  Returns a FlipClock.Time object
		 */
		 
		getTime: function(time) {
			return this.time;		
		},
		
		/**
		 * Changes the increment of time to up or down (add/sub)
		 */
		 
		setCountdown: function(value) {
			var running = this.running;
			
			this.countdown = value ? true : false;
				
			if(running) {
				this.stop();
				this.start();
			}
		},
		
		/**
		 * Flip the digits on the clock
		 *
		 * @param  array  An array of digits	 
		 */
		flip: function(doNotAddPlayClass) {	
			this.face.flip(false, doNotAddPlayClass);
		}
		
	});
		
}(jQuery));

/*jshint smarttabs:true */

/**
 * FlipClock.js
 *
 * @author     Justin Kimbrell
 * @copyright  2013 - Objective HTML, LLC
 * @licesnse   http://www.opensource.org/licenses/mit-license.php
 */
	
(function($) {
	
	"use strict";
	
	/**
	 * The FlipClock List class is used to build the list used to create 
	 * the card flip effect. This object fascilates selecting the correct
	 * node by passing a specific digit.
	 *
	 * @param 	object  A FlipClock.Factory object
	 * @param 	mixed   This is the digit used to set the clock. If an 
	 *				    object is passed, 0 will be used.	
	 * @param 	object  An object of properties to override the default	
	 */
	 	
	FlipClock.List = FlipClock.Base.extend({
		
		/**
		 * The digit (0-9)
		 */		
		 
		digit: 0,
		
		/**
		 * The CSS classes
		 */		
		 
		classes: {
			active: 'flip-clock-active',
			before: 'flip-clock-before',
			flip: 'flip'	
		},
				
		/**
		 * The parent FlipClock.Factory object
		 */		
		 
		factory: false,
		
		/**
		 * The jQuery object
		 */		
		 
		$el: false,

		/**
		 * The jQuery object (deprecated)
		 */		
		 
		$obj: false,
		
		/**
		 * The items in the list
		 */		
		 
		items: [],
		
		/**
		 * The last digit
		 */		
		 
		lastDigit: 0,
			
		/**
		 * Constructor
		 *
		 * @param  object  A FlipClock.Factory object
		 * @param  int     An integer use to select the correct digit
		 * @param  object  An object to override the default properties	 
		 */
		 
		constructor: function(factory, digit, options) {
			this.factory = factory;
			this.digit = digit;
			this.lastDigit = digit;
			this.$el = this.createList();
			
			// Depcrated support of the $obj property.
			this.$obj = this.$el;

			if(digit > 0) {
				this.select(digit);
			}

			this.factory.$el.append(this.$el);
		},
		
		/**
		 * Select the digit in the list
		 *
		 * @param  int  A digit 0-9	 
		 */
		 
		select: function(digit) {
			if(typeof digit === "undefined") {
				digit = this.digit;
			}
			else {
				this.digit = digit;
			}

			if(this.digit != this.lastDigit) {
				var $delete = this.$el.find('.'+this.classes.before).removeClass(this.classes.before);

				this.$el.find('.'+this.classes.active).removeClass(this.classes.active)
													  .addClass(this.classes.before);

				this.appendListItem(this.classes.active, this.digit);

				$delete.remove();

				this.lastDigit = this.digit;
			}	
		},
		
		/**
		 * Adds the play class to the DOM object
		 */
		 		
		play: function() {
			this.$el.addClass(this.factory.classes.play);
		},
		
		/**
		 * Removes the play class to the DOM object 
		 */
		 
		stop: function() {
			var t = this;

			setTimeout(function() {
				t.$el.removeClass(t.factory.classes.play);
			}, this.factory.timer.interval);
		},
		
		/**
		 * Creates the list item HTML and returns as a string 
		 */
		 
		createListItem: function(css, value) {
			return [
				'<li class="'+(css ? css : '')+'">',
					'<a href="#">',
						'<div class="up">',
							'<div class="shadow"></div>',
							'<div class="inn">'+(value ? value : '')+'</div>',
						'</div>',
						'<div class="down">',
							'<div class="shadow"></div>',
							'<div class="inn">'+(value ? value : '')+'</div>',
						'</div>',
					'</a>',
				'</li>'
			].join('');
		},

		/**
		 * Append the list item to the parent DOM node 
		 */

		appendListItem: function(css, value) {
			var html = this.createListItem(css, value);

			this.$el.append(html);
		},

		/**
		 * Create the list of digits and appends it to the DOM object 
		 */
		 
		createList: function() {

			var lastDigit = this.getPrevDigit() ? this.getPrevDigit() : this.digit;

			var html = $([
				'<ul class="'+this.classes.flip+' '+(this.factory.running ? this.factory.classes.play : '')+'">',
					this.createListItem(this.classes.before, lastDigit),
					this.createListItem(this.classes.active, this.digit),
				'</ul>'
			].join(''));
					
			return html;
		},

		getNextDigit: function() {
			return this.digit == 9 ? 0 : this.digit + 1;
		},

		getPrevDigit: function() {
			return this.digit == 0 ? 9 : this.digit - 1;
		}

	});
	
	
}(jQuery));

/*jshint smarttabs:true */

/**
 * FlipClock.js
 *
 * @author     Justin Kimbrell
 * @copyright  2013 - Objective HTML, LLC
 * @licesnse   http://www.opensource.org/licenses/mit-license.php
 */
	
(function($) {
	
	"use strict";
	
	/**
	 * Capitalize the first letter in a string
	 *
	 * @return string
	 */
	 
	String.prototype.ucfirst = function() {
		return this.substr(0, 1).toUpperCase() + this.substr(1);
	};
	
	/**
	 * jQuery helper method
	 *
	 * @param  int     An integer used to start the clock (no. seconds)
	 * @param  object  An object of properties to override the default	
	 */
	 
	$.fn.FlipClock = function(digit, options) {	
		return new FlipClock($(this), digit, options);
	};
	
	/**
	 * jQuery helper method
	 *
	 * @param  int     An integer used to start the clock (no. seconds)
	 * @param  object  An object of properties to override the default	
	 */
	 
	$.fn.flipClock = function(digit, options) {
		return $.fn.FlipClock(digit, options);
	};
	
}(jQuery));

/*jshint smarttabs:true */

/**
 * FlipClock.js
 *
 * @author     Justin Kimbrell
 * @copyright  2013 - Objective HTML, LLC
 * @licesnse   http://www.opensource.org/licenses/mit-license.php
 */
	
(function($) {
	
	"use strict";
			
	/**
	 * The FlipClock Time class is used to manage all the time 
	 * calculations.
	 *
	 * @param 	object  A FlipClock.Factory object
	 * @param 	mixed   This is the digit used to set the clock. If an 
	 *				    object is passed, 0 will be used.	
	 * @param 	object  An object of properties to override the default	
	 */
	 	
	FlipClock.Time = FlipClock.Base.extend({
		
		/**
		 * The time (in seconds) or a date object
		 */		
		 
		time: 0,
		
		/**
		 * The parent FlipClock.Factory object
		 */		
		 
		factory: false,
		
		/**
		 * The minimum number of digits the clock face must have
		 */		
		 
		minimumDigits: 0,

		/**
		 * Constructor
		 *
		 * @param  object  A FlipClock.Factory object
		 * @param  int     An integer use to select the correct digit
		 * @param  object  An object to override the default properties	 
		 */
		 
		constructor: function(factory, time, options) {
			if(typeof options != "object") {
				options = {};
			}

			if(!options.minimumDigits) {
				options.minimumDigits = factory.minimumDigits;
			}

			this.base(options);
			this.factory = factory;

			if(time) {
				this.time = time;
			}
		},

		/**
		 * Convert a string or integer to an array of digits
		 *
		 * @param   mixed  String or Integer of digits	 
		 * @return  array  An array of digits 
		 */
		 
		convertDigitsToArray: function(str) {
			var data = [];
			
			str = str.toString();
			
			for(var x = 0;x < str.length; x++) {
				if(str[x].match(/^\d*$/g)) {
					data.push(str[x]);	
				}
			}
			
			return data;
		},
		
		/**
		 * Get a specific digit from the time integer
		 *
		 * @param   int    The specific digit to select from the time	 
		 * @return  mixed  Returns FALSE if no digit is found, otherwise
		 *				   the method returns the defined digit	 
		 */
		 
		digit: function(i) {
			var timeStr = this.toString();
			var length  = timeStr.length;
			
			if(timeStr[length - i])	 {
				return timeStr[length - i];
			}
			
			return false;
		},

		/**
		 * Formats any array of digits into a valid array of digits
		 *
		 * @param   mixed  An array of digits	 
		 * @return  array  An array of digits 
		 */
		 
		digitize: function(obj) {
			var data = [];

			$.each(obj, function(i, value) {
				value = value.toString();
				
				if(value.length == 1) {
					value = '0'+value;
				}
				
				for(var x = 0; x < value.length; x++) {
					data.push(value.charAt(x));
				}				
			});

			if(data.length > this.minimumDigits) {
				this.minimumDigits = data.length;
			}
			
			if(this.minimumDigits > data.length) {
				for(var x = data.length; x < this.minimumDigits; x++) {
					data.unshift('0');
				}
			}

			return data;
		},
		
		/**
		 * Gets a new Date object for the current time
		 *
		 * @return  array  Returns a Date object
		 */

		getDateObject: function() {
			if(this.time instanceof Date) {
				return this.time;
			}

			return new Date((new Date()).getTime() + this.getTimeSeconds() * 1000);
		},
		
		/**
		 * Gets a digitized daily counter
		 *
		 * @return  object  Returns a digitized object
		 */

		getDayCounter: function(includeSeconds) {
			var digits = [
				this.getDays(),
				this.getHours(true),
				this.getMinutes(true)
			];

			if(includeSeconds) {
				digits.push(this.getSeconds(true));
			}

			return this.digitize(digits);
		},

		/**
		 * Gets number of days
		 *
		 * @param   bool  Should perform a modulus? If not sent, then no.
		 * @return  int   Retuns a floored integer
		 */
		 
		getDays: function(mod) {
			var days = this.getTimeSeconds() / 60 / 60 / 24;
			
			if(mod) {
				days = days % 7;
			}
			
			return Math.floor(days);
		},
		
		/**
		 * Gets an hourly breakdown
		 *
		 * @return  object  Returns a digitized object
		 */
		 
		getHourCounter: function() {
			var obj = this.digitize([
				this.getHours(),
				this.getMinutes(true),
				this.getSeconds(true)
			]);
			
			return obj;
		},
		
		/**
		 * Gets an hourly breakdown
		 *
		 * @return  object  Returns a digitized object
		 */
		 
		getHourly: function() {
			return this.getHourCounter();
		},
		
		/**
		 * Gets number of hours
		 *
		 * @param   bool  Should perform a modulus? If not sent, then no.
		 * @return  int   Retuns a floored integer
		 */
		 
		getHours: function(mod) {
			var hours = this.getTimeSeconds() / 60 / 60;
			
			if(mod) {
				hours = hours % 24;	
			}
			
			return Math.floor(hours);
		},
		
		/**
		 * Gets the twenty-four hour time
		 *
		 * @return  object  returns a digitized object
		 */
		 
		getMilitaryTime: function(date, showSeconds) {
			if(typeof showSeconds === "undefined") {
				showSeconds = true;
			}

			if(!date) {
				date = this.getDateObject();
			}

			var data  = [
				date.getHours(),
				date.getMinutes()			
			];

			if(showSeconds === true) {
				data.push(date.getSeconds());
			}

			return this.digitize(data);
		},
				
		/**
		 * Gets number of minutes
		 *
		 * @param   bool  Should perform a modulus? If not sent, then no.
		 * @return  int   Retuns a floored integer
		 */
		 
		getMinutes: function(mod) {
			var minutes = this.getTimeSeconds() / 60;
			
			if(mod) {
				minutes = minutes % 60;
			}
			
			return Math.floor(minutes);
		},
		
		/**
		 * Gets a minute breakdown
		 */
		 
		getMinuteCounter: function() {
			var obj = this.digitize([
				this.getMinutes(),
				this.getSeconds(true)
			]);

			return obj;
		},
		
		/**
		 * Gets time count in seconds regardless of if targetting date or not.
		 *
		 * @return  int   Returns a floored integer
		 */
		 
		getTimeSeconds: function(date) {
			if(!date) {
				date = new Date();
			}

			if (this.time instanceof Date) {
				if (this.factory.countdown) {
					return Math.max(this.time.getTime()/1000 - date.getTime()/1000,0);
				} else {
					return date.getTime()/1000 - this.time.getTime()/1000 ;
				}
			} else {
				return this.time;
			}
		},
		
		/**
		 * Gets the current twelve hour time
		 *
		 * @return  object  Returns a digitized object
		 */
		 
		getTime: function(date, showSeconds) {
			if(typeof showSeconds === "undefined") {
				showSeconds = true;
			}

			if(!date) {
				date = this.getDateObject();
			}

			console.log(date);

			
			var hours = date.getHours();
			var merid = hours > 12 ? 'PM' : 'AM';
			var data   = [
				hours > 12 ? hours - 12 : (hours === 0 ? 12 : hours),
				date.getMinutes()			
			];

			if(showSeconds === true) {
				data.push(date.getSeconds());
			}

			return this.digitize(data);
		},
		
		/**
		 * Gets number of seconds
		 *
		 * @param   bool  Should perform a modulus? If not sent, then no.
		 * @return  int   Retuns a ceiled integer
		 */
		 
		getSeconds: function(mod) {
			var seconds = this.getTimeSeconds();
			
			if(mod) {
				if(seconds == 60) {
					seconds = 0;
				}
				else {
					seconds = seconds % 60;
				}
			}
			
			return Math.ceil(seconds);
		},

		/**
		 * Gets number of weeks
		 *
		 * @param   bool  Should perform a modulus? If not sent, then no.
		 * @return  int   Retuns a floored integer
		 */
		 
		getWeeks: function(mod) {
			var weeks = this.getTimeSeconds() / 60 / 60 / 24 / 7;
			
			if(mod) {
				weeks = weeks % 52;
			}
			
			return Math.floor(weeks);
		},
		
		/**
		 * Removes a specific number of leading zeros from the array.
		 * This method prevents you from removing too many digits, even
		 * if you try.
		 *
		 * @param   int    Total number of digits to remove 
		 * @return  array  An array of digits 
		 */
		 
		removeLeadingZeros: function(totalDigits, digits) {
			var total    = 0;
			var newArray = [];
			
			$.each(digits, function(i, digit) {
				if(i < totalDigits) {
					total += parseInt(digits[i], 10);
				}
				else {
					newArray.push(digits[i]);
				}
			});
			
			if(total === 0) {
				return newArray;
			}
			
			return digits;
		},

		/**
		 * Adds X second to the current time
		 */

		addSeconds: function(x) {
			if(this.time instanceof Date) {
				this.time.setSeconds(this.time.getSeconds() + x);
			}
			else {
				this.time += x;
			}
		},

		/**
		 * Adds 1 second to the current time
		 */

		addSecond: function() {
			this.addSeconds(1);
		},

		/**
		 * Substracts X seconds from the current time
		 */

		subSeconds: function(x) {
			if(this.time instanceof Date) {
				this.time.setSeconds(this.time.getSeconds() - x);
			}
			else {
				this.time -= x;
			}
		},

		/**
		 * Substracts 1 second from the current time
		 */

		subSecond: function() {
			this.subSeconds(1);
		},
		
		/**
		 * Converts the object to a human readable string
		 */
		 
		toString: function() {
			return this.getTimeSeconds().toString();
		}
		
		/*
		getYears: function() {
			return Math.floor(this.time / 60 / 60 / 24 / 7 / 52);
		},
		
		getDecades: function() {
			return Math.floor(this.getWeeks() / 10);
		}*/
	});
	
}(jQuery));

/*jshint smarttabs:true */

/**
 * FlipClock.js
 *
 * @author     Justin Kimbrell
 * @copyright  2013 - Objective HTML, LLC
 * @licesnse   http://www.opensource.org/licenses/mit-license.php
 */
	
(function($) {
	
	"use strict";
	
	/**
	 * The FlipClock.Timer object managers the JS timers
	 *
	 * @param	object  The parent FlipClock.Factory object
	 * @param	object  Override the default options
	 */
	
	FlipClock.Timer = FlipClock.Base.extend({
		
		/**
		 * Callbacks
		 */		
		 
		callbacks: {
			destroy: false,
			create: false,
			init: false,
			interval: false,
			start: false,
			stop: false,
			reset: false
		},
		
		/**
		 * FlipClock timer count (how many intervals have passed)
		 */		
		 
		count: 0,
		
		/**
		 * The parent FlipClock.Factory object
		 */		
		 
		factory: false,
		
		/**
		 * Timer interval (1 second by default)
		 */		
		 
		interval: 1000,

		/**
		 * The rate of the animation in milliseconds (not currently in use)
		 */		
		 
		animationRate: 1000,
				
		/**
		 * Constructor
		 *
		 * @return	void
		 */		
		 
		constructor: function(factory, options) {
			this.base(options);
			this.factory = factory;
			this.callback(this.callbacks.init);	
			this.callback(this.callbacks.create);
		},
		
		/**
		 * This method gets the elapsed the time as an interger
		 *
		 * @return	void
		 */		
		 
		getElapsed: function() {
			return this.count * this.interval;
		},
		
		/**
		 * This method gets the elapsed the time as a Date object
		 *
		 * @return	void
		 */		
		 
		getElapsedTime: function() {
			return new Date(this.time + this.getElapsed());
		},
		
		/**
		 * This method is resets the timer
		 *
		 * @param 	callback  This method resets the timer back to 0
		 * @return	void
		 */		
		 
		reset: function(callback) {
			clearInterval(this.timer);
			this.count = 0;
			this._setInterval(callback);			
			this.callback(this.callbacks.reset);
		},
		
		/**
		 * This method is starts the timer
		 *
		 * @param 	callback  A function that is called once the timer is destroyed
		 * @return	void
		 */		
		 
		start: function(callback) {		
			this.factory.running = true;
			this._createTimer(callback);
			this.callback(this.callbacks.start);
		},
		
		/**
		 * This method is stops the timer
		 *
		 * @param 	callback  A function that is called once the timer is destroyed
		 * @return	void
		 */		
		 
		stop: function(callback) {
			this.factory.running = false;
			this._clearInterval(callback);
			this.callback(this.callbacks.stop);
			this.callback(callback);
		},
		
		/**
		 * Clear the timer interval
		 *
		 * @return	void
		 */		
		 
		_clearInterval: function() {
			clearInterval(this.timer);
		},
		
		/**
		 * Create the timer object
		 *
		 * @param 	callback  A function that is called once the timer is created
		 * @return	void
		 */		
		 
		_createTimer: function(callback) {
			this._setInterval(callback);		
		},
		
		/**
		 * Destroy the timer object
		 *
		 * @param 	callback  A function that is called once the timer is destroyed
		 * @return	void
		 */		
		 	
		_destroyTimer: function(callback) {
			this._clearInterval();			
			this.timer = false;
			this.callback(callback);
			this.callback(this.callbacks.destroy);
		},
		
		/**
		 * This method is called each time the timer interval is ran
		 *
		 * @param 	callback  A function that is called once the timer is destroyed
		 * @return	void
		 */		
		 
		_interval: function(callback) {
			this.callback(this.callbacks.interval);
			this.callback(callback);
			this.count++;
		},
		
		/**
		 * This sets the timer interval
		 *
		 * @param 	callback  A function that is called once the timer is destroyed
		 * @return	void
		 */		
		 
		_setInterval: function(callback) {
			var t = this;
	
			t._interval(callback);

			t.timer = setInterval(function() {		
				t._interval(callback);
			}, this.interval);
		}
			
	});
	
}(jQuery));

(function($) {
	
	/**
	 * Twenty-Four Hour Clock Face
	 *
	 * This class will generate a twenty-four our clock for FlipClock.js
	 *
	 * @param  object  The parent FlipClock.Factory object
	 * @param  object  An object of properties to override the default	
	 */
	 
	FlipClock.TwentyFourHourClockFace = FlipClock.Face.extend({

		/**
		 * Constructor
		 *
		 * @param  object  The parent FlipClock.Factory object
		 * @param  object  An object of properties to override the default	
		 */
		 
		constructor: function(factory, options) {
			this.base(factory, options);
		},

		/**
		 * Build the clock face
		 *
		 * @param  object  Pass the time that should be used to display on the clock.	
		 */
		 
		build: function(time) {
			var t        = this;
			var children = this.factory.$el.find('ul');

			if(!this.factory.time.time) {
				this.factory.original = new Date();

				this.factory.time = new FlipClock.Time(this.factory, this.factory.original);
			}

			var time = time ? time : this.factory.time.getMilitaryTime(false, this.showSeconds);

			if(time.length > children.length) {
				$.each(time, function(i, digit) {
					t.createList(digit);
				});
			}
			
			this.createDivider();
			this.createDivider();

			$(this.dividers[0]).insertBefore(this.lists[this.lists.length - 2].$el);
			$(this.dividers[1]).insertBefore(this.lists[this.lists.length - 4].$el);
			
			this.base();
		},
		
		/**
		 * Flip the clock face
		 */
		 
		flip: function(time, doNotAddPlayClass) {
			this.autoIncrement();
			
			time = time ? time : this.factory.time.getMilitaryTime(false, this.showSeconds);
			
			this.base(time, doNotAddPlayClass);	
		}
				
	});
	
}(jQuery));
(function($) {
		
	/**
	 * Counter Clock Face
	 *
	 * This class will generate a generice flip counter. The timer has been
	 * disabled. clock.increment() and clock.decrement() have been added.
	 *
	 * @param  object  The parent FlipClock.Factory object
	 * @param  object  An object of properties to override the default	
	 */
	 
	FlipClock.CounterFace = FlipClock.Face.extend({
		
		/**
		 * Tells the counter clock face if it should auto-increment
		 */

		shouldAutoIncrement: false,

		/**
		 * Constructor
		 *
		 * @param  object  The parent FlipClock.Factory object
		 * @param  object  An object of properties to override the default	
		 */
		 
		constructor: function(factory, options) {

			if(typeof options != "object") {
				options = {};
			}

			factory.autoStart = options.autoStart ? true : false;

			if(options.autoStart) {
				this.shouldAutoIncrement = true;
			}

			factory.increment = function() {
				factory.countdown = false;
				factory.setTime(factory.getTime().getTimeSeconds() + 1);
			};

			factory.decrement = function() {
				factory.countdown = true;
				var time = factory.getTime().getTimeSeconds();
				if(time > 0) {
					factory.setTime(time - 1);
				}
			};

			factory.setValue = function(digits) {
				factory.setTime(digits);
			};

			factory.setCounter = function(digits) {
				factory.setTime(digits);
			};

			this.base(factory, options);
		},

		/**
		 * Build the clock face	
		 */
		 
		build: function() {
			var t        = this;
			var children = this.factory.$el.find('ul');
			var time 	 = this.factory.getTime().digitize([this.factory.getTime().time]);

			if(time.length > children.length) {
				$.each(time, function(i, digit) {
					var list = t.createList(digit);

					list.select(digit);
				});
			
			}

			$.each(this.lists, function(i, list) {
				list.play();
			});

			this.base();
		},
		
		/**
		 * Flip the clock face
		 */
		 
		flip: function(time, doNotAddPlayClass) {			
			if(this.shouldAutoIncrement) {
				this.autoIncrement();
			}

			if(!time) {		
				time = this.factory.getTime().digitize([this.factory.getTime().time]);
			}

			this.base(time, doNotAddPlayClass);
		},

		/**
		 * Reset the clock face
		 */

		reset: function() {
			this.factory.time = new FlipClock.Time(
				this.factory, 
				this.factory.original ? Math.round(this.factory.original) : 0
			);

			this.flip();
		}
	});
	
}(jQuery));
(function($) {

	/**
	 * Daily Counter Clock Face
	 *
	 * This class will generate a daily counter for FlipClock.js. A
	 * daily counter will track days, hours, minutes, and seconds. If
	 * the number of available digits is exceeded in the count, a new
	 * digit will be created.
	 *
	 * @param  object  The parent FlipClock.Factory object
	 * @param  object  An object of properties to override the default
	 */

	FlipClock.DailyCounterFace = FlipClock.Face.extend({

		showSeconds: true,

		/**
		 * Constructor
		 *
		 * @param  object  The parent FlipClock.Factory object
		 * @param  object  An object of properties to override the default
		 */

		constructor: function(factory, options) {
			this.base(factory, options);
		},

		/**
		 * Build the clock face
		 */

		build: function(time) {
			var t = this;
			var children = this.factory.$el.find('ul');
			var offset = 0;

			time = time ? time : this.factory.time.getDayCounter(this.showSeconds);

			if(time.length > children.length) {
				$.each(time, function(i, digit) {
					t.createList(digit);
				});
			}

			if(this.showSeconds) {
				$(this.createDivider('Seconds')).insertBefore(this.lists[this.lists.length - 2].$el);
			}
			else
			{
				offset = 2;
			}

			$(this.createDivider('Minutes')).insertBefore(this.lists[this.lists.length - 4 + offset].$el);
			$(this.createDivider('Hours')).insertBefore(this.lists[this.lists.length - 6 + offset].$el);
			$(this.createDivider('Days', true)).insertBefore(this.lists[0].$el);

			this.base();
		},

		/**
		 * Flip the clock face
		 */

		flip: function(time, doNotAddPlayClass) {
			if(!time) {
				time = this.factory.time.getDayCounter(this.showSeconds);
			}

			this.autoIncrement();

			this.base(time, doNotAddPlayClass);
		}

	});

}(jQuery));
(function($) {
			
	/**
	 * Hourly Counter Clock Face
	 *
	 * This class will generate an hourly counter for FlipClock.js. An
	 * hour counter will track hours, minutes, and seconds. If number of
	 * available digits is exceeded in the count, a new digit will be 
	 * created.
	 *
	 * @param  object  The parent FlipClock.Factory object
	 * @param  object  An object of properties to override the default	
	 */
	 
	FlipClock.HourlyCounterFace = FlipClock.Face.extend({
			
		// clearExcessDigits: true,

		/**
		 * Constructor
		 *
		 * @param  object  The parent FlipClock.Factory object
		 * @param  object  An object of properties to override the default	
		 */
		 
		constructor: function(factory, options) {
			this.base(factory, options);
		},
		
		/**
		 * Build the clock face
		 */
		
		build: function(excludeHours, time) {
			var t = this;
			var children = this.factory.$el.find('ul');
			
			time = time ? time : this.factory.time.getHourCounter();
			
			if(time.length > children.length) {
				$.each(time, function(i, digit) {
					t.createList(digit);
				});
			}
			
			$(this.createDivider('Seconds')).insertBefore(this.lists[this.lists.length - 2].$el);
			$(this.createDivider('Minutes')).insertBefore(this.lists[this.lists.length - 4].$el);
			
			if(!excludeHours) {
				$(this.createDivider('Hours', true)).insertBefore(this.lists[0].$el);
			}
			
			this.base();
		},
		
		/**
		 * Flip the clock face
		 */
		 
		flip: function(time, doNotAddPlayClass) {
			if(!time) {
				time = this.factory.time.getHourCounter();
			}	

			this.autoIncrement();
		
			this.base(time, doNotAddPlayClass);
		},

		/**
		 * Append a newly created list to the clock
		 */

		appendDigitToClock: function(obj) {
			this.base(obj);

			this.dividers[0].insertAfter(this.dividers[0].next());
		}
		
	});
	
}(jQuery));
(function($) {
		
	/**
	 * Minute Counter Clock Face
	 *
	 * This class will generate a minute counter for FlipClock.js. A
	 * minute counter will track minutes and seconds. If an hour is 
	 * reached, the counter will reset back to 0. (4 digits max)
	 *
	 * @param  object  The parent FlipClock.Factory object
	 * @param  object  An object of properties to override the default	
	 */
	 
	FlipClock.MinuteCounterFace = FlipClock.HourlyCounterFace.extend({

		clearExcessDigits: false,

		/**
		 * Constructor
		 *
		 * @param  object  The parent FlipClock.Factory object
		 * @param  object  An object of properties to override the default	
		 */
		 
		constructor: function(factory, options) {
			this.base(factory, options);
		},
		
		/**
		 * Build the clock face	
		 */
		 
		build: function() {
			this.base(true, this.factory.time.getMinuteCounter());
		},
		
		/**
		 * Flip the clock face
		 */
		 
		flip: function(time, doNotAddPlayClass) {
			if(!time) {
				time = this.factory.time.getMinuteCounter();
			}

			this.base(time, doNotAddPlayClass);
		}

	});
	
}(jQuery));
(function($) {
		
	/**
	 * Twelve Hour Clock Face
	 *
	 * This class will generate a twelve hour clock for FlipClock.js
	 *
	 * @param  object  The parent FlipClock.Factory object
	 * @param  object  An object of properties to override the default	
	 */
	 
	FlipClock.TwelveHourClockFace = FlipClock.TwentyFourHourClockFace.extend({
		
		/**
		 * The meridium jQuery DOM object
		 */
		 
		meridium: false,
		
		/**
		 * The meridium text as string for easy access
		 */
		 
		meridiumText: 'AM',
					
		/**
		 * Build the clock face
		 *
		 * @param  object  Pass the time that should be used to display on the clock.	
		 */
		 
		build: function() {
			var t = this;

			var time = this.factory.time.getTime(false, this.showSeconds);

			this.base(time);			
			this.meridiumText = this.getMeridium();			
			this.meridium = $([
				'<ul class="flip-clock-meridium">',
					'<li>',
						'<a href="#">'+this.meridiumText+'</a>',
					'</li>',
				'</ul>'
			].join(''));
						
			this.meridium.insertAfter(this.lists[this.lists.length-1].$el);
		},
		
		/**
		 * Flip the clock face
		 */
		 
		flip: function(time, doNotAddPlayClass) {			
			if(this.meridiumText != this.getMeridium()) {
				this.meridiumText = this.getMeridium();
				this.meridium.find('a').html(this.meridiumText);	
			}
			this.base(this.factory.time.getTime(false, this.showSeconds), doNotAddPlayClass);	
		},
		
		/**
		 * Get the current meridium
		 *
		 * @return  string  Returns the meridium (AM|PM)
		 */
		 
		getMeridium: function() {
			return new Date().getHours() >= 12 ? 'PM' : 'AM';
		},
		
		/**
		 * Is it currently in the post-medirium?
		 *
		 * @return  bool  Returns true or false
		 */
		 
		isPM: function() {
			return this.getMeridium() == 'PM' ? true : false;
		},

		/**
		 * Is it currently before the post-medirium?
		 *
		 * @return  bool  Returns true or false
		 */
		 
		isAM: function() {
			return this.getMeridium() == 'AM' ? true : false;
		}
				
	});
	
}(jQuery));
(function($) {

    /**
     * FlipClock Arabic Language Pack
     *
     * This class will be used to translate tokens into the Arabic language.
     *
     */

    FlipClock.Lang.Arabic = {

      'years'   : 'سنوات',
      'months'  : 'شهور',
      'days'    : 'أيام',
      'hours'   : 'ساعات',
      'minutes' : 'دقائق',
      'seconds' : 'ثواني'

    };

    /* Create various aliases for convenience */

    FlipClock.Lang['ar']      = FlipClock.Lang.Arabic;
    FlipClock.Lang['ar-ar']   = FlipClock.Lang.Arabic;
    FlipClock.Lang['arabic']  = FlipClock.Lang.Arabic;

}(jQuery));
(function($) {
		
	/**
	 * FlipClock Danish Language Pack
	 *
	 * This class will used to translate tokens into the Danish language.
	 *	
	 */
	 
	FlipClock.Lang.Danish = {
		
		'years'   : 'År',
		'months'  : 'Måneder',
		'days'    : 'Dage',
		'hours'   : 'Timer',
		'minutes' : 'Minutter',
		'seconds' : 'Sekunder'	

	};
	
	/* Create various aliases for convenience */

	FlipClock.Lang['da']     = FlipClock.Lang.Danish;
	FlipClock.Lang['da-dk']  = FlipClock.Lang.Danish;
	FlipClock.Lang['danish'] = FlipClock.Lang.Danish;

}(jQuery));
(function($) {
		
	/**
	 * FlipClock German Language Pack
	 *
	 * This class will used to translate tokens into the German language.
	 *	
	 */
	 
	FlipClock.Lang.German = {
		
		'years'   : 'Jahre',
		'months'  : 'Monate',
		'days'    : 'Tage',
		'hours'   : 'Stunden',
		'minutes' : 'Minuten',
		'seconds' : 'Sekunden'	
 
	};
	
	/* Create various aliases for convenience */
 
	FlipClock.Lang['de']     = FlipClock.Lang.German;
	FlipClock.Lang['de-de']  = FlipClock.Lang.German;
	FlipClock.Lang['german'] = FlipClock.Lang.German;
 
}(jQuery));
(function($) {
		
	/**
	 * FlipClock English Language Pack
	 *
	 * This class will used to translate tokens into the English language.
	 *	
	 */
	 
	FlipClock.Lang.English = {
		
		'years'   : 'Years',
		'months'  : 'Months',
		'days'    : 'Days',
		'hours'   : 'Hours',
		'minutes' : 'Minutes',
		'seconds' : 'Seconds'	

	};
	
	/* Create various aliases for convenience */

	FlipClock.Lang['en']      = FlipClock.Lang.English;
	FlipClock.Lang['en-us']   = FlipClock.Lang.English;
	FlipClock.Lang['english'] = FlipClock.Lang.English;

}(jQuery));
(function($) {

	/**
	 * FlipClock Spanish Language Pack
	 *
	 * This class will used to translate tokens into the Spanish language.
	 *
	 */

	FlipClock.Lang.Spanish = {

		'years'   : 'Años',
		'months'  : 'Meses',
		'days'    : 'Días',
		'hours'   : 'Horas',
		'minutes' : 'Minutos',
		'seconds' : 'Segundos'

	};

	/* Create various aliases for convenience */

	FlipClock.Lang['es']      = FlipClock.Lang.Spanish;
	FlipClock.Lang['es-es']   = FlipClock.Lang.Spanish;
	FlipClock.Lang['spanish'] = FlipClock.Lang.Spanish;

}(jQuery));
(function($) {
		
	/**
	 * FlipClock Finnish Language Pack
	 *
	 * This class will used to translate tokens into the Finnish language.
	 *	
	 */
	 
	FlipClock.Lang.Finnish = {
		
		'years'   : 'Vuotta',
		'months'  : 'Kuukautta',
		'days'    : 'Päivää',
		'hours'   : 'Tuntia',
		'minutes' : 'Minuuttia',
		'seconds' : 'Sekuntia'	

	};
	
	/* Create various aliases for convenience */

	FlipClock.Lang['fi']      = FlipClock.Lang.Finnish;
	FlipClock.Lang['fi-fi']   = FlipClock.Lang.Finnish;
	FlipClock.Lang['finnish'] = FlipClock.Lang.Finnish;

}(jQuery));

(function($) {

  /**
   * FlipClock Canadian French Language Pack
   *
   * This class will used to translate tokens into the Canadian French language.
   *
   */

  FlipClock.Lang.French = {

    'years'   : 'Ans',
    'months'  : 'Mois',
    'days'    : 'Jours',
    'hours'   : 'Heures',
    'minutes' : 'Minutes',
    'seconds' : 'Secondes'

  };

  /* Create various aliases for convenience */

  FlipClock.Lang['fr']      = FlipClock.Lang.French;
  FlipClock.Lang['fr-ca']   = FlipClock.Lang.French;
  FlipClock.Lang['french']  = FlipClock.Lang.French;

}(jQuery));

(function($) {
		
	/**
	 * FlipClock Italian Language Pack
	 *
	 * This class will used to translate tokens into the Italian language.
	 *	
	 */
	 
	FlipClock.Lang.Italian = {
		
		'years'   : 'Anni',
		'months'  : 'Mesi',
		'days'    : 'Giorni',
		'hours'   : 'Ore',
		'minutes' : 'Minuti',
		'seconds' : 'Secondi'	

	};
	
	/* Create various aliases for convenience */

	FlipClock.Lang['it']      = FlipClock.Lang.Italian;
	FlipClock.Lang['it-it']   = FlipClock.Lang.Italian;
	FlipClock.Lang['italian'] = FlipClock.Lang.Italian;
	
}(jQuery));

(function($) {

  /**
   * FlipClock Latvian Language Pack
   *
   * This class will used to translate tokens into the Latvian language.
   *
   */

  FlipClock.Lang.Latvian = {

    'years'   : 'Gadi',
    'months'  : 'Mēneši',
    'days'    : 'Dienas',
    'hours'   : 'Stundas',
    'minutes' : 'Minūtes',
    'seconds' : 'Sekundes'

  };

  /* Create various aliases for convenience */

  FlipClock.Lang['lv']      = FlipClock.Lang.Latvian;
  FlipClock.Lang['lv-lv']   = FlipClock.Lang.Latvian;
  FlipClock.Lang['latvian'] = FlipClock.Lang.Latvian;

}(jQuery));
(function($) {

    /**
     * FlipClock Dutch Language Pack
     *
     * This class will used to translate tokens into the Dutch language.
     */

    FlipClock.Lang.Dutch = {

        'years'   : 'Jaren',
        'months'  : 'Maanden',
        'days'    : 'Dagen',
        'hours'   : 'Uren',
        'minutes' : 'Minuten',
        'seconds' : 'Seconden'

    };

    /* Create various aliases for convenience */

    FlipClock.Lang['nl']      = FlipClock.Lang.Dutch;
    FlipClock.Lang['nl-be']   = FlipClock.Lang.Dutch;
    FlipClock.Lang['dutch']   = FlipClock.Lang.Dutch;

}(jQuery));

(function($) {

	/**
	 * FlipClock Norwegian-Bokmål Language Pack
	 *
	 * This class will used to translate tokens into the Norwegian language.
	 *	
	 */

	FlipClock.Lang.Norwegian = {

		'years'   : 'År',
		'months'  : 'Måneder',
		'days'    : 'Dager',
		'hours'   : 'Timer',
		'minutes' : 'Minutter',
		'seconds' : 'Sekunder'	

	};

	/* Create various aliases for convenience */

	FlipClock.Lang['no']      = FlipClock.Lang.Norwegian;
	FlipClock.Lang['nb']      = FlipClock.Lang.Norwegian;
	FlipClock.Lang['no-nb']   = FlipClock.Lang.Norwegian;
	FlipClock.Lang['norwegian'] = FlipClock.Lang.Norwegian;

}(jQuery));

(function($) {

	/**
	 * FlipClock Portuguese Language Pack
	 *
	 * This class will used to translate tokens into the Portuguese language.
	 *
	 */

	FlipClock.Lang.Portuguese = {

		'years'   : 'Anos',
		'months'  : 'Meses',
		'days'    : 'Dias',
		'hours'   : 'Horas',
		'minutes' : 'Minutos',
		'seconds' : 'Segundos'

	};

	/* Create various aliases for convenience */

	FlipClock.Lang['pt']         = FlipClock.Lang.Portuguese;
	FlipClock.Lang['pt-br']      = FlipClock.Lang.Portuguese;
	FlipClock.Lang['portuguese'] = FlipClock.Lang.Portuguese;

}(jQuery));
(function($) {

  /**
   * FlipClock Russian Language Pack
   *
   * This class will used to translate tokens into the Russian language.
   *
   */

  FlipClock.Lang.Russian = {

    'years'   : 'лет',
    'months'  : 'месяцев',
    'days'    : 'дней',
    'hours'   : 'часов',
    'minutes' : 'минут',
    'seconds' : 'секунд'

  };

  /* Create various aliases for convenience */

  FlipClock.Lang['ru']      = FlipClock.Lang.Russian;
  FlipClock.Lang['ru-ru']   = FlipClock.Lang.Russian;
  FlipClock.Lang['russian']  = FlipClock.Lang.Russian;

}(jQuery));
(function($) {
		
	/**
	 * FlipClock Swedish Language Pack
	 *
	 * This class will used to translate tokens into the Swedish language.
	 *	
	 */
	 
	FlipClock.Lang.Swedish = {
		
		'years'   : 'År',
		'months'  : 'Månader',
		'days'    : 'Dagar',
		'hours'   : 'Timmar',
		'minutes' : 'Minuter',
		'seconds' : 'Sekunder'	

	};
	
	/* Create various aliases for convenience */

	FlipClock.Lang['sv']      = FlipClock.Lang.Swedish;
	FlipClock.Lang['sv-se']   = FlipClock.Lang.Swedish;
	FlipClock.Lang['swedish'] = FlipClock.Lang.Swedish;

}(jQuery));

(function($) {
		
	/**
	 * FlipClock Chinese Language Pack
	 *
	 * This class will used to translate tokens into the Chinese language.
	 *	
	 */
	 
	FlipClock.Lang.Chinese = {
		
		'years'   : '年',
		'months'  : '月',
		'days'    : '日',
		'hours'   : '时',
		'minutes' : '分',
		'seconds' : '秒'

	};
	
	/* Create various aliases for convenience */

	FlipClock.Lang['zh']      = FlipClock.Lang.Chinese;
	FlipClock.Lang['zh-cn']   = FlipClock.Lang.Chinese;
	FlipClock.Lang['chinese'] = FlipClock.Lang.Chinese;

}(jQuery));
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJmbGlwY2xvY2suanMiXSwic291cmNlc0NvbnRlbnQiOlsiLypcblx0QmFzZS5qcywgdmVyc2lvbiAxLjFhXG5cdENvcHlyaWdodCAyMDA2LTIwMTAsIERlYW4gRWR3YXJkc1xuXHRMaWNlbnNlOiBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuKi9cblxudmFyIEJhc2UgPSBmdW5jdGlvbigpIHtcblx0Ly8gZHVtbXlcbn07XG5cbkJhc2UuZXh0ZW5kID0gZnVuY3Rpb24oX2luc3RhbmNlLCBfc3RhdGljKSB7IC8vIHN1YmNsYXNzXG5cdFxuXHRcInVzZSBzdHJpY3RcIjtcblx0XG5cdHZhciBleHRlbmQgPSBCYXNlLnByb3RvdHlwZS5leHRlbmQ7XG5cdFxuXHQvLyBidWlsZCB0aGUgcHJvdG90eXBlXG5cdEJhc2UuX3Byb3RvdHlwaW5nID0gdHJ1ZTtcblx0XG5cdHZhciBwcm90byA9IG5ldyB0aGlzKCk7XG5cdFxuXHRleHRlbmQuY2FsbChwcm90bywgX2luc3RhbmNlKTtcblx0XG5cdHByb3RvLmJhc2UgPSBmdW5jdGlvbigpIHtcblx0Ly8gY2FsbCB0aGlzIG1ldGhvZCBmcm9tIGFueSBvdGhlciBtZXRob2QgdG8gaW52b2tlIHRoYXQgbWV0aG9kJ3MgYW5jZXN0b3Jcblx0fTtcblxuXHRkZWxldGUgQmFzZS5fcHJvdG90eXBpbmc7XG5cdFxuXHQvLyBjcmVhdGUgdGhlIHdyYXBwZXIgZm9yIHRoZSBjb25zdHJ1Y3RvciBmdW5jdGlvblxuXHQvL3ZhciBjb25zdHJ1Y3RvciA9IHByb3RvLmNvbnN0cnVjdG9yLnZhbHVlT2YoKTsgLy8tZGVhblxuXHR2YXIgY29uc3RydWN0b3IgPSBwcm90by5jb25zdHJ1Y3Rvcjtcblx0dmFyIGtsYXNzID0gcHJvdG8uY29uc3RydWN0b3IgPSBmdW5jdGlvbigpIHtcblx0XHRpZiAoIUJhc2UuX3Byb3RvdHlwaW5nKSB7XG5cdFx0XHRpZiAodGhpcy5fY29uc3RydWN0aW5nIHx8IHRoaXMuY29uc3RydWN0b3IgPT0ga2xhc3MpIHsgLy8gaW5zdGFudGlhdGlvblxuXHRcdFx0XHR0aGlzLl9jb25zdHJ1Y3RpbmcgPSB0cnVlO1xuXHRcdFx0XHRjb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXHRcdFx0XHRkZWxldGUgdGhpcy5fY29uc3RydWN0aW5nO1xuXHRcdFx0fSBlbHNlIGlmIChhcmd1bWVudHNbMF0gIT09IG51bGwpIHsgLy8gY2FzdGluZ1xuXHRcdFx0XHRyZXR1cm4gKGFyZ3VtZW50c1swXS5leHRlbmQgfHwgZXh0ZW5kKS5jYWxsKGFyZ3VtZW50c1swXSwgcHJvdG8pO1xuXHRcdFx0fVxuXHRcdH1cblx0fTtcblx0XG5cdC8vIGJ1aWxkIHRoZSBjbGFzcyBpbnRlcmZhY2Vcblx0a2xhc3MuYW5jZXN0b3IgPSB0aGlzO1xuXHRrbGFzcy5leHRlbmQgPSB0aGlzLmV4dGVuZDtcblx0a2xhc3MuZm9yRWFjaCA9IHRoaXMuZm9yRWFjaDtcblx0a2xhc3MuaW1wbGVtZW50ID0gdGhpcy5pbXBsZW1lbnQ7XG5cdGtsYXNzLnByb3RvdHlwZSA9IHByb3RvO1xuXHRrbGFzcy50b1N0cmluZyA9IHRoaXMudG9TdHJpbmc7XG5cdGtsYXNzLnZhbHVlT2YgPSBmdW5jdGlvbih0eXBlKSB7XG5cdFx0Ly9yZXR1cm4gKHR5cGUgPT0gXCJvYmplY3RcIikgPyBrbGFzcyA6IGNvbnN0cnVjdG9yOyAvLy1kZWFuXG5cdFx0cmV0dXJuICh0eXBlID09IFwib2JqZWN0XCIpID8ga2xhc3MgOiBjb25zdHJ1Y3Rvci52YWx1ZU9mKCk7XG5cdH07XG5cdGV4dGVuZC5jYWxsKGtsYXNzLCBfc3RhdGljKTtcblx0Ly8gY2xhc3MgaW5pdGlhbGlzYXRpb25cblx0aWYgKHR5cGVvZiBrbGFzcy5pbml0ID09IFwiZnVuY3Rpb25cIikga2xhc3MuaW5pdCgpO1xuXHRyZXR1cm4ga2xhc3M7XG59O1xuXG5CYXNlLnByb3RvdHlwZSA9IHtcdFxuXHRleHRlbmQ6IGZ1bmN0aW9uKHNvdXJjZSwgdmFsdWUpIHtcblx0XHRpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHsgLy8gZXh0ZW5kaW5nIHdpdGggYSBuYW1lL3ZhbHVlIHBhaXJcblx0XHRcdHZhciBhbmNlc3RvciA9IHRoaXNbc291cmNlXTtcblx0XHRcdGlmIChhbmNlc3RvciAmJiAodHlwZW9mIHZhbHVlID09IFwiZnVuY3Rpb25cIikgJiYgLy8gb3ZlcnJpZGluZyBhIG1ldGhvZD9cblx0XHRcdFx0Ly8gdGhlIHZhbHVlT2YoKSBjb21wYXJpc29uIGlzIHRvIGF2b2lkIGNpcmN1bGFyIHJlZmVyZW5jZXNcblx0XHRcdFx0KCFhbmNlc3Rvci52YWx1ZU9mIHx8IGFuY2VzdG9yLnZhbHVlT2YoKSAhPSB2YWx1ZS52YWx1ZU9mKCkpICYmXG5cdFx0XHRcdC9cXGJiYXNlXFxiLy50ZXN0KHZhbHVlKSkge1xuXHRcdFx0XHQvLyBnZXQgdGhlIHVuZGVybHlpbmcgbWV0aG9kXG5cdFx0XHRcdHZhciBtZXRob2QgPSB2YWx1ZS52YWx1ZU9mKCk7XG5cdFx0XHRcdC8vIG92ZXJyaWRlXG5cdFx0XHRcdHZhbHVlID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0dmFyIHByZXZpb3VzID0gdGhpcy5iYXNlIHx8IEJhc2UucHJvdG90eXBlLmJhc2U7XG5cdFx0XHRcdFx0dGhpcy5iYXNlID0gYW5jZXN0b3I7XG5cdFx0XHRcdFx0dmFyIHJldHVyblZhbHVlID0gbWV0aG9kLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cdFx0XHRcdFx0dGhpcy5iYXNlID0gcHJldmlvdXM7XG5cdFx0XHRcdFx0cmV0dXJuIHJldHVyblZhbHVlO1xuXHRcdFx0XHR9O1xuXHRcdFx0XHQvLyBwb2ludCB0byB0aGUgdW5kZXJseWluZyBtZXRob2Rcblx0XHRcdFx0dmFsdWUudmFsdWVPZiA9IGZ1bmN0aW9uKHR5cGUpIHtcblx0XHRcdFx0XHRyZXR1cm4gKHR5cGUgPT0gXCJvYmplY3RcIikgPyB2YWx1ZSA6IG1ldGhvZDtcblx0XHRcdFx0fTtcblx0XHRcdFx0dmFsdWUudG9TdHJpbmcgPSBCYXNlLnRvU3RyaW5nO1xuXHRcdFx0fVxuXHRcdFx0dGhpc1tzb3VyY2VdID0gdmFsdWU7XG5cdFx0fSBlbHNlIGlmIChzb3VyY2UpIHsgLy8gZXh0ZW5kaW5nIHdpdGggYW4gb2JqZWN0IGxpdGVyYWxcblx0XHRcdHZhciBleHRlbmQgPSBCYXNlLnByb3RvdHlwZS5leHRlbmQ7XG5cdFx0XHQvLyBpZiB0aGlzIG9iamVjdCBoYXMgYSBjdXN0b21pc2VkIGV4dGVuZCBtZXRob2QgdGhlbiB1c2UgaXRcblx0XHRcdGlmICghQmFzZS5fcHJvdG90eXBpbmcgJiYgdHlwZW9mIHRoaXMgIT0gXCJmdW5jdGlvblwiKSB7XG5cdFx0XHRcdGV4dGVuZCA9IHRoaXMuZXh0ZW5kIHx8IGV4dGVuZDtcblx0XHRcdH1cblx0XHRcdHZhciBwcm90byA9IHt0b1NvdXJjZTogbnVsbH07XG5cdFx0XHQvLyBkbyB0aGUgXCJ0b1N0cmluZ1wiIGFuZCBvdGhlciBtZXRob2RzIG1hbnVhbGx5XG5cdFx0XHR2YXIgaGlkZGVuID0gW1wiY29uc3RydWN0b3JcIiwgXCJ0b1N0cmluZ1wiLCBcInZhbHVlT2ZcIl07XG5cdFx0XHQvLyBpZiB3ZSBhcmUgcHJvdG90eXBpbmcgdGhlbiBpbmNsdWRlIHRoZSBjb25zdHJ1Y3RvclxuXHRcdFx0dmFyIGkgPSBCYXNlLl9wcm90b3R5cGluZyA/IDAgOiAxO1xuXHRcdFx0d2hpbGUgKGtleSA9IGhpZGRlbltpKytdKSB7XG5cdFx0XHRcdGlmIChzb3VyY2Vba2V5XSAhPSBwcm90b1trZXldKSB7XG5cdFx0XHRcdFx0ZXh0ZW5kLmNhbGwodGhpcywga2V5LCBzb3VyY2Vba2V5XSk7XG5cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0Ly8gY29weSBlYWNoIG9mIHRoZSBzb3VyY2Ugb2JqZWN0J3MgcHJvcGVydGllcyB0byB0aGlzIG9iamVjdFxuXHRcdFx0Zm9yICh2YXIga2V5IGluIHNvdXJjZSkge1xuXHRcdFx0XHRpZiAoIXByb3RvW2tleV0pIGV4dGVuZC5jYWxsKHRoaXMsIGtleSwgc291cmNlW2tleV0pO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gdGhpcztcblx0fVxufTtcblxuLy8gaW5pdGlhbGlzZVxuQmFzZSA9IEJhc2UuZXh0ZW5kKHtcblx0Y29uc3RydWN0b3I6IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMuZXh0ZW5kKGFyZ3VtZW50c1swXSk7XG5cdH1cbn0sIHtcblx0YW5jZXN0b3I6IE9iamVjdCxcblx0dmVyc2lvbjogXCIxLjFcIixcblx0XG5cdGZvckVhY2g6IGZ1bmN0aW9uKG9iamVjdCwgYmxvY2ssIGNvbnRleHQpIHtcblx0XHRmb3IgKHZhciBrZXkgaW4gb2JqZWN0KSB7XG5cdFx0XHRpZiAodGhpcy5wcm90b3R5cGVba2V5XSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdGJsb2NrLmNhbGwoY29udGV4dCwgb2JqZWN0W2tleV0sIGtleSwgb2JqZWN0KTtcblx0XHRcdH1cblx0XHR9XG5cdH0sXG5cdFx0XG5cdGltcGxlbWVudDogZnVuY3Rpb24oKSB7XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcblx0XHRcdGlmICh0eXBlb2YgYXJndW1lbnRzW2ldID09IFwiZnVuY3Rpb25cIikge1xuXHRcdFx0XHQvLyBpZiBpdCdzIGEgZnVuY3Rpb24sIGNhbGwgaXRcblx0XHRcdFx0YXJndW1lbnRzW2ldKHRoaXMucHJvdG90eXBlKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdC8vIGFkZCB0aGUgaW50ZXJmYWNlIHVzaW5nIHRoZSBleHRlbmQgbWV0aG9kXG5cdFx0XHRcdHRoaXMucHJvdG90eXBlLmV4dGVuZChhcmd1bWVudHNbaV0pO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gdGhpcztcblx0fSxcblx0XG5cdHRvU3RyaW5nOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gU3RyaW5nKHRoaXMudmFsdWVPZigpKTtcblx0fVxufSk7XG4vKmpzaGludCBzbWFydHRhYnM6dHJ1ZSAqL1xuXG52YXIgRmxpcENsb2NrO1xuXHRcbi8qKlxuICogRmxpcENsb2NrLmpzXG4gKlxuICogQGF1dGhvciAgICAgSnVzdGluIEtpbWJyZWxsXG4gKiBAY29weXJpZ2h0ICAyMDEzIC0gT2JqZWN0aXZlIEhUTUwsIExMQ1xuICogQGxpY2VzbnNlICAgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcbiAqL1xuXHRcbihmdW5jdGlvbigkKSB7XG5cdFxuXHRcInVzZSBzdHJpY3RcIjtcblx0XG5cdC8qKlxuXHQgKiBGbGlwRmxvY2sgSGVscGVyXG5cdCAqXG5cdCAqIEBwYXJhbSAgb2JqZWN0ICBBIGpRdWVyeSBvYmplY3Qgb3IgQ1NTIHNlbGVjdFxuXHQgKiBAcGFyYW0gIGludCAgICAgQW4gaW50ZWdlciB1c2VkIHRvIHN0YXJ0IHRoZSBjbG9jayAobm8uIHNlY29uZHMpXG5cdCAqIEBwYXJhbSAgb2JqZWN0ICBBbiBvYmplY3Qgb2YgcHJvcGVydGllcyB0byBvdmVycmlkZSB0aGUgZGVmYXVsdFx0XG5cdCAqL1xuXHQgXG5cdEZsaXBDbG9jayA9IGZ1bmN0aW9uKG9iaiwgZGlnaXQsIG9wdGlvbnMpIHtcblx0XHRpZihkaWdpdCBpbnN0YW5jZW9mIE9iamVjdCAmJiBkaWdpdCBpbnN0YW5jZW9mIERhdGUgPT09IGZhbHNlKSB7XG5cdFx0XHRvcHRpb25zID0gZGlnaXQ7XG5cdFx0XHRkaWdpdCA9IDA7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIG5ldyBGbGlwQ2xvY2suRmFjdG9yeShvYmosIGRpZ2l0LCBvcHRpb25zKTtcblx0fTtcblxuXHQvKipcblx0ICogVGhlIGdsb2JhbCBGbGlwQ2xvY2suTGFuZyBvYmplY3Rcblx0ICovXG5cblx0RmxpcENsb2NrLkxhbmcgPSB7fTtcblx0XG5cdC8qKlxuXHQgKiBUaGUgQmFzZSBGbGlwQ2xvY2sgY2xhc3MgaXMgdXNlZCB0byBleHRlbmQgYWxsIG90aGVyIEZsaXBGbG9ja1xuXHQgKiBjbGFzc2VzLiBJdCBoYW5kbGVzIHRoZSBjYWxsYmFja3MgYW5kIHRoZSBiYXNpYyBzZXR0ZXJzL2dldHRlcnNcblx0ICpcdFxuXHQgKiBAcGFyYW0gXHRvYmplY3QgIEFuIG9iamVjdCBvZiB0aGUgZGVmYXVsdCBwcm9wZXJ0aWVzXG5cdCAqIEBwYXJhbSBcdG9iamVjdCAgQW4gb2JqZWN0IG9mIHByb3BlcnRpZXMgdG8gb3ZlcnJpZGUgdGhlIGRlZmF1bHRcdFxuXHQgKi9cblxuXHRGbGlwQ2xvY2suQmFzZSA9IEJhc2UuZXh0ZW5kKHtcblx0XHRcblx0XHQvKipcblx0XHQgKiBCdWlsZCBEYXRlXG5cdFx0ICovXG5cdFx0IFxuXHRcdGJ1aWxkRGF0ZTogJzIwMTQtMTItMTInLFxuXHRcdFxuXHRcdC8qKlxuXHRcdCAqIFZlcnNpb25cblx0XHQgKi9cblx0XHQgXG5cdFx0dmVyc2lvbjogJzAuNy43Jyxcblx0XHRcblx0XHQvKipcblx0XHQgKiBTZXRzIHRoZSBkZWZhdWx0IG9wdGlvbnNcblx0XHQgKlxuXHRcdCAqIEBwYXJhbVx0b2JqZWN0IFx0VGhlIGRlZmF1bHQgb3B0aW9uc1xuXHRcdCAqIEBwYXJhbVx0b2JqZWN0IFx0VGhlIG92ZXJyaWRlIG9wdGlvbnNcblx0XHQgKi9cblx0XHQgXG5cdFx0Y29uc3RydWN0b3I6IGZ1bmN0aW9uKF9kZWZhdWx0LCBvcHRpb25zKSB7XG5cdFx0XHRpZih0eXBlb2YgX2RlZmF1bHQgIT09IFwib2JqZWN0XCIpIHtcblx0XHRcdFx0X2RlZmF1bHQgPSB7fTtcblx0XHRcdH1cblx0XHRcdGlmKHR5cGVvZiBvcHRpb25zICE9PSBcIm9iamVjdFwiKSB7XG5cdFx0XHRcdG9wdGlvbnMgPSB7fTtcblx0XHRcdH1cblx0XHRcdHRoaXMuc2V0T3B0aW9ucygkLmV4dGVuZCh0cnVlLCB7fSwgX2RlZmF1bHQsIG9wdGlvbnMpKTtcblx0XHR9LFxuXHRcdFxuXHRcdC8qKlxuXHRcdCAqIERlbGVnYXRlcyB0aGUgY2FsbGJhY2sgdG8gdGhlIGRlZmluZWQgbWV0aG9kXG5cdFx0ICpcblx0XHQgKiBAcGFyYW1cdG9iamVjdCBcdFRoZSBkZWZhdWx0IG9wdGlvbnNcblx0XHQgKiBAcGFyYW1cdG9iamVjdCBcdFRoZSBvdmVycmlkZSBvcHRpb25zXG5cdFx0ICovXG5cdFx0IFxuXHRcdGNhbGxiYWNrOiBmdW5jdGlvbihtZXRob2QpIHtcblx0XHQgXHRpZih0eXBlb2YgbWV0aG9kID09PSBcImZ1bmN0aW9uXCIpIHtcblx0XHRcdFx0dmFyIGFyZ3MgPSBbXTtcblx0XHRcdFx0XHRcdFx0XHRcblx0XHRcdFx0Zm9yKHZhciB4ID0gMTsgeCA8PSBhcmd1bWVudHMubGVuZ3RoOyB4KyspIHtcblx0XHRcdFx0XHRpZihhcmd1bWVudHNbeF0pIHtcblx0XHRcdFx0XHRcdGFyZ3MucHVzaChhcmd1bWVudHNbeF0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRcblx0XHRcdFx0bWV0aG9kLmFwcGx5KHRoaXMsIGFyZ3MpO1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0IFxuXHRcdC8qKlxuXHRcdCAqIExvZyBhIHN0cmluZyBpbnRvIHRoZSBjb25zb2xlIGlmIGl0IGV4aXN0c1xuXHRcdCAqXG5cdFx0ICogQHBhcmFtIFx0c3RyaW5nIFx0VGhlIG5hbWUgb2YgdGhlIG9wdGlvblxuXHRcdCAqIEByZXR1cm5cdG1peGVkXG5cdFx0ICovXHRcdFxuXHRcdCBcblx0XHRsb2c6IGZ1bmN0aW9uKHN0cikge1xuXHRcdFx0aWYod2luZG93LmNvbnNvbGUgJiYgY29uc29sZS5sb2cpIHtcblx0XHRcdFx0Y29uc29sZS5sb2coc3RyKTtcblx0XHRcdH1cblx0XHR9LFxuXHRcdCBcblx0XHQvKipcblx0XHQgKiBHZXQgYW4gc2luZ2xlIG9wdGlvbiB2YWx1ZS4gUmV0dXJucyBmYWxzZSBpZiBvcHRpb24gZG9lcyBub3QgZXhpc3Rcblx0XHQgKlxuXHRcdCAqIEBwYXJhbSBcdHN0cmluZyBcdFRoZSBuYW1lIG9mIHRoZSBvcHRpb25cblx0XHQgKiBAcmV0dXJuXHRtaXhlZFxuXHRcdCAqL1x0XHRcblx0XHQgXG5cdFx0Z2V0T3B0aW9uOiBmdW5jdGlvbihpbmRleCkge1xuXHRcdFx0aWYodGhpc1tpbmRleF0pIHtcblx0XHRcdFx0cmV0dXJuIHRoaXNbaW5kZXhdO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH0sXG5cdFx0XG5cdFx0LyoqXG5cdFx0ICogR2V0IGFsbCBvcHRpb25zXG5cdFx0ICpcblx0XHQgKiBAcmV0dXJuXHRib29sXG5cdFx0ICovXHRcdFxuXHRcdCBcblx0XHRnZXRPcHRpb25zOiBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiB0aGlzO1xuXHRcdH0sXG5cdFx0XG5cdFx0LyoqXG5cdFx0ICogU2V0IGEgc2luZ2xlIG9wdGlvbiB2YWx1ZVxuXHRcdCAqXG5cdFx0ICogQHBhcmFtIFx0c3RyaW5nIFx0VGhlIG5hbWUgb2YgdGhlIG9wdGlvblxuXHRcdCAqIEBwYXJhbSBcdG1peGVkIFx0VGhlIHZhbHVlIG9mIHRoZSBvcHRpb25cblx0XHQgKi9cdFx0XG5cdFx0IFxuXHRcdHNldE9wdGlvbjogZnVuY3Rpb24oaW5kZXgsIHZhbHVlKSB7XG5cdFx0XHR0aGlzW2luZGV4XSA9IHZhbHVlO1xuXHRcdH0sXG5cdFx0XG5cdFx0LyoqXG5cdFx0ICogU2V0IGEgbXVsdGlwbGUgb3B0aW9ucyBieSBwYXNzaW5nIGEgSlNPTiBvYmplY3Rcblx0XHQgKlxuXHRcdCAqIEBwYXJhbSBcdG9iamVjdCBcdFRoZSBvYmplY3Qgd2l0aCB0aGUgb3B0aW9uc1xuXHRcdCAqIEBwYXJhbSBcdG1peGVkIFx0VGhlIHZhbHVlIG9mIHRoZSBvcHRpb25cblx0XHQgKi9cdFx0XG5cdFx0XG5cdFx0c2V0T3B0aW9uczogZnVuY3Rpb24ob3B0aW9ucykge1xuXHRcdFx0Zm9yKHZhciBrZXkgaW4gb3B0aW9ucykge1xuXHQgIFx0XHRcdGlmKHR5cGVvZiBvcHRpb25zW2tleV0gIT09IFwidW5kZWZpbmVkXCIpIHtcblx0XHQgIFx0XHRcdHRoaXMuc2V0T3B0aW9uKGtleSwgb3B0aW9uc1trZXldKTtcblx0XHQgIFx0XHR9XG5cdFx0ICBcdH1cblx0XHR9XG5cdFx0XG5cdH0pO1xuXHRcbn0oalF1ZXJ5KSk7XG5cbi8qanNoaW50IHNtYXJ0dGFiczp0cnVlICovXG5cbi8qKlxuICogRmxpcENsb2NrLmpzXG4gKlxuICogQGF1dGhvciAgICAgSnVzdGluIEtpbWJyZWxsXG4gKiBAY29weXJpZ2h0ICAyMDEzIC0gT2JqZWN0aXZlIEhUTUwsIExMQ1xuICogQGxpY2VzbnNlICAgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcbiAqL1xuXHRcbihmdW5jdGlvbigkKSB7XG5cdFxuXHRcInVzZSBzdHJpY3RcIjtcblx0XG5cdC8qKlxuXHQgKiBUaGUgRmxpcENsb2NrIEZhY2UgY2xhc3MgaXMgdGhlIGJhc2UgY2xhc3MgaW4gd2hpY2ggdG8gZXh0ZW5kXG5cdCAqIGFsbCBvdGhlciBGbG9ja0Nsb2NrLkZhY2UgY2xhc3Nlcy5cblx0ICpcblx0ICogQHBhcmFtIFx0b2JqZWN0ICBUaGUgcGFyZW50IEZsaXBDbG9jay5GYWN0b3J5IG9iamVjdFxuXHQgKiBAcGFyYW0gXHRvYmplY3QgIEFuIG9iamVjdCBvZiBwcm9wZXJ0aWVzIHRvIG92ZXJyaWRlIHRoZSBkZWZhdWx0XHRcblx0ICovXG5cdCBcblx0RmxpcENsb2NrLkZhY2UgPSBGbGlwQ2xvY2suQmFzZS5leHRlbmQoe1xuXHRcdFxuXHRcdC8qKlxuXHRcdCAqIFNldHMgd2hldGhlciBvciBub3QgdGhlIGNsb2NrIHNob3VsZCBzdGFydCB1cG9uIGluc3RhbnRpYXRpb25cblx0XHQgKi9cblx0XHQgXG5cdFx0YXV0b1N0YXJ0OiB0cnVlLFxuXG5cdFx0LyoqXG5cdFx0ICogQW4gYXJyYXkgb2YgalF1ZXJ5IG9iamVjdHMgdXNlZCBmb3IgdGhlIGRpdmlkZXJzICh0aGUgY29sb25zKVxuXHRcdCAqL1xuXHRcdCBcblx0XHRkaXZpZGVyczogW10sXG5cblx0XHQvKipcblx0XHQgKiBBbiBhcnJheSBvZiBGbGlwQ2xvY2suTGlzdCBvYmplY3RzXG5cdFx0ICovXHRcdFxuXHRcdCBcblx0XHRmYWN0b3J5OiBmYWxzZSxcblx0XHRcblx0XHQvKipcblx0XHQgKiBBbiBhcnJheSBvZiBGbGlwQ2xvY2suTGlzdCBvYmplY3RzXG5cdFx0ICovXHRcdFxuXHRcdCBcblx0XHRsaXN0czogW10sXG5cblx0XHQvKipcblx0XHQgKiBDb25zdHJ1Y3RvclxuXHRcdCAqXG5cdFx0ICogQHBhcmFtIFx0b2JqZWN0ICBUaGUgcGFyZW50IEZsaXBDbG9jay5GYWN0b3J5IG9iamVjdFxuXHRcdCAqIEBwYXJhbSBcdG9iamVjdCAgQW4gb2JqZWN0IG9mIHByb3BlcnRpZXMgdG8gb3ZlcnJpZGUgdGhlIGRlZmF1bHRcdFxuXHRcdCAqL1xuXHRcdCBcblx0XHRjb25zdHJ1Y3RvcjogZnVuY3Rpb24oZmFjdG9yeSwgb3B0aW9ucykge1xuXHRcdFx0dGhpcy5kaXZpZGVycyA9IFtdO1xuXHRcdFx0dGhpcy5saXN0cyA9IFtdO1xuXHRcdFx0dGhpcy5iYXNlKG9wdGlvbnMpO1xuXHRcdFx0dGhpcy5mYWN0b3J5ID0gZmFjdG9yeTtcblx0XHR9LFxuXHRcdFxuXHRcdC8qKlxuXHRcdCAqIEJ1aWxkIHRoZSBjbG9jayBmYWNlXG5cdFx0ICovXG5cdFx0IFxuXHRcdGJ1aWxkOiBmdW5jdGlvbigpIHtcblx0XHRcdGlmKHRoaXMuYXV0b1N0YXJ0KSB7XG5cdFx0XHRcdHRoaXMuc3RhcnQoKTtcblx0XHRcdH1cblx0XHR9LFxuXHRcdFxuXHRcdC8qKlxuXHRcdCAqIENyZWF0ZXMgYSBqUXVlcnkgb2JqZWN0IHVzZWQgZm9yIHRoZSBkaWdpdCBkaXZpZGVyXG5cdFx0ICpcblx0XHQgKiBAcGFyYW1cdG1peGVkIFx0VGhlIGRpdmlkZXIgbGFiZWwgdGV4dFxuXHRcdCAqIEBwYXJhbVx0bWl4ZWRcdFNldCB0cnVlIHRvIGV4Y2x1ZGUgdGhlIGRvdHMgaW4gdGhlIGRpdmlkZXIuIFxuXHRcdCAqXHRcdFx0XHRcdElmIG5vdCBzZXQsIGlzIGZhbHNlLlxuXHRcdCAqL1xuXHRcdCBcblx0XHRjcmVhdGVEaXZpZGVyOiBmdW5jdGlvbihsYWJlbCwgY3NzLCBleGNsdWRlRG90cykge1xuXHRcdFx0aWYodHlwZW9mIGNzcyA9PSBcImJvb2xlYW5cIiB8fCAhY3NzKSB7XG5cdFx0XHRcdGV4Y2x1ZGVEb3RzID0gY3NzO1xuXHRcdFx0XHRjc3MgPSBsYWJlbDtcblx0XHRcdH1cblxuXHRcdFx0dmFyIGRvdHMgPSBbXG5cdFx0XHRcdCc8c3BhbiBjbGFzcz1cIicrdGhpcy5mYWN0b3J5LmNsYXNzZXMuZG90KycgdG9wXCI+PC9zcGFuPicsXG5cdFx0XHRcdCc8c3BhbiBjbGFzcz1cIicrdGhpcy5mYWN0b3J5LmNsYXNzZXMuZG90KycgYm90dG9tXCI+PC9zcGFuPidcblx0XHRcdF0uam9pbignJyk7XG5cblx0XHRcdGlmKGV4Y2x1ZGVEb3RzKSB7XG5cdFx0XHRcdGRvdHMgPSAnJztcdFxuXHRcdFx0fVxuXG5cdFx0XHRsYWJlbCA9IHRoaXMuZmFjdG9yeS5sb2NhbGl6ZShsYWJlbCk7XG5cblx0XHRcdHZhciBodG1sID0gW1xuXHRcdFx0XHQnPHNwYW4gY2xhc3M9XCInK3RoaXMuZmFjdG9yeS5jbGFzc2VzLmRpdmlkZXIrJyAnKyhjc3MgPyBjc3MgOiAnJykudG9Mb3dlckNhc2UoKSsnXCI+Jyxcblx0XHRcdFx0XHQnPHNwYW4gY2xhc3M9XCInK3RoaXMuZmFjdG9yeS5jbGFzc2VzLmxhYmVsKydcIj4nKyhsYWJlbCA/IGxhYmVsIDogJycpKyc8L3NwYW4+Jyxcblx0XHRcdFx0XHRkb3RzLFxuXHRcdFx0XHQnPC9zcGFuPidcblx0XHRcdF07XHRcblx0XHRcdFxuXHRcdFx0dmFyICRodG1sID0gJChodG1sLmpvaW4oJycpKTtcblxuXHRcdFx0dGhpcy5kaXZpZGVycy5wdXNoKCRodG1sKTtcblxuXHRcdFx0cmV0dXJuICRodG1sO1xuXHRcdH0sXG5cdFx0XG5cdFx0LyoqXG5cdFx0ICogQ3JlYXRlcyBhIEZsaXBDbG9jay5MaXN0IG9iamVjdCBhbmQgYXBwZW5kcyBpdCB0byB0aGUgRE9NXG5cdFx0ICpcblx0XHQgKiBAcGFyYW1cdG1peGVkIFx0VGhlIGRpZ2l0IHRvIHNlbGVjdCBpbiB0aGUgbGlzdFxuXHRcdCAqIEBwYXJhbVx0b2JqZWN0ICBBbiBvYmplY3QgdG8gb3ZlcnJpZGUgdGhlIGRlZmF1bHQgcHJvcGVydGllc1xuXHRcdCAqL1xuXHRcdCBcblx0XHRjcmVhdGVMaXN0OiBmdW5jdGlvbihkaWdpdCwgb3B0aW9ucykge1xuXHRcdFx0aWYodHlwZW9mIGRpZ2l0ID09PSBcIm9iamVjdFwiKSB7XG5cdFx0XHRcdG9wdGlvbnMgPSBkaWdpdDtcblx0XHRcdFx0ZGlnaXQgPSAwO1xuXHRcdFx0fVxuXG5cdFx0XHR2YXIgb2JqID0gbmV3IEZsaXBDbG9jay5MaXN0KHRoaXMuZmFjdG9yeSwgZGlnaXQsIG9wdGlvbnMpO1xuXHRcdFxuXHRcdFx0dGhpcy5saXN0cy5wdXNoKG9iaik7XG5cblx0XHRcdHJldHVybiBvYmo7XG5cdFx0fSxcblx0XHRcblx0XHQvKipcblx0XHQgKiBUcmlnZ2VycyB3aGVuIHRoZSBjbG9jayBpcyByZXNldFxuXHRcdCAqL1xuXG5cdFx0cmVzZXQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0dGhpcy5mYWN0b3J5LnRpbWUgPSBuZXcgRmxpcENsb2NrLlRpbWUoXG5cdFx0XHRcdHRoaXMuZmFjdG9yeSwgXG5cdFx0XHRcdHRoaXMuZmFjdG9yeS5vcmlnaW5hbCA/IE1hdGgucm91bmQodGhpcy5mYWN0b3J5Lm9yaWdpbmFsKSA6IDAsXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRtaW5pbXVtRGlnaXRzOiB0aGlzLmZhY3RvcnkubWluaW11bURpZ2l0c1xuXHRcdFx0XHR9XG5cdFx0XHQpO1xuXG5cdFx0XHR0aGlzLmZsaXAodGhpcy5mYWN0b3J5Lm9yaWdpbmFsLCBmYWxzZSk7XG5cdFx0fSxcblxuXHRcdC8qKlxuXHRcdCAqIEFwcGVuZCBhIG5ld2x5IGNyZWF0ZWQgbGlzdCB0byB0aGUgY2xvY2tcblx0XHQgKi9cblxuXHRcdGFwcGVuZERpZ2l0VG9DbG9jazogZnVuY3Rpb24ob2JqKSB7XG5cdFx0XHRvYmouJGVsLmFwcGVuZChmYWxzZSk7XG5cdFx0fSxcblxuXHRcdC8qKlxuXHRcdCAqIEFkZCBhIGRpZ2l0IHRvIHRoZSBjbG9jayBmYWNlXG5cdFx0ICovXG5cdFx0IFxuXHRcdGFkZERpZ2l0OiBmdW5jdGlvbihkaWdpdCkge1xuXHRcdFx0dmFyIG9iaiA9IHRoaXMuY3JlYXRlTGlzdChkaWdpdCwge1xuXHRcdFx0XHRjbGFzc2VzOiB7XG5cdFx0XHRcdFx0YWN0aXZlOiB0aGlzLmZhY3RvcnkuY2xhc3Nlcy5hY3RpdmUsXG5cdFx0XHRcdFx0YmVmb3JlOiB0aGlzLmZhY3RvcnkuY2xhc3Nlcy5iZWZvcmUsXG5cdFx0XHRcdFx0ZmxpcDogdGhpcy5mYWN0b3J5LmNsYXNzZXMuZmxpcFxuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdFx0dGhpcy5hcHBlbmREaWdpdFRvQ2xvY2sob2JqKTtcblx0XHR9LFxuXHRcdFxuXHRcdC8qKlxuXHRcdCAqIFRyaWdnZXJzIHdoZW4gdGhlIGNsb2NrIGlzIHN0YXJ0ZWRcblx0XHQgKi9cblx0XHQgXG5cdFx0c3RhcnQ6IGZ1bmN0aW9uKCkge30sXG5cdFx0XG5cdFx0LyoqXG5cdFx0ICogVHJpZ2dlcnMgd2hlbiB0aGUgdGltZSBvbiB0aGUgY2xvY2sgc3RvcHNcblx0XHQgKi9cblx0XHQgXG5cdFx0c3RvcDogZnVuY3Rpb24oKSB7fSxcblx0XHRcblx0XHQvKipcblx0XHQgKiBBdXRvIGluY3JlbWVudHMvZGVjcmVtZW50cyB0aGUgdmFsdWUgb2YgdGhlIGNsb2NrIGZhY2Vcblx0XHQgKi9cblx0XHQgXG5cdFx0YXV0b0luY3JlbWVudDogZnVuY3Rpb24oKSB7XG5cdFx0XHRpZighdGhpcy5mYWN0b3J5LmNvdW50ZG93bikge1xuXHRcdFx0XHR0aGlzLmluY3JlbWVudCgpO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdHRoaXMuZGVjcmVtZW50KCk7XG5cdFx0XHR9XG5cdFx0fSxcblxuXHRcdC8qKlxuXHRcdCAqIEluY3JlbWVudHMgdGhlIHZhbHVlIG9mIHRoZSBjbG9jayBmYWNlXG5cdFx0ICovXG5cdFx0IFxuXHRcdGluY3JlbWVudDogZnVuY3Rpb24oKSB7XG5cdFx0XHR0aGlzLmZhY3RvcnkudGltZS5hZGRTZWNvbmQoKTtcblx0XHR9LFxuXG5cdFx0LyoqXG5cdFx0ICogRGVjcmVtZW50cyB0aGUgdmFsdWUgb2YgdGhlIGNsb2NrIGZhY2Vcblx0XHQgKi9cblxuXHRcdGRlY3JlbWVudDogZnVuY3Rpb24oKSB7XG5cdFx0XHRpZih0aGlzLmZhY3RvcnkudGltZS5nZXRUaW1lU2Vjb25kcygpID09IDApIHtcblx0ICAgICAgICBcdHRoaXMuZmFjdG9yeS5zdG9wKClcblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHR0aGlzLmZhY3RvcnkudGltZS5zdWJTZWNvbmQoKTtcblx0XHRcdH1cblx0XHR9LFxuXHRcdFx0XG5cdFx0LyoqXG5cdFx0ICogVHJpZ2dlcnMgd2hlbiB0aGUgbnVtYmVycyBvbiB0aGUgY2xvY2sgZmxpcFxuXHRcdCAqL1xuXHRcdCBcblx0XHRmbGlwOiBmdW5jdGlvbih0aW1lLCBkb05vdEFkZFBsYXlDbGFzcykge1xuXHRcdFx0dmFyIHQgPSB0aGlzO1xuXG5cdFx0XHQkLmVhY2godGltZSwgZnVuY3Rpb24oaSwgZGlnaXQpIHtcblx0XHRcdFx0dmFyIGxpc3QgPSB0Lmxpc3RzW2ldO1xuXG5cdFx0XHRcdGlmKGxpc3QpIHtcblx0XHRcdFx0XHRpZighZG9Ob3RBZGRQbGF5Q2xhc3MgJiYgZGlnaXQgIT0gbGlzdC5kaWdpdCkge1xuXHRcdFx0XHRcdFx0bGlzdC5wbGF5KCk7XHRcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRsaXN0LnNlbGVjdChkaWdpdCk7XG5cdFx0XHRcdH1cdFxuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHR0LmFkZERpZ2l0KGRpZ2l0KTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fVxuXHRcdFx0XHRcdFxuXHR9KTtcblx0XG59KGpRdWVyeSkpO1xuXG4vKmpzaGludCBzbWFydHRhYnM6dHJ1ZSAqL1xuXG4vKipcbiAqIEZsaXBDbG9jay5qc1xuICpcbiAqIEBhdXRob3IgICAgIEp1c3RpbiBLaW1icmVsbFxuICogQGNvcHlyaWdodCAgMjAxMyAtIE9iamVjdGl2ZSBIVE1MLCBMTENcbiAqIEBsaWNlc25zZSAgIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG4gKi9cblx0XG4oZnVuY3Rpb24oJCkge1xuXHRcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cdFxuXHQvKipcblx0ICogVGhlIEZsaXBDbG9jayBGYWN0b3J5IGNsYXNzIGlzIHVzZWQgdG8gYnVpbGQgdGhlIGNsb2NrIGFuZCBtYW5hZ2Vcblx0ICogYWxsIHRoZSBwdWJsaWMgbWV0aG9kcy5cblx0ICpcblx0ICogQHBhcmFtIFx0b2JqZWN0ICBBIGpRdWVyeSBvYmplY3Qgb3IgQ1NTIHNlbGVjdG9yIHVzZWQgdG8gZmV0Y2hcblx0IFx0XHRcdFx0ICAgIHRoZSB3cmFwcGluZyBET00gbm9kZXNcblx0ICogQHBhcmFtIFx0bWl4ZWQgICBUaGlzIGlzIHRoZSBkaWdpdCB1c2VkIHRvIHNldCB0aGUgY2xvY2suIElmIGFuIFxuXHQgXHRcdFx0XHQgICAgb2JqZWN0IGlzIHBhc3NlZCwgMCB3aWxsIGJlIHVzZWQuXHRcblx0ICogQHBhcmFtIFx0b2JqZWN0ICBBbiBvYmplY3Qgb2YgcHJvcGVydGllcyB0byBvdmVycmlkZSB0aGUgZGVmYXVsdFx0XG5cdCAqL1xuXHQgXHRcblx0RmxpcENsb2NrLkZhY3RvcnkgPSBGbGlwQ2xvY2suQmFzZS5leHRlbmQoe1xuXHRcdFxuXHRcdC8qKlxuXHRcdCAqIFRoZSBjbG9jaydzIGFuaW1hdGlvbiByYXRlLlxuXHRcdCAqIFxuXHRcdCAqIE5vdGUsIGN1cnJlbnRseSB0aGlzIHByb3BlcnR5IGRvZXNuJ3QgZG8gYW55dGhpbmcuXG5cdFx0ICogVGhpcyBwcm9wZXJ0eSBpcyBoZXJlIHRvIGJlIHVzZWQgaW4gdGhlIGZ1dHVyZSB0b1xuXHRcdCAqIHByb2dyYW1tYXRpY2FseSBzZXQgdGhlIGNsb2NrJ3MgYW5pbWF0aW9uIHNwZWVkXG5cdFx0ICovXHRcdFxuXG5cdFx0YW5pbWF0aW9uUmF0ZTogMTAwMCxcblxuXHRcdC8qKlxuXHRcdCAqIEF1dG8gc3RhcnQgdGhlIGNsb2NrIG9uIHBhZ2UgbG9hZCAoVHJ1ZXxGYWxzZSlcblx0XHQgKi9cdFxuXHRcdCBcblx0XHRhdXRvU3RhcnQ6IHRydWUsXG5cdFx0XG5cdFx0LyoqXG5cdFx0ICogVGhlIGNhbGxiYWNrIG1ldGhvZHNcblx0XHQgKi9cdFx0XG5cdFx0IFxuXHRcdGNhbGxiYWNrczoge1xuXHRcdFx0ZGVzdHJveTogZmFsc2UsXG5cdFx0XHRjcmVhdGU6IGZhbHNlLFxuXHRcdFx0aW5pdDogZmFsc2UsXG5cdFx0XHRpbnRlcnZhbDogZmFsc2UsXG5cdFx0XHRzdGFydDogZmFsc2UsXG5cdFx0XHRzdG9wOiBmYWxzZSxcblx0XHRcdHJlc2V0OiBmYWxzZVxuXHRcdH0sXG5cdFx0XG5cdFx0LyoqXG5cdFx0ICogVGhlIENTUyBjbGFzc2VzXG5cdFx0ICovXHRcdFxuXHRcdCBcblx0XHRjbGFzc2VzOiB7XG5cdFx0XHRhY3RpdmU6ICdmbGlwLWNsb2NrLWFjdGl2ZScsXG5cdFx0XHRiZWZvcmU6ICdmbGlwLWNsb2NrLWJlZm9yZScsXG5cdFx0XHRkaXZpZGVyOiAnZmxpcC1jbG9jay1kaXZpZGVyJyxcblx0XHRcdGRvdDogJ2ZsaXAtY2xvY2stZG90Jyxcblx0XHRcdGxhYmVsOiAnZmxpcC1jbG9jay1sYWJlbCcsXG5cdFx0XHRmbGlwOiAnZmxpcCcsXG5cdFx0XHRwbGF5OiAncGxheScsXG5cdFx0XHR3cmFwcGVyOiAnZmxpcC1jbG9jay13cmFwcGVyJ1xuXHRcdH0sXG5cdFx0XG5cdFx0LyoqXG5cdFx0ICogVGhlIG5hbWUgb2YgdGhlIGNsb2NrIGZhY2UgY2xhc3MgaW4gdXNlXG5cdFx0ICovXHRcblx0XHQgXG5cdFx0Y2xvY2tGYWNlOiAnSG91cmx5Q291bnRlcicsXG5cdFx0IFxuXHRcdC8qKlxuXHRcdCAqIFRoZSBuYW1lIG9mIHRoZSBjbG9jayBmYWNlIGNsYXNzIGluIHVzZVxuXHRcdCAqL1x0XG5cdFx0IFxuXHRcdGNvdW50ZG93bjogZmFsc2UsXG5cdFx0IFxuXHRcdC8qKlxuXHRcdCAqIFRoZSBuYW1lIG9mIHRoZSBkZWZhdWx0IGNsb2NrIGZhY2UgY2xhc3MgdG8gdXNlIGlmIHRoZSBkZWZpbmVkXG5cdFx0ICogY2xvY2tGYWNlIHZhcmlhYmxlIGlzIG5vdCBhIHZhbGlkIEZsaXBDbG9jay5GYWNlIG9iamVjdFxuXHRcdCAqL1x0XG5cdFx0IFxuXHRcdGRlZmF1bHRDbG9ja0ZhY2U6ICdIb3VybHlDb3VudGVyJyxcblx0XHQgXG5cdFx0LyoqXG5cdFx0ICogVGhlIGRlZmF1bHQgbGFuZ3VhZ2Vcblx0XHQgKi9cdFxuXHRcdCBcblx0XHRkZWZhdWx0TGFuZ3VhZ2U6ICdlbmdsaXNoJyxcblx0XHQgXG5cdFx0LyoqXG5cdFx0ICogVGhlIGpRdWVyeSBvYmplY3Rcblx0XHQgKi9cdFx0XG5cdFx0IFxuXHRcdCRlbDogZmFsc2UsXG5cblx0XHQvKipcblx0XHQgKiBUaGUgRmxpcENsb2NrLkZhY2Ugb2JqZWN0XG5cdFx0ICovXHRcblx0XHQgXG5cdFx0ZmFjZTogdHJ1ZSxcblx0XHQgXG5cdFx0LyoqXG5cdFx0ICogVGhlIGxhbmd1YWdlIG9iamVjdCBhZnRlciBpdCBoYXMgYmVlbiBsb2FkZWRcblx0XHQgKi9cdFxuXHRcdCBcblx0XHRsYW5nOiBmYWxzZSxcblx0XHQgXG5cdFx0LyoqXG5cdFx0ICogVGhlIGxhbmd1YWdlIGJlaW5nIHVzZWQgdG8gZGlzcGxheSBsYWJlbHMgKHN0cmluZylcblx0XHQgKi9cdFxuXHRcdCBcblx0XHRsYW5ndWFnZTogJ2VuZ2xpc2gnLFxuXHRcdCBcblx0XHQvKipcblx0XHQgKiBUaGUgbWluaW11bSBkaWdpdHMgdGhlIGNsb2NrIG11c3QgaGF2ZVxuXHRcdCAqL1x0XHRcblxuXHRcdG1pbmltdW1EaWdpdHM6IDAsXG5cblx0XHQvKipcblx0XHQgKiBUaGUgb3JpZ2luYWwgc3RhcnRpbmcgdmFsdWUgb2YgdGhlIGNsb2NrLiBVc2VkIGZvciB0aGUgcmVzZXQgbWV0aG9kLlxuXHRcdCAqL1x0XHRcblx0XHQgXG5cdFx0b3JpZ2luYWw6IGZhbHNlLFxuXHRcdFxuXHRcdC8qKlxuXHRcdCAqIElzIHRoZSBjbG9jayBydW5uaW5nPyAoVHJ1ZXxGYWxzZSlcblx0XHQgKi9cdFx0XG5cdFx0IFxuXHRcdHJ1bm5pbmc6IGZhbHNlLFxuXHRcdFxuXHRcdC8qKlxuXHRcdCAqIFRoZSBGbGlwQ2xvY2suVGltZSBvYmplY3Rcblx0XHQgKi9cdFx0XG5cdFx0IFxuXHRcdHRpbWU6IGZhbHNlLFxuXHRcdFxuXHRcdC8qKlxuXHRcdCAqIFRoZSBGbGlwQ2xvY2suVGltZXIgb2JqZWN0XG5cdFx0ICovXHRcdFxuXHRcdCBcblx0XHR0aW1lcjogZmFsc2UsXG5cdFx0XG5cdFx0LyoqXG5cdFx0ICogVGhlIGpRdWVyeSBvYmplY3QgKGRlcGNyZWNhdGVkKVxuXHRcdCAqL1x0XHRcblx0XHQgXG5cdFx0JHdyYXBwZXI6IGZhbHNlLFxuXHRcdFxuXHRcdC8qKlxuXHRcdCAqIENvbnN0cnVjdG9yXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0gICBvYmplY3QgIFRoZSB3cmFwcGluZyBqUXVlcnkgb2JqZWN0XG5cdFx0ICogQHBhcmFtXHRvYmplY3QgIE51bWJlciBvZiBzZWNvbmRzIHVzZWQgdG8gc3RhcnQgdGhlIGNsb2NrXG5cdFx0ICogQHBhcmFtXHRvYmplY3QgXHRBbiBvYmplY3Qgb3ZlcnJpZGUgb3B0aW9uc1xuXHRcdCAqL1xuXHRcdCBcblx0XHRjb25zdHJ1Y3RvcjogZnVuY3Rpb24ob2JqLCBkaWdpdCwgb3B0aW9ucykge1xuXG5cdFx0XHRpZighb3B0aW9ucykge1xuXHRcdFx0XHRvcHRpb25zID0ge307XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMubGlzdHMgPSBbXTtcblx0XHRcdHRoaXMucnVubmluZyA9IGZhbHNlO1xuXHRcdFx0dGhpcy5iYXNlKG9wdGlvbnMpO1x0XG5cblx0XHRcdHRoaXMuJGVsID0gJChvYmopLmFkZENsYXNzKHRoaXMuY2xhc3Nlcy53cmFwcGVyKTtcblxuXHRcdFx0Ly8gRGVwY3JhdGVkIHN1cHBvcnQgb2YgdGhlICR3cmFwcGVyIHByb3BlcnR5LlxuXHRcdFx0dGhpcy4kd3JhcHBlciA9IHRoaXMuJGVsO1xuXG5cdFx0XHR0aGlzLm9yaWdpbmFsID0gKGRpZ2l0IGluc3RhbmNlb2YgRGF0ZSkgPyBkaWdpdCA6IChkaWdpdCA/IE1hdGgucm91bmQoZGlnaXQpIDogMCk7XG5cblx0XHRcdHRoaXMudGltZSA9IG5ldyBGbGlwQ2xvY2suVGltZSh0aGlzLCB0aGlzLm9yaWdpbmFsLCB7XG5cdFx0XHRcdG1pbmltdW1EaWdpdHM6IHRoaXMubWluaW11bURpZ2l0cyxcblx0XHRcdFx0YW5pbWF0aW9uUmF0ZTogdGhpcy5hbmltYXRpb25SYXRlIFxuXHRcdFx0fSk7XG5cblx0XHRcdHRoaXMudGltZXIgPSBuZXcgRmxpcENsb2NrLlRpbWVyKHRoaXMsIG9wdGlvbnMpO1xuXG5cdFx0XHR0aGlzLmxvYWRMYW5ndWFnZSh0aGlzLmxhbmd1YWdlKTtcblx0XHRcdFxuXHRcdFx0dGhpcy5sb2FkQ2xvY2tGYWNlKHRoaXMuY2xvY2tGYWNlLCBvcHRpb25zKTtcblxuXHRcdFx0aWYodGhpcy5hdXRvU3RhcnQpIHtcblx0XHRcdFx0dGhpcy5zdGFydCgpO1xuXHRcdFx0fVxuXG5cdFx0fSxcblx0XHRcblx0XHQvKipcblx0XHQgKiBMb2FkIHRoZSBGbGlwQ2xvY2suRmFjZSBvYmplY3Rcblx0XHQgKlxuXHRcdCAqIEBwYXJhbVx0b2JqZWN0ICBUaGUgbmFtZSBvZiB0aGUgRmxpY2tDbG9jay5GYWNlIGNsYXNzXG5cdFx0ICogQHBhcmFtXHRvYmplY3QgXHRBbiBvYmplY3Qgb3ZlcnJpZGUgb3B0aW9uc1xuXHRcdCAqL1xuXHRcdCBcblx0XHRsb2FkQ2xvY2tGYWNlOiBmdW5jdGlvbihuYW1lLCBvcHRpb25zKSB7XHRcblx0XHRcdHZhciBmYWNlLCBzdWZmaXggPSAnRmFjZScsIGhhc1N0b3BwZWQgPSBmYWxzZTtcblx0XHRcdFxuXHRcdFx0bmFtZSA9IG5hbWUudWNmaXJzdCgpK3N1ZmZpeDtcblxuXHRcdFx0aWYodGhpcy5mYWNlLnN0b3ApIHtcblx0XHRcdFx0dGhpcy5zdG9wKCk7XG5cdFx0XHRcdGhhc1N0b3BwZWQgPSB0cnVlO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLiRlbC5odG1sKCcnKTtcblxuXHRcdFx0dGhpcy50aW1lLm1pbmltdW1EaWdpdHMgPSB0aGlzLm1pbmltdW1EaWdpdHM7XG5cdFx0XHRcblx0XHRcdGlmKEZsaXBDbG9ja1tuYW1lXSkge1xuXHRcdFx0XHRmYWNlID0gbmV3IEZsaXBDbG9ja1tuYW1lXSh0aGlzLCBvcHRpb25zKTtcblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHRmYWNlID0gbmV3IEZsaXBDbG9ja1t0aGlzLmRlZmF1bHRDbG9ja0ZhY2Urc3VmZml4XSh0aGlzLCBvcHRpb25zKTtcblx0XHRcdH1cblx0XHRcdFxuXHRcdFx0ZmFjZS5idWlsZCgpO1xuXG5cdFx0XHR0aGlzLmZhY2UgPSBmYWNlXG5cblx0XHRcdGlmKGhhc1N0b3BwZWQpIHtcblx0XHRcdFx0dGhpcy5zdGFydCgpO1xuXHRcdFx0fVxuXHRcdFx0XG5cdFx0XHRyZXR1cm4gdGhpcy5mYWNlO1xuXHRcdH0sXG5cdFx0XHRcdFxuXHRcdC8qKlxuXHRcdCAqIExvYWQgdGhlIEZsaXBDbG9jay5MYW5nIG9iamVjdFxuXHRcdCAqXG5cdFx0ICogQHBhcmFtXHRvYmplY3QgIFRoZSBuYW1lIG9mIHRoZSBsYW5ndWFnZSB0byBsb2FkXG5cdFx0ICovXG5cdFx0IFxuXHRcdGxvYWRMYW5ndWFnZTogZnVuY3Rpb24obmFtZSkge1x0XG5cdFx0XHR2YXIgbGFuZztcblx0XHRcdFxuXHRcdFx0aWYoRmxpcENsb2NrLkxhbmdbbmFtZS51Y2ZpcnN0KCldKSB7XG5cdFx0XHRcdGxhbmcgPSBGbGlwQ2xvY2suTGFuZ1tuYW1lLnVjZmlyc3QoKV07XG5cdFx0XHR9XG5cdFx0XHRlbHNlIGlmKEZsaXBDbG9jay5MYW5nW25hbWVdKSB7XG5cdFx0XHRcdGxhbmcgPSBGbGlwQ2xvY2suTGFuZ1tuYW1lXTtcblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHRsYW5nID0gRmxpcENsb2NrLkxhbmdbdGhpcy5kZWZhdWx0TGFuZ3VhZ2VdO1xuXHRcdFx0fVxuXHRcdFx0XG5cdFx0XHRyZXR1cm4gdGhpcy5sYW5nID0gbGFuZztcblx0XHR9LFxuXHRcdFx0XHRcdFxuXHRcdC8qKlxuXHRcdCAqIExvY2FsaXplIHN0cmluZ3MgaW50byB2YXJpb3VzIGxhbmd1YWdlc1xuXHRcdCAqXG5cdFx0ICogQHBhcmFtXHRzdHJpbmcgIFRoZSBpbmRleCBvZiB0aGUgbG9jYWxpemVkIHN0cmluZ1xuXHRcdCAqIEBwYXJhbVx0b2JqZWN0ICBPcHRpb25hbGx5IHBhc3MgYSBsYW5nIG9iamVjdFxuXHRcdCAqL1xuXG5cdFx0bG9jYWxpemU6IGZ1bmN0aW9uKGluZGV4LCBvYmopIHtcblx0XHRcdHZhciBsYW5nID0gdGhpcy5sYW5nO1xuXG5cdFx0XHRpZighaW5kZXgpIHtcblx0XHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0XHR9XG5cblx0XHRcdHZhciBsaW5kZXggPSBpbmRleC50b0xvd2VyQ2FzZSgpO1xuXG5cdFx0XHRpZih0eXBlb2Ygb2JqID09IFwib2JqZWN0XCIpIHtcblx0XHRcdFx0bGFuZyA9IG9iajtcblx0XHRcdH1cblxuXHRcdFx0aWYobGFuZyAmJiBsYW5nW2xpbmRleF0pIHtcblx0XHRcdFx0cmV0dXJuIGxhbmdbbGluZGV4XTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIGluZGV4O1xuXHRcdH0sXG5cdFx0IFxuXG5cdFx0LyoqXG5cdFx0ICogU3RhcnRzIHRoZSBjbG9ja1xuXHRcdCAqL1xuXHRcdCBcblx0XHRzdGFydDogZnVuY3Rpb24oY2FsbGJhY2spIHtcblx0XHRcdHZhciB0ID0gdGhpcztcblxuXHRcdFx0aWYoIXQucnVubmluZyAmJiAoIXQuY291bnRkb3duIHx8IHQuY291bnRkb3duICYmIHQudGltZS50aW1lID4gMCkpIHtcblx0XHRcdFx0dC5mYWNlLnN0YXJ0KHQudGltZSk7XG5cdFx0XHRcdHQudGltZXIuc3RhcnQoZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0dC5mbGlwKCk7XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0aWYodHlwZW9mIGNhbGxiYWNrID09PSBcImZ1bmN0aW9uXCIpIHtcblx0XHRcdFx0XHRcdGNhbGxiYWNrKCk7XG5cdFx0XHRcdFx0fVx0XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdHQubG9nKCdUcnlpbmcgdG8gc3RhcnQgdGltZXIgd2hlbiBjb3VudGRvd24gYWxyZWFkeSBhdCAwJyk7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRcblx0XHQvKipcblx0XHQgKiBTdG9wcyB0aGUgY2xvY2tcblx0XHQgKi9cblx0XHQgXG5cdFx0c3RvcDogZnVuY3Rpb24oY2FsbGJhY2spIHtcblx0XHRcdHRoaXMuZmFjZS5zdG9wKCk7XG5cdFx0XHR0aGlzLnRpbWVyLnN0b3AoY2FsbGJhY2spO1xuXHRcdFx0XG5cdFx0XHRmb3IodmFyIHggaW4gdGhpcy5saXN0cykge1xuXHRcdFx0XHRpZiAodGhpcy5saXN0cy5oYXNPd25Qcm9wZXJ0eSh4KSkge1xuXHRcdFx0XHRcdHRoaXMubGlzdHNbeF0uc3RvcCgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XHRcblx0XHR9LFxuXHRcdFxuXHRcdC8qKlxuXHRcdCAqIFJlc2V0IHRoZSBjbG9ja1xuXHRcdCAqL1xuXHRcdCBcblx0XHRyZXNldDogZnVuY3Rpb24oY2FsbGJhY2spIHtcblx0XHRcdHRoaXMudGltZXIucmVzZXQoY2FsbGJhY2spO1xuXHRcdFx0dGhpcy5mYWNlLnJlc2V0KCk7XG5cdFx0fSxcblx0XHRcblx0XHQvKipcblx0XHQgKiBTZXRzIHRoZSBjbG9jayB0aW1lXG5cdFx0ICovXG5cdFx0IFxuXHRcdHNldFRpbWU6IGZ1bmN0aW9uKHRpbWUpIHtcblx0XHRcdHRoaXMudGltZS50aW1lID0gdGltZTtcblx0XHRcdHRoaXMuZmxpcCh0cnVlKTtcdFx0XG5cdFx0fSxcblx0XHRcblx0XHQvKipcblx0XHQgKiBHZXQgdGhlIGNsb2NrIHRpbWVcblx0XHQgKlxuXHRcdCAqIEByZXR1cm4gIG9iamVjdCAgUmV0dXJucyBhIEZsaXBDbG9jay5UaW1lIG9iamVjdFxuXHRcdCAqL1xuXHRcdCBcblx0XHRnZXRUaW1lOiBmdW5jdGlvbih0aW1lKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy50aW1lO1x0XHRcblx0XHR9LFxuXHRcdFxuXHRcdC8qKlxuXHRcdCAqIENoYW5nZXMgdGhlIGluY3JlbWVudCBvZiB0aW1lIHRvIHVwIG9yIGRvd24gKGFkZC9zdWIpXG5cdFx0ICovXG5cdFx0IFxuXHRcdHNldENvdW50ZG93bjogZnVuY3Rpb24odmFsdWUpIHtcblx0XHRcdHZhciBydW5uaW5nID0gdGhpcy5ydW5uaW5nO1xuXHRcdFx0XG5cdFx0XHR0aGlzLmNvdW50ZG93biA9IHZhbHVlID8gdHJ1ZSA6IGZhbHNlO1xuXHRcdFx0XHRcblx0XHRcdGlmKHJ1bm5pbmcpIHtcblx0XHRcdFx0dGhpcy5zdG9wKCk7XG5cdFx0XHRcdHRoaXMuc3RhcnQoKTtcblx0XHRcdH1cblx0XHR9LFxuXHRcdFxuXHRcdC8qKlxuXHRcdCAqIEZsaXAgdGhlIGRpZ2l0cyBvbiB0aGUgY2xvY2tcblx0XHQgKlxuXHRcdCAqIEBwYXJhbSAgYXJyYXkgIEFuIGFycmF5IG9mIGRpZ2l0c1x0IFxuXHRcdCAqL1xuXHRcdGZsaXA6IGZ1bmN0aW9uKGRvTm90QWRkUGxheUNsYXNzKSB7XHRcblx0XHRcdHRoaXMuZmFjZS5mbGlwKGZhbHNlLCBkb05vdEFkZFBsYXlDbGFzcyk7XG5cdFx0fVxuXHRcdFxuXHR9KTtcblx0XHRcbn0oalF1ZXJ5KSk7XG5cbi8qanNoaW50IHNtYXJ0dGFiczp0cnVlICovXG5cbi8qKlxuICogRmxpcENsb2NrLmpzXG4gKlxuICogQGF1dGhvciAgICAgSnVzdGluIEtpbWJyZWxsXG4gKiBAY29weXJpZ2h0ICAyMDEzIC0gT2JqZWN0aXZlIEhUTUwsIExMQ1xuICogQGxpY2VzbnNlICAgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcbiAqL1xuXHRcbihmdW5jdGlvbigkKSB7XG5cdFxuXHRcInVzZSBzdHJpY3RcIjtcblx0XG5cdC8qKlxuXHQgKiBUaGUgRmxpcENsb2NrIExpc3QgY2xhc3MgaXMgdXNlZCB0byBidWlsZCB0aGUgbGlzdCB1c2VkIHRvIGNyZWF0ZSBcblx0ICogdGhlIGNhcmQgZmxpcCBlZmZlY3QuIFRoaXMgb2JqZWN0IGZhc2NpbGF0ZXMgc2VsZWN0aW5nIHRoZSBjb3JyZWN0XG5cdCAqIG5vZGUgYnkgcGFzc2luZyBhIHNwZWNpZmljIGRpZ2l0LlxuXHQgKlxuXHQgKiBAcGFyYW0gXHRvYmplY3QgIEEgRmxpcENsb2NrLkZhY3Rvcnkgb2JqZWN0XG5cdCAqIEBwYXJhbSBcdG1peGVkICAgVGhpcyBpcyB0aGUgZGlnaXQgdXNlZCB0byBzZXQgdGhlIGNsb2NrLiBJZiBhbiBcblx0ICpcdFx0XHRcdCAgICBvYmplY3QgaXMgcGFzc2VkLCAwIHdpbGwgYmUgdXNlZC5cdFxuXHQgKiBAcGFyYW0gXHRvYmplY3QgIEFuIG9iamVjdCBvZiBwcm9wZXJ0aWVzIHRvIG92ZXJyaWRlIHRoZSBkZWZhdWx0XHRcblx0ICovXG5cdCBcdFxuXHRGbGlwQ2xvY2suTGlzdCA9IEZsaXBDbG9jay5CYXNlLmV4dGVuZCh7XG5cdFx0XG5cdFx0LyoqXG5cdFx0ICogVGhlIGRpZ2l0ICgwLTkpXG5cdFx0ICovXHRcdFxuXHRcdCBcblx0XHRkaWdpdDogMCxcblx0XHRcblx0XHQvKipcblx0XHQgKiBUaGUgQ1NTIGNsYXNzZXNcblx0XHQgKi9cdFx0XG5cdFx0IFxuXHRcdGNsYXNzZXM6IHtcblx0XHRcdGFjdGl2ZTogJ2ZsaXAtY2xvY2stYWN0aXZlJyxcblx0XHRcdGJlZm9yZTogJ2ZsaXAtY2xvY2stYmVmb3JlJyxcblx0XHRcdGZsaXA6ICdmbGlwJ1x0XG5cdFx0fSxcblx0XHRcdFx0XG5cdFx0LyoqXG5cdFx0ICogVGhlIHBhcmVudCBGbGlwQ2xvY2suRmFjdG9yeSBvYmplY3Rcblx0XHQgKi9cdFx0XG5cdFx0IFxuXHRcdGZhY3Rvcnk6IGZhbHNlLFxuXHRcdFxuXHRcdC8qKlxuXHRcdCAqIFRoZSBqUXVlcnkgb2JqZWN0XG5cdFx0ICovXHRcdFxuXHRcdCBcblx0XHQkZWw6IGZhbHNlLFxuXG5cdFx0LyoqXG5cdFx0ICogVGhlIGpRdWVyeSBvYmplY3QgKGRlcHJlY2F0ZWQpXG5cdFx0ICovXHRcdFxuXHRcdCBcblx0XHQkb2JqOiBmYWxzZSxcblx0XHRcblx0XHQvKipcblx0XHQgKiBUaGUgaXRlbXMgaW4gdGhlIGxpc3Rcblx0XHQgKi9cdFx0XG5cdFx0IFxuXHRcdGl0ZW1zOiBbXSxcblx0XHRcblx0XHQvKipcblx0XHQgKiBUaGUgbGFzdCBkaWdpdFxuXHRcdCAqL1x0XHRcblx0XHQgXG5cdFx0bGFzdERpZ2l0OiAwLFxuXHRcdFx0XG5cdFx0LyoqXG5cdFx0ICogQ29uc3RydWN0b3Jcblx0XHQgKlxuXHRcdCAqIEBwYXJhbSAgb2JqZWN0ICBBIEZsaXBDbG9jay5GYWN0b3J5IG9iamVjdFxuXHRcdCAqIEBwYXJhbSAgaW50ICAgICBBbiBpbnRlZ2VyIHVzZSB0byBzZWxlY3QgdGhlIGNvcnJlY3QgZGlnaXRcblx0XHQgKiBAcGFyYW0gIG9iamVjdCAgQW4gb2JqZWN0IHRvIG92ZXJyaWRlIHRoZSBkZWZhdWx0IHByb3BlcnRpZXNcdCBcblx0XHQgKi9cblx0XHQgXG5cdFx0Y29uc3RydWN0b3I6IGZ1bmN0aW9uKGZhY3RvcnksIGRpZ2l0LCBvcHRpb25zKSB7XG5cdFx0XHR0aGlzLmZhY3RvcnkgPSBmYWN0b3J5O1xuXHRcdFx0dGhpcy5kaWdpdCA9IGRpZ2l0O1xuXHRcdFx0dGhpcy5sYXN0RGlnaXQgPSBkaWdpdDtcblx0XHRcdHRoaXMuJGVsID0gdGhpcy5jcmVhdGVMaXN0KCk7XG5cdFx0XHRcblx0XHRcdC8vIERlcGNyYXRlZCBzdXBwb3J0IG9mIHRoZSAkb2JqIHByb3BlcnR5LlxuXHRcdFx0dGhpcy4kb2JqID0gdGhpcy4kZWw7XG5cblx0XHRcdGlmKGRpZ2l0ID4gMCkge1xuXHRcdFx0XHR0aGlzLnNlbGVjdChkaWdpdCk7XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMuZmFjdG9yeS4kZWwuYXBwZW5kKHRoaXMuJGVsKTtcblx0XHR9LFxuXHRcdFxuXHRcdC8qKlxuXHRcdCAqIFNlbGVjdCB0aGUgZGlnaXQgaW4gdGhlIGxpc3Rcblx0XHQgKlxuXHRcdCAqIEBwYXJhbSAgaW50ICBBIGRpZ2l0IDAtOVx0IFxuXHRcdCAqL1xuXHRcdCBcblx0XHRzZWxlY3Q6IGZ1bmN0aW9uKGRpZ2l0KSB7XG5cdFx0XHRpZih0eXBlb2YgZGlnaXQgPT09IFwidW5kZWZpbmVkXCIpIHtcblx0XHRcdFx0ZGlnaXQgPSB0aGlzLmRpZ2l0O1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdHRoaXMuZGlnaXQgPSBkaWdpdDtcblx0XHRcdH1cblxuXHRcdFx0aWYodGhpcy5kaWdpdCAhPSB0aGlzLmxhc3REaWdpdCkge1xuXHRcdFx0XHR2YXIgJGRlbGV0ZSA9IHRoaXMuJGVsLmZpbmQoJy4nK3RoaXMuY2xhc3Nlcy5iZWZvcmUpLnJlbW92ZUNsYXNzKHRoaXMuY2xhc3Nlcy5iZWZvcmUpO1xuXG5cdFx0XHRcdHRoaXMuJGVsLmZpbmQoJy4nK3RoaXMuY2xhc3Nlcy5hY3RpdmUpLnJlbW92ZUNsYXNzKHRoaXMuY2xhc3Nlcy5hY3RpdmUpXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdCAgLmFkZENsYXNzKHRoaXMuY2xhc3Nlcy5iZWZvcmUpO1xuXG5cdFx0XHRcdHRoaXMuYXBwZW5kTGlzdEl0ZW0odGhpcy5jbGFzc2VzLmFjdGl2ZSwgdGhpcy5kaWdpdCk7XG5cblx0XHRcdFx0JGRlbGV0ZS5yZW1vdmUoKTtcblxuXHRcdFx0XHR0aGlzLmxhc3REaWdpdCA9IHRoaXMuZGlnaXQ7XG5cdFx0XHR9XHRcblx0XHR9LFxuXHRcdFxuXHRcdC8qKlxuXHRcdCAqIEFkZHMgdGhlIHBsYXkgY2xhc3MgdG8gdGhlIERPTSBvYmplY3Rcblx0XHQgKi9cblx0XHQgXHRcdFxuXHRcdHBsYXk6IGZ1bmN0aW9uKCkge1xuXHRcdFx0dGhpcy4kZWwuYWRkQ2xhc3ModGhpcy5mYWN0b3J5LmNsYXNzZXMucGxheSk7XG5cdFx0fSxcblx0XHRcblx0XHQvKipcblx0XHQgKiBSZW1vdmVzIHRoZSBwbGF5IGNsYXNzIHRvIHRoZSBET00gb2JqZWN0IFxuXHRcdCAqL1xuXHRcdCBcblx0XHRzdG9wOiBmdW5jdGlvbigpIHtcblx0XHRcdHZhciB0ID0gdGhpcztcblxuXHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpIHtcblx0XHRcdFx0dC4kZWwucmVtb3ZlQ2xhc3ModC5mYWN0b3J5LmNsYXNzZXMucGxheSk7XG5cdFx0XHR9LCB0aGlzLmZhY3RvcnkudGltZXIuaW50ZXJ2YWwpO1xuXHRcdH0sXG5cdFx0XG5cdFx0LyoqXG5cdFx0ICogQ3JlYXRlcyB0aGUgbGlzdCBpdGVtIEhUTUwgYW5kIHJldHVybnMgYXMgYSBzdHJpbmcgXG5cdFx0ICovXG5cdFx0IFxuXHRcdGNyZWF0ZUxpc3RJdGVtOiBmdW5jdGlvbihjc3MsIHZhbHVlKSB7XG5cdFx0XHRyZXR1cm4gW1xuXHRcdFx0XHQnPGxpIGNsYXNzPVwiJysoY3NzID8gY3NzIDogJycpKydcIj4nLFxuXHRcdFx0XHRcdCc8YSBocmVmPVwiI1wiPicsXG5cdFx0XHRcdFx0XHQnPGRpdiBjbGFzcz1cInVwXCI+Jyxcblx0XHRcdFx0XHRcdFx0JzxkaXYgY2xhc3M9XCJzaGFkb3dcIj48L2Rpdj4nLFxuXHRcdFx0XHRcdFx0XHQnPGRpdiBjbGFzcz1cImlublwiPicrKHZhbHVlID8gdmFsdWUgOiAnJykrJzwvZGl2PicsXG5cdFx0XHRcdFx0XHQnPC9kaXY+Jyxcblx0XHRcdFx0XHRcdCc8ZGl2IGNsYXNzPVwiZG93blwiPicsXG5cdFx0XHRcdFx0XHRcdCc8ZGl2IGNsYXNzPVwic2hhZG93XCI+PC9kaXY+Jyxcblx0XHRcdFx0XHRcdFx0JzxkaXYgY2xhc3M9XCJpbm5cIj4nKyh2YWx1ZSA/IHZhbHVlIDogJycpKyc8L2Rpdj4nLFxuXHRcdFx0XHRcdFx0JzwvZGl2PicsXG5cdFx0XHRcdFx0JzwvYT4nLFxuXHRcdFx0XHQnPC9saT4nXG5cdFx0XHRdLmpvaW4oJycpO1xuXHRcdH0sXG5cblx0XHQvKipcblx0XHQgKiBBcHBlbmQgdGhlIGxpc3QgaXRlbSB0byB0aGUgcGFyZW50IERPTSBub2RlIFxuXHRcdCAqL1xuXG5cdFx0YXBwZW5kTGlzdEl0ZW06IGZ1bmN0aW9uKGNzcywgdmFsdWUpIHtcblx0XHRcdHZhciBodG1sID0gdGhpcy5jcmVhdGVMaXN0SXRlbShjc3MsIHZhbHVlKTtcblxuXHRcdFx0dGhpcy4kZWwuYXBwZW5kKGh0bWwpO1xuXHRcdH0sXG5cblx0XHQvKipcblx0XHQgKiBDcmVhdGUgdGhlIGxpc3Qgb2YgZGlnaXRzIGFuZCBhcHBlbmRzIGl0IHRvIHRoZSBET00gb2JqZWN0IFxuXHRcdCAqL1xuXHRcdCBcblx0XHRjcmVhdGVMaXN0OiBmdW5jdGlvbigpIHtcblxuXHRcdFx0dmFyIGxhc3REaWdpdCA9IHRoaXMuZ2V0UHJldkRpZ2l0KCkgPyB0aGlzLmdldFByZXZEaWdpdCgpIDogdGhpcy5kaWdpdDtcblxuXHRcdFx0dmFyIGh0bWwgPSAkKFtcblx0XHRcdFx0Jzx1bCBjbGFzcz1cIicrdGhpcy5jbGFzc2VzLmZsaXArJyAnKyh0aGlzLmZhY3RvcnkucnVubmluZyA/IHRoaXMuZmFjdG9yeS5jbGFzc2VzLnBsYXkgOiAnJykrJ1wiPicsXG5cdFx0XHRcdFx0dGhpcy5jcmVhdGVMaXN0SXRlbSh0aGlzLmNsYXNzZXMuYmVmb3JlLCBsYXN0RGlnaXQpLFxuXHRcdFx0XHRcdHRoaXMuY3JlYXRlTGlzdEl0ZW0odGhpcy5jbGFzc2VzLmFjdGl2ZSwgdGhpcy5kaWdpdCksXG5cdFx0XHRcdCc8L3VsPidcblx0XHRcdF0uam9pbignJykpO1xuXHRcdFx0XHRcdFxuXHRcdFx0cmV0dXJuIGh0bWw7XG5cdFx0fSxcblxuXHRcdGdldE5leHREaWdpdDogZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5kaWdpdCA9PSA5ID8gMCA6IHRoaXMuZGlnaXQgKyAxO1xuXHRcdH0sXG5cblx0XHRnZXRQcmV2RGlnaXQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuZGlnaXQgPT0gMCA/IDkgOiB0aGlzLmRpZ2l0IC0gMTtcblx0XHR9XG5cblx0fSk7XG5cdFxuXHRcbn0oalF1ZXJ5KSk7XG5cbi8qanNoaW50IHNtYXJ0dGFiczp0cnVlICovXG5cbi8qKlxuICogRmxpcENsb2NrLmpzXG4gKlxuICogQGF1dGhvciAgICAgSnVzdGluIEtpbWJyZWxsXG4gKiBAY29weXJpZ2h0ICAyMDEzIC0gT2JqZWN0aXZlIEhUTUwsIExMQ1xuICogQGxpY2VzbnNlICAgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcbiAqL1xuXHRcbihmdW5jdGlvbigkKSB7XG5cdFxuXHRcInVzZSBzdHJpY3RcIjtcblx0XG5cdC8qKlxuXHQgKiBDYXBpdGFsaXplIHRoZSBmaXJzdCBsZXR0ZXIgaW4gYSBzdHJpbmdcblx0ICpcblx0ICogQHJldHVybiBzdHJpbmdcblx0ICovXG5cdCBcblx0U3RyaW5nLnByb3RvdHlwZS51Y2ZpcnN0ID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHRoaXMuc3Vic3RyKDAsIDEpLnRvVXBwZXJDYXNlKCkgKyB0aGlzLnN1YnN0cigxKTtcblx0fTtcblx0XG5cdC8qKlxuXHQgKiBqUXVlcnkgaGVscGVyIG1ldGhvZFxuXHQgKlxuXHQgKiBAcGFyYW0gIGludCAgICAgQW4gaW50ZWdlciB1c2VkIHRvIHN0YXJ0IHRoZSBjbG9jayAobm8uIHNlY29uZHMpXG5cdCAqIEBwYXJhbSAgb2JqZWN0ICBBbiBvYmplY3Qgb2YgcHJvcGVydGllcyB0byBvdmVycmlkZSB0aGUgZGVmYXVsdFx0XG5cdCAqL1xuXHQgXG5cdCQuZm4uRmxpcENsb2NrID0gZnVuY3Rpb24oZGlnaXQsIG9wdGlvbnMpIHtcdFxuXHRcdHJldHVybiBuZXcgRmxpcENsb2NrKCQodGhpcyksIGRpZ2l0LCBvcHRpb25zKTtcblx0fTtcblx0XG5cdC8qKlxuXHQgKiBqUXVlcnkgaGVscGVyIG1ldGhvZFxuXHQgKlxuXHQgKiBAcGFyYW0gIGludCAgICAgQW4gaW50ZWdlciB1c2VkIHRvIHN0YXJ0IHRoZSBjbG9jayAobm8uIHNlY29uZHMpXG5cdCAqIEBwYXJhbSAgb2JqZWN0ICBBbiBvYmplY3Qgb2YgcHJvcGVydGllcyB0byBvdmVycmlkZSB0aGUgZGVmYXVsdFx0XG5cdCAqL1xuXHQgXG5cdCQuZm4uZmxpcENsb2NrID0gZnVuY3Rpb24oZGlnaXQsIG9wdGlvbnMpIHtcblx0XHRyZXR1cm4gJC5mbi5GbGlwQ2xvY2soZGlnaXQsIG9wdGlvbnMpO1xuXHR9O1xuXHRcbn0oalF1ZXJ5KSk7XG5cbi8qanNoaW50IHNtYXJ0dGFiczp0cnVlICovXG5cbi8qKlxuICogRmxpcENsb2NrLmpzXG4gKlxuICogQGF1dGhvciAgICAgSnVzdGluIEtpbWJyZWxsXG4gKiBAY29weXJpZ2h0ICAyMDEzIC0gT2JqZWN0aXZlIEhUTUwsIExMQ1xuICogQGxpY2VzbnNlICAgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcbiAqL1xuXHRcbihmdW5jdGlvbigkKSB7XG5cdFxuXHRcInVzZSBzdHJpY3RcIjtcblx0XHRcdFxuXHQvKipcblx0ICogVGhlIEZsaXBDbG9jayBUaW1lIGNsYXNzIGlzIHVzZWQgdG8gbWFuYWdlIGFsbCB0aGUgdGltZSBcblx0ICogY2FsY3VsYXRpb25zLlxuXHQgKlxuXHQgKiBAcGFyYW0gXHRvYmplY3QgIEEgRmxpcENsb2NrLkZhY3Rvcnkgb2JqZWN0XG5cdCAqIEBwYXJhbSBcdG1peGVkICAgVGhpcyBpcyB0aGUgZGlnaXQgdXNlZCB0byBzZXQgdGhlIGNsb2NrLiBJZiBhbiBcblx0ICpcdFx0XHRcdCAgICBvYmplY3QgaXMgcGFzc2VkLCAwIHdpbGwgYmUgdXNlZC5cdFxuXHQgKiBAcGFyYW0gXHRvYmplY3QgIEFuIG9iamVjdCBvZiBwcm9wZXJ0aWVzIHRvIG92ZXJyaWRlIHRoZSBkZWZhdWx0XHRcblx0ICovXG5cdCBcdFxuXHRGbGlwQ2xvY2suVGltZSA9IEZsaXBDbG9jay5CYXNlLmV4dGVuZCh7XG5cdFx0XG5cdFx0LyoqXG5cdFx0ICogVGhlIHRpbWUgKGluIHNlY29uZHMpIG9yIGEgZGF0ZSBvYmplY3Rcblx0XHQgKi9cdFx0XG5cdFx0IFxuXHRcdHRpbWU6IDAsXG5cdFx0XG5cdFx0LyoqXG5cdFx0ICogVGhlIHBhcmVudCBGbGlwQ2xvY2suRmFjdG9yeSBvYmplY3Rcblx0XHQgKi9cdFx0XG5cdFx0IFxuXHRcdGZhY3Rvcnk6IGZhbHNlLFxuXHRcdFxuXHRcdC8qKlxuXHRcdCAqIFRoZSBtaW5pbXVtIG51bWJlciBvZiBkaWdpdHMgdGhlIGNsb2NrIGZhY2UgbXVzdCBoYXZlXG5cdFx0ICovXHRcdFxuXHRcdCBcblx0XHRtaW5pbXVtRGlnaXRzOiAwLFxuXG5cdFx0LyoqXG5cdFx0ICogQ29uc3RydWN0b3Jcblx0XHQgKlxuXHRcdCAqIEBwYXJhbSAgb2JqZWN0ICBBIEZsaXBDbG9jay5GYWN0b3J5IG9iamVjdFxuXHRcdCAqIEBwYXJhbSAgaW50ICAgICBBbiBpbnRlZ2VyIHVzZSB0byBzZWxlY3QgdGhlIGNvcnJlY3QgZGlnaXRcblx0XHQgKiBAcGFyYW0gIG9iamVjdCAgQW4gb2JqZWN0IHRvIG92ZXJyaWRlIHRoZSBkZWZhdWx0IHByb3BlcnRpZXNcdCBcblx0XHQgKi9cblx0XHQgXG5cdFx0Y29uc3RydWN0b3I6IGZ1bmN0aW9uKGZhY3RvcnksIHRpbWUsIG9wdGlvbnMpIHtcblx0XHRcdGlmKHR5cGVvZiBvcHRpb25zICE9IFwib2JqZWN0XCIpIHtcblx0XHRcdFx0b3B0aW9ucyA9IHt9O1xuXHRcdFx0fVxuXG5cdFx0XHRpZighb3B0aW9ucy5taW5pbXVtRGlnaXRzKSB7XG5cdFx0XHRcdG9wdGlvbnMubWluaW11bURpZ2l0cyA9IGZhY3RvcnkubWluaW11bURpZ2l0cztcblx0XHRcdH1cblxuXHRcdFx0dGhpcy5iYXNlKG9wdGlvbnMpO1xuXHRcdFx0dGhpcy5mYWN0b3J5ID0gZmFjdG9yeTtcblxuXHRcdFx0aWYodGltZSkge1xuXHRcdFx0XHR0aGlzLnRpbWUgPSB0aW1lO1xuXHRcdFx0fVxuXHRcdH0sXG5cblx0XHQvKipcblx0XHQgKiBDb252ZXJ0IGEgc3RyaW5nIG9yIGludGVnZXIgdG8gYW4gYXJyYXkgb2YgZGlnaXRzXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0gICBtaXhlZCAgU3RyaW5nIG9yIEludGVnZXIgb2YgZGlnaXRzXHQgXG5cdFx0ICogQHJldHVybiAgYXJyYXkgIEFuIGFycmF5IG9mIGRpZ2l0cyBcblx0XHQgKi9cblx0XHQgXG5cdFx0Y29udmVydERpZ2l0c1RvQXJyYXk6IGZ1bmN0aW9uKHN0cikge1xuXHRcdFx0dmFyIGRhdGEgPSBbXTtcblx0XHRcdFxuXHRcdFx0c3RyID0gc3RyLnRvU3RyaW5nKCk7XG5cdFx0XHRcblx0XHRcdGZvcih2YXIgeCA9IDA7eCA8IHN0ci5sZW5ndGg7IHgrKykge1xuXHRcdFx0XHRpZihzdHJbeF0ubWF0Y2goL15cXGQqJC9nKSkge1xuXHRcdFx0XHRcdGRhdGEucHVzaChzdHJbeF0pO1x0XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdFxuXHRcdFx0cmV0dXJuIGRhdGE7XG5cdFx0fSxcblx0XHRcblx0XHQvKipcblx0XHQgKiBHZXQgYSBzcGVjaWZpYyBkaWdpdCBmcm9tIHRoZSB0aW1lIGludGVnZXJcblx0XHQgKlxuXHRcdCAqIEBwYXJhbSAgIGludCAgICBUaGUgc3BlY2lmaWMgZGlnaXQgdG8gc2VsZWN0IGZyb20gdGhlIHRpbWVcdCBcblx0XHQgKiBAcmV0dXJuICBtaXhlZCAgUmV0dXJucyBGQUxTRSBpZiBubyBkaWdpdCBpcyBmb3VuZCwgb3RoZXJ3aXNlXG5cdFx0ICpcdFx0XHRcdCAgIHRoZSBtZXRob2QgcmV0dXJucyB0aGUgZGVmaW5lZCBkaWdpdFx0IFxuXHRcdCAqL1xuXHRcdCBcblx0XHRkaWdpdDogZnVuY3Rpb24oaSkge1xuXHRcdFx0dmFyIHRpbWVTdHIgPSB0aGlzLnRvU3RyaW5nKCk7XG5cdFx0XHR2YXIgbGVuZ3RoICA9IHRpbWVTdHIubGVuZ3RoO1xuXHRcdFx0XG5cdFx0XHRpZih0aW1lU3RyW2xlbmd0aCAtIGldKVx0IHtcblx0XHRcdFx0cmV0dXJuIHRpbWVTdHJbbGVuZ3RoIC0gaV07XG5cdFx0XHR9XG5cdFx0XHRcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9LFxuXG5cdFx0LyoqXG5cdFx0ICogRm9ybWF0cyBhbnkgYXJyYXkgb2YgZGlnaXRzIGludG8gYSB2YWxpZCBhcnJheSBvZiBkaWdpdHNcblx0XHQgKlxuXHRcdCAqIEBwYXJhbSAgIG1peGVkICBBbiBhcnJheSBvZiBkaWdpdHNcdCBcblx0XHQgKiBAcmV0dXJuICBhcnJheSAgQW4gYXJyYXkgb2YgZGlnaXRzIFxuXHRcdCAqL1xuXHRcdCBcblx0XHRkaWdpdGl6ZTogZnVuY3Rpb24ob2JqKSB7XG5cdFx0XHR2YXIgZGF0YSA9IFtdO1xuXG5cdFx0XHQkLmVhY2gob2JqLCBmdW5jdGlvbihpLCB2YWx1ZSkge1xuXHRcdFx0XHR2YWx1ZSA9IHZhbHVlLnRvU3RyaW5nKCk7XG5cdFx0XHRcdFxuXHRcdFx0XHRpZih2YWx1ZS5sZW5ndGggPT0gMSkge1xuXHRcdFx0XHRcdHZhbHVlID0gJzAnK3ZhbHVlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdFxuXHRcdFx0XHRmb3IodmFyIHggPSAwOyB4IDwgdmFsdWUubGVuZ3RoOyB4KyspIHtcblx0XHRcdFx0XHRkYXRhLnB1c2godmFsdWUuY2hhckF0KHgpKTtcblx0XHRcdFx0fVx0XHRcdFx0XG5cdFx0XHR9KTtcblxuXHRcdFx0aWYoZGF0YS5sZW5ndGggPiB0aGlzLm1pbmltdW1EaWdpdHMpIHtcblx0XHRcdFx0dGhpcy5taW5pbXVtRGlnaXRzID0gZGF0YS5sZW5ndGg7XG5cdFx0XHR9XG5cdFx0XHRcblx0XHRcdGlmKHRoaXMubWluaW11bURpZ2l0cyA+IGRhdGEubGVuZ3RoKSB7XG5cdFx0XHRcdGZvcih2YXIgeCA9IGRhdGEubGVuZ3RoOyB4IDwgdGhpcy5taW5pbXVtRGlnaXRzOyB4KyspIHtcblx0XHRcdFx0XHRkYXRhLnVuc2hpZnQoJzAnKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gZGF0YTtcblx0XHR9LFxuXHRcdFxuXHRcdC8qKlxuXHRcdCAqIEdldHMgYSBuZXcgRGF0ZSBvYmplY3QgZm9yIHRoZSBjdXJyZW50IHRpbWVcblx0XHQgKlxuXHRcdCAqIEByZXR1cm4gIGFycmF5ICBSZXR1cm5zIGEgRGF0ZSBvYmplY3Rcblx0XHQgKi9cblxuXHRcdGdldERhdGVPYmplY3Q6IGZ1bmN0aW9uKCkge1xuXHRcdFx0aWYodGhpcy50aW1lIGluc3RhbmNlb2YgRGF0ZSkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy50aW1lO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gbmV3IERhdGUoKG5ldyBEYXRlKCkpLmdldFRpbWUoKSArIHRoaXMuZ2V0VGltZVNlY29uZHMoKSAqIDEwMDApO1xuXHRcdH0sXG5cdFx0XG5cdFx0LyoqXG5cdFx0ICogR2V0cyBhIGRpZ2l0aXplZCBkYWlseSBjb3VudGVyXG5cdFx0ICpcblx0XHQgKiBAcmV0dXJuICBvYmplY3QgIFJldHVybnMgYSBkaWdpdGl6ZWQgb2JqZWN0XG5cdFx0ICovXG5cblx0XHRnZXREYXlDb3VudGVyOiBmdW5jdGlvbihpbmNsdWRlU2Vjb25kcykge1xuXHRcdFx0dmFyIGRpZ2l0cyA9IFtcblx0XHRcdFx0dGhpcy5nZXREYXlzKCksXG5cdFx0XHRcdHRoaXMuZ2V0SG91cnModHJ1ZSksXG5cdFx0XHRcdHRoaXMuZ2V0TWludXRlcyh0cnVlKVxuXHRcdFx0XTtcblxuXHRcdFx0aWYoaW5jbHVkZVNlY29uZHMpIHtcblx0XHRcdFx0ZGlnaXRzLnB1c2godGhpcy5nZXRTZWNvbmRzKHRydWUpKTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHRoaXMuZGlnaXRpemUoZGlnaXRzKTtcblx0XHR9LFxuXG5cdFx0LyoqXG5cdFx0ICogR2V0cyBudW1iZXIgb2YgZGF5c1xuXHRcdCAqXG5cdFx0ICogQHBhcmFtICAgYm9vbCAgU2hvdWxkIHBlcmZvcm0gYSBtb2R1bHVzPyBJZiBub3Qgc2VudCwgdGhlbiBuby5cblx0XHQgKiBAcmV0dXJuICBpbnQgICBSZXR1bnMgYSBmbG9vcmVkIGludGVnZXJcblx0XHQgKi9cblx0XHQgXG5cdFx0Z2V0RGF5czogZnVuY3Rpb24obW9kKSB7XG5cdFx0XHR2YXIgZGF5cyA9IHRoaXMuZ2V0VGltZVNlY29uZHMoKSAvIDYwIC8gNjAgLyAyNDtcblx0XHRcdFxuXHRcdFx0aWYobW9kKSB7XG5cdFx0XHRcdGRheXMgPSBkYXlzICUgNztcblx0XHRcdH1cblx0XHRcdFxuXHRcdFx0cmV0dXJuIE1hdGguZmxvb3IoZGF5cyk7XG5cdFx0fSxcblx0XHRcblx0XHQvKipcblx0XHQgKiBHZXRzIGFuIGhvdXJseSBicmVha2Rvd25cblx0XHQgKlxuXHRcdCAqIEByZXR1cm4gIG9iamVjdCAgUmV0dXJucyBhIGRpZ2l0aXplZCBvYmplY3Rcblx0XHQgKi9cblx0XHQgXG5cdFx0Z2V0SG91ckNvdW50ZXI6IGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIG9iaiA9IHRoaXMuZGlnaXRpemUoW1xuXHRcdFx0XHR0aGlzLmdldEhvdXJzKCksXG5cdFx0XHRcdHRoaXMuZ2V0TWludXRlcyh0cnVlKSxcblx0XHRcdFx0dGhpcy5nZXRTZWNvbmRzKHRydWUpXG5cdFx0XHRdKTtcblx0XHRcdFxuXHRcdFx0cmV0dXJuIG9iajtcblx0XHR9LFxuXHRcdFxuXHRcdC8qKlxuXHRcdCAqIEdldHMgYW4gaG91cmx5IGJyZWFrZG93blxuXHRcdCAqXG5cdFx0ICogQHJldHVybiAgb2JqZWN0ICBSZXR1cm5zIGEgZGlnaXRpemVkIG9iamVjdFxuXHRcdCAqL1xuXHRcdCBcblx0XHRnZXRIb3VybHk6IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuZ2V0SG91ckNvdW50ZXIoKTtcblx0XHR9LFxuXHRcdFxuXHRcdC8qKlxuXHRcdCAqIEdldHMgbnVtYmVyIG9mIGhvdXJzXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0gICBib29sICBTaG91bGQgcGVyZm9ybSBhIG1vZHVsdXM/IElmIG5vdCBzZW50LCB0aGVuIG5vLlxuXHRcdCAqIEByZXR1cm4gIGludCAgIFJldHVucyBhIGZsb29yZWQgaW50ZWdlclxuXHRcdCAqL1xuXHRcdCBcblx0XHRnZXRIb3VyczogZnVuY3Rpb24obW9kKSB7XG5cdFx0XHR2YXIgaG91cnMgPSB0aGlzLmdldFRpbWVTZWNvbmRzKCkgLyA2MCAvIDYwO1xuXHRcdFx0XG5cdFx0XHRpZihtb2QpIHtcblx0XHRcdFx0aG91cnMgPSBob3VycyAlIDI0O1x0XG5cdFx0XHR9XG5cdFx0XHRcblx0XHRcdHJldHVybiBNYXRoLmZsb29yKGhvdXJzKTtcblx0XHR9LFxuXHRcdFxuXHRcdC8qKlxuXHRcdCAqIEdldHMgdGhlIHR3ZW50eS1mb3VyIGhvdXIgdGltZVxuXHRcdCAqXG5cdFx0ICogQHJldHVybiAgb2JqZWN0ICByZXR1cm5zIGEgZGlnaXRpemVkIG9iamVjdFxuXHRcdCAqL1xuXHRcdCBcblx0XHRnZXRNaWxpdGFyeVRpbWU6IGZ1bmN0aW9uKGRhdGUsIHNob3dTZWNvbmRzKSB7XG5cdFx0XHRpZih0eXBlb2Ygc2hvd1NlY29uZHMgPT09IFwidW5kZWZpbmVkXCIpIHtcblx0XHRcdFx0c2hvd1NlY29uZHMgPSB0cnVlO1xuXHRcdFx0fVxuXG5cdFx0XHRpZighZGF0ZSkge1xuXHRcdFx0XHRkYXRlID0gdGhpcy5nZXREYXRlT2JqZWN0KCk7XG5cdFx0XHR9XG5cblx0XHRcdHZhciBkYXRhICA9IFtcblx0XHRcdFx0ZGF0ZS5nZXRIb3VycygpLFxuXHRcdFx0XHRkYXRlLmdldE1pbnV0ZXMoKVx0XHRcdFxuXHRcdFx0XTtcblxuXHRcdFx0aWYoc2hvd1NlY29uZHMgPT09IHRydWUpIHtcblx0XHRcdFx0ZGF0YS5wdXNoKGRhdGUuZ2V0U2Vjb25kcygpKTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHRoaXMuZGlnaXRpemUoZGF0YSk7XG5cdFx0fSxcblx0XHRcdFx0XG5cdFx0LyoqXG5cdFx0ICogR2V0cyBudW1iZXIgb2YgbWludXRlc1xuXHRcdCAqXG5cdFx0ICogQHBhcmFtICAgYm9vbCAgU2hvdWxkIHBlcmZvcm0gYSBtb2R1bHVzPyBJZiBub3Qgc2VudCwgdGhlbiBuby5cblx0XHQgKiBAcmV0dXJuICBpbnQgICBSZXR1bnMgYSBmbG9vcmVkIGludGVnZXJcblx0XHQgKi9cblx0XHQgXG5cdFx0Z2V0TWludXRlczogZnVuY3Rpb24obW9kKSB7XG5cdFx0XHR2YXIgbWludXRlcyA9IHRoaXMuZ2V0VGltZVNlY29uZHMoKSAvIDYwO1xuXHRcdFx0XG5cdFx0XHRpZihtb2QpIHtcblx0XHRcdFx0bWludXRlcyA9IG1pbnV0ZXMgJSA2MDtcblx0XHRcdH1cblx0XHRcdFxuXHRcdFx0cmV0dXJuIE1hdGguZmxvb3IobWludXRlcyk7XG5cdFx0fSxcblx0XHRcblx0XHQvKipcblx0XHQgKiBHZXRzIGEgbWludXRlIGJyZWFrZG93blxuXHRcdCAqL1xuXHRcdCBcblx0XHRnZXRNaW51dGVDb3VudGVyOiBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBvYmogPSB0aGlzLmRpZ2l0aXplKFtcblx0XHRcdFx0dGhpcy5nZXRNaW51dGVzKCksXG5cdFx0XHRcdHRoaXMuZ2V0U2Vjb25kcyh0cnVlKVxuXHRcdFx0XSk7XG5cblx0XHRcdHJldHVybiBvYmo7XG5cdFx0fSxcblx0XHRcblx0XHQvKipcblx0XHQgKiBHZXRzIHRpbWUgY291bnQgaW4gc2Vjb25kcyByZWdhcmRsZXNzIG9mIGlmIHRhcmdldHRpbmcgZGF0ZSBvciBub3QuXG5cdFx0ICpcblx0XHQgKiBAcmV0dXJuICBpbnQgICBSZXR1cm5zIGEgZmxvb3JlZCBpbnRlZ2VyXG5cdFx0ICovXG5cdFx0IFxuXHRcdGdldFRpbWVTZWNvbmRzOiBmdW5jdGlvbihkYXRlKSB7XG5cdFx0XHRpZighZGF0ZSkge1xuXHRcdFx0XHRkYXRlID0gbmV3IERhdGUoKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKHRoaXMudGltZSBpbnN0YW5jZW9mIERhdGUpIHtcblx0XHRcdFx0aWYgKHRoaXMuZmFjdG9yeS5jb3VudGRvd24pIHtcblx0XHRcdFx0XHRyZXR1cm4gTWF0aC5tYXgodGhpcy50aW1lLmdldFRpbWUoKS8xMDAwIC0gZGF0ZS5nZXRUaW1lKCkvMTAwMCwwKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRyZXR1cm4gZGF0ZS5nZXRUaW1lKCkvMTAwMCAtIHRoaXMudGltZS5nZXRUaW1lKCkvMTAwMCA7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLnRpbWU7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRcblx0XHQvKipcblx0XHQgKiBHZXRzIHRoZSBjdXJyZW50IHR3ZWx2ZSBob3VyIHRpbWVcblx0XHQgKlxuXHRcdCAqIEByZXR1cm4gIG9iamVjdCAgUmV0dXJucyBhIGRpZ2l0aXplZCBvYmplY3Rcblx0XHQgKi9cblx0XHQgXG5cdFx0Z2V0VGltZTogZnVuY3Rpb24oZGF0ZSwgc2hvd1NlY29uZHMpIHtcblx0XHRcdGlmKHR5cGVvZiBzaG93U2Vjb25kcyA9PT0gXCJ1bmRlZmluZWRcIikge1xuXHRcdFx0XHRzaG93U2Vjb25kcyA9IHRydWU7XG5cdFx0XHR9XG5cblx0XHRcdGlmKCFkYXRlKSB7XG5cdFx0XHRcdGRhdGUgPSB0aGlzLmdldERhdGVPYmplY3QoKTtcblx0XHRcdH1cblxuXHRcdFx0Y29uc29sZS5sb2coZGF0ZSk7XG5cblx0XHRcdFxuXHRcdFx0dmFyIGhvdXJzID0gZGF0ZS5nZXRIb3VycygpO1xuXHRcdFx0dmFyIG1lcmlkID0gaG91cnMgPiAxMiA/ICdQTScgOiAnQU0nO1xuXHRcdFx0dmFyIGRhdGEgICA9IFtcblx0XHRcdFx0aG91cnMgPiAxMiA/IGhvdXJzIC0gMTIgOiAoaG91cnMgPT09IDAgPyAxMiA6IGhvdXJzKSxcblx0XHRcdFx0ZGF0ZS5nZXRNaW51dGVzKClcdFx0XHRcblx0XHRcdF07XG5cblx0XHRcdGlmKHNob3dTZWNvbmRzID09PSB0cnVlKSB7XG5cdFx0XHRcdGRhdGEucHVzaChkYXRlLmdldFNlY29uZHMoKSk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiB0aGlzLmRpZ2l0aXplKGRhdGEpO1xuXHRcdH0sXG5cdFx0XG5cdFx0LyoqXG5cdFx0ICogR2V0cyBudW1iZXIgb2Ygc2Vjb25kc1xuXHRcdCAqXG5cdFx0ICogQHBhcmFtICAgYm9vbCAgU2hvdWxkIHBlcmZvcm0gYSBtb2R1bHVzPyBJZiBub3Qgc2VudCwgdGhlbiBuby5cblx0XHQgKiBAcmV0dXJuICBpbnQgICBSZXR1bnMgYSBjZWlsZWQgaW50ZWdlclxuXHRcdCAqL1xuXHRcdCBcblx0XHRnZXRTZWNvbmRzOiBmdW5jdGlvbihtb2QpIHtcblx0XHRcdHZhciBzZWNvbmRzID0gdGhpcy5nZXRUaW1lU2Vjb25kcygpO1xuXHRcdFx0XG5cdFx0XHRpZihtb2QpIHtcblx0XHRcdFx0aWYoc2Vjb25kcyA9PSA2MCkge1xuXHRcdFx0XHRcdHNlY29uZHMgPSAwO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdHNlY29uZHMgPSBzZWNvbmRzICUgNjA7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdFxuXHRcdFx0cmV0dXJuIE1hdGguY2VpbChzZWNvbmRzKTtcblx0XHR9LFxuXG5cdFx0LyoqXG5cdFx0ICogR2V0cyBudW1iZXIgb2Ygd2Vla3Ncblx0XHQgKlxuXHRcdCAqIEBwYXJhbSAgIGJvb2wgIFNob3VsZCBwZXJmb3JtIGEgbW9kdWx1cz8gSWYgbm90IHNlbnQsIHRoZW4gbm8uXG5cdFx0ICogQHJldHVybiAgaW50ICAgUmV0dW5zIGEgZmxvb3JlZCBpbnRlZ2VyXG5cdFx0ICovXG5cdFx0IFxuXHRcdGdldFdlZWtzOiBmdW5jdGlvbihtb2QpIHtcblx0XHRcdHZhciB3ZWVrcyA9IHRoaXMuZ2V0VGltZVNlY29uZHMoKSAvIDYwIC8gNjAgLyAyNCAvIDc7XG5cdFx0XHRcblx0XHRcdGlmKG1vZCkge1xuXHRcdFx0XHR3ZWVrcyA9IHdlZWtzICUgNTI7XG5cdFx0XHR9XG5cdFx0XHRcblx0XHRcdHJldHVybiBNYXRoLmZsb29yKHdlZWtzKTtcblx0XHR9LFxuXHRcdFxuXHRcdC8qKlxuXHRcdCAqIFJlbW92ZXMgYSBzcGVjaWZpYyBudW1iZXIgb2YgbGVhZGluZyB6ZXJvcyBmcm9tIHRoZSBhcnJheS5cblx0XHQgKiBUaGlzIG1ldGhvZCBwcmV2ZW50cyB5b3UgZnJvbSByZW1vdmluZyB0b28gbWFueSBkaWdpdHMsIGV2ZW5cblx0XHQgKiBpZiB5b3UgdHJ5LlxuXHRcdCAqXG5cdFx0ICogQHBhcmFtICAgaW50ICAgIFRvdGFsIG51bWJlciBvZiBkaWdpdHMgdG8gcmVtb3ZlIFxuXHRcdCAqIEByZXR1cm4gIGFycmF5ICBBbiBhcnJheSBvZiBkaWdpdHMgXG5cdFx0ICovXG5cdFx0IFxuXHRcdHJlbW92ZUxlYWRpbmdaZXJvczogZnVuY3Rpb24odG90YWxEaWdpdHMsIGRpZ2l0cykge1xuXHRcdFx0dmFyIHRvdGFsICAgID0gMDtcblx0XHRcdHZhciBuZXdBcnJheSA9IFtdO1xuXHRcdFx0XG5cdFx0XHQkLmVhY2goZGlnaXRzLCBmdW5jdGlvbihpLCBkaWdpdCkge1xuXHRcdFx0XHRpZihpIDwgdG90YWxEaWdpdHMpIHtcblx0XHRcdFx0XHR0b3RhbCArPSBwYXJzZUludChkaWdpdHNbaV0sIDEwKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRuZXdBcnJheS5wdXNoKGRpZ2l0c1tpXSk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFx0XG5cdFx0XHRpZih0b3RhbCA9PT0gMCkge1xuXHRcdFx0XHRyZXR1cm4gbmV3QXJyYXk7XG5cdFx0XHR9XG5cdFx0XHRcblx0XHRcdHJldHVybiBkaWdpdHM7XG5cdFx0fSxcblxuXHRcdC8qKlxuXHRcdCAqIEFkZHMgWCBzZWNvbmQgdG8gdGhlIGN1cnJlbnQgdGltZVxuXHRcdCAqL1xuXG5cdFx0YWRkU2Vjb25kczogZnVuY3Rpb24oeCkge1xuXHRcdFx0aWYodGhpcy50aW1lIGluc3RhbmNlb2YgRGF0ZSkge1xuXHRcdFx0XHR0aGlzLnRpbWUuc2V0U2Vjb25kcyh0aGlzLnRpbWUuZ2V0U2Vjb25kcygpICsgeCk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0dGhpcy50aW1lICs9IHg7XG5cdFx0XHR9XG5cdFx0fSxcblxuXHRcdC8qKlxuXHRcdCAqIEFkZHMgMSBzZWNvbmQgdG8gdGhlIGN1cnJlbnQgdGltZVxuXHRcdCAqL1xuXG5cdFx0YWRkU2Vjb25kOiBmdW5jdGlvbigpIHtcblx0XHRcdHRoaXMuYWRkU2Vjb25kcygxKTtcblx0XHR9LFxuXG5cdFx0LyoqXG5cdFx0ICogU3Vic3RyYWN0cyBYIHNlY29uZHMgZnJvbSB0aGUgY3VycmVudCB0aW1lXG5cdFx0ICovXG5cblx0XHRzdWJTZWNvbmRzOiBmdW5jdGlvbih4KSB7XG5cdFx0XHRpZih0aGlzLnRpbWUgaW5zdGFuY2VvZiBEYXRlKSB7XG5cdFx0XHRcdHRoaXMudGltZS5zZXRTZWNvbmRzKHRoaXMudGltZS5nZXRTZWNvbmRzKCkgLSB4KTtcblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHR0aGlzLnRpbWUgLT0geDtcblx0XHRcdH1cblx0XHR9LFxuXG5cdFx0LyoqXG5cdFx0ICogU3Vic3RyYWN0cyAxIHNlY29uZCBmcm9tIHRoZSBjdXJyZW50IHRpbWVcblx0XHQgKi9cblxuXHRcdHN1YlNlY29uZDogZnVuY3Rpb24oKSB7XG5cdFx0XHR0aGlzLnN1YlNlY29uZHMoMSk7XG5cdFx0fSxcblx0XHRcblx0XHQvKipcblx0XHQgKiBDb252ZXJ0cyB0aGUgb2JqZWN0IHRvIGEgaHVtYW4gcmVhZGFibGUgc3RyaW5nXG5cdFx0ICovXG5cdFx0IFxuXHRcdHRvU3RyaW5nOiBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiB0aGlzLmdldFRpbWVTZWNvbmRzKCkudG9TdHJpbmcoKTtcblx0XHR9XG5cdFx0XG5cdFx0Lypcblx0XHRnZXRZZWFyczogZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gTWF0aC5mbG9vcih0aGlzLnRpbWUgLyA2MCAvIDYwIC8gMjQgLyA3IC8gNTIpO1xuXHRcdH0sXG5cdFx0XG5cdFx0Z2V0RGVjYWRlczogZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gTWF0aC5mbG9vcih0aGlzLmdldFdlZWtzKCkgLyAxMCk7XG5cdFx0fSovXG5cdH0pO1xuXHRcbn0oalF1ZXJ5KSk7XG5cbi8qanNoaW50IHNtYXJ0dGFiczp0cnVlICovXG5cbi8qKlxuICogRmxpcENsb2NrLmpzXG4gKlxuICogQGF1dGhvciAgICAgSnVzdGluIEtpbWJyZWxsXG4gKiBAY29weXJpZ2h0ICAyMDEzIC0gT2JqZWN0aXZlIEhUTUwsIExMQ1xuICogQGxpY2VzbnNlICAgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcbiAqL1xuXHRcbihmdW5jdGlvbigkKSB7XG5cdFxuXHRcInVzZSBzdHJpY3RcIjtcblx0XG5cdC8qKlxuXHQgKiBUaGUgRmxpcENsb2NrLlRpbWVyIG9iamVjdCBtYW5hZ2VycyB0aGUgSlMgdGltZXJzXG5cdCAqXG5cdCAqIEBwYXJhbVx0b2JqZWN0ICBUaGUgcGFyZW50IEZsaXBDbG9jay5GYWN0b3J5IG9iamVjdFxuXHQgKiBAcGFyYW1cdG9iamVjdCAgT3ZlcnJpZGUgdGhlIGRlZmF1bHQgb3B0aW9uc1xuXHQgKi9cblx0XG5cdEZsaXBDbG9jay5UaW1lciA9IEZsaXBDbG9jay5CYXNlLmV4dGVuZCh7XG5cdFx0XG5cdFx0LyoqXG5cdFx0ICogQ2FsbGJhY2tzXG5cdFx0ICovXHRcdFxuXHRcdCBcblx0XHRjYWxsYmFja3M6IHtcblx0XHRcdGRlc3Ryb3k6IGZhbHNlLFxuXHRcdFx0Y3JlYXRlOiBmYWxzZSxcblx0XHRcdGluaXQ6IGZhbHNlLFxuXHRcdFx0aW50ZXJ2YWw6IGZhbHNlLFxuXHRcdFx0c3RhcnQ6IGZhbHNlLFxuXHRcdFx0c3RvcDogZmFsc2UsXG5cdFx0XHRyZXNldDogZmFsc2Vcblx0XHR9LFxuXHRcdFxuXHRcdC8qKlxuXHRcdCAqIEZsaXBDbG9jayB0aW1lciBjb3VudCAoaG93IG1hbnkgaW50ZXJ2YWxzIGhhdmUgcGFzc2VkKVxuXHRcdCAqL1x0XHRcblx0XHQgXG5cdFx0Y291bnQ6IDAsXG5cdFx0XG5cdFx0LyoqXG5cdFx0ICogVGhlIHBhcmVudCBGbGlwQ2xvY2suRmFjdG9yeSBvYmplY3Rcblx0XHQgKi9cdFx0XG5cdFx0IFxuXHRcdGZhY3Rvcnk6IGZhbHNlLFxuXHRcdFxuXHRcdC8qKlxuXHRcdCAqIFRpbWVyIGludGVydmFsICgxIHNlY29uZCBieSBkZWZhdWx0KVxuXHRcdCAqL1x0XHRcblx0XHQgXG5cdFx0aW50ZXJ2YWw6IDEwMDAsXG5cblx0XHQvKipcblx0XHQgKiBUaGUgcmF0ZSBvZiB0aGUgYW5pbWF0aW9uIGluIG1pbGxpc2Vjb25kcyAobm90IGN1cnJlbnRseSBpbiB1c2UpXG5cdFx0ICovXHRcdFxuXHRcdCBcblx0XHRhbmltYXRpb25SYXRlOiAxMDAwLFxuXHRcdFx0XHRcblx0XHQvKipcblx0XHQgKiBDb25zdHJ1Y3RvclxuXHRcdCAqXG5cdFx0ICogQHJldHVyblx0dm9pZFxuXHRcdCAqL1x0XHRcblx0XHQgXG5cdFx0Y29uc3RydWN0b3I6IGZ1bmN0aW9uKGZhY3RvcnksIG9wdGlvbnMpIHtcblx0XHRcdHRoaXMuYmFzZShvcHRpb25zKTtcblx0XHRcdHRoaXMuZmFjdG9yeSA9IGZhY3Rvcnk7XG5cdFx0XHR0aGlzLmNhbGxiYWNrKHRoaXMuY2FsbGJhY2tzLmluaXQpO1x0XG5cdFx0XHR0aGlzLmNhbGxiYWNrKHRoaXMuY2FsbGJhY2tzLmNyZWF0ZSk7XG5cdFx0fSxcblx0XHRcblx0XHQvKipcblx0XHQgKiBUaGlzIG1ldGhvZCBnZXRzIHRoZSBlbGFwc2VkIHRoZSB0aW1lIGFzIGFuIGludGVyZ2VyXG5cdFx0ICpcblx0XHQgKiBAcmV0dXJuXHR2b2lkXG5cdFx0ICovXHRcdFxuXHRcdCBcblx0XHRnZXRFbGFwc2VkOiBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiB0aGlzLmNvdW50ICogdGhpcy5pbnRlcnZhbDtcblx0XHR9LFxuXHRcdFxuXHRcdC8qKlxuXHRcdCAqIFRoaXMgbWV0aG9kIGdldHMgdGhlIGVsYXBzZWQgdGhlIHRpbWUgYXMgYSBEYXRlIG9iamVjdFxuXHRcdCAqXG5cdFx0ICogQHJldHVyblx0dm9pZFxuXHRcdCAqL1x0XHRcblx0XHQgXG5cdFx0Z2V0RWxhcHNlZFRpbWU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIG5ldyBEYXRlKHRoaXMudGltZSArIHRoaXMuZ2V0RWxhcHNlZCgpKTtcblx0XHR9LFxuXHRcdFxuXHRcdC8qKlxuXHRcdCAqIFRoaXMgbWV0aG9kIGlzIHJlc2V0cyB0aGUgdGltZXJcblx0XHQgKlxuXHRcdCAqIEBwYXJhbSBcdGNhbGxiYWNrICBUaGlzIG1ldGhvZCByZXNldHMgdGhlIHRpbWVyIGJhY2sgdG8gMFxuXHRcdCAqIEByZXR1cm5cdHZvaWRcblx0XHQgKi9cdFx0XG5cdFx0IFxuXHRcdHJlc2V0OiBmdW5jdGlvbihjYWxsYmFjaykge1xuXHRcdFx0Y2xlYXJJbnRlcnZhbCh0aGlzLnRpbWVyKTtcblx0XHRcdHRoaXMuY291bnQgPSAwO1xuXHRcdFx0dGhpcy5fc2V0SW50ZXJ2YWwoY2FsbGJhY2spO1x0XHRcdFxuXHRcdFx0dGhpcy5jYWxsYmFjayh0aGlzLmNhbGxiYWNrcy5yZXNldCk7XG5cdFx0fSxcblx0XHRcblx0XHQvKipcblx0XHQgKiBUaGlzIG1ldGhvZCBpcyBzdGFydHMgdGhlIHRpbWVyXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0gXHRjYWxsYmFjayAgQSBmdW5jdGlvbiB0aGF0IGlzIGNhbGxlZCBvbmNlIHRoZSB0aW1lciBpcyBkZXN0cm95ZWRcblx0XHQgKiBAcmV0dXJuXHR2b2lkXG5cdFx0ICovXHRcdFxuXHRcdCBcblx0XHRzdGFydDogZnVuY3Rpb24oY2FsbGJhY2spIHtcdFx0XG5cdFx0XHR0aGlzLmZhY3RvcnkucnVubmluZyA9IHRydWU7XG5cdFx0XHR0aGlzLl9jcmVhdGVUaW1lcihjYWxsYmFjayk7XG5cdFx0XHR0aGlzLmNhbGxiYWNrKHRoaXMuY2FsbGJhY2tzLnN0YXJ0KTtcblx0XHR9LFxuXHRcdFxuXHRcdC8qKlxuXHRcdCAqIFRoaXMgbWV0aG9kIGlzIHN0b3BzIHRoZSB0aW1lclxuXHRcdCAqXG5cdFx0ICogQHBhcmFtIFx0Y2FsbGJhY2sgIEEgZnVuY3Rpb24gdGhhdCBpcyBjYWxsZWQgb25jZSB0aGUgdGltZXIgaXMgZGVzdHJveWVkXG5cdFx0ICogQHJldHVyblx0dm9pZFxuXHRcdCAqL1x0XHRcblx0XHQgXG5cdFx0c3RvcDogZnVuY3Rpb24oY2FsbGJhY2spIHtcblx0XHRcdHRoaXMuZmFjdG9yeS5ydW5uaW5nID0gZmFsc2U7XG5cdFx0XHR0aGlzLl9jbGVhckludGVydmFsKGNhbGxiYWNrKTtcblx0XHRcdHRoaXMuY2FsbGJhY2sodGhpcy5jYWxsYmFja3Muc3RvcCk7XG5cdFx0XHR0aGlzLmNhbGxiYWNrKGNhbGxiYWNrKTtcblx0XHR9LFxuXHRcdFxuXHRcdC8qKlxuXHRcdCAqIENsZWFyIHRoZSB0aW1lciBpbnRlcnZhbFxuXHRcdCAqXG5cdFx0ICogQHJldHVyblx0dm9pZFxuXHRcdCAqL1x0XHRcblx0XHQgXG5cdFx0X2NsZWFySW50ZXJ2YWw6IGZ1bmN0aW9uKCkge1xuXHRcdFx0Y2xlYXJJbnRlcnZhbCh0aGlzLnRpbWVyKTtcblx0XHR9LFxuXHRcdFxuXHRcdC8qKlxuXHRcdCAqIENyZWF0ZSB0aGUgdGltZXIgb2JqZWN0XG5cdFx0ICpcblx0XHQgKiBAcGFyYW0gXHRjYWxsYmFjayAgQSBmdW5jdGlvbiB0aGF0IGlzIGNhbGxlZCBvbmNlIHRoZSB0aW1lciBpcyBjcmVhdGVkXG5cdFx0ICogQHJldHVyblx0dm9pZFxuXHRcdCAqL1x0XHRcblx0XHQgXG5cdFx0X2NyZWF0ZVRpbWVyOiBmdW5jdGlvbihjYWxsYmFjaykge1xuXHRcdFx0dGhpcy5fc2V0SW50ZXJ2YWwoY2FsbGJhY2spO1x0XHRcblx0XHR9LFxuXHRcdFxuXHRcdC8qKlxuXHRcdCAqIERlc3Ryb3kgdGhlIHRpbWVyIG9iamVjdFxuXHRcdCAqXG5cdFx0ICogQHBhcmFtIFx0Y2FsbGJhY2sgIEEgZnVuY3Rpb24gdGhhdCBpcyBjYWxsZWQgb25jZSB0aGUgdGltZXIgaXMgZGVzdHJveWVkXG5cdFx0ICogQHJldHVyblx0dm9pZFxuXHRcdCAqL1x0XHRcblx0XHQgXHRcblx0XHRfZGVzdHJveVRpbWVyOiBmdW5jdGlvbihjYWxsYmFjaykge1xuXHRcdFx0dGhpcy5fY2xlYXJJbnRlcnZhbCgpO1x0XHRcdFxuXHRcdFx0dGhpcy50aW1lciA9IGZhbHNlO1xuXHRcdFx0dGhpcy5jYWxsYmFjayhjYWxsYmFjayk7XG5cdFx0XHR0aGlzLmNhbGxiYWNrKHRoaXMuY2FsbGJhY2tzLmRlc3Ryb3kpO1xuXHRcdH0sXG5cdFx0XG5cdFx0LyoqXG5cdFx0ICogVGhpcyBtZXRob2QgaXMgY2FsbGVkIGVhY2ggdGltZSB0aGUgdGltZXIgaW50ZXJ2YWwgaXMgcmFuXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0gXHRjYWxsYmFjayAgQSBmdW5jdGlvbiB0aGF0IGlzIGNhbGxlZCBvbmNlIHRoZSB0aW1lciBpcyBkZXN0cm95ZWRcblx0XHQgKiBAcmV0dXJuXHR2b2lkXG5cdFx0ICovXHRcdFxuXHRcdCBcblx0XHRfaW50ZXJ2YWw6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG5cdFx0XHR0aGlzLmNhbGxiYWNrKHRoaXMuY2FsbGJhY2tzLmludGVydmFsKTtcblx0XHRcdHRoaXMuY2FsbGJhY2soY2FsbGJhY2spO1xuXHRcdFx0dGhpcy5jb3VudCsrO1xuXHRcdH0sXG5cdFx0XG5cdFx0LyoqXG5cdFx0ICogVGhpcyBzZXRzIHRoZSB0aW1lciBpbnRlcnZhbFxuXHRcdCAqXG5cdFx0ICogQHBhcmFtIFx0Y2FsbGJhY2sgIEEgZnVuY3Rpb24gdGhhdCBpcyBjYWxsZWQgb25jZSB0aGUgdGltZXIgaXMgZGVzdHJveWVkXG5cdFx0ICogQHJldHVyblx0dm9pZFxuXHRcdCAqL1x0XHRcblx0XHQgXG5cdFx0X3NldEludGVydmFsOiBmdW5jdGlvbihjYWxsYmFjaykge1xuXHRcdFx0dmFyIHQgPSB0aGlzO1xuXHRcblx0XHRcdHQuX2ludGVydmFsKGNhbGxiYWNrKTtcblxuXHRcdFx0dC50aW1lciA9IHNldEludGVydmFsKGZ1bmN0aW9uKCkge1x0XHRcblx0XHRcdFx0dC5faW50ZXJ2YWwoY2FsbGJhY2spO1xuXHRcdFx0fSwgdGhpcy5pbnRlcnZhbCk7XG5cdFx0fVxuXHRcdFx0XG5cdH0pO1xuXHRcbn0oalF1ZXJ5KSk7XG5cbihmdW5jdGlvbigkKSB7XG5cdFxuXHQvKipcblx0ICogVHdlbnR5LUZvdXIgSG91ciBDbG9jayBGYWNlXG5cdCAqXG5cdCAqIFRoaXMgY2xhc3Mgd2lsbCBnZW5lcmF0ZSBhIHR3ZW50eS1mb3VyIG91ciBjbG9jayBmb3IgRmxpcENsb2NrLmpzXG5cdCAqXG5cdCAqIEBwYXJhbSAgb2JqZWN0ICBUaGUgcGFyZW50IEZsaXBDbG9jay5GYWN0b3J5IG9iamVjdFxuXHQgKiBAcGFyYW0gIG9iamVjdCAgQW4gb2JqZWN0IG9mIHByb3BlcnRpZXMgdG8gb3ZlcnJpZGUgdGhlIGRlZmF1bHRcdFxuXHQgKi9cblx0IFxuXHRGbGlwQ2xvY2suVHdlbnR5Rm91ckhvdXJDbG9ja0ZhY2UgPSBGbGlwQ2xvY2suRmFjZS5leHRlbmQoe1xuXG5cdFx0LyoqXG5cdFx0ICogQ29uc3RydWN0b3Jcblx0XHQgKlxuXHRcdCAqIEBwYXJhbSAgb2JqZWN0ICBUaGUgcGFyZW50IEZsaXBDbG9jay5GYWN0b3J5IG9iamVjdFxuXHRcdCAqIEBwYXJhbSAgb2JqZWN0ICBBbiBvYmplY3Qgb2YgcHJvcGVydGllcyB0byBvdmVycmlkZSB0aGUgZGVmYXVsdFx0XG5cdFx0ICovXG5cdFx0IFxuXHRcdGNvbnN0cnVjdG9yOiBmdW5jdGlvbihmYWN0b3J5LCBvcHRpb25zKSB7XG5cdFx0XHR0aGlzLmJhc2UoZmFjdG9yeSwgb3B0aW9ucyk7XG5cdFx0fSxcblxuXHRcdC8qKlxuXHRcdCAqIEJ1aWxkIHRoZSBjbG9jayBmYWNlXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0gIG9iamVjdCAgUGFzcyB0aGUgdGltZSB0aGF0IHNob3VsZCBiZSB1c2VkIHRvIGRpc3BsYXkgb24gdGhlIGNsb2NrLlx0XG5cdFx0ICovXG5cdFx0IFxuXHRcdGJ1aWxkOiBmdW5jdGlvbih0aW1lKSB7XG5cdFx0XHR2YXIgdCAgICAgICAgPSB0aGlzO1xuXHRcdFx0dmFyIGNoaWxkcmVuID0gdGhpcy5mYWN0b3J5LiRlbC5maW5kKCd1bCcpO1xuXG5cdFx0XHRpZighdGhpcy5mYWN0b3J5LnRpbWUudGltZSkge1xuXHRcdFx0XHR0aGlzLmZhY3Rvcnkub3JpZ2luYWwgPSBuZXcgRGF0ZSgpO1xuXG5cdFx0XHRcdHRoaXMuZmFjdG9yeS50aW1lID0gbmV3IEZsaXBDbG9jay5UaW1lKHRoaXMuZmFjdG9yeSwgdGhpcy5mYWN0b3J5Lm9yaWdpbmFsKTtcblx0XHRcdH1cblxuXHRcdFx0dmFyIHRpbWUgPSB0aW1lID8gdGltZSA6IHRoaXMuZmFjdG9yeS50aW1lLmdldE1pbGl0YXJ5VGltZShmYWxzZSwgdGhpcy5zaG93U2Vjb25kcyk7XG5cblx0XHRcdGlmKHRpbWUubGVuZ3RoID4gY2hpbGRyZW4ubGVuZ3RoKSB7XG5cdFx0XHRcdCQuZWFjaCh0aW1lLCBmdW5jdGlvbihpLCBkaWdpdCkge1xuXHRcdFx0XHRcdHQuY3JlYXRlTGlzdChkaWdpdCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdFx0XG5cdFx0XHR0aGlzLmNyZWF0ZURpdmlkZXIoKTtcblx0XHRcdHRoaXMuY3JlYXRlRGl2aWRlcigpO1xuXG5cdFx0XHQkKHRoaXMuZGl2aWRlcnNbMF0pLmluc2VydEJlZm9yZSh0aGlzLmxpc3RzW3RoaXMubGlzdHMubGVuZ3RoIC0gMl0uJGVsKTtcblx0XHRcdCQodGhpcy5kaXZpZGVyc1sxXSkuaW5zZXJ0QmVmb3JlKHRoaXMubGlzdHNbdGhpcy5saXN0cy5sZW5ndGggLSA0XS4kZWwpO1xuXHRcdFx0XG5cdFx0XHR0aGlzLmJhc2UoKTtcblx0XHR9LFxuXHRcdFxuXHRcdC8qKlxuXHRcdCAqIEZsaXAgdGhlIGNsb2NrIGZhY2Vcblx0XHQgKi9cblx0XHQgXG5cdFx0ZmxpcDogZnVuY3Rpb24odGltZSwgZG9Ob3RBZGRQbGF5Q2xhc3MpIHtcblx0XHRcdHRoaXMuYXV0b0luY3JlbWVudCgpO1xuXHRcdFx0XG5cdFx0XHR0aW1lID0gdGltZSA/IHRpbWUgOiB0aGlzLmZhY3RvcnkudGltZS5nZXRNaWxpdGFyeVRpbWUoZmFsc2UsIHRoaXMuc2hvd1NlY29uZHMpO1xuXHRcdFx0XG5cdFx0XHR0aGlzLmJhc2UodGltZSwgZG9Ob3RBZGRQbGF5Q2xhc3MpO1x0XG5cdFx0fVxuXHRcdFx0XHRcblx0fSk7XG5cdFxufShqUXVlcnkpKTtcbihmdW5jdGlvbigkKSB7XG5cdFx0XG5cdC8qKlxuXHQgKiBDb3VudGVyIENsb2NrIEZhY2Vcblx0ICpcblx0ICogVGhpcyBjbGFzcyB3aWxsIGdlbmVyYXRlIGEgZ2VuZXJpY2UgZmxpcCBjb3VudGVyLiBUaGUgdGltZXIgaGFzIGJlZW5cblx0ICogZGlzYWJsZWQuIGNsb2NrLmluY3JlbWVudCgpIGFuZCBjbG9jay5kZWNyZW1lbnQoKSBoYXZlIGJlZW4gYWRkZWQuXG5cdCAqXG5cdCAqIEBwYXJhbSAgb2JqZWN0ICBUaGUgcGFyZW50IEZsaXBDbG9jay5GYWN0b3J5IG9iamVjdFxuXHQgKiBAcGFyYW0gIG9iamVjdCAgQW4gb2JqZWN0IG9mIHByb3BlcnRpZXMgdG8gb3ZlcnJpZGUgdGhlIGRlZmF1bHRcdFxuXHQgKi9cblx0IFxuXHRGbGlwQ2xvY2suQ291bnRlckZhY2UgPSBGbGlwQ2xvY2suRmFjZS5leHRlbmQoe1xuXHRcdFxuXHRcdC8qKlxuXHRcdCAqIFRlbGxzIHRoZSBjb3VudGVyIGNsb2NrIGZhY2UgaWYgaXQgc2hvdWxkIGF1dG8taW5jcmVtZW50XG5cdFx0ICovXG5cblx0XHRzaG91bGRBdXRvSW5jcmVtZW50OiBmYWxzZSxcblxuXHRcdC8qKlxuXHRcdCAqIENvbnN0cnVjdG9yXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0gIG9iamVjdCAgVGhlIHBhcmVudCBGbGlwQ2xvY2suRmFjdG9yeSBvYmplY3Rcblx0XHQgKiBAcGFyYW0gIG9iamVjdCAgQW4gb2JqZWN0IG9mIHByb3BlcnRpZXMgdG8gb3ZlcnJpZGUgdGhlIGRlZmF1bHRcdFxuXHRcdCAqL1xuXHRcdCBcblx0XHRjb25zdHJ1Y3RvcjogZnVuY3Rpb24oZmFjdG9yeSwgb3B0aW9ucykge1xuXG5cdFx0XHRpZih0eXBlb2Ygb3B0aW9ucyAhPSBcIm9iamVjdFwiKSB7XG5cdFx0XHRcdG9wdGlvbnMgPSB7fTtcblx0XHRcdH1cblxuXHRcdFx0ZmFjdG9yeS5hdXRvU3RhcnQgPSBvcHRpb25zLmF1dG9TdGFydCA/IHRydWUgOiBmYWxzZTtcblxuXHRcdFx0aWYob3B0aW9ucy5hdXRvU3RhcnQpIHtcblx0XHRcdFx0dGhpcy5zaG91bGRBdXRvSW5jcmVtZW50ID0gdHJ1ZTtcblx0XHRcdH1cblxuXHRcdFx0ZmFjdG9yeS5pbmNyZW1lbnQgPSBmdW5jdGlvbigpIHtcblx0XHRcdFx0ZmFjdG9yeS5jb3VudGRvd24gPSBmYWxzZTtcblx0XHRcdFx0ZmFjdG9yeS5zZXRUaW1lKGZhY3RvcnkuZ2V0VGltZSgpLmdldFRpbWVTZWNvbmRzKCkgKyAxKTtcblx0XHRcdH07XG5cblx0XHRcdGZhY3RvcnkuZGVjcmVtZW50ID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGZhY3RvcnkuY291bnRkb3duID0gdHJ1ZTtcblx0XHRcdFx0dmFyIHRpbWUgPSBmYWN0b3J5LmdldFRpbWUoKS5nZXRUaW1lU2Vjb25kcygpO1xuXHRcdFx0XHRpZih0aW1lID4gMCkge1xuXHRcdFx0XHRcdGZhY3Rvcnkuc2V0VGltZSh0aW1lIC0gMSk7XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cblx0XHRcdGZhY3Rvcnkuc2V0VmFsdWUgPSBmdW5jdGlvbihkaWdpdHMpIHtcblx0XHRcdFx0ZmFjdG9yeS5zZXRUaW1lKGRpZ2l0cyk7XG5cdFx0XHR9O1xuXG5cdFx0XHRmYWN0b3J5LnNldENvdW50ZXIgPSBmdW5jdGlvbihkaWdpdHMpIHtcblx0XHRcdFx0ZmFjdG9yeS5zZXRUaW1lKGRpZ2l0cyk7XG5cdFx0XHR9O1xuXG5cdFx0XHR0aGlzLmJhc2UoZmFjdG9yeSwgb3B0aW9ucyk7XG5cdFx0fSxcblxuXHRcdC8qKlxuXHRcdCAqIEJ1aWxkIHRoZSBjbG9jayBmYWNlXHRcblx0XHQgKi9cblx0XHQgXG5cdFx0YnVpbGQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIHQgICAgICAgID0gdGhpcztcblx0XHRcdHZhciBjaGlsZHJlbiA9IHRoaXMuZmFjdG9yeS4kZWwuZmluZCgndWwnKTtcblx0XHRcdHZhciB0aW1lIFx0ID0gdGhpcy5mYWN0b3J5LmdldFRpbWUoKS5kaWdpdGl6ZShbdGhpcy5mYWN0b3J5LmdldFRpbWUoKS50aW1lXSk7XG5cblx0XHRcdGlmKHRpbWUubGVuZ3RoID4gY2hpbGRyZW4ubGVuZ3RoKSB7XG5cdFx0XHRcdCQuZWFjaCh0aW1lLCBmdW5jdGlvbihpLCBkaWdpdCkge1xuXHRcdFx0XHRcdHZhciBsaXN0ID0gdC5jcmVhdGVMaXN0KGRpZ2l0KTtcblxuXHRcdFx0XHRcdGxpc3Quc2VsZWN0KGRpZ2l0KTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcblx0XHRcdH1cblxuXHRcdFx0JC5lYWNoKHRoaXMubGlzdHMsIGZ1bmN0aW9uKGksIGxpc3QpIHtcblx0XHRcdFx0bGlzdC5wbGF5KCk7XG5cdFx0XHR9KTtcblxuXHRcdFx0dGhpcy5iYXNlKCk7XG5cdFx0fSxcblx0XHRcblx0XHQvKipcblx0XHQgKiBGbGlwIHRoZSBjbG9jayBmYWNlXG5cdFx0ICovXG5cdFx0IFxuXHRcdGZsaXA6IGZ1bmN0aW9uKHRpbWUsIGRvTm90QWRkUGxheUNsYXNzKSB7XHRcdFx0XG5cdFx0XHRpZih0aGlzLnNob3VsZEF1dG9JbmNyZW1lbnQpIHtcblx0XHRcdFx0dGhpcy5hdXRvSW5jcmVtZW50KCk7XG5cdFx0XHR9XG5cblx0XHRcdGlmKCF0aW1lKSB7XHRcdFxuXHRcdFx0XHR0aW1lID0gdGhpcy5mYWN0b3J5LmdldFRpbWUoKS5kaWdpdGl6ZShbdGhpcy5mYWN0b3J5LmdldFRpbWUoKS50aW1lXSk7XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMuYmFzZSh0aW1lLCBkb05vdEFkZFBsYXlDbGFzcyk7XG5cdFx0fSxcblxuXHRcdC8qKlxuXHRcdCAqIFJlc2V0IHRoZSBjbG9jayBmYWNlXG5cdFx0ICovXG5cblx0XHRyZXNldDogZnVuY3Rpb24oKSB7XG5cdFx0XHR0aGlzLmZhY3RvcnkudGltZSA9IG5ldyBGbGlwQ2xvY2suVGltZShcblx0XHRcdFx0dGhpcy5mYWN0b3J5LCBcblx0XHRcdFx0dGhpcy5mYWN0b3J5Lm9yaWdpbmFsID8gTWF0aC5yb3VuZCh0aGlzLmZhY3Rvcnkub3JpZ2luYWwpIDogMFxuXHRcdFx0KTtcblxuXHRcdFx0dGhpcy5mbGlwKCk7XG5cdFx0fVxuXHR9KTtcblx0XG59KGpRdWVyeSkpO1xuKGZ1bmN0aW9uKCQpIHtcblxuXHQvKipcblx0ICogRGFpbHkgQ291bnRlciBDbG9jayBGYWNlXG5cdCAqXG5cdCAqIFRoaXMgY2xhc3Mgd2lsbCBnZW5lcmF0ZSBhIGRhaWx5IGNvdW50ZXIgZm9yIEZsaXBDbG9jay5qcy4gQVxuXHQgKiBkYWlseSBjb3VudGVyIHdpbGwgdHJhY2sgZGF5cywgaG91cnMsIG1pbnV0ZXMsIGFuZCBzZWNvbmRzLiBJZlxuXHQgKiB0aGUgbnVtYmVyIG9mIGF2YWlsYWJsZSBkaWdpdHMgaXMgZXhjZWVkZWQgaW4gdGhlIGNvdW50LCBhIG5ld1xuXHQgKiBkaWdpdCB3aWxsIGJlIGNyZWF0ZWQuXG5cdCAqXG5cdCAqIEBwYXJhbSAgb2JqZWN0ICBUaGUgcGFyZW50IEZsaXBDbG9jay5GYWN0b3J5IG9iamVjdFxuXHQgKiBAcGFyYW0gIG9iamVjdCAgQW4gb2JqZWN0IG9mIHByb3BlcnRpZXMgdG8gb3ZlcnJpZGUgdGhlIGRlZmF1bHRcblx0ICovXG5cblx0RmxpcENsb2NrLkRhaWx5Q291bnRlckZhY2UgPSBGbGlwQ2xvY2suRmFjZS5leHRlbmQoe1xuXG5cdFx0c2hvd1NlY29uZHM6IHRydWUsXG5cblx0XHQvKipcblx0XHQgKiBDb25zdHJ1Y3RvclxuXHRcdCAqXG5cdFx0ICogQHBhcmFtICBvYmplY3QgIFRoZSBwYXJlbnQgRmxpcENsb2NrLkZhY3Rvcnkgb2JqZWN0XG5cdFx0ICogQHBhcmFtICBvYmplY3QgIEFuIG9iamVjdCBvZiBwcm9wZXJ0aWVzIHRvIG92ZXJyaWRlIHRoZSBkZWZhdWx0XG5cdFx0ICovXG5cblx0XHRjb25zdHJ1Y3RvcjogZnVuY3Rpb24oZmFjdG9yeSwgb3B0aW9ucykge1xuXHRcdFx0dGhpcy5iYXNlKGZhY3RvcnksIG9wdGlvbnMpO1xuXHRcdH0sXG5cblx0XHQvKipcblx0XHQgKiBCdWlsZCB0aGUgY2xvY2sgZmFjZVxuXHRcdCAqL1xuXG5cdFx0YnVpbGQ6IGZ1bmN0aW9uKHRpbWUpIHtcblx0XHRcdHZhciB0ID0gdGhpcztcblx0XHRcdHZhciBjaGlsZHJlbiA9IHRoaXMuZmFjdG9yeS4kZWwuZmluZCgndWwnKTtcblx0XHRcdHZhciBvZmZzZXQgPSAwO1xuXG5cdFx0XHR0aW1lID0gdGltZSA/IHRpbWUgOiB0aGlzLmZhY3RvcnkudGltZS5nZXREYXlDb3VudGVyKHRoaXMuc2hvd1NlY29uZHMpO1xuXG5cdFx0XHRpZih0aW1lLmxlbmd0aCA+IGNoaWxkcmVuLmxlbmd0aCkge1xuXHRcdFx0XHQkLmVhY2godGltZSwgZnVuY3Rpb24oaSwgZGlnaXQpIHtcblx0XHRcdFx0XHR0LmNyZWF0ZUxpc3QoZGlnaXQpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblxuXHRcdFx0aWYodGhpcy5zaG93U2Vjb25kcykge1xuXHRcdFx0XHQkKHRoaXMuY3JlYXRlRGl2aWRlcignU2Vjb25kcycpKS5pbnNlcnRCZWZvcmUodGhpcy5saXN0c1t0aGlzLmxpc3RzLmxlbmd0aCAtIDJdLiRlbCk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlXG5cdFx0XHR7XG5cdFx0XHRcdG9mZnNldCA9IDI7XG5cdFx0XHR9XG5cblx0XHRcdCQodGhpcy5jcmVhdGVEaXZpZGVyKCdNaW51dGVzJykpLmluc2VydEJlZm9yZSh0aGlzLmxpc3RzW3RoaXMubGlzdHMubGVuZ3RoIC0gNCArIG9mZnNldF0uJGVsKTtcblx0XHRcdCQodGhpcy5jcmVhdGVEaXZpZGVyKCdIb3VycycpKS5pbnNlcnRCZWZvcmUodGhpcy5saXN0c1t0aGlzLmxpc3RzLmxlbmd0aCAtIDYgKyBvZmZzZXRdLiRlbCk7XG5cdFx0XHQkKHRoaXMuY3JlYXRlRGl2aWRlcignRGF5cycsIHRydWUpKS5pbnNlcnRCZWZvcmUodGhpcy5saXN0c1swXS4kZWwpO1xuXG5cdFx0XHR0aGlzLmJhc2UoKTtcblx0XHR9LFxuXG5cdFx0LyoqXG5cdFx0ICogRmxpcCB0aGUgY2xvY2sgZmFjZVxuXHRcdCAqL1xuXG5cdFx0ZmxpcDogZnVuY3Rpb24odGltZSwgZG9Ob3RBZGRQbGF5Q2xhc3MpIHtcblx0XHRcdGlmKCF0aW1lKSB7XG5cdFx0XHRcdHRpbWUgPSB0aGlzLmZhY3RvcnkudGltZS5nZXREYXlDb3VudGVyKHRoaXMuc2hvd1NlY29uZHMpO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLmF1dG9JbmNyZW1lbnQoKTtcblxuXHRcdFx0dGhpcy5iYXNlKHRpbWUsIGRvTm90QWRkUGxheUNsYXNzKTtcblx0XHR9XG5cblx0fSk7XG5cbn0oalF1ZXJ5KSk7XG4oZnVuY3Rpb24oJCkge1xuXHRcdFx0XG5cdC8qKlxuXHQgKiBIb3VybHkgQ291bnRlciBDbG9jayBGYWNlXG5cdCAqXG5cdCAqIFRoaXMgY2xhc3Mgd2lsbCBnZW5lcmF0ZSBhbiBob3VybHkgY291bnRlciBmb3IgRmxpcENsb2NrLmpzLiBBblxuXHQgKiBob3VyIGNvdW50ZXIgd2lsbCB0cmFjayBob3VycywgbWludXRlcywgYW5kIHNlY29uZHMuIElmIG51bWJlciBvZlxuXHQgKiBhdmFpbGFibGUgZGlnaXRzIGlzIGV4Y2VlZGVkIGluIHRoZSBjb3VudCwgYSBuZXcgZGlnaXQgd2lsbCBiZSBcblx0ICogY3JlYXRlZC5cblx0ICpcblx0ICogQHBhcmFtICBvYmplY3QgIFRoZSBwYXJlbnQgRmxpcENsb2NrLkZhY3Rvcnkgb2JqZWN0XG5cdCAqIEBwYXJhbSAgb2JqZWN0ICBBbiBvYmplY3Qgb2YgcHJvcGVydGllcyB0byBvdmVycmlkZSB0aGUgZGVmYXVsdFx0XG5cdCAqL1xuXHQgXG5cdEZsaXBDbG9jay5Ib3VybHlDb3VudGVyRmFjZSA9IEZsaXBDbG9jay5GYWNlLmV4dGVuZCh7XG5cdFx0XHRcblx0XHQvLyBjbGVhckV4Y2Vzc0RpZ2l0czogdHJ1ZSxcblxuXHRcdC8qKlxuXHRcdCAqIENvbnN0cnVjdG9yXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0gIG9iamVjdCAgVGhlIHBhcmVudCBGbGlwQ2xvY2suRmFjdG9yeSBvYmplY3Rcblx0XHQgKiBAcGFyYW0gIG9iamVjdCAgQW4gb2JqZWN0IG9mIHByb3BlcnRpZXMgdG8gb3ZlcnJpZGUgdGhlIGRlZmF1bHRcdFxuXHRcdCAqL1xuXHRcdCBcblx0XHRjb25zdHJ1Y3RvcjogZnVuY3Rpb24oZmFjdG9yeSwgb3B0aW9ucykge1xuXHRcdFx0dGhpcy5iYXNlKGZhY3RvcnksIG9wdGlvbnMpO1xuXHRcdH0sXG5cdFx0XG5cdFx0LyoqXG5cdFx0ICogQnVpbGQgdGhlIGNsb2NrIGZhY2Vcblx0XHQgKi9cblx0XHRcblx0XHRidWlsZDogZnVuY3Rpb24oZXhjbHVkZUhvdXJzLCB0aW1lKSB7XG5cdFx0XHR2YXIgdCA9IHRoaXM7XG5cdFx0XHR2YXIgY2hpbGRyZW4gPSB0aGlzLmZhY3RvcnkuJGVsLmZpbmQoJ3VsJyk7XG5cdFx0XHRcblx0XHRcdHRpbWUgPSB0aW1lID8gdGltZSA6IHRoaXMuZmFjdG9yeS50aW1lLmdldEhvdXJDb3VudGVyKCk7XG5cdFx0XHRcblx0XHRcdGlmKHRpbWUubGVuZ3RoID4gY2hpbGRyZW4ubGVuZ3RoKSB7XG5cdFx0XHRcdCQuZWFjaCh0aW1lLCBmdW5jdGlvbihpLCBkaWdpdCkge1xuXHRcdFx0XHRcdHQuY3JlYXRlTGlzdChkaWdpdCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdFx0XG5cdFx0XHQkKHRoaXMuY3JlYXRlRGl2aWRlcignU2Vjb25kcycpKS5pbnNlcnRCZWZvcmUodGhpcy5saXN0c1t0aGlzLmxpc3RzLmxlbmd0aCAtIDJdLiRlbCk7XG5cdFx0XHQkKHRoaXMuY3JlYXRlRGl2aWRlcignTWludXRlcycpKS5pbnNlcnRCZWZvcmUodGhpcy5saXN0c1t0aGlzLmxpc3RzLmxlbmd0aCAtIDRdLiRlbCk7XG5cdFx0XHRcblx0XHRcdGlmKCFleGNsdWRlSG91cnMpIHtcblx0XHRcdFx0JCh0aGlzLmNyZWF0ZURpdmlkZXIoJ0hvdXJzJywgdHJ1ZSkpLmluc2VydEJlZm9yZSh0aGlzLmxpc3RzWzBdLiRlbCk7XG5cdFx0XHR9XG5cdFx0XHRcblx0XHRcdHRoaXMuYmFzZSgpO1xuXHRcdH0sXG5cdFx0XG5cdFx0LyoqXG5cdFx0ICogRmxpcCB0aGUgY2xvY2sgZmFjZVxuXHRcdCAqL1xuXHRcdCBcblx0XHRmbGlwOiBmdW5jdGlvbih0aW1lLCBkb05vdEFkZFBsYXlDbGFzcykge1xuXHRcdFx0aWYoIXRpbWUpIHtcblx0XHRcdFx0dGltZSA9IHRoaXMuZmFjdG9yeS50aW1lLmdldEhvdXJDb3VudGVyKCk7XG5cdFx0XHR9XHRcblxuXHRcdFx0dGhpcy5hdXRvSW5jcmVtZW50KCk7XG5cdFx0XG5cdFx0XHR0aGlzLmJhc2UodGltZSwgZG9Ob3RBZGRQbGF5Q2xhc3MpO1xuXHRcdH0sXG5cblx0XHQvKipcblx0XHQgKiBBcHBlbmQgYSBuZXdseSBjcmVhdGVkIGxpc3QgdG8gdGhlIGNsb2NrXG5cdFx0ICovXG5cblx0XHRhcHBlbmREaWdpdFRvQ2xvY2s6IGZ1bmN0aW9uKG9iaikge1xuXHRcdFx0dGhpcy5iYXNlKG9iaik7XG5cblx0XHRcdHRoaXMuZGl2aWRlcnNbMF0uaW5zZXJ0QWZ0ZXIodGhpcy5kaXZpZGVyc1swXS5uZXh0KCkpO1xuXHRcdH1cblx0XHRcblx0fSk7XG5cdFxufShqUXVlcnkpKTtcbihmdW5jdGlvbigkKSB7XG5cdFx0XG5cdC8qKlxuXHQgKiBNaW51dGUgQ291bnRlciBDbG9jayBGYWNlXG5cdCAqXG5cdCAqIFRoaXMgY2xhc3Mgd2lsbCBnZW5lcmF0ZSBhIG1pbnV0ZSBjb3VudGVyIGZvciBGbGlwQ2xvY2suanMuIEFcblx0ICogbWludXRlIGNvdW50ZXIgd2lsbCB0cmFjayBtaW51dGVzIGFuZCBzZWNvbmRzLiBJZiBhbiBob3VyIGlzIFxuXHQgKiByZWFjaGVkLCB0aGUgY291bnRlciB3aWxsIHJlc2V0IGJhY2sgdG8gMC4gKDQgZGlnaXRzIG1heClcblx0ICpcblx0ICogQHBhcmFtICBvYmplY3QgIFRoZSBwYXJlbnQgRmxpcENsb2NrLkZhY3Rvcnkgb2JqZWN0XG5cdCAqIEBwYXJhbSAgb2JqZWN0ICBBbiBvYmplY3Qgb2YgcHJvcGVydGllcyB0byBvdmVycmlkZSB0aGUgZGVmYXVsdFx0XG5cdCAqL1xuXHQgXG5cdEZsaXBDbG9jay5NaW51dGVDb3VudGVyRmFjZSA9IEZsaXBDbG9jay5Ib3VybHlDb3VudGVyRmFjZS5leHRlbmQoe1xuXG5cdFx0Y2xlYXJFeGNlc3NEaWdpdHM6IGZhbHNlLFxuXG5cdFx0LyoqXG5cdFx0ICogQ29uc3RydWN0b3Jcblx0XHQgKlxuXHRcdCAqIEBwYXJhbSAgb2JqZWN0ICBUaGUgcGFyZW50IEZsaXBDbG9jay5GYWN0b3J5IG9iamVjdFxuXHRcdCAqIEBwYXJhbSAgb2JqZWN0ICBBbiBvYmplY3Qgb2YgcHJvcGVydGllcyB0byBvdmVycmlkZSB0aGUgZGVmYXVsdFx0XG5cdFx0ICovXG5cdFx0IFxuXHRcdGNvbnN0cnVjdG9yOiBmdW5jdGlvbihmYWN0b3J5LCBvcHRpb25zKSB7XG5cdFx0XHR0aGlzLmJhc2UoZmFjdG9yeSwgb3B0aW9ucyk7XG5cdFx0fSxcblx0XHRcblx0XHQvKipcblx0XHQgKiBCdWlsZCB0aGUgY2xvY2sgZmFjZVx0XG5cdFx0ICovXG5cdFx0IFxuXHRcdGJ1aWxkOiBmdW5jdGlvbigpIHtcblx0XHRcdHRoaXMuYmFzZSh0cnVlLCB0aGlzLmZhY3RvcnkudGltZS5nZXRNaW51dGVDb3VudGVyKCkpO1xuXHRcdH0sXG5cdFx0XG5cdFx0LyoqXG5cdFx0ICogRmxpcCB0aGUgY2xvY2sgZmFjZVxuXHRcdCAqL1xuXHRcdCBcblx0XHRmbGlwOiBmdW5jdGlvbih0aW1lLCBkb05vdEFkZFBsYXlDbGFzcykge1xuXHRcdFx0aWYoIXRpbWUpIHtcblx0XHRcdFx0dGltZSA9IHRoaXMuZmFjdG9yeS50aW1lLmdldE1pbnV0ZUNvdW50ZXIoKTtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy5iYXNlKHRpbWUsIGRvTm90QWRkUGxheUNsYXNzKTtcblx0XHR9XG5cblx0fSk7XG5cdFxufShqUXVlcnkpKTtcbihmdW5jdGlvbigkKSB7XG5cdFx0XG5cdC8qKlxuXHQgKiBUd2VsdmUgSG91ciBDbG9jayBGYWNlXG5cdCAqXG5cdCAqIFRoaXMgY2xhc3Mgd2lsbCBnZW5lcmF0ZSBhIHR3ZWx2ZSBob3VyIGNsb2NrIGZvciBGbGlwQ2xvY2suanNcblx0ICpcblx0ICogQHBhcmFtICBvYmplY3QgIFRoZSBwYXJlbnQgRmxpcENsb2NrLkZhY3Rvcnkgb2JqZWN0XG5cdCAqIEBwYXJhbSAgb2JqZWN0ICBBbiBvYmplY3Qgb2YgcHJvcGVydGllcyB0byBvdmVycmlkZSB0aGUgZGVmYXVsdFx0XG5cdCAqL1xuXHQgXG5cdEZsaXBDbG9jay5Ud2VsdmVIb3VyQ2xvY2tGYWNlID0gRmxpcENsb2NrLlR3ZW50eUZvdXJIb3VyQ2xvY2tGYWNlLmV4dGVuZCh7XG5cdFx0XG5cdFx0LyoqXG5cdFx0ICogVGhlIG1lcmlkaXVtIGpRdWVyeSBET00gb2JqZWN0XG5cdFx0ICovXG5cdFx0IFxuXHRcdG1lcmlkaXVtOiBmYWxzZSxcblx0XHRcblx0XHQvKipcblx0XHQgKiBUaGUgbWVyaWRpdW0gdGV4dCBhcyBzdHJpbmcgZm9yIGVhc3kgYWNjZXNzXG5cdFx0ICovXG5cdFx0IFxuXHRcdG1lcmlkaXVtVGV4dDogJ0FNJyxcblx0XHRcdFx0XHRcblx0XHQvKipcblx0XHQgKiBCdWlsZCB0aGUgY2xvY2sgZmFjZVxuXHRcdCAqXG5cdFx0ICogQHBhcmFtICBvYmplY3QgIFBhc3MgdGhlIHRpbWUgdGhhdCBzaG91bGQgYmUgdXNlZCB0byBkaXNwbGF5IG9uIHRoZSBjbG9jay5cdFxuXHRcdCAqL1xuXHRcdCBcblx0XHRidWlsZDogZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgdCA9IHRoaXM7XG5cblx0XHRcdHZhciB0aW1lID0gdGhpcy5mYWN0b3J5LnRpbWUuZ2V0VGltZShmYWxzZSwgdGhpcy5zaG93U2Vjb25kcyk7XG5cblx0XHRcdHRoaXMuYmFzZSh0aW1lKTtcdFx0XHRcblx0XHRcdHRoaXMubWVyaWRpdW1UZXh0ID0gdGhpcy5nZXRNZXJpZGl1bSgpO1x0XHRcdFxuXHRcdFx0dGhpcy5tZXJpZGl1bSA9ICQoW1xuXHRcdFx0XHQnPHVsIGNsYXNzPVwiZmxpcC1jbG9jay1tZXJpZGl1bVwiPicsXG5cdFx0XHRcdFx0JzxsaT4nLFxuXHRcdFx0XHRcdFx0JzxhIGhyZWY9XCIjXCI+Jyt0aGlzLm1lcmlkaXVtVGV4dCsnPC9hPicsXG5cdFx0XHRcdFx0JzwvbGk+Jyxcblx0XHRcdFx0JzwvdWw+J1xuXHRcdFx0XS5qb2luKCcnKSk7XG5cdFx0XHRcdFx0XHRcblx0XHRcdHRoaXMubWVyaWRpdW0uaW5zZXJ0QWZ0ZXIodGhpcy5saXN0c1t0aGlzLmxpc3RzLmxlbmd0aC0xXS4kZWwpO1xuXHRcdH0sXG5cdFx0XG5cdFx0LyoqXG5cdFx0ICogRmxpcCB0aGUgY2xvY2sgZmFjZVxuXHRcdCAqL1xuXHRcdCBcblx0XHRmbGlwOiBmdW5jdGlvbih0aW1lLCBkb05vdEFkZFBsYXlDbGFzcykge1x0XHRcdFxuXHRcdFx0aWYodGhpcy5tZXJpZGl1bVRleHQgIT0gdGhpcy5nZXRNZXJpZGl1bSgpKSB7XG5cdFx0XHRcdHRoaXMubWVyaWRpdW1UZXh0ID0gdGhpcy5nZXRNZXJpZGl1bSgpO1xuXHRcdFx0XHR0aGlzLm1lcmlkaXVtLmZpbmQoJ2EnKS5odG1sKHRoaXMubWVyaWRpdW1UZXh0KTtcdFxuXHRcdFx0fVxuXHRcdFx0dGhpcy5iYXNlKHRoaXMuZmFjdG9yeS50aW1lLmdldFRpbWUoZmFsc2UsIHRoaXMuc2hvd1NlY29uZHMpLCBkb05vdEFkZFBsYXlDbGFzcyk7XHRcblx0XHR9LFxuXHRcdFxuXHRcdC8qKlxuXHRcdCAqIEdldCB0aGUgY3VycmVudCBtZXJpZGl1bVxuXHRcdCAqXG5cdFx0ICogQHJldHVybiAgc3RyaW5nICBSZXR1cm5zIHRoZSBtZXJpZGl1bSAoQU18UE0pXG5cdFx0ICovXG5cdFx0IFxuXHRcdGdldE1lcmlkaXVtOiBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiBuZXcgRGF0ZSgpLmdldEhvdXJzKCkgPj0gMTIgPyAnUE0nIDogJ0FNJztcblx0XHR9LFxuXHRcdFxuXHRcdC8qKlxuXHRcdCAqIElzIGl0IGN1cnJlbnRseSBpbiB0aGUgcG9zdC1tZWRpcml1bT9cblx0XHQgKlxuXHRcdCAqIEByZXR1cm4gIGJvb2wgIFJldHVybnMgdHJ1ZSBvciBmYWxzZVxuXHRcdCAqL1xuXHRcdCBcblx0XHRpc1BNOiBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiB0aGlzLmdldE1lcmlkaXVtKCkgPT0gJ1BNJyA/IHRydWUgOiBmYWxzZTtcblx0XHR9LFxuXG5cdFx0LyoqXG5cdFx0ICogSXMgaXQgY3VycmVudGx5IGJlZm9yZSB0aGUgcG9zdC1tZWRpcml1bT9cblx0XHQgKlxuXHRcdCAqIEByZXR1cm4gIGJvb2wgIFJldHVybnMgdHJ1ZSBvciBmYWxzZVxuXHRcdCAqL1xuXHRcdCBcblx0XHRpc0FNOiBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiB0aGlzLmdldE1lcmlkaXVtKCkgPT0gJ0FNJyA/IHRydWUgOiBmYWxzZTtcblx0XHR9XG5cdFx0XHRcdFxuXHR9KTtcblx0XG59KGpRdWVyeSkpO1xuKGZ1bmN0aW9uKCQpIHtcblxuICAgIC8qKlxuICAgICAqIEZsaXBDbG9jayBBcmFiaWMgTGFuZ3VhZ2UgUGFja1xuICAgICAqXG4gICAgICogVGhpcyBjbGFzcyB3aWxsIGJlIHVzZWQgdG8gdHJhbnNsYXRlIHRva2VucyBpbnRvIHRoZSBBcmFiaWMgbGFuZ3VhZ2UuXG4gICAgICpcbiAgICAgKi9cblxuICAgIEZsaXBDbG9jay5MYW5nLkFyYWJpYyA9IHtcblxuICAgICAgJ3llYXJzJyAgIDogJ9iz2YbZiNin2KonLFxuICAgICAgJ21vbnRocycgIDogJ9i02YfZiNixJyxcbiAgICAgICdkYXlzJyAgICA6ICfYo9mK2KfZhScsXG4gICAgICAnaG91cnMnICAgOiAn2LPYp9i52KfYqicsXG4gICAgICAnbWludXRlcycgOiAn2K/Zgtin2KbZgicsXG4gICAgICAnc2Vjb25kcycgOiAn2KvZiNin2YbZiidcblxuICAgIH07XG5cbiAgICAvKiBDcmVhdGUgdmFyaW91cyBhbGlhc2VzIGZvciBjb252ZW5pZW5jZSAqL1xuXG4gICAgRmxpcENsb2NrLkxhbmdbJ2FyJ10gICAgICA9IEZsaXBDbG9jay5MYW5nLkFyYWJpYztcbiAgICBGbGlwQ2xvY2suTGFuZ1snYXItYXInXSAgID0gRmxpcENsb2NrLkxhbmcuQXJhYmljO1xuICAgIEZsaXBDbG9jay5MYW5nWydhcmFiaWMnXSAgPSBGbGlwQ2xvY2suTGFuZy5BcmFiaWM7XG5cbn0oalF1ZXJ5KSk7XG4oZnVuY3Rpb24oJCkge1xuXHRcdFxuXHQvKipcblx0ICogRmxpcENsb2NrIERhbmlzaCBMYW5ndWFnZSBQYWNrXG5cdCAqXG5cdCAqIFRoaXMgY2xhc3Mgd2lsbCB1c2VkIHRvIHRyYW5zbGF0ZSB0b2tlbnMgaW50byB0aGUgRGFuaXNoIGxhbmd1YWdlLlxuXHQgKlx0XG5cdCAqL1xuXHQgXG5cdEZsaXBDbG9jay5MYW5nLkRhbmlzaCA9IHtcblx0XHRcblx0XHQneWVhcnMnICAgOiAnw4VyJyxcblx0XHQnbW9udGhzJyAgOiAnTcOlbmVkZXInLFxuXHRcdCdkYXlzJyAgICA6ICdEYWdlJyxcblx0XHQnaG91cnMnICAgOiAnVGltZXInLFxuXHRcdCdtaW51dGVzJyA6ICdNaW51dHRlcicsXG5cdFx0J3NlY29uZHMnIDogJ1Nla3VuZGVyJ1x0XG5cblx0fTtcblx0XG5cdC8qIENyZWF0ZSB2YXJpb3VzIGFsaWFzZXMgZm9yIGNvbnZlbmllbmNlICovXG5cblx0RmxpcENsb2NrLkxhbmdbJ2RhJ10gICAgID0gRmxpcENsb2NrLkxhbmcuRGFuaXNoO1xuXHRGbGlwQ2xvY2suTGFuZ1snZGEtZGsnXSAgPSBGbGlwQ2xvY2suTGFuZy5EYW5pc2g7XG5cdEZsaXBDbG9jay5MYW5nWydkYW5pc2gnXSA9IEZsaXBDbG9jay5MYW5nLkRhbmlzaDtcblxufShqUXVlcnkpKTtcbihmdW5jdGlvbigkKSB7XG5cdFx0XG5cdC8qKlxuXHQgKiBGbGlwQ2xvY2sgR2VybWFuIExhbmd1YWdlIFBhY2tcblx0ICpcblx0ICogVGhpcyBjbGFzcyB3aWxsIHVzZWQgdG8gdHJhbnNsYXRlIHRva2VucyBpbnRvIHRoZSBHZXJtYW4gbGFuZ3VhZ2UuXG5cdCAqXHRcblx0ICovXG5cdCBcblx0RmxpcENsb2NrLkxhbmcuR2VybWFuID0ge1xuXHRcdFxuXHRcdCd5ZWFycycgICA6ICdKYWhyZScsXG5cdFx0J21vbnRocycgIDogJ01vbmF0ZScsXG5cdFx0J2RheXMnICAgIDogJ1RhZ2UnLFxuXHRcdCdob3VycycgICA6ICdTdHVuZGVuJyxcblx0XHQnbWludXRlcycgOiAnTWludXRlbicsXG5cdFx0J3NlY29uZHMnIDogJ1Nla3VuZGVuJ1x0XG4gXG5cdH07XG5cdFxuXHQvKiBDcmVhdGUgdmFyaW91cyBhbGlhc2VzIGZvciBjb252ZW5pZW5jZSAqL1xuIFxuXHRGbGlwQ2xvY2suTGFuZ1snZGUnXSAgICAgPSBGbGlwQ2xvY2suTGFuZy5HZXJtYW47XG5cdEZsaXBDbG9jay5MYW5nWydkZS1kZSddICA9IEZsaXBDbG9jay5MYW5nLkdlcm1hbjtcblx0RmxpcENsb2NrLkxhbmdbJ2dlcm1hbiddID0gRmxpcENsb2NrLkxhbmcuR2VybWFuO1xuIFxufShqUXVlcnkpKTtcbihmdW5jdGlvbigkKSB7XG5cdFx0XG5cdC8qKlxuXHQgKiBGbGlwQ2xvY2sgRW5nbGlzaCBMYW5ndWFnZSBQYWNrXG5cdCAqXG5cdCAqIFRoaXMgY2xhc3Mgd2lsbCB1c2VkIHRvIHRyYW5zbGF0ZSB0b2tlbnMgaW50byB0aGUgRW5nbGlzaCBsYW5ndWFnZS5cblx0ICpcdFxuXHQgKi9cblx0IFxuXHRGbGlwQ2xvY2suTGFuZy5FbmdsaXNoID0ge1xuXHRcdFxuXHRcdCd5ZWFycycgICA6ICdZZWFycycsXG5cdFx0J21vbnRocycgIDogJ01vbnRocycsXG5cdFx0J2RheXMnICAgIDogJ0RheXMnLFxuXHRcdCdob3VycycgICA6ICdIb3VycycsXG5cdFx0J21pbnV0ZXMnIDogJ01pbnV0ZXMnLFxuXHRcdCdzZWNvbmRzJyA6ICdTZWNvbmRzJ1x0XG5cblx0fTtcblx0XG5cdC8qIENyZWF0ZSB2YXJpb3VzIGFsaWFzZXMgZm9yIGNvbnZlbmllbmNlICovXG5cblx0RmxpcENsb2NrLkxhbmdbJ2VuJ10gICAgICA9IEZsaXBDbG9jay5MYW5nLkVuZ2xpc2g7XG5cdEZsaXBDbG9jay5MYW5nWydlbi11cyddICAgPSBGbGlwQ2xvY2suTGFuZy5FbmdsaXNoO1xuXHRGbGlwQ2xvY2suTGFuZ1snZW5nbGlzaCddID0gRmxpcENsb2NrLkxhbmcuRW5nbGlzaDtcblxufShqUXVlcnkpKTtcbihmdW5jdGlvbigkKSB7XG5cblx0LyoqXG5cdCAqIEZsaXBDbG9jayBTcGFuaXNoIExhbmd1YWdlIFBhY2tcblx0ICpcblx0ICogVGhpcyBjbGFzcyB3aWxsIHVzZWQgdG8gdHJhbnNsYXRlIHRva2VucyBpbnRvIHRoZSBTcGFuaXNoIGxhbmd1YWdlLlxuXHQgKlxuXHQgKi9cblxuXHRGbGlwQ2xvY2suTGFuZy5TcGFuaXNoID0ge1xuXG5cdFx0J3llYXJzJyAgIDogJ0HDsW9zJyxcblx0XHQnbW9udGhzJyAgOiAnTWVzZXMnLFxuXHRcdCdkYXlzJyAgICA6ICdEw61hcycsXG5cdFx0J2hvdXJzJyAgIDogJ0hvcmFzJyxcblx0XHQnbWludXRlcycgOiAnTWludXRvcycsXG5cdFx0J3NlY29uZHMnIDogJ1NlZ3VuZG9zJ1xuXG5cdH07XG5cblx0LyogQ3JlYXRlIHZhcmlvdXMgYWxpYXNlcyBmb3IgY29udmVuaWVuY2UgKi9cblxuXHRGbGlwQ2xvY2suTGFuZ1snZXMnXSAgICAgID0gRmxpcENsb2NrLkxhbmcuU3BhbmlzaDtcblx0RmxpcENsb2NrLkxhbmdbJ2VzLWVzJ10gICA9IEZsaXBDbG9jay5MYW5nLlNwYW5pc2g7XG5cdEZsaXBDbG9jay5MYW5nWydzcGFuaXNoJ10gPSBGbGlwQ2xvY2suTGFuZy5TcGFuaXNoO1xuXG59KGpRdWVyeSkpO1xuKGZ1bmN0aW9uKCQpIHtcblx0XHRcblx0LyoqXG5cdCAqIEZsaXBDbG9jayBGaW5uaXNoIExhbmd1YWdlIFBhY2tcblx0ICpcblx0ICogVGhpcyBjbGFzcyB3aWxsIHVzZWQgdG8gdHJhbnNsYXRlIHRva2VucyBpbnRvIHRoZSBGaW5uaXNoIGxhbmd1YWdlLlxuXHQgKlx0XG5cdCAqL1xuXHQgXG5cdEZsaXBDbG9jay5MYW5nLkZpbm5pc2ggPSB7XG5cdFx0XG5cdFx0J3llYXJzJyAgIDogJ1Z1b3R0YScsXG5cdFx0J21vbnRocycgIDogJ0t1dWthdXR0YScsXG5cdFx0J2RheXMnICAgIDogJ1DDpGl2w6TDpCcsXG5cdFx0J2hvdXJzJyAgIDogJ1R1bnRpYScsXG5cdFx0J21pbnV0ZXMnIDogJ01pbnV1dHRpYScsXG5cdFx0J3NlY29uZHMnIDogJ1Nla3VudGlhJ1x0XG5cblx0fTtcblx0XG5cdC8qIENyZWF0ZSB2YXJpb3VzIGFsaWFzZXMgZm9yIGNvbnZlbmllbmNlICovXG5cblx0RmxpcENsb2NrLkxhbmdbJ2ZpJ10gICAgICA9IEZsaXBDbG9jay5MYW5nLkZpbm5pc2g7XG5cdEZsaXBDbG9jay5MYW5nWydmaS1maSddICAgPSBGbGlwQ2xvY2suTGFuZy5GaW5uaXNoO1xuXHRGbGlwQ2xvY2suTGFuZ1snZmlubmlzaCddID0gRmxpcENsb2NrLkxhbmcuRmlubmlzaDtcblxufShqUXVlcnkpKTtcblxuKGZ1bmN0aW9uKCQpIHtcblxuICAvKipcbiAgICogRmxpcENsb2NrIENhbmFkaWFuIEZyZW5jaCBMYW5ndWFnZSBQYWNrXG4gICAqXG4gICAqIFRoaXMgY2xhc3Mgd2lsbCB1c2VkIHRvIHRyYW5zbGF0ZSB0b2tlbnMgaW50byB0aGUgQ2FuYWRpYW4gRnJlbmNoIGxhbmd1YWdlLlxuICAgKlxuICAgKi9cblxuICBGbGlwQ2xvY2suTGFuZy5GcmVuY2ggPSB7XG5cbiAgICAneWVhcnMnICAgOiAnQW5zJyxcbiAgICAnbW9udGhzJyAgOiAnTW9pcycsXG4gICAgJ2RheXMnICAgIDogJ0pvdXJzJyxcbiAgICAnaG91cnMnICAgOiAnSGV1cmVzJyxcbiAgICAnbWludXRlcycgOiAnTWludXRlcycsXG4gICAgJ3NlY29uZHMnIDogJ1NlY29uZGVzJ1xuXG4gIH07XG5cbiAgLyogQ3JlYXRlIHZhcmlvdXMgYWxpYXNlcyBmb3IgY29udmVuaWVuY2UgKi9cblxuICBGbGlwQ2xvY2suTGFuZ1snZnInXSAgICAgID0gRmxpcENsb2NrLkxhbmcuRnJlbmNoO1xuICBGbGlwQ2xvY2suTGFuZ1snZnItY2EnXSAgID0gRmxpcENsb2NrLkxhbmcuRnJlbmNoO1xuICBGbGlwQ2xvY2suTGFuZ1snZnJlbmNoJ10gID0gRmxpcENsb2NrLkxhbmcuRnJlbmNoO1xuXG59KGpRdWVyeSkpO1xuXG4oZnVuY3Rpb24oJCkge1xuXHRcdFxuXHQvKipcblx0ICogRmxpcENsb2NrIEl0YWxpYW4gTGFuZ3VhZ2UgUGFja1xuXHQgKlxuXHQgKiBUaGlzIGNsYXNzIHdpbGwgdXNlZCB0byB0cmFuc2xhdGUgdG9rZW5zIGludG8gdGhlIEl0YWxpYW4gbGFuZ3VhZ2UuXG5cdCAqXHRcblx0ICovXG5cdCBcblx0RmxpcENsb2NrLkxhbmcuSXRhbGlhbiA9IHtcblx0XHRcblx0XHQneWVhcnMnICAgOiAnQW5uaScsXG5cdFx0J21vbnRocycgIDogJ01lc2knLFxuXHRcdCdkYXlzJyAgICA6ICdHaW9ybmknLFxuXHRcdCdob3VycycgICA6ICdPcmUnLFxuXHRcdCdtaW51dGVzJyA6ICdNaW51dGknLFxuXHRcdCdzZWNvbmRzJyA6ICdTZWNvbmRpJ1x0XG5cblx0fTtcblx0XG5cdC8qIENyZWF0ZSB2YXJpb3VzIGFsaWFzZXMgZm9yIGNvbnZlbmllbmNlICovXG5cblx0RmxpcENsb2NrLkxhbmdbJ2l0J10gICAgICA9IEZsaXBDbG9jay5MYW5nLkl0YWxpYW47XG5cdEZsaXBDbG9jay5MYW5nWydpdC1pdCddICAgPSBGbGlwQ2xvY2suTGFuZy5JdGFsaWFuO1xuXHRGbGlwQ2xvY2suTGFuZ1snaXRhbGlhbiddID0gRmxpcENsb2NrLkxhbmcuSXRhbGlhbjtcblx0XG59KGpRdWVyeSkpO1xuXG4oZnVuY3Rpb24oJCkge1xuXG4gIC8qKlxuICAgKiBGbGlwQ2xvY2sgTGF0dmlhbiBMYW5ndWFnZSBQYWNrXG4gICAqXG4gICAqIFRoaXMgY2xhc3Mgd2lsbCB1c2VkIHRvIHRyYW5zbGF0ZSB0b2tlbnMgaW50byB0aGUgTGF0dmlhbiBsYW5ndWFnZS5cbiAgICpcbiAgICovXG5cbiAgRmxpcENsb2NrLkxhbmcuTGF0dmlhbiA9IHtcblxuICAgICd5ZWFycycgICA6ICdHYWRpJyxcbiAgICAnbW9udGhzJyAgOiAnTcSTbmXFoWknLFxuICAgICdkYXlzJyAgICA6ICdEaWVuYXMnLFxuICAgICdob3VycycgICA6ICdTdHVuZGFzJyxcbiAgICAnbWludXRlcycgOiAnTWluxat0ZXMnLFxuICAgICdzZWNvbmRzJyA6ICdTZWt1bmRlcydcblxuICB9O1xuXG4gIC8qIENyZWF0ZSB2YXJpb3VzIGFsaWFzZXMgZm9yIGNvbnZlbmllbmNlICovXG5cbiAgRmxpcENsb2NrLkxhbmdbJ2x2J10gICAgICA9IEZsaXBDbG9jay5MYW5nLkxhdHZpYW47XG4gIEZsaXBDbG9jay5MYW5nWydsdi1sdiddICAgPSBGbGlwQ2xvY2suTGFuZy5MYXR2aWFuO1xuICBGbGlwQ2xvY2suTGFuZ1snbGF0dmlhbiddID0gRmxpcENsb2NrLkxhbmcuTGF0dmlhbjtcblxufShqUXVlcnkpKTtcbihmdW5jdGlvbigkKSB7XG5cbiAgICAvKipcbiAgICAgKiBGbGlwQ2xvY2sgRHV0Y2ggTGFuZ3VhZ2UgUGFja1xuICAgICAqXG4gICAgICogVGhpcyBjbGFzcyB3aWxsIHVzZWQgdG8gdHJhbnNsYXRlIHRva2VucyBpbnRvIHRoZSBEdXRjaCBsYW5ndWFnZS5cbiAgICAgKi9cblxuICAgIEZsaXBDbG9jay5MYW5nLkR1dGNoID0ge1xuXG4gICAgICAgICd5ZWFycycgICA6ICdKYXJlbicsXG4gICAgICAgICdtb250aHMnICA6ICdNYWFuZGVuJyxcbiAgICAgICAgJ2RheXMnICAgIDogJ0RhZ2VuJyxcbiAgICAgICAgJ2hvdXJzJyAgIDogJ1VyZW4nLFxuICAgICAgICAnbWludXRlcycgOiAnTWludXRlbicsXG4gICAgICAgICdzZWNvbmRzJyA6ICdTZWNvbmRlbidcblxuICAgIH07XG5cbiAgICAvKiBDcmVhdGUgdmFyaW91cyBhbGlhc2VzIGZvciBjb252ZW5pZW5jZSAqL1xuXG4gICAgRmxpcENsb2NrLkxhbmdbJ25sJ10gICAgICA9IEZsaXBDbG9jay5MYW5nLkR1dGNoO1xuICAgIEZsaXBDbG9jay5MYW5nWydubC1iZSddICAgPSBGbGlwQ2xvY2suTGFuZy5EdXRjaDtcbiAgICBGbGlwQ2xvY2suTGFuZ1snZHV0Y2gnXSAgID0gRmxpcENsb2NrLkxhbmcuRHV0Y2g7XG5cbn0oalF1ZXJ5KSk7XG5cbihmdW5jdGlvbigkKSB7XG5cblx0LyoqXG5cdCAqIEZsaXBDbG9jayBOb3J3ZWdpYW4tQm9rbcOlbCBMYW5ndWFnZSBQYWNrXG5cdCAqXG5cdCAqIFRoaXMgY2xhc3Mgd2lsbCB1c2VkIHRvIHRyYW5zbGF0ZSB0b2tlbnMgaW50byB0aGUgTm9yd2VnaWFuIGxhbmd1YWdlLlxuXHQgKlx0XG5cdCAqL1xuXG5cdEZsaXBDbG9jay5MYW5nLk5vcndlZ2lhbiA9IHtcblxuXHRcdCd5ZWFycycgICA6ICfDhXInLFxuXHRcdCdtb250aHMnICA6ICdNw6VuZWRlcicsXG5cdFx0J2RheXMnICAgIDogJ0RhZ2VyJyxcblx0XHQnaG91cnMnICAgOiAnVGltZXInLFxuXHRcdCdtaW51dGVzJyA6ICdNaW51dHRlcicsXG5cdFx0J3NlY29uZHMnIDogJ1Nla3VuZGVyJ1x0XG5cblx0fTtcblxuXHQvKiBDcmVhdGUgdmFyaW91cyBhbGlhc2VzIGZvciBjb252ZW5pZW5jZSAqL1xuXG5cdEZsaXBDbG9jay5MYW5nWydubyddICAgICAgPSBGbGlwQ2xvY2suTGFuZy5Ob3J3ZWdpYW47XG5cdEZsaXBDbG9jay5MYW5nWyduYiddICAgICAgPSBGbGlwQ2xvY2suTGFuZy5Ob3J3ZWdpYW47XG5cdEZsaXBDbG9jay5MYW5nWyduby1uYiddICAgPSBGbGlwQ2xvY2suTGFuZy5Ob3J3ZWdpYW47XG5cdEZsaXBDbG9jay5MYW5nWydub3J3ZWdpYW4nXSA9IEZsaXBDbG9jay5MYW5nLk5vcndlZ2lhbjtcblxufShqUXVlcnkpKTtcblxuKGZ1bmN0aW9uKCQpIHtcblxuXHQvKipcblx0ICogRmxpcENsb2NrIFBvcnR1Z3Vlc2UgTGFuZ3VhZ2UgUGFja1xuXHQgKlxuXHQgKiBUaGlzIGNsYXNzIHdpbGwgdXNlZCB0byB0cmFuc2xhdGUgdG9rZW5zIGludG8gdGhlIFBvcnR1Z3Vlc2UgbGFuZ3VhZ2UuXG5cdCAqXG5cdCAqL1xuXG5cdEZsaXBDbG9jay5MYW5nLlBvcnR1Z3Vlc2UgPSB7XG5cblx0XHQneWVhcnMnICAgOiAnQW5vcycsXG5cdFx0J21vbnRocycgIDogJ01lc2VzJyxcblx0XHQnZGF5cycgICAgOiAnRGlhcycsXG5cdFx0J2hvdXJzJyAgIDogJ0hvcmFzJyxcblx0XHQnbWludXRlcycgOiAnTWludXRvcycsXG5cdFx0J3NlY29uZHMnIDogJ1NlZ3VuZG9zJ1xuXG5cdH07XG5cblx0LyogQ3JlYXRlIHZhcmlvdXMgYWxpYXNlcyBmb3IgY29udmVuaWVuY2UgKi9cblxuXHRGbGlwQ2xvY2suTGFuZ1sncHQnXSAgICAgICAgID0gRmxpcENsb2NrLkxhbmcuUG9ydHVndWVzZTtcblx0RmxpcENsb2NrLkxhbmdbJ3B0LWJyJ10gICAgICA9IEZsaXBDbG9jay5MYW5nLlBvcnR1Z3Vlc2U7XG5cdEZsaXBDbG9jay5MYW5nWydwb3J0dWd1ZXNlJ10gPSBGbGlwQ2xvY2suTGFuZy5Qb3J0dWd1ZXNlO1xuXG59KGpRdWVyeSkpO1xuKGZ1bmN0aW9uKCQpIHtcblxuICAvKipcbiAgICogRmxpcENsb2NrIFJ1c3NpYW4gTGFuZ3VhZ2UgUGFja1xuICAgKlxuICAgKiBUaGlzIGNsYXNzIHdpbGwgdXNlZCB0byB0cmFuc2xhdGUgdG9rZW5zIGludG8gdGhlIFJ1c3NpYW4gbGFuZ3VhZ2UuXG4gICAqXG4gICAqL1xuXG4gIEZsaXBDbG9jay5MYW5nLlJ1c3NpYW4gPSB7XG5cbiAgICAneWVhcnMnICAgOiAn0LvQtdGCJyxcbiAgICAnbW9udGhzJyAgOiAn0LzQtdGB0Y/RhtC10LInLFxuICAgICdkYXlzJyAgICA6ICfQtNC90LXQuScsXG4gICAgJ2hvdXJzJyAgIDogJ9GH0LDRgdC+0LInLFxuICAgICdtaW51dGVzJyA6ICfQvNC40L3Rg9GCJyxcbiAgICAnc2Vjb25kcycgOiAn0YHQtdC60YPQvdC0J1xuXG4gIH07XG5cbiAgLyogQ3JlYXRlIHZhcmlvdXMgYWxpYXNlcyBmb3IgY29udmVuaWVuY2UgKi9cblxuICBGbGlwQ2xvY2suTGFuZ1sncnUnXSAgICAgID0gRmxpcENsb2NrLkxhbmcuUnVzc2lhbjtcbiAgRmxpcENsb2NrLkxhbmdbJ3J1LXJ1J10gICA9IEZsaXBDbG9jay5MYW5nLlJ1c3NpYW47XG4gIEZsaXBDbG9jay5MYW5nWydydXNzaWFuJ10gID0gRmxpcENsb2NrLkxhbmcuUnVzc2lhbjtcblxufShqUXVlcnkpKTtcbihmdW5jdGlvbigkKSB7XG5cdFx0XG5cdC8qKlxuXHQgKiBGbGlwQ2xvY2sgU3dlZGlzaCBMYW5ndWFnZSBQYWNrXG5cdCAqXG5cdCAqIFRoaXMgY2xhc3Mgd2lsbCB1c2VkIHRvIHRyYW5zbGF0ZSB0b2tlbnMgaW50byB0aGUgU3dlZGlzaCBsYW5ndWFnZS5cblx0ICpcdFxuXHQgKi9cblx0IFxuXHRGbGlwQ2xvY2suTGFuZy5Td2VkaXNoID0ge1xuXHRcdFxuXHRcdCd5ZWFycycgICA6ICfDhXInLFxuXHRcdCdtb250aHMnICA6ICdNw6VuYWRlcicsXG5cdFx0J2RheXMnICAgIDogJ0RhZ2FyJyxcblx0XHQnaG91cnMnICAgOiAnVGltbWFyJyxcblx0XHQnbWludXRlcycgOiAnTWludXRlcicsXG5cdFx0J3NlY29uZHMnIDogJ1Nla3VuZGVyJ1x0XG5cblx0fTtcblx0XG5cdC8qIENyZWF0ZSB2YXJpb3VzIGFsaWFzZXMgZm9yIGNvbnZlbmllbmNlICovXG5cblx0RmxpcENsb2NrLkxhbmdbJ3N2J10gICAgICA9IEZsaXBDbG9jay5MYW5nLlN3ZWRpc2g7XG5cdEZsaXBDbG9jay5MYW5nWydzdi1zZSddICAgPSBGbGlwQ2xvY2suTGFuZy5Td2VkaXNoO1xuXHRGbGlwQ2xvY2suTGFuZ1snc3dlZGlzaCddID0gRmxpcENsb2NrLkxhbmcuU3dlZGlzaDtcblxufShqUXVlcnkpKTtcblxuKGZ1bmN0aW9uKCQpIHtcblx0XHRcblx0LyoqXG5cdCAqIEZsaXBDbG9jayBDaGluZXNlIExhbmd1YWdlIFBhY2tcblx0ICpcblx0ICogVGhpcyBjbGFzcyB3aWxsIHVzZWQgdG8gdHJhbnNsYXRlIHRva2VucyBpbnRvIHRoZSBDaGluZXNlIGxhbmd1YWdlLlxuXHQgKlx0XG5cdCAqL1xuXHQgXG5cdEZsaXBDbG9jay5MYW5nLkNoaW5lc2UgPSB7XG5cdFx0XG5cdFx0J3llYXJzJyAgIDogJ+W5tCcsXG5cdFx0J21vbnRocycgIDogJ+aciCcsXG5cdFx0J2RheXMnICAgIDogJ+aXpScsXG5cdFx0J2hvdXJzJyAgIDogJ+aXticsXG5cdFx0J21pbnV0ZXMnIDogJ+WIhicsXG5cdFx0J3NlY29uZHMnIDogJ+enkidcblxuXHR9O1xuXHRcblx0LyogQ3JlYXRlIHZhcmlvdXMgYWxpYXNlcyBmb3IgY29udmVuaWVuY2UgKi9cblxuXHRGbGlwQ2xvY2suTGFuZ1snemgnXSAgICAgID0gRmxpcENsb2NrLkxhbmcuQ2hpbmVzZTtcblx0RmxpcENsb2NrLkxhbmdbJ3poLWNuJ10gICA9IEZsaXBDbG9jay5MYW5nLkNoaW5lc2U7XG5cdEZsaXBDbG9jay5MYW5nWydjaGluZXNlJ10gPSBGbGlwQ2xvY2suTGFuZy5DaGluZXNlO1xuXG59KGpRdWVyeSkpOyJdLCJmaWxlIjoiZmxpcGNsb2NrLmpzIn0=

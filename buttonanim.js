/*  Button Animation Class for CommandFusion
===============================================================================

AUTHOR:		Jarrod Bell, CommandFusion
CONTACT:	support@commandfusion.com

=========================================================================
HELP:

1. Place this script in your project via Project Properties > Script Manager
2. Attach animation calls to buttons via the script property of the button
3. Animation call examples:
	- Anims.bulge(join)
	- Anims.bulge(join, 0.1)
	- Anims.bulge(join, 0.1, 0.3)
	- Anims.bulge(join, 0.1, 0.3, 0.1)
	- Anims.imagePulse(join)

=========================================================================
*/

// Used to see if an array contains an object on a specific join
Array.prototype.containsJoin = function(join) {
    var i = this.length;
    while (i--) {
        if (this[i].join == join) {
            return true;
        }
    }
    return false;
}
// Used to get an object from an array on a specific join
Array.prototype.getJoin = function(join) {
    var i = this.length;
    while (i--) {
        if (this[i].join == join) {
            return this[i];
        }
    }
    return false;
}

/* CLASS: Animations
--------------------
Instantiate this once in your project to use any of it's animations.
-----------------------------------------------------------------------------
- imagePulse	= Increase the size of an image below a button, creating a pulse effect.
- bulge			= Increase then decrease the size of the object, creating a bulge effect.
----------------------------------------------------------------------------- */
var Animations = function(params) {
	var self = {
		origPos : [], // This array is used to store the original position/size/etc of an object to reset an animation
		currentState : [], // This array is used to store current values of an object
		scheduledAnimations : [], // This array is used to store the objects that are scheduled for animation.

      displayWidth : 1024,
      displayHeight : 768
	};

	
	/* ANIMATION: imagePulse
	------------------------
	Increase the size of an image below a button, creating a pulse effect.
	-----------------------------------------------------------------------------
	PARAMS * = required
	======
	- join*			= the digital join of a button.
					  There must be an image using the same join number, but serial, which will be object we animate
	- increaseBy	= the pixel amount to increase the size of the image (default 30)
	- duration		= the duration of the animation (default 0.5 seconds)
	----------------------------------------------------------------------------- */
	self.imagePulse = function(join, increaseBy, duration) {
		// Set default params
		if (increaseBy === undefined) {
			increaseBy = 30;
		}
		if (duration === undefined) {
			duration = 0.5;
		}
		// Change from the digital join of the button, to the serial join of the image below it
		join = "s"+join.substr(1);
		// Get the original position and size of the button if we haven't already
		if (!self.origPos.containsJoin(join)) {
			CF.getProperties(join, function(j) {
				// Push the original positions into an array to retrieve each time we perform the animation
				self.origPos.push(j);
				self.imagePulseAnimate(j.join, increaseBy, duration);
			});
		} else {
			self.imagePulseAnimate(join, increaseBy, duration);
		}
	};
	// This is where the actual animation happens.
	self.imagePulseAnimate = function(join, increaseBy, duration) {
		var defaultState = self.origPos.getJoin(join);
		// Ensure animation starts from a set state
		CF.setProperties({join: join, x: defaultState.x, y: defaultState.y, w: defaultState.w, h: defaultState.h, opacity: 0.8}, 0.0, 0.0, CF.AnimationCurveLinear, function() {
			// Start the new animation
			CF.setProperties({join: join, x: defaultState.x-(increaseBy/2), y: defaultState.y-(increaseBy/2), w: defaultState.w+increaseBy, h: defaultState.h+increaseBy, opacity: 0.0}, 0.0, duration);
		});
	};

	/* ANIMATION: bulge
	------------------------
	Increase then decrease the size of the object, creating a bulge effect.
	-----------------------------------------------------------------------------
	PARAMS * = required
	======
	- join*			= the digital join of an object to bulge.
	- increaseBy	= the pixel amount to increase the size of the image (default 0.1)
	- duration		= the duration of the size increase animation (default 0.2 seconds)
	- durationOut	= the duration of the size decrease animation (default 0.2 seconds)
	----------------------------------------------------------------------------- */
	self.bulge = function(join, increaseBy, duration, durationOut) {
		// Set default params
		if (increaseBy === undefined) {
			increaseBy = 0.1;
		}
		if (duration === undefined) {
			duration = 0.2;
		}
		if (durationOut === undefined) {
			durationOut = duration;
		}
		// Get the original position and size of the object if we haven't already
		if (!self.origPos.containsJoin(join)) {
			CF.getProperties(join, function(j) {
				// Push the original positions into an array to retrieve each time we perform the animation
				self.origPos.push(j);
				self.bulgeAnimate(j.join, increaseBy, duration, durationOut);
			});
		} else {
			self.bulgeAnimate(join, increaseBy, duration, durationOut);
		}
	};
	// This is where the actual animation happens.
	self.bulgeAnimate = function(join, increaseBy, duration, durationOut) {
		var defaultState = self.origPos.getJoin(join);
		// Ensure animation starts from a set state
		CF.setProperties({join: join, scale: defaultState.scale, opacity: 1.0}, 0.0, 0.0, CF.AnimationCurveLinear, function() {
			// Start the new animation
			CF.setProperties({join: join, scale: defaultState.scale+increaseBy, opacity: 1.0}, 0.0, duration, CF.AnimationCurveEaseOut, function() {
				// Reverse the animation
				CF.setProperties({join: join, scale: defaultState.scale, opacity: 1.0}, 0.0, durationOut, CF.AnimationCurveEaseOut);
			});
		});
	};

	/* ANIMATION: bounce
	------------------------
	Create a bounce effect using a chain of animations with precise timing
	-----------------------------------------------------------------------------
	PARAMS * = required
	======
	- join*			= the digital join of an object to bounce.
	- increaseBy	= the amount to scale the bounce (default 0.1)
	- duration		= the duration of the total animation (default 0.6 seconds)
	----------------------------------------------------------------------------- */
	self.bounce = function(join, increaseBy, duration) {
		// Set default params
		if (increaseBy === undefined) {
			increaseBy = 0.1;
		}
		if (duration === undefined) {
			duration = 0.6;
		}
		// Get the original position and size of the object if we haven't already
		if (!self.origPos.containsJoin(join)) {
			CF.getProperties(join, function(j) {
				// Push the original positions into an array to retrieve each time we perform the animation
				self.origPos.push(j);
				self.bounceAnimate(j.join, increaseBy, duration);
			});
		} else {
			self.bounceAnimate(join, increaseBy, duration);
		}
	};
	// This is where the actual animation happens.
	self.bounceAnimate = function(join, increaseBy, duration) {
		var defaultState = self.origPos.getJoin(join);
		// Ensure animation starts from a set state
		CF.setProperties({join: join, scale: defaultState.scale, opacity: 1.0}, 0.0, 0.0, CF.AnimationCurveLinear, function() {
			// Start the new animation
			CF.setProperties({join: join, scale: defaultState.scale+increaseBy}, 0.0, duration/4, CF.AnimationCurveEaseOut, function () {
				CF.setProperties({join: join, scale: defaultState.scale-(increaseBy/2)}, 0.0, duration/4, CF.AnimationCurveEaseIn, function () {
					CF.setProperties({join: join, scale: defaultState.scale+(increaseBy/2)}, 0.0, duration/4, CF.AnimationCurveEaseIn, function () {
						CF.setProperties({join: join, scale: 1.0}, 0.0, duration/4, CF.AnimationCurveEaseInOut);
					});
				});
			});
		});
	};


	/**
    *Rotate 360 degress along z-axis
    *@param join        the join number
    *@param duration    the duration in seconds 
    */
   self.rotate = function(join, duration) {
      // Set default params
		if (duration === undefined) {
			duration = 0.5;
		}
      self.storeJoinAndPerformAnimation(this, self.rotateAnimation, join, duration);
     
	};
   self.rotateAnimation = function (join, duration) {
      var settings = [];
      
      settings.push(self.getDefaultState(join));
      settings.push({join:join, zrotation:90,  duration : .25*duration});
      settings.push({join:join, zrotation:180, duration : .25*duration});
      settings.push({join:join, zrotation:270, duration : .25*duration});
      settings.push({join:join, zrotation:360, duration : .25*duration});
      settings.push(self.getDefaultState(join));

      self.performAnimation(settings);
   }

	/**
    *Schrink animation
    *@param join        the join number
    *@param duration    the duration in seconds
    */
   self.schrink = function(join, duration) {
      // Set default params
		if (duration === undefined) {
			duration = 0.5;
		}
      self.storeJoinAndPerformAnimation(this, self.schrinkAnimation, join, duration);

	};
   self.schrinkAnimation = function (join, duration) {
      var settings = [];

      settings.push(self.getDefaultState(join));
      settings.push({join:join, scale:.95,  duration : duration});
      self.performAnimation(settings);
   }

	/**
    *Default state animation
    *@param join        the join number
    *@param duration    the duration in seconds
    */
   self.defaultState = function(join, duration) {
      // Set default params
		if (duration === undefined) {
			duration = 0.5;
		}
      self.storeJoinAndPerformAnimation(this, self.defaultStateAnimation, join, duration);

	};
   self.defaultStateAnimation = function (join, duration) {
      var settings = [];

      settings.push(self.getDefaultState(join),duration);
      self.performAnimation(settings);
   }


	/**
    *Slide object along x-axis 
    *@param join 
    *@param displacement    the displacement in pixels
    *@param duration        the duration in seconds
    */
   self.slide = function(join, displacement, duration) {
		if (duration === undefined) {
			duration = 0.5;
		}
      self.storeJoinAndPerformAnimation(this, self.slideAnimation, join, "checkState", displacement, duration);
	}
   self.slideAnimation = function (join, checkState, displacement, duration) {
      var settings = [];

      if (self.currentState.getJoin(join).x == self.origPos.getJoin(join).x) {
         settings.push({join:join, x:displacement, coordType : "displaceAbsoulte" , duration : duration});
      } else {
         settings.push(self.getDefaultState(join, duration));
      }
      self.performAnimation(settings);
   }


   /**
    *Flip animation where one object appears and the other disspears. Rotation along y-axis.
    *@param joinAppearing       the join of appearing object
    *@param joinDissapearing    the join of dissappearing object
    *@param duration            the duration in seconds
    */
	self.flip = function(joinAppearing, joinDissapearing, duration) {
		if (duration === undefined) {
			duration = 0.5;
		}
      self.storeJoinAndPerformAnimation(this, self.flipSecondJoin, joinDissapearing, joinAppearing, duration);
	}
	self.flipSecondJoin = function(joinDissapearing, joinAppearing, duration) {
      self.storeJoinAndPerformAnimation(this, self.flipAnimation, joinAppearing, joinDissapearing, duration);
	}
   self.flipAnimation = function ( joinAppearing, joinDissapearing, duration) {
      var settings = [];
      var durationDegree = duration/360;
      settings.push({joinValues:[{join:joinAppearing,  value: 0}, {join:joinDissapearing, value: 1}]});
      settings.push({join:joinAppearing,  yrotation:270, duration : 0});
      settings.push({join:joinDissapearing, yrotation:271, duration : durationDegree*179});
      settings.push({join:joinDissapearing, yrotation:270, duration : durationDegree});
      settings.push({joinValues:[{join:joinAppearing,  value: 1}, {join:joinDissapearing, value: 0}]});
      settings.push({join:joinAppearing, yrotation:0, duration : durationDegree*180});
      self.performAnimation(settings);
   }


   /**
    *Flip and move to center animation where one object appears and the other disspears. Rotation along y-axis.
    *@param joinAppearing       the join of appearing object
    *@param joinDissapearing    the join of dissappearing object
    *@param duration            the duration in seconds
    */
   self.flipToCenter = function(joinAppearing, joinDissapearing, duration) {
		if (duration === undefined) {
			duration = 0.5;
		}
      self.storeJoinAndPerformAnimation(this, self.flipToCenterSecondJoin, joinDissapearing, joinAppearing, duration);
	}
   self.flipToCenterSecondJoin = function(joinDissapearing, joinAppearing, duration) {
      self.storeJoinAndPerformAnimation(this, self.flipToCenterAnimation, joinAppearing, joinDissapearing, duration);
	}
   self.flipToCenterAnimation = function ( joinAppearing, joinDissapearing, duration) {
      var settings = [];
    //  var dSAp = self.getRelativeCoordinates(self.getDefaultState(joinAppearing),"center");
    //  var dSDis = self.getRelativeCoordinates(self.getDefaultState(joinDissapearing),"center");

      settings.push({joinValues:[{join:joinAppearing,  value: 0}, {join:joinDissapearing, value: 1}]});
      settings.push({join:joinAppearing,  yrotation:270, duration : 0, coordType:"relative", x: 0.5, y:0.5, anchorPoint:"center", w:305, h:305});
      settings.push({join:joinDissapearing, yrotation:271, duration : .5*duration, coordType:"relative", x: 0.5, y:0.5, anchorPoint:"center", w:305, h:305});
      settings.push({join:joinDissapearing, yrotation:270, duration : 0, coordType:"relative", x: 0.5, y:0.5, anchorPoint:"center", w:305, h:305});
      settings.push({joinValues:[{join:joinAppearing,  value: 1}, {join:joinDissapearing, value: 0}]});
      settings.push({join:joinAppearing, yrotation:0, duration : .5*duration, coordType:"relative", x: 0.5, y:0.5, anchorPoint:"center", w:305, h:305});
      settings.push(self.getDefaultState(joinAppearing));
      settings.push(self.getDefaultState(joinDissapearing));
      self.performAnimation(settings);
   }


	/**
    *Animation that show the use of anchor points and relative coordinates. Move to the corners and sides.
    *@param join       the join number
    *@param duration   the duration in seconds
    */
   self.cornersAndSides = function(join,duration) {
		// Set default params
		if (duration === undefined) {
			duration = 0.5;
		}
		self.storeJoinAndPerformAnimation(this, self.cornersAndSidesAnimation, join, duration);
  	};
   self.cornersAndSidesAnimation = function (join, duration) {
      var settings = [];
      var defaultState = self.origPos.getJoin(join);
      var sequenceDuration = duration/11;
      //Initial position
      settings.push({join:join,x: defaultState.x, y:defaultState.y, scale : defaultState.scale, duration : 0.0});
      
      //Corners
      settings.push({join:join,coordType:"relative",x: 0.0, y:0.0, duration : sequenceDuration});
      settings.push({join:join,coordType:"relative",x: 1.0, y:1.0, duration : sequenceDuration, anchorPoint:"SE"});
      settings.push({join:join,coordType:"relative",x: 0.0, y:1.0, duration : sequenceDuration, anchorPoint:"SW"});
      settings.push({join:join,coordType:"relative",x: 1.0, y:0.0, duration : sequenceDuration, anchorPoint:"NE"});

      //Sides
      settings.push({join:join,coordType:"relative",x: 0.0, y:0.5, duration : sequenceDuration, anchorPoint:"W"});
      settings.push({join:join,coordType:"relative",x: 1.0, y:0.5, duration : sequenceDuration, anchorPoint:"E"});
      settings.push({join:join,coordType:"relative",x: 0.5, y:0.0, duration : sequenceDuration, anchorPoint:"N"});
      settings.push({join:join,coordType:"relative",x: 0.5, y:1.0, duration : sequenceDuration, anchorPoint:"S"});

      //Center
      settings.push({join:join,coordType:"relative",x: 0.5, y:0.5, scale : 7.0, duration : sequenceDuration, anchorPoint:"center"});
      settings.push({join:join,coordType:"relative",x: 0.5, y:0.5, scale : 1.0, duration : sequenceDuration, anchorPoint:"center"});
      
      //Initial position
      settings.push({join:join,x: defaultState.x, y:defaultState.y, scale : defaultState.scale, duration : sequenceDuration});

      self.performAnimation(settings);
   }
   

   /**
    *Transition animations
    *@param join        the join number
    *@param duration    the duration in seconds
    *@param type        the animation type:moveIn,push,reveal fade
    *@param subType     the animation subType: fromLeft, fromRight, fromTop, fromBottom, spin, pop
    *@param easeIn      true/false
    *@param easeOut     true/false
    *
    */
   self.transition = function(join, duration, type, subType, easeIn, easeOut) {
		// Set default params
		if (duration === undefined) {
			duration = 0.5;
		}
		if (type === undefined) {
			type = "moveIn";
		}
		if (subType === undefined) {
			subType = "None";
		}
		if (easeIn === undefined) {
			easeIn = false;
		}
		if (easeOut === undefined) {
			easeOut = false;
		}

		self.storeJoinAndPerformAnimation(this, self.transitionAnimation, join,  "checkState", duration, type, subType, easeIn, easeOut);
	};
   self.transitionAnimation = function (join, checkState, duration, type, subType, easeIn, easeOut) {
      var settings = [];
      var animationCurve;
      var x,y, xDefaultHiddenPosition,yDefaultHiddenPosition;
      var opacity;
      var currentState = self.currentState.getJoin(join);

      if ( type == "moveIn" || type == "push") {
         if (subType == "fromLeft") {
            x = (type == "moveIn") ? 1.0 : -1.0;
            xDefaultHiddenPosition = x == 1.0 ? -1.0 : 1.0;
         } else if(subType == "fromRight") {
            x = (type == "moveIn") ? -1.0 : 1.0;
            xDefaultHiddenPosition = x == 1.0 ? -1.0 : 1.0;
         } else if (subType == "fromTop") {
            y = (type == "moveIn") ? 1.0 : -1.0;
            yDefaultHiddenPosition = y == 1.0 ? -1.0 : 1.0;
         } else if (subType == "fromBottom") {
            y = (type == "moveIn") ? -1.0 : 1.0;
            yDefaultHiddenPosition = y == 1.0 ? -1.0 : 1.0;
         }

      } else if ( type == "fade") {
         opacity = 0.0;
      } else {
         opacity = 1.0;
      }

		if (easeIn === true && easeOut == true) {
			animationCurve = CF.AnimationCurveEaseInOut;
		} else if (easeIn === true && easeOut == false) {
         animationCurve = CF.AnimationCurveEaseIn;
      } else if (easeIn === false && easeOut == true) {
         animationCurve = CF.AnimationCurveEaseOut;
      }

      var dtJoinChange = 2e-2;

      //move the object to default state, for join value zero, for the specific animation.
      if ( type == "moveIn" && currentState.value==0 && subType !="spin") {
         settings.push(self.getDefaultState(join));
         settings.push({join:join, coordType:"displaceRelative", x: xDefaultHiddenPosition, y: yDefaultHiddenPosition, duration : 0, opacity : 1});
         settings.push({joinValues:[{join:join, value: 1}], duration : dtJoinChange});
         settings.push({join:join, coordType:"displaceRelative", x: x, y: y, duration : duration, opacity : opacity, animationCurve : animationCurve});
      } else if ( type == "push" && currentState.value==1  && subType !="spin") {
         settings.push(self.getDefaultState(join));
         settings.push({join:join, coordType:"displaceRelative", x: x, y: y, duration : duration, opacity : opacity, animationCurve : animationCurve});
         settings.push({joinValues:[{join:join, value: 0}], duration : dtJoinChange});
      } else if ( type == "reveal" && currentState.value==0) {
         settings.push(self.getDefaultState(join));
         settings.push({join:join, opacity : 0, duration : 0});
         settings.push({joinValues:[{join:join, value: 1}], duration : dtJoinChange});
         settings.push({join:join, opacity : 1, duration : duration, animationCurve : animationCurve});
      } else if ( type == "fade" && currentState.value==1) {
         settings.push({join:join, opacity : 0, duration : duration, animationCurve : animationCurve});
         settings.push({joinValues:[{join:join, value: 0}], duration : dtJoinChange});
      } else if ( type == "moveIn" && subType == "pop" && currentState.value==0) {
         settings.push(self.getDefaultState(join));
         settings.push({joinValues:[{join:join, value: 1}]});
      } else if ( type == "push" && subType == "pop" && currentState.value==1) {
         settings.push(self.getDefaultState(join));
         settings.push({joinValues:[{join:join, value: 0}]});
      } else if ( type == "moveIn" && subType == "spin" && currentState.value==0) {
         settings.push(self.getDefaultState(join));
         settings.push({joinValues:[{join:join, value: 1}], duration : 0});
         settings.push({join:join, duration : 2e-2, yrotation:90});
         settings.push({join:join, duration : duration, animationCurve : animationCurve, yrotation:0});
      } else if ( type == "push" && subType == "spin" && currentState.value==1) {
         settings.push(self.getDefaultState(join));
         settings.push({join:join, duration : duration, animationCurve : animationCurve, yrotation:90});
         settings.push({join:join, duration : 0, opacity:0, yrotation:0});
         settings.push({joinValues:[{join:join, value: 0}], duration : 1e-2});
      }
//      else if ( type == "moveInOvershoot" && currentState.value==0 && subType !="left") {
//         settings.push(self.getDefaultState(join));
//         settings.push({join:join, coordType:"displaceRelative", x: xDefaultHiddenPosition, y: yDefaultHiddenPosition, duration : 0, opacity : 1});
//         settings.push({joinValues:[{join:join, value: 1}], duration : dtJoinChange});
//         settings.push(self.getDefaultState(join), 0.8*duration);
//         settings.push({join:join, coordType:"displaceRelative", x: 0.1, duration : 0.1*duration, animationCurve : CF.AnimationCurveEaseInOut});
//         settings.push(self.getDefaultState(join), 0.1*duration);
//         settings.push({join:join, coordType:"displaceRelative", x: 0.01*x, y: y, duration : 0.1*duration, opacity : opacity, animationCurve : CF.AnimationCurveEaseInOut});
//         settings.push(self.getDefaultState(join),0.1*duration);
//      }

      self.performAnimation(settings);
   }


	
   /**
    *Circle animation
    *@param join       the join number
    *@param duration   the duration in seconds
    */
   self.circle = function(join, duration) {
		// Set default params
		if (duration === undefined) {
			duration = 5;
		}
      self.storeJoinAndPerformAnimation(this, self.circleAnimation, join, duration);
	};
   self.circleAnimation = function (join, duration) {
      var settings = [];
      var x,y,theta;
      var defaultState = self.origPos.getJoin(join);
      var stepsInAnimation = 100;
      var radius = 0.2;
      var aStep = 360/stepsInAnimation;

      //defauly state
      settings.push({join:join,x: defaultState.x, y:defaultState.y, scale : defaultState.scale, duration : 0.0, anchorPoint:"center"});

      //initial coordinates
      x = 0.5 + radius * Math.cos(0 * Math.PI / 180);
      y = 0.5 + radius * Math.sin(0 * Math.PI / 180);
      settings.push({join:join,coordType:"relative", x : x, y : y, duration : 0.1*duration, anchorPoint:"center"});

      for(var i=0;i<stepsInAnimation;i++){
         theta = i * aStep;  
         x = 0.5 + radius * Math.cos(theta * Math.PI / 180);
         y = 0.5 + radius * Math.sin(theta * Math.PI / 180);
         settings.push({join:join,coordType:"relative",x: x, y : y, duration : .8*duration/stepsInAnimation, anchorPoint:"center"});
      }

      //Back to default state in the end of animation
      settings.push({join:join,x: defaultState.x, y:defaultState.y, scale : defaultState.scale, duration : 0.1*duration});

      self.performAnimation(settings);
   }



   /**
    * Perform the animation that are defined with the supplied settings array.
    * @param settings               An array containing animation settings objects as items. Each item define an animation step.
    *                               All fields are optional. The default states values or ad hoc default values are used for missing fields.
    *
    *                               Valid fields are:
    *                               x                          x-coordinates for the anchor point(NW default)
    *                               y                          y-coordinates for the anchor point(NW default)
    *                               coordType:                 Describes the type of coordinates
    *                                   absolute(default)       pixel values
    *                                   relative               relative values (0.0-1.0)
    *                                   displaceAbsoulte   displacement in pixel coordinates
    *                                   displaceRelative   displacement in relative coordinates
    *                               anchorPoint:               the anchor point for the coordinate given above
    *                                  center
    *                                  N
    *                                  NW (default)
    *                                  W
    *                                  SW
    *                                  S
    *                                  SE
    *                                  E
    *                                  NE
    *                               duration                   the duration in seconds
    *                               xrotation                  default CF values
    *                               yrotation                  default CF values
    *                               zrotation                  default CF values
    *                               scale                      default CF values
    *                               opacity                    default CF values
    *                               animationCurve             default CF values
    *
    *                               joinValues                 defauly CF array for CF.setJoins()
    *
    *                               interpNumber               Additional settings items can be interpolated from the current and previous item in the settings array.
    *                                                          The number defines the number of additional settings items that are created. Linear inerpolation for the fields are used.
    */
   self.performAnimation = function (settings) {
      var i;
      var scheduleTime = 0;
      var expandedSettings = self.expandSettings(settings);


      //Schedule all animations
      if (!self.isScheduled(settings)) {
         self.storeJoinsBeforeSchedule(settings);
         var k = 0;
         for(i=0;i<expandedSettings.length;i++){
             if (expandedSettings[i].joinValues != undefined) {
             } else {
               CF.log("j:"+ expandedSettings[i].join + ", x:" + expandedSettings[i].x + ", y:" + expandedSettings[i].y + ", w:" + expandedSettings[i].w + ", h:" + expandedSettings[i].h + ", xrot:" + expandedSettings[i].xrotation + ", yrot:" + expandedSettings[i].yrotation + ", zrot:" + expandedSettings[i].zrotation+ ", scheduleTime:" + scheduleTime);
             }
             setTimeout(function() {
               if (expandedSettings[k].joinValues != undefined) {
                  for (var j=0;j<expandedSettings[k].joinValues.length;j++) {
                     CF.log("joinValues:" + expandedSettings[k].joinValues[j].join + "=" + expandedSettings[k].joinValues[j].value );
                  }
                  CF.setJoins(expandedSettings[k].joinValues);
               } else {
               CF.setProperties({
                  join: expandedSettings[k].join,
                  x : expandedSettings[k].x,
                  y: expandedSettings[k].y,
                  w: expandedSettings[k].w,
                  h: expandedSettings[k].h,
                  xrotation : expandedSettings[k].xrotation,
                  yrotation : expandedSettings[k].yrotation,
                  zrotation : expandedSettings[k].zrotation,
                  scale : expandedSettings[k].scale,
                  opacity : expandedSettings[k].opacity
               },
               0.0,
               expandedSettings[k].duration,
               expandedSettings[k].animationCurve);
            }
            k++;
            if (k == expandedSettings.length) {
               self.removeScheduledJoins(settings);
            }
            }, scheduleTime*1000);
            scheduleTime = scheduleTime + expandedSettings[i].duration;
         }
      }
   }

   self.isScheduled = function(settings) {
      CF.log("Check if scheduled")
      var joins = self.getJoinsFromSettings(settings);
      for(var i=0;i<joins.length;i++){
         if (self.scheduledAnimations.containsJoin(joins[i].join) && self.scheduledAnimations.getJoin(joins[i].join).scheduled == true) {
            CF.log("Join:" + settings[i].join + " already scheduled")
            return true;
         }
      }
      return false;
   }

   self.removeScheduledJoins = function(settings) {
      if (settings != undefined ) {
         CF.log("Remove scheduled joins")
         var joins = self.getJoinsFromSettings(settings);
         for(var i=0;i<joins.length;i++){
            if (self.scheduledAnimations.containsJoin(joins[i].join)) {
               self.scheduledAnimations.getJoin(joins[i].join).scheduled = false;
            }
         }
      }
   }

   self.storeJoinsBeforeSchedule = function(settings) {
      if (settings != undefined ) {
         CF.log("Store joins before scheduling")
         var joins = self.getJoinsFromSettings(settings);
         for (var i=0;i<joins.length;i++){
            if (!self.scheduledAnimations.containsJoin(joins[i].join)) {
               self.scheduledAnimations.push({join : joins[i].join, scheduled : true});
            } else {
               self.scheduledAnimations.getJoin(joins[i].join).scheduled = true;
            }
         }
      }
   }

   self.getJoinsFromSettings = function(settings) {
      var joins = [];
      if (settings != undefined ) {
         for(var i=0;i<settings.length;i++){
            if (settings[i].joinValues == undefined) {
               joins.push({join : settings[i].join});
            } else {
               for(var j=0;j<settings[i].joinValues.length;j++){
                  joins.push({join : settings[i].joinValues[j].join});
               }
            }
         }
      }
      return joins;

   }

   /**
    * Calculates new fields for the settings array
    * Relative or displaced coordinates are transfered to absolute ones.
    * The values for missing fields are set to respective previous item values or default values.
    */
   self.expandSettings = function(settings) {
      var expandedSettings = [];
      var defaultState;
      var previousState;

      //Search after the previous state, that is not a join change state. Sets to default state if none was found.
      for(var i=0;i<settings.length;i++){
         defaultState = self.origPos.getJoin(settings[i].join);
         previousState = undefined;
         for(var k=i-1;k>=1;k--){
            if(expandedSettings.length>0 && expandedSettings[k].joinValues == undefined && settings[i].join == expandedSettings[k].join) {
               previousState = expandedSettings[k];
            }
         }
         if(previousState == undefined) {
            previousState = defaultState;
         }

         expandedSettings[i] ={};
         expandedSettings[i].duration = (settings[i].duration !=undefined) ? settings[i].duration : 0.0;
         expandedSettings[i].scale = (settings[i].scale !=undefined) ? settings[i].scale : 1.0;
         if (settings[i].coordType != undefined && settings[i].coordType == "relative") {
            expandedSettings[i].x = parseInt(self.displayWidth * settings[i].x);
            expandedSettings[i].y = parseInt( self.displayHeight * settings[i].y);
         } else if (settings[i].coordType != undefined && settings[i].coordType == "displaceAbsoulte") {
            expandedSettings[i].x = previousState.x + settings[i].x;
            expandedSettings[i].y = previousState.y + settings[i].y;
         } else if (settings[i].coordType != undefined && settings[i].coordType == "displaceRelative") {
            expandedSettings[i].x = previousState.x + parseInt(self.displayWidth * settings[i].x);
            expandedSettings[i].y = previousState.y + parseInt(self.displayHeight * settings[i].y);
         } else {
            if (settings[i].x != undefined) {
               expandedSettings[i].x = settings[i].x;
            } else {
               expandedSettings[i].x = previousState.x;
            }
            if (settings[i].y != undefined) {
               expandedSettings[i].y = settings[i].y;
            } else {
               expandedSettings[i].y = previousState.y;
            }
         }
         if (settings[i].w != undefined) {
            expandedSettings[i].w = settings[i].w;
         } else {
            expandedSettings[i].w = previousState.w;
         }
         if (settings[i].h != undefined) {
            expandedSettings[i].h = settings[i].h;
         } else{
            expandedSettings[i].h = previousState.h;
         } 
         if (settings[i].coordType == undefined || (settings[i].coordType != "displaceAbsoulte" && settings[i].coordType != "displaceRelative")) {
            if (settings[i].anchorPoint != undefined && settings[i].anchorPoint == "center") {
               expandedSettings[i].x = expandedSettings[i].x - parseInt(0.5*(expandedSettings[i].w));
               expandedSettings[i].y = expandedSettings[i].y - parseInt(0.5*(expandedSettings[i].h));
            } else if (settings[i].anchorPoint != undefined && settings[i].anchorPoint == "W") {
               expandedSettings[i].y = expandedSettings[i].y - parseInt(0.5*(expandedSettings[i].h));
            } else if (settings[i].anchorPoint != undefined && settings[i].anchorPoint == "SW") {
               expandedSettings[i].y = expandedSettings[i].y - parseInt(1.0*(expandedSettings[i].h));
            } else if (settings[i].anchorPoint != undefined && settings[i].anchorPoint == "S") {
               expandedSettings[i].x = expandedSettings[i].x - parseInt(0.5*(expandedSettings[i].w));
               expandedSettings[i].y = expandedSettings[i].y - parseInt(1.0*(expandedSettings[i].h));
            } else if (settings[i].anchorPoint != undefined && settings[i].anchorPoint == "SE") {
               expandedSettings[i].x = expandedSettings[i].x - parseInt(1.0*(expandedSettings[i].w));
               expandedSettings[i].y = expandedSettings[i].y - parseInt(1.0*(expandedSettings[i].h));
            } else if (settings[i].anchorPoint != undefined && settings[i].anchorPoint == "E") {
               expandedSettings[i].x = expandedSettings[i].x - parseInt(1.0*(expandedSettings[i].w));
               expandedSettings[i].y = expandedSettings[i].y - parseInt(0.5*(expandedSettings[i].h));
            } else if (settings[i].anchorPoint != undefined && settings[i].anchorPoint == "NE") {
               expandedSettings[i].x = expandedSettings[i].x - parseInt(1.0*(expandedSettings[i].w));
            } else if (settings[i].anchorPoint != undefined && settings[i].anchorPoint == "N") {
               expandedSettings[i].x = expandedSettings[i].x - parseInt(0.5*(expandedSettings[i].w));
            }
         }
         expandedSettings[i].xrotation = (settings[i].xrotation !=undefined) ? settings[i].xrotation : 0.0;
         expandedSettings[i].yrotation = (settings[i].yrotation !=undefined) ? settings[i].yrotation : 0.0;
         expandedSettings[i].zrotation = (settings[i].zrotation !=undefined) ? settings[i].zrotation : 0.0;
         expandedSettings[i].opacity = (settings[i].opacity !=undefined) ? settings[i].opacity : 1.0;
         expandedSettings[i].join =  settings[i].join;
         expandedSettings[i].animationCurve = (settings[i].animationCurve !=undefined) ? settings[i].animationCurve : CF.AnimationCurveLinear;
         expandedSettings[i].joinValues = settings[i].joinValues;
         expandedSettings[i].interpNumber = settings[i].interpNumber;
      }

      //Interpolate intermidate values if interpNumber is not missing and large than one
      var interpolatedSettings = [];
      var f1;
      var f2;
      for(i=0;i<(expandedSettings.length-1);i++){
         if (expandedSettings[i].interpNumber!=undefined && expandedSettings[i].interpolateNumber>0) {
            for(var j=0;j<(expandedSettings[i].interpNumber+2);j++){
               f2 = j / (expandedSettings[i].interpNumber+1);
               f1 = 1 - f2;
               interpolatedSettings.push({
                  w :             f1 * expandedSettings[i].w +              f2 * expandedSettings[i+1].w,
                  h :             f1 * expandedSettings[i].h +              f2 * expandedSettings[i+1].h,
                  x :             f1 * expandedSettings[i].x +              f2 * expandedSettings[i+1].x,
                  y :             f1 * expandedSettings[i].y +              f2 * expandedSettings[i+1].y,
                  xrotation :     f1 * expandedSettings[i].xrotation +      f2 * expandedSettings[i+1].xrotation,
                  yrotatione :    f1 * expandedSettings[i].yrotation +      f2 * expandedSettings[i+1].yrotation,
                  zrotation :     f1 * expandedSettings[i].zrotation +      f2 * expandedSettings[i+1].zrotation,
                  scale :         f1 * expandedSettings[i].scale +          f2 * expandedSettings[i+1].scale,
                  opacity :       f1 * expandedSettings[i].opacity +        f2 * expandedSettings[i+1].opacity,
                  animationCurve: f1 * expandedSettings[i].animationCurve + f2 * expandedSettings[i+1].animationCurve,
                  duration :      expandedSettings[i+1].duration/(expandedSettings[i].interpNumber +2),
                  joinValues:     expandedSettings[i].joinValues,
                  join:           expandedSettings[i].join
               });
            }
         }
      }
      return (interpolatedSettings.length > expandedSettings.length) ? interpolatedSettings : expandedSettings;
   }

   /**
    *Store the properties for a join, if not already done before, and then call the animation funciton with
    *the passed arguments
    */
   self.storeJoinAndPerformAnimation = function(context, animationFunction) {

       // arguments[0] == context
       // arguments[1] == animationFunction
       // arguments[2] == join
       // arguments[3] == "checkState"(optional)
       var args = []; // empty array
       var join = arguments[2];
       var checkState = arguments[3];

       // copy all other arguments we want to "pass through"
       for(var i = 2; i < arguments.length; i++)
       {
           args.push(arguments[i]);
       }
      
      if (!self.origPos.containsJoin(join)) {
         CF.getProperties(join, function(propertiesJoin) {
            self.origPos.push(propertiesJoin);
            if (checkState != undefined && checkState == "checkState") {
               CF.getJoin(join, function(j, v, tokens) {
                  if (!self.currentState.containsJoin(join)) {
                     var state = {};
                     state.join = j;
                     state.value = v;
                     state.x = propertiesJoin.x
                     state.y = propertiesJoin.y
                     state.w = propertiesJoin.w
                     state.h = propertiesJoin.h
                     self.currentState.push(state);
                  } else {
                     self.currentState.getJoin(join).value = v;
                  }
                  animationFunction.apply(context, args);
               });
            } else {
               animationFunction.apply(context, args);
            }
         });
      } else {
            if (checkState != undefined && checkState == "checkState") {
               CF.getProperties(join, function(propertiesJoin) {
                  CF.getJoin(join, function(j, v, tokens) {
                     if (!self.currentState.containsJoin(join)) {
                        var state = {};
                        state.join = j;
                        state.value = v;
                        state.x = propertiesJoin.x
                        state.y = propertiesJoin.y
                        state.w = propertiesJoin.w
                        state.h = propertiesJoin.h
                        self.currentState.push(state);
                     } else {
                        self.currentState.getJoin(join).value = v;
                        self.currentState.getJoin(join).x = propertiesJoin.x
                        self.currentState.getJoin(join).y = propertiesJoin.y
                        self.currentState.getJoin(join).w = propertiesJoin.w
                        self.currentState.getJoin(join).h = propertiesJoin.h
                     }
                     animationFunction.apply(context, args);
                  });
               });
            } else {
               animationFunction.apply(context, args);
            }
      }
   }

   /**
    *Retrives the settings object for the defauly state, i.e the state prior any animaiton.
    *@returns the settings for defaut state
    */
   self.getDefaultState = function (join, duration) {
      duration = (duration != undefined) ? duration : 0.0;
      var defaultState = self.origPos.getJoin(join);
      return {join: join, x: defaultState.x, y:defaultState.y, opacity : 1, w: defaultState.w, h : defaultState.h, scale : defaultState.scale, yrotation:defaultState.yrotation, duration : duration};
   }

   self.getRelativeCoordinates = function(state, anchorPoint) {
      if (anchorPoint != undefined) {
         state.anchorPoint = anchorPoint;
      }

      if (anchorPoint != undefined && anchorPoint == "center") {
         state.x = state.x + parseInt(0.5*(state.w));
         state.y = state.y + parseInt(0.5*(state.h));
      } else if (anchorPoint != undefined && anchorPoint == "W") {
         state.y = state.y + parseInt(0.5*(state.h));
      } else if (anchorPoint != undefined && anchorPoint == "SW") {
         state.y = state.y + parseInt(1.0*(state.h));
      } else if (anchorPoint != undefined && anchorPoint == "S") {
         state.x = state.x + parseInt(0.5*(state.w));
         state.y = state.y + parseInt(1.0*(state.h));
      } else if (anchorPoint != undefined && anchorPoint == "SE") {
         state.x = state.x + parseInt(1.0*(state.w));
         state.y = state.y + parseInt(1.0*(state.h));
      } else if (anchorPoint != undefined && anchorPoint == "E") {
         state.x = state.x + parseInt(1.0*(state.w));
         state.y = state.y + parseInt(0.5*(state.h));
      } else if (anchorPoint != undefined && anchorPoint == "NE") {
         state.x = state.x + parseInt(1.0*(state.w));
      } else if (anchorPoint != undefined && anchorPoint == "N") {
         state.x = state.x + parseInt(0.5*(state.w));
      }

      state.x = parseInt(state.x / self.displayWidth );
      state.y = parseInt(state.y / self.displayHeight);

      return state;
   }





   


   self.drop = function(join, duration) {
		// Set default params
		if (duration === undefined) {
			duration = 5;
		}
      self.storeJoinAndPerformAnimation(this, self.dropAnimation, join, duration);
	};
   self.dropAnimation = function(join,duration) {
      var defaultState = self.origPos.getJoin(join);
      var constants = {};
      var state = {};
      var settings = [];
      var stepsInAnimation = 50;

      //Constants
      constants.elementWidth = defaultState.w;
      constants.elementHeight = defaultState.h;
      constants.left = 0;
      constants.right = self.displayWidth;
      constants.top = 0;
      constants.bottom = self.displayHeight;
      constants.reflect = -1;    // bounce off wall else disappear
      constants.coeff = 0.8;
      constants.friction = 0.99;
      constants.px_mm = 5;  // 130dpi = 130px/25.4mm = 5.118
      constants.ticInt = duration / stepsInAnimation*200;
      constants.gravity = 0.0098 * constants.px_mm*constants.ticInt*constants.ticInt;//gravity = 9.8m/s/s = 0.0098mm/ms/ms = 0.0098* ms/tick*ms/tick * px/mm  = 0.0098 * tickInt^2 * px_mm
      constants.vel = 0.5 * constants.px_mm*constants.ticInt;     // 0.6 m/sec // velocity 1m/s = 1 mm/ms = 1mm/ms * px/mm * ms/tick = speed * px_mm * tinkInt

      //Initial coordinate and velocity settings
      var startAngle = 10 * Math.floor(Math.random() * 12);
      state.x = defaultState.x;
      state.y = defaultState.y;
      state.xVel = constants.vel * Math.cos(startAngle * Math.PI / 18);
      state.yVel = constants.vel * Math.sin(startAngle * Math.PI / 180);

      settings.push({join:join, x: defaultState.x, y:defaultState.y, scale : defaultState.scale, duration : 0.0});
      for(var i=0 ; i < stepsInAnimation ; i++){
         state = self.getBouncingCoordinates(constants, state);
         settings.push({join:join, x: state.x, y : state.y, duration : duration/stepsInAnimation});
      }
      settings.push({join:join,x: defaultState.x, y:defaultState.y, scale : defaultState.scale, duration : 0.0});
      self.performAnimation(settings);
   }
   self.getBouncingCoordinates = function(constants, state) {
      // this.state is holding the previous results so grab them before we overwrite
        var xVel = state.xVel;
        var yVel = state.yVel + 0.5 * constants.gravity;    // accelerating
        var x = state.x + xVel;
        var y = state.y + yVel;

        if (x > constants.right - constants.elementWidth)
        {
          x = constants.right - constants.elementWidth;
          xVel *= constants.reflect*constants.coeff;    // lossy reflection next step
        }
        if (x < constants.left)
        {
          x = constants.left;
          xVel *= constants.reflect*constants.coeff;    // lossy reflection next step
        }
        if (y > constants.bottom - constants.elementHeight)
        {
          y = constants.bottom - constants.elementHeight;
          if (Math.abs(yVel) < constants.gravity)
          {
            // Now if velocity is less than g, let the g term be the loss mechanism
            constants.gravity *= constants.coeff;
            yVel *= constants.reflect;
            xVel *= constants.friction;   // introduce rolling friction for x motion
          }
          else
            yVel *= constants.reflect*constants.coeff;    // lossy constants.reflection next step
        }
        if (y < constants.top)
        {
          y = constants.top;
          yVel *= constants.reflect*constants.coeff;    // lossy reflection next step
        }

        state.x = x;
        state.y = y;
        state.xVel = xVel;
        state.yVel = yVel;
        return state;
   }


	return self;
};
// Instatiated here, no need to instantiate in your project anywhere else
var Anims = new Animations();
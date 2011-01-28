/*

Copyright (c) 2011 Nickolas Kenyeres
 
 Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation file(the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 
 The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/

(function($) {

	$.fn.jPixter = function(vars) {
	
		// Speed is the duration of transition in millisecons.
		var speed = vars.speed || 150;
		
		// Interval is the duration of stay on each slide.
		var interval = vars.interval || 3000;
		
		// Caption toggles display of captions on or off.
		var caption = vars.caption || true;
		
		// Caption opacity is the translucency of the caption area.
		var captionOpacity = vars.captionOpacity || 0.7;
		var captionPositionX = vars.captionPositionX || "right";
		var captionPositionY = vars.captionPositionY || "top";
		var captionFullWidth = vars.captionFullWidth || false;
		
		// The name of the parent element.
		var deck = vars.deck || "deck";
		
		// The name of the unordered list containing the photos.
		var photoDeck = vars.photoDeck || "photoDeck";
		
		// The name of the div containing the next, previous and pause controls.
		var controls = vars.controls || "controls";
		
		var controlsOpacity = vars.controlsOpacity || 0.7;
		
		// Vertical or horizontal orientation.
		var vertical = vars.vertical || false;
		
		// Cache a reference ot key components.
		var photos = $("ul#"+photoDeck+" li");
		var previousButton = $("div#"+controls+" a.previous");
		var pauseButton = $("div#"+controls+" a.pause");
		var nextButton = $("div#"+controls+" a.next");
		var deck = $("#"+deck);
		var photoDeck = $("#"+photoDeck);
		var controls = $("#"+controls);
		
		// The currently displayed photo. Starts at zero.
		var index = 0;
		
		// Flags transitioning state.
		var transitioning = false;
		
		// Flags paused state.
		var paused = false;
		
		// Reference to timer.
		var timeout;
		
		// Toggles between paused and unpaused.
		$(pauseButton).click(function() {
			paused = !paused;
			if (paused)
				pause();
			else
				resume();
			notify(this);
			return false;
		});
		
		// Moves to the next photo (pauses for manual navigation).
		$(nextButton).click(function() {
			if (timeout != null) window.clearTimeout(timeout);
			paused = true;
			notify(pauseButton);
			swapNext();
			return false;
		});
		
		// Moves the previous photo (pauses for manual navigation).
		$(previousButton).click(function() {
			if (timeout != null) window.clearTimeout(timeout);
			paused = true;
			notify(pauseButton);
			swapPrevious();
			return false;
		});
		
		// Increments the position for the currently displayed photo.
		var increment = function() {
			index = getNext();
		}
		
		// Decrements the position for the currently displayed photo.
		var decrement = function() {
			index = getPrevious();
		}
		
		// Finds the position of the next photo to display (circular).
		var getNext = function() {
			return ((index + 1) == photos.length) ? 0 : (index + 1);
		}
		
		// Finds the position of the previous photo to display (circular).
		var getPrevious = function() {
			return ((index - 1) < 0) ? (photos.length - 1) : (index - 1);
		}
		
		// Swaps the visibility of the current photo and next photo.
		var swapNext = function() {
			hide(index);
			increment();
			show(index);
		}
		
		// Swaps the visibility of the current photo and the previous photo.
		var swapPrevious = function() {
			hide(index);
			decrement();
			show(index);
		}
		
		// Works in a loop with fadeOut to cycle through photos.
		var fadeIn = function() {
			transitioning = true;
			$(photos[index]).fadeIn(speed, function() {
				if (!paused)
					transitioning = false;
					timeout = window.setTimeout(fadeOut, interval);
			});
		}
		
		// Works in a loop with fadeIn to cycle through photos.
		var fadeOut = function() {
			transitioning = true;
			$(photos[index]).fadeOut(speed, function() {
				increment();
				fadeIn();
			});
		}
		
		// Displays a photo at the specified position.
		var show = function(ndx) {
			$(photos[ndx]).fadeIn(0);
		}
		
		// Hides a photo at the specified position.
		var hide = function(ndx) {
			$(photos[ndx]).fadeOut(0);
		}
		
		// Changes the pause label to notify user of change in state (paused/resumed).
		var notify = function(label) {
			if (paused)
				$(label).html("Resume");
			else
				$(label).html("Pause");
		}
		
		// Pauses the slideshow.
		var pause = function() {
			if (timeout != null)
				window.clearTimeout(timeout);
			show(index);
		}
		
		// Resumes the slideshow.
		var resume = function() {
			fadeIn();
		}
		
		// Sets the captions.
		var setCaptions = function() {
			if (caption === true) {
				$(photos).each(function(index) {
					var aCaption = $(this).children('div:first');
					if ($(aCaption).length != 0 && $(aCaption).html().length != 0) {
						$(aCaption).css({'position':'absolute'});
						if (captionPositionX == 'right')
							$(aCaption).css({'right':0});
						else
							$(aCaption).css({'left':0});
						if (captionPositionY == 'top')
							$(aCaption).css({'top':0, 'border-bottom':'1px solid #999'});
						else
							$(aCaption).css({'bottom':0, 'border-top':'1px solid #999'});
						if (captionFullWidth === true)
							$(aCaption).css({'width':'96%'});
						else
							$(aCaption).css({'width':'76%'});
						if (captionFullWidth === false && captionPositionY == 'top')
							$(aCaption).css({'top':'5%', 'border-top':'1px solid #999'});
						else if (captionFullWidth === false && captionPositionY == 'bottom')
							$(aCaption).css({'bottom':'5%', 'border-bottom':'1px solid #999'});
						if (captionFullWidth === false && captionPositionX == 'right')
							$(aCaption).css({'border-left':'1px solid #999'});
						else if (captionFullWidth === false && captionPositionX == 'left')
							$(aCaption).css({'border-right':'1px solid #999'});
						$(aCaption).css({
							'z-index':'9999',
							'background':'#000',
							'display':'block',
							'color':'#fff',
							'font-family':'Helvetica, Arial, sans-serif',
							'font-size':'12px',
							'padding':'2%',
							'padding-top':'1em',
							'padding-bottom':'1em',
							'opacity':captionOpacity
						});
					} 
				});
			}
		}
		
		// Sets the controls
		var setControls = function() {
			$(controls).css({'position':'absolute'});
			if (captionPositionY == 'top')
				$(controls).css({'bottom':0, 'left':0});
			else
				$(controls).css({'top':0, 'left':0});
			$(controls).css({
				'width':'100%',
				'background':'#000',
				'border-top':'1px solid #999',
				'opacity':controlsOpacity,
				'z-index':'9999',
				'font-family':'Helvetica, Arial, sans-serif',
				'font-size':'12px'
			});
			$(controls).children('a').css({
				'color':'#fff',
				'font-weight':'bold',
				'text-decoration':'none',
				'text-align':'center',
				'width':'33%',
				'padding-top':'1.5em',
				'padding-bottom':'1.5em',
				'float':'left',
				'display':'block'
			});
			$(controls).children('a.pause').css({
				'width':'34%'
			});
			$(controls).children('a').hover(function() {
				$(this).css({'background':'#444', 'text-decoration':'none'});
			}, function() {
				$(this).css({'background':'none'});
			});
		}
		
		// Run the script!
		setCaptions();
		setControls();
		fadeIn();
		
	}

})(jQuery);
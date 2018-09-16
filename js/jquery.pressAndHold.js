/* 
* Copyright 2017-2018, Pablo Andueza pabloandumundu@gmail.com

* This file is part of Tagstoo.

* Tagstoo is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.

* Tagstoo is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.

* You should have received a copy of the GNU General Public License
* along with Tagstoo.  If not, see <http://www.gnu.org/licenses/>.
*/

/* This javascript differs from the original in https://plugins.jquery.com/pressAndHold/ . Is slightly modified to the use on the project Tagstoo */

/*
 * jQuery pressAndHold Plugin 1.0.0
 * https://github.com/
 *
 * Copyright 2013, Tony Smith
 * https://www.naptown.com
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 */

;(function($, window, document, undefined) {	

	var pressAndHold = "pressAndHold",
		defaults = {
			holdTime: 700,
			progressIndicatorRemoveDelay: 300,
			progressIndicatorColor: "#ff0000",
			progressIndicatorOpacity: 0.6

		}; 

	function Plugin(element, options) {
		this.element = element;
		this.settings = $.extend({}, defaults, options);
		this._defaults = defaults;
		this._name = pressAndHold;
		this.init();
	}

	Plugin.prototype = {
		init: function() {
			var _this = this,
			timer,
			decaCounter,
			progressIndicatorHTML;


			$(this.element).css({
				
				overflow: 'hidden'
		
			});

			progressIndicatorHTML = '<div class="holdButtonProgress"></div>';

			$(this.element).prepend(progressIndicatorHTML);

			$("#dirview .holdButtonProgress, #searchdirview .holdButtonProgress").css("height", "8px");
			$("#dirview .holdButtonProgress, #searchdirview .holdButtonProgress").css("position", "fixed");
			$("#dirview .holdButtonProgress, #searchdirview .holdButtonProgress").css("top", "60px");
			$("#dirview .holdButtonProgress, #searchdirview .holdButtonProgress").css("z-index", "100");

			$(this.element).mousedown(function(e) {
			
				// si se está editando un nombre o graggeando el elemento no ejecutar la función
				if (!$(this).children().is(".editing") || !$(this).parent().hasClass("dragging")) {	

					function pause(milliseconds) {
						var dt = new Date();
						while ((new Date()) - dt <= milliseconds) { /* Do nothing */ }
					}
					pause(200);				

					if(e.button != 2){
						$(_this.element).trigger('start.pressAndHold');
						decaCounter = 0;
						timer = setInterval(function() {
							decaCounter += 10;
							$(_this.element).find(".holdButtonProgress").css("left", ((decaCounter / _this.settings.holdTime) * 100 - 100) + "%");
							if (decaCounter == _this.settings.holdTime) {
								_this.exitTimer(timer);
								$(_this.element).trigger('complete.pressAndHold');
							}
						}, 10);

						$(_this.element).on('mouseup.pressAndHold mouseleave.pressAndHold', function(event) {


							_this.exitTimer(timer);

						});

					}
				
				} 
			});
		},
		exitTimer: function(timer) {
			var _this = this;
			clearTimeout(timer);
			$(this.element).off('mouseup.pressAndHold mouseleave.pressAndHold');
			setTimeout(function() {
				$(".holdButtonProgress").css("left", "-100%");
				$(_this.element).trigger('end.pressAndHold');	

			}, this.settings.progressIndicatorRemoveDelay);
		}
	};

	$.fn[pressAndHold] = function(options) {
		return this.each(function() {
			if (!$.data(this, "plugin_" + pressAndHold)) {
				$.data(this, "plugin_" + pressAndHold, new Plugin(this, options));
			}
		});
	};

})(jQuery, window, document);
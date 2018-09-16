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


/**
 * jQuery alterClass plugin
 *
 * Remove element classes with wildcard matching. Optionally add classes:
 *   $( '#foo' ).alterClass( 'foo-* bar-*', 'foobar' )
 *
 * Copyright (c) 2011 Pete Boere (the-echoplex.net)
 * Free under terms of the MIT license: http://www.opensource.org/licenses/mit-license.php
 *
 */
(function ( $ ) {
    
$.fn.alterClass = function ( removals, additions ) {
    
    var self = this;
    
    if ( removals.indexOf( '*' ) === -1 ) {
        // Use native jQuery methods if there is no wildcard matching
        self.removeClass( removals );
        return !additions ? self : self.addClass( additions );
    }

    var patt = new RegExp( '\\s' + 
            removals.
                replace( /\*/g, '[A-Za-z0-9-_]+' ).
                split( ' ' ).
                join( '\\s|\\s' ) + 
            '\\s', 'g' );

    self.each( function ( i, it ) {
        var cn = ' ' + it.className + ' ';
        while ( patt.test( cn ) ) {
            cn = cn.replace( patt, ' ' );
        }
        it.className = $.trim( cn );
    });

    return !additions ? self : self.addClass( additions );
};

})( jQuery );



function customAlert(msg,duration)
{
 var styler = window.parent.document.createElement("div");
  styler.className = 'timepopup';
 styler.innerHTML = "<div class='tpopup_tagfolder'><p>"+msg+"</p></tagfolder>";
 $("#toppopupbackground", window.parent.document).addClass("display");
 setTimeout(function()
 {
   styler.parentNode.removeChild(styler);
   $("#toppopupbackground", window.parent.document).removeClass("display");

    elementstagsorder(); // activa interacciones tagtickets del directorio (para poder cambiar orden)
    elemetstagdelete(); // activa sistema borrado tags

   
 },duration);
 document.body.appendChild(styler);
}


/* size of an object  */
Object.size = function(obj) { 
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};


/* hexToComplimentary : Converts hex value to HSL, shifts
 * hue by 180 degrees and then converts hex, giving complimentary color
 * as a hex value
 * @param  [String] hex : hex value  
 * @return [String] : complimentary color as hex value
 */
function hexToComplimentary(hex){


    if (hex == "#FFFFFF") {
        return "#000000"; 
    } else if (hex == "#000000") {
        return "#FFFFFF";
    } else if (hex == "#808080") {
        return "#000000";
    } else {

        // Convert hex to rgb
        // Credit to Denis http://stackoverflow.com/a/36253499/4939630
        var rgb = 'rgb(' + (hex = hex.replace('#', '')).match(new RegExp('(.{' + hex.length/3 + '})', 'g')).map(function(l) { return parseInt(hex.length%2 ? l+l : l, 16); }).join(',') + ')';

        // Get array of RGB values
        rgb = rgb.replace(/[^\d,]/g, '').split(',');

        var r = rgb[0], g = rgb[1], b = rgb[2];

        // Convert RGB to HSL
        // Adapted from answer by 0x000f http://stackoverflow.com/a/34946092/4939630
        r /= 255.0;
        g /= 255.0;
        b /= 255.0;
        var max = Math.max(r, g, b);
        var min = Math.min(r, g, b);
        var h, s, l = (max + min) / 2.0;

        if(max == min) {
            h = s = 0;  //achromatic
        } else {
            var d = max - min;
            s = (l > 0.5 ? d / (2.0 - max - min) : d / (max + min));

            if(max == r && g >= b) {
                h = 1.0472 * (g - b) / d ;
            } else if(max == r && g < b) {
                h = 1.0472 * (g - b) / d + 6.2832;
            } else if(max == g) {
                h = 1.0472 * (b - r) / d + 2.0944;
            } else if(max == b) {
                h = 1.0472 * (r - g) / d + 4.1888;
            }
        }

        h = h / 6.2832 * 360.0 + 0;

        // Shift hue to opposite side of wheel and convert to [0-1] value
        h+= 180;
        if (h > 360) { h -= 360; }
        h /= 360;

        // Convert h s and l values into r g and b values
        // Adapted from answer by Mohsen http://stackoverflow.com/a/9493060/4939630
        if(s === 0){
            r = g = b = l; // achromatic
        } else {
            var hue2rgb = function hue2rgb(p, q, t){
                if(t < 0) t += 1;
                if(t > 1) t -= 1;
                if(t < 1/6) return p + (q - p) * 6 * t;
                if(t < 1/2) return q;
                if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            };

            var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var p = 2 * l - q;

            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }

        r = Math.round(r * 255);
        g = Math.round(g * 255); 
        b = Math.round(b * 255);

        // Convert r b and g values to hex
        rgb = b | (g << 8) | (r << 16); 

        return "#" + (0x1000000 | rgb).toString(16).substring(1);
    }

}


function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}
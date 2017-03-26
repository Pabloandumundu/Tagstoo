/* 
* Copyright 2017, Pablo Andueza pabloandumundu@gmail.com

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


$(document).ready(function () {

    window.pasteaction = "copy";

    // seleccion de las pestañas Explore/Search
	$('ul.tabs li').click(function(){

		var tab_id = $(this).attr('data-tab');
		$('ul.tabs li').removeClass('current');
		$('.tab-content').removeClass('current');
		$(this).addClass('current');
		$("#"+tab_id).addClass('current');

	});


    // conmutador paste-copy
    $('#myonoffswitch').on('click', function(){

        if (pasteaction == "copy") {
            pasteaction = "cut";
        } else {
            pasteaction = "copy";
        }

    });


    // Estilos un poco más ajustados para pantallas estrechas
    if ($(window).width() < 1313) {
        $("#undo").removeClass("tooltip-right");
        $("#undo").addClass("tooltip-left")

    }
    $( window ).resize(function() {

        if ($(window).width() < 1313) {
            $("#undo").removeClass("tooltip-right");
            $("#undo").addClass("tooltip-left");
        } else {
            $("#undo").removeClass("tooltip-left");
            $("#undo").addClass("tooltip-right");
        }

        if ($(window).width() < 1267) {
            $("#undo").removeClass("tooltip-left");
            $("#undo").addClass("tooltip-right");
        }

    });    
	

    // para panel de desarrolo //////////\\\\\\\\\\
    $('#explorer').load(function(){ // cuando se carga el iframe explorador

        // panel de desarrollo
        $( "#panelon" ).click(function() {
            $("#explorer").contents().find("#panel").addClass("show");

        });        

    });


});
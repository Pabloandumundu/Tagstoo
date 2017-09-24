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


fs = require('fs-extra');
var AdmZip = require('adm-zip'); // para manejarse con los zip (o los epub que son ficheros zip)

var viewmode = top.explorer.viewmode;  // recogemos el valor viewmode del iframe explorer
// var s = top.explorer.s // el resultado del Sniffr (sistema operativo, etc..)
var Sniffr = require("sniffr");
var agent = navigator.userAgent;
window.s = "";
s = new Sniffr();
s.sniff(agent);


if (!localStorage["autoslideshow"]) {
	window.autoslideshow = "no";
} else {
	window.autoslideshow = localStorage["autoslideshow"]
}

if (!localStorage["autoslideshowtime"]) {
	window.autoslideshowtime = "6";
} else {
	window.autoslideshowtime = localStorage["autoslideshowtime"]
}

var searchviewmode = "1"
var searchorder = "nameasc"
var resultadoscarpetas=[];
var resultadosarchivos=[];
var searchfor="";

$(document).ready(function () {

	// panel de desarrollo ////\\\\
	$( "#paneloff" ).click(function() {
		$("#panel").removeClass("show");
	});
	////////////////////////\\\\\\\\


	// para poder regular anchuras divs
	columnaswidth = [];
	// paneles izquierdo/derecho
	interact('#searchview')

	  .resizable({
		preserveAspectRatio: false,
		edges: { left: false, right: true, bottom: false, top: false }
	  })
	  .on('resizemove', function (event) {

		// se van a convertir los valores en pixeles de las columnas del panel derecho a porcentajes para que al cambiar la anchura del panel cambien las anchuras de las columnas de forma equitativa.
		if (searchviewmode==1){
			var pixelstotales = $('.exploelement').width();

			var pixels = $('.explofolder, .explofile').width();
			columnaswidth[1] = (100 / pixelstotales) * pixels
			$('.explofolder, .explofile').width(''+ columnaswidth[1] + '%');

			pixels = $('.folderelements, .exploext').width();
			columnaswidth[2] = (100 / pixelstotales) * pixels
			$('.folderelements, .exploext').width(''+ columnaswidth[2] + '%');

			pixels = $('.explosize').width();
			columnaswidth[3] = (100 / pixelstotales) * pixels
			$('.explosize').width(''+ columnaswidth[3] + '%');

			pixels = $('.exploelement .tags').width();
			columnaswidth[4] = (100 / pixelstotales) * pixels
			$('.exploelement .tags').width(''+ columnaswidth[4] + '%');

			pixels = $('.lastmod').width();
			columnaswidth[5] = (100 / pixelstotales) * pixels
			$('.lastmod').width(''+ columnaswidth[5] + '%');

			pixels = $('.duration').width();
			columnaswidth[6] = (100 / pixelstotales) * pixels
			$('.duration').width(''+ columnaswidth[6] + '%');
		}

		var originalwidth = $('#searchview').width();
		var nd_originalwidth = $('#locationinfo, #searchdirview-wrapper').width();

		var diference = originalwidth - event.rect.width;
		var nd_newwithd = nd_originalwidth + diference;
		if (nd_newwithd > 400 && nd_newwithd < window.innerWidth - 45) { //esto es para poner un tamaño minimo y máximo
			$('#searchview').width(event.rect.width);
			$('#locationinfo, #searchdirview-wrapper').width(nd_newwithd);
		}


	}); // --end interact #treeview

	// bottom
	interact('#bottomleft')

	  .resizable({
		preserveAspectRatio: false,
		edges: { left: false, right: true, bottom: false, top: false }
	  })
	  .on('resizemove', function (event) {

	  	var originalwidth = $('#bottomleft').width();
		var nd_originalwidth = $('#bottomright').width();

		var diference = originalwidth - event.rect.width;
		var nd_newwithd = nd_originalwidth + diference;
		if (originalwidth > 20 && nd_originalwidth > 80) { //esto es solo para poner un tamño minimo
			$('#bottomleft').width(event.rect.width);
			$('#bottomright').width(nd_newwithd);
		}
		else if (originalwidth <= 20) {
			$('#bottomleft').css("width","25px");
			$('#bottomright').css("width","calc(100% - 45px)");
		}
		else if (nd_originalwidth <= 80) {
			$('#bottomleft').css("width","calc(100% - 105px)");
			$('#bottomright').css("width","95px");
		}
		// hay que poner los dos condicionales de abajo para que no monte
		if ($('#bottomleft').width() <= 20) {
			$('#bottomleft').css("width","25px");
			$('#bottomright').css("width","calc(100% - 45px)");
		}
		if ($('#bottomright').width() <= 80) {
			$('#bottomleft').css("width","calc(100% - 105px)");
			$('#bottomright').css("width","95px");
		}

	  });

	// --fin bottom

	// las diferentes "columnas" del panel derecho
	if (searchviewmode==1){

		interact('.explofolder, .explofile')

			.resizable({
				preserveAspectRatio: false,
				edges: { left: false, right: true, bottom: false, top: false },

				onstart: function (event) {
					originalwidth = $(".explofolder, .explofile").width()
					nd_originalwidth = $(".folderelements, .exploext").width()
					$(".imgmode1").width("16px");
				},
				onend: function (event) {

					// se pasan las anchuras a porcentaje para que si se cambia el tamaño de la ventana mantenga los limites
					var pixelstotales = $('.exploelement').width();

					var pixels = $('.explofolder, .explofile').width();
					columnaswidth[1] = (100 / pixelstotales) * pixels
					$('.explofolder, .explofile').width(''+ columnaswidth[1] + '%');

					pixels = $('.folderelements, .exploext').width();
					columnaswidth[2] = (100 / pixelstotales) * pixels
					$('.folderelements, .exploext').width(''+ columnaswidth[2] + '%');

					pixels = $('.explosize').width();
					columnaswidth[3] = (100 / pixelstotales) * pixels
					$('.explosize').width(''+ columnaswidth[3] + '%');

					pixels = $('.exploelement .tags').width();
					columnaswidth[4] = (100 / pixelstotales) * pixels
					$('.exploelement .tags').width(''+ columnaswidth[4] + '%');

					pixels = $('.lastmod').width();
					columnaswidth[5] = (100 / pixelstotales) * pixels
					$('.lastmod').width(''+ columnaswidth[5] + '%');

					pixels = $('.duration').width();
					columnaswidth[6] = (100 / pixelstotales) * pixels
					$('.duration').width(''+ columnaswidth[6] + '%');
				}

			})

			.on('resizemove', function (event) {

				var diference = originalwidth - event.rect.width;
				var nd_newwidth = nd_originalwidth + diference;

				if (event.rect.width > 15 && nd_newwidth > 15) {

					$(".explofolder, .explofile").width(event.rect.width);
					$(".folderelements, .exploext").width(nd_newwidth);

				}


			});

		interact('.folderelements, .exploext')

			.resizable({
				preserveAspectRatio: false,
				edges: { left: false, right: true, bottom: false, top: false },

				onstart: function (event) {
					originalwidth = $(".folderelements, .exploext").width()
					nd_originalwidth = $(".explosize").width()
					$(".imgmode1").width("16px");
				},
				onend: function (event) {

					// se pasan las anchuras a porcentaje para que si se cambia el tamaño de la ventana mantenga los limites
					var pixelstotales = $('.exploelement').width();

					var pixels = $('.explofolder, .explofile').width();
					columnaswidth[1] = (100 / pixelstotales) * pixels
					$('.explofolder, .explofile').width(''+ columnaswidth[1] + '%');

					pixels = $('.folderelements, .exploext').width();
					columnaswidth[2] = (100 / pixelstotales) * pixels
					$('.folderelements, .exploext').width(''+ columnaswidth[2] + '%');

					pixels = $('.explosize').width();
					columnaswidth[3] = (100 / pixelstotales) * pixels
					$('.explosize').width(''+ columnaswidth[3] + '%');

					pixels = $('.exploelement .tags').width();
					columnaswidth[4] = (100 / pixelstotales) * pixels
					$('.exploelement .tags').width(''+ columnaswidth[4] + '%');

					pixels = $('.lastmod').width();
					columnaswidth[5] = (100 / pixelstotales) * pixels
					$('.lastmod').width(''+ columnaswidth[5] + '%');

					pixels = $('.duration').width();
					columnaswidth[6] = (100 / pixelstotales) * pixels
					$('.duration').width(''+ columnaswidth[6] + '%');
				}

			})
			.on('resizemove', function (event) {

				var diference = originalwidth - event.rect.width;
				var nd_newwidth = nd_originalwidth + diference;

				if (event.rect.width > 15 && nd_newwidth > 15) {

					$(".folderelements, .exploext").width(event.rect.width)
					$(".explosize").width(nd_newwidth);

				}

			});

		interact('.explosize')

			.resizable({
				preserveAspectRatio: false,
				edges: { left: false, right: true, bottom: false, top: false },

				onstart: function (event) {
					originalwidth = $(".explosize").width()
					nd_originalwidth = $(".exploelement .tags").width()
					$(".imgmode1").width("16px");
				},
				onend: function (event) {

					// se pasan las anchuras a porcentaje para que si se cambia el tamaño de la ventana mantenga los limites
					var pixelstotales = $('.exploelement').width();

					var pixels = $('.explofolder, .explofile').width();
					columnaswidth[1] = (100 / pixelstotales) * pixels
					$('.explofolder, .explofile').width(''+ columnaswidth[1] + '%');

					pixels = $('.folderelements, .exploext').width();
					columnaswidth[2] = (100 / pixelstotales) * pixels
					$('.folderelements, .exploext').width(''+ columnaswidth[2] + '%');

					pixels = $('.explosize').width();
					columnaswidth[3] = (100 / pixelstotales) * pixels
					$('.explosize').width(''+ columnaswidth[3] + '%');

					pixels = $('.exploelement .tags').width();
					columnaswidth[4] = (100 / pixelstotales) * pixels
					$('.exploelement .tags').width(''+ columnaswidth[4] + '%');

					pixels = $('.lastmod').width();
					columnaswidth[5] = (100 / pixelstotales) * pixels
					$('.lastmod').width(''+ columnaswidth[5] + '%');

					pixels = $('.duration').width();
					columnaswidth[6] = (100 / pixelstotales) * pixels
					$('.duration').width(''+ columnaswidth[6] + '%');
				}

			})
			.on('resizemove', function (event) {

				var diference = originalwidth - event.rect.width;
				var nd_newwidth = nd_originalwidth + diference;

				if (event.rect.width > 15 && nd_newwidth > 15) {

					$(".explosize").width(event.rect.width)
					$(".exploelement .tags").width(nd_newwidth);

				}

			});

		interact('.exploelement .tags')

			.resizable({
				preserveAspectRatio: false,
				edges: { left: false, right: true, bottom: false, top: false },

				onstart: function (event) {
					originalwidth = $(".exploelement .tags").width()
					nd_originalwidth = $(".lastmod").width()
					$(".imgmode1").width("16px");
				},
				onend: function (event) {

					// se pasan las anchuras a porcentaje para que si se cambia el tamaño de la ventana mantenga los limites
					var pixelstotales = $('.exploelement').width();

					var pixels = $('.explofolder, .explofile').width();
					columnaswidth[1] = (100 / pixelstotales) * pixels
					$('.explofolder, .explofile').width(''+ columnaswidth[1] + '%');

					pixels = $('.folderelements, .exploext').width();
					columnaswidth[2] = (100 / pixelstotales) * pixels
					$('.folderelements, .exploext').width(''+ columnaswidth[2] + '%');

					pixels = $('.explosize').width();
					columnaswidth[3] = (100 / pixelstotales) * pixels
					$('.explosize').width(''+ columnaswidth[3] + '%');

					pixels = $('.exploelement .tags').width();
					columnaswidth[4] = (100 / pixelstotales) * pixels
					$('.exploelement .tags').width(''+ columnaswidth[4] + '%');

					pixels = $('.lastmod').width();
					columnaswidth[5] = (100 / pixelstotales) * pixels
					$('.lastmod').width(''+ columnaswidth[5] + '%');

					pixels = $('.duration').width();
					columnaswidth[6] = (100 / pixelstotales) * pixels
					$('.duration').width(''+ columnaswidth[6] + '%');
				}

			})
			.on('resizemove', function (event) {

				var diference = originalwidth - event.rect.width;
				var nd_newwidth = nd_originalwidth + diference;

				if (event.rect.width > 15 && nd_newwidth > 15) {

					$(".exploelement .tags").width(event.rect.width)
					$(".lastmod").width(nd_newwidth);

				}

			});

		interact('.lastmod')

			.resizable({
				preserveAspectRatio: false,
				edges: { left: false, right: true, bottom: false, top: false },

				onstart: function (event) {
					originalwidth = $(".lastmod").width()
					nd_originalwidth = $(".duration").width()
					$(".imgmode1").width("16px");
				},
				onend: function (event) {

					// se pasan las anchuras a porcentaje para que si se cambia el tamaño de la ventana mantenga los limites
					var pixelstotales = $('.exploelement').width();

					var pixels = $('.explofolder, .explofile').width();
					columnaswidth[1] = (100 / pixelstotales) * pixels
					$('.explofolder, .explofile').width(''+ columnaswidth[1] + '%');

					pixels = $('.folderelements, .exploext').width();
					columnaswidth[2] = (100 / pixelstotales) * pixels
					$('.folderelements, .exploext').width(''+ columnaswidth[2] + '%');

					pixels = $('.explosize').width();
					columnaswidth[3] = (100 / pixelstotales) * pixels
					$('.explosize').width(''+ columnaswidth[3] + '%');

					pixels = $('.exploelement .tags').width();
					columnaswidth[4] = (100 / pixelstotales) * pixels
					$('.exploelement .tags').width(''+ columnaswidth[4] + '%');

					pixels = $('.lastmod').width();
					columnaswidth[5] = (100 / pixelstotales) * pixels
					$('.lastmod').width(''+ columnaswidth[5] + '%');

					pixels = $('.duration').width();
					columnaswidth[6] = (100 / pixelstotales) * pixels
					$('.duration').width(''+ columnaswidth[6] + '%');
				}

			})
			.on('resizemove', function (event) {

				var diference = originalwidth - event.rect.width;
				var nd_newwidth = nd_originalwidth + diference;

				if (event.rect.width > 15 && nd_newwidth > 15) {

					$(".lastmod").width(event.rect.width)
					$(".duration").width(nd_newwidth);

				}

			});

		interact('.duration')

			.resizable({
				preserveAspectRatio: false,
				edges: { left: false, right: true, bottom: false, top: false },

				onstart: function (event) {
					originalwidth = $(".duration").width();
					var x = $(".exploelement").offset();
					rowleftlimit = x.left + $(".exploelement")["0"].scrollWidth - 10;
					$(".imgmode1").width("16px");
				},
				onend: function (event) {

					// se pasan las anchuras a porcentaje para que si se cambia el tamaño de la ventana mantenga los limites
					var pixelstotales = $('.exploelement').width();

					var pixels = $('.explofolder, .explofile').width();
					columnaswidth[1] = (100 / pixelstotales) * pixels
					$('.explofolder, .explofile').width(''+ columnaswidth[1] + '%');

					pixels = $('.folderelements, .exploext').width();
					columnaswidth[2] = (100 / pixelstotales) * pixels
					$('.folderelements, .exploext').width(''+ columnaswidth[2] + '%');

					pixels = $('.explosize').width();
					columnaswidth[3] = (100 / pixelstotales) * pixels
					$('.explosize').width(''+ columnaswidth[3] + '%');

					pixels = $('.exploelement .tags').width();
					columnaswidth[4] = (100 / pixelstotales) * pixels
					$('.exploelement .tags').width(''+ columnaswidth[4] + '%');

					pixels = $('.lastmod').width();
					columnaswidth[5] = (100 / pixelstotales) * pixels
					$('.lastmod').width(''+ columnaswidth[5] + '%');

					pixels = $('.duration').width();
					columnaswidth[6] = (100 / pixelstotales) * pixels
					$('.duration').width(''+ columnaswidth[6] + '%');
				}

			})
			.on('resizemove', function (event) {

				var diference = originalwidth - event.rect.width;

				if (event.rect.width > 15 && event.clientX < rowleftlimit) {

					$(".duration").width(event.rect.width)

				}

			}); // --fin "columnas"


	} // --fin if searchviewmode=1


	// searchviewmode
	$("#searchviewmode").on('change', function() {

		searchviewmode = $(this)["0"].value;
		$("#viewmodenumber").html(searchviewmode + ".");
		readsearchredresults();

		if (searchviewmode==1) {

			interact('.explofolder, .explofile')

				.resizable({
					enabled: true
				})

			interact('.folderelements, .exploext')

				.resizable({
					enabled: true
				})

			interact('.explosize')

				.resizable({
					enabled: true
				})

			interact('.exploelement .tags')

				.resizable({
					enabled: true
				})

			interact('.lastmod')

				.resizable({
					enabled: true
				});

			interact('.duration')

				.resizable({
					enabled: true
				});

		} // --fin if searchviewmode==1

		if (searchviewmode!=1){

			interact('.explofolder, .explofile')

				.resizable({
					enabled: false
				})

			interact('.folderelements, .exploext')

				.resizable({
					enabled: false
				})

			interact('.explosize')

				.resizable({
					enabled: false
				})

			interact('.exploelement .tags')

				.resizable({
					enabled: false
				})

			interact('.lastmod')

				.resizable({
					enabled: false
				});

			interact('.duration')

				.resizable({
					enabled: false
				});

		} // --fin if searchviewmode!=1

	});

	$("#searchorder").on('change', function() {

		searchorder = $(this)["0"].value;
		readsearchredresults();

	});



	$("#selectFolder").on('click', function() {

		 popup('selectfoldersearch');

	});


	// cuando se cambia el tamaño de la pantalla
	$( window ).resize(function() {

		// ponemos las anchuras del panel izquierdo y derecho en porcentajes para que se ajusten al tamaño de la pantalla
		$('#content #treeview').width(''+ 24.8 + '%');
		$('#locationinfo, #dirview-wrapper').width(''+ 74 + '%');
		$('#searchview').width(''+ 24.8 + '%');
		$('#searchdirview-wrapper').width(''+ 74 + '%');
		$('#bottomleft').width('205px');
		$('#bottomright').width('calc(100% - 215px)');

	});

	// generar lista

	$('#tolist').on('click', function() {

		var searchedelements = $(".exploelement");

		if (searchedelements.length > 0) {
			popup('listchoose');
		}

		else {
			alertify.alert("You choosed to create a printable friendly list of searched results, but there are not searched results at the moment.");
		}

		
    	

	})




	// goma de borrar
	window.eraseron = "off";

	$("#eraser img").click(function() {

		var cursoractual = $(".tags > div").css('cursor');

		if (eraseron == "off") {

			$(".tags > div").css("cursor", "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAAWCAYAAAAmaHdCAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4QIFERIkBcGckAAAA2FJREFUOMuNlFtIqmkUhldaXnSYps0QA151YMjAPyEmf/DX0JIug80M1EVz6ES3ETU0SWxKC4O6CbIco4GoIJkhhgmpC0WSopkkJCoCy1Ism8ZOlpWZ71ztf3LbPqy79X3v+3zrWyxWmkajIbvdTiqV6geJRPJ9YWGhRCQSfbG9vf3H5uZmg9vtvqVPiZqamteNjY0IBoN4Hi0tLZDJZK8+5heIxeKskpKS30pLS0kkEiVdms1mqqio+Jdl2c8+CMnKylK2trYSAMrNzU0RTExMpCkUCh8RkUajeRGSXl5ezmZnZ5PL5aJwOEzp6emk1WpJpVLxIqPR+CoQCPw9Pz//tVqtJofDkUypra21NTQ0oLe3l+/F+vo6dDpdUn9CoRBYlrW8WFFfX9/NxcUFZmZm4PF4eNPd3R0GBweTQE6nEwqF4puU/2g0mp8fHx/hcrnQ09ODk5MT3nR5eQmr1crn3d3dWFpaQllZ2VcpoLq6uksA6O/vh9FoTHp9ZWUFi4uLOD4+htPpBADodLoYEVF1dfX/ELlcLh4bGwMAjI6OYnJyMgk0NTWF8fHxpLO2trallGpYlv3u4OAAt7e30Ov1MJvNvMHr9aKjowNPT0/8md/vB8Mwb5735e3kuu7v77G/vw+TyYTd3V0EAgHMzs4CAPR6fVI1NpstJpVKM1IqMhgMVwCwtraGgYEBWCwW3pRIJDA8PMzn4XAYHMf9kgRQq9Ukk8nUVqsVkUgE9fX16OzsxLths9kAAPF4HBzHXQufQw4PDykUCh1eXV3FiKjKYDDQxsYG+f1+YhiG10WjUdrb26OCggKam5sTCF6YG1peXh7yer1hIqL29nY6PT2l6elpXsMwDAWDQSIiKioqShe+C/H5fEREiMViFrFY/JNEIqGcnBxyu92Ul5dH+fn5REQUiURIJBLR6urqh/eEVCp9fXR0xA/d0NAQotEo35uRkREolcqY4H2Aqqoq2tra+r2pqenPRCJBHMfRw8MDdXV18Zrz83MSCAR/Cd8H8fl8pFaryW63zwmFwh8rKys/5ziOHA4HnZ2dEcMw5PV6aWdnp/6jq1OpVFJxcXHR27GPx+MwmUxYWFhAc3NziIgojT4xtFrtt3K5fCAjI+NLj8cjvLm5+fX6+vpNZmbmP/8BN8ZmaONW+JwAAAAASUVORK5CYII='),auto");

			eraseron = "on";

			$("#eraser img").addClass('activated');
			$("#eraseron").addClass("on");

		} else {

			eraseron = "off";

			$(".tags > div").css('cursor','pointer');
			$("#eraser img").removeClass('activated');
			$("#eraseron").removeClass("on");

		}

	});

	// cuando esta seleccionado no color tagstoo se pone gris
	window.colortagstoo = localStorage["colortagstoo"];

	if (window.colortagstoo == "not") {

	    var ls = document.createElement('link');
	    ls.rel="stylesheet";
	    ls.href= "css/version_grey.css";
	    document.getElementsByTagName('head')[0].appendChild(ls);

	}


}); // --fin on document ready



// acceso al popup opciones
window.parent.$('#options').on('click', function() {

    popup('options');

})

// acceso al popup info
window.parent.$('#info').on('click', function() {

    popup('info');

})


setTimeout(function() { // acciones que de realizan pasado un tiempo, cuando las variables y funciones del iframe del explorer hayan sido cargadas y se puedan acceder a ellas.

	window.currentlydatabaseused = localStorage["currentlydatabaseused"];

	if (!localStorage["previewimgonviewmode1"]) {
		window.previewimgonviewmode1 = "no"
	} else {
		window.previewimgonviewmode1 = localStorage["previewimgonviewmode1"]
	}

	if (!localStorage["previewepubonviewmode1"]) {
		window.previewepubonviewmode1 = "no"
	} else {
		window.previewepubonviewmode1 = localStorage["previewepubonviewmode1"]
	}

	window.db = top.explorer.db; // acceso a la base de datos
	window.availabletagforms = top.explorer.availabletagforms;
	window.driveunit = top.explorer.driveunit.trim();

	window.selectedFolder = "\/" ; // valor por defecto
	window.selectedDriveUnit = driveunit; // valor por defecto

	if (driveunit != "") {
		$("#searchin")["0"].children["0"].innerHTML = driveunit;
	} else {
		$("#searchin")["0"].children["0"].innerHTML = "\/";
	}

	drawfootertags();


	// los tags-input del buscador

	$('.taginput').droppable({

		accept: '.footertagticket',

		drop: function( event, ui ) {

			if (ui.draggable["0"].classList.contains("footertagticket")) { // si lo que se intenta droppear es un tag (no es necesario pero lo dejo para tenerlo a mano)

				if ($(this)[0].children.length < 5) {

					// devolvemos tag a posición original
					ui.draggable["0"].style.top = "0px"
					ui.draggable["0"].style.left = "0px"

					// para que no se produzca dropp en el overflow hacemos unas mediciones y ponemos un condicional
					var positiontop = ui.offset.top + 5 //la altura a la que se ha hecho el dropp. (absoluta)
					var wrapperbottom = $('#searchdirview-wrapper').position().top + $('#searchdirview-wrapper').outerHeight(true); // posición del limite inferior del wrapper (absoluta)

					if (positiontop < wrapperbottom) {

						var taginput = $(this)["0"];
						var taganadir = ui.draggable["0"].attributes[1].value;

						if (taginput.getAttribute("value") == "") {

							taginput.setAttribute("value", taganadir);

						} else {

							var arraydetags = taginput.getAttribute("value").split(",");
							var isapreviostag = "no";

							$.each(arraydetags, function(n) {

								if (arraydetags[n] == taganadir) {

									isapreviostag = "yes";
								}

							});

							if (isapreviostag == "no") {

								taginput.setAttribute("value", taginput.getAttribute("value") + "," + taganadir);

							}

						}

						// dibujamos los tags
						arraydetags = taginput.getAttribute("value").split(',');

						var tagsdivs = "";
						for(var k = 0; k < arraydetags.length; k += 1){ //recorremos el array
							tagsdivs += "<div class='tagticket' value='"+ arraydetags[k] +"'>" + arraydetags[k] +  "</div>" ;
						};
						taginput.innerHTML = tagsdivs;

						// para aplicarles los estilos a los tags hay que recurrir a la bd
						var trans2 = db.transaction(["tags"], "readonly")
						var objectStore2 = trans2.objectStore("tags")

						var taginputtags = $(this)["0"].children; // los tagtickets del taginput

						var req2 = objectStore2.openCursor();

						req2.onerror = function(event) {
							console.log("error: " + event);
						};
						req2.onsuccess = function(event) {
							var cursor2 = event.target.result;
							if (cursor2) {
								$.each(taginputtags, function(n) {

									if (cursor2.value.tagid == taginputtags[n].attributes[1].value) {

										var color = "#" + cursor2.value.tagcolor;
										var complecolor = hexToComplimentary(color);

										taginputtags[n].className += " small " + cursor2.value.tagform;
										taginputtags[n].setAttribute("value", cursor2.value.tagid);
										taginputtags[n].setAttribute("style", "background-color: #" + cursor2.value.tagcolor + ";" + "color: " + complecolor + ";")
										taginputtags[n].innerHTML = cursor2.value.tagtext;

									}

								});

								cursor2.continue();

							}

						};

						trans2.oncomplete = function(event) {

						}

					};

				}
		    	else {

		    		alertify.alert("Maximum 5 tags are permitted for each input field.");
		    	 	ui.draggable.draggable('option','revert',true);
		    	}

		    }

		    var ajustartamanio = $("#bottom").width() - $('#bottomleft').width() - 20
		    $("#bottomright").css("width", ajustartamanio + "px");

		}

	});

	// boton limpiar campos (undo)
	$( ".cleartagfield" ).click(function() {

		var taginput = $(this).prev(".taginput")["0"]

		var taginputvalue = taginput.getAttribute("value");

		taginputvalue = taginputvalue.split(",");

		if (taginputvalue[0]!="") { //si hay algun tag
			taginputvalue = taginputvalue.slice(0,-1); //quitar el último
			taginput.setAttribute("value", taginputvalue);
		}

		if (taginput.hasChildNodes()){
			taginput.removeChild(taginput.lastChild);
		}

	});



	$('.nottaginput').droppable({

		accept: '.footertagticket',

		drop: function( event, ui ) {

			if (ui.draggable["0"].classList.contains("footertagticket")) { // si lo que se intenta droppear es un tag (no es necesario pero lo dejo para tenerlo a mano)

				if ($(this)[0].children.length < 1) {

					// devolvemos tag a posición original
					ui.draggable["0"].style.top = "0px"
					ui.draggable["0"].style.left = "0px"

					// para que no se produzca dropp en el overflow hacemos unas mediciones y ponemos un condicional
					var positiontop = ui.offset.top + 5 //la altura a la que se ha hecho el dropp. (absoluta)
					var wrapperbottom = $('#searchdirview-wrapper').position().top + $('#searchdirview-wrapper').outerHeight(true); // posición del limite inferior del wrapper (absoluta)

					if (positiontop < wrapperbottom) {

						var nottaginput = $(this)["0"];
						var taganadir = ui.draggable["0"].attributes[1].value;

						if (nottaginput.getAttribute("value") == "") {

							nottaginput.setAttribute("value", taganadir);

						} else {

							var arraydetags = nottaginput.getAttribute("value").split(",");
							var isapreviostag = "no";

							$.each(arraydetags, function(n) {

								if (arraydetags[n] == taganadir) {

									isapreviostag = "yes";
								}

							});

							if (isapreviostag == "no") {

								nottaginput.setAttribute("value", nottaginput.getAttribute("value") + "," + taganadir);

							}

						}

						// dibujamos los tags
						arraydetags = nottaginput.getAttribute("value").split(',');

						var tagsdivs = "";
						for(var k = 0; k < arraydetags.length; k += 1){ //recorremos el array
							tagsdivs += "<div class='tagticket' value='"+ arraydetags[k] +"'>" + arraydetags[k] +  "</div>" ;
						};
						nottaginput.innerHTML = tagsdivs;

						// para aplicarles los estilos a los tags hay que recurrir a la bd
						var trans2 = db.transaction(["tags"], "readonly")
						var objectStore2 = trans2.objectStore("tags")

						var nottaginputtags = $(this)["0"].children; // los tagtickets del taginput

						var req2 = objectStore2.openCursor();

						req2.onerror = function(event) {
							console.log("error: " + event);
						};
						req2.onsuccess = function(event) {
							var cursor2 = event.target.result;
							if (cursor2) {

								$.each(nottaginputtags, function(n) {

									if (cursor2.value.tagid == nottaginputtags[n].attributes[1].value) {

										var color = "#" + cursor2.value.tagcolor;
										var complecolor = hexToComplimentary(color);

										nottaginputtags[n].className += " small " + cursor2.value.tagform;
										nottaginputtags[n].setAttribute("value", cursor2.value.tagid);
										nottaginputtags[n].setAttribute("style", "background-color: #" + cursor2.value.tagcolor + ";" + "color: " + complecolor + ";")
										nottaginputtags[n].innerHTML = cursor2.value.tagtext;

									}

								});

								cursor2.continue();

							}

						};

						trans2.oncomplete = function(event) {

						}

					};

				}
		    	else {

		    		alertify.alert("Only 1 tag is permitted in this input.");
		    	 	ui.draggable.draggable('option','revert',true);
		    	}

		    }

		    var ajustartamanio = $("#bottom").width() - $('#bottomleft').width() - 20
		    $("#bottomright").css("width", ajustartamanio + "px");

		}

	});


	$( ".clearnottagfield" ).click(function() {

		// var nottaginput = $(this).prev(".nottaginput")["0"] // no funciona bien asi que utilizo js puro:
		var nottaginput = $(this).parent().find('.nottaginput')[0];
		nottaginput.setAttribute("value", "");
		nottaginput.innerHTML = "";

	});




	// Search

	$( "#searchaction" ).click(function() {

		window.eraseron = "off";
		$(".tags > div").css('cursor','pointer');
		$("#eraser img").removeClass('activated');
		$("#eraseron").removeClass("on");

		window.taggroup= [];
		window.nottaggroup= []; // para los tags que no devén estar

		window.resultsfolders = [];
		window.resultsfolderstemp = [];
		window.resultadopreviovalido = [];
		window.tagsdelelemento = [];
		window.arraydetagsabuscar = [];

		window.numerodecamposrellenados = 0;
		window.numerodecamposrellenadosno = 0; // para los tags que no devén estar

		window.concentradorresultadoscarpetas = [];
		window.concentradorresultadosarchivos = [];

		window.resultsfiles = [];
		window.resultsfilestemp = [];

		window.resultadosarchivos=[];
		window.resultadoscarpetas=[];

		$.each ($(".taginput"), function(u) {

			taggroup[u] = $(".taginput:eq("+u+")")["0"].attributes[1].value
			if (taggroup[u] != "" ) {

				numerodecamposrellenados ++;
			}

		});


		$.each ($(".nottaginput"), function(u) {

			nottaggroup[u] = $(".nottaginput:eq("+u+")")["0"].attributes[1].value

			if (nottaggroup[u] != "" ) {

				numerodecamposrellenadosno ++;
			}

		});

		window.searchfor = $("input:radio[name ='searchfor']:checked").val(); // folder and files, folders or files

		if (numerodecamposrellenados > 0) {

			$('#searchdirectoryview').html("");

			$('#numeroderesultadosarchivos').html("");
			$('#numeroderesultadoscarpetas').html("");

			// buscar en carpetas
			if (searchfor == "folders") {

				searchinfolders();

			}

			// buscar en archivos
			else if (searchfor == "files") {

				searchinfiles();

			}

			// buscar en carpetas y archivos
			else if (searchfor == "foldersandfiles") {

				$.when(searchinfolders()).done(searchinfiles());

			}

		}
		// cuando son busquedas donde solo hay definidos tags que no deven incluir los resultados
		else if (numerodecamposrellenados == 0 && numerodecamposrellenadosno > 0) {

			if (searchfor == "files") {

				searchnoinfiles();

			}

			else if (searchfor == "folders") {

				searchnoinfolders()
			}

			else if (searchfor == "foldersandfiles") {

				$.when(searchnoinfolders()).done(searchnoinfiles());

			}

		}

	});

}, 500);


// botón añadir nuevo tag input field

function addtagfield(thisbutton){

	$(thisbutton).next('span').remove() //se quita la x de eliminar campo para que no se acumule
	$(thisbutton).remove(); //se quita boton previamente existente

	var lastcleartagbutton = $( ".cleartagfield" ).last();

	var htmltoadd = '<div class="searchinput"><span>..or tag(s): (max 5 tags)</span><div class="taginput" value=""></div><a class="cleartagfield small button red">Remove last</a><a class="addtagfield small button green" onclick="addtagfield(this)">Add tags input field</a> <span class="removefield" onclick="removetagfield(this)"><img src="/img/eliminar_input.png"></span></div>';

	$(htmltoadd).insertAfter(lastcleartagbutton);


	// Aquí hay que volver a activar el dragg and drop en los nuevos input añadidos
	$('.taginput').droppable({

		accept: '.footertagticket',

		drop: function( event, ui ) {

			if (ui.draggable["0"].classList.contains("footertagticket")) { // si lo que se intenta droppear es un tag (no es necesario pero lo dejo para tenerlo a mano)

				if ($(this)[0].children.length < 5) {

					// devolvemos tag a posición original
					ui.draggable["0"].style.top = "0px"
					ui.draggable["0"].style.left = "0px"

					// para que no se produzca dropp en el overflow hacemos unas mediciones y ponemos un condicional
					var positiontop = ui.offset.top + 5 //la altura a la que se ha hecho el dropp. (absoluta)
					var wrapperbottom = $('#searchdirview-wrapper').position().top + $('#searchdirview-wrapper').outerHeight(true); // posición del limite inferior del wrapper (absoluta)

					if (positiontop < wrapperbottom) {

						var taginput = $(this)["0"];
						var taganadir = ui.draggable["0"].attributes[1].value;

						if (taginput.getAttribute("value") == "") {

							taginput.setAttribute("value", taganadir);

						} else {

							var arraydetags = taginput.getAttribute("value").split(",");
							var isapreviostag = "no";

							$.each(arraydetags, function(n) {

								if (arraydetags[n] == taganadir) {

									isapreviostag = "yes";
								}

							});

							if (isapreviostag == "no") {

								taginput.setAttribute("value", taginput.getAttribute("value") + "," + taganadir);

							}

						}

						// dibujamos los tags
						arraydetags = taginput.getAttribute("value").split(',');

						var tagsdivs = "";
						for(var k = 0; k < arraydetags.length; k += 1){ //recorremos el array
							tagsdivs += "<div class='tagticket' value='"+ arraydetags[k] +"'>" + arraydetags[k] +  "</div>" ;
						};
						taginput.innerHTML = tagsdivs;

						// para aplicarles los estilos a los tags hay que recurrir a la bd
						var trans2 = db.transaction(["tags"], "readonly")
						var objectStore2 = trans2.objectStore("tags")

						var taginputtags = $(this)["0"].children; // los tagtickets del taginput

						var req2 = objectStore2.openCursor();

						req2.onerror = function(event) {
							console.log("error: " + event);
						};
						req2.onsuccess = function(event) {
							var cursor2 = event.target.result;
							if (cursor2) {
								$.each(taginputtags, function(n) {

									if (cursor2.value.tagid == taginputtags[n].attributes[1].value) {

										var color = "#" + cursor2.value.tagcolor;
										var complecolor = hexToComplimentary(color);

										taginputtags[n].className += " small " + cursor2.value.tagform;
										taginputtags[n].setAttribute("value", cursor2.value.tagid);
										taginputtags[n].setAttribute("style", "background-color: #" + cursor2.value.tagcolor + ";" + "color: " + complecolor + ";")
										taginputtags[n].innerHTML = cursor2.value.tagtext;

									}

								});

								cursor2.continue();

							}

						};

						trans2.oncomplete = function(event) {

						}

					};

				}
		    	else {

		    		alertify.alert("Maximum 5 tags are permitted for each input field.");
		    	 	ui.draggable.draggable('option','revert',true);
		    	}

		    }

		    var ajustartamanio = $("#bottom").width() - $('#bottomleft').width() - 20
		    $("#bottomright").css("width", ajustartamanio + "px");

		}

	});

	// boton limpiar campos (nuevos botones)
	$( ".cleartagfield" ).unbind(); // para que no se acumule
	$( ".cleartagfield" ).click(function() {

		var taginput = $(this).prev(".taginput")["0"];

		var taginputvalue = taginput.getAttribute("value");
		taginputvalue = taginputvalue.split(",");

		if (taginputvalue[0]!="") { //si hay algun tag
			taginputvalue = taginputvalue.slice(0,-1); //quitar el último
			taginput.setAttribute("value", taginputvalue);
		}

		if (taginput.hasChildNodes()){
			taginput.removeChild(taginput.lastChild);
		}

	});

};


function addnottagfield(thisbutton){

	$(thisbutton).next('span').remove() //se quita la x de eliminar campo para que no se acumule
	$(thisbutton).remove(); //se quita boton previamente existente

	var lastclearnottagbutton = $( ".clearnottagfield" ).last();

	var htmltoadd = '<div class="searchnotinput"><span>..and do not have the tag:</span><div class="nottaginput" value=""></div><br><a class="clearnottagfield small button red">Remove last</a><a class="addtagfield small button green" onclick="addnottagfield(this)">Add input field</a> <span class="removefield" onclick="removenottagfield(this)"><img src="/img/eliminar_input.png"></span></div>';

	$(htmltoadd).insertAfter(lastclearnottagbutton);

	// Aquí hay que volver a activar el dragg and drop en los nuevos input añadidos
	$('.nottaginput').droppable({

		accept: '.footertagticket',

		drop: function( event, ui ) {

			if (ui.draggable["0"].classList.contains("footertagticket")) { // si lo que se intenta droppear es un tag (no es necesario pero lo dejo para tenerlo a mano)

				if ($(this)[0].children.length < 1) {

					// devolvemos tag a posición original
					ui.draggable["0"].style.top = "0px"
					ui.draggable["0"].style.left = "0px"

					// para que no se produzca dropp en el overflow hacemos unas mediciones y ponemos un condicional
					var positiontop = ui.offset.top + 5 //la altura a la que se ha hecho el dropp. (absoluta)
					var wrapperbottom = $('#searchdirview-wrapper').position().top + $('#searchdirview-wrapper').outerHeight(true); // posición del limite inferior del wrapper (absoluta)

					if (positiontop < wrapperbottom) {

						var nottaginput = $(this)["0"];
						var taganadir = ui.draggable["0"].attributes[1].value;

						if (nottaginput.getAttribute("value") == "") {

							nottaginput.setAttribute("value", taganadir);

						} else {

							var arraydetags = nottaginput.getAttribute("value").split(",");
							var isapreviostag = "no";

							$.each(arraydetags, function(n) {

								if (arraydetags[n] == taganadir) {

									isapreviostag = "yes";
								}

							});

							if (isapreviostag == "no") {

								nottaginput.setAttribute("value", nottaginput.getAttribute("value") + "," + taganadir);

							}

						}

						// dibujamos los tags
						arraydetags = nottaginput.getAttribute("value").split(',');

						var tagsdivs = "";
						for(var k = 0; k < arraydetags.length; k += 1){ //recorremos el array
							tagsdivs += "<div class='tagticket' value='"+ arraydetags[k] +"'>" + arraydetags[k] +  "</div>" ;
						};
						nottaginput.innerHTML = tagsdivs;

						// para aplicarles los estilos a los tags hay que recurrir a la bd
						var trans2 = db.transaction(["tags"], "readonly")
						var objectStore2 = trans2.objectStore("tags")

						var nottaginputtags = $(this)["0"].children; // los tagtickets del taginput

						var req2 = objectStore2.openCursor();

						req2.onerror = function(event) {
							console.log("error: " + event);
						};
						req2.onsuccess = function(event) {
							var cursor2 = event.target.result;
							if (cursor2) {

								$.each(nottaginputtags, function(n) {

									if (cursor2.value.tagid == nottaginputtags[n].attributes[1].value) {

										var color = "#" + cursor2.value.tagcolor;
										var complecolor = hexToComplimentary(color);

										nottaginputtags[n].className += " small " + cursor2.value.tagform;
										nottaginputtags[n].setAttribute("value", cursor2.value.tagid);
										nottaginputtags[n].setAttribute("style", "background-color: #" + cursor2.value.tagcolor + ";" + "color: " + complecolor + ";")
										nottaginputtags[n].innerHTML = cursor2.value.tagtext;

									}

								});

								cursor2.continue();

							}

						};

						trans2.oncomplete = function(event) {

						}

					};

				}
		    	else {

		    		alertify.alert("Only 1 tag is permitted in this input.");
		    	 	ui.draggable.draggable('option','revert',true);
		    	}

		    }

		    var ajustartamanio = $("#bottom").width() - $('#bottomleft').width() - 20
		    $("#bottomright").css("width", ajustartamanio + "px");

		}

	});

	// boton limpiar campos (nuevos botones)
	$( ".clearnottagfield" ).unbind(); // para que no se acumule
	$( ".clearnottagfield" ).click(function() {

		// var nottaginput = $(this).prev(".nottaginput")  // no funciona así, asi que utilizo :
		var nottaginput = $(this).parent().find('.nottaginput')[0];
		nottaginput.setAttribute("value", "");
		nottaginput.innerHTML = "";

	});

};


function removetagfield(removebutton) {

	var removebuttonpreviosfieldclear = removebutton.parentElement.previousSibling;

	if ($(".searchinput").length == 2) { // si solo queda este y el 1er field no se le añade la x para borrar

		var htmltoadd = '<a class="addtagfield small button green" onclick="addtagfield(this)">Add tags input field</a>';
		$(htmltoadd).insertAfter(removebuttonpreviosfieldclear);

	} else { // si quedan más campos se le añade la x

		var htmltoadd = '<a class="addtagfield small button green" onclick="addtagfield(this)">Add tags input field</a> <span class="removefield" onclick="removetagfield(this)"><img src="/img/eliminar_input.png"></span>';
		$(htmltoadd).insertAfter(removebuttonpreviosfieldclear);

	}

	// se quita el div
	var parentelement = removebutton.parentElement;
	parentelement.parentNode.removeChild(parentelement);

}


function removenottagfield(removebutton) {

	var removebuttonpreviosfieldclear = removebutton.parentElement.previousSibling

	if ($(".searchnotinput").length == 2) { // si solo queda este y el 1er field no se le añade la x para borrar

		var htmltoadd = '<a class="addtagfield small button green" onclick="addnottagfield(this)">Add input field</a>';
		$(htmltoadd).insertAfter(removebuttonpreviosfieldclear);

	} else { // si quedan más campos se le añade la x

		var htmltoadd = '<a class="addtagfield small button green" onclick="addnottagfield(this)">Add input field</a> <span class="removefield" onclick="removenottagfield(this)"><img src="/img/eliminar_input.png"></span>';
		$(htmltoadd).insertAfter(removebuttonpreviosfieldclear);

	}

	// se quita el div
	var parentelement = removebutton.parentElement;
	parentelement.parentNode.removeChild(parentelement);

}



function getalltags(callback) {

	var trans = db.transaction(["tags"], "readonly");
	var store = trans.objectStore("tags");
	var items = [];

	trans.oncomplete = function(evt) {
		callback(items);
	};

	var cursorRequest = store.openCursor();

	cursorRequest.onerror = function(error) {
		console.log(error);
	};

	cursorRequest.onsuccess = function(evt) {
		var cursor = evt.target.result;
		if (cursor) {
			items.push(cursor.value);
			cursor.continue();
		}
	};
}

function SortTagsByPosAsc(a, b){
	return ((+a.tagpos < +b.tagpos) ? -1 : ((+a.tagpos > +b.tagpos) ? 1 : 0));
}

function drawfootertags() {

	getalltags(function (items) {

		items.sort(SortTagsByPosAsc);
		var len = items.length;

		var footertagsdivspar = "";
		var footertagsdivsinpar = "";

		for (var i = 0; i < len; i += 1) {

			if (items[i].tagpos % 2 == 0) { // si la posición es un numero par

				footertagsdivspar += "<div class='footertagticket' value='"+ items[i].tagid + "' position='" + items[i].tagpos + "'> " + items[i].tagid +  "</div>" ;

			} else { // si la posición es impar

				footertagsdivsinpar += "<div class='footertagticket' value='"+ items[i].tagid + "' position='" + items[i].tagpos + "'> " + items[i].tagid +  "</div>" ;

			}

		}

		// se añade el html (solo con los id)
		$( "#tagpar" ).html(footertagsdivspar);
		$( "#taginpar" ).html(footertagsdivsinpar);

		// ahora se dibujarán las etiquetas para cada uno de los divs con id
		var trans = db.transaction(["tags"], "readonly");
		var objectStore = trans.objectStore("tags");

		var tagdelfooter = $("#bottom .footertagticket");
		$.each(tagdelfooter, function(i) {

			var req = objectStore.openCursor();

			req.onerror = function(event) {

				console.log("error: " + event);

			};

			req.onsuccess = function(event) {

				var cursor = event.target.result;

				if (cursor) {

					if (cursor.value.tagid == tagdelfooter[i].attributes[1].nodeValue) {

						var color = "#" + cursor.value.tagcolor;
						var complecolor = hexToComplimentary(color);

						tagdelfooter[i].className += " small " + cursor.value.tagform;
						tagdelfooter[i].setAttribute("value", cursor.value.tagid);
						tagdelfooter[i].setAttribute("style", "background-color: #" + cursor.value.tagcolor + ";" + "color: " + complecolor + ";")
						tagdelfooter[i].innerHTML = cursor.value.tagtext;

					};

				cursor.continue();

				}

			};

			trans.oncomplete = function(e) {

				footertagsinteractions(); // activa eventos de arrastre para tags de footer

			}

		});

	});

};


function startedDrag() {

    $('#bottom').css("overflow-y", "visible");
    $(".ui-draggable-dragging").css("z-index", "100");
}

function stoppedDrag() {

    $("#bottom").css("overflow-y", "scroll");
}

function footertagsinteractions(){

	$(".footertagticket").draggable({
		revert: 'invalid',
		revertDuration: 600,
		zIndex: 9999,
		start: startedDrag,
		stop: stoppedDrag
	});

	$('.footertagticket').droppable({

		accept: '.footertagticket',
		drop: function( event, ui ) {

			var draggposorig = ui.draggable["0"].attributes[2].value; // la posición original del dragg
			var draggid = ui.draggable["0"].attributes[1].value; // el id del dragg
			var droppposorig = $(this).attr("position"); // la posición original del dropp
			var droppid = $(this).attr("value"); // el id del dropp


			// le ponemos la posición del dropp al dragg	utilizando el id
			var trans = db.transaction(["tags"], "readwrite");
			var objectStore = trans.objectStore("tags");
			var req = objectStore.openCursor();

			req.onerror = function(event) {

				console.log("error: " + event);

			};

			req.onsuccess = function(event) {

				var cursor = event.target.result;

				if (cursor) {

					if (cursor.value.tagid == draggid) {

						var updateData = cursor.value;
						updateData.tagpos = droppposorig;
						cursor.update(updateData)

					}

					cursor.continue();

				}

			}

			// le ponemos la posición del dragg al drop utilizando el id
			trans.oncomplete = function(e) {

				var trans = db.transaction(["tags"], "readwrite");
				var objectStore = trans.objectStore("tags");
				var req = objectStore.openCursor();

				req.onerror = function(event) {

					console.log("error: " + event);

				};

				req.onsuccess = function(event) {

					var cursor = event.target.result;

					if (cursor) {

						if (cursor.value.tagid == droppid) {

							var updateData = cursor.value;
							updateData.tagpos = draggposorig;
							cursor.update(updateData)

						}

						cursor.continue();

					}

				}

				trans.oncomplete = function(e) {

					drawfootertags();
					top.explorer.drawfootertags();

				}

			}

		}

	});

}




function searchinfolders() {

	var totalfoldergrouptosearch = 0;
	var actualfoldergrouptosearch="";

	$.each (taggroup, function(t) {

		totalfoldergrouptosearch ++;

	})

	$.each (taggroup, function(t) {

		actualfoldergrouptosearch = t;

		$('#numeroderesultadoscarpetas').html("Searching folders ...");

		resultsfolders[t] = [];
		resultsfolderstemp[t] = [];

		if (taggroup[t] != "") {

			arraydetagsabuscar[t] = taggroup[t].split(",");

			// se busca el 1er tag

			var trans = db.transaction(["folders"], "readonly")
			var objectStore = trans.objectStore("folders")
			var req = objectStore.openCursor();

			req.onerror = function(event) {

				console.log("error: " + event);
			};

			req.onsuccess = function(event) {

				var cursor = event.target.result;

				if(cursor){

					if (selectedFolder == "\/") {
						selectedFolder = ""
					}

					if (cursor.value.folder == selectedFolder || cursor.value.folder.substring(0, selectedFolder.length+1) == selectedFolder+"\/") { // carpetas que comienzan con el string de la carpeta a partir de la cual se busca (inclusive)

						tagsdelelemento[t] = cursor.value.foldertags;
						var foldertoad = [];
						var coincidetag = "no";

						if (typeof tagsdelelemento[t] == "string") {
							tagsdelelemento[t] = tagsdelelemento[t].split(",");
						}

						$.each (tagsdelelemento[t], function(u) {

							if (tagsdelelemento[t][u] == arraydetagsabuscar[t][0]) {

								coincidetag = "si"
							}

						});

						if (coincidetag == "si") {

							if (resultsfolders[t].length == 0) { // si no hay resultados previos

								foldertoad.folderid = cursor.value.folderid
								foldertoad.name = cursor.value.folder
								foldertoad.tagsid = cursor.value.foldertags

								// console.log("coincide el primer tag con: " + cursor.value.folder)

								resultsfolderstemp[t].push(foldertoad);

							}

						}

					}

					cursor.continue();

				}

			}

			trans.oncomplete = function(event) {

				$.each (resultsfolderstemp[t], function(u) {

					resultsfolders[t].push(resultsfolderstemp[t][u]);

				});

				if (arraydetagsabuscar[t].length < 2) {

					concetradoresultadoscarpetas(resultsfolders[t]);

				}

				// a por el 2º tag

				else if (arraydetagsabuscar[t].length >= 2) { // si hay al menos 2 tags para buscar

					resultadopreviovalido[t] = [];

					if (resultsfolders[t].length > 0) { // si  hay resultados previos
						$.each (resultsfolders[t], function(u) {

							resultadopreviovalido[t][u] = "no"; // valor por defecto

						});
					}

					var trans = db.transaction(["folders"], "readonly")
					var objectStore = trans.objectStore("folders")
					var req = objectStore.openCursor();

					req.onerror = function(event) {

						console.log("error: " + event);
					};

					req.onsuccess = function(event) {

						if (resultsfolders[t].length > 0) { // si hay resultados previos (si no, no se añade nada pues no tiene todos los tags)

							var cursor = event.target.result;

							if(cursor){

								if (selectedFolder == "\/") {
									selectedFolder = ""
								}

								if (cursor.value.folder == selectedFolder || cursor.value.folder.substring(0, selectedFolder.length+1) == selectedFolder+"\/") { // carpetas que comienzan con el string de la carpeta a partir de la cual se busca (inclusive)

									tagsdelelemento[t] = cursor.value.foldertags;

									var coincidetag = "no";

									if (typeof tagsdelelemento[t] == "string") {
										tagsdelelemento[t] = tagsdelelemento[t].split(",");
									}
									$.each (tagsdelelemento[t], function(u) {

										if (tagsdelelemento[t][u] == arraydetagsabuscar[t][1]) { // el segundo tag a buscar

											coincidetag = "si"
										}

									});

									if (coincidetag == "si") {

										// console.log("coincide segundo tag con: " + cursor.value.folder)

										$.each (resultsfolders[t], function(u) {

											if (resultsfolders[t][u].folderid == cursor.value.folderid) {

												window.resultadopreviovalido[t][u] = "yes"; // al tener todos los tags se respeta el elemento
											}

										});

									}

								}

								cursor.continue();

							}

						}

					}

					trans.oncomplete = function(event) {

						resultsfolderstemp[t] = jQuery.extend({}, resultsfolders[t])

						$.each (resultsfolders[t], function(u) {

							if (resultadopreviovalido[t][u] == "no") {

								resultsfolderstemp[t][u] = undefined;
							}

						})

						resultsfolders[t]=[];

						$.each (resultsfolderstemp[t], function(u) {

							if (resultsfolderstemp[t][u] != undefined) {
								resultsfolders[t].push(resultsfolderstemp[t][u]);
							}

						})

						if (arraydetagsabuscar[t].length < 3) {

							concetradoresultadoscarpetas(resultsfolders[t]);

						}

						// a por el 3er tag

						else if (arraydetagsabuscar[t].length >= 3) { // si hay al menos 3 tags para buscar

							resultadopreviovalido[t] = [];

							if (resultsfolders[t].length > 0) { // si  hay resultados previos
								$.each (resultsfolders[t], function(u) {

									resultadopreviovalido[t][u] = "no"; // valor por defecto

								});
							}

							var trans = db.transaction(["folders"], "readonly")
							var objectStore = trans.objectStore("folders")
							var req = objectStore.openCursor();

							req.onerror = function(event) {

								console.log("error: " + event);
							};

							req.onsuccess = function(event) {

								if (resultsfolders[t].length > 0) { // si hay resultados previos (si no, no se añade nada pues no tiene todos los tags)

									var cursor = event.target.result;

									if(cursor){

										if (selectedFolder == "\/") {
											selectedFolder = ""
										}

										if (cursor.value.folder == selectedFolder || cursor.value.folder.substring(0, selectedFolder.length+1) == selectedFolder+"\/") { // carpetas que comienzan con el string de la carpeta a partir de la cual se busca (inclusive)

											tagsdelelemento[t] = cursor.value.foldertags;

											var coincidetag = "no";

											if (typeof tagsdelelemento[t] == "string") {
												tagsdelelemento[t] = tagsdelelemento[t].split(",");
											}
											$.each (tagsdelelemento[t], function(u) {

												if (tagsdelelemento[t][u] == arraydetagsabuscar[t][2]) { // el segundo tag a buscar

													coincidetag = "si";
												}

											});


											if (coincidetag == "si") {

												// console.log("coincide tercer tag con: " + cursor.value.folder)

												$.each (resultsfolders[t], function(u) {

													if (resultsfolders[t][u].folderid == cursor.value.folderid) {

														window.resultadopreviovalido[t][u] = "yes"; // al tener todos los tags se respeta el elemento

													}

												});

											}

										}

										cursor.continue();

									}

								}

							}

							trans.oncomplete = function(event) {

								resultsfolderstemp[t] = jQuery.extend({}, resultsfolders[t])

								$.each (resultsfolders[t], function(u) {

									if (resultadopreviovalido[t][u] == "no") {

										resultsfolderstemp[t][u] = undefined;
									}

								})

								resultsfolders[t]=[];

								$.each (resultsfolderstemp[t], function(u) {

									if (resultsfolderstemp[t][u] != undefined) {
										resultsfolders[t].push(resultsfolderstemp[t][u]);
									}

								})

								if (arraydetagsabuscar[t].length < 4) {

									concetradoresultadoscarpetas(resultsfolders[t]);

								}

								// a por el 4to tag

								else if (arraydetagsabuscar[t].length >= 4) { // si hay al menos 4 tags para buscar

									resultadopreviovalido[t] = [];

									if (resultsfolders[t].length > 0) { // si  hay resultados previos
										$.each (resultsfolders[t], function(u) {

											resultadopreviovalido[t][u] = "no"; // valor por defecto

										});
									}

									var trans = db.transaction(["folders"], "readonly")
									var objectStore = trans.objectStore("folders")
									var req = objectStore.openCursor();

									req.onerror = function(event) {

										console.log("error: " + event);
									};

									req.onsuccess = function(event) {

										if (resultsfolders[t].length > 0) { // si hay resultados previos (si no, no se añade nada pues no tiene todos los tags)

											var cursor = event.target.result;

											if(cursor){

												if (selectedFolder == "\/") {
													selectedFolder = ""
												}

												if (cursor.value.folder == selectedFolder || cursor.value.folder.substring(0, selectedFolder.length+1) == selectedFolder+"\/") { // carpetas que comienzan con el string de la carpeta a partir de la cual se busca (inclusive)

													tagsdelelemento[t] = cursor.value.foldertags;

													var coincidetag = "no";

													if (typeof tagsdelelemento[t] == "string") {
														tagsdelelemento[t] = tagsdelelemento[t].split(",");
													}
													$.each (tagsdelelemento[t], function(u) {

														if (tagsdelelemento[t][u] == arraydetagsabuscar[t][3]) { // el tercer tag a buscar

															coincidetag = "si";
														}

													});


													if (coincidetag == "si") {

														// console.log("coincide tercer tag con: " + cursor.value.folder)

														$.each (resultsfolders[t], function(u) {

															if (resultsfolders[t][u].folderid == cursor.value.folderid) {

																window.resultadopreviovalido[t][u] = "yes"; // al tener todos los tags se respeta el elemento

															}

														});

													}

												}

												cursor.continue();

											}

										}

									}

									trans.oncomplete = function(event) {

										resultsfolderstemp[t] = jQuery.extend({}, resultsfolders[t])

										$.each (resultsfolders[t], function(u) {

											if (resultadopreviovalido[t][u] == "no") {

												resultsfolderstemp[t][u] = undefined;
											}

										})

										resultsfolders[t]=[];

										$.each (resultsfolderstemp[t], function(u) {

											if (resultsfolderstemp[t][u] != undefined) {
												resultsfolders[t].push(resultsfolderstemp[t][u]);
											}

										})

										if (arraydetagsabuscar[t].length < 5) {

											concetradoresultadoscarpetas(resultsfolders[t]);

										}

										// a por el 5º tag

										else if (arraydetagsabuscar[t].length == 5) { // si hay al menos 4 tags para buscar

											resultadopreviovalido[t] = [];

											if (resultsfolders[t].length > 0) { // si hay resultados previos
												$.each (resultsfolders[t], function(u) {

													resultadopreviovalido[t][u] = "no"; // valor por defecto

												});
											}

											var trans = db.transaction(["folders"], "readonly")
											var objectStore = trans.objectStore("folders")
											var req = objectStore.openCursor();

											req.onerror = function(event) {

												console.log("error: " + event);
											};

											req.onsuccess = function(event) {

												if (resultsfolders[t].length > 0) { // si hay resultados previos (si no, no se añade nada, pues no tiene todos los tags)

													var cursor = event.target.result;

													if(cursor){

														if (selectedFolder == "\/") {
															selectedFolder = ""
														}

														if (cursor.value.folder == selectedFolder || cursor.value.folder.substring(0, selectedFolder.length+1) == selectedFolder+"\/") { // carpetas que comienzan con el string de la carpeta a partir de la cual se busca (inclusive)

															tagsdelelemento[t] = cursor.value.foldertags;

															var coincidetag = "no";

															if (typeof tagsdelelemento[t] == "string") {
																tagsdelelemento[t] = tagsdelelemento[t].split(",");
															}
															$.each (tagsdelelemento[t], function(u) {

																if (tagsdelelemento[t][u] == arraydetagsabuscar[t][4]) { // el quinto tag a buscar

																	coincidetag = "si";

																}

															});


															if (coincidetag == "si") {

																// console.log("coincide cuarto tag con: " + cursor.value.folder)

																$.each (resultsfolders[t], function(u) {

																	if (resultsfolders[t][u].folderid == cursor.value.folderid) {

																		window.resultadopreviovalido[t][u] = "yes"; // al tener todos los tags se respeta el elemento

																	}

																});

															}

														}

														cursor.continue();

													}

												}

											}

											trans.oncomplete = function(event) {

												resultsfolderstemp[t] = jQuery.extend({}, resultsfolders[t])

												$.each (resultsfolders[t], function(u) {

													if (resultadopreviovalido[t][u] == "no") {

														resultsfolderstemp[t][u] = undefined;
													}

												})

												resultsfolders[t]=[];

												$.each (resultsfolderstemp[t], function(u) {

													if (resultsfolderstemp[t][u] != undefined) {
														resultsfolders[t].push(resultsfolderstemp[t][u]);
													}

												})

												concetradoresultadoscarpetas(resultsfolders[t]);

											}

										}

									}

								}

							}

						}

					}

				}

			}

		}

		if (actualfoldergrouptosearch == totalfoldergrouptosearch && resultsfolders[0].length == 0) {

			$('#numeroderesultadoscarpetas').html("No folders found. ")

		}

	});

} // --fin searchinfolders()

// búsquedas de todas las carpetas para cuando solo se definen tags que NO deben tener los resultados (luego se filtrarán en el concentrador).
function searchnoinfolders() {


	$('#numeroderesultadoscarpetas').html("Searching folders ...");

	resultsfolders = [];
	resultsfolderstemp = [];

	var trans = db.transaction(["folders"], "readonly")
	var objectStore = trans.objectStore("folders")
	var req = objectStore.openCursor();

	req.onerror = function(event) {

		console.log("error: " + event);
	};

	req.onsuccess = function(event) {

		var cursor = event.target.result;

		if(cursor){

			if (selectedFolder == "\/") {
				selectedFolder = ""
			}

			if (cursor.value.folder == selectedFolder || cursor.value.folder.substring(0, selectedFolder.length+1) == selectedFolder+"\/") { // carpetas que comienzan con el string de la carpeta a partir de la cual se busca (inclusive)

				var foldertoad = [];


				foldertoad.folderid = cursor.value.folderid
				foldertoad.name = cursor.value.folder
				foldertoad.tagsid = cursor.value.foldertags

				resultsfolderstemp.push(foldertoad);

			}

			cursor.continue();

		}

	}

	trans.oncomplete = function(event) {

		$.each (resultsfolderstemp, function(u) {

			resultsfolders.push(resultsfolderstemp[u]);

		});

		concetradoresultadoscarpetas(resultsfolders);
	}

}



function searchinfiles() {

	$('#numeroderesultadosarchivos').html("Searching files ...");

	var i=0;
	var folderidintosearch = [];
	var foldernametoserach = [];

	var trans = db.transaction(["folders"], "readonly")
	var objectStore = trans.objectStore("folders")
	var req = objectStore.openCursor();

	req.onerror = function(event) {

		console.log("error: " + event);
	};

	req.onsuccess = function(event) {

		var cursor = event.target.result;

		if(cursor){

			if (selectedFolder == "\/") {
				selectedFolder = "";
			}

			if (cursor.value.folder == selectedFolder || cursor.value.folder.substring(0, selectedFolder.length+1) == selectedFolder+"\/") { // carpetas que comienzan con el string de la carpeta a partir de la cual se busca (inclusive)

				folderidintosearch[i] = cursor.value.folderid;
				foldernametoserach[i] = cursor.value.folder;

				i++;

			}

			cursor.continue();

		}

	}

	trans.oncomplete = function(event) {

		var flagg="no";
		var totalgroup = 0;

		$.each (taggroup, function(t) {

			totalgroup ++;

		});

		$.each (taggroup, function(t) {

			var actualgroup = t;

			$('#numeroderesultadosarchivos').html("Searching files ...");

			resultsfiles[t] = [];
			resultsfilestemp[t] = [];
			var filetoad = [];

			var resultadopreviovalido = [];

			if (taggroup[t] != "") {

				arraydetagsabuscar[t] = taggroup[t].split(",");

				var trans = db.transaction(["files"], "readonly")
				var objectStore = trans.objectStore("files")

				$.each (folderidintosearch, function(n) {

					$('#numeroderesultadosarchivos').html("Searching files ...");

					var req = objectStore.openCursor();

					req.onerror = function(event) {

						console.log("error: " + event);
					};

					req.onsuccess = function(event) {

						var cursor = event.target.result;

						if(cursor){

							if (cursor.value.filefolder == folderidintosearch[n]) { // carpetas que comienzan con el string de la carpeta a partir de la cual se busca (inclusive)

								$.each (arraydetagsabuscar[t], function(u) {

									filetoad = [];
									var coincidetag = "no";
									var tagsdelelemento = cursor.value.filetags;

									if (typeof tagsdelelemento == "string") {
										tagsdelelemento = tagsdelelemento.split(",")
									}

									$.each (tagsdelelemento, function(m) {

										if (tagsdelelemento[m] == arraydetagsabuscar[t][0]) {

											coincidetag = "si";

										}

									});

									if (coincidetag == "si") {

										if (resultsfiles[t].length == 0) { // si no hay resultados previos

											var aniadir = "yes";

											filetoad.fileid = cursor.value.fileid;
											filetoad.name = cursor.value.filename;
											filetoad.filefolder = cursor.value.filefolder;
											filetoad.filepath = foldernametoserach[n];
											filetoad.ext = cursor.value.fileext;
											filetoad.tagsid = cursor.value.filetags;

											flagg="yes";

											// console.log("coincide el primer tag con: " + cursor.value.filename)

											$.each (resultsfilestemp[t], function(a){

												if (resultsfilestemp[t][a].fileid == filetoad.fileid) {
													aniadir="no";
												}

											})

											if (aniadir == "yes") {

												resultsfilestemp[t].push(filetoad);

											}

										}

									}


								})

							}

							cursor.continue();

						}

					}

				});

				if (actualgroup == totalgroup && flagg=="no") {
					$('#numeroderesultadosarchivos').html("No files found. ")
				}

				trans.oncomplete = function(event) {

					flagg="no";

					$.each (resultsfilestemp[t], function(u) {

						resultsfiles[t].push(resultsfilestemp[t][u]);

					});

					if (arraydetagsabuscar[t].length < 2) {

						concetradoresultadosarchivos(resultsfiles[t]);

					}

					// a por el 2º tag

					else if (arraydetagsabuscar[t].length >= 2) { // si hay al menos 2 tags para buscar

						resultadopreviovalido[t] = [];

						if (resultsfiles[t].length > 0) { // si hay resultados previos
							$.each (resultsfiles[t], function(u) {

								resultadopreviovalido[t][u] = "no"; //vañor por defecto

							});
						}

						var trans = db.transaction(["files"], "readonly")
						var objectStore = trans.objectStore("files")

						$.each (folderidintosearch, function(n) {

							var req = objectStore.openCursor();

							req.onerror = function(event) {

								console.log("error: " + event);
							};

							req.onsuccess = function(event) {

								if (resultsfiles[t].length > 0) { // si hay resultados previos (si no, no se añade nada, pues no tiene todos los tags)
									var cursor = event.target.result;

									if(cursor){

										if (cursor.value.filefolder == folderidintosearch[n]) {

											var coincidetag = "no";

											tagsdelelemento = cursor.value.filetags;

											if (typeof tagsdelelemento == "string") {
												tagsdelelemento = tagsdelelemento.split(",")
											}

											$.each (tagsdelelemento, function(m) {

												if (tagsdelelemento[m] == arraydetagsabuscar[t][1]) { // el segundo tag a buscar

													coincidetag = "si"
												}

											});


											if (coincidetag == "si") {

												// console.log("coincide segundo tag con: " + cursor.value.filename)

												$.each (resultsfiles[t], function(u) {

													if (resultsfiles[t][u].fileid == cursor.value.fileid) {

														resultadopreviovalido[t][u] = "yes"; // al tener todos los tags se respeta el elemento

														flagg="yes";

													}

												});

											}

										}

										cursor.continue();

									}

								}

							}

							trans.oncomplete = function(event) {

								if (actualgroup == totalgroup && flagg=="no") {
									$('#numeroderesultadosarchivos').html("No files found. ")
								}
								flagg = "no"

								resultsfilestemp[t] = jQuery.extend({}, resultsfiles[t])

								$.each (resultsfiles[t], function(u) {

									if (resultadopreviovalido[t][u] == "no") {

										resultsfilestemp[t][u] = undefined;
									}

								})

								resultsfiles[t]=[];

								$.each (resultsfilestemp[t], function(u) {

									if (resultsfilestemp[t][u] != undefined) {
										resultsfiles[t].push(resultsfilestemp[t][u]);
									}

								})

								if (arraydetagsabuscar[t].length < 3) {

									concetradoresultadosarchivos(resultsfiles[t]);

								}


								// a por el 3er tag

								else if (arraydetagsabuscar[t].length >= 3) { // si hay al menos 3 tags para buscar

									resultadopreviovalido[t] = [];

									if (resultsfiles[t].length > 0) { // si hay resultados previos
										$.each (resultsfiles[t], function(u) {

											resultadopreviovalido[t][u] = "no"; // valor por defecto

										});
									}

									var trans = db.transaction(["files"], "readonly")
									var objectStore = trans.objectStore("files")

									$.each (folderidintosearch, function(n) {

										var req = objectStore.openCursor();

										req.onerror = function(event) {

											console.log("error: " + event);
										};

										req.onsuccess = function(event) {

											if (resultsfiles[t].length > 0) { // si hay resultados previos (si no no se añade nada, pues no tiene todos los tags)

												var cursor = event.target.result;

												if(cursor){

													if (cursor.value.filefolder == folderidintosearch[n]) {

														var coincidetag = "no";

														tagsdelelemento = cursor.value.filetags;

														if (typeof tagsdelelemento == "string") {
															tagsdelelemento = tagsdelelemento.split(",")
														}

														$.each (tagsdelelemento, function(m) {

															if (tagsdelelemento[m] == arraydetagsabuscar[t][2]) { //el tercer tag a buscar

																coincidetag = "si"
															}

														});


														if (coincidetag == "si") {

															// console.log("coincide tercer tag con: " + cursor.value.filename)
															$.each (resultsfiles[t], function(u) {

																if (resultsfiles[t][u].fileid == cursor.value.fileid) {

																	resultadopreviovalido[t][u] = "yes"; //al tener todos los tags se respeta el elemento

																	flagg = "yes";
																}

															});

														}

													}

													cursor.continue();

												}

											}

										}

										trans.oncomplete = function(event) {

											if (actualgroup == totalgroup && flagg=="no") {
												$('#numeroderesultadosarchivos').html("No files found. ")
											}
											flagg = "no"

											resultsfilestemp[t] = jQuery.extend({}, resultsfiles[t])

											$.each (resultsfiles[t], function(u) {

												if (resultadopreviovalido[t][u] == "no") {

													resultsfilestemp[t][u] = undefined;
												}

											})

											resultsfiles[t]=[];

											$.each (resultsfilestemp[t], function(u) {

												if (resultsfilestemp[t][u] != undefined) {
													resultsfiles[t].push(resultsfilestemp[t][u]);
												}

											})

											if (arraydetagsabuscar[t].length < 4) {

												concetradoresultadosarchivos(resultsfiles[t]);

											}

											// a por el 4to tag

											else if (arraydetagsabuscar[t].length >= 4) { // si hay al menos 4 tags para buscar

												resultadopreviovalido[t] = [];

												if (resultsfiles[t].length > 0) { // si hay resultados previos
													$.each (resultsfiles[t], function(u) {

														resultadopreviovalido[t][u] = "no"; // valor por defecto

													});
												}

												var trans = db.transaction(["files"], "readonly")
												var objectStore = trans.objectStore("files")

												$.each (folderidintosearch, function(n) {

													var req = objectStore.openCursor();

													req.onerror = function(event) {

														console.log("error: " + event);
													};

													req.onsuccess = function(event) {

														if (resultsfiles[t].length > 0) { // si hay resultados previos (si no no se añade nada, pues no tiene todos los tags)

															var cursor = event.target.result;

															if(cursor){

																if (cursor.value.filefolder == folderidintosearch[n]) {

																	var coincidetag = "no";

																	tagsdelelemento = cursor.value.filetags;

																	if (typeof tagsdelelemento == "string") {
																		tagsdelelemento = tagsdelelemento.split(",")
																	}

																	$.each (tagsdelelemento, function(m) {

																		if (tagsdelelemento[m] == arraydetagsabuscar[t][3]) { //el cuarto tag a buscar

																			coincidetag = "si"
																		}

																	});


																	if (coincidetag == "si") {

																		// console.log("coincide tercer tag con: " + cursor.value.filename)
																		$.each (resultsfiles[t], function(u) {

																			if (resultsfiles[t][u].fileid == cursor.value.fileid) {

																				resultadopreviovalido[t][u] = "yes"; //al tener todos los tags se respeta el elemento

																				flagg = "yes";
																			}

																		});

																	}

																}

																cursor.continue();

															}

														}

													}

													trans.oncomplete = function(event) {

														if (actualgroup == totalgroup && flagg=="no") {
															$('#numeroderesultadosarchivos').html("No files found. ")
														}
														flagg = "no"

														resultsfilestemp[t] = jQuery.extend({}, resultsfiles[t])

														$.each (resultsfiles[t], function(u) {

															if (resultadopreviovalido[t][u] == "no") {

																resultsfilestemp[t][u] = undefined;
															}

														})

														resultsfiles[t]=[];

														$.each (resultsfilestemp[t], function(u) {

															if (resultsfilestemp[t][u] != undefined) {
																resultsfiles[t].push(resultsfilestemp[t][u]);
															}

														})

														if (arraydetagsabuscar[t].length < 5) {

															concetradoresultadosarchivos(resultsfiles[t]);

														}

														// a por el 5º tag

														else if (arraydetagsabuscar[t].length == 5) { // si hay 5 tags para buscar

															resultadopreviovalido[t] = [];

															if (resultsfiles[t].length > 0) { // si hay resultados previos
																$.each (resultsfiles[t], function(u) {

																	resultadopreviovalido[t][u] = "no"; // valor por defecto

																});
															}

															var trans = db.transaction(["files"], "readonly")
															var objectStore = trans.objectStore("files")

															$.each (folderidintosearch, function(n) {

																var req = objectStore.openCursor();

																req.onerror = function(event) {

																	console.log("error: " + event);
																};

																req.onsuccess = function(event) {

																	if (resultsfiles[t].length > 0) { //si hay resultados previos (si no, no se añade nada, pues no tiene todos los tags)

																		var cursor = event.target.result;

																		if(cursor){

																			if (cursor.value.filefolder == folderidintosearch[n]) {

																				var coincidetag = "no";

																				tagsdelelemento = cursor.value.filetags;

																				if (typeof tagsdelelemento == "string") {
																					tagsdelelemento = tagsdelelemento.split(",")
																				}

																				$.each (tagsdelelemento, function(m) {

																					if (tagsdelelemento[m] == arraydetagsabuscar[t][4]) { //el quinto tag a buscar

																						coincidetag = "si"
																					}

																				});


																				if (coincidetag == "si") {

																					// console.log("coincide cuarto tag con: " + cursor.value.filename)

																					$.each (resultsfiles[t], function(u) {

																						if (resultsfiles[t][u].fileid == cursor.value.fileid) {

																							resultadopreviovalido[t][u] = "yes"; //al tener todos los tags se respeta el elemento

																							flagg="yes";
																						}

																					});

																				}

																			}

																			cursor.continue();

																		}

																	}

																}

																trans.oncomplete = function(event) {

																	if (actualgroup == totalgroup && flagg=="no") {
																		$('#numeroderesultadosarchivos').html("No files found. ")
																	}
																	flagg = "no";

																	resultsfilestemp[t] = jQuery.extend({}, resultsfiles[t])

																	$.each (resultsfiles[t], function(u) {

																		if (resultadopreviovalido[t][u] == "no") {

																			resultsfilestemp[t][u] = undefined;
																		}

																	})

																	resultsfiles[t]=[];

																	$.each (resultsfilestemp[t], function(u) {

																		if (resultsfilestemp[t][u] != undefined) {
																			resultsfiles[t].push(resultsfilestemp[t][u]);
																		}

																	})

																	if (arraydetagsabuscar[t].length == 5) {

																		concetradoresultadosarchivos(resultsfiles[t]);

																	}

																}

															});

														}

													}

												});

											}

										}

									});

								}

							}

						});

					}

				}

			}

		});

	}

} // -- fin searchinfiles()


// búsquedas de todos los archivos para cuando solo se definen tags que NO deben tener los resultados (luego se filtrarán en el concentrador).
function searchnoinfiles() {

	$('#numeroderesultadosarchivos').html("Searching files ...");

	var i=0;
	var folderidintosearch = [];
	var foldernametoserach = [];

	var trans = db.transaction(["folders"], "readonly")
	var objectStore = trans.objectStore("folders")
	var req = objectStore.openCursor();

	req.onerror = function(event) {

		console.log("error: " + event);
	};

	req.onsuccess = function(event) {

		var cursor = event.target.result;

		if(cursor){

			if (selectedFolder == "\/") {
				selectedFolder = "";
			}

			if (cursor.value.folder == selectedFolder || cursor.value.folder.substring(0, selectedFolder.length+1) == selectedFolder+"\/") { // carpetas que comienzan con el string de la carpeta a partir de la cual se busca (inclusive)

				folderidintosearch[i] = cursor.value.folderid;
				foldernametoserach[i] = cursor.value.folder;

				i++;

			}

			cursor.continue();

		}

	}

	trans.oncomplete = function(event) {



		$('#numeroderesultadosarchivos').html("Searching files ...");

		resultsfiles = [];
		resultsfilestemp = [];
		var filetoad = [];

		var trans = db.transaction(["files"], "readonly")
		var objectStore = trans.objectStore("files")

		$.each (folderidintosearch, function(n) {

			$('#numeroderesultadosarchivos').html("Searching files ...");

			var req = objectStore.openCursor();

			req.onerror = function(event) {

				console.log("error: " + event);
			};

			req.onsuccess = function(event) {

				var cursor = event.target.result;

				if(cursor){

					if (cursor.value.filefolder == folderidintosearch[n]) { // carpetas que comienzan con el string de la carpeta a partir de la cual se busca (inclusive)

						filetoad = [];
						var coincidetag = "no";
						var tagsdelelemento = cursor.value.filetags;

						if (typeof tagsdelelemento == "string") {
							tagsdelelemento = tagsdelelemento.split(",")
						}

						filetoad.fileid = cursor.value.fileid;
						filetoad.name = cursor.value.filename;
						filetoad.filefolder = cursor.value.filefolder;
						filetoad.filepath = foldernametoserach[n];
						filetoad.ext = cursor.value.fileext;
						filetoad.tagsid = cursor.value.filetags;

						resultsfilestemp.push(filetoad);

					}

					cursor.continue();

				}


			}


		});

		trans.oncomplete = function(event) {


			$.each (resultsfilestemp, function(u) {

				resultsfiles.push(resultsfilestemp[u]);

			});

			concetradoresultadosarchivos(resultsfiles);

		}

	}

}



function concetradoresultadoscarpetas(entradas) {

	concentradorresultadoscarpetas.push(entradas);

	if (concentradorresultadoscarpetas.length == numerodecamposrellenados || numerodecamposrellenados == 0) {

		window.resultadoscarpetas=[];

		$.each (concentradorresultadoscarpetas, function(u){

			$.each (concentradorresultadoscarpetas[u], function(n){

				aniadir = "yes"

				$.each (resultadoscarpetas, function(t){

					if (resultadoscarpetas[t].folderid == concentradorresultadoscarpetas[u][n].folderid) {

						aniadir = "no";

					}

				});

				if (aniadir == "yes") {

					var testnotag = true;

					// se comprueba si el/los campos nottag tiene tag, y si los tiene no se incluyen en los resultados los elemento que tengan ese tag
					$.each ($(".nottaginput"), function(nt) {

						nottaggroup = $(".nottaginput:eq("+nt+")")["0"].attributes[1].value;

						if (nottaggroup != "" ) {

							// apaño para que no de error pues a veces es string y a veces object (no split)
							if (typeof(concentradorresultadoscarpetas[u][n]["tagsid"]) == "string") {
								var tagsacomparar = concentradorresultadoscarpetas[u][n]["tagsid"].split(",")
							} else {
								var tagsacomparar = concentradorresultadoscarpetas[u][n]["tagsid"]
							}

							$.each (tagsacomparar, function(t) {
								if (tagsacomparar[t] == nottaggroup) {
									testnotag = false;
								}
							})
						}

					})
					if (testnotag) {
						resultadoscarpetas.push(concentradorresultadoscarpetas[u][n])
					}

				}

			})

		})

		if (resultadoscarpetas.length == 0) {

			$('#numeroderesultadoscarpetas').html("No folders found. ")
		}

		readsearchredresults();

	}

}



function concetradoresultadosarchivos(entradas) {

	concentradorresultadosarchivos.push(entradas);

	if (concentradorresultadosarchivos.length == numerodecamposrellenados || numerodecamposrellenados == 0) {

		window.resultadosarchivos=[];

		$.each (concentradorresultadosarchivos, function(u){

			$.each (concentradorresultadosarchivos[u], function(n){

				aniadir = "yes"

				$.each (resultadosarchivos, function(t){

					if (resultadosarchivos[t].fileid == concentradorresultadosarchivos[u][n].fileid) {

						aniadir = "no";

					}

				});

				if (aniadir == "yes") {

					var testnotag = true;

					// se comprueba si el/los campos nottag tiene tag, y si los tiene no se incluyen en los resultados los elemento que tengan ese tag
					$.each ($(".nottaginput"), function(nt) {

						nottaggroup = $(".nottaginput:eq("+nt+")")["0"].attributes[1].value;

						if (nottaggroup != "" ) {

							// apaño para que no de error pues a veces es string y a veces object (no split)
							if (typeof(concentradorresultadosarchivos[u][n]["tagsid"]) == "string") {
								var tagsacomparar = concentradorresultadosarchivos[u][n]["tagsid"].split(",")
							} else {
								var tagsacomparar = concentradorresultadosarchivos[u][n]["tagsid"]
							}

							$.each (tagsacomparar, function(t) {
								if (tagsacomparar[t] == nottaggroup) {
									testnotag = false;
								}
							})
						}

					})
					if (testnotag) {
						resultadosarchivos.push(concentradorresultadosarchivos[u][n])
					}

				}

			})

		})

		if (resultadosarchivos.length == 0) {

			$('#numeroderesultadosarchivos').html("No files found. ")
		}

		readsearchredresults();

	}

}


function readsearchredresults() {

	$.each (resultadoscarpetas, function(n) {

		try {

			var stats = fs.statSync(driveunit + resultadoscarpetas[n].name);

			// última modificación
			var lastmodified = stats["mtime"];

			var lastm_day = lastmodified.getDay()+1;
			var lastm_month = lastmodified.getMonth()+1;
			var lastm_year = lastmodified.getYear()-100+2000;

			var lastm_Hour = lastmodified.getHours()
			var lastm_Minutes = lastmodified.getMinutes()
			var lastm_Seconds = lastmodified.getSeconds()

			resultadoscarpetas[n].lastmod = lastmodified;
			resultadoscarpetas[n].lastmodtoshow = lastm_day + "-" + lastm_month + "-" + lastm_year + " " + lastm_Hour + ":" + lastm_Minutes + ":" + lastm_Seconds;

		}
		catch(err) {
			console.log('An unaccesible folder');
		}

		var dirtoreadcheck = driveunit + resultadoscarpetas[n].name;

		try {
			var arorfo = "i_am_an_archive";
			var arorfo = fs.readdirSync(dirtoreadcheck); // viene bien para luego mostrar numero de elementos en una carpeta
		}
		catch(exception) {};

		resultadoscarpetas[n].arorfo = arorfo;

	});

	$.each (resultadosarchivos, function(n) {

		if (resultadosarchivos[n].ext == undefined) { //para que no salga undefined si no tiene extensión
			resultadosarchivos[n].ext = "&nbsp;";
		}

		try {

			var stats = fs.statSync(driveunit + resultadosarchivos[n].filepath + resultadosarchivos[n].name);

			var fileSize = stats["size"];

			resultadosarchivos[n].size = fileSize; // para poder ordenar por tamaño

			if (fileSize <= 1024) {
				resultadosarchivos[n].sizeterm = "B";
				resultadosarchivos[n].sizetodraw = fileSize;

			}
			if (fileSize > 1024) {
				resultadosarchivos[n].sizeterm = "Kb";
				resultadosarchivos[n].sizetodraw = fileSize/1000.0;
				resultadosarchivos[n].sizetodraw = resultadosarchivos[n].sizetodraw.toFixed(2);

			}
			if (fileSize > 1048576) {
				resultadosarchivos[n].sizeterm = "Mb";
				resultadosarchivos[n].sizetodraw = fileSize/1000000.0;
				resultadosarchivos[n].sizetodraw = resultadosarchivos[n].sizetodraw.toFixed(2);
			}
			if (fileSize == 0) {
				resultadosarchivos[n].sizeterm = "";
				resultadosarchivos[n].sizetodraw = "";
			}
			if (fileSize == 0) {
				resultadosarchivos[n].sizeterm = "B";
				resultadosarchivos[n].sizetodraw = "0";
			}
			if (fileSize == undefined) {
				resultadosarchivos[n].sizeterm = "&nbsp;";
				resultadosarchivos[n].sizetodraw = "&nbsp;";

			}
			// última modificación
			var lastmodified = stats["mtime"];
			var lastm_day = lastmodified.getDay()+1;
			var lastm_month = lastmodified.getMonth()+1;
			var lastm_year = lastmodified.getYear()-100+2000;

			var lastm_Hour = lastmodified.getHours()
			var lastm_Minutes = lastmodified.getMinutes()
			var lastm_Seconds = lastmodified.getSeconds()

			resultadosarchivos[n].lastmod = lastmodified;
			resultadosarchivos[n].lastmodtoshow = lastm_day + "-" + lastm_month + "-" + lastm_year + " " + lastm_Hour + ":" + lastm_Minutes + ":" + lastm_Seconds;

		}
		catch(err) {
			console.log('An unaccesible file');
		}

		var dirtoreadcheck = driveunit + resultadosarchivos[n].filepath + resultadosarchivos[n].name;

		try {
			var arorfo = "i_am_an_archive"; // esta claro que es un archivo pero este método esta copiado del main, y puede venir bien.
			var arorfo = fs.readdirSync(dirtoreadcheck); // viene bien para luego mostrar numero de elementos en una carpeta
		}
		catch(exception) {};

		resultadosarchivos[n].arorfo = arorfo;

	});


	t = "";

	if (searchfor == "folders") {

		drawSearchFolders(searchviewmode, searchorder);
		drawSearchAfter();
	}

	else if(searchfor == "files") {

		drawSearchArchives(searchviewmode, searchorder);
		drawSearchAfter();
	}

	else if (searchfor == "foldersandfiles") {

		if (searchorder == "nameasc" || searchorder == "extasc" || searchorder == "sizeasc" || searchorder == "lastdesc") {
			drawSearchFolders(searchviewmode, searchorder);
			drawSearchArchives(searchviewmode, searchorder);
		}
		else if (searchorder == "namedesc" || searchorder == "extdesc" || searchorder == "sizedesc" || searchorder == "lastasc") {
			drawSearchArchives(searchviewmode, searchorder);
			drawSearchFolders(searchviewmode, searchorder);
		}

		drawSearchAfter();
	}

}


function SortByNameAsc(a, b){
  var aName = a.name.toLowerCase();
  var bName = b.name.toLowerCase();
  return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
}
function SortByNameDesc(a, b){
  var aName = a.name.toLowerCase();
  var bName = b.name.toLowerCase();
  return ((aName > bName) ? -1 : ((aName < bName) ? 1 : 0));
}
function SortByExtAsc(a, b){
  try {
	  var aExt = a.ext.toLowerCase();
	  var bExt = b.ext.toLowerCase();
	  return ((aExt < bExt) ? -1 : ((aExt > bExt) ? 1 : 0));
  } catch (err) { };
}
function SortByExtDesc(a, b){
  try {
	  var aExt = a.ext.toLowerCase();
	  var bExt = b.ext.toLowerCase();
	  return ((aExt > bExt) ? -1 : ((aExt < bExt) ? 1 : 0));
  } catch (err) { };

}
function SortByElemAsc(a,b) {
	var aElem = Object.size(a.arorfo);
	var bElem = Object.size(b.arorfo);
	return ((aElem < bElem) ? -1 : ((aElem > bElem) ? 1 : 0));
}
function SortByElemDesc(a,b) {
	var aElem = Object.size(a.arorfo);
	var bElem = Object.size(b.arorfo);
	return ((aElem > bElem) ? -1 : ((aElem < bElem) ? 1 : 0));
}
function SortBySizeAsc(a,b) {
	var aSize = a.size;
	var bSize = b.size;
	return ((aSize < bSize) ? -1 : ((aSize > bSize) ? 1 : 0));

}
function SortBySizeDesc(a,b) {
	var aSize = a.size;
	var bSize = b.size;
	return ((aSize > bSize) ? -1 : ((aSize < bSize) ? 1 : 0));

}
function SortByLastmodAsc(a,b) {
	var aLastmod = a.lastmod;
	var bLastmod = b.lastmod;
	return ((aLastmod < bLastmod) ? -1 : ((aLastmod > bLastmod) ? 1 : 0));

}
function SortByLastmodDesc(a,b) {
	var aLastmod = a.lastmod;
	var bLastmod = b.lastmod;
	return ((aLastmod > bLastmod) ? -1 : ((aLastmod < bLastmod) ? 1 : 0));
}


function drawSearchFolders (searchviewmode, order) {


	switch(searchorder){
		case "nameasc":
			resultadoscarpetas.sort(SortByNameAsc);
			break;
		case "namedesc":
			resultadoscarpetas.sort(SortByNameDesc);
			break;
		case "extasc":
			resultadoscarpetas.sort(SortByNameAsc);
			break;
		case "extdesc":
			resultadoscarpetas.sort(SortByNameDesc);
			break;
		case "sizeasc":
			resultadoscarpetas.sort(SortByElemAsc);
			break;
		case "sizedesc":
			resultadoscarpetas.sort(SortByElemDesc);
			break;
		case "lastasc":
			resultadoscarpetas.sort(SortByLastmodAsc);
			break;
		case "lastdesc":
			resultadoscarpetas.sort(SortByLastmodDesc);
			break;
	}

	if (searchviewmode==1) {

		$.each(resultadoscarpetas, function(i, v) {

			var nameSinBarra = v.name.substring(1);

			var folderelements = Object.size(this.arorfo); // el tamaño del objeto arorfo que contiene el numero de subelementos en una carpeta

			t += '<div class="exploelement folder"><div class="imgmode1 folder"></div><div class="explofolder" value="' + v.name + '"  title="' + nameSinBarra + '"><span class="exploname">' + nameSinBarra + '</span></div><div class="folderelements"> ' + folderelements + ' in folder</div><div class="explosize"><span class="placehold">File Size</span></div><div class="tags" value="' + v.tagsid + '">' + v.tagsid + '&nbsp;</div><div class="lastmod">' + v.lastmodtoshow + '</div><div class="duration"><span class="placehold">Media Length</span>&nbsp;</div></div>';

			// los tag se separan y presentan en divs aparte en la función drawdirectoryviewtags()

		});

	} // --end searchviewmode=1

	if (searchviewmode!=1) {


		$.each(resultadoscarpetas, function(i, v) {

			var nameSinBarra = v.name.substring(1);

			var folderelements = Object.size(this.arorfo); // el tamaño del objeto arorfo que contiene el numero de subelementos en una carpeta

			t += '<div class="exploelement folder"><div class="imgmode'+searchviewmode+' folder">&nbsp;</div><div class="explofolder" value="' + v.name + '"><span class="exploname">' + nameSinBarra + '</span></div><div class="folderelements"> ' + folderelements + ' in folder</div><div class="explosize"><span class="placehold">File Size</span></div><div class="tags" value="' + v.tagsid + '">' + v.tagsid + '&nbsp;</div><div class="lastmod">' + v.lastmodtoshow + '</div><div class="duration"><span class="placehold">Media Length</span></div></div>';

			// los tag se separan y presentan en divs aparte en la función drawdirectoryviewtags()

		});

	} // --end searchviewmodes!=1

} // --fin drawSearchFolders()


function drawSearchArchives (searchviewmode, order) {

	switch(searchorder){
		case "nameasc":
			resultadosarchivos.sort(SortByNameAsc);
			break;
		case "namedesc":
			resultadosarchivos.sort(SortByNameDesc);
			break;
		case "extasc":
			resultadosarchivos.sort(SortByExtAsc);
			break;
		case "extdesc":
			resultadosarchivos.sort(SortByExtDesc);
			break;
		case "sizeasc":
			resultadosarchivos.sort(SortBySizeAsc);
			break;
		case "sizedesc":
			resultadosarchivos.sort(SortBySizeDesc);
			break;
		case "lastasc":
			resultadosarchivos.sort(SortByLastmodAsc);
			break;
		case "lastdesc":
			resultadosarchivos.sort(SortByLastmodDesc);
			break;
	}

	if (searchviewmode==1) {

		$.each(resultadosarchivos, function(i, v) {

			var nameSinBarra = v.name.substring(1);

			if (v.ext) {
				var exten = v.ext.toLowerCase();
			}
			if (exten == "jpg" || exten == "jpeg" || exten == "png" || exten == "gif" || exten == "bmp" || exten == "svg" || exten == "xbm" || exten == "ico") {
				if (previewimgonviewmode1=="yes") {

					var imagen = '<a href="file:///'+ driveunit + v.filepath + v.name +'"><img class="b-lazy" data-src="file:///' + driveunit + v.filepath + v.name + '" src="img/ffffff-16.16.png"></a>';
				
				} else {

					var imagen = '<a href="file:///'+ driveunit + v.filepath + v.name +'"><img data-src="img/ffffff-16.16.png" src="img/ffffff-16.16.png"></a>';
				}
				var exploname = "<span class='exploname imagename1'>"+nameSinBarra+"</span>";
				$(".imgmode1").addClass("conimagen1");
			}
			else {

				var imagen="";
				var exploname = "<span class='exploname'>"+nameSinBarra+"</span>";

			}

			t += '<div class="exploelement archive"><div class="imgmode1 ' + exten + '">' + imagen + '</div><div class="explofile" value="' + v.name + '" filepath="' + v.filepath + '" title="' + v.filepath + '">'+exploname+' <span class="placehold2" value="'+ v.filepath +'">'+ v.filepath +'</span></div><div class="exploext">' + v.ext + '</div><div class="explosize">' + v.sizetodraw + v.sizeterm + '</div><div class="tags" value="' + v.tagsid + '">' + v.tagsid + '&nbsp;</div><div class="lastmod">' + v.lastmodtoshow + '</div><div class="duration"><span class="placehold">Media Length</span></div></div>';

		});

	} // --end searchviewmode=1

	if (searchviewmode!=1) {

		$.each(resultadosarchivos, function(i, v) {

			var nameSinBarra = v.name.substring(1);

			if (v.ext) {
			var exten = v.ext.toLowerCase();
			}
			if (exten == "jpg" || exten == "jpeg" || exten == "png" || exten == "gif" || exten == "bmp" || exten == "svg" || exten == "xbm" || exten == "ico") {

				var imagentemporal = "";
				switch(exten){
					case "jpg":
						imagentemporal = "img/icons/420px/jpg.png"
						break;
					case "png":
						imagentemporal = "img/icons/420px/png.png"
						break;
					case "gif":
						imagentemporal = "img/icons/420px/gif.png"
						break;
					case "bmp":
						imagentemporal = "img/icons/420px/bmp.png"
						break;
					default: 
						imagentemporal = "img/icons/420px/_blank.png"
				}

				var exploname = "<span class='exploname imagename2'>"+nameSinBarra+"</span>";
				var imgsrc = encodeURI(driveunit + v.filepath + v.name)

				var imagen = '<a href="file:///'+ driveunit + v.filepath + v.name +'"><img class="b-lazy" data-src="file:///' + imgsrc + '" src="' + imagentemporal + '"></a>';


				$(".imgmode"+searchviewmode+"").addClass("conimagen"+searchviewmode+"");

			}
			else {

				var exploname = "<span class='exploname'>"+nameSinBarra+"</span>";
				var imagen="<img src='/img/icons/420px/420x420.png'>";
			}

			t += '<div class="exploelement archive"><div class="imgmode'+searchviewmode+' ' + exten + '">' + imagen + '</div><div class="explofile" value="' + v.name + '" filepath="' + v.filepath + '"  title="' + v.filepath + '">'+exploname+'</div><div class="exploext">' + v.ext + '</div><div class="explosize">&nbsp' + v.sizetodraw + v.sizeterm + '</div><div class="tags" value="' + v.tagsid + '">' + v.tagsid + '&nbsp;</div><div class="lastmod">' + v.lastmodtoshow + '</div><div class="duration"><span class="placehold">Media Length</span></div></div>';

		});

	} // --end searchviewmode!=1

} // --fin drawSearchArchives()



function drawSearchAfter() {

	$('#searchdirectoryview').html(t);

	$("#viewmodenumber").html(searchviewmode + ".")

	$('#numeroderesultados').html("")

	if (resultadoscarpetas.length > 0) {
		$('#numeroderesultadoscarpetas').html("Found " + resultadoscarpetas.length + " folders. ");
	}
	if (resultadosarchivos.length > 0) {
		$('#numeroderesultadosarchivos').html("Found " + resultadosarchivos.length + " files. ");
	}


	// Estilos para las diferentes vistas

	if (searchviewmode==1) {

		$('.exploelement').addClass('viewmode1');
		$('.exploelementfolderup').addClass('viewmode1');

		$('.explofolder').addClass('viewmode1');
		$('.explofile').addClass('viewmode1');
		$('.folderelements').addClass('viewmode1');
		$('.exploext').addClass('viewmode1');
		$('.explosize').addClass('viewmode1');
		$('.tags').addClass('viewmode1');
		$('.lastmod').addClass('viewmode1');
		$('.duration').addClass('viewmode1');

		if (columnaswidth) {
			$('.explofolder, .explofile').width(columnaswidth[1] + "%");
			$('.folderelements, .exploext').width(columnaswidth[2] + "%");
			$('.explosize').width(columnaswidth[3] + "%");
			$('.exploelement .tags').width(columnaswidth[4] + "%");
			$('.lastmod').width(columnaswidth[5] + "%");
			$('.duration').width(columnaswidth[6] + "%");
		}

	}


	if (searchviewmode!=1) {

		$('.exploelement').addClass('viewmode' + searchviewmode);

		$('.explofolder').addClass('viewmode' + searchviewmode);
		$('.explofile').addClass('viewmode' + searchviewmode);
		$('.folderelements').addClass('viewmode' + searchviewmode);
		$('.exploext').addClass('viewmode' + searchviewmode).css("display","none");
		$('.explosize').addClass('viewmode' + searchviewmode).css("display","none");
		$('.tags').addClass('viewmode' + searchviewmode);
		$('.lastmod').addClass('viewmode' + searchviewmode).css("display","none");
		$('.duration').addClass('viewmode' + searchviewmode).css("display","none"); // será visible específicamente si es media

	}


	// para la presentación de diapositivas click en imagen
	$('.exploelement .imgmode'+searchviewmode+' a').abigimage({

        onopen: function(target) {

        	var filenametoshow = target["0"].href.replace("file:///"+driveunit+"\/", "");
            this.filename.html(filenametoshow);
        }

	});
	// para la presentación de diapositivas click en nombre
	$('.exploelement .viewmode'+searchviewmode+' a').abigimage({

        onopen: function(target) {

        	var filenametoshow = target["0"].href.replace("file:///"+driveunit+"\/", "");
            this.filename.html(filenametoshow);
        }

	});


	// Sistema para detectar si entre las carpetas y archivos resultados de la búsqueda en la base de datos los hay que en realidad no existen en el sistema de archivos.

	// primero comprobamos las carpetas

	var stopbecausebadfolder="no";
	$.each ($(".explofolder"), function(u) {

		var todeletefolder = $(this)[0].getAttribute("value")

		try {

		readedSubfolderElements = fs.readdirSync(driveunit + $(this)[0].getAttribute("value"))

		} catch (err) { // si la búsqueda da una carpeta que no existe

			alertify.confirm( "Attention, the folder <em>'"+driveunit + $(this)[0].getAttribute("value")+"'</em> is on the search results, but it can´t be read (probably don't exists because is deleted in some way). Do you want to remove it from database?. If you choose Yes, click again on Search to see results.", function (e) {
	            if (!e) {
	              	x = "You pressed Cancel!";
	              	console.log(x);
	            } else {
	              	x = "You pressed OK!";
	              	console.log(x)

	            	stopbecausebadfolder="yes"
					$('#searchdirectoryview').html("");


		    		var trans2 = db.transaction(["folders"], "readwrite")
					var objectStore2 = trans2.objectStore("folders")
					var req2 = objectStore2.openCursor();

					req2.onerror = function(event) {

						console.log("error: " + event);

					};

					req2.onsuccess = function(event) {

						var cursor2 = event.target.result;
						if(cursor2){

							if (cursor2.value.folder == todeletefolder) {

								var key = cursor2.value.folderid; //id de carpeta a eliminar
								var request = objectStore2.delete(cursor2.value.folderid);

								request.onsuccess = function(event) {

									$('#searchdirectoryview').html("");

									// se mirará si había algún archivo asociado a la carpeta eliminada, si lo hay se borra
									var trans3 = db.transaction(["files"], "readwrite")
									var objectStore3 = trans3.objectStore("files")
									var req3 = objectStore3.openCursor();

									req3.onerror = function(event) {

										console.log("error: " + event);

									};

									req3.onsuccess = function(event) {

										var cursor3 = event.target.result;
										if(cursor3){

											if(cursor3.value.filefolder == key) {

												var request = objectStore3.delete(cursor3.value.fileid);

												request.onerror = function(err) {
													console.log("error deleting file from db")
												}
												request.onsuccess = function(event) {
													// console.log("file deleted")
												}

											}

											cursor3.continue();

										}

									}

								}

							}

							cursor2.continue();

						}

					}

				}

			});

		}

	});

	if (stopbecausebadfolder=="no") { // si ha superado el test de las carpetas

		// ahora testeamos si hay archivos que salgan en la búsqueda pero que no estén en el sistema de archivos

		$.each ($(".explofile"), function(u) {

			var filenametodelete = $(this)["0"].attributes[1].nodeValue;
			var filepathoffiletodelete = $(this)["0"].attributes[2].value;

			var filenametotest = driveunit + $(this)["0"].attributes[2].value + $(this)["0"].attributes[1].nodeValue
			try {

				var stats = fs.statSync(filenametotest)
			}

			catch(err) {

				alertify.confirm( "Attention, the file <em>'"+filenametotest+"'</em> is on the search results, but it can´t be read (probably don't exists because is deleted, renamed or moved outside Tagstoo). Do you want to remove it from database?. If you choose Yes, click again on Search to see results.", function (e) {

		            if (!e) {
		              	x = "You pressed Cancel!";
		              	console.log(x);
		            } else {
		              	x = "You pressed OK!";
		              	console.log(x)

			    		$('#searchdirectoryview').html(""); // con esto ya se "anula" cualquier ejecución siguiente basada en el DOM en la presentación de los archivos por eso no es necesario poner ningún condicional de si este test se ha superado o no

			    		var trans = db.transaction(["folders"], "readonly")
						var objectStore = trans.objectStore("folders")
						var req = objectStore.openCursor();

						req.onerror = function(event) {

							console.log("error: " + event);
						};

						req.onsuccess = function(event) {

							var cursor = event.target.result;

							if(cursor){

								if(cursor.value.folder == filepathoffiletodelete){

									foderidoffiletodelete = cursor.value.folderid

								}

								cursor.continue();

							}

				    	}

				    	trans.oncomplete = function(event) {

				    		var trans2 = db.transaction(["files"], "readwrite")
							var objectStore2 = trans2.objectStore("files")
							var req2 = objectStore2.openCursor();

							req2.onerror = function(event) {

								console.log("error: " + event);

							};

							req2.onsuccess = function(event) {

								var cursor2 = event.target.result;

								if(cursor2){

									if (cursor2.value.filefolder == foderidoffiletodelete){

										if (cursor2.value.filename == filenametodelete) {

											var request = objectStore2.delete(cursor2.value.fileid);

											request.onerror = function(err) {
												console.log("error deleting file from db")
											}
											request.onsuccess = function(event) {
												// console.log("file deleted")
											}

										}

									}

									cursor2.continue();

								}

							}

							// ahora se comprobará si la carpeta que tenía ese fichero asociado tiene algún fichero asociado o tiene tags, si no, se borrará.
							trans2.oncomplete = function(event) {

								// tiene tags?
								var tienetags = "no";

								var trans = db.transaction(["folders"], "readonly")
								var objectStore = trans.objectStore("folders")
								var req = objectStore.openCursor();

								req.onerror = function(event) {

									console.log("error: " + event);
								};

								req.onsuccess = function(event) {

									var cursor = event.target.result;

									if(cursor){

										if(cursor.value.folderid == foderidoffiletodelete){


											if (cursor.value.foldertags != "") {

												tienetags = "si"
											}

										}

										cursor.continue();

									}

								}

								trans.oncomplete = function(event) {

									if (tienetags=="no") {

										var tienearchivosasociados = "no";

										var trans4 = db.transaction(["files"], "readonly")
										var objectStore4 = trans4.objectStore("files")
										var req4 = objectStore4.openCursor();

										req4.onerror = function(event) {

											console.log("error: " + event);
										};

										req4.onsuccess = function(event) {

											var cursor4 = event.target.result;

											if(cursor4){

												if(cursor4.value.filefolder == foderidoffiletodelete){

													tienearchivosasociados = "si";

												}

												cursor4.continue();

											}

										}

										trans4.oncomplete = function(event) {

											if (tienearchivosasociados == "no") { // se borra la carpeta de la bd

												var trans = db.transaction(["folders"], "readwrite")
												var objectStore = trans.objectStore("folders")
												var request = objectStore.delete(foderidoffiletodelete);

												request.onerror = function(err) {
													console.log("error deleting folder from db")
												}
												request.onsuccess = function(event) {
													// console.log("file deleted")
												}

											}

										}

									}

								}

							}

				    	}

				    }

				});

			}

		});

	}
	// -- fin sistema detección de carpetas y ficheros inexistente



	// para evitar selección del elemento cuando se le da a una imagen
	$(".archive a img").on('click', function(){
		$(this)[0].parentElement.parentElement.parentElement.classList.toggle("ui-selecting")
	})

	// para pintar diferentes carpetas según contenido mayoritario

	if (stopbecausebadfolder=="no") { // si es superado el test de carpetas inexistentes (si hay archivos inexistentes simplemente no hara nada pues el DOM estará vacío)

		var re = /(?:\.([^.]+))?$/; // expresión regular para detectar si un string tiene extensión

		$.each ($(".explofolder"), function(u) {

			var ext_generic = 0; // zip, rar, 7z, undefined
			var ext_image = 0; // jpg, jpeg, gif, png, svg, ico
			var ext_program = 0; // exe, com, bat, dll, bin, sys, ini
			var ext_audio = 0; // wav, mp3, midi, pcm, aiff, aac, ogg, wma, flac
			var ext_video = 0; // mp4, avi, flv, mov, qt, asf, swf
			var ext_docs = 0; // pdf, epub, doc, docx, odx, odt
			var ext_www = 0; // html, xhml, css, php, url, xml, js
			var ext_document = 0; // txt, md, Y TODOS LOS DEMAS

			try {

				readedSubfolderElements = fs.readdirSync(driveunit + $(this)[0].getAttribute("value"))

			} catch (err) { };

			for (i = 0; i < readedSubfolderElements.length; i++) {

				var ext = re.exec(readedSubfolderElements[i])[1];
				if (ext) {
					ext = ext.toLowerCase();
				}

				if (ext == "zip" || ext == "rar" || ext == "7z" || ext == undefined) {
					ext_generic++
				}
				else if (ext == "jpg" || ext == "jpeg" || ext == "gif" || ext == "png" || ext == "svg" || ext == "ico") {
					ext_image++
				}
				else if (ext == "exe" || ext == "com" || ext == "bat" || ext == "dll" || ext == "bin" || ext == "sys" || ext == "ini") {
					ext_program++
				}
				else if (ext == "wav" || ext == "mp3" || ext == "midi" || ext == "pcm" || ext == "aiff" || ext == "aac" || ext == "ogg" || ext == "wma" || ext == "flac") {
					ext_audio++
				}
				else if (ext == "mp4" || ext == "m4a" || ext == "avi" || ext == "flv" || ext == "mov" || ext == "qt" || ext == "asf" || ext == "swf" || ext=="video") {
					ext_video++
				}
				else if (ext == "pdf" || ext == "epub" || ext == "doc" || ext == "docx" || ext == "odx" || ext == "odt") {
					ext_docs++
				}
				else if (ext == "html" || ext == "xhtml" || ext == "css" || ext == "php" || ext == "url" || ext == "xml" || ext == "js") {
					ext_www++
				}
				else {
					ext_document++
				}

			}

			var extensions = [ext_generic,ext_image,ext_program,ext_audio,ext_video,ext_docs,ext_www,ext_document],
		    maxExt = Math.max.apply(Math.max, extensions),
		    extNames = ["ext_generic","ext_image","ext_program","ext_audio","ext_video","ext_docs","ext_www","ext_document"],
		    maxExtName = extNames[extensions.indexOf(maxExt)];

		    if (searchviewmode==1) {

		    	switch (maxExtName) {

			    	case "ext_generic":

				    	$(this)["0"].previousElementSibling.innerHTML = '<img src="../img/icons/folders_16px/Glossy_Generic.png">';
				    	break;

				    case "ext_image":

				    	$(this)["0"].previousElementSibling.innerHTML = '<img src="../img/icons/folders_16px/Glossy_Pictures.png">';
				    	break;

				    case "ext_program":

				    	$(this)["0"].previousElementSibling.innerHTML = '<img src="../img/icons/folders_16px/Glossy_Smart.png">';
				    	break;

				    case "ext_audio":

				    	$(this)["0"].previousElementSibling.innerHTML = '<img src="../img/icons/folders_16px/Glossy_Music.png">';
				    	break;

				    case "ext_video":

				    	$(this)["0"].previousElementSibling.innerHTML = '<img src="../img/icons/folders_16px/Glossy_Movies.png">';
				    	break;

				    case "ext_docs":

				    	$(this)["0"].previousElementSibling.innerHTML = '<img src="../img/icons/folders_16px/Glossy_Library.png">';
				    	break;

				    case "ext_www":

				    	$(this)["0"].previousElementSibling.innerHTML = '<img src="../img/icons/folders_16px/Glossy_Sites.png">';
				    	break;

				    case "ext_document":

				    	$(this)["0"].previousElementSibling.innerHTML = '<img src="../img/icons/folders_16px/Glossy_Document.png">';
				    	break;

				}

			    $(this)["0"].previousElementSibling.style.display = "inline-block";
			    $(this)["0"].previousElementSibling.style.background = "none";
			    $(this)["0"].previousElementSibling.style.marginLeft = "0px";

			}

		    else if (searchviewmode!=1) {

		    	switch (maxExtName) {

			    	case "ext_generic":

				    	$(this)["0"].previousElementSibling.innerHTML = '<img src="../img/icons/folders_420px/Glossy_Generic.png">';
				    	break;

				    case "ext_image":

				    	$(this)["0"].previousElementSibling.innerHTML = '<img src="../img/icons/folders_420px/Glossy_Pictures.png">';
				    	break;

				    case "ext_program":

				    	$(this)["0"].previousElementSibling.innerHTML = '<img src="../img/icons/folders_420px/Glossy_Smart.png">';
				    	break;

				    case "ext_audio":

				    	$(this)["0"].previousElementSibling.innerHTML = '<img src="../img/icons/folders_420px/Glossy_Music.png">';
				    	break;

				    case "ext_video":

				    	$(this)["0"].previousElementSibling.innerHTML = '<img src="../img/icons/folders_420px/Glossy_Movies.png">';
				    	break;

				    case "ext_docs":

				    	$(this)["0"].previousElementSibling.innerHTML = '<img src="../img/icons/folders_420px/Glossy_Library.png">';
				    	break;

				    case "ext_www":

				    	$(this)["0"].previousElementSibling.innerHTML = '<img src="../img/icons/folders_420px/Glossy_Sites.png">';
				    	break;

				    case "ext_document":

				    	$(this)["0"].previousElementSibling.innerHTML = '<img src="../img/icons/folders_420px/Glossy_Document.png">';
				    	break;

				}

			}

		})

	} // --fin pintar carpetas según contenido


	if (stopbecausebadfolder=="no") {  // si es superado el test de carpetas inexistentes (si hay archivos inexistentes simplemente no hará nada pues el DOM estará vacío)	}


		// para el preview de los epubs

		if (searchviewmode!=1 || previewepubonviewmode1!="no") {

			$.each ($(".explofile"), function(u) {

				var extension = $(this)["0"].nextSibling.innerText.toLowerCase();

				if (extension == "epub") {

					try {

						var filename = $(this)["0"].attributes[1].value
						var filepath = driveunit + $(this)["0"].attributes[2].value
						var filenamesinbarra = $(this)["0"].attributes[1].value.substring(1);

						var booktopreview = filepath + filename;

					  	// primero se accede a los ficheros internos del epub (que en realidad es un zip)
					  var zip = new AdmZip(booktopreview);
						// var zipEntries = zip.getEntries();

						// se extrae el cover.jpg del epub ha una carpeta temporal
						if (s.os.name == "windows") {
							zip.extractEntryTo(/*entry name*/ "OEBPS/Images/cover.jpg", /*target path*/ filepath + "\/temp-epubcover"+u+ filenamesinbarra+"", /*maintainEntryPath*/false, /*overwrite*/true);

						}
						if (s.os.name == "linux") {

							var test = zip.getEntry("OEBPS/Images/cover.jpg")
							if (test) {
								console.log(test)
								zip.extractEntryTo("OEBPS/Images/cover.jpg", filepath + "\/temp-epubcover"+u+ filenamesinbarra+"", false, true);
							}

						}

				      	var imagesource = filepath + '/temp-epubcover'+u+ filenamesinbarra+'/cover.jpg'

				      	if (searchviewmode==1) {
				      		$(this)["0"].previousSibling.innerHTML = '<img src="file:///'+imagesource+'">';
							$(this)["0"].style.paddingRight = "2.5px"; // para que quede igualada con la misma columna de otros archivos
				      	}

				      	if (searchviewmode!=1) {

					      	$(this)["0"].previousSibling.innerHTML = '<img src="file:///'+imagesource+'">';

				      	}
				      	// se le quita la imagen de fondo
				      	$(this)["0"].previousSibling.style.backgroundImage = "none";
				      	$(this)["0"].previousSibling.classList.add("filepreview"); // para quitarle paddings y centrarlo
				      	$(this)["0"].previousSibling.style.display = "inline-block";

				      	// se borra la carpeta y archivo temporal que habiamos creado
				      	fs.remove(filepath + '\/temp-epubcover'+u+ filenamesinbarra +'', function (err) {
								if (err) {
									// console.log(err)
									// return console.error(err)
								}
								// console.log('success!')
						});

			      	} catch (err) { }

				}

			});

		}


		// para el audio

		if (searchviewmode==1) {

			//para tomar el tiempo del audio mediante la etiqueta audio

			$.each ($(".explofile"), function(u) {

				var extension = $(this)["0"].nextSibling.innerText.toLowerCase();
				if (extension == "mp3" || extension=="m4a" || extension=="mpeg" || extension == "ogg" || extension == "oga"  || extension == "aac" || extension == "wav") {

					if (extension=="m4a") {
						extension="mp4"
					}
					if (extension=="mp3" || extension=="mpeg") {
						extension="mpeg"
					}

					if (extension=="oga") {
						extension="ogg"
					}

					var audiotopreview = encodeURI(driveunit + $(this)["0"].attributes[2].value + $(this)["0"].attributes[1].value);

					$(this)["0"].previousSibling.innerHTML = '<audio width="0" class="audio" src="file:///'+audiotopreview+'" type="audio/'+extension.toLowerCase()+'"></audio>'

					var audio = $(this)["0"].previousSibling.children["0"]; // el tag audio
					var duration = $(this)["0"].nextSibling.nextSibling.nextSibling.nextSibling.nextSibling; // el div duracion

					var i = setInterval(function() {
						if(audio.readyState > 0) {
							var minutes = parseInt(audio.duration / 60, 10);
							var seconds = (audio.duration % 60).toFixed(0);

							// (Put the minutes and seconds in the display)
							duration.innerHTML = minutes + "m:" + seconds + "s"

							clearInterval(i);
						}

					}, 100);

				}

			});

		}

		if (searchviewmode!=1) {

			switch (searchviewmode) {
				case "2":
					var audiowidth = 98;
					break;
				case "3":
					var audiowidth = 132;
					break;
				case "4":
					var audiowidth = 170;
					break;
				case "5":
					var audiowidth = 212;
					break;
				case "6":
					var audiowidth = 258;
					break;
				case "7":
					var audiowidth = 308;
					break;
				case "8":
					var audiowidth = 362;
					break;
				case "9":
					var audiowidth = 420;
					break;
			}

			// para el preview de los audios
			$.each ($(".explofile"), function(u) {

				var extension = $(this)["0"].nextSibling.innerText.toLowerCase();
				if (extension == "mp3" || extension=="m4a" || extension=="mpeg" || extension == "ogg" || extension == "oga"  || extension == "aac" || extension == "wav") {

					if (extension=="m4a") {
						extension="mp4"
					}
					if (extension=="mp3" || extension=="mpeg") {
						extension="mpeg"
					}

					if (extension=="oga") {
						extension="ogg"
					}

					// para que muestre el div de duration
					$(this)["0"].nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.style.display = "inline-block";					
					var audiotopreview = encodeURI(driveunit + $(this)["0"].attributes[2].value + $(this)["0"].attributes[1].value);
					$(this)["0"].previousSibling.children[0].outerHTML = '<audio width="'+audiowidth+'" class="audio" src="file:///'+audiotopreview+'" type="audio/'+extension.toLowerCase()+'" controls></audio><div class="mmcontrols"><button class="playpause" title="play"></button><input class="volume" min="0" max="1" step="0.1" type="range" value="0.5"/><input type="range" class="seek-bar" value="0"></div>'
					$(this)["0"].previousSibling.style.backgroundImage = "none";
			      	$(this)["0"].previousSibling.classList.add("filepreview"); // para quitarle paddings y centrarlo

			      	var audio = $(this)["0"].previousElementSibling.children[0]; // el tag audio

			      	var duration = $(this)["0"].nextSibling.nextSibling.nextSibling.nextSibling.nextSibling; // el div duration

					// para recoger el tiempo total del audio, es necesario ponerle un setinterval para que pase un tiempo antes de que intente recoger el dato.
			      	var i = setInterval(function() {
						if(audio.readyState > 0) {
							var minutes = parseInt(audio.duration / 60, 10);
							var seconds = (audio.duration % 60).toFixed(0);

							// (Put the minutes and seconds in the display)
							duration.innerHTML = minutes + "m:" + seconds + "s"

							clearInterval(i);
						}

					}, 100);

					var parent = $(this)["0"].parentElement;

			      	// controles personalizados

			      	audio.controls = false;

					var playpause = $(this)["0"].previousSibling.children[1].childNodes["0"]; // el botón de play/pause
					var volume = $(this)["0"].previousSibling.children[1].childNodes["1"]; // el control de volumen
					var seekbar = $(this)["0"].previousSibling.children[1].childNodes["2"]; // el control de posición

			      	playpause.onclick = function() {

					   	if (audio.paused || audio.ended) {
					      	playpause.title = "pause";
					      	playpause.classList.toggle("down");
					      	parent.classList.toggle("ui-selecting"); // para evitar selección exploelement
					      	audio.play();
					   	}
					   	else {
					      	playpause.title = "play";
					     	playpause.classList.toggle("down");
					     	parent.classList.toggle("ui-selecting"); // para evitar selección exploelement
					      	audio.pause();
					   	}
					}
					volume.onchange = function() {

	   					audio.volume = volume.value;
	   					parent.classList.toggle("ui-selecting"); // para evitar selección exploelement
					}

					volume.onmousedown = function(e) {
						e.stopPropagation(); // para evitar que actué el trigger action del padre (es decir, el pressandHold), mientras se tenga pulsado el mouse button en este elemento
					}

					// el seekbar (para ver posición del playbabk y poder acceder a un tiempo determinado)

					seekbar.addEventListener("change", function() {
					  // Calculate the new time
					  var time = audio.duration * (seekbar.value / 100);
					  // Update the audio time
					  audio.currentTime = time;
					});
					// Update the seek bar as the audio plays
					audio.addEventListener("timeupdate", function() {
					  // Calculate the slider value
					  var value = (100 / audio.duration) * audio.currentTime;
					  // Update the slider value
					  seekbar.value = value;
					});
					// Pause the audio when the slider handle is being dragged
					seekbar.addEventListener("mousedown", function() {
					  audio.pause();
					});
					// Play the audio when the slider handle is dropped
					seekbar.addEventListener("mouseup", function() {
						if (playpause.title == "pause") { //si ya estaba ejecutándose
					  		audio.play();
						}
						parent.classList.toggle("ui-selecting"); // para evitar selección exploelement
					})
					seekbar.onmousedown = function(e) {
						e.stopPropagation(); // para evitar que actué el trigger action del padre (es decir, el pressandHold), mientras se tenga pulsado el mouse button en este elemento

					}

				}

			});

		}


		// para el video

		if (searchviewmode==1) {

			// para tomar el tiempo del video mediante la etiqueta video

			$.each ($(".explofile"), function(u) {

				var extension = $(this)["0"].nextSibling.innerText.toLowerCase();
				if (extension == "mp4" || extension == "m4v" || extension == "webm" || extension == "ogv") {

					if( extension=="m4v") {
						extension="mp4";
					}

					var videotopreview = encodeURI(driveunit + $(this)["0"].attributes[2].value + $(this)["0"].attributes[1].value);

					$(this)["0"].previousSibling.innerHTML = '<video width="0" class="video" src="file:///'+videotopreview+'" type="video/'+extension.toLowerCase()+'"></video>'

					var video = $(this)["0"].previousSibling.children["0"]; // el tag video
					var duration = $(this)["0"].nextSibling.nextSibling.nextSibling.nextSibling.nextSibling; // el div duration

					var i = setInterval(function() {
						if(video.readyState > 0) {
							var minutes = parseInt(video.duration / 60, 10);
							var seconds = (video.duration % 60).toFixed(0);

							// (Put the minutes and seconds in the display)
							duration.innerHTML = minutes + "m:" + seconds + "s"

							clearInterval(i);
						}

					}, 100);

				}

			});

		}

		if (searchviewmode!=1) {

			switch (searchviewmode) {
				case "2":
					var videowidth = 98;
					break;
				case "3":
					var videowidth = 132;
					break;
				case "4":
					var videowidth = 170;
					break;
				case "5":
					var videowidth = 212;
					break;
				case "6":
					var videowidth = 258;
					break;
				case "7":
					var videowidth = 308;
					break;
				case "8":
					var videowidth = 362;
					break;
				case "9":
					var videowidth = 420;
					break;
			}

			//para el preview de los videos
			$.each ($(".explofile"), function(u) {

				var extension = $(this)["0"].nextSibling.innerText.toLowerCase();
				if (extension == "mp4" || extension == "m4v" || extension == "webm" || extension == "ogv") {

					if( extension=="m4v") {
						extension="mp4";
					}

					// para que muestre el div de duration
					$(this)["0"].nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.style.display = "inline-block";
					var videotopreview = encodeURI(driveunit + $(this)["0"].attributes[2].value + $(this)["0"].attributes[1].value);
					$(this)["0"].previousSibling.children[0].outerHTML = '<video width="'+videowidth+'" class="video b-lazy" data-src="file:///'+videotopreview+'" src="" type="video/'+extension.toLowerCase()+'" controls></video><div class="mmcontrols"><button class="playpause" title="play"></button><input class="volume" min="0" max="1" step="0.1" type="range" value="0.5"/><input type="range" class="seek-bar" value="0"></div>'
					$(this)["0"].previousSibling.style.backgroundImage = "none";
			      	$(this)["0"].previousSibling.classList.add("filepreview"); // para quitarle paddings y centrarlo

			      	var video = $(this)["0"].previousElementSibling.children[0]; // el tag video
			      	var duration = $(this)["0"].nextSibling.nextSibling.nextSibling.nextSibling.nextSibling; // el div duration

					// para recoger el tiempo total del video, es necesario ponerle un setinterval para que pase un tiempo antes de que intente recoger el dato.
			      	var i = setInterval(function() {
						if(video.readyState > 0) {
							var minutes = parseInt(video.duration / 60, 10);
							var seconds = (video.duration % 60).toFixed(0);
							// (Put the minutes and seconds in the display)
							duration.innerHTML = minutes + "m:" + seconds + "s"
							clearInterval(i);
						}

					}, 100);

			      	var parent = $(this)["0"].parentElement;

			      	// controles personalizados

			      	video.controls = false;

					var playpause = $(this)["0"].previousSibling.children[1].childNodes["0"]; // el botón de play/pause
					var volume = $(this)["0"].previousSibling.children[1].childNodes["1"]; // el control de volumen
					var seekbar = $(this)["0"].previousSibling.children[1].childNodes["2"]; // el control de posición

			      	playpause.onclick = function() {

					   	if (video.paused || video.ended) {
					      	playpause.title = "pause";
					      	playpause.classList.toggle("down");
					      	parent.classList.toggle("ui-selecting"); // para evitar selección exploelement
					      	video.play();
					   	}
					   	else {
					      	playpause.title = "play";
					     	playpause.classList.toggle("down");
					     	parent.classList.toggle("ui-selecting"); // para evitar selección exploelement
					      	video.pause();
					   	}
					}
					volume.onchange = function() {

	   					video.volume = volume.value;
						parent.classList.toggle("ui-selecting"); // para evitar seleccion exploelement
					}

					volume.onmousedown = function(e) {
						e.stopPropagation(); // para evitar que actué el trigger action del padre (es decir, el pressandHold), mientras se tenga pulsado el mouse button en este elemento
					}


					// el seekbar (para ver posición del playbabk y poder acceder a un punto determinado)

					seekbar.addEventListener("change", function() {
					  // Calculate the new time
					  var time = video.duration * (seekbar.value / 100);
					  // Update the video time
					  video.currentTime = time;
					});

					// Update the seek bar as the video plays
					video.addEventListener("timeupdate", function() {
					  // Calculate the slider value
					  var value = (100 / video.duration) * video.currentTime;
					  // Update the slider value
					  seekbar.value = value;
					});
					// Pause the video when the slider handle is being dragged
					seekbar.addEventListener("mousedown", function() {
					  video.pause();
					});
					// Play the video when the slider handle is dropped
					seekbar.addEventListener("mouseup", function() {
						if (playpause.title == "pause") { // si ya estaba ejecutándose
					  		video.play();
						}
						parent.classList.toggle("ui-selecting"); // para evitar selección exploelement
					})
					seekbar.onmousedown = function(e) {
						e.stopPropagation(); // para evitar que actué el trigger action del padre (es decir, el pressandHold), mientras se tenga pulsado el mouse button en este elemento

					}

				}

			});

		}

		// simplemente para que se pueda seleccionar en nombre de cualquier elemento del resultado
		// $(".explofolder").on('dblclick', function(evt) {

		// 	alertify.alert("\/" + $(this)[0].childNodes[1].innerHTML);

		// });
		// $(".explofile").on('dblclick', function(evt) {

		// 	if (searchviewmode==1){
		// 		alertify.alert($(this)[0].childNodes[3].innerHTML + "\/" + $(this)[0].childNodes[1].innerHTML);
		// 	} else {
		// 		alertify.alert("\/" + $(this)[0].childNodes[1].innerHTML);
		// 	}

		// });

		// pequeño ajuste para que la vista de los resultados siempre ocupe toda la altura del wraper y así se puedan seleccionar los elementos con la cajetilla del ratón
		if ($("#searchdirview-wrapper").height() > $("#searchdirectoryview").height()) {
			$("#searchdirview").css("height", "97%")
		} else {
			$("#searchdirectoryview").css("padding-bottom", "10px")

		}

		drawdirectoryviewtags();
		interactinsforsearchdir();

		// para cargar, segun se hace scroll, las imágenes (y videos)
		setTimeout(function(){ //se le pone un pequeño delay sino a veces no hace todas a la primera
			var bLazy = new Blazy({
			    container: '#searchdirview-wrapper',
			    success: function(element){

			    	// varios estilos (searchviewmode1): quitar fondo, etc.. en tras cada imagen cargada 
			    	if (searchviewmode==1){
					    $(element).parent().parent().css("background","none"); // quita el icono de imagen
					 	$(element).parent().parent().css("display","inline-block");
						$(element).parent().parent().css("padding-right","0px");

						$(element).css("padding-right", "1px");

						// esto es para centrar verticalmente la imagen
						var toaddpaddingtop = (16 - $(element).height()) / 2;
						if (toaddpaddingtop > 0) {
							$(element).css("padding-top", toaddpaddingtop+"px")
						}
						if (toaddpaddingtop == 7.5 || toaddpaddingtop <= 0) {
							$(element).css("vertical-align", "middle");
							$(element).css("margin-top", "-3px");
						}
					}

			    }

			});
			
		}, 50);



	}

} // --fin drawSearchAfter()


function drawdirectoryviewtags (){

	// primero creamos divs independientes para cada tags (pero solo con el id)
	var trans = db.transaction(["tags"], "readonly")
	var objectStore = trans.objectStore("tags")

	var elementosdirectorio = $(".exploelement .tags");

	var tagvalue = [];
	var tagsdivs = [];
	var tagticket = [];

	$.each(elementosdirectorio, function(i) {

		tagsdivs[i]="";

		if (elementosdirectorio[i].attributes[1].nodeValue!=0) {

			tagticket[i] = elementosdirectorio[i].attributes[1].nodeValue.split(',');

			for(var k = 0; k < tagticket[i].length; k += 1){ // recorremos el objeto

				tagsdivs[i] += "<div class='tagticket' value='"+ tagticket[i][k] +"'> " + tagticket[i][k] +  "</div>" ;

			};
			// se mete el contenido (los tagsticket) en el html
			$( ".exploelement .tags:eq( "+ i +" )" ).html(tagsdivs[i]);

		}

	});

	// se lee cada etiqueta (solo con id) del html
	elementosdirectoriotags = $(".exploelement .tags .tagticket");

	if (elementosdirectoriotags.length > 0) {

		$.each(elementosdirectoriotags, function(i) {

			var req = objectStore.openCursor();

			req.onerror = function(event) {

				console.log("error: " + event);

			};

			req.onsuccess = function(event) {

				var cursor = event.target.result;

				if (cursor) {

					if (cursor.value.tagid == elementosdirectoriotags[i].attributes[1].nodeValue) {

						var color = "#" + cursor.value.tagcolor;

						if (cursor.value.tagcolor == "808080") {
							var complecolor = "#000"
						} else if (cursor.value.tagcolor == "000000"){
							var complecolor = "#FFF"
						} else {
							var complecolor = hexToComplimentary(color);
						}

						elementosdirectoriotags[i].className += " small " + cursor.value.tagform;
						elementosdirectoriotags[i].setAttribute("value", cursor.value.tagid);
						elementosdirectoriotags[i].setAttribute("style", "background-color: #" + cursor.value.tagcolor + ";" + "color: " + complecolor + ";")
						elementosdirectoriotags[i].innerHTML = cursor.value.tagtext;

					}

					cursor.continue();

				}

			};

			trans.oncomplete = function() {

				elementstagsorder(); // activa interacciones tagtickets del directorio (para poder cambiar orden)
				elemetstagdelete(); // activa sistema borrado tags

			}

		});

	}
	else {

		elementstagsorder(); // activa interacciones tagtickets del directorio (para poder cambiar orden)
		elemetstagdelete(); // activa sistema borrado tags

	}

}



function interactinsforsearchdir() {


	// Añadir tag en Archivo

	$('.exploelement.archive').droppable({

		accept: '.footertagticket',

		drop: function( event, ui ) {

			if (ui.draggable["0"].classList.contains("footertagticket")) { // si lo que se intenta droppear es un tag (no es necesario pero lo dejo para tenerlo a mano)

				// devolvemos tag a posición original
				ui.draggable["0"].style.top = "0px";
				ui.draggable["0"].style.left = "0px";

				// para que no se produzca dropp en el overflow hacemos unas mediciones y ponemos un condicional
				var positiontop = ui.offset.top + 5 // la altura a la que se ha hecho el dropp. (absoluta) el + 5 es un margen necesario para que quede bien

				var wrapperbottom = $('#searchdirview-wrapper').position().top + $('#searchdirview-wrapper').outerHeight(true); // posicion del limite inferior del wrapper (absoluta)

				if (positiontop < wrapperbottom) {

					taganadir = ui.draggable["0"].attributes[1].value;

					var arraydetags=[];

					var filename = $(this).children('.explofile');
					filename = filename.attr("value");

					var filefoldername = $(this).children(".explofile");
					filefoldername = filefoldername.attr("filepath");

					var extension = $(this).children('.exploext');
					extension = extension[0].textContent;

					var folder = $(this).children('.explofile');
					folder = folder.attr("filepath");

					var fileupdate = {};

					// vamos a comprobar si ya estaba la carpeta y si no está la añadimos a la base de dato (aunque sea sin tags)

					isnew="yes";

					var trans = db.transaction(["folders"], "readwrite")
					var objectStore = trans.objectStore("folders")
					var req = objectStore.openCursor();

					req.onerror = function(event) { // si el cursor da error

						console.log("error: " + event);

					};

					req.onsuccess = function(event) {

						var cursor = event.target.result; // posición del cursor

						if(cursor){

							if(cursor.value.folder == folder){ // la carpeta madre ya esta en la base de datos

								isnew="no";
								fileupdate.filefolder = cursor.value.folderid; // para añadir luego

							}

							cursor.continue();
						} // -- fin cursor

					} // -- fin onsuccess

					trans.oncomplete = function(e) { // vamos a añadir nueva carpeta madre

						if (isnew=="yes") {

							var trans = db.transaction(["folders"], "readwrite")
							var request = trans.objectStore("folders")
								.put({ folder: folder, foldertags: [] }); // el id no hace falta pues es autoincremental


							request.onerror = function(event){

								console.log("error carpeta madre no añadida: " + event);

							}

							request.onsuccess = function(event){

								// console.log("carpeta madre añadida!");

								trans.oncomplete = function(e) { // vamos a tomar el id de la carpeta añadida

									var trans = db.transaction(["folders"], "readonly")
									var objectStore = trans.objectStore("folders")
									var req = objectStore.openCursor();

									req.onerror = function(event) {

										console.log("error: " + event);

									};

									req.onsuccess = function(event) {

										var cursor = event.target.result;

										if(cursor){

											if(cursor.value.folder == folder){

												fileupdate.filefolder = cursor.value.folderid;

											}

											cursor.continue();
										}

										trans.oncomplete = function(e) { // vamos a añadir los datos del nuevo fichero (si la carpeta era nueva el fichero tambien)

											fileupdate.filename = filename;
											fileupdate.fileext = extension;
											fileupdate.filetags = taganadir;

											var trans = db.transaction(["files"], "readwrite")
											var request = trans.objectStore("files")
												.add(fileupdate);

											request.onerror = function(event) {

												console.log("error datos nuevo fichero no añadidos:" + event);

											};
											request.onsuccess = function(event) {

												// console.log("datos nuevo fichero añadidos");

												$("#undo", window.parent.document).attr("data-tooltip", "UNDO (tag archive)");
												undo.class = "tag archive";
												undo.taggaarch.archid = event.target.result;
												undo.taggaarch.archive = fileupdate.filename;
												undo.taggaarch.folderid = fileupdate.filefolder;
												undo.taggaarch.tagid = taganadir;

												// Actualizar visual
												var elementtagsinview = $(".explofile").filter("[filepath='" + filefoldername + "']").filter("[value='" + filename + "']").siblings(".tags");
												var arraydetags = taganadir // solo hay un tag a añadir
												elementtagsinview[0].setAttribute("value", arraydetags);

												// y ahora redibujamos los tags..
												arraydetags = arraydetags.split(','); // volvemos a convertirlo en array (aunque solo haya un tag)
												var tagsdivs = "";
												for(var k = 0; k < arraydetags.length; k += 1){ // recorremos el array
													tagsdivs += "<div class='tagticket' value='"+ arraydetags[k] +"'>" + arraydetags[k] +  "</div>" ;
												};
												elementtagsinview[0].innerHTML = tagsdivs;

												// para aplicarles los estilos a los tags hay que recurrir a la bd
												var trans2 = db.transaction(["tags"], "readonly")
												var objectStore2 = trans2.objectStore("tags")

												var elementosdirectoriotags = elementtagsinview.children(".tagticket");

												var req2 = objectStore2.openCursor();

												req2.onerror = function(event) {
													console.log("error: " + event);
												};
												req2.onsuccess = function(event) {
													var cursor2 = event.target.result;
													if (cursor2) {
														$.each(elementosdirectoriotags, function(n) {
															if (cursor2.value.tagid == elementosdirectoriotags[n].getAttribute("value")) {

																var color = "#" + cursor2.value.tagcolor;
																var complecolor = hexToComplimentary(color);

																elementosdirectoriotags[n].className += " small " + cursor2.value.tagform;
																elementosdirectoriotags[n].setAttribute("value", cursor2.value.tagid);
																elementosdirectoriotags[n].setAttribute("style", "background-color: #" + cursor2.value.tagcolor + ";" + "color: " + complecolor + ";")
																elementosdirectoriotags[n].innerHTML = cursor2.value.tagtext;

															}
														});

														cursor2.continue();
													}

												};

												trans2.oncomplete = function(event) {

													elementstagsorder(); // activa interacciones tagtickets del directorio (para poder cambiar orden)
													elemetstagdelete(); // activa sistema borrado tags

												}

											};

										} // -- fin trans (añadir nuevo fichero dentro de nueva carpeta)

									} // -- fin onsuccess

								} // -- fin trans (tomar id nueva carpeta)

							} // -- fin onsuccess

						} // -- fin if (si el archivo esta en una nueva carpeta)
						else { // -- si el archivo esta en una carpeta ya añadida a la base de datos

							// hay que comprobar que si el fichero es nuevo o no

							isnew="yes"; // valor por defecto (dejar asi, no poner window)
							isnewtag="yes";

							var trans = db.transaction(["files"], "readwrite")
							var objectStore = trans.objectStore("files")
							var req = objectStore.openCursor();

							req.onerror = function(event) {

								console.log("error: " + event);
							};

							req.onsuccess = function(event) {

							 // fileupdate.filefolder ya esta definido más arriba
								fileupdate.filename = filename;
								fileupdate.fileext = extension;
								fileupdate.filetags = taganadir;

								var cursor = event.target.result;

								if(cursor){

									if (cursor.value.filefolder == fileupdate.filefolder) { // cuando el id del folder coincide

										if (cursor.value.filename == fileupdate.filename) { // si el archivo ya estaba en la bd

											isnew = "no";
											fileupdate.fileid = cursor.value.fileid; // nos da el id del último success (el fichero añadido)
											arraydetags = cursor.value.filetags;

										}

									}

									cursor.continue();
								}

							}

							trans.oncomplete = function(e) { // preparados para meter los datos del fichero tanto si es nuevo como si no

								if (isnew=="no") { // si el fichero no es nuevo

									if (typeof arraydetags == "string") {

										arraydetags = arraydetags.split(",");

									}
									for (i in arraydetags) { // recorremos los tags que tenia

										if (arraydetags[i] == taganadir) { // si ya estaba

											isnewtag = "no"; // no se añadirá

											arraydetags = arraydetags.toString();
											return;

										}

									}


									if (isnewtag=="yes") { // si es un nuevo tag para el archivo, se añadirá (si no es, no se mete nada y ya esta)
											arraydetags = arraydetags + "," + taganadir;

									}

									fileupdate.filetags = arraydetags;

									var trans = db.transaction(["files"], "readwrite")
											var request = trans.objectStore("files")
												.put(fileupdate);

									request.onerror = function(event) {

										console.log("error datos nuevo fichero no añadidos:" + event);

									};

									request.onsuccess = function(event) {

										// console.log("datos nuevo fichero añadidos");

										$("#undo", window.parent.document).attr("data-tooltip", "UNDO (tag archive)");
										undo.class = "tag archive";
										undo.taggaarch.archid = event.target.result;
										undo.taggaarch.archive = fileupdate.filename;
										undo.taggaarch.folderid = fileupdate.filefolder;
										undo.taggaarch.tagid = taganadir;

										// Actualizar visual
										// console.log(filefoldername)

										var elementtagsinview = $(".explofile").filter("[filepath='" + filefoldername + "']").filter("[value='" + filename + "']").siblings(".tags");
										// console.log($(".placehold2").filter("[value='" + filefoldername + "']"))
										arraydetags = arraydetags.toString() // de array a string
										elementtagsinview[0].setAttribute("value", arraydetags);

										// y ahora redibujamos los tags..
										arraydetags = arraydetags.split(','); // volvemos a convertirlo en array
										tagsdivs = "";
										for(var k = 0; k < arraydetags.length; k += 1){ // recorremos el array
											tagsdivs += "<div class='tagticket' value='"+ arraydetags[k] +"'>" + arraydetags[k] +  "</div>" ;
										};
										elementtagsinview[0].innerHTML = tagsdivs;

										// para aplicarles los estilos a los tags hay que recurrir a la bd
										var trans2 = db.transaction(["tags"], "readonly")
										var objectStore2 = trans2.objectStore("tags")

										elementosdirectoriotags = elementtagsinview.children(".tagticket");

										var req2 = objectStore2.openCursor();

										req2.onerror = function(event) {
											console.log("error: " + event);
										};
										req2.onsuccess = function(event) {
											var cursor2 = event.target.result;
											if (cursor2) {
												$.each(elementosdirectoriotags, function(n) {
													if (cursor2.value.tagid == elementosdirectoriotags[n].getAttribute("value")) {

														var color = "#" + cursor2.value.tagcolor;
														var complecolor = hexToComplimentary(color);

														elementosdirectoriotags[n].className += " small " + cursor2.value.tagform;
														elementosdirectoriotags[n].setAttribute("value", cursor2.value.tagid);
														elementosdirectoriotags[n].setAttribute("style", "background-color: #" + cursor2.value.tagcolor + ";" + "color: " + complecolor + ";")
														elementosdirectoriotags[n].innerHTML = cursor2.value.tagtext;

													}
												});

												cursor2.continue();

											}

										};

										trans2.oncomplete = function(event) {

											elementstagsorder(); // activa interacciones tagtickets del directorio (para poder cambiar orden)
											elemetstagdelete(); // activa sistema borrado tags

										}

									};

								} // -- fin si el archivo no era nuevo (en una carpeta que ya estaba en la bd)
								else { // si el archivo es nuevo (en una carpeta que ya estaba en la bd)

									fileupdate.filetags = taganadir;

									var trans = db.transaction(["files"], "readwrite")
											var request = trans.objectStore("files")
												.add(fileupdate);

									request.onerror = function(event) {

										console.log("error datos nuevo fichero no añadidos:" + event);

									};
									request.onsuccess = function(event) {

										// console.log("datos nuevo fichero añadidos");

										$("#undo", window.parent.document).attr("data-tooltip", "UNDO (tag archive)");
										undo.class = "tag archive";
										undo.taggaarch.archid = event.target.result;
										undo.taggaarch.archive = fileupdate.filename;
										undo.taggaarch.folderid = fileupdate.filefolder;
										undo.taggaarch.tagid = taganadir;

										// Actualizar visual
										var elementtagsinview = $(".explofile").filter("[filepath='" + filefoldername + "']").filter("[value='" + filename + "']").siblings(".tags");
										var arraydetags = taganadir // solo hay un tag a añadir
										elementtagsinview[0].setAttribute("value", arraydetags);

										// y ahora redibujamos los tags..
										arraydetags = arraydetags.split(','); // volvemos a convertirlo en array (aunque solo haya un tag)
										var tagsdivs = "";
										for(var k = 0; k < arraydetags.length; k += 1){ // recorremos el array
											tagsdivs += "<div class='tagticket' value='"+ arraydetags[k] +"'>" + arraydetags[k] +  "</div>" ;
										};
										elementtagsinview[0].innerHTML = tagsdivs;

										// para aplicarles los estilos a los tags hay que recurrir a la bd
										var trans2 = db.transaction(["tags"], "readonly")
										var objectStore2 = trans2.objectStore("tags")

										var elementosdirectoriotags = elementtagsinview.children(".tagticket");

										var req2 = objectStore2.openCursor();

										req2.onerror = function(event) {
											console.log("error: " + event);
										};
										req2.onsuccess = function(event) {
											var cursor2 = event.target.result;
											if (cursor2) {
												$.each(elementosdirectoriotags, function(n) {
													if (cursor2.value.tagid == elementosdirectoriotags[n].getAttribute("value")) {

														var color = "#" + cursor2.value.tagcolor;
														var complecolor = hexToComplimentary(color);

														elementosdirectoriotags[n].className += " small " + cursor2.value.tagform;
														elementosdirectoriotags[n].setAttribute("value", cursor2.value.tagid);
														elementosdirectoriotags[n].setAttribute("style", "background-color: #" + cursor2.value.tagcolor + ";" + "color: " + complecolor + ";")
														elementosdirectoriotags[n].innerHTML = cursor2.value.tagtext;

													}
												});

												cursor2.continue();

											}

										};

										trans2.oncomplete = function(event) {

											elementstagsorder(); // activa interacciones tagtickets del directorio (para poder cambiar orden)
											elemetstagdelete(); // activa sistema borrado tags

										}

									};

								} // --fin else (archivo nuevo, carpeta vieja)

							} // --fin trans

						} // --fin else (carpeta vieja)

					}; // --fin trans

				} // --fin de cuando se ha hecho drop de un tag

			} // --fin if para el overflow

		}

	});


	// Añadir tag a carpeta

	$('.exploelement.folder').droppable({

		accept: '.footertagticket, .exploelement',

		drop: function( event, ui ) {

			if (ui.draggable["0"].classList.contains("footertagticket")) { // si lo que se intenta droppear es un tag (no es necesario pero lo dejo para tenerlo a mano)

				// devolvemos tag a posición original
				ui.draggable["0"].style.top = "0px";
				ui.draggable["0"].style.left = "0px";

			 	// para que no se produzca dropp en el overflow hacemos unas mediciones y ponemos un condicional
				var positiontop = ui.offset.top + 5 //la altura a la que se ha hecho el dropp. (absoluta), el 5 es un margen necesario
				var wrapperbottom = $('#searchdirview-wrapper').position().top + $('#searchdirview-wrapper').outerHeight(true); // posicion del limite inferior del wrapper (absoluta)

				if (positiontop < wrapperbottom) {

					window.taganadir = ui.draggable["0"].attributes[1].value;

					var escarpeta = $(this).children().hasClass('explofolder');

					var arraydetags=[];

					//  SI ES CARPETA (no hace falta)
					if (escarpeta) {

						var addtagtosubelements = "no";
						var treeelementtagsinview = [];

						var level = $(this).children('.explofolder');
						var carpeta = level.attr("value"); // desde el value del div

						folder = $(this)["0"].childNodes[1].attributes[1].value; // la ruta completa donde esta el item

						ffoldertoaddtags = folder; // se utiliza al añadir tags a subelementos, con addtagsubs(), si procede

						var isnew = "yes"; // valor por defecto que dice que la carpeta no estaba previamente en la base de datos
						folderupdate = {}; // objeto que luego hay que pasar con todos sus valore para hacer un update en la base de datos

						var trans = db.transaction(["folders"], "readwrite")
						var objectStore = trans.objectStore("folders")
						var req = objectStore.openCursor();

						req.onerror = function(event) { // si el cursor da error

							console.log("error: " + event);
						};

						req.onsuccess = function(event) {

							var cursor = event.target.result; // posición del cursor

							if(cursor){

								if(cursor.value.folder == folder){ // si el folder de la posición del cursor es igual al nombre con ruta del folder dibujado

									isnew="no"; // la carpeta ya esta en la base de datos

									folderupdate.folderid = cursor.value.folderid; // se pasan valores que ya tenía desde el cursor
									folderupdate.folder = cursor.value.folder;

									var isnewtag = "yes" // valor por defecto
									var arraydetags = cursor.value.foldertags; // variable temporal donde se mete el array de tags desde el curso para hacer unas comprobaciones a continuación. El array puede estar vacío

									for (i in arraydetags) { // recorremos los tags que tenia

										if (arraydetags[i] == taganadir) { // si ya estaba

											isnewtag = "no"; // no se añadirá

											$("#undo", window.parent.document).attr("data-tooltip", "UNDO (tag folder)");
											undo.class = "tag folder";
											undo.taggfold.foldid = folderupdate.folderid;
											undo.taggfold.tagid = taganadir;
											undo.taggfold.folder = folderupdate.folder;

											if(localStorage["asktagsubeleents"]=="yes"){
												popup("addtagtosubelements"); // aunque no se añade a la carpeta madre se preguntará como siempre que sea una carpeta si se quiere añadir a subelementos
											}
											return;

										}

									}

									if (isnewtag=="yes") { // si es un un nuevo tag para la carpeta, se añadirá

										if (typeof arraydetags === "string") {
											arraydetags = arraydetags.split(",");
										}

										arraydetags.push(taganadir);

									}

									folderupdate.foldertags = arraydetags;

									// ahora que ya tenemos todos los datos del objeto hacemos update con el en la base de datos
									var res = cursor.update(folderupdate);

									res.onerror = function(event){

										console.log("error tag no añadida: " + event);

									}

									res.onsuccess = function(event){

										// console.log("tag añadida!");

										$("#undo", window.parent.document).attr("data-tooltip", "UNDO (tag folder)");
										undo.class = "tag folder";
										undo.taggfold.foldid = folderupdate.folderid;
										undo.taggfold.tagid = taganadir;
										undo.taggfold.folder = folderupdate.folder;

										// Actualizar visual
										elementtagsinview = $('.explofolder').filter('[value="' + carpeta + '"]').siblings('.tags');
										arraydetags = arraydetags.toString() // de array a string
										elementtagsinview[0].setAttribute("value", arraydetags);

										// se redibujarán los tags del treeview si están desplegadas las subcarpetas
										$.each ($("#filetree span"), function(t) {

											if($("#filetree span:eq("+t+")").attr("rel2") == undo.taggfold.folder) {

												treeelementtagsinview = $("#filetree span:eq("+t+")")[0].children[2] // el div tags del treeview
											}

										});

										// y ahora redibujamos los tags..
										arraydetags = arraydetags.split(','); // volvemos a convertirlo en array
										tagsdivs = "";
										for(var k = 0; k < arraydetags.length; k += 1){ // recorremos el array
											tagsdivs += "<div class='tagticket' value='"+ arraydetags[k] +"'>" + arraydetags[k] +  "</div>" ;
										};
										elementtagsinview[0].innerHTML = tagsdivs;

										if (treeelementtagsinview) { // si está visible la carpeta en el treeview

											treeelementtagsinview.innerHTML = tagsdivs;
											treeelementosdirectoriotags = treeelementtagsinview.children

											// vamos a pintar los estilos para los tags del treeview
											var trans2 = db.transaction(["tags"], "readonly")
											var objectStore2 = trans2.objectStore("tags")

											var req2 = objectStore2.openCursor();

											req2.onerror = function(event) {
												console.log("error: " + event);
											};
											req2.onsuccess = function(event) {
												var cursor2 = event.target.result;
												if (cursor2) {
													if(treeelementosdirectoriotags){
														$.each (treeelementosdirectoriotags, function(u) {
															if (cursor2.value.tagid == treeelementosdirectoriotags[u].getAttribute("value")) {

																var color = "#" + cursor2.value.tagcolor;
																var complecolor = hexToComplimentary(color);

																treeelementosdirectoriotags[u].className = "tagticket verysmall " + cursor2.value.tagform;
																treeelementosdirectoriotags[u].setAttribute("value", cursor2.value.tagid);
																treeelementosdirectoriotags[u].setAttribute("style", "background-color: #" + cursor2.value.tagcolor + ";" + "color: " + complecolor + ";")
																treeelementosdirectoriotags[u].innerHTML = cursor2.value.tagtext;

															}

														});
													}

													cursor2.continue();
												}

											};

										}

										// para aplicarles los estilos a los tags del directorio también hay que recurrir a la bd
										var trans2 = db.transaction(["tags"], "readonly")
										var objectStore2 = trans2.objectStore("tags")

										var elementosdirectoriotags = elementtagsinview.children(".tagticket");

										var req2 = objectStore2.openCursor();

										req2.onerror = function(event) {
											console.log("error: " + event);
										};
										req2.onsuccess = function(event) {
											var cursor2 = event.target.result;
											if (cursor2) {
												$.each(elementosdirectoriotags, function(n) {
													if (cursor2.value.tagid == elementosdirectoriotags[n].getAttribute("value")) {

														var color = "#" + cursor2.value.tagcolor;
														var complecolor = hexToComplimentary(color);

														elementosdirectoriotags[n].className += " small " + cursor2.value.tagform;
														elementosdirectoriotags[n].setAttribute("value", cursor2.value.tagid);
														elementosdirectoriotags[n].setAttribute("style", "background-color: #" + cursor2.value.tagcolor + ";" + "color: " + complecolor + ";")
														elementosdirectoriotags[n].innerHTML = cursor2.value.tagtext;

													}
												});

												cursor2.continue();

											}

										};

										trans2.oncomplete = function(event) {

											elementstagsorder(); // activa interacciones tagtickets del directorio (para poder cambiar orden)
											elemetstagdelete(); // activa sistema borrado tags
											if(localStorage["asktagsubeleents"]=="yes"){
												popup("addtagtosubelements");
											}

										}

									}

								}

								cursor.continue(); // avanzar posición cursor en base de datos capetas y reiterar

							} // --fin cursor

						}; // --fin req.onsuccess (del opencursor)

						trans.oncomplete = function(e) { // tras completar la transacción (que habrá añadido el tag si la carpeta ya estaba en la base de datos)

							if (isnew=="yes") { // si la carpeta no estaba en la base de datos

								// añadimos el objeto con sus parámetros mediante put
								var request = db.transaction(["folders"], "readwrite")
									.objectStore("folders")
									.put({ folder: folder, foldertags: [taganadir] }); // el id no hace falta pues es autoincremental

								request.onerror = function(event){

									console.log("error tag no añadida: " + event);

								}

								request.onsuccess = function(event){

									// console.log("tag añadida!");

									$("#undo", window.parent.document).attr("data-tooltip", "UNDO (tag folder)");
									undo.class = "tag folder";
									undo.taggfold.foldid = event.target.result; // el nuevo id de la carpeta
									undo.taggfold.tagid = taganadir;
									undo.taggfold.folder = folder;

									// Actualizar visual
									elementtagsinview = $('.explofolder').filter('[value="' + carpeta + '"]').siblings('.tags');
									arraydetags = taganadir //solo hay un tag a añadir
									elementtagsinview[0].setAttribute("value", arraydetags);

									// se redibujarán los tags del treeview si están desplegadas las subcarpetas
									$.each ($("#filetree span"), function(t) {
										if($("#filetree span:eq("+t+")").attr("rel2") == undo.taggfold.folder) {
											// console.log($("#filetree span:eq("+t+")")[0]);
											treeelementtagsinview = $("#filetree span:eq("+t+")")[0].children[2] // el div tags del treeview
										}

									});

									// y ahora redibujamos los tags..
									arraydetags = arraydetags.split(','); // volvemos a convertirlo en array (aunque solo haya un tag)
									tagsdivs = "";
									for(var k = 0; k < arraydetags.length; k += 1){ // recorremos el array
										tagsdivs += "<div class='tagticket' value='"+ arraydetags[k] +"'>" + arraydetags[k] +  "</div>" ;
									};
									elementtagsinview[0].innerHTML = tagsdivs;

									if (treeelementtagsinview) { // si está visible la carpeta en el treeview

										treeelementtagsinview.innerHTML = tagsdivs;
										treeelementosdirectoriotags = treeelementtagsinview.children

										// vamos a pintar los estilos para los tags del treeview
										var trans2 = db.transaction(["tags"], "readonly")
										var objectStore2 = trans2.objectStore("tags")

										var req2 = objectStore2.openCursor();

										req2.onerror = function(event) {
											console.log("error: " + event);
										};
										req2.onsuccess = function(event) {
											var cursor2 = event.target.result;
											if (cursor2) {
												$.each (treeelementosdirectoriotags, function(u) {
													if (cursor2.value.tagid == treeelementosdirectoriotags[u].getAttribute("value")) {

														var color = "#" + cursor2.value.tagcolor;
														var complecolor = hexToComplimentary(color);

														treeelementosdirectoriotags[u].className = "tagticket verysmall " + cursor2.value.tagform;
														treeelementosdirectoriotags[u].setAttribute("value", cursor2.value.tagid);
														treeelementosdirectoriotags[u].setAttribute("style", "background-color: #" + cursor2.value.tagcolor + ";" + "color: " + complecolor + ";")
														treeelementosdirectoriotags[u].innerHTML = cursor2.value.tagtext;

													}
												});

												cursor2.continue();

											}

										};

									}

									// para aplicarles los estilos a los tags hay que recurrir a la bd
									var trans2 = db.transaction(["tags"], "readonly")
									var objectStore2 = trans2.objectStore("tags")

									var elementosdirectoriotags = elementtagsinview.children(".tagticket");

									var req2 = objectStore2.openCursor();

									req2.onerror = function(event) {
										console.log("error: " + event);
									};
									req2.onsuccess = function(event) {
										var cursor2 = event.target.result;
										if (cursor2) {
											$.each(elementosdirectoriotags, function(n) {
												if (cursor2.value.tagid == elementosdirectoriotags[n].getAttribute("value")) {

													var color = "#" + cursor2.value.tagcolor;
													var complecolor = hexToComplimentary(color);

													elementosdirectoriotags[n].className = "tagticket small " + cursor2.value.tagform;
													elementosdirectoriotags[n].setAttribute("value", cursor2.value.tagid);
													elementosdirectoriotags[n].setAttribute("style", "background-color: #" + cursor2.value.tagcolor + ";" + "color: " + complecolor + ";")
													elementosdirectoriotags[n].innerHTML = cursor2.value.tagtext;

												}
											});

											cursor2.continue();

										}

									};

									trans2.oncomplete = function(event) {

										elementstagsorder(); // activa interacciones tagtickets del directorio (para poder cambiar orden)
										elemetstagdelete(); // activa sistema borrado tags

										if(localStorage["asktagsubeleents"]=="yes"){
											popup("addtagtosubelements");
										}

									}

								}

							}

						} // -- fin trans.oncomplete

					} // -fin si es carpeta (sobra)

				} // --fin if posicion (si el drop es dentro de lo visible)

			} // fin in footertagg

		}

	}); // --fin añadir tags carpetas


	// Lo siguiente es sustitutivo de press & hold (consume muchos menos recursos)

	var timeoutId = 0;
	var elemento = ""
	var startDate = "";
	var endDate   = "";


	$('.explofile, .explofolder, .exploelement>div:first-child, .progress-bar').on('mousedown', function() {

		elemento = this
		startDate = new Date();

		if (!$(this).children().hasClass("editing") && !$(this).hasClass("jpg") && !$(this).hasClass("jpeg") && !$(this).hasClass("png") && !$(this).hasClass("gif") && !$(this).hasClass("bmp") && !$(this).hasClass("svg") && !$(this).hasClass("xbm") && !$(this).hasClass("ico")&& !$(this).children().children().hasClass("playpause")){ //si no se esta editando ni es imagen (que se abrirá con el abigimage) ni multimedia (por los controles)

			$(this).parent()[0].className += " progress-wrap progress";
			$(this).parent()[0].setAttribute("data-progress-percent", "100");
			//se añade div hijo para barra
			var posiciony = $(this).parent()["0"].offsetTop
			var posicionx = $(this).parent()["0"].offsetLeft
			var barrahija = document.createElement("div");
    		$(this).parent()[0].appendChild(barrahija);
    		$(this).parent()[0].lastChild.className += "progress-bar progress";
    		$(this).parent()[0].lastChild.innerHTML = "&nbsp;"
    		$(this).parent()[0].lastChild.style.top = posiciony + "px";
    		$(this).parent()[0].lastChild.style.left = posicionx + "px";

    		if (viewmode != 1){
    			$(this).parent()[0].lastChild.style.width = $(this).parent().width() + "px";
    		}

    		function moveProgressBar() {

		        var getPercent = ($('.progress-wrap').data('progress-percent') / 100);
		        var getProgressWrapWidth = $('.progress-wrap').width();
		        var progressTotal = posicionx + getPercent * getProgressWrapWidth;
		        var animationLength = 200;

		        // on page load, animate percentage bar to data percentage length
		        // .stop() used to prevent animation queueing
		        $('.progress-bar').stop().animate({
		            left: progressTotal
		        }, animationLength);

		    }

    		moveProgressBar();


			//para que no se seleccione con el press and hold
			window.estadoprevioseleccion = "";
			if ($(this).parent().hasClass("ui-selecting")) {
				estadoprevioseleccion = "selecting"
			}
			else if ($(this).parent().hasClass("ui-selected")) {
				estadoprevioseleccion = "selected"
			}


			$('.explofile, .explofolder, .exploelement>div:first-child, .progress-bar').on('mouseup', function() {


				$('.explofile, .explofolder, .exploelement>div:first-child, .progress-bar').unbind('mouseup');
				endDate   = new Date();
				var diferencia_milisegundos = (endDate.getTime() - startDate.getTime());

				if (diferencia_milisegundos > 200) {
					presshold()
				}

				// se quita barra de progrso
				$(this).parent()[0].classList.remove("progress-wrap");
				$(this).parent()[0].classList.remove("progress");
				$(this).parent()[0].removeAttribute("data-progress-percent");
				$(".progress-bar").remove();


			});

		}

	});


	function presshold() {

		// para que no se seleccione con el press and hold
		window.elementoestadoprevioseleccion = $(elemento).parent();
		setTimeout(function() {
			if (estadoprevioseleccion == "selecting") {
				elementoestadoprevioseleccion.addClass("ui-selecting",65)
			}
			else if (estadoprevioseleccion == "selected") {
				elementoestadoprevioseleccion.addClass("ui-selected",65)
			}
			else if (estadoprevioseleccion == "") {
				elementoestadoprevioseleccion.removeClass("ui-selecting",65);
				elementoestadoprevioseleccion.removeClass("ui-selected",65);
			}
		}, 275);


		if ($(elemento).hasClass("explofile")) {

			// var s = top.explorer.s
			s = new Sniffr();
			s.sniff(agent);

			var toexec = $(elemento)["0"].attributes[1].nodeValue;
			var filepath = driveunit + $(elemento)["0"].attributes[2].nodeValue

			var aejecutar = filepath + toexec;

			if (s.os.name == "windows") {
				aejecutar = aejecutar.replace(/ /g, '^ '); // se añade ^ delante de los espacios para que lea bien
				aejecutar = aejecutar.replace(/\,/g, "^,");
				aejecutar = aejecutar.replace(/\&/g, "^&");
				aejecutar = aejecutar.replace(/\(/g, "^(");
				aejecutar = aejecutar.replace(/\)/g, "^)");
				require("child_process").exec(aejecutar);
			}
			if (s.os.name == "linux" || s.os.name == "macos") {

				aejecutar = aejecutar.replace(/ /g, '\\ '); // se añade \ delante de los espacios para que lea bien
				aejecutar = aejecutar.replace(/,/g, '\\\,');
				aejecutar = aejecutar.replace(/&/g, '\\\&');
				aejecutar = aejecutar.replace(/'/g, "\\\'");
				aejecutar = aejecutar.replace(/\(/g, "\\\(");
				aejecutar = aejecutar.replace(/\)/g, "\\\)");
				aejecutar = aejecutar.replace(/\[/g, '\\\[');
				aejecutar = aejecutar.replace(/\]/g, '\\\]');

				// si se puede visualizar con algul visualizador del sistema se visualizará aquí
				var sys = require('sys');
				var exec = require('child_process');
				if (s.os.name == "linux"){
					exec.exec('xdg-open' + ' ' + aejecutar);
				}
				else if (s.os.name == "macos") {
					exec.exec('open' + ' ' + aejecutar);
				}

				try { // si es un ejecutable se ejecutará aquí
					exec.execFile(aejecutar);
				}
				catch(exception) { }

			}

		}

		if ($(elemento).hasClass("explofolder")) {

			var carpeta = $(elemento)["0"].attributes[1].nodeValue;

			top.explorer.previousornext = "normal"
			top.explorer.readDirectory(driveunit + carpeta);

			// efecto en la pestaña explorer cuando se abre una carpeta desde el searcher

			$("#exploretab", top.document).addClass("animateonce");

			// para que el aviso de que se abre en explore, dure dependiendo el numero de archivos a abrir (para que le de tiempo a abrir)
			var elementsinfolder = $(elemento)[0].nextSibling.innerText
			elementsinfolder = +elementsinfolder.replace(" in folder","");

			if (elementsinfolder<100){
				elementsinfolder = 100; // para que el aviso no sea demasiado rapido
			}

			setTimeout(function myFunction() {
				$("#exploretab", top.document).removeClass("animateonce");
			}, (elementsinfolder*10.2)+400); // para que se vea el efecto un poco más de tiempo que el aviso
			customAlert("(FOLDER OPENING IN EXPLORE)...",elementsinfolder*10.2);


		}


		if ($(elemento).hasClass("imgmode"+searchviewmode+"")) {

			if ($(elemento).next().hasClass("explofile")) {

				s = new Sniffr();
				s.sniff(agent);

				var toexec = $(elemento)["0"].nextElementSibling.attributes[1].nodeValue;
				var filepath = driveunit + $(elemento)["0"].nextElementSibling.attributes[2].nodeValue

				var aejecutar = filepath + toexec;
				if (s.os.name == "windows") {
					aejecutar = aejecutar.replace(/ /g, '^ '); // se añade ^ delante de los espacios para que lea bien
					aejecutar = aejecutar.replace(/\,/g, "^,");
					aejecutar = aejecutar.replace(/\&/g, "^&");
					aejecutar = aejecutar.replace(/\(/g, "^(");
					aejecutar = aejecutar.replace(/\)/g, "^)");
					require("child_process").exec(aejecutar);
				}
				if (s.os.name == "linux" || s.os.name == "macos") {

					aejecutar = aejecutar.replace(/ /g, '\\ '); // se añade \ delante de los espacios para que lea bien
					aejecutar = aejecutar.replace(/,/g, '\\\,');
					aejecutar = aejecutar.replace(/&/g, '\\\&');
					aejecutar = aejecutar.replace(/'/g, "\\\'");
					aejecutar = aejecutar.replace(/\(/g, "\\\(");
					aejecutar = aejecutar.replace(/\)/g, "\\\)");
					aejecutar = aejecutar.replace(/\[/g, '\\\[');
					aejecutar = aejecutar.replace(/\]/g, '\\\]');

					// si se puede visualizar con algul visualizador del sistema se visualizará aquí
					var sys = require('sys');
					var exec = require('child_process');
					if (s.os.name == "linux"){
					exec.exec('xdg-open' + ' ' + aejecutar);
					}
					else if (s.os.name == "macos") {
						exec.exec('open' + ' ' + aejecutar);
					}

					try { // si es un ejecutable se ejecutará aquí
						exec.execFile(aejecutar);
					}
					catch(exception) { }
				}

			}

			if ($(elemento).next().hasClass("explofolder")) {

				var carpeta = $(elemento)["0"].nextElementSibling.attributes[1].nodeValue;

				top.explorer.previousornext = "normal"
				top.explorer.readDirectory(driveunit + carpeta);

				// efecto en la pestaña explorer cuando se abre una carpeta desde el searcher

				$("#exploretab", top.document).addClass("animateonce");

				// para que el aviso de que se abre en explore, dure dependiendo el numero de archivos a abrir (para que le de tiempo a abrir)
				var elementsinfolder = $(elemento)[0].nextSibling.nextSibling.innerText
				elementsinfolder = +elementsinfolder.replace(" in folder","");

				if (elementsinfolder<100){
					elementsinfolder = 100; // para que el aviso no sea demasiado rapido
				}

				setTimeout(function myFunction() {
					$("#exploretab", top.document).removeClass("animateonce");
				}, (elementsinfolder*10.2)+400); // para que se vea el efecto un poco más de tiempo que el aviso
				customAlert("(FOLDER OPENING IN EXPLORE)...",elementsinfolder*10.2);

			}

		}

	} //fin function pressandhold

	// Selector

	var elementpreviousindex = 0;
	var elementcurrentindex = 0;
	var nombreelementoprevio = "";

	$("#searchdirectoryview > div").on('mouseup', function(e) {

				// console.log($(this))
		var cursoractual = $(".tags > div").css('cursor');

		if (cursoractual == "pointer" || cursoractual == undefined ){

			if (!$(this)["0"].children[1].children[0].classList.contains("editing")) { // si no se está editando el span

				var els = document.getElementsByClassName("ui-selected");
				var i = 0;

				while (i < els.length) {
				    els[i].classList.add('ui-selecting');
				    i++
				}

				if ($(this).hasClass("ui-selecting")) {
					$(this).removeClass("ui-selecting");

				}
				else {

					if ($(this).children()[1].classList.contains("explofolder") || $(this).children()[1].classList.contains("explofile")) { // si no es ".."

						// console.log($(this))
						$(this).addClass("ui-selecting");
						$(this).removeClass("whitebackground");

						var nombreelemento = $(this)["0"].children[1].attributes[1].nodeValue

					}



					if(e.shiftKey) { // si se pulsa shift seleccionar las que quedan entre la anterior selección y la actual

					 	$.each ($("#searchdirectoryview > div"), function(u) {

							if (u>0) { // para evitar la carpeta ".." que no tiene propiedades y da error por undefined

								if ($("#searchdirectoryview > div:eq("+u+")")["0"].children[1].attributes[1].nodeValue == nombreelementoprevio ) {
									elementpreviousindex = u;
								}

								if ($("#searchdirectoryview > div:eq("+u+")")["0"].children[1].attributes[1].nodeValue == nombreelemento ) {
									elementcurrentindex = u;
								}
							}

						});


						if (elementpreviousindex > 0) {

							if (elementpreviousindex > elementcurrentindex) {

								$.each ($("#searchdirectoryview > div"), function(u) {

									if (u >= elementcurrentindex && u <= elementpreviousindex) {
										$("#searchdirectoryview > div:eq("+u+")")["0"].classList.add("ui-selecting");
										$("#searchdirectoryview > div:eq("+u+")")["0"].classList.remove("whitebackground");

									}

								});

							} else if (elementpreviousindex < elementcurrentindex) {

								$.each ($("#searchdirectoryview > div"), function(u) {

									if (u <= elementcurrentindex && u >= elementpreviousindex) {
										$("#searchdirectoryview > div:eq("+u+")")["0"].classList.add("ui-selecting");
										$("#searchdirectoryview > div:eq("+u+")")["0"].classList.remove("whitebackground");

									}

								});

							}

							elementpreviousindex = elementcurrentindex;

						}

					} else {

						elementpreviousindex = elementcurrentindex;
						nombreelementoprevio = nombreelemento

					}

				}

			}
			else {

			}

		}

	});


	$( "#searchdirview" ).selectable({

		filter: '.exploelement',
		cancel: '.tagticket, .mmcontrols',
		selecting: function(e, ui) { // on select
			elementpreviousindex = 0; // restear la selección múltiple con shift
		}
	}); // esto también aplica al DRAGGABLE

	// necesario para que funcione bien el selectable
	$( "#searchdirectoryview > div" ).draggable({

		// appendTo: 'parent',
		// containment: 'window',
		// scroll: false,
		helper: 'clone',
		delay: 10000,
		cancel: '.exploelementfolderup',

		start: function(ev, ui) {

			posiciony = $(this)["0"].offsetTop + "px"
			posicionx = $(this)["0"].offsetLeft + "px"

		},
		drag: function(ev, ui) {


			ui.position.left = posicionx;
			ui.position.top = posiciony;


		},
		stop: function( event, ui ) {	}

	}); // --fin Draggable #searchdirectoryview td/div


	// -- fin Selector


	// Editar nombre (activar)

	// $.each ($(".explofolder span"), function (i) {

	// 	activateeditname($(".explofolder span:eq("+i+")"));

	// });
	$.each ($(".explofile span"), function (i) {

		activateeditname($(".explofile span:eq("+i+")"));

	});

} // --fin interactinsforsearchdir()


// teclas accesos directos
function KeyPress(e) {

	if (!$("#popupbackground").hasClass("display") && !$("span").hasClass("editing")) { // para evitar teclas rapidas (especialmente supr) cuando hay un popup o se esta editando

	    var evtobj = window.event? event : e

	    if (evtobj.keyCode == 86 && evtobj.ctrlKey) { // Ctrl+v

	      window.parent.$("#paste").trigger( "click" );
	    }

	    else if (evtobj.keyCode == 46) { // delete
	    	window.parent.$("#delete").trigger( "click" );
	    }

	    else if (evtobj.keyCode == 88 && evtobj.ctrlKey) { // Ctrl+x

	      if (window.parent.pasteaction == "copy") {

	        window.parent.pasteaction = "cut";
	        window.parent.$(".onoffswitch-checkbox").addClass("check");
	        window.parent.$(".onoffswitch-switch").css("background-color","#d5695d"); //red
	      }

	    }
	    else if (evtobj.keyCode == 67 && evtobj.ctrlKey) { // Ctrl+c

	      if (window.parent.pasteaction == "cut") {

	        window.parent.pasteaction = "copy";
	        window.parent.$(".onoffswitch-checkbox").removeClass("check");
			window.parent.$(".onoffswitch-switch").css("background-color","#439bd6"); //blue
	      }

	    }
	    else if (evtobj.keyCode == 65 && evtobj.ctrlKey) { // Ctrl+a
	    	$(".exploelement").removeClass("ui-selected");
	    	$(".exploelement").removeClass("ui-selecting");
	    	$(".exploelement").addClass("ui-selecting");
	    	return false; //para que no seleccione otras cosas (por defecto)

	    }

	}

}

document.onkeydown = KeyPress;
// --fin teclas accesos directos

// funciones necesarias para crear un evento que en dblclick el contenteditable adquiera foco (para editar nombre)
function getMouseEventCaretRange(evt) {
	var range, x = evt.clientX, y = evt.clientY;

	// Try the simple IE way first
	if (document.body.createTextRange) {
		range = document.body.createTextRange();
		range.moveToPoint(x, y);
	}

	else if (typeof document.createRange != "undefined") {
		// Try Mozilla's rangeOffset and rangeParent properties,
		// which are exactly what we want
		if (typeof evt.rangeParent != "undefined") {
			range = document.createRange();
			range.setStart(evt.rangeParent, evt.rangeOffset);
			range.collapse(true);
		}

		// Try the standards-based way next
		else if (document.caretPositionFromPoint) {
			var pos = document.caretPositionFromPoint(x, y);
			range = document.createRange();
			range.setStart(pos.offsetNode, pos.offset);
			range.collapse(true);
		}

		// Next, the WebKit way
		else if (document.caretRangeFromPoint) {
			range = document.caretRangeFromPoint(x, y);
		}
	}

	return range;
}
function selectRange(range) {
	if (range) {
		if (typeof range.select != "undefined") {
			range.select();
		} else if (typeof window.getSelection != "undefined") {
			var sel = window.getSelection();
			sel.removeAllRanges();
			sel.addRange(range);
		}
	}
}


// Activar Editar nombre (se le llama en interactions)
function activateeditname(item) {

	// definimos el evento on dblckick set focus
	item.on('dblclick', function(evt) {

		window.nombreoriginal = $(this).text();

		var rect = this.getBoundingClientRect();

		// quitamos la capacidad de interacción mientras se edita
		$(this).addClass("editing"); // para que no ejecute instrucciones del pressAndHold (estipulado en jquery.pressAndHold.js)
		$("#directoryview > div").draggable({ disabled: true }); //cuando estemos editando no se podrán arrastrar items
		$( "#dirview" ).selectable( "destroy" );

		evt = evt || window.event;
		this.contentEditable = true;
		this.focus();

		// para que no mueva columnas cuando lo que se intenta es seleccionar texto
		if (viewmode==1) {
			interact('.explofolder, .explofile')

				.resizable({
					enabled: false
				})

			interact('.folderelements, .exploext')

				.resizable({
					enabled: false
				})

			interact('.explosize')

				.resizable({
					enabled: false
				})

			interact('.exploelement .tags')

				.resizable({
					enabled: false
				})

			interact('.lastmod')

				.resizable({
					enabled: false
				});

			interact('.duration')

				.resizable({
					enabled: false
				});
		}

		var caretRange = getMouseEventCaretRange(evt);

		// Set a timer to allow the selection to happen and the dust settle first
		window.setTimeout(function() {
			selectRange(caretRange);
		}, 10);
		return false;

	});


	// si se pulsara enter o escape
	item.on("keydown",function(e){
		var key = e.keyCode || e.charCode;  // ie||others

		if(key == 13) { // si se pulsa enter
			e.preventDefault();
			$(this).blur();
		}

		if(key == 27) { // si se pulsa escape
			e.preventDefault();
			$(this).html(nombreoriginal);
			$(this).blur();

		}

	});


	// al perder foco
	item.on("blur",function(e){

		var editando = "no"
		var idacambiar = "";
		var elementochangevalue = "";
		var tagsdelelemento = "";

		var nombrenuevo = $(this).text();

		if (nombrenuevo.replace(/\s/g, '').length != 0) {

			// restauramos todas las interacciones
			$(this).removeClass("editing");
			$(this).attr('contenteditable','false');  // para que no se quede editando si se da click en el div

			$("#directoryview > div").draggable({ disabled: false });
			$( "#dirview" ).selectable({filter: '.exploelement'});

			if (viewmode==1) {
				interact('.explofolder, .explofile')

					.resizable({
						enabled: true
					})

				interact('.folderelements, .exploext')

					.resizable({
						enabled: true
					})

				interact('.explosize')

					.resizable({
						enabled: true
					})

				interact('.exploelement .tags')

					.resizable({
						enabled: true
					})

				interact('.lastmod')

					.resizable({
						enabled: true
					});

				interact('.duration')

					.resizable({
						enabled: true
					});
			}


			if (nombreoriginal == nombrenuevo) {

				// console.log("sin cambios");


			} else { // si ha habido cambios

				// // si es carpeta

				// if ($(this).parent().is(".explofolder")) {

				// 	elementochangevalue = $(this).parent();

				// 	// primero se busca en la base de datos si estába la carpeta con el nombre original
				// 	var trans = db.transaction(["folders"], "readonly");
				// 	var objectStore = trans.objectStore("folders");
				// 	var req = objectStore.openCursor();

				// 	req.onerror = function(event) {

				// 		console.log("error: " + event);
				// 	};

				// 	req.onsuccess = function(event) {

				// 		var cursor = event.target.result;

				// 		if(cursor){

				// 			if (cursor.value.folder == rootdirectory + "\/" + nombreoriginal) {

				// 				idacambiar = cursor.value.folderid
				// 				tagsdelelemento = cursor.value.foldertags; // este parámetro se usará a la hora de actualizar el item en el treeview si está desplegado

				// 			}

				// 			cursor.continue()

				// 		}

				// 	}

				// 	trans.oncomplete = function(event) {

				// 		if (idacambiar != "") { // si estába en la base de datos

				// 			var folderupdate = {};

				// 			// se cambia el atributo value del explofolder
				// 			elementochangevalue[0].setAttribute("value", "\/" + nombrenuevo);

				// 			var trans = db.transaction(["folders"], "readonly")
				// 			var objectStore = trans.objectStore("folders")
				// 			var req = objectStore.openCursor();

				// 			req.onerror = function(event) {

				// 				console.log("error: " + event);
				// 			};

				// 			req.onsuccess = function(event) {

				// 				var cursor = event.target.result;

				// 				if(cursor){

				// 					if (cursor.value.folderid == idacambiar) {

				// 						folderupdate.folderid = cursor.value.folderid;
				// 						folderupdate.foldertags = cursor.value.foldertags;
				// 						folderupdate.folder = rootdirectory + "\/" + nombrenuevo;
				// 					}

				// 					cursor.continue();
				// 				}

				// 			}

				// 			trans.oncomplete = function(e) {

				// 				// cambiamos nombre en db
				// 				var trans = db.transaction(["folders"], "readwrite")
				// 				var request = trans.objectStore("folders")
				// 					.put(folderupdate);

				// 				request.onerror = function(event) {

				// 					console.log("error: nombre carpeta sin cambiar en db");

				// 				};
				// 				request.onsuccess = function(event) {

				// 					// console.log("nombre carpeta cambiado en db");

				// 					// cambiamos nombre en filesystem
				// 					fs.rename(driveunit + rootdirectory + '\/' + nombreoriginal, driveunit + rootdirectory + '\/' + nombrenuevo, function(err) {
				// 					if ( err ) console.log('ERROR: ' + err);
				// 					});

				// 					$("#undo", window.parent.document).attr("data-tooltip", "UNDO (rename folder)");
				// 					undo.class = "rename folder";
				// 					undo.rename.folder= driveunit + rootdirectory;
				// 					undo.rename.original = nombreoriginal;
				// 					undo.rename.nuevo = nombrenuevo;
				// 					undo.rename.indb = "yes";
				// 					undo.rename.id = folderupdate.folderid;

				// 				}

				// 				trans.oncomplete = function(event) {

				// 					// hay que mirar si hay subcarpetas cuyo path inicie con el path de la carpeta madre a la que sele ha hecho el cambio de nombre
				// 					var folderupdate=[];

				// 					var pathachequear = rootdirectory + "\/" + nombreoriginal;
				// 					var pathaponer = rootdirectory + "\/" + nombrenuevo;

				// 					var trans = db.transaction(["folders"], "readwrite")
				// 					var objectStore = trans.objectStore("folders")
				// 					var req = objectStore.openCursor();

				// 					req.onerror = function(event) {

				// 						console.log("error: " + event);
				// 					};

				// 					req.onsuccess = function(event) {

				// 						var cursor = event.target.result;

				// 						if(cursor){

				// 							if(cursor.value.folder.substring(0, pathachequear.length) == pathachequear) { // si empieza por el path antiguo

				// 								if(cursor.value.folder != pathaponer) {

				// 									var newname = cursor.value.folder.replace(pathachequear, pathaponer);

				// 									folderupdate.folderid = cursor.value.folderid;
				// 									folderupdate.foldertags = cursor.value.foldertags;
				// 									folderupdate.folder = newname;

				// 									var res20 = objectStore.put(folderupdate);

				// 									res20.onerror = function(event){
				// 										console.log("error ruta subcarpeta no cambiada: " + event);
				// 									}

				// 									res20.onsuccess = function(event){

				// 										// console.log("ruta subcarpeta cambiada");

				// 									}

				// 								}

				// 							}

				// 							cursor.continue();

				// 						}

				// 					}

				// 				}

				// 			}

				// 		} // --fin if en base de datos
				// 		else { // si no estába en base de datos

				// 			// se cambia el atributo value del explofolder
				// 			elementochangevalue[0].setAttribute("value", "\/" + nombrenuevo);

				// 			// cambiamos el nombre en el filesystem
				// 			fs.rename(driveunit + rootdirectory + '\/' + nombreoriginal, driveunit + rootdirectory + '\/' + nombrenuevo, function(err) {
				// 				if ( err ) console.log('ERROR: ' + err);
				// 			});

				// 			// hay que mirar si hay subcarpetas cuyo path inicie con el path de la carpeta madre a la que sele ha hecho el cambio de nombre
				// 			var folderupdate=[];

				// 			var pathachequear = rootdirectory + "\/" + nombreoriginal;
				// 			var pathaponer = rootdirectory + "\/" + nombrenuevo;

				// 			var trans = db.transaction(["folders"], "readwrite")
				// 			var objectStore = trans.objectStore("folders")
				// 			var req = objectStore.openCursor();

				// 			req.onerror = function(event) {

				// 				console.log("error: " + event);
				// 			};

				// 			req.onsuccess = function(event) {

				// 				var cursor = event.target.result;

				// 				if(cursor){

				// 					if(cursor.value.folder.substring(0, pathachequear.length) == pathachequear) { // si empieza por el path antiguo


				// 						var newname = cursor.value.folder.replace(pathachequear, pathaponer);

				// 						folderupdate.folderid = cursor.value.folderid;
				// 						folderupdate.foldertags = cursor.value.foldertags;
				// 						folderupdate.folder = newname;

				// 						var res20 = objectStore.put(folderupdate);

				// 						res20.onerror = function(event){
				// 							console.log("error ruta subcarpeta no cambiada: " + event);
				// 						}

				// 						res20.onsuccess = function(event){

				// 							// console.log("ruta subcarpeta cambiada");

				// 						}

				// 					}

				// 					cursor.continue();

				// 				}

				// 			}

				// 			$("#undo", window.parent.document).attr("data-tooltip", "UNDO (rename folder)");
				// 			undo.class = "rename folder";
				// 			undo.rename.folder= driveunit + rootdirectory;
				// 			undo.rename.original = nombreoriginal;
				// 			undo.rename.nuevo = nombrenuevo;
				// 			undo.rename.indb = "no";

				// 		}

				// 		// tras haber hecho los cambios en el directoryview vamos a comprobar si el folder esta desplegado en el treeview y en tal caso le hacemos el cambio

				// 		$.each ($("#filetree span"), function(i) {

				// 			if (driveunit + $("#filetree span")[i].getAttribute("rel2") == driveunit + rootdirectory + nombreoriginal || driveunit + $("#filetree span")[i].getAttribute("rel2") == driveunit + rootdirectory + "\/" + nombreoriginal) { // si está visible

				// 				$("#filetree span")[i].setAttribute("rel", '\/' + nombrenuevo);
				// 				$("#filetree span")[i].setAttribute("rel2", rootdirectory + '\/' + nombrenuevo);
				// 				$("#filetree span")[i].innerHTML = '<div class="holdButtonProgress"></div>' + nombrenuevo + '<div class="id"></div><div class="fttags">' + tagsdelelemento + '</div>';

				// 				if (typeof tagsdelelemento == "string") {
				// 					arraydetags = tagsdelelemento.split(','); // volvemos a convertirlo en array (aunque solo haya un tag)
				// 				}
				// 				else {
				// 					arraydetags = tagsdelelemento;
				// 				}
				// 				var tagsdivs = "";
				// 				for(var k = 0; k < arraydetags.length; k += 1){ // recorremos el array
				// 					tagsdivs += "<div class='tagticket' value='"+ arraydetags[k] +"'>" + arraydetags[k] +  "</div>" ;
				// 				};

				// 				var treeelementtagsinview = $("#filetree span:eq("+i+")")[0].children[2]; // el div tags del treeview

				// 				if (treeelementtagsinview) { // si está visible la carpeta en el treeview

				// 					treeelementtagsinview.innerHTML = tagsdivs;
				// 					treeelementosdirectoriotags = treeelementtagsinview.children

				// 					// vamos a pintar los estilos para los tags del treeview
				// 					var trans2 = db.transaction(["tags"], "readonly")
				// 					var objectStore2 = trans2.objectStore("tags")

				// 					var req2 = objectStore2.openCursor();

				// 					req2.onerror = function(event) {
				// 						console.log("error: " + event);
				// 					};
				// 					req2.onsuccess = function(event) {
				// 						var cursor2 = event.target.result;
				// 						if (cursor2) {
				// 							$.each (treeelementosdirectoriotags, function(u) {
				// 								if (cursor2.value.tagid == treeelementosdirectoriotags[u].getAttribute("value")) {

				// 									var color = "#" + cursor2.value.tagcolor;
				// 									var complecolor = hexToComplimentary(color);

				// 									treeelementosdirectoriotags[u].className = "tagticket verysmall " + cursor2.value.tagform;
				// 									treeelementosdirectoriotags[u].setAttribute("value", cursor2.value.tagid);
				// 									treeelementosdirectoriotags[u].setAttribute("style", "background-color: #" + cursor2.value.tagcolor + ";" + "color: " + complecolor + ";")
				// 									treeelementosdirectoriotags[u].innerHTML = cursor2.value.tagtext;

				// 								}
				// 							});

				// 							cursor2.continue();

				// 						}

				// 					};

				// 				}

				// 			}

				// 		});

				// 	}

				// } // --fin si es carpeta

				// si es archivo

				if ($(this).parent().is(".explofile")) {

					var carpetamadreid = "";
					var archivoenbd="no";
					var paraextensionarchivo = $(this).parent();

					var rootdirectory = $(this)["0"].parentNode.children[1].innerText

					$(this).parent().attr("value", '\/' + nombrenuevo); // cambiamos el atributo value

					var re = /(?:\.([^.]+))?$/; // expresión regular para detectar si un string tiene extensión
					var ext = re.exec(nombrenuevo)[1];
					if (!ext) {
						ext="&nbsp;";
					}
					// cambiamos el texto del div ext con el contenido de la variable ext
					$(this).parent().siblings(".exploext")[0].innerHTML = ext;

					// se busca en la base de datos si estába el archivo con el nombre original
					// primero se mira si la carpeta madre esta en la bd (si no está el archivo tampoco estará)
					var trans = db.transaction(["folders"], "readonly")
					var objectStore = trans.objectStore("folders")
					var req = objectStore.openCursor();

					req.onerror = function(event) {

						console.log("error: " + event);
					};

					req.onsuccess = function(event) {

						var cursor = event.target.result;

						if(cursor){

							if (cursor.value.folder == rootdirectory) {

								carpetamadreid = cursor.value.folderid

							}

							cursor.continue();

						}

					}

					trans.oncomplete = function(event) {

						if (carpetamadreid != "") { // si la carpeta madre esta en la bd, hay posibilidades de que archivo este también

							var fileupdate = {};

							var trans = db.transaction(["files"], "readonly")
							var objectStore = trans.objectStore("files")
							var req = objectStore.openCursor();

							req.onerror = function(event) {

								console.log("error: " + event);
							};

							req.onsuccess = function(event) {

								var cursor = event.target.result;

								if(cursor){

									if (cursor.value.filefolder == carpetamadreid) {

										if(cursor.value.filename == "\/" + nombreoriginal) {

											archivoenbd="yes";

											fileupdate.fileid = cursor.value.fileid;
											fileupdate.filefolder = cursor.value.filefolder;
											fileupdate.filetags = cursor.value.filetags;
											fileupdate.fileext = ext;

											fileupdate.filename = "\/" + nombrenuevo;

										}

									}

									cursor.continue();

								}

							}

							trans.oncomplete = function(event) {

								if (archivoenbd == "yes") { // si el archivo esta en la bd

									var trans = db.transaction(["files"], "readwrite")
									var request = trans.objectStore("files")
										.put(fileupdate);

									request.onerror = function(event) {

										console.log("error: nombre archivo sin cambiar en db");

									};
									request.onsuccess = function(event) {

										// console.log("nombre archivo cambiado en db");

										// cambiamos nombre en filesystem
										fs.rename(driveunit + rootdirectory + '\/' + nombreoriginal, driveunit + rootdirectory + '\/' + nombrenuevo, function(err) {

											// en el caso de que se trate de un video cambiar el src
											if ($(this)["0"].parentElement.previousSibling.children[1].nodeName == "VIDEO") {

												$(this)["0"].parentElement.previousSibling.children[1].src = encodeURI(driveunit + rootdirectory + '\/' + nombrenuevo);
											}

											if ( err ) console.log('ERROR: ' + err);
										});

										// en el caso de que se trate de una imagencambiar el src y href (no permite hacerlo como el video)
										$.each($('#dirview img'), function(n) {
											if($("#dirview img:eq("+n+")").attr('src') == driveunit + rootdirectory + '\/' + nombreoriginal){
												$("#dirview img:eq("+n+")").attr("src", driveunit + rootdirectory + '\/' + nombrenuevo);
											}
											if($("#dirview img:eq("+n+")").parent().attr('href') == "file:///" + driveunit + rootdirectory + '\/' + nombreoriginal){
												$("#dirview img:eq("+n+")").parent().attr("href", "file:///" + driveunit + rootdirectory + '\/' + nombrenuevo);

											}
										});

										$("#undo", window.parent.document).attr("data-tooltip", "UNDO (rename archive)");
										undo.class = "rename archive";
										undo.rename.folder= driveunit + rootdirectory;
										undo.rename.original = nombreoriginal;
										undo.rename.nuevo = nombrenuevo;
										undo.rename.indb = "yes";
										undo.rename.id = fileupdate.fileid;

									}

								}

								if (archivoenbd == "no") { // archivo no esta en db

									fs.rename(driveunit + rootdirectory + '\/' + nombreoriginal, driveunit + rootdirectory + '\/' + nombrenuevo, function(err) {

										// en el caso de que se trate de un video cambiar el src
										if ($(this)["0"].parentElement.previousSibling.children[1].nodeName == "VIDEO") {

											$(this)["0"].parentElement.previousSibling.children[1].src = encodeURI(driveunit + rootdirectory + '\/' + nombrenuevo);
										}

										if ( err ) console.log('ERROR: ' + err);
									});

									// en el caso de que se trate de una imagencambiar el src y href (no permite hacerlo como el video)
									$.each($('#dirview img'), function(n) {
										if($("#dirview img:eq("+n+")").attr('src') == driveunit + rootdirectory + '\/' + nombreoriginal){
											$("#dirview img:eq("+n+")").attr("src", driveunit + rootdirectory + '\/' + nombrenuevo);
										}
										if($("#dirview img:eq("+n+")").parent().attr('href') == "file:///" + driveunit + rootdirectory + '\/' + nombreoriginal){
											$("#dirview img:eq("+n+")").parent().attr("href", "file:///" + driveunit + rootdirectory + '\/' + nombrenuevo);

										}
									});


									$("#undo", window.parent.document).attr("data-tooltip", "UNDO (rename archive)");
									undo.class = "rename archive";
									undo.rename.folder= driveunit + rootdirectory;
									undo.rename.original = nombreoriginal;
									undo.rename.nuevo = nombrenuevo;
									undo.rename.indb = "no";

								}

							}


						} //-- fin if carpetamadre esta en bd

						if (carpetamadreid == "") {

							fs.rename(driveunit + rootdirectory + '\/' + nombreoriginal, driveunit + rootdirectory + '\/' + nombrenuevo, function(err) {

								// en el caso de que se trate de un video cambiar el src
								if ($(this)["0"].parentElement.previousSibling.children[1].nodeName == "VIDEO") {

									$(this)["0"].parentElement.previousSibling.children[1].src = encodeURI(driveunit + rootdirectory + '\/' + nombrenuevo);
								}

								if ( err ) console.log('ERROR: ' + err);
							});

							// en el caso de que se trate de una imagencambiar el src y href (no permite hacerlo como el video)
							$.each($('#dirview img'), function(n) {
								if($("#dirview img:eq("+n+")").attr('src') == driveunit + rootdirectory + '\/' + nombreoriginal){
									$("#dirview img:eq("+n+")").attr("src", driveunit + rootdirectory + '\/' + nombrenuevo);
								}
								if($("#dirview img:eq("+n+")").parent().attr('href') == "file:///" + driveunit + rootdirectory + '\/' + nombreoriginal){
									$("#dirview img:eq("+n+")").parent().attr("href", "file:///" + driveunit + rootdirectory + '\/' + nombrenuevo);

								}
							});

							$("#undo", window.parent.document).attr("data-tooltip", "UNDO (rename archive)");
							undo.class = "rename archive";
							undo.rename.folder= driveunit + rootdirectory;
							undo.rename.original = nombreoriginal;
							undo.rename.nuevo = nombrenuevo;
							undo.rename.indb = "no";

						}

					}

				}

			} // -- fin si ha habido cambios

		} // -- fin si el dato introducido contiene más que espacios en blanco
		else { // si está en blanco

			$(this).html(nombreoriginal);
			$(this).focus()
		}

	}); //-- fin al perder foco (tras edición)

	// -- fin Editar nombre
}



function elementstagsorder() { // activa interacciones tagtickets del directorio (para poder cambiar orden)

	var folderupdate = {};
	var fileupdate = {};

	$(".tags > div").draggable({
		revert: true,
		revertDuration: 600,
		containment: 'parent',

		start: function(ev, ui) {

			window.elementtagorder = $(this).parent().attr("value"); // orden de los tags original
			window.elementtags = $(this).parent(); // el div tags (para realizar campos en la modificación visual)

			// para que no se vea selección de todo el elemento cuando se hace dragg de los tagticket
			if ($(this).parent().parent().hasClass("ui-selecting")) {
				$(this).parent().parent().removeClass("ui-selecting");
			}
			else {
				// add selecting class if not
				$(this).parent().parent().addClass("ui-selecting");
				$(this).parent().parent().addClass("whitebackground");
			}

		}

	});

	$('.tags > div ').droppable({

		accept: '.tags > div',

		drop: function( event, ui ) {

			if(ui.draggable["0"].classList.contains("tagticket")){

				// se quita la clase especial que se habia puesto para que no se viera selección durante reposicionamiento tags
				$(this).parent().parent().removeClass("whitebackground");

				var draggid = ui.draggable["0"].attributes[1].value; // el id del dragg
				var droppid = $(this).attr("value"); // el id del dropp

				elementtagorder = elementtagorder.split(","); // a array (todavía viejo orden)

				for (i in elementtagorder) {

					if (elementtagorder[i] == droppid) {
						elementtagorder[i] = "temp";
					}
				}
				for (i in elementtagorder) {

					if (elementtagorder[i] == draggid) {
						elementtagorder[i] = droppid;
					}
				}
				for (i in elementtagorder) {

					if (elementtagorder[i] == "temp") {
						elementtagorder[i] = draggid;
					}
				}

				// ahora realizamos el cambio de orden en la visualización (value del tags y posición de los propios tagtickets)
				elementtagorder = elementtagorder.toString(); // de nuevo a string
				elementtags.attr("value", elementtagorder); // le ponemos el nuevo value a div tags

				elementtagorder = elementtagorder.split(","); // de nuevo a array

				var tagsdivs = "";

				for(var k = 0; k < elementtagorder.length; k += 1){ //recorremos el objeto

					tagsdivs += "<div class='tagticket' value='"+ elementtagorder[k] +"'> " + elementtagorder[k] +  "</div>" ;

				};
				// se mete el contenido (los tagsticket) en el html, solo ids
				elementtags.html(tagsdivs);

				// se pinta el contenido accediendo a la bd de tags para los estilos

				var elementostagsreordenados = elementtags.children(); // cada uno de los divs tagticket con id recién creados

				var trans = db.transaction(["tags"], "readonly")
				var objectStore = trans.objectStore("tags")

				$.each(elementostagsreordenados, function(i) {

					var req = objectStore.openCursor();

					req.onerror = function(event) {

						console.log("error: " + event);

					};

					req.onsuccess = function(event) {

						var cursor = event.target.result;

						if (cursor) {

							if (cursor.value.tagid == elementostagsreordenados[i].attributes[1].nodeValue) {

								var color = "#" + cursor.value.tagcolor;
								var complecolor = hexToComplimentary(color);

								elementostagsreordenados[i].className += " small " + cursor.value.tagform;
								elementostagsreordenados[i].setAttribute("value", cursor.value.tagid);
								elementostagsreordenados[i].setAttribute("style", "background-color: #" + cursor.value.tagcolor + ";" + "color: " + complecolor + ";")
								elementostagsreordenados[i].innerHTML = cursor.value.tagtext;

								elementstagsorder(); // activa interacciones tagtickets del directorio (para poder cambiar orden)
								elemetstagdelete(); // activa sistema borrado tags

							}

							cursor.continue();

						}

					};

					trans.oncomplete = function() {

						// ahora aquí se van a cambiar realmente los datos de la bd

						if (elementtags.parents().hasClass('folder')) { //si es carpeta

							var carpeteacambiartags = elementtags.parents()["0"].children[1].attributes[1].value; // utilizamos el atributo value del div explofolder

							var trans = db.transaction(["folders"], "readonly")
							var objectStore = trans.objectStore("folders")
							var req = objectStore.openCursor();

							req.onerror = function(event) {

								console.log("error: " + event);
							};

							req.onsuccess = function(event) {

								var cursor = event.target.result;

								if(cursor){

									if (cursor.value.folder == carpeteacambiartags) {

										folderupdate.folderid = cursor.value.folderid;
										folderupdate.folder = cursor.value.folder;
										folderupdate.foldertags = elementtagorder;

									}

									cursor.continue();

								}

							}

							trans.oncomplete = function (e) {

								var trans = db.transaction(["folders"], "readwrite")
								var request = trans.objectStore("folders")
									.put(folderupdate);

								// se va a actualizar la disposición de los tags en el treeview si estuviera visible

								$.each ($("#filetree span"), function(t) {

									if($("#filetree span:eq("+t+")").attr("rel2") == carpeteacambiartags) {

										elementtagorder = elementtagorder.toString();

										$("#filetree span:eq("+t+")").attr("value", elementtagorder);

										// y ahora redibujamos los tags..
										elementtagorder = elementtagorder.split(','); // volvemos a convertirlo en array
										var fttagsdivs = "";
										for(var k = 0; k < elementtagorder.length; k += 1){ //recorremos el array
											fttagsdivs += "<div class='tagticket' value='"+ elementtagorder[k] +"'>" + elementtagorder[k] +  "</div>" ;
										};

										$("#filetree span:eq("+t+")")[0].children[2].innerHTML = fttagsdivs;

										// para aplicarles los estilos a los tags hay que recurrir a la bd
										var trans2 = db.transaction(["tags"], "readonly")
										var objectStore2 = trans2.objectStore("tags")

										var tagsdelfolder = $("#filetree span:eq("+t+")").children(".fttags").children(".tagticket");

										var req2 = objectStore2.openCursor();

										req2.onerror = function(event) {
											console.log("error: " + event);
										};
										req2.onsuccess = function(event) {
											var cursor2 = event.target.result;
											if (cursor2) {
												$.each(tagsdelfolder, function(n) {

													if (cursor2.value.tagid == tagsdelfolder[n].getAttribute("value")) {

														var color = "#" + cursor2.value.tagcolor;
														var complecolor = hexToComplimentary(color);

														tagsdelfolder[n].className += " verysmall " + cursor2.value.tagform;
														tagsdelfolder[n].setAttribute("value", cursor2.value.tagid);
														tagsdelfolder[n].setAttribute("style", "background-color: #" + cursor2.value.tagcolor + ";" + "color: " + complecolor + ";")
														tagsdelfolder[n].innerHTML = cursor2.value.tagtext;

													}
												});

												cursor2.continue();

											}

										};

									}

								}); // --fin each (actualización tags de la carpeta en el treeview)

							}

						}

						else if (elementtags.parents().hasClass('archive')) { //si es archivo

							var archivoacambiartags = elementtags["0"].parentElement.children[1].attributes[1].value; //utilizamos el atributo value del div explofolder
							var idcarpetadelarchivo = "";

							var filepathfortags = elementtags["0"].parentElement.children[1].attributes[2].value; // el filepath

							// primero localizamos el id de la carpeta a la que pertenece el archivo
							var trans = db.transaction(["folders"], "readonly")
							var objectStore = trans.objectStore("folders")
							var req = objectStore.openCursor();

							req.onerror = function(event) {

								console.log("error: " + event);
							};

							req.onsuccess = function(event) {

								var cursor = event.target.result;

								if(cursor){

									if (cursor.value.folder == filepathfortags) {

										idcarpetadelarchivo = cursor.value.folderid;

									}

									cursor.continue();

								}

							}

							trans.oncomplete = function(event) {

								console.log(idcarpetadelarchivo);

								// ahora localizamos el archivo en la base de datos y actualizamos sus datos
								var trans = db.transaction(["files"], "readonly")
								var objectStore = trans.objectStore("files")
								var req = objectStore.openCursor();

								req.onerror = function(event) {

									console.log("error: " + event);
								};

								req.onsuccess = function(event) {

									var cursor = event.target.result;

									if(cursor){

										if (cursor.value.filefolder == idcarpetadelarchivo) {

											if (cursor.value.filename == archivoacambiartags) {

												fileupdate.fileid = cursor.value.fileid;
												fileupdate.filefolder = cursor.value.filefolder;
												fileupdate.filename = cursor.value.filename;
												fileupdate.fileext = cursor.value.fileext;
												fileupdate.filetags = elementtagorder;

											}

										}

										cursor.continue();
									}

								}

								trans.oncomplete = function (e) {

									var trans = db.transaction(["files"], "readwrite")
									var request = trans.objectStore("files")
										.put(fileupdate);

								}

							}

						}

					} // --fin trans

				}); // --fin each elementostagsreordenados, los tagtickets del elemento

			} // --fin if tagticket --- si se ha droppeado un tag para cambiar el orden

		} // --fin dropp

	}); // --fin droppable

} // --fin elementstagsorder()


function elemetstagdelete() {

	$('.tags > div').unbind('click'); // para restear las acciones del on click, y no haga dos veces o más veces por click una vez que se ejecuta elementstagdelete() varias veces.

	$(".tags > div").on('click', function() {

		var cursoractual = $(".tags > div").css('cursor');

		if (cursoractual != "pointer"){

			var tagaborrar = $(this);

			var iddeltagaborrar = $(this)["0"].attributes[1].value;
			var idtagsoriginales = $(this)["0"].parentElement.attributes[1].value;

			// console.log("id del tag a borrar: " + iddeltagaborrar)
			// console.log("del array de tags: " + idtagsoriginales)

			var idtagsrestantes = "";
			var idtagsrestantes = idtagsoriginales.split(",");

			idtagsrestantes = idtagsrestantes.filter(function(item) {
    			return item !== iddeltagaborrar;
			});

			if ($(this)["0"].parentElement.parentElement.classList.contains("folder")) {
				isfolderorarchive = "folder"
			}
			if ($(this)["0"].parentElement.parentElement.classList.contains("archive")) {
				isfolderorarchive = "archive"
			}

			nombreelementocontagaborrar = $(this)["0"].parentElement.parentElement.children[1].attributes[1].value;

			// ponemos el nuevo valor en el value del div tags
			$(this)["0"].parentElement.setAttribute("value", idtagsrestantes.toString());

			// si el tag pertenec a una carpeta
			if (isfolderorarchive == "folder") {

				var updatefolder = {};

				if (idtagsrestantes.length > 0) { // si queda algún tag (y por lo tanto la carpeta permanece si o si en la bd)

					var trans = db.transaction(["folders"], "readwrite")
					var objectStore = trans.objectStore("folders")
					var req = objectStore.openCursor();

					req.onerror = function(event) {

						console.log("error: " + event);
					};

					req.onsuccess = function(event) {


						var cursor = event.target.result;

						if(cursor){

							if(cursor.value.folder == nombreelementocontagaborrar){

								updatefolder.folderid = cursor.value.folderid;
								updatefolder.folder = cursor.value.folder;
								updatefolder.foldertags = idtagsrestantes;

								var res2 = cursor.update(updatefolder);

								res2.onerror = function(event){
									console.log("error: tag de carpeta no eliminada: " + event);
								}

								res2.onsuccess = function(event){

									// console.log("tag de carpeta eliminada");

									var treeelementtagsinview = "";

									$("#undo", window.parent.document).attr("data-tooltip", "UNDO (erase folder tag)");
									undo.class = "delete folder tag";
									undo.deltaggfold.foldid = updatefolder.folderid;
									undo.deltaggfold.tags = idtagsoriginales;
									undo.deltaggfold.folder = updatefolder.folder;

									// Actualizar visual

									// en el directorio solo hace falta hacer
									tagaborrar.remove(); //que es el $(this) de al hacer click (el tagticket)

									// se redibujarán los tags del treeview si se ve la carpeta
									$.each ($("#filetree span"), function(t) {

										if($("#filetree span:eq("+t+")").attr("rel2") == undo.deltaggfold.folder) {
											treeelementtagsinview = $("#filetree span:eq("+t+")")[0].children[2] //el div tags del treeview
										}

									});

									// y ahora redibujamos los tags..
									var tagsdivs = "";
									for(var k = 0; k < idtagsrestantes.length; k += 1){ // recorremos el array
										tagsdivs += "<div class='tagticket' value='"+ idtagsrestantes[k] +"'>" + idtagsrestantes[k] +  "</div>" ;
									};

									if (treeelementtagsinview) { // si está visible la carpeta en el treeview

										treeelementtagsinview.innerHTML = tagsdivs;
										var treeelementosdirectoriotags = treeelementtagsinview.children

										// vamos a pintar los estilos para los tags del treeview
										var trans2 = db.transaction(["tags"], "readonly")
										var objectStore2 = trans2.objectStore("tags")

										var req2 = objectStore2.openCursor();

										req2.onerror = function(event) {
											console.log("error: " + event);
										};
										req2.onsuccess = function(event) {
											var cursor2 = event.target.result;
											if (cursor2) {
												$.each (treeelementosdirectoriotags, function(u) {
													if (cursor2.value.tagid == treeelementosdirectoriotags[u].getAttribute("value")) {

														var color = "#" + cursor2.value.tagcolor;
														var complecolor = hexToComplimentary(color);

														treeelementosdirectoriotags[u].className = "tagticket verysmall " + cursor2.value.tagform;
														treeelementosdirectoriotags[u].setAttribute("value", cursor2.value.tagid);
														treeelementosdirectoriotags[u].setAttribute("style", "background-color: #" + cursor2.value.tagcolor + ";" + "color: " + complecolor + ";")
														treeelementosdirectoriotags[u].innerHTML = cursor2.value.tagtext;

													}
												});

												cursor2.continue();

											}

										};

									}

								}

							}

							cursor.continue();

						}

					}

				} //-- fin if idtagsrestantes.length > 0

				else { // si se queda a 0 tags

					var idcarpeta = "";

					// primero cogemos el id de la carpeta
					var trans = db.transaction(["folders"], "readonly")
					var objectStore = trans.objectStore("folders")
					var req = objectStore.openCursor();

					req.onerror = function(event) {

						console.log("error: " + event);
					};

					req.onsuccess = function(event) {

						var cursor = event.target.result;

						if(cursor){

							if(cursor.value.folder == nombreelementocontagaborrar){

								idcarpeta = cursor.value.folderid

							}

							cursor.continue();

						}

					}

					trans.oncomplete = function(event) {

						var aborrardedb = "si";

						// se va a mirar si hay archivos asociados a la carpeta

						var trans = db.transaction(["files"], "readonly")
						var objectStore = trans.objectStore("files")
						var req = objectStore.openCursor();

						req.onerror = function(event) {

							console.log("error: " + event);
						};

						req.onsuccess = function(event) {

							var cursor = event.target.result;

							if(cursor){

								if(cursor.value.filefolder == idcarpeta){

									aborrardedb="no";

								}

								cursor.continue();

							}

						}

						trans.oncomplete = function(event) {


							if (aborrardedb == "si") { // borramos de la bd

								var trans9 = db.transaction(["folders"], "readwrite")
								var request9 = trans9.objectStore("folders").delete(idcarpeta);

								request9.onerror = function(event) {

									console.log("error - no se ha eliminado carpeta de bd:" + event);

								};
								request9.onsuccess = function(event) {

									// console.log("eliminada carpeta de la bd");

									var treeelementtagsinview = "";

									$("#undo", window.parent.document).attr("data-tooltip", "UNDO (erase folder tag)");
									undo.class = "delete folder tag";
									undo.deltaggfold.foldid = "";
									undo.deltaggfold.tags = idtagsoriginales;
									undo.deltaggfold.folder = nombreelementocontagaborrar;

									// Actualizar visual

									// en el directorio solo hace falta hacer
									tagaborrar.remove(); // que es el $(this) de al hacer click (el tagticket)

									// se redibujarán los tags del treeview si se ve la carpeta
									$.each ($("#filetree span"), function(t) {

										if($("#filetree span:eq("+t+")").attr("rel2") == undo.deltaggfold.folder) {
											treeelementtagsinview = $("#filetree span:eq("+t+")")[0].children[2] // el div tags del treeview
										}

									});

									// y ahora redibujamos los tags..
									tagsdivs = "";
									for(var k = 0; k < idtagsrestantes.length; k += 1){ // recorremos el array
										tagsdivs += "<div class='tagticket' value='"+ idtagsrestantes[k] +"'>" + idtagsrestantes[k] +  "</div>" ;
									};

									if (treeelementtagsinview) { // si está visible la carpeta en el treeview

										treeelementtagsinview.innerHTML = tagsdivs;
										treeelementosdirectoriotags = treeelementtagsinview.children

										// vamos a pintar los estilos para los tags del treeview
										var trans2 = db.transaction(["tags"], "readonly")
										var objectStore2 = trans2.objectStore("tags")

										var req2 = objectStore2.openCursor();

										req2.onerror = function(event) {
											console.log("error: " + event);
										};
										req2.onsuccess = function(event) {
											var cursor2 = event.target.result;
											if (cursor2) {
												$.each (treeelementosdirectoriotags, function(u) {
													if (cursor2.value.tagid == treeelementosdirectoriotags[u].getAttribute("value")) {

														var color = "#" + cursor2.value.tagcolor;
														var complecolor = hexToComplimentary(color);

														treeelementosdirectoriotags[u].className = "tagticket verysmall " + cursor2.value.tagform;
														treeelementosdirectoriotags[u].setAttribute("value", cursor2.value.tagid);
														treeelementosdirectoriotags[u].setAttribute("style", "background-color: #" + cursor2.value.tagcolor + ";" + "color: " + complecolor + ";")
														treeelementosdirectoriotags[u].innerHTML = cursor2.value.tagtext;

													}

												});

												cursor2.continue();

											}

										};

									}

								}

							}

							if (aborrardedb == "no") { // solo quitamos la etiqueta

								var trans = db.transaction(["folders"], "readwrite")
								var objectStore = trans.objectStore("folders")
								var req = objectStore.openCursor();

								req.onerror = function(event) {

									console.log("error: " + event);
								};

								req.onsuccess = function(event) {

									var cursor = event.target.result;

									if(cursor){

										if(cursor.value.folder == nombreelementocontagaborrar){

											updatefolder.folderid = cursor.value.folderid;
											updatefolder.folder = cursor.value.folder;
											updatefolder.foldertags = idtagsrestantes;

											var res2 = cursor.update(updatefolder);

											res2.onerror = function(event){
												console.log("error: tag de carpeta no eliminada: " + event);
											}

											res2.onsuccess = function(event){

												// console.log("tag de carpeta eliminada");

												var treeelementtagsinview = "";

												$("#undo", window.parent.document).attr("data-tooltip", "UNDO (erase folder tag)");
												undo.class = "delete folder tag";
												undo.deltaggfold.foldid = updatefolder.folderid;
												undo.deltaggfold.tags = idtagsoriginales;
												undo.deltaggfold.folder = updatefolder.folder;

												// Actualizar visual

												// en el directorio solo hace falta hacer
												tagaborrar.remove(); //que es el $(this) de al hacer click (el tagticket)

												// se redibujarán los tags del treeview si se ve la carpeta
												$.each ($("#filetree span"), function(t) {

													if($("#filetree span:eq("+t+")").attr("rel2") == undo.deltaggfold.folder) {
														treeelementtagsinview = $("#filetree span:eq("+t+")")[0].children[2] //el div tags del treeview
													}

												});

												// y ahora redibujamos los tags..
												tagsdivs = "";
												for(var k = 0; k < idtagsrestantes.length; k += 1){ // recorremos el array
													tagsdivs += "<div class='tagticket' value='"+ idtagsrestantes[k] +"'>" + idtagsrestantes[k] +  "</div>" ;
												};

												if (treeelementtagsinview) { // si está visible la carpeta en el treeview

													treeelementtagsinview.innerHTML = tagsdivs;
													treeelementosdirectoriotags = treeelementtagsinview.children

													// vamos a pintar los estilos para los tags del treeview
													var trans2 = db.transaction(["tags"], "readonly")
													var objectStore2 = trans2.objectStore("tags")

													var req2 = objectStore2.openCursor();

													req2.onerror = function(event) {
														console.log("error: " + event);
													};
													req2.onsuccess = function(event) {
														var cursor2 = event.target.result;
														if (cursor2) {
															$.each (treeelementosdirectoriotags, function(u) {
																if (cursor2.value.tagid == treeelementosdirectoriotags[u].getAttribute("value")) {

																	var color = "#" + cursor2.value.tagcolor;
																	var complecolor = hexToComplimentary(color);

																	treeelementosdirectoriotags[u].className = "tagticket verysmall " + cursor2.value.tagform;
																	treeelementosdirectoriotags[u].setAttribute("value", cursor2.value.tagid);
																	treeelementosdirectoriotags[u].setAttribute("style", "background-color: #" + cursor2.value.tagcolor + ";" + "color: " + complecolor + ";")
																	treeelementosdirectoriotags[u].innerHTML = cursor2.value.tagtext;

																}

															});

															cursor2.continue();

														}

													};

												}

											}

										}

										cursor.continue();

									}

								}

							}

						}

					}

				}

			} // --fin si el tag a borrar pertenece a una carpeta

			if (isfolderorarchive == "archive") {

				$("#undo", window.parent.document).attr("data-tooltip", "UNDO (erase archive tag)");
				undo.class = "delete archive tag";
				undo.deltaggfile = []; // para dejar todos los valores a 0 y no se cruzen algunos datos
				undo.deltaggfile.tags = idtagsoriginales;
				undo.deltaggfile.file = nombreelementocontagaborrar;
				undo.deltaggfile.folder = $(this)["0"].parentElement.parentElement.children[1].attributes[2].value;

				if (idtagsrestantes.length > 0) { // si queda algún tag (y por lo tanto el archivo permanece si o si en la bd)

					//primero recogemos la id de la carpeta donde se encuentra el archivo
					var idcarpetamadre = "";

					var trans = db.transaction(["folders"], "readonly")
					var objectStore = trans.objectStore("folders")
					var req = objectStore.openCursor();

					req.onerror = function(event) {

						console.log("error: " + event);
					};

					req.onsuccess = function(event) {

						var cursor = event.target.result;

						if(cursor){

							if(cursor.value.folder == undo.deltaggfile.folder){

								idcarpetamadre = cursor.value.folderid;

							}

							cursor.continue();

						}

					}

					trans.oncomplete = function(event) {

						// ahora localizamos el archivo en la bd y actualizamos los datos
						fileupdate = {};

						var trans = db.transaction(["files"], "readwrite")
						var objectStore = trans.objectStore("files")
						var req = objectStore.openCursor();

						req.onerror = function(event) {

							console.log("error: " + event);
						};

						req.onsuccess = function(event) {

							var cursor = event.target.result;

							if(cursor){

								if(cursor.value.filefolder == idcarpetamadre){

									if(cursor.value.filename == nombreelementocontagaborrar) {

										fileupdate.fileid = cursor.value.fileid;
										fileupdate.filefolder = cursor.value.filefolder;
										fileupdate.filename = cursor.value.filename;
										fileupdate.fileext = cursor.value.fileext;
										fileupdate.filetags = idtagsrestantes;

										var res2 = cursor.update(fileupdate);

										res2.onerror = function(event){
											console.log("error: tag de archivo no eliminada: " + event);
										}

										res2.onsuccess = function(event){

											undo.deltaggfile.fileid = fileupdate.fileid;
											undo.deltaggfile.tagid = iddeltagaborrar;

											// actualizar visual en el directorio
											tagaborrar.remove(); //que es el $(this) de al hacer click (el tagticket)

										}

									}

								}

								cursor.continue();

							}

						}

					}

				}

				else { // si se queda a 0 tags

					// actualizar visual en el directorio
					tagaborrar.remove(); // que es el $(this) de al hacer click (el tagticket)

					undo.deltaggfile.fileid = ""; // quitamos cualquier valor que pudiera tener de antes

					// recogemos la id de la carpeta donde se encuentra el archivo
					var idcarpetamadre = "";

					var trans = db.transaction(["folders"], "readonly")
					var objectStore = trans.objectStore("folders")
					var req = objectStore.openCursor();

					req.onerror = function(event) {

						console.log("error: " + event);
					};

					req.onsuccess = function(event) {

						var cursor = event.target.result;

						if(cursor){

							if(cursor.value.folder == undo.deltaggfile.folder){

								idcarpetamadre = cursor.value.folderid;

							}

							cursor.continue();

						}

					}

					trans.oncomplete = function(event) {

						// ahora localizamos el archivo en la bd y lo borramos
						fileupdate = {};

						var trans = db.transaction(["files"], "readwrite")
						var objectStore = trans.objectStore("files")
						var req = objectStore.openCursor();

						req.onerror = function(event) {

							console.log("error: " + event);
						};

						req.onsuccess = function(event) {

							var cursor = event.target.result;

							if(cursor){

								if(cursor.value.filefolder == idcarpetamadre){

									if(cursor.value.filename == nombreelementocontagaborrar) {

										var idelementoaborrar = cursor.value.fileid

										var trans9 = db.transaction(["files"], "readwrite")
										var request9 = trans9.objectStore("files").delete(idelementoaborrar);

										request9.onerror = function(event) {

											console.log("error - no se ha eliminado archivo de bd:" + event);

										};
										request9.onsuccess = function(event) {

										};

										trans9.oncomplete = function(event) {


											var aborrardedb = "si";

											// podemos comprobar por un lado si la carpeta madre tiene tags
											var trans = db.transaction(["folders"], "readonly")
											var objectStore = trans.objectStore("folders")
											var req = objectStore.openCursor();

											req.onerror = function(event) {

												console.log("error: " + event);
											};

											req.onsuccess = function(event) {

												var cursor = event.target.result;

												if(cursor){

													if(cursor.value.folderid == idcarpetamadre){

														var tagscarpetamadre = cursor.value.foldertags

														if (tagscarpetamadre.length > 0) {

															aborrardedb="no";

															undo.deltaggfile.folderid = idcarpetamadre;

														}

													}

													cursor.continue();

												}

											}

											trans.oncomplete = function(event) {


												// ahora comprobamos si la carpeta madre tiene algún archivo asociado aparte del que hemos eliminado de la bd
												var trans = db.transaction(["files"], "readonly")
												var objectStore = trans.objectStore("files")
												var req = objectStore.openCursor();

												req.onerror = function(event) {

													console.log("error: " + event);
												};

												req.onsuccess = function(event) {

													var cursor = event.target.result;

													if(cursor){

														if(cursor.value.filefolder == idcarpetamadre){

															aborrardedb="no";

															undo.deltaggfile.folderid = idcarpetamadre;

														}

														cursor.continue();

													}

												}

												trans.oncomplete = function(event) {

													// si tras haber preguntado por los tags de la carpeta y los archivos asociados a la carpeta la respuesta sigue siendo si

													if (aborrardedb == "si") { // borramos la carpeta de la bd

														var trans9 = db.transaction(["folders"], "readwrite")
														var request9 = trans9.objectStore("folders").delete(idcarpetamadre);

														request9.onerror = function(event) {

															console.log("error - no se ha eliminado carpeta de bd:" + event);

														};
														request9.onsuccess = function(event) {

															// console.log("eliminada carpeta de la bd");

														};

													};

												}

											}

										}

									}

								}

								cursor.continue();

							}

						}

					}

				}

			}

		}

	})

} //-- fin function elementtagdelete


function newTag() {

	popup("newtag");

};

function editTag() {

	popup("edittag");
}



// Copiar y Mover

var alsotags = "";
var alldroppedelement = [];
var droppedarchive = [];
var droppedfolder = [];
var foldername = [];

window.parent.$("#paste").on('click', function() {

	if (window.parent.$("li.current").attr('data-tab') == "tab-1") { // salir de la función si esta seleccionado el explore
		return;
	}

	var pasteaction = window.parent.pasteaction;
	if (top.explorer.$("#filetree ul li span.selected")["0"]) {
		var targetfolder = top.explorer.$("#filetree ul li span.selected")["0"].attributes[1].value;
	}

	alldroppedelement = $(".exploelement.ui-selecting");

	if (alldroppedelement.length == 0) {
		alldroppedelement = $(".exploelement.ui-selected"); // para que lo haga con los selected si no hay selecting
	}

	if (alldroppedelement.length == 0) {

		if (pasteaction == "copy") {
			alertify.alert("No elements selected to copy.");
		}
		else if (pasteaction == "cut") {
			alertify.alert("No elements selected to move.");
		}
	}


	if (alldroppedelement.length > 0) {

    	if (pasteaction == "copy") {

	    	alertify.confirmny(  "When the <em>Copy</em> is made, do you want the associated tags to be copied too?", function (e) {
	    		if (e) {
	    			alsotags = "yes";
	    			
	    			popup('selectfolderactiontag');

	    		} else {
	    			alsotags = "no";	    			

	    			popup('selectfolderactionnotag');

	    		}

	    	});

    	}

    	else if (pasteaction == "cut") {

	    	alertify.confirmny(  "When the <em>Move</em> is made, do you want the associated tags to be moved too? (if you choose 'No' those tags will be lost when selected elements moved)", function (e) {
	    		if (e) {
	    			alsotags = "yes";
	    			
	    			popup('selectfolderactiontag');

	    		} else {
	    			alsotags = "no";
	    			
	    			popup('selectfolderactionnotag');

	    		}

	    	});

    	}

    }

});

function selectedactionfolder(selectedfolder, selecteddrive) {


	var pasteaction = window.parent.pasteaction;

	var selectedactionFold=selectedfolder;

	selectedactionFolder = selectedactionFold.replace(/\\/g, "\/"); // se cambia las \ por /
	if (s.os.name == "windows") {
		selectedactionDriveUnit = selectedactionFolder.substr(0, selectedactionFolder.indexOf('\/')); // se selecciona hasta la primera / (en windows pillara C: d: etc en linux y mac no tendrá nada)
	} else {
		selectedactionDriveUnit = selecteddrive;
	}
	selectedactionFolder = selectedactionFolder.replace(selectedactionDriveUnit, ""); // se quita el driveunit de la ruta seleccionada
	selectedactionFolder = selectedactionFolder.trim()

	if (pasteaction == "copy") {

		searchercopyaction(selectedactionFolder, selecteddrive);

	} else if (pasteaction == "cut") {

		searchermoveaction(selectedactionFolder, selecteddrive);

	}	

}


function searchercopyaction(selectedactionFolder, selecteddrive) {

	droppedarchive = [];
    droppedfolder = [];
    foldername = [];
	var y = 0;
    var x = 0;

	$.each (alldroppedelement, function(t) {

		if (alldroppedelement[t].classList.contains("archive")) {

			droppedarchive[y] = alldroppedelement[t];
			y++

		} else if (alldroppedelement[t].classList.contains("folder")) {

			droppedfolder[x] = alldroppedelement[t];
			x++
		}

	});


	$("#status").html("Copying ...");
	$('.exploelement').css("filter","opacity(46%)");

	// para que no haya ningun tipo de conflicto se limpia el undo
	$("#undo", window.parent.document).attr("data-tooltip", "UNDO (not undo action)");
	undo.class == "";


	if (alsotags=="yes") {

		// console.log("to copy in " + selectedactionDriveUnit + selectedactionFolder);
		// console.log("folders & files: ")
		// console.log(droppedfolder)
		// console.log(droppedarchive)

		var idcarpetasaduplicar = []; // posteriormente se duplicaran todos los archivos que tengan este filefolder poniéndoles por filefolder idcarpetasduplicadas.
		var idcarpetasduplicadas = [];

		var flagg = 0;
		// copiamos cada una de las carpetas

		$.each(droppedfolder, function(t) {

			var parts = droppedfolder[t].children[1].attributes[1].value.split('/');
			var folderlastsub = "/" + parts.pop(); // coge la ultima parte de la dirección despues del último "/"

			if (driveunit + droppedfolder[t].children[1].attributes[1].value != selecteddrive + selectedactionFolder + folderlastsub) { // si origen y destino son distintos

				fs.copy(driveunit + droppedfolder[t].children[1].attributes[1].value, selecteddrive + selectedactionFolder + folderlastsub, { clobber: true }, function(err) {

					if (err) return console.error(err)

					flagg++;

					if (flagg == droppedfolder.length && droppedarchive.length == 0) { //para que lo lance al final

						$("#status").html("");
						$('.exploelement').css("filter","none");
						$('.exploelement').removeClass('ui-selecting');
						$('.exploelement').removeClass('ui-selected');

					}

				});

			}

			else {

				alertify.alert("Origin and destination folders are the same in the case of <em>'"+ driveunit + droppedfolder[t].children[1].attributes[1].value + "'</em> and will be not copied.")
			}



		});


		// trabajamos con las carpetas
		window.idcarpetadestino = [];

		// primero detectamos si la carpeta destino esta en la bs para coger su id si fuera necesario
		var trans31 = db.transaction(["folders"], "readwrite")
		var objectStore31 = trans31.objectStore("folders")
		var req31 = objectStore31.openCursor();

		req31.onerror = function(event) {
			console.log(event);
		};
		req31.onsuccess = function(event) {
			var cursor = event.target.result;
			if (cursor) {
				$.each(droppedfolder, function(t) {

					var parts = droppedfolder[t].children[1].attributes[1].value.split('/');
					var folderlastsub = "/" + parts.pop();

					foldername[t] = folderlastsub;

					if (cursor.value.folder == selectedactionFolder + folderlastsub) {

						idcarpetadestino[t] = cursor.value.folderid;

					}

				});

				cursor.continue();
			}
			else { // si todavía no hay ninguna carpeta en la base de datos
				$.each(droppedfolder, function(t) {

					var parts = droppedfolder[t].children[1].attributes[1].value.split('/');
					var folderlastsub = "/" + parts.pop();
					foldername[t] = folderlastsub;

				});

			}

		}

		trans31.oncomplete = function(event) {

			// se detecta si la carpeta origen esta en la base de datos
			var trans = db.transaction(["folders"], "readwrite")
			var objectStore = trans.objectStore("folders")
			var req = objectStore.openCursor();

			req.onerror = function(event) {
				console.log("error: " + event);
			};
			req.onsuccess = function(event) {
				var cursor = event.target.result;
				if (cursor) {
					$.each(droppedfolder, function(t) {

						var parts = droppedfolder[t].children[1].attributes[1].value.split('/');
						var folderlastsub = "/" + parts.pop();

						var carpetapreviamenteexistente = "no";

						var folderupdate = {};

						foldername[t] = droppedfolder[t].children[1].attributes[1].nodeValue;

						if (cursor.value.folder == foldername[t]) { // si hay carpeta con nombre en origen

							if (idcarpetadestino[t]) { // y en destino ya existía la carpeta en la bd

								folderupdate.folderid = idcarpetadestino[t]; // utilizamos el id que ya tenia
								carpetapreviamenteexistente = "yes";

							}

							idcarpetasaduplicar[t] = cursor.value.folderid;
							// si está la carpeta creamos una igual con la nueva dirección
							folderupdate.folder = selectedactionFolder + folderlastsub;
							folderupdate.foldertags = cursor.value.foldertags;

							var res20 = objectStore.put(folderupdate);

							res20.onerror = function(event){
								console.log("error ruta carpeta no añadida: " + event);
							}

							res20.onsuccess = function(event){

								// hay que mirar si hay ficheros con el id de la carpeta madre original y duplicarlos en la base de datos poniéndoles el id de la nueva carpeta
								idcarpetasduplicadas[t] = event.target.result;

								var trans12 = db.transaction(["files"], "readwrite")
								var objectStore12 = trans12.objectStore("files")
								var req12 = objectStore12.openCursor();

								req12.onerror = function(event) {console.log(event)};

								req12.onsuccess = function(event) {

									var fileupdate = {};

									var cursor12 = event.target.result;

									if(cursor12){

										if (cursor12.value.filefolder == idcarpetasaduplicar[t]) {

											// creamos nuevo fichero en bd
											fileupdate.filefolder = idcarpetasduplicadas[t];
											fileupdate.filename = cursor12.value.filename;
											fileupdate.fileext = cursor12.value.fileext;
											fileupdate.filetags = cursor12.value.filetags;

											var res13 = objectStore12.put(fileupdate);

											res13.onerror = function(event) {console.log(event)};

											res13.onsuccess = function(event){

												var key = event.target.result;

											}

										}

										cursor12.continue()
									}

								}

							}

						}

						// quizás se puede añadir un else para que si la carpeta origen no esta en la base de datos, al hacer el copy eliminar los tags de la carpeta destino si los tuviera

					});

					cursor.continue();

				}

			}

			trans.oncomplete = function(event) {

				// vamos a recorrer las carpetas ecursivamente para recoger los datos de todas las subcarpetas que contenga

				var arraydecarpetas = {};
				var arraydemadres = {};
				var arraydecarpetasDest = {};
				var posicion = 0;

				$.each(droppedfolder, function(t) {

					foldertoread = driveunit + droppedfolder[t].children[1].attributes[1].value; //recogemos el value de cada carpeta
					recursivefolderdata(foldertoread);


					function recursivefolderdata(foldertoread) {

						var directoryelement = [];
						var directorycontent = [];
						var directoryfolders = [];
						var directoryarchives = [];

						var readedElements = fs.readdirSync(foldertoread)

						for (i = 0; i < readedElements.length; i++) {

							// comprobar si es carpeta o archivo
							var dirtoreadcheck = foldertoread + "\/" + readedElements[i];

							try {
								var arorfo = "i_am_an_archive";
								var arorfo = fs.readdirSync(dirtoreadcheck);
							}
							catch(exception) {};

							directoryelement.name = "\/" + readedElements[i]
							directoryelement.arorfo = arorfo;
							directoryelement.id = ""; // se lo metemos después de separar carpetas y archivos (y estará oculto en la vista)
							directoryelement.tagsid = []; // se lo metemos después de separar carpetas y archivos

							var copied_directoryelement = jQuery.extend({}, directoryelement); // necesario trabajar con una copia para actualizar el objeto directorycontent
							directorycontent[i] = copied_directoryelement;
						};

						// separa carpetas y archivos en dos objetos
						var i = 0;
						var ii = 0;
						var iii = 0;

						$.each(directorycontent, function(i) {

							if (directorycontent[i].arorfo != "i_am_an_archive" || directorycontent[i].arorfo == undefined || directorycontent[i].name == "Documents and Settings") {
								directoryfolders[ii] = directorycontent[i];

								ii++;
							} else {
								directoryarchives[iii] = directorycontent[i];
								iii++;
							};
						});

						$.each(directoryfolders, function(n){

							foldertoread = foldertoread.replace(driveunit,"");
							arraydecarpetas[posicion] = foldertoread + directoryfolders[n].name;
							arraydemadres[posicion] = droppedfolder[t].children[1].attributes[1].value;
							var parts = arraydemadres[posicion].split('/');
							parts.pop();
							arraydemadres[posicion] = parts.join('/');

							posicion++

							recursivefolderdata(foldertoread + directoryfolders[n].name);

						});

					}

				});

				$.each(arraydecarpetas, function(t){

					arraydecarpetasDest[t] = arraydecarpetas[t].replace(arraydemadres[t], selectedactionFolder);

				});

				// console.log("original folders:");
				// console.log(arraydecarpetas);
				// console.log("destination folders:");
				// console.log(arraydecarpetasDest);

				var idsubcarpetadestino = [];

				$.each(arraydecarpetas, function(t) {

					var updatefolder = {};
					var fileupdate = {};

					var carpetapreviamenteexistente = "no";

					// primero detectamos si la subcarpeta destino esta en la bs para coger su id si fuera necesario
					var trans32 = db.transaction(["folders"], "readonly")
					var objectStore32 = trans32.objectStore("folders")
					var req32 = objectStore32.openCursor();

					req32.onerror = function(event) {console.log(event)};

					req32.onsuccess = function(event) {
						var cursor = event.target.result;
						if (cursor) {

							if (cursor.value.folder == arraydecarpetasDest[t]) {

								idsubcarpetadestino[t] = cursor.value.folderid;
								carpetapreviamenteexistente = "yes";

							}

							cursor.continue();
						}

					}

					trans32.oncomplete = function(event) {

						var trans10 = db.transaction(["folders"], "readwrite")
						var objectStore10 = trans10.objectStore("folders")
						var req10 = objectStore10.openCursor();

						req10.onerror = function(event) {console.log(event)};

						req10.onsuccess = function(event) {
							var cursor10 = event.target.result;
							if (cursor10) {

								if (cursor10.value.folder == arraydecarpetas[t]) {

									idcarpetasaduplicar[t] = cursor10.value.folderid;

									if (idsubcarpetadestino[t]) {

										updatefolder.folderid = idsubcarpetadestino[t];
									}

									updatefolder.folder = arraydecarpetasDest[t];
									updatefolder.foldertags = cursor10.value.foldertags

									var res11 = objectStore10.put(updatefolder);


									res11.onerror = function(event) {console.log(event)};

									res11.onsuccess = function(event){

										if (carpetapreviamenteexistente == "no") {

											var key = event.target.result;
											undo.copy.addedfolderids.push(key)
										}


										idcarpetasduplicadas[t] = event.target.result;

										var trans12 = db.transaction(["files"], "readwrite")
										var objectStore12 = trans12.objectStore("files")
										var req12 = objectStore12.openCursor();

										req12.onerror = function(event) {console.log(event)};

										req12.onsuccess = function(event) {

											var cursor12 = event.target.result;

											if(cursor12){

												if (cursor12.value.filefolder == idcarpetasaduplicar[t]) {

													// creamos nuevo fichero en bd
													fileupdate.filefolder = idcarpetasduplicadas[t];
													fileupdate.filename = cursor12.value.filename;
													fileupdate.fileext = cursor12.value.fileext;
													fileupdate.filetags = cursor12.value.filetags;

													var res13 = objectStore12.put(fileupdate);

													res13.onerror = function(event) {console.log(event)};

												}

												cursor12.continue();

											}

										}

									}

								}

								cursor10.continue();

							}

						}

					}

				});


			} //--fin trans


			// trabajamos con los archivos

			// primero comprobamos si algún archivo estaba en la base de datos (si tiene tags)

			var anyarchiveondb = "no";
			$.each(droppedarchive, function(t) {

				if (droppedarchive[t].children[4].attributes[1].value != "") {
					anyarchiveondb = "yes";
				}

			});

			if (anyarchiveondb == "yes") {

				// como los archivo (al menos uno) tienen tags se comprueba si la carpeta de destino esta en la bd
				var destfolderid = "";
				var originfolderid = {};

				var trans3 = db.transaction(["folders"], "readonly")
				var objectStore3 = trans3.objectStore("folders")
				var req3 = objectStore3.openCursor();

				req3.onerror = function(event) {console.log(event)};

				req3.onsuccess = function(event) {
					var cursor3 = event.target.result;
					if (cursor3) {
						if (cursor3.value.folder == selectedactionFolder) {

							destfolderid = cursor3.value.folderid;

						}
						// tambien aprovechamos para sacar el id de la carpeta origen (para luego buscar los archivos en la bd)
						$.each(droppedarchive, function(t) {

							if(cursor3.value.folder == droppedarchive[t].children[1].attributes[2].value){

								originfolderid[t] = cursor3.value.folderid;

							}

						});

						cursor3.continue();

					}

				}

				trans3.oncomplete = function(event) {

					var fileupdate = {};

					if (destfolderid == "") { // si la carpeta de destino NO estaba en la base de datos (no tiene id)

						// añadimos la carpeta a la bd pues los archivos a pasar tiene tags
						var trans4 = db.transaction(["folders"], "readwrite")
						var request4 = trans4.objectStore("folders")
						.put({ folder: selectedactionFolder, foldertags: [] }); //el id no hace falta pues es autoincremental

						request4.onerror = function(event) {console.log(event)}; //error carpeta destino no añadida a bd

						trans4.oncomplete = function(e) { // se toma el id de la carpeta añadida

							var trans5 = db.transaction(["folders"], "readonly")
							var objectStore5 = trans5.objectStore("folders")
							var req5 = objectStore5.openCursor();

							req5.onerror = function(event) {console.log(event)};

							req5.onsuccess = function(event) {

								var cursor5 = event.target.result;

								if(cursor5){

									if(cursor5.value.folder == selectedactionFolder){

										destfolderid = cursor5.value.folderid;

									}

									cursor5.continue();

								}

							}

							trans5.oncomplete = function(event) {

								// ahora cambiamos el parámetro filefolder de cada uno de los archivos que copiamos y están en la bd poniéndole el id de la carpeta destino

								var trans6 = db.transaction(["files"], "readwrite")
								var objectStore6 = trans6.objectStore("files")
								var req6 = objectStore6.openCursor();

								req6.onerror = function(event) {console.log(event)};

								req6.onsuccess = function(event) {

									var cursor6 = event.target.result;

									if(cursor6){

										$.each(droppedarchive, function(t) {

											if(cursor6.value.filefolder == originfolderid[t]){

												if (cursor6.value.filename == droppedarchive[t].children[1].attributes[1].value) {

													fileupdate.filefolder = destfolderid;
													fileupdate.filename = cursor6.value.filename;
													fileupdate.fileext = cursor6.value.fileext;
													fileupdate.filetags = cursor6.value.filetags;

													// Actualizamos los archivos en la bd con el nuevo filefolder
													var res7 = objectStore6.put(fileupdate);

													res7.onerror = function(event) {console.log(event)}; // error ruta archivo no cambiada

												}

											}

										});

										cursor6.continue();
									}

								}
								trans6.oncomplete = function(event) {

									// copiamos los archivos
									var flagg = 0;

									$.each(droppedarchive, function(t) {

										if (driveunit + droppedarchive[t].children[1].attributes[2].value + droppedarchive[t].children[1].attributes[1].value != selecteddrive + selectedactionFolder + droppedarchive[t].children[1].attributes[1].value) { // si origen y destino son distintos

											fs.copy(driveunit + droppedarchive[t].children[1].attributes[2].value + droppedarchive[t].children[1].attributes[1].value, selecteddrive + selectedactionFolder + droppedarchive[t].children[1].attributes[1].value, function(err) {

												flagg++;

												if (flagg == droppedarchive.length) { //para que lo lance al final

													$("#status").html("");
													$('.exploelement').css("filter","none");
													$('.exploelement').removeClass('ui-selecting');
													$('.exploelement').removeClass('ui-selected');

												}

											});

										}

										else {

											alertify.alert("Origin and destination files are the same in the case of <em>'"+ driveunit + droppedarchive[t].children[1].attributes[2].value + droppedarchive[t].children[1].attributes[1].value + "'</em> and will be not copied.");

											if (t == droppedarchive.length-1) { //para que lo lance al final

												$("#status").html("");
												$('.exploelement').css("filter","none");
												$('.exploelement').removeClass('ui-selecting');
												$('.exploelement').removeClass('ui-selected');

											}

										}

									});

								}

							}

						}

					}

					else { // si la carpeta de destino ya estaba en la bd

						// primero borramos de la base de datos los archivos que están asociados a la carpeta destino que vamos a sobrescribir con la operación de copia

						var refrescohecho2 = "no";

						$.each(droppedarchive, function(t) {

							var trans6 = db.transaction(["files"], "readwrite")
							var objectStore6 = trans6.objectStore("files")
							var req6 = objectStore6.openCursor();

							req6.onerror = function(event) {console.log(event)};

							req6.onsuccess = function(event) {

								var cursor6 = event.target.result;

								if(cursor6){

									if (cursor6.value.filefolder == destfolderid) {

										if (cursor6.value.filename == droppedarchive[t].children[1].attributes[1].value) {

											var res8 = cursor6.delete(cursor6.value.fileid);

											res8.onerror = function(event) {console.log(event)};

											res8.onsuccess = function(event) {

												console.log("fichero destino eliminado de la bd")

											};

										}

									}

									cursor6.continue();

								}

							}

						});


						// ahora añadimos los archivos a la base de datos poniendo el destfolderid como el filefolder de cada archivo que este en la bd

						$.each(droppedarchive, function(t) {

							var trans6 = db.transaction(["files"], "readwrite")
							var objectStore6 = trans6.objectStore("files")
							var req6 = objectStore6.openCursor();

							req6.onerror = function(event) {console.log(event)};

							req6.onsuccess = function(event) {

								var cursor6 = event.target.result;

								if(cursor6){

									if(cursor6.value.filefolder == originfolderid[t]){

										if (cursor6.value.filename == droppedarchive[t].children[1].attributes[1].value) {

											fileupdate.filefolder = destfolderid;
											fileupdate.filename = cursor6.value.filename;
											fileupdate.fileext = cursor6.value.fileext;
											fileupdate.filetags = cursor6.value.filetags;

											// añadimos los archivos en la bd con el nuevo filefolder
											var res7 = objectStore6.put(fileupdate);

											res7.onerror = function(event) {console.log(event)}; // error ruta archivo no cambiada

											res7.onsuccess = function(event){

												var key = event.target.result;
												undo.copy.addedfileids.push(key)

											}

										}

									}

									cursor6.continue();
								}

							}

						});

						// copiamos los archivos
						var flagg=0;

						$.each(droppedarchive, function(t) {

							if (driveunit + droppedarchive[t].children[1].attributes[2].value + droppedarchive[t].children[1].attributes[1].value != selecteddrive + selectedactionFolder + droppedarchive[t].children[1].attributes[1].value) { // si origen y destino son distintos

								fs.copy(driveunit + droppedarchive[t].children[1].attributes[2].value + droppedarchive[t].children[1].attributes[1].value, selecteddrive + selectedactionFolder + droppedarchive[t].children[1].attributes[1].value, function(err) {

									flagg++;

									if (flagg == droppedarchive.length) { //para que lo lance al final

										$("#status").html("");
										$('.exploelement').css("filter","none");
										$('.exploelement').removeClass('ui-selecting');
										$('.exploelement').removeClass('ui-selected');

									}

								});

							}

							else {

								alertify.alert("Origin and destination files are the same in the case of <em>'"+ driveunit + droppedarchive[t].children[1].attributes[2].value + droppedarchive[t].children[1].attributes[1].value + "'</em> and will be not copied.");

								if (t == droppedarchive.length-1) { //para que lo lance al final

									$("#status").html("");
									$('.exploelement').css("filter","none");
									$('.exploelement').removeClass('ui-selecting');
									$('.exploelement').removeClass('ui-selected');

								}
							}

						});

					}

				}

			}

			else { // si los archivos no tienen tag

				// Se copian los archivos y ya esta

				var fflagg = 0;

				$.each(droppedarchive, function(t) {

					if (driveunit + droppedarchive[t].children[1].attributes[2].value + droppedarchive[t].children[1].attributes[1].value != selecteddrive + selectedactionFolder + droppedarchive[t].children[1].attributes[1].value) { // si origen y destino son distintos

						fs.copy(driveunit + droppedarchive[t].children[1].attributes[2].value + droppedarchive[t].children[1].attributes[1].value, selecteddrive + selectedactionFolder + droppedarchive[t].children[1].attributes[1].value, function(err) {

							flagg++;

							if (flagg == droppedarchive.length) { //para que lo lance al final

								$("#status").html("");
								$('.exploelement').css("filter","none");
								$('.exploelement').removeClass('ui-selecting');
								$('.exploelement').removeClass('ui-selected');

							}

						});

					}

					else {

						alertify.alert("Origin and destination files are the same in the case of <em>'"+ driveunit + droppedarchive[t].children[1].attributes[2].value + droppedarchive[t].children[1].attributes[1].value + "'</em> and will be not copied.");

						if (t == droppedarchive.length-1) { //para que lo lance al final

							$("#status").html("");
							$('.exploelement').css("filter","none");
							$('.exploelement').removeClass('ui-selecting');
							$('.exploelement').removeClass('ui-selected');

						}

					}

				});

			}

		}

	} //-- fin if alsotags=yes

	else if (alsotags=="no") {

		// console.log("to copy in " + selectedactionDriveUnit + selectedactionFolder);
		// console.log("folders & files: ")
		// console.log(droppedfolder)
		// console.log(droppedarchive)

		var flagg = 0;
		// copiamos cada una de las carpetas
		$.each(droppedfolder, function(t) {

			var parts = droppedfolder[t].children[1].attributes[1].value.split('/');
			var folderlastsub = "/" + parts.pop(); // coge la ultima parte de la dirección despues del último "/"

			if (driveunit + droppedfolder[t].children[1].attributes[1].value != selectedactionDriveUnit + selectedactionFolder + folderlastsub) { // si origen y destino son distintos

				fs.copy(driveunit + droppedfolder[t].children[1].attributes[1].value, selectedactionDriveUnit + selectedactionFolder + folderlastsub, { clobber: true }, function(err) {

					if (err) return console.error(err)

					flagg++;

					if (flagg == droppedfolder.length && droppedarchive.length == 0) { //para que lo lance al final

						$("#status").html("");
						$('.exploelement').css("filter","none");
						$('.exploelement').removeClass('ui-selecting')

					}

				});

			}

			else {

				alertify.alert("Origin and destination folders are the same in the case of <em>'"+ driveunit + droppedfolder[t].children[1].attributes[1].value + "'</em> and will be not copied.");
			}

		});


		var fflagg = 0;
		// copiamos cada uno de los archivos
		$.each(droppedarchive, function(t) {

			if (driveunit + droppedarchive[t].children[1].attributes[2].value + droppedarchive[t].children[1].attributes[1].value != selectedactionDriveUnit + selectedactionFolder + droppedarchive[t].children[1].attributes[1].value) { // si origen y destino son distintos

				fs.copy(driveunit + droppedarchive[t].children[1].attributes[2].value + droppedarchive[t].children[1].attributes[1].value, selectedactionDriveUnit + selectedactionFolder + droppedarchive[t].children[1].attributes[1].value, function(err) {

					if (err) {console.log(err)}
					flagg++;

					if (flagg == droppedarchive.length) { //para que lo lance al final

						$("#status").html("");
						$('.exploelement').css("filter","none");
						$('.exploelement').removeClass('ui-selecting');
						$('.exploelement').removeClass('ui-selected');

					}

				});

			}

			else {

				alertify.alert("Origin and destination files are the same in the case of <em>'"+ driveunit + droppedarchive[t].children[1].attributes[2].value + droppedarchive[t].children[1].attributes[1].value + "'</em> and will be not copied.");

				if (t == droppedarchive.length-1) { //para que lo lance al final

					$("#status").html("");
					$('.exploelement').css("filter","none");
					$('.exploelement').removeClass('ui-selecting');
					$('.exploelement').removeClass('ui-selected');

				}

			}

		});

	} // --fin if alsotags=no

} // --fin searchercopyaction


function searchermoveaction(selectedactionFolder, selecteddrive) {

	droppedarchive = [];
    droppedfolder = [];
    foldername = [];
	var y = 0;
    var x = 0;


	$.each (alldroppedelement, function(t) {

		if (alldroppedelement[t].classList.contains("archive")) {

			droppedarchive[y] = alldroppedelement[t];
			y++

		} else if (alldroppedelement[t].classList.contains("folder")) {

			droppedfolder[x] = alldroppedelement[t];
			x++
		}

	});


	$("#status").html("Moving ...");
	$('.exploelement').css("filter","opacity(46%)");

	// para que no haya ningun tipo de conflicto se limpia el undo
	$("#undo", window.parent.document).attr("data-tooltip", "UNDO (not undo action)");
	undo.class == "";


	if (alsotags=="yes") {

		var destinoenbd = "";
		var origenenbd="";

		// primero detectamos si las carpetas dropeadas están en la base de datos
		var trans = db.transaction(["folders"], "readwrite")
		var objectStore = trans.objectStore("folders")
		var req = objectStore.openCursor();

		req.onerror = function(event) {
			console.log(event);
		};
		req.onsuccess = function(event) {
			var cursor = event.target.result;

			// primero miramos si hay  en la bd una carpeta con el mismo nombre en destino

			if (cursor) {

				$.each(droppedfolder, function(t) {

					var parts = droppedfolder[t].children[1].attributes[1].value.split('/');
					var folderlastsub = "/" + parts.pop();

					if (cursor.value.folder == selectedactionFolder + folderlastsub) {

						destinoenbd = cursor.value.folderid

					}

				});

				cursor.continue()

			}

		}

		trans.oncomplete = function(event){


			var trans = db.transaction(["folders"], "readwrite")
			var objectStore = trans.objectStore("folders")
			var req = objectStore.openCursor();

			req.onerror = function(event) {
				console.log("error: " + event);
			};
			req.onsuccess = function(event) {
				var cursor = event.target.result;
				if (cursor) {

					$.each(droppedfolder, function(t) {

						var parts = droppedfolder[t].children[1].attributes[1].value.split('/');
						var folderlastsub = "/" + parts.pop();

						var carpetapreviamenteexistente = "no";

						var folderupdate = {};

						foldername[t] = droppedfolder[t].children[1].attributes[1].nodeValue;

						if (cursor.value.folder == foldername[t]) {

							origenenbd = cursor.value.folderid;

							// si está la carpeta de origen en la bd le adjuntamos nuevo valor al nombre si en destino no hay una ya con el mismo nombre en la bd
							if (destinoenbd == "") {

								folderupdate.folder = selectedactionFolder + folderlastsub
								folderupdate.folderid = cursor.value.folderid
								folderupdate.foldertags = cursor.value.foldertags

								var res2 = cursor.update(folderupdate);

								res2.onerror = function(event){
									console.log("error ruta carpeta no cambiada: " + event);
								}

								res2.onsuccess = function(event){

									// console.log("ruta carpeta cambiada")

								}

							} else { //si en destino ya hay una carpeta con el nombre en la bd le adjuntamos los nuevos tags

								folderupdate.folder = selectedactionFolder + folderlastsub
								folderupdate.folderid = destinoenbd
								folderupdate.foldertags = cursor.value.foldertags

								var trans = db.transaction(["folders"], "readwrite")
								var objectStore = trans.objectStore("folders")
								var req = objectStore.openCursor();

								req.onerror = function(event) {
									console.log(event);
								};
								req.onsuccess = function(event) {
									var cursor = event.target.result;
									if (cursor) {

										$.each(droppedfolder, function(t) {

											var parts = droppedfolder[t].children[1].attributes[1].value.split('/');
											var folderlastsub = "/" + parts.pop();

											foldername[t] = droppedfolder[t].children[1].attributes[1].nodeValue;

											if (cursor.value.folder == selectedactionFolder + folderlastsub) {

												var res2 = cursor.update(folderupdate);

												res2.onerror = function(event){
													console.log(event); //error ruta carpeta no cambiada
												}

												res2.onsuccess = function(event){

													// console.log("ruta carpeta cambiada")

												}

											}

											// y se borra de la bd la carpeta origen
											if (cursor.value.folder == foldername[t]) {

												var foldertodelete = cursor.value.folderid;

												var res3 = cursor.delete(foldertodelete);

												res3.onerror = function(event){
													console.log("error: carpeta destino no borrada de bd " + event);
												}

												res3.onsuccess = function(event){

													// console.log("carpeta destino no borrada de bd");

												}

											}


										});


										cursor.continue();

									}

								}

							}

						}

					});

					cursor.continue()

				}

			}

			trans.oncomplete = function(event){

				var trans = db.transaction(["folders"], "readwrite")
				var objectStore = trans.objectStore("folders")
				var req = objectStore.openCursor();

				req.onerror = function(event) {
					console.log(event);
				};
				req.onsuccess = function(event) {
					var cursor = event.target.result;

					// si la carpeta origen no esta en la base de datos, al hacer el move hay que eliminar los tags de la carpeta destino si los tuviera
					if (origenenbd == "") {
						if (destinoenbd != "") {
							if (cursor) {

								if (cursor.value.folderid == destinoenbd) {

									folderupdate.folderid = cursor.value.folderid;

									var res2 = cursor.delete(folderupdate);

									res2.onerror = function(event){
										console.log("error: carpeta destino no borrada de bd " + event);
									}

									res2.onsuccess = function(event){

										// console.log("carpeta destino no borrada de bd");

									}

								}

								cursor.continue()
							}

						}

					}

				}

				trans.oncomplete = function(event) {


					// antes de mover físicamente las carpetas vamos a recorrerlas recursivamente para recoger los datos de todas las subcarpetas que contenga

					var arraydecarpetas = {};
					var arraydemadres = {};
					var arraydecarpetasDest = {};
					var posicion = 0;

					$.each(droppedfolder, function(t) {

						foldertoread = driveunit + droppedfolder[t].children[1].attributes[1].value; //recogemos el value de cada carpeta
						recursivefolderdata(foldertoread);


						function recursivefolderdata(foldertoread) {

							var directoryelement = [];
							var directorycontent = [];
							var directoryfolders = [];
							var directoryarchives = [];

							var readedElements = fs.readdirSync(foldertoread)

							for (i = 0; i < readedElements.length; i++) {

								// comprobar si es carpeta o archivo
								var dirtoreadcheck = foldertoread + "\/" + readedElements[i];

								try {
									var arorfo = "i_am_an_archive";
									var arorfo = fs.readdirSync(dirtoreadcheck);
								}
								catch(exception) {};

								directoryelement.name = "\/" + readedElements[i]
								directoryelement.arorfo = arorfo;
								directoryelement.id = ""; // se lo metemos después de separar carpetas y archivos (y estará oculto en la vista)
								directoryelement.tagsid = []; // se lo metemos después de separar carpetas y archivos

								var copied_directoryelement = jQuery.extend({}, directoryelement); // necesario trabajar con una copia para actualizar el objeto directorycontent
								directorycontent[i] = copied_directoryelement;
							};

							// separa carpetas y archivos en dos objetos
							var i = 0;
							var ii = 0;
							var iii = 0;

							$.each(directorycontent, function(i) {

								if (directorycontent[i].arorfo != "i_am_an_archive" || directorycontent[i].arorfo == undefined || directorycontent[i].name == "Documents and Settings") {
									directoryfolders[ii] = directorycontent[i];

									ii++;
								} else {
									directoryarchives[iii] = directorycontent[i];
									iii++;
								};
							});

							$.each(directoryfolders, function(n){

								foldertoread = foldertoread.replace(driveunit,"");
								arraydecarpetas[posicion] = foldertoread + directoryfolders[n].name;
								arraydemadres[posicion] = droppedfolder[t].children[1].attributes[1].value;
								var parts = arraydemadres[posicion].split('/');
								parts.pop();
								arraydemadres[posicion] = parts.join('/');

								posicion++

								recursivefolderdata(foldertoread + directoryfolders[n].name);

							});

						}

					});

					$.each(arraydecarpetas, function(t){

						arraydecarpetasDest[t] = arraydecarpetas[t].replace(arraydemadres[t], selectedactionFolder);

					});

					// console.log("original folders:");
					// console.log(arraydecarpetas);
					// console.log("destination folders:");
					// console.log(arraydecarpetasDest);

					// se va a mirar si en destino hay una carpeta con el mismo nombre en la base de datos y si está se borra de ella

					$.each(arraydecarpetasDest, function(t) {

						var folderupdate = {};

						var trans11 = db.transaction(["folders"], "readwrite")
						var objectStore11 = trans11.objectStore("folders")
						var req11 = objectStore11.openCursor();

						req11.onerror = function(event) {
							console.log("error: " + event);
						};
						req11.onsuccess = function(event) {
							var cursor11 = event.target.result;
							if (cursor11) {

								if (cursor11.value.folder == arraydecarpetasDest[t]) {

									folderupdate.folderid = cursor11.value.folderid;

									var res2 = cursor11.delete(folderupdate);

									res2.onerror = function(event){
										console.log("error: carpeta destino no borrada de bd " + event);
									}

									res2.onsuccess = function(event){

										// console.log("carpeta destino no borrada de bd");

									}
								}

								cursor11.continue();
							}
						}

					});

					// ahora miramos cada una de las subcarpetas si está en la base de datos y si está le cambiamos la dirección por el de la subcarpeta destino, (los archivos al estar asociados a las carpetas cambiarán automáticamente)

					$.each(arraydecarpetas, function(t) {

						var updatefolder = {};

						var trans10 = db.transaction(["folders"], "readwrite")
						var objectStore10 = trans10.objectStore("folders")
						var req10 = objectStore10.openCursor();

						req10.onerror = function(event) {
							console.log(event);
						};
						req10.onsuccess = function(event) {
							var cursor10 = event.target.result;
							if (cursor10) {

								if (cursor10.value.folder == arraydecarpetas[t]) {

									updatefolder.folder = arraydecarpetasDest[t];
									updatefolder.folderid = cursor10.value.folderid;
									updatefolder.foldertags = cursor10.value.foldertags

									var res11 = cursor10.update(updatefolder);

									res11.onerror = function(event){
										console.log(event); // error ruta subcarpeta no cambiada
									}

									res11.onsuccess = function(event){

										// console.log("ruta subcarpetas cambiada")

									}

								}

								cursor10.continue();

							}

						}

					});

					// movemos cada una de las carpetas
					var flagg = 0;

					$.each(droppedfolder, function(t) {

						var parts = droppedfolder[t].children[1].attributes[1].value.split('/');
						var folderlastsub = "/" + parts.pop();

						fs.move(driveunit + droppedfolder[t].children[1].attributes[1].value, selecteddrive + selectedactionFolder + folderlastsub, { clobber: true }, function(err) {


							if (err) return console.error(err)

							flagg++;

							if (flagg == droppedfolder.length && droppedarchive.length == 0) { // para que lo lance al final

								$("#status").html("");
								$('.exploelement').css("filter","none");
								$('.exploelement').removeClass('ui-selecting');
								$('.exploelement').removeClass('ui-selected');

							}

						});

					});

				} //--fin trans


				// trabajamos con los archivos

				// primero comprobamos si algún archivo estaba en la base de datos (si tiene tags)

				var anyarchiveondb = "no";
				$.each(droppedarchive, function(t) {

					if (droppedarchive[t].children[4].attributes[1].value != "") {
						anyarchiveondb = "yes";
					}

				});

				if (anyarchiveondb == "yes") {

					// como los archivo (al menos uno) tienen tags se comprueba si la carpeta de destino esta en la bd
					var destfolderid = "";
					var originfolderid = {};

					var trans3 = db.transaction(["folders"], "readonly")
					var objectStore3 = trans3.objectStore("folders")
					var req3 = objectStore3.openCursor();

					req3.onerror = function(event) {console.log(event)};

					req3.onsuccess = function(event) {
						var cursor3 = event.target.result;
						if (cursor3) {
							if (cursor3.value.folder == selectedactionFolder) {

								destfolderid = cursor3.value.folderid;

							}
							// tambien aprovechamos para sacar el id de la carpeta origen (para luego buscar los archivos en la bd)
							$.each(droppedarchive, function(t) {

								if(cursor3.value.folder == droppedarchive[t].children[1].attributes[2].value){

									originfolderid[t] = cursor3.value.folderid;

								}

							});

							cursor3.continue();

						}

					}



					trans3.oncomplete = function(event) {

						var fileupdate = {};

						if (destfolderid == "") { // si la carpeta de destino NO estaba en la base de datos (no tiene id)

							// añadimos la carpeta a la bd pues los archivos a pasar tiene tags
							var trans4 = db.transaction(["folders"], "readwrite")
							var request4 = trans4.objectStore("folders")
							.put({ folder: selectedactionFolder, foldertags: [] }); //el id no hace falta pues es autoincremental

							request4.onerror = function(event) {console.log(event)}; //error carpeta destino no añadida a bd

							trans4.oncomplete = function(e) { // se toma el id de la carpeta añadida

								var trans5 = db.transaction(["folders"], "readonly")
								var objectStore5 = trans5.objectStore("folders")
								var req5 = objectStore5.openCursor();

								req5.onerror = function(event) {console.log(event)};

								req5.onsuccess = function(event) {

									var cursor5 = event.target.result;

									if(cursor5){

										if(cursor5.value.folder == selectedactionFolder){

											destfolderid = cursor5.value.folderid;

										}

										cursor5.continue();

									}

								}

								trans5.oncomplete = function(event) {

									// ahora se cambia el parámetro filefolder de cada uno de los archivos que movemos y están en la bd poniéndole el id de la carpeta destino
									var trans6 = db.transaction(["files"], "readwrite")
									var objectStore6 = trans6.objectStore("files")
									var req6 = objectStore6.openCursor();

									req6.onerror = function(event) {

										console.log("error: " + event);

									};

									req6.onsuccess = function(event) {

										var fileupdate = {};

										var cursor6 = event.target.result;

										if(cursor6){

											$.each(droppedarchive, function(t) {

												if(cursor6.value.filefolder == originfolderid[t]){

													if (cursor6.value.filename == droppedarchive[t].children[1].attributes[1].value) {

														fileupdate.fileid = cursor6.value.fileid;
														fileupdate.filefolder = destfolderid;
														fileupdate.filename = cursor6.value.filename;
														fileupdate.fileext = cursor6.value.fileext;
														fileupdate.filetags = cursor6.value.filetags;

														// Actualizamos los archivos en la bd con el nuevo filefolder
														var res7 = cursor6.update(fileupdate);

														res7.onerror = function(event){
															console.log("error ruta archivo no cambiada: " + event);
														}

														res7.onsuccess = function(event){

															// console.log("ruta archivo cambiada");

															// movemos los archivos
															var flagg=0;

															$.each(droppedarchive, function(t) {

																if (driveunit + droppedarchive[t].children[1].attributes[2].value + droppedarchive[t].children[1].attributes[1].value != selecteddrive + selectedactionFolder + droppedarchive[t].children[1].attributes[1].value) { // si origen y destino son distintos

																	fs.rename(driveunit + droppedarchive[t].children[1].attributes[2].value + droppedarchive[t].children[1].attributes[1].value, selecteddrive + selectedactionFolder + droppedarchive[t].children[1].attributes[1].value, function(err) {

																		if (err) {

																			flagg++;
																			if (flagg == droppedarchive.length) { //para que lo lance al final
																			$("#status").html("");
																			$('.exploelement').css("filter","none");
																			$('.exploelement').removeClass('ui-selecting');
																			$('.exploelement').removeClass('ui-selected');

																			}
																		}

																		flagg++;

																		if (flagg == droppedarchive.length) { //para que lo lance al final

																			$("#status").html("");
																			$('.exploelement').css("filter","none");
																			$('.exploelement').removeClass('ui-selecting');
																			$('.exploelement').removeClass('ui-selected');

																		}

																	});

																}

																else {

																	alertify.alert("Origin and destination files are the same in the case of <em>'"+ driveunit + droppedarchive[t].children[1].attributes[2].value + droppedarchive[t].children[1].attributes[1].value + "'</em> and will be not moved.");

																	if (t == droppedarchive.length-1) { //para que lo lance al final

																		$("#status").html("");
																		$('.exploelement').css("filter","none");
																		$('.exploelement').removeClass('ui-selecting');
																		$('.exploelement').removeClass('ui-selected');

																	}

																}

															});

														}

													}

												}

											});

											cursor6.continue();

										}

									}

									trans6.oncomplete = function(event) {

										// comprobamos si la carpeta origen se queda sin archivos con tags
										var borrarcarpetaorigenbd = {}

										var trans8 = db.transaction(["files"], "readonly")
										var objectStore8 = trans8.objectStore("files")
										var req8 = objectStore8.openCursor();

										req8.onerror = function(event) {

											console.log("error: " + event);

										};

										req8.onsuccess = function(event) {

											var cursor8 = event.target.result;

											if(cursor8){

												$.each(droppedarchive, function(t) {

													borrarcarpetaorigenbd[t] = "yes" //valor por defecto

													if(cursor8.value.filefolder == originfolderid[t]){

														borrarcarpetaorigenbd[t] = "no"

													}


												});


												cursor8.continue();
											}

										}

										trans8.oncomplete = function() {

											$.each(droppedarchive, function(t) {

												if (borrarcarpetaorigenbd[t] == "yes") {

													var trans9 = db.transaction(["folders"], "readwrite")
													var request9 = trans9.objectStore("folders").delete(originfolderid[t]);

													request9.onerror = function(event) {

														console.log("error - no se ha eliminado carpeta de bd:" + event);

													};
													request9.onsuccess = function(event) {

														// console.log("eliminada carpeta de la bd");

													}

												}

											});

										}

									}

								}

							}

						}

						else { // si la carpeta de destino ya estaba en la bd

							// primero borramos de la base de datos los archivos que están asociados a la carpeta destino que vamos a sobrescribir con la operación de movimiento
							$.each(droppedarchive, function(t) {

								var trans6 = db.transaction(["files"], "readwrite")
								var objectStore6 = trans6.objectStore("files")
								var req6 = objectStore6.openCursor();

								req6.onerror = function(event) {

									console.log("error: " + event);

								};

								req6.onsuccess = function(event) {

									var cursor6 = event.target.result;

									if(cursor6){

										if (cursor6.value.filefolder == destfolderid) {

											if (cursor6.value.filename == droppedarchive[t].children[1].attributes[1].value) {

												// se borra el id del archivo de destino
												var res8 = cursor6.delete(cursor6.value.fileid);

												res8.onerror = function(event) {

													console.log(event);

												};
												res8.onsuccess = function(event) {

													// console.log("fichero destino eliminado de la bd")

												};

											}

										}

										cursor6.continue();

									}

								}

							});

							// ahora modificamos los archivos de la base de datos poniendo el destfolderid como el filefolder de cada archivo que este en la bd

							$.each(droppedarchive, function(t) {

								var trans6 = db.transaction(["files"], "readwrite")
								var objectStore6 = trans6.objectStore("files")
								var req6 = objectStore6.openCursor();

								req6.onerror = function(event) {

									console.log("error: " + event);

								};

								req6.onsuccess = function(event) {

									var fileupdate = {};

									var cursor6 = event.target.result;

									if(cursor6){

										if(cursor6.value.filefolder == originfolderid[t]){

											if (cursor6.value.filename == droppedarchive[t].children[1].attributes[1].value) {

												fileupdate.fileid = cursor6.value.fileid;
												fileupdate.filefolder = destfolderid;
												fileupdate.filename = cursor6.value.filename;
												fileupdate.fileext = cursor6.value.fileext;
												fileupdate.filetags = cursor6.value.filetags;

												// actualizamos los archivos en la bd con el nuevo filefolder
												var res7 = cursor6.update(fileupdate);

												res7.onerror = function(event){
													console.log("error ruta archivo no cambiada: " + event);
												}

												res7.onsuccess = function(event){

													// movemos los archivos

													var flagg = 0;

													$.each(droppedarchive, function(t) {

														fs.rename(driveunit + droppedarchive[t].children[1].attributes[2].value + droppedarchive[t].children[1].attributes[1].value, selecteddrive + selectedactionFolder + droppedarchive[t].children[1].attributes[1].value, function(err) {


															if (err) return console.error(err)

															flagg++;

															if (flagg == droppedarchive.length) { //para que lo lance al final

																$("#status").html("");
																$('.exploelement').css("filter","none");
																$('.exploelement').removeClass('ui-selecting');
																$('.exploelement').removeClass('ui-selected');

															}


														});

													});

												}

											}

										}

										cursor6.continue();
									}

								}

								trans6.oncomplete = function(event) {

									// comprobamos si la carpeta origen se queda sin archivos con tags
									var borrarcarpetaorigenbd = [];

									var trans8 = db.transaction(["files"], "readonly")
									var objectStore8 = trans8.objectStore("files")
									var req8 = objectStore8.openCursor();

									req8.onerror = function(event) {

										console.log("error: " + event);

									};

									req8.onsuccess = function(event) {

										var cursor8 = event.target.result;

										if(cursor8){

											$.each(droppedarchive, function(t) {

												borrarcarpetaorigenbd[t] = "yes";

												if(cursor8.value.filefolder == originfolderid[t]){

													borrarcarpetaorigenbd[t] = "no"

												}

											});

											cursor8.continue();
										}


									}

									trans8.oncomplete = function() {

										$.each(droppedarchive, function(t) {

											if (borrarcarpetaorigenbd[t] == "yes") {

												var trans9 = db.transaction(["folders"], "readwrite")
												var request9 = trans9.objectStore("folders").delete(originfolderid[t]);

												request9.onerror = function(event) {

													console.log("error - no se ha eliminado carpeta de bd:" + event);

												};

												request9.onsuccess = function(event) {

													// console.log("eliminada carpeta de la bd");

												}

											}

										});

									}

								}

							});


						}

					}

				}

				else { //si los archivos no tienen tag

					// Se mueven los archivos y ya esta
					var flagg = 0;

					$.each(droppedarchive, function(t) {

						fs.rename(driveunit + droppedarchive[t].children[1].attributes[2].value + droppedarchive[t].children[1].attributes[1].value, selecteddrive + selectedactionFolder + droppedarchive[t].children[1].attributes[1].value, function(err) {

							if (err) return console.error(err)

							flagg++;

							if (flagg == droppedarchive.length) { //para que lo lance al final

								$("#status").html("");
								$('.exploelement').css("filter","none");
								$('.exploelement').removeClass('ui-selecting');
								$('.exploelement').removeClass('ui-selected');

							}


						});

					});

				}

			}

		}

	}

	// Mover sin pasarle tags

	else if (alsotags=="no") {

		var arraydecarpetas = {};
		var posicion = 0;
		var idcarpetamadre = [];
		var originfolderid = [];

		var contadorarchivosseleccionados = 0;

		// hay que eliminar los tags de todos los elementos originales

		// antes de empezar a borrar nada hay que recorrer las subcarpetas recursivamente para tener un listado de ellas y poder borrarlas de la bd

		if (droppedfolder.length > 0) {

			$.each(droppedfolder, function(t) {

				foldertoread = driveunit + droppedfolder[t].children[1].attributes[1].value; //recogemos el value de cada carpeta
				recursivefolderdata(foldertoread);


				function recursivefolderdata(foldertoread) {

					var directoryelement = [];
					var directorycontent = [];
					var directoryfolders = [];
					var directoryarchives = [];

					var readedElements = fs.readdirSync(foldertoread)

					for (i = 0; i < readedElements.length; i++) {

						// comprobar si es carpeta o archivo
						var dirtoreadcheck = foldertoread + "\/" + readedElements[i];

						try {
							var arorfo = "i_am_an_archive";
							var arorfo = fs.readdirSync(dirtoreadcheck);
						}
						catch(exception) {};

						directoryelement.name = "\/" + readedElements[i]
						directoryelement.arorfo = arorfo;
						directoryelement.id = ""; // se lo metemos después de separar carpetas y archivos (y estará oculto en la vista)
						directoryelement.tagsid = []; // se lo metemos después de separar carpetas y archivos

						var copied_directoryelement = jQuery.extend({}, directoryelement); // necesario trabajar con una copia para actualizar el objeto directorycontent
						directorycontent[i] = copied_directoryelement;
					};

					// separa carpetas y archivos en dos objetos
					var i = 0;
					var ii = 0;
					var iii = 0;

					$.each(directorycontent, function(i) {

						if (directorycontent[i].arorfo != "i_am_an_archive" || directorycontent[i].arorfo == undefined || directorycontent[i].name == "Documents and Settings") {
							directoryfolders[ii] = directorycontent[i];

							ii++;
						} else {
							directoryarchives[iii] = directorycontent[i];
							iii++;
						};
					});

					$.each(directoryfolders, function(n){

						foldertoread = foldertoread.replace(driveunit,"");
						arraydecarpetas[posicion] = foldertoread + directoryfolders[n].name;

						posicion++;

						recursivefolderdata(foldertoread + directoryfolders[n].name);

					});

				}

			});

			// console.log(arraydecarpetas)
		}


		// se borran los archivos de primer nivel de la base de datos (si están)
		// primero sacamos el id de las carpetas origen de archivos (para luego buscar los archivos en la bd)
		var trans3 = db.transaction(["folders"], "readonly")
		var objectStore3 = trans3.objectStore("folders")
		var req3 = objectStore3.openCursor();

		req3.onerror = function(event) {console.log(event)};

		req3.onsuccess = function(event) {
			var cursor3 = event.target.result;
			if (cursor3) {


				$.each(droppedarchive, function(t) {
					if(cursor3.value.folder == droppedarchive[t].children[1].attributes[2].value){

						originfolderid[t] = cursor3.value.folderid;

					}

				});

				cursor3.continue();

			}

		}

		trans3.oncomplete = function(event) {

			// borramos los archivos de la bd

			var trans = db.transaction(["files"], "readwrite")
			var objectStore = trans.objectStore("files")
			var req = objectStore.openCursor();

			req.onerror = function(event) {

				console.log(event);
			};

			req.onsuccess = function(event) {

				var cursor = event.target.result;

				if(cursor){

					$.each(droppedarchive, function(t) {

						if(cursor.value.filefolder == originfolderid[t]) {

							if(cursor.value.filename ==  droppedarchive[t].children[1].attributes[1].value) {

								var res7 = cursor.delete(cursor.value.fileid);

								res7.onerror = function(event){
									console.log(event);
								}

								res7.onsuccess = function(event){

								}

							}

						}

					});

					cursor.continue();

				}

			}

			// ahora comprobamos si las capetas madres se quedan vaciás para borrarlas después si esto es así (y además no tienen tags)

			var tienemasarchivos = [];

			var trans4 = db.transaction(["files"], "readonly")
			var objectStore4 = trans4.objectStore("files")
			var req4 = objectStore4.openCursor();

			req4.onerror = function(event) {

				console.log(event);
			};

			req4.onsuccess = function(event) {

				var cursor = event.target.result;

				if(cursor){

					$.each(originfolderid, function(t) {

						tienemasarchivos[t] = "no";

						if (cursor.value.filefolder == originfolderid[t]) {

							tienemasarchivos[t] = "yes";

						}

					});

					cursor.continue();

				}

			}

			trans4.oncomplete = function() {

				// ahora borramos las carpetas madres si no tienen más archivos ni tienen tags

				var trans2 = db.transaction(["folders"], "readwrite")
				var objectStore2 = trans2.objectStore("folders")
				var req2 = objectStore2.openCursor();

				req2.onerror = function(event) {

					console.log(event);
				};

				req2.onsuccess = function(event) {

					var cursor = event.target.result;

					if (cursor) {

						$.each(originfolderid, function(t) {

							if (cursor.value.folderid == originfolderid[t]){

								if (tienemasarchivos[t] == "no"){

									if(cursor.value.foldertags == "") {

										var res7 = cursor.delete(cursor.value.folderid);

										res7.onerror = function(event){
											console.log(event);
										}

										res7.onsuccess = function(event){

										}


									}

								}

							}


						});

						cursor.continue();

					}

				}

			}

		}

		// hay que borrar los droppedfolders y los arraydecarpetas de la bd (y disasociar todos los archivos que pudieran tener)

		// vamos con el arraydecarpetas (las subcarpetas de las carpetas movidas/eliminadas)
		var idcarpetaaborrar = [];
		var trans5 = db.transaction(["folders"], "readwrite")
		var objectStore5 = trans5.objectStore("folders")
		var req5 = objectStore5.openCursor();

		req5.onerror = function(event) {

			console.log(event);
		};

		req5.onsuccess = function(event) {

			var cursor = event.target.result;

			if (cursor){

				$.each(arraydecarpetas, function(t) {

					if (cursor.value.folder == arraydecarpetas[t]) {

						idcarpetaaborrar[t] = cursor.value.folderid; // para luego borrar todos los archivos asociados a ella de la bd

						var res7 = cursor.delete(cursor.value.folderid);

						res7.onerror = function(event){
							console.log(event);
						}

						res7.onsuccess = function(event){

						}

					}


				})

				cursor.continue();

			}

		}

		trans5.oncomplete = function(event) {

			//borramos los archivos de la bd

			var trans = db.transaction(["files"], "readwrite")
			var objectStore = trans.objectStore("files")
			var req = objectStore.openCursor();

			req.onerror = function(event) {

				console.log(event);
			};

			req.onsuccess = function(event) {

				var cursor = event.target.result;

				if (cursor){

					$.each(idcarpetaaborrar, function(t) {

						if (cursor.value.filefolder == idcarpetaaborrar[t]) {

							var res7 = cursor.delete(cursor.value.fileid);

							res7.onerror = function(event){
								console.log(event);
							}

							res7.onsuccess = function(event){

							}

						}

					})

					cursor.continue();

				}

			}

		}

		// vamos con el droppedfolders (las carpetas movidas/eliminadas)
		var idcarpetaraborrarr = [];
		var trans5 = db.transaction(["folders"], "readwrite")
		var objectStore5 = trans5.objectStore("folders")
		var req5 = objectStore5.openCursor();

		req5.onerror = function(event) {

			console.log(event);
		};

		req5.onsuccess = function(event) {

			var cursor = event.target.result;

			if (cursor){

				$.each(droppedfolder, function(t) {

					if (cursor.value.folder == droppedfolder[t].children[1].attributes[1].value) {

						idcarpetaraborrarr[t] = cursor.value.folderid; // para luego borrar todos los archivos a sociados a ella de la bd

						var res7 = cursor.delete(cursor.value.folderid);

						res7.onerror = function(event){
							console.log(event);
						}

						res7.onsuccess = function(event){

						}

					}


				})

				cursor.continue();

			}

		}

		trans5.oncomplete = function(event) {

			//borramos los archivos de la bd

			var trans = db.transaction(["files"], "readwrite")
			var objectStore = trans.objectStore("files")
			var req = objectStore.openCursor();

			req.onerror = function(event) {

				console.log(event);
			};

			req.onsuccess = function(event) {

				var cursor = event.target.result;

				if (cursor){

					$.each(idcarpetaraborrarr, function(t) {

						if (cursor.value.filefolder == idcarpetaraborrarr[t]) {

							var res7 = cursor.delete(cursor.value.fileid);

							res7.onerror = function(event){
								console.log(event);
							}

							res7.onsuccess = function(event){

							}

						}

					})

					cursor.continue();

				}

			}

		};


		$.each($('.ui-selecting'), function(u) {

			// para poder mover/eliminar los videos hay que quitarlos del DOM (es decir de la memoria)
			try {
				if (viewmode == 1) {

					// console.log($('.ui-selecting:eq('+u+')'))
					if ($('.ui-selecting:eq('+u+')')["0"].childNodes["0"].childNodes[0]){
						if ($('.ui-selecting:eq('+u+')')["0"].childNodes["0"].childNodes[0].nodeName == "VIDEO") {//para viewmode = 1

							var videoElement = $('.ui-selecting:eq('+u+')')["0"].childNodes["0"].childNodes[0];
							videoElement.pause();
							videoElement.currentSrc =""; // empty source
							videoElement.src="";
							videoElement.load();
							var parenteee = videoElement.parentNode
							parenteee.removeChild(parenteee.childNodes[0])
							// parenteee.removeChild(parenteee.childNodes[0])

						}
					}
				}
				else {

					if ($('.ui-selecting:eq('+u+')')["0"].childNodes["0"].childNodes[1]){
						if ($('.ui-selecting:eq('+u+')')["0"].childNodes["0"].childNodes[1].nodeName == "VIDEO") {//para viewmodes !=1

							var videoElement = $('.ui-selecting:eq('+u+')')["0"].childNodes["0"].childNodes[1];
							$('.ui-selecting:eq('+u+')').children().children('video').attr('src','')
							videoElement.pause();
							videoElement.currentSrc =""; // empty source
							videoElement.src="";
							videoElement.load();
							var parenteee = videoElement.parentNode
							parenteee.removeChild(parenteee.childNodes[0])
							// parenteee.removeChild(parenteee.childNodes[0])
						}
					}
				}
			} catch (err) {console.log(err)}


			// se aprobecha a quitar de la pantalla lo seleccionado (porque es necesario para que borre/mueva los videos y porque quizas queda mejor)
			$('.ui-selecting:eq('+u+')')[0].style.display = "none";
			contadorarchivosseleccionados++;

		});

		$('#numeroderesultadosarchivos').html("Found " + ($(".exploelement").length - contadorarchivosseleccionados) + " files. ");
		resultadosarchivos.length = $(".exploelement").length - contadorarchivosseleccionados;



		// se mueven los archivos y las carpetas

		var flagg = 0;

		$.each(droppedarchive, function(t) {

			fs.move(driveunit + droppedarchive[t].children[1].attributes[2].value + droppedarchive[t].children[1].attributes[1].value, selecteddrive + selectedactionFolder + droppedarchive[t].children[1].attributes[1].value, function(err) {

				if (err) return console.error(err)

				flagg++;

				if (flagg == droppedarchive.length && droppedfolder.length == 0) { //para que lo lance al final

					$("#status").html("");
					$('.exploelement').css("filter","none");
					$('.exploelement').removeClass('ui-selecting');
					$('.exploelement').removeClass('ui-selected');

				}


			});

		});

		var flagg2 = 0;

		$.each(droppedfolder, function(t) {

			var parts = droppedfolder[t].children[1].attributes[1].value.split('/');
			var folderlastsub = "/" + parts.pop();

			fs.move(driveunit + droppedfolder[t].children[1].attributes[1].value, selecteddrive + selectedactionFolder + folderlastsub, { clobber: true }, function(err) {

				if (err) return console.error(err)

				flagg2++;

				if (flagg2 == droppedfolder.length) { //para que lo lance al final

					$("#status").html("");
					$('.exploelement').css("filter","none");
					$('.exploelement').removeClass('ui-selecting');
					$('.exploelement').removeClass('ui-selected');

					//si se han "borrado" carpetas de la bd  por si acaso se vuelve a lanzar el search para que no se muestren archivos inexistentes
					$( "#searchaction" ).trigger( "click" );

				}

			});

		});

	}

}



// Borrar

window.parent.$("#delete").on('click', function() {

	if (window.parent.$("li.current").attr('data-tab') == "tab-1") { // salir de la función si esta seleccionado el exlplore
		return;

	}

	if ($(".exploelement.ui-selecting").length > 0) {

		alldroppedelement = $(".exploelement.ui-selecting");

	}
	else if ($(".exploelement.ui-selected").length > 0) {

		alldroppedelement = $(".exploelement.ui-selected");
	}

	if (alldroppedelement.length == 0) {

		alertify.alert("No elements selected to delete.")

	}

	droppedarchive = [];
    droppedfolder = [];
    foldername = [];
	var y = 0;
    var x = 0;

	$.each (alldroppedelement, function(t) {

		if (alldroppedelement[t].classList.contains("archive")) {

			droppedarchive[y] = alldroppedelement[t];
			y++

		} else if (alldroppedelement[t].classList.contains("folder")) {

			droppedfolder[x] = alldroppedelement[t];
			x++
		}

	});


	if (droppedarchive.length > 0 && droppedfolder.length > 0) {

		alertify.confirm(droppedarchive.length + " files and " + droppedfolder.length + " folders (and all it´s contents) are selected to delete. There is no undo for delete. Are you sure?", function (e) {
			if (e) {
				$("#status").html("Deleting ...");
				$('.exploelement, .exploelementfolderup').css("filter","opacity(46%)");
				setTimeout(function() { //porque sino no escribe el "Deleting ..."
					deleteitsearch()
				}, 50);
		}});
	}
	else if (droppedarchive.length > 0 && droppedfolder.length == 0) {

		alertify.confirm( droppedarchive.length + " files are selected to delete. There is no undo for delete. Are you sure?", function (e) {
			if (e) {
				$("#status").html("Deleting ...");
				$('.exploelement, .exploelementfolderup').css("filter","opacity(46%)");
				setTimeout(function() { //porque sino no escribe el "Deleting ..."
					deleteitsearch()
				}, 50);
		}});

	}
	else if (droppedarchive.length == 0 && droppedfolder.length > 0) {

		alertify.confirm(droppedfolder.length + " folders (and all it´s contents) are selected to delete. There is no undo for delete. Are you sure?", function (e) {
			if (e) {
				$("#status").html("Deleting ...");
				$('.exploelement, .exploelementfolderup').css("filter","opacity(46%)");
				setTimeout(function() { //porque sino no escribe el "Deleting ..."
					deleteitsearch()
				}, 50);
		}});

	}


	function deleteitsearch(){

		// para que no haya ningun tipo de conflicto se limpia el undo
		$("#undo", window.parent.document).attr("data-tooltip", "UNDO (not undo action)");
		undo.class == "";

		var arraydecarpetas = {};
		var posicion = 0;
		var idcarpetamadre = [];
		var originfolderid = [];
		var contadorarchivosseleccionados = 0;

		// hay que eliminar los tags de todos los elementos originales

		// antes de empezar a borrar nada hay que recorrer las subcarpetas recursivamente para tener un listado de ellas y poder borrarlas de la bd

		if (droppedfolder.length > 0) {

			$.each(droppedfolder, function(t) {

				foldertoread = driveunit + droppedfolder[t].children[1].attributes[1].value; //recogemos el value de cada carpeta
				recursivefolderdata(foldertoread);


				function recursivefolderdata(foldertoread) {

					var directoryelement = [];
					var directorycontent = [];
					var directoryfolders = [];
					var directoryarchives = [];

					var readedElements = fs.readdirSync(foldertoread)

					for (i = 0; i < readedElements.length; i++) {

						// comprobar si es carpeta o archivo
						var dirtoreadcheck = foldertoread + "\/" + readedElements[i];

						try {
							var arorfo = "i_am_an_archive";
							var arorfo = fs.readdirSync(dirtoreadcheck);
						}
						catch(exception) {};

						directoryelement.name = "\/" + readedElements[i]
						directoryelement.arorfo = arorfo;
						directoryelement.id = ""; // se lo metemos después de separar carpetas y archivos (y estará oculto en la vista)
						directoryelement.tagsid = []; // se lo metemos después de separar carpetas y archivos

						var copied_directoryelement = jQuery.extend({}, directoryelement); // necesario trabajar con una copia para actualizar el objeto directorycontent
						directorycontent[i] = copied_directoryelement;
					};

					// separa carpetas y archivos en dos objetos
					var i = 0;
					var ii = 0;
					var iii = 0;

					$.each(directorycontent, function(i) {

						if (directorycontent[i].arorfo != "i_am_an_archive" || directorycontent[i].arorfo == undefined || directorycontent[i].name == "Documents and Settings") {
							directoryfolders[ii] = directorycontent[i];

							ii++;
						} else {
							directoryarchives[iii] = directorycontent[i];
							iii++;
						};
					});

					$.each(directoryfolders, function(n){

						foldertoread = foldertoread.replace(driveunit,"");
						arraydecarpetas[posicion] = foldertoread + directoryfolders[n].name;

						posicion++;

						recursivefolderdata(driveunit + foldertoread + directoryfolders[n].name);

					});

				}

			});

			// console.log(arraydecarpetas)
		}


		// se borran los archivos de primer nivel de la base de datos (si están)
		// primero sacamos el id de las carpetas origen de archivos (para luego buscar los archivos en la bd)
		var trans3 = db.transaction(["folders"], "readonly")
		var objectStore3 = trans3.objectStore("folders")
		var req3 = objectStore3.openCursor();

		req3.onerror = function(event) {console.log(event)};

		req3.onsuccess = function(event) {
			var cursor3 = event.target.result;
			if (cursor3) {


				$.each(droppedarchive, function(t) {
					if(cursor3.value.folder == droppedarchive[t].children[1].attributes[2].value){

						originfolderid[t] = cursor3.value.folderid;

					}

				});

				cursor3.continue();

			}

		}

		trans3.oncomplete = function(event) {

			// borramos los archivos de la bd

			var trans = db.transaction(["files"], "readwrite")
			var objectStore = trans.objectStore("files")
			var req = objectStore.openCursor();

			req.onerror = function(event) {

				console.log(event);
			};

			req.onsuccess = function(event) {

				var cursor = event.target.result;

				if(cursor){

					$.each(droppedarchive, function(t) {

						if(cursor.value.filefolder == originfolderid[t]) {

							if(cursor.value.filename ==  droppedarchive[t].children[1].attributes[1].value) {

								var res7 = cursor.delete(cursor.value.fileid);

								res7.onerror = function(event){
									console.log(event);
								}

								res7.onsuccess = function(event){

								}

							}

						}

					});

					cursor.continue();

				}

			}

			// ahora comprobamos si las capetas madres se quedan vaciás para borrarlas después si esto es así (y además no tienen tags)

			var tienemasarchivos = [];

			var trans4 = db.transaction(["files"], "readonly")
			var objectStore4 = trans4.objectStore("files")
			var req4 = objectStore4.openCursor();

			req4.onerror = function(event) {

				console.log(event);
			};

			req4.onsuccess = function(event) {

				var cursor = event.target.result;

				if(cursor){

					$.each(originfolderid, function(t) {

						tienemasarchivos[t] = "no";

						if (cursor.value.filefolder == originfolderid[t]) {

							tienemasarchivos[t] = "yes";

						}

					});

					cursor.continue();

				}

			}

			trans4.oncomplete = function() {

				// ahora borramos las carpetas madres si no tienen más archivos ni tienen tags

				var trans2 = db.transaction(["folders"], "readwrite")
				var objectStore2 = trans2.objectStore("folders")
				var req2 = objectStore2.openCursor();

				req2.onerror = function(event) {

					console.log(event);
				};

				req2.onsuccess = function(event) {

					var cursor = event.target.result;

					if (cursor) {

						$.each(originfolderid, function(t) {

							if (cursor.value.folderid == originfolderid[t]){

								if (tienemasarchivos[t] == "no"){

									if(cursor.value.foldertags == "") {

										var res7 = cursor.delete(cursor.value.folderid);

										res7.onerror = function(event){
											console.log(event);
										}

										res7.onsuccess = function(event){

										}


									}

								}

							}


						});

						cursor.continue();

					}

				}

			}

		}

		// hay que borrar los droppedfolders y los arraydecarpetas de la bd (y disasociar todos los archivos que pudieran tener)

		// vamos con el arraydecarpetas (las subcarpetas de las carpetas movidas/eliminadas)
		var idcarpetaaborrar = [];
		var trans5 = db.transaction(["folders"], "readwrite")
		var objectStore5 = trans5.objectStore("folders")
		var req5 = objectStore5.openCursor();

		req5.onerror = function(event) {

			console.log(event);
		};

		req5.onsuccess = function(event) {

			var cursor = event.target.result;

			if (cursor){

				$.each(arraydecarpetas, function(t) {

					if (cursor.value.folder == arraydecarpetas[t]) {

						idcarpetaaborrar[t] = cursor.value.folderid; // para luego borrar todos los archivos asociados a ella de la bd

						var res7 = cursor.delete(cursor.value.folderid);

						res7.onerror = function(event){
							console.log(event);
						}

						res7.onsuccess = function(event){

						}

					}


				})

				cursor.continue();

			}

		}

		trans5.oncomplete = function(event) {

			//borramos los archivos de la bd

			var trans = db.transaction(["files"], "readwrite")
			var objectStore = trans.objectStore("files")
			var req = objectStore.openCursor();

			req.onerror = function(event) {

				console.log(event);
			};

			req.onsuccess = function(event) {

				var cursor = event.target.result;

				if (cursor){

					$.each(idcarpetaaborrar, function(t) {

						if (cursor.value.filefolder == idcarpetaaborrar[t]) {

							var res7 = cursor.delete(cursor.value.fileid);

							res7.onerror = function(event){
								console.log(event);
							}

							res7.onsuccess = function(event){

							}

						}

					})

					cursor.continue();

				}

			}

		}

		// vamos con el droppedfolders (las carpetas movidas/eliminadas)
		var idcarpetaraborrarr = [];
		var trans5 = db.transaction(["folders"], "readwrite")
		var objectStore5 = trans5.objectStore("folders")
		var req5 = objectStore5.openCursor();

		req5.onerror = function(event) {

			console.log(event);
		};

		req5.onsuccess = function(event) {

			var cursor = event.target.result;

			if (cursor){

				$.each(droppedfolder, function(t) {

					if (cursor.value.folder == droppedfolder[t].children[1].attributes[1].value) {

						idcarpetaraborrarr[t] = cursor.value.folderid; // para luego borrar todos los archivos a sociados a ella de la bd

						var res7 = cursor.delete(cursor.value.folderid);

						res7.onerror = function(event){
							console.log(event);
						}

						res7.onsuccess = function(event){

						}

					}


				})

				cursor.continue();

			}

		}

		trans5.oncomplete = function(event) {

			//borramos los archivos de la bd

			var trans = db.transaction(["files"], "readwrite")
			var objectStore = trans.objectStore("files")
			var req = objectStore.openCursor();

			req.onerror = function(event) {

				console.log(event);
			};

			req.onsuccess = function(event) {

				var cursor = event.target.result;

				if (cursor){

					$.each(idcarpetaraborrarr, function(t) {

						if (cursor.value.filefolder == idcarpetaraborrarr[t]) {

							var res7 = cursor.delete(cursor.value.fileid);

							res7.onerror = function(event){
								console.log(event);
							}

							res7.onsuccess = function(event){

							}

						}

					})

					cursor.continue();

				}

			}

		};

		$.each($('.ui-selecting'), function(u) {

			// para poder mover/eliminar los videos hay que quitarlos del DOM (es decir de la memoria)
			try {
				if (viewmode == 1) {

					// console.log($('.ui-selecting:eq('+u+')'))
					if ($('.ui-selecting:eq('+u+')')["0"].childNodes["0"].childNodes[0]){
						if ($('.ui-selecting:eq('+u+')')["0"].childNodes["0"].childNodes[0].nodeName == "VIDEO") {//para viewmode = 1

							var videoElement = $('.ui-selecting:eq('+u+')')["0"].childNodes["0"].childNodes[0];
							videoElement.pause();
							videoElement.currentSrc =""; // empty source
							videoElement.src="";
							videoElement.load();
							var parenteee = videoElement.parentNode
							parenteee.removeChild(parenteee.childNodes[0])
							// parenteee.removeChild(parenteee.childNodes[0])

						}
					}
				}
				else {

					if ($('.ui-selecting:eq('+u+')')["0"].childNodes["0"].childNodes[1]){
						if ($('.ui-selecting:eq('+u+')')["0"].childNodes["0"].childNodes[1].nodeName == "VIDEO") {//para viewmodes !=1

							var videoElement = $('.ui-selecting:eq('+u+')')["0"].childNodes["0"].childNodes[1];
							$('.ui-selecting:eq('+u+')').children().children('video').attr('src','')
							videoElement.pause();
							videoElement.currentSrc =""; // empty source
							videoElement.src="";
							videoElement.load();
							var parenteee = videoElement.parentNode
							parenteee.removeChild(parenteee.childNodes[0])
							// parenteee.removeChild(parenteee.childNodes[0])
						}
					}
				}
			} catch (err) {console.log(err)}


			// se aprobecha a quitar de la pantalla lo seleccionado (porque es necesario para que borre/mueva los videos y porque quizas queda mejor)
			$('.ui-selecting:eq('+u+')')[0].style.display = "none";
			contadorarchivosseleccionados++

		});
		$.each($('.ui-selected'), function(u) {

			// para poder mover/eliminar los videos hay que quitarlos del DOM (es decir de la memoria)
			try {
				if (viewmode == 1) {

					// console.log($('.ui-selected:eq('+u+')'))
					if ($('.ui-selected:eq('+u+')')["0"].childNodes["0"].childNodes[0]){
						if ($('.ui-selected:eq('+u+')')["0"].childNodes["0"].childNodes[0].nodeName == "VIDEO") {//para viewmode = 1

							var videoElement = $('.ui-selected:eq('+u+')')["0"].childNodes["0"].childNodes[0];
							videoElement.pause();
							videoElement.currentSrc =""; // empty source
							videoElement.src="";
							videoElement.load();
							var parenteee = videoElement.parentNode
							parenteee.removeChild(parenteee.childNodes[0])
							// parenteee.removeChild(parenteee.childNodes[0])

						}
					}
				}
				else {

					if ($('.ui-selected:eq('+u+')')["0"].childNodes["0"].childNodes[1]){
						if ($('.ui-selected:eq('+u+')')["0"].childNodes["0"].childNodes[1].nodeName == "VIDEO") {//para viewmodes !=1

							var videoElement = $('.ui-selected:eq('+u+')')["0"].childNodes["0"].childNodes[1];
							$('.ui-selected:eq('+u+')').children().children('video').attr('src','')
							videoElement.pause();
							videoElement.currentSrc =""; // empty source
							videoElement.src="";
							videoElement.load();
							var parenteee = videoElement.parentNode
							parenteee.removeChild(parenteee.childNodes[0])
							// parenteee.removeChild(parenteee.childNodes[0])
						}
					}
				}
			} catch (err) {console.log(err)}


			// se aprobecha a quitar de la pantalla lo seleccionado (porque es necesario para que borre/mueva los videos y porque quizas queda mejor)
			$('.ui-selected:eq('+u+')')[0].style.display = "none";
			contadorarchivosseleccionados++

		});



		$('#numeroderesultadosarchivos').html("Found " + ($(".exploelement").length - contadorarchivosseleccionados) + " files. ");
		resultadosarchivos.length = $(".exploelement").length - contadorarchivosseleccionados;


		// se borran los archivos y las carpetas

		var flagg = 0;

		$.each(droppedarchive, function(t) {

			fs.remove(driveunit + droppedarchive[t].children[1].attributes[2].value + droppedarchive[t].children[1].attributes[1].value, function(err) {

				if (err) return console.error(err)

				flagg++;

				if (flagg == droppedarchive.length && droppedfolder.length == 0) { //para que lo lance al final

					$("#status").html("");
					$('.exploelement').css("filter","none");
					$('.exploelement').removeClass('ui-selecting');
					$('.exploelement').removeClass('ui-selected');

				}


			});

		});

		var flagg2 = 0;

		$.each(droppedfolder, function(t) {

			var parts = droppedfolder[t].children[1].attributes[1].value.split('/');
			var folderlastsub = "/" + parts.pop();

			fs.remove(driveunit + droppedfolder[t].children[1].attributes[1].value, function(err) {

				if (err) return console.error(err)

				flagg2++;

				if (flagg2 == droppedfolder.length) { //para que lo lance al final

					$("#status").html("");
					$('.exploelement').css("filter","none");
					$('.exploelement').removeClass('ui-selecting');
					$('.exploelement').removeClass('ui-selected');

					//si se han borrado carpetas por si acaso se vuelve a lanzar el search para que no se muestren archivos inexistentes
					$( "#searchaction" ).trigger( "click" );

				}

			});

		});

	}

});
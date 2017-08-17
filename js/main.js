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

var fs = require('fs-extra');
var Sniffr = require("sniffr");
var AdmZip = require('adm-zip'); // para manejarse con los zip (o los epub que son ficheros zip)
var agent = navigator.userAgent;
window.s = "";
s = new Sniffr();
s.sniff(agent);

window.currentlydatabaseused = localStorage["currentlydatabaseused"];

var directoryelement = [];
var alldroppedelement = [];
var viewmode="1"
var leftcolumnslimit = "";

var arraylocations = [];
var arraylocationposition = "";

var selectedtagcolor = "";
var selectedtagtext = "";
var selectedtagform = "";

window.tip = [];

var editando = "no";

var order = "nameasc";

pasteaction = window.top.pasteaction;

var searchviewmode = top.searcher.searchviewmode; // es solo para que no de error el pressandhold


iniciarfolderview(); // inicia cadena de acciones, carga de explorador, tags etc..


$(document).ready(function () {


	// panel de desarrollo ////\\\\
	$( "#paneloff" ).click(function() {
		$("#panel").removeClass("show");
	});
	////////////////////////\\\\\\\\


	// para poder regular anchuras divs
	columnaswidth = [];
	// paneles izquierdo/derecho
	interact('#treeview')

	  .resizable({
		preserveAspectRatio: false,
		edges: { left: false, right: true, bottom: false, top: false },

			onstart: function (event) {

				if (viewmode==1) {
					$(".imgmode1").width("16px")

				}

			},
			onend: function (event) {

				// se van a convertir los valores en pixeles de las columnas del panel derecho a porcentajes para que al cambiar la anchura del panel cambien las anchuras de las columnas de forma equitativa.
				if (viewmode==1){
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

			}
	  })
	  .on('resizemove', function (event) {

			var originalwidth = $('#treeview').width();
			var nd_originalwidth = $('#locationinfo, #dirview-wrapper').width();

			var diference = originalwidth - event.rect.width;
			var nd_newwidth = nd_originalwidth + diference;

			if (nd_newwidth > 400 && nd_newwidth < window.innerWidth - 45) { //esto es para poner un tamaño minimo y máximo
				$('#treeview').width(event.rect.width);
				$('#locationinfo, #dirview-wrapper').width(nd_newwidth);
			}


			// este es un apaño necesario para que se pueda leer la dirección del location cuando hay poca anchura
			if ($("#locationinfo").width() <= 52 + $("#location").width() + 75 + 26) {
				$("#previousnextleft").css("display", "none")
				$("#previousnextright").css("display", "inline-block")
				$("#location").css("padding-left", "2px")

			}
			else {
				$("#previousnextleft").css("display", "inline-block")
				$("#previousnextright").css("display", "none");
				$("#location").css("padding-left", "0")

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
		var nd_newwidth = nd_originalwidth + diference;
		if (originalwidth > 20 && nd_originalwidth > 80) { //esto es solo para poner un tamño minimo
			$('#bottomleft').width(event.rect.width);
			$('#bottomright').width(nd_newwidth);
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
	if (viewmode==1){

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


	} // --fin if viewmode=1


	if (viewmode!=1){

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


	} // --fin if viewmode!=1

	// cuando se cambia el tamaño de la pantalla
	$( window ).resize(function() {

		// ponemos las anchuras del panel izquierdo y derecho en porcentajes para que se ajusten al tamaño de la pantalla
		$('#treeview').width(''+ 24.8 + '%');
		$('#locationinfo, #dirview-wrapper').width(''+ 74 + '%');
		$('#searchview').width(''+ 24.8 + '%');
		$('#searchdirview-wrapper').width(''+ 74 + '%');
		$('#bottomleft').width('205px');
		$('#bottomright').width('calc(100% - 223px)');

	});


	// goma de borrar
	window.eraseron = "off";

	$("#eraser img").click(function() {

		var cursoractual = $(".tags > div").css('cursor')

		if (eraseron == "off") {

			$(".tags > div").css("cursor", "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAAWCAYAAAAmaHdCAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4QIFERIkBcGckAAAA2FJREFUOMuNlFtIqmkUhldaXnSYps0QA151YMjAPyEmf/DX0JIug80M1EVz6ES3ETU0SWxKC4O6CbIco4GoIJkhhgmpC0WSopkkJCoCy1Ism8ZOlpWZ71ztf3LbPqy79X3v+3zrWyxWmkajIbvdTiqV6geJRPJ9YWGhRCQSfbG9vf3H5uZmg9vtvqVPiZqamteNjY0IBoN4Hi0tLZDJZK8+5heIxeKskpKS30pLS0kkEiVdms1mqqio+Jdl2c8+CMnKylK2trYSAMrNzU0RTExMpCkUCh8RkUajeRGSXl5ezmZnZ5PL5aJwOEzp6emk1WpJpVLxIqPR+CoQCPw9Pz//tVqtJofDkUypra21NTQ0oLe3l+/F+vo6dDpdUn9CoRBYlrW8WFFfX9/NxcUFZmZm4PF4eNPd3R0GBweTQE6nEwqF4puU/2g0mp8fHx/hcrnQ09ODk5MT3nR5eQmr1crn3d3dWFpaQllZ2VcpoLq6uksA6O/vh9FoTHp9ZWUFi4uLOD4+htPpBADodLoYEVF1dfX/ELlcLh4bGwMAjI6OYnJyMgk0NTWF8fHxpLO2trallGpYlv3u4OAAt7e30Ov1MJvNvMHr9aKjowNPT0/8md/vB8Mwb5735e3kuu7v77G/vw+TyYTd3V0EAgHMzs4CAPR6fVI1NpstJpVKM1IqMhgMVwCwtraGgYEBWCwW3pRIJDA8PMzn4XAYHMf9kgRQq9Ukk8nUVqsVkUgE9fX16OzsxLths9kAAPF4HBzHXQufQw4PDykUCh1eXV3FiKjKYDDQxsYG+f1+YhiG10WjUdrb26OCggKam5sTCF6YG1peXh7yer1hIqL29nY6PT2l6elpXsMwDAWDQSIiKioqShe+C/H5fEREiMViFrFY/JNEIqGcnBxyu92Ul5dH+fn5REQUiURIJBLR6urqh/eEVCp9fXR0xA/d0NAQotEo35uRkREolcqY4H2Aqqoq2tra+r2pqenPRCJBHMfRw8MDdXV18Zrz83MSCAR/Cd8H8fl8pFaryW63zwmFwh8rKys/5ziOHA4HnZ2dEcMw5PV6aWdnp/6jq1OpVFJxcXHR27GPx+MwmUxYWFhAc3NziIgojT4xtFrtt3K5fCAjI+NLj8cjvLm5+fX6+vpNZmbmP/8BN8ZmaONW+JwAAAAASUVORK5CYII='),auto");

			eraseron = "on";

			$(".tags > div").draggable( 'disable' );
			$("#eraser img").addClass('activated');
			$("#eraseron").addClass("on");

		} else {

			eraseron = "off";

			$(".tags > div").css('cursor','pointer')
			$(".tags > div").draggable( 'enable' );
			$("#eraser img").removeClass('activated');
			$("#eraseron").removeClass("on");

		}

	});


	// icono refresco
	$("#dirviewrefresh").on('click', function() {

		previousornext = "refresh";
		readDirectory (dirtoexec);

	});


	filetreeinteractions();

	// Tips
	tip = [
		"<b>Tip</b>: To enter in a folder press and hold mouse button over the folder's name until it enters.",
		"<b>Tip</b>: Images can be launched in two ways: Pressing and holding mouse button in the name of the image will launch it in the system's default viewer, otherwise, clicking in the image will launch the internal viewer of this program.",
		"<b>Tip</b>: If is the first time you launch Tagstoo, will have been loaded demo labels at bottom, you can modify or delete them or add new at your convenience, to no more load demo tags when new database created uncheck the checkbox in the options menu.",
		"<b>Tip</b>: Doubleclick on a folder in the left to get selected, then when you press paste button the folders and files that you selected in the right will be copied or moved to this folder depending what you selected in the copy/cut switch.",
		"<b>Tip</b>: You can select various elements at one time by pressing shift while selecting.",
		"<b>Tip</b>: Width of the tree view (on the left) and directory view (on the right) are adjustable, columns on the right on Viewmode 1 are also adjustable.",
		"<b>Tip</b>: In the Search you can add all input fields as you need so you can construct easily searches like “<em>Search files that have (tag1 + tag2 + tag7 + tag8) or (tag1 + tag2 + tag6 + tag9) or (tag4 + tag6 + tag9) but dont have (tag10) and (tag11).</em>”",
		"<b>Tip</b>: If your tag name is long choose a tag shape that have sharp corners for better fit it.",
		"<b>Tip</b>: Sometimes dependig the action you do (or if you move somethin using external program) the view can not be actialized, to actualize it simply press refresh icons (arrows in circle).",
		"<b>Tip</b>: Because there're versions of Tagstoo for various systems (Windows, Linux and macOS) you can manage the same data, in a external drive for example, from different systems alternatively: Export the data to a file and import it where you need and you are ready."

	]

	window.tipquest = "<br><br><input type='checkbox' id='mostrartips' onclick='mostrartips()'><span>Don't show more Tips at launch.</span><div id='nexttip'><a class='buttontip' onclick='shownexttip()'>Next Tip <span style='font-weight:normal'>&#x21D2</span></a></div>"; // las funciones mostrartips() y shownexttip() están definidas en popups.js (al final) la de mostrartips() además tambien esta definida abajo

	//tips localstorage?
	if (!localStorage["mostrartips"]){
		mostrartips = "yes";
		localStorage["mostrartips"] = "yes"
	} else {
		mostrartips = localStorage["mostrartips"];
	}

	if (mostrartips == "yes"){

		//tip mostrarnumero?
		if (!localStorage["mostrartipnumero"]) {
			mostrartipnumero = 0;
		}
		else {
			mostrartipnumero = localStorage["mostrartipnumero"]
		}

		if (mostrartipnumero == 10) {//el tip final (tambien definido en popups.js al final)
			mostrartipnumero = 0

		}

		// tip mensaje
		alertify.alerttip(tip[mostrartipnumero]+tipquest)
		mostrartipnumero++

		localStorage["mostrartipnumero"]=mostrartipnumero

	}
	// esta función también esta definida en popups.js al final (porque sino no funciona en todas las ocasiones)
	function mostrartips() {
	 	if ($('#mostrartips').prop('checked')){
	    	localStorage["mostrartips"] = "no"

		} else {
		    localStorage["mostrartips"] = "yes"
		}

	}



}); //--fin onload


function iniciarfolderview() { // ejecuta readidrectory() tras inicializar la base de datos

	window.availabletagforms = ["tag_notification", "tag_funny-cow", "tag_parallelogram", "tag_bird-feather", "tag_apple1", "tag_zepeling", "tag_classicframe1", "tag_maletin", "tag_piggy-bank", "tag_piggybank", "tag_cloud310", "tag_cloud", "tag_circle", "tag_cylinder", "tag_square-18", "tag_briefcase", "tag_fruit", "tag_tag-icon", "tag_decagon", "tag_octagon", "tag_blacksheep", "tag_apple2", "tag_calendar", "tag_gear", "tag_cindrella", "tag_flower"];

	// tags demostración
	tagData = [
		{ tagtext: "Demo1", tagpos: 0, tagcolor: "66B032", tagform: "tag_fruit" },
		{ tagtext: "DemoTag2", tagpos: 1, tagcolor: "3D01A4", tagform: "tag_classicframe1" },
		{ tagtext: "DemoTag3", tagpos: 2, tagcolor: "0391CE", tagform: "tag_cylinder" },
		{ tagtext: "Demo4", tagpos: 3, tagcolor: "FE2914", tagform: "tag_piggybank" },
		{ tagtext: "DemoTag5", tagpos: 4, tagcolor: "FD5308", tagform: "tag_maletin" }
	];


	window.db = [];
	var request = window.indexedDB.open(currentlydatabaseused, 1);
	request.onerror = function(event) {
		// console.log("error: database not loaded");
	};

	request.onsuccess = function(event) {
		db = request.result;

		window.driveunit = localStorage["selecteddriveunit"];
		window.driveunit = window.driveunit.trim();

		if (!localStorage["previewimgonviewmode1"]) {
			window.previewimgonviewmode1 = "no";
		} else {
			window.previewimgonviewmode1 = localStorage["previewimgonviewmode1"];
		}
		if (!localStorage["previewepubonviewmode1"]) {
			window.previewepubonviewmode1 = "no";
		} else {
			window.previewepubonviewmode1 = localStorage["previewepubonviewmode1"];
		}

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



		window.rootdirectory = "\/";
		window.dirtoexec="";

		previousornext = "normal";
		readDirectory(driveunit + rootdirectory);

		drawfootertags();

		loadfavfoldersselect();

		// otras variables globales
		window.taganadir="";
		window.folder="";
		ffoldertoaddtags = "";

		// carga el visor del arbol
		$('#filetree').fileTree();

		// cuando esta seleccionado no color tagstoo se pone gris
		window.colortagstoo = localStorage["colortagstoo"];

		if (window.colortagstoo == "not") {

		    var ls = document.createElement('link');
		    ls.rel="stylesheet";
		    ls.href= "css/version_grey.css";
		    document.getElementsByTagName('head')[0].appendChild(ls);

		}

	};

	// en caso de que la base de datos no exista se le mete estructura inicial y se añade la bd a la lista de bds
	request.onupgradeneeded = function(event) {

		var objectStore;
		var db = event.target.result;

		objectStore = db.createObjectStore("tags", { keyPath: "tagid", autoIncrement:true });
		objectStore.createIndex("tagtext", "tagtext", { unique: false });
		objectStore.createIndex("tagpos", "tagpos", { unique: false });
		objectStore.createIndex("tagcolor", "tagcolor", { unique: false });
		objectStore.createIndex("tagform", "tagform", { unique: false });
		if(localStorage["demotags"]=="no") {
			window.demotags = localStorage["demotags"];
		} else {
			window.demotags = "yes";
		}
		if (demotags == "yes") {
			for (var i in tagData) {
				objectStore.add(tagData[i]);
			}
		}

		objectStore = db.createObjectStore("folders", { keyPath: "folderid", autoIncrement:true });
		objectStore.createIndex("folder", "folder", { unique: true });
		objectStore.createIndex("foldertags", "foldertags", { unique: false, multiEntry: true });

		objectStore = db.createObjectStore("files", { keyPath: "fileid", autoIncrement:true });
		objectStore.createIndex("filefolder", "filefolder", { unique: false });
		objectStore.createIndex("filename", "filename", { unique: false });
		objectStore.createIndex("fileext", "fileext", { unique: false });
		objectStore.createIndex("filetags", "filetags", { unique: false });

		objectStore = db.createObjectStore("favfolds", { keyPath: "favfoldid", autoIncrement:true });
		objectStore.createIndex("favfoldname", "favfoldname", { unique: true });


		//se añade la bd al listado de bd existentes
		var requestdbnames = window.indexedDB.open("tagstoo_databaselist_1100", 1);
	    requestdbnames.onerror = function(event) {
	      // console.log("error: database not loaded");
	    };

	    requestdbnames.onsuccess = function(event){

	    	var databaselistdb = requestdbnames.result;
			var requestdbadd = databaselistdb.transaction(["databases"], "readwrite")
							.objectStore("databases")
							.add({ dbname: currentlydatabaseused });

			requestdbadd.onsuccess = function(event) { };
			requestdbadd.onerror = function(event) { };

	    }

	};

}; //--fin iniciarfolderview()


// teclas accesos directos
function KeyPress(e) {

	if (!$("#popupbackground").hasClass("display") && !$("span").hasClass("editing")) { // para evitar teclas rapidas (especialmente supr) cuando hay un popup o se está editando

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

// conmutador copy/paste
// window.parent.$(".onoffswitch-inner, .onoffswitch-switch").bind('click', function() {

// 	console.log(pasteaction)

// 	if(pasteaction == "copy") {

// 		pasteaction = "cut";
// 		window.parent.$(".onoffswitch-checkbox").addClass("check");
// 		window.parent.$(".onoffswitch-switch").css("background-color","#d5695d"); //red

// 	} else if (pasteaction == "cut") {

// 		pasteaction = "copy";
// 		window.parent.$(".onoffswitch-checkbox").removeClass("check");
// 		window.parent.$(".onoffswitch-switch").css("background-color","#439bd6"); //blue

// 	}

// });



// Botones localización anterior/siguiente y añadir a favoritos
function previouslocation() {
	var previouslocation = arraylocations[arraylocationposition-1];
	if (previouslocation) {
		previousornext = "previous";
		readDirectory(previouslocation);
	}

}

function nextlocation() {
	var nextlocation = arraylocations[arraylocationposition+1];
	if (nextlocation) {
		previousornext = "next";
		readDirectory(nextlocation);
	}
}

function locationtofav() {

	if (rootdirectory == "") {
		rootdirectory = "\/"
	}

	// se comprueba si la carpeta ya esta añadida en los accesos rápidos
	var previouslyfav = "no";

	var trans = db.transaction(["favfolds"], "readonly")
	var objectStore = trans.objectStore("favfolds")
	var req = objectStore.openCursor();

	req.onerror = function(event) {

		console.log("error: " + event);
	};

	req.onsuccess = function(event) {

		var cursor = event.target.result;

		if(cursor){

			if(cursor.value.favfoldname == rootdirectory){

				previouslyfav = "yes";

			}

		cursor.continue();
		}

	}

	trans.oncomplete = function(event) {

		var favfoldupdate = {};

		if (previouslyfav == "no") {

			$("#favfolders", top.document).addClass("animateonce");

			setTimeout(function myFunction() {
				$("#favfolders", top.document).removeClass("animateonce");
			}, 400)

			// metemos la carpeta en la base de datos de favoritos
			favfoldupdate.favfoldname = rootdirectory;

			var trans = db.transaction(["favfolds"], "readwrite")
			var request = trans.objectStore("favfolds")
				.put(favfoldupdate);

			request.onerror = function(event) {

				console.log("error carpeta no añadida a favoritos : " + event);
			};

			request.onsuccess = function(event) {

				// console.log("carpeta añadida a favoritos");
				loadfavfoldersselect();

			}

		} else {

			console.log("la carpeta ya estaba metida en favoritos");

		}
	}
}

function loadfavfoldersselect() {

	window.parent.$("#favfolders").find('option').remove().end(); //con esto se vacian las opciones del select para volver a llenarlo con las lineas de abajo

	var trans = db.transaction(["favfolds"], "readonly")
	var objectStore = trans.objectStore("favfolds")
	objectStore.openCursor().onsuccess = function(event) {

		var cursor = event.target.result;
		if (cursor) {

			var opt = window.parent.document.getElementById("favfolders");
			var option = window.parent.document.createElement("option");
			option.value = cursor.value.favfoldname;
			var optionText = window.parent.document.createTextNode(driveunit + cursor.value.favfoldname);
			option.appendChild(optionText);
			opt.appendChild(option);
			opt.selectedIndex = -1; // para que ninguna este por defecto seleccionada
			cursor.continue();
		}
		else { /* alert("No more entries!"); */	};
	}

}

window.parent.$("#gotofolderselect").on('click', function() {

	var foldertogo = window.parent.$("#favfolders option:selected").html(); // recogemos el valor del texto de option seleccionado

	if (foldertogo != undefined) {

		previousornext = "normal";
		readDirectory(foldertogo);
	}
	else {
		alertify.alert("Select a folder from Fast access list to go.")
	}

});

window.parent.$("#removefolderselect").on('click', function() {

	if (window.parent.$("#favfolders option:selected")["0"] != undefined) {

		var folderidtoremove = ""
		var foldertoremove = window.parent.$("#favfolders option:selected")["0"].value; // recogemos el nombre de la carpeta a borrar

		// primero se consigue la id de la carpeta favorita a borrar
		var trans = db.transaction(["favfolds"], "readonly")
		var objectStore = trans.objectStore("favfolds")
		var req = objectStore.openCursor();

		req.onerror = function(event) {

			console.log("error: " + event);
		};

		req.onsuccess = function(event) {

			var cursor = event.target.result;

			if(cursor){

				if(cursor.value.favfoldname == foldertoremove){

					folderidtoremove = cursor.value.favfoldid;

				}

				cursor.continue();
			}

		}

		trans.oncomplete = function(event) {

			// se elimina la carpeta de la bd
			var trans = db.transaction(["favfolds"], "readwrite")
			var request = trans.objectStore("favfolds").delete(folderidtoremove);

			request.onerror = function(event) {

				console.log("error - no se ha eliminado carpeta de bd:" + event);

			};
			request.onsuccess = function(event) {

				// console.log("carpeta favorita borrada de la bd");
				loadfavfoldersselect();

				$("#favfolders", top.document).addClass("animateonce2");
				setTimeout(function myFunction() {
					$("#favfolders", top.document).removeClass("animateonce2");
				}, 400)

			}

		}

	}
	else {
		alertify.alert("Select a folder from Fast access list to remove.")
	}

});


// Select Viewmode
window.parent.$("#viewmode").on('change', function() {

	viewmode = $(this)["0"].value;
	window.parent.$("#viewmodenumber").html(viewmode + " ...");
	previousornext = "refresh";
	readDirectory(dirtoexec);

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

	} //fin if viewmode==1

	if (viewmode!=1){


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


	} // --fin if viewmode!=1


});


// Select Order
window.parent.$("#order").on('change', function() {

	order = $(this)["0"].value;
	previousornext = "refresh";
	readDirectory(dirtoexec);

})


// Delete
window.parent.$("#delete").on('click', function() {

	if (window.parent.$("li.current").attr('data-tab') == "tab-2") { // salir de la función si esta seleccionado el search
		return;

	}

	if ($(".ui-selecting").length > 0) {

		var todeleteelements = $(".ui-selecting");

	}
	else if ($(".ui-selected").length > 0) {

		var todeleteelements = $(".ui-selected");
	}

	if (!todeleteelements) {

		alertify.alert("No elements selected to delete.")
	}
	else {

		var todeletefolders = [];
		var todeletearchives = [];
		var idcarpetamadre = "";
		var tagscarpetamadre = "";

		var arraydecarpetas = {};
		var posicion = 0;

		$.each (todeleteelements, function(t){

			if (todeleteelements[t].classList.contains("folder")) {

				todeletefolders.push(todeleteelements[t]);

			}

			else if (todeleteelements[t].classList.contains("archive")) {

				todeletearchives.push(todeleteelements[t]);

			}

		})

		var r=false;

		if (todeletearchives.length > 0 && todeletefolders.length > 0) {

			alertify.confirm(todeletearchives.length + " files and " + todeletefolders.length + " folders (and all it´s contents) are selected to delete. There is no undo for delete. Are you sure?", function (e) {
				if (e) {
					$("#folderreadstatus").html("Deleting ...");
					$('.exploelement, .exploelementfolderup').css("filter","opacity(46%)");
					setTimeout(function() { //porque sino no escribe el "Deleting ..."
						deleteit()
					}, 50);
			}});
		}
		else if (todeletearchives.length > 0 && todeletefolders.length == 0) {

			alertify.confirm( todeletearchives.length + " files are selected to delete. There is no undo for delete. Are you sure?", function (e) {
				if (e) {
					$("#folderreadstatus").html("Deleting ...");
					$('.exploelement, .exploelementfolderup').css("filter","opacity(46%)");
					setTimeout(function() { //porque sino no escribe el "Deleting ..."
						deleteit()
					}, 50);
			}});

		}
		else if (todeletearchives.length == 0 && todeletefolders.length > 0) {

			alertify.confirm(todeletefolders.length + " folders (and all it´s contents) are selected to delete. There is no undo for delete. Are you sure?", function (e) {
				if (e) {
					$("#folderreadstatus").html("Deleting ...");
					$('.exploelement, .exploelementfolderup').css("filter","opacity(46%)");
					setTimeout(function() { //porque sino no escribe el "Deleting ..."
						deleteit()
					}, 50);
			}});

		}


  		function deleteit(){

			var previousnumberofelements = 0
			var numberofelementtodelete = 0;
			var numberofelements = "";

			$.each($('.exploelement'), function(u) {
				previousnumberofelements++
			})

			$.each($('.ui-selecting'), function(u) {
				numberofelementtodelete++
			})

			$.each($('.ui-selected'), function(u) {
				numberofelementtodelete++
			})

			numberofelements = previousnumberofelements - numberofelementtodelete;


  			$("#undo", window.parent.document).attr("data-tooltip", "UNDO (not undo action)");
				undo.class = "";

    		// antes de empezar a borrar nada hay que recorrer las subcarpetas recursivamente para tener un listado de ellas y poder borrarlas de la bd

    		if (todeletefolders.length > 0) {

				$.each(todeletefolders, function(t) {

					foldertoread = rootdirectory + todeletefolders[t].children[1].attributes[1].value; // recogemos el value de cada carpeta

					recursivefolderdata(foldertoread);

					function recursivefolderdata(foldertoread) {

						var directoryelement = []
						var directorycontent = []
						var directoryfolders = []
						var directoryarchives = []

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

						$.each(directoryfolders, function(t){

							arraydecarpetas[posicion] = foldertoread + directoryfolders[t].name;
							posicion++
							recursivefolderdata(foldertoread + directoryfolders[t].name);

						});

					}

				});

    		}

    		$.each($('.ui-selected'), function(u) {

				// para poder eliminar los videos hay que quitarlos del DOM (es decir de la memoria)
				try {
					if (viewmode == 1) {

						if ($('.ui-selected:eq('+u+')')["0"].childNodes["0"].childNodes[0].nodeName == "VIDEO") {//para viewmode = 1

							var videoElement = $('.ui-selected:eq('+u+')')["0"].childNodes["0"].childNodes[0];
							videoElement.pause();
							videoElement.currentSrc =""; // empty source
							videoElement.src="";
							videoElement.load();
							var parenteee = videoElement.parentNode
							parenteee.removeChild(parenteee.childNodes[0])
							// parenteee.removeChild(parenteee.childNodes[0])
							// parenteee.removeChild(parenteee.childNodes[0])

						}
					}
					else {
						if ($('.ui-selected:eq('+u+')')["0"].childNodes["0"].childNodes[1].nodeName == "VIDEO") { //para viewmodes != 1

							var videoElement = $('.ui-selected:eq('+u+')')["0"].childNodes["0"].childNodes[1];
							$('.ui-selected:eq('+u+')').children().children('video').attr('src','')
							videoElement.pause();
							videoElement.currentSrc =""; // empty source
							videoElement.src="";
							videoElement.load();
							var parenteee = videoElement.parentNode
							parenteee.removeChild(parenteee.childNodes[0])
							// parenteee.removeChild(parenteee.childNodes[0])
							// parenteee.removeChild(parenteee.childNodes[0])

						}
					}
				} catch (err) {console.log(err)}
				$('.ui-selected:eq('+u+')')[0].style.display = "none";

			});

			$.each($('.ui-selecting'), function(u) {

				// para poder eliminar los videos hay que quitarlos del DOM (es decir de la memoria)
				try {
					if (viewmode == 1) {
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
					else {
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
				} catch (err) {console.log(err)}
				$('.ui-selecting:eq('+u+')')[0].style.display = "none";

			});

    		// se borran los archivos
    		$.each(todeletearchives, function(d) {

				try {

					fs.unlinkSync(driveunit + rootdirectory + todeletearchives[d].children[1].attributes[1].value);

				} catch (err) {
					console.log("error file not deleted")
					// console.log(err)

				}

			});


			// se borran las carpetas
			$.each(todeletefolders, function(d) {

				try {
				fs.removeSync(driveunit + rootdirectory + todeletefolders[d].children[1].attributes[1].value);
				} catch (err) {
					alertify.alert("Folder <em>'" + driveunit + rootdirectory + todeletefolders[d].children[1].attributes[1].value +  "'</em> not possible to delete because probably some file is in use.")
				}

			});

			// se borran los archivos de primer nivel de la base de datos (si están)

			// primero miramos si la carpeta madre esta en la bd
			var trans = db.transaction(["folders"], "readonly")
			var objectStore = trans.objectStore("folders")
			var req = objectStore.openCursor();

			req.onerror = function(event) {

				console.log("error: " + event);
			};

			req.onsuccess = function(event) {

				var cursor = event.target.result;

				if(cursor){

					if(cursor.value.folder == rootdirectory){

						idcarpetamadre = cursor.value.folderid
						tagscarpetamadre = cursor.value.foldertags // viene bien para saber luego si se puede borrar o no la carpeta madre de la bd
					}

					cursor.continue()

				}

			}

			trans.oncomplete = function(event) {

				if(idcarpetamadre != "") { // si la carpeta madre estaba en la base de datos, se buscan los archivos, si no, no se hace nada

					var trans = db.transaction(["files"], "readwrite")
					var objectStore = trans.objectStore("files")
					var req = objectStore.openCursor();

					req.onerror = function(event) {

						console.log(event);
					};

					req.onsuccess = function(event) {

						var cursor = event.target.result;

						if(cursor){

							$.each(todeletearchives, function(n){

								if(cursor.value.filefolder == idcarpetamadre) {

									if(cursor.value.filename == todeletearchives[n].children[1].attributes[1].value) {

										var req2 = cursor.delete();

									    req2.onerror = function(event) {

											console.log(event);
										};

										req2.onsuccess = function(event) {

											// console.log("file deleted from db")

										}

									}

								}

							});

							cursor.continue();

						}

					}

					trans.oncomplete = function(event) {

						// hay que comprobar si la carpeta madre se queda vacía de elementos en db y no tiene tags
						if (tagscarpetamadre == "") { // si no tiene tags, si tiene se la dejara

							var hayarchivosenlabd = "no";

							var trans = db.transaction(["files"], "readwrite")
							var objectStore = trans.objectStore("files")
							var req = objectStore.openCursor();

							req.onerror = function(event) {

								console.log(event);
							};

							req.onsuccess = function(event) {

								var cursor = event.target.result;

								if(cursor){

									if(cursor.value.filefolder == idcarpetamadre) {

										hayarchivosenlabd = "si";

									}

									cursor.continue();

								}

							}

							trans.oncomplete = function(event) {

								if (hayarchivosenlabd == "no") { // se borrará la carpeta madre de la bd

									var trans9 = db.transaction(["folders"], "readwrite")
									var request9 = trans9.objectStore("folders").delete(idcarpetamadre);

								}

							}

						}

					}

				}

			}

			// se borran las carpetas de primer nivel de la bd si estuvieran, y se eliminan los archivos asociados a ellas
			$.each(todeletefolders, function(d) {

				var trans = db.transaction(["folders"], "readwrite")
				var objectStore = trans.objectStore("folders")

				var idfoldertodelete = "";

				var req = objectStore.openCursor();

				req.onerror = function(event) {

					console.log(event);
				};

				req.onsuccess = function(event) {

					var cursor = event.target.result;

					if(cursor){

						if(cursor.value.folder == rootdirectory + todeletefolders[d].children[1].attributes[1].value) {

							idfoldertodelete = cursor.value.folderid;

							var req2 = cursor.delete(); // eliminamos la carpeta de la bd

						    req2.onerror = function(event) {

								console.log(event);
							};

							req2.onsuccess = function(event) {

								// console.log("file deleted from db")

							}

						}

						cursor.continue();

					}

				}

				trans.oncomplete = function(event) {

					// si la carpeta estaba en la bd
					if (idfoldertodelete != "") {

						// se eliminan archivos asociados a la carpeta si los hubiera
						var trans2 = db.transaction(["files"], "readwrite")
						var objectStore2 = trans2.objectStore("files")
						var req2 = objectStore2.openCursor();

						req2.onerror = function(event) {

							console.log(event);
						};

						req2.onsuccess = function(event) {

							var cursor2 = event.target.result;

							if(cursor2){

								if(cursor2.value.filefolder == idfoldertodelete) {

									var req3 = cursor2.delete(); // eliminamos el archivo de la bd

								    req3.onerror = function(event) {

										console.log(event);
									};

									req3.onsuccess = function(event) {

										// console.log("file deleted from db")

									}

								}

								cursor2.continue()

							}

						}

					}

				}

			});


			// se borran las subcarpetas de la bd si estuvieran, y se eliminn los archivos asociados a ellas

			$.each(arraydecarpetas, function(d) {

				var trans = db.transaction(["folders"], "readwrite")
				var objectStore = trans.objectStore("folders")

				var idfoldertodelete = "";

				var req = objectStore.openCursor();

				req.onerror = function(event) {

					console.log(event);
				};

				req.onsuccess = function(event) {

					var cursor = event.target.result;

					if(cursor){

						if(cursor.value.folder == arraydecarpetas[d]) {

							idfoldertodelete = cursor.value.folderid;

							var req2 = cursor.delete(); // eliminamos la carpeta de la bd

						    req2.onerror = function(event) {

								console.log(event);
							};

							req2.onsuccess = function(event) {

								// console.log("file deleted from db")

							}

						}

						cursor.continue();

					}

				}

				trans.oncomplete = function(event) {

					// si la carpeta estaba en la bd
					if (idfoldertodelete != "") {

						// se eliminan archivos asociados a la carpeta si los hubiera
						var trans2 = db.transaction(["files"], "readwrite")
						var objectStore2 = trans2.objectStore("files")
						var req2 = objectStore2.openCursor();

						req2.onerror = function(event) {

							console.log(event);
						};

						req2.onsuccess = function(event) {

							var cursor2 = event.target.result;

							if(cursor2){

								if(cursor2.value.filefolder == idfoldertodelete) {

									var req3 = cursor2.delete(); // eliminamos el archivo de la bd

								    req3.onerror = function(event) {

										console.log(event);
									};

									req3.onsuccess = function(event) {

										// console.log("file deleted from db")

									}

								}

								cursor2.continue()

							}

						}

					}

				}

			});


			// refrescamos

			if (todeletearchives.length > 0 || todeletefolders.length > 0) {
				if(todeletefolders.length > 0) {

					timetowait = todeletefolders.length * 30;
					setTimeout(function() {
						$.each ($("#filetree span"), function(l) {

							if($("#filetree span:eq("+l+")").attr("rel2") == rootdirectory) {

								// contraer y expandir
								$("#filetree span:eq("+l+")").trigger( "click" );
								$("#filetree span:eq("+l+")").trigger( "click" );

							}

						});

					}, timetowait);


					var timetowaitf = 300 + todeletearchives.length + todeletefolders.length * 30
					setTimeout(function() {
						previousornext = "refresh"; // para refrescar sin añadir al array de los direcciones visitadas
						readDirectory(dirtoexec);

					}, timetowaitf);


				} else { // si no habia carpetas

					var timetowaitf = 300 + todeletearchives.length * 30
					setTimeout(function() {
						previousornext = "refresh"; // para refrescar sin añadir al array de los direcciones visitadas
						readDirectory(dirtoexec);

					}, timetowaitf);

				}
			}


		} //--fin se ha pulsado ok en el confirm

	} //--fin se han seleccionado archivos o carpetas

}); //-- fin delete



// acceso al popup opciones
window.parent.$('#options').on('click', function() {

    popup('options');

})

//acceso al popup info
window.parent.$('#info').on('click', function() {

    popup('info');

})



function readDirectory (dirtoread) {

	$("#folderreadstatus").html("Reading folder ...");
	$('.exploelement, .exploelementfolderup').css("filter","opacity(46%)");
	$("#location").html(dirtoread);
	$("#location").css("word-break","break-word")

	// retrasamos un poco el resto de la función para que le de tiempo a escribir "Reading Folder", etc ...
	setTimeout(function(){

		// tag eraser off
		eraseron = "off";
		$(".tags > div").css('cursor','pointer')
		$("#eraser img").removeClass('activated');
		$("#eraseron").removeClass("on");

		try {

			var readedElements = fs.readdirSync(dirtoread);
			window.t="";

			window.rootdirectory = dirtoread.replace(driveunit,''); //quitamos la letra de la unidad (entre otras cosas sirve para meter datos en la base de datos).

			if (rootdirectory=="\/") {
				rootdirectory="";
			}

			rootdirectory =  rootdirectory.slice(0);

			window.dirtoexec = dirtoread;

			var dirtoreadcheck = "";
			var folderidtosearch = "";
			var directoryelement = [];

			var directorycontent = []; // en esta variable se meten archivos y directorios
			window.directoryarchives = []; // en esta variable se meten los archivos
			window.directoryfolders = []; // en esta variable se meten los directorios

			switch(previousornext){

			    case "normal":

			        if (arraylocationposition < arraylocations.length -1) {
						// borrar todas las entradas a partir de la posición
						arraylocations.length = arraylocationposition + 1;
					}
					arraylocations.push(dirtoread);
					arraylocationposition = arraylocations.length -1;
					break;

			    case "previous":

			        arraylocationposition = arraylocationposition - 1;
			        break;

			    case "next":

			        arraylocationposition = arraylocationposition + 1;
			        break;

			    case "refresh":

			        break;

			    case "refreshundo":

			        arraylocations.length = arraylocationposition;
					arraylocations.push(dirtoread);
					break;

			}

			var notdeletedvideoerror = "no";
			var re = /(?:\.([^.]+))?$/; // expresión regular para detectar si un string tiene extensión
			var iteratentimes = readedElements.length;
			for (i = 0; i < iteratentimes; i++) {

				var ext = re.exec(readedElements[i])[1];
				if (!ext) {
					ext="&nbsp;";
				}

				statsofelement();

				function statsofelement() {

					try {

						var stats = fs.statSync(dirtoread + "\/" + readedElements[i])

						// obtener tamaño
						var fileSize = stats["size"]

							directoryelement.size = fileSize; //para poder ordenar por tamaño

						if (fileSize <= 1024) {
							directoryelement.sizeterm = "B";
							directoryelement.sizetodraw = fileSize;

						}
						if (fileSize > 1024) {
							directoryelement.sizeterm = "Kb";
							directoryelement.sizetodraw = fileSize/1000.0;
							directoryelement.sizetodraw = directoryelement.sizetodraw.toFixed(2);

						}
						if (fileSize > 1048576) {
							directoryelement.sizeterm = "Mb";
							directoryelement.sizetodraw = fileSize/1000000.0;
							directoryelement.sizetodraw = directoryelement.sizetodraw.toFixed(2);
						}
						if (fileSize == 0) {
							directoryelement.sizeterm = "B";
							directoryelement.sizetodraw = "0";
						}
						if (fileSize == undefined) {
							directoryelement.sizeterm = "&nbsp;";
							directoryelement.sizetodraw = "&nbsp;";

						}

						// obtener última modificación
						var lastmodified = stats["mtime"];
						var lastm_day = lastmodified.getDay()+1;
						var lastm_month = lastmodified.getMonth()+1;
						var lastm_year = lastmodified.getYear()-100+2000;

						var lastm_Hour = lastmodified.getHours()
						var lastm_Minutes = lastmodified.getMinutes()
						var lastm_Seconds = lastmodified.getSeconds()

						directoryelement.lastmod = lastmodified;
						directoryelement.lastmodtoshow = lastm_day + "-" + lastm_month + "-" + lastm_year + " " + lastm_Hour + ":" + lastm_Minutes + ":" + lastm_Seconds;

					}
					catch(err) {

						console.log('An unaccesible file');
						// console.log(err)
						var lastfour = readedElements[i].substr(readedElements[i].length - 4);
						if(lastfour == ".mp4" || lastfour=="m4v" || lastfour=="webm" || lastfour==".ogv" ) {

							notdeletedvideoerror="yes"
						}

						readedElements.splice(i, 1);
						iteratentimes --;

					}

				}


				// comprobar si es carpeta o archivo
				var dirtoreadcheck = dirtoread + "\/" + readedElements[i];

				try {
					var arorfo = "i_am_an_archive";
					var arorfo = fs.readdirSync(dirtoreadcheck);
				}
				catch(exception) {};

				directoryelement.name = "\/" + readedElements[i]
				directoryelement.ext = ext;
				directoryelement.arorfo = arorfo;
				directoryelement.id = ""; // se lo metemos después de separar carpetas y archivos (y estará oculto en la vista, de hecho no se utiliza pero se deja por si acaso en un futuro viene bien)
				directoryelement.tagsid = []; // se lo metemos después de separar carpetas y archivos

				var copied_directoryelement = jQuery.extend({}, directoryelement); // necesario trabajar con una copia para actualizar el objeto directorycontent
				directorycontent[i] = copied_directoryelement;
			};

			if (notdeletedvideoerror=="yes"){
				alertify.alert("Some video in this folder not definitively deleted because they are in use, it will be deleted when application close.")
			}

			if (directorycontent.length == 1) {
				if (directorycontent[0].name == undefined) {
					directorycontent[0] = "";
					delete directorycontent[0];
				}
			}

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



			if (viewmode == 1) {
				folderupiconurl = "/img/icons/folders_16px/Folder_Up.png"
			}
			else if (viewmode != 1) {
				folderupiconurl = "/img/icons/folders_420px/Folder_Up.png"
			}


			// leemos datos carpetas
			if (directoryfolders.length >= 1 && directoryarchives.length >= 1) {

				// se agregan tags (primero de carpetas tras el primer oncomplete añadios de archivos) para la vista (solo array)
				var trans = db.transaction(["folders"], "readonly")
				var objectStore = trans.objectStore("folders")
				$.each(directoryfolders, function(i) {  // para cada una de las carpetas leídas en el disco

					var req = objectStore.openCursor(); // abrimos cursor: "returns an IDBRequest object, and, in a separate thread, returns a new IDBCursorWithValue object. Used for iterating through an object store with a cursor."

					req.onerror = function(event) { // si el cursor da error

						console.log("error: " + event);

					};

					req.onsuccess = function(event) { // si el curso va bien

						var cursor = event.target.result; // posición del cursor
						if(cursor){

							if(directoryfolders[i]) {

								if(cursor.value.folder == rootdirectory + directoryfolders[i].name){ // si el folder de la posición del cursor es igual al rootdirectory (que es una variable que cambia) + el nombre de la carpeta del disco

									directoryfolders[i].tagsid = cursor.value.foldertags; // se inserta el valor del folderags de la posición del cursor en el parámetro tagsid del la carpeta del disco leída
									directoryfolders[i].id = cursor.value.folderid;

								}

							}
							cursor.continue();
						};

					}

					trans.oncomplete = function() {

						// se agregan los tags de archivos para la vista (solo array)
						var trans2 = db.transaction(["folders"], "readonly")
						var objectStore2 = trans2.objectStore("folders")

						$.each(directoryarchives, function(i) {

							var req2 = objectStore2.openCursor();

							req2.onerror = function(event) {

								console.log("error: " + event);

							};

							req2.onsuccess = function(event) {

								var cursor2 = event.target.result;
								if(cursor2){ // vamos recorriendo cada una de las carpetas guardaras

									if (cursor2.value.folder == rootdirectory) {

										folderidtosearch = cursor2.value.folderid;

									}

									cursor2.continue();
								}

							};

							trans2.oncomplete = function(event) {

								var trans3 = db.transaction(["files"], "readonly")
								var objectStore3 = trans3.objectStore("files")
								var req3 = objectStore3.openCursor();

								req3.onerror = function(event) {

									console.log("error: " + event);

								};

								req3.onsuccess = function(event) {

									var cursor3 = event.target.result;
									if(cursor3){

										$.each(directoryarchives, function(i) {

											if (cursor3.value.filefolder == folderidtosearch) {
												if (cursor3.value.filename == directoryarchives[i].name) {
													directoryarchives[i].tagsid = cursor3.value.filetags;
													directoryarchives[i].id = cursor3.value.fileid;
												}
											}

										});
										cursor3.continue();

									}

								};

								trans3.oncomplete = function() {

									$('#directoryview').html("");
									t = '<div class="exploelementfolderup"><div class="foldupimgmode'+viewmode+' folder"><img src='+folderupiconurl+'></div><div class="" value="..">&nbsp;.. <span class="folderup">(folder up)</span></div><div></div><div class="tags" value=""></div> <div class="id"></div></div>';
									$('#directoryview').append(t);

									t = "";

									if (order == "nameasc" || order == "extasc" || order == "sizeasc" || order == "lastdesc") {
										drawDirectoryFolders(viewmode, order)
										drawDirectoryArchives(viewmode, order)
									}
									else if (order == "namedesc" || order == "extdesc" || order == "sizedesc" || order == "lastasc") {
										drawDirectoryArchives(viewmode, order)
										drawDirectoryFolders(viewmode, order)
									}

									drawDirectoryAfter();

								}

							}


						});

					}

				});

			}

			else if (directoryfolders.length >= 1 && directoryarchives.length == 0) {

				// agregramos tags decarpetas para la vista (solo array)
				var trans = db.transaction(["folders"], "readonly")
				var objectStore = trans.objectStore("folders")
				$.each(directoryfolders, function(i) {  // para cada una de las carpetas leidas en el disco

					var req = objectStore.openCursor();

					req.onerror = function(event) {

						console.log("error: " + event);

					};

					req.onsuccess = function(event) {

						var cursor = event.target.result;
						if(cursor){

							if(directoryfolders[i]) {

								if(cursor.value.folder == rootdirectory + directoryfolders[i].name){

									directoryfolders[i].tagsid = cursor.value.foldertags; // se inserta el valor del folderags de la posición del cursor en el parametro tagsid del la carpeta del disco leida
									directoryfolders[i].id = cursor.value.folderid;

								}

							}
							cursor.continue();
						};

					}

					trans.oncomplete = function() {

						$('#directoryview').html("");
						t = '<div class="exploelementfolderup"><div class="foldupimgmode'+viewmode+' folder"><img src='+folderupiconurl+' data-src='+folderupiconurl+'></div><div class="" value="..">&nbsp;.. <span class="folderup">(folder up)</span></div><div></div><div class="tags" value=""></div> <div class="id"></div></div>';
						$('#directoryview').append(t);

						t = "";

						drawDirectoryFolders(viewmode, order);
						drawDirectoryAfter();

					}

				});

			}

			else if (directoryfolders.length == 0 && directoryarchives.length >= 1) {

				// agregramos tags de archivos para la vista (solo array)
				var trans2 = db.transaction(["folders"], "readonly")
				var objectStore2 = trans2.objectStore("folders")

				$.each(directoryarchives, function(i) {

					var req2 = objectStore2.openCursor();

					req2.onerror = function(event) {

						console.log("error: " + event);

					};

					req2.onsuccess = function(event) {

						var cursor2 = event.target.result;
						if(cursor2){ // vamos recorriendo cada una de las carpetas guardaras

							if (cursor2.value.folder == rootdirectory) {
								folderidtosearch = cursor2.value.folderid;

							}

							cursor2.continue();
						}

					};

					trans2.oncomplete = function(event) {

						var trans3 = db.transaction(["files"], "readonly")
						var objectStore3 = trans3.objectStore("files")
						var req3 = objectStore3.openCursor();

						req3.onerror = function(event) {

							console.log("error: " + event);

						};

						req3.onsuccess = function(event) {

							var cursor3 = event.target.result;
							if(cursor3){
								$.each(directoryarchives, function(i) {

									if (cursor3.value.filefolder == folderidtosearch) {
										if (cursor3.value.filename == directoryarchives[i].name) {
											directoryarchives[i].tagsid = cursor3.value.filetags;
											directoryarchives[i].id = cursor3.value.fileid;
										}
									}

								});

								cursor3.continue();
							}

						};

						trans3.oncomplete = function() {

							$('#directoryview').html("");
							t = '<div class="exploelementfolderup"><div class="foldupimgmode'+viewmode+' folder"><img src='+folderupiconurl+'></div><div class="" value="..">&nbsp;.. <span class="folderup">(folder up)</span></div><div></div><div class="tags" value=""></div> <div class="id"></div></div>';
							$('#directoryview').append(t);

							t = "";

							drawDirectoryArchives(viewmode, order);
							drawDirectoryAfter();

						}

					}

				});

			}

			else if (directoryarchives.length == 0 && directoryfolders.length == 0) {

				$('#directoryview').html("");
				var t = '<div class="exploelementfolderup"><div class="imgmode'+viewmode+' folder"><img src='+folderupiconurl+' data-src='+folderupiconurl+'></div><div class="" value="..">&nbsp;.. <span class="folderup">(folder up)</span></div><div></div><div class="tags" value=""></div> <div class="id"></div></div>';
				$('#directoryview').append(t);

				t = "";

				drawDirectoryArchives(viewmode, order);
				drawDirectoryAfter();

			}

		}
		catch (err) {

			$("#folderreadstatus").html("Can't access selected folder.");

			switch(previousornext){

			    case "normal":

			        if (arraylocationposition < arraylocations.length -1) {
						// borrar todas las entradas a partir de la posición
						arraylocations.length = arraylocationposition + 1;
					}
					arraylocations.push(dirtoread);
					arraylocationposition = arraylocations.length -1;
					break;

			    case "previous":

			        arraylocationposition = arraylocationposition - 1;
			        break;

			    case "next":

			        arraylocationposition = arraylocationposition + 1;
			        break;

			    case "refresh":

			        break;

			    case "refreshundo":

			        arraylocations.length = arraylocationposition;
					arraylocations.push(dirtoread);
					break;

			}

		}


	}, 25);

}; //--- fin readdirectory


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


function drawDirectoryFolders (viewmode, order) {

	switch(order){
		case "nameasc":
			directoryfolders.sort(SortByNameAsc);
			break;
		case "namedesc":
			directoryfolders.sort(SortByNameDesc);
			break;
		case "extasc":
			directoryfolders.sort(SortByNameAsc);
			break;
		case "extdesc":
			directoryfolders.sort(SortByNameDesc);
			break;
		case "sizeasc":
			directoryfolders.sort(SortByElemAsc);
			break;
		case "sizedesc":
			directoryfolders.sort(SortByElemDesc);
			break;
		case "lastasc":
			directoryfolders.sort(SortByLastmodAsc);
			break;
		case "lastdesc":
			directoryfolders.sort(SortByLastmodDesc);
			break;
	}

	if (viewmode==1) {


		$.each(directoryfolders, function(i, v) {

			var nameSinBarra = v.name.substring(1);

			var folderelements = Object.size(this.arorfo); // el tamaño del objeto arorfo que contiene el número de subelementos en una carpeta

			t += '<div class="exploelement folder"><div class="imgmode1 folder"></div><div class="explofolder" value="' + v.name + '"><span class="exploname">' + nameSinBarra + '</span></div><div class="folderelements"> ' + folderelements + ' in folder</div><div class="explosize"><span class="placehold">File Size</span></div><div class="tags" value="' + v.tagsid + '">' + v.tagsid + '<span class="placehold">(Tags Here)</span>&nbsp;</div><div class="lastmod">' + v.lastmodtoshow + '</div><div class="duration"><span class="placehold">Media Length</span>&nbsp;</div></div><br>';
			// los tag se separan y presentan en divs aparte en la función drawdirectoryviewtags()

		});

	} // --fin viewmode1


	if (viewmode!=1) {

		$.each(directoryfolders, function(i, v) {

			var nameSinBarra = v.name.substring(1);

			var folderelements = Object.size(this.arorfo); //el tamaño del objeto arorfo que contiene el numero de subelementos en una carpeta

			t += '<div class="exploelement folder"><div class="imgmode'+viewmode+' folder">&nbsp;</div><div class="explofolder" value="' + v.name + '"><span class="exploname">' + nameSinBarra + '</span></div><div class="folderelements"> ' + folderelements + ' in folder</div><div class="explosize"><span class="placehold">File Size</span></div><div class="tags" value="' + v.tagsid + '">' + v.tagsid + '<span class="placehold">(Tags Here)</span></div><div class="lastmod">' + v.lastmodtoshow + '</div><div class="duration"><span class="placehold">Media Length</span></div></div>';
			// los tag se separan y presentan en divs aparte en la función drawdirectoryviewtags()

		});

	} // --fin viewmode distinto de 1

} //-- fin drawDirectoryFolders


function drawDirectoryArchives (viewmode, order) {

	switch(order){
		case "nameasc":
			directoryarchives.sort(SortByNameAsc);
			break;
		case "namedesc":
			directoryarchives.sort(SortByNameDesc);
			break;
		case "extasc":
			directoryarchives.sort(SortByExtAsc);
			break;
		case "extdesc":
			directoryarchives.sort(SortByExtDesc);
			break;
		case "sizeasc":
			directoryarchives.sort(SortBySizeAsc);
			break;
		case "sizedesc":
			directoryarchives.sort(SortBySizeDesc);
			break;
		case "lastasc":
			directoryarchives.sort(SortByLastmodAsc);
			break;
		case "lastdesc":
			directoryarchives.sort(SortByLastmodDesc);
			break;
	}


	if (viewmode==1) {

		$.each(directoryarchives, function(i, v) {

			var nameSinBarra = v.name.substring(1);

			if (v.ext) {
			var exten = v.ext.toLowerCase();
			}
			if (exten == "jpg" || exten == "jpeg" || exten == "png" || exten == "gif" || exten == "bmp" || exten == "svg" || exten == "jpeg" || exten == "xbm" || exten == "ico") {

				if (previewimgonviewmode1=="yes") {

					var imagen = '<a href="file:///'+ dirtoexec + v.name +'"><img data-src="file:///' + dirtoexec + v.name + '" src="../img/ffffff-0.0.png"></a>';

					}
				else {

					var imagen = '<a href="file:///'+ dirtoexec + v.name +'"><img data-src="../img/ffffff-16.16.png" src="../img/ffffff-0.0.png"></a>'

				}

				var exploname = "<span class='exploname imagename1'>"+nameSinBarra+"</span>";
				$(".imgmode1").addClass("conimagen1");

			}
			else {

				var imagen="";
				var exploname = "<span class='exploname'>"+nameSinBarra+"</span>";

			}

			t += '<div class="exploelement archive"><div class="imgmode1 ' + exten + '">' + imagen + '</div><div class="explofile" value="' + v.name + '">'+exploname+'</div><div class="exploext">' + v.ext + '</div><div class="explosize">' + v.sizetodraw + v.sizeterm + '</div><div class="tags" value="' + v.tagsid + '">' + v.tagsid + '<span class="placehold">(Tags Here)</span></div><div class="lastmod">' + v.lastmodtoshow + '</div><div class="duration"><span class="placehold">Media Length</span></div></div><br>';

		});

	} // --fin viewmodes1


	if (viewmode!=1) {

		$.each(directoryarchives, function(i, v) {

			var nameSinBarra = v.name.substring(1);

			if (v.ext) {
			var exten = v.ext.toLowerCase();
			}
			if (exten == "jpg" || exten == "jpeg" || exten == "png" || exten == "gif" || exten == "bmp" || exten == "svg" || exten == "jpeg" || exten == "xbm" || exten == "ico") {

				var imagen = '<a href="file:///'+ dirtoexec + v.name +'"><img src="file:///' + dirtoexec + v.name + '"></a>';

				var exploname = "<span class='exploname imagename2'>"+nameSinBarra+"</span>";
				var imgsrc = encodeURI(dirtoexec + v.name);

				$(".imgmode"+viewmode+"").addClass("conimagen"+viewmode+"");

			} else {

				var exploname = "<span class='exploname'>"+nameSinBarra+"</span>";
				var imagen="<img src='/img/icons/420px/420x420.png'>";

			}

			t += '<div class="exploelement archive"><div class="imgmode'+viewmode+' ' + exten + '">' + imagen + '</div><div class="explofile" value="' + v.name + '">'+exploname+'</div><div class="exploext">' + v.ext + '</div><div class="explosize">&nbsp' + v.sizetodraw + v.sizeterm + '</div><div class="tags" value="' + v.tagsid + '">' + v.tagsid + '<span class="placehold">(Tags Here)</span></div><div class="lastmod">' + v.lastmodtoshow + '</div><div class="duration"><span class="placehold">Media Length</span></div></div>';

		});

	} // --fin viewmodes2

} // -- fin drawDirectoryArchives



function drawDirectoryAfter() {

	$('#directoryview').append(t);

	window.parent.$("#viewmodenumber").html(viewmode + ".");

	$("#folderreadstatus").html($('.exploelement').length + " elements in folder.");

	// Estilos para las diferentes vistas

	if (viewmode==1) {

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

	else if (viewmode!=1) {

		$('.exploelement').addClass('viewmode' + viewmode);
		$('.exploelementfolderup').addClass('viewmode' + viewmode);

		$('.explofolder').addClass('viewmode' + viewmode);
		$('.explofile').addClass('viewmode' + viewmode);
		$('.folderelements').addClass('viewmode' + viewmode);
		$('.exploext').addClass('viewmode' + viewmode).css("display","none");
		$('.explosize').addClass('viewmode' + viewmode).css("display","none");
		$('.tags').addClass('viewmode' + viewmode);
		$('.lastmod').addClass('viewmode' + viewmode).css("display","none");
		$('.duration').addClass('viewmode' + viewmode).css("display","none"); // será visible específicamente si es media

	}

	drawdirectoryviewtags(); // para añadir los divs de los tags
	interactions(); // activa los eventos de arrastre, click, hold para los elementos añadidos.


	// para cargar las imágenes secuencialmente (solo viewmode1)
	if (viewmode==1) {

		var numberofimages = $(".imgmode1 img").length;
		if (numberofimages > 0) {
			loadMyImage(0);
		}
		else {
			loadfolderimages();
		}

		function loadMyImage(u){

			var image = $(".imgmode1 img:eq("+u+")");
			var image_src = image.attr('data-src');

			image.removeAttr('data-src');

			image.attr('src','../img/ffffff-16.16.png'); // otro "apaño" para que las imágenes aparezcan luego centradas
			image.attr('src',image_src);

			if (previewimgonviewmode1=="yes") {

				image.parent().parent().css("background","none"); // quita el icono de imagen
				image.parent().parent().css("display","inline-block");
				image.parent().parent().css("padding-right","0px");

				$(".imgmode1 img:eq("+u+")").on('load', function() {

					$(".imgmode1 img:eq("+u+")").css("padding-right", "1px");

					// esto es para centrar verticalmente la imagen
					var toaddpaddingtop = (16 - $(".imgmode1 img:eq("+u+")").height()) / 2;
					if (toaddpaddingtop > 0) {
						$(".imgmode1 img:eq("+u+")").css("padding-top", toaddpaddingtop+"px")
					}
					if (toaddpaddingtop == 7.5 || toaddpaddingtop <= 0) {
						$(".imgmode1 img:eq("+u+")").css("vertical-align", "middle");
						$(".imgmode1 img:eq("+u+")").css("margin-top", "-3px");
					}

					if (numberofimages == u+1) { // al terminar se lanza la carga de las imágenes de carpetas

						loadfolderimages();

					} else {

						loadMyImage(u+1);
					}
				});

			} else {

				if(numberofimages == u+1) {
					loadfolderimages();
				} else {
					$(".imgmode1 img:eq("+u+")").on('load', function() {
						loadMyImage(u+1); // solo esta cargando la imagen transparente
					});
				}

			}

		}

	} else {
		loadfolderimages();
	}


	// para evitar selección del elemento cuando se le da a una imagen
	$(".archive a img").on('click', function(){
		$(this)[0].parentElement.parentElement.parentElement.classList.toggle("ui-selecting")
	})


	// para pintar diferentes carpetas según contenido mayoritario
	// se ha metido en una función que se lanza después de haber ejecutado la carga de imágenes secuencial pues era la única manera de que posicionara las imágenes bien
	function loadfolderimages() {

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


			readedSubfolderElements = fs.readdirSync(driveunit + rootdirectory + $(this)[0].getAttribute("value"))

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

		    if (viewmode==1) {

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

			    $(this)["0"].previousElementSibling.style.marginLeft = "0px";

			}

		    else if (viewmode!=1) {


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

	} //-- fin loadfolderimages()


	// para el preview de los epubs

	if (viewmode!=1 || previewepubonviewmode1!="no") {


		$.each ($(".explofile"), function(u) {

			var extension = $(this)["0"].nextSibling.innerText.toLowerCase();
			if (extension == "epub") {

				var booktopreview = driveunit + rootdirectory + "\/" + $(this)["0"].innerText;

		  	// primero se accede a los ficheros internos del epub (que en realidad es un zip)

		  	var zip = new AdmZip(booktopreview);
				// var zipEntries = zip.getEntries();
				extractfolder = driveunit + rootdirectory + "\/temp-epubcover"+u+ $(this)["0"].innerText+""
				// se extrae el cover.jpg del epub a una carpeta temporal
				if (s.os.name == "windows") {

	      	zip.extractEntryTo(/*entry name*/ "OEBPS/Images/cover.jpg", /*target path*/ extractfolder, /*maintainEntryPath*/false, /*overwrite*/true);
				}
				if (s.os.name == "linux" || s.os.name == "macos") {

					var test = zip.getEntry("OEBPS/Images/cover.jpg")
					if (test) {



						zip.extractEntryTo("OEBPS/Images/cover.jpg", extractfolder, false, true);
					}

				}
      	var imagesource = driveunit + rootdirectory + "\/temp-epubcover"+u+ $(this)["0"].innerText+""+'/cover.jpg'

      	if (viewmode==1) {
      		$(this)["0"].previousSibling.innerHTML = '<img src="file:///'+imagesource+'" />';
					$(this)["0"].style.paddingRight = "2px"; // para que quede igualada con la misma columna de otros archivos
					$(this)["0"].nextSibling.style.paddingRight = "2.5px";
      	}

      	if (viewmode!=1) {
      		// se mete la imagen en el div imgmode2
      		$(this)["0"].previousSibling.innerHTML = '<img src="file:///'+imagesource+'">';
      	}

      	// se le quita la imagen de fondo
      	$(this)["0"].previousSibling.style.backgroundImage = "none";
      	$(this)["0"].previousSibling.classList.add("filepreview"); // para quitarle paddings y centrarlo

      	//se borra la carpeta y archivo temporal que habíamos creado
      	fs.remove(driveunit + rootdirectory + '\/temp-epubcover'+u+ $(this)["0"].innerText +'', function (err) {
					if (err) return console.error(err)
					// console.log('success!')
				});

			}

		});

	}


	// Audio play, controles y tiempo

	if (viewmode==1) {

		// para tomar el tiempo del audio mediante la etiqueta audio
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

				var audiotopreview = encodeURI(dirtoexec + "\/" + $(this)["0"].innerText);

				$(this)["0"].previousSibling.innerHTML = '<audio width="0" class="audio" src="file:///'+audiotopreview+'" type="audio/'+extension.toLowerCase()+'"></audio>'

				var audio = $(this)["0"].previousSibling.children["0"]; // el tag audio
				var duration = $(this)["0"].nextSibling.nextSibling.nextSibling.nextSibling.nextSibling; // el div duracion

				var i = setInterval(function() {
					if(audio.readyState > 0) {
						var minutes = parseInt(audio.duration / 60, 10);
						var seconds = (audio.duration % 60).toFixed(0);

						// (Put the minutes and seconds in the display)
						duration.innerHTML = minutes + "m:" + seconds + "s";

						clearInterval(i);
					}
				}, 100);

			}

		});

	}

	if (viewmode!=1) {

		switch (viewmode) {
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

				var audiotopreview = encodeURI(dirtoexec + "\/" + $(this)["0"].innerText);
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
						duration.innerHTML = minutes + "m:" + seconds + "s";

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
					if (playpause.title == "pause") { // si ya estaba ejecutándose
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


	// Video play, controles y tiempo

	if (viewmode==1) {

		// para tomar el tiempo del video mediante la etiqueta video
		$.each ($(".explofile"), function(u) {

			var extension = $(this)["0"].nextSibling.innerText.toLowerCase();
			if (extension == "mp4" || extension == "m4v" || extension == "webm" || extension == "ogv") {

				if( extension=="m4v") {
					extension="mp4";
				}

				var videotopreview = encodeURI(dirtoexec + "\/" + $(this)["0"].innerText);

				$(this)["0"].previousSibling.innerHTML = '<video width="0" class="video" preload="metadata" src="file:///'+videotopreview+'" type="video/'+extension.toLowerCase()+'"></video>'

				var video = $(this)["0"].previousSibling.children["0"]; // el tag video
				var duration = $(this)["0"].nextSibling.nextSibling.nextSibling.nextSibling.nextSibling; // el div duration

				// para recoger el tiempo total del video, es necesario ponerle un setinterval para que pase un tiempo antes de que intente recoger el dato.
				var i = setInterval(function() {
					if(video.readyState > 0) {

						var minutes = parseInt(video.duration / 60, 10);
						var seconds = (video.duration % 60).toFixed(0);
						duration.innerHTML = minutes + "m:" + seconds + "s";

						clearInterval(i);
					}
				}, 100);

			}

		});

	}

	if (viewmode!=1) {

		switch (viewmode) {
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

				var videotopreview = encodeURI(dirtoexec + "\/" + $(this)["0"].innerText);
				$(this)["0"].previousSibling.children[0].outerHTML = '<video width="'+videowidth+'" class="video" preload="metadata" src="file:///'+videotopreview+'" type="video/'+extension.toLowerCase()+'" controls></video><div class="mmcontrols"><button class="playpause" title="play"></button><input class="volume" min="0" max="1" step="0.1" type="range" value="0.5"/><input type="range" class="seek-bar" value="0"></div>'
				$(this)["0"].previousSibling.style.backgroundImage = "none";
		      	$(this)["0"].previousSibling.classList.add("filepreview"); // para quitarle paddings y centrarlo

		      	var video = $(this)["0"].previousElementSibling.children[0]; // el tag video

		      	var duration = $(this)["0"].nextSibling.nextSibling.nextSibling.nextSibling.nextSibling; // el div duration

				// para recoger el tiempo total del video, es necesario ponerle un setinterval para que pase un tiempo antes de que intente recoger el dato.
		      	var i = setInterval(function() {
					if(video.readyState > 0) {

						var minutes = parseInt(video.duration / 60, 10);
						var seconds = (video.duration % 60).toFixed(0);
						duration.innerHTML = minutes + "m:" + seconds + "s"

						clearInterval(i);
					}
				}, 100);

		      	var parent = $(this)["0"].parentElement;

		      	//controles personalizados

		      	video.controls = false;

				var playpause = $(this)["0"].previousSibling.children[1].childNodes["0"]; //el boton de play/pause
				var volume = $(this)["0"].previousSibling.children[1].childNodes["1"]; //el control de volumen
				var seekbar = $(this)["0"].previousSibling.children[1].childNodes["2"]; //el control de posicion

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
				      	parent.classList.toggle("ui-selecting"); //para evitar selección exploelement
				      	video.pause();
				   	}
				}
				volume.onchange = function() {

   					video.volume = volume.value;
					parent.classList.toggle("ui-selecting"); // para evitar selección exploelement
				}

				volume.onmousedown = function(e) {
					e.stopPropagation(); // para evitar que actué el trigger action del padre (es decir, el pressandHold), mientras se tenga pulsado el mouse button en este elemento
				}

				// el seekbar (para ver posición del playbabk y poder acceder a un tiempo determinado)
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


	// pequeño ajuste para que la vista de directorio siempre ocupe toda la altura del wraper y así se puedan seleccionar los elementos con la cajetilla del ratón
	if ($("#dirview-wrapper").height() > $("#directoryview").height()) {
		$("#dirview").css("height", "97%")
	} else {
		$("#directoryview").css("padding-bottom", "10px")

	}

} // -- fin drawDirectoryAfter()



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

			for(var k = 0; k < tagticket[i].length; k += 1){ //recorremos el objeto

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

} // -- fin drawdirectoryviewtags ()


// activar interacciones tagtickets del directorio (para poder cambiar orden)
function elementstagsorder() {

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

				elementtagorder = elementtagorder.split(","); // a array

				// se reposicionan los tags en el array
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

				for(var k = 0; k < elementtagorder.length; k += 1){ // recorremos el objeto

					tagsdivs += "<div class='tagticket' value='"+ elementtagorder[k] +"'> " + elementtagorder[k] +  "</div>" ;

				};

				elementtags.html(tagsdivs); // se mete el contenido (los tagsticket) en el html, solo ids

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

						if (elementtags.parents().hasClass('folder')) { // si es carpeta

							var carpeteacambiartags = rootdirectory + elementtags["0"].parentElement.children[1].attributes[1].value; // utilizamos el atributo value del div explofolder

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
										folderupdate.foldertags = elementtagorder.toString();

									}

									cursor.continue();

								}

							}

							trans.oncomplete = function (e) {

								var trans = db.transaction(["folders"], "readwrite")
								var request = trans.objectStore("folders")
									.put(folderupdate);

								// se va a actualizar la disposición de los tags en el treeview si estuvieran visibles

								$.each ($("#filetree span"), function(t) {

									if($("#filetree span:eq("+t+")").attr("rel2") == carpeteacambiartags) {

										elementtagorder = elementtagorder.toString();

										$("#filetree span:eq("+t+")").attr("value", elementtagorder);

										// y ahora redibujamos los tags..
										elementtagorder = elementtagorder.split(','); // volvemos a convertirlo en array
										var fttagsdivs = "";
										for(var k = 0; k < elementtagorder.length; k += 1){ // recorremos el array
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

								}); //--fin each (actualización tags de la carpeta en el treeview)

							}

						}

						else if (elementtags.parents().hasClass('archive')) { // si es archivo

							var archivoacambiartags = elementtags["0"].parentElement.children[1].attributes[1].value; // utilizamos el atributo value del div explofolder
							var idcarpetadelarchivo = "";

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

									if (cursor.value.folder == rootdirectory) {

										idcarpetadelarchivo = cursor.value.folderid;

									}

									cursor.continue();

								}
							}

							trans.oncomplete = function(event) {

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
												fileupdate.filetags = elementtagorder.toString();

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

			} //-- fin if tagticket --- si se ha droppeado un tag para cambiar el orden

		} // --fin dropp:

	}); // --fin droppable

} // --fin elementstagsorder()



// activa sistema para borrar etiquetas
function elemetstagdelete() {

	$('.tags > div').unbind('click'); // para resetear las acciones del on click, y no haga dos veces o más veces por click una vez que se ejecuta elementstagdelete() varias veces

	$(".tags > div").on('click', function() {

		var cursoractual = $(".tags > div").css('cursor');

		if (cursoractual != "pointer"){

			var tagaborrar = $(this);

			var iddeltagaborrar = $(this)["0"].attributes[1].value; // id del tag a borrar
			var idtagsoriginales = $(this)["0"].parentElement.attributes[1].value; // del array de tags

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

			var nombreelementocontagaborrar = $(this)["0"].parentElement.parentElement.children[1].attributes[1].value;

			// ponemos el nuevo valor en el value del div tags
			$(this)["0"].parentElement.setAttribute("value", idtagsrestantes.toString());


			// si el tag pertenece a una carpeta
			if (isfolderorarchive == "folder") {

				var updatefolder = {};

				if (idtagsrestantes.length > 0) { // si queda algun tag (y por lo tanto la carpeta permanece si o si en la bd)

					var trans = db.transaction(["folders"], "readwrite")
					var objectStore = trans.objectStore("folders")
					var req = objectStore.openCursor();

					req.onerror = function(event) {

						console.log("error: " + event);
					};

					req.onsuccess = function(event) {


						var cursor = event.target.result;

						if(cursor){

							if(cursor.value.folder == rootdirectory + nombreelementocontagaborrar){

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
									undo.deltaggfold.parentfolder = rootdirectory;


									// Actualizar visual

									// en el directorio
									tagaborrar.remove(); //que es el $(this) de al hacer click (el tagticket)

									// en el treeview se redibujarán los tags si se ve la carpeta
									$.each ($("#filetree span"), function(t) {

										if($("#filetree span:eq("+t+")").attr("rel2") == undo.deltaggfold.folder) {
											treeelementtagsinview = $("#filetree span:eq("+t+")")[0].children[2] // el div tags del treeview
										}

									});

									// y ahora redibujamos los tags..
									var tagsdivs = "";
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

							if(cursor.value.folder == rootdirectory + nombreelementocontagaborrar){

								idcarpeta = cursor.value.folderid

							}

							cursor.continue();

						}

					}

					trans.oncomplete = function(event) {

						var aborrardedb = "si";

						// vamos a ver si hay archivos asociados a la carpeta
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
									undo.deltaggfold.folder = rootdirectory + nombreelementocontagaborrar;
									undo.deltaggfold.parentfolder = rootdirectory;


									// Actualizar visual

									// en el treeview
									tagaborrar.remove(); // que es el $(this) de al hacer click (el tagticket)

									// el el treeview se redibujarán los tags si se ve la carpeta
									$.each ($("#filetree span"), function(t) {

										if($("#filetree span:eq("+t+")").attr("rel2") == undo.deltaggfold.folder) {
											treeelementtagsinview = $("#filetree span:eq("+t+")")[0].children[2] // el div tags del treeview
										}

									});

									// y ahora redibujamos los tags..
									var tagsdivs = "";
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

										if(cursor.value.folder == rootdirectory + nombreelementocontagaborrar){

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
												undo.deltaggfold.parentfolder = rootdirectory;


												// Actualizar visual

												// en el treeview
												tagaborrar.remove(); // que es el $(this) de al hacer click (el tagticket)

												// se redibujarán los tags del treeview si se ve la carpeta
												$.each ($("#filetree span"), function(t) {

													if($("#filetree span:eq("+t+")").attr("rel2") == undo.deltaggfold.folder) {
														console.log($("#filetree span:eq("+t+")")[0]);
														treeelementtagsinview = $("#filetree span:eq("+t+")")[0].children[2] // el div tags del treeview
													}

												});

												// y ahora redibujamos los tags..
												var tagsdivs = "";
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

			} // -- fin si se borra tag de carpeta

			if (isfolderorarchive == "archive") {

				$("#undo", window.parent.document).attr("data-tooltip", "UNDO (erase archive tag)");
				undo.class = "delete archive tag";
				undo.deltaggfile = []; // para dejar todos los valores a 0 y no se crucen algunos datos
				undo.deltaggfile.tags = idtagsoriginales;
				undo.deltaggfile.file = nombreelementocontagaborrar;
				undo.deltaggfile.folder = rootdirectory;

				if (idtagsrestantes.length > 0) { // si queda algun tag (y por lo tanto el archivo permanece si o si en la bd)

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

							if(cursor.value.folder == rootdirectory){

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
											tagaborrar.remove(); // que es el $(this) de al hacer click (el tagticket)

										}

									}

								}

								cursor.continue();

							}

						}

					}

				}

				else { // si se queda a 0 tags


					// actualizar visual el el directorio
					tagaborrar.remove(); //que es el $(this) de al hacer click (el tagticket)

					undo.deltaggfile.fileid = ""; //quitamos cualquier valor que pudira tener de antes


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

							if(cursor.value.folder == rootdirectory){

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

											console.log("error undo - no se ha eliminado archivo de bd:" + event);

										};
										request9.onsuccess = function(event) { 	};

										trans9.oncomplete = function(event) {

											var aborrardedb = "si";

											//podemos comprobar por un lado si la carpeta madre tiene tags
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

														var tagscarpetamadre = cursor.value.foldertags;

														if (tagscarpetamadre.length > 0) {

															aborrardedb="no";

															undo.deltaggfile.folderid = idcarpetamadre;

														}

													}

													cursor.continue();

												}

											}

											trans.oncomplete = function(event) {


												// ahora comprobamos si la carpeta madre tiene algún archivo asociados aparte del que hemos eliminado de la bd
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

	});

} //-- fin function elementtagdelete



function interactions() {


	// para la presentación de diapositivas click en imagen
	$('.exploelement .imgmode'+viewmode+' a').abigimage({

        onopen: function(target) {

        	var filenametoshow = target["0"].href.replace("file:///"+driveunit+"\/", "");
            this.filename.html(filenametoshow);

        }

	});
	// para la presentación de diapositivas click en nombre
	$('.exploelement .viewmode'+viewmode+' a').abigimage({

        onopen: function(target) {

        	var filenametoshow = target["0"].href.replace("file:///"+driveunit+"\/", "");
            this.filename.html(filenametoshow);
        }

	});


	// Draggable de los elementos del directoryview
	var selected = $([]), offset = {top:0, left:0};

	$( "#directoryview > div" ).draggable({

		appendTo: 'parent',
		containment: 'window',
		scroll: false,
		helper: 'clone',
		delay: 300,
		cancel: '.exploelementfolderup',

		revert: function(is_valid_drop){

			if(!is_valid_drop){  // si el objetivo del dragging no es válido

			  	// console.log("revert triggered");

				if (posicionsup!=1) { // posiciones originales tomadas en "start:"
				   	for (i in posicionsup) {

						$( ".ui-selected.exploelement:eq( "+ i +" )" ).animate({left: "" + posicionsleft[i] + "px", top: "" + posicionsup[i] + "px"}, "slow", function() { // cuando termina de hacer la animación:

							// se le quita la clase especifica de los elementos que se están moviendo
							$(this).removeClass("dragging");
							$(this).css({"visibility": "visible"});

							$(this)["0"].children[1].children["0"].style.display = "initial"; // los holdButtonProgress para que sean visibles de nuevo

						});
						$( ".ui-selecting.exploelement:eq( "+ i +" )" ).animate({left: "" + posicionsleft[i] + "px", top: "" + posicionsup[i] + "px"}, "slow", function() { // cuando termina de hacer la animación:

							// se le quita la clase especifica de los elementos que se están moviendo
							$(this).removeClass("dragging");
							$(this).css({"visibility": "visible"});

							$(this)["0"].children[1].children["0"].style.display = "initial"; // los holdButtonProgress para que sean visibles de nuevo

						});

					}

				}

				// se le quita la clase especifica de los elementos que se están moviendo
				$(this).removeClass("dragging");

			  	return true;

			} // --fin si objetivo dragging no válido
		},
		start: function(ev, ui) {

			// se quita todo lo relacionado con barra de progreso
			$(this)[0].classList.remove("progress-wrap");
			$(this)[0].classList.remove("progress");
			$(this)[0].removeAttribute("data-progress-percent");
			$(".progress-bar").remove()

			window.posicionsup=1; // valor por defecto, si se selecciona un exploelement cambia a array de valores
			window.posicionsleft=1; // valor por defecto, si se selecciona un exploelement cambia a array de valores

			ui.helper.context.children[1].children["0"].style.display = "none";
			var seleccionado = $(this);

			$(this).css({"visibility": "hidden"});
			if ($(this).hasClass("ui-selected")){

				posicionsup=[];
				posicionsleft=[];

				selected = $(".ui-selected").each(function(t) {
				   var el = $(this);
				   el.data("offset", el.offset());
				});

				// para tomar los datos de la posicion original de los exploreelement seleccionados
				var numberofselected = $(".ui-selected.exploelement").length;

				$(".ui-selected.exploelement").each(function(i) {

					posicionsup[i] = $(this)[0].offsetTop;
					posicionsleft[i] = $(this)[0].offsetLeft;

					// para que el último elemento no haga un efecto raro en el reverse
					if (i == numberofselected-1) {

						posicionsup[i] = seleccionado[0].offsetTop;
						posicionsleft[i] = seleccionado[0].offsetLeft;

					}

				});

			}
			else if ($(this).hasClass("ui-selecting")){

				posicionsup=[];
				posicionsleft=[];

				selected = $(".ui-selecting").each(function(t) {
				   var el = $(this);
				   el.data("offset", el.offset());
				});

				// para tomar los datos de la posicion original de los exploreelement seleccionados
				var numberofselected = $(".ui-selecting.exploelement").length;

				$(".ui-selecting.exploelement").each(function(i) {

					posicionsup[i] = $(this)[0].offsetTop;
					posicionsleft[i] = $(this)[0].offsetLeft;

					// para que el último elemento no haga un efecto raro en el reverse
					if (i == numberofselected-1) {

						posicionsup[i] = seleccionado[0].offsetTop;
						posicionsleft[i] = seleccionado[0].offsetLeft;

					}

				});

			}
			else {

				selected = $([]);
				$("#directoryview > div").removeClass("ui-selected");
				$("#directoryview > div").removeClass("ui-selecting");

			}

			offset = $(this).offset();

			// se añade clase dragging a todo lo que se mueva
			$(this).addClass("dragging");

			$(".ui-selected.exploelement").addClass("dragging");
			$(".ui-selecting.exploelement").addClass("dragging");


		},
		drag: function(ev, ui) {

			var anchuratree = $("#filetree")["0"].offsetWidth;
			var alturaheader = 0; // la altura es 0 pues el contenido esta en un iframe sin margenes ni padding.
			var dt = ui.position.top - offset.top, dl = ui.position.left - offset.left;
			// take all the elements that are selected expect $("this"), which is the element being dragged and loop through each.
			selected.not(this).each(function() {
				// create the variable for we don't need to keep calling $("this")
				// el = current element we are on
				// off = what position was this element at when it was selected, before drag
				var el = $(this), off = el.data("offset");
				el.css({top: off.top + dt, left: off.left + dl});

			});

		},
		stop: function( event, ui ) {

			$(this)["0"].children[1].children["0"].style.display = "initial"
			$(this).css({"visibility": "visible"});

		}

	}); // --fin Draggable #directoryview > div



	// Añadir tag en Archivo

	$('.exploelement.archive').droppable({

		accept: '.footertagticket',

		drop: function( event, ui ) {

			if (ui.draggable["0"].classList.contains("footertagticket")) { // si lo que se intenta droppear es un tag (no es necesario pero lo dejo para tenerlo a mano)

				// devolvemos tag a posición original
				ui.draggable["0"].style.top = "0px";
				ui.draggable["0"].style.left = "0px";

				// para que no se produzca dropp en el overflow hacemos unas mediciones y ponemos un condicional
				var positiontop = ui.offset.top + 5 //la altura a la que se ha hecho el dropp. (absoluta) el + 5 es un margen necesario para que quede bien
				var wrapperbottom = $('#dirview-wrapper').position().top + $('#dirview-wrapper').outerHeight(true); // posición del limite inferior del wrapper (absoluta)

				if (positiontop < wrapperbottom) {

					taganadir = ui.draggable["0"].attributes[1].value;

					var arraydetags=[];

					var filename = $(this).children('.explofile');
					filename = filename.attr("value");

					var extension = $(this).children('.exploext');
					extension = extension[0].textContent;

					var folder = rootdirectory;

					var fileupdate = {};

					// vamos a comprobar si ya estaba la carpeta y si no está la añadimos a la base de dato (aunque sea sin tags)

					var isnew="yes";

					var trans = db.transaction(["folders"], "readwrite")
					var objectStore = trans.objectStore("folders")
					var req = objectStore.openCursor();

					req.onerror = function(event) {

						console.log("error: " + event);

					};

					req.onsuccess = function(event) {

						var cursor = event.target.result;

						if(cursor){

							if(cursor.value.folder == folder){ // si la carpeta madre ya esta en la base de datos

								isnew="no";
								fileupdate.filefolder = cursor.value.folderid; // para añadir luego

							}

							cursor.continue();
						}

					}

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

										trans.oncomplete = function(e) { // vamos a añadir los datos del nuevo fichero (si la carpeta era nueva el fichero también)

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
												var elementtagsinview = $('.explofile').filter('[value="' + filename + '"]').siblings('.tags');
												var arraydetags = taganadir; // solo hay un tag a añadir
												elementtagsinview[0].setAttribute("value", arraydetags);

												// y ahora redibujamos los tags..
												arraydetags = arraydetags.split(','); // volvemos a convertirlo en array (ahunque solo haya un tag)
												var tagsdivs = "";
												for(var k = 0; k < arraydetags.length; k += 1){ //recorremos el array
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
											fileupdate.fileid = cursor.value.fileid;  // nos da el id del último success (el fichero añadido)
											arraydetags = cursor.value.filetags;
										}
									}

									cursor.continue();
								}

							}

							trans.oncomplete = function(e) { // a meter los datos del fichero tanto si es nuevo como si no

								if (isnew=="no") { // si el fichero no es nuevo

									if (typeof arraydetags == "string") {

										arraydetags = arraydetags.split(",");

										for (i in arraydetags) { // recorremos los tags que tenia

											if (arraydetags[i] == taganadir) { // si ya estaba

												isnewtag = "no"; // no se añadirá

												arraydetags = arraydetags.toString();
												return;

											}

										}

									}

									if (isnewtag=="yes") { // si es un un nuevo tag para el archivo, se añadirá (si no es, no se mete nada y ya esta)
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
										var elementtagsinview = $('.explofile').filter('[value="' + filename + '"]').siblings('.tags');
										arraydetags = arraydetags.toString() // de array a string
										elementtagsinview[0].setAttribute("value", arraydetags);

										// y ahora redibujamos los tags..
										arraydetags = arraydetags.split(','); // volvemos a convertirlo en array
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
										elementtagsinview = $('.explofile').filter('[value="' + filename + '"]').siblings('.tags');

										arraydetags = taganadir //solo hay un tag a añadir
										elementtagsinview[0].setAttribute("value", arraydetags);

										// y ahora redibujamos los tags..
										arraydetags = arraydetags.split(','); // volvemos a convertirlo en array (ahunque solo haya un tag)
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

								} // --fin else (archivo nuevo, carpeta vieja)

							} // --fin trans

						} // --fin else (carpeta vieja)

					}; // -- fin trans

				} //-- Fin de cuando se ha hecho drop de un tag

			} // --fin if para el overflow

		}

	}); //-- fin Añadir tag en Archivo



	// Añadir tag a carpeta + COPIAR Y MOVER (drop en carpetas del propio directoryview)

	$('.exploelement.folder').droppable({

		accept: '.footertagticket, .exploelement',
		tolerance: 'pointer',

		drop: function( event, ui ) {

			// Añadir tag

			if (ui.draggable["0"].classList.contains("footertagticket")) { // si lo que se intenta droppear es un tag (no es necesario pero lo dejo para tenerlo a mano)

				// devolvemos tag a posición original
				ui.draggable["0"].style.top = "0px";
				ui.draggable["0"].style.left = "0px";

			 	// para que no se produzca dropp en el overflow se hacen unas mediciones y ponemos un condicional
				var positiontop = ui.offset.top + 5; // la altura a la que se ha hecho el dropp. (absoluta), el 5 es un margen necesario
				var wrapperbottom = $('#dirview-wrapper').position().top + $('#dirview-wrapper').outerHeight(true); // posición del limite inferior del wrapper (absoluta)

				if (positiontop < wrapperbottom) {

					window.taganadir = ui.draggable["0"].attributes[1].value;

					var escarpeta = $(this).children().hasClass('explofolder');

					var arraydetags=[];

					var addtagtosubelements = "no";
					var treeelementtagsinview = [];

					var carpeta = $(this).children('.explofolder').attr("value"); // desde el value del div

					if (rootdirectory == "\/") {
						rootdirectory = "";
					}
					rootdirectory = rootdirectory.slice(0);

					folder = rootdirectory + carpeta; // la ruta completa donde esta el item

					ffoldertoaddtags = folder; // se utiliza al añadir tags a subelementos, con addtagsubs(), si procede

					var isnew = "yes"; // valor por defecto que dice que la carpeta no estaba previamente en la base de datos
					folderupdate = {}; // objeto que luego hay que pasar con todos sus valore para hacer un update en la base de datos

					var trans = db.transaction(["folders"], "readwrite")
					var objectStore = trans.objectStore("folders")
					var req = objectStore.openCursor();

					req.onerror = function(event) {

						console.log("error: " + event);
					};

					req.onsuccess = function(event) {

						var cursor = event.target.result;

						if(cursor){

							if(cursor.value.folder == folder){ // si el folder de la posición del cursor es igual al nombre con ruta del folder dibujado

								isnew="no"; // la carpeta ya esta en la base de datos

								folderupdate.folderid = cursor.value.folderid; //se pasan valores que ya tenía desde el cursor
								folderupdate.folder = cursor.value.folder;

								var isnewtag = "yes"; // valor por defecto
								var arraydetags = cursor.value.foldertags; // variable temporal donde se mete el array de tags desde el curso para hacer unas comprobaciones a continuación. El array puede estar vacío

								for (i in arraydetags) { // recorremos los tags que tenia

									if (arraydetags[i] == taganadir) { // si ya estaba

										isnewtag = "no"; // no se añadirá

										$("#undo", window.parent.document).attr("data-tooltip", "UNDO (tag folder)");
										undo.class = "tag folder";
										undo.taggfold.foldid = folderupdate.folderid;
										undo.taggfold.tagid = taganadir;
										undo.taggfold.folder = folderupdate.folder;

										popup("addtagtosubelements"); // aunque no se añade a la carpeta madre se preguntará como siempre que sea una carpeta si se quiere añadir a subelementos

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
									var treviewvisible = "no";

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

											treeelementtagsinview = $("#filetree span:eq("+t+")")[0].children[2] //el div tags del treeview
											treviewvisible = "yes"
										}

									});

									// y ahora redibujamos los tags..
									arraydetags = arraydetags.split(','); // volvemos a convertirlo en array
									var tagsdivs = "";
									for(var k = 0; k < arraydetags.length; k += 1){ // recorremos el array
										tagsdivs += "<div class='tagticket' value='"+ arraydetags[k] +"'>" + arraydetags[k] +  "</div>" ;
									};
									elementtagsinview[0].innerHTML = tagsdivs;

									if (treviewvisible == "yes") { // si está visible la carpeta en el treeview

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

										popup("addtagtosubelements");

									}

								}

							}

							cursor.continue(); // avanzar posición cursor en base de datos capetas y reiterar

						} // --fin cursor

					}; // -- fin req.onsuccess (del opencursor)

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
								undo.taggfold.foldid = event.target.result; //el nuevo id de la carpeta
								undo.taggfold.tagid = taganadir;
								undo.taggfold.folder = folder;

								// actualizar visual
								var elementtagsinview = $('.explofolder').filter('[value="' + carpeta + '"]').siblings('.tags');
								arraydetags = taganadir // solo hay un tag a añadir
								elementtagsinview[0].setAttribute("value", arraydetags);

								// se redibujarán los tags del treeview si están desplegadas las subcarpetas
								$.each ($("#filetree span"), function(t) {
										// console.log(undo.taggfold.folder + directoryfolders[i].name)
									if($("#filetree span:eq("+t+")").attr("rel2") == undo.taggfold.folder) {

										treeelementtagsinview = $("#filetree span:eq("+t+")")[0].children[2] //el div tags del treeview
									}

								});

								// y ahora redibujamos los tags..
								arraydetags = arraydetags.split(','); // volvemos a convertirlo en array (aunque solo haya un tag)
								var tagsdivs = "";
								for(var k = 0; k < arraydetags.length; k += 1){ // recorremos el array
									tagsdivs += "<div class='tagticket' value='"+ arraydetags[k] +"'>" + arraydetags[k] +  "</div>" ;
								};
								elementtagsinview[0].innerHTML = tagsdivs;

								treeelementtagsinview.innerHTML = tagsdivs;
								treeelementosdirectoriotags = treeelementtagsinview.children

								if (treeelementosdirectoriotags) { // si está visible la carpeta en el treeview

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

									popup("addtagtosubelements");

								}

							}

						}

					} // -- fin trans.oncomplete

				} // --fin if posicion (si el drop es dentro de lo visible)

			} // fin if footertagg (si es un tag)


			// Copiar y Mover  (en el propio directoryview)

			if (ui.draggable["0"].classList.contains("exploelement")) {

		    	var droppedarchive = [];
		    	window.droppedfolder = [];
		    	var foldername = [];
		    	var y = 0;
		    	var x = 0;
				pasteaction = window.top.pasteaction;


		    	var alldroppedelement = $(".dragging");

		    	// al hacer el dropp se repite el último elemento si es más de uno, para que no de error sobre todo con el undo se quita el elemento de la lista
				if (alldroppedelement.length > 1) {
					alldroppedelement.splice(-1);
				}

				var targetfolder = rootdirectory + $(this)["0"].children[1].attributes[1].value;

				$.each (alldroppedelement, function(t) {

					if (alldroppedelement[t].classList.contains("archive")) {

						droppedarchive[y] = alldroppedelement[t];
						y++

					} else if (alldroppedelement[t].classList.contains("folder")) {

						droppedfolder[x] = alldroppedelement[t];
						x++
					}

				});


				// Mover

				if (pasteaction == "cut") {
					if (rootdirectory != targetfolder) {


						alertify.confirm("Are you sure?", function (e) {

						if (!e) {$("#dirviewrefresh").trigger( "click" );}
						if (e) {




							$("#folderreadstatus").html("Moving ...");
							$('.exploelement, .exploelementfolderup').css("filter","opacity(46%)");

							$("#undo", window.parent.document).attr("data-tooltip", "UNDO (move)");
							undo.class = "move";
							undo.move.rootfiles = droppedarchive;
							undo.move.rootfolders = droppedfolder;
							undo.move.rootfolderorig = rootdirectory;
							undo.move.rootfoldernew = targetfolder;

							// trabajamos con las carpetas

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

										foldername[t] = droppedfolder[t].children[1].attributes[1].nodeValue;

										if (cursor.value.folder == targetfolder + foldername[t]) {

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
									console.log(event);
								};
								req.onsuccess = function(event) {
									var cursor = event.target.result;

									if (cursor) {
										$.each(droppedfolder, function(t) {

											var folderupdate = {};

											foldername[t] = droppedfolder[t].children[1].attributes[1].nodeValue;

											if (cursor.value.folder == rootdirectory + foldername[t]) {

												origenenbd = cursor.value.folderid;

												// si está la carpeta de origen en la bd le adjuntamos nuevo valor al nombre si en destino no hay una ya con el mismo nombre en la bd
												if (destinoenbd == "") {

													folderupdate.folder = targetfolder + foldername[t]
													folderupdate.folderid = cursor.value.folderid
													folderupdate.foldertags = cursor.value.foldertags

													var res2 = cursor.update(folderupdate);

													res2.onerror = function(event){
														console.log(event); //error ruta carpeta no cambiada
													}

													res2.onsuccess = function(event){

														// console.log("ruta carpeta cambiada")

													}

												} else { //si en destino ya hay una carpeta con el nombre en la bd le adjuntamos los nuevos tags

													folderupdate.folder = targetfolder + foldername[t]
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

																foldername[t] = droppedfolder[t].children[1].attributes[1].nodeValue;

																if (cursor.value.folder == targetfolder + foldername[t]) {

																	var res2 = cursor.update(folderupdate);

																	res2.onerror = function(event){
																		console.log(event); //error ruta carpeta no cambiada
																	}

																	res2.onsuccess = function(event){

																		// console.log("ruta carpeta cambiada")

																	}

																}

																// y se borra de la bd la carpeta origen
																if (cursor.value.folder == rootdirectory + foldername[t]) {

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

										cursor.continue();

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


										// antes de mover fisicamente las carpetas vamos a recorrerlas recursivamente para recoger los datos de todas las subcarpetas que contenga

										var arraydecarpetas = {};
										var arraydecarpetasDest = {};
										var posicion = 0;

										$.each(droppedfolder, function(t) {

											foldertoread = rootdirectory + droppedfolder[t].children[1].attributes[1].value; //recogemos el value de cada carpeta

											recursivefolderdata(foldertoread);


											function recursivefolderdata(foldertoread) {

												var directoryelement = []
												var directorycontent = []
												var directoryfolders = []
												var directoryarchives = []

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

												$.each(directoryfolders, function(t){

													arraydecarpetas[posicion] = foldertoread + directoryfolders[t].name;
													posicion++
													recursivefolderdata(foldertoread + directoryfolders[t].name);

												});

											}

										});

										$.each(arraydecarpetas, function(t){

											arraydecarpetasDest[t] = arraydecarpetas[t].replace(rootdirectory, targetfolder);

										});

										// console.log("original folders:");
										// console.log(arraydecarpetas);
										// console.log("destination folders:");
										// console.log(arraydecarpetasDest);

										undo.move.subfoldersorig = arraydecarpetas;
										undo.move.subfoldersnew = arraydecarpetasDest;

										// ahora miramos cada una de las subcarpetas si está en la base de datos y si está le cambiamos la dirección por el de la subcarpeta destino, (los archivos al estar asociados a las carpetas cambiarán automáticamente)

										$.each(arraydecarpetas, function(t) {

											var updatefolder = {};

											var trans10 = db.transaction(["folders"], "readwrite")
											var objectStore10 = trans10.objectStore("folders")
											var req10 = objectStore10.openCursor();

											req10.onerror = function(event) {
												console.log("error: " + event);
											};
											req10.onsuccess = function(event) {
												var cursor10 = event.target.result;
												if (cursor10) {

													// console.log("arraydecarpetas: " + arraydecarpetas[t])
													// console.log("cursor10: " + cursor10.value.folder)

													if (cursor10.value.folder == arraydecarpetas[t]) {

														updatefolder.folder = arraydecarpetasDest[t];
														updatefolder.folderid = cursor10.value.folderid;
														updatefolder.foldertags = cursor10.value.foldertags

														var res11 = cursor10.update(updatefolder);

														res11.onerror = function(event){
															console.log(event);
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

											fs.move(driveunit + rootdirectory + foldername[t], driveunit + targetfolder + foldername[t], { clobber: true }, function(err) {

												flagg++;

												if (flagg == droppedfolder.length && droppedarchive.length == 0) { // para que haga el refresco tras mover la última carpeta y solo si despues no va actualizar si hay ficheros

													// para que refresque el filetree también si tuviera carpetas
													if(droppedfolder.length > 0) {

														timetowait = droppedfolder.length * 30;
														setTimeout(function() {
															$.each ($("#filetree span"), function(l) {

																if($("#filetree span:eq("+l+")").attr("rel2") == targetfolder) {

																	// contraer y expandir
																	$("#filetree span:eq("+l+")").trigger( "click" );
																	$("#filetree span:eq("+l+")").trigger( "click" );

																}
																if($("#filetree span:eq("+l+")").attr("rel2") == rootdirectory) {

																	// contraer y expandir
																	$("#filetree span:eq("+l+")").trigger( "click" );
																	$("#filetree span:eq("+l+")").trigger( "click" );

																}

															});

															previousornext = "refresh"; // para refrescar sin añadir al array de los direcciones visitadas
															readDirectory(dirtoexec);

														}, timetowait);

													} else {

														previousornext = "refresh"; // para refrescar sin añadir al array de los direcciones visitadas
														readDirectory(dirtoexec);
													}

												}

											});

										});

									} //--fin trans

								}

							}

							// trabajamos con los archivos

							// primero comprobamos si algún archivo estaba en la base de datos (si tiene tags)
							var anyarchiveondb = "no";
							$.each(droppedarchive, function(t) {

								if (droppedarchive[t].children[4].attributes[1].value != "") {
									anyarchiveondb = "yes";
								}

							});

							if (anyarchiveondb == "yes") {

								// como los archivos (al menos uno) tienen tags se comprueba si la carpeta de destino esta en la bd

								var destfolderid = "";
								var originfolderid = "";

								var trans3 = db.transaction(["folders"], "readonly")
								var objectStore3 = trans3.objectStore("folders")
								var req3 = objectStore3.openCursor();

								req3.onerror = function(event) {
									console.log("error: " + event);
								};
								req3.onsuccess = function(event) {
									var cursor3 = event.target.result;
									if (cursor3) {
										if (cursor3.value.folder == targetfolder) {

											destfolderid = cursor3.value.folderid;

										}
										// también aprovechamos para sacar el id de la carpeta origen (para luego buscar los archivos en la bd)
										if(cursor3.value.folder == rootdirectory){

											originfolderid = cursor3.value.folderid;

										}
										cursor3.continue();

									}
								}
								trans3.oncomplete = function(event) {

									var fileupdate = {};

									if (destfolderid == "") { // si la carpeta de destino NO estaba en la base de datos (no tiene id)

										// añadimos la carpeta a la bd pues los archivos a pasar tienen tags
										var trans4 = db.transaction(["folders"], "readwrite")
										var request4 = trans4.objectStore("folders")
										.put({ folder: targetfolder, foldertags: [] }); // el id no hace falta pues es autoincremental

										request4.onerror = function(event){

											console.log("error carpeta destino no añadida a bd: " + event);

										}

										request4.onsuccess = function(event){

											// console.log("carpeta destino añadida a bd!");

										}

										trans4.oncomplete = function(e) { // vamos a tomar el id de la carpeta añadida

											var trans5 = db.transaction(["folders"], "readonly")
											var objectStore5 = trans5.objectStore("folders")
											var req5 = objectStore5.openCursor();

											req5.onerror = function(event) {

												console.log("error: " + event);

											};

											req5.onsuccess = function(event) {

												var cursor5 = event.target.result;

												if(cursor5){

													if(cursor5.value.folder == targetfolder){

														destfolderid = cursor5.value.folderid;

													}


													cursor5.continue();

												}

											}

											trans5.oncomplete = function(event) {

												// Ahora cambiamos el parámetro filefolder de cada uno de los archivos que movemos y están en la bd poniéndole el id de la carpeta destino

												var trans6 = db.transaction(["files"], "readwrite")
												var objectStore6 = trans6.objectStore("files")
												var req6 = objectStore6.openCursor();

												req6.onerror = function(event) {

													console.log("error: " + event);

												};

												req6.onsuccess = function(event) {

													var cursor6 = event.target.result;

													if(cursor6){

														if(cursor6.value.filefolder == originfolderid){

															$.each(droppedarchive, function(t) {

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
																		window.flaggA=0;
																		$.each(droppedarchive, function(t) {

																			fs.rename(driveunit + rootdirectory + droppedarchive[t].children[1].attributes[1].value, driveunit + targetfolder + droppedarchive[t].children[1].attributes[1].value, function(err) {

																				window.flaggA++;

																			});

																		});

																	}

																}

															});

														}

														cursor6.continue();
													}

												}

												trans6.oncomplete = function(event) {

													if (window.flaggA >= droppedarchive.length) {

														// para que refresque el filetree también si tuviera carpetas
														if(droppedfolder.length > 0) {

															timetowait = droppedfolder.length * 30;
															setTimeout(function() {
																$.each ($("#filetree span"), function(l) {

																	if($("#filetree span:eq("+l+")").attr("rel2") == targetfolder) {

																		// contraer y expandir
																		$("#filetree span:eq("+l+")").trigger( "click" );
																		$("#filetree span:eq("+l+")").trigger( "click" );

																	}

																	if($("#filetree span:eq("+l+")").attr("rel2") == rootdirectory) {

																		// contraer y expandir
																		$("#filetree span:eq("+l+")").trigger( "click" );
																		$("#filetree span:eq("+l+")").trigger( "click" );

																	}

																});
																previousornext = "refresh"; // para refrescar sin añadir al array de los direcciones visitadas
																readDirectory(dirtoexec);

															}, timetowait);

														} else {
															previousornext = "refresh"; // para refrescar sin añadir al array de los direcciones visitadas
															readDirectory(dirtoexec);
														}

													}

													// comprobamos si la carpet origen se queda sin archivos con tags
													var borrarcarpetaorigenbd = "yes";

													var trans8 = db.transaction(["files"], "readonly")
													var objectStore8 = trans8.objectStore("files")
													var req8 = objectStore8.openCursor();

													req8.onerror = function(event) {

														console.log("error: " + event);

													};

													req8.onsuccess = function(event) {

														var cursor8 = event.target.result;

														if(cursor8){

															if(cursor8.value.filefolder == originfolderid){

																borrarcarpetaorigenbd = "no"

															}

															cursor8.continue();
														}

													}

													trans8.oncomplete = function() {

														if (borrarcarpetaorigenbd == "yes") {

															var trans9 = db.transaction(["folders"], "readwrite")
															var request9 = trans9.objectStore("folders").delete(originfolderid);

															request9.onerror = function(event) {

																console.log("error - no se ha eliminado carpeta de bd:" + event);

															};
															request9.onsuccess = function(event) {

																// console.log("undo - eliminada carpeta de la bd");

															}

														}

													}

												}

											}

										}

									}

									else { // si la carpeta de destino ya estaba en la bd

										// primero borramos de la base de datos los archivos que están asociados a la carpeta destino que vamos a sobreescribir con la operación de movimiento

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

															var res8 = cursor6.delete(cursor6.value.fileid);

															res8.onerror = function(event) {

																console.log("error - fichero destino no eliminado de la bd"); console.log(event);

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

												var cursor6 = event.target.result;

												if(cursor6){

													if(cursor6.value.filefolder == originfolderid){

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
																// console.log("ruta archivo no cambiada");

															}

														}

													}

													cursor6.continue();
												}

											}

											trans6.oncomplete = function(event) {

												// comprobamos si la carpet origen se queda sin archivos con tags

												borrarcarpetaorigenbd = "yes"

												var trans8 = db.transaction(["files"], "readonly")
												var objectStore8 = trans8.objectStore("files")
												var req8 = objectStore8.openCursor();

												req8.onerror = function(event) {

													console.log("error: " + event);

												};

												req8.onsuccess = function(event) {

													var cursor8 = event.target.result;

													if(cursor8){

														if(cursor8.value.filefolder == originfolderid){

															borrarcarpetaorigenbd = "no"

														}

														cursor8.continue();
													}

												}

												trans8.oncomplete = function() {

													if (borrarcarpetaorigenbd == "yes") {

														var trans9 = db.transaction(["folders"], "readwrite")
														var request9 = trans9.objectStore("folders").delete(originfolderid);

														request9.onerror = function(event) {

															console.log("no se ha eliminado carpeta de bd:" + event);

														};

														request9.onsuccess = function(event) {

															// console.log("eliminada carpeta de la bd");

														}

													}

												}

											}

										});

										// movemos los archivos
										var fflagg = 0;
										$.each(droppedarchive, function(t) {

											fs.rename(driveunit + rootdirectory + droppedarchive[t].children[1].attributes[1].value, driveunit + targetfolder + droppedarchive[t].children[1].attributes[1].value, function(err) {

												fflagg++;

												if (fflagg == droppedarchive.length) { //para que haga el refresco tras mover la última carpeta

													// para que refresque el filetree también si tuviera carpetas
													if(droppedfolder.length > 0) {
														timetowait = droppedfolder.length * 30;

														setTimeout(function() {
															$.each ($("#filetree span"), function(l) {

																if($("#filetree span:eq("+l+")").attr("rel2") == targetfolder) {

																	// contraer y expandir
																	$("#filetree span:eq("+l+")").trigger( "click" );
																	$("#filetree span:eq("+l+")").trigger( "click" );

																}

																if($("#filetree span:eq("+l+")").attr("rel2") == rootdirectory) {

																	// contraer y expandir
																	$("#filetree span:eq("+l+")").trigger( "click" );
																	$("#filetree span:eq("+l+")").trigger( "click" );

																}

															});

															previousornext = "refresh"; // para refrescar sin añadir al array de los direcciones visitadas
															readDirectory(dirtoexec);

														}, timetowait);

													} else {
														previousornext = "refresh"; // para refrescar sin añadir al array de los direcciones visitadas
														readDirectory(dirtoexec);

													}

												}

											});

										});

									}

								}

							}
							else { // si los archivos no tienen tag

								// se mueven los archivos y ya esta
								var fflagg = 0;

								$.each(droppedarchive, function(t) {

									fs.rename(driveunit + rootdirectory + droppedarchive[t].children[1].attributes[1].value, driveunit + targetfolder + droppedarchive[t].children[1].attributes[1].value, function(err) {

										fflagg++;

										if (fflagg == droppedarchive.length) { // para que haga el refresco tras mover el último archivo

											// para que refresque el filetree también si tuviera carpetas
											if(droppedfolder.length > 0) {
												timetowait = droppedfolder.length * 30;
												setTimeout(function() {
													$.each ($("#filetree span"), function(l) {

														if($("#filetree span:eq("+l+")").attr("rel2") == targetfolder) {

															// contraer y expandir
															$("#filetree span:eq("+l+")").trigger( "click" );
															$("#filetree span:eq("+l+")").trigger( "click" );

														}

														if($("#filetree span:eq("+l+")").attr("rel2") == rootdirectory) {

															// contraer y expandir
															$("#filetree span:eq("+l+")").trigger( "click" );
															$("#filetree span:eq("+l+")").trigger( "click" );

														}

													});
													previousornext = "refresh"; // para refrescar sin añadir al array de los direcciones visitadas
													readDirectory(dirtoexec);

												}, timetowait);

											} else {
												previousornext = "refresh"; // para refrescar sin añadir al array de los direcciones visitadas
												readDirectory(dirtoexec);
											}

										}

									});

								});

							}

						}})

					} // --fin si la carpeta origen y destino son las mismas

					else {

						alertify.alert("Same origin and destination folder.");

						previousornext = "refresh"; // para refrescar sin añadir al array de los direcciones visitadas
						readDirectory(dirtoexec);

					}

				} //-- fin Mover


				// Copiar

				if (pasteaction == "copy") {
					if (rootdirectory != targetfolder) {

						alertify.confirm("Are you sure?", function (e) {

							if (!e) {$("#dirviewrefresh").trigger( "click" );}
							if (e) {

								$("#folderreadstatus").html("Copying ...");
								$('.exploelement, .exploelementfolderup').css("filter","opacity(46%)");

								$("#undo", window.parent.document).attr("data-tooltip", "UNDO (copy)");
								undo.class = "copy";
								undo.copy.rootfiles = droppedarchive;
								undo.copy.rootfolders = droppedfolder;
								undo.copy.root = targetfolder;
								undo.copy.originalroot = rootdirectory;
								undo.copy.addedfileids = [];
								undo.copy.addedfolderids = [];


								var idcarpetasaduplicar = []; //posteriormente se duplicaran todos los archivos que tengan este filefolder poniéndoles por filefolder idcarpetasduplicadas.
								var idcarpetasduplicadas = [];

								// copiamos cada una de las carpetas
								var flagg = 0;

								$.each(droppedfolder, function(t) {

									fs.copy(driveunit + rootdirectory + droppedfolder[t].children[1].attributes[1].value, driveunit + targetfolder + droppedfolder[t].children[1].attributes[1].value, { clobber: true }, function(err) {

										flagg++;

										if (flagg == droppedfolder.length && droppedarchive.length == 0) { //para que haga el refresco tras mover la última carpeta

											// para que refresque el filetree también si tuviera carpetas
											if(droppedfolder.length > 0) {

												timetowait = droppedfolder.length * 30;
												setTimeout(function() {
													$.each ($("#filetree span"), function(l) {

														if($("#filetree span:eq("+l+")").attr("rel2") == targetfolder) {

															// contraer y expandir
															$("#filetree span:eq("+l+")").trigger( "click" );
															$("#filetree span:eq("+l+")").trigger( "click" );

														}

													});

													previousornext = "refresh"; // para refrescar sin añadir al array de los direcciones visitadas
													readDirectory(dirtoexec);

												}, timetowait);

											} else {

												previousornext = "refresh"; // para refrescar sin añadir al array de los direcciones visitadas
												readDirectory(dirtoexec);
											}

										}

									});

								});

								// trabajamos con las carpetas

								window.idcarpetadestino = [];

								// primero detectamos si la carpeta destino esta en la bs para coger su id si fuera necesario
								var trans31 = db.transaction(["folders"], "readwrite")
								var objectStore31 = trans31.objectStore("folders")
								var req31 = objectStore31.openCursor();

								req31.onerror = function(event) {
									console.log("error: " + event);
								};
								req31.onsuccess = function(event) {
									var cursor = event.target.result;
									if (cursor) {
										$.each(droppedfolder, function(t) {

											foldername[t] = droppedfolder[t].children[1].attributes[1].nodeValue;

											if (cursor.value.folder == targetfolder + foldername[t]) { //y en des

												idcarpetadestino[t] = cursor.value.folderid;

											}

											// para el undo tiene que ir así, si se pone una propiedad del tipo undo.copy.rootfolders no funciona
											undocopyrootfolders[t] = foldername[t];

										});

										cursor.continue();
									}
									else { // si todavia no hay ninguna carpeta en la base de datos
										$.each(droppedfolder, function(t) {

											foldername[t] = droppedfolder[t].children[1].attributes[1].nodeValue;
											undocopyrootfolders[t] = foldername[t];

										});

									}
								}

								trans31.oncomplete = function(event) {

									// detectamos si la carpeta origen esta en la base de datos
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

												var carpetapreviamenteexistente = "no"

												var folderupdate = {};

												foldername[t] = droppedfolder[t].children[1].attributes[1].nodeValue;

												if (cursor.value.folder == rootdirectory + foldername[t]) { // si hay carpeta con nombre en origen

													if (idcarpetadestino[t]) { // y en destino ya existía la carpeta en la bd

														folderupdate.folderid = idcarpetadestino[t]; // utilizamos el id que ya tenía
														carpetapreviamenteexistente = "yes";

													}

													idcarpetasaduplicar[t] = cursor.value.folderid;
													// si está la carpeta creamos una igual con la nueva dirección
													folderupdate.folder = targetfolder + foldername[t];
													folderupdate.foldertags = cursor.value.foldertags;

													var res20 = objectStore.put(folderupdate);

													res20.onerror = function(event){
														console.log("error ruta carpeta no añadida: " + event);
													}

													res20.onsuccess = function(event){

														if (carpetapreviamenteexistente == "no") {
															var key = event.target.result;
															undo.copy.addedfolderids.push(key)
														}

														// hay que mirar si hay ficheros con el id de la carpeta madre original y duplicarlos en la base de datos poniéndoles el id de la nueva carpeta
														idcarpetasduplicadas[t] = event.target.result;

														var trans12 = db.transaction(["files"], "readwrite")
														var objectStore12 = trans12.objectStore("files")
														var req12 = objectStore12.openCursor();

														req12.onerror = function(event) {

															console.log("error: " + event);

														};

														req12.onsuccess = function(event) {

															var cursor12 = event.target.result;

															if(cursor12){

																if (cursor12.value.filefolder == idcarpetasaduplicar[t]) {

																	// creamos nuevo fichero en db
																	fileupdate.filefolder = idcarpetasduplicadas[t];
																	fileupdate.filename = cursor12.value.filename;
																	fileupdate.fileext = cursor12.value.fileext;
																	fileupdate.filetags = cursor12.value.filetags;

																	var res13 = objectStore12.put(fileupdate);

																	res13.onerror = function(event){
																		console.log("error: " + event);
																	}

																	res13.onsuccess = function(event){

																		var key = event.target.result;
																		undo.copy.addedfileids.push(key)

																	}

																}

																cursor12.continue()

															}

														}

														trans12.oncomplete = function(event) {

															$.each ($("#filetree span"), function(l) {

																if($("#filetree span:eq("+l+")").attr("rel2") == targetfolder) {

																	// contraer y expandir
																	$("#filetree span:eq("+l+")").trigger( "click" );
																	$("#filetree span:eq("+l+")").trigger( "click" );

																}

															});

														}

													}

												}

												// quizás se puede añadir un else para que si la carpeta origen no esta en la base de datos, al hacer el copy  eliminar los tags de la carpeta destino si los tuviera

											});

											cursor.continue();

										}

									}

									trans.oncomplete = function(event) {

										// antes de mover físicamente las carpetas vamos a recorrerlas recursivamente para recoger los datos de todas las subcarpetas que contenga

										var arraydecarpetas = {};
										var arraydecarpetasDest = {};
										var posicion = 0;

										undo.copy.folders = [];
										undo.copy.originalfolders = [];

										$.each(droppedfolder, function(t) {

											foldertoread = rootdirectory + droppedfolder[t].children[1].attributes[1].value; // recogemos el value de cada carpeta

											recursivefolderdata(foldertoread);

											function recursivefolderdata(foldertoread) {

												var directoryelement = []
												var directorycontent = []
												var directoryfolders = []
												var directoryarchives = []

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

												$.each(directoryfolders, function(t){

													arraydecarpetas[posicion] = foldertoread + directoryfolders[t].name;
													posicion++
													recursivefolderdata(foldertoread + directoryfolders[t].name);

												});

											}

										});

										$.each(arraydecarpetas, function(t){

											arraydecarpetasDest[t] = arraydecarpetas[t].replace(rootdirectory, targetfolder);

										});

										// console.log("original folders:");
										// console.log(arraydecarpetas);
										// console.log("destination folders:");
										// console.log(arraydecarpetasDest);

										undo.copy.folders = arraydecarpetasDest;
										undo.copy.originalfolders = arraydecarpetas;

										var idsubcarpetadestino = [];

										$.each(arraydecarpetas, function(t) {

											var updatefolder = {};
											var fileupdate = {};

											var carpetapreviamenteexistente = "no"

											// primero detectamos si la subcarpeta destino esta en la bs para coger su id si fuera necesario
											var trans32 = db.transaction(["folders"], "readonly")
											var objectStore32 = trans32.objectStore("folders")
											var req32 = objectStore32.openCursor();

											req32.onerror = function(event) {
												console.log("error: " + event);
											};
											req32.onsuccess = function(event) {
												var cursor = event.target.result;
												if (cursor) {

													if (cursor.value.folder == arraydecarpetasDest[t]) { //y en des

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

												req10.onerror = function(event) {
													console.log("error: " + event);
												};
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

															res11.onerror = function(event){
																console.log("error ruta subcarpeta no agregada: " + event);
															}

															res11.onsuccess = function(event){

																if (carpetapreviamenteexistente == "no") {

																	var key = event.target.result;
																	undo.copy.addedfolderids.push(key)

																}

				    											idcarpetasduplicadas[t] = event.target.result;

																var trans12 = db.transaction(["files"], "readwrite")
																var objectStore12 = trans12.objectStore("files")
																var req12 = objectStore12.openCursor();

																req12.onerror = function(event) {

																	console.log("error: " + event);

																};

																req12.onsuccess = function(event) {

																	var cursor12 = event.target.result;

																	if(cursor12){

																		if (cursor12.value.filefolder == idcarpetasaduplicar[t]) {

																			// creamos nuevo fichero en db
																			fileupdate.filefolder = idcarpetasduplicadas[t];
																			fileupdate.filename = cursor12.value.filename;
																			fileupdate.fileext = cursor12.value.fileext;
																			fileupdate.filetags = cursor12.value.filetags;

																			var res13 = objectStore12.put(fileupdate);

																			res13.onerror = function(event){
																				console.log("error: " + event);
																			}

																			res13.onsuccess = function(event){

																				var key = event.target.result;
																				undo.copy.addedfileids.push(key)

																			}

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

										// como los archivos (al menos uno) tienen tags se comprueba si la carpeta de destino esta en la bd

										var destfolderid = "";
										var originfolderid = "";

										var trans3 = db.transaction(["folders"], "readonly")
										var objectStore3 = trans3.objectStore("folders")
										var req3 = objectStore3.openCursor();

										req3.onerror = function(event) {
											console.log("error: " + event);
										};
										req3.onsuccess = function(event) {

											var cursor3 = event.target.result;
											if (cursor3) {
												if (cursor3.value.folder == targetfolder) {

													destfolderid = cursor3.value.folderid;

												}
												// también aprovechamos para sacar el id de la carpeta origen (para luego buscar los archivos en la bd)
												if(cursor3.value.folder == rootdirectory){

													originfolderid = cursor3.value.folderid;

												}
												cursor3.continue();

											}
										}
										trans3.oncomplete = function(event) {

											var fileupdate = {};

											var refrescohecho1 = "no";

											if (destfolderid == "") { // si la carpeta de destino NO estaba en la base de datos (no tiene id)

												// añadimos la carpeta a la bd pues los archivos a pasar tiene tags
												var trans4 = db.transaction(["folders"], "readwrite")
												var request4 = trans4.objectStore("folders")
												.put({ folder: targetfolder, foldertags: [] }); // el id no hace falta pues es autoincremental

												request4.onerror = function(event){

													console.log("error carpeta destino no añadida a bd: " + event);

												}

												request4.onsuccess = function(event){

													// console.log("carpeta destino añadida a bd!");

													var key = event.target.result;
													undo.copy.addedfolderids.push(key)

												}

												trans4.oncomplete = function(e) { // vamos a tomar el id de la carpeta añadida

													var trans5 = db.transaction(["folders"], "readonly")
													var objectStore5 = trans5.objectStore("folders")
													var req5 = objectStore5.openCursor();

													req5.onerror = function(event) {

														console.log("error: " + event);

													};

													req5.onsuccess = function(event) {

														var cursor5 = event.target.result;

														if(cursor5){

															if(cursor5.value.folder == targetfolder){

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

														req6.onerror = function(event) {

															console.log("error: " + event);

														};

														req6.onsuccess = function(event) {

															var cursor6 = event.target.result;

															if(cursor6){

																if(cursor6.value.filefolder == originfolderid){

																	$.each(droppedarchive, function(t) {

																		if (cursor6.value.filename == droppedarchive[t].children[1].attributes[1].value) {

																			fileupdate.filefolder = destfolderid;
																			fileupdate.filename = cursor6.value.filename;
																			fileupdate.fileext = cursor6.value.fileext;
																			fileupdate.filetags = cursor6.value.filetags;

																			// actualizamos los archivos en la bd con el nuevo filefolder
																			var res7 = objectStore6.put(fileupdate);


																			res7.onerror = function(event){
																				console.log("error ruta archivo no cambiada: " + event);
																			}

																			res7.onsuccess = function(event){

																				var key = event.target.result;
																				undo.copy.addedfileids.push(key);

																			}

																		}

																	});

																}

																cursor6.continue();
															}

														}
														trans6.oncomplete = function(event) {

															// copiamos los archivos
															var flagg = 0;
															$.each(droppedarchive, function(t) {

																fs.copy(driveunit + rootdirectory + droppedarchive[t].children[1].attributes[1].value, driveunit + targetfolder + droppedarchive[t].children[1].attributes[1].value, function(err) {
																});

																flagg++;
																if (flagg == droppedarchive.length && refrescohecho1=="no") { // para que haga el refresco tras mover la última carpeta

																	refrescohecho1 = "si";
																	previousornext = "refresh"; // para refrescar sin añadir al array de los direcciones visitadas
																	readDirectory(dirtoexec);
																}

															});

														}

													}

												}

											}

											else { // si la carpeta de destino ya estaba en la bd

												// primero borramos de la base de datos los archivos que están asociados a la carpeta destino que vamos a sobrescribir con la operación de copia

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


												// ahora añadimos los archivos a la base de datos poniendo el destfolderid como el filefolder de cada archivo que este en la bd

												var refrescohecho2 = "no";

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

															if(cursor6.value.filefolder == originfolderid){

																if (cursor6.value.filename == droppedarchive[t].children[1].attributes[1].value) {

																	fileupdate.filefolder = destfolderid;
																	fileupdate.filename = cursor6.value.filename;
																	fileupdate.fileext = cursor6.value.fileext;
																	fileupdate.filetags = cursor6.value.filetags;

																	// añadimos los archivos en la bd con el nuevo filefolder
																	var res7 = objectStore6.put(fileupdate);

																	res7.onerror = function(event){
																		console.log("error ruta archivo no cambiada: " + event);
																	}

																	res7.onsuccess = function(event){

																		var key = event.target.result;
																		undo.copy.addedfileids.push(key);

																	}

																}

															}

															cursor6.continue();
														}

													}

												});

												// copiamos los archivos
												var flagg = 0;
												$.each(droppedarchive, function(t) {

													fs.copy(driveunit + rootdirectory + droppedarchive[t].children[1].attributes[1].value, driveunit + targetfolder + droppedarchive[t].children[1].attributes[1].value, function(err) {

														flagg++;

														if (flagg == droppedarchive.length && refrescohecho2=="no") {

															refrescohecho2 = "si";
															// para que refresque el filetree tambien si tuviera carpetas
															if(droppedfolder.length > 0) {

																timetowait = droppedfolder.length * 30;
																setTimeout(function() {
																	$.each ($("#filetree span"), function(l) {

																		if($("#filetree span:eq("+l+")").attr("rel2") == targetfolder) {

																			// contraer y expandir
																			$("#filetree span:eq("+l+")").trigger( "click" );
																			$("#filetree span:eq("+l+")").trigger( "click" );

																		}

																	});

																	previousornext = "refresh"; // para refrescar sin añadir al array de los direcciones visitadas
																	readDirectory(dirtoexec);

																}, timetowait);

															} else {

																previousornext = "refresh"; // para refrescar sin añadir al array de los direcciones visitadas
																readDirectory(dirtoexec);
															}

														}

													});

												});

											}

										}

									}
									else { // si los archivos no tienen tag

										// se copian los archivos y ya esta
										var fflagg = 0;

										$.each(droppedarchive, function(t) {

											fs.copy(driveunit + rootdirectory + droppedarchive[t].children[1].attributes[1].value, driveunit + targetfolder + droppedarchive[t].children[1].attributes[1].value, function(err) {

												fflagg++;

												if (fflagg == droppedarchive.length) { // para que haga el refresco tras mover la última carpeta

													// se le va a dar algo de tiempo antes del refresco por si también se hubieran movido carpetas
													if(droppedfolder.length > 0) {
														timetowait = droppedfolder.length * 30

													} else {
														timetowait = 0;
													}
													setTimeout(function() {

														previousornext = "refresh"; // para refrescar sin añadir al array de los direcciones visitadas
														readDirectory(dirtoexec);

													}, timetowait);

												}

											});

										});

									}

								}

							}

						});







					} // --fin si la carpeta origen y destino son distintas

					else {

						alertify.alert("Same origin and destination folder.");

						previousornext = "refresh"; // para refrescar sin añadir al array de los direcciones visitadas
						readDirectory(dirtoexec);

					}

				} //-- fin Copiar

		    }

		},

		over: function(e, ui){

			if (ui.draggable["0"].classList.contains("exploelement")) {

	            $(this).addClass('directoryonhover');

	        };

        },

        out: function(e, ui){

        	if (ui.draggable["0"].classList.contains("exploelement")) {

        		$(this).removeClass('directoryonhover');

        	}

        }

	}); // fin exploelement droppable


	// Lo siguiente es sustitutivo de press & hold (consume muchos menos recursos)

	var timeoutId = 0;
	var elemento = ""
	var startDate = "";
	var endDate   = "";


	$('.exploelementfolderup').on('mousedown', function() {

		elemento = this
		presshold()

	});

	$('.explofile, .explofolder, .exploelement>div:first-child, .progress-bar').on('mousedown', function() {

		elemento = this
		startDate = new Date();

		if (!$(this).children().hasClass("editing") && !$(this).hasClass("jpg") && !$(this).hasClass("jpeg") && !$(this).hasClass("png") && !$(this).hasClass("gif") && !$(this).hasClass("bmp") && !$(this).hasClass("svg") && !$(this).hasClass("xbm") && !$(this).hasClass("ico") && !$(this).children().children().hasClass("playpause")){ //si no se esta editando ni es imagen (que se abrirá con el abigimage) ni multimedia (por los controles)


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
    			$(this).parent()[0].lastChild.style.width = $(this).parent().width() + "px"

    		} else {
    			$(this).parent()[0].lastChild.style.width = "200px"
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
				endDate = new Date();
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

		if (!$(elemento).hasClass("exploelementfolderup")) {
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
		}


		if ($(elemento).hasClass("explofile")) {

			if (dirtoexec == driveunit + "\/") {
				dirtoexec = driveunit;
			}

			var toexec = $(elemento)["0"].attributes[1].nodeValue;
			var aejecutar = dirtoexec + toexec;

			// console.log(aejecutar)

			aejecutar = aejecutar.replace(/\//g, '/'); // se pone \ en vez de / para poder ejecutar en varios sistemas

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

			if (dirtoexec == driveunit) {
				dirtoexec = driveunit + "\/";
			}

		}

		if ($(elemento).hasClass("explofolder")) {

			if (dirtoexec == driveunit + "\/") {
				dirtoexec = driveunit;
			}

			// acceder a la carpeta
			var carpeta = $(elemento)["0"].attributes[1].nodeValue;
			previousornext = "normal"
			readDirectory(dirtoexec + carpeta);

		}

		if ($(elemento).hasClass("exploelementfolderup")) {

			if (driveunit != dirtoexec) { // para que en linux (y windows) no se suba de carpeta si esta en raiz de una unidad externa (o interna)
				var directoryup = dirtoexec.substr(0, dirtoexec.lastIndexOf("/"));
			}
			else {
				var directoryup = dirtoexec; // directorio actual, raiz. (no sube)
			}

			if (directoryup.indexOf('\/') > -1) { // si la ruta ya tiene algún /
				previousornext = "normal";
				readDirectory(directoryup);
			} else { // si no, se le añade / al final (pues sera la carpeta raiz por ejemplo c: y necesita ser C:/)
				directoryup = directoryup + "\/";
				previousornext = "normal";
				readDirectory(directoryup);
			}

		}

		if ($(elemento).hasClass("imgmode"+viewmode+"")) {

			if ($(elemento).next().hasClass("explofile")) {

				if (dirtoexec == driveunit + "\/") {
					dirtoexec = driveunit;
				}

				var toexec = $(elemento)["0"].nextElementSibling.attributes[1].nodeValue;
				var aejecutar = dirtoexec + toexec;

				aejecutar = aejecutar.replace(/\//g, '/'); // se pone \ en vez de / para poder ejecutar en varios sistemas

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

				if (dirtoexec == driveunit) {
					dirtoexec = driveunit + "\/";
				}


			}

			if ($(elemento).next().hasClass("explofolder")) {

				if (dirtoexec == driveunit + "\/") {
					dirtoexec = driveunit;
				}

				// acceder a la carpeta
				var carpeta = $(elemento)["0"].nextElementSibling.attributes[1].nodeValue;
				previousornext = "normal"
				readDirectory(dirtoexec + carpeta);

			}

		}

	} //fin function presshold


	// Selector

	var elementpreviousindex = 0;
	var elementcurrentindex = 0;
	var nombreelementoprevio = "";

	$("#directoryview > div").on('mouseup', function(e) {

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
						$(this).addClass("ui-selecting");
						$(this).removeClass("whitebackground");

						var nombreelemento = $(this)["0"].children[1].attributes[1].nodeValue

					}



					if(e.shiftKey) { // si se pulsa shift seleccionar las que quedan entre la anterior selección y la actual

					 	$.each ($("#directoryview > div"), function(u) {

							if (u>0) { // para evitar la carpeta ".." que no tiene propiedades y da error por undefined

								if ($("#directoryview > div:eq("+u+")")["0"].children[1].attributes[1].nodeValue == nombreelementoprevio ) {
									elementpreviousindex = u;
								}

								if ($("#directoryview > div:eq("+u+")")["0"].children[1].attributes[1].nodeValue == nombreelemento ) {
									elementcurrentindex = u;
								}
							}

						});


						if (elementpreviousindex > 0) {

							if (elementpreviousindex > elementcurrentindex) {

								$.each ($("#directoryview > div"), function(u) {

									if (u >= elementcurrentindex && u <= elementpreviousindex) {
										$("#directoryview > div:eq("+u+")")["0"].classList.add("ui-selecting");
										$("#directoryview > div:eq("+u+")")["0"].classList.remove("whitebackground");

									}

								});

							} else if (elementpreviousindex < elementcurrentindex) {

								$.each ($("#directoryview > div"), function(u) {

									if (u <= elementcurrentindex && u >= elementpreviousindex) {
										$("#directoryview > div:eq("+u+")")["0"].classList.add("ui-selecting");
										$("#directoryview > div:eq("+u+")")["0"].classList.remove("whitebackground");

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


	$( "#dirview" ).selectable({

		filter: '.exploelement',
		cancel: '.tagticket, .mmcontrols',
		selecting: function(e, ui) { // on select
			elementpreviousindex = 0; // restear la selección múltiple con shift
		}
	}); // esto también aplica al DRAGGABLE


	// -- fin Selector


	// Editar nombre (activar)

	$.each ($(".explofolder span"), function (i) {

		activateeditname($(".explofolder span:eq("+i+")"));

	});
	$.each ($(".explofile span"), function (i) {

		activateeditname($(".explofile span:eq("+i+")"));

	});

} // --fin interactions


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

				// si es carpeta

				if ($(this).parent().is(".explofolder")) {

					elementochangevalue = $(this).parent();

					// primero se busca en la base de datos si estába la carpeta con el nombre original
					var trans = db.transaction(["folders"], "readonly");
					var objectStore = trans.objectStore("folders");
					var req = objectStore.openCursor();

					req.onerror = function(event) {

						console.log("error: " + event);
					};

					req.onsuccess = function(event) {

						var cursor = event.target.result;

						if(cursor){

							if (cursor.value.folder == rootdirectory + "\/" + nombreoriginal) {

								idacambiar = cursor.value.folderid
								tagsdelelemento = cursor.value.foldertags; // este parámetro se usará a la hora de actualizar el item en el treeview si está desplegado

							}

							cursor.continue()

						}

					}

					trans.oncomplete = function(event) {

						if (idacambiar != "") { // si estába en la base de datos

							var folderupdate = {};

							// se cambia el atributo value del explofolder
							elementochangevalue[0].setAttribute("value", "\/" + nombrenuevo);

							var trans = db.transaction(["folders"], "readonly")
							var objectStore = trans.objectStore("folders")
							var req = objectStore.openCursor();

							req.onerror = function(event) {

								console.log("error: " + event);
							};

							req.onsuccess = function(event) {

								var cursor = event.target.result;

								if(cursor){

									if (cursor.value.folderid == idacambiar) {

										folderupdate.folderid = cursor.value.folderid;
										folderupdate.foldertags = cursor.value.foldertags;
										folderupdate.folder = rootdirectory + "\/" + nombrenuevo;
									}

									cursor.continue();
								}

							}

							trans.oncomplete = function(e) {

								// cambiamos nombre en db
								var trans = db.transaction(["folders"], "readwrite")
								var request = trans.objectStore("folders")
									.put(folderupdate);

								request.onerror = function(event) {

									console.log("error: nombre carpeta sin cambiar en db");

								};
								request.onsuccess = function(event) {

									// console.log("nombre carpeta cambiado en db");

									// cambiamos nombre en filesystem
									fs.rename(dirtoexec + '\/' + nombreoriginal, dirtoexec + '\/' + nombrenuevo, function(err) {
									if ( err ) console.log('ERROR: ' + err);
									});

									$("#undo", window.parent.document).attr("data-tooltip", "UNDO (rename folder)");
									undo.class = "rename folder";
									undo.rename.folder= dirtoexec;
									undo.rename.original = nombreoriginal;
									undo.rename.nuevo = nombrenuevo;
									undo.rename.indb = "yes";
									undo.rename.id = folderupdate.folderid;

								}

								trans.oncomplete = function(event) {

									// hay que mirar si hay subcarpetas cuyo path inicie con el path de la carpeta madre a la que sele ha hecho el cambio de nombre
									var folderupdate=[];

									var pathachequear = rootdirectory + "\/" + nombreoriginal;
									var pathaponer = rootdirectory + "\/" + nombrenuevo;

									var trans = db.transaction(["folders"], "readwrite")
									var objectStore = trans.objectStore("folders")
									var req = objectStore.openCursor();

									req.onerror = function(event) {

										console.log("error: " + event);
									};

									req.onsuccess = function(event) {

										var cursor = event.target.result;

										if(cursor){

											if(cursor.value.folder.substring(0, pathachequear.length) == pathachequear) { // si empieza por el path antiguo

												if(cursor.value.folder != pathaponer) {

													var newname = cursor.value.folder.replace(pathachequear, pathaponer);

													folderupdate.folderid = cursor.value.folderid;
													folderupdate.foldertags = cursor.value.foldertags;
													folderupdate.folder = newname;

													var res20 = objectStore.put(folderupdate);

													res20.onerror = function(event){
														console.log("error ruta subcarpeta no cambiada: " + event);
													}

													res20.onsuccess = function(event){

														// console.log("ruta subcarpeta cambiada");

													}

												}

											}

											cursor.continue();

										}

									}

								}

							}

						} // --fin if en base de datos
						else { // si no estába en base de datos

							// se cambia el atributo value del explofolder
							elementochangevalue[0].setAttribute("value", "\/" + nombrenuevo);

							// cambiamos el nombre en el filesystem
							fs.rename(dirtoexec + '\/' + nombreoriginal, dirtoexec + '\/' + nombrenuevo, function(err) {
								if ( err ) console.log('ERROR: ' + err);
							});

							// hay que mirar si hay subcarpetas cuyo path inicie con el path de la carpeta madre a la que sele ha hecho el cambio de nombre
							var folderupdate=[];

							var pathachequear = rootdirectory + "\/" + nombreoriginal;
							var pathaponer = rootdirectory + "\/" + nombrenuevo;

							var trans = db.transaction(["folders"], "readwrite")
							var objectStore = trans.objectStore("folders")
							var req = objectStore.openCursor();

							req.onerror = function(event) {

								console.log("error: " + event);
							};

							req.onsuccess = function(event) {

								var cursor = event.target.result;

								if(cursor){

									if(cursor.value.folder.substring(0, pathachequear.length) == pathachequear) { // si empieza por el path antiguo


										var newname = cursor.value.folder.replace(pathachequear, pathaponer);

										folderupdate.folderid = cursor.value.folderid;
										folderupdate.foldertags = cursor.value.foldertags;
										folderupdate.folder = newname;

										var res20 = objectStore.put(folderupdate);

										res20.onerror = function(event){
											console.log("error ruta subcarpeta no cambiada: " + event);
										}

										res20.onsuccess = function(event){

											// console.log("ruta subcarpeta cambiada");

										}

									}

									cursor.continue();

								}

							}

							$("#undo", window.parent.document).attr("data-tooltip", "UNDO (rename folder)");
							undo.class = "rename folder";
							undo.rename.folder= dirtoexec;
							undo.rename.original = nombreoriginal;
							undo.rename.nuevo = nombrenuevo;
							undo.rename.indb = "no";

						}

						// tras haber hecho los cambios en el directoryview vamos a comprobar si el folder esta desplegado en el treeview y en tal caso le hacemos el cambio

						$.each ($("#filetree span"), function(i) {

							if (driveunit + $("#filetree span")[i].getAttribute("rel2") == dirtoexec + nombreoriginal || driveunit + $("#filetree span")[i].getAttribute("rel2") == dirtoexec + "\/" + nombreoriginal) { // si está visible

								$("#filetree span")[i].setAttribute("rel", '\/' + nombrenuevo);
								$("#filetree span")[i].setAttribute("rel2", rootdirectory + '\/' + nombrenuevo);
								$("#filetree span")[i].innerHTML = '<div class="holdButtonProgress"></div>' + nombrenuevo + '<div class="id"></div><div class="fttags">' + tagsdelelemento + '</div>';

								if (typeof tagsdelelemento == "string") {
									arraydetags = tagsdelelemento.split(','); // volvemos a convertirlo en array (aunque solo haya un tag)
								}
								else {
									arraydetags = tagsdelelemento;
								}
								var tagsdivs = "";
								for(var k = 0; k < arraydetags.length; k += 1){ // recorremos el array
									tagsdivs += "<div class='tagticket' value='"+ arraydetags[k] +"'>" + arraydetags[k] +  "</div>" ;
								};

								var treeelementtagsinview = $("#filetree span:eq("+i+")")[0].children[2]; // el div tags del treeview

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

						});

					}

				} // --fin si es carpeta

				// si es archivo

				else if ($(this).parent().is(".explofile")) {

					var carpetamadreid = "";
					var archivoenbd="no";
					var paraextensionarchivo = $(this).parent();

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
										fs.rename(dirtoexec + '\/' + nombreoriginal, dirtoexec + '\/' + nombrenuevo, function(err) {

											// en el caso de que se trate de un video cambiar el src
											if ($(this)["0"].parentElement.previousSibling.children[1].nodeName == "VIDEO") {

												$(this)["0"].parentElement.previousSibling.children[1].src = encodeURI(dirtoexec + '\/' + nombrenuevo);
											}

											if ( err ) console.log('ERROR: ' + err);
										});

										// en el caso de que se trate de una imagencambiar el src y href (no permite hacerlo como el video)
										$.each($('#dirview img'), function(n) {
											if($("#dirview img:eq("+n+")").attr('src') == dirtoexec + '\/' + nombreoriginal){
												$("#dirview img:eq("+n+")").attr("src", dirtoexec + '\/' + nombrenuevo);
											}
											if($("#dirview img:eq("+n+")").parent().attr('href') == "file:///" + dirtoexec + '\/' + nombreoriginal){
												$("#dirview img:eq("+n+")").parent().attr("href", "file:///" + dirtoexec + '\/' + nombrenuevo);

											}
										});

										$("#undo", window.parent.document).attr("data-tooltip", "UNDO (rename archive)");
										undo.class = "rename archive";
										undo.rename.folder= dirtoexec;
										undo.rename.original = nombreoriginal;
										undo.rename.nuevo = nombrenuevo;
										undo.rename.indb = "yes";
										undo.rename.id = fileupdate.fileid;

									}

								}

								if (archivoenbd == "no") { // archivo no esta en db

									fs.rename(dirtoexec + '\/' + nombreoriginal, dirtoexec + '\/' + nombrenuevo, function(err) {

										// en el caso de que se trate de un video cambiar el src
										if ($(this)["0"].parentElement.previousSibling.children[1].nodeName == "VIDEO") {

											$(this)["0"].parentElement.previousSibling.children[1].src = encodeURI(dirtoexec + '\/' + nombrenuevo);
										}

										if ( err ) console.log('ERROR: ' + err);
									});

									// en el caso de que se trate de una imagencambiar el src y href (no permite hacerlo como el video)
									$.each($('#dirview img'), function(n) {
										if($("#dirview img:eq("+n+")").attr('src') == dirtoexec + '\/' + nombreoriginal){
											$("#dirview img:eq("+n+")").attr("src", dirtoexec + '\/' + nombrenuevo);
										}
										if($("#dirview img:eq("+n+")").parent().attr('href') == "file:///" + dirtoexec + '\/' + nombreoriginal){
											$("#dirview img:eq("+n+")").parent().attr("href", "file:///" + dirtoexec + '\/' + nombrenuevo);

										}
									});


									$("#undo", window.parent.document).attr("data-tooltip", "UNDO (rename archive)");
									undo.class = "rename archive";
									undo.rename.folder= dirtoexec;
									undo.rename.original = nombreoriginal;
									undo.rename.nuevo = nombrenuevo;
									undo.rename.indb = "no";

								}

							}


						} //-- fin if carpetamadre esta en bd

						if (carpetamadreid == "") {

							fs.rename(dirtoexec + '\/' + nombreoriginal, dirtoexec + '\/' + nombrenuevo, function(err) {

								// en el caso de que se trate de un video cambiar el src
								if ($(this)["0"].parentElement.previousSibling.children[1].nodeName == "VIDEO") {

									$(this)["0"].parentElement.previousSibling.children[1].src = encodeURI(dirtoexec + '\/' + nombrenuevo);
								}

								if ( err ) console.log('ERROR: ' + err);
							});

							// en el caso de que se trate de una imagencambiar el src y href (no permite hacerlo como el video)
							$.each($('#dirview img'), function(n) {
								if($("#dirview img:eq("+n+")").attr('src') == dirtoexec + '\/' + nombreoriginal){
									$("#dirview img:eq("+n+")").attr("src", dirtoexec + '\/' + nombrenuevo);
								}
								if($("#dirview img:eq("+n+")").parent().attr('href') == "file:///" + dirtoexec + '\/' + nombreoriginal){
									$("#dirview img:eq("+n+")").parent().attr("href", "file:///" + dirtoexec + '\/' + nombrenuevo);

								}
							});

							$("#undo", window.parent.document).attr("data-tooltip", "UNDO (rename archive)");
							undo.class = "rename archive";
							undo.rename.folder= dirtoexec;
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


// Tags del Footer

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

				footertagsdivspar += "<div class='footertagticket' value='"+ items[i].tagid + "' position='" + items[i].tagpos + "'> " + items[i].tagid +  "</div>";

			} else { // si la posición es impar

				footertagsdivsinpar += "<div class='footertagticket' value='"+ items[i].tagid + "' position='" + items[i].tagpos + "'> " + items[i].tagid +  "</div>";
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

				footertagsinteractions(); //activa eventos de arrastre para tags de footer

			}

		});

	});

}; // --fin drawfootertags()


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


			//le ponemos la posición del dropp al dragg	utilizando el id
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
						cursor.update(updateData);

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
					top.searcher.drawfootertags();

				}

			}

		}

	});

}



function newTag() {

	popup("newtag");

};

function editTag() {

	popup("edittag");
}





// Funciones para PANEL DESARROLLO ////

function readAllTags() {

	var objectStore = db.transaction("tags").objectStore("tags");

	objectStore.openCursor().onsuccess = function(event) {

		var cursor = event.target.result;
		if (cursor) {
			console.log("Tagtext: " + cursor.value.tagtext + ", Tagpos: " + cursor.value.tagpos + ", Color: " + cursor.value.tagcolor + ", Tagid: " + cursor.value.tagid + ", Tagform: " + cursor.value.tagform);
			cursor.continue();
		}
		else {
			/* alert("No more entries!"); */
		}

	};

};

function funciontemporallistarcarpetascontags() {

	var objectStore = db.transaction("folders").objectStore("folders");

	objectStore.openCursor().onsuccess = function(event) {

		var cursor = event.target.result;
		if (cursor) {
			console.log("Folder: " + cursor.value.folder + ", Foldertags: " + cursor.value.foldertags + ", Folderid: " + cursor.value.folderid);
			cursor.continue();
		}
		else {
			/* alert("No more entries!"); */
		}

	};

};

function funciontemporallistarfilescontags() {

	var objectStore = db.transaction("files").objectStore("files");

	objectStore.openCursor().onsuccess = function(event) {

		var cursor = event.target.result;
		if (cursor) {
			console.log("File: " + cursor.value.filename + ", Filetags: " + cursor.value.filetags + ", Filefolder: " + cursor.value.filefolder + ", Fileid: " + cursor.value.fileid);
			cursor.continue();
		}
		else {
			/* alert("No more entries!"); */

		};

	}

};

function funciontemporallistarcarpetfavoritas() {

	var objectStore = db.transaction("favfolds").objectStore("favfolds");

	objectStore.openCursor().onsuccess = function(event) {

		var cursor = event.target.result;
		if (cursor) {
			console.log("Folder: " + cursor.value.favfoldname);
			cursor.continue();
		}
		else {
			/* alert("No more entries!"); */

		};

	};

};

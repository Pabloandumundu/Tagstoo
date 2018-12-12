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

/* This file was initialy based on jQuery File Tree Plugin https://www.abeautifulsite.net/jquery-file-tree . The plugin is heavily modified to the use on project Tagstoo */

// Este archivo esta inicialmente basado en el jQuery File Tree Plugin pero este plugin ha sido modificado para para incluir el "conector" transformándolo en una función que es llamada en vez del conector externo.
// Tambien se han añadido diferentes interacciones con el usuario, la creación de atributos de etiqueta donde se meten las rutas completas para interactuar con la base de datos, la visualización de las etiquetas asociadas a cada carpeta etc, etc...


// jQuery File Tree Plugin
//
// Version 1.01
//
// Cory S.N. LaViska
// A Beautiful Site (http://abeautifulsite.net/)
// 24 March 2008
//
// Visit http://abeautifulsite.net/notebook.php?article=58 for more information
//
// Usage: $('.fileTreeDemo').fileTree( options, callback )
//
// Options:  root           - root folder to display; default = /
//           script         - location of the serverside AJAX file to use; default = jqueryFileTree.php
//           folderEvent    - event to trigger expand/collapse; default = click
//           expandSpeed    - default = 500 (ms); use -1 for no animation
//           collapseSpeed  - default = 500 (ms); use -1 for no animation
//           expandEasing   - easing function to use on expand (optional)
//           collapseEasing - easing function to use on collapse (optional)
//           multiFolder    - whether or not to limit the browser to one subfolder at a time
//           loadMessage    - Message to display while initial tree loads (can be HTML)
//
// History:
//
// 1.01 - updated to work with foreign characters in directory/file names (12 April 2008)
// 1.00 - released (24 March 2008)
//
// TERMS OF USE
//
// This plugin is dual-licensed under the GNU General Public License and the MIT License and
// is copyright 2008 A Beautiful Site, LLC.
//


window.driveunit = localStorage["selecteddriveunit"];
window.colortagstoo = localStorage["colortagstoo"];
var treedirecorytolist = driveunit + "\/"; //ESTO CREO QUE SOLO ES EN CASO DE WINDOWS mirar https://github.com/resin-io-modules/drivelist
var carpetas = treedirecorytolist;
var newrefresh="no";

var Sniffr = window.top.Sniffr;
var agent = navigator.userAgent;
window.s = "";
s = new Sniffr();
s.sniff(agent);

if(jQuery) (function ($){

    // el conector transformado en una función, solo se utilizan los folders pero es la misma función de lectura de elementos que la utilizada en el  directoryview
	function getdirlist (tdirtoread) {

	 	var tdirectorycontent = []; // en esta variable se meten archivos y directorios
	    var tdirectoryarchives = []; // en esta variable se meten los archivos
	    var tdirectoryfolders = []; // en esta variable se meten los directorios

		var tdirtoreadcheck = ""
	    var tdirectoryelement = {};
	    var tdirectorycontent = [];

	    if (newrefresh=="yes") {
	    	tdirtoread = driveunit + "\/";
	    }

	    var treadedElements = fs.readdirSync(tdirtoread);

	    var tre = /(?:\.([^.]+))?$/; // expresión regular para detectar si un string tiene extensión
	    for (i = 0; i < treadedElements.length; i++) {

	        var text = tre.exec(treadedElements[i])[1];

	        // comprobar si es carpeta o archivo
	        tdirtoreadcheck = tdirtoread + treadedElements[i] + "\/";
	        try {
	            var tarorfo = "i_am_an_archive";
	            var tarorfo = fs.readdirSync(tdirtoreadcheck).length;
	        }
	        catch(exception) {};

	        tdirectoryelement.name = treadedElements[i]
	        tdirectoryelement.ext = text;
	        tdirectoryelement.arorfo = tarorfo;

	        copied_tdirectoryelement = jQuery.extend({}, tdirectoryelement); // necesario trabajar con una copia para actualizar el objeto tdirectorycontent
	        tdirectorycontent[i] = copied_tdirectoryelement;
    	};

    	// separa carpetas y archivos en dos objetos (aquí solo son necesarias las carpetas)
	    ii = 0;
	    iii = 0;
	    for (i in tdirectorycontent) {
	        if (tdirectorycontent[i].arorfo != "i_am_an_archive" || tdirectorycontent[i].arorfo == undefined || tdirectorycontent[i].name == "Documents and Settings") {
	            tdirectoryfolders[ii] = tdirectorycontent[i];
	            ii++;
	        } else {
	            tdirectoryarchives[iii] = tdirectorycontent[i];
	            iii++;
	        }
	    }

		r = '<ul class="jqueryFileTree" style="display: none;">';
	   	try {
	       	r = '<ul class="jqueryFileTree" style="display: none;">';
			tdirectoryfolders.forEach(function(f){
	            r += '<li class="directory collapsed"><span rel="\/' + f.name + '" rel2="\/' + f.name + '">' + f.name + '<div class="id"></div><div class="fttags"></div></span></li>';
			});
			r += '</ul>';
		} catch(e) { };

		return r;
	};


	$.extend($.fn, {
		fileTree: function(o, h) {

			// Defaults
			if( !o ) var o = {};
			if( o.root == undefined ) o.root = '/';
			// if( o.script == undefined ) o.script = 'jqueryFileTreeConnector.js';
			if( o.folderEvent == undefined ) o.folderEvent = 'click';
			if( o.folderEvent2 == undefined ) o.folderEvent2 = 'dblclick';
			if( o.folderEvent3 == undefined ) o.folderEvent3 = 'mousedown';
			// if( o.expandSpeed == undefined ) o.expandSpeed= 500;
			if( o.expandSpeed == undefined ) o.expandSpeed= 0;
			// if( o.collapseSpeed == undefined ) o.collapseSpeed= 500;
			if( o.collapseSpeed == undefined ) o.collapseSpeed= 0;
			if( o.expandEasing == undefined ) o.expandEasing = null;
			if( o.collapseEasing == undefined ) o.collapseEasing = null;
			if( o.multiFolder == undefined ) o.multiFolder = true;
			if( o.loadMessage == undefined ) o.loadMessage = 'Loading...';

			$(this).each( function() {
				function showTree(c, carpeta) {

					$(c).addClass('wait');
					$(".jqueryFileTree.start").remove();
					datadir = getdirlist(carpetas);

					function display (datadir) {

						$(c).find('.start').html('');
						$(c).removeClass('wait').append(datadir);
						if( o.root == "t" ) $(c).find('UL:hidden').show(); else $(c).find('UL:hidden').slideDown({ duration: o.expandSpeed, easing: o.expandEasing });
						bindTree(c);
					};

					display(datadir);

				}

				function bindTree(t) {

					// folderEvent -> clic (Expandir y contraer arbol)
					$(t).find('LI span').bind(o.folderEvent, function() {
						if( $(this).parent().hasClass('directory') ) {
							if( $(this).parent().hasClass('collapsed') ) {

								// Expand
								if( !o.multiFolder ) {
									$(this).parent().parent().find('UL').slideUp({ duration: o.collapseSpeed, easing: o.collapseEasing });
									$(this).parent().parent().find('LI.directory').removeClass('expanded').addClass('collapsed');
								}
								$(this).parent().find('UL').remove(); //cleanup

								var expandedspans = $(this).parents('.directory').children('span'); // los span de la/las carpetas expandidas (la carpeta expandida, no los hijos)

								carpetas = ""; // variable global usada para abrir subcarpetas en el árbol
								carpetas2 = ""; // variable global para usarla con la base de datos y meter datos del atributo rel2

									for (i=0; i<expandedspans.length; i++) {
										var item = expandedspans[i].attributes["0"].value; // se toma el valor del atributo rel
										carpetas2 = item + carpetas2; // se usa para la base de datos con los tags y meter datos del atributo rel2

										// para abrir subcarpetas en el árbol:
										item = item.substring(1); // le quitamos la / del principio
										item = item + "\/" // se lo metemos al principio
										carpetas = item + carpetas;
										newrefresh = "no";
									}

								carpetas = treedirecorytolist + carpetas;

								showTree( $(this).parent(), carpetas); // muestra carpetas descendientes

								$(this).parent().removeClass('collapsed').addClass('expanded');

								var subcarpetas = $(this).siblings("ul").children("li").children(); // subcarpetas

								for (i=0; i<subcarpetas.length; i++) {

									var relativosubcarpeta = subcarpetas[i].attributes["0"].value; // se toma el valor del rel (direc. relativa)
									subcarpetas[i].setAttribute("rel2", carpetas2 + relativosubcarpeta); // se utiliza para crear el rel2 (direc. completa) en cada una de las subcarpetas

								}


								// Activar Press And Hold para cada uno de los spans añadidos
								$(this).siblings("ul").children("li").children().pressAndHold({

									holdTime: 200,
									progressIndicatorRemoveDelay: 0,
									progressIndicatorColor: "blue",
									progressIndicatorOpacity: 1

								});

								$(this).siblings("ul").children("li").children().on('start.pressAndHold', function(event) {

							 		if (window.colortagstoo=="not") {
							 			$(this)["0"].children["0"].style.borderRight = "5px solid white";
							 		} else {
							 		$(this)["0"].children["0"].style.borderRight = "5px solid yellow";
							 		}


								});

								$(this).siblings("ul").children("li").children().on('end.pressAndHold', function(event) {

									$(this)["0"].children["0"].style.borderRight = "";

								});

								$(this).siblings("ul").children("li").children().on('complete.pressAndHold', function(event) {						

									if( $(this).parent().hasClass('collapsed') ) {
										$(this).parent().removeClass('collapsed').addClass('expanded');
									} else if( $(this).parent().hasClass('expanded') ) {
										$(this).parent().removeClass('expanded').addClass('collapsed');
									}
									var expandedspans = $(this).parents('.directory').children('span');
									var carpetas = "";
									for (i=0; i<expandedspans.length; i++) {
										var item = expandedspans[i].attributes["0"].value;
										item = item.substring(1); // le quitamos la / del principio
										item = item + "\/"; // se lo metemos al principio
										carpetas = item + carpetas;
									}

									carpetas = carpetas.slice(0,-1); // quitarle la barra del final

									// console.log(driveunit + "\/" + carpetas);

									window.previousornext = "normal";
									readDirectory(driveunit + "\/" + carpetas);

								});


								// Pintar tags para cada uno de los span añadidos
								carpetas = carpetas.substring(1); // le quitamos la / inicial
								subcarpetas = $(this).siblings("ul").children("li").children(); // los subcarpetas (spans)

								var trans = db.transaction(["folders"], "readonly");
								var objectStore = trans.objectStore("folders");
								var req = objectStore.openCursor();

								req.onerror = function(event) {
									console.log("error: " + event);
								};
								req.onsuccess = function(event) {

									var cursor = event.target.result;

									if (cursor) {

										$.each(subcarpetas, function(i) {

											subcarpetarel2 = subcarpetas[i].getAttribute("rel2"); // el atributo rel2 de cada subcarpeta

											if (cursor.value.folder == subcarpetarel2) { // si es igual a ruta completa de la subcarpeta

												// metemos los tags (solo array) en el div tagas del span
												subcarpetas[i].getElementsByClassName("fttags")[0].innerHTML = cursor.value.foldertags;

											}

										});

										cursor.continue();
									}

								}

								trans.oncomplete = function(e) {

									var elementostree = [];
									var elementostreetags = [];
									var tagvalue = [];
									var tagsdivs = [];
									var tagticket = [];

									// ahora se pintan los tags
									// primero creamos divs independientes para cada tags (pero solo con el id)
									var trans = db.transaction(["tags"], "readonly")
									var objectStore = trans.objectStore("tags")

									$.each(subcarpetas, function(i) {

										elementostree[i] = subcarpetas[i].children[2];

										tagsdivs[i]="";

										if (elementostree[i].innerHTML!="") {

											// separamos cada elemento del array (separados por coma) y los metemos en un objeto
											tagticket[i] = elementostree[i].innerHTML.split(',');

											// recorremos el objeto
											for(var k = 0; k < tagticket[i].length; k += 1){

												tagsdivs[i] += "<div class='tagticket' value='"+ tagticket[i][k] +"'> " + tagticket[i][k] +  "</div>" ;
											};

											elementostree[i].innerHTML = tagsdivs[i];


											// ahora se pintarán los estilos de las etiquetas
											elementostreetags[i] = elementostree[i].getElementsByClassName("tagticket");
											$.each(elementostreetags[i], function(n) {

												var req = objectStore.openCursor();

												req.onerror = function(event) {
													console.log("error: " + event);
												};
												req.onsuccess = function(event) {

													var cursor = event.target.result;

													if (cursor) {

														if (cursor.value.tagid == elementostreetags[i][n].attributes[1].value) {

															var color = "#" + cursor.value.tagcolor;
															var complecolor = hexToComplimentary(color);

															elementostreetags[i][n].className += " verysmall " + cursor.value.tagform;
															elementostreetags[i][n].setAttribute("value", cursor.value.tagid);
															elementostreetags[i][n].setAttribute("style", "background-color: #" + cursor.value.tagcolor + ";" + "color: " + complecolor + ";")
															elementostreetags[i][n].innerHTML = cursor.value.tagtext;

														}

														cursor.continue();

													}

												};

											});

										}

									});

								}; // -- fin trans oncomplete
								// -- fin pintar tags


								filetreeinteractions(); // activar interacciones para cada uno de los spans añadidos

							// -- fin expandir (si estába colapsado)
							} else { // colapsar si estába extendido
								// Collapse
								$(this).parent().find('UL').slideUp({ duration: o.collapseSpeed, easing: o.collapseEasing });
								$(this).parent().removeClass('expanded').addClass('collapsed');
							}


						} else { //fin si es directorio, en la versión original del filetree se podían ver ficheros
						}

						return false;

					}); // --fin folderevent click

					// folderEvent2 -> dblclick
					$(t).find('LI span').bind(o.folderEvent2, function() {

						if ($(this).hasClass("selected")){
						 	$(this).removeClass("selected")
						} else {
							$("#filetree ul li span").removeClass("selected")
						 	$(this).addClass("selected")
						}

					});

				}

				// Loading message
				$(this).html('<ul class="jqueryFileTree start"><li class="wait">' + o.loadMessage + '<li></ul>');
				// Get the initial file list
				showTree( $(this), escape(o.root) );

			}); // --fin each

			pressandholdfiletree(); // para activar el press and hold por primera vez una vez se ha cargado el filetree
			filetrerefreshtags(); // para cargar los tags por primera vez
			filetreeinteractions();

			// para quitar la carpeta "Document and Setings" si la creara pues no es capaz de abrir desde aquí
			var recorrercarpetas = $("#filetree li span")
			$.each(recorrercarpetas, function(i) {

				if (recorrercarpetas[i].attributes["1"].value == "\/Documents and Settings" ) {
					recorrercarpetas[i].parentElement.style.display = "none";
				}

			});



			// Función activar Press And Hold para filetree (para la primera vez que se carga)
			function pressandholdfiletree() {

				$("#filetree li span").pressAndHold({

						holdTime: 200,
						progressIndicatorRemoveDelay: 0,
						progressIndicatorColor: "blue",
						progressIndicatorOpacity: 1

				});

				$("#filetree li span").on('start.pressAndHold', function(event) {

				        if (window.colortagstoo=="not") {
				 			$(this)["0"].children["0"].style.borderRight = "5px solid white";
				 		} else {
				 		$(this)["0"].children["0"].style.borderRight = "5px solid yellow";
				 		}

				});

				$("#filetree li span").on('end.pressAndHold', function(event) {

				        $(this)["0"].children["0"].style.borderRight = "";

				});


				$("#filetree li span").on('complete.pressAndHold', function(event) {
					if( $(this).parent().hasClass('collapsed') ) {
						$(this).parent().removeClass('collapsed').addClass('expanded');
					} else if( $(this).parent().hasClass('expanded') ) {
						$(this).parent().removeClass('expanded').addClass('collapsed');
					}
					var expandedspans = $(this).parents('.directory').children('span');
					var carpetas = "";
					for (i=0; i<expandedspans.length; i++) {
						var item = expandedspans[i].attributes["0"].value;
						item = item.substring(1); // le quitamos la / del principio
						item = item + "\/"; // se lo metemos al principio
						carpetas = item + carpetas;
					}

					carpetas = carpetas.slice(0,-1); // quitarle la barra del final

					window.previousornext = "normal";
					readDirectory(driveunit + "\/" + carpetas);

				});

			} // --fin funcion pressandhold

		}

	});

})(jQuery);


// Tags e interacciones que se activan en la primera carga del filetree
function filetrerefreshtags() {

	var currentlydatabaseused_toshow = currentlydatabaseused.replace("tagstoo_", "");
	if (driveunit != "") {
		if (s.os.name != "macos") { //esto es porque en macos añadiremos un espacio por tema visual
			$('#filetree ul li:eq(0)').before(`
				<li class='treeviewinfo'>
					<div class="lang_en">drive: </div>
					<div class="lang_es">unidad: </div>
					<div class="lang_fr">lecteur: </div>
					`+driveunit+`
					<div class="lang_en"> &#9881; database: </div>
					<div class="lang_es"> &#9881; base de datos: </div>
					<div class="lang_fr"> &#9881; base de données: </div>
					`+currentlydatabaseused_toshow+`
				</li>`
			);
		} else {
			$('#filetree ul li:eq(0)').before(`
				<li class='treeviewinfo'>
					<div class="lang_en">drive: </div>
					<div class="lang_es">unidad: </div>
					<div class="lang_fr">lecteur: </div>
					`+driveunit+`
					<div class="lang_en"> &#9881;&nbsp; database: </div>
					<div class="lang_es"> &#9881;&nbsp; base de datos: </div>
					<div class="lang_fr"> &#9881;&nbsp; base de données: </div>
					`+currentlydatabaseused_toshow+`
				</li>`
			);
		}
	} else {
		$('#filetree ul li:eq(0)').before(`
			<li class='treeviewinfo'>
				<div class="lang_en">drive: /</div>
				<div class="lang_es">unidad: /</div>
				<div class="lang_fr">lecteur: /</div>
				`+driveunit+`
				<div class="lang_en"> &#9881; database: </div>
				<div class="lang_es"> &#9881; base de datos: </div>
				<div class="lang_fr"> &#9881; base de données: </div>
				`+currentlydatabaseused_toshow+`
			</li>`
		);
	}
	$('.treeviewinfo').on('click', function() {
		readDirectory(driveunit + "\/")
	});

	language = localStorage["language"];

  	if (language == 'EN') {
		$(".lang_en").css("display", "inline-block");
		$(".lang_es").css("display", "none");
		$(".lang_fr").css("display", "none");
	} else if (language =='ES') {
		$(".lang_en").css("display", "none");
		$(".lang_es").css("display", "inline-block");
		$(".lang_fr").css("display", "none");
	} else if (language == "FR") {
		$(".lang_en").css("display", "none");
		$(".lang_es").css("display", "none");
		$(".lang_fr").css("display", "inline-block");
	}

	// Frases segun idioma

	if (language == 'EN') {

		ph_moving = "Moving ...";
		ph_copying = "Copying ...";
		ph_elementsinfolder = " elements in folder.";
		ph_alr_05 = "Same origin and destination folder.";
		ph_alr_06 = "No elements selected to copy.";
		ph_alr_07 = "No elements selected to move.";
		ph_alr_08 = "No destination folder selected, please double-click in desired folder on left window. Alternatively you can drag and drop elements from right window to folders in left.";
		ph_dato_tagfold = "UNDO (tag folder)";
		ph_dato_move = "UNDO (move)";
		ph_dato_copy = "UNDO (copy)";

	} else if (language =='ES') {

		ph_moving = "Moviendo ...";
		ph_copying = "Copiando ...";
		ph_elementsinfolder = " elementos en carpeta.";
		ph_alr_05 = "Carpeta de destino y origen son la misma.";
		ph_alr_06 = "No hay elementos seleccionados para copiar.";
		ph_alr_07 = "No hay elementos seleccionados para mover.";
		ph_alr_08 = "Ninguna carpeta de destino seleccionada, por favor haga doble clic en la carpeta deseada en la ventana izquierda. Alternativamente, puede arrastrar y soltar elementos de la ventana derecha a las carpetas de la izquierda.";
		ph_dato_tagfold = "DESHACER (etiquetar carpeta)";
		ph_dato_move = "DESHACER (mover)";
		ph_dato_copy = "DESHACER (copiar)";

	} else if (language =='FR') {

		ph_moving = "En déplaçant ...";
		ph_copying = "En copiant ...";
		ph_elementsinfolder = " éléments dans dossier.";
		ph_alr_05 = "Le dossier de destination et la source sont les mêmes.";
		ph_alr_06 = "Aucun élément sélectionné pour copier.";
		ph_alr_07 = "Aucun élément sélectionné pour se déplacer";
		ph_alr_08 = "Aucun dossier de destination sélectionné, s'il vous plaît double-cliquez dans le dossier souhaité sur la fenêtre de gauche. Sinon, vous pouvez faire glisser et déposer des éléments de fenêtre de droite aux dossiers à gauche.";
		ph_dato_tagfold = "DÉFAIRE (étiqueter dossier)";
		ph_dato_move = "DÉFAIRE (déplacer)";
		ph_dato_copy = "DÉFAIRE (copier)";
	}


	var subcarpetas = document.querySelectorAll('.directory span');

	var trans = db.transaction(["folders"], "readonly");
	var objectStore = trans.objectStore("folders");

	var req = objectStore.openCursor();

	req.onerror = function(event) {

		console.log("error: " + event);

	};

	req.onsuccess = function(event) {

		var cursor = event.target.result;

		if (cursor) {

			$.each(subcarpetas, function(i) {

				subcarpetarel = subcarpetas[i].getAttribute("rel2");

				if (cursor.value.folder == subcarpetarel) { // si es igual a ruta completa de la subcarpeta

					// metemos los tags (solo array) en el div tags del span
					subcarpetas[i].getElementsByClassName("fttags")[0].innerHTML = cursor.value.foldertags;
				}

			});

			cursor.continue();

		}

	}

	trans.oncomplete = function(e) {

		// ahora se pintarán los tags
		// primero creamos divs independientes para cada tags (pero solo con el id)
		var trans = db.transaction(["tags"], "readonly")
		var objectStore = trans.objectStore("tags")

		var elementostree = $(".directory .fttags");
		var elementostree = $(".directory .fttags");

		var tagvalue = [];
		var tagsdivs = [];
		var tagticket = [];

		$.each(elementostree, function(i) {

			tagsdivs[i]="";

			if (elementostree[i].innerHTML!="") {

				// separamos cada elemento del array (separados por coma) y los metemos en un objeto
				tagticket[i] = elementostree[i].innerHTML.split(',');

				for(var k = 0; k < tagticket[i].length; k += 1){ // recorremos el objeto

					tagsdivs[i] += "<div class='tagticket' value='"+ tagticket[i][k] +"'> " + tagticket[i][k] +  "</div>" ;

				};
				// se mete el contenido (los tagsticket) en el html
				$( ".directory .fttags:eq( "+ i +" )" ).html(tagsdivs[i]);
				tagsdivs[i] = "";

			}

		});

		// se lee cada etiqueta (solo con id) del html
		elementostreetags = document.querySelectorAll(".directory .fttags .tagticket");

		$.each(elementostreetags, function(i) {

			var req = objectStore.openCursor();

			req.onerror = function(event) {

				console.log("error: " + event);

			};

			req.onsuccess = function(event) {

				var cursor = event.target.result;

				if (cursor) {

					if (cursor.value.tagid == elementostreetags[i].attributes[1].value) {

						var color = "#" + cursor.value.tagcolor;
						var complecolor = hexToComplimentary(color);

						elementostreetags[i].className = "tagticket verysmall " + cursor.value.tagform;
						elementostreetags[i].setAttribute("value", cursor.value.tagid);
						elementostreetags[i].setAttribute("style", "background-color: #" + cursor.value.tagcolor + ";" + "color: " + complecolor + ";")
						elementostreetags[i].innerHTML = cursor.value.tagtext;

					}

					cursor.continue();

				}

			};

		});

	};

}

function filetreeinteractions() {

	$('.jqueryFileTree li span').droppable({

	    accept: '.footertagticket, #directoryview > div',

	    classes: {
  			'ui-droppable-hover': 'filetreeonhover'
		},
		tolerance: 'pointer',
	    drop: handle_drop_patient,

	    drop: function( event, ui ) {	    	

	    	// Añadir tag

        	if (ui.draggable["0"].classList.contains("footertagticket")) { // si es un ticket del bottom o footer

		    	// devolvemos tag a posición original
				ui.draggable["0"].style.top = "0px";
				ui.draggable["0"].style.left = "0px";

				// y actuaremos solo si se ha soltado dentro de algo visible (no en el overflow:hidden)
			    var positiontop = $(this).offset().top // la altura a la que se ha hecho el dropp. (absoluta)
				var wrapperbottom = $('#treeview').position().top + $('#treeview').outerHeight(true); // posicion del limite inferior del wrapper treeview (absoluta)

        		if (positiontop < wrapperbottom) { // soltado bien

		    		if (rootdirectory == "\/") {
						rootdirectory = "";
					}
					rootdirectory = rootdirectory.slice(0);

					taganadir = ui.draggable["0"].attributes[1].value;
					var carpeta = $(this)[0].attributes[0].value;
					var folder = $(this)[0].attributes[1].value; // la ruta completa donde esta el item, rootdirectory es una variable global que irá cambiando

					ffoldertoaddtags = folder; // se utiliza al añadir tags a subelementos, con addtagsubs(), si procede

					var isnew = "yes"; // valor por defecto que dice que la carpeta no estaba previamente en la base de datos
					var folderupdate = {}; // objeto que luego hay que pasar con todos sus valore para hacer un update en la base de datos

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

								var isnewtag = "yes"; // valor por defecto
								var arraydetags = cursor.value.foldertags; // variable temporal donde se mete el array de tags desde el curso para hacer unas comprobaciones a continuación. El array puede estar vació

								for (i in arraydetags) { // recorremos los tags que tenia

									if (arraydetags[i] == taganadir) { // si ya estaba

										isnewtag = "no"; // no se añadirá

										$(".undo", window.parent.document).attr("data-tooltip", ph_dato_tagfold);
										undo.class = "tag folder";
										undo.taggfold.foldid = folderupdate.folderid;
										undo.taggfold.tagid = taganadir;
										undo.taggfold.folder = folderupdate.folder;

										if(localStorage["asktagsubeleents"]=="yes"){
											popup("addtagtosubelements"); // aunque no se añade a la carpeta madre se preguntará, como siempre que sea una carpeta, si se quiere añadir a subelementos
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

									$(".undo", window.parent.document).attr("data-tooltip", ph_dato_tagfold);
									undo.class = "tag folder";
									undo.taggfold.foldid = folderupdate.folderid;
									undo.taggfold.tagid = taganadir;
									undo.taggfold.folder = folderupdate.folder;

									// Actualizar visual
									elementtagsinview = $('.explofolder').filter('[value="' + carpeta + '"]').siblings('.tags');
									arraydetags = arraydetags.toString() // de array a string
									if (elementtagsinview.length != 0) { //si está visible
										elementtagsinview[0].setAttribute("value", arraydetags);

									}

									// se cambian los tags del elemento del array de elementos (para no tener que recargar la carpeta si se cambia viewmode o order)
									$.each (directoryfolders, function(drf){										
										if (directoryfolders[drf].name  == carpeta){
											directoryfolders[drf].tagsid = arraydetags;						
										}
									});

									// se re dibujaran los tags del treeview si están desplegadas las subcarpetas
									$.each ($("#filetree span"), function(t) {

										if($("#filetree span:eq("+t+")").attr("rel2") == undo.taggfold.folder) {

											treeelementtagsinview = $("#filetree span:eq("+t+")")[0].children[2] //el div tags del treeview
										}

									});

									// y ahora redibujamos los tags..
									arraydetags = arraydetags.split(','); // volvemos a convertirlo en array
									var tagsdivs = "";
									for(var k = 0; k < arraydetags.length; k += 1){ // recorremos el array
										tagsdivs += "<div class='tagticket' value='"+ arraydetags[k] +"'>" + arraydetags[k] +  "</div>" ;
									};
									if (elementtagsinview.length != 0) { // si está visible
										elementtagsinview[0].innerHTML = tagsdivs;
									}

									if (treeelementtagsinview) { // si está visible la carpeta en el treeview

										treeelementtagsinview.innerHTML = tagsdivs;
										treeelementosdirectoriotags = treeelementtagsinview.children

										// se pintan los estilos para los tags del treeview
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
										elementstagcopier(); // activa sistema de copiado de tags
										mantenerimagenpointer(); // restaura imagen del pointer si fuera necesario (borrador, copiador de tags)

										if(localStorage["asktagsubeleents"]=="yes"){
											popup("addtagtosubelements");
										}

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
								.put({ folder: folder, foldertags: [taganadir] }); //el id no hace falta pues es autoincremental

							request.onerror = function(event){

								console.log("error tag no añadida: " + event);

							}

							request.onsuccess = function(event){

								// console.log("tag añadida!");

								undo.class = "tag folder";
								undo.taggfold.foldid = event.target.result; // el nuevo id de la carpeta
								undo.taggfold.tagid = taganadir;
								undo.taggfold.folder = folder;

								// Actualizar visual
								elementtagsinview = $('.explofolder').filter('[value="' + carpeta + '"]').siblings('.tags');
								arraydetags = taganadir // solo hay un tag a añadir
								if (elementtagsinview.length != 0) {
									elementtagsinview[0].setAttribute("value", arraydetags);
								}

								// se cambian los tags del elemento del array de elementos (para no tener que recargar la carpeta si se cambia viewmode o order)
								$.each (directoryfolders, function(drf){										
									if (directoryfolders[drf].name  == carpeta){
										directoryfolders[drf].tagsid = arraydetags;						
									}
								});
								
								// se redibujarán los tags del treeview si están desplegadas las subcarpetas
								$.each ($("#filetree span"), function(t) {
									if($("#filetree span:eq("+t+")").attr("rel2") == undo.taggfold.folder) {
										treeelementtagsinview = $("#filetree span:eq("+t+")")[0].children[2] //el div tags del treeview
									}

								});

								// y ahora redibujamos los tags..
								arraydetags = arraydetags.split(','); // volvemos a convertirlo en array (aunque solo haya un tag)
								tagsdivs = "";
								for(var k = 0; k < arraydetags.length; k += 1){ // recorremos el array
									tagsdivs += "<div class='tagticket' value='"+ arraydetags[k] +"'>" + arraydetags[k] +  "</div>" ;
								};
								if (elementtagsinview.length != 0) { // si está visible
									elementtagsinview[0].innerHTML = tagsdivs;
								}

								if (treeelementtagsinview) { // si está visible la carpeta en el treeview

									treeelementtagsinview.innerHTML = tagsdivs;
									treeelementosdirectoriotags = treeelementtagsinview.children;

									// se van pintar los estilos para los tags del treeview
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
									elementstagcopier(); // activa sistema de copiado de tags
									mantenerimagenpointer(); // restaura imagen del pointer si fuera necesario (borrador, copiador de tags)

									if(localStorage["asktagsubeleents"]=="yes"){
										popup("addtagtosubelements");
									}

								}

							}

						}

					} // -- fin trans.oncomplete

		    	}

		    } //--fin if .contains("footertagticket")) { //si es un ticket del bottom o footer


		    // Mover y Copiar

		    if (ui.draggable["0"].classList.contains("exploelement")) {

		    	var numerooriginalelementos = $("#folderreadstatus").html();
	    		numerooriginalelementos = numerooriginalelementos.substr(0,numerooriginalelementos.indexOf(' '));

		    	var pasteaction = window.parent.pasteaction;

		    	var droppedarchive = [];
		    	var droppedfolder = [];
		    	var foldername = [];
		    	var y = 0;
		    	var x = 0;

		    	var alldroppedelement = $(".dragging");

		    	// al hacer el dropp se repite el último elemento si es más de uno, para que no de error sobre todo con el undo se quita el elemento de la lista
				if (alldroppedelement.length > 1) {
					alldroppedelement.splice(-1);
				}

				var targetfolder = $(this)["0"].attributes[1].value;

				$.each (alldroppedelement, function(t) {

					if (alldroppedelement[t].classList.contains("archive")) {

						droppedarchive[y] = alldroppedelement[t]; // archivos droppeados
						y++

					} else if (alldroppedelement[t].classList.contains("folder")) {

						droppedfolder[x] = alldroppedelement[t]; // carpetas droppeadas
						x++
					}

				});


				function updatedestitems() { //pequeña función para actualizar si estuviera en la vista del directorio en n in folder
					$.each ($(".explofolder"), function(ex) {

						if (rootdirectory + $(".explofolder")[ex].attributes[1].value == targetfolder) {

							var arorfo = fs.readdirSync(driveunit + targetfolder).length;
							$(".explofolder")[ex].nextSibling.innerHTML = " " + arorfo + ph_infolder;

							// se cambia valor de items del array de elementos (para no tener que recargar la carpeta si se cambia viewmode o order)
							$.each (directoryfolders, function(drf){
								if (directoryfolders[drf]){ //para que no de error si borra elemento de array
									if (directoryfolders[drf].name == $(".explofolder")[ex].attributes[1].value){
										directoryfolders[drf].arorfo = arorfo;							
									}
								}
							});

						}
					})
				}



				// Mover

				if (pasteaction == "cut") {
					if (rootdirectory != targetfolder) {

						$("#folderreadstatus").html(ph_moving);
						document.querySelectorAll('.exploelement, .exploelementfolderup').forEach(function(el) {
						  el.style.filter = "opacity(46%)";
						});
						$("#filetree ul li span.selected").addClass("animateonce");

						$(".undo", window.parent.document).attr("data-tooltip", ph_dato_move);
						undo.class = "move";
						undo.move.rootfiles = droppedarchive;
						undo.move.rootfolders = droppedfolder;
						undo.move.rootfolderorig = rootdirectory;
						undo.move.rootfoldernew = targetfolder;

						// trabajamos con las carpetas

						var refescohechoporcarpeta = "no";
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


									// antes de mover físicamente las carpetas vamos a recorrerlas recursivamente para recoger los datos de todas las subcarpetas que contenga

									var arraydecarpetas = {};
									var arraydecarpetasDest = {};
									var posicion = 0;

									$.each(droppedfolder, function(t) {

										foldertoread = driveunit + rootdirectory + droppedfolder[t].children[1].attributes[1].value; // recogemos el value de cada carpeta

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
													var arorfo = fs.readdirSync(dirtoreadcheck).length;
												}
												catch(exception) {};

												directoryelement.name = "\/" + readedElements[i]
												directoryelement.arorfo = arorfo;
												directoryelement.id = ""; // se lo metemos después de separar carpetas y archivos (y estará oculto en la vista)
												directoryelement.tagsid = []; //se lo metemos después de separar carpetas y archivos

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

											$.each(directoryfolders, function(m){										

												arraydecarpetas[posicion] = foldertoread.replace(driveunit, "") + directoryfolders[m].name;
												posicion++
												recursivefolderdata(foldertoread + directoryfolders[m].name);

											});										
											
										}

									});

									$.each(arraydecarpetas, function(t){

										arraydecarpetasDest[t] = arraydecarpetas[t].replace(rootdirectory, targetfolder);

									});

									// console.log("original folders:");
									// console.log(arraydecarpetas);
									// console.log("destination folders:");
									//console.log(arraydecarpetasDest);

									undo.move.subfoldersorig = arraydecarpetas;
									undo.move.subfoldersnew = arraydecarpetasDest;

									
									// se va a mirar si en estino hay una carpeta con el mismo nombre en la base de datos y si está se borra de ella

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

										fs.move(driveunit + rootdirectory + foldername[t], driveunit + targetfolder + foldername[t], { clobber: true }, function(err) {

											flagg++;

											if (flagg == droppedfolder.length && refescohechoporcarpeta == "no" && droppedarchive.length == 0) { // para que haga el refresco tras mover la última carpeta y solo lo haga una vez..

												
												previousornext = "refresh"; // para refrescar sin añadir al array de los direcciones visitadas
												readDirectory(dirtoexec);
												refescohechoporcarpeta = "si";

												// para actualizar visual del filetree
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
																			var fflagg=0;
																			$.each(droppedarchive, function(t) {

																				fs.rename(driveunit + rootdirectory + droppedarchive[t].children[1].attributes[1].value, driveunit + targetfolder + droppedarchive[t].children[1].attributes[1].value, function(err) {

																					fflagg++;

																					if (fflagg == droppedarchive.length) { // para que haga el refresco tras mover la última carpeta

																						// se eliminan los elementos del array de elementos (para no tener que recargar la carpeta si se cambia viewmode o order)
																						$.each(droppedarchive, function(t) {
																							$.each (directoryarchives, function(arf){
																								if (directoryarchives[arf]){ //para que no de error si borra elemento de array
																									if (directoryarchives[arf].name == droppedarchive[t].children[1].attributes[1].value){
																										directoryarchives.splice(arf, 1);		
																									}
																								}
																							});
																						});

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
																								$(ui.helper).remove(); //destroy clone
																								$("#folderreadstatus").html(numerooriginalelementos - alldroppedelement.length + ph_elementsinfolder);
																								$('.exploelement, .exploelementfolderup').css("filter","none");

																								updatedestitems();

																							}, timetowait);

																						} else {
																						
																							$(ui.helper).remove(); //destroy clone
																							$("#folderreadstatus").html(numerooriginalelementos - alldroppedelement.length + ph_elementsinfolder);
																							$('.exploelement, .exploelementfolderup').css("filter","none");
																							updatedestitems();
																						}

																					}

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

														// comprobamos si la carpeta origen se queda sin archivos con tags
														var borrarcarpetaorigenbd = "yes"

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

																	// console.log("eliminada carpeta de la bd");

																}

															}

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
											var refrescohecho2="no";
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

														if(cursor6.value.filefolder == originfolderid){

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

																	var fflagg = 0;

																	$.each(droppedarchive, function(t) {

																		fs.rename(driveunit + rootdirectory + droppedarchive[t].children[1].attributes[1].value, driveunit + targetfolder + droppedarchive[t].children[1].attributes[1].value, function(err) {

																			fflagg++;

																			if (fflagg == droppedarchive.length & refrescohecho2=="no") { //para que haga el refresco tras mover la última carpeta

																				// se eliminan los elementos del array de elementos (para no tener que recargar la carpeta si se cambia viewmode o order)
																				$.each(droppedarchive, function(t) {
																					$.each (directoryarchives, function(arf){
																						if (directoryarchives[arf]){ //para que no de error si borra elemento de array
																							if (directoryarchives[arf].name == droppedarchive[t].children[1].attributes[1].value){
																								directoryarchives.splice(arf, 1);		
																							}
																						}
																					});
																				});


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

																							if($("#filetree span:eq("+l+")").attr("rel2") == rootdirectory) {

																								// contraer y expandir
																								$("#filetree span:eq("+l+")").trigger( "click" );
																								$("#filetree span:eq("+l+")").trigger( "click" );

																							}

																						});
																						refrescohecho2="si";					
																						$(ui.helper).remove(); //destroy clone
																						$("#folderreadstatus").html(numerooriginalelementos - alldroppedelement.length + ph_elementsinfolder);
																						$('.exploelement, .exploelementfolderup').css("filter","none");
																						updatedestitems();

																					}, timetowait);

																				} else {
																					refrescohecho2="si";
																					$(ui.helper).remove(); //destroy clone
																					$("#folderreadstatus").html(numerooriginalelementos - alldroppedelement.length + ph_elementsinfolder);
																					$('.exploelement, .exploelementfolderup').css("filter","none");
																					updatedestitems();
																				}

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
													var borrarcarpetaorigenbd = "yes"

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

																// console.log("eliminada carpeta de la bd");

															}

														}

													}

												}

											});

										}

									}

								}
								else {

									// Se mueven los archivos y ya esta

									var fflagg = 0;

									$.each(droppedarchive, function(t) {

										fs.rename(driveunit + rootdirectory + droppedarchive[t].children[1].attributes[1].value, driveunit + targetfolder + droppedarchive[t].children[1].attributes[1].value, function(err) {

											fflagg++;

											if (fflagg == droppedarchive.length) { // para que haga el refresco tras mover la última carpeta

												// se eliminan los elementos del array de elementos (para no tener que recargar la carpeta si se cambia viewmode o order)
												$.each(droppedarchive, function(t) {
													$.each (directoryarchives, function(arf){
														if (directoryarchives[arf]){ //para que no de error si borra elemento de array
															if (directoryarchives[arf].name == droppedarchive[t].children[1].attributes[1].value){
																directoryarchives.splice(arf, 1);		
															}
														}
													});
												});


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
														
														$(ui.helper).remove(); //destroy clone
														$("#folderreadstatus").html(numerooriginalelementos - alldroppedelement.length + ph_elementsinfolder);
														$('.exploelement, .exploelementfolderup').css("filter","none");
														updatedestitems();

													}, timetowait);

												} else {
													
													$(ui.helper).remove(); //destroy clone
													$("#folderreadstatus").html(numerooriginalelementos - alldroppedelement.length + ph_elementsinfolder);
													$('.exploelement, .exploelementfolderup').css("filter","none");
													updatedestitems();
												}

											}

										});

									});

								}

							}

						}

					} // --fin si la carpeta origen y destino son las mismas

					else {
						
						alertify.alert(ph_alr_05);
						previousornext = "refresh"; // para refrescar sin añadir al array de los direcciones visitadas
						readDirectory(dirtoexec);

					}


					setTimeout(function myFunction() {
						$("#filetree ul li span.selected").removeClass("animateonce");
					}, 1000)


				} //-- fin Mover


				// Copiar

				if (pasteaction == "copy") {
					if (rootdirectory != targetfolder) {

						$("#folderreadstatus").html(ph_copying);
						document.querySelectorAll('.exploelement, .exploelementfolderup').forEach(function(el) {
						  el.style.filter = "opacity(46%)";
						});

						$(".undo", window.parent.document).attr("data-tooltip", ph_dato_copy);
						undo.class = "copy";
						undo.copy.rootfiles = droppedarchive;
						undo.copy.rootfolders = droppedfolder;
						undo.copy.root = targetfolder;

						undo.copy.originalroot = rootdirectory;
						undo.copy.addedfileids = [];
						undo.copy.addedfolderids = [];

						undocopyrootfolders=[];

						var idcarpetasaduplicar = []; // posteriormente se duplicaran todos los archivos que tengan este filefolder poniéndoles por filefolder idcarpetasduplicadas.
						var idcarpetasduplicadas = [];





						// copiamos cada una de las carpetas
						var flagg = 0;

						$.each(droppedfolder, function(t) {

							fs.copy(driveunit + rootdirectory + droppedfolder[t].children[1].attributes[1].value, driveunit + targetfolder + droppedfolder[t].children[1].attributes[1].value, { clobber: true }, function(err) {

								flagg++;

								if (flagg == droppedfolder.length && droppedarchive.length == 0) { //para que haga el refresco tras mover la última carpeta

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

											$(ui.helper).remove(); //destroy clone
											$("#folderreadstatus").html(numerooriginalelementos + ph_elementsinfolder);
											$('.exploelement, .exploelementfolderup').css("filter","none");
											updatedestitems();

										}, timetowait);

									} else {

										$(ui.helper).remove(); //destroy clone
										$("#folderreadstatus").html(numerooriginalelementos + ph_elementsinfolder);
										$('.exploelement, .exploelementfolderup').css("filter","none");
										updatedestitems();
									}

								}

							});

						});


						// trabajamos con las carpetas

						idcarpetadestino = [];

						// primero detectamos si la carpeta destino esta en la bs para recoger su id
						var trans31 = db.transaction(["folders"], "readwrite")
						var objectStore31 = trans31.objectStore("folders")
						var req31 = objectStore31.openCursor();

						req31.onerror = function(event) {
							console.log("error: " + event);
						};
						req31.onsuccess = function(event) {
							var cursor31 = event.target.result;
							if (cursor31) {

								$.each(droppedfolder, function(t) {

									foldername[t] = droppedfolder[t].children[1].attributes[1].nodeValue;

									if (cursor31.value.folder == targetfolder + foldername[t]) {

										idcarpetadestino[t] = cursor31.value.folderid;

										// console.log("coincide")

									}

									// para el undo tiene que ir así, si se pone una propiedad del tipo undo.copy.rootfolders no funciona
									undocopyrootfolders[t] = foldername[t];

								});

								cursor31.continue();
							}
							else { // si todavia no hay ninguna carpeta en la base de datos
								$.each(droppedfolder, function(t) {
									foldername[t] = droppedfolder[t].children[1].attributes[1].nodeValue;
									undocopyrootfolders[t] = foldername[t];
								});

							}

						}
						trans31.oncomplete = function(event) {

							// console.log(idcarpetadestino[t])

							// detectamos si la carpeta origen esta en la base de datos
							var trans = db.transaction(["folders"], "readwrite")
							var objectStore = trans.objectStore("folders")
							var req = objectStore.openCursor();

							req.onerror = function(event) {
								console.log("error: " + event);
								console.log(event)
							};
							req.onsuccess = function(event) {

								var cursor = event.target.result;
								if (cursor) {

									$.each(droppedfolder, function(t) {

										var carpetapreviamenteexistente = "no";

										var folderupdate = {};

										foldername[t] = droppedfolder[t].children[1].attributes[1].nodeValue;

										if (cursor.value.folder == rootdirectory + foldername[t]) { // si hay carpeta con nombre en origen

											if (idcarpetadestino[t]) { // y en destino ya existía la carpeta en la bd

												folderupdate.folderid = idcarpetadestino[t]; // utilizamos el id que ya tenia
												carpetapreviamenteexistente = "yes";

											}

											idcarpetasaduplicar[t] = cursor.value.folderid;

											// si está la carpeta creamos una igual con la nueva dirección
											folderupdate.folder = targetfolder + foldername[t]
											folderupdate.foldertags = cursor.value.foldertags

											var res20 = objectStore.put(folderupdate);

											res20.onerror = function(event){
												console.log("error ruta carpeta no añadida: " + event);
												// console.log(event)
											}

											res20.onsuccess = function(event){

												var refrescohecho3 = "no";

												var fileupdate=[];

												if (carpetapreviamenteexistente == "no") {
													var key = event.target.result;
													undo.copy.addedfolderids.push(key)
												}

												// console.log("ruta carpeta agregada");

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

															//creamos nuevo fichero en db
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
																undo.copy.addedfileids.push(key);

															}

														}

														cursor12.continue()

													}

												}

												trans12.oncomplete = function(event) {

													if (refrescohecho3 == "no" && droppedarchive.length == 0) {
														refrescohecho3 = "si";

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

																$(ui.helper).remove(); //destroy clone
																$("#folderreadstatus").html(numerooriginalelementos + ph_elementsinfolder);
																$('.exploelement, .exploelementfolderup').css("filter","none");
																updatedestitems();

															}, timetowait);

														} else {

															$(ui.helper).remove(); //destroy clone
															$("#folderreadstatus").html(numerooriginalelementos + ph_elementsinfolder);
															$('.exploelement, .exploelementfolderup').css("filter","none");
															updatedestitems();
														}

													}

												}

											}

										}

										// quizás se pueda poner un else para que si la carpeta origen no esta en la base de datos, al hacer la copia eliminar los tags de la carpeta destino si los tuviera

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

									foldertoread = driveunit + rootdirectory + droppedfolder[t].children[1].attributes[1].value; // recogemos el value de cada carpeta

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
												var arorfo = fs.readdirSync(dirtoreadcheck).length;
											}
											catch(exception) {};

											directoryelement.name = "\/" + readedElements[i]
											directoryelement.arorfo = arorfo;
											directoryelement.id = ""; // se lo metemos después de separar carpetas y archivos (y estará oculto en la vista, de hecho no se utiliza)
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

										$.each(directoryfolders, function(m){

											arraydecarpetas[posicion] = foldertoread.replace(driveunit, "") + directoryfolders[m].name;
											posicion++
											recursivefolderdata(foldertoread + directoryfolders[m].name);

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

											if (cursor.value.folder == arraydecarpetasDest[t]) {

												idsubcarpetadestino[t] = cursor.value.folderid;
												carpetapreviamenteexistente = "yes"

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

												// ahora cambiamos el parámetro filefolder de cada uno de los archivos que COPIAMOS y están en la bd poniéndole el id de la carpeta destino

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

																	// Actualizamos los archivos en la bd con el nuevo filefolder
																	var res7 = objectStore6.put(fileupdate);

																	res7.onerror = function(event){
																		console.log("error ruta archivo no cambiada: " + event);
																	}

																	res7.onsuccess = function(event){

																		var key = event.target.result;
																		undo.copy.addedfileids.push(key)

																	}

																}

															});

														}

														cursor6.continue();
													}

												}

												trans6.oncomplete = function(event) {

													// copiamos los archivos
													var refrescohecho1="no";
													var flagg = 0;

													$.each(droppedarchive, function(t) {

														fs.copy(driveunit + rootdirectory + droppedarchive[t].children[1].attributes[1].value, driveunit + targetfolder + droppedarchive[t].children[1].attributes[1].value, function(err) {

															flagg++;

															if (flagg == droppedarchive.length && refrescohecho1=="no") { //para que haga el refresco tras mover la última carpeta y para que solo lo haga una vez..

																// para que refresque el filetree tambien si tuviera carpetas
																if(droppedfolder.length > 0) {

																	refrescohecho1="si";

																	timetowait = droppedfolder.length * 30;
																	setTimeout(function() {
																		$.each ($("#filetree span"), function(l) {

																			if($("#filetree span:eq("+l+")").attr("rel2") == targetfolder) {

																				// contraer y expandir
																				$("#filetree span:eq("+l+")").trigger( "click" );
																				$("#filetree span:eq("+l+")").trigger( "click" );

																			}

																		});

																		$(ui.helper).remove(); //destroy clone
																		$("#folderreadstatus").html(numerooriginalelementos + ph_elementsinfolder);
																		$('.exploelement, .exploelementfolderup').css("filter","none");
																		updatedestitems();

																	}, timetowait);

																} else {

																	refrescohecho1="si";
																	$(ui.helper).remove(); //destroy clone
																	$("#folderreadstatus").html(numerooriginalelementos + ph_elementsinfolder);
																	$('.exploelement, .exploelementfolderup').css("filter","none");
																	updatedestitems();
																}

															}

														});

													});

												}

											}

										}

									}

									else { // si la carpeta de destino ya estaba en la bd

										var refrescohecho2="no";

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

															$(ui.helper).remove(); //destroy clone
															$("#folderreadstatus").html(numerooriginalelementos + ph_elementsinfolder);
															$('.exploelement, .exploelementfolderup').css("filter","none");
															updatedestitems();

														}, timetowait);

													} else {

														$(ui.helper).remove(); //destroy clone
														$("#folderreadstatus").html(numerooriginalelementos + ph_elementsinfolder);
														$('.exploelement, .exploelementfolderup').css("filter","none");
														updatedestitems();
													}

												}

											});

										});

									}

								}

							}
							else { // si los archivos no tienen tag

								fflagg=0;

								// Se copian los archivos y ya esta
								$.each(droppedarchive, function(t) {

									fs.copy(driveunit + rootdirectory + droppedarchive[t].children[1].attributes[1].value, driveunit + targetfolder + droppedarchive[t].children[1].attributes[1].value, function(err) {

										fflagg++;

										if (fflagg == droppedarchive.length) { // para que haga el refresco tras mover la última carpeta

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

													$(ui.helper).remove(); //destroy clone
													$("#folderreadstatus").html(numerooriginalelementos + ph_elementsinfolder);
													$('.exploelement, .exploelementfolderup').css("filter","none");
													updatedestitems();

												}, timetowait);

											} else {

												$(ui.helper).remove(); //destroy clone
												$("#folderreadstatus").html(numerooriginalelementos + ph_elementsinfolder);
												$('.exploelement, .exploelementfolderup').css("filter","none");
												updatedestitems();
											}

										}

									});

								});

							}

						}

					} // --fin si la carpeta origen y destino son las mismas

					else {
						
						alertify.alert(ph_alr_05);
						previousornext = "refresh"; // para refrescar sin añadir al array de los direcciones visitadas
						readDirectory(dirtoexec);

					}

				} //-- fin Copiar

		    }

	    },
	    over: function(e, ui){

            $(this).addClass('filetreeonhover');
            // si quito esta linea no funciona!
        }

	});

}
function handle_drop_patient(event, ui) {
     $(this).append( $(ui.draggable).clone().css({'float':'left','display':'block'}) );
     $(ui.draggable).remove();
}



function filetreerefresh() {

	window.newrefresh = "yes";

	$('#filetree').html("");
	$('#filetree').fileTree({});

};


// Copiar y Mover   (usando la Botonera de arriba)

window.parent.$("#paste").on('click', function() {	

	if (window.parent.$("li.current").attr('data-tab') == "tab-2") { // salir de la función si esta seleccionado el search
		return;

	}

	var numerooriginalelementos = $("#folderreadstatus").html();
	numerooriginalelementos = numerooriginalelementos.substr(0,numerooriginalelementos.indexOf(' '));

	var pasteaction = window.parent.pasteaction;
	if ($("#filetree ul li span.selected")["0"]) {
		var targetfolder = $("#filetree ul li span.selected")["0"].attributes[1].value;
	}


	var alldroppedelement = $(".exploelement.ui-selected");
	

	if (alldroppedelement.length == 0) { // si no hay elementos seleccionados

		if (pasteaction == "copy") {
			
			alertify.alert(ph_alr_06);
			
		}
		else if (pasteaction == "cut") {
			
			alertify.alert(ph_alr_07);
			
		}
	}

	if (alldroppedelement.length > 0 && targetfolder == undefined) {
		
		alertify.alert(ph_alr_08);		
	}

	if (alldroppedelement.length > 0 && targetfolder != undefined) {

   		var droppedarchive = [];
    	var droppedfolder = [];
    	var foldername = [];
    	var y = 0;
    	var x = 0;

		// console.log("carpeta madre original: " + rootdirectory);
		// console.log("carpeta destino: " + targetfolder);

		$.each (alldroppedelement, function(t) {

			if (alldroppedelement[t].classList.contains("archive")) {

				droppedarchive[y] = alldroppedelement[t];
				y++

			} else if (alldroppedelement[t].classList.contains("folder")) {

				droppedfolder[x] = alldroppedelement[t];
				x++
			}

		});

		function updatedestitems() { //pequeña función para actualizar si estuviera en la vista del directorio en n in folder

			$.each ($(".explofolder"), function(ex) {

				if (rootdirectory + $(".explofolder")[ex].attributes[1].value == targetfolder) {

					var arorfo = fs.readdirSync(driveunit + targetfolder).length;					
					$(".explofolder")[ex].nextSibling.innerHTML = " " + arorfo + ph_infolder;
							
					// se cambia valor de items del array de elementos (para no tener que recargar la carpeta si se cambia viewmode o order)
					$.each (directoryfolders, function(drf){
						if (directoryfolders[drf]){ //para que no de error si borra elemento de array
							if (directoryfolders[drf].name == $(".explofolder")[ex].attributes[1].value){
								directoryfolders[drf].arorfo = arorfo;							
							}
						}
					});

				}
			})
		}


		// Mover

		if (pasteaction == "cut") {
			if (rootdirectory != targetfolder) {

				$("#folderreadstatus").html(ph_moving);
				document.querySelectorAll('.exploelement, .exploelementfolderup').forEach(function(el) {
				  el.style.filter = "opacity(46%)";
				});
				if (viewmode==1){
					$(".ui-selected").next().remove(); // los <br>
				}
				$(".ui-selected").remove();

				$("#filetree ul li span.selected").addClass("animateonce");

				$(".undo", window.parent.document).attr("data-tooltip", ph_dato_move);
				undo.class = "move";
				undo.move.rootfiles = droppedarchive;
				undo.move.rootfolders = droppedfolder;
				undo.move.rootfolderorig = rootdirectory;
				undo.move.rootfoldernew = targetfolder;

				// trabajamos con las carpetas

				var refescohechoporcarpeta = "no";
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


												cursor.continue()


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


							// antes de mover físicamente las carpetas vamos a recorrerlas recursivamente para recoger los datos de todas las subcarpetas que contenga

							var arraydecarpetas = {};
							var arraydecarpetasDest = {};
							var posicion = 0;

							$.each(droppedfolder, function(t) {

								foldertoread = driveunit + rootdirectory + droppedfolder[t].children[1].attributes[1].value; // recogemos el value de cada carpeta

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
											var arorfo = fs.readdirSync(dirtoreadcheck).length;
										}
										catch(exception) {};

										directoryelement.name = "\/" + readedElements[i]
										directoryelement.arorfo = arorfo;
										directoryelement.id = ""; // se lo metemos después de separar carpetas y archivos (y estará oculto en la vista)
										directoryelement.tagsid = []; //se lo metemos después de separar carpetas y archivos

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

									$.each(directoryfolders, function(m){

										arraydecarpetas[posicion] = foldertoread.replace(driveunit, "") + directoryfolders[m].name;
										posicion++
										recursivefolderdata(foldertoread + directoryfolders[m].name);

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

							
							// se va a mirar si en estino hay una carpeta con el mismo nombre en la base de datos y si está se borra de ella

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

								fs.move(driveunit + rootdirectory + foldername[t], driveunit + targetfolder + foldername[t], { clobber: true }, function(err) {

									flagg++;

									if (flagg == droppedfolder.length && refescohechoporcarpeta == "no" && droppedarchive.length == 0) { // para que haga el refresco tras mover la última carpeta y solo lo haga una vez..

										$("#folderreadstatus").html(numerooriginalelementos - alldroppedelement.length + ph_elementsinfolder);
										$('.exploelement, .exploelementfolderup').css("filter","none");

										// se eliminan los elementos del array de elementos (para no tener que recargar la carpeta si se cambia viewmode o order)
										$.each(droppedfolder, function(t) {
											$.each (directoryfolders, function(drf){
												if (directoryfolders[drf]){ //para que no de error si borra elemento de array
													if (directoryfolders[drf].name == foldername[t]){
														directoryfolders.splice(drf, 1);							
													}
												}
											});
										});

										updatedestitems();
										refescohechoporcarpeta = "si";

										// para actualizar visual del filetree
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
																	var fflagg=0;
																	$.each(droppedarchive, function(t) {

																		fs.rename(driveunit + rootdirectory + droppedarchive[t].children[1].attributes[1].value, driveunit + targetfolder + droppedarchive[t].children[1].attributes[1].value, function(err) {

																			fflagg++;

																			if (fflagg == droppedarchive.length) { // para que haga el refresco tras mover la última carpeta

																				// se eliminan los elementos del array de elementos (para no tener que recargar la carpeta si se cambia viewmode o order)
																				$.each(droppedarchive, function(t) {
																					$.each (directoryarchives, function(arf){
																						if (directoryarchives[arf]){ //para que no de error si borra elemento de array
																							if (directoryarchives[arf].name == droppedarchive[t].children[1].attributes[1].value){
																								directoryarchives.splice(arf, 1);		
																							}
																						}
																					});
																				});																				

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
																						$("#folderreadstatus").html(numerooriginalelementos - alldroppedelement.length + ph_elementsinfolder);
																						$('.exploelement, .exploelementfolderup').css("filter","none");
																						updatedestitems();

																					}, timetowait);

																				} else {
																					$("#folderreadstatus").html(numerooriginalelementos - alldroppedelement.length + ph_elementsinfolder);
																					$('.exploelement, .exploelementfolderup').css("filter","none");
																					updatedestitems();
																				}

																			}

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

												// comprobamos si la carpeta origen se queda sin archivos con tags
												var borrarcarpetaorigenbd = "yes"

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

															// console.log("eliminada carpeta de la bd");

														}

													}

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
									var refrescohecho2="no";
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

												if(cursor6.value.filefolder == originfolderid){

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

															var fflagg = 0;

															$.each(droppedarchive, function(t) {

																fs.rename(driveunit + rootdirectory + droppedarchive[t].children[1].attributes[1].value, driveunit + targetfolder + droppedarchive[t].children[1].attributes[1].value, function(err) {

																	fflagg++;

																	if (fflagg == droppedarchive.length & refrescohecho2=="no") { //para que haga el refresco tras mover la última carpeta

																		// se eliminan los elementos del array de elementos (para no tener que recargar la carpeta si se cambia viewmode o order)
																		$.each(droppedarchive, function(t) {
																			$.each (directoryarchives, function(arf){
																				if (directoryarchives[arf]){ //para que no de error si borra 
																					if (directoryarchives[arf].name == droppedarchive[t].children[1].attributes[1].value){
																						directoryarchives.splice(arf, 1);		
																					}
																				}
																			});
																		});


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

																					if($("#filetree span:eq("+l+")").attr("rel2") == rootdirectory) {

																						// contraer y expandir
																						$("#filetree span:eq("+l+")").trigger( "click" );
																						$("#filetree span:eq("+l+")").trigger( "click" );

																					}

																				});
																				refrescohecho2="si";
																				$("#folderreadstatus").html(numerooriginalelementos - alldroppedelement.length + ph_elementsinfolder);
																				$('.exploelement, .exploelementfolderup').css("filter","none");
																				updatedestitems();

																			}, timetowait);

																		} else {
																			refrescohecho2="si"
																			$("#folderreadstatus").html(numerooriginalelementos - alldroppedelement.length + ph_elementsinfolder);
																			$('.exploelement, .exploelementfolderup').css("filter","none");
																			updatedestitems();
																		}

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
											var borrarcarpetaorigenbd = "yes"

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

														// console.log("eliminada carpeta de la bd");

													}

												}

											}

										}

									});

								}

							}

						}
						else { // si los archivos no tiene tag

							// Se mueven los archivos y ya esta

							var fflagg = 0;

							$.each(droppedarchive, function(t) {

								fs.rename(driveunit + rootdirectory + droppedarchive[t].children[1].attributes[1].value, driveunit + targetfolder + droppedarchive[t].children[1].attributes[1].value, function(err) {

									fflagg++;

									if (fflagg == droppedarchive.length) { // para que haga el refresco tras mover la última carpeta

										
										// se eliminan los elementos del array de elementos (para no tener que recargar la carpeta si se cambia viewmode o order)
										$.each(droppedarchive, function(t) {
											$.each (directoryarchives, function(arf){
												if (directoryarchives[arf]){ //para que no de error si borra elemento de array					
													if (directoryarchives[arf].name == droppedarchive[t].children[1].attributes[1].value){
														directoryarchives.splice(arf, 1);		
													}
												}
											});
										});

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
												$("#folderreadstatus").html(numerooriginalelementos - alldroppedelement.length + ph_elementsinfolder);
												$('.exploelement, .exploelementfolderup').css("filter","none");
												updatedestitems();

											}, timetowait);

										} else {
											$("#folderreadstatus").html(numerooriginalelementos - alldroppedelement.length + ph_elementsinfolder);
											$('.exploelement, .exploelementfolderup').css("filter","none");
											updatedestitems();
										}

									}

								});

							});

						}

					}

				}

			} // --fin si la carpeta origen y destino son las mismas

			else {
				
				alertify.alert(ph_alr_05);
				previousornext = "refresh"; // para refrescar sin añadir al array de los direcciones visitadas
				readDirectory(dirtoexec);

			}


			setTimeout(function myFunction() {
				$("#filetree ul li span.selected").removeClass("animateonce");
			}, 1000)


		} //-- fin Mover


		// Copiar

		if (pasteaction == "copy") {
			if (rootdirectory != targetfolder) {

				$("#folderreadstatus").html(ph_copying);
				document.querySelectorAll('.exploelement, .exploelementfolderup').forEach(function(el) {
				  el.style.filter = "opacity(46%)";
				});

				$("#filetree ul li span.selected").addClass("animateonce");

				$(".undo", window.parent.document).attr("data-tooltip", ph_dato_copy);
				undo.class = "copy";
				undo.copy.rootfiles = droppedarchive;
				undo.copy.rootfolders = droppedfolder;
				undo.copy.root = targetfolder;
				undo.copy.originalroot = rootdirectory;
				undo.copy.addedfileids = [];
				undo.copy.addedfolderids = [];


				var idcarpetasaduplicar = []; // posteriormente se duplicaran todos los archivos que tengan este filefolder poniéndoles por filefolder idcarpetasduplicadas.
				var idcarpetasduplicadas = [];


				// copiamos cada una de las carpetas
				var flagg = 0;

				$.each(droppedfolder, function(t) {

					fs.copy(driveunit + rootdirectory + droppedfolder[t].children[1].attributes[1].value, driveunit + targetfolder + droppedfolder[t].children[1].attributes[1].value, { clobber: true }, function(err) {


						flagg++;

						if (flagg == droppedfolder.length && droppedarchive.length == 0) { //para que haga el refresco tras mover la última carpeta

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

									$("#folderreadstatus").html(numerooriginalelementos + ph_elementsinfolder);
									$('.exploelement, .exploelementfolderup').css("filter","none");
									updatedestitems();
									$(".ui-selected").removeClass("ui-selected");

								}, timetowait);

							} else {

								$("#folderreadstatus").html(numerooriginalelementos + ph_elementsinfolder);
								$('.exploelement, .exploelementfolderup').css("filter","none");
								updatedestitems();
								$(".ui-selected").removeClass("ui-selected");

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

							if (cursor.value.folder == targetfolder + foldername[t]) {

								idcarpetadestino[t] = cursor.value.folderid;

							}

							// para el undo tiene que ir así, si se pone una propiedad del tipo undo.copy.rootfolders no funciona
							undocopyrootfolders[t] = foldername[t];

						});

						cursor.continue();
					}
					else { // si todavía no hay ninguna carpeta en la base de datos
						$.each(droppedfolder, function(t) {
							foldername[t] = droppedfolder[t].children[1].attributes[1].nodeValue;
							undocopyrootfolders[t] = foldername[t];

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

								var carpetapreviamenteexistente = "no";

								var folderupdate = {};

								foldername[t] = droppedfolder[t].children[1].attributes[1].nodeValue;

								if (cursor.value.folder == rootdirectory + foldername[t]) { // si hay carpeta con nombre en origen

									if (idcarpetadestino[t]) { // y en destino ya existía la carpeta en la bd

										folderupdate.folderid = idcarpetadestino[t]; // utilizamos el id que ya tenia
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

								// quizás se puede añadir un else para que si la carpeta origen no esta en la base de datos, al hacer el copy eliminar los tags de la carpeta destino si los tuviera

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

							foldertoread = driveunit + rootdirectory + droppedfolder[t].children[1].attributes[1].value; //recogemos el value de cada carpeta
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
										var arorfo = fs.readdirSync(dirtoreadcheck).length;
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

								$.each(directoryfolders, function(m){

									arraydecarpetas[posicion] = foldertoread.replace(driveunit, "") + directoryfolders[m].name;
									posicion++
									recursivefolderdata(foldertoread + directoryfolders[m].name);

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

							var carpetapreviamenteexistente = "no";

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

															// creamos nuevo fichero en bd
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

						// como los archivo (al menos uno) tienen tags se comprueba si la carpeta de destino esta en la bd
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
								// tambien aprovechamos para sacar el id de la carpeta origen (para luego buscar los archivos en la bd)
								if(cursor3.value.folder == rootdirectory){

									originfolderid = cursor3.value.folderid;

								}
								cursor3.continue();

							}
						}
						trans3.oncomplete = function(event) {

							var fileupdate = {};

							if (destfolderid == "") { // si la carpeta de destino NO estaba en la base de datos (no tiene id)

								// añadimos la carpeta a la bd pues los archivos a pasar tiene tags
								var trans4 = db.transaction(["folders"], "readwrite")
								var request4 = trans4.objectStore("folders")
								.put({ folder: targetfolder, foldertags: [] }); //el id no hace falta pues es autoincremental

								request4.onerror = function(event){

									console.log("error carpeta destino no añadida a bd: " + event);

								}

								request4.onsuccess = function(event){

									// console.log("carpeta destino añadida a bd!");

									var key = event.target.result;
									undo.copy.addedfolderids.push(key)

								}

								trans4.oncomplete = function(e) { // se toma el id de la carpeta añadida

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

															// Actualizamos los archivos en la bd con el nuevo filefolder
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
											var refrescohecho1="no";
											var flagg = 0;

											$.each(droppedarchive, function(t) {

												fs.copy(driveunit + rootdirectory + droppedarchive[t].children[1].attributes[1].value, driveunit + targetfolder + droppedarchive[t].children[1].attributes[1].value, function(err) {

													flagg++;

													if (flagg == droppedarchive.length && refrescohecho1=="no") { //para que haga el refresco tras mover la última carpeta y para que solo lo haga una vez..

														// para que refresque el filetree también si tuviera carpetas
														if(droppedfolder.length > 0) {

															refrescohecho1="si";
															timetowait = droppedfolder.length * 30;
															setTimeout(function() {
																$.each ($("#filetree span"), function(l) {

																	if($("#filetree span:eq("+l+")").attr("rel2") == targetfolder) {

																		// contraer y expandir
																		$("#filetree span:eq("+l+")").trigger( "click" );
																		$("#filetree span:eq("+l+")").trigger( "click" );

																	}

																});

																$("#folderreadstatus").html(numerooriginalelementos + ph_elementsinfolder);
																$('.exploelement, .exploelementfolderup').css("filter","none");
																updatedestitems();
																$(".ui-selected").removeClass("ui-selected");

															}, timetowait);

														} else {

															refrescohecho1="si";
															$("#folderreadstatus").html(numerooriginalelementos + ph_elementsinfolder);
															$('.exploelement, .exploelementfolderup').css("filter","none");
															updatedestitems();
															$(".ui-selected").removeClass("ui-selected");
														}

													}

												});

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
														undo.copy.addedfileids.push(key)

													}

												}

											}

											cursor6.continue();
										}

									}

								});

								// copiamos los archivos
								var flaggA=0
								$.each(droppedarchive, function(t) {

									fs.copy(driveunit + rootdirectory + droppedarchive[t].children[1].attributes[1].value, driveunit + targetfolder + droppedarchive[t].children[1].attributes[1].value, function(err) {

										flaggA++;

										if (flaggA == droppedarchive.length && refrescohecho2=="no") {

											refrescohecho2 = "si";

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

													$("#folderreadstatus").html(numerooriginalelementos + ph_elementsinfolder);
													$('.exploelement, .exploelementfolderup').css("filter","none");
													updatedestitems();
													$(".ui-selected").removeClass("ui-selected");

												}, timetowait);

											} else {

												$("#folderreadstatus").html(numerooriginalelementos + ph_elementsinfolder);
												$('.exploelement, .exploelementfolderup').css("filter","none");
												updatedestitems();
												$(".ui-selected").removeClass("ui-selected");
											}

										}

									});

								});

							}

						}

					}

					else { // si los archivos no tienen tag

						// Se mueven los archivos y ya esta

						var fflagg = 0;

						$.each(droppedarchive, function(t) {

							fs.copy(driveunit + rootdirectory + droppedarchive[t].children[1].attributes[1].value, driveunit + targetfolder + droppedarchive[t].children[1].attributes[1].value, function(err) {

								fflagg++;

								if (fflagg == droppedarchive.length) { // para que haga el refresco tras mover la última carpeta

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
											$("#folderreadstatus").html(numerooriginalelementos + ph_elementsinfolder);
											$('.exploelement, .exploelementfolderup').css("filter","none");
											updatedestitems();
											$(".ui-selected").removeClass("ui-selected");

										}, timetowait);

									} else {
										$("#folderreadstatus").html(numerooriginalelementos + ph_elementsinfolder);
										$('.exploelement, .exploelementfolderup').css("filter","none");
										updatedestitems();
										$(".ui-selected").removeClass("ui-selected");
									}

								}

							});

						});

					}

				}

			} // --fin si la carpeta origen y destino son distintas

			else {
				
				alertify.alert(ph_alr_05);
				previousornext = "refresh"; // para refrescar sin añadir al array de los direcciones visitadas
				readDirectory(dirtoexec);

			}

			setTimeout(function myFunction() {
				$("#filetree ul li span.selected").removeClass("animateonce");
			}, 1000)


		} //-- fin Copiar

    }

    top.explorer.focus();

}); //-- fin Copiar y Mover usando la botonera de arriba

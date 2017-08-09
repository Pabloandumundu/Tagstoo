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


// la función que lanza el aviso que se cierra tras un periodo, para cuando se añaden tags a subelementos
// es el customAlert del utils.js y es llamada desde este fichero (popups.js)

var dirtoexec =  top.explorer.dirtoexec;

function popup (popupclass, data) {

	switch (popupclass) {

		case "addtagtosubelements":

			$( "#popup" ).load( "../popups/popup-tagfolder.html" );
			$("#popup").addClass("tagfolder");
			$("#popupbackground").addClass("display");
			$("#toppopupbackground", window.parent.document).addClass("display");
			break;

		case "newtag":

			$( "#popup" ).load( "../popups/popup-newtag.html" );
			$("#popup").addClass("newtag");
			$("#popupbackground").addClass("display");
			$("#toppopupbackground", window.parent.document).addClass("display");
			break;

		case "edittag":

			$( "#popup" ).load( "../popups/popup-edittag.html" );
			$("#popup").addClass("edittag");
			$("#popupbackground").addClass("display");
			$("#toppopupbackground", window.parent.document).addClass("display");
			break;

		case "options":

			$( "#popup" ).load( "../popups/popup-options.html" );
			$("#popup").addClass("options");
			$("#popupbackground").addClass("display");
			$("#toppopupbackground", window.parent.document).addClass("display");
			break;	

		case "info":

			$( "#popup" ).load( "../popups/popup-info.html" );
			$("#popup").addClass("info");
			$("#popupbackground").addClass("display");
			$("#toppopupbackground", window.parent.document).addClass("display");
			break;	

	}	

}


function saveoptions() {


	// aquí se irán guardando las diferentes opciones del popup de opciones antes de cerrar al darle a Apply (aparte de las bases de datos que se manejan aparte)

	if ($("#closeconfirmation").is(":checked")) {
		localStorage["closeconfirmation"] = "yes";
		window.closeconfirmation = "yes";

	} else {
		localStorage["closeconfirmation"] = "no";
		window.closeconfirmation = "no";
	}

	if ($("#demotags").is(":checked")) {
		localStorage["demotags"] = "yes";
		window.demotags = "yes";

	} else {
		localStorage["demotags"] = "no";
		window.demotags = "no";
	}

	if ($("#previewimgonviewmode1").is(":checked")) {
		localStorage["previewimgonviewmode1"] = "yes";
		window.previewimgonviewmode1 = "yes";
		localStorage["previewepubonviewmode1"] = "yes";
		window.previewepubonviewmode1 = "yes";

	} else {
		localStorage["previewimgonviewmode1"] = "no";
		window.previewimgonviewmode1 = "no";
		localStorage["previewepubonviewmode1"] = "no";
		window.previewepubonviewmode1 = "no";
	}

	// if ($("#previewepubonviewmode1").is(":checked")) {
	// 	localStorage["previewepubonviewmode1"] = "yes";
	// 	window.previewepubonviewmode1 = "yes";

	// } else {
	// 	localStorage["previewepubonviewmode1"] = "no";
	// 	window.previewepubonviewmode1 = "no";
	// }

	if ($("#showtips").is(":checked")) {
		localStorage["mostrartips"] = "yes";

	} else {
		localStorage["mostrartips"] = "no";
	}


	// la opcion de slideshow
		
	if ($("#autoslideshow").is(":checked")) {

		localStorage["autoslideshow"] = "yes";
		window.autoslideshow = "yes";

	}	
	else {
		localStorage["autoslideshow"] = "no";
		window.autoslideshow = "no";

	}

	var selectedtime = $("#autoslideshowtime").val()
	if (selectedtime == 0) {
		alert("Time between images must be more than 0!. Time not saved.");

	}
	else {
		localStorage["autoslideshowtime"] = selectedtime;
		window.autoslideshowtime = selectedtime;

	}


	// si ha cambiado el driveunit de la base de datos actual recargará la aplicación
	if ($('#selecteddb').html() == localStorage["currentlydatabaseused"]) { 
		if ($("#unitselect").val() != driveunit && $("#unitselect").val() != null) {

			cerrar();
			restarttagstoo();

		}

	}

}


function cerrar() {

	$("#explorer", window.parent.document).contents().find('#popupbackground').removeClass("display");
	$("#searcher", window.parent.document).contents().find('#popupbackground').removeClass("display");

	$("#toppopupbackground", window.parent.document).removeClass("display");

	$("#popup").removeClass("tagfolder");
	$("#popup").removeClass("newtag");
	$("#popup").removeClass("edittag");

	$("#explorer", window.parent.document).contents().find('#popup').removeClass("options");
	$("#searcher", window.parent.document).contents().find('#popup').removeClass("options");

	$("#explorer", window.parent.document).contents().find('#popup').removeClass("info");
	$("#searcher", window.parent.document).contents().find('#popup').removeClass("info");

};


// desde Popup de añadir un nuevo tag

function newtagpreload() {

	var todisplaytagforms = "";
	window.selectedtagcolor = "#808080"; // valor por defecto
	window.selectedtagform = "";
	window.selectedtagtext = "";

	$.each(availabletagforms, function(i) {

		todisplaytagforms += "<div forma='"+ availabletagforms[i] +"' class=' tagticket small "+ availabletagforms[i] +"' style='background-color: grey; width: 2em;'>&nbsp;</div>"

	});

	$("#tagforms").html(todisplaytagforms)

	$("#tagforms").selectable({

		selected: function( event, ui ) {

			selectedtagform = ui.selected.getAttribute("forma");

			$('#tagpreview .tagticket').alterClass( 'tag_*',  selectedtagform) ; // alterClass es una función externa que esta especificada en utils.js y que permite sustituir de manera sencilla cualquier clase que empiece por .. por otras clase.

			if ($("#tagpreview .tagticket").html() == "" || $("#tagpreview .tagticket").html() == "&nbsp;") {
				$("#tagpreview .tagticket").css("width", "1em");
			}

			if (selectedtagcolor == "") {
				$("#tagpreview .tagticket").css("background-color", "grey");
			} else {
				$("#tagpreview .tagticket").css("background-color", selectedtagcolor);
			}

		}

	});

	$('#colorPicker').bind("change", function(){

		selectedtagcolor = box.colorHex; // el objeto box y sus métodos los creamos con el colorpicker, aquí se recoge el color seleccionado
		var complecolor = hexToComplimentary(selectedtagcolor);

		$("#tagpreview .tagticket").css("background-color", selectedtagcolor);
		$("#tagpreview .tagticket").css("color", complecolor);

	});

	$("#tagtext").on('input',function(){

		selectedtagtext = $("#tagtext").val();

		if (selectedtagtext != "" || selectedtagtext != " ") {

			$("#tagpreview .tagticket").css("width", "auto");
			$("#tagpreview .tagticket").html(selectedtagtext);

		} else { // vacío

			$("#tagpreview .tagticket").html("&nbsp;")
			$("#tagpreview .tagticket").css("width", "1em");
		}

		if (!selectedtagtext || selectedtagtext.replace(/^\s+|\s+$/g, "").length == 0) {

			$("#tagpreview .tagticket").html("&nbsp;")
			$("#tagpreview .tagticket").css("width", "1em");
		}

	});

}
function createnewtag() {

	if (selectedtagtext != "" && selectedtagtext != " ") {
		if (selectedtagform != "") {

			// contamos el numero de items
			var objectStore = db.transaction(['tags']).objectStore('tags');
			var count = objectStore.count();

			// añadimos item con posición +1
			count.onsuccess = function() {

				var newposition = count.result;

				var request = db.transaction(["tags"], "readwrite")
							.objectStore("tags")
							.add({ tagtext: selectedtagtext, tagpos: newposition, tagcolor: selectedtagcolor.substring(1), tagform: selectedtagform });

				request.onsuccess = function(event) {

					alertify.alert("Tag Added.", function () {
					top.searcher.drawfootertags();
					top.explorer.drawfootertags();
					cerrar();
					});

				};
				request.onerror = function(event) { /* alert("Tag not added, tag already exists!"); */ };
			}

		}
		else {
			alertify.alert("You must select a shape for the tag.");
		}
	}
	else {
		alertify.alert("Some text is needed for the new tag.");
	}

}
// --fin desde Popup de añadir un nuevo tag


// desde Popup de editar borrar un tag

function edittagpreload() {

	window.selectedtag = "";
	window.selectedtagtext = "";
	window.selectedtagpos = "";
	window.selectedtagcolor = "";
	window.selectedtagform = "";


	// mostrar los tags previamente creados
	drawedittagtags();

	$("#existingtags-wrap").selectable({

		selected: function( event, ui ) {

			selectedtag = ui.selected.getAttribute("value");

			var trans = db.transaction(["tags"], "readonly");
			var objectStore = trans.objectStore("tags");

			var tagpreview = $("#tagpreview .tagticket")[0];

			var req = objectStore.openCursor();

			req.onerror = function(event) {

				console.log("error: " + event);

			};

			req.onsuccess = function(event) {

				var cursor = event.target.result;

				if (cursor) {

					if (cursor.value.tagid == selectedtag) {

						var color = "#" + cursor.value.tagcolor;
						var complecolor = hexToComplimentary(color);

						tagpreview.className = "tagticket small " + cursor.value.tagform;
						tagpreview.setAttribute("value", cursor.value.tagid);
						tagpreview.setAttribute("style", "background-color: #" + cursor.value.tagcolor + ";" + "color: " + complecolor + ";")
						tagpreview.innerHTML = cursor.value.tagtext;
						selectedtagtext = cursor.value.tagtext;
						selectedtagpos = cursor.value.tagpos;
						selectedtagcolor = "#" + cursor.value.tagcolor;
						selectedtagform = cursor.value.tagform;

						$("#tagtext").val(cursor.value.tagtext);

					};

				cursor.continue();

				}

			};

		}

	});


	// mostrar las formas disponibles
	var todisplaytagforms = "";

	$.each(availabletagforms, function(i) {

		todisplaytagforms += "<div forma='"+ availabletagforms[i] +"' class=' tagticket small "+ availabletagforms[i] +"' style='background-color: grey; width: 2em;'>&nbsp;</div>";

	});

	$("#tagforms").html(todisplaytagforms)

	$("#tagforms").selectable({

		selected: function( event, ui ) {

			var selectedtagid = $('#tagpreview .tagticket').attr("value");

			if (selectedtagid) { // si se ha seleccionado algún tag para editar

				selectedtagform = ui.selected.getAttribute("forma");

				$('#tagpreview .tagticket').alterClass( 'tag_*',  selectedtagform) ; // alterClass es una función externa que esta especificada en utils.js y que permite sustituir de forma sencilla cualquier clase que empiece por .. por otras clase.

				if ($("#tagpreview .tagticket").html() == "" || $("#tagpreview .tagticket").html() == "&nbsp;") {
					$("#tagpreview .tagticket").css("width", "1em");

				}
				if (selectedtagcolor == "") {
					$("#tagpreview .tagticket").css("background-color", "grey");
				} else {
					$("#tagpreview .tagticket").css("background-color", selectedtagcolor);
				}

			}

			else {

				alertify.alert("Please, first select an existing tag if you want to edit it.")
				ui.selected.classList.remove("ui-selected"); // para quitar la selección
			}

		}

	});


	// seleccionar color
	$('#colorPicker').bind("change", function(){

		var selectedtagid = $('#tagpreview .tagticket').attr("value");

		if (selectedtagid) { // si se ha selecionado algún tag para editar

			selectedtagcolor = box.colorHex; // el objeto box y sus métodos los creamos con el colorpicker, aquí se recoge el color seleccionado
			var complecolor = hexToComplimentary(selectedtagcolor);

			$("#tagpreview .tagticket").css("background-color", selectedtagcolor);
			$("#tagpreview .tagticket").css("color", complecolor);

		}

		else {

			alertify.alert("Please, first select an existing tag if you want to edit it.");
			box.close();
			$("#colorPicker .colorInner").css("background-color","#EFEFEF");

		}

	});


	// cambiar texto
	$("#tagtext").on('input',function(){

		selectedtagtext = $("#tagtext").val();

		if (selectedtagtext != "" || selectedtagtext != " ") {
			$("#tagpreview .tagticket").css("width", "auto");
			$("#tagpreview .tagticket").html(selectedtagtext);

		} else { // vacío

			$("#tagpreview .tagticket").html("&nbsp;")
			$("#tagpreview .tagticket").css("width", "1em");
		}

		if (!selectedtagtext || selectedtagtext.replace(/^\s+|\s+$/g, "").length == 0) {

			$("#tagpreview .tagticket").html("&nbsp;")
			$("#tagpreview .tagticket").css("width", "1em");
		}

	});

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

function drawedittagtags() { // visual del tag que se está editando

	getalltags(function (items) {

		items.sort(SortTagsByPosAsc);
		var len = items.length;

		var edittagtagdivs = "";

		for (var i = 0; i < len; i += 1) {

			edittagtagdivs += "<div class='edittagticket' value='"+ items[i].tagid + "' position='" + items[i].tagpos + "'> " + items[i].tagid +  "</div>" ;
		}

		// se añade el html (solo con los id)
		$( "#existingtags-wrap" ).html(edittagtagdivs);

		// ahora se dibujará la etiqueta
		var trans = db.transaction(["tags"], "readonly");
		var objectStore = trans.objectStore("tags");

		tagdeledit = $("#existingtags-wrap .edittagticket");

		$.each(tagdeledit, function(i) {

			var req = objectStore.openCursor();

			req.onerror = function(event) {

				console.log("error: " + event);

			};

			req.onsuccess = function(event) {

				var cursor = event.target.result;

				if (cursor) {

					if (cursor.value.tagid == tagdeledit[i].attributes[1].nodeValue) {

						var color = "#" + cursor.value.tagcolor;
						var complecolor = hexToComplimentary(color);

						tagdeledit[i].className += " small " + cursor.value.tagform;
						tagdeledit[i].setAttribute("value", cursor.value.tagid);
						tagdeledit[i].setAttribute("style", "background-color: #" + cursor.value.tagcolor + ";" + "color: " + complecolor + ";")
						tagdeledit[i].setAttribute("forma", cursor.value.tagform);
						tagdeledit[i].innerHTML = cursor.value.tagtext;

					};

				cursor.continue();

				}

			};

		});

	});

};

function savetag() { // guardar tag

	var updatetag={};

	if (selectedtag!="") {

		var trans = db.transaction(["tags"], "readwrite")
		var objectStore = trans.objectStore("tags")
		var req = objectStore.openCursor();

		req.onerror = function(event) {

			console.log("error: " + event);
		};

		req.onsuccess = function(event) {

			var cursor = event.target.result;

			if(cursor){

				if(cursor.value.tagid == selectedtag){

					updatetag.tagid = cursor.value.tagid;
					updatetag.tagtext = selectedtagtext;
					updatetag.tagpos = selectedtagpos;
					updatetag.tagcolor = selectedtagcolor.substring(1);
					updatetag.tagform = selectedtagform;

					var res2 = cursor.update(updatetag);

					res2.onerror = function(event){

						console.log("error: tag no modificado: " + event);
					}

					res2.onsuccess = function(event){

						alertify.alert("Tag Saved!. Refresh the view if needed.", function () {

							top.searcher.drawfootertags();
							top.explorer.drawfootertags();
							cerrar();

						});

					}

				}

				cursor.continue();

			}

		}

	}

	else {

		alertify.alert("Please, first select an existing tag if you want to edit it.")

	}

}

function deletetag() { // borrar tag

	if (selectedtag != "") {

		alertify.confirm( "You chosen to delete the selected tag, all the associations to this tag will be unlinked, are you sure?", function (e) {
            if (!e) {
	            x = "You pressed Cancel!";
	            console.log(x);
            } else {
              	x = "You pressed OK!";
              	console.log(x);

              	var updatefile = {};

				// se va a ir eliminando el tag de todos los elementos que lo tengan

				// primero se va a mirar los ficheros que lo tienen
				var trans = db.transaction(["files"], "readwrite")
				var objectStore = trans.objectStore("files")
				var req = objectStore.openCursor();

				req.onerror = function(event) {

					console.log("error: " + event);
				};

				req.onsuccess = function(event) {

					var cursor = event.target.result;

					if(cursor) {

						var coincidetag="no";

						tagsdelelemento = cursor.value.filetags;

						if (typeof tagsdelelemento == "string") {
							tagsdelelemento = tagsdelelemento.split(",")
						}

						$.each (tagsdelelemento, function(m) {

							if (tagsdelelemento[m] == selectedtag) {

								coincidetag = "si";
								// console.log("coincide en " + cursor.value.filename)

							}

						});

						if (coincidetag=="si") {

							var index = tagsdelelemento.indexOf(selectedtag);
							if (index > -1) {
								tagsdelelemento.splice(index, 1);
							}

						}

						if (tagsdelelemento.length > 0) { // tiene más tags

							// el archivo tiene más tag por lo que solo se sobrescribirá con los tags restantes

							updatefile.fileid = cursor.value.fileid;
							updatefile.filename = cursor.value.filename;
							updatefile.filefolder = cursor.value.filefolder;
							updatefile.fileext = cursor.value.fileext;
							updatefile.filetags = tagsdelelemento;

							var res2 = cursor.update(updatefile);

							res2.onerror = function(event){
								console.log("error: tag de archivo no eliminado: " + event);
							}

							res2.onsuccess = function(event){

								// console.log("tag de archivo eliminado");

							}


						} else { // no tiene más tags

							// si no tiene más tags se eliminará de la base de datos y después se procederá a comprobar si la capeta a la que esta asociada el fichero tiene más ficheros asociados, sino también se eliminará la carpeta (si no tiene tags)

							var folderidtocheck = cursor.value.filefolder;

							var res3 = cursor.delete(cursor.value.fileid)

							res3.onerror = function(event){
								console.log("error: fichero no eliminado de la base de datos: " + event);
							}

							res3.onsuccess = function(event){

								// console.log("fichero eliminado de la base de datos");

								// vamos a chequear la carpeta que estaba asociada al archivo
								var trans2 = db.transaction(["folders"], "readwrite")
								var objectStore2 = trans2.objectStore("folders")
								var req2 = objectStore2.openCursor();

								req2.onerror = function(event) {

								console.log("error: " + event);
								};

								req2.onsuccess = function(event) {

									var cursor2 = event.target.result;

									if(cursor2){

										if(cursor2.value.folderid == folderidtocheck){

											if (cursor2.value.foldertags == "") { // de momento solo se actuá si la carpeta no tiene tags después cuando se chequeen todas las carpetas ya se mirará si el tag que tienen es el tag a eliminar o tiene otros más

												var tieneotrosficherosasociados = "no";

												// se mira si hay ficheros asociados a la carpeta
												var trans3 = db.transaction(["files"], "readonly")
												var objectStore3 = trans3.objectStore("files")
												var req3 = objectStore3.openCursor();

												req3.onerror = function(event) {

												console.log("error: " + event);
												};

												req3.onsuccess = function(event) {

													var cursor3 = event.target.result;

													if(cursor3){

														if (cursor3.value.filefolder == folderidtocheck) {

															tieneotrosficherosasociados = "si";

														}

														cursor3.continue();

													}

													if (tieneotrosficherosasociados == "no") {

														// se borrara la carpeta de la bs al no tener más ficheros asociados
														var trans = db.transaction(["folders"], "readwrite")
														var objectStore = trans.objectStore("folders")
														var req = objectStore.openCursor();

														req.onerror = function(event) {

															console.log(event);
														};

														req.onsuccess = function(event) {

															var cursor = event.target.result;

															if(cursor){

																if(cursor.value.folderid == folderidtocheck) {

																	var req2 = cursor.delete();

																	req2.onerror = function(event) {

																		console.log(event);
																	};

																	req2.onsuccess = function(event) {

																		// console.log("folder deleted from db")

																	}

																}

																cursor.continue();

															}

														}

													}

												}

											}

										}

										cursor2.continue();

									}

								}

							}

						}

						cursor.continue();

					}

				}

				trans.oncomplete = function(event) {

					// ahora se van a chequear las carpetas

					// primero vemos si tienen el tag entre los tags que tengan
					var updatefolder=[];
					var foderidtocheckiffiles=[];
					var i=0;

					var trans = db.transaction(["folders"], "readwrite")
					var objectStore = trans.objectStore("folders")
					var req = objectStore.openCursor();

					req.onerror = function(event) {

						console.log("error: " + event);
					};

					req.onsuccess = function(event) {

						var cursor = event.target.result;

						if(cursor) {

							var coincidetag="no";

							tagsdelelemento = cursor.value.foldertags;

							if (typeof tagsdelelemento == "string") {
								tagsdelelemento = tagsdelelemento.split(",")
							}

							$.each (tagsdelelemento, function(m) {

								if (tagsdelelemento[m] == selectedtag) {

									coincidetag = "si";
									// console.log("coincide en " + cursor.value.folder)

								}

							});

							if (coincidetag=="si") {

								var index = tagsdelelemento.indexOf(selectedtag);
								if (index > -1) {
									tagsdelelemento.splice(index, 1);
								}

								if (tagsdelelemento.length > 0) { // la carpeta tiene más tags

									// el elemento tiene más tag por lo que solo se sobrescribirá con los tags restantes
									updatefolder.folderid = cursor.value.folderid;
									updatefolder.folder = cursor.value.folder;
									updatefolder.foldertags = tagsdelelemento;

									var res2 = cursor.update(updatefolder);

									res2.onerror = function(event){
										console.log("error: tag de carpeta no eliminado: " + event);
									}

									res2.onsuccess = function(event){

										// console.log("tag de carpeta eliminado");

									}

								}

								else { // no tiene más tags

									foderidtocheckiffiles[i] = cursor.value.folderid;
									i++;

								}

							}

							cursor.continue();

						}

					}

					trans.oncomplete = function(event) {

						console.log(foderidtocheckiffiles)

						// como la carpeta no tiene más tags se va a comprobar si tiene archivos asociados, si es así solo se borrara el tag de la carpeta, sino se borrara la carpeta de la base de datos.

						$.each(foderidtocheckiffiles, function(i){

							var tieneficherosasociados = "no";

							var trans = db.transaction(["files"], "readonly")
							var objectStore = trans.objectStore("files")
							var req = objectStore.openCursor();

							req.onerror = function(event) {

								console.log("error: " + event);
							};

							req.onsuccess = function(event) {

								var cursor = event.target.result;

								if(cursor) {

									if(cursor.value.filefolder == foderidtocheckiffiles[i]) {

										tieneficherosasociados = "si";

									}

								cursor.continue();

								}

							}

							trans.oncomplete = function(event) {

								// console.log("la carpeta " + foderidtocheckiffiles[i] + " " + tieneficherosasociados + " tiene ficheros asociados");

								if (tieneficherosasociados == "si") {

									// como tiene ficheros asociados solo se eliminará el tag
									var updatefolder=[];

									var trans = db.transaction(["folders"], "readwrite")
									var objectStore = trans.objectStore("folders")
									var req = objectStore.openCursor();

									req.onerror = function(event) {

										console.log("error: " + event);
									};

									req.onsuccess = function(event) {

										var cursor = event.target.result;

										if(cursor) {

											if(cursor.value.folderid == foderidtocheckiffiles[i]) {

												updatefolder.folderid = cursor.value.folderid;
												updatefolder.folder = cursor.value.folder;
												updatefolder.foldertags = "";

												var res2 = cursor.update(updatefolder);

												res2.onerror = function(event){
													console.log("error: tag de carpeta no eliminado: " + event);
												}

												res2.onsuccess = function(event){

													// console.log("tag de carpeta eliminado");

												}

											}

											cursor.continue()

										}

									}

								}

								else if (tieneficherosasociados == "no") {

									// se eliminará la carpeta de la bs al no tener ya ni tags ni ficheros asociados

									var trans = db.transaction(["folders"], "readwrite")
									var objectStore = trans.objectStore("folders")
									var req = objectStore.openCursor();

									req.onerror = function(event) {

										console.log("error: " + event);
									};

									req.onsuccess = function(event) {

										var cursor = event.target.result;

										if(cursor) {

											if(cursor.value.folderid == foderidtocheckiffiles[i]) {

												var res2 = cursor.delete(foderidtocheckiffiles[i]);

												res2.onerror = function(event){
													console.log("error: carpeta no eliminada de la bd: " + event);
												}

												res2.onsuccess = function(event){

													// console.log("carpeta eliminada de la base de datos");

												}

											}

											cursor.continue();

										}

									}

								}

							}

						});

						// Ahora se procede a eliminar el tag en si de la bd

						var trans = db.transaction(["tags"], "readwrite")
						var objectStore = trans.objectStore("tags")
						var req = objectStore.openCursor();

						req.onerror = function(event) {

							console.log("error: " + event);
						};

						req.onsuccess = function(event) {

							var cursor = event.target.result;

							if(cursor) {

								if(cursor.value.tagid == selectedtag) {

									var res2 = cursor.delete(foderidtocheckiffiles[i]);

									res2.onerror = function(event){
										console.log("error: tag no eliminada de la bd: " + event);
									}

									res2.onsuccess = function(event){

										// console.log("tag eliminada de la base de datos");

									}


								}

								cursor.continue();

							}

						}

						trans.oncomplete = function(event) {

							alertify.alert("Tag Deleted!. Refresh the view if needed.", function () {

								top.searcher.drawfootertags();
								top.explorer.drawfootertags();
								cerrar();

							});

						}

					} //-- fin tran.oncomplete

				}

			}

		});

	}

	else {

		alertify.alert ("First select the tag you want to remove.");
	}

}

// --fin Popup de editar borrar un tag


// desde Popup de añadir tag a subelementos de una carpeta

function addtagsubs(taganadir, ffoldertoaddtags) {

	var folderidtoaddtags = "";
	var flag1 = flag2 = 0;

	$("#undo", window.parent.document).attr("data-tooltip", "UNDO (tag folder & subs.)");
	undo.class = "tag folder and subelements";

	// sacar el id de la carpeta madre para poder meter tags de subarchivos
	var trans10 = db.transaction(["folders"], "readonly")
	var objectStore10 = trans10.objectStore("folders")
	var req10 = objectStore10.openCursor();

	req10.onerror = function(event) {

		console.log("error: " + event);
	};

	req10.onsuccess = function(event) {

		var cursor10 = event.target.result;

		if(cursor10){

			if (cursor10.value.folder == ffoldertoaddtags) {

				ffolderidtoaddtags = cursor10.value.folderid; // id de la carpeta madre

			}

			cursor10.continue();

		}

		trans10.oncomplete = function(e) {

			var bdirtoreadcheck = "";
			var bfolderidtosearch = "";
			var bdirectoryelement = [];
			// variables globales
			window.bdirectorycontent = []; // en esta variable se meten archivos y directorios
			window.bdirectoryarchives = []; // en esta variable se meten los archivos
			window.bdirectoryfolders = []; // en esta variable se meten los directorios

			var breadedElements = fs.readdirSync(driveunit + ffoldertoaddtags);

			var re = /(?:\.([^.]+))?$/; // expresión regular para detectar si un string tiene extensión
			for (i = 0; i < breadedElements.length; i++) {

				var ext = re.exec(breadedElements[i])[1];

				// comprobar si es subcarpeta o subarchivo
				var bdirtoreadcheck = driveunit + ffoldertoaddtags + "\/" + breadedElements[i];

				try {
					var barorfo = "i_am_an_archive";
					var barorfo = fs.readdirSync(bdirtoreadcheck);
				}
				catch(exception) {};

				bdirectoryelement.name = "\/" + breadedElements[i]
				bdirectoryelement.ext = ext;
				bdirectoryelement.arorfo = barorfo;
				bdirectoryelement.id = ""; // se lo metemos después de separar carpetas y archivos (y estará oculto en la vista)
				bdirectoryelement.tagsid = []; // se lo metemos después de separar carpetas y archivos

				var bcopied_directoryelement = jQuery.extend({}, bdirectoryelement); // necesario trabajar con una copia para actualizar el objeto directorycontent
				bdirectorycontent[i] = bcopied_directoryelement;
			};

			// separa carpetas y archivos en dos objetos
			var i = 0;
			var ii = 0;
			var iii = 0;

			$.each(bdirectorycontent, function(i) {

				if (bdirectorycontent[i].arorfo != "i_am_an_archive" || bdirectorycontent[i].arorfo == undefined || bdirectorycontent[i].name == "Documents and Settings") {
					bdirectoryfolders[ii] = bdirectorycontent[i];

					ii++;
				} else {
					bdirectoryarchives[iii] = bdirectorycontent[i];
					iii++;
				};

				flag1++

			});

			// leemos datos subcarpetas
			if (bdirectoryfolders.length >= 1) {

				var treeelementtagsinview = [];
				var elementtagsinview = [];
				var treeelementosdirectoriotags = [];
				var parenttreeelementtagsinview = [];
				var valueoriginal=[];
				var parentvalueoriginal=[];
				var valueaponer=[];
				var parentvalueaponer=[];

				var trans = db.transaction(["folders"], "readonly")
				var objectStore = trans.objectStore("folders")
				$.each(bdirectoryfolders, function(i) {

					var bfolderupdate = {};

					var req = objectStore.openCursor();

					req.onerror = function(event) {

						console.log("error: " + event);

					};

					req.onsuccess = function(event) {

						var cursor = event.target.result;
						if(cursor){

							if(cursor.value.folder == ffoldertoaddtags + bdirectoryfolders[i].name){ // si la subcarpera ya esta en la bd

								bdirectoryfolders[i].tagsid = cursor.value.foldertags;
								bdirectoryfolders[i].id = cursor.value.folderid;

							}
							cursor.continue();
						};

					}

					trans.oncomplete = function() {

						$.each(bdirectoryfolders, function(i) {

							var isnewtagfold = "yes"; // valor por defecto
							var barraydetags=[];

							if (bdirectoryfolders[i].id != "") { // si la subcarpeta ya estaba en bd

								barraydetags = bdirectoryfolders[i].tagsid

								for (n in barraydetags) { // recorremos los tags que tenia

									if (barraydetags[n] == taganadir) { // si ya estaba el tag en la carpeta

										isnewtagfold = "no";
										flag2++
										return;

									}

								}

								if (isnewtagfold == "yes") { // si no es tag nuevo no se hace nada

									var trans2 = db.transaction(["folders"], "readwrite")
									var objectStore2 = trans2.objectStore("folders")
									var req2 = objectStore2.openCursor();

									req2.onerror = function(event) {

										console.log("error: " + event);
									};

									req2.onsuccess = function(event) {

										var cursor2 = event.target.result;

										if(cursor2){

											if(cursor2.value.folderid == bdirectoryfolders[i].id) {

												bfolderupdate.folderid = cursor2.value.folderid;
												bfolderupdate.folder = cursor2.value.folder;

												if (typeof barraydetags === 'string') {
													barraydetags = barraydetags.split(",");
												}

												barraydetags.push(taganadir);
												bfolderupdate.foldertags = barraydetags;

												// ahora que ya tenemos todos los datos del objeto hacemos update con el en la base de datos
												var res3 = cursor2.update(bfolderupdate);

												res3.onerror = function(event){
													console.log("error tag no añadida en subcarpetas: " + event);
												}

												res3.onsuccess = function(event){

													flag2++

												}

											}

											cursor2.continue();
										}

									}

								} // --fin if is newtag

							} // --fin if subcarpeta estaba en bd

							else { // si la carpeta no estaba en la base de datos

								// añadimos el objeto con sus paramentros mediante put
								var trans2 = db.transaction(["folders"], "readwrite")
								var req2 = trans2.objectStore("folders")
									.put({ folder: ffoldertoaddtags + bdirectoryfolders[i].name, foldertags: [taganadir] }); // el id no hace falta pues es autoincremental

								req2.onerror = function(event){
									console.log("error tag no añadida en subcarpetas: " + event);
								}

								req2.onsuccess = function(event){

									// console.log("tags añadidaas a subcarpetas");
									flag2++

								}

							}

							// se procesan los valores que luego se pondran en los tags del treeview y del directorio
							valueoriginal[i] = bdirectoryfolders[i].tagsid;
							index = valueoriginal[i].indexOf(taganadir); // localizamos el id del tag

							if (index == -1) {

								valueaponer[i] = valueoriginal[i].toString(); // de objeto a string

								if (valueaponer[i] != "") {
									valueaponer[i] = valueaponer[i] + "," + taganadir;
								} else {
									valueaponer[i] = taganadir;
								}

								valueaponer[i] = valueaponer[i].split(','); // de string a array

								// los tagdivs son tanto para el treeview como para el directoryview
								tagsdivs = "";
								for(var k = 0; k < valueaponer[i].length; k += 1){ //recorremos el array
									tagsdivs += "<div class='tagticket' value='"+ valueaponer[i][k] +"'>" + valueaponer[i][k] +  "</div>" ;
								};

								// se redibujarán los tags del treeview si están desplegadas las subcarpetas
								$.each ($("#filetree span"), function(t) {
									if($("#filetree span:eq("+t+")").attr("rel2") == ffoldertoaddtags + bdirectoryfolders[i].name) {
										treeelementtagsinview[i] = $("#filetree span:eq("+t+")")[0].children[2] //el div tags del treeview
									}

								});

								if (treeelementtagsinview[i]) { //si hay elementos en el tree (esta la subcarpeta desplegada en el treeview)

									treeelementtagsinview[i].innerHTML =  tagsdivs;

									treeelementosdirectoriotags[i] = treeelementtagsinview[i].children;

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
											$.each (treeelementtagsinview[i].children, function(u) {
												if (cursor2.value.tagid == treeelementtagsinview[i].children[u].getAttribute("value")) {

													var color = "#" + cursor2.value.tagcolor;
													var complecolor = hexToComplimentary(color);

													treeelementtagsinview[i].children[u].className += " verysmall " + cursor2.value.tagform;
													treeelementtagsinview[i].children[u].setAttribute("value", cursor2.value.tagid);
													treeelementtagsinview[i].children[u].setAttribute("style", "background-color: #" + cursor2.value.tagcolor + ";" + "color: " + complecolor + ";")
													treeelementtagsinview[i].children[u].innerHTML = cursor2.value.tagtext;

												}
											});

											cursor2.continue();

										}

									};

								} //--fin si hay elemento visibles en el tree


								// se redibujan los tags de las subcarpetas si estámos dentro de la carpeta
								if (dirtoexec == driveunit + ffoldertoaddtags) {

									// primero cambiamos el value de la etiqueta tags..
									$.each ($(".explofolder"), function(n) {
										if ($(".explofolder:eq("+n+")").attr("value") == bdirectoryfolders[i].name) {
											elementtagsinview[i] = $(".explofolder:eq("+n+")").siblings(".tags")
										}
									});

									elementtagsinview[i][0].setAttribute("value", valueaponer[i]);
									elementtagsinview[i][0].innerHTML = tagsdivs;

									// para aplicarles los estilos a los tags hay que recurrir a la bd
									var trans2 = db.transaction(["tags"], "readonly")
									var objectStore2 = trans2.objectStore("tags")

									elementosdirectoriotags[i] = elementtagsinview[i].children(".tagticket");

									var req2 = objectStore2.openCursor();

									req2.onerror = function(event) {
										console.log("error: " + event);
									};
									req2.onsuccess = function(event) {
										var cursor2 = event.target.result;
										if (cursor2) {
											$.each(elementosdirectoriotags[i], function(n) {
												if (cursor2.value.tagid == elementosdirectoriotags[i][n].getAttribute("value")) {

													var color = "#" + cursor2.value.tagcolor;
													var complecolor = hexToComplimentary(color);

													elementosdirectoriotags[i][n].className += " small " + cursor2.value.tagform;
													elementosdirectoriotags[i][n].setAttribute("value", cursor2.value.tagid);
													elementosdirectoriotags[i][n].setAttribute("style", "background-color: #" + cursor2.value.tagcolor + ";" + "color: " + complecolor + ";")
													elementosdirectoriotags[i][n].innerHTML = cursor2.value.tagtext;

												}

											});

											cursor2.continue();

										}

									};

								} //--fin si hay elementos visibles en el directoryview


							}

						}); // --fin each directoryfolders

					} // -- fin trans

				}); // --fin each directoryfolders

			elementstagsorder();

			} // -- fin si hay carpetas


			// leemos datos subcarchivos
			if (bdirectoryarchives.length >= 1) {

				var fvalueoriginal = [];
				var fvalueaponer = [];
				var felementtagsinview  = [];
				var felementosdirectoriotags = [];

				var trans11 = db.transaction(["files"], "readonly")
				var objectStore11 = trans11.objectStore("files")
				$.each(bdirectoryarchives, function(i) {

					var bfileupdate = {};

					var req11 = objectStore11.openCursor();

					req11.onerror = function(event) {

						console.log("error: " + event);

					};

					req11.onsuccess = function(event) {

						var cursor11 = event.target.result;
						if(cursor11){

							if (cursor11.value.filefolder == ffolderidtoaddtags ) {
								if (cursor11.value.filename == bdirectoryarchives[i].name){  //entoces el subarchivo ya estaba en la bd
									bdirectoryarchives[i].tagsid = cursor11.value.filetags;
									bdirectoryarchives[i].id = cursor11.value.fileid;

								}

							}
							cursor11.continue();
						};

					}

					trans11.oncomplete = function() {

						$.each(bdirectoryarchives, function(i) {

							// actualizar visual
							fvalueoriginal[i] = bdirectoryarchives[i].tagsid;
							findex = fvalueoriginal[i].indexOf(taganadir); // localizamos el id del tag

							if (findex == -1) {

								fvalueaponer[i] = fvalueoriginal[i].toString(); // de objeto a string
								if (fvalueaponer[i] != "") {
									fvalueaponer[i] = fvalueaponer[i] + "," + taganadir;
								} else {
									fvalueaponer[i] = taganadir;
								}
								fvalueaponer[i] = fvalueaponer[i].split(','); // de string a array

								var ftagsdivs = "";
								for(var k = 0; k < fvalueaponer[i].length; k += 1){ // recorremos el array
									ftagsdivs += "<div class='tagticket' value='"+ fvalueaponer[i][k] +"'>" + fvalueaponer[i][k] +  "</div>" ;
								};

							}

							// se redibujan los tags de las subcarpetas si estámos dentro de la carpeta
							if (dirtoexec == driveunit + ffoldertoaddtags) {

								// primero cambiamos el value de la etiqueta tags..
								$.each ($(".explofile"), function(n) {
									if ($(".explofile:eq("+n+")").attr("value") == bdirectoryarchives[i].name) {
										felementtagsinview[i] = $(".explofile:eq("+n+")").siblings(".tags")
									}
								});

								felementtagsinview[i][0].setAttribute("value", fvalueaponer[i]);
								felementtagsinview[i][0].innerHTML = ftagsdivs;

								// para aplicarles los estilos a los tags hay que recurrir a la bd
								var trans2 = db.transaction(["tags"], "readonly")
								var objectStore2 = trans2.objectStore("tags")

								felementosdirectoriotags[i] = felementtagsinview[i].children(".tagticket");

								var req2 = objectStore2.openCursor();

								req2.onerror = function(event) {
									console.log("error: " + event);
								};
								req2.onsuccess = function(event) {
									var cursor2 = event.target.result;
									if (cursor2) {
										$.each(felementosdirectoriotags[i], function(n) {

											if (cursor2.value.tagid == felementosdirectoriotags[i][n].getAttribute("value")) {

												var color = "#" + cursor2.value.tagcolor;
												var complecolor = hexToComplimentary(color);

												felementosdirectoriotags[i][n].className += " small " + cursor2.value.tagform;
												felementosdirectoriotags[i][n].setAttribute("value", cursor2.value.tagid);
												felementosdirectoriotags[i][n].setAttribute("style", "background-color: #" + cursor2.value.tagcolor + ";" + "color: " + complecolor + ";")
												felementosdirectoriotags[i][n].innerHTML = cursor2.value.tagtext;

											}

										});

										cursor2.continue();

									}

								};

							} //--fin si hay elementos visibles en el directoryview

							var isnewtag = "yes" // valor por defecto
							var barraydetags=[];

							if (bdirectoryarchives[i].id != "") { // si el subarchivo ya estaba en bd

								barraydetags = bdirectoryarchives[i].tagsid

								for (n in barraydetags) { // recorremos los tags que tenia

									if (barraydetags[n] == taganadir) { // si ya estaba

										isnewtag = "no";
										flag2++
										return;

									}

								}

								if (isnewtag == "yes") { // nuevo tag, si no es tag nuevo no se hace nada

									var trans3 = db.transaction(["files"], "readwrite");
									var objectStore3 = trans3.objectStore("files");
									var req3 = objectStore3.openCursor();

									req3.onerror = function(event) {

										console.log("error: " + event);
									};

									req3.onsuccess = function(event) {

										var cursor3 = event.target.result;

										if(cursor3){

											if(cursor3.value.fileid == bdirectoryarchives[i].id) {

												bfileupdate.fileid = cursor3.value.fileid;
												bfileupdate.filename = cursor3.value.filename;
												bfileupdate.fileext = cursor3.value.fileext;
												bfileupdate.filefolder = cursor3.value.filefolder
												barraydetags = cursor3.value.filetags;
												barraydetags = barraydetags + "," + taganadir;
												bfileupdate.filetags = barraydetags;

												// ahora que ya tenemos todos los datos del objeto hacemos update con el en la base de datos
												var trans = db.transaction(["files"], "readwrite")
												var request = trans.objectStore("files")
												.put(bfileupdate);

												request.onerror = function(event) {

													console.log("error tag no añadida en subcarpetas: " + event);

												};

												request.onsuccess = function(event) {

													flag2++

												}

											}

											cursor3.continue();
										}

									}

								} // --fin is newtag

							} // --fin if directoryarchives[i] estaba en bd

							else { // si el archivo no estaba en la base de datos

								// añadimos el objeto con sus paramentros mediante put
								var req2 = db.transaction(["files"], "readwrite")
									.objectStore("files")
									.put({ filefolder: ffolderidtoaddtags, filename: bdirectoryarchives[i].name, filetags: [taganadir], fileext: bdirectoryarchives[i].ext }); // el id no hace falta pues es autoincremental

								req2.onerror = function(event){
									console.log("error tag no añadida en subarchivos: " + event);
								}

								req2.onsuccess = function(event){

									// console.log("tags añadidaas a subarchivos");

									flag2++

								}

							}

						}); // --fin each
					}

				}); // --fin each

				if (bdirectoryarchives.length == 0 && bdirectoryfolders.length == 0) {

					// console.log("no hay subelementos")

				}

			} //-- fin directoryarchives length


		var msgtime = 1000 + (bdirectorycontent.length * 40)
		customAlert("(PLEASE, WAIT A MOMENT WHILE TAGS ARE ADDED)...",msgtime);

		} //-- fin trans


	}

} // --fin function addtagsubs()

// --fin Popup añadir tags a subelementos


// para el Popup options
window.s = "";
window.listadofiltradodeDB = [];


function optionspreload() {

	var Sniffr = require("sniffr");
	var agent = navigator.userAgent
	s = new Sniffr();
	s.sniff(agent);

	listadofiltradodeDB = [];

	// tomar nombres de las bases de datos indexdb:
	window.databaselistdb = [];
    var request = window.indexedDB.open("tagstoo_databaselist_1100", 1);
    request.onerror = function(event) {  };

    request.onupgradeneeded = function(event) {

      	var objectStore;
	    databaselistdb = event.target.result;

	    objectStore = databaselistdb.createObjectStore("databases", { keyPath: "dbid", autoIncrement:true });
	    objectStore.createIndex("dbname", "dbname", { unique: true });

    }

    request.onsuccess = function(event) {

	    databaselistdb = request.result;
	    var objectStore = databaselistdb.transaction("databases").objectStore("databases");

	    objectStore.openCursor().onsuccess = function(event) {

	        var cursor = event.target.result;
	        if (cursor) {

	          listadofiltradodeDB.push(cursor.value.dbname)
	          cursor.continue();

	        } 

      	};

      	var currentlydatabaseused = localStorage["currentlydatabaseused"];

		$('#selecteddb').html(currentlydatabaseused);

		if (localStorage["showretroagain"] == "yes") {
        	alertify.alert(`If before this version you have used version 1.4 or previous of Tagstoo <br>and databases don´t appear in the list, don´t worry, please <em><a href='popups/popup-info-help.html#databases14' target="_blank">read this</a></em><br><br><input type='checkbox' id='showretroagain' onclick='showretroagain()'><span>Do not show this message again</span>`);
      	}


		if (driveunit == "") { //esto es un apaño necesário en linux
			driveunit = " ";
		}

		if (driveunit) {

			if (s.os.name == "windows" || s.os.name == "macos") {
					 $('#selecteddrive').html(driveunit)
			}
			if (s.os.name == "linux") {
					 if(driveunit == " "){
							$('#selecteddrive').html("/" + driveunit)
					 } else {
							$('#selecteddrive').html(driveunit)
					 }
			}

		}


		loaddatabaseselect();
		loaddriveslist();



		// el checkbox closeconfirmation
		if(localStorage["closeconfirmation"]=="no") {
	        $('#closeconfirmation').prop('checked', false);
	    } else {
	        $('#closeconfirmation').prop('checked', true);
	    }
	    // el checkbox demotags
	    if(localStorage["demotags"]=="no") {
	        $('#demotags').prop('checked', false);
	    } else {
	        $('#demotags').prop('checked', true);
	    }
	    // el checkvox previewimgonviewmode1
	    if(localStorage["previewimgonviewmode1"]=="yes") {
	    	$('#previewimgonviewmode1').prop('checked', true);
	    } else {
	    	$('#previewimgonviewmode1').prop('checked', false);
	    }
	    // el checkvox previewepubonviewmode1
	    // if(localStorage["previewepubonviewmode1"]=="yes") {
	    // 	$('#previewepubonviewmode1').prop('checked', true);
	    // } else {
	    // 	$('#previewepubonviewmode1').prop('checked', false);
	    // }

	    if(localStorage["mostrartips"]=="yes") {
	    	$('#showtips').prop('checked', true);
	    } else {
	    	$('#showtips').prop('checked', false);
	    }



	    if (localStorage["autoslideshow"]=="yes") {
	    	$('#autoslideshow').prop('checked', true);
	    } else {
	    	$('#autoslideshow').prop('checked', false);
	    }

	    if (!localStorage["autoslideshowtime"]) {
	    	$('#autoslideshowtime').val("6")
	    } else {
	    	$('#autoslideshowtime').val(localStorage["autoslideshowtime"])
	    }


		$("#databaseselect").change(function() {

			$('#selecteddb').html($("#databaseselect").val());

		});


		$("#unitselect").change(function() {

			if (s.os.name == "windows") {

			 var availabledrives=[];

			 $('#selecteddrive').html($("#unitselect").val());

				var drivelist = require('drivelist');
				var driveLetters = require('windows-drive-letters');

				var t="";
				var tdesc="";

				availabledrives = drivelist.list((error, drives) => {
					if (error) {
						throw error;
					}

					drives.forEach((drive, i) => {

						i= i+1;

						t += "<option value='" + drive.mountpoints["0"].path + "'>" + drive.mountpoints["0"].path + "</option>"
						tdesc += "<div value='" + drive.mountpoints["0"].path + "' class='drivedesc'>" + drive.description + "</div>"

					});

					// para detectar unidades virtuales en windows y añadirlas a la lista
					try {
						letters = driveLetters.usedLettersSync();
						// console.log(letters); // => ['C', 'D', ...]
					} catch (err) {};

					$.each (letters, function(i){

						unidadvirtual = "si";
						drives.forEach((drive, u) => {

							if (letters[i]+":" == drive.mountpoints["0"].path ) {
								unidadvirtual = "no";
							}

						});

						if (unidadvirtual == "si") {
							t += "<option value='" + letters[i] + ":'>" + letters[i] + ":</option>"
							tdesc += "<div value='" + letters[i] + ":' class='drivedesc'>Virtual Drive</div>"
						}


					});

					$("#unitselect").html(t);
					$("#unitselect").val($('#selecteddrive').html());

					$("#drivedesc").css("display","none")
					$("#drivedesc").html("("+tdesc+")");

					// se pintará solo la info del drive seleccionado
					$.each($("#drivedesc div"), function(n) {

						if($(this).attr("value") != $("#selecteddrive").html()) {

							$(this).remove()

						}

					});

					$("#drivedesc").css("display","inline-block");

				});

			}

			if (s.os.name == "linux") {

				console.log($("#unitselect").val())

				if ($("#unitselect").val() != "") {
					$('#selecteddrive').html( "/" + $("#unitselect").val() );
				} else {
					$('#selecteddrive').html("/")
				}

				drives = [""];

				// Detectar y añadir unidades externas a la lista

				const username = require('username');

				username().then(username => {

					var dirtoread = "/media/" + username // la carpeta donde se montan las unidades externas
					var re = /(?:\.([^.]+))?$/; // expresión regular para detectar si un string tiene extensión

					var directoryelement = [];
					var directorycontent = [];
					window.directoryarchives = [];
					window.directoryfolders = [];

					var readedElements = fs.readdirSync(dirtoread)
					var iteratentimes = readedElements.length;

					for (i = 0; i < iteratentimes; i++) {

						var ext = re.exec(readedElements[i])[1];
						if (!ext) {
							ext="&nbsp;";
						}

						// comprobar si es carpeta o archivo. En principio solo deveria haber carpetas correspondientes a las unidades, pero por si acaso...
						var dirtoreadcheck = dirtoread + "\/" + readedElements[i];

						try {
							var arorfo = "i_am_an_archive";
							var arorfo = fs.readdirSync(dirtoreadcheck);
						}
						catch(exception) {};

						directoryelement.name = readedElements[i]

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

					// se añaden las carpetas detectadas como unidades externas disponibles
					$.each(directoryfolders, function(i) {
						drives.push("media/" + username + "/" + directoryfolders[i].name);
					});

					var t="";
					var tdesc="";

					$.each (drives, function(i){

						if (drives[i] == ""){
							t += "<option value=' " + drives[i] + "'>/" + drives[i] + "</option>";
							tdesc += "<div value=' " + drives[i] + "' class='drivedesc'>" + "local disk" + "</div>";
						} else {
							t += "<option value='" + drives[i] + "'>/" + drives[i] + "</option>";
							tdesc += "<div value='" + drives[i] + "' class='drivedesc'>" + "external disk" + "</div>";
						}

					});

					$("#unitselect").html(t);
					$("#unitselect").val("");

					$("#drivedesc").css("display","none")
					$("#drivedesc").html("("+tdesc+")");

					// se pintará solo la info del drive seleccionado
					$.each($("#drivedesc div"), function(n) {

						if("/" + $(this).attr("value") != $("#selecteddrive").html()) {

							$(this).remove()

						}

					});

					$("#drivedesc").css("display","inline-block");

				});

			}

			if (s.os.name == "macos") {

	          console.log($("#unitselect").val())

	          if ($("#unitselect").val() != "") {
	            $('#selecteddrive').html( "/" + $("#unitselect").val() );
	          } else {
	            $('#selecteddrive').html("/")
	          }

	          drives = [""];

	          // Detectar y añadir unidades

	          var dirtoread = "/Volumes" ;
	          var re = /(?:\.([^.]+))?$/; // expresión regular para detectar si un string tiene extensión

	          var directoryelement = [];
	          var directorycontent = [];
	          window.directoryarchives = [];
	          window.directoryfolders = [];

	          var readedElements = fs.readdirSync(dirtoread)
	          var iteratentimes = readedElements.length;

	          for (i = 0; i < iteratentimes; i++) {

	            var ext = re.exec(readedElements[i])[1];
	            if (!ext) {
	              ext="&nbsp;";
	            }

	            // comprobar si es carpeta o archivo. En principio solo deveria haber carpetas correspondientes a las unidades, pero por si acaso...
	            var dirtoreadcheck = dirtoread + "\/" + readedElements[i];

	            try {
	              var arorfo = "i_am_an_archive";
	              var arorfo = fs.readdirSync(dirtoreadcheck);
	            }
	            catch(exception) {};

	            directoryelement.name = readedElements[i]

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

	          // se añaden las carpetas detectadas como unidades externas disponibles
	          $.each(directoryfolders, function(i) {
	            drives.push("Volumes/" + directoryfolders[i].name);
	          });

	          var t="";
	          var tdesc="";

	          $.each (drives, function(i){

	            if (drives[i] != ""){
	              t += "<option value='" + drives[i] + "'>" + drives[i] + "</option>";
	              tdesc += "<div value='" + drives[i] + "' class='drivedesc'>" + "" + "</div>"; + "</div>";
	            }

	          });

	          $("#unitselect").html(t);
	          $("#unitselect").val("");

	          $("#drivedesc").css("display","none")
	          $("#drivedesc").html("("+tdesc+")");

	          // se pintará solo la info del drive seleccionado
	          $.each($("#drivedesc div"), function(n) {

	            if("/" + $(this).attr("value") != $("#selecteddrive").html()) {

	              $(this).remove()

	            }

	          });

	          $("#drivedesc").css("display","inline-block");

	        }


		});

		$("#newdatabase").on('click', function(){

			if($("#newdatabasename").val() != "" ){

				var preexistingname = "no";

				$.each (listadofiltradodeDB, function(i) {
					if (listadofiltradodeDB[i] == $("#newdatabasename").val()) {
						preexistingname = "yes";
					}

				});

				if(preexistingname=="no") {

					$('#selecteddb').html($("#newdatabasename").val())
				}
				else {
					alertify.alert("The name you chosen already exists, first delete the database that use this name if you want to use it.");
				}

			}
			else {
				alertify.alert("You must enter a name for the database first.");
			}

		});
		// lo mismo si se pulsa enter..
		$('#newdatabasename').on('keypress', function (e) {
     		if(e.which === 13){

     			if($("#newdatabasename").val() != "" ){

					var preexistingname = "no";

					$.each (listadofiltradodeDB, function(i) {
						if (listadofiltradodeDB[i] == $("#newdatabasename").val()) {
							preexistingname = "yes";
						}

					});

					if(preexistingname=="no") {

						$('#selecteddb').html($("#newdatabasename").val())
					}
					else {
						alertify.alert("The name you chosen already exists, first delete the database that use this name if you want to use it.");
					}

				}
				else {
					alertify.alert("You must enter a name for the database first.");
				}

     		};

     	});


		$("#exportdata").on('click', function(){

			alertify.alert("A file open dialog will be open, you can either select a pre existing file or create a new one (right mouse button), be careful, data in the selected file will be overwritten.", function() {

				document.getElementById('toexportfile').value = ""; // esto es para que siempre funcione el on change

				document.getElementById('toexportfile').click();

				$('#toexportfile').off('change'); // para que no se acumulen event handlers (para que no se repita..)

				$('#toexportfile').on('change', function() {

					var file = $('#toexportfile')["0"].value

					// abrimos la bd seleccionada
					var request = window.indexedDB.open($('#selecteddb').html(), 1);
					request.onerror = function(event) {
						// console.log("error: database not loaded");
					};

					//aqui realizamos algunas operaciones previas con la bd porque luego si no puede dar fallos a la hora de escribir si está no se ha abierto nunca...
					request.onsuccess = function(event) {

						// var objectStore;
						var db = event.target.result;

						var idbExportImport = require("indexeddb-export-import"); // to save and load the contents of an IndexedDB database

						idbExportImport.exportToJsonString(db, function(err, jsonString) {
							if(err)
								console.error(err);
							else {

								// console.log("Exported as JSON: " + jsonString);
								alertify.confirm("Attention, you selected to write in <em>'"+file+ "'</em>, all previous data in file will be overwritten, are you sure?", function (e) {
						            if (!e) {
						              	x = "You pressed Cancel!";
						              	console.log(x);
						            } else {
						              	x = "You pressed OK!";
						              	console.log(x)
						            	// se escribe el fichero
										fs.writeFile(file, jsonString, function (err) {
											if (err) return console.log(err);
											alertify.alert("<em>'"+file + "'</em> successfully writed.");

										})

									}

								});

							}

						});

					};

				});

			});

		});


		$("#inportdata").on('click', function(){

  			if ($('#selecteddb').html() != "") {

  				alertify.alert("A file open dialog will be open, select the file where database is saved, be careful, data in the selected database will be overwritten by the content of the file.", function () {

  					document.getElementById('toinportfile').value = ""; // esto es para que siempre funcione el on change

  					document.getElementById('toinportfile').click()

  					$('#toinportfile').off('change'); // para que no se acumulen event handlers (para que no se repita..);

  					$('#toinportfile').on('change', function() {

  						var file = $('#toinportfile')["0"].value

  						fs.readFile(file, 'utf8', function (err,data) {
  							if (err) {
  								return console.log(err);
  							}

  							try {
  								// se comprueba si es json
  								JSON.parse(data);
  								// console.log("is JSON");

  								// y continua
  								alertify.confirm("Attention, data in selected database, <em>'" + $('#selecteddb').html() + "'</em>,  will be overwritten by the content of file <em>'" + file + "'</em>, are you sure?", function (e) {
  									if (!e) {
  										x = "You pressed Cancel!";
  										console.log(x);
  									} else {
  										x = "You pressed OK!";
  										console.log(x)

  										// habrimos la bd
  										var tooverwritedb = [];
  										var request = window.indexedDB.open($('#selecteddb').html(), 1);
  										request.onerror = function(event) {
  											console.log("error: database not loaded");
  										};

  										// aquí realizamos algunas operaciones previas con la bd porque luego si no puede dar fallos a la hora de escribir si está no se ha abierto nunca...
  										request.onupgradeneeded = function(event) {

  											var objectStore;
  											var db = event.target.result;

  											tagData = [
  												{ tagtext: "Demo1", tagpos: 0, tagcolor: "66B032", tagform: "tag_fruit" },
  												{ tagtext: "DemoTag2", tagpos: 1, tagcolor: "3D01A4", tagform: "tag_classicframe1" },
  												{ tagtext: "DemoTag3", tagpos: 2, tagcolor: "0391CE", tagform: "tag_cylinder" },
  												{ tagtext: "Demo4", tagpos: 3, tagcolor: "FE2914", tagform: "tag_piggybank" },
  												{ tagtext: "DemoTag5", tagpos: 4, tagcolor: "FD5308", tagform: "tag_maletin" }
  											];

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


  										};

  										request.onsuccess = function(event) {

  											var db = event.target.result;

  											tooverwritedb = request.result;

  											var idbExportImport = require("indexeddb-export-import"); // to save and load the contents of an IndexedDB database
  											// se vaciá y después se escribe en la base de datos
  											idbExportImport.clearDatabase(tooverwritedb, function(err) {

  												if(err) {
  													console.log(err)
  												} else {
  													console.log("data cleared");

  													idbExportImport.importFromJsonString(tooverwritedb, data, function(err2) { }); // no meto el código dentro porque desafortunadamente no funciona. Sigue el código a continuación y doy por hecho que ha escrito bien.

  													alertify.alert('Data successfully imported.', function(){

  														// si es el database actualmente en uso recarga tagstoo
														if ($('#selecteddb').html() == localStorage["currentlydatabaseused"]) {
															setTimeout(function(){
																saveoptions();															 
																cerrar(); 
																restarttagstoo();
															}, 500);

														}

  													});

  												}

  											});

  											//se añade la bd al listado de bd existentes
											var requestdbnames = window.indexedDB.open("tagstoo_databaselist_1100", 1);
										    requestdbnames.onerror = function(event) {
										      // console.log("error: database not loaded");
										    };

										    requestdbnames.onsuccess = function(event){

										    	var databaselistdb = requestdbnames.result;
												var requestdbadd = databaselistdb.transaction(["databases"], "readwrite")
																.objectStore("databases")
																.add({ dbname: $('#selecteddb').html() });

												requestdbadd.onsuccess = function(event) {												

													// se vuelve a cargar la lista
													listadofiltradodeDB.push($('#selecteddb').html())
													loaddatabaseselect();

												};

												requestdbadd.onerror = function(event) { };

										    }

  										}

  									}

  								});

  							} catch (e) {
  								console.log("not JSON");
  								alertify.alert("It appears that <em>'" +file+ "'</em> do not have a valid data format, please select a valid data file.", function () {
  									document.getElementById('toinportfile').click();
  								});

  							}

  						});

  					});

  				});

  			} else {
  				alertify.alert("You must select a database from where to import first.");
  			}

  		}); // --fin importdata onclick


		$("#deletedb").on('click', function(){

			alertify.confirm("Attention, you select to delete <em>'"+$('#selecteddb').html()+"'</em>, are you sure?", function (e) {
				if (!e) {
					x = "You pressed Cancel!";
					console.log(x);
				} else {
					x = "You pressed OK!";
					console.log(x)

					// comprobación de si se borra la bd actual para salir de una manera o otra (recargando inicio o no)
					if (localStorage["currentlydatabaseused"] == $('#selecteddb').html()) {

						alertify.confirm("You chosen to delete database that is currently used, to make it possible you must delete it from the program initial start window, do you want to restart program to make possible to delete it?", function (e) {
							if (!e) {
								x = "You pressed Cancel!";
								console.log(x);
							} else {
								x = "You pressed OK!";
								console.log(x)

								window.parent.location.assign("initialselect.html");

							}

						});

					} else {

						var DBDeleteRequest = window.indexedDB.deleteDatabase($('#selecteddb').html());

						DBDeleteRequest.onerror = function(event) {
						  	console.log("Error deleting database.");
						};

						DBDeleteRequest.onsuccess = function(event) {


							// se ha de borrar tambien del listado de bases de datos
			                var requestdblist = window.indexedDB.open("tagstoo_databaselist_1100", 1);   

			                requestdblist.onsuccess = function(event) {      

			                  var databaselistdb = request.result;


			                  var trans = databaselistdb.transaction(["databases"], "readwrite")
			                  var objectStore = trans.objectStore("databases")
			                  var req = objectStore.openCursor();

			                  req.onerror = function(event) {

			                    console.log("error: " + event);
			                  };

			                  req.onsuccess = function(event) {

			                    var cursor = event.target.result;

			                    if(cursor) {

			                      if(cursor.value.dbname == $('#selecteddb').html()) {

			                        var res2 = cursor.delete(cursor.value.dbid);

			                      }

			                      cursor.continue();

			                    }

			                  }

			                }


						  	// console.log("Database deleted successfully");
				  		  	alertify.alert("Database deleted successfully.", function () {

						  	  	cerrar();
							  	window.parent.document.getElementById('options').click()

						  	});

						};

					}

				}

			});

		});

		// para prevenir la introducción de letras en el autoslideshowtime
		$("#autoslideshowtime").keydown(function (e) {
	        // Allow: backspace, delete, tab, escape, enter and .
	        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
	             // Allow: Ctrl+A, Command+A
	            (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) ||
	             // Allow: home, end, left, right, down, up
	            (e.keyCode >= 35 && e.keyCode <= 40)) {
	                 // let it happen, don't do anything
	                 return;
	        }
	        // Ensure that it is a number and stop the keypress
	        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
	            e.preventDefault();
	        }

    	});



    	window.colortagstoo = localStorage["colortagstoo"];

		if (window.colortagstoo == "not") {

		    // var ls = document.createElement('link');
		    // ls.rel="stylesheet";
		    // ls.href= "css/version_grey.css";
		    // document.getElementsByTagName('head')[0].appendChild(ls);

		    // para que aparezca chequeado
		    $(".coloronoffswitch-checkbox").addClass("check");
		    $(".coloronoffswitch-switch").css("background","#bbb");

		}


	  	$(".coloronoffswitch-inner, .coloronoffswitch-switch").bind('click', function() {

		    if(window.colortagstoo == "yes") {

		        window.colortagstoo = "not";
		        $(".coloronoffswitch-checkbox").addClass("check");
		        $(".coloronoffswitch-switch").css("background","#bbb");

		        // hay que definir cada vez que se añade
		        var ls = document.createElement('link');
		        ls.rel="stylesheet";
		        ls.href= "css/version_grey.css";
		        window.top.$('head')[0].appendChild(ls);
		        var ls = document.createElement('link');
		        ls.rel="stylesheet";
		        ls.href= "css/version_grey.css";
		        window.$('head')[0].appendChild(ls);

		        if($(this)["0"].parentElement.parentElement.parentElement.parentElement.parentElement.children[1].children["dirview-wrapper"]){ //si es el explore (una manera de saberlo)
		        	var ls = document.createElement('link');
			        ls.rel="stylesheet";
			        ls.href= "css/version_grey.css";
			        top.searcher.$('head')[0].appendChild(ls);
		        } else { //si es el searcher
		        	var ls = document.createElement('link');
			        ls.rel="stylesheet";
			        ls.href= "css/version_grey.css";
			        top.explorer.$('head')[0].appendChild(ls);

		        }		        

		        localStorage["colortagstoo"] = window.colortagstoo;


		    } else if (window.colortagstoo == "not") {

		        window.colortagstoo = "yes";
		        $(".coloronoffswitch-checkbox").removeClass("check");
		        $(".coloronoffswitch-switch").css("background","linear-gradient(315deg,red,yellow,green)");

		        $('link[rel=stylesheet][href~="css/version_grey.css"]').remove();

		        window.top.$('link[rel=stylesheet][href~="css/version_grey.css"]').remove();
		        window.$('link[rel=stylesheet][href~="css/version_grey.css"]').remove();
		        top.searcher.$('link[rel=stylesheet][href~="css/version_grey.css"]').remove();
		        top.explorer.$('link[rel=stylesheet][href~="css/version_grey.css"]').remove();

		        localStorage["colortagstoo"] = window.colortagstoo;

		    }

		});

	};

} // --fin optionspreload()

function loaddatabaseselect() {

	// console.log(listadofiltradodeDB)

	$("#databaseselect").find('option').remove().end(); // con esto se vacían las opciones del select para volver a llenarlo con las lineas de abajo

	setTimeout(function () { //necesario para que le de tiempo a cargar la lista.

		$.each(listadofiltradodeDB, function(i){

			var opt = document.getElementById("databaseselect");
			var option = document.createElement("option");
			option.value = listadofiltradodeDB[i];
			var optionText = document.createTextNode(option.value);
			option.appendChild(optionText);
			opt.appendChild(option);

			opt.selectedIndex = -1; // para que ninguna este por defecto seleccionada

		})

	}, 400)

}

function loaddriveslist() {

	if (s.os.name == "windows") {

		var availabledrives=[];
		var drivelist = require('drivelist');
		var driveLetters = require('windows-drive-letters');

		var t="";
		var tdesc="";
		var letters=[];

		availabledrives = drivelist.list((error, drives) => {
			if (error) {
				throw error;
			}

			drives.forEach((drive, i) => {

				i= i+1;
				t += "<option value='" + drive.mountpoints["0"].path + "'>" + drive.mountpoints["0"].path + "</option>"
				tdesc += "<div value='" + drive.mountpoints["0"].path + "' class='drivedesc'>" + drive.description + "</div>"

			});

			// para detectar unidades virtuales en windows y añadirlas a la lista
			try {
				letters = driveLetters.usedLettersSync();
				// console.log(letters); // => ['C', 'D', ...]
			} catch (err) {};

			$.each (letters, function(i){

				var unidadvirtual = "si";

				drives.forEach((drive, u) => {
					if (letters[i]+":" == drive.mountpoints["0"].path ) {
						unidadvirtual = "no";
					}
				});

				if (unidadvirtual == "si") {
					t += "<option value='" + letters[i] + ":'>" + letters[i] + ":</option>"
					tdesc += "<div value='" + letters[i] + ":' class='drivedesc'>Virtual Drive</div>"
				}

			});


			$("#unitselect").html(t);
			$("#unitselect").val("");

			$("#drivedesc").css("display","none")
			$("#drivedesc").html("("+tdesc+")");


			// se pintará solo la info del drive seleccionado
			if ($("#selecteddrive").html()) {
				$.each($("#drivedesc div"), function(n) {

					if($(this).attr("value") != $("#selecteddrive").html()) {

						$(this).remove()

					}

				});
			}
			else { // este caso es para el inicio cuando no le ha dado tiempo a pintar el selecteddrive
				$.each($("#drivedesc div"), function(n) {

					if($(this).attr("value") != driveunit) {

						$(this).remove()

					}

				});

			}

			if($("#drivedesc").html() == "()") {
				$("#drivedesc").html("(Can't load this drive, select available one.)")
			}

			$("#drivedesc").css("display","inline-block");

		});

	}

	if (s.os.name == "linux") {

		console.log($("#unitselect").val())

		// if ($("#unitselect").val() != "") {
		// 	$('#selecteddrive').html( "/" + $("#unitselect").val() );
		// } else {
		// 	$('#selecteddrive').html("/")
		// }

		drives = [""];

		// Detectar y añadir unidades externas a la lista

		const username = require('username');

		username().then(username => {

			var dirtoread = "/media/" + username // la carpeta donde se montan las unidades externas
			var re = /(?:\.([^.]+))?$/; // expresión regular para detectar si un string tiene extensión

			var directoryelement = [];
			var directorycontent = [];
			window.directoryarchives = [];
			window.directoryfolders = [];

			var readedElements = fs.readdirSync(dirtoread)
			var iteratentimes = readedElements.length;

			for (i = 0; i < iteratentimes; i++) {

				var ext = re.exec(readedElements[i])[1];
				if (!ext) {
					ext="&nbsp;";
				}

				// comprobar si es carpeta o archivo. En principio solo deveria haber carpetas correspondientes a las unidades, pero por si acaso...
				var dirtoreadcheck = dirtoread + "\/" + readedElements[i];

				try {
					var arorfo = "i_am_an_archive";
					var arorfo = fs.readdirSync(dirtoreadcheck);
				}
				catch(exception) {};

				directoryelement.name = readedElements[i]

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

			// se añaden las carpetas detectadas como unidades externas disponibles
			$.each(directoryfolders, function(i) {
				drives.push("media/" + username + "/" + directoryfolders[i].name);
			});

			var t="";
			var tdesc="";

			$.each (drives, function(i){

				if (drives[i] == ""){
					t += "<option value=' " + drives[i] + "'>/" + drives[i] + "</option>";
					tdesc += "<div value=' " + drives[i] + "' class='drivedesc'>" + "local disk" + "</div>";
				} else {
					t += "<option value='" + drives[i] + "'>/" + drives[i] + "</option>";
					tdesc += "<div value='" + drives[i] + "' class='drivedesc'>" + "external disk" + "</div>";

				}

			});

			$("#unitselect").html(t);
			$("#unitselect").val("");

			$("#drivedesc").css("display","none")
			$("#drivedesc").html("("+tdesc+")");

			// se pintará solo la info del drive seleccionado
			$.each($("#drivedesc div"), function(n) {

				if("/" + $(this).attr("value") != $("#selecteddrive").html()) {

					$(this).remove()

				}

			});

			$("#drivedesc").css("display","inline-block");

		});

	}
	if (s.os.name == "macos") {

      // if ($("#unitselect").val() != "") {
      //   $('#selecteddrive').html( "/" + $("#unitselect").val() );
      // } else {
      //   $('#selecteddrive').html("/")
      // }

      drives = [""];

      // Detectar y añadir unidades
      
      var dirtoread = "/Volumes" ;
      var re = /(?:\.([^.]+))?$/; // expresión regular para detectar si un string tiene extensión

      var directoryelement = [];
      var directorycontent = [];
      window.directoryarchives = [];
      window.directoryfolders = [];

      var readedElements = fs.readdirSync(dirtoread)
      var iteratentimes = readedElements.length;

      for (i = 0; i < iteratentimes; i++) {

        var ext = re.exec(readedElements[i])[1];
        if (!ext) {
          ext="&nbsp;";
        }

        // comprobar si es carpeta o archivo. En principio solo deveria haber carpetas correspondientes a las unidades, pero por si acaso...
        var dirtoreadcheck = dirtoread + "\/" + readedElements[i];

        try {
          var arorfo = "i_am_an_archive";
          var arorfo = fs.readdirSync(dirtoreadcheck);
        }
        catch(exception) {};

        directoryelement.name = readedElements[i]

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

      // se añaden las carpetas detectadas como unidades externas disponibles
      $.each(directoryfolders, function(i) {
        drives.push("Volumes/" + directoryfolders[i].name);
      });

      var t="";
      var tdesc="";

      $.each (drives, function(i){

        if (drives[i] != ""){
          t += "<option value='" + drives[i] + "'>" + drives[i] + "</option>";
          tdesc += "<div value='" + drives[i] + "' class='drivedesc'>" + "" + "</div>"; + "</div>";
        }

      });

      $("#unitselect").html(t);
      $("#unitselect").val("");

      $("#drivedesc").css("display","none")
      $("#drivedesc").html("("+tdesc+")");

      // se pintará solo la info del drive seleccionado
      $.each($("#drivedesc div"), function(n) {

        if("/" + $(this).attr("value") != $("#selecteddrive").html()) {

          $(this).remove()

        }

      });

      $("#drivedesc").css("display","inline-block");

    }




}


function restarttagstoo() {

	localStorage["colortagstoo"] = window.colortagstoo;
	localStorage["currentlydatabaseused"] = $("#selecteddb").html();
	if (s.os.name == "windows" || s.os.name == "macos") {
		localStorage["selecteddriveunit"] = $("#selecteddrive").html();
		localStorage["lastuseddriveunit"] = $("#selecteddrive").html();
	}
	if (s.os.name == "linux") {
		if ($("#selecteddrive").html() == "/ "){
			localStorage["selecteddriveunit"] = $("#selecteddrive").html().slice(2);
			localStorage["lastuseddriveunit"] = $("#selecteddrive").html().slice(2);
		} else {
			localStorage["selecteddriveunit"] = $("#selecteddrive").html();
			localStorage["lastuseddriveunit"] = $("#selecteddrive").html();
		}

	}

	parent.location.reload();
};


function infopreload() {

	$("#showhelp").on('click', function(){

		$("#infoiframe").attr("src", "popups/popup-info-help.html");

	});

	$("#showabout").on('click', function(){

		$("#infoiframe").attr("src", "popups/popup-info-license-aboutthis.html");

	});

	$("#showlicenses").on('click', function(){

		$("#infoiframe").attr("src", "popups/popup-info-license-libs.html");

	});

	$("#showlicenses_nwjs").on('click', function(){

		$("#infoiframe").attr("src", "popups/popup-info-license-nwlibs.html");

	});

};

function showretroagain() {        
  if ($('#showretroagain').prop('checked')){
    localStorage["showretroagain"] = "no"
  } else {
    localStorage["showretroagain"] = "yes"
  }
}




function shownexttip() {

	$( "#alertify-ok" )[0].click();
	var tip=top.explorer.tip

	mostrartipnumero = localStorage["mostrartipnumero"]

	if (mostrartipnumero == 10) {//el tip final
		mostrartipnumero = 0

	}

	// tip mensaje
	alertify.alerttip(tip[mostrartipnumero]+tipquest)
	mostrartipnumero++

	localStorage["mostrartipnumero"]=mostrartipnumero

}

function mostrartips() {        
  if ($('#mostrartips').prop('checked')){
    localStorage["mostrartips"] = "no"

  } else {
    localStorage["mostrartips"] = "yes"
  }
}

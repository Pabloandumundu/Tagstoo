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


$(document).ready(function () {

	fs = window.top.fs;

	undo = [];
	undo.class = "";
	undo.rename = [];
	undo.rename.folder = "";
	undo.rename.original = "";
	undo.rename.nuevo = "";
	undo.rename.indb = "";
	undo.rename.id = "";
	undo.taggaarch = [];
	undo.taggaarch.archid = "";
	undo.taggaarch.tagid = "";
	undo.taggaarch.folderid =";"
	undo.taggfold = [];
	undo.taggfold.foldid = "";
	undo.taggfold.tagid = "";
	undo.taggfold.folder = "";
	undo.deltaggfold = [];
	undo.deltaggfold.foldid = "";
	undo.deltaggfold.tags = ""; // los tags o el tag a poner(lo que había antes del delete)
	undo.deltaggfold.folder = "";
	undo.deltaggfold.parentfolder = ""; // para visual
	undo.deltaggfile = [];
	undo.deltaggfile.file = "";
	undo.deltaggfile.fileid = ""; // solo en caso de que siga
	undo.deltaggfile.tags = ""	// los tags o el tag a poner(lo que había antes del delete)
	undo.deltaggfile.folderid = ""; // solo en el caso de que siga
	undo.deltaggfile.folder = "";
	undo.move = [];
	undo.move.subfoldersorig = "";
	undo.move.subfoldersnew = "";
	undo.move.rootfolders = "";
	undo.move.rootfiles = "";
	undo.move.rootfolderorig = "";
	undo.move.rootfoldernew = "";
	undo.copy = [];
	undo.copy.root = "";
	undo.copy.originalroot = "";
	undo.copy.rootfiles = "";
	undocopyrootfolders = [];
	undo.copy.folders = "";
	undo.copy.originalfolders = "";
	undo.copy.addedfileids = [];
	undo.copy.addedfolderids = [];


	language = localStorage["language"];

	if (language == 'EN') {

		ph_dato_no = "UNDO (not action to undo)";

	} else if (language =='ES') {

		ph_dato_no = "DESHACER (no hay acción para deshacer)";

	} else if (language =='FR') {

		ph_dato_no = "DÉFAIRE (aucune action à défaire)";

	}


	window.parent.$(".undo").on('click', function() {

		if (undo.class != "") {

			window.eraseron = "off";

			$(".tags > div").css('cursor','pointer')
			$(".tags > div").draggable( 'enable' );
			$("#eraser img").removeClass('activated');
			$("#eraseron").removeClass("on");

		}

		var rootdirectory = top.explorer.rootdirectory

		

		switch (undo.class) {

			case "delete archive tag":

				if (undo.deltaggfile.fileid != "") { // si el fichero permanece en la bd

					// console.log("tags originales para el undo: " + undo.deltaggfile.tags)

					var fileupdate = {};

					// localizamos el archivo y actualizamos los datos
					var trans = db.transaction(["files"], "readwrite")
					var objectStore = trans.objectStore("files")
					var req = objectStore.openCursor();

					req.onerror = function(event) {

						console.log("error: " + event);
					};

					req.onsuccess = function(event) {

						var cursor = event.target.result; 
						
						if(cursor){

							if(cursor.value.fileid == undo.deltaggfile.fileid){

								fileupdate.fileid = cursor.value.fileid;
								fileupdate.filefolder = cursor.value.filefolder;
								fileupdate.filename = cursor.value.filename;
								fileupdate.fileext = cursor.value.fileext;
								fileupdate.filetags = undo.deltaggfile.tags;

								var res2 = cursor.update(fileupdate);

								res2.onerror = function(event){
									console.log("error: tag de archivo no restaurada: " + event);									
								}

								res2.onsuccess = function(event){

								}

							}

							cursor.continue();

						}

					}

					trans.oncomplete = function(event) {

						// actualizar visual

						if (($(document).has( "#treeview" ).length == 1 && rootdirectory == undo.deltaggfile.folder) || $(document).has( "#treeview" ).length == 0) { // si el archivo esta visible

							// actualizamos visual

							if ($(document).has( "#treeview" ).length == 1){
								var elementtagsinview = $(".explofile").filter("[value='" + undo.deltaggfile.file + "']").siblings(".tags");

							} 
							else if ($(document).has( "#treeview" ).length == 0){

								var elementtagsinview = $(".placehold2").filter("[value='" + undo.deltaggfile.folder + "']").parent().filter("[value='" + undo.deltaggfile.file + "']").siblings(".tags");
							}

							if (elementtagsinview[0]) {

								elementtagsinview[0].setAttribute("value", undo.deltaggfile.tags);

								// y ahora redibujamos los tags..
								if (typeof undo.deltaggfile.tags == "string") {								
									undo.deltaggfile.tags = undo.deltaggfile.tags.split(','); // volvemos a convertirlo en array
								}
								var tagsdivs = "";
								for(var k = 0; k < undo.deltaggfile.tags.length; k += 1){ // recorremos el array
									tagsdivs += "<div class='tagticket' value='"+ undo.deltaggfile.tags[k] +"'>" + undo.deltaggfile.tags[k] +  "</div>" ;
								};
								
								elementtagsinview[0].innerHTML = tagsdivs;

								//para aplicarles los estilos a los tags hay que recurrir a la bd
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

									$(".undo", window.parent.document).attr("data-tooltip", ph_dato_no);
									undo.class == "";
									elementstagsorder(); // activa posibilidad de cambiar orden en tags
									elemetstagdelete(); // activa posibilidad de borrar tags

								}
								
							} else { // si no hay que actualizar visual

								$(".undo", window.parent.document).attr("data-tooltip", ph_dato_no);
								undo.class == "";

							}

						}

					}

				}

				if (undo.deltaggfile.fileid == "") { // si el fichero no permanece en la bd

					if(undo.deltaggfile.folderid == undefined) { // si la carpeta madre tampoco permanece en la bd

						//hay que volver a meter la carpeta madre en la bd
						var updatefolder = {};
						updatefolder.folder = undo.deltaggfile.folder;
						updatefolder.foldertags = [];

						var trans2 = db.transaction(["folders"], "readwrite")
						var request2 = trans2.objectStore("folders")
							.add(updatefolder); // el id no hace falta pues es autoincremental

						request2.onerror = function(event){

							console.log("error carpeta madre no añadida: " + event);
						
						}

						request2.onsuccess = function(event){

							// console.log("carpeta madre añadida!");

							//capturamos el id de la carpeta recien añadida
							undo.deltaggfile.folderid = event.target.result

						}

						trans2.oncomplete = function(event){

							//añadimos el archivo a la bd
							var updatefile = {};

							var re = /(?:\.([^.]+))?$/; // expresion regular para detectar si un string tiene extension
							var ext = re.exec(undo.deltaggfile.file)[1];
							updatefile.fileext = ext;

							updatefile.filename = undo.deltaggfile.file;
							updatefile.filefolder = undo.deltaggfile.folderid;
							updatefile.filetags = undo.deltaggfile.tags;

							var trans = db.transaction(["files"], "readwrite")
							var request = trans.objectStore("files")
							.put(updatefile)

							request.onerror = function(event){

								console.log("error archivo no añadido a la bd: " + event);
							
							}

							request.onsuccess = function(event){

								// console.log("archivo no añadido a la bd");

								// capturamos el id de la carpeta recien añadida
								undo.deltaggfile.folderid = event.target.result

							}

							trans.oncomplete = function(event) {

								// actualizar visual

								if (($(document).has( "#treeview" ).length == 1 && rootdirectory == undo.deltaggfile.folder) || $(document).has( "#treeview" ).length == 0) { // si el archivo esta visible

									// actualizamos visual

									if ($(document).has( "#treeview" ).length == 1){
										var elementtagsinview = $(".explofile").filter("[value='" + undo.deltaggfile.file + "']").siblings(".tags");

									} 
									else if ($(document).has( "#treeview" ).length == 0){

										var elementtagsinview = $(".placehold2").filter("[value='" + undo.deltaggfile.folder + "']").parent().filter("[value='" + undo.deltaggfile.file + "']").siblings(".tags");
									}

									if (elementtagsinview[0]) {

										elementtagsinview[0].setAttribute("value", undo.deltaggfile.tags);
					
										// y ahora redibujamos los tags..										
										undo.deltaggfile.tags = undo.deltaggfile.tags.split(','); // volvemos a convertirlo en array
										var tagsdivs = "";
										for(var k = 0; k < undo.deltaggfile.tags.length; k += 1){ // recorremos el array
											tagsdivs += "<div class='tagticket' value='"+ undo.deltaggfile.tags[k] +"'>" + undo.deltaggfile.tags[k] +  "</div>" ;
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

											$(".undo", window.parent.document).attr("data-tooltip", ph_dato_no);	
											undo.class == "";
											elementstagsorder(); // activa posibilidad de cambiar orden en tags
											elemetstagdelete(); // activa posibilidad de borrar tags

										}								

									} else { // si no hay que actualizar visual
										$(".undo", window.parent.document).attr("data-tooltip", ph_dato_no);
										undo.class == "";

									}
								}

							}

						}

					}

					if (undo.deltaggfile.folderid != undefined) { // si la carpeta madre sí permanecía en la bd

						// añadimos el archivo a la bd
						var updatefile = {};

						var re = /(?:\.([^.]+))?$/; // expresion regular para detectar si un string tiene extension
						var ext = re.exec(undo.deltaggfile.file)[1];
						updatefile.fileext = ext;

						updatefile.filename = undo.deltaggfile.file;
						updatefile.filefolder = undo.deltaggfile.folderid;
						updatefile.filetags = undo.deltaggfile.tags;

						var trans = db.transaction(["files"], "readwrite")
						var request = trans.objectStore("files")
						.put(updatefile)

						request.onerror = function(event){

							console.log("error archivo no añadido a la bd: " + event);
						
						}

						request.onsuccess = function(event){

							// console.log("archivo añadido a la bd");

							//capturamos el id de la carpeta recien añadida
							undo.deltaggfile.folderid = event.target.result

						}

						trans.oncomplete = function(event) {						

							// actualizar visual

							if (($(document).has( "#treeview" ).length == 1 && rootdirectory == undo.deltaggfile.folder) || $(document).has( "#treeview" ).length == 0) { // si el archivo esta visible

								// actualizamos visual

								if ($(document).has( "#treeview" ).length == 1){
									var elementtagsinview = $(".explofile").filter("[value='" + undo.deltaggfile.file + "']").siblings(".tags");

								} 
								else if ($(document).has( "#treeview" ).length == 0){

									var elementtagsinview = $(".placehold2").filter("[value='" + undo.deltaggfile.folder + "']").parent().filter("[value='" + undo.deltaggfile.file + "']").siblings(".tags");
								}

								if (elementtagsinview[0]) {

									elementtagsinview[0].setAttribute("value", undo.deltaggfile.tags);
				
									// y ahora redibujamos los tags..										
									undo.deltaggfile.tags = undo.deltaggfile.tags.split(','); // volvemos a convertirlo en array
									var tagsdivs = "";
									for(var k = 0; k < undo.deltaggfile.tags.length; k += 1){ // recorremos el array
										tagsdivs += "<div class='tagticket' value='"+ undo.deltaggfile.tags[k] +"'>" + undo.deltaggfile.tags[k] +  "</div>" ;
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

										$(".undo", window.parent.document).attr("data-tooltip", ph_dato_no);
									

										undo.class == "";
										elementstagsorder(); // activa posibilidad de camgiar orden en tags
										elemetstagdelete(); // activa posibilidad de borrar tags

									}

								}

								 else { //si no hay que actualizar visual

									$(".undo", window.parent.document).attr("data-tooltip", ph_dato_no);
									

									undo.class == "";

								}

							}

						}

					}

				}

				break;


			case "delete folder tag":

				if (undo.deltaggfold.foldid == "") { // si la carpeta no se ha mantenido en la bd

					var folderupdate = {};
					folderupdate.folder = undo.deltaggfold.folder;
					folderupdate.foldertags = undo.deltaggfold.tags;

					var trans = db.transaction(["folders"], "readwrite")
					var request = trans.objectStore("folders")
					.put(folderupdate)

					request.onerror = function(event){

						console.log("error carpeta no añadida a la bd: " + event);
					
					}

					request.onsuccess = function(event){

						// console.log("carpeta añadida a la bd");

					}

					trans.oncomplete = function(event) {

						// actualizar visual

						// quitamos el parentfolder de la dirección de la carpeta para buscarla en el directorio
						var carpeta = undo.deltaggfold.folder.replace(undo.deltaggfold.parentfolder, "");

						console.log(carpeta)

						var elementtagsinview = $(".explofolder").filter("[value='" + carpeta+ "']").siblings(".tags");

						if (elementtagsinview) {

							console.log("aa")

							elementtagsinview[0].setAttribute("value", undo.deltaggfold.tags);

							// y ahora redibujamos los tags..										
							undo.deltaggfold.tags = undo.deltaggfold.tags.split(','); // volvemos a convertirlo en array
							var tagsdivs = "";
							for(var k = 0; k < undo.deltaggfold.tags.length; k += 1){ // recorremos el array
								tagsdivs += "<div class='tagticket' value='"+ undo.deltaggfold.tags[k] +"'>" + undo.deltaggfold.tags[k] +  "</div>" ;
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

								elementstagsorder(); // activa posibilidad de cambiar orden en tags
								elemetstagdelete(); // activa posibilidad de borrar tags

							}

						}

						$.each ($("#filetree span"), function(t) {

							if($("#filetree span:eq("+t+")").attr("rel2") == undo.deltaggfold.folder) {				

								$("#filetree span:eq("+t+")").attr("value", undo.deltaggfold.tags);
					
								// y ahora redibujamos los tags..
								if (typeof undo.deltaggfold.tags == "string") {										
									undo.deltaggfold.tags = undo.deltaggfold.tags.split(','); // volvemos a convertirlo en array
								}
								var fttagsdivs = "";
								for(var k = 0; k < undo.deltaggfold.tags.length; k += 1){ //recorremos el array
									fttagsdivs += "<div class='tagticket' value='"+ undo.deltaggfold.tags[k] +"'>" + undo.deltaggfold.tags[k] +  "</div>" ;
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

						});

						$(".undo", window.parent.document).attr("data-tooltip", ph_dato_no);
						undo.class == "";

					}

				}

				if (undo.deltaggfold.foldid != "") { // si la carpeta se ha mantenido en la bd

					var folderupdate = {};
					folderupdate.folderid = undo.deltaggfold.foldid;
					folderupdate.folder = undo.deltaggfold.folder;
					folderupdate.foldertags = undo.deltaggfold.tags;

					var trans = db.transaction(["folders"], "readwrite")
					var request = trans.objectStore("folders")
					.put(folderupdate)

					request.onerror = function(event){

						console.log("error carpeta no actualizada en la bd: " + event);
					
					}

					request.onsuccess = function(event){

						// console.log("carpeta actualizada en la bd");

					}

					trans.oncomplete = function(event) {	

						// actualizar visual
						if (rootdirectory == undo.deltaggfold.parentfolder) { // si la carpeta esta visible en el directorio

							// quitamos el parentfolder de la dirección de la carpeta para buscarla en el directorio
							var carpeta = undo.deltaggfold.folder.replace(undo.deltaggfold.parentfolder, "");

							var elementtagsinview = $(".explofolder").filter("[value='" + carpeta+ "']").siblings(".tags");

							if (elementtagsinview) {

								elementtagsinview[0].setAttribute("value", undo.deltaggfold.tags);

								// y ahora redibujamos los tags..
								
								undo.deltaggfold.tags = undo.deltaggfold.tags.split(','); // volvemos a convertirlo en array
								var tagsdivs = "";
								for(var k = 0; k < undo.deltaggfold.tags.length; k += 1){ // recorremos el array
									tagsdivs += "<div class='tagticket' value='"+ undo.deltaggfold.tags[k] +"'>" + undo.deltaggfold.tags[k] +  "</div>" ;
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

									elementstagsorder(); // activa posibilidad de cambiar orden en tags
									elemetstagdelete(); // activa posibilidad de borrar tags

								}

							}

						}

						$.each ($("#filetree span"), function(t) {

							if($("#filetree span:eq("+t+")").attr("rel2") == undo.deltaggfold.folder) {				

								$("#filetree span:eq("+t+")").attr("value", undo.deltaggfold.tags);
					
								// y ahora redibujamos los tags..										
								if (typeof undo.deltaggfold.tags == "string") {										
									undo.deltaggfold.tags = undo.deltaggfold.tags.split(','); // volvemos a convertirlo en array
								}
								var fttagsdivs = "";
								for(var k = 0; k < undo.deltaggfold.tags.length; k += 1){ // recorremos el array
									fttagsdivs += "<div class='tagticket' value='"+ undo.deltaggfold.tags[k] +"'>" + undo.deltaggfold.tags[k] +  "</div>" ;
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

						});

						$(".undo", window.parent.document).attr("data-tooltip", ph_dato_no);
						undo.class = "";

					}

				}

				break; // --fin undo class "delete folder tag"


			case "rename archive":

				fs.rename(undo.rename.folder + '\/' + undo.rename.nuevo, undo.rename.folder + '\/' + undo.rename.original, function(err) {
					if ( err ) console.log('ERROR: ' + err);
				});		

				if (undo.rename.indb == "no") {

					if (dirtoexec == undo.rename.folder) { // si estámos dentro de la carpeta en la vista de directorio

						// se actualiza el elemento del array de elementos (para no tener que recargar la carpeta si se cambia viewmode o order)
						/*$.each (directoryarchives, function(dra){
							if (directoryarchives[dra].name == "\/" + undo.rename.nuevo){
								directoryarchives[dra].name = "\/" + undo.rename.original;							
							}
						});*/

						var explofiles = $(".explofile")
						$.each($(".explofile"), function(i) {

							if ( $(".explofile")[i].getAttribute("value") == '\/' + undo.rename.nuevo) {

								$(".explofile")[i].setAttribute("value", '\/' + undo.rename.original);							
								$(".explofile")[i].innerHTML = '<div class="holdButtonProgress" style="height: 8px; position: fixed; top: 60px; z-index: 100; left: -100%;"></div><span class="exploname">' + undo.rename.original + '</span>';

								var re = /(?:\.([^.]+))?$/; // expresión regular para detectar si un string tiene extensión
								var ext = re.exec(undo.rename.original)[1];
								// cambiamos el texto del div ext con el contenido de la variable ext
								var divconext = $(".explofile:eq("+i+")").next(".exploext");
								divconext[0].innerHTML = ext;

								// reactivar interacciones pressandhod y editname en el item del undo
								$(".explofile:eq("+i+")").pressAndHold({

									holdTime: 200,
									progressIndicatorRemoveDelay: 0,
									progressIndicatorColor: "blue",
									progressIndicatorOpacity: 0.3

								});

								activateeditname($(".explofile:eq("+i+") span"));

								$(".undo", window.parent.document).attr("data-tooltip", ph_dato_no);							
								undo.class = "";

							}

						})

					}

					undo.class = "";
				}

				if (undo.rename.indb == "yes") {

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

							if (cursor.value.fileid == undo.rename.id) {

								fileupdate.fileid = cursor.value.fileid;
								fileupdate.filefolder = cursor.value.filefolder;
								fileupdate.filetags = cursor.value.filetags;

								fileupdate.filename = "\/" + undo.rename.original;

								var re = /(?:\.([^.]+))?$/; // expresión regular para detectar si un string tiene extensión
								var ext = re.exec(undo.rename.original)[1];
								fileupdate.fileext = ext;

							}

							cursor.continue();
						}

					} 

					trans.oncomplete = function(e) {

						// cambiamos nombre en db
						var trans = db.transaction(["files"], "readwrite")
						var request = trans.objectStore("files")
							.put(fileupdate);
								 
						request.onerror = function(event) { 

							console.log("error: nombre archivo sin cambiar en db");

						};
						request.onsuccess = function(event) {

							// console.log("nombre archivo cambiado en db");

							if (dirtoexec == undo.rename.folder) { // si estámos dentro de la carpeta en la vista de directorio

								var explofiles = $(".explofile")
								$.each($(".explofile"), function(i) {

									if ( $(".explofile")[i].getAttribute("value") == '\/' + undo.rename.nuevo) {

										$(".explofile")[i].setAttribute("value", '\/' + undo.rename.original);							
										$(".explofile")[i].innerHTML = '<div class="holdButtonProgress" style="height: 8px; position: fixed; top: 60px; z-index: 100; left: -100%;"></div><span class="exploname">' + undo.rename.original + '</span>';

										var re = /(?:\.([^.]+))?$/; // expresión regular para detectar si un string tiene extensión
										var ext = re.exec(undo.rename.original)[1];
										// cambiamos el texto del div ext con el contenido de la variable ext
										var divconext = $(".explofile:eq("+i+")").next(".exploext");
										divconext[0].innerHTML = ext;

										// reactivar interacciones pressandhod y editname en el item del undo
										$(".explofile:eq("+i+")").pressAndHold({

											holdTime: 200,
											progressIndicatorRemoveDelay: 0,
											progressIndicatorColor: "blue",
											progressIndicatorOpacity: 0.3

										});

										activateeditname($(".explofile:eq("+i+") span"));

										$(".undo", window.parent.document).attr("data-tooltip", ph_dato_no);						
										undo.class = "";

									}

								});

							}

						}

					}

				}

				break; // --fin if class "rename archive"

			case "rename folder":

				var folderupdate=[];

				fs.rename(undo.rename.folder + '\/' + undo.rename.nuevo, undo.rename.folder + '\/' + undo.rename.original, function(err) {
					if ( err ) console.log('ERROR: ' + err);
				});
			
				if (undo.rename.indb == "no") {
					
					// actualizar visual
					if (dirtoexec == undo.rename.folder) {
						setTimeout(function() {readDirectory(undo.rename.folder)}, 500);
					}

					$(".explofile:eq("+i+")").pressAndHold({

						holdTime: 200,
						progressIndicatorRemoveDelay: 0,
						progressIndicatorColor: "blue",
						progressIndicatorOpacity: 0.3

					});

					activateeditname($(".explofile:eq("+i+") span"));

					// hay que mirar si hay subcarpetas cuyo path inicie con el path de la carpeta madre a la que se le ha hecho el cambio de nombre
					var folderupdate=[];

					if (undo.rename.folder==driveunit+'\/') {
						undo.rename.folder=driveunit
					}
					var pathachequearcondriveunit = undo.rename.folder + '\/' + undo.rename.nuevo;
					var pathaponercondriveunit = undo.rename.folder + '\/' + undo.rename.original;
					var pathachequear = pathachequearcondriveunit.replace(driveunit, "");
					var pathaponer = pathaponercondriveunit.replace(driveunit, "");

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

					// tras haber hecho los cambios en el directoryview vamos a comprobar si el folder esta desplegado en el treeview y en tal caso le hacemos el cambio
					var carpetastree = $("#filetree span");
			
					$.each(carpetastree, function(i) {


						if (carpetastree[i].getAttribute("rel2") == pathachequear) {

							var rootaponer = undo.rename.folder.replace(driveunit,"");

							carpetastree[i].setAttribute("rel", '\/' + undo.rename.original);
							carpetastree[i].setAttribute("rel2", pathaponer);

							var tagsquetiene="";
							
							carpetastree[i].innerHTML = '<div class="holdButtonProgress"></div>'+undo.rename.original+'<div class="id"></div>'+tagsquetiene+''

						}

					});

					$(".undo", window.parent.document).attr("data-tooltip", ph_dato_no);
					undo.class = "";

					// Ahora se mira si el directoryview que esta en la vista es el del directorio cambiado y si es así se refresca con el del nombre cambiado

					if (undo.rename.folder==driveunit) {
						undo.rename.folder=driveunit+'\/';
					}
					if (dirtoexec == undo.rename.folder + "\/" + undo.rename.nuevo) {

						previousornext = "refreshundo";
						readDirectory(undo.rename.folder + "\/" + undo.rename.original)

					}

				}

				if (undo.rename.indb == "yes") {

					if (undo.rename.folder==driveunit+'\/') {
						undo.rename.folder=driveunit
					}

					var pathachequearcondriveunit = undo.rename.folder + '\/' + undo.rename.nuevo;
					var pathaponercondriveunit = undo.rename.folder + '\/' + undo.rename.original;
					var pathachequear = pathachequearcondriveunit.replace(driveunit, "");
					var pathaponer = pathaponercondriveunit.replace(driveunit, "");

					var trans = db.transaction(["folders"], "readonly")
					var objectStore = trans.objectStore("folders")
					var req = objectStore.openCursor();

					req.onerror = function(event) {
						console.log("error: " + event);
					};
					req.onsuccess = function(event) {

						var cursor = event.target.result;
						
						if(cursor){

							if (cursor.value.folderid == undo.rename.id) {

								folderupdate.folderid = cursor.value.folderid;
								folderupdate.foldertags = cursor.value.foldertags;
								folderupdate.folder = pathaponer;

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

							console.log("error: nombre carpeta sin cambiar en db"); console.log(error);						

						};
						request.onsuccess = function(event) {

							// console.log("nombre carpeta cambiado en db");

							// actualizar visual
							if (dirtoexec == undo.rename.folder) { // solo redibuja si estámos en la carpeta donde se situá el elemento cambiado		

								setTimeout(function() {readDirectory(undo.rename.folder)}, 500);						

							}

							// reactivar interacciones pressandhod y editname en el item del undo
							$(".explofile:eq("+i+")").pressAndHold({

								holdTime: 200,
								progressIndicatorRemoveDelay: 0,
								progressIndicatorColor: "blue",
								progressIndicatorOpacity: 0.3

							});

							activateeditname($(".explofile:eq("+i+") span"));

							$(".undo", window.parent.document).attr("data-tooltip", ph_dato_no);
							undo.class = "";

						}

						trans.oncomplete = function(event) {

							// hay que mirar si hay subcarpetas cuyo path inicie con el path de la carpeta madre a la que se le ha hecho el cambio de nombre

							var folderupdate=[];						

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
											console.log("error ruta subcarpeta no cambiada"); console.log(event);									
										}

										res20.onsuccess = function(event){

											// console.log("ruta subcarpeta cambiada");

										}

									}

									cursor.continue();

								}

							}

						}

					}

				}
					
				// tras haber hecho los cambios en el directoryview vamos a comprobar si el folder esta desplegado en el treeview y en tal caso le hacemos el cambio
				carpetastree = $("#filetree span");
		
				$.each(carpetastree, function(i) {

					if (driveunit + carpetastree[i].getAttribute("rel2") == undo.rename.folder + "\/" + undo.rename.nuevo) {

						var rootaponer = undo.rename.folder.replace(driveunit,"");

						carpetastree[i].setAttribute("rel", '\/' + undo.rename.original);
						carpetastree[i].setAttribute("rel2", rootaponer + '\/' + undo.rename.original);

						var tagsquetiene = carpetastree[i].getElementsByClassName("fttags")[0].innerHTML;
						
						carpetastree[i].innerHTML = '<div class="holdButtonProgress"></div>'+undo.rename.original+'<div class="id"></div>'+tagsquetiene+''

					}

				});

				// ahora se mira si el directoryview que esta en la vista es el del directorio cambiado y si es así se refresca con el del nombre cambiado
				if (dirtoexec == undo.rename.folder + "\/" + undo.rename.nuevo) {

					previousornext = "refreshundo";
					setTimeout(function() {readDirectory(undo.rename.folder + "\/" + undo.rename.original)}, 500);
					
				}

				break; // --fin if class "rename folder"


			case "tag archive":

				// console.log("archivo a modificar: " + undo.taggaarch.archive);
				// console.log("que tiene el id: " + undo.taggaarch.archid)
				// console.log("dentro de la carpeta con id: " + undo.taggaarch.folderid);
				// console.log("id del tag: " + undo.taggaarch.tagid);			

				var folderofarchive = "";

				// Visual

				// antes de nada comprobamos si el archivo esta visible ahora mismo tomamos la ruta del id de la carpeta y la comparamos con la ruta de la vista
				var trans = db.transaction(["folders"], "readonly")
				var objectStore = trans.objectStore("folders")
				var req = objectStore.openCursor();

				req.onerror = function(event) {

					console.log("error: " + event);
				};

				req.onsuccess = function(event) {
					
					var cursor = event.target.result;
					
					if(cursor){

						if (cursor.value.folderid == undo.taggaarch.folderid) {

							folderofarchive = cursor.value.folder;
					
						}

						cursor.continue();
					}
				}

				trans.oncomplete = function() {

					if (($(document).has( "#treeview" ).length == 1 && rootdirectory == folderofarchive) || $(document).has( "#treeview" ).length == 0) { // si el archivo esta visible

						// actualizamos visual

						if ($(document).has( "#treeview" ).length == 1){
							var elementtagsinview = $(".explofile").filter("[value='" + undo.taggaarch.archive + "']").siblings(".tags");

						} 
						else if ($(document).has( "#treeview" ).length == 0){

							var elementtagsinview = $(".explofile").filter("[filepath='" + folderofarchive + "']").filter("[value='" + undo.taggaarch.archive + "']").siblings(".tags");

							

						}

						$('p:contains("Please reply above this line")');

						var carraydetagsorig = elementtagsinview["0"].attributes[1].value; // se coge el value de los tags
						if (typeof carraydetagsorig == "string"){
							carraydetagsorig = carraydetagsorig.split(",");
						}
						var index = carraydetagsorig.indexOf(undo.taggaarch.tagid); // localizamos el id del tag a borrar
						carraydetagsorig.splice(index, 1); // lo quitamos del array
						var carraydetags = carraydetagsorig.toString() // de array a string

						elementtagsinview[0].setAttribute("value", carraydetags);

						// se cambian los tags del elemento del array de elementos (para no tener que recargar la carpeta si se cambia viewmode o order)
						/*$.each (directoryarchives, function(dra){										
							if (directoryarchives[dra].name  == undo.taggaarch.archive){
								directoryarchives[dra].tagsid = carraydetags;						
							}
						});*/
			
						// y ahora redibujamos los tags..										
						carraydetags = carraydetags.split(','); // volvemos a convertirlo en array
						var tagsdivs = "";
						for(var k = 0; k < carraydetags.length; k += 1){ // recorremos el array
							tagsdivs += "<div class='tagticket' value='"+ carraydetags[k] +"'>" + carraydetags[k] +  "</div>" ;
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

						trans2.oncomplete = function (event) {

							elementstagsorder();
							elemetstagdelete()

						}

					}

				}

				// ahora se trabaja con la base de datos propiamente
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

						if (cursor.value.fileid == undo.taggaarch.archid) {

							fileupdate.fileid = cursor.value.fileid;
							fileupdate.filename = cursor.value.filename;
							fileupdate.filefolder = cursor.value.filefolder;
							fileupdate.fileext = cursor.value.fileext;

							arraydetags = cursor.value.filetags;
							if (typeof arraydetags=="string") {
								arraydetags = arraydetags.split(','); // convertimos el string en array
							}

						}

						cursor.continue();
					} 

				} 

				trans.oncomplete = function(e) { 

					for (i in arraydetags) {

						if (arraydetags[i] == taganadir) { // cuando coincide el tag

							var index = arraydetags.indexOf(arraydetags[i]); // encontramos la posición index del tag dentro del array
							arraydetags.splice(index, 1); // eliminamos el item del array

							fileupdate.filetags = arraydetags;
							fileupdate.filetags = fileupdate.filetags.toString(); // devolvemos la variable a string antes estaba en formato array tras haber hecho .split(',')
							// console.log ("quedaria solo: " + arraydetags);

							if (arraydetags.length > 0) { // se conservará el archivo en la bd

								var trans = db.transaction(["files"], "readwrite")
								var request = trans.objectStore("files")
									.put(fileupdate);
								 
								request.onerror = function(event) { 

									console.log("error undo - no se ha eliminado el tag:" + event);

								};
								request.onsuccess = function(event) {

									// console.log("undo - se ha eliminado el tag");

								}

							}

							else { // el array de tags queda a 0, se borra el archivo de la bd

								var trans = db.transaction(["files"], "readwrite")
								var request = trans.objectStore("files").delete(undo.taggaarch.archid);

								request.onerror = function(event) { 

									console.log("error undo - no se ha eliminado el tag y el archivo de la bd:" + event);

								};
								request.onsuccess = function(event) {

									// console.log("undo - se ha eliminado el tag y el archivo de la bd");

								}

							}

						}

					}

				}

				$(".undo", window.parent.document).attr("data-tooltip", ph_dato_no);
				undo.class="";

				break; //--fin if class "tag archive"


			case "tag folder":

				// console.log(undo.class);
				// console.log("id del folder: " + undo.taggfold.foldid)
				// console.log("que es la carpeta: " + undo.taggfold.folder)
				// console.log("tag a eliminiar: " + undo.taggfold.tagid)

				var ffolderupdate = {};
				var carraydetags = [];
				var carraydetagsorig = [];
				var masdeuntag = "false"

				var trans3 = db.transaction(["folders"], "readonly")
				var objectStore3 = trans3.objectStore("folders")	
				var req3 = objectStore3.openCursor(); 

				req3.onerror = function(event) {

					console.log("error: " + event);

				};

				req3.onsuccess = function(event) { 			

					var cursor3 = event.target.result; 
					if(cursor3){

						if (cursor3.value.folderid == undo.taggfold.foldid) {

							ffolderupdate.folderid = cursor3.value.folderid;
							ffolderupdate.folder = cursor3.value.folder;
							carraydetagsorig = carraydetags = cursor3.value.foldertags;

							// Visual

							var estabavisible = "no"; // variable auxiliar necesaria para que no haga un splice del arraydetagsoriginal dos veces (una para el directoryview y otra para el treeview)
							$.each($(".explofolder"), function(i) {	

								var carpeta = $(".explofolder:eq("+i+")").attr("value");
								var elementtagsinview = "";


								if (($(document).has( "#treeview" ).length == 1 && rootdirectory + carpeta == undo.taggfold.folder) || $(document).has( "#treeview" ).length == 0) { // si el archivo esta visible

									// actualizamos visual

									if ($(document).has( "#treeview" ).length == 1){
										var elementtagsinviewtemp = $(".explofolder:eq("+i+")").filter("[value='" + carpeta + "']").siblings(".tags");

									} 
									else if ($(document).has( "#treeview" ).length == 0){

										var elementtagsinviewtemp = $(".explofolder:eq("+i+")").filter("[value='" + undo.taggfold.folder + "']").siblings(".tags");

									}

									if (elementtagsinviewtemp[0]) {
										elementtagsinview = elementtagsinviewtemp
									}								

									if (elementtagsinview){

										estabavisible = "si";
										// Actualizar visual
										// var elementtagsinview = $('.explofolder').filter('[value="' + carpeta + '"]').siblings('.tags');
										if (typeof carraydetagsorig == "string"){
											carraydetagsorig = carraydetagsorig.split(","); // a array
										}

										var index = carraydetagsorig.indexOf(undo.taggfold.tagid); //localizamos el id del tag a borrar
										carraydetagsorig.splice(index, 1); // lo quitamos del array
										carraydetags = carraydetagsorig.toString() // de array a string

										// se cambian los tags del elemento del array de elementos (para no tener que recargar la carpeta si se cambia viewmode o order)
										// $.each (directoryfolders, function(drf){										
											if (directoryfolders[i].name  == carpeta){
												directoryfolders[i].tagsid = carraydetags;						
											}
										//});

										elementtagsinview[0].setAttribute("value", carraydetags);

										// se cambian los tags del elemento del array de elementos (para no tener que recargar la carpeta si se cambia viewmode o order)
										$.each (directoryfolders, function(drf){										
											if (directoryfolders[drf].name  == undo.taggfold.folder){
												directoryfolders[drf].tagsid = carraydetags;						
											}
										});
							
										// y ahora redibujamos los tags..										
										carraydetags = carraydetags.split(','); //volvemos a convertirlo en array
										var tagsdivs = "";
										for(var k = 0; k < carraydetags.length; k += 1){ //recorremos el array
											tagsdivs += "<div class='tagticket' value='"+ carraydetags[k] +"'>" + carraydetags[k] +  "</div>" ;
										};
										
										elementtagsinview[0].innerHTML = tagsdivs;

										//para aplicarles los estilos a los tags hay que recurrir a la bd
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

										trans2.oncomplete = function (event) {

											elementstagsorder();
											elemetstagdelete()

										}

									}

								}							

							});

							$.each ($("#filetree span"), function(t) {

								if($("#filetree span:eq("+t+")").attr("rel2") == undo.taggfold.folder) {

									if (estabavisible == "no") {
										index = carraydetagsorig.indexOf(undo.taggfold.tagid); // localizamos el id del tag a borrar
										carraydetagsorig.splice(index, 1); // lo quitamos del array
										carraydetags = carraydetagsorig.toString() // de array a string
									}
									if (estabavisible == "si") {

										carraydetags = carraydetags.toString() // de array a string

									}

									$("#filetree span:eq("+t+")").attr("value", carraydetags);
						
									// y ahora redibujamos los tags..										
									carraydetags = carraydetags.split(','); // volvemos a convertirlo en array
									var fttagsdivs = "";
									for(var k = 0; k < carraydetags.length; k += 1){ // recorremos el array
										fttagsdivs += "<div class='tagticket' value='"+ carraydetags[k] +"'>" + carraydetags[k] +  "</div>" ;
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

							});

							// trabajando con la bd

							// antes de decidir que hacer con la carpeta vamos a ver si tiene más de un tag o no
							// si tiene más de un tag solo quitamos el tag que queríamos y ya esta

							var size = 0;
							for (key in carraydetags) {
	        					if (carraydetags.hasOwnProperty(key)) size++;
	    					}

							if (size > 0) { // si el array de tags de la carpeta madre tiene más de un elemento

								masdeuntag = "true";

								for (n in carraydetags) {

									if (carraydetags[n] == undo.taggfold.tagid) { // cuando coincide el tag

										var index = carraydetags.indexOf(carraydetags[n]); // encontramos la posición index del tag dentro del array
										carraydetags.splice(index, 1); // eliminamos el item del array

										carraydetags = carraydetags.toString()

									}

								}

								ffolderupdate.foldertags = carraydetags;

							} 
							
						}

						cursor3.continue();

					}

				}

				trans3.oncomplete = function() { // trabajando con la bd

					if (masdeuntag == "true") { // si tiene más de un tag solo actualizamos los tags quitandole el que queriamos

						var trans4 = db.transaction(["folders"], "readwrite")
						var request4 = trans4.objectStore("folders")
							.put(ffolderupdate);

						request4.onerror = function(event) { 

							console.log("error undo - no se ha quitado el tag de la carpeta: " + event);

						};
						request4.onsuccess = function(event) {

							// console.log("undo - se ha quitado el tag de la carpeta");

						}

					}

					if (masdeuntag == "false") { // vamos a comprobar si hay archivos dependientes de la carpeta y si no es así la eliminaremos de la bs

						var conservarcarpeta = "false";

						// utilizamos el id de la carpeta para comprobar los subarchivos que la están usando y sus tags
						var trans2 = db.transaction(["files"], "readonly")
						var objectStore2 = trans2.objectStore("files")	
						var req2 = objectStore2.openCursor(); 
						
						req2.onerror = function(event) {

							console.log("error: " + event);

						};

						req2.onsuccess = function(event) { 

							var barraydetags = [];

							var cursor2 = event.target.result; 
							if(cursor2){

								if (cursor2.value.filefolder == undo.taggfold.foldid) {

									barraydetags = cursor2.value.filetags

									if (barraydetags.indexOf(',') > -1) { // si el array contiene una coma por lo que hay más de un tag

										barraydetags = barraydetags.split(",");

										for (n in barraydetags) { 

											if (barraydetags[n] != undo.taggfold.tagid) { // si tiene un tag distinto del que se va a borrar

												conservarcarpeta = "true";

											}

										}								
										
									}
																
									else { 

										if (cursor2.value.filetags != undo.taggfold.tagid) { // si el único tag que tiene es distinto

											conservarcarpeta = "true";

										}

									}

								}

								cursor2.continue();

							}

						}

						trans2.oncomplete = function(e) {

							if (conservarcarpeta == "true") {

								// vamos a eliminar solo el tag de la carpeta
								ffolderupdate.foldertags = [];

								var trans4 = db.transaction(["folders"], "readwrite")
								var request4 = trans4.objectStore("folders")
									.put(ffolderupdate);

								request4.onerror = function(event) { 

									console.log("error undo - no se ha metido nada como tag de la carpeta: " + event);

								};
								request4.onsuccess = function(event) {

									// console.log("undo - se ha metido como tag de la carpeta");

								}

							}

							else { // si conservarcarpeta es false

								// eliminamos la carpeta de la bd
								var trans5 = db.transaction(["folders"], "readwrite")
								var request5 = trans5.objectStore("folders").delete(undo.taggfold.foldid);

								request5.onerror = function(event) { 

									console.log("error undo - no se ha eliminado carpeta de bd:" + event);

								};
								request5.onsuccess = function(event) {

									// console.log("undo - eliminada carpeta de la bd");

								}
							
							}

						}

					}

				}

				$(".undo", window.parent.document).attr("data-tooltip", ph_dato_no);
				undo.class="";


			break; //--fin if class "tag folder"


			case "tag folder and subelements":

				// console.log(undo.class);
				// console.log("id del folder: " + undo.taggfold.foldid)
				// console.log("que es la carpeta: " + undo.taggfold.folder)
				// console.log("tag a eliminiar: " + undo.taggfold.tagid)

				// hay que sacar los archivos y carpetas desde el filesystem porque el id de la carpeta solo sirve para reconocer los subarchivos no las subcarpetas

				var dirtoreadcheck = "";
				var folderidtosearch = "";
				var directoryelement = [];
				// variables globales
				directorycontent = []; // en esta variable se meten archivos y directorios
				udirectoryarchives = []; // en esta variable se meten los archivos
				udirectoryfolders = []; // en esta variable se meten los directorios

				var readedElements = fs.readdirSync(driveunit + undo.taggfold.folder);

				var re = /(?:\.([^.]+))?$/; // expresion regular para detectar si un string tiene extension
				for (i = 0; i < readedElements.length; i++) {
					
					var ext = re.exec(readedElements[i])[1];

					// comprobar si es subcarpeta o subarchivo
					var dirtoreadcheck = driveunit + undo.taggfold.folder + "\/" + readedElements[i];

					try {
						var arorfo = "i_am_an_archive";
						var arorfo = fs.readdirSync(dirtoreadcheck);
					}
					catch(exception) {};

					directoryelement.name = "\/" + readedElements[i]
					directoryelement.ext = ext;
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
						udirectoryfolders[ii] = directorycontent[i];               

						ii++;
					} else {
						udirectoryarchives[iii] = directorycontent[i];
						iii++;
					};
				});

				// leemos datos subcarpetas
				if (udirectoryfolders.length >= 1) {

					var trans = db.transaction(["folders"], "readonly")
					var objectStore = trans.objectStore("folders")

					var elementtagsinview=[];
					var valueoriginal=[];
					var valueaponer=[];
					var tagsdivs=[];

					$.each(udirectoryfolders, function(i) {

						var folderupdate = {};			
						
						var req = objectStore.openCursor(); 
						
						req.onerror = function(event) { 

							console.log("error: " + event);

						};

						req.onsuccess = function(event) { 

							var cursor = event.target.result; 
							if(cursor){

								if(cursor.value.folder == undo.taggfold.folder + udirectoryfolders[i].name){ // si la subcarpera ya esta en la bd

									udirectoryfolders[i].tagsid = cursor.value.foldertags; 
									udirectoryfolders[i].id = cursor.value.folderid;

								}
								cursor.continue();
							};

						}

						trans.oncomplete = function() {

							elementtagsinview = []
							treeelementtagsinview = []
							treeelementosdirectoriotags = []

							$.each(udirectoryfolders, function(i) {

								// se redibujarán los tags del treeview si están desplegadas las subcarpetas

								$.each ($("#filetree span"), function(t) {

									if($("#filetree span:eq("+t+")").attr("rel2") == undo.taggfold.folder + udirectoryfolders[i].name) {

										treeelementtagsinview[i] = $("#filetree span:eq("+t+")")[0].children[2] // el div tags del treeview
									}

								});

								// aquí procesamos los valores que luego se pondrán en los tags del treeview y del directorio
								valueoriginal[i] = udirectoryfolders[i].tagsid;

								if (typeof valueoriginal[i] == "string") {
									valueoriginal[i] = valueoriginal[i].split(",");
								}

								var index = valueoriginal[i].indexOf(undo.taggfold.tagid); // localizamos el id del tag a borrar
								valueoriginal[i].splice(index, 1); // lo quitamos del array
								valueaponer[i] = valueoriginal[i].toString() // de objeto a string
								// se cambian los tags del elemento del array de elementos (para no tener que recargar la carpeta si se cambia viewmode o order)
								udirectoryfolders[i].tagsid = valueaponer[i];

								valueaponer[i] = valueaponer[i].split(','); // de string a array
								var tagsdivs = "";
								for(var k = 0; k < valueaponer[i].length; k += 1){ //recorremos el array
									tagsdivs += "<div class='tagticket' value='"+ valueaponer[i][k] +"'>" + valueaponer[i][k] +  "</div>" ;
								};

								if (treeelementtagsinview[i]) { //si hay elementos en el tree (esta la subcarpeta desplegada en el treeview)

									treeelementtagsinview[i].innerHTML = tagsdivs;

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
											$.each (treeelementosdirectoriotags[i], function(u) {
												if(treeelementosdirectoriotags[i][u]){										
													if (cursor2.value.tagid == treeelementosdirectoriotags[i][u].getAttribute("value")) {

														var color = "#" + cursor2.value.tagcolor;
														var complecolor = hexToComplimentary(color);

														treeelementosdirectoriotags[i][u].className += " verysmall " + cursor2.value.tagform;
														treeelementosdirectoriotags[i][u].setAttribute("value", cursor2.value.tagid);
														treeelementosdirectoriotags[i][u].setAttribute("style", "background-color: #" + cursor2.value.tagcolor + ";" + "color: " + complecolor + ";")
														treeelementosdirectoriotags[i][u].innerHTML = cursor2.value.tagtext;

													}
												}
											});

											cursor2.continue();

										}

									};

								} // --fin si están las subcarpetas desplegadas en el treeview

								
								/*if (dirtoexec == driveunit + undo.taggfold.folder) { // se redibujan los tags de las subarpetas si estámos dentro de la carpeta. ----- Al final se hace refresco pues me daba problemas -----

									// primero cambiamos el value de la etiqueta tags..								 
									$.each ($(".explofolder"), function(n) {
										if ($(".explofolder:eq("+n+")").attr("value") == udirectoryfolders[i].name) {
											elementtagsinview[i] = $(".explofolder:eq("+n+")").siblings(".tags")
										}
									});
									
									elementtagsinview[i][0].setAttribute("value", valueaponer[i]);
									elementtagsinview[i][0].innerHTML = tagsdivs;


									// para aplicarles los estilos a los tags hay que recurrir a la bd
									var trans2 = db.transaction(["tags"], "readonly")
									var objectStore2 = trans2.objectStore("tags")

									elementosdirectoriotags[i] = elementtagsinview[i].children(".tagticket");
									console.log(elementosdirectoriotags[i])

									var req2 = objectStore2.openCursor();

									req2.onerror = function(event) {
										console.log("error: " + event);
									};
									req2.onsuccess = function(event) { 
										var cursor2 = event.target.result;
										if (cursor2) {
											$.each(elementosdirectoriotags[i], function(n) {
												if (elementosdirectoriotags[i][n]){											
												console.log(elementosdirectoriotags[i][n])
													if (cursor2.value.tagid == elementosdirectoriotags[i][n].getAttribute("value")) {

														var color = "#" + cursor2.value.tagcolor;
														var complecolor = hexToComplimentary(color);

														elementosdirectoriotags[i][n].className += " small " + cursor2.value.tagform;
														elementosdirectoriotags[i][n].setAttribute("value", cursor2.value.tagid);
														elementosdirectoriotags[i][n].setAttribute("style", "background-color: #" + cursor2.value.tagcolor + ";" + "color: " + complecolor + ";")
														elementosdirectoriotags[i][n].innerHTML = cursor2.value.tagtext;

													}
												}
											});

											cursor2.continue();

										}

									};

									trans2.oncomplete = function (event) {

										elementstagsorder();
										elemetstagdelete();

									}							

								}*/

								// ahora se van a cambiar los datos en la bd

								var aborrar= [];

								var arraydetags = udirectoryfolders[i].tagsid;
								// arraydetags = Object.values(arraydetags); // CONVERTIMOS EL OBJETO EN ARRAY (ecmascript 7)

								if (typeof arraydetags == "string") {
									arraydetags = arraydetags.split(",")
								}
		
								for (n in arraydetags) {

									if (arraydetags[n] == undo.taggfold.tagid) { // cuando coincide el tag

									var index = arraydetags.indexOf(arraydetags[n]); // encontramos la posición index del tag dentro del array

									arraydetags.splice(index, 1); // eliminamos el item del array

									}

								}

								folderupdate.foldertags = arraydetags;
								folderupdate.folder = undo.taggfold.folder + udirectoryfolders[i].name;
								folderupdate.folderid = udirectoryfolders[i].id;

								if (arraydetags.length > 0) { // se conservará la subcarpeta en la bd
						
									var trans = db.transaction(["folders"], "readwrite")
									var request = trans.objectStore("folders")
										.put(folderupdate);
							 
									request.onerror = function(event) { 

										console.log("error undo - no se ha eliminado el tag de la subcarpeta:" + event);

									};

									request.onsuccess = function(event) {

										// console.log("undo - se ha eliminado el tag de la subcarpeta");	

									}

								}

								else if (arraydetags.length == 0) { // si el array de tags queda a 0 es posible que se borre la subcarpeta

									aborrar[i] = "yes"; // valor por defecto

									// primeramente vamos a ver si la la subcarpeta esta siendo usada por algún subsubfichero (mediante el id)
									var trans = db.transaction(["files"], "readonly")
									var objectStore = trans.objectStore("files")					
									var req = objectStore.openCursor(); 
						
									req.onerror = function(event) { 

										console.log("error: " + event);

									};

									req.onsuccess = function(event) { 

										var cursor = event.target.result; 
										if(cursor){

											if (cursor.value.filefolder == udirectoryfolders[i].id) { // la subcarpeta esta siendo usada en la bd

												aborrar[i] = "no";

												// solo se le quitara el tag

												folderupdate.foldertags = "";
												folderupdate.foldertags = folderupdate.foldertags.split(); //para convertirlo a array
												folderupdate.folder = undo.taggfold.folder + udirectoryfolders[i].name;
												folderupdate.folderid = udirectoryfolders[i].id;

												var trans = db.transaction(["folders"], "readwrite")
												var request = trans.objectStore("folders")
													.put(folderupdate);
							 
												request.onerror = function(event) { 

													console.log("error undo - no se ha eliminado el tag de la subcarpeta:" + event);

												};

												request.onsuccess = function(event) {

													// console.log("undo - se ha eliminado el tag de la subcarpeta");

												}

											}

											cursor.continue();
										}

									}

									trans.oncomplete = function() {

										if (aborrar[i] == "yes") { // se borrará la subcarpeta de la bd

											var trans = db.transaction(["folders"], "readwrite")
											var request = trans.objectStore("folders").delete(udirectoryfolders[i].id);

											request.onerror = function(event) { 

												console.log("error undo - no se ha eliminado subcarpeta de bd:" + event);

											};
											request.onsuccess = function(event) {

												// console.log("undo - eliminada subcarpeta de la bd");										
										
											}

										}

										if (dirtoexec == driveunit + undo.taggfold.folder) { // // se recargaran los elementos si estamos dentro de la carpeta
											previousornext = "refresh";
											readDirectory(dirtoexec);

										};

									}

								} // --fin else if araydetags = 0							

							}); // --fin each udirectoryfolders						

						} // -- fin trans

					}); // --fin each udirectoryfolders

				} // -- fin if (udirectoryfolders.length >= 1)


				// leemos datos subarchivos
				if (udirectoryarchives.length >= 1) {

					// primero recogemos los valores tagsid e id del archivo visualizado, que esta en la bd, y que necesitaremos para tomar los valores originales de los tags a la hora de refrescar los tags en la vista (para restarles el tag que queremos quitar)
					var trans = db.transaction(["files"], "readonly")
					var objectStore = trans.objectStore("files")

					var elementtagsinview=[];
					var valueoriginal=[];
					var valueaponer=[];
					var tagsdivs="";

					$.each(udirectoryarchives, function(i) {

						var fileupdate = {};			
						
						var req = objectStore.openCursor(); 
						
						req.onerror = function(event) { 

							console.log("error: " + event);

						};

						req.onsuccess = function(event) { 

							var cursor = event.target.result; 
							if(cursor){

								if(cursor.value.filename ==  udirectoryarchives[i].name){ 

									udirectoryarchives[i].tagsid = cursor.value.filetags; 
									udirectoryarchives[i].id = cursor.value.fileid;

								}
								cursor.continue();
							};

						}

						trans.oncomplete = function() {

							var elementosarchivotags = [];

							/*if (dirtoexec == driveunit + undo.taggfold.folder) {
								$.each(udirectoryarchives, function(i) {	

									// primero cambiamos el value de la etiqueta tags..								 
									$.each ($(".explofile"), function(n) {
										if ($(".explofile:eq("+n+")").attr("value") == udirectoryarchives[i].name) {
											elementtagsinview[i] = $(".explofile:eq("+n+")").siblings(".tags")
										}
									});
									valueoriginal[i] = udirectoryarchives[i].tagsid;
									if (typeof valueoriginal[i] == "string") {
										valueoriginal[i] = valueoriginal[i].split(",");
									}
									var index = valueoriginal[i].indexOf(undo.taggfold.tagid); //localizamos el id del tag a borrar
									valueoriginal[i].splice(index, 1); // lo quitamos del array
									valueaponer[i] = valueoriginal[i].toString() // de array a string

									// se cambian los tags del elemento del array de elementos (para no tener que recargar la carpeta si se cambia viewmode o order)
								    udirectoryarchives[i].tagsid = valueaponer[i];

									elementtagsinview[i][0].setAttribute("value", valueaponer[i]);
									
									// y ahora redibujamos los tags..										
									valueaponer[i] = valueaponer[i].split(','); //volvemos a convertirlo en array
									var tagsdivs = "";
									for(var k = 0; k < valueaponer[i].length; k += 1){ //recorremos el array
										tagsdivs += "<div class='tagticket' value='"+ valueaponer[i][k] +"'>" + valueaponer[i][k] +  "</div>" ;
									};

									elementtagsinview[i][0].innerHTML = tagsdivs;

									// para aplicarles los estilos a los tags hay que recurrir a la bd
									var trans2 = db.transaction(["tags"], "readonly")
									var objectStore2 = trans2.objectStore("tags")

									elementosarchivotags[i] = elementtagsinview[i].children(".tagticket");

									var req2 = objectStore2.openCursor();

									req2.onerror = function(event) {
										console.log("error: " + event);
									};
									req2.onsuccess = function(event) { 
										var cursor2 = event.target.result;
										if (cursor2) {
											$.each(elementosarchivotags[i], function(n) {											
												if (cursor2.value.tagid == elementosarchivotags[i][n].getAttribute("value")) {

													var color = "#" + cursor2.value.tagcolor;
													var complecolor = hexToComplimentary(color);

													elementosarchivotags[i][n].className += " small " + cursor2.value.tagform;
													elementosarchivotags[i][n].setAttribute("value", cursor2.value.tagid);
													elementosarchivotags[i][n].setAttribute("style", "background-color: #" + cursor2.value.tagcolor + ";" + "color: " + complecolor + ";")
													elementosarchivotags[i][n].innerHTML = cursor2.value.tagtext;

												}
											});

											cursor2.continue();

										}

									};

									trans2.oncomplete = function (event) {

										elementstagsorder();
										elemetstagdelete()

									}						

								});

							}*/

							// Ahora si, vamos a utilizar la bd para trabajar directamente con ella (no el tema de la visualización)					
							// Utilizamos el id de la carpeta para comprobar los subarchivos que la están usando y sus tags
							var trans = db.transaction(["files"], "readonly")
							var objectStore = trans.objectStore("files")	
							var req = objectStore.openCursor(); 
							
							req.onerror = function(event) {

								console.log("error: " + event);

							};

							req.onsuccess = function(event) { 

								var arraydetags = [];

								var cursor = event.target.result; 
								if(cursor){

									if (cursor.value.filefolder == undo.taggfold.foldid) {

										fileupdate.fileid = cursor.value.fileid;
										fileupdate.filefolder = cursor.value.filefolder;
										fileupdate.filename = cursor.value.filename;
										fileupdate.fileext = cursor.value.fileext;
										arraydetags = cursor.value.filetags;


										if (arraydetags.indexOf(',') > -1) { // si el string de tags (que nos da el cursor) contiene una coma por lo que hay más de un tag

											arraydetags = arraydetags.split(",");

											for (n in arraydetags) { 

												if (arraydetags[n] == undo.taggfold.tagid) { // cuando coincide el tag

													var index = arraydetags.indexOf(arraydetags[n]); // encontramos la posición index del tag dentro del array
													arraydetags.splice(index, 1); // eliminamos el item del array

												}

											}
											
											fileupdate.filetags = arraydetags;

											var trans15 = db.transaction(["files"], "readwrite")
											var request15 = trans15.objectStore("files")
												.put(fileupdate);
													 
											request15.onerror = function(event) { 

												console.log("error - tag no eliminada en subarchivo: " + event);

											};

											request15.onsuccess = function(event) {

												// console.log("tag eliminada de subarchivo");

											};

										}

										else { // si el array de tags no tenía "," (si el subarchivo no tenía más tags)

											// lo eliminamos de la bd
											var trans = db.transaction(["files"], "readwrite")
											var request = trans.objectStore("files").delete(cursor.value.fileid);

											request.onerror = function(event) { 

												console.log("error undo - no se ha eliminado subarchivo de bd:" + event);

											};
											request.onsuccess = function(event) {

												// console.log("undo - eliminado subarchivo de la bd");									
										
											}

										}

									}

									cursor.continue()

								}

							}

							trans.oncomplete = function() {

								if (dirtoexec == driveunit + undo.taggfold.folder) { // se recargaran los elementos si estamos dentro de la carpeta
									previousornext = "refresh";
									readDirectory(dirtoexec);

								};


							}

						}

					});

				}

				// Acciones sobre la carpeta madre

				var ffolderupdate = {};
				var carraydetags = [];
				var carraydetagsorig = [];
				var masdeuntag = "false";

				var trans3 = db.transaction(["folders"], "readonly")
				var objectStore3 = trans3.objectStore("folders")	
				var req3 = objectStore3.openCursor(); 

				req3.onerror = function(event) {

					console.log("error: " + event);

				};

				req3.onsuccess = function(event) { 			

					var cursor3 = event.target.result; 
					if(cursor3){

						if (cursor3.value.folderid == undo.taggfold.foldid) {

							ffolderupdate.folderid = cursor3.value.folderid;
							ffolderupdate.folder = cursor3.value.folder;
							carraydetagsorig = carraydetags = cursor3.value.foldertags;

							// Visual

							//var estabavisible = "no"; // variable auxiliar necesaria para que no haga un splice del arraydetagsoriginal dos veces (una para el directoryview y otra para el treeview)
							//$.each($(".explofolder"), function(i) {	

								//var carpeta = $(".explofolder:eq("+i+")").attr("value");								

								//if (rootdirectory + carpeta == undo.taggfold.folder){ // si la carpeta madre a la que se añadio el tag esta visible en el directorio

									//estabavisible = "si";

									/*// Actualizar visual
									var elementtagsinview = $('.explofolder').filter('[value="' + carpeta + '"]').siblings('.tags');
									var index = carraydetagsorig.indexOf(undo.taggfold.tagid); // localizamos el id del tag a borrar
									carraydetagsorig.splice(index, 1); // lo quitamos del array
									carraydetags = carraydetagsorig.toString() // de array a string

									// se cambian los tags del elemento del array de elementos (para no tener que recargar la carpeta si se cambia viewmode o order)
									$.each (directoryfolders, function(drf){										
										if (directoryfolders[drf].name  == carpeta){
											directoryfolders[drf].tagsid = carraydetags;						
										}
									});
									

									elementtagsinview[0].setAttribute("value", carraydetags);
						
									// y ahora redibujamos los tags..										
									carraydetags = carraydetags.split(','); // volvemos a convertirlo en array
									var tagsdivs = "";
									for(var k = 0; k < carraydetags.length; k += 1){ // recorremos el array
										tagsdivs += "<div class='tagticket' value='"+ carraydetags[k] +"'>" + carraydetags[k] +  "</div>" ;
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

									};*/

								//}
								

							//});

							$.each ($("#filetree span"), function(t) {

								if($("#filetree span:eq("+t+")").attr("rel2") == undo.taggfold.folder) {

									/*if (estabavisible == "no") {
										var index = carraydetagsorig.indexOf(undo.taggfold.tagid); // localizamos el id del tag a borrar
										carraydetagsorig.splice(index, 1); // lo quitamos del array
										carraydetags = carraydetagsorig.toString() // de array a string
									}
									if (estabavisible == "si") {

										carraydetags = carraydetags.toString() // de array a string

									}*/

									var index = carraydetagsorig.indexOf(undo.taggfold.tagid); // localizamos el id del tag a borrar
									carraydetagsorig.splice(index, 1); // lo quitamos del array
									carraydetags = carraydetagsorig.toString() // de array a string

									$("#filetree span:eq("+t+")").attr("value", carraydetags);
						
									// y ahora redibujamos los tags..										
									carraydetags = carraydetags.split(','); //volvemos a convertirlo en array
									var fttagsdivs = "";
									for(var k = 0; k < carraydetags.length; k += 1){ //recorremos el array
										fttagsdivs += "<div class='tagticket' value='"+ carraydetags[k] +"'>" + carraydetags[k] +  "</div>" ;
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

							});

							// trabajando con la bd

							// antes de decidir que hacer con la carpeta madre, vamos a ver si tiene más de un tag o no
							// si tiene más de un tag solo quitamos el tag que queríamos y ya esta

							var size=0
							for (n in carraydetags) {
	        					if (carraydetags[n]!="") size++;
	    					}

							if (size > 0) { // si el array de tags de la carpeta madre tiene más de un elemento

								masdeuntag = "true";

								for (n in carraydetags) { 

									if (carraydetags[n] == undo.taggfold.tagid) { // cuando coincide el tag

										var index = carraydetags.indexOf(carraydetags[n]); // encontramos la posición index del tag dentro del array
										carraydetags.splice(index, 1); // eliminamos el item del array

										carraydetags = carraydetags.toString();

									}

								}

								ffolderupdate.foldertags = carraydetags;

							} 
							
						}

						cursor3.continue();

					}

				}

				trans3.oncomplete = function() { // trabajando con la bd

					if (masdeuntag == "true") { // si tiene más de un tag solo actualizamos los tags quitándole el que queríamos

						var trans4 = db.transaction(["folders"], "readwrite")
						var request4 = trans4.objectStore("folders")
							.put(ffolderupdate);

						request4.onerror = function(event) { 

							console.log("error undo - no se ha quitado el tag de la carpeta: " + event);

						};
						request4.onsuccess = function(event) {

							// console.log("undo - se ha quitado el tag de la carpeta");

						}

						trans4.oncomplete = function(event) {

							var estabavisible = "no"
							$.each($(".explofolder"), function(i) {
								var carpeta = $(".explofolder:eq("+i+")").attr("value");	
								if (rootdirectory + carpeta == undo.taggfold.folder){
									estabavisible = "yes"
								}
							});
							if (estabavisible == "yes") {
								previousornext = "refresh";
								readDirectory(dirtoexec);
							}
						}

					}

					if (masdeuntag == "false") { // vamos a comprobar si hay archivos dependientes de la carpeta madre y si no es asi la eliminaremos de la bs

						var conservarcarpeta = "false";

						// utilizamos el id de la carpeta para comprobar los subarchivos que la están usando y sus tags
						var trans2 = db.transaction(["files"], "readonly")
						var objectStore2 = trans2.objectStore("files")	
						var req2 = objectStore2.openCursor(); 
						
						req2.onerror = function(event) {

							console.log("error: " + event);

						};

						req2.onsuccess = function(event) { 

							var barraydetags = [];

							var cursor2 = event.target.result; 
							if(cursor2){

								if (cursor2.value.filefolder == undo.taggfold.foldid) {

									barraydetags = cursor2.value.filetags

									if (barraydetags.indexOf(',') > -1) { // si el array contiene una coma por lo que hay más de un tag

										barraydetags = barraydetags.split(",");

										for (n in barraydetags) { 

											if (barraydetags[n] != undo.taggfold.tagid) { // si tiene un tag distinto del que se va a borrar

												conservarcarpeta = "true"

											}

										}								
										
									}
																
									else { 

										if (cursor2.value.filetags != undo.taggfold.tagid) { //si el unico tag que tiene es distinto

											conservarcarpeta = "true"

										}

									}

								}

								cursor2.continue();

							}

						}

						trans2.oncomplete = function(e) {

							if (conservarcarpeta == "true") {

								// vamos a eliminar solo el tag de la carpeta
								ffolderupdate.foldertags = [];

								var trans4 = db.transaction(["folders"], "readwrite")
								var request4 = trans4.objectStore("folders")
									.put(ffolderupdate);

								request4.onerror = function(event) { 

									console.log("error undo - no se ha metido nada como tag de la carpeta: " + event);

								};
								request4.onsuccess = function(event) {

									// console.log("undo - se ha metido como tag de la carpeta");

								}
								trans4.oncomplete = function(event) {

									var estabavisible = "no"
									$.each($(".explofolder"), function(i) {
										var carpeta = $(".explofolder:eq("+i+")").attr("value");	
										if (rootdirectory + carpeta == undo.taggfold.folder){
											estabavisible = "yes"
										}
									});
									if (estabavisible == "yes") {
										previousornext = "refresh";
										readDirectory(dirtoexec);
									}
								}

							}

							else { // si conservarcarpeta es false

								// eliminamos la carpeta de la bd
								var trans5 = db.transaction(["folders"], "readwrite")
								var request5 = trans5.objectStore("folders").delete(undo.taggfold.foldid);

								request5.onerror = function(event) { 

									console.log("error undo - no se ha eliminado carpeta de bd:" + event);

								};
								request5.onsuccess = function(event) {

									// console.log("undo - eliminada carpeta de la bd");

								}

								trans5.oncomplete = function(event) {

									var estabavisible = "no"
									$.each($(".explofolder"), function(i) {
										var carpeta = $(".explofolder:eq("+i+")").attr("value");	
										if (rootdirectory + carpeta == undo.taggfold.folder){
											estabavisible = "yes"
										}
									});
									if (estabavisible == "yes") {
										previousornext = "refresh";
										readDirectory(dirtoexec);
									}
								}
							
							}

						}

					}

				}

				$(".undo", window.parent.document).attr("data-tooltip", ph_dato_no);
				undo.class="";

				break; //--fin if class "tag folder and subelements")


			case "move":

				var foldername = [];

				// primero detectamos si las carpetas esta en la base de datos
				var trans = db.transaction(["folders"], "readwrite")
				var objectStore = trans.objectStore("folders")
				var req = objectStore.openCursor();

				req.onerror = function(event) {
					console.log("error: " + event);
				};
				req.onsuccess = function(event) { 
					var cursor = event.target.result;
					if (cursor) {
						$.each(undo.move.rootfolders, function(t) {

							folderupdate = {};

							foldername[t] = undo.move.rootfolders[t].children[1].attributes[1].nodeValue;

							if (cursor.value.folder == undo.move.rootfoldernew + foldername[t]) {

								// si está la carpeta le adjuntamos nuevo valor al nombre
								folderupdate.folder = undo.move.rootfolderorig + foldername[t]
								folderupdate.folderid = cursor.value.folderid
								folderupdate.foldertags = cursor.value.foldertags

								var res2 = cursor.update(folderupdate);

								res2.onerror = function(event){
									console.log("error ruta carpeta no cambiada: " + event);									
								}

								res2.onsuccess = function(event){

									// console.log("ruta carpeta cambiada")			


								}

							}

							else if (cursor.value.folder == undo.move.rootfolderorig + foldername[t]) { // si la carpeta origen no esta en la base de datos, al hacer el move hay que eliminar los tags de la carpeta destino si los tuviera

								folderupdate.folderid = cursor.value.folderid;

								var res2 = cursor.delete(folderupdate);

								res2.onerror = function(event){
									console.log("error: carpeta destino no borrada de bd " + event);									
								}

								res2.onsuccess = function(event){

									// console.log("carpeta destino no borrada de bd");	

								}

							}

						});

						cursor.continue();

					}							

				}

				trans.oncomplete = function(event) {

					// ahora miramos cada una de las subcarpetas si está en la base de datos y si está le cambiamos la dirección por el de la subcarpeta destino, (los archivos al estar asociados a las carpetas cambiaran automáticamente)

					$.each(undo.move.subfoldersnew, function(t) {

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

								if (cursor10.value.folder == undo.move.subfoldersnew[t]) {

									updatefolder.folder = undo.move.subfoldersorig[t];
									updatefolder.folderid = cursor10.value.folderid;
									updatefolder.foldertags = cursor10.value.foldertags

									var res11 = cursor10.update(updatefolder);

									res11.onerror = function(event){
										console.log("error ruta subcarpeta no cambiada: " + event);									
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
					var refescohechoporcarpeta = "no";
					window.flaggF = 0;

					$.each(foldername, function(t) {

						fs.move(driveunit + undo.move.rootfoldernew + foldername[t], driveunit + undo.move.rootfolderorig + foldername[t], { clobber: true }, function(err) {

							window.flaggF++;

							if (window.flaggF == foldername.length && refescohechoporcarpeta == "no" && undo.move.rootfiles.length == 0) { // para que haga el refresco tras mover la última carpeta

								previousornext = "refresh"; // para refrescar sin añadir al array de los direcciones visitadas
								readDirectory(dirtoexec);
								refescohechoporcarpeta = "si";

								// para actualizar visual del filetree
								$.each ($("#filetree span"), function(l) {

									if($("#filetree span:eq("+l+")").attr("rel2") ==  undo.move.rootfoldernew) {

										// contraer y volver a expandir
										$("#filetree span:eq("+l+")").trigger( "click" );
										$("#filetree span:eq("+l+")").trigger( "click" );

									}

									if($("#filetree span:eq("+l+")").attr("rel2") == undo.move.rootfolderorig) {

										// contraer y volver a expandir
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
				$.each(undo.move.rootfiles, function(t) {

					if (undo.move.rootfiles[t].children[4].attributes[1].value != "") {
						anyarchiveondb = "yes";
					}

				});

				if (anyarchiveondb == "yes") { // si al menos uno tiene tags

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

							if (cursor3.value.folder == undo.move.rootfolderorig) {


								destfolderid = cursor3.value.folderid;

							}

							// también aprovechamos para sacar el id de la carpeta origen (para luego buscar los archivos en la bd)
							if(cursor3.value.folder == undo.move.rootfoldernew){ 


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
							.put({ folder: undo.move.rootfolderorig, foldertags: [] }); // el id no hace falta pues es autoincremental
											 
							request4.onerror = function(event){

								console.log("error carpeta destino no añadida a bd: " + event);
							
							}

							request4.onsuccess = function(event){

								// console.log("carpeta destino añadida a bd!");

							}

							trans4.oncomplete = function(e) { //vamos a tomar el id de la carpeta añadida

								var trans5 = db.transaction(["folders"], "readonly")
								var objectStore5 = trans5.objectStore("folders")
								var req5 = objectStore5.openCursor();

								req5.onerror = function(event) { 

									console.log("error: " + event);

								};

								req5.onsuccess = function(event) {

									var cursor5 = event.target.result;
				
									if(cursor5){

										if(cursor5.value.folder == undo.move.rootfolderorig){ 

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

												$.each(undo.move.rootfiles, function(t) {

													if (cursor6.value.filename == undo.move.rootfiles[t].children[1].attributes[1].value) {

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
															refescohecho = "no"
															fflagg = 0;
															$.each(undo.move.rootfiles, function(t) {

																fs.rename(driveunit + undo.move.rootfoldernew + undo.move.rootfiles[t].children[1].attributes[1].value, driveunit + undo.move.rootfolderorig + undo.move.rootfiles[t].children[1].attributes[1].value, function(err) { 

																	fflagg++;														

																	if (fflagg == undo.move.rootfiles.length && refescohecho == "no") { // para que haga el refresco tras mover la última carpeta

																		refescohecho = "si";																	

																		if(foldername.length > 0) {
															
																			timetowait = foldername.length * 30;	
																			setTimeout(function() {
																				$.each ($("#filetree span"), function(l) {

																					if($("#filetree span:eq("+l+")").attr("rel2") == undo.move.rootfoldernew) {

																						// contraer y expandir
																						$("#filetree span:eq("+l+")").trigger( "click" );
																						$("#filetree span:eq("+l+")").trigger( "click" );

																					}

																					if($("#filetree span:eq("+l+")").attr("rel2") == undo.move.rootfolderorig) {

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

												});

											}

											cursor6.continue();
										}

									}

									trans6.oncomplete = function(event) {

										// comprobamos si la carpeta origen se queda sin archivos con tags
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

													console.log("error undo - no se ha eliminado carpeta de bd:" + event);

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

							// primero borramos de la base de datos los archivos que están asociados a la carpeta destino que vamos a sobrescribir con la operación de movimiento

							$.each(undo.move.rootfiles, function(t) {

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

											if (cursor6.value.filename == undo.move.rootfiles[t].children[1].attributes[1].value) {

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

							$.each(undo.move.rootfiles, function(t) {

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

											if (cursor6.value.filename == undo.move.rootfiles[t].children[1].attributes[1].value) {

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

													// movemos los archivos

													var refescohecho = "no"
													var fflagg = 0;
													$.each(undo.move.rootfiles, function(t) {

														fs.rename(driveunit + undo.move.rootfoldernew + undo.move.rootfiles[t].children[1].attributes[1].value, driveunit + undo.move.rootfolderorig + undo.move.rootfiles[t].children[1].attributes[1].value, function(err) { 

															fflagg++;														

															if (fflagg == undo.move.rootfiles.length && refescohecho == "no") { // para que haga el refresco tras mover la última carpeta

																refescohecho = "si";																	

																if(foldername.length > 0) {
													
																	timetowait = foldername.length * 30;	
																	setTimeout(function() {
																		$.each ($("#filetree span"), function(l) {

																			if($("#filetree span:eq("+l+")").attr("rel2") == undo.move.rootfoldernew) {

																				// contraer y expandir
																				$("#filetree span:eq("+l+")").trigger( "click" );
																				$("#filetree span:eq("+l+")").trigger( "click" );

																			}

																			if($("#filetree span:eq("+l+")").attr("rel2") == undo.move.rootfolderorig) {

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

										cursor6.continue();
									}

								}

								trans6.oncomplete = function(event) {

									// comprobamos si la carpeta origen se queda sin archivos con tags

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

												console.log("error undo - no se ha eliminado carpeta de bd:" + event);

											};

											request9.onsuccess = function(event) {

												console.log("undo - eliminada carpeta de la bd");

											}

										}

									}

								}

							});

						}

					}

				}

				else if (anyarchiveondb == "no") {

					$.each(undo.move.rootfiles, function(t) {

						fs.rename(driveunit + undo.move.rootfoldernew + undo.move.rootfiles[t].children[1].attributes[1].value, driveunit + undo.move.rootfolderorig + undo.move.rootfiles[t].children[1].attributes[1].value, function(err) {

						});

					});

				}


				setTimeout(function(){ readDirectory(dirtoexec)},  1000);
				$(".undo", window.parent.document).attr("data-tooltip", ph_dato_no);
				undo.class = "";


				break; //--fin if class "move"


			case "copy":

				rootfilename = [];

				// console.log(undo.copy)
				// console.log(undocopyrootfolders)
				
				//primero se borran los archivos copiados en el root de la carpeta destino

				$.each(undo.copy.rootfiles, function(n){

					rootfilename[n] = undo.copy.rootfiles[n].children[1].attributes[1].value;

					fs.stat(driveunit + undo.copy.root + rootfilename[n], function (err, stats) {
					   // console.log(stats);//here we got all information of file in stats variable
					   if (err) {
					       return console.error(err);
					   }

					   fs.unlink(driveunit + undo.copy.root + rootfilename[n],function(err){
					        if(err) return console.log(err);
					        // console.log('file deleted successfully');
					   });  
					});


				})

				// ahora se borran los archivos copiados en las carpetas de 1er nivel

				$.each(undocopyrootfolders, function(n) {

					var directoryelement = []
					var directorycontent = []
					var directoryfolders = []
					var udirectoryarchives = []



					var readedElements = fs.readdirSync(driveunit + undo.copy.originalroot + undocopyrootfolders[n])

					for (i = 0; i < readedElements.length; i++) {

						// comprobar si es carpeta o archivo
						var dirtoreadcheck = driveunit + undo.copy.originalroot + undocopyrootfolders[n] + "\/" + readedElements[i];

						try {
							var arorfo = "i_am_an_archive";
							var arorfo = fs.readdirSync(dirtoreadcheck);
						}
						catch(exception) {};

						directoryelement.name = "\/" + readedElements[i]
						// directoryelement.ext = ext;
						directoryelement.arorfo = arorfo;
						directoryelement.id = ""; // se lo metemos después de separar carpetas y archivos (y estará oculto en la vista)
						directoryelement.tagsid = []; // se lo metemos después de separar carpetas y archivos

						var copied_directoryelement = jQuery.extend({}, directoryelement); //necesario trabajar con una copia para actualizar el objeto directorycontent
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
							udirectoryarchives[iii] = directorycontent[i];
							iii++;
						};
					});


					$.each(udirectoryarchives, function(l) {
							
					    try {

						   fs.unlinkSync(driveunit + undo.copy.root + undocopyrootfolders[n] + udirectoryarchives[l].name);
						   // console.log('file deleted successfully');					  
						}

						catch (err) {
							// console.log("error file not deleted")
							console.log(err)

						}

					})

				});

				// ahora se borran los archivos y carpetas copiados en las restantes subcarpetas

				$.each(undo.copy.originalfolders, function(n) {

					var directoryelement = []
					var directorycontent = []
					var directoryfolders = []
					var udirectoryarchives = []

					var readedElements = fs.readdirSync(driveunit + undo.copy.originalfolders[n])

					for (i = 0; i < readedElements.length; i++) {

						// comprobar si es carpeta o archivo
						var dirtoreadcheck = driveunit + undo.copy.originalfolders[n] + "\/" + readedElements[i];

						try {
							var arorfo = "i_am_an_archive";
							var arorfo = fs.readdirSync(dirtoreadcheck);
						}
						catch(exception) {};

						directoryelement.name = "\/" + readedElements[i]
						// directoryelement.ext = ext;
						directoryelement.arorfo = arorfo;
						directoryelement.id = ""; // se lo metemos después de separar carpetas y archivos (y estará oculto en la vista)
						directoryelement.tagsid = []; // se lo metemos después de separar carpetas y archivos

						var copied_directoryelement = jQuery.extend({}, directoryelement); //necesario trabajar con una copia para actualizar el objeto directorycontent
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
							udirectoryarchives[iii] = directorycontent[i];
							iii++;
						};
					});

					$.each(udirectoryarchives, function(l) {
					   
						try {
						   	fs.unlinkSync(driveunit + undo.copy.folders[n] + udirectoryarchives[l].name);
						   	// console.log('file deleted successfully');
						  
						}
						catch (err) {
							// console.log("error file not deleted")
							console.log(err)

						}	

					})

				});

				// ahora se va a comprobar si estás subcarpetas han quedado vacías, y si es el caso se borrarán
				$.each(undo.copy.folders, function(n) {

					// parece que ahora funciona el removeSync, si puedeo sutituirlo en las demás simplificare bastante. 
					// Lo dejo para hacerlo en una próxima ocasión
					fs.removeSync(driveunit + undo.copy.folders[n])

				});

				// ahora se comprueba si las subcarpetas de 1er nivel han quedado vacías, y si el el caso se borran
				$.each(undocopyrootfolders, function(n) {

					var readedElements = fs.readdirSync(driveunit + undo.copy.root + undocopyrootfolders[n]);

					if (readedElements.length == 0) {

					    try {
					   		fs.rmdirSync(driveunit + undo.copy.root + undocopyrootfolders[n]);
					   		// console.log("folder deleted sucesfully")
						}
						catch(err) {
							console.log("error folder not deleted")
						}

					}

				});


				// ahora se manejará la base de datos para eliminar los archivos que se habían añadido a la hora de hacer la copia
				$.each(undo.copy.addedfileids, function(t) {

					var trans5 = db.transaction(["files"], "readwrite")
					var request5 = trans5.objectStore("files").delete(undo.copy.addedfileids[t]);

					request5.onerror = function(event) { 

						console.log("error undo - no se ha eliminado el archivo de la bd:" + event);

					};
					request5.onsuccess = function(event) {

						// console.log("undo - eliminado archivo de la bd");

					}

				});

				// y ahora se eliminan las carpetas añadidas
				$.each(undo.copy.addedfolderids, function(t) {

					var trans6 = db.transaction(["folders"], "readwrite")
					var request6 = trans6.objectStore("folders").delete(undo.copy.addedfolderids[t]);

					request6.onerror = function(event) { 

						console.log("error undo - no se ha eliminado la carpeta de la bd:" + event);

					};
					request6.onsuccess = function(event) {

						// console.log("undo - eliminada la carpeta de la bd");

					}

				});


				// actualizar visual

				$(".undo", window.parent.document).attr("data-tooltip", ph_dato_no);
				undo.class = "";

				setTimeout(function(){ 

					if(undocopyrootfolders.length > 0) {
													
						timetowait = undocopyrootfolders.length * 30;	
						setTimeout(function() {
							$.each ($("#filetree span"), function(l) {

								if($("#filetree span:eq("+l+")").attr("rel2") == undo.copy.originalroot) {

									// contraer y expandir
									$("#filetree span:eq("+l+")").trigger( "click" );
									$("#filetree span:eq("+l+")").trigger( "click" );

								}

								if($("#filetree span:eq("+l+")").attr("rel2") == undo.copy.root) {

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

				},  1000);
				$(".undo", window.parent.document).attr("data-tooltip", ph_dato_no);
				undo.class = "";

				break; // -- fin undo copy

		} // -- fin switch

		var tabseleccionado = $('.current', window.parent.document).attr("id");
        if (tabseleccionado == "exploretab") {
            top.explorer.focus();
        } else if (tabseleccionado == "searchtab") {
            top.searcher.focus();
        }

	});	//--fin undo click

}); //--fin on document ready
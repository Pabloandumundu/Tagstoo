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


var fs=require('fs');

// si no existe unidad utilizada por última vez, se selecciona la primera disponible
if (!localStorage["lastuseddriveunit"]) {

	var availabledrives=[];
	var toselectfromdrives=[];
	var drivelist = require('drivelist');

	var t="";
	var tdesc="";

	availabledrives = drivelist.list((error, drives) => {
		
		if (error) {
			throw error;
		}

		drives.forEach((drive, i) => {

			toselectfromdrives.push(drive.mountpoints["0"].path)

		});

		window.driveunit = toselectfromdrives["0"];

		$('#selecteddrive').html(driveunit)

		// console.log(driveunit)
		initialoptionspreload();

	});

}
else {

	driveunit = localStorage["lastuseddriveunit"];
	initialoptionspreload();

}


function initialoptionspreload() {

	// tomar nombres de las bases de datos indexeddb:
	indexedDB.webkitGetDatabaseNames().onsuccess = function(sender,args) { 

		var currentlydatabaseused = localStorage["currentlydatabaseused"];

		var listadocompletodeDB = sender.target.result
		var listadofiltradodeDB = [];
		window.listadofiltradodeDB_toshow = [];

		$.each(listadocompletodeDB, function(i){

			 if (listadocompletodeDB[i].substring(0, 8) == "tagstoo_") {

				listadofiltradodeDB.push(listadocompletodeDB[i])

		 	}

		});

		if (!currentlydatabaseused) {

			if(!listadofiltradodeDB[0]) {
				alertify.alert("There is not previously used database. You must enter a new name for a new database.")
			} else {
				alertify.alert("There is not previously used database. You must enter a new name for a new database, or select one from the available (previously created) database list.")
			}
		}

		if (currentlydatabaseused) {
			currentlydatabaseused_toshow = currentlydatabaseused.replace("tagstoo_", "");

			$('#selecteddb').html(currentlydatabaseused_toshow)
		
		}

		$.each(listadofiltradodeDB, function(i){

			listadofiltradodeDB_toshow.push(listadofiltradodeDB[i].replace("tagstoo_", ""));

		})

		loaddatabaseselect();
		loaddriveslist();

		if (driveunit) {
			$('#selecteddrive').html(driveunit)
		}

		$("#databaseselect").change(function() {

			$('#selecteddb').html($("#databaseselect").val());

		});
		
		$("#unitselect").change(function() {

			$('#selecteddrive').html($("#unitselect").val());

			var availabledrives=[];
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

		})

		$("#newdatabase").on('click', function(){

			if($("#newdatabasename").val() != "" ){

				var preexistingname = "no";

				$.each (listadofiltradodeDB_toshow, function(i) {
					if (listadofiltradodeDB_toshow[i] == $("#newdatabasename").val()) {
						preexistingname = "yes";
					}

				});

				if(preexistingname=="no") {

					$('#selecteddb').html($("#newdatabasename").val())
				}
				else {
					alertify.alert("The name you chosen already exists, first delete the database that use this name if you want to use it.")
				}

			}
			else {
				alertify.alert("You must enter a name for the database first.")
			}

		});
		// lo mismo si se pulsa enter..
		$('#newdatabasename').on('keypress', function (e) {
     		if(e.which === 13){

     			if($("#newdatabasename").val() != "" ){

					var preexistingname = "no";

					$.each (listadofiltradodeDB_toshow, function(i) {
						if (listadofiltradodeDB_toshow[i] == $("#newdatabasename").val()) {
							preexistingname = "yes";
						}

					});

					if(preexistingname=="no") {

						$('#selecteddb').html($("#newdatabasename").val())
					}
					else {
						alertify.alert("The name you chosen already exists, first delete the database that use this name if you want to use it.")
					}

				}
				else {
					alertify.alert("You must enter a name for the database first.")
				}

     		};
     	});


		$("#inportdata").on('click', function(){

			if ($('#selecteddb').html() != "") {

				alertify.alert("A file open dialog will be open, you can either select a pre existing file or create a new one (right mouse button), be careful, data in the selected file will be overwritten.", function () { 

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
										var request = window.indexedDB.open("tagstoo_" + $('#selecteddb').html(), 1);
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

													alertify.alert("Data successfully imported.");							

												}
												
											});

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

			if ($('#selecteddb').html() != "") {

				alertify.confirm("Attention, you select to delete <em>'"+$('#selecteddb').html()+"'</em>, are you sure?", function (e) {
					if (!e) {
						x = "You pressed Cancel!";
						console.log(x);                 
					} else {                  
						x = "You pressed OK!";
						console.log(x)
						
						var DBDeleteRequest = window.indexedDB.deleteDatabase("tagstoo_" + $('#selecteddb').html());

						DBDeleteRequest.onerror = function(event) {
						  console.log("Error deleting database.");
						};
						 
						DBDeleteRequest.onsuccess = function(event) {
						  // console.log("Database deleted successfully");

						  // se borra del localstorage si la base de datos borrada es la que estaba señalizada en el localstorage
						  if (localStorage["currentlydatabaseused"] == "tagstoo_" + $('#selecteddb').html()) {			  	
						  	 localStorage.removeItem("currentlydatabaseused");
						  }

						  alertify.alert("Database deleted successfully.", function () { 
						  	location.reload();
						  });

						};						

					}

				});
			} else {
				alertify.alert("You must select a database to delete first.");
			}

		});

	};

}


function loaddatabaseselect() {

	$("#databaseselect").find('option').remove().end(); // con esto se vacían las opciones del select para volver a llenarlo con las lineas de abajo

	$.each(listadofiltradodeDB_toshow, function(i){

		var opt = document.getElementById("databaseselect"); 
		var option = document.createElement("option");
		option.value = listadofiltradodeDB_toshow[i];                
		var optionText = document.createTextNode(option.value);                
		option.appendChild(optionText);
		opt.appendChild(option);

		opt.selectedIndex = -1; // para que ninguna este por defecto seleccionada
	
	})	

}

function loaddriveslist() {

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

};


function starttagstoo() {

	if ($("#selecteddb").html() != "") {
		if($("#drivedesc").html() != "(Can't load this drive, select an available one.)") {

			localStorage["currentlydatabaseused"] = "tagstoo_" + $("#selecteddb").html();
		    localStorage["selecteddriveunit"] = $("#selecteddrive").html();
		    localStorage["lastuseddriveunit"] = $("#selecteddrive").html();

			window.parent.location.assign("main.html")

		}
		else {
			alertify.alert("Please select an available drive unit.")
		}

	} else {
		alertify.alert("You must select an existing database or enter a new name for a new database to launch the program.")
	}
	
};
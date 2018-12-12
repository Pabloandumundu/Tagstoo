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


// la función que lanza el aviso que se cierra tras un periodo, para cuando se añaden tags a subelementos
// es el customAlert del utils.js y es llamada desde este fichero (popups.js)

var dirtoexec =  top.explorer.dirtoexec;
var dialog = window.top.dialog;

var language = localStorage["language"];

if (language == 'EN') {

	ph_p_cantloaddrive = "(Can't load this drive, select an available one.)";
	ph_p_localdisk_nbsp = "&nbsp;(local disk)";
	ph_p_localdisk = "local disk";
	ph_p_exterdisk = "external disk";
	ph_p_copy = "COPY";
	ph_p_move = "MOVE";
	ph_p_alr_01 = "Time between images must be more than 0!. Time not saved.";
	ph_p_alr_02 = "Tag Added.";
	ph_p_alr_03 = "You must select a shape for the tag.";
	ph_p_alr_04 = "Some text is needed for the new tag.";
	ph_p_alr_05 = "Please, first select an existing tag if you want to edit it.";
	ph_p_alr_06 = "Tag saved!. Refresh the view if needed.";
	ph_p_alr_07 = "Tag deleted!. Refresh the view if needed.";
	ph_p_alr_08 = "First select the tag you want to remove.";
	ph_p_alr_09 = "The name you chosen already exists, first delete the database that uses this name if you want to use it.";
	ph_p_alr_10 = "You must enter a name for the database first.";
	ph_p_alr_11 = "A file open dialog will be open, you can either select a pre-existing file or, for example in Windows, create a new one (right mouse button), be careful, data in the selected file will be overwritten.";
	ph_p_alr_12 = "'</em> written successfully.";
	ph_p_alr_13 = "An open file dialog will open, select the file where database is saved, be careful, data in the selected database will be overwritten by the content of the file.";
	ph_p_alr_14 = "Data successfully imported.";
	ph_p_alr_15a = "It appears that <em>'";
	ph_p_alr_15b = "'</em> do not have a valid data format, please select a valid data file.";
	ph_p_alr_16 = "Database deleted successfully.";
	ph_p_alr_17 = "Not possible to copy to root directory... Select a destination folder.";
	ph_p_alr_18 = "Not possible to move to root directory... Select a destination folder.";
	ph_p_alc_01 = "You chosen to delete the selected tag, all the associations to this tag will be unlinked, are you sure?";
	ph_p_alc_02a = "Attention, you have selected to write in <em>'";
	ph_p_alc_02b = "'</em>, all previous data in file will be overwritten, are you sure?";
	ph_p_alc_03a = "Attention, the data in selected database, <em>'";
	ph_p_alc_03b = "'</em>, will be overwritten by the content of file <em>'";
	ph_p_alc_03c = "'</em>, are you sure?";
	ph_p_alc_04a = "Attention, you have selected to delete <em>'";
	ph_p_alc_04b = "'</em>, are you sure?";
	ph_p_alc_05 = "You have chosen to delete the database currently in use, to make it possible you must delete it from the program initial start window, do you want to restart program to make possible to delete it?";
	ph_p_calc_tagfolder = "(PLEASE, WAIT A MOMENT WHILE TAGS ARE ADDED)...";
	ph_p_dato_tagfoldsub = "UNDO (tag folder and subelements)";

} else if (language == 'ES') {

	ph_p_cantloaddrive = "(No se puede cargar esta unidad, seleccione una disponible.)";
	ph_p_localdisk_nbsp = "&nbsp;(disco local)";
	ph_p_localdisk = "disco local"
	ph_p_exterdisk = "disco externo";
	ph_p_copy = "COPIAR";
	ph_p_move = "MOVER";
	ph_p_alr_01 = "¡El tiempo entre imágenes debe ser mayor de 0!. Tiempo no guardado.";
	ph_p_alr_02 = "Etiqueta Añadida.";
	ph_p_alr_03 = "Debe seleccionar una forma para la etiqueta.";
	ph_p_alr_04 = "Se necesita algún texto para la nueva etiqueta.";
	ph_p_alr_05 = "Por favor, primero seleccione una etiqueta existente si desea editarla.";
	ph_p_alr_06 = "¡Etiqueta guardada!. Actualizar la vista si fuera necesario.";
	ph_p_alr_07 = "¡Etiqueta eliminada!. Actualizar la vista si fuera necesario.";
	ph_p_alr_08 = "Primero seleccione la etiqueta que desea eliminar.";
	ph_p_alr_09 = "El nombre que ha elegido ya existe, elimine primero la base de datos que utiliza este nombre si desea utilizarlo."
	ph_p_alr_10 = "Debe introducir primero un nombre para la base de datos.";
	ph_p_alr_11 = "Se abrirá un cuadro de diálogo de abrir archivo, puede seleccionar un archivo pre existente o, por ejemplo en Windows, crear uno nuevo (botón derecho del ratón), tenga cuidado, los datos del archivo seleccionado se sobrescribirán.";
	ph_p_alr_12 = "'</em> escrito con éxito.";
	ph_p_alr_13 = "Se abrirá un cuadro de diálogo de abrir archivo, seleccione el archivo donde se guardó la base de datos, tenga cuidado, los datos de la base de datos seleccionada serán sobrescritos por el contenido del archivo.";
	ph_p_alr_14 = "Datos importados correctamente.";
	ph_p_alr_15a = "Parece que <em>'";
	ph_p_alr_15b = "'</em> no tiene un formato de datos válido, seleccione un archivo de datos válido.";
	ph_p_alr_16 = "Base de datos eliminada correctamente.";
	ph_p_alr_17 = "No es posible copiar en el directorio raíz... Seleccione una carpeta de destino.";
	ph_p_alr_18 = "No es posible mover al directorio raíz... Seleccione una carpeta de destino.";
	ph_p_alc_01 = "Has elegido eliminar la etiqueta seleccionada, todas las asociaciones a esta etiqueta serán desvinculadas, ¿estás seguro?";
	ph_p_alc_02a = "Atención, ha seleccionado escribir en <em>'";
	ph_p_alc_02b = "'</em>, todos los datos anteriores en el archivo se sobrescribirán, ¿estás seguro?";
	ph_p_alc_03a = "Atención, los datos en la base de datos seleccionada, <em>'";
	ph_p_alc_03b = "'</em>,  serán sobrescritos por el contenido del archivo <em>'";
	ph_p_alc_03c = "'</em>, ¿está seguro?";
	ph_p_alc_04a = "Atención, ha seleccionado eliminar <em>'";
	ph_p_alc_04b = "'</em>, ¿está seguro?";
	ph_p_alc_05 = "Ha elegido eliminar la base de datos actualmente en uso, para hacerlo posible debe eliminarse desde la ventana inicial del programa, ¿desea reiniciar el programa para que sea posible eliminarlo?";
	ph_p_calc_tagfolder = "(POR FAVOR, ESPERE UN MOMENTO MIENTRAS SE AÑADEN LAS ETIQUETAS)...";
	ph_p_dato_tagfoldsub = "DESHACER (etiquetar carpeta y subelementos)";

} else if (language == 'FR') {

	ph_p_cantloaddrive = "(Cet appareil ne peut pas être chargé, sélectionnez une disponible.)";
	ph_p_localdisk_nbsp = "&nbsp;(disque local)";
	ph_p_localdisk = "disque local";
	ph_p_exterdisk = "disque externe";
	ph_p_copy = "COPIER";
	ph_p_move = "DÉPLACER";
	ph_p_alr_01 = "Le temps entre les images doit être supérieur à 0!. Temps non enregistré.";
	ph_p_alr_02 = "Étiquette Ajouté.";
	ph_p_alr_03 = "Vous devez sélectionner une forme pour l'étiquette.";
	ph_p_alr_04 = "Un certain texte est nécessaire pour la nouvelle étiquette.";
	ph_p_alr_05 = "Veuillez d'abord sélectionner une étiquette existante si vous souhaitez l'éditer.";
	ph_p_alr_06 = "Étiquette enregistré!. Mettre à jour la vue si nécessaire.";
	ph_p_alr_07 = "Étiquette supprimée!. Mettre à jour la vue si nécessaire.";
	ph_p_alr_08 = "Sélectionnez d'abord l'étiquette que vous souhaitez supprimer.";
	ph_p_alr_09 = "Le nom que vous avez choisi existe déjà, commencez par supprimer la base de données qui utilise ce nom si vous souhaitez l'utiliser."
	ph_p_alr_10 = "Vous devez d'abord entrer un nom pour la base de données.";
	ph_p_alr_11 = "Une boîte de dialogue de ouvrir fichier sera ouverte, vous pouvez soit sélectionner un fichier préexistant ou, par exemple, sous Windows créez un nouveau (bouton droit de la souris), faites attention, les données du fichier sélectionné seront écrasées.";
	ph_p_alr_12 = "'</em> écrit avec succès.";
	ph_p_alr_13 = "Une boîte de dialogue de ouvrir fichier sera ouverte, sélectionnez le fichier où la base de données est enregistrée, faites attention, les données dans la base de données sélectionnée seront écrasées par le contenu du fichier.";
	ph_p_alr_14 = "Données importées avec succès.";
	ph_p_alr_15a = "Il semble que <em>'";
	ph_p_alr_15b = "'</em> n'ont pas de format de données valide, sélectionnez un fichier de données valide.";
	ph_p_alr_16 = "Base de données supprimée avec succès.";
	ph_p_alr_17 = "Impossible de copier dans le répertoire racine... Sélectionnez un dossier de destination.";
	ph_p_alr_18 = "Impossible de déplacer dans le répertoire racine... Sélectionnez un dossier de destination.";
	ph_p_alc_01 = "Vous avez choisi de supprimer la balise sélectionnée, toutes les associations de cette balise seront dissociées, êtes-vous sûr?";
	ph_p_alc_02a = "Attention, vous avez choisi écrire dans <em>'";
	ph_p_alc_02b = "'</em>, toutes les données précédentes dans le fichier seront écrasées, êtes-vous sûr?";
	ph_p_alc_03a = "Attention, les données dans la base de données sélectionnée, <em>'";
	ph_p_alc_03b = "'</em>, seront écrasé par le contenu du fichier <em>'";
	ph_p_alc_03c = "'</em>, êtes-vous sûr?";
	ph_p_alc_04a = "Attention, vous avez choisi de supprimer <em>'";
	ph_p_alc_04b = "'</em>, êtes-vous sûr?";
	ph_p_alc_05 = "Vous avez choisi de supprimer la base de données actuellement utilisée, pour le rendre possible, il doit être supprimé sur la fenêtre initial du programme, voulez-vous redémarrer le programme pour permettre de le supprimer?";
	ph_p_calc_tagfolder = "(PLEASE, WAIT A MOMENT WHILE TAGS ARE ADDED)...";
	ph_p_dato_tagfoldsub = "DÉFAIRE (étiqueter dossier et sous-éléments)";

}


function popup (popupclass, data) {

	switch (popupclass) {

		case "addtagtosubelements":

			$("#popup").load( "popups/popup-tagfolder.html" );
			$("#popup").addClass("tagfolder");
			$("#popupbackground").addClass("display");
			$("#toppopupbackground", window.parent.document).addClass("display");
			break;

		case "newtag":

			$("#popup").load( "popups/popup-newtag.html" );
			$("#popup").addClass("newtag");
			$("#popupbackground").addClass("display");
			$("#toppopupbackground", window.parent.document).addClass("display");
			break;

		case "edittag":

			$("#popup").load( "popups/popup-edittag.html" );
			$("#popup").addClass("edittag");
			$("#popupbackground").addClass("display");
			$("#toppopupbackground", window.parent.document).addClass("display");
			break;

		case "options":

			$("#popup").load( "popups/popup-options.html" );
			$("#popup").addClass("options");
			$("#popupbackground").addClass("display");
			$("#toppopupbackground", window.parent.document).addClass("display");
			break;

		case "info":

			$("#popup").load( "popups/popup-info.html" );
			$("#popup").addClass("info");
			$("#popupbackground").addClass("display");
			$("#toppopupbackground", window.parent.document).addClass("display");
			break;

		case "selectfoldersearch":
			$("#popup").load( "popups/popup-selectfoldersearch.html" );
			$("#popup").addClass("selectfoldersearch");
			$("#popupbackground").addClass("display");
			$("#toppopupbackground", window.parent.document).addClass("display");
			break;

		case "selectfolderactionnotag":
			$("#popup").load( "popups/popup-selectfolderactionnotag.html" );
			$("#popup").addClass("selectfolderactionnotag");
			$("#popupbackground").addClass("display");
			$("#toppopupbackground", window.parent.document).addClass("display");
			break;

		case "selectfolderactiontag":
			$("#popup").load( "popups/popup-selectfolderactiontag.html" );
			$("#popup").addClass("selectfolderactiontag");
			$("#popupbackground").addClass("display");
			$("#toppopupbackground", window.parent.document).addClass("display");
			break;

		case "listchoose":

			$("#popup").load( "popups/popup-listchoose.html" );
			$("#popup").addClass("listchoose");
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

	if ($("#showtips").is(":checked")) {
		localStorage["mostrartips"] = "yes";

	} else {
		localStorage["mostrartips"] = "no";
	}

	// la opción del mostrar tooltips
	if ($("#showtooltips").is(":checked")) {	

		localStorage["showtooltips"] = "yes";
		window.top.showtooltips = true;

		window.top.loadTooltips();
		top.explorer.loadTooltips();
		top.searcher.loadTooltips();

	} else {

		localStorage["showtooltips"] = "no";
		window.top.showtooltips = false;

		window.top.loadTooltips();
		top.explorer.loadTooltips();
		top.searcher.loadTooltips();

	}

	// preguntar al etiquetar carpetas
	if($("#asktagsubelements").is(":checked")) {
		localStorage["asktagsubeleents"] = "no";
	} else {
		localStorage["asktagsubeleents"] = "yes";
	}

	if($("#asksearchforupdates").is(":checked")) {
		localStorage["searchforupdates"] = "yes";
	} else {
		localStorage["searchforupdates"] = "no";
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
		alert(ph_p_alr_01);

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
	$("#popup").removeClass("selectfoldersearch");
	$("#popup").removeClass("selectfolderactionnotag");
	$("#popup").removeClass("selectfolderactiontag");
	$("#popup").removeClass("listchoose");


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

					alertify.alert(ph_p_alr_02, function () {
					top.searcher.drawfootertags();
					top.explorer.drawfootertags();
					cerrar();
					});

				};
				request.onerror = function(event) { /* alert("Tag not added, tag already exists!"); */ };
			}

		}
		else {
			alertify.alert(ph_p_alr_03);
		}
	}
	else {
		alertify.alert(ph_p_alr_04);
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

				alertify.alert(ph_p_alr_05)
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

			alertify.alert(ph_p_alr_05);
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

						alertify.alert(ph_p_alr_06, function () {

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

		alertify.alert(ph_p_alr_05)

	}

}

function deletetag() { // borrar tag

	if (selectedtag != "") {

		alertify.confirm(ph_p_alc_01, function (e) {
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

							alertify.alert(ph_p_alr_07, function () {

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

		alertify.alert (ph_p_alr_08);
	}

}

// --fin Popup de editar borrar un tag


// desde Popup de añadir tag a subelementos de una carpeta

function addtagsubs(taganadir, ffoldertoaddtags) {

	var folderidtoaddtags = "";
	var flag1 = flag2 = 0;

	$(".undo", window.parent.document).attr("data-tooltip", ph_p_dato_tagfoldsub);
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

								// se cambian los tags del elemento del array de elementos (para no tener que recargar la carpeta si se cambia viewmode o order)
								$.each (directoryfolders, function(drf){										
									if (directoryfolders[drf].name  == bdirectoryfolders[i].name){
										directoryfolders[drf].tagsid = valueaponer[i];					
									}
								});
								//directoryfolders[i].tagsid = valueaponer[i]; //HABRA QUE METER UN EAVH Y EL QUE COINCIDA CARPET...

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
												if (treeelementtagsinview[i].children[u]){
													if (cursor2.value.tagid == treeelementtagsinview[i].children[u].getAttribute("value")) {

														var color = "#" + cursor2.value.tagcolor;
														var complecolor = hexToComplimentary(color);

														treeelementtagsinview[i].children[u].className += " verysmall " + cursor2.value.tagform;
														treeelementtagsinview[i].children[u].setAttribute("value", cursor2.value.tagid);
														treeelementtagsinview[i].children[u].setAttribute("style", "background-color: #" + cursor2.value.tagcolor + ";" + "color: " + complecolor + ";")
														treeelementtagsinview[i].children[u].innerHTML = cursor2.value.tagtext;

													}
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
												if(elementosdirectoriotags[i][n]){
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

								// se cambian los tags del elemento del array de elementos (para no tener que recargar la carpeta si se cambia viewmode o order)
								directoryarchives[i].tagsid = fvalueaponer[i];

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
											if (felementosdirectoriotags[i][n]){
												if (cursor2.value.tagid == felementosdirectoriotags[i][n].getAttribute("value")) {

													var color = "#" + cursor2.value.tagcolor;
													var complecolor = hexToComplimentary(color);

													felementosdirectoriotags[i][n].className += " small " + cursor2.value.tagform;
													felementosdirectoriotags[i][n].setAttribute("value", cursor2.value.tagid);
													felementosdirectoriotags[i][n].setAttribute("style", "background-color: #" + cursor2.value.tagcolor + ";" + "color: " + complecolor + ";")
													felementosdirectoriotags[i][n].innerHTML = cursor2.value.tagtext;

												}
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
		customAlert(ph_p_calc_tagfolder, msgtime);

		} //-- fin trans


	}

} // --fin function addtagsubs()

// --fin Popup añadir tags a subelementos


// para el Popup options
window.s = "";
window.listadofiltradodeDB = [];


function optionspreload() {

	var Sniffr = window.top.Sniffr;
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

			} else { // cuando haya llegado al último

				var currentlydatabaseused = localStorage["currentlydatabaseused"];

				$('#selecteddb').html(currentlydatabaseused);		

				if (s.os.name == "windows" || s.os.name == "macos") {
						 $('#selecteddrive').html(driveunit)
				}
				if (s.os.name == "linux") {

						 if(driveunit.length==0){
								$('#selecteddrive').html("/" + driveunit)

						 } else {
								$('#selecteddrive').html(driveunit)
						 }
				}		


				loaddatabaseselect();
				loaddriveslist();

				// el checkbox closeconfirmation
				if(localStorage["closeconfirmation"]=="no" || !localStorage["closeconfirmation"]) {
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
				// el checkbox previewimgonviewmode1 (y epubs)
				if(localStorage["previewimgonviewmode1"]=="yes") {
					$('#previewimgonviewmode1').prop('checked', true);
				} else {
					$('#previewimgonviewmode1').prop('checked', false);
				}
				

				if(localStorage["mostrartips"]=="yes") {
					$('#showtips').prop('checked', true);
				} else {
					$('#showtips').prop('checked', false);
				}


				if(localStorage["showtooltips"]=="yes") {
					$('#showtooltips').prop('checked', true);
				} else {
					$('#showtooltips').prop('checked', false);
				}


				if(localStorage["asktagsubeleents"]=="yes"){
					$('#asktagsubelements').prop('checked', false);
				} else {
					$('#asktagsubelements').prop('checked', true);
				}

				if(localStorage["searchforupdates"]=="yes"){
					$('#asksearchforupdates').prop('checked', true);
				} else {
					$('#asksearchforupdates').prop('checked', false);
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

						var drivelist = window.top.drivelist;
						var driveLetters = window.top.driveLetters;

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

						const username = window.top.username;

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
									tdesc += "<div value=' " + drives[i] + "' class='drivedesc'>" + ph_p_localdisk + "</div>";
								} else {
									t += "<option value='" + drives[i] + "'>/" + drives[i] + "</option>";
									tdesc += "<div value='" + drives[i] + "' class='drivedesc'>" + ph_p_exterdisk + "</div>";
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
							alertify.alert(ph_p_alr_09);
						}

					}
					else {
						alertify.alert(ph_p_alr_10);
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
								alertify.alert(ph_p_alr_09);
							}

						}
						else {
							alertify.alert(ph_p_alr_10);
						}

					};

				});


				$("#exportdata").on('click', function(){

					alertify.alert(ph_p_alr_11, function() {

						document.getElementById('toexportfile').value = ""; // esto es para que siempre funcione el on change

						document.getElementById('toexportfile').click();

						$('#toexportfile').off('change'); // para que no se acumulen event handlers (para que no se repita..)

						$('#toexportfile').on('change', function(evt) {	

							var file = evt.target.files["0"].path;

							// abrimos la bd seleccionada
							var request = window.indexedDB.open($('#selecteddb').html(), 1);
							request.onerror = function(event) {
								// console.log("error: database not loaded");
							};

							//aqui realizamos algunas operaciones previas con la bd porque luego si no puede dar fallos a la hora de escribir si está no se ha abierto nunca...
							request.onsuccess = function(event) {

								// var objectStore;
								var db = event.target.result;

								var idbExportImport = window.top.idbExportImport; // to save and load the contents of an IndexedDB database

								idbExportImport.exportToJsonString(db, function(err, jsonString) {
									if(err)
										console.error(err);
									else {

										// console.log("Exported as JSON: " + jsonString);
										alertify.confirm(ph_p_alc_02a + file + ph_p_alc_02b, function (e) {
											if (!e) {
												x = "You pressed Cancel!";
												console.log(x);
											} else {
												x = "You pressed OK!";
												console.log(x)
												// se escribe el fichero
												fs.writeFile(file, jsonString, function (err) {
													if (err) return console.log(err);
													alertify.alert("<em>'" + file + ph_p_alr_12);

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

						alertify.alert(ph_p_alr_13, function () {

							document.getElementById('toinportfile').value = ""; // esto es para que siempre funcione el on change

							document.getElementById('toinportfile').click()

							$('#toinportfile').off('change'); // para que no se acumulen event handlers (para que no se repita..);

							$('#toinportfile').on('change', function(evt) {

								var file = evt.target.files["0"].path;

								fs.readFile(file, 'utf8', function (err,data) {
									if (err) {
										return console.log(err);
									}

									try {
										// se comprueba si es json
										JSON.parse(data);
										// console.log("is JSON");

										// y continua
										alertify.confirm(ph_p_alc_03a + $('#selecteddb').html() + ph_p_alc_03b + file + ph_p_alc_03c, function (e) {
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

													var idbExportImport = window.top.idbExportImport; // to save and load the contents of an IndexedDB database
													// se vaciá y después se escribe en la base de datos
													idbExportImport.clearDatabase(tooverwritedb, function(err) {

														if(err) {
															console.log(err)
														} else {
															console.log("data cleared");

															idbExportImport.importFromJsonString(tooverwritedb, data, function(err2) { }); // no meto el código dentro porque desafortunadamente no funciona. Sigue el código a continuación y doy por hecho que ha escrito bien.

															alertify.alert(ph_p_alr_14, function(){

																// si es el database actualmente en uso recarga tagstoo
																if ($('#selecteddb').html() == localStorage["currentlydatabaseused"]) {
																	setTimeout(function(){
																		saveoptions();
																		cerrar();
																		restarttagstoo();
																	}, 1000);

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
										alertify.alert(ph_p_alr_15a + file + ph_p_alr_15b, function () {
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

					alertify.confirm(ph_p_alc_04a +$('#selecteddb').html()+ ph_p_alc_04b, function (e) {
						if (!e) {
							x = "You pressed Cancel!";
							console.log(x);
						} else {
							x = "You pressed OK!";
							console.log(x)

							// comprobación de si se borra la bd actual para salir de una manera o otra (recargando inicio o no)
							if (localStorage["currentlydatabaseused"] == $('#selecteddb').html()) {

								alertify.confirm(ph_p_alc_05, function (e) {
									if (!e) {
										x = "You pressed Cancel!";
										console.log(x);
									} else {
										x = "You pressed OK!";
										console.log(x)

										// Se relanza la aplicación
										var remote = window.top.remote;
										remote.app.relaunch();
										remote.app.exit(0);

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
									alertify.alert(ph_p_alr_16, function () {

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

				// un ajuste de estilo porque sino queda demasiado espacio hueco en la versión en ingles para windows
				if (s.os.name == "windows") {
					if (language == 'EN') {
						$('#databaseselect').css("max-width","29%");
				

					}
				}

			} //-fin else cursor (cuando ha llegado al último en la carga de bds)

		};      	

	};

} // --fin optionspreload()

function loaddatabaseselect() {

	// console.log(listadofiltradodeDB)

	$("#databaseselect").find('option').remove().end(); // con esto se vacían las opciones del select para volver a llenarlo con las lineas de abajo

	$.each(listadofiltradodeDB, function(i){

		var opt = document.getElementById("databaseselect");
		var option = document.createElement("option");
		option.value = listadofiltradodeDB[i];
		var optionText = document.createTextNode(option.value);
		option.appendChild(optionText);
		opt.appendChild(option);

		opt.selectedIndex = -1; // para que ninguna este por defecto seleccionada

	})

}

function loaddriveslist() { //se utiliza tanto por el popup de folder a buscar como los de folder destino selectfolderactionnotagpreload() y selectfolderactiontagpreload()

	if (s.os.name == "windows") {

		var availabledrives=[];
		var drivelist = window.top.drivelist;
		var driveLetters = window.top.driveLetters;

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
				$("#drivedesc").html(ph_p_cantloaddrive)
			}

			$("#drivedesc").css("display","inline-block");

		});

	}

	if (s.os.name == "linux") {

		drives = [""];

		// Detectar y añadir unidades externas a la lista

		const username = window.top.username;

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
				console.log(drives[i].length)
				if (drives[i].length == 0){
					t += "<option value=' " + drives[i] + "'>/" + drives[i] + "</option>";
					tdesc += "<div value=' " + drives[i] + "' class='drivedesc'>" + ph_p_localdisk + "</div>";
				} else {
					t += "<option value='" + drives[i] + "'>/" + drives[i] + "</option>";
					tdesc += "<div value='" + drives[i] + "' class='drivedesc'>" + ph_p_exterdisk + "</div>";

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
				if ($("#selecteddrive")[0].innerText == "/") { //para que ponga local disk cuando lanza el popup si esta en /
					$("#drivedesc").html(ph_p_localdisk_nbsp);
				}

			});

			$("#drivedesc").css("display","inline-block");

		});

	}
	if (s.os.name == "macos") {

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

	if (s.os.name != "macos") {
		window.top.reloadwin();
	} else {
		alertify.alert("Due to technical difficulties is not possible in macOS to load/start a database from the options menu, please if you want to start another database reinitialize Tagstoo and load it in the 'Initial Database Options' window.");
	}

	
};


function infopreload() {

	$("#showhelp").on('click', function(){

		if (language == "EN") {
			$("#infoiframe").attr("src", "popups/popup-info-help_en.html");
		} else if (language == "ES") {
			$("#infoiframe").attr("src", "popups/popup-info-help_es.html");			
		} else if (language == "FR") {
			$("#infoiframe").attr("src", "popups/popup-info-help_fr.html");
		}

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

	if (mostrartipnumero == 10) { // el tip final
		mostrartipnumero = 0;
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



/* seleccionar folder para busqueda en el Search */

window.newselectedFolder = "";

function selectfoldersearchpreload(){

	window.colortagstoo = localStorage["colortagstoo"];
	// if (colortagstoo == "not") {
	// 	var ls = document.createElement('link');
 //        ls.rel="stylesheet";
 //        ls.href= "css/version_grey.css";
 //        $('head')[0].appendChild(ls);
	// } else {
	// 	$('link[rel=stylesheet][href~="css/version_grey.css"]').remove();
	// 	// window.$('link[rel=stylesheet][href~="css/version_grey.css"]').remove();
	// }


	window.driveunit = localStorage["selecteddriveunit"];
	var treedirecorytolist = driveunit + "\/"; //ESTO CREO QUE SOLO ES EN CASO DE WINDOWS mirar https://github.com/resin-io-modules/drivelist
	var carpetas = treedirecorytolist;
	var newrefresh="no";

	var Sniffr = window.top.Sniffr;
	var agent = navigator.userAgent;
	window.s = "";
	s = new Sniffr();
	s.sniff(agent);

	$("#searchin")["0"].children["0"].innerHTML = $("#searchin")["0"].parentNode.parentNode.children[3].children["0"].children[2].children["0"].innerText

	window.newselectedFolder = window.selectedFolder


	if(jQuery) (function ($){

		// el conector transformado en una función, solo se utilizan los folders pero es la misma función de lectura de elementos que la utilizada en el directoryview
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
					var tarorfo = fs.readdirSync(tdirtoreadcheck);
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
								// $(this).removeClass("selected")
							} else {
								$("#filetree ul li span").removeClass("selected")
								$(this).addClass("selected")

								$("#searchin")["0"].children["0"].innerHTML = selectedDriveUnit + $(this)["0"].attributes[1].value;
								window.newselectedFolder = $(this)["0"].attributes[1].value;					 	

							}

						});

					}

					// Loading message
					$(this).html('<ul class="jqueryFileTree start"><li class="wait">' + o.loadMessage + '<li></ul>');
					// Get the initial file list
					showTree( $(this), escape(o.root) );

				}); // --fin each


				// para quitar la carpeta "Document and Setings" si la creara pues no es capaz de abrir desde aquí
				var recorrercarpetas = $("#filetree li span")
				$.each(recorrercarpetas, function(i) {

					if (recorrercarpetas[i].attributes["1"].value == "\/Documents and Settings" ) {
						recorrercarpetas[i].parentElement.style.display = "none";
					}

				});

			}

		});


		$('#filetree').fileTree();
		if (colortagstoo == "not") {
			$('#filetree').css("filter","grayscale(85%) brightness(109%)")
		} else {
			$('#filetree').css("filter", "none")
		}

	})(jQuery);
}

function acceptsearchfolder(e) {

	window.selectedFolder = window.newselectedFolder;

	$(e)["0"].parentNode.parentNode.children[3].children["0"].children[2].children["0"].innerHTML = $("#searchin")["0"].children["0"].innerHTML;
}

function choseroot() { // para el popup de seleccionar carpeta busqueda del Search

	var Sniffr = window.top.Sniffr;
	var agent = navigator.userAgent;
	var s = new Sniffr();
	s.sniff(agent);

	if (s.os.name == "windows") {

		$("#searchin")["0"].children["0"].innerHTML = driveunit
		window.newselectedFolder = "/";
	} else {

		if (driveunit != "") {
			$("#searchin")["0"].children["0"].innerHTML = driveunit
		}
		else {
			$("#searchin")["0"].children["0"].innerHTML = "/"
		}
		window.newselectedFolder = "/";
	}

	$("#filetree span").removeClass("selected")
}

/* -- fin seleccionar folder para busqueda en el Search */

/* popup seleccionar carpeta destino tag y no tag */

	/* destino no tag */

window.carpetas = ""
window.treedirecorytolist = "";
window.destinationdrive = "";
window.rootdeselected = false;

function selectfolderactionnotagpreload(){

	rootdeselected = false;
	loaddriveslist(); /* definida arriba */

	driveunit = localStorage["selecteddriveunit"];
	window.colortagstoo = localStorage["colortagstoo"];
	window.treedirecorytolist = driveunit + "\/"; //ESTO CREO QUE SOLO ES EN CASO DE WINDOWS mirar https://github.com/	resin-io-modules/drivelist
	window.carpetas = treedirecorytolist;

	if (driveunit) {

		if (s.os.name == "windows" || s.os.name == "macos") {
			$('#selecteddrive').html(driveunit)
		}
		if (s.os.name == "linux") {
			if(driveunit == ""){
				$('#selecteddrive').html("/" + driveunit)
			} else {
				$('#selecteddrive').html(driveunit)
			}
		}

	}

	var Sniffr = window.top.Sniffr;
	var agent = navigator.userAgent;
	window.s = "";
	s = new Sniffr();
	s.sniff(agent);

	if (window.parent.pasteaction == "copy") {
		$("#acceptdestination").html(ph_p_copy)
	} else {
		$("#acceptdestination").html(ph_p_move)
	}

	$("#selectedfolder")["0"].children["0"].innerHTML = treedirecorytolist;

	destinationdrive = driveunit;

	showdrivefolders() /* definido abajo */

	$("#unitselect").change(function() {

		rootdeselected = false;

		if (s.os.name == "windows") {

		 var availabledrives=[];

		 $('#selecteddrive').html($("#unitselect").val());

			var drivelist = window.top.drivelist;
			var driveLetters = window.top.driveLetters;

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

			if ($("#unitselect").val() != "") {
				$('#selecteddrive').html( "/" + $("#unitselect").val() );
			} else {
				$('#selecteddrive').html("/")
			}

			drives = [""];

			// Detectar y añadir unidades externas a la lista

			const username = window.top.username;

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
						tdesc += "<div value=' " + drives[i] + "' class='drivedesc'>" + ph_p_localdisk + "</div>";
					} else {
						t += "<option value='" + drives[i] + "'>/" + drives[i] + "</option>";
						tdesc += "<div value='" + drives[i] + "' class='drivedesc'>" + ph_p_exterdisk + "</div>";
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

		destinationdrive = $("#selecteddrive").html().trim();

		if (destinationdrive != "/") {
			window.treedirecorytolist = destinationdrive + "\/"; //ESTO CREO QUE SOLO ES EN CASO DE WINDOWS mirar https://github.com/resin-io-modules/drivelist
		} else {
			window.treedirecorytolist = destinationdrive;
		}

		window.carpetas = treedirecorytolist;
		$("#selectedfolder")["0"].children["0"].innerHTML = treedirecorytolist

		showdrivefolders(); /* definido abajo */

	});

	$("#acceptdestination").on("click", function(){
		if (rootdeselected) {
			selectedactionfolder($("#selectedfolder")["0"].children["0"].innerHTML, destinationdrive.trim());
			cerrar();
		} else {
			if (window.parent.pasteaction == "copy"){
				alertify.alert(ph_p_alr_17);
			} else {
				alertify.alert(ph_p_alr_18);

			}
		}
	});

}
/* --fin selectfolderactionnotagpreload() */

function showdrivefolders(){ /* usado tanto por selectfolderactionnotagpreload() (arriba) como por selectfolderactiontagpreload() (abajo) */

	var newrefresh="no";

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
					var tarorfo = fs.readdirSync(tdirtoreadcheck);
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


									// filetreeinteractions(); // activar interacciones para cada uno de los spans añadidos

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
								// $(this).removeClass("selected")
							} else {
								$("#filetree ul li span").removeClass("selected")
								$(this).addClass("selected")
								rootdeselected = true;

								$("#selectedfolder")["0"].children["0"].innerHTML = destinationdrive + $(this)["0"].attributes[1].value;
							}

						});

					}

					// Loading message
					$(this).html('<ul class="jqueryFileTree start"><li class="wait">' + o.loadMessage + '<li></ul>');
					// Get the initial file list
					showTree( $(this), escape(o.root) );

				}); // --fin each


				// para quitar la carpeta "Document and Setings" si la creara pues no es capaz de abrir desde aquí
				var recorrercarpetas = $("#filetree li span")
				$.each(recorrercarpetas, function(i) {

					if (recorrercarpetas[i].attributes["1"].value == "\/Documents and Settings" ) {
						recorrercarpetas[i].parentElement.style.display = "none";
					}

				});

			}

		});


	})(jQuery);

	$('#filetree').html("");
	$('#filetree').fileTree();
	if (colortagstoo == "not") {
		$('#filetree').css("filter","grayscale(85%) brightness(109%)")
	} else {
		$('#filetree').css("filter", "none")
	}

} /* --fin showdrivefolders() */


/* para el popup folder destino con tags */
function selectfolderactiontagpreload(){

	rootdeselected = false;

	window.driveunit = localStorage["selecteddriveunit"];
	window.colortagstoo = localStorage["colortagstoo"];
	window.treedirecorytolist = driveunit + "\/"; //ESTO CREO QUE SOLO ES EN CASO DE WINDOWS mirar https://github.com/	resin-io-modules/drivelist
	window.carpetas = treedirecorytolist;

	if (driveunit) {

		if (s.os.name == "windows" || s.os.name == "macos") {
			$('#selecteddrive').html(driveunit)
		}
		if (s.os.name == "linux") {
			if(driveunit == ""){
				$('#selecteddrive').html("/" + driveunit)
			} else {
				$('#selecteddrive').html(driveunit)
			}

		}

	}

	var Sniffr = window.top.Sniffr;
	var agent = navigator.userAgent;
	window.s = "";
	s = new Sniffr();
	s.sniff(agent);

	if (window.parent.pasteaction == "copy") {
		$("#acceptdestination").html(ph_p_copy)
	} else {
		$("#acceptdestination").html(ph_p_move)
	}

	$("#selectedfolder")["0"].children["0"].innerHTML = treedirecorytolist;

	destinationdrive = driveunit;

	showdrivefolders();

	$("#acceptdestination").on("click", function(){
		if (rootdeselected) {
			selectedactionfolder($("#selectedfolder")["0"].children["0"].innerHTML, destinationdrive.trim());
			cerrar();
		} else {
			if (window.parent.pasteaction == "copy"){
				alertify.alert(ph_p_alr_17);
			} else {
				alertify.alert(ph_p_alr_18);

			}
		}
	})

} /* --fin selectfolderactiontagpreload() */


/* storetoprinview */

function storetoprintview() {

	// se cargan todas las imagenes (incluidas las que todavia estavan ocultas)
	if ((searchviewmode != 1) || (searchviewmode == 1 && localStorage["previewimgonviewmode1"]=="yes")){
		$.each($("#searchdirectoryview .archive img"), function(n){

			var element = $( "#searchdirectoryview .archive img:eq( "+ n +" )" );

			if (element["0"].attributes[1]){ // si contiene data-src (es decir si el archivo es una imagen)
				var img_data_src = element["0"].attributes[1].value;
				element["0"].setAttribute("src", img_data_src);

				// varios estilos: quitar fondo, etc.. en tras cada imagen cargada
				element.parent().parent().css("background","none"); // quita el icono de imagen
				element.parent().parent().css("display","inline-block");
				element.parent().parent().css("padding-right","0px");

				element.css("padding-right", "1px");

				// esto es para centrar verticalmente la imagen
				var toaddpaddingtop = (16 - element.height()) / 2;
				if (toaddpaddingtop > 0) {
					element.css("padding-top", toaddpaddingtop+"px")
				}
				if (toaddpaddingtop == 7.5 || toaddpaddingtop <= 0) {
					element.css("vertical-align", "middle");
					element.css("margin-top", "-3px");
				}
			}
		})
	}

	// se cargan todos los videos (incluidos los que estaban ocultos)
	if (searchviewmode != 1) {

		$.each($("#searchdirectoryview .archive video"), function(n){

			var element = $( "#searchdirectoryview .archive video:eq( "+ n +" )" );
			var img_data_src = element["0"].attributes[2].value;
			
			if (element["0"].attributes[3].value == "") {
				element["0"].setAttribute("src", img_data_src);
			}

		});

	}


	var listdata = toJSON($("#searchdirectoryview")[0]); //funcion definida en dom-to-json.js
	listdata = JSON.stringify(listdata);
	localStorage["toprintfriendlist"] = listdata;

	localStorage["searchviewmode"] = searchviewmode;

	
}
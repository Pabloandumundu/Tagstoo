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


// Los modulos de node que se utilizarán en los iframes se cargan aquí pues no se puede accceder
// a la función require desde estos.
window.fs = require('fs-extra'); // utilizado en main.js, searcher.js, undoactions.js
window.Sniffr = require("sniffr"); // utilizado en main.js, searcher.js, jqueryFileTree.js
window.AdmZip = require('adm-zip'); // utilizado en main.js, searcher.js
window.exec = require("child_process"); // utilizado en main.js, searcher.js
window.drivelist = require('drivelist'); // utilizado en popups.js
window.driveLetters = require('windows-drive-letters'); // utilizado en popups.js
window.username = require('username'); // utilizado en popups.js
window.idbExportImport = require("indexeddb-export-import"); // utilizado en popups.js
window.shell = require('electron').shell;
window.remote = require('electron').remote; // utilizado en popups.js
window.CurrentWindow = require('electron').remote.getCurrentWindow(); // utilizado en main.js, searcher.js

//window.rec_jquery = require("jquery"); // utilizado en jquery.tinycolorpicker.js


$(document).ready(function () { 

    language = localStorage["language"];

    if (language == 'EN') {
        $(".lang_en").css("display", "inline-block");
        $(".lang_es").css("display", "none");
        $(".lang_fr").css("display", "none");
        //para el cut/copy
        $(".onoffswitch-inner").removeClass("l_es");
        $(".onoffswitch-inner").removeClass("l_fr");

    } else if (language =='ES') {
        $(".lang_en").css("display", "none");
        $(".lang_es").css("display", "inline-block");
        $(".lang_fr").css("display", "none");
        // logotipo
        $("#logotipo").css("left", "29px");       
        //para el cut/copy
        $(".onoffswitch-inner").addClass("l_es");
        $(".onoffswitch-inner").removeClass("l_fr");

    } else if (language =='FR') {
        $(".lang_en").css("display", "none");
        $(".lang_es").css("display", "none");
        $(".lang_fr").css("display", "inline-block");
        // logotipo
        $("#logotipo").css("left", "35px");        
        //para el cut/copy
        $(".onoffswitch-inner").removeClass("l_es");
        $(".onoffswitch-inner").addClass("l_fr");

    }


    // variable que dice si mostrar o no los tooltips (en toda la aplicación)    
    if (localStorage["showtooltips"] == "yes"){
        window.showtooltips = true;
    } else if (localStorage["showtooltips"] == "no"){
        window.showtooltips = false;
    }


    window.pasteaction = "copy";

    // seleccion de las pestañas Explore/Search
	$('ul.tabs li').click(function(){

		var tab_id = $(this).attr('data-tab');
		$('ul.tabs li').removeClass('current');
		$('.tab-content').removeClass('current');
		$(this).addClass('current');
		$("#"+tab_id).addClass('current');

        //para que no se quede a veces la imagen del tooltip congelada al cambiar entre exploreo/searcher
        $("#exploretab").tooltip( "destroy" ); 
        $("#searchtab").tooltip( "destroy" );

        loadTooltips(); // porque no son los mismos tips en el explorer que en el searcher

        var tabseleccionado = $(".current").attr("id");
        if (tabseleccionado == "exploretab") {
            explorer.focus();
        } else if (tabseleccionado == "searchtab") {
            searcher.focus();
        }

	});    


    // Estilos un poco más ajustados para pantallas estrechas
    if ($(window).width() < 1313) {
        $(".undo").removeClass("tooltip-right");
        $(".undo").addClass("tooltip-left")

    }
    $( window ).resize(function() {

        if ($(window).width() < 1313) {
            $(".undo").removeClass("tooltip-right");
            $(".undo").addClass("tooltip-left");
        } else {
            $(".undo").removeClass("tooltip-left");
            $(".undo").addClass("tooltip-right");
        }

        if ($(window).width() < 1267) {
            $(".undo").removeClass("tooltip-left");
            $(".undo").addClass("tooltip-right");
        }

    });    
	

    // para panel de desarrolo //////////\\\\\\\\\\
    $('#explorer').load(function(){ // cuando se carga el iframe explorador

        // panel de desarrollo
        $( "#panelon" ).click(function() {
            $("#explorer").contents().find("#panel").addClass("show");

        });        

    });


    // conmutador paste-copy
    var pasteaction = "copy";
    $('#myonoffswitch').on('click', function(){

        if (pasteaction == "copy") {
            pasteaction = "cut";
        } else {
            pasteaction = "copy";
        }

        var tabseleccionado = $(".current").attr("id");
        if (tabseleccionado == "exploretab") {
            explorer.focus();
        } else if (tabseleccionado == "searchtab") {
            searcher.focus();
        }

    });

    $(".onoffswitch-inner, .onoffswitch-switch").bind('click', function() {

        if(pasteaction == "copy") {

            window.pasteaction = "cut";
            $(".onoffswitch-checkbox").addClass("check");
            $(".onoffswitch-switch").css("background-color","#d5695d"); //red

        } else if (pasteaction == "cut") {

            window.pasteaction = "copy";
            $(".onoffswitch-checkbox").removeClass("check");
            $(".onoffswitch-switch").css("background-color","#439bd6"); //blue

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


    // frases tooltips
    loadTooltips();   

});


// frases tooltips
function loadTooltips() {

    if (language == "EN") {

        ph_tt_01 = "View the explorer section.";
        ph_tt_02 = "View the searcher section.";
        if ($("#exploretab").hasClass("current")){ // cuando está seleccionado el explorador
            ph_tt_03 = "Paste selected elements from the directory view on the right into selected folder (the double-clicked one) on to the treeview on the left, alternatively you can drag and drop the elements into any folder.";
            ph_tt_04 = "Switch between 'Copy' and 'Cut'; depending on what is selected, when you paste selected elements into selected folder or you drag and drop elements into any folder those elements will be copied or will be moved, and their correspondent tags, if they have, will be copied/moved also.";
            ph_tt_05 = "Delete the selected elements in the directory view.";
        } else { // cuando está seleccionado el buscador
            ph_tt_03 = "Paste selected elements from the search results into a directory that you will be prompted to select, first you will be able to choose if you want to paste the tags associated to the elements too or not.";
            ph_tt_04 = "Switch between 'Copy' and 'Cut'; depending on what is selected, when you paste selected elements into a folder that you will be able choose those selected elements will be moved or will be copied.";
            ph_tt_05 = "Delete the selected searched elements.";
        }
        ph_tt_06 = "Select between previously added fast access to folders.";
        ph_tt_07 = "Remove folder selected in the 'fast access to folders' list from the list.";
        ph_tt_08 = "Open the folder selected in the 'fast access to folders' list in the directory view.";
        ph_tt_09 = "Select viewmode for the directory view; in viewmode 1 elements are displayed in a list, in viewmodes 2-9 elements are displayed as cards of consecutive incremental size.";
        ph_tt_10 = "Select order by which elements will be represented in the directory view; it's possible to choose to order by name, extension, size, last modified date and in a aleatory way.";
        ph_tt_11 = "Undo previously performed action, there are possible to undo tagging operations and the filesystem's rename, copy and move elements operations, but it's not possible to undo deleting operations.";
        ph_tt_12 = "Open the database management and options menu.";
        ph_tt_13 = "Open the help and product info window.";

    } else if (language == "ES"){

        ph_tt_01 = "Ver la sección del explorador.";
        ph_tt_02 = "Ver la sección del buscador.";
        if ($("#exploretab").hasClass("current")){ // cuando está seleccionado el explorador
            ph_tt_03 = "Pegar los elementos seleccionados de la vista de directorio a la derecha en la carpeta seleccionada (en la se ha hecho doble clic) en la vista de árbol de la izquierda, alternativamente puede arrastrar y soltar los elementos en cualquier carpeta.";
            ph_tt_04 = "Cambiar entre 'Copiar' y 'Cortar'; dependiendo de lo que se seleccione, cuando pegue los elementos seleccionados en la carpeta seleccionada o arrastre y suelte elementos en cualquier carpeta, dichos elementos se copiarán o se moverán, y sus etiquetas correspondientes, si las tienen, también se copiarán/moverán.";
            ph_tt_05 = "Eliminar los elementos seleccionados en la vista de directorio.";
        } else { // cuando está seleccionado el buscador
            ph_tt_03 = "Pegar los elementos seleccionados de los resultados de la búsqueda en un directorio que se le pedirá que seleccione, primero podrá elegir si desea pegar también las etiquetas asociadas a los elementos o no.";
            ph_tt_04 = "Cambiar entre 'Copiar' y 'Cortar'; según lo que se seleccione, al pegar los elementos seleccionados en una carpeta que podrá elegir, esos elementos seleccionados se moverán o se copiarán.";
            ph_tt_05 = "Eliminar los elementos buscados seleccionados.";
        }
        ph_tt_06 = "Seleccionar entre los accesos rápidos a carpetas previamente añadidos.";
        ph_tt_07 = "Borrar de la lista de 'acceso rápido a carpetas' el acceso rápido seleccionado."
        ph_tt_08 = "Abrir la carpeta seleccionada en la lista de 'acceso rápido a carpetas' en la vista de directorio.";
        ph_tt_09 = "Seleccionar modo de vista para la vista de directorio; en el modo de vista 1 los elementos se muestran en una lista, en los modos de vista 2-9 los elementos se muestran como tarjetas de tamaño incremental consecutivo.";
        ph_tt_10 = "Seleccionar el orden por el cual los elementos serán representados en la vista de directorio; es posible elegir ordenar por nombre, extensión, tamaño, fecha de última modificación y de forma aleatoria.";
        ph_tt_11 = "Deshacer la acción realizada anteriormente, es posible deshacer las operaciones de etiquetado y las operaciones del sistema de archivos de cambiar el nombre, copiar y mover elementos, sin embargo no es posible deshacer las operaciones de eliminación.";
        ph_tt_12 = "Abrir el menú de gestión de las base de datos y opciones.";
        ph_tt_13 = "Abrir la ventana de ayuda e información del producto.";           

    } else if (language == "FR") {

        ph_tt_01 = "Voir la section de l'explorateur.";
        ph_tt_02 = "Voir la section de l'chercher.";
        if ($("#exploretab").hasClass("current")){ // cuando está seleccionado el explorador
            ph_tt_03 = "Collez les éléments sélectionnés de la vue du dossier à droite dans le dossier sélectionné (celui sur lequel vous avez double-cliqué) sur le côté gauche. Vous pouvez également faire glisser les éléments dans n'importe quel dossier.";
            ph_tt_04 = "Basculer entre «Copier» et «Couper»; en fonction de ce qui est sélectionné, lorsque vous collez des éléments sélectionnés dans le dossier sélectionné ou que vous faites glisser des éléments dans un dossier, ces éléments seront copiés ou seront déplacés et leurs balises correspondantes, le cas échéant, seront également copiées / déplacées.";
            ph_tt_05 = "Supprimez les éléments sélectionnés dans la vue du dossier.";
        } else { // cuando está seleccionado el buscador
            ph_tt_03 = "Collez les éléments sélectionnés dans les résultats de la recherche dans un répertoire que vous serez invité à sélectionner, tout d’abord vous pourrez choisir si vous souhaitez ou non coller les balises associées aux éléments.";
            ph_tt_04 = "Basculer entre «Copier» et «Couper»; En fonction de ce qui est sélectionné, lorsque vous collez des éléments sélectionnés dans un dossier que vous pourrez choisir, ces éléments seront déplacés ou copiés.";
            ph_tt_05 = "Supprimer les éléments recherchés sélectionnés.";
        }
        ph_tt_06 = "Sélectionnez entre l'accès rapide aux dossiers précédemment ajouté.";
        ph_tt_07 = "Supprimer le dossier sélectionné dans la liste «Accès rapide aux dossiers» de la liste.";
        ph_tt_08 = "Ouvrez le dossier sélectionné dans la liste «Accès rapide aux dossiers» de la vue du dossier.";
        ph_tt_09 = "Sélectionner vue mode pour la vue du répertoire; dans vue mode 1 les éléments sont affichés dans une liste, dans les vue modes 2 à 9 les éléments sont affichés sous forme de cartes de taille incrémentielle consécutive.";
        ph_tt_10 = "Sélectionner l'ordre par lequel les éléments seront représentés dans la vue du dossier; il est possible de choisir de commander par nom, extension, taille, date de dernière modification et de manière aléatoire.";
        ph_tt_11 = "Annuler l'action effectuée précédemment, il est possible d'annuler les opérations de étiqueter et les opérations du système de fichiers de renommer, copier et déplacer les éléments , mais il n'est pas possible d'annuler les opérations de suppression.";
        ph_tt_12 = "Ouvrez le menu de gestion de base de données et options.";
        ph_tt_13 = "Ouvrez la fenêtre d'aide et d'informations sur le produit.";

    }

    
    // tooltips
    $("#exploretab").attr("title", "");
    $("#exploretab").tooltip({
        disabled: !window.showtooltips,
        show: {delay: 800},
        content: ph_tt_01,
        position: {
            my: "right bottom", 
            at: "right-95"
        }
    });
    $("#searchtab").attr("title", "");
    $("#searchtab").tooltip({
        disabled: !window.showtooltips,
        show: {delay: 800},
        content: ph_tt_02,
        position: {
            my: "right bottom", 
            at: "right-90"
        }
    });
    $("#paste").attr("title", "");
    $("#paste").tooltip({
        disabled: !window.showtooltips,
        show: {delay: 800},
        content: ph_tt_03,
        position: {
            my: "right bottom", 
            at: "right-67"
        }
    });
    $("#pasteaction").attr("title", "");
    $("#pasteaction").tooltip({
        disabled: !window.showtooltips,
        show: {delay: 800},
        content: ph_tt_04,
        position: {
            my: "right bottom", 
            at: "right-90"
        }
    });
    if ($("#exploretab").hasClass("current")){
        $("#deletebutton").attr("title", "");
        $("#deletebutton").tooltip({
            disabled: !window.showtooltips,
            show: {delay: 800},
            content: ph_tt_05,
            position: {
                my: "right bottom", 
                at: "right+295"
            }
        });
    } else {
        $("#deletebutton").attr("title", "");
        $("#deletebutton").tooltip({
            disabled: !window.showtooltips,
            show: {delay: 800},
            content: ph_tt_05,
            position: {
                my: "right bottom", 
                at: "right+250"
            }
        });
    }
    $("#favfolders").attr("title", "");
    $("#favfolders").tooltip({
        disabled: !window.showtooltips,
        show: {delay: 800},
        content: ph_tt_06,
        position: {
            my: "right", 
            at: "right+330"
        }
    });
    $("#removefolderselect").attr("title", "");
    $("#removefolderselect").tooltip({
        disabled: !window.showtooltips,
        show: {delay: 800},
        content: ph_tt_07,
        position: {
            my: "left bottom", 
            at: "left-325"
        }
    });
    $("#gotofolderselect").attr("title", "");
    $("#gotofolderselect").tooltip({
        disabled: !window.showtooltips,
        show: {delay: 800},
        content: ph_tt_08,
        position: {
            my: "left", 
            at: "left-325"
        }
    });
    $("#viewmode").attr("title", "");
    $("#viewmode").tooltip({
        disabled: !window.showtooltips,
        show: {delay: 800},
        content: ph_tt_09,
        position: {
            my: "left bottom", 
            at: "left-325"
        }
    });
    $(".order").attr("title", "");
    $(".order").tooltip({
        disabled: !window.showtooltips,
        show: {delay: 800},
        content: ph_tt_10,
        position: {
            my: "left bottom", 
            at: "left-325"
        }
    });
    if (language == "EN") {
        $(".undo").attr("title", "");
        $(".undo").tooltip({
            disabled: !window.showtooltips,
            show: {delay: 800},
            content: ph_tt_11,
            position: {
                my: "bottom", 
                at: "bottom+87"
            }
        });
    } else {
        $(".undo").attr("title", "");
        $(".undo").tooltip({
            disabled: !window.showtooltips,
            show: {delay: 800},
            content: ph_tt_11,
            position: {
                my: "bottom", 
                at: "bottom+100"
            }
        });
    }
    $("#options").attr("title", "");
    $("#options").tooltip({
        disabled: !window.showtooltips,
        show: {delay: 800},
        content: ph_tt_12,
        position: {
            my: "left top", 
            at: "left-315"
        }
    });
    if (language == "EN") {
        $("#info").attr("title", "");
        $("#info").tooltip({
            disabled: !window.showtooltips,
            show: {delay: 800},
            content: ph_tt_13,
            position: {
                my: "left top", 
                at: "left-240"
            }
        });
    } else {
        $("#info").attr("title", "");
        $("#info").tooltip({
            disabled: !window.showtooltips,
            show: {delay: 800},
            content: ph_tt_13,
            position: {
                my: "bottom", 
                at: "bottom+40"
            }
        });
    }

}


// para recargar página, se llama desde popups.js
function reloadwin() {

    const {BrowserWindow} = require('electron').remote;
    var electron = require('electron');
    const path = require('path');
    const url = require('url');
    var CurrentWindow = electron.remote.getCurrentWindow();

    if(CurrentWindow.isMaximized()) {
        var posx=0;
        var posy=0;
        var isshow=false;
    } else {
        var posx=CurrentWindow.getPosition()[0];
        var posy=CurrentWindow.getPosition()[1];
        var isshow=true;
    }


    $('#mainbody').fadeOut(335, function() {   
     
        win = new BrowserWindow({
            width: CurrentWindow.getSize()[0],
            height: CurrentWindow.getSize()[1],
            x: posx,
            y: posy,        
            closable: true,
            resizable: true,
            show: isshow,
            icon: "img/logo-t-120.png",
            webPreferences: {
              nodeIntegration: true
            }
        })

        win.setMenu(null);

        if(CurrentWindow.isMaximized()) {
            win.maximize();
        } else {

        }
        // y carga el index.html
        win.loadURL(url.format({
            pathname: path.join(__dirname, 'main.html'),
            protocol: 'file:',
            slashes: true
        }))

        // abre las herramientas de desarrollador
        // win.webContents.openDevTools({mode: 'detach'})        
      
        // se cierra ventana inicial
        CurrentWindow.destroy();
        
    });

}
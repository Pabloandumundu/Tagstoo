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

    window.pasteaction = "copy";

    // seleccion de las pestañas Explore/Search
	$('ul.tabs li').click(function(){

		var tab_id = $(this).attr('data-tab');
		$('ul.tabs li').removeClass('current');
		$('.tab-content').removeClass('current');
		$(this).addClass('current');
		$("#"+tab_id).addClass('current');

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

});


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
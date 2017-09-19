$( document ).ready(function() {

    var listdata = JSON.parse(localStorage["toprintfriendlist"]);
    listdata = toDOM(listdata); // funcion definida en dom-to-json.js

    $('#listvisual').html(listdata)

    var searchviewmode = localStorage["searchviewmode"];
    var selecteddriveunit = localStorage["selecteddriveunit"];

    var tolist = "";

    $.each($(".exploelement"), function(n){

    	if ($(".exploelement:eq("+n+")").hasClass("folder")){

    		if (searchviewmode == 1){
    			var fpath = selecteddriveunit + "\/" + $(".exploelement:eq("+n+")")["0"].childNodes[1].attributes[2].value;
    		} else {
    			var fpath = selecteddriveunit + $(".exploelement:eq("+n+")")["0"].children[1].attributes[1].value
    		}
    		var rowtoadd = fpath + "<br>"
    		tolist = tolist + rowtoadd;

    	}

    	else if ($(".exploelement:eq("+n+")").hasClass("archive")){

    		var fpath = selecteddriveunit + $(".exploelement:eq("+n+")")["0"].children[1].attributes[2].value + $(".exploelement:eq("+n+")")["0"].children[1].attributes[1].value;
 
    		var rowtoadd = fpath + "<br>"
    		tolist = tolist + rowtoadd;

    	}

    })

    $("#listtxt").append(tolist);

});
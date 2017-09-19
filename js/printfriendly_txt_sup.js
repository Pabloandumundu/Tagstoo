/* Guardar */
function downloadInnerHtml(filename, elId, mimeType) {
    var link = document.createElement('a');
    mimeType = mimeType || 'text/plain';

    link.setAttribute('download', filename);
    link.setAttribute('href', 'data:' + mimeType + ';charset=utf-8,' + encodeURIComponent(elId));
    link.click(); 
}
function aguardartxt() {

	// https://stackoverflow.com/questions/26931590/how-to-get-div-content-with-innerhtml-as-plain-text-and-then-download-it-as-txt

	var fileName =  'searched.txt';
	var listtxt = top.frames['list'].document.getElementById('listtxt').innerHTML
	listtxt = listtxt.replace(/\s?(<br\s?\/?>)\s?/g, "\r\n"); // sustituye <br> por salto de linea

	// downloadInnerHtml(fileName, listtxt,'text/html');
	downloadInnerHtml(fileName, listtxt,'text/plain');
}


/* Imprimir */
function toprint() {

	top.frames['list'].focus();
	top.frames['list'].print();
}

$( document ).ready(function() {

	var colortagstoo = localStorage["colortagstoo"];
	if (colortagstoo == "not") {
		$("body").css("filter","grayscale(85%) brightness(102%)");
	}

});
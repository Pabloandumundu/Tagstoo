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
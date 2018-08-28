$( document ).ready(function() {

	var searchviewmode = localStorage["searchviewmode"];
	var colortagstoo = localStorage["colortagstoo"];

    var listdata = JSON.parse(localStorage["toprintfriendlist"]);
    listdata = toDOM(listdata); // funcion definida en dom-to-json.js

    /*console.log(listdata)*/

    $('#listvisual').append(listdata);


    var imagenes = $('img');
    $.each(imagenes, function(u){

    	if (!$("img:eq("+u+")").hasClass('b-lazy')) {
    		$("img:eq("+u+")").attr('src', '../' + $("img:eq("+u+")").attr('src'))

    	}
     })

    $('#listvisual').html(listdata);

    if (searchviewmode==1){

    	columnaswidth = [];

		interact('.explofolder, .explofile')

			.resizable({
				preserveAspectRatio: false,
				edges: { left: false, right: true, bottom: false, top: false },

				onstart: function (event) {
					originalwidth = $(".explofolder, .explofile").width()
					nd_originalwidth = $(".folderelements, .exploext").width()
					$(".imgmode1").width("16px");
				},
				onend: function (event) {

					// se pasan las anchuras a porcentaje para que si se cambia el tamaño de la ventana mantenga los limites
					var pixelstotales = $('.exploelement').width();

					var pixels = $('.explofolder, .explofile').width();
					columnaswidth[1] = (100 / pixelstotales) * pixels
					$('.explofolder, .explofile').width(''+ columnaswidth[1] + '%');

					pixels = $('.folderelements, .exploext').width();
					columnaswidth[2] = (100 / pixelstotales) * pixels
					$('.folderelements, .exploext').width(''+ columnaswidth[2] + '%');

					pixels = $('.explosize').width();
					columnaswidth[3] = (100 / pixelstotales) * pixels
					$('.explosize').width(''+ columnaswidth[3] + '%');

					pixels = $('.exploelement .tags').width();
					columnaswidth[4] = (100 / pixelstotales) * pixels
					$('.exploelement .tags').width(''+ columnaswidth[4] + '%');

					pixels = $('.lastmod').width();
					columnaswidth[5] = (100 / pixelstotales) * pixels
					$('.lastmod').width(''+ columnaswidth[5] + '%');

					pixels = $('.duration').width();
					columnaswidth[6] = (100 / pixelstotales) * pixels
					$('.duration').width(''+ columnaswidth[6] + '%');
				}

			})

			.on('resizemove', function (event) {

				var diference = originalwidth - event.rect.width;
				var nd_newwidth = nd_originalwidth + diference;

				if (event.rect.width > 15 && nd_newwidth > 15) {

					$(".explofolder, .explofile").width(event.rect.width);
					$(".folderelements, .exploext").width(nd_newwidth);

				}


			});

		interact('.folderelements, .exploext')

			.resizable({
				preserveAspectRatio: false,
				edges: { left: false, right: true, bottom: false, top: false },

				onstart: function (event) {
					originalwidth = $(".folderelements, .exploext").width()
					nd_originalwidth = $(".explosize").width()
					$(".imgmode1").width("16px");
				},
				onend: function (event) {

					// se pasan las anchuras a porcentaje para que si se cambia el tamaño de la ventana mantenga los limites
					var pixelstotales = $('.exploelement').width();

					var pixels = $('.explofolder, .explofile').width();
					columnaswidth[1] = (100 / pixelstotales) * pixels
					$('.explofolder, .explofile').width(''+ columnaswidth[1] + '%');

					pixels = $('.folderelements, .exploext').width();
					columnaswidth[2] = (100 / pixelstotales) * pixels
					$('.folderelements, .exploext').width(''+ columnaswidth[2] + '%');

					pixels = $('.explosize').width();
					columnaswidth[3] = (100 / pixelstotales) * pixels
					$('.explosize').width(''+ columnaswidth[3] + '%');

					pixels = $('.exploelement .tags').width();
					columnaswidth[4] = (100 / pixelstotales) * pixels
					$('.exploelement .tags').width(''+ columnaswidth[4] + '%');

					pixels = $('.lastmod').width();
					columnaswidth[5] = (100 / pixelstotales) * pixels
					$('.lastmod').width(''+ columnaswidth[5] + '%');

					pixels = $('.duration').width();
					columnaswidth[6] = (100 / pixelstotales) * pixels
					$('.duration').width(''+ columnaswidth[6] + '%');
				}

			})
			.on('resizemove', function (event) {

				var diference = originalwidth - event.rect.width;
				var nd_newwidth = nd_originalwidth + diference;

				if (event.rect.width > 15 && nd_newwidth > 15) {

					$(".folderelements, .exploext").width(event.rect.width)
					$(".explosize").width(nd_newwidth);

				}

			});

		interact('.explosize')

			.resizable({
				preserveAspectRatio: false,
				edges: { left: false, right: true, bottom: false, top: false },

				onstart: function (event) {
					originalwidth = $(".explosize").width()
					nd_originalwidth = $(".exploelement .tags").width()
					$(".imgmode1").width("16px");
				},
				onend: function (event) {

					// se pasan las anchuras a porcentaje para que si se cambia el tamaño de la ventana mantenga los limites
					var pixelstotales = $('.exploelement').width();

					var pixels = $('.explofolder, .explofile').width();
					columnaswidth[1] = (100 / pixelstotales) * pixels
					$('.explofolder, .explofile').width(''+ columnaswidth[1] + '%');

					pixels = $('.folderelements, .exploext').width();
					columnaswidth[2] = (100 / pixelstotales) * pixels
					$('.folderelements, .exploext').width(''+ columnaswidth[2] + '%');

					pixels = $('.explosize').width();
					columnaswidth[3] = (100 / pixelstotales) * pixels
					$('.explosize').width(''+ columnaswidth[3] + '%');

					pixels = $('.exploelement .tags').width();
					columnaswidth[4] = (100 / pixelstotales) * pixels
					$('.exploelement .tags').width(''+ columnaswidth[4] + '%');

					pixels = $('.lastmod').width();
					columnaswidth[5] = (100 / pixelstotales) * pixels
					$('.lastmod').width(''+ columnaswidth[5] + '%');

					pixels = $('.duration').width();
					columnaswidth[6] = (100 / pixelstotales) * pixels
					$('.duration').width(''+ columnaswidth[6] + '%');
				}

			})
			.on('resizemove', function (event) {

				var diference = originalwidth - event.rect.width;
				var nd_newwidth = nd_originalwidth + diference;

				if (event.rect.width > 15 && nd_newwidth > 15) {

					$(".explosize").width(event.rect.width)
					$(".exploelement .tags").width(nd_newwidth);

				}

			});

		interact('.exploelement .tags')

			.resizable({
				preserveAspectRatio: false,
				edges: { left: false, right: true, bottom: false, top: false },

				onstart: function (event) {
					originalwidth = $(".exploelement .tags").width()
					nd_originalwidth = $(".lastmod").width()
					$(".imgmode1").width("16px");
				},
				onend: function (event) {

					// se pasan las anchuras a porcentaje para que si se cambia el tamaño de la ventana mantenga los limites
					var pixelstotales = $('.exploelement').width();

					var pixels = $('.explofolder, .explofile').width();
					columnaswidth[1] = (100 / pixelstotales) * pixels
					$('.explofolder, .explofile').width(''+ columnaswidth[1] + '%');

					pixels = $('.folderelements, .exploext').width();
					columnaswidth[2] = (100 / pixelstotales) * pixels
					$('.folderelements, .exploext').width(''+ columnaswidth[2] + '%');

					pixels = $('.explosize').width();
					columnaswidth[3] = (100 / pixelstotales) * pixels
					$('.explosize').width(''+ columnaswidth[3] + '%');

					pixels = $('.exploelement .tags').width();
					columnaswidth[4] = (100 / pixelstotales) * pixels
					$('.exploelement .tags').width(''+ columnaswidth[4] + '%');

					pixels = $('.lastmod').width();
					columnaswidth[5] = (100 / pixelstotales) * pixels
					$('.lastmod').width(''+ columnaswidth[5] + '%');

					pixels = $('.duration').width();
					columnaswidth[6] = (100 / pixelstotales) * pixels
					$('.duration').width(''+ columnaswidth[6] + '%');
				}

			})
			.on('resizemove', function (event) {

				var diference = originalwidth - event.rect.width;
				var nd_newwidth = nd_originalwidth + diference;

				if (event.rect.width > 15 && nd_newwidth > 15) {

					$(".exploelement .tags").width(event.rect.width)
					$(".lastmod").width(nd_newwidth);

				}

			});

		interact('.lastmod')

			.resizable({
				preserveAspectRatio: false,
				edges: { left: false, right: true, bottom: false, top: false },

				onstart: function (event) {
					originalwidth = $(".lastmod").width()
					nd_originalwidth = $(".duration").width()
					$(".imgmode1").width("16px");
				},
				onend: function (event) {

					// se pasan las anchuras a porcentaje para que si se cambia el tamaño de la ventana mantenga los limites
					var pixelstotales = $('.exploelement').width();

					var pixels = $('.explofolder, .explofile').width();
					columnaswidth[1] = (100 / pixelstotales) * pixels
					$('.explofolder, .explofile').width(''+ columnaswidth[1] + '%');

					pixels = $('.folderelements, .exploext').width();
					columnaswidth[2] = (100 / pixelstotales) * pixels
					$('.folderelements, .exploext').width(''+ columnaswidth[2] + '%');

					pixels = $('.explosize').width();
					columnaswidth[3] = (100 / pixelstotales) * pixels
					$('.explosize').width(''+ columnaswidth[3] + '%');

					pixels = $('.exploelement .tags').width();
					columnaswidth[4] = (100 / pixelstotales) * pixels
					$('.exploelement .tags').width(''+ columnaswidth[4] + '%');

					pixels = $('.lastmod').width();
					columnaswidth[5] = (100 / pixelstotales) * pixels
					$('.lastmod').width(''+ columnaswidth[5] + '%');

					pixels = $('.duration').width();
					columnaswidth[6] = (100 / pixelstotales) * pixels
					$('.duration').width(''+ columnaswidth[6] + '%');
				}

			})
			.on('resizemove', function (event) {

				var diference = originalwidth - event.rect.width;
				var nd_newwidth = nd_originalwidth + diference;

				if (event.rect.width > 15 && nd_newwidth > 15) {

					$(".lastmod").width(event.rect.width)
					$(".duration").width(nd_newwidth);

				}

			});

		interact('.duration')

			.resizable({
				preserveAspectRatio: false,
				edges: { left: false, right: true, bottom: false, top: false },

				onstart: function (event) {
					originalwidth = $(".duration").width();
					var x = $(".exploelement").offset();
					rowleftlimit = x.left + $(".exploelement")["0"].scrollWidth - 10;
					$(".imgmode1").width("16px");
				},
				onend: function (event) {

					// se pasan las anchuras a porcentaje para que si se cambia el tamaño de la ventana mantenga los limites
					var pixelstotales = $('.exploelement').width();

					var pixels = $('.explofolder, .explofile').width();
					columnaswidth[1] = (100 / pixelstotales) * pixels
					$('.explofolder, .explofile').width(''+ columnaswidth[1] + '%');

					pixels = $('.folderelements, .exploext').width();
					columnaswidth[2] = (100 / pixelstotales) * pixels
					$('.folderelements, .exploext').width(''+ columnaswidth[2] + '%');

					pixels = $('.explosize').width();
					columnaswidth[3] = (100 / pixelstotales) * pixels
					$('.explosize').width(''+ columnaswidth[3] + '%');

					pixels = $('.exploelement .tags').width();
					columnaswidth[4] = (100 / pixelstotales) * pixels
					$('.exploelement .tags').width(''+ columnaswidth[4] + '%');

					pixels = $('.lastmod').width();
					columnaswidth[5] = (100 / pixelstotales) * pixels
					$('.lastmod').width(''+ columnaswidth[5] + '%');

					pixels = $('.duration').width();
					columnaswidth[6] = (100 / pixelstotales) * pixels
					$('.duration').width(''+ columnaswidth[6] + '%');
				}

			})
			.on('resizemove', function (event) {

				var diference = originalwidth - event.rect.width;

				if (event.rect.width > 15 && event.clientX < rowleftlimit) {

					$(".duration").width(event.rect.width)

				}

			}); // --fin "columnas"


	} // --fin if searchviewmode=1


	if (colortagstoo == "not") {

	    var ls = document.createElement('link');
	    ls.rel="stylesheet";
	    ls.href= "../css/version_grey.css";
	    document.getElementsByTagName('head')[0].appendChild(ls);

	}
    
});
var media = {"pages": [
	{"pagename":"home",
	"title":"Home",
	"paragraphs":[
		{"title":"Welcome to MyShite",
		"paragraph":"This is my site."}
	]},
	{"pagename":"me",
	"title":"About the Author",
	"paragraphs":[
		{"title":"Me",
		"paragraph":"This is me."},
		{"title":"",
		"paragraph":"Then."}
	]},
	{"pagename":"stuff",
	"title":"Files & Stuff",
	"paragraphs":[
		{"title":"Files & Stuff",
		"paragraph":"Here you might find something to download."},
		{"title": "Links",
		"paragraph":'<a href="https://github.com/enderi">GitHub</a>'},
		{"title":"Arkanoid",
		"paragraph":"Fancy a game of Arkanoid? <a href='#' id='arkanoid' onClick='runArkanoid($(\"#movie\"));'>Yes, please</a><div id ='movie'></div>"}]},
	{"pagename":"contact",
	"title":"Contact",
	"paragraphs":[
		{"title":"Contact information",
		"paragraph":"My email is jannejvento@gmail.com"}
	]}
]};


var activePage = 0;

$(document).ready(function(){
	changePage(activePage);
	$("#navigation ul li a").click(function(e){
		var newActivePage = $("#navigation ul li a").index(this);
		if (activePage === newActivePage)
			return;
		
		activePage = newActivePage;
		//console.log(activePage);
		$(".chosen").removeClass('chosen');
		$(this).attr("class","chosen");		
		$("#view").fadeOut('fast', function(){
			changePage();
			$("#view").fadeIn('fast');
		});
		e.preventDefault();
	});
});

function changePage(){
	var articleData = media['pages'][activePage];
	var html = Mustache.render($("#article").html(), articleData);
	$("#view").html(html);
	
}
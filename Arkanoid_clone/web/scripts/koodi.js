var media = {"pages": [
	{"pagename":"home",
	"title":"Home",
	"paragraphs":[
		{"title":"Welcome to MySite",
		"paragraph":"This is my site."}
	]},
	{"pagename":"me",
	"title":"About the Author",
	"paragraphs":[
		{"title":"",
		"paragraph":"This is <a href='https://plus.google.com/101500422968632355934'>me</a>... then."}
	]},
	{"pagename":"stuff",
	"title":"Files & Stuff",
	"paragraphs":[
		{"title":"Now, what is this?",
		"paragraph":"Here you might find something to download."},
		{"title": "Links",
		"paragraph":'<ul><li><a href="https://github.com/enderi">GitHub</a></li><li><a href="http://jjvento.users.cs.helsinki.fi">Project time management system (School project) </a></li></ul>'},
		{"title":"Arkanoid(ish)",
		"paragraph":"<a href='arkanoid.html'>Fancy a round of Arkanoidish game?</a>"}]},
	{"pagename":"contact",
	"title":"Contact",
	"paragraphs":[
		{"title":"Contact information",
		"paragraph":"jannejvento (at) gmail.com"}
	]}
]};


var activePage = 0;

$(document).ready(function(){
	baseUrl = window.location.pathname;
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
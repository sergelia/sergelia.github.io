
	var _toggleElementClass = function(element, attribute) {
		if (element.classList.contains(attribute)) {
			element.classList.remove(attribute);
			return element;
		}
		var nodeName = element.nodeName;
		var siblings = element.parentNode.children;
		var trueSiblings = [];
		for (var i = 0; i < siblings.length; i++) {
			if (siblings[i].nodeName === nodeName && siblings[i] !== element) {
				trueSiblings.push(siblings[i]);
			} 
		}
		if (trueSiblings.length === 0) {
			element.classList.add(attribute);
			return element;
		}
		for (var i = 0; i < trueSiblings.length; i++) {
			if (trueSiblings[i].classList.contains(attribute)) {
				trueSiblings[i].classList.remove(attribute);
			}
		}
		element.classList.add(attribute);
		return element;
	};

	// Tags functionality
	var Tagger = function(element) {
		if (typeof element !== "string") { 
			return false; 
		} else if (element.length === 0) {
			return false;
		}
		var container = document.getElementById(element);
		var buttons = container.children;
		var removeClass = new Event('removeClass');
		
		window.document.addEventListener('click', function(e) {
			if ([].indexOf.call(buttons, e.target) === -1) {
				container.dispatchEvent(removeClass);
			}
		});

		for (var i = 0; i < buttons.length; i++) {
			// attach the behavior only to tags with subtags
			var sub = buttons[i].getElementsByTagName('ul');
			if (typeof sub === "undefined") continue;

			sub = sub[0];
	
			buttons[i].addEventListener('click', function(e) {
				e.preventDefault();
				
				_toggleElementClass(e.target, 'active');
			});
			
		}
		container.addEventListener('removeClass', function(e) {
			for (var i = 0; i < buttons.length; i++) {
				if (buttons[i].classList.contains('active')) {
					buttons[i].classList.remove('active');
				}
			}
		});
	};
	Tagger('tags');

	// Preview modal - CHANGE THIS after rendering
	var _getProjects = function() {
		var projects = document.getElementsByClassName('project');
		for (var p = 0; p < projects.length; p++) {
			var anchors = projects[p].getElementsByTagName('a');
			for (var a = 0; a < anchors.length; a++) {
				if (typeof anchors[a].getAttribute('data-action') !== "undefined") {
					anchors[a].addEventListener('click', function(e) {
						e.preventDefault();
						var target_id = e.target.getAttribute('data-target');
						Modal(target_id);
					});
				} 
			}
		}
	};

	var Modal = function(id) {
		var pane = document.getElementById('preview_pane');
		var close_button = document.getElementById('preview_close');
		var previews = pane.children;		
		pane.addEventListener('click', function(e) {
			e.preventDefault();
			if (e.target === pane || e.target === close_button)  {
				_closeModal(pane, previews);
			}
		});

		for (var i = 0; i < previews.length; i++) {
			if (previews[i].getAttribute('id') === id) {
				console.log(previews[i]);
				_toggleElementClass(previews[i], 'active');
				pane.classList.add('active');
			}
		}
	};
	var _closeModal = function(pane, previews) {
		for (var p = 0; p < previews.length; p++) {
			if (previews[p].classList.contains('active')) {
				previews[p].classList.remove('active');
			}
		}
		pane.classList.remove('active');
	};
	
		
	
	


var _find = function(needle, haystack) {
	for (var key in haystack) {
	    if (!haystack.hasOwnProperty(key)) {
	        continue;
	    }
	    if (haystack[key] === needle) {
	    	return true;
	    } 
	}
	return false;
};
var _matchAttribute = function(attr, str, elArr) {
	var found = [];
	for (var i = 0; i < elArr.length; i++) {
		if (typeof str !== "undefined") {
			if (elArr[i].getAttribute(attr) !== str) {
				continue;
			} 
		} else {
			if (!elArr[i].hasAttribute(attr)) {
				continue;

			}
		}
		found.push(elArr[i]);
	}
	return found;
};

var _renderTemplate = function(param, arr) {
	var _;
	var baseTpl = document.getElementById('template-'+param);
	var previewTpl = document.getElementById('template-preview');

	var parentBase = baseTpl.parentNode;
	var parentPreview = previewTpl.parentNode;

	var base_backup = baseTpl.cloneNode(true);
	var preview_backup = previewTpl.cloneNode(true);

	parentBase.innerHTML = "";
	parentPreview.innerHTML = "";
	
	if (typeof baseTpl === "undefined") {
		return false;
	}
	for (var i = 0; i < arr.length; i++) {
		var template = base_backup.cloneNode(true);
		var preview = preview_backup.cloneNode(true);
		
		for (var key in arr[i]) {
			var tokens = _matchAttribute('data-'+key, _, template.getElementsByTagName("*"));
			var previewTokens = _matchAttribute('data-'+key, _, preview.getElementsByTagName("*"));
			/*console.log('Key: ', key);
			console.log('Tokens: ', tokens);*/
			for (var k = 0; k < tokens.length; k++) {
				//console.log(key);
				switch (key) {
					case 'id' : 
						tokens[k].setAttribute('data-target', arr[i][key]);
						break;
					case 'title' || 'description' : 
						tokens[k].innerHTML = arr[i][key];
						break;
					case 'img' :
						tokens[k].src = arr[i][key];
						break;
					case 'link' : 
						tokens[k].setAttribute('href', arr[i][key]);
						break;
					default:
						break;
				}
			}
			for (var k = 0; k < previewTokens.length; k++) {
				switch (key) {
					case 'id' : 
						previewTokens[k].setAttribute('data-target', arr[i][key]);
						break;
					case 'title' || 'description' : 
						previewTokens[k].innerHTML = arr[i][key];
						break;
					case 'img' :
						previewTokens[k].src = arr[i][key];
						break;
					case 'link' : 
						previewTokens[k].setAttribute('href', arr[i][key]);
						break;
					default:
						break;
				}
			}

		}
		template.setAttribute('id', '');
		preview.setAttribute('id', '');
		parentBase.appendChild(template);
		parentPreview.appendChild(preview);
	}

	parentBase.appendChild(base_backup);
	parentPreview.appendChild(preview_backup);
};
var _matchData = function(elArr, data) {
	for (var key in data) {
	    if (!data.hasOwnProperty(key)) {
	        continue;
	    }

	    var tokens = _matchAttribute('data-content', key, elArr);
	    if (typeof data[key] === "string") {
		    for (var i = 0; i < tokens.length; i++) {
		    	tokens[i].innerHTML = data[key];
		    }
		} 
		else if (typeof data[key] === "object") {
			if( Object.prototype.toString.call(data[key]) === '[object Array]' ) {
				    
				console.log('Found array: ', key);
				_renderTemplate(key, data[key]);

			} else {

				//_matchArrayData(tokens[i].children, data[key]);
				if (typeof tokens[0] !== "undefined") {
					tokens[0].innerHTML = "";
					for (var subKey in data[key]) {
						if (typeof data[key][subKey] !== "string") {
							var li = document.createElement('li');
							var span = document.createElement('span');
							span.innerHTML = subKey;
							li.appendChild(span);
							if (data[key][subKey].length > 0) {	
								var ul = document.createElement('ul');
								for (var i = 0; i < data[key][subKey].length; i++) {
									var node = document.createElement('li');
									node.innerHTML = data[key][subKey][i];
									ul.appendChild(node);
								}
								li.appendChild(ul);
							}
							tokens[0].appendChild(li);
						}
					}
				}
			}
		}
	}
	Tagger('tags');

}
var matchRecursive = function (objArr, container) {

}
// Projects 
var promptbattle = {
	'id' : 'promptbattle',
	'title' : 'PromptBattle',
	'description' : 'A battleground for writing prompts and short prose in general. Made 99.9% without help of frameworks or plugins, to truly get a grasp on vanilla JavaScript.',
	'link' : '/promptbattle/',
	'img' : './images/promptbattle.png',
};

var dimensions = {
	'id' : 'dimensions',
	'title' : 'Dimensions app',
	'description' : 'The proof-of-concept for my diploma project, Dimensions was a somewhat clumsy attempt at making a web messaging client with Node and Neo4j in order to demonstrate a multi-dimensional approach to conversation.',
	'link' : '/dimensions/',
	'img' : './images/dimensions.png',
};


var n_framework = {
	'id' : 'n_framework',
	'title' : 'UI Framework',
	'description' : 'My UI framework, started as a SCSS learning project and now used wherever possible. Boasts color and the ocassional clever mixin.',
	'link' : '/n_framework/',
	'img' : './images/n-framework.png',
};


var kulturkokoska = {
	'id' : 'kulturkokoska',
	'title' : 'Kultur!Kokoška magazine',
	'description' : 'Started in February 2013, the magazine was my first serious web project and is now one of the most popular pop-culture sites in Serbia.',
	'link' : 'http://kulturkokoska.rs',
	'img' : './images/kulturkokoska.png',
};

var kravatisti = {
	'id' : 'kravatisti',
	'title' : 'Kravatisti (defunct)',
	'description' : 'During the organization\'s short lifespan, I created a small artist-marketplace CMS with a Laravel backend and a strange and delightful REST API.',
	'link' : '#',
	'img' : './images/kravatisti.png',
};

var screenwriter = {
	'id' : 'screenwriter',
	'title' : 'Screenwriter app',
	'description' : 'A MEAN collaborative screenwriting web app.',
	'link' : '#',
	'img' : './images/screenwriter.png',
};

var jobscraper = {
	'id' : 'jobscraper',
	'title' : 'JobScraper',
	'description' : 'A relocation-helper for tech professionals - with custom trackers and a whole lot of third-party integrations.',
	'link' : '#',
	'img' : './images/jobscraper.png',
};

var gitbrowse = {
	'id' : 'gitbrowse',
	'title' : 'GitBrowse',
	'description' : 'A tiny recruiting tool for ranking users on GitHub based on location, language use and availability.',
	'link' : '#',
	'img' : './images/gitbrowse.png',
};

var centraldash = {
	'id' : 'centraldash',
	'title' : 'Central Dash',
	'description' : 'For personal use - a SPA dashboard for my freelance projects, with to-do lists, deadlines, contact details and one-click tasks.',
	'link' : '#',
	'img' : './images/centraldash.png',
};
var dataset = {
	'2016' : {
		'focus' : 'mastering vanilla JavaScript',
		'time' : 'At the moment',
		'skills' : {
			'javascript' : ['es6', 'angular 1', 'jQuery', 'vanilla', 'node'],
			'php' : ['freeform', 'Laravel > 4.0', 'WordPress'],
			'git' : ['evidently'],
			'css' : ['css3', 'SCSS', 'LESS'],
			'help' : ['Grunt', 'Gulp'],
			'databases' : ['MySQL', 'Neo4j', 'Postgres', 'MongoDB'],
			'webServers' : ['Apache', 'nginx', 'node'],
			'scripting' : ['bash', 'PowerShell 4'],
		},
		'projects' : [promptbattle, dimensions, n_framework],
		'toHave' : 'have',
		'toWork' : 'am working',
		'toBe' : 'am',
		'addOn' : 'If you like what you see - go to year 2017.',
	},
	'2015' : {
		'focus' : 'improving system administration skills',
		'time' : 'In 2015',
		'skills' : {
			'javascript' : ['es5', 'angular 1', 'jQuery'],
			'php' : ['freeform', 'Laravel 4.0', 'WordPress'],
			'git' : ['evidently'],
			'css' : ['css3', 'SASS'],
			'help' : ['Grunt'],
			'databases' : ['MySQL', 'Neo4j'],
			'web servers' : ['Apache', 'nginx'],
			'scripting' : ['bash', 'awk', 'REXX'],
		},
		'projects' : [gitbrowse, jobscraper],
		'toHave' : 'had',
		'toWork' : 'was working',
		'toBe' : 'was',
		'addOn' : 'It was worth it.',
	},
	'2014' : {
		'focus' : 'learning about data structures and algorithms, broadening my understanding of programming, and making up Laravel applications on the fly',
		'time' : 'In 2014',
		'skills' : {
			'javascript' : ['es5', 'jQuery'],
			'php' : ['freeform', 'Laravel 3.0'],
			'css' : ['css3'],
			'desktop' : ['C++', 'C', 'Java'],
			'databases' : ['MySQL'],
		},
		'projects' : [screenwriter, kulturkokoska, centraldash],
		'toHave' : 'had',
		'toWork' : 'was working',
		'toBe' : 'was',
		'addOn' : 'I can still write a resource controller with my eyes closed.',
	},
	'2013' : {
		'focus' : 'learning about web technologies - and understanding how the Internet works',
		'time' : 'in 2013',
		'skills' : {
			'javascript' : ['jQuery'],
			'php' : ['freeform', 'Laravel'],
			'css' : ['css3'],
			'desktop' : ['C'],
			'databases' : ['MySQL'],
		},
		'projects' : [kravatisti, kulturkokoska],
		'toHave' : 'had',
		'toWork' : 'was working',
		'toBe' : 'was',
		'addOn' : 'I rolled out my first, very static, website into the world on Jan 1st, 2013. Within a year I re-did it with Laravel, Bootstrap, and 12 months of substituting sleep for learning about REST and design patterns.',
	},
};
var Portfolio = function(dataset) {
	var portfolioCanvas = document.getElementById('main');
	var children = portfolioCanvas.getElementsByTagName("*");
	var tokens = [];
	for (var i = 0; i < children.length; i++) {
		if (children[i].hasAttribute('data-content')) {
			tokens.push(children[i]);
		}
	}

	var yearCtrl = document.getElementById('select_year');
	var selectedYear = yearCtrl[yearCtrl.selectedIndex].value;
	_matchData(tokens, dataset[selectedYear]);

	yearCtrl.addEventListener('change', function(e) {
		var data = dataset[e.target.value];
		_matchData(tokens, data);
		_getProjects();

	});
};
Portfolio(dataset);
_getProjects();
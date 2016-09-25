
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

	// Preview modal

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
		
		if (elArr[i].getAttribute(attr) !== str) {
			continue;
		} else {
			found.push(elArr[i]);
		}
	}
	return found;
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
		    	console.log(tokens[i], data[key]);
		    }
		} 
		else if (typeof data[key] === "object") {
			 if (typeof data[key].constructor === "Array") {
				console.log('Found array: ' + data[key]);

			 	tokens[i].innerHTML = "";
				var span = document.createElement('span');
				span.innerHTML = key;
				tokens[i].appendChild(span);
				for (var i = 0; i < data[key].length; i++) {
					var node = document.createElement('li');
					node.innerHTML = data[key][i];
					tokens[i].appendChild(node);
				}
			} else {

				//_matchArrayData(tokens[i].children, data[key]);
				if (typeof tokens[0] !== "undefined") {
					tokens[0].innerHTML = "";
					for (var subKey in data[key]) {
						console.log('Key: ' + subKey + ' content: ' + data[key][subKey]);
						if (typeof data[key][subKey] !== "string") {
							console.log('Found array: ' + data[key][subKey]);
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

var dataset = {

	'2017' : {
		'overRide' : true,
		'hireMe' : {
			'text' : 'Hire me',
			'contact' : 'nusa.babic@outlook.com',
		},
		'followMe' : {
			'text' : 'Follow my work',
			'options' : ['https://github.com/sergelia', 'https://pastebin.com/sergelia'],
		},
		'askMe' : {
			'text' : 'Get in touch',
			'contact' : 'nusa.babic@outlook.com'
		},
	},
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
		'projects' : ['promptbattle', 'dimensions', 'n_framework'],
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
		'projects' : ['git-browse', 'Jobscraper'],
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
		'projects' : ['screenwriter', 'Kultur!Kokoska', 'CentralDash'],
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
		'projects' : ['Kravatisti', 'Kultur!Kokoska'],
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

	});
};
Portfolio(dataset);
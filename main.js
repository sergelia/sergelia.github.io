(function(window) {
	// color definition
	var nBackgroundColor = "#000000";
	var nHighlightColor = "#FFFFFF"
	var nAccentColor = "#F4E864";
	var nSubdueColor = "#F3E085";
	// helper
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
			e.stopPropagation();
			console.log('target: ' + e.target);
			console.log([].indexOf.call(buttons, e.target));
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
})(this);
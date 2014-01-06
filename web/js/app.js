(function($){

	var test = '';

	function urlify(text) {

    var urlRegex = /(https?:\/\/[^\s]+)/g;

    return text.replace(urlRegex, function(url) {

        return '<a href="' + url + '">' + url + '</a>';

    });

    // or alternatively
    // return text.replace(urlRegex, '<a href="$1">$1</a>')
	}

	function usernameify(text){		
    
    regex   = /(^|[^@\w])@(\w{1,40})\b/g,
    replace = '$1<a href="https://socialcast.bekk.no/users/$2">@$2</a>';

		return text.replace( regex, replace );

	}

	function hashtagify(text){		
    
    regex   = /\S*#(?:\[[^\]]+\]|\S+)/g;

		return text.replace( regex, function(tag){
			return '<a href="https://socialcast.bekk.no/users/">'+tag+'</a>';
		} );

	}

	function newlineify(text){

		var regex = /\n/g;

		return text.replace(regex, '<br/>');

	}

	window.scoreboard = window.scoreboard || {};

	scoreboard = $.extend(scoreboard, {
		init : function(){

			Handlebars.registerHelper('length', function(comments) {


			  return typeof comments === 'undefined' ? 0 : comments.length;
			});

			var _messagesController = new scoreboard.controllers.messages();

		},
		render : function(){}
	});

	window.scoreboard.views = window.scoreboard.views || {};

	scoreboard.views.message = function(el, data, template){

		this.el = el;
		this.data = data;
		this.template = template;

	};

	scoreboard.views.message.prototype.render = function(){

		var _compiledTemplate = Handlebars.compile(this.template);
		var _populatedTemplate = _compiledTemplate(this.data);

		this.el.html(_populatedTemplate);

	};

	scoreboard.views.messages = function(el, data, template){

		this.el = el;
		this.data = { messages : data };
		this.template = template;

		

	};

	scoreboard.views.messages.prototype.registerEvents = function(){

		$(document).on('scoreboard:views:messages:rendered', function(event, view){

			console.log('scoreboard:views:messages:rendered', view);

			

			$('#messages .body').each(function(i, el){
				$(this).html(urlify($(this).html()));
			});

			

			$('#messages .body').each(function(i, el){
				$(this).html(newlineify($(this).html()));

			});

			$('#messages .body').each(function(i, el){
				$(this).html(usernameify($(this).html()));
			});

			$('#messages .body').each(function(i, el){
				$(this).html(hashtagify($(this).html()));
			});

		});

	};

	scoreboard.views.messages.prototype.render = function(){

		this.registerEvents();

		var _compiledTemplate = Handlebars.compile(this.template);
		var _populatedTemplate = _compiledTemplate(this.data);

		this.el.html(_populatedTemplate);

		$(document).trigger('scoreboard:views:messages:rendered', [this]);

	};

	window.scoreboard.controllers = window.scoreboard.controllers || {};

	scoreboard.controllers.messages = function(){

		this.registerEvents();

		this.fetch();

	};

	

	scoreboard.controllers.messages.prototype.registerEvents = function(){

		$(document).on('scoreboard:controller:messages:fetched', function(event, response, status, xhr){

			console.log(response, status, xhr);

			var _messagesView = new scoreboard.views.messages(
				$('#messages'),
				response,
				templates.messages
			);

			_messagesView.render();

		});

	};

	scoreboard.controllers.messages.prototype.fetch = function(){

		$.ajax({
			url : "/messages/"
		}).done(function(response, status, xhr){

			console.log(response, status, xhr);

			$(document).trigger('scoreboard:controller:messages:fetched',[response, status, xhr]);

		});

	};

	scoreboard.init();

})(jQuery);
(function($){

	var test = '';

	function youtube_parser(url){
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
    var match = url.match(regExp);
    if (match&&match[7].length==11){
        return match[7];
    }else{
        return false;
    }
}

	function urlify(text) {

    var urlRegex = /\b(([\w-]+:\/\/?|www[.])[^\s()<>]+(?:\([\w\d]+\)|([^[:punct:]\s]|)))/g;

    return text.replace(urlRegex, function(url) {

    		if(url.indexOf('youtube') !== -1){

    			var _videoid = youtube_parser(url);

    			if(_videoid){

    				return '<a href="' + url + '"><span class="youtube-thumb"><span class="glyphicon glyphicon-play"></span><img src="http://img.youtube.com/vi/'+_videoid+'/1.jpg" alt=""></span></a>';

    			} else {
    				return '<a href="' + url + '">' + url + '</a>';
    			}

    			


    		} else {

        	return '<a href="' + url + '">' + url + '</a>';

        }

    });

    // or alternatively
    // return text.replace(urlRegex, '<a href="$1">$1</a>')
	}

	function usernameify(text){		
    
    regex   = /(^|\W)(@[a-zøæå\d\w-]*)/ig;
    

		return text.replace( regex, function(nick){

			nick = nick.replace(/\n/g, '');
			return ' <a href="https://socialcast.bekk.no/users/"><span class="glyphicon glyphicon-user"></span> '+nick.replace('@','')+'</a>';
		} );

	}

	function hashtagify(text){		
    
    regex   = /(^|\W)(#[a-zøæå\d][\w-]*)/ig;

		return text.replace( regex, function(tag){
			return ' <a href="https://socialcast.bekk.no/users/" class="tag"><span class="glyphicon glyphicon-tag"></span> '+tag.replace('#','')+'</a>';
		} );

	}

	function newlineify(text){

		var regex = /\n/g;

		return text.replace(regex, '<br\/>');

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

		$(document).one('scoreboard:views:messages:rendered', function(event, view){

			console.log('scoreboard:views:messages:rendered', view);

			var _html = '';

			$('#messages .body').each(function(i, el){

				_html = $(this).html();

				
				_html = urlify(_html);
				_html = usernameify(_html);
				_html = hashtagify(_html);

				_html = newlineify(_html);

				$(this).html(_html);

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

		var that = this;
/*
		setInterval(function(){
			that.fetch();
		},20000);*/

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
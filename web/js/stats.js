(function($){

	window.stats = {


		init : function(){

			this.fetch();
		},
		fetch : function(){


			$.ajax({
				url : '/stats-seniority'
			}).done(function(response, status, xhr){
				console.log(response);
			});
		}

	};

	stats.init();

})(jQuery)
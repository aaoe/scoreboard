(function($){

	window.stats = {


		init : function(){

			this.fetch();
		},
		fetch : function(){


			$.ajax({
				url : '/stats-seniority'
			}).done(function(response, status, xhr){
				
				var _data = [];

				$.each(response,function(type, number){

					_data.push([
						type, number
					]);

				});

				console.log(_data);

				$('#stats').highcharts({
			        chart: {
			            type: 'pie'
			        },
			        title: {
			            text: 'Roller'
			        },
			        series: [{
			        	type : "pie",
			        	data : _data
			        }]
			    });

			});
		}

	};

	stats.init();

})(jQuery)
(function($){ window.templates ={"message" : '<div class="row"><div class="col-md-4">{{body}}</div></div>',"messages" : '{{#each messages}}<div class="col-md-10 message"><span class="author">{{#with user}}<strong><a href="">{{name}}</a></strong>{{/with}}</span><span class="body">{{body}}</span><span class="number-of-comments">Antall kommentarer: <span class="badge">{{length comments}}</span></span></div>{{/each}}', "done": "true"}})(jQuery);
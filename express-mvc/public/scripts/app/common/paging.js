define(["mustache"],function(Mustache){
	var Paging=function(opts){

		this.opts=$.extend({},opts);

		this.init(opts);
	};

	Paging.prototype={
		init:function(){

		},

		buildDom:function(){
			var self=this;
			self.$paging=$("#"+self.opts.paging);
			self.template=$("#"+self.opts.paging_template).html();
		},

		render:function(data){
			var self=this,
				temp = Mustache.render(self.template,{paging:data});

		}
	};


	return Paging;
});
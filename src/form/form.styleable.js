/**
 * @license 
 * jQuery Tools @VERSION Styleable - Forms + CSS. Finally.
 *                                                      
 * Copyright (c) 2010 Tero Piirainen
 * http://flowplayer.org/tools/form/styleable/
 *
 * Dual licensed under MIT and GPL 2+ licenses
 * http://www.opensource.org/licenses
 *
 * Since: Mar 2010
 * Date: @DATE 
 */
(function($) { 
	
	$.tools = $.tools || {version: '@VERSION'};
	
	var tool;
	
	tool = $.tools.styleable = {

		conf: { 
			inputClass: null,
			checkedClass: 'checked',
			disabledClass: 'disabled',
			hoverClass: 'hover',
			focusClass: 'focus',
			fileWrap: 'filewrap', 
			filter: 'select, :radio, :checkbox, :file'
		}
		
	};	 

	function Styleable(input, conf) {
		
		var type = input.attr("type"), a = $("<a/>");
		input.before(a);
		
		if (type == 'select-one') {
			input.css({opacity: 0});
			
			input.change(function() {
				a.text(input.find("option:selected").html());					
			});
			
			a.addClass("select").text(input.find("option:selected").html());
			
		// :file
		} else if (type == 'file') {

			var wrap = $("<span/>").addClass(conf.fileWrap);
			var textInput = $("<input/>").addClass(input.attr("className")).attr("disabled", true);
			
			input.before(textInput);			
			input.wrap(wrap);			
			input.after("<a>" + input.attr("title") + "</a>").css({opacity: 0});
			
			wrap = input.parent();			
			
			input.bind("mouseenter mouseleave mousedown", function(e) {
				wrap.toggleClass(conf.hoverClass, e.type == 'mouseenter');
				wrap.toggleClass(conf.focusClass, e.type == 'mousedown');
			});
			
	
			input.change(function() {
				textInput.val($(this).val());
			});

			
		// :radio, :checkbox
		} else {			
			a.addClass(type);
			input.hide();
			
			if (conf.inputClass) {
				a.addClass(conf.inputClass);
			}
			
			var els = type == 'radio' ? $(":radio[name=" + input.attr("name") + "]") : null, 
				 cls = conf.checkedClass;
			
			input.click(function() {
				if (els) { els.prev().removeClass(cls); }
				setTimeout(function() {
					a.toggleClass(cls, this.checked);
				}, 5);
			});			
			
			if (!input.parent().is("label")	)  {				
				a.click(function() {
					input.click();
				});					
			}
			
			if (input.get(0).checked) {
				a.addClass(cls);	
			}			
		}
		
		if (input.is(":disabled")) {
			a.addClass(conf.disabledClass);	
		}
		
		input.bind("style", function() {
			a.toggleClass(cls, this.checked);
			a.toggleClass(conf.disabledClass, this.disabled);
		});
		
	}
	
	$.fn.styleable = function(conf) {   
		
		// return existing instance
		var el = this.data("styleable"), els;
		if (el) { return el; } 
		
		// configuration
		conf = $.extend({}, tool.conf, conf);				 
				
		if (this.is("form")) {
			els = this.find(conf.filter);			
			this.nextAll().each(function()  {
				els = els.add($(this).find(conf.filter));
			});
				
		} else {			
			els = this.filter(conf.filter);	
		} 
		
		els.each(function() {									
			el = new Styleable($(this), conf);				
			$(this).data("styleable", el);
		});		
		
		return conf.api ? el: this;		
	};   
		
})(jQuery);

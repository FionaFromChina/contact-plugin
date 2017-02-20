$.fn.hilight = function ( options ) {
	
	return this.each(function() {
		var elem = $(this);

		var markup = elem.html();

		markup = $.fn.hilight.format( markup );

		elem.html( markup );
	})
};
$.fn.hilight.format = function( txt ) {
	return "<strong>" + txt + "</strong>";
};

$.fn.hilight.defaults = {
	foreground:"red",
	background:"yellow"
}
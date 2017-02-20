;(function($,window,undefined){
	$.fn.extend({
		leanModal: function(options) {
			var defaults = {
				top: 100,
				overlay: 0.5,
				closeBtn: '.mocal_close',
				escapeClose: true,
				clickClose: true
			};

			options = $.extend({},defaults,options);

			var overlay = $('<div> id="lean-overlay"</div>');

			$('body').append(overlay);

			function close_modal(modal_id) {
				$('#lean-overlay').fadeOut(200);
				$(modal_id).css({display:'none'});
				$(document).off('keydown.leanModal');
			}

			return this.each(function() {
				var o = options;

				$(this).click(function(e) {
					$('.modal').hide();

					var modal_id = $(this).attr('href');

					if(o.closeBtn) {
						$(o.closeBtn).one('click',function(e) {
							close_modal(modal_id);
							e.preventDefault();
						});
					}

					if(o.clickClose) {
						$('#lean-overlay').one('click',function(e) {
							close_modal(modal_id);
							e.preventDefault();
						})
					}

					if(o.escapeClose) {
						$(document).on('keydown.leanModal',function(e) {
							if(e.which === 27) {
								close_modal(modal_id);
							}
						});
					}

					var model_height = $(modal_id).outerHeight();
					var modal_width = $(modal_id).outerWidth();

					$('#lean-overlay').css({display:'block',opacity:0});

					$('#lean-overlay').fadeTo(200,o.overlay);

					$(modal_id).css({
						'display': 'block',
						'position': 'fixed',
						'opacity': 0,
						'z-index':11000,
						'left':50 + '%',
						'margin-left' :-(modal_width / 2) + 'px',
						'top': o.top + 'px'
					});

					$(modal_id).fadeTo(200,1);

					e.preventDefault();

				});
			});



		}
	});
})(jQuery,window);
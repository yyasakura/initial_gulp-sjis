/**
 * script.js
 */
function mediaJudge(){
	var media_break_point = 640;
	return  (window.innerWidth > media_break_point) ? 'pc' : 'sp';
}

;(function($){


	//Pagetop
	$('.l-pagetop a').on('click.pagetop', function(e){
		e.preventDefault();
		e.stopPropagation();
		$('html,body').animate({ scrollTop : 0 }, 300, 'swing');
	});

	//スムーススクロール
	$('a[href^=#]').on('click.gotoID', function(e){
		var $self = $(this);
		var $target = $($self.attr('href'));
		if (!$target.length) return true;

		var header_height = $('.l-header').outerHeight();
		var scroll = $target.offset().top - header_height;
		$('html,body').animate({ scrollTop : scroll + 'px' }, 300, 'swing');
		return false;
	});


})(jQuery);
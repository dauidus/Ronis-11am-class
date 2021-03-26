var Books = (function() {

	var transEndEventNames = {
			'WebkitTransition' : 'webkitTransitionEnd',
			'MozTransition' : 'transitionend',
			'OTransition' : 'oTransitionEnd',
			'msTransition' : 'MSTransitionEnd',
			'transition' : 'transitionend'
		}, 
		transEndEventName = transEndEventNames[ Modernizr.prefixed( 'transition' ) ],
		$books = $( '#back-list > li > div.back-book' ), booksCount = $books.length, currentbook = -1; 
	
	function init() {

		$books.each( function( i ) {
			
			var $book = $( this ),
				$other = $books.not( $book ),
				$parent = $book.parent(),
				$page = $book.children( 'div.back-page' ),
				$content = $page.children( 'div.back-content' ), current = 0;

			if( i < booksCount / 2 ) {
				$parent.css( 'z-index', i ).data( 'stackval', i );
			}
			else {
				$parent.css( 'z-index', booksCount - 1 - i ).data( 'stackval', booksCount - 1 - i );	
			}

			$book.on( 'click', function() {
				
				if( currentbook !== -1 && currentbook !== $parent.index() ) {
					closeCurrent();
				}
				
				if( $book.data( 'opened' ) ) {
					$book.data( 'opened', false ).removeClass( 'back-viewinside' ).on( transEndEventName, function() {
						$( this ).off( transEndEventName ).removeClass( 'back-outside' );
						$parent.css( 'z-index', $parent.data( 'stackval' ) );
						currentbook = -1;
					} );
				}
				else {
					$book.data( 'opened', true ).addClass( 'back-outside' ).on( transEndEventName, function() {
						$( this ).off( transEndEventName ).addClass( 'back-viewinside' );
						$parent.css( 'z-index', booksCount );
						currentbook = $parent.index();
					} );
					current = 0;
					$content.removeClass( 'back-content-current' ).eq( current ).addClass( 'back-content-current' );
				}

			} );

			if( $content.length > 1 ) {

				var $navPrev = $( '<span class="back-page-prev">&lt;</span>' ),
					$navNext = $( '<span class="back-page-next">&gt;</span>' );
				
				$page.append( $( '<nav></nav>' ).append( $navPrev, $navNext ) );

				$navPrev.on( 'click', function() {
					if( current > 0 ) {
						--current;
						$content.removeClass( 'back-content-current' ).eq( current ).addClass( 'back-content-current' );
					}
					return false;
				} );

				$navNext.on( 'click', function() {
					if( current < $content.length - 1 ) {
						++current;
						$content.removeClass( 'back-content-current' ).eq( current ).addClass( 'back-content-current' );
					}
					return false;
				} );

			}
			
		} );

	}

	function closeCurrent() {

		var $book = $books.eq( currentbook ),
			$parent = $book.parent();
		
		$book.data( 'opened', false ).removeClass( 'back-viewinside' ).on( transEndEventName, function(e) {
			$( this ).off( transEndEventName ).removeClass( 'back-outside' );
			$parent.css( 'z-index', $parent.data( 'stackval' ) );
		} );

	}

	return { init : init };

})();

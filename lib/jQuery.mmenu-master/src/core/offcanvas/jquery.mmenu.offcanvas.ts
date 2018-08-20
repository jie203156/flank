/*	
 * jQuery mmenu offCanvas add-on
 * mmenu.frebsite.nl
 */

(function( $ ) {

	const _PLUGIN_ = 'mmenu';
	const _ADDON_  = 'offCanvas';


	$[ _PLUGIN_ ].addons[ _ADDON_ ] = {

		//	setup: fired once per menu
		setup: function()
		{
			if ( !this.opts[ _ADDON_ ] )
			{
				return;
			}

			var that = this,
				opts = this.opts[ _ADDON_ ],
				conf = this.conf[ _ADDON_ ];

			glbl = $[ _PLUGIN_ ].glbl;


			//	Add methods to api
			this._api = $.merge( this._api, [ 'open', 'close', 'setPage' ] );


			//	Extend shorthand options
			if ( typeof opts != 'object' )
			{
				opts = {};
			}

			opts = this.opts[ _ADDON_ ] = $.extend( true, {}, $[ _PLUGIN_ ].defaults[ _ADDON_ ], opts );


			//	Extend configuration
			if ( typeof conf.pageSelector != 'string' )
			{
				conf.pageSelector = '> ' + conf.pageNodetype;
			}


			//	Setup the menu
			this.vars.opened = false;
			
			var clsn = [ _c.menu + '_offcanvas' ];


			//	support classes
			if ( !$[ _PLUGIN_ ].support.csstransforms )
			{
				clsn.push( _c[ 'no-csstransforms' ] );
			}
			if ( !$[ _PLUGIN_ ].support.csstransforms3d )
			{
				clsn.push( _c[ 'no-csstransforms3d' ] );
			}


			//	Add off-canvas behavior
			this.bind( 'initMenu:after',
				function()
				{
					var that = this;

					//	Setup the page
					this.setPage( glbl.$page );

					//	Setup the UI blocker and the window
					this._initBlocker();
					this[ '_initWindow_' + _ADDON_ ]();

					//	Setup the menu
					this.$menu
						.addClass( clsn.join( ' ' ) )
						.parent( '.' + _c.wrapper )
						.removeClass( _c.wrapper );

					//	Append to the <body>
					this.$menu[ conf.menuInsertMethod ]( conf.menuInsertSelector );

					//	Open if url hash equals menu id (usefull when user clicks the hamburger icon before the menu is created)
					var hash = window.location.hash;
					if ( hash )
					{
						var id = this._getOriginalMenuId();
						if ( id && id == hash.slice( 1 ) )
						{
							setTimeout(
								function()
								{
									that.open();
								}, 1000
							);
						}
					}
				}
			);


			//	Add screenreader / aria support
			this.bind( 'open:start:sr-aria',
				function()
				{
					this.__sr_aria( this.$menu, 'hidden', false );
				}
			);
			this.bind( 'close:finish:sr-aria',
				function()
				{
					this.__sr_aria( this.$menu, 'hidden', true );
				}
			);
			this.bind( 'initMenu:after:sr-aria',
				function()
				{
					this.__sr_aria( this.$menu, 'hidden', true );
				}
			);

		},

		//	add: fired once per page load
		add: function()
		{
			_c = $[ _PLUGIN_ ]._c;
			_d = $[ _PLUGIN_ ]._d;
			_e = $[ _PLUGIN_ ]._e;

			_c.add( 'slideout page no-csstransforms3d' );
			_d.add( 'style' );
		},

		//	clickAnchor: prevents default behavior when clicking an anchor
		clickAnchor: function( $a, inMenu )
		{
			var that = this;

			if ( !this.opts[ _ADDON_ ] )
			{
				return;
			}

			//	Open menu
			var id = this._getOriginalMenuId();
			if ( id )
			{
				if ( $a.is( '[href="#' + id + '"]' ) )
				{
					//	Opening this menu from within this menu
					//		-> Open menu
					if ( inMenu )
					{
						this.open();
						return true;
					}

					//	Opening this menu from within a second menu
					//		-> Close the second menu before opening this menu
					var $m = $a.closest( '.' + _c.menu );
					if ( $m.length )
					{
						var _m = $m.data( 'mmenu' );
						if ( _m && _m.close )
						{
							_m.close();
							that.__transitionend( $m,
								function()
								{
									that.open();
								}, that.conf.transitionDuration
							);
							return true;
						}
					}

					//	Opening this menu
					this.open();
					return true;
				}
			}

			//	Close menu
			if ( !glbl.$page )
			{
				return;
			}

			id = glbl.$page.first().attr( 'id' );
			if ( id )
			{
				if ( $a.is( '[href="#' + id + '"]' ) )
				{
					this.close();
					return true;
				}
			}

			return;
		}
	};


	//	Default options and configuration
	$[ _PLUGIN_ ].defaults[ _ADDON_ ] = {
		// position		: 'left',
		// zposition		: 'back',
		blockUI			: true,
		moveBackground	: true
	};
	$[ _PLUGIN_ ].configuration[ _ADDON_ ] = {
		pageNodetype		: 'div',
		pageSelector		: null,
		noPageSelector		: [],
		wrapPageIfNeeded	: true,
		menuInsertMethod	: 'prependTo',
		menuInsertSelector	: 'body'
	};


	//	Methods
	$[ _PLUGIN_ ].prototype.open = function()
	{
		this.trigger( 'open:before' );

		if ( this.vars.opened )
		{
			return;
		}

		var that = this;

		this._openSetup();

		//	Without the timeout, the animation won't work because the menu had display: none;
		setTimeout(
			function()
			{
				that._openFinish();
			}, this.conf.openingInterval
		);

		this.trigger( 'open:after' );
	};

	$[ _PLUGIN_ ].prototype._openSetup = function()
	{
		var that = this,
			opts = this.opts[ _ADDON_ ];

		//	Close other menus
		this.closeAllOthers();

		//	Store style and position
		glbl.$page.each(
			function()
			{
				$(this).data( _d.style, $(this).attr( 'style' ) || '' );
			}
		);

		//	Trigger window-resize to measure height
		glbl.$wndw.trigger( _e.resize + '-' + _ADDON_, [ true ] );

		var clsn = [ _c.wrapper + '_opened' ];

		//	Add options
		if ( opts.blockUI )
		{
			clsn.push( _c.wrapper + '_blocking' );
		}
		if ( opts.blockUI == 'modal' )
		{
			clsn.push( _c.wrapper + '_modal' );
		}
		if ( opts.moveBackground )
		{
			clsn.push( _c.wrapper + '_background' );
		}

		glbl.$html.addClass( clsn.join( ' ' ) );

		//	Open
		//	Without the timeout, the animation won't work because the menu had display: none;
		setTimeout(
			function()
			{
            	that.vars.opened = true;
        	}, this.conf.openingInterval
        );

		this.$menu.addClass( _c.menu + '_opened' );
	};

	$[ _PLUGIN_ ].prototype._openFinish = function()
	{
		var that = this;

		//	Callback
		this.__transitionend( glbl.$page.first(),
			function()
			{
				that.trigger( 'open:finish' );
			}, this.conf.transitionDuration
		);

		//	Opening
		this.trigger( 'open:start' );
		glbl.$html.addClass( _c.wrapper + '_opening' );
	};

	$[ _PLUGIN_ ].prototype.close = function()
	{
		this.trigger( 'close:before' );

		if ( !this.vars.opened )
		{
			return;
		}

		var that = this;

		//	Callback
		this.__transitionend( glbl.$page.first(),
			function()
			{
				that.$menu.removeClass( _c.menu + '_opened' );

				var clsn = [
					_c.wrapper + '_opened',
					_c.wrapper + '_blocking',
					_c.wrapper + '_modal',
					_c.wrapper + '_background'
				];

				glbl.$html.removeClass( clsn.join( ' ' ) );

				//	Restore style and position
				glbl.$page.each(
					function()
					{
						$(this).attr( 'style', $(this).data( _d.style ) );
					}
				);

				that.vars.opened = false;
				that.trigger( 'close:finish' );

			}, this.conf.transitionDuration
		);

		//	Closing
		this.trigger( 'close:start' );

		glbl.$html.removeClass( _c.wrapper + '_opening' );

		this.trigger( 'close:after' );
	};

	$[ _PLUGIN_ ].prototype.closeAllOthers = function()
	{
		glbl.$body
			.find( '.' + _c.menu + '_offcanvas' )
			.not( this.$menu )
			.each(
				function()
				{
					var api = $(this).data( _PLUGIN_ );
					if ( api && api.close )
					{
						api.close();
					}
				}
			);
	};

	$[ _PLUGIN_ ].prototype.setPage = function( $page )
	{
		this.trigger( 'setPage:before', $page );

		var that = this,
			conf = this.conf[ _ADDON_ ];

		if ( !$page || !$page.length )
		{
			$page = glbl.$body.find( conf.pageSelector );

			if ( conf.noPageSelector.length )
			{
				$page = $page.not( conf.noPageSelector.join( ', ' ) );
			}
			if ( $page.length > 1 && conf.wrapPageIfNeeded )
			{
				$page = $page
					.wrapAll( '<' + this.conf[ _ADDON_ ].pageNodetype + ' />' )
					.parent();
			}
		}

		$page.each(
			function()
			{
				$(this).attr( 'id', $(this).attr( 'id' ) || that.__getUniqueId() );		
			}
		);
		$page.addClass( _c.page + ' ' + _c.slideout );
		glbl.$page = $page;

		this.trigger( 'setPage:after', $page );
	};

	$[ _PLUGIN_ ].prototype[ '_initWindow_' + _ADDON_ ] = function()
	{
		//	Prevent tabbing
		glbl.$wndw
			.off( _e.keydown + '-' + _ADDON_ )
			.on(  _e.keydown + '-' + _ADDON_,
				function( e )
				{
					if ( glbl.$html.hasClass( _c.wrapper + '_opened' ) )
					{
						if ( e.keyCode == 9 )
						{
							e.preventDefault();
							return false;
						}
					}
				}
			);

		//	Set page min-height to window height
		var _h = 0;
		glbl.$wndw
			.off( _e.resize + '-' + _ADDON_ )
			.on(  _e.resize + '-' + _ADDON_,
				function( e, force )
				{
					if ( glbl.$page.length == 1 )
					{
						if ( force || glbl.$html.hasClass( _c.wrapper + '_opened' ) )
						{
							var nh = glbl.$wndw.height();
							if ( force || nh != _h )
							{
								_h = nh;
								glbl.$page.css( 'minHeight', nh );
							}
						}
					}
				}
			);
	};

	$[ _PLUGIN_ ].prototype._initBlocker = function()
	{
		var that = this;

		if ( !this.opts[ _ADDON_ ].blockUI )
		{
			return;
		}

		if ( !glbl.$blck )
		{
			glbl.$blck = $( '<div class="' + _c.page + '__blocker ' + _c.slideout + '" />' );
		}

		glbl.$blck
			.appendTo( glbl.$body )
			.off( _e.touchstart + '-' + _ADDON_ + ' ' + _e.touchmove + '-' + _ADDON_ )
			.on(  _e.touchstart + '-' + _ADDON_ + ' ' + _e.touchmove + '-' + _ADDON_,
				function( e )
				{
					e.preventDefault();
					e.stopPropagation();
					glbl.$blck.trigger( _e.mousedown + '-' + _ADDON_ );
				}
			)
			.off( _e.mousedown + '-' + _ADDON_ )
			.on(  _e.mousedown + '-' + _ADDON_,
				function( e )
				{
					e.preventDefault();
					if ( !glbl.$html.hasClass( _c.wrapper + '_modal' ) )
					{
						that.closeAllOthers();
						that.close();
					}
				}
			);
	};


	var _c, _d, _e, glbl;

})( jQuery );
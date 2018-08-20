/*!
 * jQuery mmenu v7.0.6
 * @requires jQuery 1.7.0 or later
 *
 * mmenu.frebsite.nl
 *	
 * Copyright (c) Fred Heusschen
 * www.frebsite.nl
 *
 * License: CC-BY-NC-4.0
 * http://creativecommons.org/licenses/by-nc/4.0/
 */

(function( $ ) {

	const _PLUGIN_  = 'mmenu';
	const _VERSION_	= '7.0.6';


	//	Newer version of the plugin already excists
	if ( $[ _PLUGIN_ ] && $[ _PLUGIN_ ].version > _VERSION_ )
	{
		return;
	}


	/*
		Class
	*/
	$[ _PLUGIN_ ] = function( $menu, opts, conf )
	{
		this.$menu	= $menu;
		this._api	= [ 'bind', 'getInstance', 'initPanels', 'openPanel', 'closePanel', 'closeAllPanels', 'setSelected' ];
		this.opts	= opts;
		this.conf	= conf;
		this.vars	= {};
		this.cbck	= {};
		this.mtch 	= {};


		if ( typeof this.___deprecated == 'function' )
		{
			this.___deprecated();
		}

		this._initWrappers();
		this._initAddons();
		this._initExtensions();
		this._initHooks();

		this._initMenu();
		this._initPanels();
		this._initOpened();
		this._initAnchors();
		this._initMatchMedia();

		if ( typeof this.___debug == 'function' )
		{
			this.___debug();
		}

		return this;
	};

	$[ _PLUGIN_ ].version 	= _VERSION_;
	$[ _PLUGIN_ ].uniqueId 	= 0;
	$[ _PLUGIN_ ].wrappers 	= {};
	$[ _PLUGIN_ ].addons  	= {};


	$[ _PLUGIN_ ].defaults  = {
		hooks 			: {},
		extensions		: [],
		wrappers		: [],
		navbar 			: {
			add 			: true,
			title			: 'Menu',
			titleLink		: 'parent'
		},
		onClick			: {
//			close			: true,
//			preventDefault	: null,
			setSelected		: true
		},
		slidingSubmenus	: true
	};

	$[ _PLUGIN_ ].configuration = {
		classNames			: {
			divider		: 'Divider',
			inset 		: 'Inset',
			nolistview 	: 'NoListview',
			nopanel		: 'NoPanel',
			panel		: 'Panel',
			selected	: 'Selected',
			spacer		: 'Spacer',
			vertical	: 'Vertical'
		},
		clone				: false,
		openingInterval		: 25,
		panelNodetype		: 'ul, ol, div',
		transitionDuration	: 400
	};

	$[ _PLUGIN_ ].prototype = {

		getInstance: function()
		{
			return this;
		},

		initPanels: function( $panels )
		{
			this._initPanels( $panels );
		},

		openPanel: function( $panel, animation )
		{
			this.trigger( 'openPanel:before', $panel );

			if ( !$panel || !$panel.length )
			{
				return;
			}
			if ( !$panel.is( '.' + _c.panel ) )
			{
				$panel = $panel.closest( '.' + _c.panel )
			}
			if ( !$panel.is( '.' + _c.panel ) )
			{
				return;
			}


			var that = this;

			if ( typeof animation != 'boolean' )
			{
				animation = true;
			}


			//	vertical
			if ( $panel.parent( '.' + _c.listitem + '_vertical' ).length )
			{

				//	Open current and all vertical parent panels
				$panel
					.parents( '.' + _c.listitem + '_vertical' )
					.addClass( _c.listitem + '_opened' )
					.children( '.' + _c.panel )
					.removeClass( _c.hidden );

				//	Open first non-vertical parent panel
				this.openPanel( 
					$panel
						.parents( '.' + _c.panel )
						.not(
							function()
							{
								return $(this).parent( '.' + _c.listitem + '_vertical' ).length
							}
						)
						.first()
				);

				this.trigger( 'openPanel:start' , $panel );
				this.trigger( 'openPanel:finish', $panel );
			}

			//	Horizontal
			else
			{
				if ( $panel.hasClass( _c.panel + '_opened' ) )
				{
					return;
				}

				var $panels 	= this.$pnls.children( '.' + _c.panel ),
					$current 	= this.$pnls.children( '.' + _c.panel + '_opened' );

				//	old browser support
				if ( !$[ _PLUGIN_ ].support.csstransitions )
				{
					$current
						.addClass( _c.hidden )
						.removeClass( _c.panel + '_opened' );

					$panel
						.removeClass( _c.hidden )
						.addClass( _c.panel + '_opened' );

					this.trigger( 'openPanel:start' , $panel );
					this.trigger( 'openPanel:finish', $panel );
					return;
				}
				//	/old browser support

				//	'Close' all children
				$panels
					.not( $panel )
					.removeClass( _c.panel + '_opened-parent' );

				//	'Open' all parents
				var $parent = $panel.data( _d.parent );
				while( $parent )
				{
					$parent = $parent.closest( '.' + _c.panel );
					if ( !$parent.parent( '.' + _c.listitem + '_vertical' ).length )
					{
						$parent.addClass( _c.panel + '_opened-parent' );
					}
					$parent = $parent.data( _d.parent );
				}

				//	Add classes for animation
				$panels
					.removeClass( _c.panel + '_highest' )
					.not( $current )
					.not( $panel )
					.addClass( _c.hidden );

				$panel
					.removeClass( _c.hidden );

				var openPanelStart = function()
				{
					$current.removeClass( _c.panel + '_opened' );
					$panel.addClass( _c.panel + '_opened' );

					if ( $panel.hasClass( _c.panel + '_opened-parent' ) )
					{
						$current.addClass( _c.panel + '_highest' );
						$panel.removeClass( _c.panel + '_opened-parent' );
					}
					else
					{
						$current.addClass( _c.panel + '_opened-parent' );
						$panel.addClass( _c.panel + '_highest' );
					}

					that.trigger( 'openPanel:start', $panel );
				};


				var openPanelFinish = function()
				{
					$current.removeClass( _c.panel + '_highest' ).addClass( _c.hidden );
					$panel.removeClass( _c.panel + '_highest' );

					that.trigger( 'openPanel:finish', $panel );
				}

				if ( animation && !$panel.hasClass( _c.panel + '_noanimation' ) )
				{
					//	Without the timeout the animation will not work because the element had display: none;
					setTimeout(
						function()
						{
							//	Callback
							that.__transitionend( $panel,
								function()
								{
									openPanelFinish();
								}, that.conf.transitionDuration
							);

							openPanelStart();

						}, that.conf.openingInterval
					);
				}
				else
				{
					openPanelStart();
					openPanelFinish();
				}
			}

			this.trigger( 'openPanel:after', $panel );
		},

		closePanel: function( $panel )
		{
			this.trigger( 'closePanel:before', $panel );

			var $li = $panel.parent();

			//	Vertical
			if ( $li.hasClass( _c.listitem + '_vertical' ) )
			{
				$li.removeClass( _c.listitem + '_opened' );
				$panel.addClass( _c.hidden );

				this.trigger( 'closePanel', $panel );
			}

			this.trigger( 'closePanel:after', $panel );
		},

		closeAllPanels: function( $panel )
		{
			this.trigger( 'closeAllPanels:before' );

			//	Vertical
			this.$pnls
				.find( '.' + _c.listview )
				.children()
				.removeClass(  _c.listitem + '_selected' )
				.filter( '.' + _c.listitem + '_vertical' )
				.removeClass(  _c.listitem + '_opened' );

			//	Horizontal
			var $pnls = this.$pnls.children( '.' + _c.panel ),
				$frst = ( $panel && $panel.length ) ? $panel : $pnls.first();

			this.$pnls
				.children( '.' + _c.panel )
				.not( $frst )
				.removeClass( _c.panel + '_opened' )
				.removeClass( _c.panel + '_opened-parent' )
				.removeClass( _c.panel + '_highest' )
				.addClass( _c.hidden );

			this.openPanel( $frst, false );

			this.trigger( 'closeAllPanels:after' );
		},
		
		togglePanel: function( $panel )
		{
			var $li = $panel.parent();

			//	Vertical only
			if ( $li.hasClass( _c.listitem + '_vertical' ) )
			{
				this[ $li.hasClass( _c.listitem + '_opened' ) ? 'closePanel' : 'openPanel' ]( $panel );
			}
		},

		setSelected: function( $li )
		{
			this.trigger( 'setSelected:before', $li );

			this.$menu
				.find( '.' + _c.listitem + '_selected' )
				.removeClass( _c.listitem + '_selected' );

			$li.addClass( _c.listitem + '_selected' );

			this.trigger( 'setSelected:after', $li );
		},

		bind: function( evnt, fn )
		{
			this.cbck[ evnt ] = this.cbck[ evnt ] || [];
			this.cbck[ evnt ].push( fn );
		},

		trigger: function()
		{
			var that = this,
				args = Array.prototype.slice.call( arguments ),
				evnt = args.shift();

			if ( this.cbck[ evnt ] )
			{
				for ( var e = 0, l = this.cbck[ evnt ].length; e < l; e++ )
                {
                    this.cbck[ evnt ][ e ].apply( that, args );
                }
			}
		},

		matchMedia: function( mdia, yes, no )
		{
			var that = this,
				func = {
					'yes': yes,
					'no' : no
				};

			//	Bind to windowResize
			this.mtch[ mdia ] = this.mtch[ mdia ] || [];
			this.mtch[ mdia ].push( func );
		},

		_initHooks: function()
		{
			for ( var h in this.opts.hooks )
			{
				this.bind( h, this.opts.hooks[ h ] );
			}
		},

		_initWrappers: function()
		{
			this.trigger( 'initWrappers:before' );

			for ( var w = 0; w < this.opts.wrappers.length; w++ )
			{
				var wrapper = $[ _PLUGIN_ ].wrappers[ this.opts.wrappers[ w ] ];
				if ( typeof wrapper == 'function' )
				{
					wrapper.call( this );
				}
			}

			this.trigger( 'initWrappers:after' );
		},

		_initAddons: function()
		{
			this.trigger( 'initAddons:before' );

			var a;
			for ( a in $[ _PLUGIN_ ].addons )
			{
				$[ _PLUGIN_ ].addons[ a ].add.call( this );
				$[ _PLUGIN_ ].addons[ a ].add = function() {};
			}
			for ( a in $[ _PLUGIN_ ].addons )
			{
				$[ _PLUGIN_ ].addons[ a ].setup.call( this );
			}

			this.trigger( 'initAddons:after' );
		},

		_initExtensions: function()
		{
			this.trigger( 'initExtensions:before' );

			var that = this;

			//	Convert array to object with array
			if ( this.opts.extensions.constructor === Array )
			{
				this.opts.extensions = {
					'all': this.opts.extensions
				};
			}

			//	Loop over object
			for ( var mdia in this.opts.extensions )
			{
				this.opts.extensions[ mdia ] = this.opts.extensions[ mdia ].length ? _c.menu + '_' + this.opts.extensions[ mdia ].join( ' ' + _c.menu + '_' ) : '';
				if ( this.opts.extensions[ mdia ] )
				{
					(function( mdia ) {
						that.matchMedia( mdia,
							function()
							{
								this.$menu.addClass( this.opts.extensions[ mdia ] );
							},
							function()
							{
								this.$menu.removeClass( this.opts.extensions[ mdia ] );
							}
						);
					})( mdia );
				}
			}
			this.trigger( 'initExtensions:after' );
		},

		_initMenu: function()
		{
			this.trigger( 'initMenu:before' );

			var that = this;

			//	Clone if needed
			if ( this.conf.clone )
			{
				this.$orig = this.$menu;
				this.$menu = this.$orig.clone();
				this.$menu.add( this.$menu.find( '[id]' ) )
					.filter( '[id]' )
					.each(
						function()
						{
							$(this).attr( 'id', _c.mm( $(this).attr( 'id' ) ) );
						}
					);
			}

			//	Add ID
			this.$menu.attr( 'id', this.$menu.attr( 'id' ) || this.__getUniqueId() );

			//	Add markup
			this.$pnls = $( '<div class="' + _c.panels + '" />' )
				.append( this.$menu.children( this.conf.panelNodetype ) )
				.prependTo( this.$menu );

			//	Add classes
			this.$menu
				.addClass( _c.menu )
				.parent()
				.addClass( _c.wrapper );

			this.trigger( 'initMenu:after' );
		},

		_initPanels: function( $panels )
		{
			this.trigger( 'initPanels:before', $panels );

			$panels = $panels || this.$pnls.children( this.conf.panelNodetype );

			var $newpanels = $();

			var that = this;
			var init = function( $panels )
			{
				$panels
					.filter( that.conf.panelNodetype )
					.each(
						function( x )
						{

							var $panel = that._initPanel( $(this) );
							if ( $panel )
							{

								that._initNavbar( $panel );
								that._initListview( $panel );

								$newpanels = $newpanels.add( $panel );

								//	init child panels
								var $child = $panel
									.children( '.' + _c.listview )
									.children( 'li' )
									.children( that.conf.panelNodetype )
									.add( $panel.children( '.' + that.conf.classNames.panel ) );

								if ( $child.length )
								{
									init( $child );
								}
							}
						}
					);
			};

			init( $panels );

			this.trigger( 'initPanels:after', $newpanels );
		},

		_initPanel: function( $panel )
		{
			this.trigger( 'initPanel:before', $panel );

			var that = this;

			//	Stop if already a panel
			if ( $panel.hasClass( _c.panel ) )
			{
				return $panel;
			}

			//	Refactor panel classnames
			this.__refactorClass( $panel, this.conf.classNames.panel 	, _c.panel 		);
			this.__refactorClass( $panel, this.conf.classNames.nopanel 	, _c.nopanel 	);
			this.__refactorClass( $panel, this.conf.classNames.inset 	, _c.listview + '_inset'	);

			$panel.filter( '.' + _c.listview + '_inset' )
				.addClass( _c.nopanel );


			//	Stop if not supposed to be a panel
			if ( $panel.hasClass( _c.nopanel ) )
			{
				return false;
			}


			//	Wrap UL/OL in DIV
			var vertical = ( $panel.hasClass( this.conf.classNames.vertical ) || !this.opts.slidingSubmenus );
			$panel.removeClass( this.conf.classNames.vertical );

			var id = $panel.attr( 'id' ) || this.__getUniqueId();

			if ( $panel.is( 'ul, ol' ) )
			{
				$panel.removeAttr( 'id' );

				$panel.wrap( '<div />' );
				$panel = $panel.parent();
			}

			$panel.attr( 'id', id );
			$panel.addClass( _c.panel + ' ' + _c.hidden );

			var $parent = $panel.parent( 'li' );

			if ( vertical )
			{
				$parent.addClass( _c.listitem + '_vertical' );
			}
			else
			{
				$panel.appendTo( this.$pnls );
			}

			//	Store parent/child relation
			if ( $parent.length )
			{
				$parent.data( _d.child, $panel );
				$panel.data( _d.parent, $parent );
			}

			this.trigger( 'initPanel:after', $panel );

			return $panel;
		},

		_initNavbar: function( $panel )
		{
			this.trigger( 'initNavbar:before', $panel );

			if ( $panel.children( '.' + _c.navbar ).length )
			{
				return;
			}

			var $parent = $panel.data( _d.parent ),
				$navbar = $( '<div class="' + _c.navbar + '" />' );

			var title: string = this.__getPanelTitle( $panel, this.opts.navbar.title );
			var href : string = '';

			if ( $parent && $parent.length )
			{
				if ( $parent.hasClass( _c.listitem + '_vertical' ) )
				{
					return;
				}

				//	Listview, the panel wrapping this panel
				if ( $parent.parent().is( '.' + _c.listview ) )
				{
					var $a = $parent
						.children( 'a, span' )
						.not( '.' + _c.btn + '_next' );
				}

				//	Non-listview, the first anchor in the parent panel that links to this panel
				else
				{
					var $a = $parent
						.closest( '.' + _c.panel )
						.find( 'a[href="#' + $panel.attr( 'id' ) + '"]' );
				}

				$a = $a.first();
				$parent = $a.closest( '.' + _c.panel );

				var id = $parent.attr( 'id' );
				title = this.__getPanelTitle( $panel, $('<span>' + $a.text() + '</span>').text() );

				switch ( this.opts.navbar.titleLink )
				{
					case 'anchor':
						href = $a.attr( 'href' );
						break;

					case 'parent':
						href = '#' + id;
						break;
				}

				$navbar.append( '<a class="' + _c.btn + ' ' + _c.btn + '_prev ' + _c.navbar + '__btn" href="#' + id + '" />' );
			}
			else if ( !this.opts.navbar.title )
			{
				return;
			}

			if ( this.opts.navbar.add )
			{
				$panel.addClass( _c.panel + '_has-navbar' );
			}

			$navbar.append( '<a class="' + _c.navbar + '__title"' + ( href.length ? ' href="' + href + '"' : '' ) + '>' + title + '</a>' )
				.prependTo( $panel );

			this.trigger( 'initNavbar:after', $panel );
		},

		_initListview: function( $panel )
		{
			this.trigger( 'initListview:before', $panel );

			//	Refactor listviews classnames
			var $ul = this.__childAddBack( $panel, 'ul, ol' );

			this.__refactorClass( $ul, this.conf.classNames.nolistview 	, _c.nolistview );


			//	Refactor listitems classnames
			var $li = $ul
				.not( '.' + _c.nolistview )
				.addClass( _c.listview )
				.children()
				.addClass( _c.listitem );

			this.__refactorClass( $li, this.conf.classNames.selected 	, _c.listitem + '_selected' );
			this.__refactorClass( $li, this.conf.classNames.divider 	, _c.listitem + '_divider'	);
			this.__refactorClass( $li, this.conf.classNames.spacer 		, _c.listitem + '_spacer'	);


			//	Add open link to parent listitem
			var $parent = $panel.data( _d.parent );
			if ( $parent && $parent.is( '.' + _c.listitem ) )
			{
				if ( !$parent.children( '.' + _c.btn + '_next' ).length )
				{
					var $a = $parent.children( 'a, span' ).first(),
						$b = $( '<a class="' + _c.btn + '_next' + '" href="#' + $panel.attr( 'id' ) + '" />' ).insertBefore( $a );

					if ( $a.is( 'span' ) )
					{
						$b.addClass( _c.btn + '_fullwidth' );
					}
				}
			}

			this.trigger( 'initListview:after', $panel );
		},

		_initOpened: function()
		{
			this.trigger( 'initOpened:before' );

			var $selected = this.$pnls
				.find( '.' + _c.listitem + '_selected' )
				.removeClass( _c.listitem + '_selected' )
				.last()
				.addClass( _c.listitem + '_selected' );

			var $current = ( $selected.length ) 
				? $selected.closest( '.' + _c.panel )
				: this.$pnls.children( '.' + _c.panel ).first();

			this.openPanel( $current, false );

			this.trigger( 'initOpened:after' );
		},

		_initAnchors: function()
		{
			this.trigger( 'initAnchors:before' );

			var that = this;

			glbl.$body
				.on( _e.click + '-oncanvas',
					'a[href]',
					function( e )
					{
						var $t = $(this),
							_h = $t.attr( 'href' );

						var inMenu 		= that.$menu.find( $t ).length, 
							inListview 	= $t.is( '.' + _c.listitem + ' > a' ),
							toExternal 	= $t.is( '[rel="external"]' ) || $t.is( '[target="_blank"]' );


						//	Open/Close panel
						if ( inMenu )
						{
							if ( _h.length > 1 && _h.slice( 0, 1 ) == '#' )
							{
								try
								{
									var $h = that.$menu.find( _h );
									if ( $h.is( '.' + _c.panel ) )
									{
										that[ $t.parent().hasClass( _c.listitem + '_vertical' ) ? 'togglePanel' : 'openPanel' ]( $h );

										e.preventDefault();
										return;
									}
								}
								catch( err ) {}
							}
						}


						var onClick = {
							close 			: null,
							setSelected 	: null,
							preventDefault	: _h.slice( 0, 1 ) == '#'
						};

						//	Find behavior for addons
						for ( var a in $[ _PLUGIN_ ].addons )
						{
							var addonClick = $[ _PLUGIN_ ].addons[ a ].clickAnchor.call( that, $t, inMenu, inListview, toExternal );
							if ( addonClick )
							{
								if ( typeof addonClick == 'boolean' )
								{
									e.preventDefault();
									return;
								}
								if ( typeof addonClick == 'object' )
								{
									onClick = $.extend( {}, onClick, addonClick );
								}
							}
						}


						//	All other anchors in lists
						if ( inMenu && inListview && !toExternal )
						{

							//	Set selected item, Default: true
							if ( that.__valueOrFn( $t, that.opts.onClick.setSelected, onClick.setSelected ) )
							{
								that.setSelected( $(e.target).parent() );
							}

							//	Prevent default / don't follow link. Default: false
							if ( that.__valueOrFn( $t, that.opts.onClick.preventDefault, onClick.preventDefault ) )
							{
								e.preventDefault();
							}

							//	Close menu. Default: false
							if ( that.__valueOrFn( $t, that.opts.onClick.close, onClick.close ) )
							{
								if ( that.opts.offCanvas && typeof that.close == 'function' )
								{
									that.close();
								}
							}
						}

					}
				);

			this.trigger( 'initAnchors:after' );
		},

		_initMatchMedia: function()
		{
			var that = this;
			
			for ( var mdia in this.mtch )
			{
				(function() {
					var mdi = mdia,
						mql = window.matchMedia( mdi );

					that._fireMatchMedia( mdi, mql );
					mql.addListener(
						function( mql )
						{
							that._fireMatchMedia( mdi, mql );
						}
					);
				})();
			}
		},

		_fireMatchMedia: function( mdia, m )
		{
			var fn = m.matches ? 'yes' : 'no';
			for ( var i = 0; i < this.mtch[ mdia ].length; i++ )
			{
				this.mtch[ mdia ][ i ][ fn ].call( this );
			}
		},

		_getOriginalMenuId: function()
		{
			var id = this.$menu.attr( 'id' );
			if ( this.conf.clone && id && id.length )
			{
				id = _c.umm( id );
			}
			return id;
		},

		__api: function()
		{
			var that = this,
				api = {};

			$.each( this._api, 
				function( i )
				{
					var fn = this;
					api[ fn ] = function()
					{
						var re = that[ fn ].apply( that, arguments );
						return ( typeof re == 'undefined' ) ? api : re;
					};
				}
			);
			return api;
		},

		__valueOrFn: function( $e, o, d )
		{
			if ( typeof o == 'function' )
			{
				var v = o.call( $e[ 0 ] );
				if ( typeof v != 'undefined' )
				{
					return v;
				}
			}
			if ( ( typeof o == 'function' || typeof o == 'undefined' ) && typeof d != 'undefined' )
			{
				return d;
			}
			return o;
		},

		__getPanelTitle: function( $p, d )
		{
			var title: string;

			//	Function
			if ( typeof this.opts.navbar.title == 'function' )
			{
				title = this.opts.navbar.title.call( $p[ 0 ] );
			}

			//	Data attr
			if ( typeof title == 'undefined' )
			{
				title = $p.data( _d.title );
			}

			if ( typeof title != 'undefined' )
			{
				return title;
			}

			//	Fallback
			if ( typeof d == 'string' )
			{
				return $[ _PLUGIN_ ].i18n( d );
			}

			//	Default
			return $[ _PLUGIN_ ].i18n( $[ _PLUGIN_ ].defaults.navbar.title );
		},

		__refactorClass: function( $e, o, c )
		{
			return $e.filter( '.' + o ).removeClass( o ).addClass( c );
		},

		__findAddBack: function( $e, s )
		{
			return $e.find( s ).add( $e.filter( s ) );
		},
		__childAddBack: function( $e, s )
		{
			return $e.children( s ).add( $e.filter( s ) );
		},

		__filterListItems: function( $li )
		{
			return $li
				.not( '.' + _c.listitem + '_divider' )
				.not( '.' + _c.hidden );
		},
		__filterListItemAnchors: function( $li )
		{
			return this.__filterListItems( $li )
				.children( 'a' )
				.not( '.' + _c.btn + '_next' );
		},

		__openPanelWoAnimation( $panel )
		{
			if ( $panel.hasClass( _c.panel + '_noanimation' ) )
			{
				return;
			}

			$panel.addClass( _c.panel + '_noanimation' );
			this.__transitionend( $panel,
				function()
				{
					$panel.removeClass( _c.panel + '_noanimation' );
				}, this.conf.openingInterval
			);
			this.openPanel( $panel );
		},

		__transitionend: function( $e, fn, duration )
		{
			var _ended = false,
				_fn = function( e )
				{
					if ( typeof e !== 'undefined' )
					{
						if ( e.target != $e[ 0 ] )
						{
							return;
						}
					}

					if ( !_ended )
					{
						$e.off( _e.transitionend );
						$e.off( _e.webkitTransitionEnd );
						fn.call( $e[ 0 ] );
					}
					_ended = true;
				};

			$e.on( _e.transitionend, _fn );
			$e.on( _e.webkitTransitionEnd, _fn );
			setTimeout( _fn, duration * 1.1 );
		},
		
		__getUniqueId: function()
		{
			return _c.mm( $[ _PLUGIN_ ].uniqueId++ );
		}
	};


	/*
		jQuery plugin
	*/
	$.fn[ _PLUGIN_ ] = function( opts, conf )
	{
		//	First time plugin is fired
		initPlugin();

		//	Extend options
		opts = $.extend( true, {}, $[ _PLUGIN_ ].defaults, opts );
		conf = $.extend( true, {}, $[ _PLUGIN_ ].configuration, conf );

		var $result = $();
		this.each(
			function()
			{
				var $menu = $(this);
				if ( $menu.data( _PLUGIN_ ) )
				{
					return;
				}

				var _menu = new $[ _PLUGIN_ ]( $menu, opts, conf );
				_menu.$menu.data( _PLUGIN_, _menu.__api() );

				$result = $result.add( _menu.$menu );
			}
		);

		return $result;
	};


	/*
		I18N
	*/
	$[ _PLUGIN_ ].i18n = (function() {

		var trns = {};

		return function( t )
		{
			switch( typeof t )
			{
				case 'object':
					$.extend( trns, t );
					return trns;

				case 'string':
					return trns[ t ] || t;

				case 'undefined':
				default:
					return trns;
			}
		};
	})();


	/*
		SUPPORT
	*/
	$[ _PLUGIN_ ].support = {

		touch: 'ontouchstart' in window || navigator.msMaxTouchPoints || false,

		csstransitions: (function()
		{
			if ( typeof Modernizr !== 'undefined' &&
				 typeof Modernizr.csstransitions !== 'undefined'
			) {
				return Modernizr.csstransitions;
			}

			//	w/o Modernizr, we'll assume you only support modern browsers :/
			return true;
		})(),

		csstransforms: (function() {
			if ( typeof Modernizr !== 'undefined' &&
				 typeof Modernizr.csstransforms !== 'undefined'
			) {
				return Modernizr.csstransforms;
			}

			//	w/o Modernizr, we'll assume you only support modern browsers :/
			return true;
		})(),

		csstransforms3d: (function() {
			if ( typeof Modernizr !== 'undefined' &&
				 typeof Modernizr.csstransforms3d !== 'undefined'
			) {
				return Modernizr.csstransforms3d;
			}

			//	w/o Modernizr, we'll assume you only support modern browsers :/
			return true;
		})()
	};


	//	Global variables
	var _c, _d, _e, glbl;

	function initPlugin()
	{
		if ( $[ _PLUGIN_ ].glbl )
		{
			return;
		}

		glbl = {
			$wndw : $(window),
			$docu : $(document),
			$html : $('html'),
			$body : $('body')
		};


		//	Classnames, Datanames, Eventnames
		_c = {};
		_d = {};
		_e = {};

		$.each( [ _c, _d, _e ],
			function( i, o )
			{
				o.add = function( a )
				{
					a = a.split( ' ' );
					for ( var b = 0, l = a.length; b < l; b++ )
					{
						o[ a[ b ] ] = o.mm( a[ b ] );
					}
				};
			}
		);

		//	Classnames
		_c.mm = function( c ) { return 'mm-' + c; };
		_c.add( 'wrapper menu panels panel nopanel navbar listview nolistview listitem btn hidden' );
		_c.umm = function( c )
		{
			if ( c.slice( 0, 3 ) == 'mm-' )
			{
				c = c.slice( 3 );
			}
			return c;
		};

		//	Datanames
		_d.mm = function( d ) { return 'mm-' + d; };
		_d.add( 'parent child title' );

		//	Eventnames
		_e.mm = function( e ) { return e + '.mm'; };
		_e.add( 'transitionend webkitTransitionEnd click scroll resize keydown mousedown mouseup touchstart touchmove touchend orientationchange' );


		$[ _PLUGIN_ ]._c = _c;
		$[ _PLUGIN_ ]._d = _d;
		$[ _PLUGIN_ ]._e = _e;

		$[ _PLUGIN_ ].glbl = glbl;
	}


})( jQuery );

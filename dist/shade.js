(function(factory) {
    if (typeof define === 'function' && define.amd) {
        define([
            '$',
            'plugin',
            'velocity'
        ], factory);
    } else {
        var framework = window.Zepto || window.jQuery;
        factory(framework, window.Plugin, framework.Velocity);
    }
}(function($, Plugin, Velocity) {
    function Shade(element, options) {
        Shade.__super__.call(this, element, options, Shade.DEFAULTS);
    }

    Shade.VERSION = '1.0.6';

    Shade.DEFAULTS = {
        cover: document.body,
        color: 'black',
        opacity: '0.25',
        duration: 150,
        easing: 'swing',
        padding: 10,
        zIndex: 1,
        cssClass: '',
        click: function() {
            this.close();
        },
        open: $.noop,
        opened: $.noop,
        close: $.noop,
        closed: $.noop
    };

    Plugin.create('shade', Shade, {
        _init: function(element) {
            var plugin = this;

            this.$element = $(element);

            this.isBody = $(this.options.cover).is('body');

            this.$shade = $('<div />')
                .addClass('shade')
                .addClass(this.options.cssClass)
                .css({
                    background: this.options.color ? this.options.color : '',
                    opacity: 0,
                    '-webkit-tap-highlight-color': 'rgba(0,0,0,0)'
                })
                .hide()
                .on('click', function() {
                    plugin.options.click && plugin.options.click.call(plugin);
                })
                .insertAfter(this.$element);

            $(window)
                .on('resize:shade', function() {
                    plugin.$shade.hasClass('shade--is-open') && plugin.setPosition.call(plugin);
                });
        },

        open: function() {
            var plugin = this;

            this._trigger('open');

            this.setPosition();

            Velocity.animate(
                this.$shade,
                {
                    opacity: this.options.opacity
                },
                {
                    display: 'block',
                    duration: this.options.duration,
                    easing: this.options.easing,
                    complete: function() {
                        plugin.$shade
                            .addClass('shade--is-open')
                            .on('touchmove', function() {
                                return false;
                            });

                        plugin._trigger('opened');
                    }
                }
            );
        },

        close: function() {
            var plugin = this;

            this._trigger('close');

            Velocity.animate(
                this.$shade,
                'reverse',
                {
                    display: 'none',
                    duration: this.options.duration,
                    easing: this.options.easing,
                    complete: function() {
                        plugin.$shade
                            .removeClass('shade--is-open')
                            .off('touchmove');

                        plugin._trigger('closed');
                    }
                }
            );
        },

        setPosition: function() {
            var $element = this.$element;
            var width = this.isBody ? 'auto' : $element.width();
            var height = this.isBody ? 'auto' : $element.height();
            var position = this.isBody ? 'fixed' : 'absolute';

            this.$shade
                .css({
                    left: -this.options.padding,
                    top: -this.options.padding,
                    bottom: -this.options.padding,
                    right: -this.options.padding,
                    width: this.options.padding ? width - this.options.padding : width,
                    height: this.options.padding ? height - this.options.padding : height,
                    position: position,
                    padding: this.options.padding,
                    zIndex: this.options.zIndex || $element.css('zIndex') + 1
                });
        }
    });

    return $;
}));


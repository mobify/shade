
(function(factory) {
    if (typeof define === 'function' && define.amd) {
        define([
            '$',
            'velocity'
        ], factory);
    } else {
        factory(window.Zepto || window.jQuery);
    }
}(function($, Velocity) {
    var PLUGIN_NAME = 'shade';
    var noop = function() {};

    function Shade(element, options) {
        this._init(element, options);
    }

    Shade.VERSION = '0';

    Shade.DEFAULTS = {
        cover: document.body,
        color: 'black',
        opacity: '0.25',
        duration: 150,
        easing: 'swing',
        padding: 0,
        zIndex: 1,
        click: function() {
            this.close();
        },
        open: noop,
        opened: noop,
        close: noop,
        closed: noop
    };

    Shade.prototype._init = function(element, options) {
        var plugin = this;

        this.options = $.extend(true, {}, Shade.DEFAULTS, options);

        this.$element = $(element);

        this.isBody = $(this.options.cover).is('body');

        this.$shade = $('<div />')
            .addClass('shade')
            .css({
                background: this.options.color ? this.options.color : '',
                opacity: 0
            })
            .hide()
            .on('click', function() {
                plugin.options.click.call(plugin);
            })
            .insertAfter(this.$element);

        $(window)
            .on('resize:shade', function() {
                plugin.$shade.hasClass('shade--is-open') && plugin.setPosition.call(plugin);
            });
    };

    Shade.prototype.open = function() {
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
    };

    Shade.prototype.close = function() {
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
    };

    Shade.prototype.setPosition = function() {
        var $element = this.$element;
        var width = this.isBody ? 'auto' : $element.outerWidth(false);
        var height = this.isBody ? 'auto' : $element.outerHeight(false);
        var position = this.isBody ? 'fixed' : 'absolute';

        this.$shade
            .css({
                left: this.options.padding ? -this.options.padding : 0,
                top: this.options.padding ? -this.options.padding : 0,
                bottom: this.options.padding ? -this.options.padding : 0,
                right: this.options.padding ? -this.options.padding : 0,
                width: this.options.padding ? width - this.options.padding : width,
                height: this.options.padding ? height - this.options.padding : height,
                position: position,
                padding: this.options.padding,
                zIndex: this.options.zIndex || $element.css('zIndex') + 1
            });
    };

    Shade.prototype._trigger = function(eventName, data) {
        eventName in this.options && this.options[eventName].call(this, $.Event(PLUGIN_NAME + ':' + eventName, { bubbles: false }), data);
    };

    $.fn.shade = function(option) {
        var args = Array.prototype.slice.call(arguments);

        return this.each(function() {
            var $this = $(this);
            var shade = $this.data(PLUGIN_NAME);
            var isMethodCall = typeof option === 'string';

            // If shade isn't initialized, we lazy-load initialize it. If it's
            // already initialized, we can safely ignore the call.
            if (!shade) {
                if (isMethodCall) {
                    throw 'cannot call methods on shade prior to initialization; attempted to call method "' + option + '"';
                }
                $this.data(PLUGIN_NAME, (shade = new Shade(this, option)));
            }

            // invoke a public method on shade, and skip private methods
            if (isMethodCall) {
                if (option.charAt(0) === '_' || typeof shade[option] !== 'function') {
                    throw 'no such method "' + option + '" for shade';
                }

                shade[option].apply(shade, args.length > 1 ? args.slice(1) : null);
            }
        });
    };

    $.fn.shade.Constructor = Shade;

    return $;
}));


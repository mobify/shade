define([
    'text!fixtures/shade.html',
    '$',
    'shade'
], function(fixture, $) {
    var Shade;
    var element;

    describe('Shade constructor', function() {
        beforeEach(function() {
            Shade = $.fn.shade.Constructor;
            element = $(fixture);
        });

        it('creates a shade instance', function() {
            var shade = new Shade(element);

            assert.isDefined(shade);
        });
    });
});
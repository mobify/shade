define([
    'text!fixtures/shade.html',
    '$',
    'shade'
], function(fixture, $) {
    var Pinny;
    var element;
    var shade;

    describe('Shade constructor', function() {
        beforeEach(function() {
            Shade = $.fn.shade.Constructor;
            element = $(fixture);
        });

        afterEach(function() {
            shade.destroy();
        });

        it('creates a shade instance', function() {
            shade = new Shade(element);

            assert.isDefined(shade);
        });
    });
});
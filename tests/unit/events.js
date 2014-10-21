define([
    'text!fixtures/shade.html',
    '$',
    'shade',
    'touch-events'
], function(fixture, $) {
    var element;

    describe('Shade events', function() {
        beforeEach(function() {
            element = $(fixture);
        });

        it('fires the open event when shade is opened', function(done) {
            element.shade({
                open: function() {
                    done();
                }
            });

            element.shade('open');
        });

        it('fires the opened event when shade is opened', function(done) {
            element.shade({
                opened: function() {
                    done();
                }
            });

            element.shade('open');
        });

        it('fires the close event when shade is closed', function(done) {
            element.shade({
                opened: function() {
                    element.shade('close');
                },
                close: function() {
                    done();
                }
            });

            element.shade('open');
        });

        it('fires the closed event when shade is closed', function(done) {
            element.shade({
                opened: function() {
                    element.shade('close');
                },
                closed: function() {
                    done();
                }
            });

            element.shade('open');
        });

        it('allow touchmove events if option is set to true', function(done) {
            $('body')
                .append(element)
                .one('touchmove', function(e) {
                    done();
                });

            element.shade({
                enableTouchmove: true,
                opened: function() {
                    touchActionSequence(this.$shade[0], [0,0], [0, 300], 300, 60);
                }
            });

            element.shade('open');
        });
    });
});
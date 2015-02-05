/*
 * dv-parallax jquery plugin
 *
 * 2015, Robin de Graaf, devvoh.com
 *
 * https://github.com/devvoh/dv-parallax-jquery
 *
 * use      $('elements').dvParallax();
 * config   data-dv-parallax-speed on elements to signify the scroll speed
 */

(function($) {

    $.fn.dvParallax = function() {

        function handleParallax(element) {
            // default speed = 5
            var speed = 5;
            if (element.data('dv-parallax-speed') !== undefined) {
                speed = parseInt(element.data('dv-parallax-speed'));
                if (speed > 9) {
                    speed = 9;
                }
            }
            // get the proxy
            var proxy = element.find('.dv-parallax-proxy');

            // do some math
            var parallax = ($(window).scrollTop() - element.offset().top);
            console.log(element.offset().top);
            var offset = (parallax * (speed / 10));

            // set the offset
            $(proxy).css('transform', 'translateY(' + offset + 'px) translateZ(0)');
        }

        this.each(function() {
            // get element
            var element = $(this);
            // make sure overflow is hidden, position is relative or otherwise positioned
            element.css('overflow', 'hidden');
            if (element.css('position') === 'static') {
                element.css('position', 'relative');
            }
            // make sure all elements are higher z-index than our future proxy & positioned
            var elementChildren = element.children();
            $.each(elementChildren, function() {
                if ($(this).css('position') === 'static') {
                    $(this).css('position', 'relative');
                }
                var childZIndex = $(this).css('z-index');
                if (childZIndex === 'auto') {
                    childZIndex = 10;
                } else if (childZIndex < 10) {
                    childZIndex += 10;
                }
                $(this).css('z-index', childZIndex);
            })

            // get the image from the element
            var backgroundImage = element.data('dv-parallax-image');
            // get the sizes from the original element
                var elementWidth = element.width();
                var elementHeight = element.height();
            // resize the proxy to overlap the element by 5% on all sides (so 10% bigger)
                var proxyWidth = elementWidth * 1.1;
                var proxyHeight = elementHeight * 1.1;
            // calculate the margins
                var proxyMarginLeft = (elementWidth - proxyWidth) / 2;
                var proxyMarginTop = 0;
                // see if the element has a dv-parallax-top
                if (element.data('dv-parallax-offset') !== undefined) {
                    proxyMarginTop = element.data('dv-parallax-offset');
                }

            // remove existing proxy containers
            element.find('[class*="dv-parallax-"]').remove();
            // create our image 'proxy' container
                var proxy = '<div class="dv-parallax-proxy" />';
                // append it
                $(element).append(proxy);
                // and get it again
                proxy = $(element).find('.dv-parallax-proxy');
                $(proxy).css({
                    'position': 'absolute',
                    'width': proxyWidth,
                    'height': proxyHeight,
                    'left': proxyMarginLeft,
                    'top': proxyMarginTop,
                });
            // create the proxyImage and append it to proxy
                var proxyImage = '<img class="dv-parallax-proxy-image" />';
                $(proxy).append(proxyImage);
                proxyImage = $(element).find('.dv-parallax-proxy-image');
                $(proxyImage).css('width', '100%');
                // add the proxy to the element
                // add the proxyImage to the proxy & the backgroundImage to the proxyImage element
                $(proxyImage).attr('src', backgroundImage);
            // remove header background-image
                element.css('background', 'none');

            // send a scrollTop request to force an update on positions, this doesn't actually scroll
            $(window).scrollTop(1);

            // initialize the element with the starting value
            handleParallax(element);
            // and bind scroll to handleParallax
            $(window).on('scroll', function() {
                handleParallax(element);
            });
        });

    }

}(jQuery));
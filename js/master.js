$(function () {
    //Preparing homepage bg slideshow images
    if (home_page.length > 0) {
        var background_urls = ['/img/bg/bg1.jpg', '/img/bg/bg2.jpg', '/img/bg/bg3.jpg', '/img/bg/bg4.jpg', '/img/bg/bg5.jpg'];
        $.each(background_urls, function (i, url) {
            var img = $('<img src="' + url + '"/>');
            img[0].onload = function () {
                var panel = $('<div class="bg-panel"></div>');
                if (i == 0) {
                    panel.addClass('current');
                }
                panel.css('background-image', 'url("' + url + '")');
                home_page.append(panel);
            }
        });
    }
});

var bdy = $(document.body);
var home_page = $('#home-page');

// Homepage bg slideshow timer
if (home_page.length > 0) {
    setInterval(function () {
        var current = $(document.body).find('.bg-panel.current');
        var next = current.next('.bg-panel');
        next = next.length == 0 ? $('.bg-panel:first') : next;
        current.removeClass('current');
        next.addClass('current');
    }, 5000);
}
$('#contact-link').click(function () {
    location.href = 'mailto:mail@ajeeshms.in';
});
var bdy = $(document.body);
var home_page = $('#home-page');
$(function () {
    $('#contact-link').click(function () {
        location.href = 'mailto:mail@ajeeshms.in';
    });
    $('#menu').click(function () {
        $(this).toggleClass('visible');
    });
    $('#menu').blur(function () {
        var me = $(this);
        setTimeout(function () {
            me.removeClass('visible');
        }, 100);
    });
});
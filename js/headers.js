$(function() {
    // Syntax highlighting
    hljs.initHighlightingOnLoad();
    // Add anchors to headers
    $('.document h1, .document h2, .document h3, .document h4, .document h5').each(function () {
        var url = document.URL.replace(/#.*$/, "") + '#' + $(this).attr('id');
        $(this).append(' <a class="fa fa-link" style="font-size:.5em" href="' + url + '"></a>');
    });
});

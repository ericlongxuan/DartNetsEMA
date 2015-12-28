//**************************************
//Init

// when the DOM is loaded
$(document).ready(function() {
    index.init();
});
//**************************************



//**************************************
// Functions
var index = {
        init: function() {
            index.compileTpl();
            index.bindActions();
        },

        compileTpl: function() {
            // load data
            var data = sessionStorage.getItem("ema-json");
            // compile the template
            var source = $("#index-tpl").html();
            var template = Handlebars.compile(source);
            // replace the template with data
            $("body").append(template(JSON.parse(data)));
        },

        bindActions: function() {
            // bind actions
            $(".sidebar .nav a").click(function() {
                index.scrollToDiv($(this).data("href"));
            });

            $(".main .cat-del-btn").click(function() {
                common.alertPopUp($(this).data("cat"));
            });
        },

        scrollToDiv: function(divId) {
            $('html, body').animate({
                scrollTop: $("#" + divId).offset().top - 70
            }, 300);
        },
    }
    //**************************************
    
//**************************************
//Init

// when the DOM is loaded
$(document).ready(function() {
    compileIndexTpl();
});
//**************************************



//**************************************
// Functions
function compileIndexTpl() {
    // load data
    var data = sessionStorage.getItem("ema-json");
    // compile the template
    var source = $("#index-tpl").html();
    var template = Handlebars.compile(source);
    // replace the template with data
    $("body").append(template(JSON.parse(data)));
}
//**************************************
//**************************************
//Init

// when the DOM is loaded
$(document).ready(function() {
    compileCommonTpl();
    bindActions();

    var data = sessionStorage.getItem("ema-json");
    if (data === null) {
        $("#load-ema-link").click();
    }
});
//**************************************



//**************************************
// Functions
function compileCommonTpl() {
    // load data
    var data = sessionStorage.getItem("ema-json");
    // compile the template
    var source = $("#common-tpl").html();
    var template = Handlebars.compile(source);
    // replace the template with data
    $("body").append(template(JSON.parse(data)));
}

function bindActions() {
    // bind actions
    $("#load-ema-link").click(function() {
        loadPopUp();
    });

    $("#file-path-input").change(function() {
        var filePath = "ema/" + getNameFromSelectFile($("#file-path-input").val());
        loadJsonFile(filePath);
    });
}

function loadJsonFile(file_name) {
    $(".load-modal").modal('hide');
    $.ajax({
        type:"GET",
        url:file_name,
        cache:false,  //default is true in GET method.
    })
        .done(function(response) {
            sessionStorage.setItem("ema-json", JSON.stringify(response));
            location.reload();
        })
        .fail(function(){
            alertPopUp("No such file.\nThis system only works with a json file in the 'ema' folder.");
        });
}


function alertPopUp(message) {
    $(".alert-message").html(message);
    $(".alert-modal").modal('show');
}

function loadPopUp() {
    $(".load-modal").modal('show');
}

function getNameFromSelectFile(file) {
    // ファイル名のみ取得して表示します
    var regex = /\\|\\/;
    var array = file.split(regex);
    return array[array.length - 1];
}
//**************************************
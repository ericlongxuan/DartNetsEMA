//**************************************
// Functions
var common = {
        init: function() {
            common.compileTpl();
            common.bindActions();

            var data = sessionStorage.getItem("ema-json");
            if (data === null) {
                $("#load-ema-link").click();
            }
        },

        compileTpl: function() {
            // load data
            var data = sessionStorage.getItem("ema-json");
            // compile the template
            var source = $("#common-tpl").html();
            var template = Handlebars.compile(source);
            // replace the template with data
            $("body").append(template(JSON.parse(data)));
        },

        bindActions: function() {
            // bind actions
            $("#load-ema-link").click(function() {
                common.loadPopUp();
            });

            $("#file-path-input").change(function() {
                var filePath = "ema/" + common.getNameFromSelectFile($("#file-path-input").val());
                common.loadJsonFile(filePath);
            });
        },

        loadJsonFile: function(file_name) {
            $(".load-modal").modal('hide');
            $.ajax({
                    type: "GET",
                    url: file_name,
                    cache: false, //default is true in GET method.
                })
                .done(function(response) {
                    sessionStorage.setItem("ema-json", JSON.stringify(response));
                    location.reload();
                })
                .fail(function() {
                    common.alertPopUp("No such file.\nThis system only works with a json file in the 'ema' folder.");
                });
        },


        alertPopUp: function(message) {
            $(".alert-message").html(message);
            $(".alert-modal").modal('show');
        },

        loadPopUp: function() {
            $(".load-modal").modal('show');
        },

        getNameFromSelectFile: function(file) {
            // ファイル名のみ取得して表示します
            var regex = /\\|\\/;
            var array = file.split(regex);
            return array[array.length - 1];
        },
    }
    //**************************************
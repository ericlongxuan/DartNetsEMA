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
            var data = JSON.parse(sessionStorage.getItem("ema-json"));
            // compile the template
            var source = $("#common-tpl").html();
            var template = Handlebars.compile(source);
            // replace the template with data
            $("body").append(template(data));
        },

        bindActions: function() {
            // bind actions
            $("#load-ema-link").click(function() {
                common.loadPopUp();
            });

            $("#file-path-input").change(function() {
                var file = $("#file-path-input")[0].files[0];
                common.loadJsonFile(file);
            });
        },

        loadJsonFile: function(file) {
            $(".load-modal").modal('hide');
            // load from local
            var reader = new FileReader(); //declare H5 file reader

            // set reader callback - onloadend
            reader.onloadend = function() {
                if (reader.error) {
                    common.alertPopUp(reader.error);
                } else {
                    sessionStorage.setItem("ema-json", reader.result);
                    location.reload();
                }
            }

            // start loading
            reader.readAsBinaryString(file);

            // load From Server, NOT Used this time
            // $.ajax({
            //         type: "GET",
            //         url: "ema/" + file_name,
            //         cache: false, //default is true in GET method.
            //     })
            //     .done(function(response) {
            //         sessionStorage.setItem("ema-json", JSON.stringify(response));
            //         location.reload();
            //     })
            //     .fail(function() {
            //         common.alertPopUp("No such file.\nThis system only works with a json file in the 'ema' folder.");
            //     });
        },


        alertPopUp: function(message) {
            $(".alert-message").html(message);
            $(".alert-modal").modal('show');
        },

        warningPopUpWithConfirmCancel: function(message, callback) {
            $(".warning-message").html(message);
            $(".warning-modal .btn-ok").click(
                function(){callback();}
            );
            $(".warning-modal .btn-cancel").click(
                function(){$(".warning-modal").modal('hide');}
            );
            $(".warning-modal").modal('show');
        },

        loadPopUp: function() {
            $(".load-modal").modal('show');
        },

        inputPopUp: function(keys, callback) {
            $(".input-block").html("");
            keys.forEach(function(entry) {
                $(".input-block").append("<p><label>" + entry + ":" 
                    + "</label><input type='text' id='pop-input-" + entry + "' class='form-control'></input></p>");
            });
            $(".input-modal .btn-ok").click(
                function(){callback();}
            );
            $(".input-modal .btn-cancel").click(
                function(){$(".input-modal").modal('hide');}
            );
            $(".input-modal").modal('show');
        },

        uploadAndSubmit: function() {
            var form = document.forms["demoForm"];

            if (form["file"].files.length > 0) {
                // look for <input type="file" ... /> tag
                var file = form["file"].files[0];
                // try sending 
                var reader = new FileReader();

                reader.onloadend = function() {
                    if (reader.error) {
                        common.alertPopUp(reader.error);
                    } else {
                        alert(reader.result);
                    }
                }
                reader.readAsBinaryString(file);
            } else {
                alert("Please choose a file.");
            }
        },
    }
    //**************************************
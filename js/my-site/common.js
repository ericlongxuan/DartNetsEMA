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

            $(".load-modal #btn-new-ema").click(function() {
                var data = {
                    "mVersion": 1,
                    "EMAScheduleList": []
                };
                sessionStorage.setItem("ema-json", JSON.stringify(data));
                location.reload();
            })

            $("#file-path-input").change(function() {
                var file = $("#file-path-input")[0].files[0];
                common.loadJsonFile(file);
            });

            $("#save-ema-link").click(function() {
                common.saveJsonFile();
            });
        },

        //H5 file reader
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

        saveJsonFile: function() {
            var dataJson = sessionStorage.getItem("ema-json");
            window.URL = window.URL || window.webkitURL;
            var blob = new Blob([dataJson], {
                type: 'text/plain;charset=utf-8'
            });
            var currentdate = new Date();
            var datetime = currentdate.getDate() + "/" + (currentdate.getMonth() + 1) + "/" + currentdate.getFullYear();
            filename = 'ema-' + datetime + '.json';
            var type = blob.type;
            var force_saveable_type = 'application/octet-stream';
            if (type && type != force_saveable_type) {
                var slice = blob.slice || blob.webkitSlice || blob.mozSlice;
                blob = slice.call(blob, 0, blob.size, force_saveable_type);
            }

            var url = URL.createObjectURL(blob);
            var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
            save_link.href = url;
            save_link.download = filename;

            var event = document.createEvent('MouseEvents');
            event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            save_link.dispatchEvent(event);
            URL.revokeObjectURL(url);
        },


        alertPopUp: function(message) {
            $(".alert-message").html(message);
            $(".alert-modal").modal('show');
        },

        warningPopUpWithConfirmCancel: function(message, callback) {
            $(".warning-message").html(message);
            $(".warning-modal .btn-ok").click(
                function() {
                    callback();
                }
            );
            $(".warning-modal .btn-cancel").click(
                function() {
                    $(".warning-modal").modal('hide');
                }
            );
            $(".warning-modal").modal('show');
        },

        loadPopUp: function() {
            $(".load-modal").modal('show');
        },

        inputPopUp: function(inputComps, callback) {
            $(".input-block").html("");
            $(".input-modal .modal-dialog").removeClass("modal-lg modal-sm modal-md").addClass("modal-" + inputComps.size);
            inputComps.inputs.forEach(function(entry) {
                if (entry.type == "text") {
                    $(".input-block").append("<p><label>" + entry.text + ":" + "</label><input type='text' id='pop-input-" + entry.text + "' class='form-control'></input></p>");
                } else if (entry.type == "textarea") {
                    $(".input-block").append("<p><label>" + entry.text + ":" + "</label><textarea rows='8' id='pop-input-" + entry.text + "' class='form-control'></textarea></p>");
                } else if (entry.type == "select") {
                    var compStr = "<p><label>" + entry.text + ":" + "</label><select id='pop-input-" + entry.text + "' class='form-control'>";
                    for (var i = 0; i < entry.options.length; i++) {
                        compStr += "<option>" + entry.options[i] + "</option>";
                    }
                    compStr += "</select></p>";
                    $(".input-block").append(compStr);
                }
            });
            $(".input-modal .btn-ok").click(
                function() {
                    callback();
                }
            );
            $(".input-modal .btn-cancel").click(
                function() {
                    $(".input-modal").modal('hide');
                }
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
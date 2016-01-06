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
                $("body").css("cursor", "progress");
                //get file list from server
                $.ajax({
                        method: "GET",
                        //url: "http://dartnetsdma.appspot.com/get_file_list/" + 5,
                        //url: "http://dartnetsdma.appspot.com/get_file_list/" + 5,
                        url: "http://ericlongxuan.pythonanywhere.com/get_file_list/" + 5,
                        cache: false, //default is true in GET method.
                    })
                    .done(function(response) {
                        $("body").css("cursor", "default");
                        var files = JSON.parse(response);
                        $('select#files-on-server-sel option').remove();
                        for (var i = 0; i < files.length; i++) {
                            $("select#files-on-server-sel").append($("<option>").val(files[i].name).text(
                                files[i].name + " (modified at: " + common.formatTime(files[i].modify_time) + ", size:" + files[i].size + "B)"));
                        }
                        common.loadPopUp();
                    })
                    .fail(function() {
                        $("body").css("cursor", "default");
                        $(".load-modal").modal('hide');
                        common.alertPopUp("communication error with server. Try again.");
                    });
            });

            $(".load-modal #btn-new-ema").click(function() {
                var data = {
                    "mVersion": 1,
                    "EMAScheduleList": []
                };
                sessionStorage.removeItem("editing-cat-index");
                sessionStorage.setItem("ema-json", JSON.stringify(data));
                location.reload();
            });

            $(".load-modal #btn-load-from-server").click(function() {
                var file = $("#files-on-server-sel").val();
                common.loadServerJsonFile(file);
            });

            $("#file-path-input").change(function() {
                sessionStorage.removeItem("editing-cat-index");
                var file = $("#file-path-input")[0].files[0];
                common.loadLocalJsonFile(file);
            });

            $("#save-ema-local-link").click(function() {
                common.saveJsonFile();
            });

            $("#save-ema-server-link").click(function() {
                common.inputPopUp({
                        "size": "sm",
                        "inputs": [{
                            "text": "mVersion",
                            "type": "text",
                            "options": [],
                            "required": true
                        }, {
                            "text": "filename",
                            "type": "text",
                            "options": [],
                            "required": true
                        }]
                    },
                    function() {
                        $(".main .cat-ok-btn").click();
                        var inputName = $("#pop-input-filename").val() + ".json";
                        $("body").css("cursor", "progress");
                        //get file list from server
                        var data = JSON.parse(sessionStorage.getItem("ema-json"));
                        data.mVersion = $("#pop-input-mVersion").val();
                        var dataJson = JSON.stringify(data);
                        sessionStorage.setItem("ema-json", dataJson);
                        $.ajax({
                                method: "POST",
                                //url: "http://dartnetsdma.appspot.com/get_file_list",
                                //url: "http://dartnetsdma.appspot.com/save_file/" + inputName,
                                url: "http://ericlongxuan.pythonanywhere.com/save_file/" + inputName,
                                data: {
                                    content: dataJson
                                }
                            })
                            .done(function(response) {
                                $("body").css("cursor", "default");
                                var res = JSON.parse(response);
                                $(".input-modal").modal('hide');
                                if (res.status == "fail") {
                                    common.alertPopUp(res.reason);
                                }
                                location.reload();
                            })
                            .fail(function() {
                                $("body").css("cursor", "default");
                                $(".input-modal").modal('hide');
                                common.alertPopUp("communication error with server. Try again.");
                            });

                    }
                );
                var currentdate = new Date();
                var data = JSON.parse(sessionStorage.getItem("ema-json"));
                $("#pop-input-mVersion").attr("placeholder", parseInt(data.mVersion) + 1);
                $("#pop-input-mVersion").val(parseInt(data.mVersion) + 1);
                var datetime = currentdate.getDate() + "-" + (currentdate.getMonth() + 1) + "-" + currentdate.getFullYear();
                var defaultFilename = 'ema(v' + (parseInt(data.mVersion) + 1) + ")" + datetime;
                $("#pop-input-filename").attr("placeholder", defaultFilename);
                $("#pop-input-filename").val(defaultFilename);
                $("#pop-input-filename").wrap("<div class='input-group'></div>");
                //$("#pop-input-filename").closest("p").addClass("input-group");
                $("#pop-input-filename").after("<span class='input-group-addon'>.json</span>");
            });
        },

        //H5 file reader
        loadLocalJsonFile: function(file) {
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
        },

        loadServerJsonFile: function(file) {
            $("body").css("cursor", "progress");
            $.ajax({
                    method: "GET",
                    //url: "http://dartnetsdma.appspot.com/ema/" + file,
                    url: "http://ericlongxuan.pythonanywhere.com/ema/" + file,
                    cache: false, //default is true in GET method.
                })
                .done(function(response) {
                    $("body").css("cursor", "default");
                    sessionStorage.setItem("ema-json", response);
                    location.reload();
                })
                .fail(function() {
                    $("body").css("cursor", "default");
                    common.alertPopUp("communication error with server. Try again.");
                });
        },

        saveJsonFile: function() {
            $(".main .cat-ok-btn").click();
            //var data = JSON.parse(sessionStorage.getItem("ema-json"));
            //data.mVersion += 1;
            //var dataJson = JSON.stringify(data);
            //sessionStorage.setItem("ema-json", dataJson);
            var dataJson = sessionStorage.getItem("ema-json");
            window.URL = window.URL || window.webkitURL;
            var blob = new Blob([dataJson], {
                type: 'text/plain;charset=utf-8'
            });
            var currentdate = new Date();
            var datetime = currentdate.getDate() + "-" + (currentdate.getMonth() + 1) + "-" + currentdate.getFullYear();
            var filename = 'ema-' + datetime + '.json';
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

        formatTime: function(unixTimestamp) {
            var dt = new Date(unixTimestamp * 1000);
            var year = dt.getFullYear();
            var month = dt.getMonth() + 1;
            var day = dt.getDate();
            var hours = dt.getHours();
            var minutes = dt.getMinutes();
            var seconds = dt.getSeconds();

            // the above dt.get...() functions return a single digit
            // so I prepend the zero here when needed
            if (hours < 10)
                hours = '0' + hours;

            if (minutes < 10)
                minutes = '0' + minutes;

            if (seconds < 10)
                seconds = '0' + seconds;

            return month + "/" + day + "/" + year + " " + hours + ":" + minutes + ":" + seconds;
        }

    }
    //**************************************
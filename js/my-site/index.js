//**************************************
//Init

// when the DOM is loaded
$(document).ready(function() {
    index.init();

    var data = JSON.parse(sessionStorage.getItem("ema-json"));
    $('[data-toggle="tooltip"]').tooltip();

    $.each(data.EMAScheduleList, function(index, schedule) {
        $('#timepicker' + index).timepicker({
            showMeridian: false,
            showSeconds: true,
            defaultTime: schedule.HourOfDay + ':' + schedule.Minute + ':' + schedule.Second,
        });
    });
    $(".main .cat-ok-btn").hide();
    $(".panel-body input:text").attr('readonly', true);
    $(".panel-body textarea").attr('readonly', true);
    $(".panel-body select").attr("disabled", true);
    $(".panel-body .timepicker input").attr("disabled", true);
    $(".panel-body button").attr("disabled", true);
    $(".panel-body input[name='randomgroup']").bootstrapSwitch("disabled", true);

    if (sessionStorage.getItem("editing-cat-index") === null) {} else {
        $(".panel-heading .cat-edit-btn[data-catindex='" + sessionStorage["editing-cat-index"] + "']").click();
    }
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
            var data = JSON.parse(sessionStorage.getItem("ema-json"));
            // compile the template
            var source = $("#index-tpl").html();
            var template = Handlebars.compile(source);
            // replace the template with data
            $("body").append(template(data));
        },

        bindActions: function() {
            // bind actions
            $(".sidebar .nav a").click(function() {
                index.scrollToDiv($(this).data("href"));
            });

            $(".main .cat-disable-btn").click(function() {
                var catindex = $(this).data("catindex");
                var data = index.saveCurrent(catindex);
                data.EMAScheduleList[catindex].Disabled = true;
                sessionStorage.setItem("ema-json", JSON.stringify(data));
                location.reload();
            });

            $(".main .cat-enable-btn").click(function() {
                var catindex = $(this).data("catindex");
                var data = index.saveCurrent(catindex);
                data.EMAScheduleList[catindex].Disabled = false;
                sessionStorage.setItem("ema-json", JSON.stringify(data));
                location.reload();
            });

            $("#cat-add-btn").click(function() {
                common.inputPopUp({
                        "size": "sm",
                        "inputs": [{
                            "text": "name",
                            "type": "text",
                            "options": [],
                            "required": true
                        }]
                    },
                    function() {
                        var inputName = $("#pop-input-name").val();
                        var data = JSON.parse(sessionStorage.getItem("ema-json"));
                        jQuery.each(data.EMAScheduleList, function() {
                            if (this.EMADef.Name == inputName) {
                                $(".input-modal").modal('hide');
                                common.alertPopUp("This EMA Category Name has existed.");
                                return false;
                            }
                        });
                        data.EMAScheduleList.push(index.newEMAScheduleListItem(inputName));
                        sessionStorage.setItem("ema-json", JSON.stringify(data));
                        location.reload();
                    }
                );
            });

            $(".main .cat-del-btn").click(function() {
                var catindex = $(this).data("catindex");
                index.saveCurrent(catindex);
                common.warningPopUpWithConfirmCancel(
                    "Sure to delete?",
                    function() {
                        var data = JSON.parse(sessionStorage.getItem("ema-json"));
                        data.EMAScheduleList.splice(catindex, 1);
                        sessionStorage.setItem("ema-json", JSON.stringify(data));
                        location.reload();
                    }
                );
            });

            $(".main .cat-edit-btn").click(function() {
                var index = $(this).data("catindex");
                $("#panel-ema" + index + " input:text").attr('readonly', false);
                $("#panel-ema" + index + " textarea").attr('readonly', false);
                $("#panel-ema" + index + " select").attr("disabled", false);
                $("#panel-ema" + index + " .timepicker input").attr("disabled", false);
                $("#panel-ema" + index + " input[name='randomgroup']").bootstrapSwitch("toggleDisabled", false);
                $("#panel-ema" + index + " .panel-body button").attr("disabled", false);
                $("#panel-ema" + index + " .cat-edit-btn").hide();
                $("#panel-ema" + index + " .cat-ok-btn").show();
                $(".panel-heading .cat-ok-btn").not("[data-catindex=" + index + "]").click();
                var data = JSON.parse(sessionStorage.getItem("ema-json"));
                if (data.EMAScheduleList[index].EMADef.QuestionGroup.length == 0) {
                    $("#panel-ema" + index + " .panel-body .new-question-btn").attr("disabled", true);
                };
                sessionStorage.setItem("editing-cat-index", index);
            });

            $(".main .cat-ok-btn").click(function() {
                var catindex = $(this).data("catindex");
                index.saveCurrent(catindex);

                $("#panel-ema" + catindex + " input:text").attr('readonly', true);
                $("#panel-ema" + catindex + " textarea").attr('readonly', true);
                $("#panel-ema" + catindex + " select").attr("disabled", true);
                $("#panel-ema" + catindex + " .timepicker input").attr("disabled", true);
                $("#panel-ema" + catindex + " input[name='randomgroup']").bootstrapSwitch("toggleDisabled", true);
                $("#panel-ema" + catindex + " .panel-body button").attr("disabled", true);
                $("#panel-ema" + catindex + " .cat-ok-btn").hide();
                $("#panel-ema" + catindex + " .cat-edit-btn").show();
            });

            $(".main .del-group-btn").click(function() {
                var catindex = $(this).data("catindex");
                var data = index.saveCurrent(catindex);
                var groupindex = $("#panel-ema" + catindex + " .nav li.active").data("groupindex");
                common.warningPopUpWithConfirmCancel(
                    "Sure to delete Group" + (groupindex + 1) + "?",
                    function() {
                        data.EMAScheduleList[catindex].EMADef.QuestionGroup.splice(groupindex, 1);
                        sessionStorage.setItem("ema-json", JSON.stringify(data));
                        location.reload();
                    }
                );
            });

            $(".main .new-group-btn").click(function() {
                var catindex = $(this).data("catindex");
                var data = index.saveCurrent(catindex);
                data.EMAScheduleList[catindex].EMADef.QuestionGroup.push([]);
                sessionStorage.setItem("ema-json", JSON.stringify(data));
                location.reload();
            });

            $(".main .new-question-btn").click(function() {
                var catindex = $(this).data("catindex");
                var data = index.saveCurrent(catindex);
                var groupindex = $("#panel-ema" + catindex + " .nav li.active").data("groupindex");
                common.inputPopUp({
                        "size": "md",
                        "inputs": [{
                            "text": "QuestionType",
                            "type": "select",
                            "options": [0, 1],
                            "required": true
                        }, {
                            "text": "Name",
                            "type": "text",
                            "options": [],
                            "required": true
                        }, {
                            "text": "QuestionText",
                            "type": "text",
                            "options": [],
                            "required": true
                        }, {
                            "text": "Options",
                            "type": "textarea",
                            "options": [],
                            "required": true
                        }, {
                            "text": "QuestionActivityType",
                            "type": "select",
                            "options": [0, 1],
                            "required": true
                        }, {
                            "text": "EMAActivity",
                            "type": "select",
                            "options": ["", "PSM", "PAM"],
                            "required": true
                        }, ]
                    },

                    function() {
                        var newQuestion = {
                            "QuestionType": $("#pop-input-QuestionType").val(),
                            "Name": $("#pop-input-Name").val(),
                            "QuestionText": $("#pop-input-QuestionText").val(),
                            "Options": $("#pop-input-Options").val().split('\n'),
                            "QuestionActivityType": $("#pop-input-QuestionActivityType").val(),
                            "EMAActivity": $("#pop-input-EMAActivity").val()
                        };
                        data.EMAScheduleList[catindex].EMADef.QuestionGroup[groupindex].push(newQuestion);
                        sessionStorage.setItem("ema-json", JSON.stringify(data));
                        location.reload();
                    }
                );
            });

            $(".main .del-question-btn").click(function() {
                var catindex = $(this).data("catindex");
                var data = index.saveCurrent(catindex);
                var groupindex = $("#panel-ema" + catindex + " .nav li.active").data("groupindex");
                var questionindex = $("#panel-ema" + catindex + " .nav li.active li.active").data("questionindex");
                if (questionindex === undefined)
                    questionindex = 0;

                common.warningPopUpWithConfirmCancel(
                    "Sure to delete Question#" + (questionindex + 1) + " from Group" + (groupindex + 1) + "?",
                    function() {
                        data.EMAScheduleList[catindex].EMADef.QuestionGroup[groupindex].splice(questionindex, 1);
                        sessionStorage.setItem("ema-json", JSON.stringify(data));
                        location.reload();
                    }
                );
            });

        },

        scrollToDiv: function(divId) {
            $('html, body').animate({
                scrollTop: $("#" + divId).offset().top - 70
            }, 300);
        },

        //return a new EMAScheduleList item
        newEMAScheduleListItem: function(name) {
            return {
                "Random": "",
                "HourOfDay": 0,
                "Minute": 0,
                "Second": 0,
                "EMADef": {
                    "Name": name,
                    "Prompt": "",
                    "RandomGroup": false,
                    "QuestionGroup": []
                },
                "DaysOfWeek": [

                ],
                "Disabled": false
            }
        },

        saveCurrent: function(index) {
            var data = JSON.parse(sessionStorage.getItem("ema-json"));
            data.EMAScheduleList[index].Random = $("#panel-ema" + index + " select[name='random']").val();
            data.EMAScheduleList[index].HourOfDay = $("#panel-ema" + index + " #timepicker" + index).data('timepicker').hour;
            data.EMAScheduleList[index].Minute = $("#panel-ema" + index + " #timepicker" + index).data('timepicker').minute;
            data.EMAScheduleList[index].Second = $("#panel-ema" + index + " #timepicker" + index).data('timepicker').meridian;
            data.EMAScheduleList[index].EMADef.Name = $("#panel-ema" + index + " input[name='emaname']").val();
            data.EMAScheduleList[index].EMADef.Prompt = $("#panel-ema" + index + " input[name='prompt']").val();
            data.EMAScheduleList[index].EMADef.RandomGroup = $("#panel-ema" + index + " input[name='randomgroup']").prop('checked');

            for (var i = data.EMAScheduleList[index].EMADef.QuestionGroup.length - 1; i >= 0; i--) {
                var group = data.EMAScheduleList[index].EMADef.QuestionGroup[i];
                for (var j = group.length - 1; j >= 0; j--) {
                    data.EMAScheduleList[index].EMADef.QuestionGroup[i][j].QuestionType = $("#EMA" + index + "G" + i + "Q" + j + " select[name='questiontype']").val();
                    data.EMAScheduleList[index].EMADef.QuestionGroup[i][j].Name = $("#EMA" + index + "G" + i + "Q" + j + " input[name='questionname']").val();
                    data.EMAScheduleList[index].EMADef.QuestionGroup[i][j].QuestionText = $("#EMA" + index + "G" + i + "Q" + j + " input[name='questiontext']").val();
                    var lines = $("#EMA" + index + "G" + i + "Q" + j + " textarea[name='options']").val().split(/\n/);
                    var options = [];
                    for (var k = 0; k < lines.length; k++) {
                        // only push this line if it contains a non whitespace character.
                        if (/\S/.test(lines[k])) {
                            options.push($.trim(lines[k]));
                        }
                    }
                    data.EMAScheduleList[index].EMADef.QuestionGroup[i][j].Options = options;
                    data.EMAScheduleList[index].EMADef.QuestionGroup[i][j].QuestionActivityType = $("#EMA" + index + "G" + i + "Q" + j + " select[name='activitytype']").val();
                    data.EMAScheduleList[index].EMADef.QuestionGroup[i][j].EMAActivity = $("#EMA" + index + "G" + i + "Q" + j + " select[name='activity']").val();
                };
            };
            sessionStorage.setItem("ema-json", JSON.stringify(data));
            return data;
        }
    }
    //**************************************
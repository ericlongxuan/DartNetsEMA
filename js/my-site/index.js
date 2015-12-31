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
    $(".panel-body input[name='my-checkbox']").bootstrapSwitch("disabled", true);

    if (sessionStorage.getItem("editing-cat-index") === null) {
    }
    else {
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
                var data = JSON.parse(sessionStorage.getItem("ema-json"));
                var index = $(this).data("catindex");
                data.EMAScheduleList[index].Disabled = true;
                sessionStorage.setItem("ema-json", JSON.stringify(data));
                location.reload();
            });

            $(".main .cat-enable-btn").click(function() {
                var data = JSON.parse(sessionStorage.getItem("ema-json"));
                var index = $(this).data("catindex");
                data.EMAScheduleList[index].Disabled = false;
                sessionStorage.setItem("ema-json", JSON.stringify(data));
                location.reload();
            });

            $("#cat-add-btn").click(function() {
                common.inputPopUp(
                    ["name"],
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
                var index = $(this).data("catindex");
                common.warningPopUpWithConfirmCancel(
                    "Sure to delete?",
                    function() {
                        var data = JSON.parse(sessionStorage.getItem("ema-json"));
                        data.EMAScheduleList.splice(index, 1);
                        sessionStorage.setItem("ema-json", JSON.stringify(data));
                        location.reload();
                    }
                );
            });

            $(".main .cat-edit-btn").click(function() {
                var index = $(this).data("catindex");
                $("#panel-ema" + index +" input:text").attr('readonly', false);
                $("#panel-ema" + index +" textarea").attr('readonly', false);
                $("#panel-ema" + index +" select").attr("disabled", false);
                $("#panel-ema" + index +" .timepicker input").attr("disabled", false); 
                $("#panel-ema" + index +" input[name='my-checkbox']").bootstrapSwitch("toggleDisabled", true);
                $("#panel-ema" + index +" .panel-body button").attr("disabled", false); 
                $("#panel-ema" + index +" .cat-edit-btn").hide();
                $("#panel-ema" + index +" .cat-ok-btn").show();
                $(".panel-heading .cat-ok-btn").not("[data-catindex=" + index + "]").click();
                sessionStorage.setItem("editing-cat-index", index);
            });

            $(".main .cat-ok-btn").click(function() {
                var index = $(this).data("catindex");
                $("#panel-ema" + index +" input:text").attr('readonly', true);
                $("#panel-ema" + index +" textarea").attr('readonly', true);
                $("#panel-ema" + index +" select").attr("disabled", true);
                $("#panel-ema" + index +" .timepicker input").attr("disabled", true); 
                $("#panel-ema" + index +" input[name='my-checkbox']").bootstrapSwitch("toggleDisabled", false);
                $("#panel-ema" + index +" .panel-body button").attr("disabled", true); 
                $("#panel-ema" + index +" .cat-ok-btn").hide();
                $("#panel-ema" + index +" .cat-edit-btn").show();
            });

            $(".main .del-group-btn").click(function() {
                var catindex = $(this).data("catindex");
                var groupindex = $("#panel-ema" + catindex +" .nav li.active").data("groupindex");
                common.warningPopUpWithConfirmCancel(
                    "Sure to delete Group" + (groupindex + 1) + "?",
                    function() {
                        var index = $(this).data("catindex");
                        var data = JSON.parse(sessionStorage.getItem("ema-json"));
                        data.EMAScheduleList[catindex].EMADef.QuestionGroup.splice(groupindex, 1);
                        sessionStorage.setItem("ema-json", JSON.stringify(data));
                        location.reload();
                    }
                );
            });

            $(".main .new-group-btn").click(function() {
                var index = $(this).data("catindex");
                var data = JSON.parse(sessionStorage.getItem("ema-json"));
                data.EMAScheduleList[index].EMADef.QuestionGroup.push([]);
                sessionStorage.setItem("ema-json", JSON.stringify(data));
                location.reload();
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
    }
    //**************************************
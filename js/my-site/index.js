//**************************************
//Init

// when the DOM is loaded
$(document).ready(function() {
    index.init();

    var data = JSON.parse(sessionStorage.getItem("ema-json"));
    $('[data-toggle="tooltip"]').tooltip();

    $.each(data.EMAScheduleList, function (index, schedule) {
        $('#timepicker'+index).timepicker({
            showMeridian: false,
            showSeconds: true,
            defaultTime: schedule.HourOfDay + ':' + schedule.Minute + ':' + schedule.Second,
        });
    });
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

                ]
            }
        },
    }
    //**************************************
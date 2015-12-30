//**************************************
//Init

// when the DOM is loaded
$(document).ready(function() {
    index.init();
    $('[data-toggle="tooltip"]').tooltip();
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
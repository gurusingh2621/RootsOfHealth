let tempId = 0;
$(".txtNeed").keypress(function (event) {
    var keycode = event.keyCode || event.which;
    if (keycode == '13' && !event.shiftKey) {
        SaveNeed(this);
        event.preventDefault();
    }
});

function NeedsGoals(result) {
    if (result.length) {
        $("span.needCount").html("").append(result.length);
        var needList = $(".needsList");
        needList.prev().html("");
        var needstring = '';
        for (var i = 0; i < result.length; i++) {
            var goals = parseHTML(result[i].GoalHtml);
            

            needstring += `<li class="hasChild ${result[i].GoalHtml.length ? "opened" : ""}" data-needid="${result[i].NeedID}">
                                <div class="needItem">
                                 <div class="editNeed" onclick="EditNeed(this)"><span class="countgoal">${$(goals).find("li").length}</span><span class="needDesc">${result[i].NeedDesc}</span></div>
                               <i onclick="ExpandCollapse(this)" class="down_arrow fa fa-chevron-down ${result[i].GoalHtml.length ? "" : "hide_down_arrow"}"></i>
                               <div class="itemHoverActions">
                               <a href="javascript:{}" onclick="AddNewGoalFromNeed(this)"><i class="fas fa-level-up-alt"></i></a>
                               <a href="javascript:{}" class="delete_item" onclick="DeleteNeed(this)"><i class="fa fa-trash"></i></a>
                               </div><a class="dragIcon" href="#!"><i class="fas fa-grip-vertical"></i></a></div>`;
            if (result[i].GoalHtml.length) {
                needstring += `<ul class="goalsList">
                                ${result[i].GoalHtml}
                                 </ul>
                                  `;
            }
            needstring += `</li>`;
        }
        needList.find("li").not("li.last-child").remove();
        needList.find("li.last-child").before(needstring);
        $(".needsList").sortable({
            items: "li.hasChild",
            cursor: 'move',
            opacity: 0.7,
            revert: 300,
            delay: 150,
            placeholder: "movable-placeholder",
            containment: ".needModalContent",
            start: function (e, ui) {
            
                ui.placeholder.height(ui.helper.outerHeight());
            },
            update: function () {
                needSendOrderToServer();
            },
            

        });
        $(".goalsList").sortable({
            items: "li",
            //handle: '.handle,.dragIcon',
            cursor: 'move',
            cancel: ".newGoal",
            opacity: 0.7,
            revert: 300,
            delay: 150,
            placeholder: "movable-placeholder",
            containment: ".needModalContent",
            start: function (e, ui) {
                ui.placeholder.height(ui.helper.outerHeight());
            },
            update: function () {
                goalSendOrderToServer();

            }

        });

    }
}

function SaveNeed(e) {
    if ($(e).val().trim() == "") {
        toastr.error("", "Need is required", { progressBar: true });
        return;
    }
    var needModel = {
        NeedID: $(e).closest("li").attr("data-needid"),
        NeedDesc: $(e).val(),
        TemplateID: tempId,
        PatientID: null,
        CreatedBy: userId,
        ModifiedBy: userId
    }
    $.ajax({
        type: "POST",
        url: Apipath + '/api/PatientMain/saveneed',
        data: JSON.stringify(needModel),
        contentType: 'application/json; charset=UTF-8',
        dataType: "json",
        success: function (result) {
            if ($(e).closest("li").attr("data-needid") == undefined) {
                var needString = `<li class="hasChild" data-needid="${result}">
                                <div class="needItem">
                                 <div class="editNeed" onclick="EditNeed(this)"><span class="countgoal">0</span><span class="needDesc">${$(e).val()}</span></div>
                               <i class="down_arrow fa fa-chevron-down hide_down_arrow" onclick="ExpandCollapse(this)"></i>
                               <div class="itemHoverActions">
                               <a href="javascript:{}" onclick="AddNewGoalFromNeed(this)"><i class="fas fa-level-up-alt"></i></a>
                               <a href="javascript:{}" class="delete_item" onclick="DeleteNeed(this)"><i class="fa fa-trash"></i></a>
                               </div><a class="dragIcon" href="#!"><i class="fas fa-grip-vertical"></i></a></div>                               
                                  </li>
                     `;
                $(".needsList").find("li.last-child").before(needString);
                $(".txtNeed").val("").css("height", "21px");
                $(".needsList").prev().html("");
                var needCount = parseInt($("span.needCount").html());
                $("span.needCount").html("").append(needCount + 1);
            } else {
                $(e).prev().html($(e).val());
                $(e).prev().show();
                $(e).remove();
            }
           
            if (!$(".needsList").hasClass('ui-sortable')) {
                $(".needsList").sortable({
                    items: "li.hasChild",
                    cursor: 'move',
                    opacity: 0.7,
                    revert: 300,
                    delay: 150,
                    placeholder: "movable-placeholder",
                    containment: ".needModalContent",
                    start: function (e, ui) {                       
                        ui.placeholder.height(ui.helper.outerHeight());
                    },
                    update: function () {
                        needSendOrderToServer();
                    }

                });
            }
        }
    })
}

function SaveGoal(e) {
    if ($(e).val().trim() == "") {
        toastr.error("", "Goal is required", { progressBar: true });
        return;
    }
    var goalModel = {
        GoalID: $(e).closest("li").attr("data-goalid"),
        GoalDesc: $(e).val(),
        NeedID: $(e).closest("ul.goalsList").parent().attr("data-needid"),
        CreatedBy: userId,
        ModifiedBy: userId
    }
    $.ajax({
        type: "POST",
        url: Apipath + '/api/PatientMain/savegoal',
        data: JSON.stringify(goalModel),
        contentType: 'application/json; charset=UTF-8',
        dataType: "json",
        success: function (result) {
            var goalList = $(e).closest(".goalsList");
            if ($(e).closest("li").attr("data-goalid") == undefined) {
                var goalString = `<li data-goalid="${result}" class="ui-sortable-handle">
<div class="needItem"> <div class="goalcontent" onclick="EditGoal(this)" >${$(e).val()}</div>
<div class="itemHoverActions"> <a href="javascript:{}" class="delete_item" onclick="DeleteGoal(this)"><i class="fa fa-trash"></i></a> </div>
<a class="dragIcon" href="#!"><i class="fas fa-grip-vertical"></i></a>
</div> </li>`;
                goalList.prepend(goalString);
                $(e).val("").focus().css("height","21px");
                var goalCount = parseInt($(e).parent().parent().parent().prev().find(".countgoal").html());
                $(e).parent().parent().parent().prev().find(".countgoal").html("").append(goalCount + 1);
            } else {
                $(e).prev().html($(e).val());
                $(e).prev().show();
                $(e).remove();
            }
            var showCollapse = goalList.prev().find("i.down_arrow").hasClass("hide_down_arrow");
            if (showCollapse) {
                goalList.prev().find("i.down_arrow").removeClass("hide_down_arrow");
            }
            if (!goalList.hasClass('ui-sortable')) {
                $(".goalsList").sortable({
                    items: "li",
                    //handle: '.handle,.dragIcon',
                    cursor: 'move',
                    cancel: ".newGoal",
                    opacity: 0.7,
                    revert: 300,
                    delay: 150,
                    placeholder: "movable-placeholder",
                    containment: ".needModalContent",
                    start: function (e, ui) {
                        ui.placeholder.height(ui.helper.outerHeight());
                    },
                    update: function () {
                        goalSendOrderToServer();

                    }

                });
            }

           
        }
    })
}

function GetNeedAndGoalList() {
    tempId = sessionStorage.getItem("Id") === null ? templateId : sessionStorage.getItem("Id")
    $.ajax({
        type: "GET",
        url: Apipath + '/api/PatientMain/getneedbytemplateid?TemplateId=' + tempId,
        contentType: 'application/json; charset=UTF-8',
        dataType: "json",
        success: function (result) {
            $(".needsList li").not("li.last-child").remove();
            NeedsGoals(result);

            if (result.length == 0) {
                var emptyText = "no default need exist for " + programName;
                $(".needsList").prev().html(emptyText.toUpperCase());
            }               
            $("#NeedModal").modal('show');
            NeedFocus();
        }
    })
}

function DeleteNeed(obj) {
    $.confirm({
        icon: 'fas fa-exclamation-triangle',
        title: 'Confirm',
        content: 'Are you sure you want to delete!',
        type: 'red',
        typeAnimated: true,
        buttons: {
            confirm: {
                btnClass: 'btn-danger',
                action: function () {
                    var needModel = {
                        NeedID: $(obj).closest("li").attr("data-needid"),
                        ModifiedBy: userId
                    }
                    $.ajax({
                        type: "POST",
                        url: Apipath + '/api/PatientMain/removeneed',
                        data: JSON.stringify(needModel),
                        contentType: 'application/json; charset=UTF-8',
                        dataType: "json",
                        success: function (result) {
                            $(obj).closest("li").remove();
                            $("span.needCount").html("").append($("ul.needsList").find("li.hasChild").length);
                            toastr.success("", "Changes saved successfully", { progressBar: true });                            
                        }
                    })
                }

            },
            cancel: function () {

            }
        }
    });
    
}

function DeleteGoal(obj) {
    $.confirm({
        icon: 'fas fa-exclamation-triangle',
        title: 'Confirm',
        content: 'Are you sure you want to delete!',
        type: 'red',
        typeAnimated: true,
        buttons: {
            confirm: {
                btnClass: 'btn-danger',
                action: function () {
                    var goalModel = {
                        GoalID: $(obj).closest("li").attr("data-goalid"),
                        ModifiedBy: userId
                    }
                    $.ajax({
                        type: "POST",
                        url: Apipath + '/api/PatientMain/removegoal',
                        data: JSON.stringify(goalModel),
                        contentType: 'application/json; charset=UTF-8',
                        dataType: "json",
                        success: function (result) {
                            var objClone = $(obj).clone();
                            var goalCount = $(obj).closest("li").siblings().length;
                            if (goalCount == 0) {
                                $(obj).closest(".goalsList").prev().find("i.down_arrow").addClass("hide_down_arrow");
                            }
                            var goalCount = parseInt($(obj).closest(".goalsList").prev().find(".countgoal").html());
                            $(obj).closest(".goalsList").prev().find(".countgoal").html("").append(goalCount - 1);
                            $(obj).closest("li").remove();                          
                            toastr.success("", "Changes saved successfully", { progressBar: true });

                        }


                    })
                },
            },
            cancel: function () {

            }
        }
    })
    
}

function AddNewGoalFromNeed(e) {
    $(e).closest("ul.needsList").find("ul.goalsList").not($(e).parent().parent().next()).each(function (index, item) {
        $(item).find("li.newGoal").remove();
    });
    if ($(e).parent().parent().next().find("li").last().hasClass("newGoal")) {
        $(".txtGoal").focus();
        return;
    }
    var goalString = `<li class="newGoal"><div class="addNewNeedGoal"><div class="plusIcon"><i class="fa fa-plus"></i></div><textarea maxlength="1000" class="txtGoal" placeholder="add goal" onkeyup="textAreaAdjust(this)"></textarea></div></li>`;

    var isgoalulExist = $(e).parent().parent().next().is("ul");
    if (isgoalulExist) {
        $(e).parent().parent().next().append(goalString);
    } else {
        $(e).parent().parent().after('<ul class="goalsList"><li  class="newGoal"><div class="addNewNeedGoal"><div class="plusIcon"><i class="fa fa-plus"></i></div><textarea maxlength="1000" class="txtGoal" placeholder="add goal" onkeyup="textAreaAdjust(this)"></textarea></div></li></ul>');
    }
    $(".txtGoal").keypress(function (event) {
        var keycode = event.keyCode || event.which;
        if (keycode == '13' && !event.shiftKey) {
            SaveGoal(this);
            event.preventDefault();
        }
    });
    $(".txtGoal").focus();
}   

function NeedFocus() {
    var txtneed = document.getElementsByClassName("txtNeed");
    $(txtneed).focus();
}

function goalSendOrderToServer() {

    var order = [];
    $('.goalsList li').each(function (index, element) {
        order.push({
            GoalID: $(this).attr('data-goalid'),
            SortIndex: index + 1
        });
    });
    $.ajax({
        type: "POST",
        url: Apipath + '/api/PatientMain/updategoalsortindex',
        data: JSON.stringify(order),
        contentType: 'application/json; charset=UTF-8',
        dataType: "json",
        success: function (result) {
            toastr.success("", "Changes saved successfully", { progressBar: true });
        },
        error: function () {

            toastr.error("Error while updating goal sort index");
        }
    });

}

function needSendOrderToServer() {

    var order = [];
    $('.needsList  li.hasChild').each(function (index, element) {
        order.push({
            NeedID: $(this).attr('data-needid'),
            SortIndex: index + 1
        });
    });
    $.ajax({
        type: "POST",
        url: Apipath + '/api/PatientMain/updateneedsortindex',
        data: JSON.stringify(order),
        contentType: 'application/json; charset=UTF-8',
        dataType: "json",
        success: function (result) {
            toastr.success("", "Changes saved successfully", { progressBar: true });
        },
        error: function () {

            toastr.error("Error while updating goal sort index");
        }
    });

}

function textAreaAdjust(o) {
    o.style.height = "1px";

    if (o.scrollHeight > 21) {
        o.style.height = (o.scrollHeight+1) + "px";
    }
    else {
        o.style.height = "21px";
    }

}

function ExpandCollapse(o) {
    $(o).parent().parent().toggleClass("opened");
    $(o).parent().next('ul').slideToggle();
}


function EditGoal(o) {
    var item = $(o).html();
    var goalDiv = `<textarea maxlength="1000" class="edittxtGoal" spellcheck="false" style="padding:0px !important;margin:0px !important" onfocus="goalOrNeedFocus(this)">${item}</textarea>`;
    $(o).hide();
    $(o).after(goalDiv);
    $(".edittxtGoal").keyup(function () {
        var o = this;
        o.style.height = "1px";

        if (o.scrollHeight > 20) {
            o.style.height = (o.scrollHeight + 1) + "px";
        }
        else {
            o.style.height = "20px";
        }
    });
    $(".edittxtGoal").keypress(function (event) {
        var keycode = event.keyCode || event.which;
        if (keycode == '13' && !event.shiftKey) {
            SaveGoal(this);
            event.preventDefault();
        }
    });

    $(".edittxtGoal").focusout(function () {
        $(this).prev().show();
        $(this).remove();

    })
    $(".edittxtGoal").focus();
}

function EditNeed(o) {
    var item = $(o).find("span.needDesc").html();
    var needDiv = `<textarea maxlength="1000" class="txtneed" spellcheck="false" style="padding:0px !important;"  onfocus="goalOrNeedFocus(this)">${item}</textarea>`;
    $(o).find("span.needDesc").hide();
    $(o).find("span.needDesc").after(needDiv);
    $(".txtneed").keyup(function () {
        var o = this;
        o.style.height = "1px";

        if (o.scrollHeight > 20) {
            o.style.height = (o.scrollHeight + 1) + "px";
        }
        else {
            o.style.height = "20px";
        }
    })
    $(".txtneed").keypress(function (event) {
        var keycode = event.keyCode || event.which;
        if (keycode == '13' && !event.shiftKey) {
            SaveNeed(this);
            event.preventDefault();
        }
    });
    $(".txtneed").focusout(function () {
        $(this).prev().show();
        $(this).remove();

    })
    $(".txtneed").focus();
}

function SearchNeedAndGoal(obj) {
    var keyword = $(obj).val().trim();
    if (keyword == '') { GetNeedAndGoalList() } else {
        $.ajax({
            type: "GET",
            url: Apipath + '/api/PatientMain/searchneedandgoal?TemplateId=' + tempId + '&keyword=' + keyword,
            contentType: 'application/json; charset=UTF-8',
            dataType: "json",
            success: function (result) {
                NeedsGoals(result);
            }
        });
    }
}

function goalOrNeedFocus(obj) {
    obj.style.height = "21px";
    obj.style.height = (obj.scrollHeight+1) + "px";
    if (!(obj.updating)) {
        obj.updating = true;
        var oldValue = obj.value;
        obj.value = '';
        obj.value = oldValue;
        obj.updating = false;
    }
}



var needId = 0;
var goalId = 0;
var needRef;
var goalRef;
var needGoalEnum = {
    NotStarted: 0,
    InProgress: 1,
    Completed:2
}
$(".txtNeed").keypress(function (event) {
    var keycode = event.keyCode || event.which;
    if (keycode == '13' && !event.shiftKey) {
        SaveNeed(this);
        event.preventDefault();
    }
});
$(".txtOutcome").keypress(function (event) {  
    var keycode = event.keyCode || event.which;
    if (keycode == '13' && !event.shiftKey) {
        SaveOutCome(this);
        event.preventDefault();
    }
});
$(".txtIntervention").keypress(function (event) {  
    var keycode = event.keyCode || event.which;
    if (keycode == '13' && !event.shiftKey) {
        SaveIntervention(this);
        event.preventDefault();
    }
});

function NeedsGoals(result) {
    if (result.length) {
        var completedNeeds = 0;
        $("span.needCount").html("").append(result.length);
        var needList = $(".needsList");
        needList.prev().html("");
        var needstring = '';
        for (var i = 0; i < result.length; i++) {            
            var goals = parseHTML(result[i].GoalHtml);
            var notStartedGoals = $(goals).find("span.status_value.notStarted").length + $(goals).find("span.status_value.inProgress").length;
            needstring += `<li class="hasChild" data-needid="${result[i].NeedID}" data-status="${result[i].NeedStatus}">
                                <div class="needItem">
                                <div class="editNeed">
                                   <span class="countgoal not_start_circle" onclick="ExpandCollapseFromGoalCount(this)">${notStartedGoals}</span>
                                   <div class="w-100">
                                   <span  class="needDesc">${result[i].NeedDesc}</span>
                                   <div class="status_labels_div">
                                   <span class="status_value outcome_status"  onclick="GetOutcomes(this)">Outcomes (${result[i].OutcomeCount})</span>`;
            switch (result[i].NeedStatus) {
                case needGoalEnum.NotStarted:
                    needstring += `<span onclick="EditNeedStatus(this)"  class="status_value notStarted">Not Started</span>`; 
                    break;
                case needGoalEnum.InProgress:
                    needstring += `<span onclick="EditNeedStatus(this)" class="status_value inProgress">In Progress</span>`;
                    break;
                case needGoalEnum.Completed:
                    needstring += `<span onclick="EditNeedStatus(this)" class="status_value completed">completed</span>`;
                    completedNeeds += 1;
                    break;               
            }                               
            needstring += `</div></div></div>`;
                                   
            needstring += `<i onclick="ExpandCollapse(this)" class="down_arrow fa fa-chevron-down ${result[i].GoalHtml.length ? "" : "hide_down_arrow"}"></i>
                               <div class="itemHoverActions">
                               <a href="javascript:{}"   class="needGoalHover" data-placement="bottom" title="Add new goal" onclick="AddNewGoalFromNeed(this)"><i class="fas fa-level-up-alt"></i></a>
                               <a href="javascript:{}"   class="needGoalHover" data-placement="bottom" title="Edit" onclick="EditNeed(this)"><i class="fas fa-pencil-alt"></i></a>
                               <a href="javascript:{}"   class="needGoalHover" data-placement="bottom" title="Change status" onclick="EditNeedStatus(this)"><i class="fas fa-clipboard-check"></i></a>
                               <a href="javascript:{}"  class="needGoalHover delete_item" data-placement="bottom" title="Delete"  onclick="DeleteNeed(this)"><i class="fa fa-trash"></i></a>
                               </div><a class="dragIcon" href="#!"><i class="fas fa-grip-vertical"></i></a></div>`;
            if (result[i].GoalHtml.length) {
                needstring += `<ul class="goalsList" style="display: none;">
                                ${result[i].GoalHtml}
                                 </ul>
                                  `;
            }
            needstring += `</li>`;
        }
        needList.find("li").not("li.last-child").remove();
        needList.find("li.last-child").before(needstring);
        $("span.completedNeedCount").html("").append(completedNeeds);
        if ($("#ddlcareplanstatus").val() != "4") {
            $(".needGoalHover").removeClass("disableHoverItem");
            $(".status_labels_div").find("span:last").removeClass("disableHoverItem");
            $(".needsList").sortable({
                items: "li.hasChild",
                cursor: 'move',
                opacity: 0.7,
                revert: 300,
                delay: 150,
                placeholder: "movable-placeholder",
                containment: "#needContent",
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
                containment: "#needContent",
                start: function (e, ui) {
                    ui.placeholder.height(ui.helper.outerHeight());
                },
                update: function () {
                    goalSendOrderToServer();
                }
            });
        } else {
            $(".needGoalHover").addClass("disableHoverItem");
            $(".status_labels_div").find("span:last").addClass("disableHoverItem");
        }
    }
    $(".loaderOverlay").hide();
}
function SaveNeed(e) {
    if ($(e).val().trim() == "") {
        toastr.error("", "Need is required", { progressBar: true });
        return;
    }
    var needModel = {
        NeedID: $(e).closest("li").attr("data-needid"),
        NeedDesc: $(e).val(),
        TemplateID: templateid,
        PatientID: PatientId,
        CarePlanId: careplanid,
        Status: needGoalEnum.NotStarted,
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
                var needString = `<li class="hasChild opened" data-needid="${result}" data-status="0">
                                <div class="needItem">
                                <div class="editNeed">
                                <span class="countgoal not_start_circle" onclick="ExpandCollapseFromGoalCount(this)">0</span>
                                <div class="w-100">
                                <span class="needDesc">${$(e).val()}</span>
                                <div class="status_labels_div">
                                <span class="status_value outcome_status"  onclick="GetOutcomes(this)">Outcomes (0)</span>
                                <span onclick="EditNeedStatus(this)" class="status_value notStarted">Not Started</span>
                                </div></div></div>
                               <i class="down_arrow fa fa-chevron-down hide_down_arrow" onclick="ExpandCollapse(this)"></i>
                               <div class="itemHoverActions">
                               <a href="javascript:{}" class="needGoalHover" data-placement="bottom" title="Add new goal" onclick="AddNewGoalFromNeed(this)"><i class="fas fa-level-up-alt"></i></a>
                               <a href="javascript:{}"   class="needGoalHover" data-placement="bottom" title="Edit" onclick="EditNeed(this)"><i class="fas fa-pencil-alt"></i></a>
                               <a href="javascript:{}"   class="needGoalHover" data-placement="bottom" title="Change status" onclick="EditNeedStatus(this)"><i class="fas fa-clipboard-check"></i></a>
                               <a href="javascript:{}" class="needGoalHover delete_item" data-placement="bottom" title="Delete"  onclick="DeleteNeed(this)"><i class="fa fa-trash"></i></a>
                               </div>
                               <a class="dragIcon" href="#!"><i class="fas fa-grip-vertical"></i></a>
                               </div></li>`;
                $(".needsList").find("li.last-child").before(needString);
                $(".txtNeed").val("").css("height", "21px");
                $(".needsList").prev().html("");
                var needCount = parseInt($("span.needCount").html());
                $("span.needCount").html("").append(needCount + 1);
                $(".txtNeed").blur();
                NeedFocus();
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
                    containment: "#needContent",
                    start: function (e, ui) {
                        ui.placeholder.height(ui.helper.outerHeight());
                    },
                    update: function () {
                        needSendOrderToServer();
                    }

                });
            }

        },
        error: function (e) {
            toastr.error("Something happen Wrong");
            $(".loaderOverlay").hide();
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
        Status: needGoalEnum.NotStarted,
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
                var goalString = `<li data-goalid="${result}" data-status="0" class="ui-sortable-handle">
                                  <div class="needItem">
                                  <div class="editNeed">
                                  <span class="countgoal notStarted"></span>
                                  <div class="w-100">
                                  <span class="goalcontent">${$(e).val()}</span>
                                  <div class="status_labels_div">
                                  <span class="status_value outcome_status" onclick="GetInterventions(this)">Intervention (0)</span>
                                  <span onclick="EditGoalStatus(this)" class="status_value notStarted">Not Started</span>
                                  </div></div>
                                  <div class="itemHoverActions">
                                  <a href="javascript:{}" class="needGoalHover" data-placement="bottom" title="Edit" onclick="EditGoal(this)"><i class="fas fa-pencil-alt"></i></a>
                                  <a href="javascript:{}" class="needGoalHover" data-placement="bottom" title="Change status" onclick="EditGoalStatus(this)"><i class="fas fa-clipboard-check"></i></a>
                                  <a href="javascript:{}" class="needGoalHover delete_item" data-placement="bottom" title="Delete"  onclick="DeleteGoal(this)"><i class="fa fa-trash"></i></a>
                                  </div>
                                  <a class="dragIcon" href="#!"><i class="fas fa-grip-vertical"></i></a>
                                  </div>
                                  </li>`;
                goalList.find("li.newGoal").before(goalString);
                $(e).val("").focus().css("height", "21px");
                var goalCount = parseInt($(e).closest("ul.goalsList").prev().find(".countgoal").first().html());
                $(e).closest("ul.goalsList").prev().find(".countgoal").first().html("").append(goalCount + 1);
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
                    containment: "#needContent",
                    start: function (e, ui) {
                        ui.placeholder.height(ui.helper.outerHeight());
                    },
                    update: function () {
                        goalSendOrderToServer();
                    }

                });
            }


        }, error: function (e) {
            toastr.error("Something happen Wrong");
            $(".loaderOverlay").hide();
        }
    })
}
function GetNeedAndGoalList() {
    if ($("a.need-nav").parent().hasClass("disabled")) {
        return false;
    }
    $("a.need-nav").tab('show');
    $(".loaderOverlay").show();
    if ($("#ddlcareplanstatus").val() == "4") {        
        $(".txtNeed,.txtOutcome,.txtIntervention").attr("disabled", true);
    } else {
        $(".txtNeed,.txtOutcome,.txtIntervention").removeAttr("disabled");
    }
    $.ajax({
        type: "GET",
        url: Apipath + '/api/PatientMain/getneedbycareplanid?CarePlanId=' + careplanid,
        contentType: 'application/json; charset=UTF-8',
        dataType: "json",
        success: function (result) {
            $(".needsList li").not("li.last-child").remove();
            NeedsGoals(result);

            if (result.length == 0) {
                $(".loaderOverlay").hide();
                var emptyText = "no default need exist";
                $(".needsList").prev().html(emptyText.toUpperCase());
            } else {
                $(".needGoalHover").tooltip();
               
            }         
                NeedFocus();
            
        }, error: function (e) {
            toastr.error("Something happen Wrong");
            $(".loaderOverlay").hide();
        }
    });
}
function DeleteNeed(obj) {
    if ($(obj).hasClass("disableHoverItem")) {
        return;
    }
    $.ajax({
        type: "GET",
        url: Apipath + '/api/PatientMain/editneed?NeedId=' + $(obj).closest("li").attr("data-needid"),
        contentType: 'application/json; charset=UTF-8',
        dataType: "json",
        success: function (result) {
            switch (result) {
                case 0:
                    toastr.error("Cannot Delete.  Item contains historical Data");
                    break;
                default:
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
                                        async: false,
                                        success: function (result) {
                                            $(obj).closest("li").remove();
                                            $("span.needCount").html("").append($("ul.needsList").find("li.hasChild").length);
                                            toastr.success("", "Changes saved successfully", { progressBar: true });
                                        }, error: function (e) {
                                            toastr.error("Something happen Wrong");
                                            $(".loaderOverlay").hide();
                                        }
                                    })
                                }

                            },
                            cancel: function () {

                            }
                        }
                    });
                    break;
            }
        }, error: function (e) {
            toastr.error("Something happen Wrong");
            $(".loaderOverlay").hide();
        }
    });
    
}
function DeleteGoal(obj) {
    if ($(obj).hasClass("disableHoverItem")) {
        return;
    }
    $.ajax({
        type: "GET",
        url: Apipath + '/api/PatientMain/editgoal?GoalId=' + $(obj).closest("li").attr("data-goalid"),
        contentType: 'application/json; charset=UTF-8',
        dataType: "json",
        success: function (result) {
            switch (result) {
                case 0:
                    toastr.error("Cannot Delete.  Item contains historical Data");
                    break;
                default:
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
                        async: false,
                        success: function (result) {                        
                            var goalCount = $(obj).closest("li").siblings().length;
                            if (goalCount == 0) {
                                $(obj).closest(".goalsList").prev().find("i.down_arrow").addClass("hide_down_arrow");
                            }
                            var goalCount = parseInt($(obj).closest(".goalsList").prev().find(".countgoal").html());
                            $(obj).closest(".goalsList").prev().find(".countgoal").html("").append(goalCount - 1);
                            $(obj).closest("li").remove();
                            toastr.success("", "Changes saved successfully", { progressBar: true });

                        }, error: function (e) {
                            toastr.error("Something happen Wrong");
                            $(".loaderOverlay").hide();
                        }


                    })
                },
            },
            cancel: function () {

            }
        }
    })
                    break;
            }
        }, error: function (e) {
            toastr.error("Something happen Wrong");
            $(".loaderOverlay").hide();
        }
    });
}
function AddNewGoalFromNeed(e) {
    if ($(e).hasClass("disableHoverItem")) {
        return;
    }
    $(e).closest("ul.needsList").find("ul.goalsList").not($(e).parent().parent().next()).each(function (index, item) {
        $(item).find("li.newGoal").remove();
    });
    if ($(e).parent().parent().next().find("li").last().hasClass("newGoal")) {
        if (!$(e).closest("li.hasChild ").hasClass("opened")) {
            $(e).closest("li.hasChild ").addClass("opened");
            $(e).closest("div.needItem").next().css("display", "block");
            $(".txtGoal").focus();
        }
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
    if (!$(e).closest("li.hasChild ").hasClass("opened")) {
        $(e).closest("li.hasChild ").addClass("opened");
        $(e).closest("div.needItem").next().css("display", "block");
        $(".txtGoal").focus();
    }
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
        o.style.height = (o.scrollHeight + 1) + "px";
    }
    else {
        o.style.height = "21px";
    }
    if ($(o).hasClass("txtNeed")) {
        NeedFocus();
    }
    if ($(o).hasClass("txtIntervention")) {
        if ($(o).val().trim() == "") {
            $(".btnIntervention").removeClass("checkGreen");
        } else {
            $(".btnIntervention").addClass("checkGreen");
        } 
    }
    if ($(o).hasClass("txtOutcome")) {
        if ($(o).val().trim() == "") {
            $(".btnOutcome").removeClass("checkGreen");
        } else {
            $(".btnOutcome").addClass("checkGreen");
        } 
    }
}
function ExpandCollapse(o) {
    $(o).parent().parent().toggleClass("opened");
    $(o).parent().next('ul').slideToggle();
}
function ExpandCollapseFromGoalCount(o) {
    $(o).closest("li.hasChild").toggleClass("opened");
    $(o).closest("div.needItem").next('ul.goalsList').slideToggle();
}
function EditGoal(o) {
    if ($(o).hasClass("disableHoverItem")) {
        return;
    }
    $.ajax({
        type: "GET",
        url: Apipath + '/api/PatientMain/editgoal?GoalId=' + $(o).closest("li").attr("data-goalid"),
        contentType: 'application/json; charset=UTF-8',
        dataType: "json",
        success: function (result) {
            switch (result) {
                case 0:
                    toastr.error("Cannot Edit.Item contains historical Data");
                    break;
                default:
                    var item = $(o).parent().prev().find("span.goalcontent");
                    var goalDiv = `<textarea maxlength="1000" class="edittxtGoal" spellcheck="false" style="padding:0px !important;margin:0px !important" onfocus="goalOrNeedFocus(this)">${item.html()}</textarea>`;
                    item.hide();
                    item.after(goalDiv);
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
                    break;
            }
        }, error: function (e) {
            toastr.error("Something happen Wrong");
            $(".loaderOverlay").hide();
        }
    });   
}
function EditNeed(o) {
    if ($(o).hasClass("disableHoverItem")) {
        return;
    }
    $.ajax({
        type: "GET",
        url: Apipath + '/api/PatientMain/editneed?NeedId=' + $(o).closest("li").attr("data-needid"),
        contentType: 'application/json; charset=UTF-8',
        dataType: "json",
        success: function (result) {
            switch (result) {
                case 0:
                    toastr.error("Cannot Edit.  Item contains historical Data");
                    break;
                default:
                    var item = $(o).parent().parent().find("span.needDesc");
                    var needDiv = `<textarea maxlength="1000" class="txtneed" spellcheck="false" style="padding:0px !important;"  onfocus="goalOrNeedFocus(this)">${item.html()}</textarea>`;
                    item.hide();
                    item.after(needDiv);
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

                    });
                    $(".txtneed").focus();
                    break;
            }
        }, error: function (e) {
            toastr.error("Something happen Wrong");
            $(".loaderOverlay").hide();
        }
    });
    
}
function SearchNeedAndGoal(obj) {
    var keyword = $(obj).val().trim();
    if (keyword == '') { GetNeedAndGoalList() } else {
        $.ajax({
            type: "GET",
            url: Apipath + '/api/PatientMain/searchneedandgoal?TemplateId=' + templateid + '&keyword=' + keyword,
            contentType: 'application/json; charset=UTF-8',
            dataType: "json",
            success: function (result) {
                NeedsGoals(result);
            }, error: function (e) {
                toastr.error("Something happen Wrong");
                $(".loaderOverlay").hide();
            }
        });
    }
}
function goalOrNeedFocus(obj) {
    obj.style.height = "21px";
    obj.style.height = (obj.scrollHeight + 1) + "px";
    if (!(obj.updating)) {
        obj.updating = true;
        var oldValue = obj.value;
        obj.value = '';
        obj.value = oldValue;
        obj.updating = false;
    }
}
function EditGoalStatus(obj) {
    if ($(obj).hasClass("disableHoverItem")) {
        return;
    }
    $("#CarePlanChangeStatusModal .goalNote").show();
    $("#CarePlanChangeStatusModal .needNote").hide();
    $("#CarePlanChangeStatusModal .submitGoalStatus").show();
    $("#CarePlanChangeStatusModal .submitNeedStatus").hide();
    goalRef = obj;
    var status = $(obj).closest("li").attr("data-status");
    goalId = $(obj).closest("li").attr("data-goalid");
    $(".goalNote").val('');
    $("#CarePlanChangeStatusModal").find("select").first().val(status);
    $("#CarePlanChangeStatusModal").modal({
        backdrop: 'static',
        keyboard: false
    });
}
function EditNeedStatus(obj) {
    if ($(obj).hasClass("disableHoverItem")) {
        return;
    }
    $("#CarePlanChangeStatusModal .goalNote").hide();
    $("#CarePlanChangeStatusModal .needNote").show();
    $("#CarePlanChangeStatusModal .submitGoalStatus").hide();
    $("#CarePlanChangeStatusModal .submitNeedStatus").show();
    needRef = obj;
    var status = $(obj).closest("li").attr("data-status");
    needId = $(obj).closest("li").attr("data-needid");
    $(".needNote").val('');
    $("#CarePlanChangeStatusModal").find("select").first().val(status);
    $("#CarePlanChangeStatusModal").modal({
        backdrop: 'static',
        keyboard: false
    });
}
function GetInterventions(obj) {
    if (obj != null) {
        goalRef = obj;
        $(".outcomeTitle").html("").append('Interventions(<span class="outcomecount">0</span>)');
        $(".txtIntervention,.btnIntervention").show();
        $(".txtOutcome,.btnOutcome").hide();
        $(".txtIntervention").val("");
        goalId = $(obj).closest("li").attr("data-goalid");
    }
    $.ajax({
        type: "GET",
        url: Apipath + '/api/PatientMain/getinterventionbygoal?GoalId=' + goalId,
        contentType: 'application/json; charset=UTF-8',
        dataType: "json",
        async: false,
        success: function (result) {
            var intervention = $("#carePlanOutcomes").find(".a_outcome_list");
            intervention.html("");
            var interventionStr = '';
            $("span.outcomecount").html("").append(result.length);
            if (result.length) {
                for (var i = 0; i < result.length; i++) {
                    interventionStr += `<div class="a_outcome_item">
                                   <div class="a_o_head">
                                   <div class="a_o_head_name">
                                   <span class="name_thumb c_blue">${result[i].FirstName.charAt(0)}${result[i].LastName.charAt(0)}</span><strong>${result[i].FirstName} ${result[i].LastName}</strong>
                                   </div>
                                   <div class="a_o_date">${result[i].AddedDate} at ${result[i].AddedTime}</div>
                                   </div>
                                   <div class="a_o_content">${result[i].Note}</div>
                                   </div>`;
                }
                intervention.append(interventionStr);
            }
        }, error: function (e) {
            toastr.error("Something happen Wrong");
            $(".loaderOverlay").hide();
        }
    });
    if (obj != null) {
        $("#carePlanOutcomes").modal({
            backdrop: 'static',
            keyboard: false
        });
    }
}
function GetOutcomes(obj) {
    if (obj != null) {
        needRef = obj;
        $(".outcomeTitle").html("").append('Outcomes(<span class="outcomecount">0</span>)');
        $(".txtIntervention,.btnIntervention").hide();
        $(".txtOutcome,.btnOutcome").show();
        $(".txtOutcome").val("");
        needId = $(obj).closest("li").attr("data-needid");
    }
    $.ajax({
        type: "GET",
        url: Apipath + '/api/PatientMain/getoutcomebyneed?NeedId=' + needId,
        contentType: 'application/json; charset=UTF-8',
        dataType: "json",
        async: false,
        success: function (result) {
            var outcome = $("#carePlanOutcomes").find(".a_outcome_list");
            outcome.html("");
            var outcomeStr = '';
            $("span.outcomecount").html("").append(result.length);
            if (result.length) {            
                for (var i = 0; i < result.length; i++) {
                    outcomeStr += `<div class="a_outcome_item">
                                   <div class="a_o_head">
                                   <div class="a_o_head_name">
                                   <span class="name_thumb c_blue">${result[i].FirstName.charAt(0)}${result[i].LastName.charAt(0)}</span><strong>${result[i].FirstName} ${result[i].LastName}</strong>
                                   </div>
                                   <div class="a_o_date">${result[i].AddedDate} at ${result[i].AddedTime}</div>
                                   </div>
                                   <div class="a_o_content">${result[i].Note}</div>
                                   </div>`;
                }
                outcome.append(outcomeStr);
            }
        }, error: function (e) {
            toastr.error("Something happen Wrong");
            $(".loaderOverlay").hide();
        }
    });
    if (obj != null) {
        $("#carePlanOutcomes").modal({
            backdrop: 'static',
            keyboard: false
        });
    }
}
function UpdateNeedStatus() {
    if ($(".needNote").val().trim()=="") {
        toastr.error("Note is required");
        return;
    }  
    var model = {
        NeedId: needId,
        Note: $(".needNote").val(),
        Status: $(".ddlStatus").val(),
        ModifiedBy: userId,
        CarePlanId: careplanid
    }
    var goals = $(needRef).closest("div.needItem").next();
    var notStartedGoals = goals.find("span.status_value.notStarted").length;
    var inProgressGolas = goals.find("span.status_value.inProgress").length;
    if (model.Status == "2" && (notStartedGoals > 0 || inProgressGolas > 0)) {
        toastr.error("Goals not completed for this need");
        return;
    }
    $.ajax({
        type: "POST",
        url: Apipath + '/api/PatientMain/updateneedstatus',
        contentType: 'application/json; charset=UTF-8',
        data: JSON.stringify(model),
        dataType: "json",
        success: function (res) {
            $(needRef).closest("li").attr("data-status", model.Status);
            switch (model.Status) {
                case "0":
                    if ($(needRef).is("span")) {
                        $(needRef).removeClass("notStarted inProgress completed");
                        $(needRef).addClass("notStarted");
                        $(needRef).html("").append("Not Started");
                    } else {
                        var statusRef = $(needRef).parent().parent().find("div.status_labels_div").find("span.status_value").last();
                        statusRef.removeClass("notStarted inProgress completed");
                        statusRef.addClass("notStarted");
                        statusRef.html("").append("Not Started");
                    }
                    break;
                case "1":
                    if ($(needRef).is("span")) {
                        $(needRef).removeClass("notStarted inProgress completed");
                        $(needRef).addClass("inProgress");
                        $(needRef).html("").append("In Progress");
                    } else {
                        var statusRef = $(needRef).parent().parent().find("div.status_labels_div").find("span.status_value").last();
                        statusRef.removeClass("notStarted inProgress completed");
                        statusRef.addClass("inProgress");
                        statusRef.html("").append("In Progress");
                    }
                    $("#ddlcareplanstatus").val("3");
                    break;
                case "2":
                    var completedNeedCount = parseInt($("span.completedNeedCount").html());
                    $("span.completedNeedCount").html("").append(completedNeedCount + 1);
                    if ($(needRef).is("span")) {
                        $(needRef).removeClass("notStarted inProgress completed");
                        $(needRef).addClass("completed");
                        $(needRef).html("").append("Completed");
                    } else {
                        var statusRef = $(needRef).parent().parent().find("div.status_labels_div").find("span.status_value").last();
                        statusRef.removeClass("notStarted inProgress completed");
                        statusRef.addClass("completed");
                        statusRef.html("").append("Completed");
                    }
                    $("#ddlcareplanstatus").val("3");
                    break;
            }
            toastr.success("Changes saved successfully");
            $(".ddlStatus").val("0");
            $(".needNote").val('');
            $("#CarePlanChangeStatusModal").modal('hide');
        }, error: function () {
            toastr.error("Something happen Wrong");
            $(".loaderOverlay").hide();
        }
    });
}
function UpdateGoalStatus() {
    if ($(".goalNote").val().trim() == "") {
        toastr.error("Note is required");
        return;
    }
    var model = {
        GoalId: goalId,
        Note: $(".goalNote").val(),
        Status: $(".ddlStatus").val(),
        ModifiedBy: userId,
        CarePlanId: careplanid
    }
    $.ajax({
        type: "POST",
        url: Apipath + '/api/PatientMain/updategoalstatus',
        contentType: 'application/json; charset=UTF-8',
        data: JSON.stringify(model),
        dataType: "json",
        success: function (res) {                   
            $(goalRef).closest("li").attr("data-status", model.Status);
            switch (model.Status) {
                case "0":
                    if ($(goalRef).is("span")) {
                        var statusCircle = $(goalRef).parent().parent().prev();
                        statusCircle.removeClass("notStarted inProgress fullCompleted");
                        statusCircle.addClass("notStarted");
                        $(goalRef).removeClass("notStarted inProgress completed");
                        $(goalRef).addClass("notStarted");
                        $(goalRef).html("").append("Not Started");
                    } else {
                        var statusCircle = $(goalRef).parent().prev().prev();
                        statusCircle.removeClass("notStarted inProgress fullCompleted");
                        statusCircle.addClass("notStarted");
                        var statusRef = $(goalRef).parent().parent().find("div.status_labels_div").find("span.status_value").last();
                        statusRef.removeClass("notStarted inProgress completed");
                        statusRef.addClass("notStarted");
                        statusRef.html("").append("Not Started");
                    }
                    break;
                case "1":
                    if ($(goalRef).is("span")) {
                        var statusCircle = $(goalRef).parent().parent().prev();
                        statusCircle.removeClass("notStarted inProgress fullCompleted");
                        statusCircle.addClass("inProgress");
                        $(goalRef).removeClass("notStarted inProgress completed");
                        $(goalRef).addClass("inProgress");
                        $(goalRef).html("").append("In Progress");
                    } else {
                        var statusCircle = $(goalRef).parent().prev().prev();
                        statusCircle.removeClass("notStarted inProgress fullCompleted");
                        statusCircle.addClass("inProgress");
                        var statusRef = $(goalRef).parent().parent().find("div.status_labels_div").find("span.status_value").last();
                        statusRef.removeClass("notStarted inProgress completed");
                        statusRef.addClass("inProgress");
                        statusRef.html("").append("In Progress");
                    }   
                    $("#ddlcareplanstatus").val("3");
                    break;
                case "2":
                    //var completedNeedCount = parseInt($("span.completedNeedCount").html());
                    //$("span.completedNeedCount").html("").append(completedNeedCount + 1);
                    if ($(goalRef).is("span")) {
                        var statusCircle = $(goalRef).parent().parent().prev();
                        statusCircle.removeClass("notStarted inProgress fullCompleted");
                        statusCircle.addClass("fullCompleted");
                        $(goalRef).removeClass("notStarted inProgress completed");
                        $(goalRef).addClass("completed");
                        $(goalRef).html("").append("Completed");
                    } else {
                        var statusCircle = $(goalRef).parent().prev().prev();
                        statusCircle.removeClass("notStarted inProgress fullCompleted");
                        statusCircle.addClass("fullCompleted");
                        var statusRef = $(goalRef).parent().parent().find("div.status_labels_div").find("span.status_value").last();
                        statusRef.removeClass("notStarted inProgress completed");
                        statusRef.addClass("completed");
                        statusRef.html("").append("Completed");
                    }
                    $("#ddlcareplanstatus").val("3");
                    break;
            }
            var goals = $(goalRef).closest("ul.goalsList");
            var notStartedGoals = goals.find("span.status_value.notStarted").length + goals.find("span.status_value.inProgress").length;
            var needCircle = goals.prev().find("div.editNeed").find("span").first();
            needCircle.html("").append(notStartedGoals);
            if (res.UpdatedNeed == 1) {
                var needStatusSpan = goals.prev().find("div.status_labels_div").find("span.status_value").last();
                needStatusSpan.removeClass("notStarted inProgress completed");
                needStatusSpan.addClass("inProgress");
                needStatusSpan.html("").append("In Progress");
            }   
            toastr.success("Changes saved successfully");
            $(".ddlStatus").val("0");
            $(".goalNote").val('');
            $("#CarePlanChangeStatusModal").modal('hide');
            var goalsCount = goals.find("li").not("li.newGoal").length;
            var completedgoalsCount = goals.find(`li[data-status="${needGoalEnum.Completed}"]`).length;
            if (goalsCount == completedgoalsCount) {
                $.alert({
                    title: 'Reminder Alert!',
                    content: 'Mark need  complete with comments',
                });
            }
        }, error: function () {
            toastr.error("Something happen Wrong");
            $(".loaderOverlay").hide();
        }
    });
}
function SaveOutCome(e) {
    if ($(".txtOutcome").val().trim() == "") {
        toastr.error("Outcomes is required");
        return;
    }
    var model = {
        Note: $(".txtOutcome").val(),
        NeedId: needId,
        CreatedBy: userId,
        ModifiedBy: userId
    }
    $.ajax({
        type: "POST",
        url: Apipath + '/api/PatientMain/saveoutcome',
        contentType: 'application/json; charset=UTF-8',
        data: JSON.stringify(model),
        dataType: "json",
        success: function (res) {
            $(".btnOutcome").removeClass("checkGreen");
            GetOutcomes();
            $(needRef).html("").append(`Outcomes(${$("span.outcomecount").html()})`);
            $(".txtOutcome").val("").css("height", "21px");;
            toastr.success("Changes saved successfully");
        }, error: function () {
            toastr.error("Something happen Wrong");
            $(".loaderOverlay").hide();
        }
    });

}
function SaveIntervention(e) {
    if ($(".txtIntervention").val().trim() == "") {
        toastr.error("Intervention is required");
        return;
    }
    var model = {
        Note: $(".txtIntervention").val(),
        GoalId: goalId,
        CreatedBy: userId,
        ModifiedBy: userId
    }
    $.ajax({
        type: "POST",
        url: Apipath + '/api/PatientMain/saveintervention',
        contentType: 'application/json; charset=UTF-8',
        data: JSON.stringify(model),
        dataType: "json",
        success: function (res) {
            $(".btnIntervention").removeClass("checkGreen");
            GetInterventions();
            $(".txtIntervention").val("").css("height", "21px");
            $(goalRef).html("").append(`Intervention(${$("span.outcomecount").html()})`);

            toastr.success("Changes saved successfully");
        }, error: function () {
            toastr.error("Something happen Wrong");
            $(".loaderOverlay").hide();
        }
    });

}

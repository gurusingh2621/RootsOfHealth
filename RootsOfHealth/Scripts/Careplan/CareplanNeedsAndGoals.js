var needId = 0;
var goalId = 0;
var needRef;
var goalRef;
var newGoalRef = "";
var defaultneedLen = 0;
var needStatus = 0;
var goalStatus = 0;
var DisableGoalFocusOut = false;
var DisableNeedFocusOut = false;
var needGoalEnum = {
    NotStarted: 0,
    InProgress: 1,
    Completed:2
}
$(".txtNeed").keypress(function (event) {
    var keycode = event.keyCode || event.which;
    if (keycode == '13' && !event.shiftKey) {
        DisableNeedFocusOut=true
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
            needstring += `<li class="hasChild" data-needid="${result[i].NeedID}" data-status="${result[i].NeedStatus}" data-defaultNeed="${result[i].DefaultneedId}">
                                <div class="needItem">
                                <div class="editNeed">
                                   <span class="countgoal not_start_circle needCountItems" onclick="ExpandCollapseFromGoalCount(this)">${notStartedGoals}</span>
                                   <div class="w-100">
                                   <span  class="needDesc">${result[i].NeedDesc}</span>
                                    <div class="edit_actions needAction">
                                           <button id="btnSaveEditNeed" type="button" onclick="saveEditNeed(this)" class="btn">Save</button>
                                           <button id="btnCancelEditNeed" type="button" onclick="cancelEditneed(this)" class="btn btn_cancel">Cancel</button>
                                     </div>
                                   <div class="status_labels_div">
                                   <span class="status_value outcome_status"  onclick="GetOutcomes(this)">Outcomes (${result[i].OutcomeCount})</span>`;
            switch (result[i].NeedStatus) {
                case needGoalEnum.NotStarted:
                    needstring += `<span onclick="EditNeedStatus(this)"  class="status_value notStarted needStatus">Not Started</span>`; 
                    break;
                case needGoalEnum.InProgress:
                    needstring += `<span onclick="EditNeedStatus(this)" class="status_value inProgress needStatus">In Progress</span>`;
                    break;
                case needGoalEnum.Completed:
                    needstring += `<span onclick="EditNeedStatus(this)" class="status_value completed needStatus">completed</span>`;
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
        //disabale form to edit if completed commented functionality
        if ($("#ddlcareplanstatus").val() != "4") {
            $(".needGoalHover").removeClass("disableHoverItem");
            $(".status_labels_div").find("span:last").removeClass("disableHoverItem");
            $("a.dragIcon").css("display", "inline-block");
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
            $("ul.ui-sortable li").on("mousedown", function (event) {
                if (event.target.id == "btnSaveEditNeed" || event.target.id == "btnCancelEditNeed"
                    || event.target.id == "btnSaveEditGoal" || event.target.id == "btnCancelEditGoal"
                    || event.target.id == "btnnewneed" || event.target.id == "btncancelnewneed"
                    || event.target.id == "btnnewgoal" || event.target.id == "btncancelnewgoal") {
                    $("#needContent").addClass("btnClicked");
                } else {
                    if ($(".txtneed").is(":focus")) {
                        $(".txtneed").blur();
                    }
                    if ($(".edittxtGoal").is(":focus")) {
                        $(".edittxtGoal").blur();
                    }
                    if ($(".txtNeed").is(":focus")) {
                        $(".txtNeed").blur();
                    }
                    if ($(".txtGoal").is(":focus")) {
                        $(".txtGoal").blur();
                    }
                }
            });
        } 
        else {
            $(".needGoalHover").addClass("disableHoverItem");
            $(".status_labels_div").find("span:last").addClass("disableHoverItem");
            $("a.dragIcon").css("display", "none");
            $("div.itemHoverActions").css("display", "none");
        }
    }
    $(".loaderOverlay").hide();
}
function SaveNeed(e) {
    if (!CanEditCarePlan()) {
        return
    }
    if ($(e).val().trim() == "") {
        toastr.error("", "Need is required", { progressBar: true });
        return;
    }
    if (IsCarePlanApproved && IsUserCarePlanApprover == 'False') {
        $.confirm({
            icon: 'fas fa-exclamation-triangle',
            title: 'Confirm',
            content: 'Care plan  status would be changed to unapproved and need approval to complete any need, goal or care plan. Press Confirm to continue.',
            type: 'red',
            typeAnimated: true,
            buttons: {
                confirm: {
                    btnClass: 'btn-danger',
                    action: function () {
                        SaveNeedFunction(e)
                        IsCarePlanApproved=false
                    }
                },
                cancel: function () {
                    var needTxt = $(".txtNeed");
                    $(e).closest('.editNeed').find('.needAction #btnCancelEditNeed').click();
                    $("#needContent").removeClass("btnClicked");
                    needTxt.val("").css("height", "21px");
                    NeedFocus();

                }
            }

        });
    } else {
        SaveNeedFunction(e)
    }


  
}

function SaveNeedFunction(e) {
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
            updateNeedStatusOnEditNeed(e)
            if ($(e).closest("li").attr("data-needid") == undefined) {
                var needString = `<li class="hasChild opened" data-needid="${result}" data-status="0" data-defaultNeed="0">
                                <div class="needItem">
                                <div class="editNeed">
                                <span class="countgoal not_start_circle needCountItems" onclick="ExpandCollapseFromGoalCount(this)">0</span>
                                <div class="w-100">
                                <span class="needDesc">${$(e).val()}</span>
                                <div class="edit_actions needAction">
                                           <button id="btnSaveEditNeed" type="button" onclick="saveEditNeed(this)" class="btn">Save</button>
                                           <button id="btnCancelEditNeed" type="button" onclick="cancelEditneed(this)" class="btn btn_cancel">Cancel</button>
                                 </div>
                                <div class="status_labels_div">
                                <span class="status_value outcome_status"  onclick="GetOutcomes(this)">Outcomes (0)</span>
                                <span onclick="EditNeedStatus(this)" class="status_value notStarted needStatus">Not Started</span>
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
                $("ul.ui-sortable li").on("mousedown", function (event) {
                    if (event.target.id == "btnSaveEditNeed" || event.target.id == "btnCancelEditNeed"
                        || event.target.id == "btnSaveEditGoal" || event.target.id == "btnCancelEditGoal"
                        || event.target.id == "btnnewneed" || event.target.id == "btncancelnewneed"
                        || event.target.id == "btnnewgoal" || event.target.id == "btncancelnewgoal") {
                        $("#needContent").addClass("btnClicked");
                    } else {
                        if ($(".txtneed").is(":focus")) {
                            $(".txtneed").blur();
                        }
                        if ($(".edittxtGoal").is(":focus")) {
                            $(".edittxtGoal").blur();
                        }
                        if ($(".txtGoal").is(":focus")) {
                            $(".txtGoal").blur();
                        }
                    }
                });
            } else {
                $(e).prev().html($(e).val());
                $(e).prev().show();
                $(e).next().hide();
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
                $("ul.ui-sortable li").on("mousedown", function (event) {
                    if (event.target.id == "btnSaveEditNeed" || event.target.id == "btnCancelEditNeed"
                        || event.target.id == "btnSaveEditGoal" || event.target.id == "btnCancelEditGoal"
                        || event.target.id == "btnnewneed" || event.target.id == "btncancelnewneed"
                        || event.target.id == "btnnewgoal" || event.target.id == "btncancelnewgoal") {
                        $("#needContent").addClass("btnClicked");
                    } else {
                        if ($(".txtneed").is(":focus")) {
                            $(".txtneed").blur();
                        }
                        if ($(".edittxtGoal").is(":focus")) {
                            $(".edittxtGoal").blur();
                        }
                        if ($(".txtGoal").is(":focus")) {
                            $(".txtGoal").blur();
                        }
                    }
                });
            }

            changeCareplanStatus()

        },
        error: function (e) {
            toastr.error("Unidentified error");
            $(".loaderOverlay").hide();
        }
    })
}
function SaveGoal(e) {
    if ($(e).val().trim() == "") {
        toastr.error("", "Goal is required", { progressBar: true });
        return;
    }
    if (IsCarePlanApproved && IsUserCarePlanApprover == 'False') {
        $.confirm({
            icon: 'fas fa-exclamation-triangle',
            title: 'Confirm',
            content: 'Care plan  status would be changed to unapproved and need approval to complete any need, goal or care plan. Press Confirm to continue.',
            type: 'red',
            typeAnimated: true,
            buttons: {
                confirm: {
                    btnClass: 'btn-danger',
                    action: function () {
                        SaveGoalfunction(e)
                        IsCarePlanApproved = false
                    }
                },
                cancel: function () {
                    $(e).closest('.editNeed').find('.goalAction #btnCancelEditGoal').click();
                    var goaltxt = $(".txtGoal");
                    $("#needContent").removeClass("btnClicked");
                    goaltxt.val("").css("height", "21px").focus();
                }
            }

        });
    } else {
        SaveGoalfunction(e)
    }
   
   
}
function SaveGoalfunction(e) {
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
            UpdateGoalstatusdom(e)
            updateNeedStatus(e);
            var goalList = $(e).closest(".goalsList");
            if ($(e).closest("li").attr("data-goalid") == undefined) {
                var goalString = `<li data-goalid="${result}" data-status="0" class="ui-sortable-handle">
                                  <div class="needItem">
                                  <div class="editNeed">
                                  <span class="countgoal notStarted"></span>
                                  <div class="w-100">
                                  <span class="goalcontent">${$(e).val()}</span>
                                  <div class="edit_actions goalAction">
                                  <button id="btnSaveEditGoal" type="button" onclick="saveEditGoal(this)" class="btn">Save</button>
                                  <button id="btnCancelEditGoal" type="button" onclick="cancelEditGoal(this)" class="btn btn_cancel">Cancel</button>
                                  </div>
                                  <div class="status_labels_div">
                                  <span class="status_value outcome_status" onclick="GetInterventions(this)">Intervention (0)</span>
                                  <span onclick="EditGoalStatus(this)" class="status_value notStarted goalStatus">Not Started</span>
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
                $("ul.ui-sortable li").on("mousedown", function (event) {
                    if (event.target.id == "btnSaveEditNeed" || event.target.id == "btnCancelEditNeed"
                        || event.target.id == "btnSaveEditGoal" || event.target.id == "btnCancelEditGoal"
                        || event.target.id == "btnnewneed" || event.target.id == "btncancelnewneed"
                        || event.target.id == "btnnewgoal" || event.target.id == "btncancelnewgoal") {
                        $("#needContent").addClass("btnClicked");
                    } else {
                        if ($(".txtneed").is(":focus")) {
                            $(".txtneed").blur();
                        }
                        if ($(".edittxtGoal").is(":focus")) {
                            $(".edittxtGoal").blur();
                        }
                        if ($(".txtGoal").is(":focus")) {
                            $(".txtGoal").blur();
                        }
                    }
                });
            } else {
                $(e).prev().html($(e).val());
                $(e).prev().show();
                $(e).next().hide();
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
                $("ul.ui-sortable li").on("mousedown", function (event) {
                    if (event.target.id == "btnSaveEditNeed" || event.target.id == "btnCancelEditNeed"
                        || event.target.id == "btnSaveEditGoal" || event.target.id == "btnCancelEditGoal"
                        || event.target.id == "btnnewneed" || event.target.id == "btncancelnewneed"
                        || event.target.id == "btnnewgoal" || event.target.id == "btncancelnewgoal") {
                        $("#needContent").addClass("btnClicked");
                    } else {
                        if ($(".txtneed").is(":focus")) {
                            $(".txtneed").blur();
                        }
                        if ($(".edittxtGoal").is(":focus")) {
                            $(".edittxtGoal").blur();
                        }
                        if ($(".txtGoal").is(":focus")) {
                            $(".txtGoal").blur();
                        }
                    }
                });
            }
            changeCareplanStatus()


        }, error: function (e) {
            toastr.error("Unidentified error");
            $(".loaderOverlay").hide();
        }
    })
}
function actionRequest() {
    if ($("a.need-nav").parent().hasClass("disabled")) {
        toastr.error("First submit basic information to enable needs and goals");
        return false;
    }
    getCarePlanRequest()
    $("a.request-nav").tab('show');
  }
function getCarePlanRequest() {
    $('#btnsendAproval').prop('disabled', false);
    $('#btnsendRevoke').prop('disabled', false)
     DisableGoalFocusOut = false;
     DisableNeedFocusOut = false;
    hideAprovalBtnStatus()
    $.ajax({
        type: "GET",
        url: Apipath + '/api/PatientMain/getcareplanrequest?CarePlanId=' + careplanid + '&UserId=' + userId,
        contentType: 'application/json; charset=UTF-8',
        dataType: "json",
        success: function (result) {
            if (result == null) {
                $('#btnApproval').css('display', 'block');
                $('#careplanStatus').css('display', 'block');
                $('#btnApproval').prop('disabled', false);
                $('#btnApproval').removeClass('disabled')
                $('#careplanStatus .requiredApproval').css('display', 'block');
            }
            else {
                RequestId = result.RequestId;
                prevSelectedCarePlan = result.CarePlanStatus;
                $('#ddlcareplanstatus').val(result.CarePlanStatus)
                IsCarePlanApproved = result.IsApproved
                RequestType = result.Type
                RequestStatus = result.Status == null ? 0 : result.Status
                if ((result.Type == 1 || result.Type == 3) && result.Status == '2') {
                    IsRequestSent = false
                    $('#careplanStatus').css('display', 'block');
                    $('#btnApproval').css('display', 'block');
                    if (IsCarePlanApproved) {
                        $('#careplanStatus .RequestApproved').css('display', 'block')
                        $('#btnApproval').prop('disabled', true);
                        $('#btnApproval').addClass('disabled')
                    }
                    else {
                        $('#careplanStatus .requiredApproval').css('display', 'block');
                        $('#btnApproval').prop('disabled', false);
                        $('#btnApproval').removeClass('disabled')
                    }
                }
                else {

                    IsRequestSent = true;
                    if ((result.Status == null || result.Status == 0) && result.Type == 1) {
                        $('#btnRevertRequest').css('display', 'block');
                        $('#careplanStatus').css('display', 'block');
                        $('#careplanStatus .ApprovalRequestSent').css('display', 'block');
                        if (result.GroupNames != null && result.GroupNames != '') {
                            $('#careplanStatus .sentGroups').css('display', 'block');
                            $('#careplanStatus .sentGroups').html('<b>Groups:</b> ' + result.GroupNames.substr(0, result.GroupNames.length - 2))
                        }
                        if (result.UserNames != null && result.UserNames != '') {
                            $('#careplanStatus .sentUsers').css('display', 'block');
                            $('#careplanStatus .sentUsers').html('<b>Users:</b> ' + result.UserNames.substr(0, result.UserNames.length - 2))
                        }
                    }
                    else if (result.Status == 1 && result.Type == 1) {
                        $('#btnRevokeRequest').css('display', 'block');
                        $('#careplanStatus').css('display', 'block');
                        $('#careplanStatus .RequestUnderReview').text('Request under review (Accepted by ' + result.AcceptedBy + ')').css('display', 'block');

                    }
                    else if (result.Status == 1 && result.Type == 3) {
                        $('#careplanStatus').css('display', 'block');
                        $('#careplanStatus .RevokeRequestSent').text('Revoke request is sent to ' + result.AcceptedBy).css('display', 'block');
                    }
                    else if (result.Status == null && result.Type == 2) {
                        IsRequestSent = false;
                        $('#careplanStatus').css('display', 'block');
                        $('#btnApproval').css('display', 'block');
                        $('#btnApproval').prop('disabled', false);
                        $('#btnApproval').removeClass('disabled')
                        $('#careplanStatus').css('display', 'block');
                        $('#careplanStatus .requiredApproval').css('display', 'block');
                    }
                }
            }
  
        }
        , error: function (e) {
            toastr.error("Unidentified error");
            $(".loaderOverlay").hide();
        }
    });

}


function hideAprovalBtnStatus(){
    $('#btnApproval').css('display', 'none');
    $('#btnRevertRequest').css('display', 'none');
    $('#btnRevokeRequest').css('display', 'none');
    $('#careplanStatus').css('display', 'none');
    $('#careplanStatus .ApprovalRequestSent').css('display', 'none');
    $('#careplanStatus .RequestUnderRleview').css('display', 'none'); 
    $('#careplanStatus .RequestUnderReview').css('display', 'none');
    $('#careplanStatus .RevokeRequestSent').css('display', 'none');
    $('#careplanStatus .sentGroups').css('display', 'none');
    $('#careplanStatus .sentUsers').css('display', 'none');
    $('#careplanStatus .RequestApproved').css('display', 'none');
    $('#careplanStatus .requiredApproval').css('display', 'none');
    $('#careplanStatus .notApproved').css('display', 'none')
}
function GetNeedAndGoalList() {
   
    if ($("a.need-nav").parent().hasClass("disabled")) {
        toastr.error("First submit basic information to enable needs and goals");
        return false;
    }
    if (IsUserCarePlanApprover == 'False') {
        getCarePlanRequest()
    }
   

    $("a.need-nav").tab('show');
    $(".loaderOverlay").show();
    $(".addNewNeed").tooltip();
    if ($("#ddlcareplanstatus").val() == "4") {        
        $(".txtNeed,.txtOutcome,.txtIntervention").attr("disabled", true);
        $("a.addNewNeed,li.last-child").css("display", "none");
    } else {
        $(".txtNeed,.txtOutcome,.txtIntervention").removeAttr("disabled");
        $("a.addNewNeed,li.last-child").css("display", "block");
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
            toastr.error("Unidentified error");
            $(".loaderOverlay").hide();
        }
    });
}
function DeleteNeed(obj) {
    if (!CanEditCarePlan()) {
        return
    }
    if ($(obj).hasClass("disableHoverItem")) {
        return;
    }
    if (IsUserCarePlanApprover == 'False') {
        var statusNeed = $(obj).closest("li").attr("data-status")
        if (statusNeed == "1") {
            toastr.error("Cant delete In-progress need")
            return;
        }
        else if (statusNeed == "2") {
            toastr.error("Cant delete completed need")
            return;
        }
    }
   
    //$.ajax({
    //    type: "GET",
    //    url: Apipath + '/api/PatientMain/editneed?NeedId=' + $(obj).closest("li").attr("data-needid"),
    //    contentType: 'application/json; charset=UTF-8',
    //    dataType: "json",
    //    success: function (result) {
    //        switch (result) {
    //            case 0:
    //                toastr.error("Cannot Delete.  Item contains historical Data");
    //                break;
    //            default:
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
                                            changeCareplanStatus()
                                        }, error: function (e) {
                                            toastr.error("Unidentified error");
                                            $(".loaderOverlay").hide();
                                        }
                                    })
                                }

                            },
                            cancel: function () {

                            }
                        }
                    });
                    
           // }
    //    }, error: function (e) {
    //        toastr.error("Unidentified error");
    //        $(".loaderOverlay").hide();
    //    }
    //});
    
}


function CanEditCarePlan() {
    
    if (IsRequestSent && IsUserCarePlanApprover == 'False') {
        if (RequestType == 1 && RequestStatus == '1') {
            toastr.error("Please send revoke request to make changes");
        }
        else if (RequestType == 3) {
            toastr.error("Cant make any change to careplan till careplan revoke request is accepted");
        }
        else if (RequestType == 1 && RequestStatus == '0') {
            toastr.error("Revert your approval request to make changes")
        }
      
        return false;
    }
    return true;

}

function DeleteGoal(obj) {
    if (!CanEditCarePlan()) {
      return
    }

    if ($(obj).hasClass("disableHoverItem")) {
        return;
    }
    if (IsUserCarePlanApprover == 'False') {
        var statusGoal = $(obj).closest("li").attr("data-status")
        if (statusGoal == "1") {
            toastr.error("Cant delete In-progress goal")
            return;
        }
        else if (statusGoal == "2") {
            toastr.error("Cant delete completed goal")
            return;
        }
    }
   
    //$.ajax({
    //    type: "GET",
    //    url: Apipath + '/api/PatientMain/editgoal?GoalId=' + $(obj).closest("li").attr("data-goalid"),
    //    contentType: 'application/json; charset=UTF-8',
    //    dataType: "json",
    //    success: function (result) {
    //        switch (result) {
    //            case 0:
    //                toastr.error("Cannot Delete.  Item contains historical Data");
    //                break;
    //            default:
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
                            updateNeedStatus(obj);
                            var goalCount = $(obj).closest("li").siblings().length;
                            if (goalCount == 0) {
                                $(obj).closest(".goalsList").prev().find("i.down_arrow").addClass("hide_down_arrow");
                            }
                            var goalCount = parseInt($(obj).closest(".goalsList").prev().find(".countgoal").html());
                            $(obj).closest(".goalsList").prev().find(".countgoal").html("").append(goalCount - 1);
                            $(obj).closest("li").remove();
                            toastr.success("", "Changes saved successfully", { progressBar: true });
                            changeCareplanStatus()
                        }, error: function (e) {
                            toastr.error("Unidentified error");
                            $(".loaderOverlay").hide();
                        }


                    })
                },
            },
            cancel: function () {

            }
        }
    })
    //                break;
    //        }
    //    }, error: function (e) {
    //        toastr.error("Unidentified error");
    //        $(".loaderOverlay").hide();
    //    }
    //});
}
function AddNewGoalFromNeed(e) {
    if (!CanEditCarePlan()) {
        return
    }
   
    if ($(e).hasClass("disableHoverItem")) {
        return;
    }
    $(e).closest("ul.needsList").find("ul.goalsList").not($(e).parent().parent().next()).each(function (index, item) {
        $(item).find("li.newGoal").remove();
    });
    var isDefaultNeed = parseInt($(e).closest("li.hasChild").attr("data-defaultneed")) > 0 ? true : false;
    if (isDefaultNeed && newGoalRef==""){
        newGoalRef = e;
        $(".defaultNeedAction").removeClass("d-flex").addClass("d-none");
        $(".defaultGoalAction").removeClass("d-none").addClass("d-flex");
        $("h5.defaultNeedTitle").html("").append("Default goals for need: <span>" + $(e).parent().parent().find("span.needDesc").html() + "</span>");
        GetDefaultgoals($(e).closest("li.hasChild").attr("data-needid"),$(e).closest("li.hasChild").attr("data-defaultneed"));
        return;
    }
    if ($(e).parent().parent().next().find("li").last().hasClass("newGoal")) {
        if (!$(e).closest("li.hasChild ").hasClass("opened")) {
            $(e).closest("li.hasChild ").addClass("opened");
            $(e).closest("div.needItem").next().css("display", "block");
            $(".txtGoal").focus();
        }
        $(".txtGoal").focus();
        return;
    }
    var goalString = `<li class="newGoal">
                      <div class="addNewNeedGoal"><div class="plusIcon"><i class="fa fa-plus"></i></div>
                      <textarea maxlength="1000" class="txtGoal" placeholder="add goal" onkeyup="textAreaAdjust(this)" onblur="GoalOnBlur()"></textarea>
                      <div class="edit_actions">
                      <button id="btnnewgoal" type="button" onclick="saveNewGoal(this)" class="btn">Save</button>
                      <button id="btncancelnewgoal" type="button" onclick="cancelNewGoal(this)" class="btn btn_cancel">Cancel</button>
                       </div>
                      </div></li>`;
    var isgoalulExist = $(e).parent().parent().next().is("ul");
    if (isgoalulExist) {
        $(e).parent().parent().next().append(goalString);
    } else {
        $(e).parent().parent().after(`<ul class="goalsList">${goalString}</ul>`);
    }
    $(".txtGoal").keypress(function (event) {
        var keycode = event.keyCode || event.which;
        if (keycode == '13' && !event.shiftKey) {
            DisableGoalFocusOut=true
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
    if (!CanEditCarePlan()) {
        return
    }
    
    if ($(o).hasClass("disableHoverItem")) {
        return;
    }
    
    //$.ajax({
    //    type: "GET",
    //    url: Apipath + '/api/PatientMain/editgoal?GoalId=' + $(o).closest("li").attr("data-goalid"),
    //    contentType: 'application/json; charset=UTF-8',
    //    dataType: "json",
    //    success: function (result) {
    //        switch (result) {
    //            case 0:
    //                toastr.error("Cannot Edit.Item contains historical Data");
    //                break;
    //            default:
                    $(o).closest("ul.needsList").find("ul.goalsList li").not($(o).closest("li")).each(function (index, item) {
                        $(item).find("span.goalcontent").show();
                        $(item).find("div.goalAction").hide();
                        $(item).find("textarea.edittxtGoal").remove();
                    });
                    var item = $(o).parent().prev().find("span.goalcontent");
                    if (item.next().is("textarea")) {
                        $(".edittxtGoal").focus();
                    } else {
                        $(o).parent().prev().find("div.goalAction").show();
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
                                
                                DisableGoalFocusOut = true
                                SaveGoal(this, goalRef);
                                event.preventDefault();
                            }
                        });
                        //$(".edittxtGoal").focusout(function () {
                        //    $(this).prev().show();
                        //    $(this).remove();
                        //})
                        $(".edittxtGoal").focusout(function () {
                            
                            if (DisableGoalFocusOut) {
                                DisableGoalFocusOut = false;
                                return;
                            }
                            goalRef = item;
                            if ($(goalRef).html() == $(goalRef).next().val()) {
                                return;
                            }
                            if ($("#needContent").hasClass("btnClicked")) {
                                return;
                            }
                            $.confirm({
                                icon: 'fas fa-exclamation-triangle',
                                title: 'Confirm',
                                content: 'You have unsaved changes for this goal!' + `<hr/>
                      <p class="goal-title">Goal</p>
                      <p class="goal-content">${$(goalRef).next().val()}</p>`,
                                type: 'green',
                                columnClass: 'col-md-6 col-md-offset-3',
                                typeAnimated: true,
                                buttons: {
                                    save: {
                                        text: 'save changes',
                                        btnClass: 'btn-green',
                                        action: function () {
                                            if ($(goalRef).next().val().trim() == "") {
                                                toastr.error("", "Goal is required", { progressBar: true });
                                                return;
                                            }
                                           
                                            if (IsCarePlanApproved && IsUserCarePlanApprover == 'False') {
                                                $.confirm({
                                                    icon: 'fas fa-exclamation-triangle',
                                                    title: 'Confirm',
                                                    content: 'Care plan  status would be changed to unapproved and need approval to complete any need, goal or care plan. Press Confirm to continue.',
                                                    type: 'red',
                                                    typeAnimated: true,
                                                    buttons: {
                                                        confirm: {
                                                            btnClass: 'btn-danger',
                                                            action: function () {
                                                                EditGoalfunction(o, goalRef)
                                                                IsCarePlanApproved = false
                                                            }
                                                        },
                                                        cancel: function () {
                                                            $(o).closest('.editNeed').find('.goalAction #btnCancelEditGoal').click();
                                                        }
                                                    }

                                                });
                                            } else {
                                                EditGoalfunction(o, goalRef)
                                            }
                                           
                                        }
                                    },
                                    cancel: {
                                        action: function () {
                                            $(goalRef).show();
                                            $(goalRef).next().remove();
                                            $(goalRef).next().hide();
                                        }
                                    }
                                },

                            });
                        });
                        $(".edittxtGoal").focus();
                       /* break;*/
                    }
    //        }
    //    }, error: function (e) {
    //        toastr.error("Unidentified error");
    //        $(".loaderOverlay").hide();
    //    }
    //});   
}

function EditGoalfunction(o, goalRef) {
    var goalModel = {
        GoalID: $(goalRef).closest("li").attr("data-goalid"),
        GoalDesc: $(goalRef).next().val(),
        Status: needGoalEnum.NotStarted,
        NeedID: $(goalRef).closest("ul.goalsList").parent().attr("data-needid"),
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
            UpdateGoalstatusdom(o)
            updateNeedStatus(o);
            $("#needContent").removeClass("btnClicked");
            $(goalRef).html("").append($(goalRef).next().val()).show();
            $(goalRef).next().remove();
            $(goalRef).next().hide();
            changeCareplanStatus()
        }, error: function (e) {
            toastr.error("Unidentified error");
            $(".loaderOverlay").hide();
        }
    });




}
function EditNeed(o) {
    if (!CanEditCarePlan()) {
        return
    }
    if ($(o).hasClass("disableHoverItem")) {
        return;
    }
    //$.ajax({
    //    type: "GET",
    //    url: Apipath + '/api/PatientMain/editneed?NeedId=' + $(o).closest("li").attr("data-needid"),
    //    contentType: 'application/json; charset=UTF-8',
    //    dataType: "json",
    //    success: function (result) {
    //        switch (result) {
    //            case 0:
    //                toastr.error("Cannot Edit.  Item contains historical Data");
    //                break;
                   /* default:*/
                    $(o).closest("ul.needsList").find("li").not($(o).parent().parent().prev()).each(function (index, item) {
                        $(item).find("span.needDesc").show();
                        $(item).find("div.needAction").hide();
                        $(item).find("textarea.txtneed").remove();
                    });
                    var item = $(o).parent().parent().find("span.needDesc");
                    if (item.next().is('textarea')) {
                        $(".txtneed").focus();
                    } else {
                        $(o).parent().parent().find("div.needAction").show();
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
                        });
                        $(".txtneed").keypress(function (event) {
                            var keycode = event.keyCode || event.which;
                            if (keycode == '13' && !event.shiftKey) {
                                DisableNeedFocusOut=true
                                SaveNeed(this);
                                event.preventDefault();
                            }
                        });
                        //$(".txtneed").focusout(function () {
                        //    $(this).prev().show();
                        //    $(this).next().hide();
                        //    $(this).remove();

                        //});
                        $(".txtneed").focusout(function () {
                            if (DisableNeedFocusOut) {
                                DisableNeedFocusOut = false;
                                return;
                            }
                            needRef = item;
                            if ($(needRef).html() == $(needRef).next().val()) {
                                
                                return;
                            }
                            if ($("#needContent").hasClass("btnClicked")) {
                                return;
                            }
                            $.confirm({
                                icon: 'fas fa-exclamation-triangle',
                                title: 'Confirm',
                                content: 'You have unsaved changes for this need!' + `<hr/>
                                 <p class="need-title">Need</p>
                                  <p class="need-content">${$(needRef).next().val()}</p>`,
                                type: 'green',
                                columnClass: 'col-md-6 col-md-offset-3',
                                typeAnimated: true,
                                buttons: {
                                    save: {
                                        text: 'save changes',
                                        btnClass: 'btn-green',
                                        action: function () {
                                            if ($(needRef).next().val().trim() == "") {
                                                toastr.error("", "Need is required", { progressBar: true });
                                                return;
                                            }

                                            if (IsCarePlanApproved && IsUserCarePlanApprover == 'False') {
                                                $.confirm({
                                                    icon: 'fas fa-exclamation-triangle',
                                                    title: 'Confirm',
                                                    content: 'Care plan  status would be changed to unapproved and need approval to complete any need, goal or care plan. Press Confirm to continue.',
                                                    type: 'red',
                                                    typeAnimated: true,
                                                    buttons: {
                                                        confirm: {
                                                            btnClass: 'btn-danger',
                                                            action: function () {
                                                                EditNeedfunction(o, needRef)
                                                                IsCarePlanApproved = false
                                                            }
                                                        },
                                                        cancel: function () {
                                                            $(o).closest('.editNeed').find('.needAction #btnCancelEditNeed').click();
                                                        }
                                                    }

                                                });
                                            } else {
                                                EditNeedfunction(o, needRef)
                                            }
                                        }
                                    },
                                    cancel: {
                                        action: function () {
                                            $("#needContent").removeClass("btnClicked");
                                            $(needRef).show();
                                            $(needRef).next().remove();
                                            $(needRef).next().hide();
                                        }
                                    }
                                },
                            });
                        });
                        $(".txtneed").focus();
                    }
                   
    //        }
    //    }, error: function (e) {
    //        toastr.error("Unidentified error");
    //        $(".loaderOverlay").hide();
    //    }
    //});
    
}

function EditNeedfunction(o, needRef) {
    var needModel = {
        NeedID: $(needRef).closest("li").attr("data-needid"),
        NeedDesc: $(needRef).next().val(),
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
            updateNeedStatusOnEditNeed(o)
            $("#needContent").removeClass("btnClicked");
            $(needRef).html("").append($(needRef).next().val()).show();
            $(needRef).next().remove();
            $(needRef).next().hide();

            changeCareplanStatus()
        },
        error: function (e) {
            toastr.error("Unidentified error");
            $(".loaderOverlay").hide();
        }
    });
}

function saveEditNeed(obj) {
    DisableNeedFocusOut = true;
    if (!CanEditCarePlan()) {
        return
    }
    
    if (IsCarePlanApproved && IsUserCarePlanApprover == 'False') {
        $.confirm({
            icon: 'fas fa-exclamation-triangle',
            title: 'Confirm',
            content: 'Care plan  status would be changed to unapproved and need approval to complete any need, goal or care plan. Press Confirm to continue.',
            type: 'red',
            typeAnimated: true,
            buttons: {
                confirm: {
                    btnClass: 'btn-danger',
                    action: function () {
                        saveEditNeedFunction(obj)
                        IsCarePlanApproved = false
                    }
                },
                cancel: function () {
                    $(obj).closest('.editNeed').find('.needAction #btnCancelEditNeed').click();
                }
            }

        });
    } else {
        saveEditNeedFunction(obj)
    }
}

function saveEditNeedFunction(obj) {
    var needObj = $(obj).parent().prev();
    if (needObj.val().trim() == "") {
        toastr.error("", "Need is required", { progressBar: true });
        return;
    }
    
    var needModel = {
        NeedID: $(obj).closest("li").attr("data-needid"),
        NeedDesc: needObj.val(),
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
            
            updateNeedStatusOnEditNeed(obj)
            $("#needContent").removeClass("btnClicked");
            $(needObj).prev().html("").append(needObj.val());
            $(needObj).prev().show();
            $(needObj).next().hide();
            $(needObj).remove();

            changeCareplanStatus()
        },
        error: function (e) {
            toastr.error("Unidentified error");
            $(".loaderOverlay").hide();
        }
    })
}
function changeCareplanStatus() {
    
    IsCarePlanChanged = true;
    IsCarePlanApproved=false
    /*toastr.success("Need approval")*/
    if (prevSelectedCarePlan == "4") {
        prevSelectedCarePlan = "3";
        $('#ddlcareplanstatus').val("3")
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
    if (!CanEditCarePlan()) {
        return
    }
    if ($(obj).hasClass("disableHoverItem")) {
        return;
    }
    $("#CarePlanChangeStatusModal .goalNote").show();
    $("#CarePlanChangeStatusModal .needNote").hide();
    $("#CarePlanChangeStatusModal .submitGoalStatus").show();
    $("#CarePlanChangeStatusModal .submitNeedStatus").hide();
    goalRef = obj;
    var status = $(obj).closest("li").attr("data-status");
    goalStatus = status
    goalId = $(obj).closest("li").attr("data-goalid");
    var goalDesc = $(obj).closest("li").find("span.goalcontent").html();
    $(".status_description").find("p").html("").append(goalDesc);
    $(".status_description").find("label").html("").append("Goal");
    $(".goalNote").val('');
    $("#CarePlanChangeStatusModal").find("select").first().val(status);
    $("#CarePlanChangeStatusModal").modal({
        backdrop: 'static',
        keyboard: false
    });
}
function EditNeedStatus(obj) {
    
    if (!CanEditCarePlan()) {
        return
    }
    if ($(obj).hasClass("disableHoverItem")) {
        return;
    } 
    $("#CarePlanChangeStatusModal .goalNote").hide();
    $("#CarePlanChangeStatusModal .needNote").show();
    $("#CarePlanChangeStatusModal .submitGoalStatus").hide();
    $("#CarePlanChangeStatusModal .submitNeedStatus").show();
    needRef = obj;
    var status = $(obj).closest("li").attr("data-status");
    needStatus = status;
    needId = $(obj).closest("li").attr("data-needid");
    var needDesc = $(obj).closest("li").find("span.needDesc").html();
    $(".status_description").find("p").html("").append(needDesc);
    $(".status_description").find("label").html("").append("Need");
    $(".needNote").val('');
    $("#CarePlanChangeStatusModal").find("select").first().val(status);
    $("#CarePlanChangeStatusModal").modal({
        backdrop: 'static',
        keyboard: false
    });
}
function GetInterventions(obj) {
    if (!CanEditCarePlan()) {
        return
    }

    if (obj != null) {
        goalRef = obj;
        $(".outcomeTitle").html("").append('Interventions(<span class="outcomecount">0</span>)');
        $(".txtIntervention,.btnIntervention").show();
        $(".txtOutcome,.btnOutcome").hide();
        $(".txtIntervention").val("");
        goalId = $(obj).closest("li").attr("data-goalid");
        if ($("#ddlcareplanstatus").val() == "4") {
            $(".txtIntervention").closest("div.a_outcome_item").hide();
        } else {
            $(".txtIntervention").closest("div.a_outcome_item").show();
        }
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
            toastr.error("Unidentified error");
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
    if (!CanEditCarePlan()) {
        return
    }

    if (obj != null) {
        needRef = obj;
        $(".outcomeTitle").html("").append('Outcomes(<span class="outcomecount">0</span>)');
        $(".txtIntervention,.btnIntervention").hide();
        $(".txtOutcome,.btnOutcome").show();
        $(".txtOutcome").val("");
        needId = $(obj).closest("li").attr("data-needid");
        if ($("#ddlcareplanstatus").val() == "4") {
            $(".txtOutcome").closest("div.a_outcome_item").hide();
        } else {
            $(".txtOutcome").closest("div.a_outcome_item").show();
        }
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
            toastr.error("Unidentified error");
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
    
    if (IsUserCarePlanApprover == 'False') {
        var changedStatus = $(".ddlStatus").val()
        if (needStatus == '0' && (changedStatus == "1" || changedStatus == "2")) {
            if (changedStatus == '1') {
                toastr.error("Status can't be changed to In-progress")
            }
            else {
                toastr.error("Status can't be changed to completed")
            }
            return
        }
        else if (changedStatus == '0' && (needStatus == "1" || needStatus == "2")) {

            toastr.error("Status can be changed to Not-started")
            return
        }
    }

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
            if (res == "-2") {
                if (RequestType == 1 && RequestStatus == '2') {
                    toastr.error("Care plan approval required to change status of goal or need");
                }
                else if (RequestType == 1 && RequestStatus == '1') {
                    toastr.error("Please send revoke request to make changes");
                }
                else if (RequestType == 3) {
                    toastr.error("Cant make any change to careplan till careplan revoke request is accepted");
                }
                else if (RequestType == 1 && RequestStatus == '0') {
                    toastr.error("Revert your approval request to make changes")
                }
               

            } else {

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
            }
            $(".ddlStatus").val("0");
            $(".needNote").val('');
            $("#CarePlanChangeStatusModal").modal('hide');
        }, error: function () {
            toastr.error("Unidentified error");
            $(".loaderOverlay").hide();
        }
    });
}

function isUserCarePlanApprover() {
    
    $.ajax({
        type: "get",
        url: Apipath + '/api/PatientMain/isusercareplanapproval?userid=' + userId,
        contentType: 'application/json; charset=UTF-8',
        data: JSON.stringify(model),
        dataType: "json",
        success: function (res) {
            isUserCareplanApprover = res == null ? false : res;
           
        },
        error: function () {
            toastr.error("Unidentified error");
            $(".loaderOverlay").hide();
        }
    });


}
function UpdateGoalStatus() {
    var changedStatus = $(".ddlStatus").val()
    if (IsUserCarePlanApprover == 'False') {
        if (goalStatus == '0' && (changedStatus == "1" || changedStatus == "2")) {
            if (changedStatus == '1') {
                toastr.error("Status can't be changed to In progress")
            }
            else {
                toastr.error("Status can't be changed to completed")
            }
            return
        }
        else if (changedStatus == '0' && (goalStatus == "1" || goalStatus == "2")) {

            toastr.error("Status can't be changed to Not-started")
            return
        }
    }
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
            if (res.GoalId == "-2") {
                if (RequestType == 1 && RequestStatus == '2') {
                    toastr.error("Care plan approval required to change status of goal or need");
                }
                else if (RequestType == 1 && RequestStatus == '1') {
                    toastr.error("Please send revoke request to make changes");
                }
                else if (RequestType == 3) {
                    toastr.error("Cant make any change to careplan till careplan revoke request is accepted");
                }
                else if (RequestType == 1 && RequestStatus == '0') {
                    toastr.error("Revert your approval request to make changes")
                }
               
            }
            else {
                $(goalRef).closest("li").attr("data-status", model.Status);
                updateNeedStatus(goalRef);
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
            }
        }, error: function () {
            toastr.error("Unidentified error");
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
            toastr.error("Unidentified error");
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
            toastr.error("Unidentified error");
            $(".loaderOverlay").hide();
        }
    });

}
function cancelEditneed(obj) {
    $("#needContent").removeClass("btnClicked");
    if ($(obj).parent().prev().hasClass("txtneed")) {
        $(obj).parent().prev().remove();
    }
    $(obj).parent().prev().show();
    $(obj).parent().hide();

}
function saveEditGoal(obj) {
    
    DisableGoalFocusOut=true
    var goalObj = $(obj).parent().prev();
    if (goalObj.val().trim() == "") {
        toastr.error("", "Goal is required", { progressBar: true });
        return;
    }
    if (IsCarePlanApproved && IsUserCarePlanApprover == 'False') {
        $.confirm({
            icon: 'fas fa-exclamation-triangle',
            title: 'Confirm',
            content: 'Care plan  status would be changed to unapproved and need approval to complete any need, goal or care plan. Press Confirm to continue.',
            type: 'red',
            typeAnimated: true,
            buttons: {
                confirm: {
                    btnClass: 'btn-danger',
                    action: function () {
                        saveEditGoalfunction(obj, goalObj)
                        IsCarePlanApproved = false
                    }
                },
                cancel: function () {
                    $(obj).closest('.editNeed').find('.goalAction #btnCancelEditGoal').click();
                }
            }

        });
    } else {
        saveEditGoalfunction(o, goalObj)
    }
    
   
}
function saveEditGoalfunction(obj, goalObj) {
    var goalModel = {
        GoalID: $(obj).closest("li").attr("data-goalid"),
        GoalDesc: goalObj.val(),
        Status: needGoalEnum.NotStarted,
        NeedID: $(obj).closest("ul.goalsList").parent().attr("data-needid"),
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
            UpdateGoalstatusdom(obj)
            updateNeedStatus(obj);
            $("#needContent").removeClass("btnClicked");
            $(goalObj).prev().html("").append(goalObj.val());
            $(goalObj).prev().show();
            $(goalObj).next().hide();
            $(goalObj).remove();
            changeCareplanStatus()
        }, error: function (e) {
            toastr.error("Unidentified error");
            $(".loaderOverlay").hide();
        }
    });
}
function cancelEditGoal(obj) {
    
    $("#needContent").removeClass("btnClicked");
    if ($(obj).parent().prev().hasClass("edittxtGoal")) {
        $(obj).parent().prev().remove();
    }
    $(obj).parent().prev().show();
    $(obj).parent().hide();
}
function saveNewNeed(obj) {
    if (!CanEditCarePlan()) {
        return
    }
    var needTxt = $(".txtNeed");
    if (needTxt.val().trim() == "") {
        toastr.error("", "Need is required", { progressBar: true });
        return;
    }
    if (IsCarePlanApproved && IsUserCarePlanApprover == 'False') {
        $.confirm({
            icon: 'fas fa-exclamation-triangle',
            title: 'Confirm',
            content: 'Care plan  status would be changed to unapproved and need approval to complete any need, goal or care plan. Press Confirm to continue.',
            type: 'red',
            typeAnimated: true,
            buttons: {
                confirm: {
                    btnClass: 'btn-danger',
                    action: function () {
                        SaveNewNeedFunction(obj)
                        IsCarePlanApproved = false
                    }
                },
                cancel: function () {
                    $("#needContent").removeClass("btnClicked");
                    needTxt.val("").css("height", "21px");
                    NeedFocus();
                }
            }

        });
    } else {
        SaveNewNeedFunction(obj)
    }

}

function SaveNewNeedFunction(obj) {
    var needTxt =$(".txtNeed");
    
    var needModel = {
        NeedID: needTxt.closest("li").attr("data-needid"),
        NeedDesc: needTxt.val(),
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
            updateNeedStatusOnEditNeed(obj)
            $("#needContent").removeClass("btnClicked");
            if (needTxt.closest("li").attr("data-needid") == undefined) {
                var needString = `<li class="hasChild opened" data-needid="${result}" data-status="0" data-defaultNeed="0">
                                <div class="needItem">
                                <div class="editNeed">
                                <span class="countgoal not_start_circle needCountItems" onclick="ExpandCollapseFromGoalCount(this)">0</span>
                                <div class="w-100">
                                <span class="needDesc">${needTxt.val()}</span>
                                <div class="edit_actions needAction">
                                           <button id="btnSaveEditNeed" type="button" onclick="saveEditNeed(this)" class="btn">Save</button>
                                           <button id="btnCancelEditNeed" type="button" onclick="cancelEditneed(this)" class="btn btn_cancel">Cancel</button>
                                 </div>
                                <div class="status_labels_div">
                                <span class="status_value outcome_status"  onclick="GetOutcomes(this)">Outcomes (0)</span>
                                <span onclick="EditNeedStatus(this)" class="status_value notStarted needStatus">Not Started</span>
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
                needTxt.val("").css("height", "21px");
                $(".needsList").prev().html("");
                var needCount = parseInt($("span.needCount").html());
                $("span.needCount").html("").append(needCount + 1);
                needTxt.blur();
                NeedFocus();
                $("ul.ui-sortable li").on("mousedown", function (event) {
                    if (event.target.id == "btnSaveEditNeed" || event.target.id == "btnCancelEditNeed"
                        || event.target.id == "btnSaveEditGoal" || event.target.id == "btnCancelEditGoal"
                        || event.target.id == "btnnewneed" || event.target.id == "btncancelnewneed"
                        || event.target.id == "btnnewgoal" || event.target.id == "btncancelnewgoal") {
                        $("#needContent").addClass("btnClicked");
                    } else {
                        if ($(".txtneed").is(":focus")) {
                            $(".txtneed").blur();
                        }
                        if ($(".edittxtGoal").is(":focus")) {
                            $(".edittxtGoal").blur();
                        }
                        if ($(".txtGoal").is(":focus")) {
                            $(".txtGoal").blur();
                        }
                    }
                });
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
                $("ul.ui-sortable li").on("mousedown", function (event) {
                    if (event.target.id == "btnSaveEditNeed" || event.target.id == "btnCancelEditNeed"
                        || event.target.id == "btnSaveEditGoal" || event.target.id == "btnCancelEditGoal"
                        || event.target.id == "btnnewneed" || event.target.id == "btncancelnewneed"
                        || event.target.id == "btnnewgoal" || event.target.id == "btncancelnewgoal") {
                        $("#needContent").addClass("btnClicked");
                    } else {
                        if ($(".txtneed").is(":focus")) {
                            $(".txtneed").blur();
                        }
                        if ($(".edittxtGoal").is(":focus")) {
                            $(".edittxtGoal").blur();
                        }
                        if ($(".txtGoal").is(":focus")) {
                            $(".txtGoal").blur();
                        }
                    }
                });
            }

            changeCareplanStatus()


        },
        error: function (e) {
            toastr.error("Unidentified error");
            $(".loaderOverlay").hide();
        }
    })
}
function saveNewGoal(obj) {
    var goaltxt = $(".txtGoal");
    if (goaltxt.val().trim() == "") {
        toastr.error("", "Goal is required", { progressBar: true });
        return;
    }
    if (IsCarePlanApproved && IsUserCarePlanApprover == 'False') {
        $.confirm({
            icon: 'fas fa-exclamation-triangle',
            title: 'Confirm',
            content: 'Care plan  status would be changed to unapproved and need approval to complete any need, goal or care plan. Press Confirm to continue.',
            type: 'red',
            typeAnimated: true,
            buttons: {
                confirm: {
                    btnClass: 'btn-danger',
                    action: function () {
                        saveNewGoalfunction(obj)
                        IsCarePlanApproved = false
                    }
                },
                cancel: function () {
                    $(e).closest('.editNeed').find('.goalAction #btnCancelEditGoal').click();
                    var goaltxt = $(".txtGoal");
                    $("#needContent").removeClass("btnClicked");
                    goaltxt.val("").css("height", "21px").focus();
                }
            }

        });
    } else {
        saveNewGoalfunction(obj)
    }
   
}

function saveNewGoalfunction(obj) {
   
    var goaltxt = $(".txtGoal");
    var goalModel = {
        GoalID: goaltxt.closest("li").attr("data-goalid"),
        GoalDesc: goaltxt.val(),
        Status: needGoalEnum.NotStarted,
        NeedID: goaltxt.closest("ul.goalsList").parent().attr("data-needid"),
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
            UpdateGoalstatusdom(obj)
            updateNeedStatus(obj);
            $("#needContent").removeClass("btnClicked");
            var goalList = goaltxt.closest(".goalsList");
            if (goaltxt.closest("li").attr("data-goalid") == undefined) {
                var goalString = `<li data-goalid="${result}" data-status="0" class="ui-sortable-handle">
                                  <div class="needItem">
                                  <div class="editNeed">
                                  <span class="countgoal notStarted"></span>
                                  <div class="w-100">
                                  <span class="goalcontent">${goaltxt.val()}</span>
                                  <div class="edit_actions goalAction">
                                  <button id="btnSaveEditGoal" type="button" onclick="saveEditGoal(this)" class="btn">Save</button>
                                  <button id="btnCancelEditGoal" type="button" onclick="cancelEditGoal(this)" class="btn btn_cancel">Cancel</button>
                                  </div>
                                  <div class="status_labels_div">
                                  <span class="status_value outcome_status" onclick="GetInterventions(this)">Intervention (0)</span>
                                  <span onclick="EditGoalStatus(this)" class="status_value notStarted goalStatus">Not Started</span>
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
                goaltxt.val("").focus().css("height", "21px");
                var goalCount = parseInt(goaltxt.closest("ul.goalsList").prev().find(".countgoal").first().html());
                goaltxt.closest("ul.goalsList").prev().find(".countgoal").first().html("").append(goalCount + 1);
                $("ul.ui-sortable li").on("mousedown", function (event) {
                    if (event.target.id == "btnSaveEditNeed" || event.target.id == "btnCancelEditNeed"
                        || event.target.id == "btnSaveEditGoal" || event.target.id == "btnCancelEditGoal"
                        || event.target.id == "btnnewneed" || event.target.id == "btncancelnewneed"
                        || event.target.id == "btnnewgoal" || event.target.id == "btncancelnewgoal") {
                        $("#needContent").addClass("btnClicked");
                    } else {
                        if ($(".txtneed").is(":focus")) {
                            $(".txtneed").blur();
                        }
                        if ($(".edittxtGoal").is(":focus")) {
                            $(".edittxtGoal").blur();
                        }
                        if ($(".txtGoal").is(":focus")) {
                            $(".txtGoal").blur();
                        }
                    }
                });
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
                $("ul.ui-sortable li").on("mousedown", function (event) {
                    if (event.target.id == "btnSaveEditNeed" || event.target.id == "btnCancelEditNeed"
                        || event.target.id == "btnSaveEditGoal" || event.target.id == "btnCancelEditGoal"
                        || event.target.id == "btnnewneed" || event.target.id == "btncancelnewneed"
                        || event.target.id == "btnnewgoal" || event.target.id == "btncancelnewgoal") {
                        $("#needContent").addClass("btnClicked");
                    } else {
                        if ($(".txtneed").is(":focus")) {
                            $(".txtneed").blur();
                        }
                        if ($(".edittxtGoal").is(":focus")) {
                            $(".edittxtGoal").blur();
                        }
                        if ($(".txtGoal").is(":focus")) {
                            $(".txtGoal").blur();
                        }
                    }
                });
            }
            changeCareplanStatus()


        }, error: function (e) {
            toastr.error("Unidentified error");
            $(".loaderOverlay").hide();
        }
    })
}
function cancelNewNeed(obj) {
    $("#needContent").removeClass("btnClicked");
    $(obj).parent().prev().val("").focus().css("height", "21px");
}
function cancelNewGoal(obj) {
    $("#needContent").removeClass("btnClicked");
    $(obj).parent().prev().val("").focus().css("height", "21px");
}
function canCloseNeeds(obj) {
    var canClose = false;
    var needText = $(".txtNeed").val().trim();
    var goalText = $(".txtGoal").val();
    needText == '' ? canClose = true : canClose = false;
    if(canClose==true)
        goalText == undefined ? canClose = true : goalText.trim() == '' ? canClose = true : canClose = false;

    var editNeedText = $('.txtneed').val();
    var editGoaltext = $(".edittxtGoal").val();
    if (canClose == true)
        editNeedText == undefined ? canClose = true : editNeedText == $('.txtneed').prev().html() ? canClose = true : canClose = false;
    if (canClose == true)
        editGoaltext == undefined ? canClose = true : editGoaltext == $('.edittxtGoal').prev().html() ? canClose = true : canClose = false;

    if (canClose) {
        getCarePlanList();
        $(obj).parents('.right_sidebar').removeClass('opened');
    } else {
        $.confirm({
            icon: 'fas fa-exclamation-triangle',
            title: 'Confirm',
            content: 'You have unsaved changes on this page. Do you want to leave this page and discard your changes or stay on this page?',
            type: 'red',
            columnClass: 'col-md-6 col-md-offset-3',
            typeAnimated: true,
            buttons: {
                stay: {
                    btnClass: 'btn-green',
                },
                leave: {
                    action: function () {
                        $(".txtNeed").val('');
                        $(".needsList").find("li.hasChild").remove();
                        $(obj).parents('.right_sidebar').removeClass('opened');
                    }
                }
            },

        });
    }
    
}
window.onbeforeunload = function (evt) {
    var canClose = false;
    var needText = $(".txtNeed").val().trim();
    var goalText = $(".txtGoal").val();
    needText == '' ? canClose = true : canClose = false;
    if (canClose == true)
        goalText == undefined ? canClose = true : goalText.trim() == '' ? canClose = true : canClose = false;

    var editNeedText = $('.txtneed').val();
    var editGoaltext = $(".edittxtGoal").val();
    if (canClose == true)
        editNeedText == undefined ? canClose = true : editNeedText == $('.txtneed').prev().html() ? canClose = true : canClose = false;
    if (canClose == true)
        editGoaltext == undefined ? canClose = true : editGoaltext == $('.edittxtGoal').prev().html() ? canClose = true : canClose = false;
    if (!canClose) {
        if (typeof evt == 'undefined') {
            evt = window.event;
        }
        if (evt) {
            evt.returnValue = "";
        }
    }

}
function NeedOnBlur() {
    if (DisableNeedFocusOut) {
        DisableNeedFocusOut = false;
        return;
    }
    if ($("#needContent").hasClass("btnClicked")) {
        return;
    }
    var needTxt = $(".txtNeed");
    if (needTxt.val().trim() != "") {
        $.confirm({
            icon: 'fas fa-exclamation-triangle',
            title: 'Confirm',
            content: 'You have unsaved changes for this need!' + `<hr/>
                      <p class="need-title">Need</p>
                      <p class="need-content">${needTxt.val()}</p>`,
            type: 'green',
            columnClass: 'col-md-6 col-md-offset-3',
            typeAnimated: true,
            buttons: {
                save: {
                    text: 'save changes',
                    btnClass: 'btn-green',
                    action: function () {
                        $("#needContent").removeClass("btnClicked");
                        saveNewNeed();
                    }
                },
                cancel: {
                    action: function () {
                        $("#needContent").removeClass("btnClicked");
                        needTxt.val("").css("height", "21px");
                        NeedFocus();
                    }
                }
            },
        });
    }
}
function GoalOnBlur() {
    if ($("#needContent").hasClass("btnClicked")) {
        return;
    }
    if (DisableGoalFocusOut) {
        DisableGoalFocusOut = false;
        return
    }
    
    var goaltxt = $(".txtGoal");
    if (goaltxt.val().trim() != "") {
        $.confirm({
            icon: 'fas fa-exclamation-triangle',
            title: 'Confirm',
            content: 'You have unsaved changes for this goal!' + `<hr/>
                      <p class="goal-title">Goal</p>
                      <p class="goal-content">${goaltxt.val()}</p>`,
            type: 'green',
            columnClass: 'col-md-6 col-md-offset-3',
            typeAnimated: true,
            buttons: {
                save: {
                    text: 'save changes',
                    btnClass: 'btn-green',
                    action: function () {
                        $("#needContent").removeClass("btnClicked");
                        saveNewGoal();
                    }
                },
                cancel: {
                    action: function () {
                        $("#needContent").removeClass("btnClicked");
                        goaltxt.val("").css("height", "21px").focus();
                    }
                }
            },
        });
    }
}
function checkAllDefaultNeed(obj) {
    if (obj.checked) {
        $("[name='defaultNeeds']").each(function () {
            this.checked = true;
        });
    } else {
        $("[name='defaultNeeds']").each(function () {
            this.checked = false;
        });
    }
}
function GetDefaultNeeds() {
    if (!CanEditCarePlan()) {
        return
    }

    $(".defaultNeedAction").removeClass("d-none").addClass("d-flex");
    $(".defaultGoalAction").removeClass("d-flex").addClass("d-none");
    $("h5.defaultNeedTitle").html("").append("Default Needs");
    var model = {
        TemplateId: templateid,
        BaseTemplateId: basetemplateid,
        PatientId: PatientId
    }
    $.ajax({
        type: "POST",
        url: Apipath + '/api/PatientMain/getdefaultneeds',
        contentType: 'application/json; charset=UTF-8',
        data: JSON.stringify(model),
        dataType: "json",
        async: false,
        success: function (res) {
            var defaultNeedUl = $(".defaultneedul");
            defaultNeedUl.html("");
            $(".defaultallneed").prop("checked", false);
            if (res.length) {
                defaultneedLen = res.length;
                var defaultNeedStr = "";
                for (var i = 0; i < res.length; i++) {
                    defaultNeedStr += `<li>
                                        <p>${res[i].NeedDesc}</p>
                                        <label class="checkbox_input">
                                        <input type="checkbox" onclick="checkDefaultNeeds(this)" name="defaultNeeds" value="${res[i].NeedID}" /><span></span>
                                        </label></li>`;
                }
                defaultNeedUl.append(defaultNeedStr);
                $("#DefaultNeedsPopUp").modal({
                    show: true,
                    keyboard: false,
                    backdrop: 'static'
                });
            } else {
                NeedFocus();
            }
        }, error: function () {
            toastr.error("Unidentified error");
            $(".loaderOverlay").hide();
        }
    });
}
function checkDefaultNeeds(obj) {
    if ($(obj).closest("ul.defaultneedul").find("input:checked").length == $(obj).closest("ul.defaultneedul").find("li").length) {
        $(".defaultallneed").prop("checked", true);
    } else {
        $(".defaultallneed").prop("checked", false);
    }
}
function closeDefaultNeed() {
    $("#DefaultNeedsPopUp").modal('hide');
    if ($("ul.defaultneedul").find("li").length != defaultneedLen) {
        GetNeedAndGoalList();
    }
    NeedFocus();
}
function AddDefaultneeds() {
    var needIDs = [];
    $("ul.defaultneedul input:checkbox:checked").map(function () {
        needIDs.push($(this).val());
    });
    if (needIDs.length == 0) {
        toastr.error("Select at least one default need");
        return;
    }
    var model = {
        NeedIDs: needIDs,
        PatientId: PatientId,
        CarePlanId: careplanid,
        Status: 0
    }
    $.ajax({
        type: "POST",
        url: Apipath + '/api/PatientMain/adddefaultneedtocareplan',
        contentType: 'application/json; charset=UTF-8',
        data: JSON.stringify(model),
        dataType: "json",
        async: false,
        success: function (res) {
            for (var i = 0; i < needIDs.length; i++) {
                $("ul.defaultneedul").find(`input[value='${needIDs[i]}']`).first().closest("li").remove();
            }
            $(".defaultallneed").prop("checked", false);
            toastr.success("Changes saved successfully");
            if ($("ul.defaultneedul").find("li").length == 0) {
                closeDefaultGoals();
            }
        }, error: function () {
            toastr.error("Unidentified error");
            $(".loaderOverlay").hide();
        }
    });

}
function GetDefaultgoals(needid,DefaultNeedId) {
    $.ajax({
        type: "GET",
        url: Apipath + '/api/PatientMain/getgoalbyneedid?NeedId=' + needid + '&DefaultNeedId=' + DefaultNeedId,
        contentType: 'application/json; charset=UTF-8',
        dataType: "json",
        async: false,
        success: function (res) {
            var defaultNeedUl = $(".defaultneedul");
            defaultNeedUl.html("");
            $(".defaultallneed").prop("checked", false);
            if (res.length) {
                defaultneedLen = res.length;
                var defaultNeedStr = "";
                for (var i = 0; i < res.length; i++) {
                    defaultNeedStr += `<li>
                                        <p>${res[i].GoalDesc}</p>
                                        <label class="checkbox_input">
                                        <input type="checkbox" onclick="checkDefaultNeeds(this)" name="defaultNeeds" value="${res[i].GoalID}" /><span></span>
                                        </label></li>`;
                }
                defaultNeedUl.append(defaultNeedStr);
                $("#DefaultNeedsPopUp").modal({
                    show: true,
                    keyboard: false,
                    backdrop: 'static'
                });
            } else {
                AddNewGoalFromNeed(newGoalRef);
                newGoalRef = "";
            }

        }, error: function () {
            toastr.error("Unidentified error");
            $(".loaderOverlay").hide();
        }
    });
}
function AddDefaultgoals() {
    var goalIDs = [];
    $("ul.defaultneedul input:checkbox:checked").map(function () {
        goalIDs.push($(this).val());
    });
    if (goalIDs.length == 0) {
        toastr.error("Select at least one default goal");
        return;
    }
    var model = {
        GoalIDs: goalIDs,
        NeedId: $(newGoalRef).closest("li.hasChild").attr("data-needid"),
        CarePlanId: careplanid,
        Status: 0
    }
    $.ajax({
        type: "POST",
        url: Apipath + '/api/PatientMain/adddefaultgoaltocareplan',
        contentType: 'application/json; charset=UTF-8',
        data: JSON.stringify(model),
        dataType: "json",
        async: false,
        success: function (res) {
            for (var i = 0; i < goalIDs.length; i++) {
                $("ul.defaultneedul").find(`input[value='${goalIDs[i]}']`).first().closest("li").remove();
            }
            $(".defaultallneed").prop("checked", false);
            toastr.success("Changes saved successfully");
            if ($("ul.defaultneedul").find("li").length==0) {
                closeDefaultGoals();
            }
        }, error: function () {
            toastr.error("Unidentified error");
            $(".loaderOverlay").hide();
        }
    });
}
function focusAddGoals() {
    $("#DefaultNeedsPopUp").modal('hide');
    AddNewGoalFromNeed(newGoalRef);
    newGoalRef = "";
}
function closeDefaultGoals() {
    $("#DefaultNeedsPopUp").modal('hide');
    newGoalRef = "";
    if ($("ul.defaultneedul").find("li").length != defaultneedLen) {
        GetNeedAndGoalList();
    }
}
$(".closeDefaultNeed").click(closeDefaultGoals);
function UpdateGoalstatusdom(obj) {
 var goalStatusItem = $(obj).closest('.ui-sortable-handle');
    var goalStatus = $(goalStatusItem).attr('data-status');
    if (goalStatus == '2') {
        $(goalStatusItem).attr('data-status', '1');
        $(goalStatusItem).find('.completed').removeClass('completed').addClass('inProgress').text('In Progress ')
        $(goalStatusItem).find('.countgoal').removeClass('fullCompleted').addClass('inProgress')
    }
}
function updateNeedStatus(obj) {
  
    var item = $(obj).parents('ul.goalsList');
    var need = $(item).closest('li');
    var currentStatus = $(need).attr('data-status');

    if (currentStatus == "2") {
        $(need).attr('data-status', '1');
        var needStatus = $(need).find('.needStatus').removeClass('completed').addClass('inProgress').text('In Progress');
        $(need).find('.needCountItems').removeClass('completed').addClass('inProgress');
    }
}
function updateNeedStatusOnEditNeed(obj) {
    var need = $(obj).closest('.hasChild');
    var status = $(need).attr('data-status');
    if (status == '2') {
        $(need).attr('data-status', '1');
        var needStatus = $(need).find('.needStatus').removeClass('completed').addClass('inProgress').text('In Progress');
        $(need).find('.needCountItems').removeClass('completed').addClass('inProgress');
    }
}


function LoadCareplanRequestHistory() {
   
    if ($("a.need-nav").parent().hasClass("disabled")) {
        toastr.error("First submit basic information to enable needs and goals");
        return false;
    }
    GetCareplanHistory()
    $("a.requestHistory-nav").tab('show');
}

var CarePlanRequestHistotyTable=''
function GetCareplanHistory() {
    if (CarePlanRequestHistotyTable != '') {
        CarePlanRequestHistotyTable.destroy();
    }
    $.ajax({
        type: "GET",
        url: Apipath + '/api/PatientMain/getcareplanrequesthistory?careplanid=' + careplanid,
        contentType: 'application/json; charset=UTF-8',
        dataType: "json",
        async: true,
        success: function (result) {
            var ApprovalRequestHistory = $(".carePlanRequestHistory");
            ApprovalRequestHistory.html('')

            var careplansRequestHistory = "";
            if (result.length) {
                $.each(result, function (index, item) {
                  
                    if (item.CreatedOn) {
                        var SendDate = new Date(item.CreatedOn).toLocaleDateString('en-US')
                        var sendTimearray = item.CreatedOn.split("T")[1].split(":");
                        var sendAmPm = sendTimearray[0] >= 12 ? 'pm' : 'am';
                       var sendTime = sendTimearray[0] + ":" + sendTimearray[1] + ":" + sendTimearray[2].split(".")[0] + " " + sendAmPm;
                    }

                    careplansRequestHistory += `<tr>
                           <td width="150px">${item.CreatedBy}</td>
                           <td width="150px">${item.Action}</td>
                           <td width="150px" >${item.Comment}</td>
                           <td width="150px">${SendDate} ${sendTime}</td></tr>`;
                 
                });
                ApprovalRequestHistory.html("").append(careplansRequestHistory);
            } else {
                careplansRequestHistory += `<tr>
                                      <td colspan="4"><p class="text-center">No data found.</p></td>
                                      <td style="display: none;"></td>
                                      <td style="display: none;"></td>
                                      <td style="display: none;"></td>
                                      
                                      </tr>`;
                ApprovalRequestHistory.html("").append(careplansRequestHistory);
            }

           
            CarePlanRequestHistotyTable = $('#CarePlanHistoryTable').DataTable({
                retrieve: true,
                searching: false,
                "scrollY": "calc(100vh - 360px)",
                "ordering": false,
                'columnDefs': [{
                    'targets': [3],
                    'orderable': false
                }]
            });
        
            $(".loaderOverlay").hide();
        },
        error: function (e) {
            toastr.error("Something happen Wrong");
        }
    });

}


$(document).ready(function () {
    $('.txtNextReviewDate').datepicker(
        {
            uiLibrary: 'bootstrap',
            changeYear: true,
            changeMonth: true
        });
    $('.txtNextReviewDate').datepicker('setDate', 'today');
});
function showSummary() {
    if ($("a.summary-nav").parent().hasClass("disabled")) {
        toastr.error("First submit basic information to enable summary");
        return false;
    }
    $("a.summary-nav").tab('show');
    $(".loaderOverlay").show();
    GetSummaries();
   
}
function GetSummaries() {
    $.ajax({
        type: "GET",
        url: Apipath + '/api/PatientMain/getsummaries?Careplanid=' + careplanid,
        contentType: 'application/json; charset=UTF-8',
        dataType: "json",
        async: false,
        success: function (result) {
            var summary = $(".summaryContent").find(".a_outcome_list");
            summary.html("");
            var summaryStr = '';
            if (result.length) {
                for (var i = 0; i < result.length; i++) {
                    summaryStr += `<div class="a_outcome_item">
                                   <div class="a_o_head">
                                   <div class="a_o_head_name">
                                   <span class="name_thumb c_blue">${result[i].FirstName.charAt(0)}${result[i].LastName.charAt(0)}</span><strong>${result[i].FirstName} ${result[i].LastName}</strong>
                                   </div>
                                   <div class="a_o_date"><b>Reviewed on:</b>${result[i].ReviewedDate} at ${result[i].ReviewedTime}</div>
                                   </div>
                                   <div class="a_o_content"><p>${result[i].Description}</p>
                                    <div class="status_changed"><b>Next review date:</b> ${result[i].NextReviewDate} at ${result[i].NextReviewTime}</div>
                                   </div>
                                   </div>`;
                }
                summary.append(summaryStr);
                $(".loaderOverlay").hide();
            } else {
                $(".loaderOverlay").hide();
            }
        }, error: function (e) {
            toastr.error("Something happen Wrong");
            $(".loaderOverlay").hide();
        }
    });
}
function openAddSummary() {
    if ($("#ddlcareplanstatus").val() != "4") {
        $(".txtSummaryNote,.txtNextReviewDate").val("");
        $('.txtNextReviewDate').datepicker('setDate', 'today');
        $('#AddSummaryModal').modal({
            show: true,
            keyboard: false,
            backdrop: 'static'
        });
    }
}
function AddSummary() {
    if ($(".txtNextReviewDate").val().trim() == "") {
        toastr.error("Next review date is required");
        return;
    }
    if ($(".txtSummaryNote").val().trim() == "") {
        toastr.error("Summary is required");
        return;
    }
    var model = {
        Description: $(".txtSummaryNote").val(),
        ReviewedBy: userId,
        NextReviewDate: $(".txtNextReviewDate").val(),
        CarePlanId: careplanid,
        PatientId: PatientId
    }
    $.ajax({
        type: "POST",
        url: Apipath + '/api/PatientMain/savesummary',
        contentType: 'application/json; charset=UTF-8',
        data: JSON.stringify(model),
        dataType: "json",
        success: function (result) {
            GetSummaries();
            toastr.success("Saved successfully");
            clearSummary();
        },
        error: function (e) {
            toastr.error("Something happen Wrong");
            $(".loaderOverlay").hide();
        }
    });
}
function clearSummary() {
    $(".txtSummaryNote,.txtNextReviewDate").val("");
    $('.txtNextReviewDate').datepicker('setDate', 'today');
    $("#AddSummaryModal").modal('hide');
    
}
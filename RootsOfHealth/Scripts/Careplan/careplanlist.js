$(function () {
    GetCarePlanTemplateList();
    getPrograms();
    GetBaseTemplateId();
    sessionStorage.clear();
});
function GetCarePlanTemplateList() {
    $(".loaderOverlay").css("display", "flex");
    $.ajax({
        type: "GET",
        url: Apipath + '/api/PatientMain/gettemplatelist',
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var careplanlist = $(".careplanlist");
            var careplans = "";
            if (result.length) {
                $.each(result, function (index, item) {
                    careplans += `<tr>
                         <td width="20%">${item.TemplateName}</td>
                         <td width="15%">${item.ProgramsName == null ? "" : item.ProgramsName}</td>
                         <td width="12%">${item.IsActive ? "Completed" : "In Progress"}</td>
                         <td width="15%">${item.ModifiedDate != null ? item.ModifiedDate.split("T")[0] : ""}</td>
                        <td width="15%">${item.IsActive && item.IsBaseTemplate == false ? item.Isactivated == 1 ? "Yes" : "No" : ""}</td>
                            <td width="23%"><div>`
                    if (item.IsBaseTemplate) {
                        careplans += `<a href="/careplan/BaseTemplate?templateid=${item.TemplateID}"  class="btn btn-success text-white" style="cursor:pointer;">MODIFY</a>`

                    } else {
                        console.log(Object.entries(item));
                        careplans += `<a href="javascript:void(0)" onclick="Proceed({TemplateID:${item.TemplateID},TemplateName:\'${item.TemplateName}\',ProgramsID:${item.ProgramsID},IsBaseTemplate:${item.IsBaseTemplate}})"  class="btn btn-success text-white" style="cursor: pointer; ${item.Isactivated == true ? "display:none;" : ""} ">MODIFY</a>`
                    }
                    if (item.IsActive == 1 && item.IsBaseTemplate == false) {
                        if (item.Isactivated == true) {
                            careplans += `<a href="javascript:void(0)"  onclick="SetTemplateStatus(${item.TemplateID},${false})"  class="btn btn-success text-white" style="cursor:pointer;">DEACTIVATE</a>`;
                        } else if (item.Isactivated == 0) {
                            careplans += `<a href="javascript:void(0)" onclick="SetTemplateStatus(${item.TemplateID},${true})"  class="btn btn-success text-white" style="cursor:pointer;">ACTIVATE</a>`;
                        }
                    } else if (item.IsActive == 0 && item.IsBaseTemplate == false){
                        careplans += `<a href="javascript:void(0)" onclick="alertInprogressStatus()"  class="btn btn-success text-white" style="cursor:pointer;">ACTIVATE</a>`;
                    }

                    careplans += `</div></td></tr>`;
                });
                careplanlist.html("").append(careplans);
            } else {
                careplans += `<tr><td colspan="6"><p class="text-center">No data found.</p></td></tr>`;
                careplanlist.html("").append(careplans);
            }
            $(".loaderOverlay").hide();
        },
        error: function (e) {
            toastr.error("Something Happen Wrong");
        }
    });
}
$("#radioBaseTemplate,#radioScratch").change(function () {
    if ($(this).prop("checked")) {
        $(".templateDiv").addClass("hide");
    }
});
function SetTemplateStatus(Templateid, Status) {
    $.confirm({
        icon: 'fas fa-exclamation-triangle',
        title: 'Confirm',
        content: Status == true ? 'This template will be activated and users will have access. Do you want to continue?' : 'Are you sure you want to de-activate. Careplan implementation for this program will be removed for users ?',
        type: Status == true ? 'green' : 'red',
        columnClass: 'col-md-6 col-md-offset-3',
        typeAnimated: true,
        buttons: {
            yes: {
                btnClass: Status == true ? 'btn-green' : 'btn-danger',
                action: function () {
                    $(".loaderOverlay").css("display", "flex");
                    $.ajax({
                        type: "GET",
                        url: Apipath + '/api/PatientMain/updatecareplantemplatestatus?Templateid=' + Templateid + '&status=' + Status,
                        contentType: 'application/json; charset=UTF-8',
                        dataType: "json",
                        success: function (result) {
                            GetCarePlanTemplateList();
                        },
                    });
                }

            },
            no: function () {

            }
        }
    });

}
function getPrograms() {
    $.ajax({
        type: "GET",
        url: Apipath + '/api/PatientMain/getprogrambynavigator?Createdby=' + userId,
        contentType: 'application/json; charset=UTF-8',
        dataType: "json",
        success: function (result) {
            if (result.length) {
                for (var i = 0; i < result.length; i++) {
                    $("#ddlProgram option[value='" + result[i].ProgramsID + "']").remove();
                }
            }
        },
    });
}
function getTemplates(obj) {
    if ($(obj).prop("checked")) {
        $.ajax({
            type: "GET",
            url: Apipath + '/api/PatientMain/gettemplatedropdownlist',
            contentType: 'application/json; charset=UTF-8',
            dataType: "json",
            success: function (result) {
                if (result.length) {
                    var templates = $("#ddlTemplate");
                    templates.html("");
                    $.each(result, function (data, value) {
                        templates.append($("<option></option>").val(value.TemplateID).html(value.TemplateName));
                    });
                    $(".templateDiv").removeClass("hide");
                } else {
                    toastr.error("", "No careplan template available.", { progressBar: true });
                }
            },
        });

    } else {
        $(".templateDiv").addClass("hide");
    }
}
function Proceed(data) {
    let templateName = $("#templateName").val().trim();
    let programid = $("#ddlProgram").val();
    let templateid = $("#radioExistTemplate").prop("checked") ? $("#ddlTemplate").val() : 0;
    if (templateName == '' && data === undefined) {
        toastr.error("", "Template name is required", { progressBar: true });
        return;
    }
    let model = {};
    if (data === undefined) {
        model = {
            TemplateName: templateName,
            ProgramID: programid,
            TemplateID: $("#radioBaseTemplate").prop("checked") ? $("#radioBaseTemplate").attr("data-baseid") : templateid,
            IsBaseTemplate: $("#radioBaseTemplate").prop("checked")
        }
    } else {
        model = {
            TemplateName: data.TemplateName,
            ProgramID: data.ProgramsID,
            TemplateID: data.TemplateID,
            IsBaseTemplate: data.IsBaseTemplate,
            IsModify: true
        }
    }
    $.ajax({
        type: "POST",
        url: '/CarePlan/GetTemplateData',
        data: JSON.stringify(model),
        contentType: 'application/json; charset=UTF-8',
        dataType: "json",
        success: function (result) {
            if (result.isRedirect) {
                sessionStorage.clear();
                window.location.href = result.redirectUrl;
            }
        },
    });
}
function checkTemplateCount() {
    if ($("#ddlProgram").val() == null) {
        $(".createtemplate").hide();
        $(".notemplate").css("display", "block");
        $(".btnProceed").hide();
    } else {
        $(".createtemplate").show();
        $(".notemplate").css("display", "none");
        $(".btnProceed").show();
    }

    $("#templateName").val('');
}
function GetBaseTemplateId() {
    $.ajax({
        type: "GET",
        url: Apipath + '/api/PatientMain/getbasetemplateid',
        contentType: 'application/json; charset=UTF-8',
        dataType: "json",
        success: function (result) {
            switch (result) {
                case -1:
                    $("#radioBaseTemplate").attr("disabled", "disabled");
                    break;
                default:
                    $("#radioBaseTemplate").attr("data-baseid", result);
                    break;
            }

        }
    });
}
function alertInprogressStatus() {
    $.alert({
        icon: 'fas fa-exclamation-triangle',
        title: 'Alert',
        type:  'red',
        content: 'Template can not activate until status is complete',
    });
}
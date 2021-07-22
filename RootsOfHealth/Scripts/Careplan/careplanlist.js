$(function () {
    GetCarePlanTemplateList();
    getPrograms();
    GetBaseTemplateId();
    sessionStorage.clear();
});
var _careplanListTable=''
function GetCarePlanTemplateList() {
    $(".loaderOverlay").css("display", "flex");
    $.ajax({
        type: "GET",
        url: Apipath + '/api/PatientMain/gettemplatelist',
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            if (_careplanListTable != '') {
                $('#tblCarePlanTemplateList').DataTable().clear();
                $('#tblCarePlanTemplateList').DataTable().destroy();
            }
            var careplanlist = $(".careplanlist");
            var careplans = "";
            if (result.length) {
                $.each(result, function (index, item) {
                    careplans += `<tr>
                         <td width="20%">${item.TemplateName}</td>
                         <td width="15%">${item.ProgramsName == null ? "" : item.ProgramsName}</td>
                         <td width="10%">${item.IsActive ? "Completed" : "In Progress"}</td>
                         <td width="15%">${item.ModifiedDate != null ? item.ModifiedDate.split("T")[0] : ""}</td>
                        <td width="10%">${item.IsActive && item.IsBaseTemplate == false ? item.Isactivated == 1 ? "Yes" : "No" : ""}</td>
                            <td width="30%"><div>`;
                    careplans += `<a href="javascript:void(0)" onclick="ViewCarePlanContent(${item.TemplateID},\'${item.TemplateName}'\)" class="btn btn-success text-white" style="cursor:pointer;">VIEW</a>`
                    if (item.IsBaseTemplate) {
                        item.IsActive = item.IsActive == null ? false : item.IsActive;
                        careplans += `<a href="/careplan/BaseTemplate?templateid=${item.TemplateID}&Status=${item.IsActive}"  class="btn btn-success text-white" style="cursor:pointer;">MODIFY</a>`

                    } else {                        
                        careplans += `<a href="javascript:void(0)" onclick="Proceed({TemplateID:${item.TemplateID},TemplateName:\'${item.TemplateName}\',ProgramsID:${item.ProgramsID},IsBaseTemplate:${item.IsBaseTemplate},ProgramName:'${item.ProgramsName}',TemplateTable:'${item.TemplateTable}'})"  class="btn btn-success text-white" style="cursor: pointer; ${item.Isactivated == true ? "display:none;" : ""} ">MODIFY</a>`
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


                    if (!item.IsBaseTemplate) {
                        careplans += `<a href="javascript:void(0)" onclick="DeleteCarePlanTemplate(${item.ProgramsID},this)"  class="btn btn-success text-white" style="cursor:pointer;">Delete</a>`;
                    }
                    careplans += `</div></td></tr>`;
                });
                careplanlist.html("").append(careplans);
            } else {
                careplans += `<tr><td colspan="6"><p class="text-center">No data found.</p></td></tr>`;
                careplanlist.html("").append(careplans);
            }
            _careplanListTable=    $('#tblCarePlanTemplateList').DataTable({
                paging: false,
                retrieve: true,
                "scrollY": "calc(100vh - 380px)",
                searching: false,
                'columnDefs': [{
                    'targets': [5],
                    'orderable': false                  
                }]
            });
            $(".loaderOverlay").hide();
        },
        error: function (e) {
            toastr.error("Unidentified error");
        }
    });
}
$("#radioBaseTemplate,#radioScratch").change(function () {
    if ($(this).prop("checked")) {
        $(".templateDiv").addClass("hide");
    }
});
$("#radioBaseTemplate").change(function () {
    if ($(this).attr("data-baseid") == "-1") {
        toastr.error("", "Base template not available until completed", { progressBar: true });
        $(this).prop("checked", false);
    }
});

function DeleteCarePlanTemplate(_programId, button) {

    $.confirm({
        icon: 'fas fa-exclamation-triangle',
        title: 'Confirm',
        content: 'Are you sure,you want to delete this program?',
        type: 'red',
        columnClass: 'col-md-6 col-md-offset-3',
        typeAnimated: true,
        buttons: {
            yes: {
                btnClass: 'btn-red',
                action: function () {
                    var btn = $(button);

                    $.ajax({
                        type: "Post",
                        url: Apipath + '/api/PatientMain/deletecareplantemplate?Programid=' + _programId,
                        contentType: 'application/json; charset=UTF-8',
                        dataType: "json",
                        success: function (result) {
                            if (result.status == 0) {
                                toastr.error("", result.message, { progressBar: true });
                            }
                            else if (result.status == 1) {
                                toastr.success("", "Deleted successfully", { progressBar: true });
                                _careplanListTable.row(btn.parents('tr')).remove().draw();
                                getPrograms();
                            }
                        }
                    });
                }
            },
            no: function () {
            }
        }
    });
}
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
                let options = '';
                for (var i = 0; i < result.length; i++) {
                  options+= `<option value="${result[i].ProgramsID}">${result[i].ProgramsName}</option>`
                }
                $('#ddlProgram').html(options);
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
            IsBaseTemplate: $("#radioBaseTemplate").prop("checked"),
            ProgramName:  $( "#ddlProgram option:selected").text(),
            TemplateTable:'tbl'
        }
    } else {
        model = {
            TemplateName: data.TemplateName,
            ProgramID: data.ProgramsID,
            TemplateID: data.TemplateID,
            IsBaseTemplate: data.IsBaseTemplate,
            IsModify: true,
            ProgramName: data.ProgramName,
            TemplateTable: data.TemplateTable
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
function ViewCarePlanContent(ID,name) {
    $(".loaderOverlay").show();
    $("#PreviewModalTitle").html("").append(name);
    $.ajax({
        type: "GET",
        url: '/careplan/GetCarePlanTemplateById?TemplateId=' + ID,
        contentType: 'application/json; charset=UTF-8',
        dataType: "json",        
        success: function (result) {
        if (result.html != "") {
                $(".preview-body").html("").append(result.html);
                if ($(".preview-body").find(".basecontentarea").length > 0) {
                    ViewHeaderAndFooter();
                }
                $(".preview-body .event-btn-right").remove();
                $(".preview-body .ck-editor-header").remove();
                $(".preview-body").find(".question-container").parent().css("border", "none");
                $(".preview-body").find(".dragresize").find(".question-container").remove();
                $(".preview-body").find(".dragresize").find(".bootom-form-row").css({ "padding": "0", "margin": "0" });
                $(".preview-body .html-content").prev().css("display", "none");
                $(".preview-body .html-content").parent().parent().parent().addClass("left-control");
                $(".preview-body .f-g-left").each(function (index, item) {
                    $(item).parent().parent().addClass("left-control");
                });
                $('.preview-body textarea').bind('copy paste cut', function (e) {
                    e.preventDefault();
                });
                $('.preview-body textarea').keypress(function (e) {
                    var regex = new RegExp("^[a-zA-Z0-9]+$");
                    var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
                    if (regex.test(str)) {
                        return true;
                    }
                    e.preventDefault();
                    return false;
                });

                ViewtoogleToolTip();
                $(".preview-body textarea.form-control").summernote({
                    toolbar: [
                        ['para', ['ul', 'ol', 'paragraph']],
                        ['style', ['bold', 'italic', 'underline', 'clear']],
                        ['font', ['strikethrough', 'superscript', 'subscript']],
                    ],
                    height: 150,
                    placeholder: "Type here",
                    callbacks: {
                        onInit: function (e) {
                            this.placeholder
                                ? e.editingArea.find(".note-placeholder").html(this.placeholder)
                                : e.editingArea.remove(".note-placeholder")
                        }
                    },
                });
               
                $("#PreviewModal").modal({
                    show: true,
                    keyboard: false,
                    backdrop: 'static'
                });
            }
            $(".loaderOverlay").hide();
        },
        error: function (e) {
            toastr.error("Unidentified error");
            $(".loaderOverlay").hide();
        }
    });   
}
function ViewHeaderAndFooter() {
    $.ajax({
        type: "GET",
        url: Apipath + '/api/PatientMain/getbasetemplateid',
        contentType: 'application/json; charset=UTF-8',
        dataType: "json",
        async: false,
        success: function (result) {
            switch (result) {
                case -1:
                    break;
                default:
                    $.ajax({
                        type: "GET",
                        url: '/careplan/GetFormHtmlById?Id=' + result,
                        contentType: 'application/json; charset=UTF-8',
                        dataType: "json",
                        async: false,
                        success: function (result) {
                            var baseHtml = ViewparseHTML(result.html);
                            var baseHeader = $(baseHtml).find(".baseheader").html();
                            var baseFooter = $(baseHtml).find(".basefooter").html();
                            $(".preview-body").find(".baseheader").html("").append(baseHeader);
                            $(".preview-body").find(".basefooter").html("").append(baseFooter);
                        }
                    });
                    break;
            }
        }, error: function (e) {
            toastr.error("Unidentified error");
            $(".loaderOverlay").hide();
        }
    });
}
function ViewtoogleToolTip() {
    $('.tooltipicon').tooltip({
        trigger: "click",
        html: true,
        container: 'body'
    });
    $('.tooltipicon').on('show.bs.tooltip', function () {
        $('.tooltipicon').not(this).tooltip('hide');
    });
    $('body').on('click', function (e) {
        if ($(e.target).data('toggle') !== 'tooltip' && $(e.target).parents('[data-toggle="tooltip"]').length === 0
            && $(e.target).parents('.tooltip.in').length === 0) {
            (($('[data-toggle="tooltip"]').tooltip('hide').data('bs.tooltip') || {}).inState || {}).click = false;
        }
    });
}
function ViewparseHTML(htmlstr) {
    var t = document.createElement('template');
    t.innerHTML = htmlstr;
    return t.content.cloneNode(true);
}
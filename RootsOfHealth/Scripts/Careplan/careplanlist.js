$(function () {
    GetCarePlanTemplateList();
    getPrograms();
    GetBaseTemplateId();
    sessionStorage.clear();
});
var _careplanListTable=''
function GetCarePlanTemplateList() {

    $("#tblCarePlanTemplateList").dataTable({
        "scrollY": 'calc(100vh - 303px)',
        "scrollX": true,
        "paging": true,
        "ordering": true,
        "filter": true,
        "destroy": true,
        "orderMulti": false,
        "serverSide": true,
        "searching":false,
        "Processing": true,
        "ajax":
        {
            "url": "/CarePlan/GetCarePlanTemplateList",
            "type": "POST",
            "dataType": "JSON"
        },
        'columnDefs': [{
            'targets': [5],
            'orderable': false
        }],
        "columns": [

            { "data": "TemplateName" },
            { "data": "ProgramsName" },
            {
                "data": null,
                "render": function (data) {
                    if (data.IsActive) {
                        return "Completed";
                    } else {
                        return "In Progress";
                    }
                }
            },
            {
                "data": "ModifiedDate",
                "render": function (value) {

                    if (value === null) return "";

                    var pattern = /Date\(([^)]+)\)/;
                    var results = pattern.exec(value);
                    var dt = new Date(parseFloat(results[1]));
                    var time = dt.toLocaleTimeString();
                    return (dt.getMonth() + 1) + "/" + dt.getDate() + "/" + dt.getFullYear() + " " + time;
                }
            },
            {
                "data": null,
                "render": function (data)
                {
                    if (data.IsActive && data.IsBaseTemplate == false ) {
                        if (data.Isactivated == 1) {
                            return "Yes";

                        }
                        else {
                            return "No";
                        }
                    }
                    else {
                        return ""
                    }
                }
            },
            {
                "data": null,
                "render": function (data) {
                    var careplans = "";
                    if (canViewCPTemplate == 'True')
                    {
                        careplans += `<a href="javascript:void(0)" onclick="ViewCarePlanContent(${data.TemplateID},\'${data.TemplateName}'\)" class="btn btn-success text-white" style="cursor:pointer;">VIEW</a>`
                    }
                    if (data.IsBaseTemplate && data == 'True') {
                        data.IsActive = data.IsActive == null ? false : data.IsActive;
                        careplans += `<a href="/careplan/BaseTemplate?templateid=${data.TemplateID}&Status=${data.IsActive}"  class="btn btn-success text-white" style="cursor:pointer;">MODIFY</a>`

                    } else {
                        if (canEditCPTemplate == 'True') {
                            careplans += `<a href="javascript:void(0)" onclick="Proceed({TemplateID:${data.TemplateID},TemplateName:\'${data.TemplateName}\',ProgramsID:${data.ProgramsID},IsBaseTemplate:${data.IsBaseTemplate},ProgramName:'${data.ProgramsName}',TemplateTable:'${data.TemplateTable}'})"  class="btn btn-success text-white" style="cursor: pointer; ${data.Isactivated == true ? "display:none;" : ""} ">MODIFY</a>`
                        }
                    }
                    if (data.IsActive == 1 && data.IsBaseTemplate == false && canEditCPTemplate == 'True') {
                        if (data.Isactivated == true) {
                            careplans += `<a href="javascript:void(0)"  onclick="SetTemplateStatus(${data.TemplateID},${false})"  class="btn btn-success text-white" style="cursor:pointer;">DEACTIVATE</a>`;
                        } else if (data.Isactivated == 0) {
                            careplans += `<a href="javascript:void(0)" onclick="SetTemplateStatus(${data.TemplateID},${true})"  class="btn btn-success text-white" style="cursor:pointer;">ACTIVATE</a>`;
                        }
                    } else if (data.IsActive == 0 && data.IsBaseTemplate == false && canEditCPTemplate == 'True') {
                        careplans += `<a href="javascript:void(0)" onclick="alertInprogressStatus()"  class="btn btn-success text-white" style="cursor:pointer;">ACTIVATE</a>`;
                    }


                    if (!data.IsBaseTemplate && canDeleteCPTemplate == 'True') {
                        careplans += `<a href="javascript:void(0)" onclick="DeleteCarePlanTemplate(${data.ProgramsID},this)"  class="btn btn-success text-white" style="cursor:pointer;">Delete</a>`;
                    }

                    return careplans;
                }
            }

        ]
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
                                /* _careplanListTable.row(btn.parents('tr')).remove().draw();*/
                                GetCarePlanTemplateList()
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
                    $(".loaderOverlay").show();
                    $.ajax({
                        type: "GET",
                        url: Apipath + '/api/PatientMain/updatecareplantemplatestatus?Templateid=' + Templateid + '&status=' + Status,
                        contentType: 'application/json; charset=UTF-8',
                        dataType: "json",
                        success: function (result) {
                            GetCarePlanTemplateList();
                            $(".loaderOverlay").hide();
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
            toastr.error("Unexpected error!");
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
            toastr.error("Unexpected error!");
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
var windowWidth = $(window).width()
$(window).resize(function () {
    var finalWindowWidth = $(window).width()
    if (windowWidth != finalWindowWidth) {
        GetCarePlanTemplateList()
        windowWidth = finalWindowWidth;
    }
})
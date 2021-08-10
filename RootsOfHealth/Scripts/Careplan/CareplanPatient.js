var tableName = "";
var careplanid = "0";
var templateid = "";
var basetemplateid = "0";
var intervalStatus = "";
var isupdateBaseField = false;
var isupdateProgramFields = false;
var ItemNames;
var isCarePlanNeedCompleted = true;
var prevSelectedCarePlan = "";
var carePlanEnum = {
    NotSaved: 0,
    NotStarted: 1,
    SavedAsDraft: 2,
    InProgress: 3,
    Completed:4
};
//--------------
var fileData1 = new FormData();
var fileData2 = new FormData();
var fileData3 = new FormData();
var fileData4 = new FormData();
var fileData5 = new FormData();
var fileData6 = new FormData();
var fileData7 = new FormData();
var fileData8 = new FormData();
var fileData9 = new FormData();
var fileData10 = new FormData();
//-------------------
$(document).ready(function () {
    $("a[data-toggle='carePlansSidebar']").click(function () {
        $('#carePlansSidebar').addClass('opened');
    });
    $("a[data-toggle='addNewCarePlansSidebar']").click(function () {
        $('#addNewCarePlansSidebar').addClass('opened');
    });
    $(".carePlan_sideBar").click(function () {
        $(this).parents('.right_sidebar').removeClass('opened');
    }); 
    getCarePlanList();     
    $("#ddlcareplanstatus").on('focus', function () {
        prevSelectedCarePlan = this.value;
    });    
});
$(".care_plan_name_field").keypress(function (event) {
    var keycode = event.keyCode || event.which;
    if (keycode == '13' && !event.shiftKey) {
        updateCarePlanName(this);
        event.preventDefault();
    }
});
$(".care_plan_name_field").focusout(function () {
        updateCarePlanName(this);
});
function getCareProgramOptions() {
    $("#carePlanName").val("");
    $.ajax({
        type: "GET",
        url: Apipath + '/api/PatientMain/getprogramoptions?patientid=' + PatientId,
        contentType: 'application/json; charset=UTF-8',
        dataType: "json",
        async: false,
        success: function (result) {
            switch (result.ProgramOptions.length) {
                case 0:
                    if (result.IsExistPatientProgram == false) {
                        $(".notemplate p").html("").append("No program exists");
                        $(".notemplate").show();
                        $(".createtemplate").hide();
                        $(".btnCareplanProceed").hide();
                    } else
                        if (result.IsExistCarePlanTemplate == false || result.IsCreatedTemplateForAllProgram==false) {
                            $(".notemplate p").html("").append("No active care plan template exists for available client programs");
                            $(".notemplate").show();
                            $(".createtemplate").hide();
                            $(".btnCareplanProceed").hide();
                        }else
                        if (result.IsUsedAllCarePlanTemplate) {
                                $(".notemplate p").html("").append("Care plan already running for all programs");
                                $(".notemplate").show();
                                $(".createtemplate").hide();
                                $(".btnCareplanProceed").hide();
                            } else {
                                $(".notemplate p").html("").append("No programs template available for careplan creation"); 
                                $(".notemplate").show();
                                $(".createtemplate").hide();
                                $(".btnCareplanProceed").hide();
                            } 
                    break;
                default:
                    $(".notemplate p").html("").append("No programs available for careplan creation"); 
                    $(".createtemplate").show();
                    $(".notemplate").hide();
                    $(".btnCareplanProceed").show();
                    $("#ddlProgram").html("");
                    for (var i = 0; i < result.ProgramOptions.length; i++) {
                        $("#ddlProgram").append($("<option></option>").val(result.ProgramOptions[i].ProgramsID).html(result.ProgramOptions[i].ProgramsName));
                    }
                    break;
            }                   
            $('#AddCarePlanModal').modal({ backdrop: 'static', keyboard: false })  
        },
        error: function (e) {
            toastr.error("Unidentified error");
            $(".loaderOverlay").hide();
        }
    });  
}
function getCarePlanList() { 
    clearFileData();
    $.ajax({
        type: "GET",
        url: Apipath + '/api/PatientMain/getcareplanlist?patientid=' + PatientId,
        contentType: 'application/json; charset=UTF-8',
        dataType: "json",
        success: function (result) {
            if (intervalStatus != "") {
                clearInterval(intervalStatus);
            }
            
            if (result.length > 0) {
                $("span.careplanCount").html("").append('('+result.length+')');
            } else {
                $("span.careplanCount").html("")
            }
            $("span.careplanCount").attr('data-count', result.length)
            if (result.length) {
                var careplanList = "";
                for (var i = 0; i < result.length; i++) {
                    careplanList += `<tr data-careplan="${result[i].CarePlanId}" class="text-center">
                                     <td width="20%">${result[i].CarePlanName}</td>
                                     <td width="10%">${result[i].ProgramsName}</td>
                                      <td width="20%">`;
                    switch (result[i].status) {
                        case carePlanEnum.NotSaved:
                             //not saved
                            careplanList += `<span class="status_value notStarted">Not Saved</span></td>`;
                            break;
                        case carePlanEnum.NotStarted:
                            //not started
                            careplanList += `<span class="status_value notStarted">Not Started</span></td>`;
                            break;
                        case carePlanEnum.InProgress:
                            //In Progress
                            careplanList += `<span class="status_value inProgress">In Progress</span></td>`;
                            break;
                        case carePlanEnum.SavedAsDraft:
                            //Saved As Draft
                            careplanList += `<span class="status_value asDraft">Saved As Draft</span></td>`;
                            break;
                        case carePlanEnum.Completed:
                            //Completed
                            careplanList += `<span class="status_value completed">completed</span></td>`;
                            break;
                    }
                    careplanList += `<td width="15%">${result[i].CreatedDate.split("T")[0]}</td>`;
                    careplanList += `<td width="15%">${result[i].ModifiedDate.split("T")[0]}</td>`;
                    careplanList += `<td width="20%"><div class="d-flex">
                   <a href="javascript:void(0)" onclick="editCarePlan(${result[i].CarePlanId})" class="btn btn-success text-white" style="cursor:pointer;">${result[i].status == carePlanEnum.Completed ? 'View' :'Edit'}</a>
                   <a href="javascript:void(0)"  onclick="deleteCarePlan(this)" class="btn btn-success text-white" style="cursor:pointer;">Delete</a>
                       </div></td>`;
                }
                $(".careplanlist tbody").html("").append(careplanList);
                $(".careplanlist").DataTable({
                    retrieve: true,
                    "order": [[4, "desc"]],
                    'columnDefs': [{
                        'targets': [5],
                        'orderable': false
                    }]
                });
            } else {
                $(".careplanlist tbody").html("").append('<tr><td colspan="6" class="text-center">No careplan found.</td></tr>');
            }
        },
        error: function (e) {
            toastr.error("Unidentified error");
            $(".loaderOverlay").hide();
        }
    });
}
function proceedCarePlan(ProgramId) {  
    var programid = ProgramId;
    if (ProgramId == null) {
        programid = $("#ddlProgram").val();
    }
    $.ajax({
        type: "GET",
        url: '/careplan/GetCarePlanTemplateByProgramId?ProgramId=' + programid ,
        contentType: 'application/json; charset=UTF-8',
        dataType: "json",
        async: false,
        success: function (result) {
            if (result.html == "") {
                toastr.error("No template found");
            } else {              
                $(".basic-info-actions").show();
                $(".render-basicform").html("").append(result.html);
                tableName = result.tableName;
                templateid = result.TemplateId;
                $("#AddCarePlanModal").modal('hide');
                $("#carePlansSidebar").removeClass('opened');
                $("#addNewCarePlansSidebar").addClass('opened');
                if ($(".render-basicform").find(".basecontentarea").length > 0) {
                    getHeaderAndFooter();
                    getBaseFields();                 
                }               
                $(".render-basicform .event-btn-right").remove();
                $(".render-basicform .ck-editor-header").remove();               
                $(".render-basicform").find(".question-container").parent().css("border", "none");
                $(".render-basicform").find(".dragresize").find(".question-container").remove();
                $(".render-basicform").find(".dragresize").find(".bootom-form-row").css({ "padding": "7px 0px", "margin": "0" });
                $(".html-content").prev().css("display", "none");
                $(".html-content").parent().parent().parent().addClass("left-control");
                $(".render-basicform .f-g-left").each(function (index, item) {
                    $(item).parent().parent().addClass("left-control");
                });                                                       
                toogleToolTip();     
                getDatabaseFieldValues();
                $("textarea.program-control,textarea.base-control").summernote({
                    toolbar: [
                        ['para', ['ul', 'ol', 'paragraph']],
                        ['style', ['bold', 'italic', 'underline', 'clear']],
                        ['font', ['strikethrough', 'superscript', 'subscript']],
                    ],
                    placeholder: "Type here",
                    callbacks: {
                        onInit: function (e) {
                            this.placeholder
                                ? e.editingArea.find(".note-placeholder").html(this.placeholder)
                                : e.editingArea.remove(".note-placeholder")
                        }
                    },
                    height: 150,
                });
            }
        }, error: function (e) {
            toastr.error("Unidentified error");
            $(".loaderOverlay").hide();
        }
    });
}
function saveBasicInfo(status) {
    var fieldmodel = [];  
    var isvalid = true;
    $(".render-basicform").find(".base-control,.program-control,input.custom-control-input").each(function (index, item) {
        if ($(item).is("input") && $(item).hasAttr("data-column")) {
            switch ($(item).attr("type")) {
                case "radio":
                case "checkbox":
                    if ($(item).closest(".inputContent").prev().hasClass("required-asterisk") && $(item).closest("div.inputContent").find("input:checked").length==0) {
                          isvalid = false;
                    }
                    break;
                case "file":
                    if ($(item).closest(".inputContent").prev().hasClass("required-asterisk")) {
                        if ($(item).next().next().find("input").length == 0) {
                            isvalid = false;
                        }
                    }                   
                    break;
                default:
                    if ($(item).closest(".inputContent").prev().hasClass("required-asterisk") && $(item).val().trim()=="") {
                        isvalid = false;
                    }
                    break;

            }
        }
        
        if ($(item).is("select") && $(item).hasAttr("data-column") && ($(item).val().trim() == "" || $(item).val() == "0")) {            
            if ($(item).closest(".inputContent").prev().hasClass("required-asterisk")) {
            isvalid = false;
            }
        }
        if ($(item).is("textarea") && $(item).hasAttr("data-column")) {
            if ($(item).closest(".inputContent").prev().hasClass("required-asterisk") && $(item).summernote("isEmpty")) {
                isvalid = false;
            }
        }

    });
    if (!isvalid) {
        toastr.error("Field marked with asterisk(*) are mandatory");
        return;
    }   
    if ($(".render-basicform").find("input[type='file']").length) {
        $(".render-basicform").find("input[type='file']").each(function (index, item) {
            if ($(item).hasAttr("data-column")) {
                if ($(item).hasClass("program-control") || $(item).hasClass("base-control")) {
                    var res = validateFiles($(item).attr("id"));
                    if (res == false) {
                        return false;
                    }
                }
            }
        });
    }
    if ($(".render-basicform").find("input.invaild-input").length) {
        return false;
    }
    fieldmodel.push({ ColumnName: "PatientID", FieldValue: PatientId });
    fieldmodel.push({ ColumnName: "TemplateID", FieldValue: templateid });
    fieldmodel.push({ ColumnName: "Careplanid", FieldValue: careplanid });
    if (!isupdateProgramFields) {
        fieldmodel.push({ ColumnName: "CreatedBy", FieldValue: userId });
        fieldmodel.push({ ColumnName: "CreatedDate", FieldValue: getActualFullDate() });
    }
    fieldmodel.push({ ColumnName: "ModifiedBy", FieldValue: userId });
    fieldmodel.push({ ColumnName: "ModifiedDate", FieldValue: getActualFullDate() });
    if ($(".render-basicform").find(".base-control").length) {
        fieldmodel.push({ ColumnName: "BaseTemplateID", FieldValue: basetemplateid });
    }
    $(".render-basicform [type=text],[type=number],[type=file],[type=date]").each(function (index, item) {
        if ($(item).hasAttr("data-column") && $(item).val() != "" && $(item).hasClass("program-control")) {
            fieldmodel.push({ ColumnName: $(item).attr("data-column"), FieldValue: $(item).val() });
        }
    });
    $(".render-basicform select").each(function (index, item) {
        if ($(item).hasAttr("data-column") && $(item).val() != "" && $(item).hasClass("program-control")) {
            fieldmodel.push({ ColumnName: $(item).attr("data-column"), FieldValue: $(item).val() });
        }
    });
    $(".render-basicform [type=checkbox],.render-basicform [type=radio]").each(function (index, item) {
        if ($(item).hasAttr("data-column") && $(item).closest("div.inputContent").find("input:checked").length && $(item).closest(".form-group").hasClass("program-control")) {
            var selectedValues = $.map($(item).closest("div.inputContent").find("input:checked"), function (n, i) {
                return n.value;
            }).join(',');
            fieldmodel.push({ ColumnName: $(item).attr("data-column"), FieldValue: selectedValues });
        }
    });
    $(".render-basicform textarea").each(function (index, item) {
        if ($(item).hasAttr("data-column") && $(item).val() != "" && $(item).hasClass("program-control")) {
            fieldmodel.push({ColumnName: $(item).attr("data-column"), FieldValue: $(item).val() });
        }
    });    
    $.confirm({
        icon: 'fas fa-exclamation-triangle',
        title: 'Confirm',
        content: 'Once form submitted can not be edited again, press ok to continue',
        type: 'green',
        typeAnimated: true,
        buttons: {
            ok: {
                btnClass: 'btn-green',
                action: function () {
                    var model = {
                        ID: isupdateProgramFields ? careplanid : 0,
                        TableName: tableName,
                        carePlanCols: fieldmodel,
                    }
                    $(".loaderOverlay").show();
                    $.ajax({
                        type: "POST",
                        url: Apipath + '/api/PatientMain/savecareplanbasicinfo',
                        contentType: 'application/json; charset=UTF-8',
                        data: JSON.stringify(model),
                        dataType: "json",
                        success: function (res) {
                            if ($(".render-basicform").find(".base-control").length) {
                                saveBaseFieldInfo();
                                //updateDefaultneeds(careplanid, basetemplateid);
                            }
                            updateCareplanStatus(status);//update Careplan status
                            $("#carePlanName").val("");                            
                            $(".loaderOverlay").hide();
                            toastr.success("Saved successfully");
                            $(".basic-info-actions").hide();
                            if (intervalStatus != "") {
                                clearInterval(intervalStatus);
                            }
                            if ($(".render-basicform").find("input[type='file']").length) {
                                $(".render-basicform").find("input[type='file']").each(function (index, item) {
                                    if ($(item).hasAttr("data-column")) {
                                        if ($(item).hasClass("program-control") || $(item).hasClass("base-control")) {
                                            switch (index) {
                                                case 0:
                                                    uploadFiles($(item).attr("id"), fileData1);
                                                    break;
                                                case 1:
                                                    uploadFiles($(item).attr("id"), fileData2);
                                                    break;
                                                case 2:
                                                    uploadFiles($(item).attr("id"), fileData3);
                                                    break;
                                                case 3:
                                                    uploadFiles($(item).attr("id"), fileData4);
                                                    break;
                                                case 4:
                                                    uploadFiles($(item).attr("id"), fileData5);
                                                    break;
                                                case 5:
                                                    uploadFiles($(item).attr("id"), fileData6);
                                                    break;
                                                case 6:
                                                    uploadFiles($(item).attr("id"), fileData7);
                                                    break;
                                                case 7:
                                                    uploadFiles($(item).attr("id"), fileData8);
                                                    break;
                                                case 8:
                                                    uploadFiles($(item).attr("id"), fileData9);
                                                    break;
                                                case 9:
                                                    uploadFiles($(item).attr("id"), fileData10);
                                                    break;
                                            }
                                        }
                                    }
                                });
                            }
                            clearFileData();
                            makeBasicInfoReadonly();
                            //updateDefaultneeds(careplanid, templateid);
                        },
                        error: function (e) {
                            toastr.error("Unidentified error");
                            $(".loaderOverlay").hide();
                        }
                    });
                }
            },
            cancel: {

            }
        },

    });
   
}
function saveCareplan() {
    if ($("#carePlanName").val().trim() == "") {
        toastr.error("Careplan name is required");
        return;
    }
    var model = {
        CarePlanName: $("#carePlanName").val(),
        ProgramID: $("#ddlProgram").val(),
        Status: carePlanEnum.NotSaved,//not saved
        CreatedBy: userId,
        ModifiedBy: userId,
        PatientId: PatientId
    }
    $(".loaderOverlay").show();
    $.ajax({
        type: "POST",
        url: Apipath + '/api/PatientMain/savecareplan',
        contentType: 'application/json; charset=UTF-8',
        data: JSON.stringify(model),
        dataType: "json",        
        success: function (res) {
            switch (res) {
                case -1:
                    toastr.error("Careplan name alreday exist");
                    $(".loaderOverlay").hide();                  
                    break;
                default:
                    careplanid = res;
                    $(".care_plan_name_field").val($("#carePlanName").val());
                    proceedCarePlan();
                    intervalStatus = setInterval(saveBasicInfoAsDraft, 300000, carePlanEnum.SavedAsDraft);
                    setCarePlanActiveTab('a_p_basic_info');
                    $("#ddlcareplanstatus,.care_plan_name_field").removeAttr("disabled");
                    $("#ddlcareplanstatus").removeClass("show_careplanstatus").val("-1");
                    $("a.need-nav,a.summary-nav").parent().addClass("disabled");
                    $('.requestItem').removeClass('d-none');
                    $(".loaderOverlay").hide();
                    
                    var value = $('.careplanCount').attr('data-count');
                    if (value != '') {
                        value = parseInt(value)
                        value++;
                    }
                    $('span.careplanCount').attr('data-count', value);
                    $('span.careplanCount').html("").append('(' + value + ')');
                    break;
            }                  
        },
        error: function (e) {
            toastr.error("Unidentified error");
            $(".loaderOverlay").hide();
        }
    });
}
function toogleToolTip() {
        $(".render-basicform").find('span.tooltipicon').tooltip({
            trigger: "click",
            html: true,
            container: 'body'
        });
    $(".render-basicform").find('span.tooltipicon').on('show.bs.tooltip', function () {
        $(".render-basicform").find('span.tooltipicon').not(this).tooltip('hide');
    });
    $('body').on('click', function (e) {
        if ($(e.target).data('toggle') !== 'tooltip' && $(e.target).parents('[data-toggle="tooltip"]').length === 0
            && $(e.target).parents('.tooltip.in').length === 0) {
            (($('[data-toggle="tooltip"]').tooltip('hide').data('bs.tooltip') || {}).inState || {}).click = false;
        }
    });
}
function getHeaderAndFooter() {
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
                    basetemplateid = result;
                    $.ajax({
                        type: "GET",
                        url: '/careplan/GetFormHtmlById?Id=' + result,
                        contentType: 'application/json; charset=UTF-8',
                        dataType: "json",
                        async: false,
                        success: function (result) {
                            var baseHtml = parseHTML(result.html);
                            var baseHeader = $(baseHtml).find(".baseheader").html();
                            var baseFooter = $(baseHtml).find(".basefooter").html();
                            $(".render-basicform").find(".baseheader").html("").append(baseHeader);
                            $(".render-basicform").find(".basefooter").html("").append(baseFooter);
                        },
                        error: function (e) {
                            toastr.error("Unidentified error");
                            $(".loaderOverlay").hide();
                        }
                    });
                    break;
            }
        },
        error: function (e) {
            toastr.error("Unidentified error");
            $(".loaderOverlay").hide();
        }
    });
}
function parseHTML(htmlstr) {
    var t = document.createElement('template');
    t.innerHTML = htmlstr;
    return t.content.cloneNode(true);
}
function saveBaseFieldInfo() {
    isUpdateBaseFields();
    var fieldmodel = [];
    fieldmodel.push({ ColumnName: "PatientID", FieldValue: PatientId });
    fieldmodel.push({ ColumnName: "TemplateID", FieldValue: templateid });    
    fieldmodel.push({ ColumnName: "Careplanid", FieldValue: careplanid });
    if (!isupdateBaseField) {
        fieldmodel.push({ ColumnName: "CreatedBy", FieldValue: userId });
        fieldmodel.push({ ColumnName: "CreatedDate", FieldValue: getActualFullDate() });
    }
    fieldmodel.push({ ColumnName: "ModifiedBy", FieldValue: userId });
    fieldmodel.push({ ColumnName: "ModifiedDate", FieldValue: getActualFullDate() });   
    $(".render-basicform [type=text],[type=number],[type=file],[type=date]").each(function (index, item) {
        if ($(item).hasAttr("data-column") && $(item).val() != "" && $(item).hasClass("base-control")) {
            fieldmodel.push({ ColumnName: $(item).attr("data-column"), FieldValue: $(item).val() });
        }
    });
    $(".render-basicform select").each(function (index, item) {
        if ($(item).hasAttr("data-column") && $(item).val() != "" && $(item).hasClass("base-control")) {
            fieldmodel.push({ ColumnName: $(item).attr("data-column"), FieldValue: $(item).val() });
        }
    });
    $(".render-basicform [type=checkbox],.render-basicform [type=radio]").each(function (index, item) {
        if ($(item).hasAttr("data-column") && $(item).closest("div.inputContent").find("input:checked").length && $(item).closest(".form-group").hasClass("base-control")) {
            var selectedValues = $.map($(item).closest("div.inputContent").find("input:checked"), function (n, i) {
                return n.value;
            }).join(',');
            fieldmodel.push({ ColumnName: $(item).attr("data-column"), FieldValue: selectedValues });
        }
    });
    $(".render-basicform textarea").each(function (index, item) {
        if ($(item).hasAttr("data-column") && $(item).val() != "" && $(item).hasClass("base-control")) {
            fieldmodel.push({ ColumnName: $(item).attr("data-column"), FieldValue: $(item).val() });
        }
    });   
    var model = {
        PatientId: isupdateBaseField ? PatientId : 0,
        TableName: "tbl_BaseTemplate",
        carePlanCols: fieldmodel
    }   
    $(".loaderOverlay").show();
    $.ajax({
        type: "POST",
        url: Apipath + '/api/PatientMain/savecareplanfieldbasevalue',
        contentType: 'application/json; charset=UTF-8',
        data: JSON.stringify(model),
        dataType: "json",
        async: false,
        success: function (res) {
            
        },
        error: function (e) {
            toastr.error("Unidentified error");
            $(".loaderOverlay").hide();
        }
    });
}
function updateCareplanStatus(status) {
    var model = {
        CarePlanId: careplanid,
        Status: status,
        TemplateID: templateid,
        ModifiedBy: userId,
    }
    $.ajax({
        type: "POST",
        url: Apipath + '/api/PatientMain/savecareplan',
        contentType: 'application/json; charset=UTF-8',
        data: JSON.stringify(model),
        dataType: "json",
        async: false,
        success: function (res) {
        },
        error: function (e) {
            toastr.error("Unidentified error");
            $(".loaderOverlay").hide();
        }
    });
}
function getBaseFields() {
    $.ajax({
        type: "GET",
        url: Apipath + '/api/PatientMain/getbasefieldbypatientid?Patientid=' + PatientId,
        contentType: 'application/json; charset=UTF-8',
        dataType: "json",
        async: false,
        success: function (result) {
            if (result.length) {
                var baseFields = result[0];                
                $(".render-basicform").find(".form-control.base-control,input.custom-control-input").each(function (index, item) {
                    if ($(item).is("input")) {
                        switch ($(item).attr("type")) {
                            case "radio":
                            case "checkbox":
                                if ($(item).hasAttr("data-column") && $(item).closest("div.form-group").hasClass("base-control")) {
                                    var value = baseFields[$(item).attr("data-column")];
                                    if (value == null || value == "" || value == undefined) {

                                    } else {
                                        var valueArr = value.split(',');
                                        for (var i = 0; i < valueArr.length; i++) {
                                            $(item).closest("div.form-group").find(`input[value=${valueArr[i]}]`).prop("checked", true);
                                        }
                                    }
                                }
                                break;
                            case "file":
                                if ($(item).hasAttr("data-column") && $(item).hasClass("base-control")) {
                                    getBaseFiles($(item).attr("id"));
                                }
                                break;
                            default:
                                item.value = baseFields[$(item).attr("data-column")] == undefined ? "" : baseFields[$(item).attr("data-column")];
                                break;
                        }
                    }
                    if ($(item).is("select")) {
                        item.value = baseFields[$(item).attr("data-column")] == undefined ? "" : baseFields[$(item).attr("data-column")];      
                    }
                    if ($(item).is("textarea")) {
                            value = baseFields[$(item).attr("data-column")];                  
                            $(item).summernote('code', value);                   
                    }                              
                });
            }
        },
        error: function (e) {
            toastr.error("Unidentified error");
            $(".loaderOverlay").hide();
        }
    });
}
function getBaseFieldData() {
    $.ajax({
        type: "GET",
        url: Apipath + '/api/PatientMain/getbasefieldbypatientid?Patientid=' + PatientId,
        contentType: 'application/json; charset=UTF-8',
        dataType: "json",
        async: false,
        success: function (result) {
            if (result.length) {
                var baseFields = result[0];
                var value = "";
                $(".render-basicform").find(".form-control.base-control,input.custom-control-input").each(function (index, item) {
                    if ($(item).is("input")) {
                        switch ($(item).attr("type")) {
                            case "radio":
                            case "checkbox":
                                if ($(item).hasAttr("data-column")) {
                                    if ($(item).closest("div.inputContent").parent().hasClass("base-control")) {
                                        value = baseFields[$(item).attr("data-column")];
                                        if (value == null || value == "" || value == undefined) {
                                            if (isupdateProgramFields) {

                                            } else {
                                                $(item).closest("div.inputContent").find("label.label-base").html("").show();
                                                $(item).closest("div.inputContent").find("div").first().hide();                                               
                                            }                                           
                                        } else {
                                            var valueArr = value.split(',');
                                            var valueTxt = "";
                                            if (isupdateProgramFields) {
                                                for (var i = 0; i < valueArr.length; i++) {
                                                    $(item).closest("div.inputContent").find(`input[value=${valueArr[i]}]`).prop("checked", true);
                                                }
                                            } else {
                                                for (var i = 0; i < valueArr.length; i++) {
                                                    valueTxt += $(item).closest("div.inputContent").find(`input[value=${valueArr[i]}]`).next().text() + ", ";
                                                }
                                                valueTxt = valueTxt.slice(0, -2);
                                                $(item).closest("div.inputContent").find("label.label-base").html("").append(valueTxt).show();
                                                $(item).closest("div.inputContent").find("div").first().hide();                                               
                                            }
                                        }
                                    }
                                }
                                break;
                            case "file":
                                if (isupdateProgramFields) {
                                    if ($(item).hasAttr("data-column") && $(item).hasClass("base-control")) {
                                        getBaseFiles($(item).attr("id"));
                                    }
                                } else {
                                    getBaseFilesReadonly($(item).attr("id"));
                                    $(item).hide();
                                }
                                break;
                            default:
                                value = baseFields[$(item).attr("data-column")];
                                if (isupdateProgramFields) {
                                    item.value = value;
                                } else {
                                    $(item).next().html("").append(value).show();
                                    $(item).hide();
                                }
                                break;
                        }
                    }
                    if ($(item).is("select")) {
                        value = baseFields[$(item).attr("data-column")];
                        if (isupdateProgramFields) {
                            item.value = value;
                        } else {
                            value = $(item).find(`option[value=${value}]`).text();
                            $(item).next().html("").append(value).show();
                            $(item).hide();
                        }
                    }
                    if ($(item).is("textarea")) {
                        value = baseFields[$(item).attr("data-column")];
                        if (isupdateProgramFields) {
                            $(item).summernote('code', value);
                        } else {
                            $(item).parent().find("label.label-base").html("").append(value).show();
                            $(item).next().hide();
                        }
                    }                    
                });
            }
        },
        error: function (e) {
            toastr.error("Unidentified error");
            $(".loaderOverlay").hide();
        }
    });
}
function editCarePlan(Id) {
    $(".loaderOverlay").show();
    setCarePlanActiveTab('a_p_basic_info');
    $.ajax({
        type: "GET",
        url: Apipath + '/api/PatientMain/getcareplanbyid?Careplanid=' + Id,
        contentType: 'application/json; charset=UTF-8',
        dataType: "json",       
        success: function (result) {
            IsCarePlanApproved = result.IsApproved == null ? false : result.IsApproved;
            $(".care_plan_name_field").val(result.CarePlanName);
            isupdateProgramFields = false;
            $("#ddlcareplanstatus,.care_plan_name_field").removeAttr("disabled");
            
            if (IsUserCarePlanApprover == 'False' || userId == result.CreatedBy) {
                $('.requestItem').removeClass('d-none');
            }
            switch (result.Status) {
                case carePlanEnum.NotSaved://not saved                    
                    careplanid = result.CarePlanId;                   
                    proceedCarePlan(result.ProgramID);
                    $("#ddlcareplanstatus").removeClass("show_careplanstatus").val("-1");
                    $("a.need-nav,a.summary-nav").parent().addClass("disabled");
                    intervalStatus = setInterval(saveBasicInfoAsDraft, 300000, carePlanEnum.SavedAsDraft);
                    break;
                case carePlanEnum.NotStarted://not started                    
                    careplanid = result.CarePlanId;
                    getCarePlanBasicFormHtml(result.TemplateID);
                    getCarePlanBasicFormValue(result.CarePlanId, result.TemplateID);
                    $(".basic-info-actions").hide();
                    $("#ddlcareplanstatus").addClass("show_careplanstatus").val("1");
                    $("a.need-nav,a.summary-nav").parent().removeClass("disabled");
                    $("#carePlansSidebar").removeClass('opened');
                    $("#addNewCarePlansSidebar").addClass('opened');
                    break;
                case carePlanEnum.InProgress://in-progress
                    careplanid = result.CarePlanId;
                    getCarePlanBasicFormHtml(result.TemplateID);
                    getCarePlanBasicFormValue(result.CarePlanId, result.TemplateID);
                    $(".basic-info-actions").hide();
                    $("#ddlcareplanstatus").addClass("show_careplanstatus").val("3");
                    $("a.need-nav,a.summary-nav").parent().removeClass("disabled");
                    $("#carePlansSidebar").removeClass('opened');
                    $("#addNewCarePlansSidebar").addClass('opened');
                    break;
                case carePlanEnum.SavedAsDraft://save as draft
                    careplanid = result.CarePlanId;
                    isUpdateProgramFields(result.TemplateID, result.CarePlanId);                  
                    proceedCarePlan(result.ProgramID);
                    getCarePlanBasicFormValue(result.CarePlanId, result.TemplateID);
                    $(".basic-info-actions").show();
                    $("#ddlcareplanstatus").removeClass("show_careplanstatus").val("-1");
                    $("a.need-nav,a.summary-nav").parent().addClass("disabled");
                    $("#carePlansSidebar").removeClass('opened');
                    $("#addNewCarePlansSidebar").addClass('opened');
                    break;   
                case carePlanEnum.Completed://Completed
                    careplanid = result.CarePlanId;
                    getCarePlanBasicFormHtml(result.TemplateID);
                    getCarePlanBasicFormValue(result.CarePlanId, result.TemplateID);
                    $(".basic-info-actions").hide();
                    $("#ddlcareplanstatus").addClass("show_careplanstatus").val("4");
                    $("a.need-nav,a.summary-nav").parent().removeClass("disabled");
                    $("#carePlansSidebar").removeClass('opened');
                    $("#addNewCarePlansSidebar").addClass('opened');                
                    $("#ddlcareplanstatus,.care_plan_name_field").attr("disabled", true);
                    $('.requestItem').addClass('d-none');
                    break;
                default:                 
                    break;
            }
            $(".loaderOverlay").hide();
        }, error: function (e) {
            toastr.error("Unidentified error");
            $(".loaderOverlay").hide();
        }
    });    
}
function getCarePlanBasicFormHtml(id) {
    $(".loaderOverlay").show();
    $.ajax({
        type: "GET",
        url: '/careplan/GetCarePlanTemplateById?TemplateId=' + id,
        contentType: 'application/json; charset=UTF-8',
        dataType: "json",
        async: false,
        success: function (result) {
            if (result.html == "") {
                toastr.error("No template found");
            } else {
                $(".render-basicform").html("").append(result.html);
                tableName = result.tableName;
                templateid = id;
                if ($(".render-basicform").find(".basecontentarea").length > 0) {
                    getBasehtmlByCarePlanId(careplanid);                    
                }
                $(".render-basicform .event-btn-right").remove();
                $(".render-basicform .ck-editor-header").remove();
                $(".render-basicform").find(".question-container").parent().css("border", "none");
                $(".render-basicform").find(".dragresize").find(".question-container").remove();
                $(".render-basicform").find(".dragresize").find(".bootom-form-row").css({ "padding": "7px 0px", "margin": "0" });
                $(".html-content").prev().css("display", "none");
                $(".html-content").parent().parent().parent().addClass("left-control");
                $(".render-basicform .f-g-left").each(function (index, item) {
                    $(item).parent().parent().addClass("left-control");
                });               
                toogleToolTip();
                getDatabaseFieldValues();
                $("textarea.program-control,textarea.base-control").summernote({
                    toolbar: [
                        ['para', ['ul', 'ol', 'paragraph']],
                        ['style', ['bold', 'italic', 'underline', 'clear']],
                        ['font', ['strikethrough', 'superscript', 'subscript']],
                    ],
                    placeholder: "Type here",
                    callbacks: {
                        onInit: function (e) {
                            this.placeholder
                                ? e.editingArea.find(".note-placeholder").html(this.placeholder)
                                : e.editingArea.remove(".note-placeholder")
                        }
                    },
                    height: 150,
                });
            }
        },
        error: function (e) {
            toastr.error("Unidentified error");
            $(".loaderOverlay").hide();
        }
    });
    $(".loaderOverlay").hide();
}
function getCarePlanBasicFormValue(careplanid, templateid) {
    $(".loaderOverlay").show();
    $.ajax({
        type: "GET",
        url: Apipath + '/api/PatientMain/getfieldvaluebycareplanid?CarplanId=' + careplanid + "&TemplateId="+templateid,
        contentType: 'application/json; charset=UTF-8',
        dataType: "json",
        async: false,
        success: function (result) {
            if (result.length) {
                var fields = result[0];
                var value = "";
                $(".render-basicform").find(".program-control,input.custom-control-input").each(function (index, item) {
                    if ($(item).is("input")) {
                        switch ($(item).attr("type")) {
                            case "radio":
                            case "checkbox":
                                if ($(item).hasAttr("data-column") && $(item).closest("div.inputContent").parent().hasClass("program-control")) {                                    
                                    value = fields[$(item).attr("data-column")];
                                    if (value == null || value == "") {
                                        if (isupdateProgramFields) {

                                        } else {
                                            $(item).closest("div.inputContent").find("label.label-program").html("").show();
                                            $(item).closest("div.inputContent").find("div").first().hide();
                                        }
                                    } else {
                                        var valueArr = value.split(',');
                                        var valueTxt = "";
                                        if (isupdateProgramFields) {
                                            for (var i = 0; i < valueArr.length; i++) {
                                                $(item).closest("div.inputContent").find(`input[value=${valueArr[i]}]`).prop("checked", true);
                                            }
                                        } else {
                                            for (var i = 0; i < valueArr.length; i++) {
                                                valueTxt += $(item).closest("div.inputContent").find(`input[value=${valueArr[i]}]`).next().text() + ", ";
                                            }
                                            valueTxt = valueTxt.slice(0, -2);
                                            $(item).closest("div.inputContent").find("label.label-program").html("").append(valueTxt).show();
                                            $(item).closest("div.inputContent").find("div").first().hide();                                           
                                        }
                                    }
                                }
                                break;
                            case "file":
                                getProgramFiles(careplanid, $(item).attr("id")); 
                                if (!isupdateProgramFields) {
                                    $(item).hide();
                                }
                                break;
                            default:
                                value = fields[$(item).attr("data-column")];
                                if (isupdateProgramFields) {
                                    item.value = value;
                                } else {
                                    $(item).next().html("").append(value).show();
                                    $(item).hide();
                                }
                                break;
                        }
                    }
                    if ($(item).is("select")) {
                        value = fields[$(item).attr("data-column")];
                        if (isupdateProgramFields) {
                            item.value = value;
                        } else {
                            value = $(item).find(`option[value=${value}]`).text();
                            $(item).next().html("").append(value).show();
                            $(item).hide();
                        }
                    }
                    if ($(item).is("textarea")) {
                        value = fields[$(item).attr("data-column")];
                        if (isupdateProgramFields) {
                            $(item).summernote('code', value); 
                        } else {
                            $(item).parent().find("label.label-program").html("").append(value).show();
                            $(item).next().hide();
                        }
                    }
                });                
            }
            if ($(".render-basicform").find(".basecontentarea").length > 0) {
                getBaseFieldData();
            }
        }, error: function (e) {
            toastr.error("Unidentified error");
            $(".loaderOverlay").hide();
        }
    });
    $(".loaderOverlay").hide();
}
$.fn.hasAttr = function (name) {
    return this.attr(name) !== undefined;
};
function closecarePlan() {
    if (intervalStatus != "") {
        clearInterval(intervalStatus);
    }
    clearFileData();
    $.ajax({
        type: "GET",
        url: Apipath + '/api/PatientMain/getcareplanlist?patientid=' + PatientId,
        contentType: 'application/json; charset=UTF-8',
        dataType: "json",
        success: function (result) {
             tableName = "";
             careplanid = "0";
            templateid = "";
            basetemplateid = "0";
             intervalStatus = "";             
            isupdateProgramFields = false;
            $("#carePlanName").val("");     
            
            if (result.length > 0) {
                $("span.careplanCount").html("").append('('+result.length+')');
            } else {
                $("span.careplanCount").html("")
            }
            $("span.careplanCount").attr('data-count', result.length)
            if (result.length) {
                var careplanList = "";
                for (var i = 0; i < result.length; i++) {
                    careplanList += `<tr data-careplan="${result[i].CarePlanId}" class="text-center">
                                     <td width="20%">${result[i].CarePlanName}</td>
                                     <td width="10%">${result[i].ProgramsName}</td>
                                      <td width="20%">`;
                    switch (result[i].status) {
                        case carePlanEnum.NotSaved:
                            //not saved
                            careplanList += `<span class="status_value notStarted">Not Saved</span></td>`;
                            break;
                        case carePlanEnum.NotStarted:
                            //not started
                            careplanList += `<span class="status_value notStarted">Not Started</span></td>`;
                            break;
                        case carePlanEnum.InProgress:
                            //In Progress
                            careplanList += `<span class="status_value inProgress">In Progress</span></td>`;
                            break;
                        case carePlanEnum.SavedAsDraft:
                            //Saved As Draft
                            careplanList += `<span class="status_value asDraft">Saved As Draft</span></td>`;
                            break;
                        case carePlanEnum.Completed:
                            //Completed
                            careplanList += `<span class="status_value completed">completed</span></td>`;
                            break;
                    }
                    careplanList += `<td width="15%">${result[i].CreatedDate.split("T")[0]}</td>`;
                    careplanList += `<td width="15%">${result[i].ModifiedDate.split("T")[0]}</td>`;
                    careplanList += `<td width="20%"><div>
                   <a href="javascript:void(0)" onclick="editCarePlan(${result[i].CarePlanId})" class="btn btn-success text-white" style="cursor:pointer;">${result[i].status == carePlanEnum.Completed ? 'View' : 'Edit'}</a>
                   <a href="javascript:void(0)"  onclick="deleteCarePlan(this)" class="btn btn-success text-white" style="cursor:pointer;">Delete</a>
                       </div></td>`;
                }
                $(".careplanlist tbody").html("").append(careplanList);
                $(".careplanlist").DataTable({
                    retrieve: true,
                    "order": [[4, "desc"]],
                    'columnDefs': [{
                        'targets': [5],
                        'orderable': false
                    }]
                });
            } else {
                $(".careplanlist tbody").html("").append('<tr><td colspan="5" class="text-center">No careplan found.</td></tr>');
            }
            $('#addNewCarePlansSidebar').removeClass('opened');
        }, error: function (e) {
            toastr.error("Unidentified error");
            $(".loaderOverlay").hide();
        }
    });
}
function isUpdateBaseFields() {
    $.ajax({
        type: "GET",
        url: Apipath + '/api/PatientMain/checkbasefieldbypatientid?patientid=' + PatientId,
        contentType: 'application/json; charset=UTF-8',
        dataType: "json",
        async: false,
        success: function (result) {
            
            if (result != 0) {
                isupdateBaseField = true;
            } else {
                isupdateBaseField = false;
            }
        }, error: function (e) {
            toastr.error("Unidentified error");
            $(".loaderOverlay").hide();
        }
    });
}
function isUpdateProgramFields(tempid,careplanid) {
    $.ajax({
        type: "GET",
        url: Apipath + '/api/PatientMain/checkprogramfieldbycareplanid?templateid=' + tempid + "&careplanid=" + careplanid,
        contentType: 'application/json; charset=UTF-8',
        dataType: "json",
        async: false,
        success: function (result) {        
            if (result != 0) {
                isupdateProgramFields = true;
            } else {
                isupdateProgramFields = false;
            }
        }, error: function (e) {
            toastr.error("Unidentified error");
            $(".loaderOverlay").hide();
        }
    });
}
function makeBasicInfoReadonly() {
    $("#ddlcareplanstatus").addClass("show_careplanstatus").val("1");
    var value = "";
    isupdateProgramFields = false;
    $("a.need-nav,a.summary-nav").parent().removeClass("disabled");
    $(".render-basicform").find(".program-control,.base-control").each(function (index, item) {    
        if ($(item).is("div")) {
            var selectedValues = $.map($(item).find("input:checked"), function (n, i) {
                return n.value;
            }).join(',');
            if (selectedValues == "") {
                if ($(item).hasClass("base-control")) {
                    $(item).find("label.label-base").html("").show();
                    $(item).find("div.inputContent").find("div").first().hide();
                } else {
                    $(item).find("label.label-program").html("").show();
                    $(item).find("div.inputContent").find("div").first().hide();
                }               
            } else {
                var valueArr = selectedValues.split(',');
                var valueTxt = "";
                for (var i = 0; i < valueArr.length; i++) {
                    valueTxt += $(item).find(`input[value=${valueArr[i]}]`).next().text() + ", ";
                }
                valueTxt = valueTxt.slice(0, -2);
                if ($(item).hasClass("base-control")) {
                    $(item).find("label.label-base").html("").append(valueTxt).show();
                    $(item).find("div.inputContent").find("div").first().hide();
                } else {
                    $(item).find("label.label-program").html("").append(valueTxt).show();
                    $(item).find("div.inputContent").find("div").first().hide();
                }    
                
            }           
        }
        if ($(item).is("input")) {
            switch ($(item).attr("type")) {
                case "file":                  
                    if ($(item).hasClass("base-control") && $(item).hasAttr("data-column")) {
                        getBaseFilesReadonly($(item).attr("id"));
                    } else if ($(item).hasClass("program-control") && $(item).hasAttr("data-column")) {
                        getProgramFiles(careplanid, $(item).attr("id"))
                    }
                    $(item).hide();
                    break;
                default:
                    value = $(item).val();
                    $(item).next().html("").append(value).show();                 
                    $(item).hide();
                    break;
            }
        }
        if ($(item).is("select")) {
            value = $(item).find('option:selected').text();
            $(item).next().html("").append(value).show();
            $(item).hide();
        }
        if ($(item).is("textarea")) {
            value = $(item).summernote('code');
            if ($(item).hasClass("base-control")) {
                $(item).parent().find("label.label-base").html("").append(value).show();
            } else {
                $(item).parent().find("label.label-program").html("").append(value).show();
            }            
            $(item).next().hide();
        }
    });
}
function getActualFullDate() {
    var d = new Date();
    var day = addZero(d.getDate());
    var month = addZero(d.getMonth() + 1);
    var year = addZero(d.getFullYear());
    var h = addZero(d.getHours());
    var m = addZero(d.getMinutes());
    var s = addZero(d.getSeconds());
    return year + "-" + month + "-" + day + " " + h + ":" + m + ":" + s;
}
function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}
function previewOnChange(obj) {
    if (obj.files.length) {
        var fileData;
        if ($(".render-basicform").find("input[type='file']").length) {
            $(".render-basicform").find("input[type='file']").each(function (index, item) {
                if ($(item).hasClass("program-control") || $(item).hasClass("base-control")) {
                    if ($(item).attr("id") == $(obj).attr("id")) {                      
                        switch (index) {                            
                            case 0:
                                fileData = null;
                                fileData = fileData1;
                                break;
                            case 1:
                                fileData = null;
                                fileData = fileData2;
                                break;
                            case 2:
                                fileData = null;
                                fileData = fileData3;
                                break;
                            case 3:
                                fileData = null;
                                fileData = fileData4;
                                break;
                            case 4:
                                fileData = null;
                                fileData = fileData5;
                                break;
                            case 5:
                                fileData = fileData6;
                                break;
                            case 6:
                                fileData = null;
                                fileData = fileData7;
                                break;
                            case 7:
                                fileData = null;
                                fileData = fileData8;
                                break;
                            case 8:
                                fileData = null;
                                fileData = fileData9;
                                break;
                            case 9:
                                fileData = null;
                                fileData = fileData10;
                                break;                           
                        }
                        if (fileData != null) {
                            return false;
                        }
                    }                   
                }
            });
        }           
        var selectedFiles = $(obj).next().next().find("div.label").length ? "" : `<div class="label">File Names</div><ul class="file_uploaded_list file_uploaded_inputs">`;
        if (!$(obj).hasAttr("multiple")) {
            for (var key of fileData.keys()) {               
                fileData.delete(key)
            }
            selectedFiles = `<div class="label">File Names</div><ul class="file_uploaded_list file_uploaded_inputs">`;
            $(obj).next().next().html("");
        }
        var iSize = "";
        var maxSize = $(obj).attr("data-filesize");
        var fileExtensons = $(obj).attr("data-accept").split(',');
        var filename = "";
        for (var i = 0; i < obj.files.length; i++) {
            if (fileData.get(obj.files[i].name) == null) {
                filename = obj.files[i].name;
                if (!fileExtensons.some(el => filename.toLowerCase().endsWith(el))) {
                    toastr.error("Invalid file. Valid formats are (" + fileExtensons.join(",").replace(/\./g, ' ') + ")");
                    obj.value = "";
                    return false;
                }
                iSize = (obj.files[i].size / 1024);
                iSize = (Math.round(iSize * 100) / 100);
                if (iSize > maxSize) {
                    toastr.error(obj.files[i].name + " Size is exceeded than " + maxSize + "kb");
                    obj.value = "";
                    return false;
                } else {
                    var file = URL.createObjectURL(obj.files[i]);                    
                    selectedFiles += `<li><input class="form-control" placeholder="Enter file name here" type="text" value="${obj.files[i].name.split(".").shift()}"/>`
                    selectedFiles += '<a href="' + file + '" target="_blank">' + obj.files[i].name + '</a><span data-remove="' + obj.files[i].name + '" onclick="removeUpload(this)" class="removeUploadFile"><i class="fa fa-times"></i></span></li>';
                    fileData.append(obj.files[i].name, obj.files[i]);
                }
            }
        }
        if ($(obj).next().next().find("div.label").length) {
            $(obj).next().next().find("ul").append(selectedFiles);
        } else {
            selectedFiles += "</ul>";
            $(obj).next().next().html("").append(selectedFiles);      
        }
      } else {
        //$(obj).next().next().html("");
    }    
}
function uploadFiles(Id, fileData) {
    var files = $("#" + Id).get(0).files;
    var fileNames = [];
    var savedfiles =[];
    $("#" + Id).next().next().find("input").each(function (index, item) {
        fileNames.push($(item).val());
        if ($(item).hasAttr("data-file")) {
            savedfiles.push($(item).attr("data-file"));
        }
    });
    if (files.length==0 && savedfiles.length == 0) {
        return;
    }
    if (fileNames.length == 0) {
        return;
    }
    fileData.append("CarePlanId", careplanid);
    fileData.append("ControlId", Id);   
    fileData.append("Files", savedfiles.join(","));  
    fileData.append("FileNames", fileNames.join(","));
    fileData.append("PatientId", PatientId);
    fileData.append("IsBaseField", $("#" + Id).hasClass("base-control"));
    
    $.ajax({
        type: "POST",
        url: "/CarePlan/UploadFiles",
        dataType: "json",
        contentType: false, 
        processData: false,
        data: fileData,
        async: false,
        success: function (result, status, xhr) {          
            fileData = new FormData();           
        }, error: function (e) {
            toastr.error("Unidentified error");
            $(".loaderOverlay").hide();
            return false
        }
    });
}
function getProgramFiles(careid, Id) {
    $.ajax({
        type: "GET",
        url: Apipath + '/api/PatientMain/getfilesbyCareplanid?Careplanid=' + careid +'&controlid='+Id,
        contentType: 'application/json; charset=UTF-8',
        dataType: "json",
        async: false,
        success: function (result) {
            if (result != "" && result != null) {
                var filesArr = result.Files.split(',');
                var namesArr = result.FileNames.split(',');
                var selectedFiles = "";
                if (isupdateProgramFields) {
                     selectedFiles = `<div class="label">File Names</div><ul class="file_uploaded_list file_uploaded_inputs">`;
                    for (var i = 0; i < filesArr.length; i++) {
                        selectedFiles += `<li><input class="form-control" data-file="${filesArr[i]}" placeholder="Enter file name here" type="text" value="${namesArr[i]}"/>`
                        selectedFiles += '<a href="/' + careplanUploadedPath + filesArr[i] + '" target="_blank">' + namesArr[i] + '</a><span onclick="removeUpload(this)" class="removeUploadFile"><i class="fa fa-times"></i></span></li>';
                    }
                    selectedFiles += "</ul>";                   
                } else {
                    selectedFiles = `<ul class="file_uploaded_list onlylinkslist">`; 
                    var ext = "";
                    for (var i = 0; i < filesArr.length; i++) {
                         ext = filesArr[i].split('.').pop();
                        switch (ext) {
                            case "png":
                            case "jpg":
                            case "jpeg":                                
                                selectedFiles += '<li><img  src="/' + careplanUploadedPath + filesArr[i] + '" alt="Care Plan Upload"><span><a href="/' + careplanUploadedPath + filesArr[i] + '" target="_blank">' + namesArr[i] + '</a></span></li>';
                                break;
                            default:
                                selectedFiles += '<li><a href="/' + careplanUploadedPath + filesArr[i] + '" target="_blank">' + namesArr[i] + '</a></li>';
                                break;
                        }
                        
                    }
                    selectedFiles += `</ul>`;                   
                }
                $("#" + Id).next().next().html("").append(selectedFiles);         
            }
        }, error: function (e) {
            toastr.error("Unidentified error");
            $(".loaderOverlay").hide();
        }
    });
}
function getBaseFilesReadonly(Id) {
    $.ajax({
        type: "GET",
        url: Apipath + '/api/PatientMain/getbasefilesbypatientid?PatientId=' + PatientId + '&controlid=' + Id,
        contentType: 'application/json; charset=UTF-8',
        dataType: "json",
        async: false,
        success: function (result) {
            if (result != "" && result != null) {
                var filesArr = result.Files.split(',');
                var namesArr = result.FileNames.split(',');
                var selectedFiles = `<ul class="file_uploaded_list onlylinkslist">`;
                var ext = "";
                for (var i = 0; i < filesArr.length; i++) {
                     ext = filesArr[i].split('.').pop();
                    switch (ext) {
                        case "png":
                        case "jpg":
                        case "jpeg":
                            selectedFiles += '<li><img  src="/' + careplanUploadedPath + filesArr[i] + '" alt="Care Plan Upload"><span><a href="/' + careplanUploadedPath + filesArr[i] + '" target="_blank">' + namesArr[i] + '</a></span></li>';
                            break;
                         default:
                            selectedFiles += '<li><a href="/' + careplanUploadedPath + filesArr[i] + '" target="_blank">' + namesArr[i] + '</a></li>';
                            break;
                    }
                    
                }
                selectedFiles += `</ul>`;
                $("#" + Id).next().next().html("").append(selectedFiles);           
            }
        }, error: function (e) {
            toastr.error("Unidentified error");
            $(".loaderOverlay").hide();
        }
    });
}
function getBaseFiles(Id) {
    $.ajax({
        type: "GET",
        url: Apipath + '/api/PatientMain/getbasefilesbypatientid?PatientId=' + PatientId + '&controlid=' + Id,
        contentType: 'application/json; charset=UTF-8',
        dataType: "json",
        async: false,
        success: function (result) {
            if (result != "" && result != null) {
                var filesArr = result.Files.split(',');
                var namesArr = result.FileNames.split(',');
                var selectedFiles = `<div class="label">File Names</div><ul class="file_uploaded_list file_uploaded_inputs">`;
                for (var i = 0; i < filesArr.length; i++) {
                    selectedFiles += `<li><input class="form-control" data-file="${filesArr[i]}" placeholder="Enter file name here" type="text" value="${namesArr[i]}"/>`
                    selectedFiles += '<a href="/' + careplanUploadedPath + filesArr[i] + '" target="_blank">' + namesArr[i] + '</a><span onclick="removeUpload(this)" class="removeUploadFile"><i class="fa fa-times"></i></span></li>';
                }
                selectedFiles += "</ul>";
                $("#" + Id).next().next().html("").append(selectedFiles);
            } else {
                $("#" + Id).next().next().html("");
            }
        },
        error: function () {
            toastr.error("Unidentified error");
            $(".loaderOverlay").hide();
        }
    });
}
function saveBasicInfoAsDraft(status) {
    if ($(".render-basicform").find("input[type='file']").length) {
        $(".render-basicform").find("input[type='file']").each(function (index, item) {
            if ($(item).hasAttr("data-column")) {
                if ($(item).hasClass("program-control") || $(item).hasClass("base-control")) {
                    var res = validateFiles($(item).attr("id"));
                    if (res == false) {
                        return false;
                    }
                }
            }
        });
    }
    if ($(".render-basicform").find("input.invaild-input").length) {
        return false;
    }
    var fieldmodel = [];    
    fieldmodel.push({ ColumnName: "PatientID", FieldValue: PatientId });
    fieldmodel.push({ ColumnName: "TemplateID", FieldValue: templateid });
    fieldmodel.push({ ColumnName: "Careplanid", FieldValue: careplanid });
    if (!isupdateProgramFields) {
        fieldmodel.push({ ColumnName: "CreatedBy", FieldValue: userId });
        fieldmodel.push({ ColumnName: "CreatedDate", FieldValue: getActualFullDate() });
    }
    fieldmodel.push({ ColumnName: "ModifiedBy", FieldValue: userId });
    fieldmodel.push({ ColumnName: "ModifiedDate", FieldValue: getActualFullDate() });
    if ($(".render-basicform").find(".base-control").length) {
        fieldmodel.push({ ColumnName: "BaseTemplateID", FieldValue: basetemplateid });
    }
    $(".render-basicform [type=text],[type=number],[type=file],[type=date]").each(function (index, item) {
        if ($(item).hasAttr("data-column") && $(item).val() != "" && $(item).hasClass("program-control")) {
            fieldmodel.push({ ColumnName: $(item).attr("data-column"), FieldValue: $(item).val() });
        }
    });
    $(".render-basicform select").each(function (index, item) {
        if ($(item).hasAttr("data-column") && $(item).val() != "" && $(item).hasClass("program-control")) {
            fieldmodel.push({ ColumnName: $(item).attr("data-column"), FieldValue: $(item).val() });
        }
    });
    $(".render-basicform [type=checkbox],.render-basicform [type=radio]").each(function (index, item) {
        if ($(item).hasAttr("data-column") && $(item).closest("div.inputContent").find("input:checked").length && $(item).closest(".form-group").hasClass("program-control")) {
            var selectedValues = $.map($(item).closest("div.inputContent").find("input:checked"), function (n, i) {
                return n.value;
            }).join(',');
            fieldmodel.push({ ColumnName: $(item).attr("data-column"), FieldValue: selectedValues });
        }
    });

    $(".render-basicform textarea").each(function (index, item) {
        if ($(item).hasAttr("data-column") && $(item).val() != "" && $(item).hasClass("program-control")) {
            fieldmodel.push({ ColumnName: $(item).attr("data-column"), FieldValue: $(item).val() });
        }
    });   
    
    var model = {
        ID: isupdateProgramFields ? careplanid : 0,
        TableName: tableName,
        carePlanCols: fieldmodel,
    }
    $(".loaderOverlay").show();
    $.ajax({
        type: "POST",
        url: Apipath + '/api/PatientMain/savecareplanbasicinfo',
        contentType: 'application/json; charset=UTF-8',
        data: JSON.stringify(model),
        dataType: "json",
        success: function (res) {
            if ($(".render-basicform").find(".base-control").length) {
                saveBaseFieldInfo();
            }           
            updateCareplanStatus(status); //update Careplan status          
            toastr.success("Saved as draft successfully");
            $(".loaderOverlay").hide();          
            if (intervalStatus != "") {
                clearInterval(intervalStatus);
            }
            if ($(".render-basicform").find("input[type='file']").length) {
                $(".render-basicform").find("input[type='file']").each(function (index, item) {
                    if ($(item).hasAttr("data-column")) {
                    if ($(item).hasClass("program-control") || $(item).hasClass("base-control")) {

                            switch (index) {
                                case 0:
                                    uploadFiles($(item).attr("id"), fileData1);
                                    break;
                                case 1:
                                    uploadFiles($(item).attr("id"), fileData2);
                                    break;
                                case 2:
                                    uploadFiles($(item).attr("id"), fileData3);
                                    break;
                                case 3:
                                    uploadFiles($(item).attr("id"), fileData4);
                                    break;
                                case 4:
                                    uploadFiles($(item).attr("id"), fileData5);
                                    break;
                                case 5:
                                    uploadFiles($(item).attr("id"), fileData6);
                                    break;
                                case 6:
                                    uploadFiles($(item).attr("id"), fileData7);
                                    break;
                                case 7:
                                    uploadFiles($(item).attr("id"), fileData8);
                                    break;
                                case 8:
                                    uploadFiles($(item).attr("id"), fileData9);
                                    break;
                                case 9:
                                    uploadFiles($(item).attr("id"), fileData10);
                                    break;
                            }
                        }
                }
                });
            }
            isupdateProgramFields = true;
            clearFileData();
            getSavedFilesAsDraft();          
        }, error: function (e) {
            toastr.error("Unidentified error");
            $(".loaderOverlay").hide();
        }
    });
}
function getDatabaseFieldValues() {
    if ($(".render-basicform  label.database-field").length) {
        GetDropDownName();
        $.ajax({
            type: "GET",
            url: Apipath + '/api/PatientMain/getclientformvalues?clientId=' + PatientId,
            contentType: 'application/json; charset=UTF-8',
            dataType: "json",
            async: false,
            success: function (result) {
                var keyValue;
                var formName = ''
                var key = ''
                var controlId=''
                var datatype = ''
                var priorityList=''

                $(".render-basicform  label.database-field").each(function (index, item) {
                    key = $(item).attr("id").substring(0, $(this).attr("id").lastIndexOf("_"));
                    
                    formName = $(item).attr("data-index");
                    keyValue = result.filter(c => c.FormName == formName && c.Field == key)[0].FieldValue;
                    datatype = $(item).attr("data-columnType");
                    
                    if (datatype == 'Priority') {
                        priorityList = `<ul>`;
                        var listValues = keyValue.split(',');
                        for (let i = 0; i < listValues.length; i++) {
                            priorityList += `<li>${listValues[i]}</li>`

                        }
                        priorityList += `</ul>`
                        $(item).html("").append(priorityList);
                    }
                    else if (datatype != 'file' || datatype==undefined) {

                        if (formName == 'PatientMain') {
                            switch (key) {
                                case "QuitSmoking":
                                case "EverBeenSmoker":
                                case "EverMemberOfUSArmedForces":
                                case "IsPermanentAddress":
                                    if (keyValue != null) {
                                        if (keyValue) {
                                            keyValue = "Yes";
                                        } else {
                                            keyValue = "No"
                                        }
                                    }
                                    break;
                                case "LanguagesSpeak":
                                    if (keyValue != null) {
                                        keyValue = keyValue == "" ? "Other" : keyValue
                                    }
                                    break;
                            }

                        }
                        $(item).html("").append(keyValue);
                    } else if (datatype == 'file') {
                        controlId = $(item).attr("data-controlId");
                        getClientFormCareplanFiles(controlId, $(item))
                    }
                    

                });

            }, error: function () {
                toastr.error("Unidentified error");
                $(".loaderOverlay").hide();
            }
        });
    }
}


function getClientFormCareplanFiles(Id,item) {
    
    $.ajax({
        type: "GET",
        url: Apipath + '/api/PatientMain/getclientfilesbyclientId?controlid=' + Id + '&patientid=' + _patientID,
        contentType: 'application/json; charset=UTF-8',
        dataType: "json",
        async: false,
        success: function (result) {
            
            if (result != "" && result != null) {
                var filesArr = result.Files.split(',');
                var namesArr = result.FileNames.split(',');
                var selectedFiles = "";
                selectedFiles = `<ul class="file_uploaded_list onlylinkslist">`;
                var ext = "";
                for (var i = 0; i < filesArr.length; i++) {
                    ext = filesArr[i].split('.').pop();
                    ext = ext.toLocaleLowerCase()
                    switch (ext) {
                        case "png":
                        case "jpg":
                        case "jpeg":
                            selectedFiles += '<li><img style="max-width: 90px;margin-right: 10px;" src="/' + programUploadedPath + filesArr[i] + '" alt="Program Upload"><span><a href="/' + programUploadedPath + filesArr[i] + '" target="_blank">' + namesArr[i] + '</a></span></li>';
                            break;
                        default:
                            selectedFiles += '<li><a href="/' + programUploadedPath + filesArr[i] + '" target="_blank">' + namesArr[i] + '</a></li>';
                            break;
                    }

                }
                selectedFiles += `</ul>`;
                item.html("").append(selectedFiles);
            }
        }, error: function (e) {
            toastr.error("Something happen Wrong");
            $(".loaderOverlay").hide();
        }
    });
}
function GetDropDownName() {
    $.ajax({
        type: "GET",
        url: Apipath + '/api/PatientMain/GetLookUpFieldOption',
        contentType: 'application/json; charset=UTF-8',
        dataType: "json",
        async: false,
        success: function (result) {
            ItemNames = result;
            
        },
        error: function () {
            toastr.error("Unidentified error");
            $(".loaderOverlay").hide();
        }
    });
}
function removeUpload(obj) {
    $.confirm({
        icon: 'fas fa-exclamation-triangle',
        title: 'Confirm',
        content: 'Are you sure to delete this attachment ?',
        type: 'red',
        typeAnimated: true,
        buttons: {
            yes: {
                btnClass: 'btn-danger',
                action: function () {                
                    var inputId = $(obj).parent().parent().parent().prev().prev('input[type="file"]').attr("id");
                    if ($(".render-basicform").find("input[type='file']").length && $(obj).hasAttr("data-remove")) {
                        $(".render-basicform").find("input[type='file']").each(function (index, item) {
                            if ($(item).hasAttr("data-column")) {
                                if ($(item).hasClass("program-control") || $(item).hasClass("base-control")) {
                                    if ($(item).attr("id") == inputId) {
                                        switch (index) {
                                            case 0:
                                                fileData1.delete($(obj).attr("data-remove"));;
                                                break;
                                            case 1:
                                                fileData2.delete($(obj).attr("data-remove"));
                                                break;
                                            case 2:
                                                fileData3.delete($(obj).attr("data-remove"));
                                                break;
                                            case 3:
                                                fileData4.delete($(obj).attr("data-remove"));
                                                break;
                                            case 4:
                                                fileData5.delete($(obj).attr("data-remove"));
                                                break;
                                            case 5:
                                                fileData6.delete($(obj).attr("data-remove"));
                                                break;
                                            case 6:
                                                fileData7.delete($(obj).attr("data-remove"));
                                                break;
                                            case 7:
                                                fileData8.delete($(obj).attr("data-remove"));
                                                break;
                                            case 8:
                                                fileData9.delete($(obj).attr("data-remove"));
                                                break;
                                            case 9:
                                                fileData10.delete($(obj).attr("data-remove"));
                                                break;
                                        }

                                    }
                                }
                            }
                            });
                    }                   
                    if ($(obj).parent().parent().find("li").length == 1) {
                        $(obj).parent().parent().parent().prev().prev('input[type="file"]').val('');
                        $(obj).parent().parent().parent().html("");
                    } else {                        
                        $(obj).closest("li").remove();
                    }                  
                }
            },
            no: {
                
            }
        },

    });
    
}
function validateFiles(Id) { 
    $("#" + Id).next().next().find("input").each(function (index, item) {
        if ($(item).val().trim() == "") {
            $(item).addClass("invaild-input");
        } else {
            $(item).removeClass("invaild-input");
        }
    });
    if ($("#" + Id).next().next().find("input.invaild-input").length) {
        toastr.error("File name field is required");
        return false;
    }
}
function clearFileData() {
    fileData1 = new FormData();
    fileData2 = new FormData();
    fileData3 = new FormData();
    fileData4 = new FormData();
    fileData5 = new FormData();
    fileData6 = new FormData();
    fileData7 = new FormData();
    fileData8 = new FormData();
    fileData9 = new FormData();
    fileData10 = new FormData();
}
function getBasehtmlByCarePlanId(careid) {
    $.ajax({
        type: "GET",
        url: Apipath + '/api/PatientMain/getbasetemplateidbycareplanid?Careplanid=' + careid,
        contentType: 'application/json; charset=UTF-8',
        dataType: "json",
        async: false,
        success: function (result) {
            switch (result) {
                case 0:
                    break;
                default:
                    basetemplateid = result;
                    $.ajax({
                        type: "GET",
                        url: '/careplan/GetCarePlanTemplateById?TemplateId=' + result,
                        contentType: 'application/json; charset=UTF-8',
                        dataType: "json",
                        async: false,
                        success: function (result) {
                            if (result.html != "") {
                                var baseHtml = parseHTML(result.html);
                                var baseHeader = $(baseHtml).find(".baseheader").html();
                                var baseFooter = $(baseHtml).find(".basefooter").html();
                                $(".render-basicform").find(".baseheader").html("").append(baseHeader);
                                $(".render-basicform").find(".basefooter").html("").append(baseFooter);
                            }
                        },
                        error: function (e) {
                            toastr.error("Unidentified error");
                            $(".loaderOverlay").hide();
                        }
                    });
                    break;
            }
        },
        error: function (e) {
            toastr.error("Unidentified error");
            $(".loaderOverlay").hide();
        }
    });
}
function getSavedFilesAsDraft() {
    $(".render-basicform").find("input.program-control,input.base-control").each(function (index, item) {
        if ($(item).is("input")) {
            switch ($(item).attr("type")) {
                case "file":
                    if ($(item).hasClass("base-control") && $(item).hasAttr("data-column")) {
                        getBaseFiles($(item).attr("id"));
                    } else if ($(item).hasClass("program-control") && $(item).hasAttr("data-column")) {
                        getProgramFiles(careplanid, $(item).attr("id"))
                    }
                    break;
            }
        }
    });
}
function updateCarePlanName(obj) {
    if ($(obj).val().trim() == "") {
        toastr.error("Careplan name is required");
        return;
    }
    var model = {
        CarePlanName: $(obj).val(),
        CarePlanId: careplanid,
        PatientId: PatientId
    }
    $.ajax({
        type: "POST",
        url: Apipath + '/api/PatientMain/updatecareplanname',
        contentType: 'application/json; charset=UTF-8',
        data: JSON.stringify(model),
        dataType: "json",
        success: function (res) {
            switch (res) {
                case -1:
                    toastr.error("Careplan name alreday exist");
                    $(".loaderOverlay").hide();
                    break;
                default:
                    toastr.success("Changes saved successfully");
                    $(".loaderOverlay").hide();
                    break;
            }
        },
        error: function (e) {
            toastr.error("Unidentified error");
            $(".loaderOverlay").hide();
        }
    });
}
function setCarePlanActiveTab(tab) {
    $('#addNewCarePlansSidebar .nav-tabs li a').removeClass('active show');
    $('#addNewCarePlansSidebar .tab-content .tab-pane').removeClass('active show');
    $('#addNewCarePlansSidebar a[href="#' + tab + '"]').addClass('active show');
    $('#addNewCarePlansSidebar #' + tab).addClass('active show');
}
function setCarePlanStatus(obj) {
    if (!CanEditCarePlan()) {
        $("#ddlcareplanstatus").val(prevSelectedCarePlan);
        return
    }

    if ($(obj).val() == "-1") {
        return;
    }
    var model = {
        CarePlanId: careplanid,
        Status: $(obj).val(),
        ModifiedBy: userId
    };
    if (model.Status == 4) {
        checkCarePlanStatus();
        if (!isCarePlanNeedCompleted) {
            toastr.error("Can not complete care plan, their are incomplete needs. Please complete all needs to complete care plan.");
            $("#ddlcareplanstatus").val(prevSelectedCarePlan);
            return;
        }
    }



    

    if (model.Status == "4") {
        checkCarePlanStatus();
        if (isCarePlanNeedCompleted) {
            var prevStatusValue = prevSelectedCarePlan;
            $.confirm({
                icon: 'fas fa-exclamation-triangle',
                title: 'Confirm',
                content: 'Once care plan completed can not be edited or restart again, press ok to continue',
                type: 'green',
                typeAnimated: true,
                buttons: {
                    ok: {
                        btnClass: 'btn-green',
                        action: function () {
                            $.ajax({
                                type: "POST",
                                url: Apipath + '/api/PatientMain/updatecareplanstatus',
                                contentType: 'application/json; charset=UTF-8',
                                data: JSON.stringify(model),
                                dataType: "json",
                                success: function (res) {
                                    
                                    if (res.status == 1) {
                                        prevSelectedCarePlan = model.Status;
                                        toastr.success("Changes saved successfully");
                                        $("#ddlcareplanstatus,.care_plan_name_field").attr("disabled", true);
                                        $(".needGoalHover").addClass("disableHoverItem");
                                        $(".status_labels_div").find("span:last").addClass("disableHoverItem");
                                        $("a.dragIcon").css("display", "none");
                                        $(".txtNeed,.txtOutcome,.txtIntervention").attr("disabled", true);
                                        $(".needsList").sortable('destroy');
                                        $(".goalsList").sortable('destroy');
                                        $('.requestItem').addClass('d-none');
                                    }
                                    else {
                                        if (model.Status == 1) {
                                            toastr.error("Status cant be changed to Not Started");

                                        }
                                        else if (model.Status == 3) {
                                            toastr.error("Status cant be changed to In-Progress");
                                        }
                                        else if (model.Status == 4) {
                                            toastr.error("Status cant be changed to Completed");
                                        }

                                        $("#ddlcareplanstatus").val(prevStatusValue);
                                    }
                                    prevSelectedCarePlan = prevStatusValue;
                                },
                                error: function (e) {
                                    toastr.error("Unidentified error");
                                    $(".loaderOverlay").hide();
                                    prevSelectedCarePlan = prevStatusValue;
                                }
                            });
                        }

                    },
                    cancel: {
                        action: function () {
                            $("#ddlcareplanstatus").val(prevSelectedCarePlan);
                        }
                    }
                }
            });
        } else {
            $("#ddlcareplanstatus").val(prevSelectedCarePlan);
            toastr.error("Can not complete care plan, their are incomplete needs. Please complete all needs to complete care plan.");
        }
    } else {
        $.ajax({
            type: "POST",
            url: Apipath + '/api/PatientMain/updatecareplanstatus',
            contentType: 'application/json; charset=UTF-8',
            data: JSON.stringify(model),
            dataType: "json",
            success: function (res) {
                if (res.status == 1) {
                    prevSelectedCarePlan = model.Status;
                    toastr.success("Changes saved successfully");
                }
                else {
                    if (model.Status == 1) {
                        toastr.error("Status cant be changed to Not Started");

                    }
                    else if (model.Status == 3) {
                        toastr.error("Status cant be changed to In-Progress");
                    }
                    else if (model.Status == 4) {
                        toastr.error("Status cant be changed to Completed");
                    }

                    $("#ddlcareplanstatus").val(prevSelectedCarePlan);
                }

            },
            error: function (e) {
                toastr.error("Unidentified error");
                $(".loaderOverlay").hide();
            }
        });
    }
}

    function checkCarePlanStatus() {
        $.ajax({
            type: "GET",
            url: Apipath + '/api/PatientMain/checkcareplanstatus?Careplanid=' + careplanid,
            contentType: 'application/json; charset=UTF-8',
            dataType: "json",
            async: false,
            success: function (result) {
                isCarePlanNeedCompleted = result > 0 ? true : false;
            }, error: function () {
                toastr.error("Unidentified error");
                $(".loaderOverlay").hide();
            }
        });
    }
    function deleteCarePlan(obj) {
        var id = $(obj).closest("tr").attr("data-careplan")
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
                        $.ajax({
                            type: "POST",
                            url: Apipath + '/api/PatientMain/removecareplan',
                            data: JSON.stringify({
                                CarePlanId: id,
                                ModifiedBy: userId
                            }),
                            contentType: 'application/json; charset=UTF-8',
                            dataType: "json",
                            success: function (result) {
                                switch (result) {
                                    case 0:
                                        toastr.error("Careplan has been submitted  can not be deleted");
                                        break;
                                    default:
                                        $(obj).closest("tr").remove();
                                        var value = $('.careplanCount').attr('data-count');
                                        if (value != '') {
                                            value = parseInt(value)
                                            value--;
                                        }
                                        $('span.careplanCount').attr('data-count', value);
                                        $('span.careplanCount').html("")
                                        if (value> 0) {
                                            $('span.careplanCount').append('(' + value + ')');
                                        }
                                       
                                        toastr.success("Changes saved successfully");
                                        break;
                                }
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
    }

    function showBasicInfo() {
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
                            $("a.basic-nav").tab('show');
                        }
                    }
                },

            });
        } else {
            $("a.basic-nav").tab('show');
        }
    }


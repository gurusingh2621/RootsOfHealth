var tableName = "";
var careplanid = "0";
var templateid = "";
var intervalStatus = "";
var isupdateBaseField = false;
var isupdateProgramFields = false;
$(document).ready(function () {
    $("a[data-toggle='carePlansSidebar']").click(function () {
        $('#carePlansSidebar').addClass('opened');
    });
    $("a[data-toggle='addNewCarePlansSidebar']").click(function () {
        $('#addNewCarePlansSidebar').addClass('opened');
    });
    $(".close_right_sidebar").click(function () {
        $(this).parents('.right_sidebar').removeClass('opened');
    }); 
    getCarePlanList();
    checkbasefieldbypatientid();
});
function getCareProgramOptions() {
    $.ajax({
        type: "GET",
        url: Apipath + '/api/PatientMain/getprogramoptions?patientid=' + PatientId,
        contentType: 'application/json; charset=UTF-8',
        dataType: "json",
        async: false,
        success: function (result) {
            isupdateBaseField = parseInt(result.BasePatientCount) != 0 ? true : false;
            if (result.ProgramOptions.length) {             
                $(".createtemplate").show();
                $(".notemplate").hide();
                $(".btnCareplanProceed").show();
                $("#ddlProgram").html("");
                for (var i = 0; i < result.ProgramOptions.length; i++) {
                    $("#ddlProgram").append($("<option></option>").val(result.ProgramOptions[i].ProgramsID).html(result.ProgramOptions[i].ProgramsName));
                }
            } else {
                $(".notemplate").show();
                $(".createtemplate").hide();
                $(".btnCareplanProceed").hide();
            }
            $('#AddCarePlanModal').modal({ backdrop: 'static', keyboard: false })  
        },
    });
}
function getCarePlanList() {
    $.ajax({
        type: "GET",
        url: Apipath + '/api/PatientMain/getcareplanlist?patientid=' + PatientId,
        contentType: 'application/json; charset=UTF-8',
        dataType: "json",
        success: function (result) {
            if (intervalStatus != "") {
                clearInterval(intervalStatus);
            }
            $("span.careplanCount").html("").append(result.length);
            if (result.length) {
                var careplanList = "";
                for (var i = 0; i < result.length; i++) {
                    careplanList += `<tr onclick="editCarePlan(${result[i].CarePlanId})">
                                     <td>${result[i].CarePlanName}</td>
                                     <td>${result[i].ProgramsName}</td>
                                      <td class="text-center">`;
                    switch (result[i].status) {
                        case 0:
                            //not started
                            careplanList += `<span class="status_value notStarted">Not Started</span>`;
                            break;
                        case 1:
                            //In Progress
                            careplanList += `<span class="status_value inProgress">In Progress</span>`;
                            break;
                        case 2:
                            //Saved As Draft
                            careplanList += `<span class="status_value asDraft">Saved As Draft</span>`;
                            break;
                        case 3:
                            //Completed
                            careplanList += `<span class="status_value completed">completed</span>`;
                            break;
                    }
                    careplanList += `<td class="text-right">${result[i].CreatedDate.split("T")[0]}</td>`;
                    careplanList += `<td class="text-right">${result[i].ModifiedDate.split("T")[0]}</td>`;
                }
                $(".careplanlist tbody").html("").append(careplanList);

            } else {
                $(".careplanlist tbody").html("").append('<tr><td colspan="5" class="text-center">No careplan found.</td></tr>');
            }
        },
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
                })
                $('.render-basicform textarea').bind('copy paste cut', function (e) {
                    e.preventDefault();
                });
                $('.render-basicform textarea').keypress(function (e) {
                    var regex = new RegExp("^[a-zA-Z0-9]+$");
                    var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
                    if (regex.test(str)) {
                        return true;
                    }
                    e.preventDefault();
                    return false;
                });                            
                toogleToolTip();               
                $("textarea.program-control").summernote({
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
        }
    });
}
function saveBasicInfo(status) {
    var fieldmodel = [];  
    var isvalid = true;
    $(".render-basicform").find("input.form-control,input.custom-control-input,select.form-control,textarea.form-control").each(function (index, item) {
        if ($(item).is("input") && $(item).hasAttr("data-column")) {
            switch ($(item).attr("type")) {
                case "radio":
                case "checkbox":
                    if ($(item).closest(".inputContent").prev().hasClass("required-asterisk") && $(item).closest("div.inputContent").find("input:checked").length==0) {
                          isvalid = false;
                          }
                    break;
                default:
                    if ($(item).closest(".inputContent").prev().hasClass("required-asterisk") && $(item).val().trim()=="") {
                        isvalid = false;
                    }
                    break;

            }
        }
        if ($(item).is("select") && $(item).hasAttr("data-column") && $(item).val().trim() == "" && $(item).val() == "0") {
            if ($(item).closest(".inputContent").prev().hasClass("required-asterisk")) {
                isvalid = false;
            }
        }
        if ($(item).is("textarea") && $(item).hasAttr("data-column") && $(item).val().trim() == "") {
            if ($(item).closest(".inputContent").prev().hasClass("required-asterisk")) {
                isvalid = false;
            }
        }

    });
    if (!isvalid) {
        toastr.error("Field marked with asterisk(*) are mandatory");
        return;
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
        fieldmodel.push({ ColumnName: "BaseTemplateID", FieldValue: $("#hdnbasetempid").val() });
    }
    $(".render-basicform [type=text],[type=number],[type=file],[type=date]").each(function (index, item) {
        if ($(item).hasAttr("data-column") && $(item).val() != "" && !$(item).hasClass("base-control")) {
            fieldmodel.push({ ColumnName: $(item).attr("data-column"), FieldValue: $(item).val() });
        }
    });
    $(".render-basicform select").each(function (index, item) {
        if ($(item).hasAttr("data-column") && $(item).val() != "" && !$(item).hasClass("base-control")) {
            fieldmodel.push({ ColumnName: $(item).attr("data-column"), FieldValue: $(item).val() });
        }
    });
    $(".render-basicform [type=checkbox],.render-basicform [type=radio]").each(function (index, item) {
        if ($(item).hasAttr("data-column") && $(item).closest("div.inputContent").find("input:checked").length && !$(item).closest(".form-group").hasClass("base-control")) {
            fieldmodel.push({ ColumnName: $(item).attr("data-column"), FieldValue: $(item).closest("div.inputContent").find("input:checked").val() });
        }
    });

    $(".render-basicform textarea").each(function (index, item) {
        if ($(item).hasAttr("data-column") && $(item).val() != "" && !$(item).hasClass("base-control")) {
            fieldmodel.push({ColumnName: $(item).attr("data-column"), FieldValue: $(item).val() });
        }
    });
    if (fieldmodel.length < 8) return;
    if ($(".render-basicform").find("input[type='file']").length) {
        $(".render-basicform").find("input[type='file']").each(function (index, item) {
            if ($(item).hasClass("program-control") || $(item).hasClass("base-control")) {
                uploadFiles($(item).attr("id"));
            }
        });
    }
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
            //update Careplan status
            updateCareplanStatus(status);           
            $("#carePlanName").val("");
            
            toastr.success("Saved successfully");
            $(".loaderOverlay").hide();
            $(".basic-info-actions").hide();
            if (intervalStatus != "") {
                clearInterval(intervalStatus);
            }
            makeBasicInfoReadonly();
            //window.location.href = '/careplan/modifytemplate?TemplateId=' + result.id + '&ProgramId=' + programId + '&Template=' + result.TemplateName;
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
        Status: 0,//not started
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
                    return;
                    break;
                default:
                    careplanid = res;
                    $("#addNewCarePlansSidebar").find("h3").first().html("").append($("#carePlanName").val());
                    proceedCarePlan();
                    intervalStatus = setInterval(saveBasicInfoAsDraft, 300000, 2);
                    $(".loaderOverlay").hide();
                    break;
            }                  
        },
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
                        }
                    });
                    break;
            }
        }
    });
}
function parseHTML(htmlstr) {
    var t = document.createElement('template');
    t.innerHTML = htmlstr;
    return t.content.cloneNode(true);
}
function saveBaseFieldInfo() {
    var fieldmodel = [];
    fieldmodel.push({ ColumnName: "PatientID", FieldValue: PatientId });
    fieldmodel.push({ ColumnName: "TemplateID", FieldValue: templateid });
    fieldmodel.push({ ColumnName: "BaseTemplateID", FieldValue: $("#hdnbasetempid").val() });
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
            fieldmodel.push({ ColumnName: $(item).attr("data-column"), FieldValue: $(item).closest("div.inputContent").find("input:checked").val() });
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
    console.log(model);
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
        success: function (res) {
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
            debugger;
            if (result.length) {
                var baseFields = result[0];                
                $(".render-basicform").find(".form-control.base-control,input.custom-control-input").each(function (index, item) {
                    debugger;
                    if ($(item).is("input")) {
                        switch ($(item).attr("type")) {
                            case "radio":
                            case "checkbox":
                                if ($(item).closest("div.form-group").hasClass("base-control")) {
                                    var value = baseFields[$(item).attr("data-column")];
                                    $(item).closest("div.form-group").find(`input[value=${value}]`).prop("checked", true);
                                }
                                break;
                            case "file":
                                    getUploadedFile(careplanid, $(item).attr("id"));                               
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
                                        debugger;
                                        value = baseFields[$(item).attr("data-column")];
                                        if (isupdateProgramFields) {
                                            $(item).closest("div.inputContent").find(`input[value=${value}]`).prop("checked", true);
                                        } else {
                                            value = $(item).closest("div.inputContent").find(`input[value=${value}]`).next().text();
                                            $(item).closest("div.inputContent").parent().next().html("").append(value).show();
                                            $(item).closest("div.inputContent").hide();
                                        }
                                    }
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
                            $(item).parent().find("label.label-program").html("").append(value).show();
                            $(item).next().hide();
                        }
                    }                    
                });
            }
        }
    });
}
function editCarePlan(Id) {
    $(".loaderOverlay").show();
    $.ajax({
        type: "GET",
        url: Apipath + '/api/PatientMain/getcareplanbyid?Careplanid=' + Id,
        contentType: 'application/json; charset=UTF-8',
        dataType: "json",       
        success: function (result) {
            $("#addNewCarePlansSidebar").find("h3").first().html("").append(result.CarePlanName);
            isupdateProgramFields = false;
           // $(".render-basicform").removeClass("disable");
            switch (result.Status) {
                case 0://not started                    
                    careplanid = result.CarePlanId;                   
                    proceedCarePlan(result.ProgramID);
                    intervalStatus = setInterval(saveBasicInfoAsDraft,300000,2);
                    break;
                case 1://in-progress
                    getBasicInfoTemplateById(result.TemplateID);
                    getBasicInfoByCareplanId(result.CarePlanId, result.TemplateID);
                    $(".basic-info-actions").hide();
                    //disableControl();
                    //$(".render-basicform").addClass("disable");
                    $("#carePlansSidebar").removeClass('opened');
                    $("#addNewCarePlansSidebar").addClass('opened');
                    break;
                case 2://save as draft
                    careplanid = result.CarePlanId;
                    checkprogramfieldbyid(result.TemplateID, result.CarePlanId);
                    getBasicInfoTemplateById(result.TemplateID);
                    getBasicInfoByCareplanId(result.CarePlanId, result.TemplateID);
                    $(".basic-info-actions").show();                    
                    $("#carePlansSidebar").removeClass('opened');
                    $("#addNewCarePlansSidebar").addClass('opened');
                    break;
                
                default:                 
                    break;
            }
            $(".loaderOverlay").hide();
        }
    });
    
}
function getBasicInfoTemplateById(id) {
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
                //if ($(".render-basicform").find(".basecontentarea").length > 0) {
                //    getBaseFieldData();
                //}
                $(".render-basicform .event-btn-right").remove();
                $(".render-basicform .ck-editor-header").remove();
                $(".render-basicform").find(".question-container").parent().css("border", "none");
                $(".render-basicform").find(".dragresize").find(".question-container").remove();
                $(".render-basicform").find(".dragresize").find(".bootom-form-row").css({ "padding": "7px 0px", "margin": "0" });
                $(".html-content").prev().css("display", "none");
                $(".html-content").parent().parent().parent().addClass("left-control");
                $(".render-basicform .f-g-left").each(function (index, item) {
                    $(item).parent().parent().addClass("left-control");
                })
                $('.render-basicform textarea').bind('copy paste cut', function (e) {
                    e.preventDefault();
                });
                $('.render-basicform textarea').keypress(function (e) {
                    var regex = new RegExp("^[a-zA-Z0-9]+$");
                    var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
                    if (regex.test(str)) {
                        return true;
                    }
                    e.preventDefault();
                    return false;
                });
                toogleToolTip();
                $("textarea.form-control").summernote({
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
        }
    });
    $(".loaderOverlay").hide();
}
function getBasicInfoByCareplanId(careplanid, templateid) {
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
                                if ($(item).hasAttr("data-column")) {
                                    value = fields[$(item).attr("data-column")];
                                    if (isupdateProgramFields) {
                                        $(item).closest("div.inputContent").find(`input[value=${value}]`).prop("checked", true);
                                    } else {
                                        value = $(item).closest("div.inputContent").find(`input[value=${value}]`).next().text();
                                        $(item).closest("div.inputContent").parent().next().html("").append(value).show();
                                        $(item).closest("div.inputContent").hide();
                                    }
                                }
                                break;
                            case "file":
                                if (isupdateProgramFields) {

                                } else {
                                    getUploadedFile(careplanid,$(item).attr("id"));
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
        },
    });
    $(".loaderOverlay").hide();
}
$.fn.hasAttr = function (name) {
    return this.attr(name) !== undefined;
};
function closecarePlan() {
    $.ajax({
        type: "GET",
        url: Apipath + '/api/PatientMain/getcareplanlist?patientid=' + PatientId,
        contentType: 'application/json; charset=UTF-8',
        dataType: "json",
        success: function (result) {
            if (intervalStatus != "") {
                clearInterval(intervalStatus);
            }
            $("span.careplanCount").html("").append(result.length);
            if (result.length) {
                var careplanList = "";
                for (var i = 0; i < result.length; i++) {
                    careplanList += `<tr onclick="editCarePlan(${result[i].CarePlanId})">
                                     <td>${result[i].CarePlanName}</td>
                                     <td>${result[i].ProgramsName}</td>
                                      <td class="text-center">`;
                    switch (result[i].status) {
                        case 0:
                            //not started
                            careplanList += `<span class="status_value notStarted">Not Started</span>`;
                            break;
                        case 1:
                            //In Progress
                            careplanList += `<span class="status_value inProgress">In Progress</span>`;
                            break;
                        case 2:
                            //Saved As Draft
                            careplanList += `<span class="status_value asDraft">Saved As Draft</span>`;
                            break;
                        case 3:
                            //Completed
                            careplanList += `<span class="status_value completed">completed</span>`;
                            break;
                    }
                    careplanList += `<td class="text-right">${result[i].CreatedDate.split("T")[0]}</td>`;
                    careplanList += `<td class="text-right">${result[i].ModifiedDate.split("T")[0]}</td>`;
                }
                $(".careplanlist tbody").html("").append(careplanList);

            } else {
                $(".careplanlist tbody").html("").append('<tr><td colspan="5" class="text-center">No careplan found.</td></tr>');
            }
            $('#addNewCarePlansSidebar').removeClass('opened');
        },
    });
}
function checkbasefieldbypatientid() {
    $.ajax({
        type: "GET",
        url: Apipath + '/api/PatientMain/checkbasefieldbypatientid?patientid=' + PatientId,
        contentType: 'application/json; charset=UTF-8',
        dataType: "json",   
        success: function (result) {
            debugger;
            if (result != 0) {
                isupdateBaseField = true;
            } else {
                isupdateBaseField = false;
            }
        }
    });
}
function checkprogramfieldbyid(tempid,careplanid) {
    $.ajax({
        type: "GET",
        url: Apipath + '/api/PatientMain/checkprogramfieldbycareplanid?templateid=' + tempid + "&careplanid=" + careplanid,
        contentType: 'application/json; charset=UTF-8',
        dataType: "json",
        async: false,
        success: function (result) {
            debugger;
            if (result != 0) {
                isupdateProgramFields = true;
            } else {
                isupdateProgramFields = false;
            }
        }
    });
}
function makeBasicInfoReadonly() {
    var value = "";
    $(".render-basicform").find(".program-control,.base-control").each(function (index, item) {
        if ($(item).is("div")) {
            value = $(item).find("input:checked").next().text();
            $(item).next().html("").append(value).show();
            $(item).find("div.inputContent").hide();
        }
        if ($(item).is("input")) {
            switch ($(item).attr("type")) {
                case "radio":
                case "checkbox":
                   
                    break;
                case "file":
                    $(item).next().next().find("div.label").remove();
                    $(item).next().next().find("input").remove();
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
            $(item).parent().find("label.label-program").html("").append(value).show();
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
        var selectedFiles = `<div class="label">File Names</div><ul class="file_uploaded_list file_uploaded_inputs">`;
        for (var i = 0; i < obj.files.length; i++) {
            var file = URL.createObjectURL(obj.files[i]);
            selectedFiles += `<li><input class="form-control" type="text" value="${obj.files[i].name.split(".").shift()}"/>`
            selectedFiles += '<a href="' + file + '" target="_blank">' + obj.files[i].name + '</a></li>';
        }
        selectedFiles += "</ul>";
        $(obj).next().next().html("").append(selectedFiles);
    } else {
        $(obj).next().next().html("");
    }    
}
function uploadFiles(Id) {
    var files = $("#" + Id).get(0).files;
    var names = [];
    var fileNames = [];
    var fileData = new FormData();
    for (var i = 0; i < files.length; i++) {
        fileData.append("fileInput", files[i]);
        names.push(files[i].name);
    }
    $("#" + Id).next().next().find("input").each(function (index, item) {
        fileNames.push($(item).val());
    });
    fileData.append("CarePlanId", careplanid);
    fileData.append("ControlId", Id);
    fileData.append("Files", names.join(","));
    fileData.append("FileNames", fileNames.join(","));
    $.ajax({
        type: "POST",
        url: "/CarePlan/UploadFiles",
        dataType: "json",
        contentType: false, // Not to set any content header
        processData: false, // Not to process data
        data: fileData,
        async: false,
        success: function (result, status, xhr) {
           
        },
        error: function (xhr, status, error) {
            
        }
    });
}
function getUploadedFile(careid,Id) {
    $.ajax({
        type: "GET",
        url: Apipath + '/api/PatientMain/getfilesbyCareplanid?Careplanid=' + careid +'&controlid='+Id,
        contentType: 'application/json; charset=UTF-8',
        dataType: "json",
        async: false,
        success: function (result) {
            if (result != "") {            
               getPaths(Id,result);            
            }
        }
    });
}
function getPaths(Id, files) {
    $.ajax({
        type: "POST",
        url: "/CarePlan/GetFiles",
        contentType: 'application/json; charset=UTF-8',
        dataType: "json",
        data: JSON.stringify({ files: files }),
        async: false,
        success: function (result) {
            if (result.length) {
                var selectedFiles = `<ul class="file_uploaded_list onlylinkslist">`;
                var name = "";
                for (var i = 0; i < result.length; i++) {                  
                    name = result[i].substring(result[i].lastIndexOf('/') + 1);
                    selectedFiles += '<li><a href="' + result[i] + '" target="_blank">' + name + '</a></li>';
                }
                selectedFiles += `</ul>`;
                $("#" + Id).next().next().html("").append(selectedFiles);
            }
        }
    });

}
function saveBasicInfoAsDraft(status) {
    var fieldmodel = [];
    var isvalid = true;
    $(".render-basicform").find("input.form-control,input.custom-control-input,select.form-control,textarea.form-control").each(function (index, item) {
        if ($(item).is("input") && $(item).hasAttr("data-column")) {
            switch ($(item).attr("type")) {
                case "radio":
                case "checkbox":
                    if ($(item).closest(".inputContent").prev().hasClass("required-asterisk") && $(item).closest("div.inputContent").find("input:checked").length == 0) {
                        isvalid = false;
                    }
                    break;
                default:
                    if ($(item).closest(".inputContent").prev().hasClass("required-asterisk") && $(item).val().trim() == "") {
                        isvalid = false;
                    }
                    break;

            }
        }
        if ($(item).is("select") && $(item).hasAttr("data-column") && $(item).val().trim() == "" && $(item).val() == "0") {
            if ($(item).closest(".inputContent").prev().hasClass("required-asterisk")) {
                isvalid = false;
            }
        }
        if ($(item).is("textarea") && $(item).hasAttr("data-column") && $(item).val().trim() == "") {
            if ($(item).closest(".inputContent").prev().hasClass("required-asterisk")) {
                isvalid = false;
            }
        }

    });
    //if (!isvalid) {
    //    toastr.error("Field marked with asterisk(*) are mandatory");
    //    return;
    //}
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
        fieldmodel.push({ ColumnName: "BaseTemplateID", FieldValue: $("#hdnbasetempid").val() });
    }
    $(".render-basicform [type=text],[type=number],[type=file],[type=date]").each(function (index, item) {
        if ($(item).hasAttr("data-column") && $(item).val() != "" && !$(item).hasClass("base-control")) {
            fieldmodel.push({ ColumnName: $(item).attr("data-column"), FieldValue: $(item).val() });
        }
    });
    $(".render-basicform select").each(function (index, item) {
        if ($(item).hasAttr("data-column") && $(item).val() != "" && !$(item).hasClass("base-control")) {
            fieldmodel.push({ ColumnName: $(item).attr("data-column"), FieldValue: $(item).val() });
        }
    });
    $(".render-basicform [type=checkbox],.render-basicform [type=radio]").each(function (index, item) {
        if ($(item).hasAttr("data-column") && $(item).closest("div.inputContent").find("input:checked").length && !$(item).closest(".form-group").hasClass("base-control")) {
            fieldmodel.push({ ColumnName: $(item).attr("data-column"), FieldValue: $(item).closest("div.inputContent").find("input:checked").val() });
        }
    });

    $(".render-basicform textarea").each(function (index, item) {
        if ($(item).hasAttr("data-column") && $(item).val() != "" && !$(item).hasClass("base-control")) {
            fieldmodel.push({ ColumnName: $(item).attr("data-column"), FieldValue: $(item).val() });
        }
    });
    if (fieldmodel.length < 8) return;
    if ($(".render-basicform").find("input[type='file']").length) {
        $(".render-basicform").find("input[type='file']").each(function (index, item) {
            if ($(item).hasClass("program-control") || $(item).hasClass("base-control")) {
                uploadFiles($(item).attr("id"));
            }
        });
    }
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
            //update Careplan status
            updateCareplanStatus(status);
            $("#carePlanName").val("");

            toastr.success("Saved as draft successfully");
            $(".loaderOverlay").hide();
            $(".basic-info-actions").hide();
            if (intervalStatus != "") {
                clearInterval(intervalStatus);
            }
            makeBasicInfoReadonly();
            //window.location.href = '/careplan/modifytemplate?TemplateId=' + result.id + '&ProgramId=' + programId + '&Template=' + result.TemplateName;
        },
    });
}


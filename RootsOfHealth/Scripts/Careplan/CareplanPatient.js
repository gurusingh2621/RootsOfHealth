var tableName = "";
var careplanid = "0";
var templateid = "";
var intervalStatus = "";
var isupdateBaseField = false;
var isupdateProgramFields = false;
var ItemNames;
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
        error: function (e) {
            toastr.error("Something Happen Wrong");
            $(".loaderOverlay").hide();
        }
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
        error: function (e) {
            toastr.error("Something Happen Wrong");
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
                getDatabaseFieldValues();
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
        }, error: function (e) {
            toastr.error("Something Happen Wrong");
            $(".loaderOverlay").hide();
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
            var selectedValues = $.map($(item).closest("div.inputContent").find("input:checked"), function (n, i) {
                return n.value;
            }).join(',');
            fieldmodel.push({ ColumnName: $(item).attr("data-column"), FieldValue: selectedValues });
        }
    });

    $(".render-basicform textarea").each(function (index, item) {
        if ($(item).hasAttr("data-column") && $(item).val() != "" && !$(item).hasClass("base-control")) {
            fieldmodel.push({ColumnName: $(item).attr("data-column"), FieldValue: $(item).val() });
        }
    });
    //if (fieldmodel.length < 8) return;
    if ($(".render-basicform").find("input[type='file']").length) {
        $(".render-basicform").find("input[type='file']").each(function (index, item) {
            if ($(item).hasClass("program-control") || $(item).hasClass("base-control")) {
                var res = validateFiles($(item).attr("id"));
                if (res == false) {
                    return false;
                }
            }
        });
    }
    if ($(".render-basicform").find("input.invaild-input").length) {
        return false;
    }
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
                            if ($(".render-basicform").find("input[type='file']").length) {
                                $(".render-basicform").find("input[type='file']").each(function (index, item) {
                                    if ($(item).hasClass("program-control") || $(item).hasClass("base-control")) {
                                        uploadFiles($(item).attr("id"));
                                    }
                                });
                            }
                            makeBasicInfoReadonly();
                            //window.location.href = '/careplan/modifytemplate?TemplateId=' + result.id + '&ProgramId=' + programId + '&Template=' + result.TemplateName;
                        },
                        error: function (e) {
                            toastr.error("Something Happen Wrong");
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
        error: function (e) {
            toastr.error("Something Happen Wrong");
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
                            toastr.error("Something Happen Wrong");
                            $(".loaderOverlay").hide();
                        }
                    });
                    break;
            }
        },
        error: function (e) {
            toastr.error("Something Happen Wrong");
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
            toastr.error("Something Happen Wrong");
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
        success: function (res) {
        },
        error: function (e) {
            toastr.error("Something Happen Wrong");
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
                                    if (value == null || value == "") {

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
                                    $.ajax({
                                        type: "GET",
                                        url: Apipath + '/api/PatientMain/getbasefilesbypatientid?PatientId=' + PatientId + '&controlid=' + $(item).attr("id"),
                                        contentType: 'application/json; charset=UTF-8',
                                        dataType: "json",
                                        async: false,
                                        success: function (result) {
                                            if (result != "" && result != null) {
                                                var filesArr = result.Files.split(',');
                                                var namesArr = result.FileNames.split(',');
                                                var selectedFiles = `<div class="label">File Names</div><ul class="file_uploaded_list file_uploaded_inputs">`;
                                                for (var i = 0; i < filesArr.length; i++) {
                                                    selectedFiles += `<li><input class="form-control" placeholder="Enter file name here" type="text" value="${namesArr[i]}"/>`
                                                    selectedFiles += '<a href="/' + careplanUploadedPath + filesArr[i] + '" target="_blank">' + namesArr[i] + '</a><span onclick="removeUpload(this)" class="removeUploadFile"><i class="fa fa-times"></i></span></li>';
                                                }
                                                selectedFiles += "</ul>";
                                                $(item).next().next().html("").append(selectedFiles);
                                            } else {
                                                $(item).next().next().html("");
                                            }
                                        },
                                        error: function () {
                                            toastr.error("Something Happen Wrong");
                                            $(".loaderOverlay").hide();
                                        }
                                    });
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
            toastr.error("Something Happen Wrong");
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
                                        if (value == null || value == "") {
                                            if (isupdateProgramFields) {

                                            } else {
                                                $(item).closest("div.inputContent").parent().next().html("").show();
                                                $(item).closest("div.inputContent").hide();
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
                                                $(item).closest("div.inputContent").parent().next().html("").append(valueTxt).show();
                                                $(item).closest("div.inputContent").hide();
                                            }
                                        }
                                    }
                                }
                                break;
                            case "file":
                                if (isupdateProgramFields) {
                                    if ($(item).hasAttr("data-column") && $(item).hasClass("base-control")) {
                                        $.ajax({
                                            type: "GET",
                                            url: Apipath + '/api/PatientMain/getbasefilesbypatientid?PatientId=' + PatientId + '&controlid=' + $(item).attr("id"),
                                            contentType: 'application/json; charset=UTF-8',
                                            dataType: "json",
                                            async: false,
                                            success: function (result) {
                                                if (result != "") {
                                                    var filesArr = result.Files.split(',');
                                                    var namesArr = result.FileNames.split(',');
                                                    var selectedFiles = `<div class="label">File Names</div><ul class="file_uploaded_list file_uploaded_inputs">`;
                                                    for (var i = 0; i < filesArr.length; i++) {
                                                        selectedFiles += `<li><input class="form-control" placeholder="Enter file name here" type="text" value="${namesArr[i]}"/>`
                                                        selectedFiles += '<a href="/' + careplanUploadedPath + filesArr[i] + '" target="_blank">' + namesArr[i] + '</a><span onclick="removeUpload(this)" class="removeUploadFile"><i class="fa fa-times"></i></span></li>';
                                                    }
                                                    selectedFiles += "</ul>";
                                                    $(item).next().next().html("").append(selectedFiles);
                                                } else {
                                                    $(item).next().next().html("");
                                                }
                                            },
                                            error: function () {
                                                toastr.error("Something Happen Wrong");
                                                $(".loaderOverlay").hide();
                                            }
                                        });
                                    }
                                } else {
                                    getBaseUploadedFile($(item).attr("id"));
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
            toastr.error("Something Happen Wrong");
            $(".loaderOverlay").hide();
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
        }, error: function (e) {
            toastr.error("Something Happen Wrong");
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
                getDatabaseFieldValues();
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
        },
        error: function (e) {
            toastr.error("Something Happen Wrong");
            $(".loaderOverlay").hide();
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
                                if ($(item).hasAttr("data-column") && $(item).closest("div.inputContent").parent().hasClass("program-control")) {                                    
                                    value = fields[$(item).attr("data-column")];
                                    if (value == null || value == "") {
                                        if (isupdateProgramFields) {

                                        } else {
                                            $(item).closest("div.inputContent").parent().next().html("").show();
                                            $(item).closest("div.inputContent").hide();
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
                                            $(item).closest("div.inputContent").parent().next().html("").append(valueTxt).show();
                                            $(item).closest("div.inputContent").hide();
                                        }
                                    }
                                }
                                break;
                            case "file":
                                if (isupdateProgramFields) {
                                    getUploadedFile(careplanid, $(item).attr("id"));
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
        }, error: function (e) {
            toastr.error("Something Happen Wrong");
            $(".loaderOverlay").hide();
        }
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
             tableName = "";
             careplanid = "0";
             templateid = "";
             intervalStatus = "";             
            isupdateProgramFields = false;
            $("#carePlanName").val("");
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
        }, error: function (e) {
            toastr.error("Something Happen Wrong");
            $(".loaderOverlay").hide();
        }
    });
}
function checkbasefieldbypatientid() {
    $.ajax({
        type: "GET",
        url: Apipath + '/api/PatientMain/checkbasefieldbypatientid?patientid=' + PatientId,
        contentType: 'application/json; charset=UTF-8',
        dataType: "json",   
        success: function (result) {
            
            if (result != 0) {
                isupdateBaseField = true;
            } else {
                isupdateBaseField = false;
            }
        }, error: function (e) {
            toastr.error("Something Happen Wrong");
            $(".loaderOverlay").hide();
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
            if (result != 0) {
                isupdateProgramFields = true;
            } else {
                isupdateProgramFields = false;
            }
        }, error: function (e) {
            toastr.error("Something Happen Wrong");
            $(".loaderOverlay").hide();
        }
    });
}
function makeBasicInfoReadonly() {
    var value = "";
    isupdateProgramFields = false;
    $(".render-basicform").find(".program-control,.base-control").each(function (index, item) {    
        if ($(item).is("div")) {
            var selectedValues = $.map($(item).find("input:checked"), function (n, i) {
                return n.value;
            }).join(',');
            if (selectedValues == "") {
                $(item).next().html("").show();
                $(item).find("div.inputContent").hide();
            } else {
                var valueArr = selectedValues.split(',');
                var valueTxt = "";
                for (var i = 0; i < valueArr.length; i++) {
                    valueTxt += $(item).find(`input[value=${valueArr[i]}]`).next().text() + ", ";
                }
                valueTxt = valueTxt.slice(0, -2);
                $(item).next().html("").append(valueTxt).show();
                $(item).find("div.inputContent").hide();
            }
            //value = $(item).find("input:checked").next().text();
            //$(item).next().html("").append(value).show();
            //$(item).find("div.inputContent").hide();
        }
        if ($(item).is("input")) {
            switch ($(item).attr("type")) {
                case "radio":
                case "checkbox":
                   
                    break;
                case "file":
                    //$(item).next().next().find("div.label").remove();
                    //$(item).next().next().find("input").remove();
                    if ($(item).hasClass("base-control") && $(item).hasAttr("data-column")) {
                        getBaseUploadedFile($(item).attr("id"));
                    } else if ($(item).hasClass("program-control") && $(item).hasAttr("data-column")) {
                        getUploadedFile(careplanid, $(item).attr("id"))
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
        var selectedFiles =`<div class="label">File Names</div><ul class="file_uploaded_list file_uploaded_inputs">`;
        var iSize = "";
        var maxSize = $(obj).attr("data-filesize");
        for (var i = 0; i < obj.files.length; i++) {
            iSize = (obj.files[i].size / 1024);
            iSize = (Math.round(iSize * 100) / 100);
            if (iSize > maxSize) {
                toastr.error(obj.files[i].name + " Size is exceeded than " + maxSize + "kb");
                obj.value = "";
                return false;
            } else {                           
                var file = URL.createObjectURL(obj.files[i]);
                selectedFiles += `<li><input class="form-control" placeholder="Enter file name here" type="text" value="${obj.files[i].name.split(".").shift()}"/>`
                selectedFiles += '<a href="' + file + '" target="_blank">' + obj.files[i].name + '</a><span onclick="removeUpload(this)" class="removeUploadFile"><i class="fa fa-times"></i></span></li>';
            }
        }
        selectedFiles += "</ul>";
        $(obj).next().next().html("").append(selectedFiles);       
    } else {
        $(obj).next().next().html("");
    }    
}
function uploadFiles(Id) {
    var files = $("#" + Id).get(0).files;
    if (files.length == 0) {
        return;
    }
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
            return true;
        }, error: function (e) {
            toastr.error("Something Happen Wrong");
            $(".loaderOverlay").hide();
            return false
        }
    });
}
function getUploadedFile(careid, Id) {
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
                        selectedFiles += `<li><input class="form-control" placeholder="Enter file name here" type="text" value="${namesArr[i]}"/>`
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
               //getPaths(Id,result);            
            }
        }, error: function (e) {
            toastr.error("Something Happen Wrong");
            $(".loaderOverlay").hide();
        }
    });
}
function getBaseUploadedFile(Id) {
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
                //getPaths(Id,result);            
            }
        }, error: function (e) {
            toastr.error("Something Happen Wrong");
            $(".loaderOverlay").hide();
        }
    });
}
//function getPaths(Id, files) {
//    $.ajax({
//        type: "POST",
//        url: "/CarePlan/GetFiles",
//        contentType: 'application/json; charset=UTF-8',
//        dataType: "json",
//        data: JSON.stringify({ files: files }),
//        async: false,
//        success: function (result) {
//            if (result.length) {
//                var selectedFiles = `<ul class="file_uploaded_list onlylinkslist">`;
//                var name = "";
//                for (var i = 0; i < result.length; i++) {                  
//                    name = result[i].substring(result[i].lastIndexOf('/') + 1);
//                    selectedFiles += '<li><a href="' + result[i] + '" target="_blank">' + name + '</a></li>';
//                }
//                selectedFiles += `</ul>`;
//                $("#" + Id).next().next().html("").append(selectedFiles);
//            }
//        }, error: function (e) {
//            toastr.error("Something Happen Wrong");
//            $(".loaderOverlay").hide();
//        }
//    });

//}
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
            var selectedValues = $.map($(item).closest("div.inputContent").find("input:checked"), function (n, i) {
                return n.value;
            }).join(',');
            fieldmodel.push({ ColumnName: $(item).attr("data-column"), FieldValue: selectedValues });
        }
    });

    $(".render-basicform textarea").each(function (index, item) {
        if ($(item).hasAttr("data-column") && $(item).val() != "" && !$(item).hasClass("base-control")) {
            fieldmodel.push({ ColumnName: $(item).attr("data-column"), FieldValue: $(item).val() });
        }
    });
    //if (fieldmodel.length < 8) return;  
    if ($(".render-basicform").find("input[type='file']").length) {
        $(".render-basicform").find("input[type='file']").each(function (index, item) {
            if ($(item).hasClass("program-control") || $(item).hasClass("base-control")) {
                var res = validateFiles($(item).attr("id"));
                if (res == false) {
                    return false;
                }
            }
        });
    }
    if ($(".render-basicform").find("input.invaild-input").length) {
        return false;
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
            //$("#carePlanName").val("");

            toastr.success("Saved as draft successfully");
            $(".loaderOverlay").hide();
            //$(".basic-info-actions").hide();
            if (intervalStatus != "") {
                clearInterval(intervalStatus);
            }
            if ($(".render-basicform").find("input[type='file']").length) {
                $(".render-basicform").find("input[type='file']").each(function (index, item) {
                    if ($(item).hasClass("program-control") || $(item).hasClass("base-control")) {
                        uploadFiles($(item).attr("id"));
                    }
                });
            }
            isupdateProgramFields = true;
            //makeBasicInfoReadonly();
            //window.location.href = '/careplan/modifytemplate?TemplateId=' + result.id + '&ProgramId=' + programId + '&Template=' + result.TemplateName;
        }, error: function (e) {
            toastr.error("Something Happen Wrong");
            $(".loaderOverlay").hide();
        }
    });
}
function getDatabaseFieldValues() {
    if ($(".render-basicform  label.database-field").length) {
        GetDropDownName();
        $.ajax({
            type: "GET",
            url: Apipath + '/api/PatientMain/GetDetailOfPatient?patientid=' + PatientId,
            contentType: 'application/json; charset=UTF-8',
            dataType: "json",
            async: false,
            success: function (result) {
                console.log(result);
                $(".render-basicform  label.database-field").each(function (index, item) {
                    var key = $(item).attr("id").substring(0, $(this).attr("id").lastIndexOf("_"));
                    var Index = $(item).attr("data-index");
                    if (Object.keys(result)[0].length && Index != "PatientScore") {
                        var keyValue = result.PatientDetail[Index][key];
                        if (keyValue === "0") {
                            keyValue = null;
                        }
                        switch (Index) {
                            case "PatientMain":
                                if (result.PatientDetail[Index].hasOwnProperty(key)) {
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
                                    
                                    $(item).html("").append(keyValue);
                                }
                                break;
                            case "PatientHousing":
                                if (result.PatientDetail[Index].hasOwnProperty(key) && ItemNames.length) {
                                    if (key == "PlaceLiveNow" && keyValue != null) {
                                        keyValue = ItemNames.find(x => x.LookUpFieldID == 1 && x.IsDeleted == false && x.ID == keyValue).OptionName;
                                    } else if (key == "EmergencyShelter" && keyValue != null) {
                                        keyValue = ItemNames.find(x => x.LookUpFieldID == 2 && x.IsDeleted == false && x.ID == keyValue).OptionName;
                                    }
                                    $(item).html("").append(keyValue);
                                }
                                break;
                            case "PatientFinancialSecurity":
                                if (result.PatientDetail[Index].hasOwnProperty(key) && ItemNames.length) {
                                    if (key == "DifficultiesInPayingBills" && keyValue != null) {
                                        keyValue = ItemNames.find(x => x.LookUpFieldID == 3 && x.IsDeleted == false && x.ID == keyValue).OptionName;
                                    } else if (key == "SkipMeals" && keyValue != null) {
                                        keyValue = ItemNames.find(x => x.LookUpFieldID == 4 && x.IsDeleted == false && x.ID == keyValue).OptionName;
                                    }
                                    switch (key) {
                                        case "IncomeCoverHouseholdExpenses":                                        
                                            if (keyValue != null) {
                                                if (keyValue) {
                                                    keyValue = "Yes";
                                                } else {
                                                    keyValue = "No"
                                                }
                                            }
                                            break;
                                    }
                                    $(item).html("").append(keyValue);
                                }
                                break;
                            case "PatientEmploymentEducation":
                                if (result.PatientDetail[Index].hasOwnProperty(key) && ItemNames.length) {
                                    if (key == "LevelofEducation" && keyValue != null) {
                                        keyValue = ItemNames.find(x => x.LookUpFieldID == 5 && x.IsDeleted == false && x.ID == keyValue).OptionName;
                                    } else if (key == "WorkSituation" && keyValue != null) {
                                        keyValue = ItemNames.find(x => x.LookUpFieldID == 6 && x.IsDeleted == false && x.ID == keyValue).OptionName;
                                    } else if (key == "ParticipatingInEducationalOrTrainingProgram" && keyValue != null) {
                                        keyValue = ItemNames.find(x => x.LookUpFieldID == 7 && x.IsDeleted == false && x.ID == keyValue).OptionName;
                                    }
                                    $(item).html("").append(keyValue);
                                }
                                break;
                            case "PatientCommunicationAndMobility":
                                if (result.PatientDetail[Index].hasOwnProperty(key) && ItemNames.length) {
                                    if (key == "DifficultyGoingPlaces" && keyValue != null) {
                                        keyValue = ItemNames.find(x => x.LookUpFieldID == 8 && x.IsDeleted == false && x.ID == keyValue).OptionName;
                                    } else if (key == "ModesOfTransportation" && keyValue != null) {                                      
                                        keyValue = ItemNames.find(x => x.LookUpFieldID == 9 && x.IsDeleted == false && x.ID == keyValue).OptionName;
                                    }

                                    if (key == "PersonalPhone" && keyValue != null) {
                                        if (keyValue) {
                                            keyValue = "Yes";
                                        } else {
                                            keyValue = "No"
                                        }
                                    }
                                    $(item).html("").append(keyValue);
                                }

                                break;
                            case "PatientHealthcare":
                                if (result.PatientDetail[Index].hasOwnProperty(key) && ItemNames.length) {
                                    if (key == "PastMonthPoorPhysicalHealth" && keyValue != null) {
                                        keyValue = ItemNames.find(x => x.LookUpFieldID == 13 && x.IsDeleted == false && x.ID == keyValue).OptionName;
                                    } else if (key == "YourHealthIs" && keyValue != null) {
                                        keyValue = ItemNames.find(x => x.LookUpFieldID == 12 && x.IsDeleted == false && x.ID == keyValue).OptionName;
                                    } else if (key == "PerWeekStrenuousExercise" && keyValue != null) {
                                        keyValue = ItemNames.find(x => x.LookUpFieldID == 14 && x.IsDeleted == false && x.ID == keyValue).OptionName;
                                    } else if (key == "PerDayStrenuousExercise" && keyValue != null) {
                                        keyValue = ItemNames.find(x => x.LookUpFieldID == 15 && x.IsDeleted == false && x.ID == keyValue).OptionName;
                                    } else if (key == "PastYearEmergency" && keyValue != null) {
                                        keyValue = ItemNames.find(x => x.LookUpFieldID == 16 && x.IsDeleted == false && x.ID == keyValue).OptionName;
                                    } 
                                    else if (key == "LastSeeDentist" && keyValue != null) {
                                        keyValue = ItemNames.find(x => x.LookUpFieldID == 11 && x.IsDeleted == false && x.ID == keyValue).OptionName;
                                    }
                                    else if (key == "LastSeeDoctor" && keyValue != null && keyValue!="0") {
                                        
                                        keyValue = ItemNames.find(x => x.LookUpFieldID == 10 && x.IsDeleted == false && x.ID == keyValue).OptionName;
                                    }
                                    else if (key == "SmokePerDay" && keyValue != null) {
                                        keyValue = ItemNames.find(x => x.LookUpFieldID == 17 && x.IsDeleted == false && x.ID == keyValue).OptionName;
                                    }
                                    else if (key == "FrequentlySmoke" && keyValue != null) {
                                        keyValue = ItemNames.find(x => x.LookUpFieldID == 18 && x.IsDeleted == false && x.ID == keyValue).OptionName;
                                    }                                  
                                    else if (key == "Diagnosed" && keyValue != null) {
                                     
                                        if (keyValue.indexOf(',') == -1) {
                                            keyValue = ItemNames.find(x => x.LookUpFieldID == 44 && x.IsDeleted == false && x.ID == keyValue).OptionName;
                                        } else {
                                            var valueArr = keyValue.split(',');
                                            var nameTxt = "";
                                            for (n = 0; n < valueArr.length; n++) {
                                                nameTxt += ItemNames.find(x => x.LookUpFieldID == 44 && x.IsDeleted == false && x.ID == valueArr[n]).OptionName+", ";
                                            }
                                            keyValue = nameTxt.slice(0, -2);
                                        }
                                    }
                                    switch (key) {
                                        case "HealthInsurance":
                                        case "PrimaryCareDoctor":
                                        case "RegularDentist":
                                        case "OtherDoctorsTherapists":
                                        case "CaseManager":
                                        case "SmokeCigarettes":
                                        case "TobaccoProducts":
                                            if (keyValue != null) {
                                                if (keyValue) {
                                                    keyValue = "Yes"
                                                } else {
                                                    keyValue = "No"
                                                }
                                            }
                                            break;
                                    }
                                    $(item).html("").append(keyValue);
                                }
                                break;
                            case "PatientSocialSupport":
                                if (result.PatientDetail[Index].hasOwnProperty(key) && ItemNames.length) {
                                    if (key == "FinancialSecurity" && keyValue != null) {
                                        keyValue = ItemNames.find(x => x.LookUpFieldID == 19 && x.IsDeleted == false && x.ID == keyValue).OptionName;
                                    } else if (key == "FeelSafeNeighborhood" && keyValue != null) {
                                        keyValue = ItemNames.find(x => x.LookUpFieldID == 42 && x.IsDeleted == false && x.ID == keyValue).OptionName;
                                    } else if (key == "PlaceToStay" && keyValue != null) {
                                        keyValue = ItemNames.find(x => x.LookUpFieldID == 20 && x.IsDeleted == false && x.ID == keyValue).OptionName;
                                    }
                                    else if (key == "FeelSafeNeighborhood" && keyValue != null) {
                                        keyValue = ItemNames.find(x => x.LookUpFieldID == 42 && x.IsDeleted == false && x.ID == keyValue).OptionName;
                                    }
                                    switch (key) {
                                        case "InvolvedInCommunityGroup":
                                        case "IsAnyoneThreatenYou":
                                        case "IsSomeoneYouCanCall":                                       
                                            if (keyValue != null) {
                                                if (keyValue) {
                                                    keyValue = "Yes"
                                                } else {
                                                    keyValue = "No"
                                                }
                                            }
                                            break;
                                    }
                                    $(item).html("").append(keyValue);
                                }
                                break;
                            case "PatientLegalStatus":
                                if (result.PatientDetail[Index].hasOwnProperty(key)) {
                                    switch (key) {                                       
                                        case "GovernmentIssuedID":
                                        case "ConcernsAboutFamilyImmigrationStatus":
                                        case "ConcernsWithLandlord":
                                            if (keyValue != null) {
                                                if (keyValue) {
                                                    keyValue = "Yes"
                                                } else {
                                                    keyValue = "No"
                                                }
                                            }
                                            break;
                                        case "GovernmentIDImg":
                                            if (keyValue != null) {
                                                if (keyValue.indexOf('.')) {
                                                    keyValue = `<img style="max-width:250px" class="img-fluid" src="/Files/${keyValue}" alt="">`;
                                                }
                                            }
                                            break;
                                        case "LastReleased":
                                            if (keyValue != null) {
                                                keyValue = ItemNames.find(x => x.LookUpFieldID == 21 && x.IsDeleted == false && x.ID == keyValue).OptionName;
                                            }
                                            break;
                                        case "ParoleProbation":
                                            if (keyValue != null) {
                                                keyValue = ItemNames.find(x => x.LookUpFieldID == 22 && x.IsDeleted == false && x.ID == keyValue).OptionName;
                                            }
                                            break;
                                    }
                                    $(item).html("").append(keyValue);
                                }
                                break;
                            case "Dast":
                                if (result.PatientDetail[Index].hasOwnProperty(key)) {
                                    switch (key) {
                                        case "Blackouts":
                                        case "EngagedInIllegalActivities":
                                        case "GuiltyAboutYourDrug":
                                        case "MedicalLoss":
                                        case "NeglectedFamily":
                                        case "OneDrugAtATime":
                                        case "SpouseComplain":
                                        case "UnableToStopUsingDrugs":
                                        case "UsedDrugsForMedicalReasons":
                                        case "WithdrawalSymptoms":
                                        case "EverInjectedDrugs":
                                            if (keyValue != null) {
                                                if (keyValue) {
                                                    keyValue = "Yes"
                                                } else {
                                                    keyValue = "No"
                                                }
                                            }
                                            break;                                       
                                    }
                                    $(item).html("").append(keyValue);
                                } else {                                 
                                    var drugType = key[key.length - 1];
                                    key = key.slice(0, -1);
                                    keyValue = result.PatientDetail[Index][key];
                                    if (key == "DrugsContaining" && keyValue != null) {
                                        keyValue = keyValue.indexOf(drugType)==-1?"No":"Yes"
                                    }
                                    $(item).html("").append(keyValue);
                                }
                                break;
                            case "Audit":
                                if (result.PatientDetail[Index].hasOwnProperty(key) && ItemNames.length) {
                                    if (key == "DrinkContainingAlcohol" && keyValue != null) {
                                        keyValue = ItemNames.find(x => x.LookUpFieldID == 25 && x.IsDeleted == false && x.ID == keyValue).OptionName;
                                    } else if (key == "HowManyDrinks" && keyValue != null) {
                                        keyValue = ItemNames.find(x => x.LookUpFieldID == 26 && x.IsDeleted == false && x.ID == keyValue).OptionName;
                                    } else if (key == "NotAbleToStopDrinking" && keyValue != null) {
                                        keyValue = ItemNames.find(x => x.LookUpFieldID == 28 && x.IsDeleted == false && x.ID == keyValue).OptionName;
                                    }
                                    if (key == "FailedWhatWasExpected" && keyValue != null) {
                                        keyValue = ItemNames.find(x => x.LookUpFieldID == 29 && x.IsDeleted == false && x.ID == keyValue).OptionName;
                                    } else if (key == "SixOrMoreDrink" && keyValue != null) {
                                        keyValue = ItemNames.find(x => x.LookUpFieldID == 27 && x.IsDeleted == false && x.ID == keyValue).OptionName;
                                    } else if (key == "FirstDrinkMorning" && keyValue != null) {
                                        keyValue = ItemNames.find(x => x.LookUpFieldID == 30 && x.IsDeleted == false && x.ID == keyValue).OptionName;
                                    }
                                    if (key == "FeelingOfGuilt" && keyValue != null) {
                                        keyValue = ItemNames.find(x => x.LookUpFieldID == 31 && x.IsDeleted == false && x.ID == keyValue).OptionName;
                                    } else if (key == "UnableToRemember" && keyValue != null) {
                                        keyValue = ItemNames.find(x => x.LookUpFieldID == 32 && x.IsDeleted == false && x.ID == keyValue).OptionName;
                                    } else if (key == "InjuredOfYourDrinking" && keyValue != null) {
                                        keyValue = ItemNames.find(x => x.LookUpFieldID == 33 && x.IsDeleted == false && x.ID == keyValue).OptionName;
                                    } else if (key == "FriendsSuggestedYouCutDown" && keyValue != null) {
                                        keyValue = ItemNames.find(x => x.LookUpFieldID == 34 && x.IsDeleted == false && x.ID == keyValue).OptionName;
                                    }
                                    $(item).html("").append(keyValue);
                                }
                                break;
                            case "PHQ9":
                                if (result.PatientDetail[Index].hasOwnProperty(key)) {                                   
                                        switch (key) {
                                            case "LittleInterest":
                                            case "FeelingBad":
                                            case "FeelingDown":
                                            case "FeelingTired":
                                            case "HurtingYourself":
                                            case "PoorAppetite":
                                            case "TroubleFalling":
                                            case "TroubleConcentraiting":
                                            case "restless":
                                            case "ProblemsMade":
                                            if (keyValue != null) {
                                                switch (keyValue) {
                                                    case 0:
                                                        keyValue = "Not at all";
                                                        break;
                                                    case 1:
                                                        keyValue = "Several days";
                                                        break;
                                                    case 2:
                                                        keyValue = "More than half the days";
                                                        break;
                                                    case 3:
                                                        keyValue = "Nearly every day";
                                                        break;
                                                    default:
                                                        keyValue = "None";
                                                        break;
                                                }
                                                break;
                                        }                                       
                                    }
                                    $(item).html("").append(keyValue);
                                }
                                break;

                            case "PatientMentalHealth":                               
                                if (result.PatientDetail[Index].hasOwnProperty(key)) {
                                    switch (key) {
                                        case "MentalHealthConditions":
                                            if (keyValue != null) {
                                                keyValue = ItemNames.find(x => x.LookUpFieldID == 43 && x.IsDeleted == false && x.ID == keyValue).OptionName;
                                            }
                                            break;
                                        case "PoorMentalHealth":
                                            if (keyValue != null) {
                                                keyValue = ItemNames.find(x => x.LookUpFieldID == 23 && x.IsDeleted == false && x.ID == keyValue).OptionName;
                                            }
                                            break;
                                        case "SufferExcessive":
                                            if (keyValue != null) {
                                                keyValue = ItemNames.find(x => x.LookUpFieldID == 24 && x.IsDeleted == false && x.ID == keyValue).OptionName;
                                            }
                                            break;
                                    }
                                    $(item).html("").append(keyValue);
                                }
                                break;
                            case "PatientFoodAccess":
                                if (result.PatientDetail[Index].hasOwnProperty(key) && ItemNames.length) {
                                    if (key == "PortionsOfVegetables" && keyValue != null) {
                                        keyValue = ItemNames.find(x => x.LookUpFieldID == 36 && x.IsDeleted == false && x.ID == keyValue).OptionName;
                                    } else if (key == "ServingsOfFruit" && keyValue != null) {
                                        keyValue = ItemNames.find(x => x.LookUpFieldID == 35 && x.IsDeleted == false && x.ID == keyValue).OptionName;
                                    } else if (key == "MajorityOfFood" && keyValue != null) {
                                        keyValue = ItemNames.find(x => x.LookUpFieldID == 37 && x.IsDeleted == false && x.ID == keyValue).OptionName;
                                    }
                                    $(item).html("").append(keyValue);
                                }
                                break;
                        }
                    }
                    if (Object.keys(result)[1].length && Index == "PatientScore") {
                        if (result.PatientScore.hasOwnProperty(key)) {
                            $(item).html("").append(result.PatientScore[key]);
                        }
                    }
                });

            },
        });
    }
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
            console.log(ItemNames);
        },
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
                    if ($(obj).parent().parent().find("li").length == 1) {
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
    var files = $("#" + Id).get(0).files;
    if (files.length == 0 && $("#" + Id).parent().prev().hasClass("required-asterisk")) {
        toastr.error("File upload field is required");
        return false;
    }
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

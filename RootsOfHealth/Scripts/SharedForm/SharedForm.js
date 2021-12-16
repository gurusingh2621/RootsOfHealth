$(document).ready(function () {

    if (PatientId == 0) {
       alert('there is no form to show')
    }


    OpenActiveForm();  


    jQuery.fn.extend(
        {
            hasAttr: function (name) {
                
                var doesAttrbuteExists = $(this).attr(name)
               
                if (doesAttrbuteExists == undefined || doesAttrbuteExists == false) {
                    return false;
                } else {
                    return true
                }
            }
        })  

})



var tableName = ''
var templateid = 0;
var basetemplateid = "0";
var formName = ''
var basetemplateid = "0";

function OpenActiveForm() {
    
     activeFormName = activeFormName.trim().replace(/ /g, "");
    var $FirstTab = $('#tabPills  .nav-tabs  .nav-link')[0]
    var $ActiveFormTab = $('#a' + activeFormName)

    if (activeFormName != '') {
        if ($ActiveFormTab.length > 0) {
            $ActiveFormTab.click();
        } else {
            $FirstTab.click()
        }
    } else {
        $FirstTab.click()
    }

}
var _ClientFormElement=''
function GetSharedFormTemplate(formid, formname, navTab) {


    var isViewed = $(navTab).attr('data-viewed')

    formName = formname
    _ClientFormElement = $('#' + formname + 'render-basicform')
    var $AllRenderedForms = $('.render-basicProgramform')
    $AllRenderedForms.each(function (index, item) {
        $(item).html('')
    })
    LoadClientFormTemplate(formid, isViewed)

   
    
}







var IsBasedataExist = false;

function saveClientFormBasicInfo(_templateId, _templatetable, ClientFormID, _PatientId, isUpdated, isbaseTemplateSaved,sharedid) {
    IsBasedataExist = isbaseTemplateSaved=='True'?true:false


    var fieldmodel = [];
    var isvalid = true;
    _ClientFormElement.find(".base-control,.program-control,input.custom-control-input").each(function (index, item) {
        if ($(item).is("input") && $(item).hasAttr("data-column")) {
            switch ($(item).attr("type")) {
                case "radio":
                case "checkbox":
                    if ($(item).closest(".inputContent").prev().hasClass("required-asterisk") && $(item).closest("div.inputContent").find("input:checked").length == 0) {
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
                    if ($(item).closest(".inputContent").prev().hasClass("required-asterisk") && $(item).val().trim() == "") {
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
    if (_ClientFormElement.find("input[type='file']").length) {
        _ClientFormElement.find("input[type='file']").each(function (index, item) {
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
    if (_ClientFormElement.find("input.invaild-input").length) {
        return false;
    }
    fieldmodel.push({ ColumnName: "PatientID", FieldValue: _PatientId });
    fieldmodel.push({ ColumnName: "TemplateID", FieldValue: _templateId });
    fieldmodel.push({ ColumnName: "ClientFormID", FieldValue: ClientFormID });
    fieldmodel.push({ ColumnName: "CreatedBy", FieldValue: _PatientId });
    fieldmodel.push({ ColumnName: "CreatedDate", FieldValue: getActualFullDate() });
    fieldmodel.push({ ColumnName: "ModifiedBy", FieldValue: _PatientId });
    fieldmodel.push({ ColumnName: "ModifiedDate", FieldValue: getActualFullDate() });
    
    if (_ClientFormElement.find(".base-control").length) {
        fieldmodel.push({ ColumnName: "BaseTemplateID", FieldValue: basetemplateid });
    }
    
    

    _ClientFormElement.find("[type=text],[type=number],[type=file],[type=date]").each(function (index, item) {
        
        if ($(item).hasAttr("data-column") && $(item).val() != "" && $(item).hasClass("program-control")) {
            fieldmodel.push({ ColumnName: $(item).attr("data-column"), FieldValue: $(item).val() });
        }
    });
    _ClientFormElement.find("select").each(function (index, item) {
        if ($(item).hasAttr("data-column") && $(item).val() != "" && $(item).hasClass("program-control")) {
            fieldmodel.push({ ColumnName: $(item).attr("data-column"), FieldValue: $(item).val() });
        }
    });
    _ClientFormElement.find(".priority").each(function (index, item) {

        if ($(item).hasAttr("data-column") && $(item).hasClass("program-control")) {
            var id = $(item).attr("id")

            var strvalue = ''
            $.each($('#' + id + ' li'), function () {
                strvalue += $(this).attr('value') + SeperationString
            });

            strvalue = strvalue.substr(0, strvalue.length - SeperationString.length)
            fieldmodel.push({ ColumnName: $(item).attr("data-column"), FieldValue: strvalue });
        }
    });
    _ClientFormElement.find("[type=checkbox], [type=radio]").each(function (index, item) {
        var selectedValues = ''
        if ($(item).hasAttr("data-column") && $(item).closest(".form-group").hasClass("program-control")) {
            selectedValues = $.map($(item).closest("div.inputContent").find("input:checked"), function (n, i) {
                return n.value;
            }).join(SeperationString);
            fieldmodel.push({ ColumnName: $(item).attr("data-column"), FieldValue: selectedValues });
        }

    });
    _ClientFormElement.find("textarea").each(function (index, item) {
        if ($(item).hasAttr("data-column") && $(item).val() != "" && $(item).hasClass("program-control")) {
            fieldmodel.push({ ColumnName: $(item).attr("data-column"), FieldValue: $(item).val() });
        }
    });

    var model = {
        ClientFormID: ClientFormID,
        TableName: _templatetable,
        ClientFormCols: fieldmodel,
        PatientID: _PatientId,
        IsUpdated: isUpdated == 'True' ? true : false,
        SharedId:sharedid
    }
    $(".loaderOverlay").show();
    $.ajax({
        type: "POST",
        url: Apipath + '/api/PatientMain/saveClientFormbasicinfo',
        contentType: 'application/json; charset=UTF-8',
        data: JSON.stringify(model),
        dataType: "json",
        success: function (res) {
            if (_ClientFormElement.find(".base-control").length) {
                saveClientFormBaseFieldInfo(ClientFormID, _templateId);

            } 
            disableClientFormSave()
            $(".loaderOverlay").hide();
            toastr.success("Saved successfully");
            $(".basic-info-actions").hide();
          
            if (_ClientFormElement.find("input[type='file']").length) {
                _ClientFormElement.find("input[type='file']").each(function (index, item) {
                    
                    if ($(item).hasAttr("data-column")) {
                        if ($(item).hasClass("program-control") || $(item).hasClass("base-control")) {

                            switch (index) {
                                case 0:
                                    uploadClientFormFiles($(item).attr("id"), fileDataP1, ClientFormID);
                                    break;
                                case 1:
                                    uploadClientFormFiles($(item).attr("id"), fileDataP2, ClientFormID);
                                    break;
                                case 2:
                                    uploadClientFormFiles($(item).attr("id"), fileDataP3, ClientFormID);
                                    break;
                                case 3:
                                    uploadClientFormFiles($(item).attr("id"), fileDataP4, ClientFormID);
                                    break;
                                case 4:
                                    uploadClientFormFiles($(item).attr("id"), fileDataP5, ClientFormID);
                                    break;
                                case 5:
                                    uploadClientFormFiles($(item).attr("id"), fileDataP6, ClientFormID);
                                    break;
                                case 6:
                                    uploadClientFormFiles($(item).attr("id"), fileDataP7, ClientFormID);
                                    break;
                                case 7:
                                    uploadClientFormFiles($(item).attr("id"), fileDataP8, ClientFormID);
                                    break;
                                case 8:
                                    uploadClientFormFiles($(item).attr("id"), fileDataP9, ClientFormID);
                                    break;
                                case 9:
                                    uploadClientFormFiles($(item).attr("id"), fileDataP10, ClientFormID);
                                    break;
                            }
                        }
                    }
                });
            }
            clearClientFileData();

            $('#' + formName + 'only').find('.btnprogramsave').attr('data-save', 'True');
            $('#a' + formName).find('.check').removeClass('d-none')

        },
        error: function (e) {
            toastr.error("Something happen Wrong");
            $(".loaderOverlay").hide();
        },
        complete: function () {

        }
    });

}

function clearClientFileData() {
    fileDataP1 = new FormData();
    fileDataP2 = new FormData();
    fileDataP3 = new FormData();
    fileDataP4 = new FormData();
    fileDataP5 = new FormData();
    fileDataP6 = new FormData();
    fileDataP7 = new FormData();
    fileDataP8 = new FormData();
    fileDataP9 = new FormData();
    fileDataP10 = new FormData();
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

function saveClientFormBaseFieldInfo(ClientFormID, _templateId) {

    var fieldmodel = [];
    fieldmodel.push({ ColumnName: "PatientID", FieldValue: _PatientId });
    fieldmodel.push({ ColumnName: "TemplateID", FieldValue: _templateId });
    fieldmodel.push({ ColumnName: "ClientFormID", FieldValue: ClientFormID });
    
        fieldmodel.push({ ColumnName: "CreatedBy", FieldValue: _PatientId });
        fieldmodel.push({ ColumnName: "CreatedDate", FieldValue: getActualFullDate() });
 
    fieldmodel.push({ ColumnName: "ModifiedBy", FieldValue: _PatientId });
    fieldmodel.push({ ColumnName: "ModifiedDate", FieldValue: getActualFullDate() });
    _ClientFormElement.find("[type=text],[type=number],[type=file],[type=date]").each(function (index, item) {
        if ($(item).hasAttr("data-column") && $(item).val() != "" && $(item).hasClass("base-control")) {
            fieldmodel.push({ ColumnName: $(item).attr("data-column"), FieldValue: $(item).val() });
        }
    });
    _ClientFormElement.find("select").each(function (index, item) {
        if ($(item).hasAttr("data-column") && $(item).val() != "" && $(item).hasClass("base-control")) {
            fieldmodel.push({ ColumnName: $(item).attr("data-column"), FieldValue: $(item).val() });
        }
    });
    _ClientFormElement.find(".priority").each(function (index, item) {

        if ($(item).hasAttr("data-column") && $(item).hasClass("base-control")) {
            var id = $(item).attr("id")
            var strvalue = ''
            $.each($('#' + id).find('li'), function () {
                strvalue += $(this).attr('value') + SeperationString
            });
            strvalue = strvalue.substr(0, strvalue.length - SeperationString.length)
            fieldmodel.push({ ColumnName: $(item).attr("data-column"), FieldValue: strvalue });
        }
    });
    _ClientFormElement.find("[type=checkbox],[type=radio]").each(function (index, item) {
        if ($(item).hasAttr("data-column") && $(item).closest("div.inputContent").find("input:checked").length && $(item).closest(".form-group").hasClass("base-control")) {
            var selectedValues = $.map($(item).closest("div.inputContent").find("input:checked"), function (n, i) {
                return n.value;
            }).join(SeperationString);
            fieldmodel.push({ ColumnName: $(item).attr("data-column"), FieldValue: selectedValues });
        }
    });
    _ClientFormElement.find(" textarea").each(function (index, item) {
        if ($(item).hasAttr("data-column") && $(item).val() != "" && $(item).hasClass("base-control")) {
            fieldmodel.push({ ColumnName: $(item).attr("data-column"), FieldValue: $(item).val() });
        }
    });
    var model = {
        PatientId: _PatientId,
        TableName: "tbl_BaseClientFormTemplate",
        ClientFormCols: fieldmodel,
        IsUpdated: IsBasedataExist ? true : false
    }
    $(".loaderOverlay").show();
    $.ajax({
        type: "POST",
        url: Apipath + '/api/PatientMain/saveClientFormfieldbasevalue',
        contentType: 'application/json; charset=UTF-8',
        data: JSON.stringify(model),
        dataType: "json",
        async: false,
        success: function (res) {
            LoadSchedulingAfterSave();
        },
        error: function (e) {
            toastr.error("Something happen Wrong");
            $(".loaderOverlay").hide();
        }
    });
}



function LoadClientFormTemplate(ClientFormID,IsViewed) {
    var _ClientFormID = ClientFormID;
   

    $.ajax({
        type: "GET",
        url: '/Client/GetClientFormTemplateByClientFormId?ClientFormId=' + _ClientFormID + '&IsViewed=' + IsViewed,
        contentType: 'application/json; charset=UTF-8',
        dataType: "json",
        beforeSend: function () {
            $(".loaderOverlay").css('display', 'flex');
        },
        async: true,
        success: function (result) {
            
            if (result.html == "") {
                toastr.error("No template found");
            } else {
                _ClientFormElement.html("").append(result.html);
                tableName = result.tableName;
                templateid = result.TemplateId;

                if (_ClientFormElement.find(".basecontentarea").length > 0) {
                    getClientFormHeaderAndFooter();
                }
                else {
                    BindChangeClientEvent()
                }
                _ClientFormElement.find(".event-btn-right").remove();
                _ClientFormElement.find(".ck-editor-header").remove();
                _ClientFormElement.find(".question-container").parent().css("border", "none");
                _ClientFormElement.find(".dragresize").find(".question-container").remove();
                _ClientFormElement.find(".dragresize").find(".bootom-form-row").css({ "padding": "7px 0px", "margin": "0" });
                _ClientFormElement.find(".html-content").prev().css("display", "none");
                _ClientFormElement.find(".html-content").parent().parent().parent().addClass("left-control");
                _ClientFormElement.find(".f-g-left").each(function (index, item) {
                    $(item).parent().parent().addClass("left-control");
                });
                toogleProgramToolTip();

                $("textarea.program-control,textarea.base-control").summernote({
                    toolbar: [
                        ['para', ['ul', 'ol', 'paragraph']],
                        ['style', ['bold', 'italic', 'underline', 'clear']],
                        ['font', ['strikethrough', 'superscript', 'subscript']],
                    ],
                    placeholder: "Type here",
                    callbacks: {
                        onChange: function () {
                            enableClientFormSave()
                        },
                        onInit: function (e) {
                            this.placeholder
                                ? e.editingArea.find(".note-placeholder").html(this.placeholder)
                                : e.editingArea.remove(".note-placeholder")
                        }
                    },
                    height: 150,
                });
                //if (_ClientFormElement.find(".basecontentarea").length > 0) {
                //    getClientFormBaseFieldData()
                //}
            }

            _ClientFormElement.find(".priority").each((index, item) => {
                $(item).sortable({
                    change: function (event, ui) {
                        enableClientFormSave()
                    }
                });
            })
            $(".loaderOverlay").hide();
            disableClientFormSave();
        }, error: function (e) {
            toastr.error("Something happen Wrong");
            $(".loaderOverlay").hide();
        }
    });
}

function getClientFormHeaderAndFooter() {
    $.ajax({
        type: "GET",
        url: Apipath + '/api/PatientMain/getClientFormbasetemplateid',
        contentType: 'application/json; charset=UTF-8',
        dataType: "json",
        async: false,
        success: function (result) {
            switch (result.TemplateID) {
                case -1:
                    break;
                default:
                    basetemplateid = result.TemplateID;
                    $.ajax({
                        type: "GET",
                        url: '/Client/GetClientFormHtmlById?Id=' + result.TemplateID,
                        contentType: 'application/json; charset=UTF-8',
                        dataType: "json",
                        async: false,
                        success: function (result) {
                            var baseHtml = parseHTML(result.html);
                            var baseHeader = $(baseHtml).find(".baseheader").html();
                            var baseFooter = $(baseHtml).find(".basefooter").html();
                            _ClientFormElement.find(".baseheader").html("").append(baseHeader);
                            _ClientFormElement.find(".basefooter").html("").append(baseFooter);
                        },
                        error: function (e) {
                            toastr.error("Something happen Wrong");
                            $(".loaderOverlay").hide();
                        }
                    });
                    break;
            }
            BindChangeClientEvent()
        },
        error: function (e) {
            toastr.error("Something happen Wrong");
            $(".loaderOverlay").hide();
        }
    });
}

function BindChangeClientEvent() {

    _ClientFormElement.find('input,select').each(function () {

        $(this).change(function () {
            enableClientFormSave()

        });
    });
}

function enableClientFormSave() {
    $('#' + formName + 'only').find('.btnprogramsave').removeClass('disabled')
    $('#' + formName + 'only').find('.btnprogramsave').css({ "background-color": "#22baa0", "border": "1px solid #22baa0" });
}

function disableClientFormSave() {
    $('#' + formName + 'only').find('.btnprogramsave').addClass('disabled')
    $('#' + formName + 'only').find('.btnprogramsave').css({ "background-color": "#a1a1a1", "border": "1px solid #a1a1a1" });
}

function toogleProgramToolTip() {

    _ClientFormElement.find('span.tooltipicon').tooltip({
        trigger: "click",
        html: true,
        container: 'body'
    });
    _ClientFormElement.find('span.tooltipicon').on('show.bs.tooltip', function () {
        _ClientFormElement.find('span.tooltipicon').not(this).tooltip('hide');
    });
    $('body').on('click', function (e) {
        if ($(e.target).data('toggle') !== 'tooltip' && $(e.target).parents('[data-toggle="tooltip"]').length === 0
            && $(e.target).parents('.tooltip.in').length === 0) {
            (($('[data-toggle="tooltip"]').tooltip('hide').data('bs.tooltip') || {}).inState || {}).click = false;
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



var fileDataP1 = new FormData();
var fileDataP2 = new FormData();
var fileDataP3 = new FormData();
var fileDataP4 = new FormData();
var fileDataP5 = new FormData();
var fileDataP6 = new FormData();
var fileDataP7 = new FormData();
var fileDataP8 = new FormData();
var fileDataP9 = new FormData();
var fileDataP10 = new FormData();

function previewOnfileChange(obj) {

    if (obj.files.length) {
        var fileData;
        if (_ClientFormElement.find("input[type='file']").length) {
            _ClientFormElement.find("input[type='file']").each(function (index, item) {
                if ($(item).hasClass("program-control") || $(item).hasClass("base-control")) {
                    if ($(item).attr("id") == $(obj).attr("id")) {
                        switch (index) {
                            case 0:
                                fileData = null;
                                fileData = fileDataP1;
                                break;
                            case 1:
                                fileData = null;
                                fileData = fileDataP2;
                                break;
                            case 2:
                                fileData = null;
                                fileData = fileDataP3;
                                break;
                            case 3:
                                fileData = null;
                                fileData = fileDataP4;
                                break;
                            case 4:
                                fileData = null;
                                fileData = fileDataP5;
                                break;
                            case 5:
                                fileData = fileDataP6;
                                break;
                            case 6:
                                fileData = null;
                                fileData = fileDataP7;
                                break;
                            case 7:
                                fileData = null;
                                fileData = fileDataP8;
                                break;
                            case 8:
                                fileData = null;
                                fileData = fileDataP9;
                                break;
                            case 9:
                                fileData = null;
                                fileData = fileDataP10;
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
                    selectedFiles += '<a href="' + file + '" target="_blank">' + obj.files[i].name + '</a><span data-remove="' + obj.files[i].name + '" onclick="removeClientFormUpload(this)" class="removeUploadFile"><i class="fa fa-times"></i></span></li>';
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
    }
}

function uploadClientFormFiles(Id, fileData, ClientFormID) {
    var files = $("#" + Id).get(0).files;
    var fileNames = [];
    var savedfiles = [];
    $("#" + Id).next().next().find("input").each(function (index, item) {
        fileNames.push($(item).val());

        if ($(item).hasAttr("data-file")) {
            savedfiles.push($(item).attr("data-file"));
        }
    });
    if (files.length == 0 && savedfiles.length == 0) {
        return;
    }
    if (fileNames.length == 0) {
        return;
    }
    fileData.append("ClientFormID", ClientFormID);
    fileData.append("ControlId", Id);
    fileData.append("Files", savedfiles.join(","));
    fileData.append("FileNames", fileNames.join(","));
    fileData.append("PatientId", PatientId);
    fileData.append("IsBaseField", $("#" + Id).hasClass("base-control"));

    $.ajax({
        type: "POST",
        url: "/Client/UploadFiles",
        dataType: "json",
        contentType: false,
        processData: false,
        data: fileData,
        async: false,
        success: function (result, status, xhr) {
            fileData = new FormData();
        }, error: function (e) {
            toastr.error("Something happen Wrong");
            $(".loaderOverlay").hide();
            return false
        }
    });
}



function removeClientFormUpload(obj) {
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
                    if (_ClientFormElement.find("input[type='file']").length && $(obj).hasAttr("data-remove")) {
                        _ClientFormElement.find("input[type='file']").each(function (index, item) {
                            if ($(item).hasAttr("data-column")) {
                                if ($(item).hasClass("program-control") || $(item).hasClass("base-control")) {
                                    if ($(item).attr("id") == inputId) {
                                        switch (index) {
                                            case 0:
                                                fileDataP1.delete($(obj).attr("data-remove"));;
                                                break;
                                            case 1:
                                                fileDataP2.delete($(obj).attr("data-remove"));
                                                break;
                                            case 2:
                                                fileDataP3.delete($(obj).attr("data-remove"));
                                                break;
                                            case 3:
                                                fileDataP4.delete($(obj).attr("data-remove"));
                                                break;
                                            case 4:
                                                fileDataP5.delete($(obj).attr("data-remove"));
                                                break;
                                            case 5:
                                                fileDataP6.delete($(obj).attr("data-remove"));
                                                break;
                                            case 6:
                                                fileDataP7.delete($(obj).attr("data-remove"));
                                                break;
                                            case 7:
                                                fileDataP8.delete($(obj).attr("data-remove"));
                                                break;
                                            case 8:
                                                fileDataP9.delete($(obj).attr("data-remove"));
                                                break;
                                            case 9:
                                                fileDataP10.delete($(obj).attr("data-remove"));
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
                    enableClientFormSave();
                }
            },
            no: {

            }
        },

    });
}




//function UpdateLastView() {

//    $.ajax({
//        type: "POST",
//        url: Apipath + '/api/PatientMain/upda',
//        contentType: 'application/json; charset=UTF-8',
//        data: JSON.stringify(model),
//        dataType: "json",
//        success: function () {

//        },
//        error: function (e) {
//            toastr.error("Something happen Wrong");
//            $(".loaderOverlay").hide();
//        },
//        complete: function () {

//        }
//    });



//}
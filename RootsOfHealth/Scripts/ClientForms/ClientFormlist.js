$(function () {
    GetProgramTemplateList();
    GetBaseTemplateId();
    sessionStorage.clear();
});
var _programDataTable = '';
function GetProgramTemplateList() {
    $(".loaderOverlay").css("display", "flex");
    $.ajax({
        type: "GET",
        url: Apipath + '/api/PatientMain/getClientFormtemplatelist',
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            
            if (_programDataTable!='') {
                $('#tblProgramTemplateList').DataTable().clear();
                $('#tblProgramTemplateList').DataTable().destroy();
            }
            var programlist = $(".programlist");
            var programs = "";
            if (result.length) {
                $.each(result, function (index, item) {
                    
                    programs += `<tr>
                         <td width="15%">${(item.FormName == null && item.IsBaseTemplate == true) ? "Base Template" : item.FormName}</td>
                         <td width="10%">${(item.IsActive == null) ? "Not Started" : (item.IsActive == 0)?"In Progress":"Completed"}</td >
                         <td width="15%">${item.ModifiedDate != null ? item.ModifiedDate.split("T")[0] : ""}</td>
                         <td width="10%">${(item.IsActive==1 && item.IsBaseTemplate == false) ? (item.Isactivated == 1 ? "Yes" : "No") : ""}</td>
                            <td width="30%"><div>`;
                    programs += `<a href="javascript:void(0)" onclick="ViewProgramContent(${item.TemplateID},\'${(item.FormName == null && item.IsBaseTemplate == true) ? "Base Template" : item.FormName}'\)" class="btn btn-success text-white" style="cursor:pointer;">VIEW</a>`
                    if (item.IsBaseTemplate) {
                        ;
                        item.IsActive = item.IsActive == null ? false : true;
                        programs += `<a href="/Client/ClientFormBaseTemplate?templateid=${item.TemplateID}&Status=${item.IsActive}"  class="btn btn-success text-white" style="cursor:pointer;">MODIFY</a>`

                    } else {                        
                        programs += `<a href="javascript:void(0)" onclick="ProceedProgram({TemplateID:${item.TemplateID},TemplateTable:\'${item.TemplateTable}\',FormName:\'${item.FormName}\',ClientFormID:${item.ClientFormID},IsBaseTemplate:${item.IsBaseTemplate}})"  class="btn btn-success text-white" style="cursor: pointer; ${item.Isactivated == true ? "display:none;" : ""} ">MODIFY</a>`
                    }
                    
                    if (item.IsActive == 1 && item.IsBaseTemplate == false) {
                        if (item.Isactivated == true) {
                            programs += `<a href="javascript:void(0)"  onclick="SetTemplateStatus(${item.TemplateID},${false})"  class="btn btn-success text-white" style="cursor:pointer;">DEACTIVATE</a>`;
                        } else if (item.Isactivated == 0) {
                            programs += `<a href="javascript:void(0)" onclick="SetTemplateStatus(${item.TemplateID},${true})"  class="btn btn-success text-white" style="cursor:pointer;">ACTIVATE</a>`;
                        }
                    } else if (item.IsActive == 0 && item.IsBaseTemplate == false){
                        programs += `<a href="javascript:void(0)" onclick="alertInprogressStatus()"  class="btn btn-success text-white" style="cursor:pointer;">ACTIVATE</a>`;
                    }

                    if (!item.IsBaseTemplate) {
                        programs += `<a href="javascript:void(0)" onclick="DeleteProgram(${item.ClientFormID},this)"  class="btn btn-success text-white" style="cursor:pointer;">Delete</a>`;
                    }
                    if (!item.IsBaseTemplate && item.IsActive == 1) {
                        programs += `<a href="javascript:void(0)" onclick="SetStatus(${item.ClientFormID})"  class="btn btn-success text-white" style="cursor:pointer;">Manage Status</a>`;
                    }
                 
                    programs += `</div></td></tr>`;
                });
                programlist.html("").append(programs);
            } else {
                programs += `<tr><td colspan="6"><p class="text-center">No data found.</p></td><td style="display: none;"></td><td style="display: none;"></td> <td style="display: none;"></td><td style="display: none;"></tr>`;
                programlist.html("").append(programs);
            }
            
          _programDataTable= $('#tblProgramTemplateList').DataTable({
                retrieve: true,
              searching: false,
              "scrollY": "calc(100vh - 380px)",
                'columnDefs': [{
                    'targets': [4],
                    'orderable': false                  
                }]
            });
           
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
$("#radioBaseTemplate").change(function () {
    if ($(this).attr("data-baseid") == "-1") {
        toastr.error("", "Base template not available until completed", { progressBar: true });
        $(this).prop("checked", false);
    }
});
function SetTemplateStatus(Templateid, Status) {
    $.confirm({
        icon: 'fas fa-exclamation-triangle',
        title: 'Confirm',
        content: Status == true ? 'This template will be activated and users will have access</br>You have to readjust the overall status values </br> Do you want to continue?' :
            'You have to readjust the overall status values. </br>Are you sure you want to de-activate.?',
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
                        url: Apipath + '/api/PatientMain/updateClientFormtemplatestatus?Templateid=' + Templateid + '&status=' + Status,
                        contentType: 'application/json; charset=UTF-8',
                        dataType: "json",
                        success: function (result) {
                            GetProgramTemplateList();
                        },
                    });
                }

            },
            no: function () {

            }
        }
    });

}
function DeleteProgram(ClientFormID, button) {

    $.confirm({
        icon: 'fas fa-exclamation-triangle',
        title: 'Confirm',
        content: 'Are you sure,you want to delete this form?',
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
                        url: Apipath + '/api/PatientMain/deleteClientForm?ClientFormID=' + ClientFormID,
                        contentType: 'application/json; charset=UTF-8',
                        dataType: "json",
                        success: function (result) {
                            if (result.DeleteStatus == 0) {
                                toastr.error("", result.Message, { progressBar: true });
                            }
                            else if (result.DeleteStatus == 1) {
                                toastr.success("", "Deleted successfully", { progressBar: true });
                                _programDataTable.row(btn.parents('tr')).remove().draw();
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
function getTemplates(obj) {
    if ($(obj).prop("checked")) {
        $.ajax({
            type: "GET",
            url: Apipath + '/api/PatientMain/getClientFormtemplatedropdownlist',
            contentType: 'application/json; charset=UTF-8',
            dataType: "json",
            success: function (result) {
                if (result.length) {
                    var templates = $("#ddlTemplate");
                    templates.html("");
                    $.each(result, function (data, value) {
                        templates.append($("<option></option>").val(value.TemplateID + ':' + value.TemplatePath).html(value.FormName));
                    });
                    $(".templateDiv").removeClass("hide");
                } else {
                    $('#radioScratch').prop("checked", true)
                    toastr.error("", "No Client Form template available.", { progressBar: true });
                }
            },
        });

    } else {
        $(".templateDiv").addClass("hide");
    }
}

//save program and call proceed to modify it,

function CreateClientForm() {
   
    let formName = $("#templateName").val().trim();

    if (formName == '') {
        toastr.error("Please fill in the Client Form name.")
        return;
    }
   // var isBtemplate = isBaseTemplate == 'true'
    //programName = $(".templatename-input").val();
    var model = {
        TemplateID: 0,
        formName: formName,
        CreatedBy: userId,
        ModifiedBy: userId,
        IsBaseTemplate: false,
        ClientFormID: 0,
        IsModify: false
    };
    var temPath =''
    //check if program exits
   
    if ($("#radioBaseTemplate").prop("checked")) {
        temPath = $("#radioBaseTemplate").attr("data-baseTemplatePath")
    }
    else if ($("#radioExistTemplate").prop("checked")) {
        var value = $("#ddlTemplate").val();
        var valueSplit = value.split(':')
        temPath = valueSplit[1];
    }
    else {
        temPath=''
    }
    $.ajax({
        type: "GET",
        url: '/Client/isClientFormNameexist?formName=' + formName + '&&clientFormID=0',
        contentType: 'application/json; charset=UTF-8',
        dataType: "json",
        success: function (result) {
           
            if (result.formNameExists) {
                toastr.error("", "Client Form already exists", { progressBar: true });
                return;
            }
            else {

                $(".loaderOverlay").css("display", "flex");
                $.ajax({
                    type: "POST",
                    url: '/Client/SaveClientFormTemplate',
                    data: JSON.stringify({ Model: model, formName: formName, IsModify: false, TemplatePath: temPath }),
                    contentType: 'application/json; charset=UTF-8',
                    dataType: "json",
                    success: function (result) {
                       
                        var Res = JSON.parse(result.id);

                        if (Res.TemplateID == 0) {
                            toastr.error("Client Form Already Exist.");
                            $(".loaderOverlay").hide();
                            return false;
                        }
                    }
                }).done(function (result) {
                 
                    var _result = JSON.parse(result.id);
                    
                    if (_result.TemplateID != 0) {
                        var models = [];
                        models.push({ ColDataType: "int", ColumnName: "PatientID" });

                        var UniqueItems = models.reduce(function (item, e1) {
                            var matches = item.filter(function (e2) { return e1.ColumnName == e2.ColumnName });
                            if (matches.length == 0) {
                                item.push(e1);
                            }
                            return item;
                        }, []);

                        var model = {
                            TableName: _result.TemplateTable,
                            ColumnData: UniqueItems
                        }
                        $.ajax({
                            type: "POST",
                            url: Apipath + '/api/PatientMain/addClientFormtemplatecolumn',
                            contentType: 'application/json; charset=UTF-8',
                            data: JSON.stringify(model),
                            dataType: "json",
                            success: function (res) {
                                
                                toastr.success("Saved successfully.");
                                $(".loaderOverlay").hide();
                                let data = {
                                    TemplateTable: _result.TemplateTable,
                                    ClientFormID: _result.ClientFormID,
                                    TemplateID: _result.TemplateID,
                                    IsBaseTemplate: false
                                }
                                    ProceedProgram(data);
                            },
                        });
                    }
                });

            }
        }
    }); 
}


function ProceedProgram(data) {
  
    data.FormName
    let FormName = $("#templateName").val().trim();
    let model = {};
    
    if (data.FormName != undefined) {
        FormName = data.FormName
    }
   
        model = {
            FormName: FormName,
            TemplateID: data.TemplateID,
            IsBaseTemplate: data.IsBaseTemplate,
            TemplateTable: data.TemplateTable,
            IsModify: true,
            ClientFormID: data.ClientFormID
        }
     
    
    
    $.ajax({
        type: "POST",
        url: '/Client/GetClientFormTemplateData',
        data: JSON.stringify(model),
        contentType: 'application/json; charset=UTF-8',
        dataType: "json",
        success: function (result) {
            
            if (result.isRedirect) {
                  //sessionStorage.clear();
                window.location.href = result.redirectUrl;
            }
        },
    });
}

function GetBaseTemplateId() {
    $.ajax({
        type: "GET",
        url: Apipath + '/api/PatientMain/getClientFormbasetemplateid',
        contentType: 'application/json; charset=UTF-8',
        dataType: "json",
        success: function (result) {
            switch (result.TemplateID ) {
                default:
                    $("#radioBaseTemplate").attr("data-baseid", result.TemplateID);
                    $("#radioBaseTemplate").attr("data-baseTemplatePath", result.TemplatePath);
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
function ViewProgramContent(ID,name) {
    $(".loaderOverlay").show();
    $("#PreviewModalTitle").html("").append(name);
    $.ajax({
        type: "GET",
        url: '/Client/GetClientFormTemplateById?TemplateId=' + ID,
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
            $(".priority").sortable();
            $(".loaderOverlay").hide();
        },
        error: function (e) {
            toastr.error("Something happen Wrong");
            $(".loaderOverlay").hide();
        }
    });   
}
function ViewHeaderAndFooter() {
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
                    $.ajax({
                        type: "GET",
                        url: '/Client/GetClientFormHtmlById?Id=' + result.TemplateID,
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
            toastr.error("Something happen Wrong");
            $(".loaderOverlay").hide();
        }
    });
}
var totalScore=0
function SetStatus(clientformid) {
   
    $.ajax({
        type: "GET",
        url: Apipath + '/api/PatientMain/getstatusscoreclientforms?clientformid=' + clientformid,
        contentType: 'application/json; charset=UTF-8',
        dataType: "json",
        async: false,
        success: function (res) {
            var result = res[0]
            if (result.TotalScore) {

                if (result.TotalScore == null || result.TotalScore == '' || result.TotalScore == 0) {
                    toastr.error("There is no scorable field");

                } else {
                    totalScore = result.TotalScore
                    $('#totalScore').text(totalScore)
                    if (result.AtRisk != '') {

                        var crisis = result.Crisis.split('-');
                        var struggling = result.Struggling.split('-');
                        var secure = result.Secure.split('-');
                        var atRisk = result.AtRisk.split('-');
                        $('#atRiskMin').val(atRisk[0])
                        $('#atRiskMax').val(atRisk[1])
                        $('#crisisMin').val(crisis[0])
                        $('#crisisMax').val(crisis[1])
                        $('#StrugglingMin').val(struggling[0])
                        $('#StrugglingMax').val(struggling[1])
                        $('#secureMin').val(secure[0])
                        $('#secureMax').val(secure[1])
                    } else {
                        $('#atRiskMin').val(0)
                        $('#atRiskMax').val(0)
                        $('#crisisMin').val(0)
                        $('#crisisMax').val(0)
                        $('#StrugglingMin').val(0)
                        $('#StrugglingMax').val(0)
                        $('#secureMin').val(0)
                        $('#secureMax').val(0)
                    }
                    $('#saveStatusForForm').attr('onclick', 'saveStatusForForm(' + clientformid + ')')
                    $('#saveStatusForForm').addClass('disabled')
                    $('#saveStatusForForm').css('pointer-events', 'none')
                    $('#ClientScore').modal('show')

                }
            }
            else {
                toastr.error("There is no scorable field");
            }

        }, error: function (e) {
            toastr.error("Something happen Wrong");
            $(".loaderOverlay").hide();
        }
    });
}

$('#atRiskMax,#secureMax,#StrugglingMax,#crisisMax').on('keyup change',function (e) {
    var item=$(this)
    var isValid = true;
    var message = ''
    var value = item.val()
    var id = item[0].id
    var secureValue = $('#secureMax').val()
    var strugglingValue = $('#StrugglingMax').val();
    var atRiskValue = $('#atRiskMax').val();

    secureValue = secureValue == '' ? 0 : +secureValue;
    strugglingValue = strugglingValue == '' ? 0 : +strugglingValue;
    atRiskValue = atRiskValue == '' ? 0 : +atRiskValue;
    value = value == '' ? 0 : +value;

    if (id == 'secureMax') {
        if (value >= totalScore) {
            isValid = false;
            message = 'Value Should be less than total score';
        }
        else if (atRiskValue != 0 || strugglingValue != 0) {
            if (atRiskValue != 0 && atRiskValue <= value) {
                isValid = false;
                message = 'Value cant be bigger than atRisk max value';
            } else if (strugglingValue != 0 && strugglingValue<= value) {
                isValid = false;
                message = 'Value cant be bigger than StrugglingMax max value';
            } 
        }
    }
    if (id == 'atRiskMax') {
        if (value >= totalScore) {
            isValid = false;
            message = 'Value Should be less than total score';
        }
        else if (secureValue != 0|| strugglingValue != 0) {
            if (secureValue != 0 && secureValue >= value) {
                isValid = false;
                message = 'Value cant be less than Secure max value';
            } else if (strugglingValue != 0 && strugglingValue >= value) {
                isValid = false;
                message = 'Value cant be more than Struggling Max value';
            } 
        }
    } 
   
    if (id == 'StrugglingMax') {
        if (value >= totalScore) {
            isValid = false;
            message = 'Value Should be less than total score';
        }
        else if (secureValue!= 0 || atRiskValue != 0) {
            if (atRiskValue != 0 && atRiskValue <= value) {
                isValid = false;
                message = 'Value cant be less than atRisk max value';
            } else if (secureValue != 0 && secureValue >= value) {
                isValid = false;
                message = 'Value cant be bigger than secure max value';
            }
        }
    }
    
    if (id == 'secureMax' && isValid) {
        $('#StrugglingMin').val(secureValue+1);
    }
    if (id == 'atRiskMax' && isValid) {
        $('#crisisMin').val(atRiskValue+1);
    }
    if (id == 'StrugglingMax' && isValid) {
        $('#atRiskMin').val(strugglingValue+1);
    }

    //if (!isValid) {
    //    $('.errorMessageWrap').show()
    //    $('#ClientScore .errorMessage').html(message);
    //} else {
    //    $('.errorMessageWrap').hide()
    //}
    ValidateFuctionBeforeSave()
    
})


function ValidateFuctionBeforeSave() {
    
    var secureValue = $('#secureMax').val()
    var strugglingValue = $('#StrugglingMax').val();
    var atRiskValue = $('#atRiskMax').val();
    var crisisValue = $('#crisisMax').val();
    secureValue = secureValue == '' ? 0 : +secureValue;
    strugglingValue = strugglingValue == '' ? 0 : +strugglingValue;
    atRiskValue = atRiskValue == '' ? 0 : +atRiskValue;
    crisisValue = crisisValue == '' ? 0 : +crisisValue;
    var message = '';
    var IsValid = true
    
    if (secureValue == '' || secureValue == 0) {
        IsValid = false
        message = +'<span class="errorMessage">Secure Max cant be empty or zero</span>'

    }
    if (strugglingValue == '' || strugglingValue == 0) {
        IsValid = false
        message = +'<span class="errorMessage">Struggling Max cant be empty or zero</span>'
    }
    if (atRiskValue == '' || atRiskValue == 0) {
        IsValid = false
        message = +'<span class="errorMessage">At risk Max cant be empty or zero</span>'
    }
    if (crisisValue == '' || crisisValue == 0) {
        IsValid = false
        message = +'<span class="errorMessage">At risk Max cant be empty or zero</span>'
    }
    if (secureValue >= totalScore) {
        IsValid = false
        message = +'<span class="errorMessage">Secure Max cant be more than total score</span>'
    }
    if (crisisValue > totalScore) {
        IsValid = false
        message = +'<span class="errorMessage">Secure Max cant be more than total score</span>'
    }
    if (strugglingValue >= totalScore) {
        IsValid = false
        message = +'<span class="errorMessage">Struglling Max cant be more than total score</span>'
    }
    if (atRiskValue >= totalScore) {
        IsValid = false
        message = +'<span class="errorMessage">At Risk Max cant be more than total score</span>'
    }
    if ((secureValue >= strugglingValue || secureValue >= atRiskValue)) {
        IsValid = false
        message = +'<span class="errorMessage">Secure Max cant be more than Struggling Max and AtRisk Max</span>'
    }
    if (secureValue >= atRiskValue || strugglingValue >= atRiskValue) {
        IsValid = false
        message = +'<span class="errorMessage">At Risk Max cant be more than Struggling Max and less than Secure Max</span>'

    }
    if (atRiskValue <= strugglingValue || secureValue >= strugglingValue) {
        IsValid = false
        message = +'<span class="errorMessage">Struggling Max cant be less than Secure Max and AtRisk Max</span>'
    }
    if (crisisValue <= strugglingValue || crisisValue <= secureValue || crisisValue <= atRiskValue) {
        IsValid = false
    }
    if (IsValid) {
        $('#saveStatusForForm').removeClass('disabled')
        $('#saveStatusForForm').css('pointer-events', 'all')
       // $('.errorMessageWrap').hide()
    } else {
        $('#saveStatusForForm').addClass('disabled')
        $('#saveStatusForForm').css('pointer-events', 'none')
       // $('.errorMessageWrap').show()
        //$('#ClientScore .errorMessage').html(message);
    }
   
}



function saveStatusForForm(clientFormId = 0) {
    let model = {
        ClientFormId: clientFormId,
        Crisis: $('#crisisMin').val() + '-' + $('#crisisMax').val(),
        Struggling: $('#StrugglingMin').val() + '-' + $('#StrugglingMax').val(),
        AtRisk: $('#atRiskMin').val() + '-' + $('#atRiskMax').val(),
        Secure: $('#secureMin').val() + '-' + $('#secureMax').val()
    }
    $.ajax({
        type: "Post",
        url: Apipath + '/api/PatientMain/saveclientformstatus',
        contentType: 'application/json; charset=UTF-8',
        data: JSON.stringify(model),
        dataType: "json",
        success: function (result) {

            $('#ClientScore').modal('hide');
            
        }, error: function () {
            toastr.error("Something happen Wrong");
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


$('#templateName').on('keyup', function (e) {

    var programText = this.value.length;
    var warningText = $('#warning');
    var charactersRemaining = 100 - programText;
   
    
    if (charactersRemaining <= 5) {
        warningText.removeClass('hidden');
        warningText.text(charactersRemaining + ' characters are remaining');
        warningText.css('color', 'red');

    }
    else if (charactersRemaining <= 10) {
        warningText.removeClass('hidden');
        warningText.text(charactersRemaining + ' characters are remaining');
        warningText.css('color', '#FF8C00');
    }
    else if (charactersRemaining <= 15) {
        warningText.removeClass('hidden');
        warningText.text(charactersRemaining + ' characters are remaining');
        warningText.css('color', '#CCCC00');
    }
    else if (charactersRemaining <= 20) {
        warningText.removeClass('hidden');
        warningText.text(charactersRemaining + ' characters are remaining');
        warningText.css('color', 'green');
    }
    else {
        warningText.addClass('hidden');
        warningText.text('');
    }

})

var windowWidth = $(window).width()
    $(window).resize(function () {
    var finalWindowWidth = $(window).width()
    if (windowWidth != finalWindowWidth) {
        GetProgramTemplateList()
        windowWidth = finalWindowWidth;
    }
})
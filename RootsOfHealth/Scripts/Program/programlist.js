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
        url: Apipath + '/api/PatientMain/getprogramtemplatelist',
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var programlist = $(".programlist");
            var programs = "";
            if (result.length) {
                $.each(result, function (index, item) {
                    
                    programs += `<tr>
                         <td width="15%">${(item.ProgramsName == null && item.IsBaseTemplate == true) ? "Base Template" : item.ProgramsName}</td>
                         <td width="10%">${(item.IsActive == null) ? "Not Started" : (item.IsActive == 0)?"In Progress":"Completed"}</td >
                         <td width="15%">${item.ModifiedDate != null ? item.ModifiedDate.split("T")[0] : ""}</td>
                         <td width="10%">${(item.IsActive==1 && item.IsBaseTemplate == false) ? (item.Isactivated == 1 ? "Yes" : "No") : ""}</td>
                            <td width="30%"><div>`;
                    programs += `<a href="javascript:void(0)" onclick="ViewProgramContent(${item.TemplateID},\'${(item.ProgramsName == null && item.IsBaseTemplate == true) ? "Base Template" : item.ProgramsName}'\)" class="btn btn-success text-white" style="cursor:pointer;">VIEW</a>`
                    if (item.IsBaseTemplate) {
                        ;
                        item.IsActive = item.IsActive == null ? false : true;
                        programs += `<a href="/program/ProgramBaseTemplate?templateid=${item.TemplateID}&Status=${item.IsActive}"  class="btn btn-success text-white" style="cursor:pointer;">MODIFY</a>`

                    } else {                        
                        programs += `<a href="javascript:void(0)" onclick="ProceedProgram({TemplateID:${item.TemplateID},TemplateTable:\'${item.TemplateTable}\',ProgramName:\'${item.ProgramsName}\',ProgramID:${item.ProgramID},IsBaseTemplate:${item.IsBaseTemplate}})"  class="btn btn-success text-white" style="cursor: pointer; ${item.Isactivated == true ? "display:none;" : ""} ">MODIFY</a>`
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
                        programs += `<a href="javascript:void(0)" onclick="DeleteProgram(${item.ProgramID},this)"  class="btn btn-success text-white" style="cursor:pointer;">Delete</a>`;
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
                'columnDefs': [{
                    'targets': [4],
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
function SetTemplateStatus(Templateid, Status) {
    $.confirm({
        icon: 'fas fa-exclamation-triangle',
        title: 'Confirm',
        content: Status == true ? 'This template will be activated and users will have access. Do you want to continue?' : 'Are you sure you want to de-activate.?',
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
                        url: Apipath + '/api/PatientMain/updateprogramtemplatestatus?Templateid=' + Templateid + '&status=' + Status,
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
function DeleteProgram(_programId, button) {

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
                        url: Apipath + '/api/PatientMain/deleteprogram?Programid=' + _programId,
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
            url: Apipath + '/api/PatientMain/getprogramtemplatedropdownlist',
            contentType: 'application/json; charset=UTF-8',
            dataType: "json",
            success: function (result) {
                if (result.length) {
                    var templates = $("#ddlTemplate");
                    templates.html("");
                    $.each(result, function (data, value) {
                        templates.append($("<option></option>").val(value.TemplateID +':'+value.TemplatePath).html(value.ProgramsName));
                    });
                    $(".templateDiv").removeClass("hide");
                } else {
                    toastr.error("", "No program template available.", { progressBar: true });
                }
            },
        });

    } else {
        $(".templateDiv").addClass("hide");
    }
}

//save program and call proceed to modify it,

function CreateProgram() {
    
    let ProgramName = $("#templateName").val().trim();
   // var isBtemplate = isBaseTemplate == 'true'
    //programName = $(".templatename-input").val();
    var model = {
        TemplateID: 0,
        ProgramName: ProgramName,
        CreatedBy: userId,
        ModifiedBy: userId,
        IsBaseTemplate: false,
        ProgramID: 0,
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
        url: '/Program/IsProgramExist?ProgramName=' + ProgramName + '&&ProgramId=0',
        contentType: 'application/json; charset=UTF-8',
        dataType: "json",
        success: function (result) {
            if (result.programExists) {
                toastr.error("", "Program already exists", { progressBar: true });
                return;
            }
            else {

                $(".loaderOverlay").css("display", "flex");
                $.ajax({
                    type: "POST",
                    url: '/Program/SaveFormTemplate',
                    data: JSON.stringify({ Model: model, ProgramName: ProgramName, IsModify: false, TemplatePath: temPath }),
                    contentType: 'application/json; charset=UTF-8',
                    dataType: "json",
                    success: function (result) {
                        
                        var Res = JSON.parse(result.id);

                        if (Res.TemplateID == 0) {
                            toastr.error("Program Already Exist.");
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
                            url: Apipath + '/api/PatientMain/AddProgramTemplateColumn',
                            contentType: 'application/json; charset=UTF-8',
                            data: JSON.stringify(model),
                            dataType: "json",
                            success: function (res) {
                                toastr.success("Saved successfully.");
                                $(".loaderOverlay").hide();
                                let data = {
                                    TemplateTable: _result.TemplateTable,
                                    ProgramID: _result.ProgramID,
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
    data.programName
    let ProgramName = $("#templateName").val().trim();
    let model = {};
    
    if (data.ProgramName != undefined) {
        ProgramName = data.ProgramName
    }
   
        model = {
            ProgramName: ProgramName,
            TemplateID: data.TemplateID,
            IsBaseTemplate: data.IsBaseTemplate,
            TemplateTable: data.TemplateTable,
            IsModify: true,
            ProgramID: data.ProgramID
        }
     
    
    
    $.ajax({
        type: "POST",
        url: '/Program/GetProgramTemplateData',
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
        url: Apipath + '/api/PatientMain/getprogrambasetemplateid',
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
        url: '/program/GetProgramTemplateById?TemplateId=' + ID,
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
            toastr.error("Unidentified error");
            $(".loaderOverlay").hide();
        }
    });   
}
function ViewHeaderAndFooter() {
    $.ajax({
        type: "GET",
        url: Apipath + '/api/PatientMain/GetProgramBaseTemplateId',
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
                        url: '/program/GetFormHtmlById?Id=' + result.TemplateID,
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
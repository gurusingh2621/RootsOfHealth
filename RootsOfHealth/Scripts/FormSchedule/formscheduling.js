$(document).ready(function () {
    GetSchedulePlanTemplateList();
})
var _scheduleListTable = ''
var _programscheduleListTable = ''
$('#ProgramFormScheduling-tab').click(function () {
    GetProgramSchedulePlanTemplateList();
})
var NoScheduleText='no scheduling'
function GetSchedulingStatus(TimeValue) {
    if (TimeValue == null) {
        return true;
    } else {
        var split = TimeValue.split(':');
        if (split[0] == -1 || split[0] == -2) {
            return true;

        }
    }
    return false

}

function GetStatusName(item) {
    var split = item.split(':');
    var result = item.replace(':',' ')
    var Value = split[0];
    var Unit = split[1];
    if (Value > 1) {
        if (Unit == 'month') {
            result = result.replace('month','months')
        } else if (Unit == 'day') {
            result = result.replace('day', 'days')
        } else if (Unit == 'week') {
            result = result.replace('week', 'weeks')
        }
    } 
    return result;
}
function GetSchedulePlanTemplateList() {
   
    $(".loaderOverlay").css("display", "flex");
    $.ajax({
        type: "GET",
        url: Apipath + '/api/PatientMain/getclientformscheduling?FormType=1',
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            if (_scheduleListTable != '') {
                $('#tbl_formScheduling').DataTable().clear();
                $('#tbl_formScheduling').DataTable().destroy();
            }
            var formschedulelist = $(".formSchedulinglist");
            var formschedules = "";
            var secure;
            var struggling;
            var atrisk;
            var crisis;
            var nostatus;
            var isschedule;
            if (result.length) {
                $.each(result, function (index, item) {
                    secure = GetSchedulingStatus(item.Secure) ? "" : GetStatusName(item.Secure);
                    struggling = GetSchedulingStatus(item.Struggling) ? "" : GetStatusName(item.Struggling);
                    atrisk = GetSchedulingStatus(item.AtRisk) ? "" : GetStatusName(item.AtRisk);
                    crisis = GetSchedulingStatus(item.Crisis) ? "" : GetStatusName(item.Crisis);
                    nostatus = GetSchedulingStatus(item.NoStatus) ? "" : GetStatusName(item.NoStatus);
                    isschedule = item.NoSchedule
                    formschedules += `<tr>
                         <td width="20%">${item.FormName == null ? "" : item.FormName}</td>
                         <td width="15%">${(secure == '' || isschedule) ? NoScheduleText :'after every '+ secure}</td>
                          <td width="15%">${(struggling == '' || isschedule) ? NoScheduleText : 'after every ' + struggling }</td>
                         <td width="15%">${(atrisk == '' || isschedule) ? NoScheduleText : 'after every ' + atrisk}</td>
                         <td width="15%">${(crisis == '' || isschedule) ? NoScheduleText : 'after every ' + crisis}</td>
                         <td width="15%">${(nostatus == '' || isschedule) ? NoScheduleText : 'after every ' + nostatus}</td>
                         <td width="15%"><div>
                        <a href="javascript:void(0)"  onclick="SetFormScheduling({formScheduleid:'${item.FormSchedulingid}',formid:'${item.FormId}',formName:'${item.FormName}',crisis:'${item.Crisis}',struggling:'${item.Struggling}',secure:'${item.Secure}',atrisk:'${item.AtRisk}',nostatus:'${item.NoStatus}',noschedule:'${item.NoSchedule}'})"
                              class="btn btn-success text-white" style="cursor:pointer;">Edit</a></div></td>`
                          
                    formschedules += `</tr>`;
                });
                formschedulelist.html("").append(formschedules);
            } else {
                formschedules += `<tr><td colspan="7"><p class="text-center">No data found.</p></td></tr>`;
                formschedulelist.html("").append(formschedules);
            }
            _scheduleListTable = $('#tbl_formScheduling').DataTable({
                paging: false,
                retrieve: true,
                "scrollY": "calc(100vh - 380px)",
                searching: false,
                'columnDefs': [{
                    'targets': [6],
                    'orderable': false
                }]
            });
            $(".loaderOverlay").hide();
        },
        error: function (e) {
            toastr.error("Unexpected error!");
        }
    });
}
function GetProgramSchedulePlanTemplateList() {
    
    $(".loaderOverlay").css("display", "flex");
    $.ajax({
        type: "GET",
        url: Apipath + '/api/PatientMain/getclientformscheduling?FormType=2',
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            if (_programscheduleListTable != '') {
                $('#tbl_programformScheduling').DataTable().clear();
                $('#tbl_programformScheduling').DataTable().destroy();
            }
            var formschedulelist = $(".programformSchedulinglist");
            var formschedules = "";
          
            var nostatus;
            var isschedule;
            if (result.length) {
                $.each(result, function (index, item) {
                    nostatus = item.NoStatus == null ? "" : GetStatusName(item.NoStatus);
                    isschedule = item.NoSchedule
                    formschedules += `<tr>
                         <td width="20%">${item.FormName == null ? "" : item.FormName}</td>
                           <td width="15%">${(nostatus == '' || isschedule) ? '' : 'after every ' + nostatus}</td>
                         <td width="15%"><div>
                        <a href="javascript:void(0)"  onclick="SetProgramForm({formScheduleid:'${item.FormSchedulingid}',formid:'${item.FormId}',formName:'${item.FormName}',nostatus:'${item.NoStatus}',noschedule:'${item.NoSchedule}'})"
                              class="btn btn-success text-white" style="cursor:pointer;">Edit</a></div></td>`

                    formschedules += `</tr>`;
                });
                formschedulelist.html("").append(formschedules);
            } else {
                formschedules += `<tr><td colspan="3"><p class="text-center">No data found.</p></td></tr>`;
                formschedulelist.html("").append(formschedules);
            }
            _programscheduleListTable = $('#tbl_programformScheduling').DataTable({
                paging: false,
                retrieve: true,
                "scrollY": "calc(100vh - 380px)",
                searching: false,
                'columnDefs': [{
                    'targets': [2],
                    'orderable': false
                }]
            });
            $(".loaderOverlay").hide();
        },
        error: function (e) {
            toastr.error("Unexpected error!");
        }
    });
}


let formScheduleId = 0;
let formId = 0;
let formType = 0;

let SchedulingStatus = [];


function SetFormScheduling(formSchedulingObject) {
    formType=1
    $('#addSchedule').prop('disabled', true);
    $('#NoScheduleForStatus').prop('checked', false)
  //  $('#updateFormScheduling').prop('disabled', true)
    $('#tbl_ScoreSchedule tbody').html('')
    formId = formSchedulingObject.formid
    SchedulingStatus = []
    $('#programName').text(formSchedulingObject.formName)
    if (formSchedulingObject.formScheduleid == "null") {
        formScheduleId = 0
        $('#txtEvery').val('')
        $('#addSchedule').text('Add');
        $('#txtEvery').prop('disabled', false)
        $('#ddType').prop('disabled', false)
    } else {
        $('#addSchedule').text('Update');
        if (formSchedulingObject.noschedule == 'true') {
            $('#NoSchedule').prop('checked', true)
            $('#ddStatus').prop('disabled', true)
            $('#txtEvery').prop('disabled', true)
            $('#ddType').prop('disabled', true)
            $('#NoScheduleForStatus').prop('disabled', true)

        } else {
            $('#NoSchedule').prop('checked', false)
            $('#ddStatus').prop('disabled', false)
            $('#txtEvery').prop('disabled', false)
            $('#ddType').prop('disabled', false)
            $('#NoScheduleForStatus').prop('disabled', false)
        }
        

        formScheduleId = formSchedulingObject.formScheduleid
        if (formSchedulingObject.secure != 'null') {
            SchedulingStatus.push(GetValueAndUnit(formSchedulingObject.secure, 1))
        }
        if (formSchedulingObject.struggling != 'null') {
            
            SchedulingStatus.push(GetValueAndUnit(formSchedulingObject.struggling, 2))
           
        }
        if (formSchedulingObject.atrisk != 'null') {
            SchedulingStatus.push(GetValueAndUnit(formSchedulingObject.atrisk, 3))
        }
        if (formSchedulingObject.crisis != 'null') {
            SchedulingStatus.push(GetValueAndUnit(formSchedulingObject.crisis, 4))
        }
        if (formSchedulingObject.nostatus != 'null') {
            SchedulingStatus.push(GetValueAndUnit(formSchedulingObject.nostatus, 5))
        }
        CreateScoreScheduleHtml();
        $('#ddStatus').val(SchedulingStatus[0].StatusId)
        $('#txtEvery').val(SchedulingStatus[0].TimeValue)
        $('#ddType').val(SchedulingStatus[0].TimeUnitId)
        if (SchedulingStatus[0].TimeValue == '-1') {
            $('#NoScheduleForStatus').prop('checked', true)
            $('#txtEvery').val('')
            $('#ddType').val('')
            $('#txtEvery').prop('disabled', true)
            $('#ddType').prop('disabled', true)
        } else if (SchedulingStatus[0].TimeValue == '-2') {
            $('#NoScheduleForStatus').prop('checked', false)
            $('#txtEvery').val('')
            $('#ddType').val('')
            $('#txtEvery').prop('disabled', false)
            $('#ddType').prop('disabled', false)

        }else {
            $('#txtEvery').val(SchedulingStatus[0].TimeValue)
            $('#ddType').val(SchedulingStatus[0].TimeUnitId)
            $('#txtEvery').prop('disabled', false)
            $('#ddType').prop('disabled', false)
        }
       
    }
    $('#FormModal').modal('show');
}

function GetValueAndUnit(StatusValue, Id) {
    let object = {}
    if (StatusValue == -1 && StatusValue == -2) {
        object = {
            StatusId: Id,
            TimeValue: StatusValue,
            TimeUnitId: 1
        }

    } 
    else {
        var splitValue = StatusValue.split(':')
         object = {
             StatusId: Id,
             TimeValue: splitValue[0],
             TimeUnitId: GetTimeUnitId(splitValue[1])
        }
    }
    return object;
}


    function GetTimeUnitId(timeUnit,timvalue=0,getValue=true) {
        if (getValue) {
            if (timeUnit = 'day') {
                return 1
            }
            else if (timeUnit = 'week') {
                return 2
            }
            else if (timeUnit = 'month') {

                return 3
            }
        } else {
            if (timeUnit == 1) {
                if (timvalue > 1) {
                    return 'days'
                }
                return 'day'
            }
            else if (timeUnit == 2) {
                if (timvalue > 1) {
                    return 'weeks'
                }
                return 'week'
            }
            else if (timeUnit == 3) {
                if (timvalue > 1) {
                    return 'months'
                }
                return 'month'
            }
        }
       
    }


function CreateScoreScheduleHtml() {
    
    var scoreHtml = ''
    $('#tbl_ScoreSchedule tbody').html('')
    if (SchedulingStatus.length > 0) {
        let value = '';
        for (let i = 0; i < SchedulingStatus.length; i++) {
            value = SchedulingStatus[i]
           
            var text = ''
          
            if (value.TimeValue == -1 || value.TimeValue == -2) {
                text = `<td>${NoScheduleText}</td>`
            } else {
                text = `<td>After every ${value.TimeValue + ' ' + GetTimeUnitId(value.TimeUnitId, value.TimeValue, false)} </td>`
            }
            if (value.StatusId == 1) {
                scoreHtml += `<tr class="Securerow">
                    <td>Secure</td>
                    ${text}
                        </tr>`

            }
            if (value.StatusId == 2) {
               
                scoreHtml += `<tr class="StrugglingRow">
                    <td>Struggling</td>
                     ${text}
                        </tr>`
            }
            if (value.StatusId == 3) {
                
                scoreHtml += `<tr class="AtRiskRow">
                    <td>At Risk</td>
                     ${text}
                        </tr>`
            }
            if (value.StatusId == 4) {
               
                scoreHtml += `<tr class="Crisisrow">
                    <td>Crisis</td>
                     ${text}
                        </tr>`
            }
            if (value.StatusId == 5) {
              
                scoreHtml += `<tr class="NoStatusrow">
                    <td>No status</td>
                      ${text}
                        </tr>`
            }
            if (scoreHtml != '') {
                $('#tbl_ScoreSchedule tbody').html(scoreHtml)
            }
        }
    }

}

function AddSchedule(fromCheckBox=false) {
    let status = $('#ddStatus').val()
    let value = $('#txtEvery').val()
    let timeunit = $('#ddType').val()
    let isChecked = $('#NoScheduleForStatus').is(':checked')

    if (status == 0  && !fromCheckBox) {
        toastr.error("Please select a score criteria");
        return;
    }
    if (value == 0 && !fromCheckBox) {
        toastr.error("please enter days");
        return;
    }
    if (timeunit == 0 && !fromCheckBox) {
        toastr.error("Please select a time unit");
        return;
    }
    
    if (fromCheckBox) {
        if (isChecked) {
            value = -1
            timeunit = 1
            $('#txtEvery').prop('disabled', true)
            $('#ddType').prop('disabled', true)
        } else {
            value = -2
            timeunit = 1
            $('#txtEvery').prop('disabled', false)
            $('#ddType').prop('disabled', false)
        }
    }
   
    let index = SchedulingStatus.findIndex(c => c.StatusId == status);
    if (index > -1){
        SchedulingStatus.splice(index, 1);
    }
    let object = {
        StatusId: +status,
        TimeValue: +value,
        TimeUnitId: +timeunit
    }
    $('#addSchedule').prop('disabled', true);
       SchedulingStatus.push(object);
       SchedulingStatus.sort(c => c.StatusId)
       CreateScoreScheduleHtml();
       UpdateFormScheduling()
       
}


$('#ddType').change(function () {
    EnableAddScheduleButton()
})
$('#txtEvery').on('input', function () {
    EnableAddScheduleButton();
})


$('#ddStatus').change(function () {
    $('#txtEvery').val("");
    $('#ddType').val("")
    $('#txtEvery').prop('disabled', false)
    $('#ddType').prop('disabled', false)
    let item = SchedulingStatus.find(c => (c.StatusId == $(this).val()));
    
    if (item != undefined){
       
        $('#addSchedule').text('Update');
        if (item.TimeValue == -1) {
            $('#NoScheduleForStatus').prop('checked', true);
            $('#txtEvery').prop('disabled',true)
            $('#ddType').prop('disabled', true)
        } else if (item.TimeValue != -1 && item.TimeValue != -2) {
            $('#NoScheduleForStatus').prop('checked', false);
            $('#txtEvery').val(item.TimeValue);
            $('#ddType').val(item.TimeUnitId);
        } else {
            $('#NoScheduleForStatus').prop('checked', false);


        }
    } else {
        $('#addSchedule').text('Add');
    }
    EnableAddScheduleButton()
})

$('#NoScheduleForStatus').click(function () {
    $('#txtEvery').val("")
    $('#ddType').val("")
   
    AddSchedule(true);
})

function EnableAddScheduleButton() {
    let status = $('#ddStatus').val()
    let time = $('#txtEvery').val();
    let timeunit = $('#ddType').val()

    let index = SchedulingStatus.findIndex(c => (c.StatusId == status && c.TimeValue == time && c.TimeUnitId == timeunit))

    if (index == -1 && status != '' && time != '' && timeunit != '' && status != null && time != null && timeunit != null) {
        $('#addSchedule').prop('disabled', false);
    } else {
        $('#addSchedule').prop('disabled', true);
    }
    
}
//function EnableUpdateButton() {
//    if (SchedulingStatus.length > 4) {
//        $('#updateFormScheduling').prop('disabled', false)
//    } else {
//        $('#updateFormScheduling').prop('disabled', true)
//    }
//}


function UpdateFormScheduling() {
    
    var isNoSchedule = $('#NoSchedule:checkbox:checked').length > 0
    
    var model = {
        FormSchedulingId: formScheduleId,
        FormId: formId,
        Type: formType,
        IsNotScheduled: isNoSchedule,
        SchedulingValues: SchedulingStatus
    }
    
    $.ajax({
        type: "POST",
        url: Apipath + '/api/PatientMain/saveformscheduling',
        contentType: 'application/json; charset=UTF-8',
        data: JSON.stringify(model),
        dataType: "json",
        success: function (res) {
            toastr.success("Saved successfully.");
            //$('#FormModal').modal('hide');
            //GetSchedulePlanTemplateList()
            $(".loaderOverlay").hide();
        },
    });
}


$('#NoSchedule').change(function () {
    var isChecked = $(this).is(':checked');
    if (isChecked) {
        $.confirm({
            icon: 'fas fa-exclamation-triangle',
            title: 'Confirm',
            content: 'This action would set no scheduling for all criteria,Press Confirm to continue.',
            type: 'red',
            typeAnimated: true,
            buttons: {
                confirm: {
                    btnClass: 'btn-danger',
                    action: function () {
                        SchedulingStatus = [];
                        for (let i = 1; i < 6; i++) {
                            object = {
                                StatusId: i,
                                TimeValue: -1,
                                TimeUnitId: 1
                            }
                            SchedulingStatus.push(object);
                        }
                        UpdateFormScheduling();
                        CreateScoreScheduleHtml();
                        $('#NoScheduleForStatus').prop('checked', true)
                        $('#txtEvery').val('')
                        $('#ddType').val('')
                        $('#ddStatus').prop('disabled', true)
                        $('#txtEvery').prop('disabled', true)
                        $('#ddType').prop('disabled', true)
                        $('#NoScheduleForStatus').prop('disabled', true)
                    }
                },
                cancel: function () {
                    $('#NoSchedule').prop('checked', false)
                }
            }

        });
    } else {
        for (let i = 0; i < SchedulingStatus.length; i++) {
            SchedulingStatus[i].TimeUnitId = 1;
            SchedulingStatus[i].TimeValue = -2;
        }
        $('#ddStatus').prop('disabled', false)
        $('#txtEvery').prop('disabled', false)
        $('#ddType').prop('disabled', false)
        UpdateFormScheduling();
        CreateScoreScheduleHtml();
        $('#NoScheduleForStatus').prop('checked', false)
        $('#txtEvery').val('')
        $('#ddType').val('')
        $('#txtEvery').prop('disabled', false)
        $('#ddType').prop('disabled', false)
        $('#NoScheduleForStatus').prop('disabled', false)

    }
   
})



function SetProgramForm(formSchedulingObject) {
    formType = 2
    $('#tblProgramUpdate').prop('disabled', true)
   
    formId = formSchedulingObject.formid
    SchedulingStatus = []
    $('#lblProgramFormName').text(formSchedulingObject.formName)
    if (formSchedulingObject.formScheduleid == "null") {
        formScheduleId = 0

        $('#txtEveryprogram').val('')

    } else {
        if (formSchedulingObject.noschedule == 'true') {
            $('#NoProgramSchedule').prop('checked', true)
        } else {
            $('#NoProgramSchedule').prop('checked', false)
        }
       
        formScheduleId = formSchedulingObject.formScheduleid
        if (formSchedulingObject.nostatus != 'null') {
            let NoStatus = formSchedulingObject.nostatus.split(':')
            let object = {
                StatusId: 5,
                TimeValue: NoStatus[0],
                TimeUnitId: GetTimeUnitId(NoStatus[1])
            }
            SchedulingStatus.push(object)
            $('#txtEveryprogram').val(SchedulingStatus[0].TimeValue)
            $('#ddTypeprogram').val(SchedulingStatus[0].TimeUnitId)
        }
    }
    $('#ProgramFormModal').modal('show');
}


$('#txtEveryprogram,#ddTypeprogram').change(function () {
    EnableProgramUpdate()
})

function EnableProgramUpdate() {

    let timeValue = $('#txtEveryprogram').val();
    let timeUnit = $('#ddTypeprogram').val();
    if (timeValue != '' && timeUnit != '' && timeValue != null && timeUnit != null) {
        $('#tblProgramUpdate').prop('disabled', false)
    }
    else {
        $('#tblProgramUpdate').prop('disabled', true)
    }
}

function UpdateProgramFormScheduling() {
    var isNoSchedule = $('#NoProgramSchedule:checkbox:checked').length > 0
    let timeValue = $('#txtEveryprogram').val();
    let timeUnit = $('#ddTypeprogram').val();
    SchedulingStatus = [];
    if (!isNoSchedule) {
        SchedulingStatus.push({
            StatusId: 5,
            TimeValue: +timeValue,
            TimeUnitId: +timeUnit
        })
    }
   
    var model = {
        FormSchedulingId: formScheduleId,
        FormId: formId,
        Type: formType,
        IsNotScheduled: isNoSchedule,
        SchedulingValues: SchedulingStatus
    }

    $.ajax({
        type: "POST",
        url: Apipath + '/api/PatientMain/saveformscheduling',
        contentType: 'application/json; charset=UTF-8',
        data: JSON.stringify(model),
        dataType: "json",
        success: function (res) {
            toastr.success("Saved successfully.");
            $('#ProgramFormModal').modal('hide');
            GetProgramSchedulePlanTemplateList()
            $(".loaderOverlay").hide();
        },
    });

}

$('#NoProgramSchedule').change(function () {

    var isChecked = $(this).is(':checked');

    if (isChecked) {
        $('#tblProgramUpdate').prop('disabled', false)
    } else {
        EnableProgramUpdate()
    }

})

$('#FormModal').on('hidden.bs.modal', function (e) {
    GetSchedulePlanTemplateList()
})
var windowWidth = $(window).width()
$(window).resize(function () {
    var finalWindowWidth = $(window).width()
    if (windowWidth != finalWindowWidth) {
        GetSchedulePlanTemplateList();
        GetProgramSchedulePlanTemplateList();
        windowWidth = finalWindowWidth;
    }
})


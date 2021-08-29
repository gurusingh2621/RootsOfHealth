$(document).ready(function () {
    GetSchedulePlanTemplateList(1);
})
var _scheduleListTable = ''
var _programscheduleListTable = ''
$('#ProgramFormScheduling-tab').click(function () {
    GetProgramSchedulePlanTemplateList();
})


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
                    secure = item.Secure == null ? "" : item.Secure.replace(':', ' ');
                    struggling = item.Struggling == null ? "" : item.Struggling.replace(':', ' ');
                    atrisk = item.AtRisk == null ? "" : item.AtRisk.replace(':', ' ');
                    crisis = item.Crisis == null ? "" : item.Crisis.replace(':', ' ');
                    nostatus = item.NoStatus == null ? "" : item.NoStatus.replace(':', ' ');
                    isschedule = item.NoSchedule
                    formschedules += `<tr>
                         <td width="20%">${item.FormName == null ? "" : item.FormName}</td>
                         <td width="15%">${(secure == '' || isschedule) ? '' :'after every'+ secure}</td>
                          <td width="15%">${(struggling == '' || isschedule) ? '' : 'after every' + struggling }</td>
                         <td width="15%">${(atrisk == '' || isschedule) ? '' : 'after every' + atrisk}</td>
                         <td width="15%">${(crisis == '' || isschedule) ? '' : 'after every' + crisis}</td>
                         <td width="15%">${(nostatus == '' || isschedule) ? '' : 'after every' + nostatus}</td>
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
            toastr.error("Unidentified error");
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
                    nostatus = item.NoStatus == null ? "" : item.NoStatus.replace(':', ' ');
                    isschedule = item.NoSchedule
                    formschedules += `<tr>
                         <td width="20%">${item.FormName == null ? "" : item.FormName}</td>
                           <td width="15%">${(nostatus == '' || isschedule) ? '' : 'after every' + nostatus}</td>
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
            toastr.error("Unidentified error");
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
    $('#updateFormScheduling').prop('disabled', true)
    $('#tbl_ScoreSchedule tbody').html('')
    formId = formSchedulingObject.formid
    SchedulingStatus = []
    $('#programName').text(formSchedulingObject.formName)
    if (formSchedulingObject.formScheduleid == "null") {
        formScheduleId = 0
       
       $('#txtEvery').val('')

    } else {
        if (formSchedulingObject.noschedule == 'true') {
            $('#NoSchedule').prop('checked',true)
        } else {
            $('#NoSchedule').prop('checked', false)
        }
        

        formScheduleId = formSchedulingObject.formScheduleid
        if (formSchedulingObject.secure != 'null') {
            let Secure = formSchedulingObject.secure.split(':')
            let object = {
                StatusId: 1,
                TimeValue: Secure[0],
                TimeUnitId: GetTimeUnitId(Secure[1])
            }
            SchedulingStatus.push(object)
        }
        if (formSchedulingObject.struggling != 'null') {
            let Struggling = formSchedulingObject.struggling.split(':')
            let object = {
                StatusId: 2,
                TimeValue: Struggling[0],
                TimeUnitId: GetTimeUnitId(Struggling[1])
            }
            SchedulingStatus.push(object)
           
        }
        if (formSchedulingObject.atrisk != 'null') {
            let AtRisk = formSchedulingObject.atrisk.split(':')
            let object = {
                StatusId: 3,
                TimeValue: AtRisk[0],
                TimeUnitId: GetTimeUnitId(AtRisk[1])
            }
            SchedulingStatus.push(object)
        }
        if (formSchedulingObject.crisis != 'null') {
            let crisis = formSchedulingObject.crisis.split(':')
            let object = {
                StatusId: 4,
                TimeValue: crisis[0],
                TimeUnitId: GetTimeUnitId(crisis[1])
            }
            SchedulingStatus.push(object)
        }
        if (formSchedulingObject.nostatus != 'null') {
            let NoStatus = formSchedulingObject.nostatus.split(':')
            let object = {
                StatusId: 5,
                TimeValue: NoStatus[0],
                TimeUnitId: GetTimeUnitId(NoStatus[1])
            }
            SchedulingStatus.push(object)
        }
        CreateScoreScheduleHtml();
        $('#ddStatus').val(SchedulingStatus[0].StatusId)
        $('#txtEvery').val(SchedulingStatus[0].TimeValue)
        $('#ddType').val(SchedulingStatus[0].TimeUnitId)
    }
    $('#FormModal').modal('show');
}
    function GetTimeUnitId(timeUnit,getValue=true) {
        if (getValue) {
            if (timeUnit = 'Day') {
                return 1
            }
            else if (timeUnit = 'Week') {
                return 2
            }
            else if (timeUnit = 'Month') {

                return 3
            }
        } else {
            if (timeUnit == 1) {
                return 'Days'
            }
            else if (timeUnit == 2) {
                return 'Week'
            }
            else if (timeUnit == 3) {

                return 'Month'
            }
        }
       
    }


function CreateScoreScheduleHtml() {
    debugger
    var scoreHtml = ''
    $('#tbl_ScoreSchedule tbody').html('')
    if (SchedulingStatus.length > 0) {
        let value = '';
        for (let i = 0; i < SchedulingStatus.length; i++) {
            value = SchedulingStatus[i]
            if (value.StatusId == 1) {
                scoreHtml += `<tr class="Securerow">
                    <td>Secure</td>
                    <td>After every ${value.TimeValue + ' ' + GetTimeUnitId(value.TimeUnitId,false)} </td>
                        </tr>`

            }
            if (value.StatusId == 2) {
               
                scoreHtml += `<tr class="StrugglingRow">
                    <td>Struggling</td>
                     <td>After every ${value.TimeValue + ' ' + GetTimeUnitId(value.TimeUnitId, false)} </td>
                        </tr>`
            }
            if (value.StatusId == 3) {
                
                scoreHtml += `<tr class="AtRiskRow">
                    <td>At Risk</td>
                      <td>After every ${value.TimeValue + ' ' + GetTimeUnitId(value.TimeUnitId, false)} </td>
                        </tr>`
            }
            if (value.StatusId == 4) {
               
                scoreHtml += `<tr class="Crisisrow">
                    <td>Crisis</td>
                     <td>After every ${value.TimeValue + ' ' + GetTimeUnitId(value.TimeUnitId, false)} </td>
                        </tr>`
            }
            if (value.StatusId == 5) {
              
                scoreHtml += `<tr class="NoStatusrow">
                    <td>No status</td>
                      <td>After every ${value.TimeValue + ' ' + GetTimeUnitId(value.TimeUnitId, false)} </td>
                        </tr>`
            }
            if (scoreHtml != '') {
                $('#tbl_ScoreSchedule tbody').html(scoreHtml)
            }
        }
    }

}

function AddSchedule() {
    debugger
    let status = $('#ddStatus').val()
    let value = $('#txtEvery').val()
    let timeunit = $('#ddType').val()

    if (status == 0) {
        toastr.error("Please select a score criteria");
        return;
    }
    if (value == 0) {
        toastr.error("please enter days");
        return;
    }
    if (timeunit == 0) {
        toastr.error("Please select a time unit");
        return;
    }

    let index = SchedulingStatus.findIndex(c => c.StatusId == status);
    if (index > -1) {
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
    EnableUpdateButton()
}


$('#txtEvery,#ddType').change(function () {
    debugger
    EnableAddScheduleButton()
})


$('#ddStatus').change(function () {
    debugger
    $('#txtEvery').val("");
    $('#ddType').val("")
    let item = SchedulingStatus.find(c => (c.StatusId == $(this).val()));
    if (item != undefined)
    {
        $('#txtEvery').val(item.TimeValue);
        $('#ddType').val(item.TimeUnitId);
    }
    EnableAddScheduleButton()
})


function EnableAddScheduleButton() {
    let status = $('#ddStatus').val()
    let time = $('#txtEvery').val();
    let timeunit = $('#ddType').val()

    let index = SchedulingStatus.findIndex(c => (c.StatusId == status && c.TimeValue == time && c.TimeUnitId == timeunit))

    if (index == -1 && status != '' && time != '' && timeunit != '' && status != null && time != null && timeunit != null) {
        $('#addSchedule').prop('disabled', false);
    }
    
}
function EnableUpdateButton() {
    if (SchedulingStatus.length > 4) {
        $('#updateFormScheduling').prop('disabled', false)
    } else {
        $('#updateFormScheduling').prop('disabled', true)
    }
}


function UpdateFormScheduling() {
    
   var isNoSchedule= $('#NoSchedule:checkbox:checked').length > 0
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
            $('#FormModal').modal('hide');
            GetSchedulePlanTemplateList()
            $(".loaderOverlay").hide();
        },
    });
}


$('#NoSchedule').change(function(){

    let isChecked = $(this).is(':checked');
    if (isChecked) {
        $('#updateFormScheduling').prop('disabled', false)
    } else {
        EnableUpdateButton()
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
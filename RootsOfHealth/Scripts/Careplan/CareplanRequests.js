$(function () {
    LoadRequest();
    LoadRequestHistory();
})

var ReadCount = 0;
var InboxTable = ''
var HistoryTable = ''

function LoadRequest() {
    $(".loaderOverlay").css("display", "flex");
    $.ajax({
        type: "GET",
        url: Apipath + '/api/PatientMain/getrequests?type=1&userid=' + userId,
        contentType: 'application/json; charset=UTF-8',
        dataType: "json",
        async: true,
        success: function (result) {
            if (InboxTable != '') {
                InboxTable.clear();
                InboxTable.destroy();
            }
           
            var status=''
            var careplanlist = $(".carePlanRequestInbox");
            careplanlist.html('')
            
                var careplansRequest = "";
                if (result.length) {
                    $.each(result, function (index, item) {
                        if (!item.IsRead) {
                            ReadCount++;
                        }
                        if (item.SentOn) {
                            var SendDate = new Date(item.SentOn).toLocaleDateString('en-US')
                            var sendTimearray = item.SentOn.split("T")[1].split(":");
                            var sendAmPm = sendTimearray[0] >= 12 ? 'pm' : 'am';
                            var sendTime = sendTimearray[0] + ":" + sendTimearray[1] + ":" + sendTimearray[2].split(".")[0] + " " + sendAmPm;
                        }
                       
                        careplansRequest += `<tr id="${item.RequestId}" class="${item.IsRead ? 'unread_mess' :'' }">
                           <td width="150px"><a onClick="editCarePlan(${item.CarePlanId},${item.PatientId})" class="btn btn-link CarePlanViewLink" style="cursor:pointer;">${item.CarePlanName == null ? "" : item.CarePlanName}</a></td>
                           <td width="150px">${item.ClientName == null ? "" : item.ClientName}</td>
                           <td width="150px" class="noWrapColumn">${item.Type == 3 ? "Revoke request" :"Approval request" }</td>
                           <td width="150px">${item.UserName == null ? "" : item.UserName}</td>`
                        var AcceptedBy = item.AcceptedBy == userId ? "myself" : item.AcceptedBy
                        if (item.Status == 1) {
                            status = `<span class="s_accepted">Request Accepted by ${AcceptedBy}</span>`
                        } 
                        else {
                            status =  '<span class="s_notApproved status_column">Not Accepted</span>'
                        }
                       
                        careplansRequest += `<td  width="200px" class='status_Accepted status_column'>${status}</td>
                         <td width="220px" class="noWrapColumn">${SendDate} ${sendTime}</td><td width="150px"  class="noWrapColumn"><div>`;
                      
                        
                        careplansRequest += `<a onClick="OpenPopUp({CarePlanName:\'${item.CarePlanName}\',ClientEmail:\'${item.ClientEmail}\',UserEmail:\'${item.UserEmail}\',Type:\'${item.Type}\',ProgramName:\'${item.ProgramName}\',Message:\'\',ClientName:'${item.ClientName}\',
                    UserName:'${item.UserName}',SentOn:'${item.SentOn}',RevokeRequestDate:'${item.RevokeRequestDate}',RevertMessage:'',Status:'${item.Status}',AcceptedBy:'${item.AcceptedBy}',AcceptedById:'${item.AcceptedById}',Status:'${item.Status}',RequestId:'${item.RequestId}',IsRead:'${item.IsRead}',CarePlanId:'${item.CarePlanId}',PatientId:'${item.PatientId}'})" class="openPopUp btn btn-success text-white" style="cursor:pointer;">View Message</a>`
                        careplansRequest += `</div></td></tr>`;
                    });
                    careplanlist.html("").append(careplansRequest);
                } else {
                    careplansRequest += `<tr>
                                      <td colspan="7"><p class="text-center">No data found.</p></td>
                                      <td style="display: none;"></td>
                                      <td style="display: none;"></td>
                                      <td style="display: none;"></td>
                                      <td style="display: none;"></td>
                                      <td style="display: none;"></td>
                                      <td style="display: none;"></td>
                                      </tr>`;
                    careplanlist.html("").append(careplansRequest);
            }
            
           
            InboxTable = $('#tblCarePlanInbox').DataTable({
                retrieve: true,
                searching: false,
                "ordering": false,
                "scrollY": "calc(100vh - 360px)",
                'columnDefs': [{
                    'targets': [6],
                    'orderable': false
                }]
            });
            if (ReadCount > 0) {
                $('#InboxCount').text('Inbox(' + ReadCount + ')')
            }
                $(".loaderOverlay").hide();
        },
        error: function (e) {
            toastr.error("Unidentified error");
            $(".loaderOverlay").hide();
        }
    });


   
   
}
var reopenRequestId = 0;
function LoadRequestHistory() {
    $(".loaderOverlay").css("display", "flex");
    $.ajax({
        type: "GET",
        url: Apipath + '/api/PatientMain/getrequests?type=2&userid=' + userId,
        contentType: 'application/json; charset=UTF-8',
        dataType: "json",
        async: true,
        success: function (result) {
            if (HistoryTable != '') {
                HistoryTable.destroy();
            }
            var careplansRequest = "";
            var careplanlist = $(".tblCarePlanHistory");
            careplanlist.html("");
            if (result.length) {
                $.each(result, function (index, item) {
                   
                    if(item.ModifiedOn != null && item.ModifiedOn != "null"){
                        var ModifiedDate = new Date(item.ModifiedOn).toLocaleDateString('en-US')
                        var Timearray = item.ModifiedOn.split("T")[1].split(":");
                        var AmPm = Timearray[0] >= 12 ? 'pm' : 'am';
                        var MTime = Timearray[0] + ":" + Timearray[1] + ":" + Timearray[2].split(".")[0] + " " + AmPm;
                    }
                    careplansRequest += `<tr>
                           <td width="200px"><a onClick="editCarePlan(${item.CarePlanId},PatientId=${item.PatientId},false)" class="btn btn-link CarePlanViewLink" style="cursor:pointer;">${item.CarePlanName == null ? "" : item.CarePlanName}</a></td>
                           <td width="200px">${item.ClientName == null ? "" : item.ClientName}</td>`

                    if (item.Status == 2 && item.Type == 1) {
                        status = `<span class="s_accepted">Accepted approved</span>`
                    }
                    else if (item.Status == 2 && item.Type == 3) {
                        status = '<span class="s_notApproved">Accepted revert request</span>'
                    }

                    careplansRequest += `<td  width="250px">${status}</td>
                   `;
                  
                    careplansRequest += `<td width="200px">${ModifiedDate} ${MTime}</td>
                     <td width="150px"><div>
                    <a data-message="${item.Message}" data-ResponseMessage="${item.ResponseMessage}" data-RevertMessage="${item.RevertMessage}" onClick="openHistoryModel({CarePlanName:\'${item.CarePlanName}\',ClientEmail:\'${item.ClientEmail}\',UserEmail:\'${item.UserEmail}\',Type:\'${item.Type}\',ProgramName:\'${item.ProgramName}\',Message:\'\',ClientName:'${item.ClientName}\',
                    UserName:'${item.UserName}',SentOn:'${item.SentOn}',RevokeRequestDate:'${item.RevokeRequestDate}',RevertMessage:'',Status:'${item.Status}',AcceptedBy:'${item.AcceptedBy}',AcceptedById:'${item.AcceptedById}',Status:'${item.Status}',RequestId:'${item.RequestId}',IsRead:'${item.IsRead}',ModifiedOn:'${item.ModifiedOn}'},this)" class="btn btn-success text-white" style="cursor:pointer;">View Message</a>
                    </div></td></tr>`;
                });
                careplanlist.html("").append(careplansRequest);
            } else {
                careplansRequest += `<tr><td colspan="5"><p class="text-center">No data found.</p></td>
                                      <td style="display: none;"></td>
                                      <td style="display: none;"></td>
                                      <td style="display: none;"></td>
                                      <td style="display: none;"></td>
                                     </tr>`;
                careplanlist.html("").append(careplansRequest);
            }
            HistoryTable = $('#tblCarePlanHistory').DataTable({
                "searching": false,
                "scrollY": "calc(100vh - 360px)",
                "paging": true,
                'columnDefs': [{
                    'targets': [4],
                    'orderable': false
                }]
            });
                $(".loaderOverlay").hide();
          
        },
        error: function (e) {
            toastr.error("Unidentified error");
            $(".loaderOverlay").hide();
        }
    });
}


function changeRequestStatus(status, requestid,type) {
    if (isAzaxRequestSent) {
        return
    }
    var message = $('#approveRejectTextbox').val();
    if ($('#approveRejectTextbox').val() == '' && status == '2') {
        toastr.error("Message is required");
          return 
    }
    isAzaxRequestSent=true
    $.ajax({
        type: "Post",
        url: Apipath + '/api/PatientMain/Changerequeststatus?status=' + status + '&requestid=' + requestid + '&userid=' + userId + '&type=' + type + '&message=' + message,
        contentType: 'application/json; charset=UTF-8',
        dataType: "json",
        async: true,
        success: function (result) {
            
            if (result.status != 3 && result.status != 4) {
                if (status == 1) {
                    toastr.success("Request is accepted");
                    $('.requestApproveButton').css('display', 'inline-block')
                    $('.requestViewChanges').css('display', 'inline-block')
                    $('.requestAcceptButton').css('display', 'none')

                    $('.Model_Status').text('Accepted by myself');
                    $('.ViewCareplan').css('display', 'inline-block')
                    $('.Model_Status').removeClass('s_notApproved').addClass('s_accepted')
                    $('#approveRejectTextbox').closest('.form-group').show();
                }
                else if (status == 2) {
                    toastr.success("Request is approved");
                    window.location.href = '/CarePlan/Requests';
                    $('#RequestModel').modal('hide');
                }
            }
            else if (result.status == 3) {
                toastr.error("Request is Accepted by someone");
                $('#RequestModel').modal('hide');
            }
            else if (result.status == 4) {
                toastr.error("Request is reverted");
                $('#RequestModel').modal('hide');
            }
           
            isAzaxRequestSent = false
              //  $(".loaderOverlay").hide();
            },
        error: function (e) {
            isAzaxRequestSent = false
            toastr.error("Unidentified error");
            $(".loaderOverlay").hide();
        }
    });
}

$('#RequestModel').on('hidden.bs.modal', function () {
    LoadRequest();
});


function OpenPopUp(item) {
    $.ajax({
        type: "get",
        url: Apipath + '/api/PatientMain/getCarePlanRequestByRequestId?requestid=' + item.RequestId ,
        contentType: 'application/json; charset=UTF-8',
        dataType: "json",
        async: false,
        success: function (result) {
            if (result.Type == 2) {
                toastr.error("Request is reverted by user")
                LoadRequest();
            }
            else {
                item.AcceptedBy = result.AcceptedByName;
                item.Status = result.Status;
                item.Type = result.Type;
                item.RevertMessage = result.RevertMessage;
                item.Message = result.Message;
                item.AcceptedById = result.AcceptedBy;
                item.RevokeRequestDate = result.RevokeRequestDate;
                item.IsCarePlanViewed = result.IsCarePlanViewed == null ? false : result.IsCarePlanViewed
                BindModel(item)
            }
        },
        error: function (e) {
            toastr.error("Unidentified error");
        }
    });
}



function BindModel(item) {
    if (item.SentOn != null && item.SentOn != "null") {
        var SendDate = new Date(item.SentOn).toLocaleDateString('en-US')
        var sendTimearray = item.SentOn.split("T")[1].split(":");
        var sendAmPm = sendTimearray[0] >= 12 ? 'pm' : 'am';
        var sendTime = sendTimearray[0] + ":" + sendTimearray[1] + ":" + sendTimearray[2].split(".")[0] + " " + sendAmPm;
    }
  
    if (item.RevokeRequestDate != null  && item.RevokeRequestDate != "null") {
        var RevokeRequestDate = new Date(item.RevokeRequestDate).toLocaleDateString('en-US')
        var revokeTimearray = item.RevokeRequestDate.split("T")[1].split(":");
        var revokeAmPm = revokeTimearray[0] >= 12 ? 'pm' : 'am';
        var revokeTime = revokeTimearray[0] + ":" + revokeTimearray[1] + ":" + revokeTimearray[2].split(".")[0] + " " + revokeAmPm;
    }
    
    if (item.IsRead == 'false') {
        $.ajax({
            type: "Post",
            url: Apipath + '/api/PatientMain/updaterequestreadstatus?requestid=' + item.RequestId + '&userid=' + userId,
            contentType: 'application/json; charset=UTF-8',
            dataType: "json",
            async: false,
            success: function (result) {
                ReadCount--;
                if (ReadCount <= 0) {
                    $('#InboxCount').text('Inbox')
                }
                else {
                    $('#InboxCount').text('Inbox(' + ReadCount + ')')
                }

                $('#' + item.RequestId).removeClass('unread_mess')
            },
            error: function (e) {
                toastr.error("Unidentified error");
            }
        });

    }

    var status = ''
    var messageBlock = ''
    if (item.Type == 3) {
        messageBlock = `<div class="message_block">
            <h6>Messages</h6>
            <ul>
                <li><span><b>Revert request on </b> ${RevokeRequestDate}  ${revokeTime} by ${item.UserName == null ? "" : item.UserName} (${item.UserEmail == null ? "" : item.UserEmail})</span><br><span>${item.RevertMessage = null ? "" : item.RevertMessage}</span></li>
                <li><span><b>Approval request on </b> ${SendDate}  ${sendTime} by ${item.UserName == null ? "" : item.UserName} (${item.UserEmail == null ? "" : item.UserEmail})</span><br><span>${item.Message == null ? "" : item.Message}</span></li>  
            </ul>
        </div>`

    }
    else {
        messageBlock = `<div class="message_block">
            <h6>Messages</h6>
            <ul>
                <li><b>Approval request on </b><span>${SendDate}  ${sendTime} by ${item.UserName == null ? "" : item.UserName} (${item.UserEmail == null ? "" : item.UserEmail})<span/><br><span>${item.Message == null ? "" : item.Message} </span></li>
            </ul>
        </div>`
    }
    var actionbutton = ''
    if (item.Status == 1) {
        status = `<span class="s_accepted Model_Status"> Request Accepted by ${item.AcceptedBy}</span>`
    }
    else {
        status = '<span class="s_notApproved Model_Status">Not Accepted</span>'
    }
    

    if (item.Status == "1" && item.AcceptedById == userId && item.Type == 3) {
        actionbutton += `<a  style="display:inline-block" class="btn btn-success text-white ViewCareplan" onClick="ViewCareplan(${item.RequestId}, ${item.IsCarePlanViewed});editCarePlan(${item.CarePlanId},${item.PatientId})" style="cursor:pointer;">View Careplan</a>`
        actionbutton += `<a onClick="changeRequestStatus('2',${item.RequestId},1)" style="display:inline-block" class="btn btn-success text-white requestApproveButton ${item.IsCarePlanViewed ? '' :'disabled'}" style="cursor:pointer;">Approve Request</a>`
        actionbutton += `<a onClick="changeRequestStatus('2',${item.RequestId},3)" style="display:inline-block" class="btn btn-success text-white requestRevokeButton ${item.IsCarePlanViewed ? '' : 'disabled'}" style="cursor:pointer;">Accept Revoke Request</a>`
        actionbutton += `<a onClick="ViewRequestChanges(${item.CarePlanId},${item.RequestId})" style="display:inline-block" class="btn btn-success text-white requestViewChanges " style="cursor:pointer;">View Change</a>`

    }
    else if (item.Status == "1" && item.AcceptedById == userId && item.Type == 1) {
        actionbutton += `<a  style="display:inline-block" class="btn btn-success text-white ViewCareplan"onClick="ViewCareplan(${item.RequestId}, ${item.IsCarePlanViewed});editCarePlan(${item.CarePlanId},${item.PatientId})" style="cursor:pointer;">View Careplan</a>`
        actionbutton += `<a onClick="changeRequestStatus('2',${item.RequestId},1)" style="display:inline-block" class="btn btn-success text-white requestApproveButton ${item.IsCarePlanViewed ? '' : 'disabled'}" style="cursor:pointer;">Approve Request</a>`
        actionbutton += `<a onClick="ViewRequestChanges(${item.CarePlanId},${item.RequestId})" style="display:inline-block" class="btn btn-success text-white requestViewChanges " style="cursor:pointer;">View Change</a>`

    }
    else if (item.Status == null || item.Status == "0") {
        actionbutton += `<a onClick="changeRequestStatus('1',${item.RequestId},${item.Type})" style="display:inline-block"  class="btn btn-success text-white requestAcceptButton" style="cursor:pointer;">Accept Request</a>`
        actionbutton += `<a  style="display:none" class="btn btn-success text-white ViewCareplan" onClick="ViewCareplan(${item.RequestId}, ${item.IsCarePlanViewed});editCarePlan(${item.CarePlanId},${item.PatientId})" style="cursor:pointer;">View Careplan</a>`
        actionbutton += `<a onClick="changeRequestStatus('2',${item.RequestId},1)" style="display:none" class="btn btn-success text-white requestApproveButton ${item.IsCarePlanViewed ? '' : 'disabled'}" style="cursor:pointer;">Approve Request</a>`
        actionbutton += `<a onClick="ViewRequestChanges(${item.CarePlanId},${item.RequestId})" style="display:none" class="btn btn-success text-white requestViewChanges " style="cursor:pointer;">View Change</a>`
    }
    var modelContent = `  <table class="table">
                    <tbody>
                        <tr>
                            <th scope="row">Program Name</th>
                            <td>${item.ProgramName == null ? "" : item.ProgramName}</td>
                        </tr>
                        <tr>
                            <th scope="row">Client Name</th>
                            <td>${item.ClientName == null ? "" : item.ClientName}(${item.ClientEmail == null ? "" : item.ClientEmail})</td>

                        </tr>
                         <tr>
                            <th scope="row">Sent By</th>
                            <td>${item.UserName == null ? "" : item.UserName} (${item.UserEmail == null ? "" : item.UserEmail})</td>

                        </tr>
                        <tr>
                            <th scope="row">CarePlan Name</th>
                            <td>${item.CarePlanName == null ? "" : item.CarePlanName}</td>
                        </tr>
                        <tr>
                            <th scope="row">Recieved On</th>
                            <td>${item.SentOn == null ? "" : item.SentOn.split("T")[0]}</td>
                        </tr>
                        <tr>
                            <th scope="row">Status</th>
                            <td>
                                ${status}
                           </td>

                        </tr>
                        <tr>
                            <th scope="row">Title</th>
                            <td>${item.Type == 3 ? "Revoke request" : "Approval request"}</td>
                        </tr>
                    </tbody>
                </table>
             ${messageBlock}
            <div class="form-group ${(item.Status == "1" && item.AcceptedById == userId) ?'':'d-none'}">
                <label>Comments</label>
                <textarea id="approveRejectTextbox" class="form-control" placeholder="Comments"></textarea>
            </div>

${actionbutton}`
    $('#RequestModel .modal-body').html(modelContent)
    $('#RequestModel').modal('show');

}


function openHistoryModel(item, message) {
    item.RevertMessage = $(message).attr('data-RevertMessage');
    item.Message = $(message).attr('data-message');
    item.ResponseMessage = $(message).attr('data-ResponseMessage'); 
   
    if (item.SentOn != null && item.SentOn != "null") {
        var SendDate = new Date(item.SentOn).toLocaleDateString('en-US')
        var sendTimearray = item.SentOn.split("T")[1].split(":");
        var sendAmPm = sendTimearray[0] >= 12 ? 'pm' : 'am';
        var sendTime = sendTimearray[0] + ":" + sendTimearray[1] + ":" + sendTimearray[2].split(".")[0] + " " + sendAmPm;
    }

    if (item.RevokeRequestDate != null && item.RevokeRequestDate != "null") {
        var RevokeRequestDate = new Date(item.RevokeRequestDate).toLocaleDateString('en-US')
        var revokeTimearray = item.RevokeRequestDate.split("T")[1].split(":");
        var revokeAmPm = revokeTimearray[0] >= 12 ? 'pm' : 'am';
        var revokeTime = revokeTimearray[0] + ":" + revokeTimearray[1] + ":" + revokeTimearray[2].split(".")[0] + " " + revokeAmPm;
    }

    if (item.ModifiedOn != null && item.ModifiedOn != "null") {
        var ModifiedDate = new Date(item.ModifiedOn).toLocaleDateString('en-US')
        var ModifiedTimearray = item.ModifiedOn.split("T")[1].split(":");
        var ModifiedAmPm = ModifiedTimearray[0] >= 12 ? 'pm' : 'am';
        var ModifiedTime = ModifiedTimearray[0] + ":" + ModifiedTimearray[1] + ":" + ModifiedTimearray[2].split(".")[0] + " " + ModifiedAmPm;
    }

    
    var status = ''
    var messageBlock = ''
    var ResponseMessageBlock=""
    if (item.Type == 3) {
        messageBlock = `<div class="message_block">
            <h6>Message</h6>
            <ul>
                <li><span><b>Revoke request on </b> ${RevokeRequestDate}  ${revokeTime}</span><br><span>${item.RevertMessage == "null" ? "" : item.RevertMessage}</span></li>
                <li><span><b>Approval request on </b> ${SendDate}  ${sendTime}</span><br><span>${item.Message == "null" ? "" : item.Message}</span></li> 
               <li><span><b>Revoke request is accepted on </b> ${ModifiedDate}  ${ModifiedTime}</span><br><span>${item.ResponseMessage == "null" ? "" : item.ResponseMessage}</span></li>  
            </ul>
        </div>`


    }
    else {
        messageBlock = `<div class="message_block">
            <h6>Messages</h6>
            <ul>
                <li><b>Approval request on </b><span>${SendDate}  ${sendTime}<span/><br><span>${item.Message == "null" ? "" : item.Message}</span></li>
           <li><span><b>Approval request is accepted on </b> ${ModifiedDate}  ${ModifiedTime}</span><br><span>${item.ResponseMessage == "null" ? "" : item.ResponseMessage}</span></li>  
            </ul>
        </div>`
    }

    

    ResponseMessageBlock = `<div class="message_block">
        <h6></h6>
        <ul>
            <li><b>Approval request on </b><span>${SendDate}  ${sendTime}<br>${item.Message == null ? "" : item.Message}</span></li>
            </ul>
        </div>`
   
    if (item.Status == 2 && item.Type==3 ) {
        status = `<span class="s_accepted Model_Status">Revert request is accepted</span>`
    }
    else {
        status = '<span class="s_accepted Model_Status">Approval request is accepted</span>'
    }


    var modelContent = `  <table class="table">
                    <tbody>
                        <tr>
                            <th scope="row">Program Name</th>
                            <td>${item.ProgramName == null ? "" : item.ProgramName}</td>
                        </tr>
                        <tr>
                            <th scope="row">Client Name</th>
                            <td>${item.ClientName == null ? "" : item.ClientName} (${item.ClientEmail == null ? "" : item.ClientEmail})</td>

                        </tr>
                         <tr>
                            <th scope="row">Sent By</th>
                            <td>${item.UserName == null ? "" : item.UserName}  (${item.UserEmail == null ? "" : item.UserEmail})</td>

                        </tr>
                        <tr>
                            <th scope="row">CarePlan Name</th>
                            <td>${item.CarePlanName == null ? "" : item.CarePlanName}</td>
                        </tr>
                        <tr>
                            <th scope="row">Recieved On</th>
                            <td>${item.SentOn == null ? "" : item.SentOn.split("T")[0]}</td>
                        </tr>
                        <tr>
                            <th scope="row">Status</th>
                            <td>
                                ${status}
                           </td>

                        </tr>
                        <tr>
                            <th scope="row">Title</th>
                            <td>${item.Type == 3 ? "Revoke request" : "Approval request"}</td>
                        </tr>
                    </tbody>
                </table>
             ${messageBlock}`



    $('#RequestModel .modal-body').html(modelContent)
    $('#RequestModel').modal('show');

}


function ViewCareplan(requestId, IsViewCareplan) {
    reopenRequestId = requestId
    $('#RequestModel').modal('hide');
    if (IsViewCareplan) {
        return;
    }
    $.ajax({
        type: "post",
        url: Apipath + '/api/PatientMain/viewcareplan?requestid=' + requestId,
        contentType: 'application/json; charset=UTF-8',
        dataType: "json",
        async: false,
        success: function (result) {
            $('.requestApproveButton').removeClass('disabled')
            $('.requestRevokeButton').removeClass('disabled')
        },
        error: function (e) {
            toastr.error("Something happen Wrong");
        }
    });
}
function ViewRequestChanges(_careplanid, requestId,FromPopUp=true) {
    if (FromPopUp) {
        reopenRequestId = requestId;
    }
   
    $.ajax({
        type: "Get",
        url: Apipath + '/api/PatientMain/getchangedneedsandgoals?careplanid=' + _careplanid + '&isChecked=true',
        contentType: 'application/json; charset=UTF-8',
        dataType: "json",
        async: false,
        success: function (result) {
            
            if (result.length > 0) {
                
                var html = ""
                var needs = result.filter(c => !c.IsGoal);
                var goals = result.filter(c => c.IsGoal);
                html += `<ul class="needGoalsChecklist">`
                for (let i = 0; i < needs.length; i++) {
                    var NeedGoals = goals.filter(c => c.NeedId == needs[i].NeedId);
                    html += `<li><div class="form-group active ${NeedGoals.length > 0 ? 'hasGoal' : ''}""><label><span>${needs[i].Description}</span></label>`
                   
                    if (NeedGoals.length > 0) {
                        html += `<i class="down_arrow fa fa-chevron-down "></i>`
                    }
                    html += `</div>`

                    if (NeedGoals.length > 0) {
                        html += `<ul>`
                        for (let j = 0; j < NeedGoals.length; j++) {
                            html += `<li><div class="form-group"><label><span> ${NeedGoals[j].Description}</span></label></div></li>`
                        }
                        html += `</ul>`
                    }
                    html += `</li>`
                }
                html += `</ul>`
                
                
                 $('#ViewRequestCareplanChanges .modal-body').html(html)
                $('#RequestModel').modal('hide');
                $('#ViewRequestCareplanChanges').modal('show');
                $('ul.needGoalsChecklist > li > .form-group').off('click');

                $('ul.needGoalsChecklist > li > .form-group').on('click', function () {
                    $(this).toggleClass('active');
                    $(this).next('ul').slideToggle();
                })
            }else{
              
                 toastr.error("There are no changes to view");
              

                  }
        },
        error: function (e) {
            toastr.error("Something happen Wrong");
            $(".loaderOverlay").hide();
        }
    });
}

$('#addNewCarePlansSidebar .close_right_sidebar').click(function () {
    
    if (reopenRequestId != '' && reopenRequestId != 0) {
        $('#tblCarePlanInbox #' + reopenRequestId + '').find('a.openPopUp').click();
        reopenRequestId = 0;
    }

})

$('#ViewRequestCareplanChanges').on('hidden.bs.modal', function (e) {
    
    if (reopenRequestId != '' && reopenRequestId != 0) {
        $('#tblCarePlanInbox #' + reopenRequestId + '').find('a.openPopUp').click();
        reopenRequestId = 0;
    } 
})


var windowWidth = $(window).width()
$(window).resize(function () {
    var finalWindowWidth = $(window).width()
    if (windowWidth != finalWindowWidth) {
        LoadRequest();
        LoadRequestHistory()
        windowWidth = finalWindowWidth;
    }
})
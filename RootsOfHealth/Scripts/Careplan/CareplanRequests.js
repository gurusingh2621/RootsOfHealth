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
                        careplansRequest += `<tr id="${item.RequestId}" class="${item.IsRead ? 'unread_mess' :'' }">
                           <td width="20%"><a onClick="editCarePlan(${item.CarePlanId},PatientId=${item.PatientId})" class="btn btn-link" style="cursor:pointer;">${item.CarePlanName == null ? "" : item.CarePlanName}</a></td>
                           <td width="15%">${item.ProgramName == null ? "" : item.ProgramName}</td>
                           <td width="15%">${item.ClientName == null ? "" : item.ClientName}</td>
                           <td width="15%">${item.Type == 3 ? "Revoke request" :"Approval request" }</td>
                           <td width="15%">${item.UserName == null ? "" : item.UserName}</td>`
                        var AcceptedBy = item.AcceptedBy == userId ? "myself" : item.AcceptedBy
                        if (item.Status == 1) {
                            status = `<span class="s_accepted">Request Accepted by ${AcceptedBy}</span>`
                        } 
                        else {
                            status =  '<span class="s_notApproved">Not Accepted</span>'
                        }
                       
                        careplansRequest+=`<td class='status_Accepted'>${status}</td><td width="30%"><div>`;
                      
                        
                        careplansRequest += `<a onClick="OpenPopUp({CarePlanName:\'${item.CarePlanName}\',Type:\'${item.Type}\',ProgramName:\'${item.ProgramName}\',Message:\'${item.Message}\',ClientName:'${item.ClientName}\',
                    UserName:'${item.UserName}',SentOn:'${item.SentOn}',RevokeRequestDate:'${item.RevokeRequestDate}',RevertMessage:'${item.RevertMessage}',Status:'${item.Status}',AcceptedBy:'${item.AcceptedBy}',AcceptedById:'${item.AcceptedById}',Status:'${item.Status}',RequestId:'${item.RequestId}',IsRead:'${item.IsRead}'})" class="btn btn-success text-white" style="cursor:pointer;">View Message</a>`
                        careplansRequest += `<a onClick="editCarePlan(${item.CarePlanId},PatientId=${item.PatientId})" class="btn btn-success text-white" style="cursor:pointer;">View Careplan</a>`
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
            toastr.error("Something happen Wrong");
            $(".loaderOverlay").hide();
        }
    });


   
   
}

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
                    careplansRequest += `<tr>
                           <td width="20%">${item.CarePlanName == null ? "" : item.CarePlanName}</td>
                           <td width="15%">${item.ProgramName == null ? "" : item.ProgramName}</td>
                           <td width="15%">${item.ClientName == null ? "" : item.ClientName}</td>`

                    if (item.Status == 2 && item.Type == 1) {
                        status = `<span class="s_accepted">Accepted approved</span>`
                    }
                    else if (item.Status == 2 && item.Type == 3) {
                        status = '<span class="s_notApproved">Accepted revert request</span>'
                    }

                    careplansRequest += `<td>${status}</td>
                    <td width="15%">${item.AcceptedBy == null ? "" : item.AcceptedBy}</td>
                   `;


                  
                    careplansRequest += `</div></td><td>${item.ModifiedOn == null ? "" : item.ModifiedOn.split("T")[0]}</td></tr>`;
                });
                careplanlist.html("").append(careplansRequest);
            } else {
                careplansRequest += `<tr><td colspan="6"><p class="text-center">No data found.</p></td>
                                      <td style="display: none;"></td>
                                      <td style="display: none;"></td>
                                      <td style="display: none;"></td>
                                      <td style="display: none;"></td>
                                      <td style="display: none;"></td>
                                     </tr>`;
                careplanlist.html("").append(careplansRequest);
            }
            HistoryTable = $('#tblCarePlanHistory').DataTable({
                retrieve: true,
                searching: false,
                'columnDefs': [{
                    'targets': [5],
                    'orderable': false
                }]
            });
                $(".loaderOverlay").hide();
          
        },
        error: function (e) {
            toastr.error("Something happen Wrong");
            $(".loaderOverlay").hide();
        }
    });
}


function changeRequestStatus(status, requestid,type) {
    //$(".loaderOverlay").css("display", "flex");
    if (isAzaxRequestSent) {
        return
    }
    isAzaxRequestSent=true
    $.ajax({
        type: "Post",
        url: Apipath + '/api/PatientMain/Changerequeststatus?status=' + status + '&requestid=' + requestid + '&userid=' + userId + '&type=' + type,
        contentType: 'application/json; charset=UTF-8',
        dataType: "json",
        async: true,
        success: function (result) {
            
            if (result.status != 3 && result.status != 4) {
                if (status == 1) {
                    toastr.success("Request is accepted");
                    $('.requestApproveButton').css('display', 'inline-block')
                    $('.requestAcceptButton').css('display', 'none')

                    //   var span = `<span class='status_Accepted'></span>`
                    $('.Model_Status').text('Accepted by myself');
                    $('.Model_Status').removeClass('s_notApproved').addClass('s_accepted')

                }
                else if (status == 2) {
                    toastr.success("Request is approved");
                    window.location.href = '/CarePlan/Requests';
                    //InboxTable.row($('#' + requestid)).remove().draw();
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
            toastr.error("Something happen Wrong");
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
                item.RevertMessage = result.RevertMessage
                item.AcceptedById = result.AcceptedBy
                BindModel(item)
            }
        },
        error: function (e) {
            toastr.error("Something happen Wrong");
        }
    });
}



function BindModel(item) {

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
                toastr.error("Something happen Wrong");
            }
        });

    }

    var status = ''
    var messageBlock = ''
    if (item.Type == 3) {
        messageBlock = `<div class="message_block">
            <h6>Message</h6>
            <ul>
                <li><b>Message sende while revert request</b><span>${item.RevokeRequestDate.split("T")[0]}<br>${item.RevertMessage = null ? "" : item.RevertMessage}</span></li>
                <li><b>Message  send while approval request</b><span>${item.SentOn.split("T")[0]}<br>${item.Message == null ? "" : item.Message}</span></li>  
            </ul>
        </div>`

    }
    else {
        messageBlock = `<div class="message_block">
            <h6>Message</h6>
            <ul>
                <li><b>Message  send while approval request</b><span>${item.SentOn.split("T")[0]}<br>${item.Message == null ? "" : item.Message}</span></li>
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
        actionbutton += `<a onClick="changeRequestStatus('2',${item.RequestId},1)" style="display:inline-block" class="btn btn-success text-white" style="cursor:pointer;">Accept Approve Request</a>`
        actionbutton += `<a onClick="changeRequestStatus('2',${item.RequestId},3)" style="display:inline-block" class="btn btn-success text-white" style="cursor:pointer;">Accept Revoke Request</a>`

    }
    else if (item.Status == "1" && item.AcceptedById == userId && item.Type == 1) {
        actionbutton += `<a onClick="changeRequestStatus('2',${item.RequestId},1)" style="display:inline-block" class="btn btn-success text-white" style="cursor:pointer;">Accept Approve Request</a>`

    }
    else if (item.Status == null || item.Status == "0") {

        actionbutton += `<a onClick="changeRequestStatus('1',${item.RequestId},${item.Type})" style="display:inline-block"  class="btn btn-success text-white requestAcceptButton" style="cursor:pointer;">Accept Request</a>`
        actionbutton += `<a onClick="changeRequestStatus('2',${item.RequestId},1)" style="display:none" class="btn btn-success text-white requestApproveButton" style="cursor:pointer;">Accept Approve Request</a>`

    }
    var modelContent = `  <table class="table">
                    <tbody>
                        <tr>
                            <th scope="row">Program Name</th>
                            <td>${item.ProgramName == null ? "" : item.ProgramName}</td>
                        </tr>
                        <tr>
                            <th scope="row">Client Name</th>
                            <td>${item.ClientName == null ? "" : item.ClientName}</td>

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

${actionbutton}`

    $('#RequestModel .modal-body').html(modelContent)
    $('#RequestModel').modal('show');

}

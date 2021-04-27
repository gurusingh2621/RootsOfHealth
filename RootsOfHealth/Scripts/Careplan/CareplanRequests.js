$(function () {
    LoadRequest();
    LoadRequestHistory();
})

var ReadCount = 0;
var InboxTable=''

function LoadRequest() {
    $(".loaderOverlay").css("display", "flex");
    $.ajax({
        type: "GET",
        url: Apipath + '/api/PatientMain/getrequests?type=1&userid=' + userId,
        contentType: 'application/json; charset=UTF-8',
        dataType: "json",
        async: true,
        success: function (result) {
            
            var status=''
            var careplanlist = $(".carePlanRequestInbox");
                var careplansRequest = "";
                if (result.length) {
                    $.each(result, function (index, item) {
                        if (!item.IsRead) {
                            ReadCount++;
                        }
                        careplansRequest += `<tr id="${item.RequestId}" class="${item.IsRead ? '' : 'unread_mess'}">
                           <td width="20%">${item.CarePlanName == null ? "" : item.CarePlanName}</td>
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
                    UserName:'${item.UserName}',SentOn:'${item.SentOn}',Status:'${item.Status}',AcceptedBy:'${item.AcceptedBy}',AcceptedById:'${item.AcceptedById}',Status:'${item.Status}',RequestId:'${item.RequestId}',IsRead:'${item.IsRead}'})" class="btn btn-success text-white" style="cursor:pointer;">View Message</a>`
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
            var careplansRequest = "";
            var careplanlist = $(".tblCarePlanHistory");
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
                careplansRequest += `<tr><td colspan="6"><p class="text-center">No data found.</p></td></tr>`;
                careplanlist.html("").append(careplansRequest);
            }

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
    $.ajax({
        type: "Post",
        url: Apipath + '/api/PatientMain/Changerequeststatus?status=' + status + '&requestid=' + requestid + '&userid=' + userId + '&type=' + type,
        contentType: 'application/json; charset=UTF-8',
        dataType: "json",
        async: true,
        success: function (result) {
            if (result.status != 3) {
                if (status == 1) {
                    toastr.success("Request is accepted");
                    //var span = `<span class='status_Accepted'>Accepted by ${UserName}</span>`
                    //$('#' + requestid).find('s_accepted').html(span);
                }
                else if (status == 2) {
                    toastr.success("Request is approved");
                    //InboxTable.row($('#' + requestid)).remove().draw();
                }
            }
            else if(status==3){
                toastr.success("Request is Accepted by someone");
            }
            window.location.href = '/CarePlan/Requests';
               
              //  $(".loaderOverlay").hide();
            },
        error: function (e) {
            toastr.error("Something happen Wrong");
            $(".loaderOverlay").hide();
        }
    });
}


function OpenPopUp(item) {
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
    var actionbutton=''
    if (item.Status == 1) {
        status = `<span class="s_accepted"> Request Accepted by ${item.AcceptedBy}</span>`
    }
    else {
        status = '<span class="s_notApproved">Not Accepted</span>'
    }
   
    if (item.Status == "1" && item.AcceptedById == userId) {
        actionbutton += `<a onClick="changeRequestStatus('2',${item.RequestId},${item.Type})" style="display:inline-block" class="btn btn-success text-white" style="cursor:pointer;">${item.Type==3?"Accept Revert Request":"Approve"}</a>`
        actionbutton += `<a onClick="changeRequestStatus('1',${item.RequestId},${item.Type})" style="display:none" class="btn btn-success text-white" style="cursor:pointer;">Accept</a>`
    }
    else if (item.Status == "null" || item.Status == "0") {
        actionbutton += `<a onClick="changeRequestStatus('2',${item.RequestId},${item.Type})" style="display:none" class="btn btn-success text-white" style="cursor:pointer;">${item.Type == 3 ? "Accept Revert Request" : "Approve"}</a>`
        actionbutton += `<a onClick="changeRequestStatus('1',${item.RequestId},${item.Type})" style="display:block"  class="btn btn-success text-white" style="cursor:pointer;">Accept</a>`
    }
    var modelContent =`  <table class="table">
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
                            <td>${item.SentOn==null?"":item.SentOn.split("T")[0]}</td>
                        </tr>
                        <tr>
                            <th scope="row">Status</th>
                            <td>
                                ${status}
                           </td>

                        </tr>
                        <tr>
                            <th scope="row">Title</th>
                            <td>${item.Type == 3 ? "Revoke request" : "Approval request" }</td>
                        </tr>
                    </tbody>
                </table>
            <div class="message_block">
                <h6>Message</h6>
                <p>${item.Message}</p>
             </div>

${actionbutton}`
    
    $('#RequestModel .modal-body').html(modelContent)
    $('#RequestModel').modal('show');
}



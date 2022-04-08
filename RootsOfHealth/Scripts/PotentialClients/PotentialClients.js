


var $PotientialClientModal = $('#PotentialClientFileUpload')
var $PotentialClientFileUpload = $('#PoteintialClientFileInput')
var $btnsavepotentialclients = $('#btnsavepotentialclients');
var filePath = '';
var $tblPotientialPatient = $('#tblPotientialPatient');



$btnsavepotentialclients.click(function () {

    var isddlvalid = true;
    var selectedfileFields = [];
    $('.dllFileFields').each(function (k, v) {
        var ddlvalue = $(v).val();
        if (ddlvalue == "-1") {
            isddlvalid = false;
            alert('please select any field');
            $(v).focus();
            return false;
        }
        else if (ddlvalue && $.trim(selectedfileFields.indexOf(ddlvalue)) != -1) {
            isddlvalid = false;
            alert('same field is selected multiple times');
            $(v).focus();
            return false;
        } else {
            selectedfileFields.push(ddlvalue);
        }

    });
    if (!isddlvalid) {
        return false;
    }
    else {

        var files = $PotentialClientFileUpload.get(0).files;

        var formdata = new FormData();
        formdata.append('file', files[0]);
        var dbfields = {};
        
        $(".getFileFields select").each(function () {
            var hh = $(this);
            var name = hh.attr('id');
            dbfields[name] = hh.val();
        });
        
        formdata.append("dbfields", JSON.stringify( dbfields ));
        
        $.ajax({
            url: '/Client/SavePotentialClientData',
            type: 'POST',
            data: formdata,
            processData: false,
            contentType: false,
            success: function (data) {
               
                if (data.Status === 1) {
                    ClosePotentialClientModal()
                    alert(data.Message);
                    BindPotentialClientsTable();
                   
                    
                } else {
                    alert("Failed to Save Data");
                }
            }
        });

    }

});
    



function ClosePotentialClientModal() {
    $PotientialClientModal.modal('hide');
   
    $PotentialClientFileUpload.wrap('<form>').closest(
        'form').get(0).reset();
    $PotentialClientFileUpload.unwrap();
}


$PotentialClientFileUpload.change(function (e) {
    
    var files = e.target.files;
    if (files.length > 0) {
        if (window.FormData !== undefined) {
            var data = new FormData();
            for (var x = 0; x < files.length; x++) {
                data.append("file" + x, files[x]);
            }

            $.ajax({
                type: "POST",
                url: '/Client/UploadPotentialClientFile',
                contentType: false,
                processData: false,
                data: data,
                dataType: "json",
                success: function (res) {
                    if (res) {
                        AppendColumnsLists(res, true)
                        if (res.filecolumns.length > 0) {
                            AppendColumnsLists(res, false)
                        }
                      
                    }
                    $PotientialClientModal.modal('show');
                },
                error: function (xhr, status, p3, p4) {
                    var err = "Error " + " " + status + " " + p3 + " " + p4;
                    if (xhr.responseText && xhr.responseText[0] == "{")
                        err = JSON.parse(xhr.responseText).Message;
                    console.log(err);
                }
            });
        } else {
            alert("This browser doesn't support HTML5 file uploads!");
        }
    }


})

function AppendColumnsLists(result,isdatabaseField) {
    
    if (isdatabaseField) {
        var databaseResult = result.databaseColumns;
        var html = '<ul id="DatabaseFields" class="sortableListBox">'
        for (let i = 0; i < databaseResult.length; i++) {
            if (databaseResult[i].ColType == 'int' || databaseResult[i].ColType == 'bit') {
                html += `<li>${databaseResult[i].ColName} ( ${databaseResult[i].ColType == "bit" ? "Boolean" : "Integer"})</li>`
            } else {
                html += `<li>${databaseResult[i].ColName} (String( ${databaseResult[i].ColLength == -1 ? "max" : databaseResult[i].ColLength}))</li>`
            }
        }
        html += '</ul>'
        $PotientialClientModal.find('.modal-body .getDatabaseField').html(html);
    } else {
        var fileResult = result.filecolumns;
        var databaseResult = result.databaseColumns;
        $PotientialClientModal.find('.modal-body .getFileFields').html('');
        for (let i = 0; i < databaseResult.length; i++) {
            var ddl = $("<select></select>").attr("id", databaseResult[i].ColName).attr("name", databaseResult[i].ColName).attr("class", "form-control dllFileFields").attr("columntype", databaseResult[i].ColType);
            ddl.append("<option value='-1'>--Select--</option>");
            $.each(fileResult, function (index, el) {
                ddl.append("<option>" + el + "</option>");
            });
            ddl.val(fileResult[i])
            $PotientialClientModal.find('.modal-body .getFileFields').append(ddl);
        }
        

        //var html = '<ul id="FileFields" class="sortableListBox">'
        //for (let i = 0; i < fileResult.length; i++) {
        //    html += `<li>${fileResult[i]}</li>`
        //}
        //html += '</ul>'
       /* $PotientialClientModal.find('.modal-body .getFileFields').html(html);*/
    }
    
       
   
   
}

function BindPotentialClientsTable() {
    $.ajax({
        url: '/Patient/GetPotientialPatientsList',
        type: 'GET',
        contentType: 'application/json; charset=UTF-8',
        dataType: "json",
        success: function (data) {
            
            $("#tblPotientialPatient").dataTable().fnDestroy();
            var duplicates = data.duplicateClients;
            
            var patientList = $('#tblPotientialPatient tbody');
            if (data.status === 1) {
                var potentialPatient = "";
                  $.each(data.pClientlist, function (index, item) {
                    
                      potentialPatient += `<tr>`
                      if (duplicates.filter(e => e.EmailAddress === item.EmailAddress && e.SocialSecurityNumber === item.SocialSecurityNumber && e.CellPhone == item.CellPhone).length > 0)
                      {
                          potentialPatient += `<td style="background-color:#2c639f;" >${item.FirstName != null ? item.FirstName : ""} ${+ " " + item.LastName != null ? item.LastName : ""}</td>`
                      } else
                      {
                         potentialPatient += `<td> ${ item.FirstName != null ? item.FirstName : "" } ${ + " " + item.LastName != null ? item.LastName : "" }</td >`
                      }
                         
                      potentialPatient += ` <td>${item.EmailAddress != null ? item.EmailAddress : ""}</td>
                         <td >${item.CellPhone != null ? item.CellPhone : ""}</td>
                         <td >${item.ModifiedDate != null ? new Date(parseInt(item.ModifiedDate.substr(6))).toISOString().split('T')[0] : ""}</td>
                         <td><div>
                        <button href="javascript:void(0)" id="btnpatientmove" onclick="MovePotentialPatient(${item.PatientID})" class="btn btn-success label-fields"> <i class=""></i>
                                        Move</button>`;
                      potentialPatient += `<a href="/Patient/EditPotentialPatient?patientId=${item.PatientID}" id="btnpatientedit" class="btn btn-success label-fields"> <i class="far fa-edit"></i>
                                        Edit</a>`;
                      potentialPatient += `</div ></td ></tr >`;
                  });
                patientList.html("").append(potentialPatient);

               
                $("#tblPotientialPatient").dataTable({
                    scrollY: 'calc(100vh - 264px)',
                    scrollCollapse: true,
                });
            }
            else
            {
                alert("error occured");
            }
        },
        error: function () {
            alert("error occured");
        }

    });
    
}

function MovePotentialPatient(id) {
    $(".loaderOverlay").show();
    
    
    $.ajax({
        type: "POST",
        url: Apipath + '/api/PatientMain/MovePotentialPatient?patientId=' + id + "&clinicId=" + ClinicID,
        contentType: 'application/json; charset=UTF-8',
        dataType: "json",
        success: function (result) {
            if (result == 1) {
                toastr.success("Potiental Client Moved successfully");
            }
            else {
                toastr.error("unexpected error Happened");
            }
            $(".loaderOverlay").hide();



        },
        error: function () {
            toastr.error("unexpected error Happened");
            $(".loaderOverlay").hide();
        }
    })

}




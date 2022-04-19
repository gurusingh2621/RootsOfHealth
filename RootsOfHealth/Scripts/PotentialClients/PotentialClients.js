﻿


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
        
        $("#dbandFileFields select").each(function () {
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
                        AppendColumnsLists(res)
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

function BindPotentialClientsTable() {

    var duplicates;
    $.ajax({
        type: "GET",
        url: Apipath + '/api/PatientMain/GetDuplicatepatients',
        dataType: "json",
        async: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            
            duplicates = result;
        },
        error: function (e) {
            toastr.error("Unexpected error!");
        }
    });
    
    $.ajax({
        url: '/Patient/GetPotientialPatientsList',
        type: 'GET',
        contentType: 'application/json; charset=UTF-8',
        dataType: "json",
        success: function (data) {
            
            
            $("#tblPotientialPatient").dataTable().fnDestroy();
            
            var patientList = $('#tblPotientialPatient tbody');
            if (data.status === 1) {
                var potentialPatient = "";
                  $.each(data.pClientlist, function (index, item) {

                      if (duplicates.filter(e => e.EmailAddress === item.EmailAddress || e.SocialSecurityNumber === item.SocialSecurityNumber).length > 0)
                      {
                          potentialPatient += `<tr style="background-color:red ;color:white">`;
                      }
                      else
                      {
                          potentialPatient += `<tr>`
                      }
                      
                      
                      potentialPatient += `<td>${GetFullName(item.FirstName, item.LastName)}</td>
                                         <td>${item.EmailAddress != null ? item.EmailAddress : ""}</td>
                         <td >${item.CellPhone != null ? item.CellPhone : ""}</td>
                         <td >${item.ModifiedDate != null ? new Date(parseInt(item.ModifiedDate.substr(6))).toISOString().split('T')[0] : ""}</td>
                         <td><div>`;
                      if (duplicates.filter(e => e.EmailAddress === item.EmailAddress || e.SocialSecurityNumber === item.SocialSecurityNumber).length == 0 && canMovePClientPerm =="True") {
                          potentialPatient += `<button href="javascript:void(0)" id="btnpatientmove" onclick="MovePotentialPatient(${item.PatientID})" class="btn btn-success label-fields"> <i class=""></i>
                                        Move</button>`;
                      }
                      if (canEditPClientPerm =="True") {
                          potentialPatient += `<a href="/Patient/EditPotentialPatient?patientId=${item.PatientID}" id="btnpatientedit" class="btn btn-success label-fields"> <i class="far fa-edit"></i>
                                        Edit</a>`;
                      }
                      if (canDeletePClientPerm == "True") {
                          potentialPatient += `<button href="javascript:void(0)" id="btnpatientDelete" onclick="DeletePotentialPatient(${item.PatientID})" class="btn btn-danger label-fields"> <i class=""></i>
                                        Delete</button>`;
                      }
                     
                      potentialPatient += `</div ></td ></tr >`;
                  });
                patientList.html("").append(potentialPatient);

               
                $("#tblPotientialPatient").dataTable({
                    scrollY: 'calc(100vh - 264px)',
                    scrollCollapse: true,
                    "orderClasses": false
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
function GetFullName(firstname , lastname) {
    var fullname = "";
    if (firstname != null) {
        fullname += firstname;
    }
    if (lastname != null) {
        fullname += " "+lastname;
    }
    return fullname;
}

function MovePotentialPatient(id) {
   
    
  
    if (IsPatientDetailValid(id)) {
        $(".loaderOverlay").show();
        $.ajax({
            type: "POST",
            url: Apipath + '/api/PatientMain/MovePotentialPatient?patientId=' + id + "&clinicId=" + ClinicID,
            contentType: 'application/json; charset=UTF-8',
            dataType: "json",
            success: function (result) {
                if (result == 2) {
                    toastr.success("Potiental Client Moved successfully");
                    BindPotentialClientsTable();
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
    else
    {
        toastr.error("Can not move records as data is not in correct format or required fields are pending");
    }
    

}
function AppendColumnsLists(result) {

    
        var fileResult = result.filecolumns;
        var databaseResult = result.databaseColumns;
    $PotientialClientModal.find('#dbandFileFields').html('');
    for (let i = 0; i < databaseResult.length; i++) {
        var columnName = "";
        switch (databaseResult[i].ColName) {
            case "FirstName":
                columnName = "First Name";
                break;
            case "LastName":
                columnName = "Last Name";
                break;
            case "MiddleName":
                columnName = "Middle Name";
                break;
            case "Gender":
                columnName = "Which gender do you identify as";
                break;
            case "DateOfBirth":
                columnName = "Date Of Birth";
                break;
            case "SocialSecurityNumber":
                columnName = "Social Security Number";
                break;
            case "RaceEthnicity":
                columnName = "Race/Ethnicity";
                break;
            case "IsPermanentAddress":
                columnName = "Is Permanent Address";
                break;
            case "PermanentAddress":
                columnName = "Permanent Address";
                break;
            case "EmailAddress":
                columnName = "Email Address";
                break;
            case "HomePhone":
                columnName = "Home Phone";
                break;
            case "CellPhone":
                columnName = "Cell Phone";
                break;
            case "WayToContact":
                columnName = "Best way to contact you";
                break;
            case "PatientChildren":
                columnName = "Patient Children";
                break;
            case "PatientChildrensAges":
                columnName = "Patient Childrens Ages";
                break;
            case "ChildrenUnder18":
                columnName = "Children Under 18";
                break;
            case "Adults18to65":
                columnName = "Adults 18-65";
                break;
            case "Adults65Plus":
                columnName = "Adults 65+";
                break;
            case "PreferredPharmacyName":
                columnName = "Preferred Pharmacy Name";
                break;
            case "PreferredPharmacyLocation":
                columnName = "Preferred Pharmacy Location";
                break;
            case "EverMemberOfUSArmedForces":
                columnName = "Are you now or were you ever a member of the U.S. Armed Forces?";
                break;
            case "MaritalStatus":
                columnName = "Marital Status";
                break;
            case "LanguagesSpeak":
                columnName = "Which languages do you speak comfortably?";
                break;
            case "EverBeenSmoker":
                columnName = "Have you ever been a smoker";
                break;
            case "QuitSmoking":
                columnName = "Have you Quit?";
                break;
            case "SmokingQuitDate":
                columnName = "Quit Date";
                break;
            case "PreferredPronouns":
                columnName = "What are your preferred pronouns";
                break;
            case "ThinkYourselfAs":
                columnName = "Do you think of yourself as";
                break;
            case "EmergencyContact1Name":
                columnName = "Emergency Contact1 Name";
                break;
            case "EmergencyContact1Address":
                columnName = "Emergency Contact1 Address";
                break;
            case "EmergencyContact1EmailAddress":
                columnName = "Emergency Contact1 Email Address";
                break;
            case "EmergencyContact1Relationship":
                columnName = "Emergency Contact1 Relationship";
                break;
            case "EmergencyContact2Name":
                columnName = "Emergency Contact2 Name";
                break;
            case "EmergencyContact2Address":
                columnName = "Emergency Contact2 Address";
                break;
            case "EmergencyContact2EmailAddress":
                columnName = "Emergency Contact2 Email Address";
                break;
            case "EmergencyContact2Relationship":
                columnName = "Emergency Contact2 Relationship";
                break;
            case "LastTimeYouSmoked":
                columnName = "When was the last time you smoked?";
                break;
            case "EmergencyContact1City":
                columnName = "Emergency Contact1 City";
                break;
            case "EmergencyContact1State":
                columnName = "Emergency Contact1 State";
                break;
            case "EmergencyContact1Zip":
                columnName = "Emergency Contact1 Zip";
                break;
            case "EmergencyContact2City":
                columnName = "Emergency Contact2 City";
                break;
            case "EmergencyContact2State":
                columnName = "Emergency Contact2 State";
                break;
            case "EmergencyContact2Zip":
                columnName = "Emergency Contact2 Zip";
                break;
            case "LocalMedicalRecordNumber":
                columnName = "Local Medical Record Number";
                break;
            case "AmdMedicalRecordNumber":
                columnName = "Amd Medical Record Number";
                break;
            default:
                columnName = databaseResult[i].ColName;
                break;

        }
        var html = `<div class="row">`
        if (databaseResult[i].ColType == 'int' || databaseResult[i].ColType == 'bit') {
            html += `<div class="col-md-6"><div class="DatabaseFields">${columnName} ( ${databaseResult[i].ColType == "bit" ? "Boolean" : "Number"})</div></div>`
          } else {
            html += `<div class="col-md-6"><div class="DatabaseFields">${columnName} (character( ${databaseResult[i].ColLength == -1 ? "max" : databaseResult[i].ColLength}))</div></div>`
        }
        html += `<div id="getFileFields_${i}" class="col-md-6 FileFields"></div></div> `
        $PotientialClientModal.find('#dbandFileFields').append(html);

        // append dropdowns start
        var ddl = $("<select></select>").attr("id", databaseResult[i].ColName).attr("name", databaseResult[i].ColName).attr("class", "form-control dllFileFields").attr("columntype", databaseResult[i].ColType);

        $.each(fileResult, function (index, el) {
            ddl.append("<option>" + el + "</option>");
        });
        ddl.val(fileResult[i]);
        $PotientialClientModal.find('#getFileFields_' + i).append(ddl);
           // append dropdowns end
    }
   
}

function DeletePotentialPatient(id) {
    $(".loaderOverlay").show();
    $.ajax({
        type: "POST",
        url: Apipath + '/api/PatientMain/DeletePotentialPatient?patientId=' + id,
        contentType: 'application/json; charset=UTF-8',
        dataType: "json",
        success: function (result) {
            if (result == 1) {
                toastr.success("Potiental Client Deleted successfully");
                BindPotentialClientsTable();
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
function IsPatientDetailValid(id) {
    $.ajax({
        type: "GET",
        url: Apipath + '/api/PatientMain/GetPotientalPatientDetail?patientId=' + id,
        contentType: 'application/json; charset=UTF-8',
        dataType: "json",
        async: false,
        success: function (result) {
           

            if (result != null && result != '') {
                // required fields validation start
                if (result.FirstName == "" || result.FirstName == null) {
                    return false;
                }
                if (result.LastName == "" || result.LastName == null) {
                    return false;
                }
                if (result.Gender == "" || result.Gender == null) {
                    return false;
                }
                if (!ValidateDOB(result.DateOfBirth)) {
                    return false;
                }
                if (result.RaceEthnicity == "" || result.RaceEthnicity == null) {
                    return false;
                }
                if (result.EmergencyContact1Name == "" || result.EmergencyContact1Name == null) {
                    return false;
                }
                if (result.EmergencyContact1Address == "" || result.EmergencyContact1Address == null) {
                    return false;
                }
                if (!ValidateEmail(result.EmergencyContact1EmailAddress)) {
                    return false;
                }
                if (result.EmergencyContact1Relationship == "" || result.EmergencyContact1Relationship == null) {
                    return false;
                }
                if (result.ChildrenUnder18 == "" || result.ChildrenUnder18 == null) {
                    return false;
                }
                if (result.Adults18to65 == "" || result.Adults18to65 == null) {
                    return false;
                }
                if (result.Adults65Plus == "" || result.Adults65Plus == null) {
                    return false;
                }
                if (result.LanguagesSpeak == "" || result.LanguagesSpeak == null) {
                    return false;
                }
                if (result.EverBeenSmoker != "" && result.EverBeenSmoker != null) {
                    if (result.EverBeenSmoker.toLowerCase() == "yes" && result.QuitSmoking != null && result.QuitSmoking != "") {
                        if (result.QuitSmoking.toLowerCase() == "yes" && (result.SmokingQuitDate == null || result.SmokingQuitDate == "")) {
                            return false;
                        }
                    }
                    esle
                    {
                        return false;
                    }
                }
                else {
                    return false;
                }
                // required fields validation  End

                // date fields validation  Start
                if (result.SmokingQuitDate != "" && result.SmokingQuitDate != null) {
                    if (!ValidateDates(result.SmokingQuitDate)) {
                        return false;
                    }
                }
                if (result.SmokingQuitDate != "" && result.SmokingQuitDate != null) {
                    if (!ValidateDates(result.SmokingQuitDate)) {
                        return false;
                    }
                }
                // date fields validation  End

                //  Integer fields validation   Start
                if (isNaN(result.Zip)) {
                    return false;
                }
                if (isNaN(result.PatientChildren)) {
                    return false;
                }
                if (isNaN(result.EmergencyContact1Zip)) {
                    return false;
                }
                if (isNaN(result.EmergencyContact2Zip)) {
                    return false;
                }
                if (isNaN(result.ChildrenUnder18)) {
                    return false;
                }
                if (isNaN(result.Adults18to65)) {
                    return false;
                }
                if (isNaN(result.Adults65Plus)) {
                    return false;
                }

                //  Integer fields validation   End
                
                //  Format validation for  Phone,HomePhone,SSN start
                if (!validatePhone(result.HomePhone)) {
                    return false;
                }
                if (!validatePhone(result.CellPhone)) {
                    return false;
                }
                //  Format validation for  Phone,HomePhone,SSN End
                return true
                
            }


        }

    })
}
function validatePhone(phone)
{
    var res = phone.replace(/[^\d]/g, '');
    if (isNan(res) && res.length != 10)
    {
        return false;
    }
    return true
}
function ValidateDates(date) {
    var pattern = /^([0-9]{2})\/([0-9]{2})\/([0-9]{4})$/;
    if (!pattern.test(date)) {
        return false;
    }
}

function ValidateDOB(dob) {
    
    var pattern = /^([0-9]{2})\/([0-9]{2})\/([0-9]{4})$/;
    if (!pattern.test(dob))
    {
        return false;
    }
    else
    {
        var date = new Date(dob);
        var year = date.getFullYear();
        var currentYear = new Date().getFullYear() + 1

        if (year > 1900 && year <= currentYear) {
            return true;
        }
        return false
    }
}

function ValidateEmail(email) {

    var pattern = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (email == "" || email == null) {
        return false;
    }
    else if (!pattern.test(email)) {
        
        return false;
    }
    return true;
}



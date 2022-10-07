


var $PotientialClientModal = $('#PotentialClientFileUpload')
var $PotentialClientFileUpload = $('#PoteintialClientFileInput')
var $btnsavepotentialclients = $('#btnsavepotentialclients');
var $inValidClientsDetails = $('#inValidClientsDetails');
var filePath = '';
var $tblPotientialPatient = $('#tblPotientialPatient');
var summaryElem = $('#summary');
var TotalFileColumns = '';



$btnsavepotentialclients.click(function () {
    
    var ddlExcelTypeValue = $('#ddlExcelType').val();
    var dataCameFrom = $('#txtdataCameFrom').val();
    var importNotes = $('#txtImportNotes').val();
    var importDate = $('#ImportDate').val();
    if (dataCameFrom == '' || dataCameFrom == null) {
        alert('Please enter value for Data Came From');
        $('#txtdataCameFrom').focus();
        return false;
    }
    if (importNotes == '' || importNotes == null) {
        alert('Please enter value for Import Notes');
        $('#txtImportNotes').focus();
        return false;
    }
    if (importDate == '' || importDate == null) {
        alert('Please enter value for Import Date');
        $('#ImportDate').focus();
        return false;
    }
    if (ddlExcelTypeValue == "organised") {

        var isddlvalid = true;
        var selectedfileFields = [];
        $('.fileandDbFields').each(function () {
            var dbElm = $(this).find('.dllFileFields');
            var ddlvalue = dbElm.val();
            if (ddlvalue != null && ddlvalue != "" && ddlvalue != "Not Assigned" && $.trim(selectedfileFields.indexOf(ddlvalue)) != -1) {
                isddlvalid = false;
                alert('same field is selected multiple times');
                dbElm.focus();
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
            $('.fileandDbFields').each(function (i) {
                var ele = $(this);
                var fileEle = ele.find('.DatabaseFields');
                var dbEle = ele.find('.dllFileFields');
                if (dbEle.val() !="Not Assigned") {

                    var value = dbEle.val().split("(");
                    var name = GetDatabaseValue(value[0].trim());
                    var selectedValue = fileEle.html();
                    dbfields[name] = selectedValue;
                }
                
            })
          
            formdata.append("dbfields", JSON.stringify( dbfields ));
            formdata.append("dataCameFrom", dataCameFrom);
            formdata.append("importNotes", importNotes);
            formdata.append("importDate", importDate);

            $.ajax({
                url: '/Client/SavePotentialClientData',
                type: 'POST',
                data: formdata,
                beforeSend: function () {
                    $(".loaderOverlay").show();
                },
                processData: false,
                contentType: false,
                cache: false,
                success: function (data) {
                    clearInputFields();
                    $(".loaderOverlay").hide();
                    if (data.Status === 1 && data.showPopup==true && data.InvalidClientsDetailList.length) {
                        ClosePotentialClientModal(false);
                        BindPotentialClientsTable();
                        showInvalidFields(data.InvalidClientsDetailList, data.tableColumns);
                    }
                    else if (data.Status === 1) {
                        ClosePotentialClientModal(false);
                        alert(data.Message);
                        BindPotentialClientsTable();


                    } else {
                        alert("Failed to Save Data");
                        ClosePotentialClientModal(false);
                    }
                },
                error: function (e, textStatus, errorMessage) {
                    alert(errorMessage);
                    $(".loaderOverlay").hide();
                    BindPotentialClientsTable();
                    ClosePotentialClientModal(false);
                }
            });

        }
    }
    else {
        var isInputFieldsvalid = true;
        var rangeElem = $("#getFileFields_0");
        var rangeFrom = rangeElem.find('.rangeFrom').val().replace(/\D/g, '');
        var rangeTo = rangeElem.find('.rangeTo').val().replace(/\D/g, '');
        var rangeDifference = parseInt(rangeTo) - parseInt(rangeFrom);
        $('#dbandFileFields .FileFields').each(function (k, v) {
            var ele = $(v);
            var _rangefrom = $(ele).find('.rangeFrom').val();
            var _rangeto = $(ele).find('.rangeTo').val();
            
            var range = parseInt(_rangeto.replace(/\D/g, '')) - parseInt(_rangefrom.replace(/\D/g, ''));
          
            if (!isNaN(parseFloat(range)) && range != rangeDifference) {
                isInputFieldsvalid = false;
                alert('Please select same range for all fields');
                $(ele).find('.rangeFrom').focus();
                return false;
            } 

        });
        if ($('#FirstName').val() == '' || $('#FirstName').val() == null) {
            isInputFieldsvalid = false;
            alert('Please select any field for First Name');
            $('#FirstName').focus();
            return false;
        }
        if ($('#FirstNameTo').val() == '' || $('#FirstName').val() == null) {
            isInputFieldsvalid = false;
            alert('Please select any field for First Name');
            $('#FirstNameTo').focus();
            return false;
        }
        if ($('#LastName').val() == '' || $('#LastName').val() == null) {
            isInputFieldsvalid = false;
            alert('Please select any field for Last Name ');
            $('#LastName').focus();
            return false;
        }
        if ($('#LastNameTo').val() == '' || $('#LastName').val() == null) {
            isInputFieldsvalid = false;
            alert('Please select any field for Last Name ');
            $('#LastNameTo').focus();
            return false;
        }
        if ($('#EmailAddress').val() == '' || $('#EmailAddress').val() == null) {
            isInputFieldsvalid = false;
            alert('Please select any field for Email Address');
            $('#EmailAddress').focus();
            return false;
        }
        if ($('#EmailAddressTo').val() == '' || $('#EmailAddress').val() == null) {
            isInputFieldsvalid = false;
            alert('Please select any field for Email Address');
            $('#EmailAddressTo').focus();
            return false;
        }
        if (!isInputFieldsvalid) {
            return false;
        }
        else {
            var files = $PotentialClientFileUpload.get(0).files;

            var formdata = new FormData();
            formdata.append('file', files[0]);
            var dbfields = {};

            $("#dbandFileFields .FileFields").each(function () {
                var name = $(this).find('.rangeFrom').attr('id');
                var from = $(this).find('.rangeFrom').val();
                var to = $(this).find('.rangeTo').val();
                dbfields[name] = from + ',' + to;
            });
        
            formdata.append("dbfields", JSON.stringify(dbfields));
            formdata.append("fileRange", JSON.stringify(rangeDifference + 1));
            formdata.append("dataCameFrom", dataCameFrom);
            formdata.append("importNotes", importNotes);
            formdata.append("importDate", importDate);
            
            $.ajax({
                url: '/Client/SavePCFromUnorganisedExcel',
                type: 'POST',
                data: formdata,
                beforeSend: function () {
                    $(".loaderOverlay").show();
                },
                processData: false,
                contentType: false,
                success: function (data) {
                    clearInputFields();
                    $(".loaderOverlay").hide();
                    if (data.Status === 1 && data.InvalidClientsDetailList.length) {
                        ClosePotentialClientModal();
                        BindPotentialClientsTable();
                        showInvalidFieldsForUnOrganised(data.InvalidClientsDetailList, data.tableColumns);
                    }
                    else if (data.Status === 1) {
                        ClosePotentialClientModal(false);
                        alert(data.Message);
                        BindPotentialClientsTable();


                    } else {
                        alert("Failed to Save Data");
                    }
                },
                error: function () {
                    $(".loaderOverlay").hide();
                    BindPotentialClientsTable();
                    ClosePotentialClientModal(false);

                }
            });

        }

    }
});
function showInvalidFields(data, tableColumns) {
    var recordshtml = "";
    var tableHeader = ""
    for (var i = 0; i < tableColumns.length;i++) {
        tableHeader += `<th>${tableColumns[i]}</th>`
    }
    $('#tblInvalidClientsHeader .table-active').html('').append(tableHeader);
    
    for (var i = 1; i <= tableColumns.length; i++) {
        var items = data.filter(function (el) {
            return el.RowNumber == i;
        });
        var tblrow = "";
        tblrow  +='<tr>';
       
        $.each(items, function (index, item) {
            tblrow += `<td width="20%"${!item.IsValid ? "style=background-color:#f58888;" : ""}>${item.ColumnValue == null ? "" : item.ColumnValue}</td>`
        });
        tblrow += '</tr>';
        
        recordshtml += tblrow;
    }
   
        
    
    
    $('#tblInvalidClientsBody').html("").append(recordshtml);
    $inValidClientsDetails.modal('show');
}

function showInvalidFieldsForUnOrganised(data, tableColumns) {
    var recordshtml = "";
    var tableHeader = ""
    for (var i = 0; i < tableColumns.length; i++) {
        tableHeader += `<th>${tableColumns[i]}</th>`
    }
    $('#tblInvalidClientsHeader .table-active').html('').append(tableHeader);
    
    for (var i = 0; i < tableColumns.length; i++) {
        var items = data.filter(function (el) {
            return el.RowNumber == i;
        });
        var tblrow = "";
        tblrow += '<tr>';
        
        $.each(items, function (index, item) {
            tblrow += `<td width="20%"${!item.IsValid ? "style=background-color:#f58888;" : ""}>${item.ColumnValue == null ? "" : item.ColumnValue}</td>`
        });
        tblrow += '</tr>';

        recordshtml += tblrow;
    }




    $('#tblInvalidClientsBody').html("").append(recordshtml);
    $inValidClientsDetails.modal('show');
}
function CloseDuplicateRecordsPopup() {
    $inValidClientsDetails.modal('hide');
}
function clearInputFields() {
    $('.div_newcolumns .form-control').val('');
}
function ClosePotentialClientModal(showAlert) {
    
    if (showAlert && showAlert != undefined) {
        if (confirm("Are you sure! you want to close popup")) {
            $PotientialClientModal.modal('hide');

            $PotentialClientFileUpload.wrap('<form>').closest(
                'form').get(0).reset();
            $PotentialClientFileUpload.unwrap();
        }
    }
    else {
        $PotientialClientModal.modal('hide');

        $PotentialClientFileUpload.wrap('<form>').closest(
            'form').get(0).reset();
        $PotentialClientFileUpload.unwrap();
    }
    clearInputFields();
}
function GetDatabaseValue(colName) {
    var columnName = "";
    if (colName != '' && colName != null && colName != "Not Assigned") {
        switch (colName) {
            case "First Name":
                columnName = "FirstName";
                break;
            case "Last Name":
                columnName = "LastName";
                break;
            case "Middle Name":
                columnName = "MiddleName";
                break;
            case "Which gender do you identify as":
                columnName = "Gender";
                break; 
            case "Date Of Birth":
                columnName = "DateOfBirth";
                break;
            case "Social Security Number":
                columnName = "SocialSecurityNumber";
                break;
            case "Race/Ethnicity":
                columnName = "RaceEthnicity";
                break;
            case "Is Permanent Address":
                columnName = "IsPermanentAddress";
                break;
            case "Permanent Address":
                columnName = "PermanentAddress";
                break;
            case "Email Address":
                columnName = "EmailAddress";
                break;
            case "Home Phone":
                columnName = "HomePhone";
                break;
            case "Cell Phone":
                columnName = "CellPhone";
                break;
            case "Best way to contact you":
                columnName =  "WayToContact";
                break;
            case "Patient Children":
                columnName = "PatientChildren";
                break;
            case "Patient Childrens Ages":
                columnName = "PatientChildrensAges";
                break;
            case "Children Under 18":
                columnName = "ChildrenUnder18";
                break;
            case "Adults 18-65":
                columnName = "Adults18to65";
                break;
            case "Adults 65+":
                columnName = "Adults65Plus";
                break;
            case "Preferred Pharmacy Name":
                columnName = "PreferredPharmacyName";
                break;
            case "Preferred Pharmacy Location":
                columnName = "PreferredPharmacyLocation";
                break;
            case "Are you now or were you ever a member of the U.S. Armed Forces?":
                columnName = "EverMemberOfUSArmedForces";
                break;
            case "Marital Status":
                columnName = "MaritalStatus";
                break;
            case "Which languages do you speak comfortably?":
                columnName = "LanguagesSpeak";
                break;
            case "Have you ever been a smoker":
                columnName =  "EverBeenSmoker";
                break;
            case "Have you Quit?":
                columnName =  "QuitSmoking";
                break;
            case "Quit Date":
                columnName =  "SmokingQuitDate";
                break;
            case "What are your preferred pronouns":
                columnName =  "PreferredPronouns";
                break;
            case "Do you think of yourself as":
                columnName =  "ThinkYourselfAs";
                break;
            case "Emergency Contact1 Name":
                columnName = "EmergencyContact1Name";
                break;
            case "Emergency Contact1 Address":
                columnName = "EmergencyContact1Address";
                break;
            case "Emergency Contact1 Email Address":
                columnName = "EmergencyContact1EmailAddress";
                break;
            case "Emergency Contact1 Relationship":
                columnName = "EmergencyContact1Relationship";
                break;
            case "Emergency Contact2 Name":
                columnName = "EmergencyContact2Name";
                break;
            case "Emergency Contact2 Address":
                columnName = "EmergencyContact2Address";
                break;
            case "Emergency Contact2 Email Address":
                columnName = "EmergencyContact2EmailAddress";
                break;
            case "Emergency Contact2 Relationship":
                columnName = "EmergencyContact2Relationship";
                break;
            case "When was the last time you smoked?":
                columnName =  "LastTimeYouSmoked";
                break;
            case "Emergency Contact1 City":
                columnName = "EmergencyContact1City";
                break;
            case "Emergency Contact1 State":
                columnName = "EmergencyContact1State";
                break;
            case "Emergency Contact1 Zip":
                columnName = "EmergencyContact1Zip";
                break;
            case "Emergency Contact2 City":
                columnName = "EmergencyContact2City";
                break;
            case "Emergency Contact2 State":
                columnName = "EmergencyContact2State";
                break;
            case "Emergency Contact2 Zip":
                columnName = "EmergencyContact2Zip";
                break;
            case "Local Medical Record Number":
                columnName = "LocalMedicalRecordNumber";
                break;
            case "Amd Medical Record Number":
                columnName = "AmdMedicalRecordNumber";
                break;
            default:
                columnName = colName;
                break;

        }
        return columnName;
    }
}
$PotentialClientFileUpload.change(function (e) {
    $(".loaderOverlay").show();
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
                    var ddlExcelTypeValue = $('#ddlExcelType').val();
                    if (res) {
                        summaryElem.find('#totalRecords span').html(res.totalRecords);
                        TotalFileColumns = res.filecolumns.length
                        summaryElem.find('#spanTotalCols').html(TotalFileColumns);
                        if (ddlExcelTypeValue == "organised")
                        {
                            if (res.filecolumns.length > res.databaseColumns.length) {
                                summaryElem.find('#spancolsMatched').html(0);
                            }
                            else {
                                summaryElem.find('#spancolsMatched').html(0);
                            }
                           
                            AppendColumnsLists(res)
                           
                        }
                        else
                        {
                            summaryElem.find('#spancolsMatched').html(0);
                            AppendColumnsListsForUO(res)
                        }
                        $('.date').datepicker(
                            {
                                uiLibrary: 'bootstrap',
                                changeYear: true,
                                changeMonth: true,
                            }

                        );
                    }
                    $PotientialClientModal.modal('show');
                    $(".loaderOverlay").hide();
                },
                error: function (xhr, status, p3, p4) {
                    var err = "Error " + " " + status + " " + p3 + " " + p4;
                    if (xhr.responseText && xhr.responseText[0] == "{")
                        err = JSON.parse(xhr.responseText).Message;
                    console.log(err);
                    $(".loaderOverlay").hide();
                }
            });
        } else {
            alert("This browser doesn't support HTML5 file uploads!");
            $(".loaderOverlay").hide();
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

    $("#tblPotientialPatient").dataTable({
        "scrollY": 'calc(100vh - 303px)',
        "scrollX": true,
        "paging": true,
        "ordering": true,
        "filter": true,
        "destroy": true,
        "orderMulti": false,
        "serverSide": true,
        "Processing": true,
        "ajax":
        {
            "url": "/Patient/GetPotientialPatientsList",
            "type": "POST",
            "dataType": "JSON"
        },
        'columnDefs': [{
            'targets': [6],
            'orderable': false
        }],
        "columns": [
            {
                "data": "PatientId"
            },
            {
                "data": null,
                "render": function (data) {
                    return GetFullName(data.FirstName, data.LastName);
                }
            },
            {
                "data": "EmailAddress",
                "render": function (value) {
                    if (value != null) {
                        return value;
                    }
                    else {
                        return "";
                    }
                }

            },
            {
                "data": "CellPhone",
                "render": function (value) {
                    if (value != null) {
                        return value;
                    }
                    else {
                        return "";
                    }
                }
            },
            {
                "data": "ModifiedDate",
                "render": function (value) {
                    
                    if (value === null) return "";

                    var pattern = /Date\(([^)]+)\)/;
                    var results = pattern.exec(value);
                    var dt = new Date(parseFloat(results[1]));
                    var time = dt.toLocaleTimeString();
                    return (dt.getMonth() + 1) + "/" + dt.getDate() + "/" + dt.getFullYear() + " " + time;
                }
            },
            {
                "data": "CreatedDate",
                "render": function (value) {
                    
                    if (value === null) return "";

                    return value;
                  
                }
            },
            {
                "data": null,
                "render": function (data) {
                    var potentialPatient = "";
                    if (duplicates.filter(e => e.EmailAddress === data.EmailAddress || e.SocialSecurityNumber === data.SocialSecurityNumber).length == 0 && canMovePClientPerm == "True") {
                        potentialPatient += `<button href="javascript:void(0)" id="btnpatientmove" onclick="MovePotentialPatient(${data.PatientId})" class="btn btn-success label-fields"> <i class=""></i>
                                        Move</button>`;
                    }
                    if (canEditPClientPerm == "True") {
                        potentialPatient += `<a href="/Patient/EditPotentialPatient?patientId=${data.PatientId}" id="btnpatientedit" class="btn btn-success label-fields"> <i class="far fa-edit"></i>
                                        Edit</a>`;
                    }
                    if (canDeletePClientPerm == "True") {
                        potentialPatient += `<button href="javascript:void(0)" id="btnpatientDelete" onclick="DeletePotentialPatient(${data.PatientId})" class="btn btn-danger label-fields"> <i class=""></i>
                                        Delete</button>`;
                    }

                    return potentialPatient;
                }
            }

        ],
        "fnRowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            if (duplicates.filter(e => e.EmailAddress === aData.EmailAddress).length > 0) {
                var firstCell = $(nRow).children('td:first');
                $('td', nRow).css('background-color', '#f78888');
                $('td', nRow).css('color', 'White');
                firstCell.css('cursor', 'pointer');
                firstCell.click(function () {
                    GetDuplicateRecordDetails(aData.PatientId)
                })
            }
            if (aData.IsNewpatient == null || aData.IsNewpatient) {
                $('td', nRow).css('background-color', '#dceb53');
                $('td', nRow).css('color', 'black');
            }
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
    $PotientialClientModal.find('#dbandFileFields').append('<div class="row"><div class="col-md-6 colTitle">Source(Import File)</div><div class="col-md-6 colTitle">Target (Roots)</div></div>');
    for (let i = 0; i < fileResult.length; i++) {
       
        var html = `<div class="row fileandDbFields">`
        html += `<div class="col-md-6"><div class="s_field_wrap"><div id="fileColumns_${i}" class="DatabaseFields">${fileResult[i]}</div><span class="spn_check hidden"><i class="fa fa-check"></i></span></div></div>`;
        html += `<div id="getFileFields_${i}" class="col-md-6 FileFields"></div></div> `
        
        $PotientialClientModal.find('#dbandFileFields').append(html);

        // append dropdowns start
        var ddl = $("<select></select>").attr("id", fileResult[i]).attr("name", fileResult[i]).attr("class", "form-control dllFileFields").attr("columntype", databaseResult[i].ColType);
        ddl.append("<option>Not Assigned</option>");
       /* var ddlvalue = "";*/
        $.each(databaseResult, function (index, el) {
            var columnName = "";
           
            switch (el.ColName) {
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
                    columnName = el.ColName;
                    break;

            }
            var ddlOption = "";
            if (el.ColType == 'int' || el.ColType == 'bit') {
                ddlOption += `${columnName} ( ${el.ColType == "bit" ? "Boolean" : "Number"})`
            } else {
                ddlOption += `${columnName} (character( ${el.ColLength == -1 ? "max" : el.ColLength}))`
            }
            //if (index == i) {
            //    ddlvalue = ddlOption;
            //}
            ddl.append("<option key='" + el.ColName +"'>" + ddlOption + "</option>");
        });
       /* ddl.val(ddlvalue);*/
        $PotientialClientModal.find('#getFileFields_' + i).append(ddl);
           // append dropdowns end
    }
    $('.dllFileFields').change(function () {
        var ele = $(this).parent();
        
        var selectedval = $(this).val();
        var matchedCol = summaryElem.find('#spancolsMatched').html();
        if (selectedval != 'Not Assigned') {
            if (matchedCol < TotalFileColumns) {
                matchedCol = parseInt(matchedCol) + 1;
                ele.prev('div').find('.spn_check').removeClass('hidden');
            }
        }
        else {
            matchedCol = parseInt(matchedCol) - 1;
            ele.prev('div').find('.spn_check').addClass('hidden');
        }

        summaryElem.find('#spancolsMatched').html(matchedCol);
    })

}


function DeletePotentialPatient(id) {
    $.confirm({
        icon: 'fas fa-exclamation-triangle',
        title: 'Confirm',
        content: 'The record will be permanently deleted!  Are you sure?',
        type: 'red',
        columnClass: 'col-md-6 col-md-offset-3',
        typeAnimated: true,
        buttons: {
            yes: {
                btnClass: 'btn-red',
                action: function () {
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
            },
            no: function () {
            }
        }
    });


   
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
                if (result.ChildrenUnder18.toString() == "" || result.ChildrenUnder18 == null) {
                    return false;
                }
                if (result.Adults18to65.toString() == "" || result.Adults18to65 == null) {
                    return false;
                }
                if (result.Adults65Plus.toString() == "" || result.Adults65Plus == null) {
                    return false;
                }
                if (result.LanguagesSpeak == "" || result.LanguagesSpeak == null) {
                    return false;
                }
                if (result.EverBeenSmoker == true || result.EverBeenSmoker == false) {
                    if (result.EverBeenSmoker == true && (result.QuitSmoking == true || result.QuitSmoking == false)) {
                        if (result.QuitSmoking == true && (result.SmokingQuitDate == null || result.SmokingQuitDate == "")) {
                            return false;
                        }
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
                if (result.DateOfBirth != "" && result.DateOfBirth != null) {
                    if (!ValidateDates(result.DateOfBirth)) {
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

            }


        }

    });
    return true;
}

function validatePhone(phone)
{
    
    var res = phone.replace(/[^\d]/g, '');
    if (isNaN(res) && res.length != 10)
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
    else {
        return true
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

function GetDuplicateRecordDetails(id) {

    $.ajax({
        type: "GET",
        url: '/Client/GetDuplicatePatientsDetails?patientId='+id,
        dataType: "json",
        async: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            
            var popup = $('#duplicateRecordDetails #duplicateFields');
            popup.find('#fromPotentialTable #potentialPatients').html('');
            popup.find('#fromMainTable #mainPatients').html('');
           
            
          
            if (result)
            {
                for (var i = 0; i < result.length;i++)
                {
                    
                    if (result[i].IsFromMainTable == 'False' || result[i].IsFromMainTable == false)
                    {
                        var html = `<div class="p_content_block">`
                        html += `<div class="form-group"><label>Client ID:</label> <label><a href="/Patient/EditPotentialPatient?patientId=${result[i].PatientID}" target="_blank">${result[i].PatientID}</a></label></div>
                                <div class="form-group"><label>Name:</label> <label>${GetFullName(result[i].FirstName, result[i].LastName)}</label></div>`
                        if (result[i].EmailAddress != null && result[i].EmailAddress != "")
                        {
                            html += `<div class="form-group"><label>Email:</label> <label>${result[i].EmailAddress != null ? result[i].EmailAddress : ""}</label></div>`
                        }
                        if (result[i].DateOfBirth != null && result[i].DateOfBirth != "")
                        {
                            html += `<div class="form-group"><label>Date Of Birth:</label> <label>${result[i].DateOfBirth != null ? result[i].DateOfBirth : ""}</label></div>`
                        }
                        if (result[i].SocialSecurityNumber != null && result[i].SocialSecurityNumber != "")
                        {
                            html += `<div class="form-group"><label>Social Security Number:</label>
                                              
                                                  <input type="password" class="txtSocialSecNo" name="SocialSecurityNumber"
                                                       placeholder="*********" value="${result[i].SocialSecurityNumber != null ? result[i].SocialSecurityNumber : ""}">
                                                <span class="showHideSSN" onclick=showHideSSN($(this))>
                                                    <i class="fa fa-eye"></i>
                                                    <i class="fa fa-eye-slash"></i>
                                                </span>
                                            </div>`
                        }
                        if (result[i].CellPhone != null && result[i].CellPhone != "")
                        {
                            html += `<div class="form-group"><label>Cell Phone:</label> <label>${result[i].CellPhone != null ? result[i].CellPhone : ""}</label></div>`

                        }
                        if (result[i].HomePhone != null && result[i].HomePhone != "")
                        {
                            html += ` <div class="form-group"><label>Home Phone:</label> <label>${result[i].HomePhone != null ? result[i].HomePhone : "" }</label></div>`
                        }
                               
                        html += `</div><hr>`

                        popup.find('#fromPotentialTable #potentialPatients').append(html);
                    }
                    else
                    {
                        var html = `<div class="p_content_block">`
                        html += `<div class="form-group"><label>Client ID:</label> <label><a href="/Client/Info?patientid=${result[i].PatientID}" target="_blank">${result[i].PatientID}</a></label></div>
                                 <div class="form-group"><label>Name:</label> <label>${GetFullName(result[i].FirstName, result[i].LastName)}</label></div>`
                        if (result[i].EmailAddress != null && result[i].EmailAddress != "") {
                            html += `<div class="form-group"><label>Email:</label> <label>${result[i].EmailAddress != null ? result[i].EmailAddress : ""}</label></div>`
                        }
                        if (result[i].DateOfBirth != null && result[i].DateOfBirth != "") {
                            html += `<div class="form-group"><label>Date Of Birth:</label> <label>${result[i].DateOfBirth != null ? result[i].DateOfBirth : ""}</label></div>`
                        }
                        if (result[i].SocialSecurityNumber != null && result[i].SocialSecurityNumber != "") {
                            html += `<div class="form-group"><label>Social Security Number:</label>
                                              <input type="password" class="txtSocialSecNo" name="SocialSecurityNumber"
                                                       placeholder="*********" value="${result[i].SocialSecurityNumber != null ? result[i].SocialSecurityNumber : ""}">
                                             <span class="showHideSSN" onclick=showHideSSN($(this))>
                                                <i class="fa fa-eye"></i>
                                                <i class="fa fa-eye-slash"></i>                                            
                                            </span>
                                         </div>`
                        }
                        if (result[i].CellPhone != null && result[i].CellPhone != "") {
                            html += `<div class="form-group"><label>Cell Phone:</label> <label>${result[i].CellPhone != null ? result[i].CellPhone : ""}</label></div>`

                        }
                        if (result[i].HomePhone != null && result[i].HomePhone != "") {
                            html += ` <div class="form-group"><label>Home Phone:</label> <label>${result[i].HomePhone != null ? result[i].HomePhone : ""}</label></div>`
                        }

                        html += `</div><hr>`
                        popup.find('#fromMainTable #mainPatients').append(html);
                    }
                   
                }
                
                if (popup.find('#fromPotentialTable #potentialPatients').html() == '') {
                    popup.find('#fromPotentialTable').hide();
                }
                else {
                    popup.find('#fromPotentialTable').show();
                }
                if (popup.find('#fromMainTable #mainPatients').html() == '') {
                    popup.find('#fromMainTable').hide();
                }
                else {
                    popup.find('#fromMainTable').show();
                }
                $('#duplicateRecordDetails').modal('show');
             
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

function CloseDuplicatePopup() {
    $('#duplicateRecordDetails').modal('hide');
}
function AppendColumnsListsForUO(result) {
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
            html += `<div class="col-md-6"><div class="DatabaseFields">${columnName} ( ${databaseResult[i].ColType == "bit" ? "Boolean" : "Number"})</div><span class="spn_check hidden"><i class="fa fa-check"></i></span></div>`
        } else {
            html += `<div class="col-md-6"><div class="DatabaseFields">${columnName} (character( ${databaseResult[i].ColLength == -1 ? "max" : databaseResult[i].ColLength}))</div><span class="spn_check hidden"><i class="fa fa-check"></i></span></div>`
        }
        // append text boxes start
        html += `<div id="getFileFields_${i}" class="col-md-6 FileFields"><input class="form-control rangeFrom" type="text" id="${databaseResult[i].ColName}" name="${databaseResult[i].ColName}"> <input class="form-control rangeTo" type="text" id="${databaseResult[i].ColName}To" name="${databaseResult[i].ColName}To"> </div></div>`



        $PotientialClientModal.find('#dbandFileFields').append(html);
        /* $PotientialClientModal.find('#getFileFields_' + i).append(ddl);*/
        // append text boxes end

    }

   
    $PotientialClientModal.find('#dbandFileFields .FileFields input').blur(function () {
        var val = $(this).val().toUpperCase();
        $(this).val(val);

        var matchedCol = summaryElem.find('#spancolsMatched').html();
        var ele = $(this).parent();
        var _rangefrom = $(ele).find('.rangeFrom').val();
        var _rangeto = $(ele).find('.rangeTo').val();
        if (_rangefrom != '' && _rangeto != '' && matchedCol < TotalFileColumns) {
            matchedCol = parseInt(matchedCol) + 1;
        }
        summaryElem.find('#spancolsMatched').html(matchedCol);
        
    })
}

function showHideSSN(element) {
    
    if (element.hasClass("active")) {
        element.removeClass("active");
        element.parent().find('input').attr("type", "password");
    }
    else {
        element.addClass("active");
        element.parent().find('input').attr("type", "text");
    }
}
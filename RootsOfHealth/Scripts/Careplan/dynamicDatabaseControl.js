var newdatabaseid = 0
var newid = "";
var connectdatabase = '#droppable';
var ClientForms = []
var ClientFormFields=[]

    
function GetDataBaseForms() {
    $.ajax({
        type: "GET",
        url: Apipath + '/api/PatientMain/getclientformandfields',
        contentType: 'application/json; charset=UTF-8',
        dataType: "json",
        async: false,
        success: function (res) {
           
            if (res) {
                var Html=''
                ClientForms = res.filter(c => c.Field == "");
                ClientFormFields = res.filter(c => c.Field != "");
                 Html += '<option value="0">Select a Client Form</option><option value="Profile-Form">Profile</option>'
                for (let i = 0; i < ClientForms.length; i++) {
                    Html += `<option value="${ClientForms[i].ClientForm}">${ClientForms[i].ClientForm}</option>`
                }
                
                $('#ddlform').html(Html);
            }

        }, error: function () {
            toastr.error("Unidentified error");
            $(".loaderOverlay").hide();
        }
    });
}

GetDataBaseForms()




function CheckSortableDatabase() {
    if ($("#droppable").find(".basecontentarea").length > 0 && programId == '0') {
        connectdatabase = ".baseheader,.basefooter";
    } else if ($("#droppable").find(".basecontentarea").length > 0 && programId != '0') {
        connectdatabase = ".contentarea1,.contentarea2,.contentarea3";
    }
    DatabaseFormFields();
}

var specificClientFields=[]
//use to add list inside database-control-box based on selected form and make list item darag and drop on right side area
function DatabaseFormFields() {
    
    var selectedForm = $('#ddlform').val();
    var databasecontrol_li = ''
    $("#database-control-box").html("");

    if (selectedForm != 'Profile-Form') {
        specificClientFields = ClientFormFields.filter(c => c.ClientForm == selectedForm)
        
        for (let i = 0; i < specificClientFields.length; i++) {
            databasecontrol_li += `<li data-controlId= "${specificClientFields[i].ControlId}" data-columnType="${specificClientFields[i].ColumnType}" data-type="${specificClientFields[i].Field}" data-index="${specificClientFields[i].ClientForm}" class="databasecontrol"><span>${specificClientFields[i].FieldName}</span></li>`;
        }
    }
    else {
        databasecontrol_li += '<li data-type="FirstName" data-index="PatientMain" class="databasecontrol"><span>First name</span></li>';
        databasecontrol_li += '<li data-type="MiddleName" data-index="PatientMain" class="databasecontrol"><span>Middle Name</span></li>';
        databasecontrol_li += '<li data-type="LastName" data-index="PatientMain" class="databasecontrol"><span>Last Name</span></li>';
        databasecontrol_li += '<li data-type="NickName" data-index="PatientMain" class="databasecontrol"><span>Preferred Name/Nickname</span></li>';
        databasecontrol_li += '<li data-type="Gender" data-index="PatientMain" class="databasecontrol"><span>Gender</span></li>';
        databasecontrol_li += '<li data-type="OtherGender" data-index="PatientMain" class="databasecontrol"><span>Other Gender</span></li>';
        databasecontrol_li += '<li data-type="DateOfBirth" data-index="PatientMain" class="databasecontrol"><span>Date of Birth</span></li>';
        databasecontrol_li += '<li data-type="SocialSecurityNumber" data-index="PatientMain" class="databasecontrol"><span>Social Security Number</span></li>';
        databasecontrol_li += '<li data-type="RaceEthnicity" data-index="PatientMain" class="databasecontrol"><span>Race/Ethnicity</span></li>';
        databasecontrol_li += '<li data-type="OtherRace" data-index="PatientMain" class="databasecontrol"><span>Other Race/Ethnicity</span></li>';
        databasecontrol_li += '<li data-type="Address" data-index="PatientMain" class="databasecontrol"><span>Address</span></li>';
        databasecontrol_li += '<li data-type="IsPermanentAddress" data-index="PatientMain" class="databasecontrol"><span>IsPermanentAddress</span></li>';
        databasecontrol_li += '<li data-type="City" data-index="PatientMain" class="databasecontrol"><span>City</span></li>';
        databasecontrol_li += '<li data-type="State" data-index="PatientMain" class="databasecontrol"><span>State</span></li>';
        databasecontrol_li += '<li data-type="Zip" data-index="PatientMain" class="databasecontrol"><span>Zip</span></li>';
        databasecontrol_li += '<li data-type="EmailAddress" data-index="PatientMain" class="databasecontrol"><span>Email Address</span></li>';
        databasecontrol_li += '<li data-type="HomePhone" data-index="PatientMain" class="databasecontrol"><span>Home Phone</span></li>';
        databasecontrol_li += '<li data-type="CellPhone" data-index="PatientMain" class="databasecontrol"><span>Cell Phone</span></li>';
        databasecontrol_li += '<li data-type="WayToContact" data-index="PatientMain" class="databasecontrol"><span>Best way to contact you</span></li>';
        databasecontrol_li += '<li data-type="OtherContact" data-index="PatientMain" class="databasecontrol"><span>Other Contact</span></li>';
        databasecontrol_li += '<li data-type="PatientChildren" data-index="PatientMain" class="databasecontrol"><span>Number Of Children</span></li>';
        databasecontrol_li += '<li data-type="EmergencyContact1Name" data-index="PatientMain" class="databasecontrol"><span>Emergency Contact #1 Name</span></li>';
        databasecontrol_li += '<li data-type="EmergencyContact1EmailAddress" data-index="PatientMain" class="databasecontrol"><span>Emergency Contact #1 Email Address</span></li>';
        databasecontrol_li += '<li data-type="EmergencyContact1Relationship" data-index="PatientMain" class="databasecontrol"><span>Emergency Contact #1 Relationship</span></li>';
        databasecontrol_li += '<li data-type="EmergencyContact1Address" data-index="PatientMain" class="databasecontrol"><span>Emergency Contact #1 Address</span></li>';
        databasecontrol_li += '<li data-type="EmergencyContact1City" data-index="PatientMain" class="databasecontrol"><span>Emergency Contact #1 City</span></li>';
        databasecontrol_li += '<li data-type="EmergencyContact1State" data-index="PatientMain" class="databasecontrol"><span>Emergency Contact #1 State</span></li>';
        databasecontrol_li += '<li data-type="EmergencyContact1Zip" data-index="PatientMain" class="databasecontrol"><span>Emergency Contact #1 Zip</span></li>';
        databasecontrol_li += '<li data-type="EmergencyContact2Name" data-index="PatientMain" class="databasecontrol"><span>Emergency Contact #2 Name</span></li>';
        databasecontrol_li += '<li data-type="EmergencyContact2EmailAddress" data-index="PatientMain" class="databasecontrol"><span>Emergency Contact #2 Email Address</span></li>';
        databasecontrol_li += '<li data-type="EmergencyContact2Relationship" data-index="PatientMain" class="databasecontrol"><span>Emergency Contact #2 Relationship</span></li>';
        databasecontrol_li += '<li data-type="EmergencyContact2Address" data-index="PatientMain" class="databasecontrol"><span>Emergency Contact #2 Address</span></li>';
        databasecontrol_li += '<li data-type="EmergencyContact2City" data-index="PatientMain" class="databasecontrol"><span>Emergency Contact #2 City</span></li>';
        databasecontrol_li += '<li data-type="EmergencyContact2State" data-index="PatientMain" class="databasecontrol"><span>Emergency Contact #2 State</span></li>';
        databasecontrol_li += '<li data-type="EmergencyContact2Zip" data-index="PatientMain" class="databasecontrol"><span>Emergency Contact #2 Zip</span></li>';
        databasecontrol_li += '<li data-type="ChildrenUnder18" data-index="PatientMain" class="databasecontrol"><span>People in household having -> Children under 18</span></li>';
        databasecontrol_li += '<li data-type="Adults18to65" data-index="PatientMain" class="databasecontrol"><span>People in household having -> Adults 18-65</span></li>';
        databasecontrol_li += '<li data-type="Adults65Plus" data-index="PatientMain" class="databasecontrol"><span>People in household having -> Adults 65+</span></li>';
        databasecontrol_li += '<li data-type="PreferredPharmacyName" data-index="PatientMain" class="databasecontrol"><span>Preferred Pharmacy-> Name</span></li>';
        databasecontrol_li += '<li data-type="PreferredPharmacyLocation" data-index="PatientMain" class="databasecontrol"><span>Preferred Pharmacy-> Location</span></li>';
        databasecontrol_li += '<li data-type="EverMemberOfUSArmedForces" data-index="PatientMain" class="databasecontrol"><span>U.S. Armed Forces</span></li>';
        databasecontrol_li += '<li data-type="MaritalStatus" data-index="PatientMain" class="databasecontrol"><span>Marital status</span></li>';
        databasecontrol_li += '<li data-type="OtherMaritalStatus" data-index="PatientMain" class="databasecontrol"><span>Other Marital status</span></li>';
        databasecontrol_li += '<li data-type="LanguagesSpeak" data-index="PatientMain" class="databasecontrol"><span>Languages</span></li>';
        databasecontrol_li += '<li data-type="OtherLanguageSpeak" data-index="PatientMain" class="databasecontrol"><span>Other Language Speak</span></li>';
        databasecontrol_li += '<li data-type="EverBeenSmoker" data-index="PatientMain" class="databasecontrol"><span>Smoker</span></li>';
        databasecontrol_li += '<li data-type="QuitSmoking" data-index="PatientMain" class="databasecontrol"><span>Have you Quit?</span></li>';
        databasecontrol_li += '<li data-type="SmokingQuitDate" data-index="PatientMain" class="databasecontrol"><span>Quit Date</span></li>';
        databasecontrol_li += '<li data-type="LastTimeYouSmoked" data-index="PatientMain" class="databasecontrol"><span>When was the last time you smoked?</span></li>';
        databasecontrol_li += '<li data-type="PreferredPronouns" data-index="PatientMain" class="databasecontrol"><span>Preferred Pronouns</span></li>';
        databasecontrol_li += '<li data-type="OtherPronouns" data-index="PatientMain" class="databasecontrol"><span>Other Preferred Pronouns</span></li>';
        databasecontrol_li += '<li data-type="ThinkYourselfAs" data-index="PatientMain" class="databasecontrol"><span>Think Yourself As</span></li>';
        databasecontrol_li += '<li data-type="OtherThinkYourselfAs" data-index="PatientMain" class="databasecontrol"><span>Other Think Yourself As</span></li>';
    }
   
           
    $("#database-control-box").html(databasecontrol_li);
    $('#database-control-box li').draggable({
        connectToSortable: connectdatabase,
        helper: function () {
            var cloned = $(this).clone();
            cloned.attr('id', (++newdatabaseid).toString());
            return cloned;
        },
        revert: "invalid",
    });
    $(connectdatabase).sortable({
        connectWith: "#database-control-box",
        containment: "#droppable",
        placeholder: "highlight",
        start: function (e, ui) {
            placeholderHeight = ui.item.outerHeight();
            placeholderWidth = ui.item.outerWidth();
            if (placeholderWidth > 100) {
                ui.placeholder.height(placeholderHeight - 2);
                ui.placeholder.width(placeholderWidth - 2);
            } else {
                $(ui.placeholder).css('display', 'none');
            }

        },
        receive: function (event, ui) {
            var draggableType = ui.item.attr("data-type");
            var responseIndex = ui.item.attr("data-index");
            var columnType = ui.item.attr("data-columnType");
            var controlId = ui.item.attr("data-controlId");
           
            var currentid = $(ui.helper).clone().attr('id');
            newid = draggableType + "_" + $(ui.helper).clone().attr('id');
            while (true) {
                if ($(document.getElementById(newid)).length) {
                    currentid = parseInt(currentid) + 1;
                    newid = draggableType + "_" + currentid;
                } else {
                    break;
                }
            }
            var lblValue = $("[data-type=" + draggableType + "] span").html();
            var sectionName = selectedForm;
            var databaseStr = ``;
            databaseStr = `<div  class="dragresize data-frmbtn col-md-12">
                                           <div class="row">
                                           <div class="col-md-12">
                                           <div class="form-row-first mt-0">
                                           <div class="top-form-row d-flex question-container">
                                           <div class="one-columns">
                                           <label class="Add">${sectionName}</label >                                                                                             
                                           </div>
                                           </div>
                                           <div class="bootom-form-row mb-2">
                                           <div class="row">
                                           <div class="col-md-12">
                                           <div class="form-row-first mt-1 data-frm-btn">
                                           <div class="top-form-row d-flex">
                                            <div class="one-columns">
                                            <label>${lblValue}</label>
                                            </div>
                                            </div>
                                            <div class="bootom-form-row d-flex">
                                             <div class="one-columns">                                                                    
                                              <label id="${newid}" data-controlId="${controlId}"  class="database-field" data-columnType="${columnType}" data-index="${responseIndex}">{{ Value }}</label>                                          
                                              </div>                                     
                                               </div>
                                       <div class="event-btn-right"><button class="event-btn file-edit" onclick="EditHtml('${draggableType}','${newid}')"><i class="fas fa-edit"></i></button>
                                       <button class="event-btn file-remove" onclick="RemoveControl(this)"><i class="fa fa-minus-circle" aria-hidden="true"></i></button></div>
                                                </div>
                                      
                                                      </div>
                                                      </div>
                                                      </div>
                                                      </div>
                                                      </div>
                                                      </div>
                                                      </div>
                                                          `;
           

            $(this).find("li.databasecontrol").first().replaceWith(databaseStr);

        },
        stop: function (event, ui) {
            if ($(".baseheader").find(".dragresize").length > 0) {
                $(".baseheader").next("span.basecontentspan").hide();
            }
            if ($(".basefooter").find(".dragresize").length > 0) {
                $(".basefooter").next("span.basecontentspan").hide();
            }
            if ($(".contentarea1").find(".dragresize").length > 0) {
                $(".contentarea1").next("span.basecontentspan").hide();
            }
            if ($(".contentarea2").find(".dragresize").length > 0) {
                $(".contentarea2").next("span.basecontentspan").hide();
            }
            if ($(".contentarea3").find(".dragresize").length > 0) {
                $(".contentarea3").next("span.basecontentspan").hide();
            }
            if (ui.item.hasClass("ui-draggable") && ui.item.attr("data-index") !== undefined) {
                EditHtml(ui.item.attr("data-type"), newid);
            }
        }
    });
}
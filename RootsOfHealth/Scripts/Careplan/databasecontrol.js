var newdatabaseid = 0
var newid = "";
var connectdatabase = '#droppable';
function CheckSortableDatabase() {
    if ($("#droppable").find(".basecontentarea").length > 0 && programId == '0') {
        connectdatabase = ".baseheader,.basefooter";
    } else if ($("#droppable").find(".basecontentarea").length > 0 && programId != '0') {
        connectdatabase = ".contentarea1,.contentarea2,.contentarea3";
    }  
    DatabaseFormFields();
}
//use to add list inside database-control-box based on selected form and make list item darag and drop on right side area
function DatabaseFormFields() {
            var selectedForm = $('#ddlform').val();
            var databasecontrol_li = ''
            $("#database-control-box").html("");
            switch (selectedForm) {
                case "1":
                    databasecontrol_li += '<li data-type="OverallScore" data-index="PatientScore" class="databasecontrol"><span>Score</span></li>';
                    databasecontrol_li += '<li data-type="OverallStatus" data-index="PatientScore" class="databasecontrol"><span>Status</span></li>';
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
                    break;
                case "2":
                    databasecontrol_li += '<li data-type="housingscore" data-index="PatientScore" class="databasecontrol"><span>Score</span></li>';
                    databasecontrol_li += '<li data-type="housingstatus" data-index="PatientScore" class="databasecontrol"><span>Status</span></li>';
                    databasecontrol_li += '<li data-type="PlaceLiveNow" data-index="PatientHousing" class="databasecontrol"><span>The best Place you live</span></li>';
                    databasecontrol_li += '<li data-type="EmergencyShelter" data-index="PatientHousing" class="databasecontrol"><span>You Stay Temporarily</span></li>';
                    break;
                case "3":
                    databasecontrol_li += '<li data-type="financialcscore" data-index="PatientScore" class="databasecontrol"><span>Score</span></li>';
                    databasecontrol_li += '<li data-type="financialcstatus" data-index="PatientScore" class="databasecontrol"><span>Status</span></li>';
                    databasecontrol_li += '<li data-type="DifficultiesInPayingBills" data-index="PatientFinancialSecurity" class="databasecontrol"><span>Difficulties in paying your bills for expenses like' +
                        ' housing, utilities, child care, transportation,' +
                        'telephone, medical care, or other basic needs.</span></li>';
                    databasecontrol_li += '<li data-type="IncomeCoverHouseholdExpenses" data-index="PatientFinancialSecurity" class="databasecontrol"><span>your income generally cover your basic household' +
                        ' expenses.</span></li>';
                    databasecontrol_li += '<li data-type="SkipMeals" data-index="PatientFinancialSecurity" class="databasecontrol"><span>Over the 3 months, you ever cut the size of your' +
                        ' meals or skip meals because there wasn"\ t enough money for food? </span></li>';
                    databasecontrol_li += '<li data-type="CalworksBenefits" data-index="PatientFinancialSecurity" class="databasecontrol"><span>You receive benefits or cash assistance from-> Calworks Benefits (TANF)</span></li>';
                    databasecontrol_li += '<li data-type="SocialSecurityDisabilityInsurance" data-index="PatientFinancialSecurity" class="databasecontrol"><span>You receive benefits or cash assistance from-> Social Security Disability Insurance (SSI)</span></li>';
                    databasecontrol_li += '<li data-type="GeneralAssistance" data-index="PatientFinancialSecurity" class="databasecontrol"><span>You receive benefits or cash assistance from-> General Assistance (GA)</span></li>';
                    databasecontrol_li += '<li data-type="WomenInfantChildrenBenefits" data-index="PatientFinancialSecurity" class="databasecontrol"><span>You receive benefits or cash assistance from-> Women, Infant & Children Benefits (WIC)</span></li>';
                    databasecontrol_li += '<li data-type="UnemploymentBenefits" data-index="PatientFinancialSecurity" class="databasecontrol"><span>You receive benefits or cash assistance from-> Unemployment Benefits</span></li>';
                    databasecontrol_li += '<li data-type="StateDisabilityInsuranceBenefits" data-index="PatientFinancialSecurity" class="databasecontrol"><span>You receive benefits or cash assistance from-> State Disability Insurance Benefits (SDI)</span></li>';
                    databasecontrol_li += '<li data-type="RentalAssistanceBenefits" data-index="PatientFinancialSecurity" class="databasecontrol"><span>You receive benefits or cash assistance from-> Rental Assistance Benefits (e.g. Section 8 housing)</span></li>';
                    break;
                case "4":
                    databasecontrol_li += '<li data-type="employmentscore" data-index="PatientScore" class="databasecontrol"><span>Score</span></li>';
                    databasecontrol_li += '<li data-type="employmentstatus" data-index="PatientScore" class="databasecontrol"><span>Status</span></li>';
                    databasecontrol_li += '<li data-type="LevelofEducation" data-index="PatientEmploymentEducation" class="databasecontrol"><span>What is the highest level of education you have completed?</span></li>';
                    databasecontrol_li += '<li data-type="WorkSituation" data-index="PatientEmploymentEducation" class="databasecontrol"><span>Which of the following best describes your work situation today?</span></li>';
                    databasecontrol_li += '<li data-type="OtherWorkSituation" data-index="PatientEmploymentEducation" class="databasecontrol"><span>Which of the following best describes your other work situation today?</span></li>';
                    databasecontrol_li += '<li data-type="PartTimeNameLocation" data-index="PatientEmploymentEducation" class="databasecontrol"><span>What is the name and location(Part-Time) of where you work?</span></li>';
                    databasecontrol_li += '<li data-type="FullTimeNameLocation" data-index="PatientEmploymentEducation" class="databasecontrol"><span>What is the name and location(Full-Time) of where you work?</span></li>';
                    databasecontrol_li += '<li data-type="ParticipatingInEducationalOrTrainingProgram" data-index="PatientEmploymentEducation" class="databasecontrol"><span>Are you currently participating in an educational or training program to improve your work opportunities?</span></li>';
                    databasecontrol_li += '<li data-type="ParticipatingInEducationalOrTrainingProgram" data-index="PatientEmploymentEducation" class="databasecontrol"><span>Participating in</span></li>';
                    databasecontrol_li += '<li data-type="ProgramName" data-index="PatientEmploymentEducation" class="databasecontrol"><span>Name Of Program</span></li>';
                    databasecontrol_li += '<li data-type="SchoolName" data-index="PatientEmploymentEducation" class="databasecontrol"><span>Name Of School</span></li>';
                    databasecontrol_li += '<li data-type="ProgramSchoolAndYearAttended" data-index="PatientEmploymentEducation" class="databasecontrol"><span>Name of Program/School and Year attended</span></li>';
                    break;
                case "5":
                    databasecontrol_li += '<li data-type="communicationscore" data-index="PatientScore" class="databasecontrol"><span>Score</span></li>';
                    databasecontrol_li += '<li data-type="communicationstatus" data-index="PatientScore" class="databasecontrol"><span>Status</span></li>';
                    databasecontrol_li += '<li data-type="PersonalPhone" data-index="PatientCommunicationAndMobility" class="databasecontrol"><span>Do you have a personal phone where we can easily reach you?</span></li>';
                    databasecontrol_li += '<li data-type="DifficultyGoingPlaces" data-index="PatientCommunicationAndMobility" class="databasecontrol"><span>Over the past year, did you ever have difficulty going to work, school, shopping, or an appointment, because the lack of convenient transportation?</span></li>';
                    databasecontrol_li += '<li data-type="ModesOfTransportation" data-index="PatientCommunicationAndMobility" class="databasecontrol"><span>Which of the following modes of transportation will you typically use to get to Root</span></li>';
                    databasecontrol_li += '<li data-type="OtherTransportation" data-index="PatientCommunicationAndMobility" class="databasecontrol"><span>Other Transportation</span></li>';
                    break;
                case "6": 
                    databasecontrol_li += '<li data-type="healthcarescore" data-index="PatientScore" class="databasecontrol"><span>Score</span></li>';
                    databasecontrol_li += '<li data-type="healthcarestatus" data-index="PatientScore" class="databasecontrol"><span>Status</span></li>';
                    databasecontrol_li += '<li data-type="HealthInsurance" data-index="PatientHealthcare" class="databasecontrol"><span>Do you currently have health insurance?</span></li>';
                    databasecontrol_li += '<li data-type="PlanName" data-index="PatientHealthcare" class="databasecontrol"><span>Plan Name</span></li>';
                    databasecontrol_li += '<li data-type="PolicyNumber" data-index="PatientHealthcare" class="databasecontrol"><span>Policy Number</span></li>';
                    databasecontrol_li += '<li data-type="SSN" data-index="PatientHealthcare" class="databasecontrol"><span>SSN</span></li>';
                    databasecontrol_li += '<li data-type="PrimaryCareDoctor" data-index="PatientHealthcare" class="databasecontrol"><span>Do you have a regular primary care doctor?</span></li>';
                    databasecontrol_li += '<li data-type="LastSeeDoctor" data-index="PatientHealthcare" class="databasecontrol"><span>When did you last see your doctor?</span></li>';
                    databasecontrol_li += '<li data-type="NameOfDoctor" data-index="PatientHealthcare" class="databasecontrol"><span>Name of Doctor</span></li>';
                    databasecontrol_li += '<li data-type="DoctorLocation" data-index="PatientHealthcare" class="databasecontrol"><span>Location</span></li>';
                    databasecontrol_li += '<li data-type="RegularDentist" data-index="PatientHealthcare" class="databasecontrol"><span>Do you have a regular dentist?</span></li>';
                    databasecontrol_li += '<li data-type="LastSeeDentist" data-index="PatientHealthcare" class="databasecontrol"><span>When did you last see your dentist?</span></li>';
                    databasecontrol_li += '<li data-type="NameOfDentist" data-index="PatientHealthcare" class="databasecontrol"><span>Name of Dentist</span></li>';
                    databasecontrol_li += '<li data-type="DentistLocation" data-index="PatientHealthcare" class="databasecontrol"><span>Location</span></li>';
                    databasecontrol_li += '<li data-type="OtherDoctorsTherapists" data-index="PatientHealthcare" class="databasecontrol"><span>Do you see any other doctors, therapists, counselors?</span></li>';
                    databasecontrol_li += '<li data-type="TherapistsName" data-index="PatientHealthcare" class="databasecontrol"><span>Name of other doctors, therapists, counselors</span></li>';
                    databasecontrol_li += '<li data-type="TherapistsLocation" data-index="PatientHealthcare" class="databasecontrol"><span>Location</span></li>';
                    databasecontrol_li += '<li data-type="CaseManager" data-index="PatientHealthcare" class="databasecontrol"><span>Do you have a case manager or social worker who helps you manage your healthcare?</span></li>';
                    databasecontrol_li += '<li data-type="CaseManagerName" data-index="PatientHealthcare" class="databasecontrol"><span>Name of case manager or social worker</span></li>';
                    databasecontrol_li += '<li data-type="CaseManagerLocation" data-index="PatientHealthcare" class="databasecontrol"><span>Location</span></li>';
                    databasecontrol_li += '<li data-type="YourHealthIs" data-index="PatientHealthcare" class="databasecontrol"><span>In general, would you say your health is:</span></li>';
                    databasecontrol_li += '<li data-type="PastMonthPoorPhysicalHealth" data-index="PatientHealthcare" class="databasecontrol"><span>During the past month, how often did poor physical health keep you from doing your usual activities, work, or recreation?</span></li>';
                    databasecontrol_li += '<li data-type="Diagnosed" data-index="PatientHealthcare" class="databasecontrol"><span>Have you ever been diagnosed with any of the following medical conditions? (check all that apply)</span></li>';
                    databasecontrol_li += '<li data-type="PerWeekStrenuousExercise" data-index="PatientHealthcare" class="databasecontrol"><span>On average, how many days per week do you engage in moderate to strenuous exercise (like walking fast, running, jogging, dancing, swimming, biking, or other activities On average, how many days per week do you engage in moderate to databasecontrol_lienuous exercise (like walking fast, running, jogging, dancing, swimming, biking, or other activities that cause a light or heavy sweat)?</span></li>';
                    databasecontrol_li += '<li data-type="PerDayStrenuousExercise" data-index="PatientHealthcare" class="databasecontrol"><span>On average, how many minutes per day do you engage in moderate to strenuous exercise (like walking fast, running, jogging, dancing, swimming, biking, or other activities that cause a light or heavy sweat)?</span></li>';
                    databasecontrol_li += '<li data-type="PastYearEmergency" data-index="PatientHealthcare" class="databasecontrol"><span>Over the past year, how many times did you go to the emergency room (regular or psych emergency)?</span></li>';
                    databasecontrol_li += '<li data-type="SmokeCigarettes" data-index="PatientHealthcare" class="databasecontrol"><span>Do you smoke cigarettes?</span></li>';
                    databasecontrol_li += '<li data-type="SmokePerDay" data-index="PatientHealthcare" class="databasecontrol"><span>How many cigarettes do you smoke per day?</span></li>';
                    databasecontrol_li += '<li data-type="FrequentlySmoke" data-index="PatientHealthcare" class="databasecontrol"><span>How frequently do you smoke?</span></li>';
                    databasecontrol_li += '<li data-type="TobaccoProducts" data-index="PatientHealthcare" class="databasecontrol"><span>Do you use any tobacco or nicotine products besides cigarettes, such as chewing tobacco, snuff, cigars, or e-cigarettes?</span></li>';

                    break;

                case "7":
                    databasecontrol_li += '<li data-type="socialsupportscore" data-index="PatientScore" class="databasecontrol"><span>Score</span></li>';
                    databasecontrol_li += '<li data-type="socialsupportstatus" data-index="PatientScore" class="databasecontrol"><span>Status</span></li>';
                    databasecontrol_li += '<li data-type="IsSomeoneYouCanDependOn" data-index="PatientSocialSupport" class="databasecontrol"><span>Is there someone now that you can depend on if you ever needed help to do a task, like getting a ride somewhere, or help with shopping or cooking a meal?</span></li>';
                    databasecontrol_li += '<li data-type="InvolvedInCommunityGroup" data-index="PatientSocialSupport" class="databasecontrol"><span>Are you currently involved with any church, community group, club, etc.?</span></li>';
                    databasecontrol_li += '<li data-type="IsSomeoneYouCanCall" data-index="PatientSocialSupport" class="databasecontrol"><span>Is there someone you can call when you’re feeling down or stressed?</span></li>';
                    databasecontrol_li += '<li data-type="IsAnyoneThreatenYou" data-index="PatientSocialSupport" class="databasecontrol"><span>Does a partner, or anyone at home, hurt, hit or threaten you?</span></li>';
                    databasecontrol_li += '<li data-type="FeelSafeNeighborhood" data-index="PatientSocialSupport" class="databasecontrol"><span>Do you feel safe in your neighborhood?</span></li>';
                    databasecontrol_li += '<li data-type="FinancialSecurity" data-index="PatientSocialSupport" class="databasecontrol"><span>Have you ever had to exchange sex for anything that you needed like money, food, or a place to stay? (Financial Security)</span></li>';
                    databasecontrol_li += '<li data-type="PlaceToStay" data-index="PatientSocialSupport" class="databasecontrol"><span>Has someone ever asked you to exchange sex for anything that you needed like money, food, or a place to stay?</span></li>';

                    break;
                case "8":
                    databasecontrol_li += '<li data-type="legalstatusscore" data-index="PatientScore" class="databasecontrol"><span>Score</span></li>';
                    databasecontrol_li += '<li data-type="legalstatusstatus" data-index="PatientScore" class="databasecontrol"><span>Status</span></li>';
                    databasecontrol_li += '<li data-type="EverBeenArrested" data-index="PatientLegalStatus" class="databasecontrol"><span>Have you ever been arrested?</span></li>';
                    databasecontrol_li += '<li data-type="LastReleased" data-index="PatientLegalStatus" class="databasecontrol"><span>When were you last released?</span></li>';
                    databasecontrol_li += '<li data-type="CDCAndPFNNumber" data-index="PatientLegalStatus" class="databasecontrol"><span>CDC/PFN #</span></li>';                   
                    databasecontrol_li += '<li data-type="OnGoingCriminalCase" data-index="PatientLegalStatus" class="databasecontrol"><span>Do you have an ongoing criminal case?</span></li>';
                    databasecontrol_li += '<li data-type="EverBeenInPrison" data-index="PatientLegalStatus" class="databasecontrol"><span>Have you ever been in prison or jail?</span></li>';
                    databasecontrol_li += '<li data-type="InterestedInCriminalRecordClearing" data-index="PatientLegalStatus" class="databasecontrol"><span>Are you interested in criminal record clearing?</span></li>';
                    databasecontrol_li += '<li data-type="OweRestitution" data-index="PatientLegalStatus" class="databasecontrol"><span>Do you owe restitution?</span></li>';
                    databasecontrol_li += '<li data-type="HowMuchOwe" data-index="PatientLegalStatus" class="databasecontrol"><span>how much do you owe?</span></li>';
                    databasecontrol_li += '<li data-type="CurrentlyOnParole" data-index="PatientLegalStatus" class="databasecontrol"><span>Are you currently on parole or probation?</span></li>';
                    databasecontrol_li += '<li data-type="ParoleProbation" data-index="PatientLegalStatus" class="databasecontrol"><span>select parole or probation</span></li>';
                    databasecontrol_li += '<li data-type="ParoleProbationEnd" data-index="PatientLegalStatus" class="databasecontrol"><span>When does your (insert probation or parole here) end?</span></li>';
                    databasecontrol_li += '<li data-type="DifficultiesInGettingAJob" data-index="PatientLegalStatus" class="databasecontrol"><span>Are you currently having difficulties in getting a job, housing, or any government benefits because of your legal status, background or a criminal record?</span></li>';
                    databasecontrol_li += '<li data-type="GovernmentIssuedID" data-index="PatientLegalStatus" class="databasecontrol"><span>Do you have a government issued ID or driver’s license?</span></li>';
                    databasecontrol_li += '<li data-type="GovernmentIDImg" data-index="PatientLegalStatus" class="databasecontrol"><span>government issued ID or driver’s license image</span></li>';
                    databasecontrol_li += '<li data-type="ConcernsAboutFamilyImmigrationStatus" data-index="PatientLegalStatus" class="databasecontrol"><span>Do you have concerns about your family’s immigration status?</span></li>';
                    databasecontrol_li += '<li data-type="ConcernsWithLandlord" data-index="PatientLegalStatus" class="databasecontrol"><span>Do you have concerns with or disputes with your landlord (threats of eviction, etc.)?</span></li>';
                    
                    break;
                case "9":
                    databasecontrol_li += '<li data-type="substancescore" data-index="PatientScore" class="databasecontrol"><span>Score</span></li>';
                    databasecontrol_li += '<li data-type="substancestatus" data-index="PatientScore" class="databasecontrol"><span>Status</span></li>';

                    databasecontrol_li += '<li data-type="DrugsContaining1" data-index="Dast" class="databasecontrol"><span> methamphetamines(speed, crystal)</span></li>';
                    databasecontrol_li += '<li data-type="DrugsContaining2" data-index="Dast" class="databasecontrol"><span> cannabis (marijuana, pot)</span></li>';
                    databasecontrol_li += '<li data-type="DrugsContaining3" data-index="Dast" class="databasecontrol"><span> inhalants (paint thinner, aerosol, glue)</span></li>';
                    databasecontrol_li += '<li data-type="DrugsContaining4" data-index="Dast" class="databasecontrol"><span> tranquilizers (valium)</span></li>';
                    databasecontrol_li += '<li data-type="DrugsContaining5" data-index="Dast" class="databasecontrol"><span> cocaine</span></li>';
                    databasecontrol_li += '<li data-type="DrugsContaining6" data-index="Dast" class="databasecontrol"><span> narcotics (heroin, oxycodone, methadone, etc.)</span></li>';
                    databasecontrol_li += '<li data-type="DrugsContaining7" data-index="Dast" class="databasecontrol"><span> hallucinogens (LSD, mushrooms)</span></li>';
                    databasecontrol_li += '<li data-type="DrugsContaining8" data-index="Dast" class="databasecontrol"><span> Others</span></li>';
                    databasecontrol_li += '<li data-type="HowOftenUse" data-index="Dast" class="databasecontrol"><span>How often have you used these drugs?</span></li>';
                    databasecontrol_li += '<li data-type="UsedDrugsForMedicalReasons" data-index="Dast" class="databasecontrol"><span>Have you used drugs other than those required for medical reasons?</span></li>';
                    databasecontrol_li += '<li data-type="OneDrugAtATime" data-index="Dast" class="databasecontrol"><span>Do you abuse more than one drug at a time?</span></li>';
                    databasecontrol_li += '<li data-type="UnableToStopUsingDrugs" data-index="Dast" class="databasecontrol"><span>Are you unable to stop using drugs when you want to?</span></li>';
                    databasecontrol_li += '<li data-type="Blackouts" data-index="Dast" class="databasecontrol"><span>Have you ever had blackouts or flasbacks as a result of drug use?</span></li>';
                    databasecontrol_li += '<li data-type="GuiltyAboutYourDrug" data-index="Dast" class="databasecontrol"><span>Do you ever feel bad or guilty about your drug use?</span></li>';
                    databasecontrol_li += '<li data-type="SpouseComplain" data-index="Dast" class="databasecontrol"><span>Does your spouse (or parents) ever complain about your involvement</span></li>';
                    databasecontrol_li += '<li data-type="NeglectedFamily" data-index="Dast" class="databasecontrol"><span>Have you neglected your family because of your use of drugs?</span></li>';
                    databasecontrol_li += '<li data-type="EngagedInIllegalActivities" data-index="Dast" class="databasecontrol"><span>Have you engaged in illegal activities in order to obtain drugs?</span></li>';
                    databasecontrol_li += '<li data-type="WithdrawalSymptoms" data-index="Dast" class="databasecontrol"><span> Have you ever experienced withdreawal symptoms (felt sick) when you stopped taking drugs</span></li>';
                    databasecontrol_li += '<li data-type="MedicalLoss" data-index="Dast" class="databasecontrol"><span>Have you had medical loss, hepatities, convulsions, bleeding)?</span></li>';
                    databasecontrol_li += '<li data-type="EverInjectedDrugs" data-index="Dast"><span>Have you ever injected drugs?</span></li>';
                    databasecontrol_li += '<li data-type="TreatmentForSubstanceAbuse" data-index="Dast" class="databasecontrol"><span>Have you ever been in treatment for substance abuse?</span></li>';

                    break;
                case "10":
                    databasecontrol_li += '<li data-type="substancescore" data-index="PatientScore" class="databasecontrol"><span>Score</span></li>';
                    databasecontrol_li += '<li data-type="substancestatus" data-index="PatientScore" class="databasecontrol"><span>Status</span></li>';
                    databasecontrol_li += '<li data-type="DrinkContainingAlcohol" data-index="Audit" class="databasecontrol"><span>How often do you have a drink containing alcohol?</span></li>';
                    databasecontrol_li += '<li data-type="HowManyDrinks" data-index="Audit" class="databasecontrol"><span>How many drinks containing alcohol do you have on a typical day when you are drinking?</span></li>';
                    databasecontrol_li += '<li data-type="SixOrMoreDrink" data-index="Audit" class="databasecontrol"><span>How often do you have six or more drink on one occassion?</span></li>';
                    databasecontrol_li += '<li data-type="NotAbleToStopDrinking" data-index="Audit" class="databasecontrol"><span>How often during the last year have you found that you were not able to stop drinking once you had started?</span></li>';
                    databasecontrol_li += '<li data-type="FailedWhatWasExpected" data-index="Audit" class="databasecontrol"><span>How often during the last year have you failed do what was normally expected from you because of drinking.</span></li>';
                    databasecontrol_li += '<li data-type="FirstDrinkMorning" data-index="Audit" class="databasecontrol"><span>How often during the last year have you needed a first drink in the morning to get yourself going after a heavy drinking session?</span></li>';
                    databasecontrol_li += '<li data-type="FeelingOfGuilt" data-index="Audit" class="databasecontrol"><span>How often during the last year have you had a feeling of guilt or remorse after drinking?</span></li>';
                    databasecontrol_li += '<li data-type="UnableToRemember" data-index="Audit" class="databasecontrol"><span>How often during the last year you have been unable to remember what happened the night before because you had been drinking?</span></li>';
                    databasecontrol_li += '<li data-type="InjuredOfYourDrinking" data-index="Audit" class="databasecontrol"><span>Have you or someone else been injured as a result of your drinking?</span></li>';
                    databasecontrol_li += '<li data-type="FriendsSuggestedYouCutDown" data-index="Audit" class="databasecontrol"><span>Has a relative or friends or a doctor or another health worker been concerned about your drinking or suggested you cut down?</span></li>';

                    break;
                case "11":
                    databasecontrol_li += '<li data-type="mentalhealthscore" data-index="PatientScore" class="databasecontrol"><span>Score</span></li>';
                    databasecontrol_li += '<li data-type="mentalhealthstatus" data-index="PatientScore" class="databasecontrol"><span>Status</span></li>';
                    databasecontrol_li += '<li data-type="LittleInterest" data-index="PHQ9" class="databasecontrol"><span>Over the last 2 weeks, how often have you been bothered by-> Little interest or pleasure in doing things</span></li>';
                    databasecontrol_li += '<li data-type="FeelingDown" data-index="PHQ9" class="databasecontrol"><span>Over the last 2 weeks, how often have you been bothered by-> Feeling down, depressed, or hopless</span></li>';
                    databasecontrol_li += '<li data-type="TroubleFalling" data-index="PHQ9" class="databasecontrol"><span>Over the last 2 weeks, how often have you been bothered by-> Trouble falling/staying asleep, sleeping too much</span></li>';
                    databasecontrol_li += '<li data-type="FeelingTired" data-index="PHQ9" class="databasecontrol"><span>Over the last 2 weeks, how often have you been bothered by-> Feeling tired or having little energy</span></li>';
                    databasecontrol_li += '<li data-type="PoorAppetite" data-index="PHQ9" class="databasecontrol"><span>Over the last 2 weeks, how often have you been bothered by-> Poor appetite or overeating</span></li>';
                    databasecontrol_li += '<li data-type="FeelingBad" data-index="PHQ9" class="databasecontrol"><span>Over the last 2 weeks, how often have you been bothered by-> Feeling bad about youself or that you are a failure or have let yourself or your family down</span></li>';
                    databasecontrol_li += '<li data-type="TroubleConcentraiting" data-index="PHQ9" class="databasecontrol"><span>Over the last 2 weeks, how often have you been bothered by-> Trouble concentraiting on things, such as reading the newspaper or watching television.</span></li>';
                    databasecontrol_li += '<li data-type="restless" data-index="PHQ9" class="databasecontrol"><span>Over the last 2 weeks, how often have you been bothered by->  Moving or speaking so slowly that other people could have noticed. Or the opposite, being so fidgety or restless that you have been moving around a lot more than usual.</span></li>';
                    databasecontrol_li += '<li data-type="HurtingYourself" data-index="PHQ9" class="databasecontrol"><span>Over the last 2 weeks, how often have you been bothered by-> Thoughts that you would be better off dead or of hurting yourself in some way</span></li>';
                    databasecontrol_li += '<li data-type="ProblemsMade" data-index="PHQ9" class="databasecontrol"><span>if you checked off any problem on this questionnaire so far, how difficult have problems made it for you to do your work, take care of things at home, or get along with other people?</span></li>';

                    databasecontrol_li += '<li data-type="MentalHealthConditions" data-index="PatientMentalHealth" class="databasecontrol"><span>Have you ever been diagnosed with any of the following mental health conditions?</span></li>';
                    databasecontrol_li += '<li data-type="PoorMentalHealth" data-index="PatientMentalHealth" class="databasecontrol"><span>During the past month, how often did poor mental health keep you from doing your usual activities, work, or recreation?</span></li>';
                    databasecontrol_li += '<li data-type="SufferExcessive" data-index="PatientMentalHealth" class="databasecontrol"><span>During the past month, how often did you suffer excessive worry about work, school, family, relationships or another important thing in your life?</span></li>';
                    break;
                case "12":
                    databasecontrol_li += '<li data-type="foodaccessscore" data-index="PatientScore" class="databasecontrol"><span>Score</span></li>';
                    databasecontrol_li += '<li data-type="foodaccessstatus" data-index="PatientScore" class="databasecontrol"><span>Status</span></li>';
                    databasecontrol_li += '<li data-type="ServingsOfFruit" data-index="PatientFoodAccess" class="databasecontrol"><span>How many pieces or servings of fruit, any sort, do you eat on a typical day?</span></li>';
                    databasecontrol_li += '<li data-type="PortionsOfVegetables" data-index="PatientFoodAccess" class="databasecontrol"><span>How many portions of vegetables, excluding potatoes, do you eat on a typical day?</span></li>';
                    databasecontrol_li += '<li data-type="MajorityOfFood" data-index="PatientFoodAccess" class="databasecontrol"><span>Where do you get the majority of your food?</span></li>';
                    break;
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
                    var sectionName = "";
                    switch (selectedForm) {
                        case "1":
                            sectionName = "Client profile";
                            break;
                        case "2":
                            sectionName = "Client Housing";
                            break;
                        case "3":
                            sectionName = "Client Financial Security";
                            break;
                        case "4":
                            sectionName = "Client Employment/Education";
                            break;
                        case "5":
                            sectionName = "Client Communication & Mobility";
                            break;
                        case "6":
                            sectionName = "Client Healthcare";
                            break;
                        case "7":
                            sectionName = "Client Social Supports and Safety";
                            break;
                        case "8":
                            sectionName = "Client Legal Status";
                            break;
                        case "9":
                            sectionName = "DAST";
                            break;
                        case "10":
                            sectionName = "AUDIT";
                            break;
                        case "11":
                            sectionName = "Client Health Questionnaire (PHQ-9)";
                            break;
                        case "12":
                            sectionName = "Client Food Access";
                            break;
                    }
                    var databaseStr = ``;
                    switch (draggableType) {
                        case "ChildrenUnder18":
                        case "Adults18to65":
                        case "Adults65Plus":
                        case "PreferredPharmacyName":
                        case "PreferredPharmacyLocation":
                        case "CalworksBenefits":
                        case "SocialSecurityDisabilityInsurance":
                        case "GeneralAssistance":
                        case "WomenInfantChildrenBenefits":
                        case "UnemploymentBenefits":
                        case "StateDisabilityInsuranceBenefits":
                        case "RentalAssistanceBenefits":
                        case "LittleInterest":
                        case "FeelingDown":
                        case "TroubleFalling":
                        case "FeelingTired":
                        case "PoorAppetite":
                        case "FeelingBad":
                        case "TroubleConcentraiting":
                        case "restless":
                        case "HurtingYourself": 
                            databaseStr = `<div  class="dragresize data-frmbtn col-md-12">
                                           <div class="row">
                                           <div class="col-md-12">
                                           <div class="form-row-first mt-0">
                                           <div class="top-form-row d-flex question-container">
                                           <div class="one-columns">
                                           <label class="Add">${sectionName} :- ${lblValue.split("-&gt;")[0]}</label >                                                                                             
                                           </div>
                                           </div>
                                           <div class="bootom-form-row mb-2">
                                           <div class="row">
                                           <div class="col-md-12">
                                           <div class="form-row-first mt-1 data-frm-btn">
                                           <div class="top-form-row d-flex">
                                            <div class="one-columns">
                                            <label>${lblValue.split("-&gt;")[1]}</label>
                                            </div>
                                            </div>
                                            <div class="bootom-form-row d-flex">
                                             <div class="one-columns">                                                                    
                                              <label id="${newid}"  class="database-field"  data-index="${responseIndex}">{{ Value }}</label>                                          
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
                            break;                                                  
                        default:
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
                                              <label id="${newid}"  class="database-field" data-index="${responseIndex}">{{ Value }}</label>                                          
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

                             
                            break;
                    }
                   
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
             if(ui.item.hasClass("ui-draggable") && ui.item.attr("data-index") !== undefined) {
        EditHtml(ui.item.attr("data-type"), newid);
    }
        }
            });
}
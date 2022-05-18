using RootsOfHealth.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Web;
using System.Web.Configuration;
using System.Web.Mvc;


namespace RootsOfHealth.Commom
{
  

    public class Common
    {
        string WebApiKey = WebConfigurationManager.AppSettings["WebApiForBackend"];

        List<string> SafetyOptions = new List<string>();
        List<string> EmploymentOptions = new List<string>();
        List<string> HousingShelterOptions = new List<string>();
        List<string> EducationOptions = new List<string>();
        List<string> LegalOptions = new List<string>();
        List<string> SocialRecreationalOptions = new List<string>();
        


        public void BindSafetyOptions(ref PatientDetailBO patientdetailobj)
        {
            SafetyOptions.Add("Stay out of any gun-related activity");
            SafetyOptions.Add("Staying out of fights and conflicts");
            SafetyOptions.Add("Publicly speaking out against violence");
            SafetyOptions.Add("Participating in community/group mediation");

            patientdetailobj.PatientProgram.safetyoptions = SafetyOptions;

        }

        public void BindEmploymentOptions(ref PatientDetailBO patientdetailobj)
        {

            EmploymentOptions.Add("Clothes/tools for job");
            EmploymentOptions.Add("Job training");
            EmploymentOptions.Add("Computer training");
            EmploymentOptions.Add("Other vocational training");
            EmploymentOptions.Add("Resume/cover letters");
            EmploymentOptions.Add("Job interview preparation");
            EmploymentOptions.Add("Maintain current employment");
            EmploymentOptions.Add("Obtain employment");

            patientdetailobj.PatientProgram.employmentoptions = EmploymentOptions;

        }

        public void BindHousingShelterOptions(ref PatientDetailBO patientdetailobj)
        {

            HousingShelterOptions.Add("Obtain safe and appropriate housing");
            HousingShelterOptions.Add("Utilities assistance");
            HousingShelterOptions.Add("Housing Advocacy");
            HousingShelterOptions.Add("Shelter/temporary housing");

            patientdetailobj.PatientProgram.housingshelteroptions = HousingShelterOptions;

        }

        public void BindEducationOptions(ref PatientDetailBO patientdetailobj)
        {

            EducationOptions.Add("Reconnect w/ school system");
            EducationOptions.Add("GED program");
            EducationOptions.Add("Tutoring program");
            EducationOptions.Add("High school diploma");
            EducationOptions.Add("College classes");

            patientdetailobj.PatientProgram.educationoptions = EducationOptions;

        }

        public void BindLegalOptions(ref PatientDetailBO patientdetailobj)
        {

            LegalOptions.Add("Driver’s license");
            LegalOptions.Add("ID card");
            LegalOptions.Add("Social security card");
            LegalOptions.Add("Government assistance");
            LegalOptions.Add("Court advocacy");
            LegalOptions.Add("Legal aid/lawyer");
            LegalOptions.Add("Report to probation");
            LegalOptions.Add("Naturalization");
            LegalOptions.Add("Victims of crime");
            LegalOptions.Add("Personal vehicle registration");
            LegalOptions.Add("Maintain insurance on personal vehicle");
            LegalOptions.Add("Pay off tickets");

            patientdetailobj.PatientProgram.legaloptions = LegalOptions;

        }

        public void BindSocialRecreationalOptions(ref PatientDetailBO patientdetailobj)
        {

            SocialRecreationalOptions.Add("After school program");
            SocialRecreationalOptions.Add("Support group");
            SocialRecreationalOptions.Add("Link w/ community center");
            SocialRecreationalOptions.Add("Mentor");
            SocialRecreationalOptions.Add("Church/faith based connection");
            SocialRecreationalOptions.Add("Sports");
            SocialRecreationalOptions.Add("Volunteer work");

            patientdetailobj.PatientProgram.socialrecreationaloptions = SocialRecreationalOptions;

        }

        public void BindDropDowns(ref PatientDetailBO patientdetailobj)
        {
            List<LookUpFieldOptionBO> lstoption = new List<LookUpFieldOptionBO>();
            
            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri(WebApiKey);
                //HTTP GET
                var responseTask = client.GetAsync("/api/PatientMain/GetLookUpFieldOption");
                responseTask.Wait();

                var result = responseTask.Result;
                if (result.IsSuccessStatusCode)
                {
                    var readTask = result.Content.ReadAsAsync<List<LookUpFieldOptionBO>>();
                    readTask.Wait();
                     lstoption = readTask.Result;
               

                }
                else //web api sent error response 
                {
                    //log response status here..


                }
            }

            // Bind Housing drop-downs PlaceLiveNow
            List<SelectListItem> ddlPlaceLiveNow = new List<SelectListItem>();

            foreach(LookUpFieldOptionBO opt  in lstoption.Where(p=>p.LookUpFieldID==1 && p.IsDeleted==false))
            {
                ddlPlaceLiveNow.Add(new SelectListItem()
                {
                    Text = opt.OptionName,
                    Value = opt.ID.ToString()
                });
            }

            // Bind Housing drop-downs EmergencyShelter
            List<SelectListItem> ddlEmergencyShelter = new List<SelectListItem>();

            foreach (LookUpFieldOptionBO opt in lstoption.Where(p => p.LookUpFieldID == 2 && p.IsDeleted == false))
            {
                ddlEmergencyShelter.Add(new SelectListItem()
                {
                    Text = opt.OptionName,
                    Value = opt.ID.ToString()
                });
            }

            // Bind Financial Security drop-downs DifficultiesInPayingBills

            List<SelectListItem> ddlDifficultiesInPayingBills = new List<SelectListItem>();

            foreach (LookUpFieldOptionBO opt in lstoption.Where(p => p.LookUpFieldID == 3 && p.IsDeleted == false))
            {
                ddlDifficultiesInPayingBills.Add(new SelectListItem()
                {
                    Text = opt.OptionName,
                    Value = opt.ID.ToString()
                });
            }



            // Bind Financial Security drop-downs SkipMeals

            List<SelectListItem> ddlSkipMeals = new List<SelectListItem>();

            foreach (LookUpFieldOptionBO opt in lstoption.Where(p => p.LookUpFieldID == 4 && p.IsDeleted == false))
            {
                ddlSkipMeals.Add(new SelectListItem()
                {
                    Text = opt.OptionName,
                    Value = opt.ID.ToString()
                });
            }

            // Bind Employment Education drop-downs LevelofEducation

            List<SelectListItem> ddlLevelofEducation = new List<SelectListItem>();

            foreach (LookUpFieldOptionBO opt in lstoption.Where(p => p.LookUpFieldID == 5 && p.IsDeleted == false))
            {
                ddlLevelofEducation.Add(new SelectListItem()
                {
                    Text = opt.OptionName,
                    Value = opt.ID.ToString()
                });
            }

            // Bind Employment Education drop-downs WorkSituation

            List<SelectListItem> ddlWorkSituation = new List<SelectListItem>();
            foreach (LookUpFieldOptionBO opt in lstoption.Where(p => p.LookUpFieldID == 6 && p.IsDeleted == false))
            {
                ddlWorkSituation.Add(new SelectListItem()
                {
                    Text = opt.OptionName,
                    Value = opt.ID.ToString()
                });
            }


            // Bind Employment Education drop-downs ParticipatingInEducationalOrTrainingProgram

            List<SelectListItem> ddlParticipatingInEducationalOrTrainingProgram = new List<SelectListItem>();

            foreach (LookUpFieldOptionBO opt in lstoption.Where(p => p.LookUpFieldID == 7 && p.IsDeleted == false))
            {
                ddlParticipatingInEducationalOrTrainingProgram.Add(new SelectListItem()
                {
                    Text = opt.OptionName,
                    Value = opt.ID.ToString()
                });
            }


            // Bind Communication And Mobility drop-downs ParticipatingInEducationalOrTrainingProgram

            List<SelectListItem> ddlDifficultyGoingPlaces = new List<SelectListItem>();

            foreach (LookUpFieldOptionBO opt in lstoption.Where(p => p.LookUpFieldID == 8 && p.IsDeleted == false))
            {
                ddlDifficultyGoingPlaces.Add(new SelectListItem()
                {
                    Text = opt.OptionName,
                    Value = opt.ID.ToString()
                });
            }

            // Bind Communication And Mobility drop-downs ParticipatingInEducationalOrTrainingProgram

            List<SelectListItem> ddlModesOfTransportation = new List<SelectListItem>();

            foreach(LookUpFieldOptionBO opt in lstoption.Where(p=>p.LookUpFieldID==9 && p.IsDeleted == false))
            {
                ddlModesOfTransportation.Add(new SelectListItem()
                {
                    Text = opt.OptionName,
                    Value = opt.ID.ToString()

                });
            }


            // Bind Healthcare drop-downs LastSeeDoctor

            List<SelectListItem> ddlLastSeeDoctor = new List<SelectListItem>();
            ddlLastSeeDoctor.Add(new SelectListItem() { Text = "Select", Value = "0" });
            foreach (LookUpFieldOptionBO opt in lstoption.Where(p => p.LookUpFieldID == 10 && p.IsDeleted == false))
            {
                ddlLastSeeDoctor.Add(new SelectListItem()
                {
                    Text = opt.OptionName,
                    Value = opt.ID.ToString()

                });
            }

            // Bind Healthcare drop-downs LastSeeDentist

            List<SelectListItem> ddlLastSeeDentist = new List<SelectListItem>();
            ddlLastSeeDentist.Add(new SelectListItem(){Text = "Select",Value = "0"});
            foreach (LookUpFieldOptionBO opt in lstoption.Where(p => p.LookUpFieldID == 11 && p.IsDeleted == false))
            {
                ddlLastSeeDentist.Add(new SelectListItem()
                {
                    Text = opt.OptionName,
                    Value = opt.ID.ToString()

                });
            }


            // Bind Healthcare drop-downs YourHealthIs

            List<SelectListItem> ddlYourHealthIs = new List<SelectListItem>();
            ddlYourHealthIs.Add(new SelectListItem() { Text = "Select", Value = "0" });
            foreach (LookUpFieldOptionBO opt in lstoption.Where(p => p.LookUpFieldID == 12 && p.IsDeleted == false))
            {
                ddlYourHealthIs.Add(new SelectListItem()
                {
                    Text = opt.OptionName,
                    Value = opt.ID.ToString()
                });
            }


            // Bind Healthcare drop-downs PastMonthPoorPhysicalHealth

            List<SelectListItem> ddlPastMonthPoorPhysicalHealth = new List<SelectListItem>();
            foreach (LookUpFieldOptionBO opt in lstoption.Where(p => p.LookUpFieldID == 13 && p.IsDeleted == false))
            {
                ddlPastMonthPoorPhysicalHealth.Add(new SelectListItem()
                {
                    Text = opt.OptionName,
                    Value = opt.ID.ToString()
                });
            }

            // Bind Healthcare drop-downs PerWeekStrenuousExercise

            List<SelectListItem> ddlPerWeekStrenuousExercise = new List<SelectListItem>();
            foreach (LookUpFieldOptionBO opt in lstoption.Where(p => p.LookUpFieldID == 14 && p.IsDeleted == false))
            {
                ddlPerWeekStrenuousExercise.Add(new SelectListItem()
                {
                    Text = opt.OptionName,
                    Value = opt.ID.ToString()
                });
            }


            // Bind Healthcare drop-downs PerDayStrenuousExercise

            List<SelectListItem> ddlPerDayStrenuousExercise = new List<SelectListItem>();

            foreach (LookUpFieldOptionBO opt in lstoption.Where(p => p.LookUpFieldID == 15 && p.IsDeleted == false))
            {
                ddlPerDayStrenuousExercise.Add(new SelectListItem()
                {
                    Text = opt.OptionName,
                    Value = opt.ID.ToString()
                });
            }

            // Bind Healthcare drop-downs PastYearEmergency

            List<SelectListItem> ddlPastYearEmergency = new List<SelectListItem>();

            foreach (LookUpFieldOptionBO opt in lstoption.Where(p => p.LookUpFieldID == 16 && p.IsDeleted == false))
            {
                ddlPastYearEmergency.Add(new SelectListItem()
                {
                    Text = opt.OptionName,
                    Value = opt.ID.ToString()
                });
            }

            // Bind Healthcare drop-downs SmokePerDay

            List<SelectListItem> ddlSmokePerDay = new List<SelectListItem>();
            ddlSmokePerDay.Add(new SelectListItem() { Text = "Select", Value = "0"});
            foreach (LookUpFieldOptionBO opt in lstoption.Where(p => p.LookUpFieldID == 17 && p.IsDeleted == false))
            {
                ddlSmokePerDay.Add(new SelectListItem()
                {
                    Text = opt.OptionName,
                    Value = opt.ID.ToString()
                });
            }


            // Bind Healthcare drop-downs FrequentlySmoke

            List<SelectListItem> ddlFrequentlySmoke = new List<SelectListItem>();

            ddlFrequentlySmoke.Add(new SelectListItem() { Text = "Select", Value = "0" });
            foreach (LookUpFieldOptionBO opt in lstoption.Where(p => p.LookUpFieldID == 18 && p.IsDeleted == false))
            {
                ddlFrequentlySmoke.Add(new SelectListItem()
                {
                    Text = opt.OptionName,
                    Value = opt.ID.ToString()
                });
            }


            // Bind Social Support drop-downs FinancialSecurity

            List<SelectListItem> ddlFinancialSecurity = new List<SelectListItem>();
            foreach (LookUpFieldOptionBO opt in lstoption.Where(p => p.LookUpFieldID == 19 && p.IsDeleted == false))
            {
                ddlFinancialSecurity.Add(new SelectListItem()
                {
                    Text = opt.OptionName,
                    Value = opt.ID.ToString()
                });
            }


            // Bind Social Support drop-downs PlaceToStay

            List<SelectListItem> ddlPlaceToStay = new List<SelectListItem>();
            foreach (LookUpFieldOptionBO opt in lstoption.Where(p => p.LookUpFieldID == 20 && p.IsDeleted == false))
            {
                ddlPlaceToStay.Add(new SelectListItem()
                {
                    Text = opt.OptionName,
                    Value = opt.ID.ToString()
                });
            }

            // Bind Legal Status drop-downs LastReleased

            List<SelectListItem> ddlLastReleased = new List<SelectListItem>();
            ddlLastReleased.Add(new SelectListItem(){Text = "Select",Value = "0"});
            foreach (LookUpFieldOptionBO opt in lstoption.Where(p => p.LookUpFieldID == 21 && p.IsDeleted == false))
            {
                ddlLastReleased.Add(new SelectListItem()
                {
                    Text = opt.OptionName,
                    Value = opt.ID.ToString()
                });
            }


            // Bind Legal Status drop-downs LastReleased

            List<SelectListItem> ddlParoleProbation = new List<SelectListItem>();

            ddlParoleProbation.Add(new SelectListItem() { Text = "Select", Value = "0" });
            foreach (LookUpFieldOptionBO opt in lstoption.Where(p => p.LookUpFieldID == 22 && p.IsDeleted == false))
            {
                ddlParoleProbation.Add(new SelectListItem()
                {
                    Text = opt.OptionName,
                    Value = opt.ID.ToString()
                });
            }


            // Bind Mental Health drop-downs PoorMentalHealth
            List<SelectListItem> ddlPoorMentalHealth = new List<SelectListItem>();
           
            foreach (LookUpFieldOptionBO opt in lstoption.Where(p => p.LookUpFieldID == 23 && p.IsDeleted == false))
            {
                ddlPoorMentalHealth.Add(new SelectListItem()
                {
                    Text = opt.OptionName,
                    Value = opt.ID.ToString()
                });
            }

            // Bind Mental health drop-downs SufferExcessive
            List<SelectListItem> ddlSufferExcessive = new List<SelectListItem>();
            foreach (LookUpFieldOptionBO opt in lstoption.Where(p => p.LookUpFieldID == 24 && p.IsDeleted == false))
            {
                ddlSufferExcessive.Add(new SelectListItem()
                {
                    Text = opt.OptionName,
                    Value = opt.ID.ToString()
                });
            }




            // Bind AUDIT drop-downs DrinkAlcohol
            List<SelectListItem> ddlDrinkAlcohol = new List<SelectListItem>();
            foreach (LookUpFieldOptionBO opt in lstoption.Where(p => p.LookUpFieldID == 25 && p.IsDeleted == false))
            {
                ddlDrinkAlcohol.Add(new SelectListItem()
                {
                    Text = opt.OptionName,
                    Value = opt.ID.ToString()
                });
            }

            // Bind AUDIT drop-downs HowManyDrinks
            List<SelectListItem> ddlHowManyDrinks = new List<SelectListItem>();
            foreach (LookUpFieldOptionBO opt in lstoption.Where(p => p.LookUpFieldID == 26 && p.IsDeleted == false))
            {
                ddlHowManyDrinks.Add(new SelectListItem()
                {
                    Text = opt.OptionName,
                    Value = opt.ID.ToString()
                });
            }


            // Bind AUDIT drop-downs SixOrMoreDrink
            List<SelectListItem> ddlSixOrMoreDrink = new List<SelectListItem>();
            foreach (LookUpFieldOptionBO opt in lstoption.Where(p => p.LookUpFieldID == 27 && p.IsDeleted == false))
            {
                ddlSixOrMoreDrink.Add(new SelectListItem()
                {
                    Text = opt.OptionName,
                    Value = opt.ID.ToString()
                });
            }


            // Bind AUDIT drop-downs NotAbleToStopDrinking
            List<SelectListItem> ddlNotAbleToStopDrinking = new List<SelectListItem>();
            foreach (LookUpFieldOptionBO opt in lstoption.Where(p => p.LookUpFieldID == 28 && p.IsDeleted == false))
            {
                ddlNotAbleToStopDrinking.Add(new SelectListItem()
                {
                    Text = opt.OptionName,
                    Value = opt.ID.ToString()
                });
            }


            // Bind AUDIT drop-downs FailedWhatWasExpected
            List<SelectListItem> ddlFailedWhatWasExpected = new List<SelectListItem>();
            foreach (LookUpFieldOptionBO opt in lstoption.Where(p => p.LookUpFieldID == 29 && p.IsDeleted == false))
            {
                ddlFailedWhatWasExpected.Add(new SelectListItem()
                {
                    Text = opt.OptionName,
                    Value = opt.ID.ToString()
                });
            }


            // Bind AUDIT drop-downs FirstDrinkMorning
            List<SelectListItem> ddlFirstDrinkMorning = new List<SelectListItem>();
            foreach (LookUpFieldOptionBO opt in lstoption.Where(p => p.LookUpFieldID == 30 && p.IsDeleted == false))
            {
                ddlFirstDrinkMorning.Add(new SelectListItem()
                {
                    Text = opt.OptionName,
                    Value = opt.ID.ToString()
                });
            }

            // Bind AUDIT drop-downs FeelingOfGuilt
            List<SelectListItem> ddlFeelingOfGuilt = new List<SelectListItem>();
            foreach (LookUpFieldOptionBO opt in lstoption.Where(p => p.LookUpFieldID == 31 && p.IsDeleted == false))
            {
                ddlFeelingOfGuilt.Add(new SelectListItem()
                {
                    Text = opt.OptionName,
                    Value = opt.ID.ToString()
                });
            }


            // Bind AUDIT drop-downs UnableToRemember
            List<SelectListItem> ddlUnableToRemember = new List<SelectListItem>();
            foreach (LookUpFieldOptionBO opt in lstoption.Where(p => p.LookUpFieldID == 32 && p.IsDeleted == false))
            {
                ddlUnableToRemember.Add(new SelectListItem()
                {
                    Text = opt.OptionName,
                    Value = opt.ID.ToString()
                });
            }

            // Bind AUDIT drop-downs InjuredOfYourDrinking
            List<SelectListItem> ddlInjuredOfYourDrinking = new List<SelectListItem>();
            foreach (LookUpFieldOptionBO opt in lstoption.Where(p => p.LookUpFieldID == 33 && p.IsDeleted == false))
            {
                ddlInjuredOfYourDrinking.Add(new SelectListItem()
                {
                    Text = opt.OptionName,
                    Value = opt.ID.ToString()
                });
            }


            // Bind AUDIT drop-downs FriendsSuggestedYouCutDown
            List<SelectListItem> ddlFriendsSuggestedYouCutDown = new List<SelectListItem>();
            foreach (LookUpFieldOptionBO opt in lstoption.Where(p => p.LookUpFieldID == 34 && p.IsDeleted == false))
            {
                ddlFriendsSuggestedYouCutDown.Add(new SelectListItem()
                {
                    Text = opt.OptionName,
                    Value = opt.ID.ToString()
                });
            }

            // Bind Food Access drop-downs ServingsOfFruit
            List<SelectListItem> ddlServingsOfFruit = new List<SelectListItem>();
            foreach (LookUpFieldOptionBO opt in lstoption.Where(p => p.LookUpFieldID == 35 && p.IsDeleted == false))
            {
                ddlServingsOfFruit.Add(new SelectListItem()
                {
                    Text = opt.OptionName,
                    Value = opt.ID.ToString()
                });
            }

            // Bind Food Access drop-downs PortionsOfVegetables
            List<SelectListItem> ddlPortionsOfVegetables = new List<SelectListItem>();
            foreach (LookUpFieldOptionBO opt in lstoption.Where(p => p.LookUpFieldID == 36 && p.IsDeleted == false))
            {
                ddlPortionsOfVegetables.Add(new SelectListItem()
                {
                    Text = opt.OptionName,
                    Value = opt.ID.ToString()
                });
            }

            // Bind Food Access drop-downs MajorityOfFood
            List<SelectListItem> ddlMajorityOfFood = new List<SelectListItem>();
            foreach (LookUpFieldOptionBO opt in lstoption.Where(p => p.LookUpFieldID == 37 && p.IsDeleted == false))
            {
                ddlMajorityOfFood.Add(new SelectListItem()
                {
                    Text = opt.OptionName,
                    Value = opt.ID.ToString()
                });
            }

            // Bind Clinic Only drop-downs AnyVaccinations
            List<SelectListItem> ddlAnyVaccinations = new List<SelectListItem>();
            foreach (LookUpFieldOptionBO opt in lstoption.Where(p => p.LookUpFieldID == 38 && p.IsDeleted == false))
            {
                ddlAnyVaccinations.Add(new SelectListItem()
                {
                    Text = opt.OptionName,
                    Value = opt.ID.ToString()
                });
            }


            // Bind AUDIT drop-downs PregnantYes
            //List<SelectListItem> ddlPregnantYes = new List<SelectListItem>();
            //ddlPregnantYes.Add(new SelectListItem() { Value = "0", Text = "# Of pregnancies" });
            //ddlPregnantYes.Add(new SelectListItem() { Value = "1", Text = "# Of living children" });
            //ddlPregnantYes.Add(new SelectListItem() { Value = "2", Text = "# Of abortions" });
            //ddlPregnantYes.Add(new SelectListItem() { Value = "3", Text = "# Of miscarriages" });


            // Bind clinic only drop-downs PreventativeScreeningTests
            List<SelectListItem> ddlScreeningTests = new List<SelectListItem>();
            ddlScreeningTests.Add(new SelectListItem() { Value = "0", Text = "Test for cervical cancer" });
            ddlScreeningTests.Add(new SelectListItem() { Value = "1", Text = "Blood test for diabetes" });
            ddlScreeningTests.Add(new SelectListItem() { Value = "2", Text = "blood test for high cholesterol" });
            ddlScreeningTests.Add(new SelectListItem() { Value = "3", Text = "Blood test for HIV" });
            ddlScreeningTests.Add(new SelectListItem() { Value = "4", Text = "Blood test for Hepatitis C" });
            ddlScreeningTests.Add(new SelectListItem() { Value = "5", Text = "Mammogram for breast cancer" });
            ddlScreeningTests.Add(new SelectListItem() { Value = "6", Text = "Stool test for colon cancer" });
            ddlScreeningTests.Add(new SelectListItem() { Value = "7", Text = "Colonoscopy for colon cancer" });
            ddlScreeningTests.Add(new SelectListItem() { Value = "8", Text = "Scan for osteoporosis" });
            ddlScreeningTests.Add(new SelectListItem() { Value = "9", Text = "ultrasound for aortic aneurysm" });


            // Bind OUOnly drop-downs ReferralSource
            List<SelectListItem> ddlReferralSource = new List<SelectListItem>();
            foreach (LookUpFieldOptionBO opt in lstoption.Where(p => p.LookUpFieldID == 39 && p.IsDeleted == false))
            {
                ddlReferralSource.Add(new SelectListItem()
                {
                    Text = opt.OptionName,
                    Value = opt.ID.ToString()
                });
            }

            // Bind OUOnly drop-downs CurrentLivingSituation
            List<SelectListItem> ddlCurrentLivingSituation = new List<SelectListItem>();
            foreach (LookUpFieldOptionBO opt in lstoption.Where(p => p.LookUpFieldID == 40 && p.IsDeleted == false))
            {
                ddlCurrentLivingSituation.Add(new SelectListItem()
                {
                    Text = opt.OptionName,
                    Value = opt.ID.ToString()
                });
            }




            // Bind PeraltaCollege drop-downs OneYouAre
            List<SelectListItem> ddlOneYouAre = new List<SelectListItem>();
            ddlOneYouAre.Add(new SelectListItem() { Value = "0", Text = "Select" });
            foreach (LookUpFieldOptionBO opt in lstoption.Where(p => p.LookUpFieldID == 41 && p.IsDeleted == false))
            {
                ddlOneYouAre.Add(new SelectListItem()
                {
                    Text = opt.OptionName,
                    Value = opt.ID.ToString()
                });
            }


            // Bind Social Support drop-downs FeelSafeNeighborhood
            List<SelectListItem> ddlFeelSafeNeighborhood = new List<SelectListItem>();
            ddlFeelSafeNeighborhood.Add(new SelectListItem() { Value = "0", Text = "Select" });
            foreach (LookUpFieldOptionBO opt in lstoption.Where(p => p.LookUpFieldID == 42 && p.IsDeleted == false))
            {
                ddlFeelSafeNeighborhood.Add(new SelectListItem()
                {
                    Text = opt.OptionName,
                    Value = opt.ID.ToString()
                });
            }


            // Bind Mental Health drop-downs MentalHealthConditions
            List<SelectListItem> ddlMentalHealthConditions = new List<SelectListItem>();
            ddlMentalHealthConditions.Add(new SelectListItem() { Value = "0", Text = "Select" });
            foreach (LookUpFieldOptionBO opt in lstoption.Where(p => p.LookUpFieldID == 43 && p.IsDeleted == false))
            {
                ddlMentalHealthConditions.Add(new SelectListItem()
                {
                    Text = opt.OptionName,
                    Value = opt.ID.ToString()
                });
            }


            // Bind Healthcare drop-downs Diagnosed
            List<SelectListItem> ddlDiagnosed = new List<SelectListItem>();
            ddlDiagnosed.Add(new SelectListItem() { Value = "0", Text = "Select All" });
            foreach (LookUpFieldOptionBO opt in lstoption.Where(p => p.LookUpFieldID == 44 && p.IsDeleted == false))
            {
                ddlDiagnosed.Add(new SelectListItem()
                {
                    Text = opt.OptionName,
                    Value = opt.ID.ToString()
                });
            }


            patientdetailobj.PatientSubstanceUse.ddlDrinkAlcohol.AddRange(ddlDrinkAlcohol);
            patientdetailobj.PatientSubstanceUse.ddlHowManyDrinks.AddRange(ddlHowManyDrinks);
            patientdetailobj.PatientSubstanceUse.ddlSixOrMoreDrink.AddRange(ddlSixOrMoreDrink);
            patientdetailobj.PatientSubstanceUse.ddlNotAbleToStopDrinking.AddRange(ddlNotAbleToStopDrinking);
            patientdetailobj.PatientSubstanceUse.ddlFailedWhatWasExpected.AddRange(ddlFailedWhatWasExpected);
            patientdetailobj.PatientSubstanceUse.ddlFirstDrinkMorning.AddRange(ddlFirstDrinkMorning);
            patientdetailobj.PatientSubstanceUse.ddlFeelingOfGuilt.AddRange(ddlFeelingOfGuilt);
            patientdetailobj.PatientSubstanceUse.ddlUnableToRemember.AddRange(ddlUnableToRemember);
            patientdetailobj.PatientSubstanceUse.ddlInjuredOfYourDrinking.AddRange(ddlInjuredOfYourDrinking);
            patientdetailobj.PatientSubstanceUse.ddlFriendsSuggestedYouCutDown.AddRange(ddlFriendsSuggestedYouCutDown);
            patientdetailobj.PatientMentalHealth.ddlPoorMentalHealth.AddRange(ddlPoorMentalHealth);
            patientdetailobj.PatientMentalHealth.ddlSufferExcessive.AddRange(ddlSufferExcessive);
            patientdetailobj.PatientFoodAccess.ddlServingsOfFruit.AddRange(ddlServingsOfFruit);
            patientdetailobj.PatientFoodAccess.ddlPortionsOfVegetables.AddRange(ddlPortionsOfVegetables);
            patientdetailobj.PatientFoodAccess.ddlMajorityOfFood.AddRange(ddlMajorityOfFood);
            patientdetailobj.PatientProgram.ddlAnyVaccinations.AddRange(ddlAnyVaccinations);
            //patientdetailobj.PatientProgram.ddlPregnantYes.AddRange(ddlPregnantYes);
            patientdetailobj.PatientProgram.ddlScreeningTests.AddRange(ddlScreeningTests);
            patientdetailobj.PatientProgram.ddlReferralSource.AddRange(ddlReferralSource);
            patientdetailobj.PatientProgram.ddlCurrentLivingSituation.AddRange(ddlCurrentLivingSituation);
            patientdetailobj.PatientProgram.ddlOneYouAre.AddRange(ddlOneYouAre);
            patientdetailobj.PatientHousing.ddlPlaceLiveNow.AddRange(ddlPlaceLiveNow);
            patientdetailobj.PatientHousing.ddlEmergencyShelter.AddRange(ddlEmergencyShelter);
            patientdetailobj.PatientFinancialSecurity.ddlDifficultiesInPayingBills.AddRange(ddlDifficultiesInPayingBills);
            patientdetailobj.PatientFinancialSecurity.ddlSkipMeals.AddRange(ddlSkipMeals);
            patientdetailobj.PatientEmploymentEducation.ddlLevelofEducation.AddRange(ddlLevelofEducation);
            patientdetailobj.PatientEmploymentEducation.ddlWorkSituation.AddRange(ddlWorkSituation);
            patientdetailobj.PatientEmploymentEducation.ddlParticipatingInEducationalOrTrainingProgram.AddRange(ddlParticipatingInEducationalOrTrainingProgram);
            patientdetailobj.PatientCommunicationAndMobility.ddlDifficultyGoingPlaces.AddRange(ddlDifficultyGoingPlaces);
            patientdetailobj.PatientCommunicationAndMobility.ddlModesOfTransportation.AddRange(ddlModesOfTransportation);
            patientdetailobj.PatientHealthcare.ddlLastSeeDoctor.AddRange(ddlLastSeeDoctor);
            patientdetailobj.PatientHealthcare.ddlLastSeeDentist.AddRange(ddlLastSeeDentist);
            patientdetailobj.PatientHealthcare.ddlYourHealthIs.AddRange(ddlYourHealthIs);
            patientdetailobj.PatientHealthcare.ddlPastMonthPoorPhysicalHealth.AddRange(ddlPastMonthPoorPhysicalHealth);
            patientdetailobj.PatientHealthcare.ddlPerWeekStrenuousExercise.AddRange(ddlPerWeekStrenuousExercise);
            patientdetailobj.PatientHealthcare.ddlPerDayStrenuousExercise.AddRange(ddlPerDayStrenuousExercise);
            patientdetailobj.PatientHealthcare.ddlPastYearEmergency.AddRange(ddlPastYearEmergency);
            patientdetailobj.PatientHealthcare.ddlSmokePerDay.AddRange(ddlSmokePerDay);
            patientdetailobj.PatientHealthcare.ddlFrequentlySmoke.AddRange(ddlFrequentlySmoke);
            patientdetailobj.PatientSocialSupport.ddlFinancialSecurity.AddRange(ddlFinancialSecurity);
            patientdetailobj.PatientSocialSupport.ddlPlaceToStay.AddRange(ddlPlaceToStay);
            patientdetailobj.PatientSocialSupport.ddlFeelSafeNeighborhood.AddRange(ddlFeelSafeNeighborhood);
            patientdetailobj.PatientLegalStatus.ddlLastReleased.AddRange(ddlLastReleased);
            patientdetailobj.PatientLegalStatus.ddlParoleProbation.AddRange(ddlParoleProbation);
            patientdetailobj.PatientMentalHealth.ddlMentalHealthConditions.AddRange(ddlMentalHealthConditions);
            patientdetailobj.PatientHealthcare.ddlDiagnosed.AddRange(ddlDiagnosed);


        }

        public void BindDBOptions(ref PatientDetailBO patientdetailobj)
        {
            //Bind safety option if already saved from db
            if (patientdetailobj.OUOnly.Safety != "" && patientdetailobj.OUOnly.Safety != null)
            {
                string[] safetyoptions = patientdetailobj.OUOnly.Safety.Split(new Char[] { ',' });

                foreach (string str in safetyoptions)
                {
                    SafetyOptions.Add(str);
                }

                patientdetailobj.PatientProgram.safetyoptions = SafetyOptions;
            }
            else
            {
                BindSafetyOptions(ref patientdetailobj);

            }

            //Bind employment option if already saved from db
            if (patientdetailobj.OUOnly.Education != "" && patientdetailobj.OUOnly.Education != null)
            {
                string[] employmentoptions = patientdetailobj.OUOnly.Education.Split(new Char[] { ',' });

                foreach (string str in employmentoptions)
                {
                    EmploymentOptions.Add(str);
                }

                patientdetailobj.PatientProgram.employmentoptions = EmploymentOptions;
            }
            else
            {
                BindEmploymentOptions(ref patientdetailobj);

            }

            //Bind housing/shelter option if already saved from db
            if (patientdetailobj.OUOnly.HousingShelter != "" && patientdetailobj.OUOnly.HousingShelter != null)
            {
                string[] options = patientdetailobj.OUOnly.HousingShelter.Split(new Char[] { ',' });

                foreach (string str in options)
                {
                    HousingShelterOptions.Add(str);
                }

                patientdetailobj.PatientProgram.housingshelteroptions = HousingShelterOptions;
            }
            else
            {
                BindHousingShelterOptions(ref patientdetailobj);

            }

            //Bind educationOptions option if already saved from db
            if (patientdetailobj.OUOnly.Education != "" && patientdetailobj.OUOnly.Education != null)
            {
                string[] options = patientdetailobj.OUOnly.Education.Split(new Char[] { ',' });

                foreach (string str in options)
                {
                    EducationOptions.Add(str);
                }

                patientdetailobj.PatientProgram.educationoptions = EducationOptions;
            }
            else
            {
                BindEducationOptions(ref patientdetailobj);

            }

            //Bind LegalOptions option if already saved from db
            if (patientdetailobj.OUOnly.Legal != "" && patientdetailobj.OUOnly.Legal != null)
            {
                string[] options = patientdetailobj.OUOnly.Legal.Split(new Char[] { ',' });

                foreach (string str in options)
                {
                    LegalOptions.Add(str);
                }

                patientdetailobj.PatientProgram.legaloptions = LegalOptions;
            }
            else
            {
                BindLegalOptions(ref patientdetailobj);

            }

            //Bind SocialRecreational option if already saved from db
            if (patientdetailobj.OUOnly.SocialRecreational != "" && patientdetailobj.OUOnly.SocialRecreational != null)
            {
                string[] options = patientdetailobj.OUOnly.SocialRecreational.Split(new Char[] { ',' });

                foreach (string str in options)
                {
                    SocialRecreationalOptions.Add(str);
                }

                patientdetailobj.PatientProgram.socialrecreationaloptions = SocialRecreationalOptions;
            }
            else
            {
                BindSocialRecreationalOptions(ref patientdetailobj);

            }

        }

        public static string ConvertValuesToExport(Object Value)
        {
            if(Value == null)
            {
                return "";
            }
            else
            {
                return Value.ToString();
            }

        }

        public List<PermissionModel> GetMainModulesPermission(int userId)
        {
            List<PermissionModel> permissionModel = new List<PermissionModel>();
            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri(WebApiKey);
                //HTTP GET
                var responseTask = client.GetAsync("/api/PatientMain/GetMainMenuPermissions?userId=" + userId);
                responseTask.Wait();

                var result = responseTask.Result;
                if (result.IsSuccessStatusCode)
                {
                    var readTask = result.Content.ReadAsAsync<List<PermissionModel>>();
                    readTask.Wait();
                    permissionModel = readTask.Result;


                }

            }
            return permissionModel;
        }

        public List<ModulepermissionsBO> GetPermissionsByModuleId(int userId, int moduleId,bool isClientForm = false)
        {
            List<ModulepermissionsBO> permissionModel = new List<ModulepermissionsBO>();
            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri(WebApiKey);
                //HTTP GET
                var responseTask = client.GetAsync("/api/PatientMain/GetPermissionsByModuleId?userId=" + userId + "&&moduleId=" + moduleId+ "&&isClientForm="+ isClientForm);
                responseTask.Wait();

                var result = responseTask.Result;
                if (result.IsSuccessStatusCode)
                {
                    var readTask = result.Content.ReadAsAsync<List<ModulepermissionsBO>>();
                    readTask.Wait();
                    permissionModel = readTask.Result;


                }

            }
            return permissionModel;
        }

        public void LogExceptionToDb(Exception objException)
        {
            using (var client = new HttpClient())
            {
                try
                {
                    client.BaseAddress = new Uri(WebApiKey);
                    //HTTP GET
                    var responseTask = client.PostAsJsonAsync("/api/PatientMain/SaveException", objException);
                    responseTask.Wait();

                    var result = responseTask.Result;

                }
                catch (Exception ex)
                {

                }


            }
        }
    }
}
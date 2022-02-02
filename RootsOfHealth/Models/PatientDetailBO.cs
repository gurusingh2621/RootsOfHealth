using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace RootsOfHealth.Models
{
    public class PatientDetailBO
    {
        public PatientMainBO PatientMain { get; set; }
        public PatientHousingBO PatientHousing { get; set; }
        public PatientFinancialSecurityBO PatientFinancialSecurity { get; set; }
        public PatientEmploymentEducationBO PatientEmploymentEducation { get; set; }
        public PatientCommunicationAndMobilityBO PatientCommunicationAndMobility { get; set; }
        public PatientHealthcareBO PatientHealthcare { get; set; }
        public PatientSocialSupportBO PatientSocialSupport { get; set; }
        public PatientLegalStatuBO PatientLegalStatus { get; set; }
        public PatientSubstanceUseBO PatientSubstanceUse { get; set; }
        public DastBO Dast { get; set; }
        public AuditBO Audit { get; set; }
        public PHQ9BO PHQ9 { get; set; }
        public PatientMentalHealthBO PatientMentalHealth { get; set; }
        public PatientFoodAccessBO PatientFoodAccess { get; set; }
        public ClinicBO ClinicOnly { get; set; }
        public PatientProgramBO PatientProgram { get; set; }
        public DreamOnlyBO DreamOnly { get; set; }
        public OUOnlyBO OUOnly { get; set; }
        public PeraltaCollegeBO PeraltaCollege { get; set; }
        public PatientScoreBO PatientScore { get; set; }
        public ScheduleDateBO ScheduleDate { get; set; }

        public List<ProgramsForPatientBO> Programs { get; set; }
        public List<ClientFormForPatientBO> ClientForm { get; set; }
        public List<Form_ScheduleResultBO> FormScheduling { get; set; }
        public CareplanCountBO CarePlanCount { get; set; }


        public PatientDetailBO()
        {

            PatientMain = new PatientMainBO();
            PatientHousing = new PatientHousingBO();
            PatientFinancialSecurity = new PatientFinancialSecurityBO();
            PatientEmploymentEducation = new PatientEmploymentEducationBO();
            PatientCommunicationAndMobility = new PatientCommunicationAndMobilityBO();
            PatientHealthcare = new PatientHealthcareBO();
            PatientSocialSupport = new PatientSocialSupportBO();
            PatientLegalStatus = new PatientLegalStatuBO();
            PatientSubstanceUse = new PatientSubstanceUseBO();
            Dast = new DastBO();
            Audit = new AuditBO();
            PHQ9 = new PHQ9BO();
            PatientMentalHealth = new PatientMentalHealthBO();
            PatientFoodAccess = new PatientFoodAccessBO();
            ClinicOnly = new ClinicBO();
            PatientProgram = new PatientProgramBO();
            DreamOnly = new DreamOnlyBO();
            OUOnly = new OUOnlyBO();
            PeraltaCollege = new PeraltaCollegeBO();
            PatientScore = new PatientScoreBO();
            ScheduleDate = new ScheduleDateBO();
            FormScheduling = new List<Form_ScheduleResultBO>();






        }


    }

    
}
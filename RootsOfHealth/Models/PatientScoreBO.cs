using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace RootsOfHealth.Models
{
    public class PatientScoreBO
    {
        public double housingscore { get; set; }
        public double financialcscore { get; set; }
        public double employmentscore { get; set; }
        public double communicationscore { get; set; }
        public double healthcarescore { get; set; }
        public double socialsupportscore { get; set; }
        public double legalstatusscore { get; set; }
        public double substancescore { get; set; }
        public double mentalhealthscore { get; set; }
        public double foodaccessscore { get; set; }
        public double clinicscore { get; set; }
        public double ouonlyscore { get; set; }
        public double peraltascore { get; set; }
        public double OverallScore { get; set; }



        public string housingstatus { get; set; }
        public string financialcstatus { get; set; }
        public string employmentstatus { get; set; }
        public string communicationstatus { get; set; }
        public string healthcarestatus { get; set; }
        public string socialsupportstatus { get; set; }
        public string legalstatusstatus { get; set; }
        public string substancestatus { get; set; }
        public string mentalhealthstatus { get; set; }
        public string foodaccessstatus { get; set; }
        public string clinicstatus { get; set; }
        public string ouonlystatus { get; set; }
        public string peraltastatus { get; set; }
        public string OverallStatus { get; set; }

    }
}
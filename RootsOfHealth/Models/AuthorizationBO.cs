using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace RootsOfHealth.Models
{
    public class AuthorizationBO
    {
        public ReleaseAndDisclousureBO ReleaseAndDisclousure { get; set; }
        public CareConnectBO CareConnect { get; set; }
        public PatientMainBO PatientMain { get; set; }
        public WholePersonCareBo WholePersonCare { get; set; }
        public IEnumerable<SelectListItem> Data { get; set; }
        public int PatientID { get; set; }

        public AuthorizationBO()
        {
            ReleaseAndDisclousure = new ReleaseAndDisclousureBO();
            CareConnect = new CareConnectBO();
            WholePersonCare = new WholePersonCareBo();
        }
    }
}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace RootsOfHealth.Models
{
    public class ProgramBO
    {
        public int ProgramsID { get; set; }
        public string ProgramsName { get; set; }
        public Nullable<int> CreatedBy { get; set; }
        public Nullable<System.DateTime> CreatedDate { get; set; }
        public Nullable<int> ModifiedBy { get; set; }
        public Nullable<System.DateTime> ModifiedDate { get; set; }
        public Nullable<bool> IsDeleted { get; set; }
    }

    public class Program
    {
       public  List<PatientProgram> PatientPrograms { get; set; }
        public List<AvailableProgram> AvailablePrograms { get; set; }
     
    }

    public class PatientProgram
    {
        public int PatientProgramsID { get; set; }
        public Nullable<int> ProgramsID { get; set; }
        public string ProgramsName { get; set; }

    }

    public class AvailableProgram
    {
        public int ProgramsID { get; set; }
        public string ProgramsName { get; set; }
        public Nullable<int> CreatedBy { get; set; }
        public Nullable<System.DateTime> CreatedDate { get; set; }
        public Nullable<int> ModifiedBy { get; set; }
        public Nullable<System.DateTime> ModifiedDate { get; set; }
        public Nullable<bool> IsDeleted { get; set; }
    }
}
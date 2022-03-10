using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace RootsOfHealth.Models
{
    public class ModulepermissionsBO
    {
        public Nullable<int> RoleID { get; set; }
        public Nullable<int> ModuleId { get; set; }
        public string ModuleName { get; set; }
        public Nullable<bool> CanCreate { get; set; }
        public Nullable<bool> CanUpdate { get; set; }
        public Nullable<bool> CanDelete { get; set; }
        public Nullable<bool> CanList { get; set; }
  
    }
}
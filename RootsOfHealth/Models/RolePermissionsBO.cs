using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace RootsOfHealth.Models
{
    public class RolePermissionsBO
    {
        public int PermissionID { get; set; }
        public Nullable<int> RoleID { get; set; }
        public Nullable<int> ModuleID { get; set; }
        public string ModuleName { get; set; }
        public Nullable<bool> CanCreate { get; set; }
        public Nullable<bool> CanUpdate { get; set; }
        public Nullable<bool> CanDelete { get; set; }
        public Nullable<bool> CanList { get; set; }
        public Nullable<int> CreatedBy { get; set; }
        public Nullable<System.DateTime> CreatedDate { get; set; }
        public Nullable<int> ModifiedBy { get; set; }
        public Nullable<System.DateTime> ModifiedDate { get; set; }
        public Nullable<bool> IsDeleted { get; set; }
        public Nullable<int> ClientFormId { get; set; }
        public string FormName { get; set; }

    }
}
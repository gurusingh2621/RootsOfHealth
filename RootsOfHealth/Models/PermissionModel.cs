using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace RootsOfHealth.Models
{
    public class PermissionModel
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

        public enum Permission
        {
            Create = 1,
            Update,
            Delete,
            View
        }
        public enum Module
        {
            Appointment=1,
            Users,
            RolesPermission,
            FormScheduling,
            PotientialPatient,
            Notes,
            Client,
            Authorization,
            UserGroup,
            AppointmentSetting,
            Careplan,
            FormsharingExport,
            SystemSetting,
            PotentialClient,
            Programs,
            ClientForms,
            ClientrequestIntake

        }
        public static bool HasPermission(int ModuleId,int PermissionType) {

          var data = HttpContext.Current.Session["permissions"] as List<PermissionModel>;
            if(data!=null && data.Count > 0)
            {
                var module = data.SingleOrDefault(x => x.ModuleID == ModuleId);
                bool permission=false;
                switch (PermissionType)
                {
                    case 1:
                        permission = Convert.ToBoolean(module.CanCreate);
                        break;
                    case 2:
                        permission = Convert.ToBoolean(module.CanUpdate);
                        break;
                    case 3:
                        permission = Convert.ToBoolean(module.CanDelete);
                        break;
                    case 4:
                        permission = Convert.ToBoolean(module.CanList);
                        break;
                }
                return permission;
            }
            return false;
               }
    }
}
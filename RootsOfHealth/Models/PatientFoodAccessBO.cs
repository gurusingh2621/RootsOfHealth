﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace RootsOfHealth.Models
{
    public class PatientFoodAccessBO
    {
        public int FoodAccessID { get; set; }
        public string ServingsOfFruit { get; set; }
        public string PortionsOfVegetables { get; set; }
        public string MajorityOfFood { get; set; }
        public Nullable<int> PatientID { get; set; }
        public Nullable<int> CreatedBy { get; set; }
        public Nullable<System.DateTime> CreatedDate { get; set; }
        public Nullable<int> ModifiedBy { get; set; }
        public Nullable<System.DateTime> ModifiedDate { get; set; }
        public Nullable<bool> IsDeleted { get; set; }
        public List<SelectListItem> ddlServingsOfFruit { get; set; }
        public List<SelectListItem> ddlPortionsOfVegetables { get; set; }
        public List<SelectListItem> ddlMajorityOfFood { get; set; }

        public PatientFoodAccessBO()
        {
            ddlServingsOfFruit = new List<SelectListItem>();
            ddlPortionsOfVegetables = new List<SelectListItem>();
            ddlMajorityOfFood = new List<SelectListItem>();
        }
    }
}
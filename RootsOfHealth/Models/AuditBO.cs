using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace RootsOfHealth.Models
{
    public class AuditBO
    {
        public int AuditID { get; set; }
        public Nullable<int> DrinkContainingAlcohol { get; set; }
        public Nullable<int> HowManyDrinks { get; set; }
        public Nullable<int> SixOrMoreDrink { get; set; }
        public Nullable<int> NotAbleToStopDrinking { get; set; }
        public Nullable<int> FailedWhatWasExpected { get; set; }
        public Nullable<int> FirstDrinkMorning { get; set; }
        public Nullable<int> FeelingOfGuilt { get; set; }
        public Nullable<int> UnableToRemember { get; set; }
        public Nullable<int> InjuredOfYourDrinking { get; set; }
        public Nullable<int> FriendsSuggestedYouCutDown { get; set; }
        public Nullable<int> PatientID { get; set; }
        public Nullable<int> CreatedBy { get; set; }
        public Nullable<System.DateTime> CreatedDate { get; set; }
        public Nullable<int> ModifiedBy { get; set; }
        public Nullable<System.DateTime> ModifiedDate { get; set; }
        public Nullable<bool> IsDeleted { get; set; }
    }
}
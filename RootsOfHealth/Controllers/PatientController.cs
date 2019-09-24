using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Web;
using System.Web.Configuration;
using System.Web.Mvc;
using RootsOfHealth.Commom;
using RootsOfHealth.Models;

namespace RootsOfHealth.Controllers
{
    [Authorize]
    public class PatientController : Controller
    {
        string WebApiKey = WebConfigurationManager.AppSettings["WebApi"];


        // GET: RootsOfHealth
        public ActionResult Add(string patientId = "0")
        {
            double sub;
            Common objCommon = new Common();
            PatientDetailBO patientdetailobj = new PatientDetailBO();
            List<FormSchedulingBO> formscheduleobj = new List<FormSchedulingBO>();
            ScheduleDateBO sheduleobj = new ScheduleDateBO();

            if (patientId != "0")
            {
                using (var client = new HttpClient())
                {
                    client.BaseAddress = new Uri(WebApiKey);
                    //HTTP GET
                    var responseTask = client.GetAsync("/api/PatientMain/GetDetailOfPatient?patientid=" + patientId);
                    var responseTask1 = client.GetAsync("/api/PatientMain/GetFormScheduling");

                    responseTask.Wait();
                    responseTask1.Wait();

                    var result = responseTask.Result;
                    var result1 = responseTask1.Result;
                    if (result.IsSuccessStatusCode && result1.IsSuccessStatusCode)
                    {
                        var readTask = result.Content.ReadAsAsync<PatientDetailBO>();
                        readTask.Wait();

                        var readTask1 = result1.Content.ReadAsAsync<List<FormSchedulingBO>>();
                        readTask1.Wait();


                        patientdetailobj = readTask.Result;
                        patientdetailobj.PatientSubstanceUse.Dast = patientdetailobj.Dast;
                        patientdetailobj.PatientSubstanceUse.Audit = patientdetailobj.Audit;

                        patientdetailobj.PatientMentalHealth.PHQ9 = patientdetailobj.PHQ9;
                        patientdetailobj.PatientProgram.ClinicOnly = patientdetailobj.ClinicOnly;
                        patientdetailobj.PatientProgram.DreamOnly = patientdetailobj.DreamOnly;
                        patientdetailobj.PatientProgram.OUOnly = patientdetailobj.OUOnly;
                        patientdetailobj.PatientProgram.PeraltaCollege = patientdetailobj.PeraltaCollege;

                        ViewBag.FirstName = patientdetailobj.PatientMain.FirstName + " " + patientdetailobj.PatientMain.MiddleName + " " + patientdetailobj.PatientMain.LastName;
                        ViewBag.DOB = patientdetailobj.PatientMain.DateOfBirth;
                        ViewBag.mentalPDOB = patientdetailobj.PatientMentalHealth.CreatedDate == null ? DateTime.Now.ToShortDateString() : patientdetailobj.PatientMentalHealth.CreatedDate.ToString();
                        ViewBag.SSNNumber = patientdetailobj.PatientMain.SocialSecurityNumber;

                        ViewBag.PatientID = patientId;


                        formscheduleobj = readTask1.Result;
                        foreach (var m in formscheduleobj)
                        {
                            if (m.FormName == "Housing")
                            {
                                var modifydate = patientdetailobj.PatientHousing.ModifiedDate;
                                if (modifydate != null)
                                {
                                    var dt = patientdetailobj.PatientHousing.ModifiedDate.Value.ToShortDateString();

                                    var t = "";
                                    var currentdate = "";
                                    var count = m.ForEvery;
                                    var type = m.ForType;
                                    if (type == "Days")
                                    {
                                        var everyd = Convert.ToDouble(count);
                                        t = Convert.ToDateTime(dt).AddDays(everyd).ToString("dd-MM-yyyy");
                                        currentdate = DateTime.Now.ToShortDateString();

                                    }
                                    else if (type == "Week")
                                    {
                                        var everyw = Convert.ToDouble(7 * count);
                                        t = Convert.ToDateTime(dt).AddDays(everyw).ToString("dd-MM-yyyy");
                                    }
                                    else if (type == "Month")
                                    {
                                        var everym = Convert.ToInt16(count);
                                        t = Convert.ToDateTime(dt).AddMonths(everym).ToString("dd-MM-yyyy");
                                    }

                                    var todaydate = DateTime.Now.ToShortDateString();
                                    var houschedule = DateTime.Parse(t);
                                    var today = DateTime.Parse(todaydate);
                                    if (today > houschedule)
                                    {

                                        sheduleobj.IsHousingDue = "Red";
                                        sub = (today - houschedule).TotalDays;
                                        sheduleobj.HousingNotification = (sub - 1).ToString();
                                    }
                                    else if (today <= houschedule)
                                    {

                                        sub = (houschedule - today).TotalDays;
                                        if (sub >= 3 && sub < 7)
                                        {
                                            sheduleobj.IsHousingDue = "Green";
                                        }
                                        else if (sub >= 0 && sub < 3)
                                        {
                                            sheduleobj.IsHousingDue = "Orange";
                                        }
                                        sheduleobj.HousingNotification = (sub + 1).ToString();
                                    }
                                }
                                else
                                {

                                }
                            }

                            else if (m.FormName == "Financial Security")
                            {
                                var modifydate = patientdetailobj.PatientFinancialSecurity.ModifiedDate;
                                if (modifydate != null)
                                {
                                    var dt = patientdetailobj.PatientFinancialSecurity.ModifiedDate.Value.ToShortDateString();

                                    var t = "";
                                    var count = m.ForEvery;
                                    var type = m.ForType;
                                    if (type == "Days")
                                    {
                                        var everyd = Convert.ToDouble(count);
                                        t = Convert.ToDateTime(dt).AddDays(everyd).ToString("dd-MM-yyyy");
                                    }
                                    else if (type == "Week")
                                    {
                                        var everyw = Convert.ToDouble(7 * count);
                                        t = Convert.ToDateTime(dt).AddDays(everyw).ToString("dd-MM-yyyy");
                                    }
                                    else if (type == "Month")
                                    {
                                        var everym = Convert.ToInt16(count);
                                        t = Convert.ToDateTime(dt).AddMonths(everym).ToString("dd-MM-yyyy");
                                    }

                                    var todaydate = DateTime.Now.ToShortDateString();
                                    var houschedule = DateTime.Parse(t);
                                    var today = DateTime.Parse(todaydate);
                                    if (today > houschedule)
                                    {

                                        sheduleobj.IsFinancialDue = "Red";
                                        sub = (today - houschedule).TotalDays;
                                        sheduleobj.FinancialNotification = (sub - 1).ToString();
                                    }
                                    else if (today <= houschedule)
                                    {

                                        sub = (houschedule - today).TotalDays;
                                        if (sub >= 3 && sub < 7)
                                        {
                                            sheduleobj.IsFinancialDue = "Green";
                                        }
                                        else if (sub >= 0 && sub < 3)
                                        {
                                            sheduleobj.IsFinancialDue = "Orange";
                                        }
                                        sheduleobj.FinancialNotification = (sub + 1).ToString();
                                    }
                                }
                                else
                                {

                                }
                            }

                            else if (m.FormName == "Employment/Education")
                            {
                                var modifydate = patientdetailobj.PatientEmploymentEducation.ModifiedDate;
                                if (modifydate != null)
                                {
                                    var dt = patientdetailobj.PatientEmploymentEducation.ModifiedDate.Value.ToShortDateString();

                                    var t = "";
                                    var count = m.ForEvery;
                                    var type = m.ForType;
                                    if (type == "Days")
                                    {
                                        var everyd = Convert.ToDouble(count);
                                        t = Convert.ToDateTime(dt).AddDays(everyd).ToString("dd-MM-yyyy");
                                    }
                                    else if (type == "Week")
                                    {
                                        var everyw = Convert.ToDouble(7 * count);
                                        t = Convert.ToDateTime(dt).AddDays(everyw).ToString("dd-MM-yyyy");
                                    }
                                    else if (type == "Month")
                                    {
                                        var everym = Convert.ToInt16(count);
                                        t = Convert.ToDateTime(dt).AddMonths(everym).ToString("dd-MM-yyyy");
                                    }

                                    var todaydate = DateTime.Now.ToShortDateString();
                                    var houschedule = DateTime.Parse(t);
                                    var today = DateTime.Parse(todaydate);
                                    if (today > houschedule)
                                    {

                                        sheduleobj.IsEmploymentDue = "Red";
                                        sub = (today - houschedule).TotalDays;
                                        sheduleobj.EmploymentNotification = (sub - 1).ToString();
                                    }
                                    else if (today <= houschedule)
                                    {

                                        sub = (houschedule - today).TotalDays;
                                        if (sub >= 3 && sub < 7)
                                        {
                                            sheduleobj.IsEmploymentDue = "Green";
                                        }
                                        else if (sub >= 0 && sub < 3)
                                        {
                                            sheduleobj.IsEmploymentDue = "Orange";
                                        }
                                        sheduleobj.EmploymentNotification = (sub + 1).ToString();
                                    }

                                }
                                else
                                {

                                }
                            }

                            else if (m.FormName == "Communication & Mobility")
                            {
                                var modifydate = patientdetailobj.PatientCommunicationAndMobility.ModifiedDate;
                                if (modifydate != null)
                                {
                                    var dt = patientdetailobj.PatientCommunicationAndMobility.ModifiedDate.Value.ToShortDateString();

                                    var t = "";
                                    var count = m.ForEvery;
                                    var type = m.ForType;
                                    if (type == "Days")
                                    {
                                        var everyd = Convert.ToDouble(count);
                                        t = Convert.ToDateTime(dt).AddDays(everyd).ToString("dd-MM-yyyy");
                                    }
                                    else if (type == "Week")
                                    {
                                        var everyw = Convert.ToDouble(7 * count);
                                        t = Convert.ToDateTime(dt).AddDays(everyw).ToString("dd-MM-yyyy");
                                    }
                                    else if (type == "Month")
                                    {
                                        var everym = Convert.ToInt16(count);
                                        t = Convert.ToDateTime(dt).AddMonths(everym).ToString("dd-MM-yyyy");
                                    }
                                    //ViewBag.HouSchedule=t;
                                    var todaydate = DateTime.Now.ToShortDateString();
                                    var houschedule = DateTime.Parse(t);
                                    var today = DateTime.Parse(todaydate);
                                    if (today > houschedule)
                                    {
                                        sheduleobj.IsCommunicationDue = "Red";
                                        sub = (today - houschedule).TotalDays;
                                        sheduleobj.CommunicationNotification = (sub - 1).ToString();
                                    }
                                    else if (today <= houschedule)
                                    {

                                        sub = (houschedule - today).TotalDays;
                                        if (sub >= 3 && sub < 7)
                                        {
                                            sheduleobj.IsCommunicationDue = "Green";
                                        }
                                        else if (sub >= 0 && sub < 3)
                                        {
                                            sheduleobj.IsCommunicationDue = "Orange";
                                        }
                                        sheduleobj.CommunicationNotification = (sub + 1).ToString();
                                    }

                                }
                                else
                                {

                                }
                            }

                            else if (m.FormName == "Healthcare")
                            {
                                var modifydate = patientdetailobj.PatientHealthcare.ModifiedDate;
                                if (modifydate != null)
                                {
                                    var dt = patientdetailobj.PatientHealthcare.ModifiedDate.Value.ToShortDateString();

                                    var t = "";
                                    var count = m.ForEvery;
                                    var type = m.ForType;
                                    if (type == "Days")
                                    {
                                        var everyd = Convert.ToDouble(count);
                                        t = Convert.ToDateTime(dt).AddDays(everyd).ToString("dd-MM-yyyy");
                                    }
                                    else if (type == "Week")
                                    {
                                        var everyw = Convert.ToDouble(7 * count);
                                        t = Convert.ToDateTime(dt).AddDays(everyw).ToString("dd-MM-yyyy");
                                    }
                                    else if (type == "Month")
                                    {
                                        var everym = Convert.ToInt16(count);
                                        t = Convert.ToDateTime(dt).AddMonths(everym).ToString("dd-MM-yyyy");
                                    }
                                    //ViewBag.HouSchedule=t;
                                    var todaydate = DateTime.Now.ToShortDateString();
                                    var houschedule = DateTime.Parse(t);
                                    var today = DateTime.Parse(todaydate);
                                    if (today > houschedule)
                                    {
                                        sheduleobj.IsHealthcareDue = "Red";
                                        sub = (today - houschedule).TotalDays;
                                        sheduleobj.HealthcareNotification = (sub - 1).ToString();
                                    }
                                    else if (today <= houschedule)
                                    {

                                        sub = (houschedule - today).TotalDays;
                                        if (sub >= 3 && sub < 7)
                                        {
                                            sheduleobj.IsHealthcareDue = "Green";
                                        }
                                        else if (sub >= 0 && sub < 3)
                                        {
                                            sheduleobj.IsHealthcareDue = "Orange";
                                        }
                                        sheduleobj.HealthcareNotification = (sub + 1).ToString();
                                    }

                                }
                                else
                                {

                                }
                            }

                            else if (m.FormName == "Social Supports and Safety")
                            {
                                var modifydate = patientdetailobj.PatientSocialSupport.ModifiedDate;
                                if (modifydate != null)
                                {
                                    var dt = patientdetailobj.PatientSocialSupport.ModifiedDate.Value.ToShortDateString();

                                    var t = "";
                                    var count = m.ForEvery;
                                    var type = m.ForType;
                                    if (type == "Days")
                                    {
                                        var everyd = Convert.ToDouble(count);
                                        t = Convert.ToDateTime(dt).AddDays(everyd).ToString("dd-MM-yyyy");
                                    }
                                    else if (type == "Week")
                                    {
                                        var everyw = Convert.ToDouble(7 * count);
                                        t = Convert.ToDateTime(dt).AddDays(everyw).ToString("dd-MM-yyyy");
                                    }
                                    else if (type == "Month")
                                    {
                                        var everym = Convert.ToInt16(count);
                                        t = Convert.ToDateTime(dt).AddMonths(everym).ToString("dd-MM-yyyy");
                                    }
                                    //ViewBag.HouSchedule=t;
                                    var todaydate = DateTime.Now.ToShortDateString();
                                    var houschedule = DateTime.Parse(t);
                                    var today = DateTime.Parse(todaydate);
                                    if (today > houschedule)
                                    {
                                        sheduleobj.IsSocialSupportsDue = "Red";
                                        sub = (today - houschedule).TotalDays;
                                        sheduleobj.SocialNotification = (sub - 1).ToString();
                                    }
                                    else if (today <= houschedule)
                                    {

                                        sub = (houschedule - today).TotalDays;
                                        if (sub >= 3 && sub < 7)
                                        {
                                            sheduleobj.IsSocialSupportsDue = "Green";
                                        }
                                        else if (sub >= 0 && sub < 3)
                                        {
                                            sheduleobj.IsSocialSupportsDue = "Orange";
                                        }
                                        sheduleobj.SocialNotification = (sub + 1).ToString();
                                    }

                                }
                                else
                                {

                                }
                            }

                            else if (m.FormName == "Legal Status")
                            {
                                var modifydate = patientdetailobj.PatientLegalStatus.ModifiedDate;
                                if (modifydate != null)
                                {
                                    var dt = patientdetailobj.PatientLegalStatus.ModifiedDate.Value.ToShortDateString();

                                    var t = "";

                                    var count = m.ForEvery;
                                    var type = m.ForType;
                                    if (type == "Days")
                                    {
                                        var everyd = Convert.ToDouble(count);
                                        t = Convert.ToDateTime(dt).AddDays(everyd).ToString("dd-MM-yyyy");
                                    }
                                    else if (type == "Week")
                                    {
                                        var everyw = Convert.ToDouble(7 * count);
                                        t = Convert.ToDateTime(dt).AddDays(everyw).ToString("dd-MM-yyyy");
                                    }
                                    else if (type == "Month")
                                    {
                                        var everym = Convert.ToInt16(count);
                                        t = Convert.ToDateTime(dt).AddMonths(everym).ToString("dd-MM-yyyy");
                                    }
                                    //ViewBag.HouSchedule=t;
                                    var todaydate = DateTime.Now.ToShortDateString();
                                    var houschedule = DateTime.Parse(t);
                                    var today = DateTime.Parse(todaydate);
                                    if (today > houschedule)
                                    {
                                        sheduleobj.IsLegalStatusDue = "Red";
                                        sub = (today - houschedule).TotalDays;
                                        sheduleobj.LegalNotification = (sub - 1).ToString();
                                    }
                                    else if (today <= houschedule)
                                    {

                                        sub = (houschedule - today).TotalDays;
                                        if (sub >= 3 && sub < 7)
                                        {
                                            sheduleobj.IsLegalStatusDue = "Green";
                                        }
                                        else if (sub >= 0 && sub < 3)
                                        {
                                            sheduleobj.IsLegalStatusDue = "Orange";
                                        }
                                        sheduleobj.LegalNotification = (sub + 1).ToString();
                                    }


                                }
                                else
                                {

                                }
                            }

                            else if (m.FormName == "Substance Use")
                            {
                                double subaudit = 0, subdast = 0;

                                var modifydateaudit = patientdetailobj.Audit.ModifiedDate;
                                var modifydatedast = patientdetailobj.Dast.ModifiedDate;


                                if (modifydatedast != null)
                                {

                                    var dastdt = patientdetailobj.Dast.ModifiedDate.Value.ToShortDateString();
                                    var tdast = "";
                                    var count = m.ForEvery;
                                    var type = m.ForType;
                                    if (type == "Days")
                                    {
                                        var everyd = Convert.ToDouble(count);
                                        tdast = Convert.ToDateTime(dastdt).AddDays(everyd).ToString("dd-MM-yyyy");
                                    }
                                    else if (type == "Week")
                                    {
                                        var everyw = Convert.ToDouble(7 * count);
                                        tdast = Convert.ToDateTime(dastdt).AddDays(everyw).ToString("dd-MM-yyyy");
                                    }
                                    else if (type == "Month")
                                    {
                                        var everym = Convert.ToInt16(count);
                                        tdast = Convert.ToDateTime(dastdt).AddMonths(everym).ToString("dd-MM-yyyy");
                                    }
                                    //ViewBag.HouSchedule=t;
                                    var todaydate = DateTime.Now.ToShortDateString();
                                    var houscheduledast = DateTime.Parse(tdast);
                                    var today = DateTime.Parse(todaydate);
                                    if (today > houscheduledast)
                                    {
                                        sheduleobj.IsDastDue = "Red";
                                        subdast = (today - houscheduledast).TotalDays;
                                        sheduleobj.DastNotification = (subdast - 1).ToString();
                                    }
                                    if (today <= houscheduledast)
                                    {

                                        subdast = (houscheduledast - today).TotalDays;
                                        if (subdast >= 3 && subdast < 7)
                                        {
                                            sheduleobj.IsDastDue = "Green";
                                        }
                                        else if (subdast >= 0 && subdast < 3)
                                        {
                                            sheduleobj.IsDastDue = "Orange";
                                        }
                                        sheduleobj.DastNotification = (subdast + 1).ToString();
                                    }
                                }

                                else
                                {

                                }
                                if (modifydateaudit != null)
                                {
                                    var auditdt = patientdetailobj.Audit.ModifiedDate.Value.ToShortDateString();

                                    var taudit = "";
                                    var count = m.ForEvery;
                                    var type = m.ForType;
                                    if (type == "Days")
                                    {
                                        var everyd = Convert.ToDouble(count);
                                        taudit = Convert.ToDateTime(auditdt).AddDays(everyd).ToString("dd-MM-yyyy");
                                    }
                                    else if (type == "Week")
                                    {
                                        var everyw = Convert.ToDouble(7 * count);
                                        taudit = Convert.ToDateTime(auditdt).AddDays(everyw).ToString("dd-MM-yyyy");
                                    }
                                    else if (type == "Month")
                                    {
                                        var everym = Convert.ToInt16(count);
                                        taudit = Convert.ToDateTime(auditdt).AddMonths(everym).ToString("dd-MM-yyyy");
                                    }
                                    //ViewBag.HouSchedule=t;
                                    var todaydate = DateTime.Now.ToShortDateString();
                                    var houscheduleaudit = DateTime.Parse(taudit);
                                    var today = DateTime.Parse(todaydate);

                                    if (today > houscheduleaudit)
                                    {
                                        sheduleobj.IsAuditDue = "Red";
                                        subaudit = (today - houscheduleaudit).TotalDays;
                                        sheduleobj.AuditNotification = (subaudit - 1).ToString();
                                    }
                                    if (today <= houscheduleaudit)
                                    {
                                        subaudit = (houscheduleaudit - today).TotalDays;
                                        if (subaudit >= 3 && subaudit < 7)
                                        {
                                            sheduleobj.IsAuditDue = "Green";
                                        }
                                        else if (subaudit >= 0 && subaudit < 3)
                                        {
                                            sheduleobj.IsAuditDue = "Orange";
                                        }
                                        sheduleobj.AuditNotification = (subaudit + 1).ToString();
                                    }


                                }

                                else
                                {

                                }
                            }



                            //else if (m.FormName == "Substance Use")
                            //{
                            //    double subaudit=0, subdast=0;

                            //    var modifydateaudit = patientdetailobj.Audit.ModifiedDate;
                            //    var modifydatedast = patientdetailobj.Dast.ModifiedDate;
                            //    if (modifydateaudit != null || modifydatedast != null)
                            //    {
                            //        var auditdt = patientdetailobj.Audit.ModifiedDate.Value.ToShortDateString();
                            //        var dastdt = patientdetailobj.Dast.ModifiedDate.Value.ToShortDateString();

                            //        var taudit = "";
                            //        var tdast = "";
                            //        var count = m.ForEvery;
                            //        var type = m.ForType;
                            //        if (type == "Days")
                            //        {
                            //            var everyd = Convert.ToDouble(count);
                            //            taudit = Convert.ToDateTime(auditdt).AddDays(everyd).ToString("dd-MM-yyyy");
                            //            tdast = Convert.ToDateTime(dastdt).AddDays(everyd).ToString("dd-MM-yyyy");
                            //        }
                            //        else if (type == "Week")
                            //        {
                            //            var everyw = Convert.ToDouble(7 * count);
                            //            taudit = Convert.ToDateTime(auditdt).AddDays(everyw).ToString("dd-MM-yyyy");
                            //            tdast = Convert.ToDateTime(dastdt).AddDays(everyw).ToString("dd-MM-yyyy");
                            //        }
                            //        else if (type == "Month")
                            //        {
                            //            var everym = Convert.ToInt16(count);
                            //            taudit = Convert.ToDateTime(auditdt).AddMonths(everym).ToString("dd-MM-yyyy");
                            //            tdast = Convert.ToDateTime(dastdt).AddMonths(everym).ToString("dd-MM-yyyy");
                            //        }
                            //        //ViewBag.HouSchedule=t;
                            //        var todaydate = DateTime.Now.ToShortDateString();
                            //        var houscheduleaudit = DateTime.Parse(taudit);
                            //        var houscheduledast = DateTime.Parse(tdast);
                            //        var today = DateTime.Parse(todaydate);
                            //        if (today > houscheduleaudit || today > houscheduledast)
                            //        {
                            //            if (today > houscheduleaudit)
                            //            {
                            //                sheduleobj.IsSubstanceUseDue = "Red";
                            //                subaudit = (today - houscheduleaudit).TotalDays;
                            //            }
                            //            if (today > houscheduledast)
                            //            {
                            //                sheduleobj.IsSubstanceUseDue = "Red";
                            //                subdast = (today - houscheduledast).TotalDays;
                            //            }
                            //            if (subaudit > subdast)
                            //            {
                            //                if (subdast == 0)
                            //                {
                            //                    sheduleobj.SubstanceNotification = (subaudit - 1).ToString();
                            //                }
                            //                else
                            //                {
                            //                    sheduleobj.SubstanceNotification = (subdast - 1).ToString();
                            //                }

                            //            }
                            //            else
                            //            {
                            //                if (subaudit == 0)
                            //                {
                            //                    sheduleobj.SubstanceNotification = (subdast - 1).ToString();
                            //                }
                            //                else
                            //                {
                            //                    sheduleobj.SubstanceNotification = (subaudit - 1).ToString();
                            //                }

                            //            }
                            //        }
                            //        else if (today <= houscheduleaudit || today <= houscheduledast)
                            //        {

                            //            if (today <= houscheduleaudit)
                            //            {

                            //                subaudit = (houscheduleaudit - today).TotalDays;
                            //            }
                            //            if (today <= houscheduledast)
                            //            {

                            //                subdast = (houscheduledast - today).TotalDays;
                            //            }
                            //            if (subaudit > subdast)
                            //            {
                            //                if (subdast == 0)
                            //                {
                            //                    sheduleobj.IsSubstanceUseDue = "Orange";
                            //                    sheduleobj.SubstanceNotification = (subaudit + 1).ToString();
                            //                }
                            //                else
                            //                {
                            //                    if(subdast>=3 && subdast<7)
                            //                    {
                            //                        sheduleobj.IsSubstanceUseDue = "Green";
                            //                    }
                            //                    if (subdast >= 1 && subdast < 3)
                            //                    {
                            //                        sheduleobj.IsSubstanceUseDue = "Orange";
                            //                    }
                            //                    sheduleobj.SubstanceNotification = (subdast + 1).ToString();
                            //                }

                            //            }
                            //            else
                            //            {
                            //                if (subaudit == 0)
                            //                {
                            //                    sheduleobj.IsSubstanceUseDue = "Orange";
                            //                    sheduleobj.SubstanceNotification = (subdast + 1).ToString();
                            //                }
                            //                else
                            //                {
                            //                    if (subaudit >= 3 && subaudit < 7)
                            //                    {
                            //                        sheduleobj.IsSubstanceUseDue = "Green";
                            //                    }
                            //                    if (subaudit >= 1 && subaudit < 3)
                            //                    {
                            //                        sheduleobj.IsSubstanceUseDue = "Orange";
                            //                    }
                            //                    sheduleobj.SubstanceNotification = (subaudit + 1).ToString();
                            //                }

                            //            }

                            //        }


                            //    }
                            //    else
                            //    {

                            //    }
                            //}



                            else if (m.FormName == "Mental Health")
                            {
                                var modifydate = patientdetailobj.PatientMentalHealth.ModifiedDate;
                                if (modifydate != null)
                                {
                                    var dt = patientdetailobj.PatientMentalHealth.ModifiedDate.Value.ToShortDateString();

                                    var t = "";
                                    var count = m.ForEvery;
                                    var type = m.ForType;
                                    if (type == "Days")
                                    {
                                        var everyd = Convert.ToDouble(count);
                                        t = Convert.ToDateTime(dt).AddDays(everyd).ToString("dd-MM-yyyy");
                                    }
                                    else if (type == "Week")
                                    {
                                        var everyw = Convert.ToDouble(7 * count);
                                        t = Convert.ToDateTime(dt).AddDays(everyw).ToString("dd-MM-yyyy");
                                    }
                                    else if (type == "Month")
                                    {
                                        var everym = Convert.ToInt16(count);
                                        t = Convert.ToDateTime(dt).AddMonths(everym).ToString("dd-MM-yyyy");
                                    }

                                    var todaydate = DateTime.Now.ToShortDateString();
                                    var houschedule = DateTime.Parse(t);
                                    var today = DateTime.Parse(todaydate);
                                    if (today > houschedule)
                                    {
                                        sheduleobj.IsMentalHealthDue = "Red";
                                        sub = (today - houschedule).TotalDays;
                                        sheduleobj.MentalNotification = (sub - 1).ToString();
                                    }
                                    else if (today <= houschedule)
                                    {

                                        sub = (houschedule - today).TotalDays;
                                        if (sub >= 3 && sub < 7)
                                        {
                                            sheduleobj.IsMentalHealthDue = "Green";
                                        }
                                        else if (sub >= 0 && sub < 3)
                                        {
                                            sheduleobj.IsMentalHealthDue = "Orange";
                                        }
                                        sheduleobj.MentalNotification = (sub + 1).ToString();
                                    }

                                }
                                else
                                {

                                }
                            }

                            else if (m.FormName == "Food Access")
                            {
                                var modifydate = patientdetailobj.PatientFoodAccess.ModifiedDate;
                                if (modifydate != null)
                                {
                                    var dt = patientdetailobj.PatientFoodAccess.ModifiedDate.Value.ToShortDateString();

                                    var t = "";
                                    var count = m.ForEvery;
                                    var type = m.ForType;
                                    if (type == "Days")
                                    {
                                        var everyd = Convert.ToDouble(count);
                                        t = Convert.ToDateTime(dt).AddDays(everyd).ToString("dd-MM-yyyy");
                                    }
                                    else if (type == "Week")
                                    {
                                        var everyw = Convert.ToDouble(7 * count);
                                        t = Convert.ToDateTime(dt).AddDays(everyw).ToString("dd-MM-yyyy");
                                    }
                                    else if (type == "Month")
                                    {
                                        var everym = Convert.ToInt16(count);
                                        t = Convert.ToDateTime(dt).AddMonths(everym).ToString("dd-MM-yyyy");
                                    }

                                    var todaydate = DateTime.Now.ToShortDateString();
                                    var houschedule = DateTime.Parse(t);
                                    var today = DateTime.Parse(todaydate);
                                    if (today > houschedule)
                                    {
                                        sheduleobj.IsFoodAccessDue = "Red";
                                        sub = (today - houschedule).TotalDays;
                                        sheduleobj.FoodNotification = (sub - 1).ToString();
                                    }
                                    else if (today <= houschedule)
                                    {

                                        sub = (houschedule - today).TotalDays;
                                        if (sub >= 3 && sub < 7)
                                        {
                                            sheduleobj.IsFoodAccessDue = "Green";
                                        }
                                        else if (sub >= 0 && sub < 3)
                                        {
                                            sheduleobj.IsFoodAccessDue = "Orange";
                                        }
                                        sheduleobj.FoodNotification = (sub + 1).ToString();
                                    }

                                }
                                else
                                {

                                }
                            }



                        }

                        patientdetailobj.ScheduleDate = sheduleobj;
                        objCommon.BindDBOptions(ref patientdetailobj);
                    }
                    else //web api sent error response 
                    {
                        //log response status here..
                    }
                }
            }
            else
            {

                objCommon.BindSafetyOptions(ref patientdetailobj);
                objCommon.BindEmploymentOptions(ref patientdetailobj);
                objCommon.BindHousingShelterOptions(ref patientdetailobj);
                objCommon.BindEducationOptions(ref patientdetailobj);
                objCommon.BindLegalOptions(ref patientdetailobj);
                objCommon.BindSocialRecreationalOptions(ref patientdetailobj);

            }

            objCommon.BindDropDowns(ref patientdetailobj);

            ViewBag.PatientID = patientId;
            Response.Cookies["patientid"].Value = patientId.ToString();
            Response.Cookies["patientid"].Expires = DateTime.Now.AddDays(1);
            return View(patientdetailobj);
        }

        public ActionResult GetPotientialPatient()
        {
            List<PotientialPatientBO> li = new List<PotientialPatientBO>(); ;
            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri(WebApiKey);
                //HTTP GET
                var responseTask = client.GetAsync("/api/PatientMain/getpotientalpatient");


                responseTask.Wait();

                var result = responseTask.Result;
                if (result.IsSuccessStatusCode)
                {
                    var readTask = result.Content.ReadAsAsync<List<PotientialPatientBO>>();
                    readTask.Wait();

                    li = readTask.Result;
                }
            }
            return View(li);
        }
        //[HttpPost]
        //public ActionResult Index(PatientMainBO request)
        //{

        //    request.CreatedDate = DateTime.Now;
        //    request.IsDeleted = true;

        //    using (var client = new HttpClient())
        //    {
        //        client.BaseAddress = new Uri(WebApiKey);

        //        //HTTP POST
        //        var postTask = client.PostAsJsonAsync<PatientMainBO>("PatientMain/PatientProfile", request);
        //        postTask.Wait();

        //        var result = postTask.Result;
        //        HttpContent content = result.Content;
        //        string myContent = content.ReadAsStringAsync().Result;

        //        if (result.IsSuccessStatusCode)
        //        {
        //            ViewBag.message = "RecordSaved";
        //            ViewBag.PatientID = myContent;

        //        }
        //    }

        //    //ModelState.AddModelError(string.Empty, "Server Error. Please contact administrator.");

        //    return View(request);

        //}

        public ActionResult Appointment()
        {
            return View();
        }

        [HttpPost]
        public string Upload()
        {
            string fileName = "";

            for (int i = 0; i < Request.Files.Count; i++)
            {
                var file = Request.Files[i];
                string guid = Guid.NewGuid().ToString();
                fileName = Path.GetFileName(guid + file.FileName);

                var path = Path.Combine(Server.MapPath("~/Files/"), fileName);
                file.SaveAs(path);
            }

            return fileName;

        }


        //[HttpPost]
        //public ActionResult AddPatientHousingInfo(PatientHousingBO request)

        //{
        //   // request.PatientID = 67;
        //    using (var client = new HttpClient())
        //    {
        //        client.BaseAddress = new Uri(WebApiKey);

        //        //HTTP POST
        //        var postTask = client.PostAsJsonAsync<PatientHousingBO>("PatientMain/PatientHousing", request);
        //        postTask.Wait();

        //        var result = postTask.Result;
        //        if (result.IsSuccessStatusCode)
        //        {
        //            ViewBag.message = "RecordSaved";

        //        }
        //    }

        //    return RedirectToAction("Index");
        //}


        public ActionResult Detail(string PatientID)
        {
            PatientMainBO patientmainobj = new PatientMainBO();
            patientmainobj.PatientID = Convert.ToInt32(PatientID);
            Response.Cookies["patientid"].Value = PatientID;
            Response.Cookies["patientid"].Expires = DateTime.Now.AddDays(1);
            return View(patientmainobj);
        }

        public ActionResult List()
        {
            return View();
        }

        [HttpGet]
        public ActionResult GetAllPatients()
        {

            List<PatientMainBO> patientdetailobj = new List<PatientMainBO>();

            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri(WebApiKey);
                //HTTP GET
                var responseTask = client.GetAsync("/api/PatientMain/GetAllPatient");
                responseTask.Wait();

                var result = responseTask.Result;
                if (result.IsSuccessStatusCode)
                {
                    var readTask = result.Content.ReadAsAsync<List<PatientMainBO>>();
                    readTask.Wait();
                    patientdetailobj = readTask.Result;
                }
                else //web api sent error response 
                {
                    //log response status here..


                }
            }

            return PartialView("~/Views/Shared/Patient/_AllPatient.cshtml", patientdetailobj);

        }



        public ActionResult Authorization()
        {

            List<PatientMainBO> patientdetailobj = new List<PatientMainBO>();
            var model = new AuthorizationBO();
            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri(WebApiKey);
                //HTTP GET
                var responseTask = client.GetAsync("/api/PatientMain/GetAllPatient");
                responseTask.Wait();

                var result = responseTask.Result;
                if (result.IsSuccessStatusCode)
                {
                    var readTask = result.Content.ReadAsAsync<List<PatientMainBO>>();
                    readTask.Wait();
                    patientdetailobj = readTask.Result;
                    var dropdownData = patientdetailobj
                        .Select(d => new SelectListItem
                        {
                            Text = d.FirstName + " " + d.LastName, //Need to apply the correct text field here
                            Value = d.PatientID.ToString() //Need to apply the correct value field here
                        })
                       .ToList();
                    model = new AuthorizationBO
                    {
                        Data = dropdownData
                    };
                }
                else //web api sent error response 
                {
                    //log response status here..


                }
            }
            return View(model);
        }


        public ActionResult AuthorizationData(int PatientID)
        {
            AuthorizationBO authobj = new AuthorizationBO();

            ReleaseAndDisclousureBO ReleaseAndDisclousureobj = new ReleaseAndDisclousureBO();
            CareConnectBO CareConnectobj = new CareConnectBO();
            WholePersonCareBo WholeCare = new WholePersonCareBo();
            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri(WebApiKey);
                //HTTP GET
                var responseTask = client.GetAsync("/api/PatientMain/GetReleaseAndDisclousure?patientid=" + PatientID);
                responseTask.Wait();

                var result = responseTask.Result;
                if (result.IsSuccessStatusCode)
                {
                    var readTask = result.Content.ReadAsAsync<ReleaseAndDisclousureBO>();
                    readTask.Wait();
                    ReleaseAndDisclousureobj = readTask.Result;
                }
                else //web api sent error response 
                {
                    //log response status here..


                }
            }


            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri(WebApiKey);
                //HTTP GET
                var responseTask = client.GetAsync("/api/PatientMain/GetCareConnect?PatientId=" + PatientID);
                responseTask.Wait();

                var result = responseTask.Result;
                if (result.IsSuccessStatusCode)
                {
                    var readTask = result.Content.ReadAsAsync<CareConnectBO>();
                    readTask.Wait();
                    CareConnectobj = readTask.Result;
                }
                else //web api sent error response 
                {
                    //log response status here..


                }
            }

            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri(WebApiKey);
                //HTTP GET
                var responseTask = client.GetAsync("/api/PatientMain/GetWholeCare?PatientId=" + PatientID);
                responseTask.Wait();

                var result = responseTask.Result;
                if (result.IsSuccessStatusCode)
                {
                    var readTask = result.Content.ReadAsAsync<WholePersonCareBo>();
                    readTask.Wait();
                    WholeCare = readTask.Result;
                }
                else //web api sent error response 
                {
                    //log response status here..


                }
            }

            PatientDetailBO patientdetailobj = new PatientDetailBO();


            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri(WebApiKey);
                //HTTP GET
                var responseTask = client.GetAsync("/api/PatientMain/GetDetailOfPatient?patientid=" + PatientID);
                responseTask.Wait();

                var result = responseTask.Result;
                if (result.IsSuccessStatusCode)
                {
                    var readTask = result.Content.ReadAsAsync<PatientDetailBO>();
                    readTask.Wait();
                    patientdetailobj = readTask.Result;

                }
                else //web api sent error response 
                {
                    //log response status here..


                }
            }

            if (WholeCare != null)
            { authobj.WholePersonCare = WholeCare; }
            else if (patientdetailobj.PatientMain != null)
            {
                if (patientdetailobj.PatientMain.DateOfBirth != null)
                {
                    try
                    {
                        authobj.WholePersonCare.DateOfBirth = Convert.ToDateTime(patientdetailobj.PatientMain.DateOfBirth);
                    }
                    catch
                    {
                    }

                }

                authobj.WholePersonCare.PatientName = patientdetailobj.PatientMain.FirstName + " " + patientdetailobj.PatientMain.MiddleName + " " + patientdetailobj.PatientMain.LastName;
                authobj.WholePersonCare.Address = patientdetailobj.PatientMain.Address;
                authobj.WholePersonCare.Address2 = patientdetailobj.PatientMain.City + ", " + patientdetailobj.PatientMain.State + ", " + patientdetailobj.PatientMain.Zip;
                authobj.WholePersonCare.Tel = patientdetailobj.PatientMain.CellPhone;
                authobj.WholePersonCare.PatientID = PatientID;
            }
            if (CareConnectobj != null)
            { authobj.CareConnect = CareConnectobj; }
            else if (patientdetailobj.PatientMain != null)
            {
                if (patientdetailobj.PatientMain.DateOfBirth != null)
                {
                    try
                    {
                        authobj.CareConnect.DateOfBirth = Convert.ToDateTime(patientdetailobj.PatientMain.DateOfBirth);
                    }
                    catch
                    {
                    }

                }

                authobj.CareConnect.PatientName = patientdetailobj.PatientMain.FirstName + " " + patientdetailobj.PatientMain.MiddleName + " " + patientdetailobj.PatientMain.LastName;
                authobj.CareConnect.Address = patientdetailobj.PatientMain.Address;
                authobj.CareConnect.Address2 = patientdetailobj.PatientMain.City + ", " + patientdetailobj.PatientMain.State + ", " + patientdetailobj.PatientMain.Zip;
                authobj.CareConnect.Tel = patientdetailobj.PatientMain.CellPhone;
                authobj.CareConnect.PatientID = PatientID;
            }

            if (ReleaseAndDisclousureobj != null)
            { authobj.ReleaseAndDisclousure = ReleaseAndDisclousureobj; }
            else if (patientdetailobj.PatientMain != null)
            {
                if (patientdetailobj.PatientMain.DateOfBirth != null)
                {
                    try
                    {
                        authobj.ReleaseAndDisclousure.DateOfBirth = Convert.ToDateTime(patientdetailobj.PatientMain.DateOfBirth);
                    }
                    catch
                    {
                    }

                }
                authobj.ReleaseAndDisclousure.PatientID = PatientID;
                authobj.ReleaseAndDisclousure.AuthorizedBy = patientdetailobj.PatientMain.FirstName + " " + patientdetailobj.PatientMain.MiddleName + " " + patientdetailobj.PatientMain.LastName;

            }


            return PartialView("~/Views/Shared/Patient/_AddAuthorization.cshtml", authobj);

        }



        public ActionResult WebGridShowLookUpOption()
        {
            List<LookUpOptionBO> lstlookoption = new List<LookUpOptionBO>();


            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri(WebApiKey);
                //HTTP GET
                var responseTask = client.GetAsync("/api/PatientMain/GetLookUpOption");


                responseTask.Wait();

                var result = responseTask.Result;
                if (result.IsSuccessStatusCode)
                {
                    var readTask = result.Content.ReadAsAsync<List<LookUpOptionBO>>();
                    readTask.Wait();
                    lstlookoption = readTask.Result;


                }
                else //web api sent error response 
                {
                    //log response status here..


                }
            }


            return View(lstlookoption);

        }

        //-----------------lookup code  start--------------------------//

        //public ActionResult ShowLookUpOption()
        //{
        //    List<LookUpOptionBO> lstlookoption = new List<LookUpOptionBO>();


        //    using (var client = new HttpClient())
        //    {
        //        client.BaseAddress = new Uri(WebApiKey);
        //        //HTTP GET
        //        var responseTask = client.GetAsync("/api/PatientMain/GetLookUpOption");


        //        responseTask.Wait();

        //        var result = responseTask.Result;
        //        if (result.IsSuccessStatusCode)
        //        {
        //            var readTask = result.Content.ReadAsAsync<List<LookUpOptionBO>>();
        //            readTask.Wait();
        //            lstlookoption = readTask.Result;


        //        }
        //        else //web api sent error response 
        //        {
        //            //log response status here..


        //        }
        //    }


        //    return View(lstlookoption);
        //}

        //public ActionResult AddLookUpOption()
        //{
        //    return View();
        //}

        //[HttpPost]
        //public ActionResult AddLookUpOption(LookUpFieldOptionBO request)
        //{
        //    request.CreatedDate = DateTime.Now;
        //    request.ModifiedDate = DateTime.Now;
        //    request.IsDeleted = false;

        //    using (var client = new HttpClient())
        //    {
        //        client.BaseAddress = new Uri(WebApiKey);
        //        //HTTP Post
        //        var responseTask = client.PostAsJsonAsync("/api/PatientMain/AddLookUpOptions",request);
        //        responseTask.Wait();

        //        var result = responseTask.Result;
        //        if (result.IsSuccessStatusCode)
        //        {
        //            var readTask = result.Content.ReadAsStringAsync();

        //            if(!string.IsNullOrWhiteSpace(readTask.Result))
        //            {
        //                return RedirectToAction("ShowLookUpOption");
        //            }

        //        }
        //        else //web api sent error response 
        //        {
        //            //log response status here..


        //        }
        //    }

        //    return View();
        //}


        //public ActionResult EditLookUpOption(int id)
        //{
        //    List<LookUpFieldOptionBO> lstoption = new List<LookUpFieldOptionBO>();
        //    LookUpFieldOptionBO lookUpFieldOption = new LookUpFieldOptionBO();

        //    using (var client = new HttpClient())
        //    {
        //        client.BaseAddress = new Uri(WebApiKey);
        //        //HTTP GET
        //        var responseTask = client.GetAsync("/api/PatientMain/GetLookUpFieldOption");
        //        responseTask.Wait();

        //        var result = responseTask.Result;
        //        if (result.IsSuccessStatusCode)
        //        {
        //            var readTask = result.Content.ReadAsAsync<List<LookUpFieldOptionBO>>();
        //            readTask.Wait();
        //            lstoption = readTask.Result;


        //        }
        //        else //web api sent error response 
        //        {
        //            //log response status here..


        //        }
        //    }

        //    lookUpFieldOption = lstoption.Where(o => o.ID == id).FirstOrDefault();
        //    return View(lookUpFieldOption);
        //}


        //[HttpPost]
        //public ActionResult EditLookUpOption(LookUpFieldOptionBO request)
        //{
        //    request.ModifiedDate = DateTime.Now;
        //    request.IsDeleted = false;

        //    using (var client = new HttpClient())
        //    {
        //        client.BaseAddress = new Uri(WebApiKey);
        //        //HTTP Post
        //        var responseTask = client.PostAsJsonAsync("/api/PatientMain/AddLookUpOptions", request);
        //        responseTask.Wait();

        //        var result = responseTask.Result;
        //        if (result.IsSuccessStatusCode)
        //        {
        //            var readTask = result.Content.ReadAsStringAsync();

        //            if (!string.IsNullOrWhiteSpace(readTask.Result))
        //            {
        //                return RedirectToAction("ShowLookUpOption");
        //            }

        //        }
        //        else //web api sent error response 
        //        {
        //            //log response status here..


        //        }
        //    }

        //    return View();
        //}


        //-----------------lookup code  end--------------------------//





        public ActionResult FormScheduling()
        {
            List<FormSchedulingBO> lstformscheduling = new List<FormSchedulingBO>();


            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri(WebApiKey);
                //HTTP GET
                var responseTask = client.GetAsync("/api/PatientMain/GetFormScheduling");


                responseTask.Wait();

                var result = responseTask.Result;
                if (result.IsSuccessStatusCode)
                {
                    var readTask = result.Content.ReadAsAsync<List<FormSchedulingBO>>();
                    readTask.Wait();
                    lstformscheduling = readTask.Result;


                }
                else //web api sent error response 
                {
                    //log response status here..


                }
            }


            return View(lstformscheduling);

        }

        public ActionResult AppointmentSetting()
        {
           // List<TypeOfAppointmentBO> lst = new List<TypeOfAppointmentBO>();
            //AppointmentBO model = new AppointmentBO();
            //using (var client = new HttpClient())
            //{
            //    client.BaseAddress = new Uri(WebApiKey);
            //    //HTTP GET
            //    var responseTask = client.GetAsync("/api/PatientMain/GetSettingsOfAppointment");


            //    responseTask.Wait();

            //    var result = responseTask.Result;
            //    if (result.IsSuccessStatusCode)
            //    {
            //        var readTask = result.Content.ReadAsAsync<AppointmentBO>();
            //        readTask.Wait();
            //        model.Type = readTask.Result.Type;
            //        model.Location = readTask.Result.Location;
            //    }
            //    else //web api sent error response 
            //    {
            //        //log response status here..

            //    }

                
            //}

            return View();
        }


        public ActionResult GetTypeOfAppointments()
        {
            List<TypeOfAppointmentBO> lst = new List<TypeOfAppointmentBO>();
            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri(WebApiKey);
                //HTTP GET
                var responseTask = client.GetAsync("/api/PatientMain/GetTypeOfAppointments");


                responseTask.Wait();

                var result = responseTask.Result;
                if (result.IsSuccessStatusCode)
                {
                    var readTask = result.Content.ReadAsAsync<List<TypeOfAppointmentBO>>();
                    readTask.Wait();
                    lst = readTask.Result;


                }
                else //web api sent error response 
                {
                    //log response status here..

                }

                return PartialView("~/Views/Shared/Patient/_GetTypeOfAppointments.cshtml",lst);
            }
        }
    }
}

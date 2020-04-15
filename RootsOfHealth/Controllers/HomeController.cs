using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.IO;
using System.Data;
using System.Data.OleDb;
using System.Configuration;
using System.Net.Http;
using System.Web.Configuration;
using System.Net.Http.Headers;
using RootsOfHealth.Models;

namespace RootsOfHealth.Controllers
{[Authorize]
    public class HomeController : Controller
    {
        string WebApiKey = WebConfigurationManager.AppSettings["WebApi"];

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }


        [HttpGet]
        public JsonResult GetFormHtml(int Id)
        {
            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri(WebApiKey);
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                var responseTask = client.GetAsync("api/PatientMain/GetCarePlanTemplateByID?ID="+Id);
                responseTask.Wait();
                var result = responseTask.Result;
                if (result.IsSuccessStatusCode)
                {
                    var data = result.Content.ReadAsAsync<CarePlantemplateBO>();
                    if (data.Result != null && data.Result.TemplatePath!=null)
                    {
                        var gethtml = System.IO.File.ReadAllText(Server.MapPath("~/App_Data/" + data.Result.TemplatePath + ".html"));
                        var jsonResult = new
                        {
                            programid=data.Result.ProgramID,
                            html = gethtml,
                            tableName = data.Result.TemplateTable
                        };
                        return Json(jsonResult, JsonRequestBehavior.AllowGet);
                    }
                    else
                    {
                        var jsonResult = new
                        {
                            programid =0,
                            html = "",
                            tableName = ""
                        };
                        return Json(jsonResult, JsonRequestBehavior.AllowGet);
                    }
                }
            };

                    //var gethtml=   System.IO.File.ReadAllText(Server.MapPath("~/App_Data/data.html"));
            return Json("");
        }
        public ActionResult GetCarePlanForm(int Id,int patientid)
        {
            ViewBag.PatientID = patientid;
            ViewBag.TemplateId = Id;
            return View();
        }

    }
}

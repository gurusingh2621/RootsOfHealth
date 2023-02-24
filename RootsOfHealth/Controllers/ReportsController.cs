using RootsOfHealth.CustomFilters;
using RootsOfHealth.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Web;
using System.Web.Configuration;
using System.Web.Mvc;

namespace RootsOfHealth.Controllers
{
    [SessionTimeout]
    public class ReportsController : Controller
    {
        string WebApiKey = WebConfigurationManager.AppSettings["WebApiForBackend"];
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult AddReport(int? id)
        {
            ReportsBO model = new ReportsBO();


            if (id == null || id == 0)
            {
                return PartialView("~/Views/Reports/AddReport.cshtml", model);
            }
            else
            {
                model = GetReport(id);
                return PartialView("~/Views/Reports/AddReport.cshtml", model);
            }
        }
        [HttpPost]
        public JsonResult AddReport(ReportsBO model)
        {
            using (var client = new HttpClient())
            {

                client.BaseAddress = new Uri(WebApiKey);
                var responseTask = client.PostAsJsonAsync("api/PatientMain/AddReport", model);
                responseTask.Wait();

                var result = responseTask.Result;
                if (result.IsSuccessStatusCode)
                {
                    var data = result.Content.ReadAsStringAsync().Result;
                    if (!string.IsNullOrWhiteSpace(data))
                    {
                        ModelState.Clear();
                        return Json(data);

                    }
                    else
                    {
                        return Json("");

                    }
                }
            }
            return Json("");
        }
        public ReportsBO GetReport(int? Id)
        {
            ReportsBO report = new ReportsBO();
            using (var client = new HttpClient())
            {

                client.BaseAddress = new Uri(WebApiKey);
                var responseTask = client.GetAsync("api/PatientMain/GetReportById?Id=" + Id);
                responseTask.Wait();

                var result = responseTask.Result;
                if (result.IsSuccessStatusCode)
                {
                    var readTask = result.Content.ReadAsAsync<ReportsBO>();
                    readTask.Wait();
                    report = readTask.Result;
                }
            }
            return report;
        }
        [HttpPost]
        public ActionResult GetAllReports(int categoryId)
        {
            string draw = Request.Form.GetValues("draw")[0];
            string sortBy = Request.Form.GetValues("order[0][column]")[0];
            string sortDir = Request.Form.GetValues("order[0][dir]")[0];
            int skipRecords = Convert.ToInt32(Request.Form.GetValues("start")[0]);
            int pageSize = Convert.ToInt32(Request.Form.GetValues("length")[0]);
            var searchTerm = Request.Form.GetValues("search[value]").FirstOrDefault();

            List<ReportsInfoBO> categories = new List<ReportsInfoBO>();
            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri(WebApiKey);
                //HTTP GET
                var responseTask = client.GetAsync("/api/PatientMain/GetReportsList?skipRecords=" + skipRecords + "&pageSize=" + pageSize + "&sortby=" + sortBy + "&sortDir=" + sortDir + "&search=" + searchTerm+ "&categoryId="+categoryId);
                responseTask.Wait();

                var result = responseTask.Result;
                if (result.IsSuccessStatusCode)
                {
                    var readTask = result.Content.ReadAsAsync<List<ReportsInfoBO>>();
                    readTask.Wait();
                    categories = readTask.Result;

                }

            }
            var TotalCount = 0;
            if (categories.Count > 0)
            {
                TotalCount = categories[0].TotalCount ?? 0;
            }
            return Json(new
            {
                draw = Convert.ToInt32(draw),
                recordsTotal = TotalCount,
                recordsFiltered = TotalCount,
                data = categories
            });
        }
    }
}
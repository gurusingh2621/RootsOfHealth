using DocumentFormat.OpenXml.EMMA;
using DocumentFormat.OpenXml.ExtendedProperties;
using RootsOfHealth.CustomFilters;
using RootsOfHealth.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.PeerToPeer;
using System.Web;
using System.Web.Configuration;
using System.Web.Mvc;

namespace RootsOfHealth.Controllers
{
    [SessionTimeout]
    public class ReportsCategoryController : Controller
    {
        string WebApiKey = WebConfigurationManager.AppSettings["WebApiForBackend"];
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult AddCategory(int? id)
        {
            ReportCategoryBO model = new ReportCategoryBO();


            if (id == null || id == 0)
            {
                return PartialView("~/Views/ReportsCategory/AddCategory.cshtml", model);
            }
            else
            {
                model = GetCategory(id);
                return PartialView("~/Views/ReportsCategory/AddCategory.cshtml", model);
            }
        }
        [HttpPost]
        public JsonResult AddCategory(ReportCategoryBO model)
        {
            using (var client = new HttpClient())
            {

                client.BaseAddress = new Uri(WebApiKey);
                var responseTask = client.PostAsJsonAsync("api/PatientMain/AddReportsCategory", model);
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
        public ReportCategoryBO GetCategory(int? Id)
        {
            ReportCategoryBO category = new ReportCategoryBO();
            using (var client = new HttpClient())
            {

                client.BaseAddress = new Uri(WebApiKey);
                var responseTask = client.GetAsync("api/PatientMain/GetCategoryById?Id=" + Id);
                responseTask.Wait();

                var result = responseTask.Result;
                if (result.IsSuccessStatusCode)
                {
                    var readTask = result.Content.ReadAsAsync<ReportCategoryBO>();
                    readTask.Wait();
                    category = readTask.Result;
                }
            }
            return category;
        }
        [HttpPost]
        public ActionResult GetAllCategories()
        {
            string draw = Request.Form.GetValues("draw")[0];
            string sortBy = Request.Form.GetValues("order[0][column]")[0];
            string sortDir = Request.Form.GetValues("order[0][dir]")[0];
            int skipRecords = Convert.ToInt32(Request.Form.GetValues("start")[0]);
            int pageSize = Convert.ToInt32(Request.Form.GetValues("length")[0]);
            var searchTerm = Request.Form.GetValues("search[value]").FirstOrDefault();

            List<ReportCategoriesInfoBO> categories = new List<ReportCategoriesInfoBO>();
            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri(WebApiKey);
                //HTTP GET
                var responseTask = client.GetAsync("/api/PatientMain/CategoriesList?skipRecords=" + skipRecords + "&pageSize=" + pageSize + "&sortby=" + sortBy + "&sortDir=" + sortDir + "&search=" + searchTerm);
                responseTask.Wait();

                var result = responseTask.Result;
                if (result.IsSuccessStatusCode)
                {
                    var readTask = result.Content.ReadAsAsync<List<ReportCategoriesInfoBO>>();
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
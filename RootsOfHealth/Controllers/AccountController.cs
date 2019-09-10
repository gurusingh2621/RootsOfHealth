using RootsOfHealth.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Security.Cryptography;
using System.Text;
using System.Web;
using System.Web.Configuration;
using System.Web.Mvc;
using System.Web.Security;

namespace RootsOfHealth.Controllers
{
    [Authorize]
    public class AccountController : Controller
    {
        string WebApiKey = WebConfigurationManager.AppSettings["WebApi"];
        // GET: Account
       
        public ActionResult Index()
        {
            UserBO Users = new UserBO();
            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri(WebApiKey);
                //HTTP GET
                var responseTask = client.GetAsync("/api/PatientMain/userslist");
                responseTask.Wait();

                var result = responseTask.Result;
                if (result.IsSuccessStatusCode)
                {
                    var readTask = result.Content.ReadAsAsync<List<UserBO>>();
                    readTask.Wait();
                    Users.UserList = readTask.Result;
                    
                }
                
            }

            return  View(Users);
        }
        
        [AllowAnonymous]
        public ActionResult Login()
        {

            return View();
        }
        [AllowAnonymous]
        [HttpPost]
        public ActionResult Login(UserBO model, string returnUrl)
        {

            if (!string.IsNullOrWhiteSpace(model.UserName) || !string.IsNullOrWhiteSpace(model.Password))
            {


                using (var client = new HttpClient())
                {
                    client.BaseAddress = new Uri(WebApiKey);
                    client.DefaultRequestHeaders.Accept.Clear();
                    client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                    var responseTask = client.PostAsJsonAsync("api/PatientMain/validateuser", model);
                    responseTask.Wait();

                    var result = responseTask.Result;
                    if (result.IsSuccessStatusCode)
                    {
                        var data = result.Content.ReadAsStringAsync().Result;
                        if (data == "1")
                        {
                            FormsAuthentication.SetAuthCookie(model.UserName, false);
                           

                            var ResponseTask = client.GetAsync("/api/PatientMain/getuserbyusername?username=" + model.UserName);
                            ResponseTask.Wait();
                            UserBO user = new UserBO();
                            var Result = ResponseTask.Result;
                            if (Result.IsSuccessStatusCode)
                            {
                                var readTask = Result.Content.ReadAsAsync<UserBO>();
                                readTask.Wait();
                                user = readTask.Result;
                                Session["userid"] = user.UserID;
                                
                                if (Request.Cookies["userimage"] == null)
                                {
                                    Response.Cookies["userimage"].Value = user.Image;
                                }
                                GetRolePermission(Convert.ToInt32(user.RoleID));
                            }
                            
                            if (Url.IsLocalUrl(returnUrl) && returnUrl.Length > 1 && returnUrl.StartsWith("/")
                                && !returnUrl.StartsWith("//") && !returnUrl.StartsWith("/\\"))
                            {
                                return Redirect(returnUrl);
                            }
                            else
                            {
                                return RedirectToAction("Index", "DashBoard");
                            }

                        }
                        else
                        {
                            ModelState.AddModelError("", "The user name or password provided is incorrect.");
                        }
                    }
                }


            }
            else
            {
                ModelState.AddModelError("", "please enter valid username/password.");
            }
            return View();
        }

       void GetRolePermission(int roleid)
        {
            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri(WebApiKey);
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                var responseTask = client.GetAsync("api/PatientMain/getrolepermissionbyRoleid?roleid=" + roleid);
                responseTask.Wait();

                var result = responseTask.Result;
                if (result.IsSuccessStatusCode)
                {
                    var readTask = result.Content.ReadAsAsync<List<PermissionModel>>();
                    readTask.Wait();
                    Session["permissions"]= readTask.Result;
                  
                }
            }
                }
        public ActionResult Logout()
        {
            Session.Clear();
            Session.Abandon();
            FormsAuthentication.SignOut();
            if (Request.Cookies["userimage"] != null)
            {
                Response.Cookies["userimage"].Expires = DateTime.Now.AddDays(-1);
            }
            return RedirectToAction("Login");
        }
        public ActionResult EditUserDetails(string username)
        {
            UserBO user = new UserBO();

            using (var client = new System.Net.Http.HttpClient())
            {
                client.BaseAddress = new Uri(WebApiKey);

                var responseTask = client.GetAsync("/api/PatientMain/getuserbyusername?username=" + username);
                responseTask.Wait();

                var result = responseTask.Result;
                if (result.IsSuccessStatusCode)
                {
                    var readTask = result.Content.ReadAsAsync<UserBO>();
                    readTask.Wait();
                    user = readTask.Result;

                }
            }


            return View(user);
        }
        public  ActionResult UserDetails(string username)
        {
            UserBO user = new UserBO();
         
                using (var client = new System.Net.Http.HttpClient())
                {
                    client.BaseAddress = new Uri(WebApiKey);

                    var responseTask = client.GetAsync("/api/PatientMain/getuserbyusername?username=" + username);
                    responseTask.Wait();

                    var result = responseTask.Result;
                    if (result.IsSuccessStatusCode)
                    {
                        var readTask = result.Content.ReadAsAsync<UserBO>();
                        readTask.Wait();
                        user = readTask.Result;
                       
                    }
                }
            

                return View(user);
        }

        public ActionResult AddUser()
        {
           

            return View();
        }
        [HttpPost]
        public JsonResult AddUser(UserBO model)
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
            using (var client = new HttpClient())
            {
                //var file = model.ImageFile;
                //byte[] bytes=null;
                //if (file != null)
                //{
                   
                //    using (BinaryReader br = new BinaryReader(file.InputStream))
                //    {
                //        bytes = br.ReadBytes(file.ContentLength);
                //    }
                //}
                 model.Image = fileName;
                    client.BaseAddress = new Uri(WebApiKey);
                //client.DefaultRequestHeaders.Accept.Clear();
                //client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                var responseTask = client.PostAsJsonAsync("api/PatientMain/adduser", model);
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
        [HttpPost]
        public JsonResult Upload()
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

            return Json(fileName);

        }

        [HttpGet]
        public ActionResult Roles()
        {
           List<UserRolesBO> UserRoles = new List<UserRolesBO>();
            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri(WebApiKey);
                //HTTP GET
                var responseTask = client.GetAsync("/api/PatientMain/roleslist");
                responseTask.Wait();

                var result = responseTask.Result;
                if (result.IsSuccessStatusCode)
                {
                    var readTask = result.Content.ReadAsAsync<List<UserRolesBO>>();
                    readTask.Wait();
                    UserRoles = readTask.Result;

                }

            }

            return View(UserRoles);

        }
        [HttpGet]
        public ActionResult UpdateRolesList()
        {
            List<UserRolesBO> UserRoles = new List<UserRolesBO>();
            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri(WebApiKey);
                //HTTP GET
                var responseTask = client.GetAsync("/api/PatientMain/roleslist");
                responseTask.Wait();

                var result = responseTask.Result;
                if (result.IsSuccessStatusCode)
                {
                    var readTask = result.Content.ReadAsAsync<List<UserRolesBO>>();
                    readTask.Wait();
                    UserRoles = readTask.Result;

                }

            }
            return PartialView("~/Views/Shared/Account/_RoleList.cshtml", UserRoles);
        }
        [HttpGet]
        public ActionResult EditRole(int roleid)
        {
          UserRolesBO UserRoles = new UserRolesBO();
            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri(WebApiKey);
                //HTTP GET
                var responseTask = client.GetAsync("/api/PatientMain/getrolebyid?roleid="+roleid);
                responseTask.Wait();

                var result = responseTask.Result;
                if (result.IsSuccessStatusCode)
                {
                    var readTask = result.Content.ReadAsAsync<UserRolesBO>();
                    readTask.Wait();
                    UserRoles = readTask.Result;

                }

            }
            return Json(UserRoles);
            //return PartialView("~/Views/Shared/Account/_EditRole.cshtml", UserRoles);

        }
        [HttpGet]
        public ActionResult Settings()
        {
            return View();
        }
    }
}
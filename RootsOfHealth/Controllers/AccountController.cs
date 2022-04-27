﻿using RootsOfHealth.Models;
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
        string WebApiKey = WebConfigurationManager.AppSettings["WebApiForBackend"];
        // GET: Account
       
        public ActionResult Index()
        {
            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri(WebApiKey);
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                var responseTask = client.GetAsync("api/PatientMain/getuserroles?userid=" + @Session["userid"].ToString());
                responseTask.Wait();
                var result = responseTask.Result;
                if (result.IsSuccessStatusCode)
                {
                    var data = result.Content.ReadAsAsync<string>();
                    data.Wait();
                    var res = data.Result;
                    @Session["IsCarePlanApprover"] = res.Contains("Careplan Approval");
                    Session["Roles"] = res;
                }
            };
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
        public ActionResult CheckLogin(string UserName, string Password)
        {
            UserBO model = new UserBO();
            model.UserName = UserName;
            model.Password = Password;
                using (var client = new HttpClient())
                {
                    client.BaseAddress = new Uri(WebApiKey);
                    client.DefaultRequestHeaders.Accept.Clear();
                    client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                    var responseTask = client.PostAsJsonAsync("/api/PatientMain/validateuser", model);
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
                                Session["ClinicID"] = user.ClinicID;
                                Session["UserName"] = user.UserName;
                                Session["Roles"] = user.Roles;
                                Session["RoleId"] = user.RoleID;
                                Session["IsCarePlanApprover"] = user.isCarePlanApprover.HasValue ? user.isCarePlanApprover.Value : false;
                                string usernameChars = string.IsNullOrWhiteSpace(user.FirstName) ?"" : user.FirstName[0].ToString();
                                usernameChars+= string.IsNullOrWhiteSpace(user.LastName) ? "" : user.LastName[0].ToString();
                                Session["OutcomeAddedBy"] = usernameChars;
                                if (Request.Cookies["userimage"] == null)
                                {
                                    Response.Cookies["userimage"].Value = user.Image;
                                }
                                GetRolePermission(Convert.ToInt32(user.RoleID));
                            }
                            return Json("LoggedIn");                          
                        }
                        else
                        {
                            return Json("The user name or password provided is incorrect.");
                        }
                    }
                }
            
            return Json("");
        }

       void GetRolePermission(int roleid)
        {
            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri(WebApiKey);
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                var responseTask = client.GetAsync("api/PatientMain/getrolepermissionbyUserid?userId=" + roleid);
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
        public ActionResult GetRolePermissionsByRoleId(int? roleId)
        {
            List<RolePermissionsBO> permissionModel = new List<RolePermissionsBO>();
            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri(WebApiKey);
                //HTTP GET
                var responseTask = client.GetAsync("/api/PatientMain/getrolepermissionbyRoleid?roleid="+ roleId);
                responseTask.Wait();

                var result = responseTask.Result;
                if (result.IsSuccessStatusCode)
                {
                    var readTask = result.Content.ReadAsAsync<List<RolePermissionsBO>>();
                    readTask.Wait();
                    permissionModel = readTask.Result;
                    

                }

            }
            return PartialView("~/Views/Shared/Role/_RolePermissionsList.cshtml", permissionModel);
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
        [HttpGet]
        public ActionResult UserGroupList()
        {

            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri(WebApiKey);
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                var responseTask = client.GetAsync("api/PatientMain/isusercareplanapproval?userid=" + @Session["userid"].ToString());
                responseTask.Wait();
                var result = responseTask.Result;
                if (result.IsSuccessStatusCode)
                {
                    var data = result.Content.ReadAsAsync<bool>();
                    data.Wait();
                    var res = data.Result;
                    @Session["IsCarePlanApprover"] = res;
                }
            };

            return View();
        }
        [HttpGet]
        public ActionResult AddGroup()
        {
            return PartialView("~/Views/Shared/Account/_AddGroup.cshtml");
        }

      
    }
   
}

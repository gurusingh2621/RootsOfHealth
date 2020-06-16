﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace RootsOfHealth
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");
            routes.MapRoute(
                   name: "CarePlan",
                   url: "{controller}/{action}/{TemplateID}/{TemplateName}/{ProgramID}/{IsModify}",
                   defaults: new { controller = "Home2", action = "Index" }
            );
            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "DashBoard", action = "Display", id = UrlParameter.Optional }
            );
        }
    }
}

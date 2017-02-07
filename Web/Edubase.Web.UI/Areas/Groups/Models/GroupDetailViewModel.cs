﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Edubase.Web.UI.Areas.Groups.Models
{
    using Common;
    using Services.Groups.Models;
    using Services.Establishments.Models;
    using GT = Services.Enums.eLookupGroupType;
    using Services.Governors.Models;
    using Data.Entity;
    using System.Configuration;

    public class GroupDetailViewModel
    {
        public bool CanUserEdit { get; set; }
        public bool IsUserLoggedOn { get; set; }
        public GroupModel Group { get; set; }
        public string Address { get; set; }
        public string GroupTypeName { get; set; }
        public string GroupStatusName { get; set; }
        public string LocalAuthorityName { get; set; }
        public string OpenDateLabel => Group.GroupTypeId.OneOfThese(GT.MultiacademyTrust, GT.SingleacademyTrust) ? "Incorporated on" : "Open date";
        public string EstablishmentsPluralName => Group.GroupTypeId.OneOfThese(GT.MultiacademyTrust, GT.SingleacademyTrust, GT.SchoolSponsor) ? "Academies" : "Providers";
        public List<EstablishmentGroupViewModel> Establishments { get; private set; } = new List<EstablishmentGroupViewModel>();
        public IEnumerable<Governor> Governors { get; internal set; }
        public IEnumerable<Governor> HistoricalGovernors { get; internal set; }

        public string CompaniesHouseUrl => ConfigurationManager.AppSettings["CompaniesHouseBaseUrl"].Append(Group.CompaniesHouseNumber);
    }
}
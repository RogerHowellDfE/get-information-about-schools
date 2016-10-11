﻿using Edubase.Data.Entity;
using Edubase.Services.Domain;
using System.Linq;
using System.Data;
using System.Data.Entity;
using Edubase.Common;
using System.Security.Claims;
using Edubase.Data.Identity;
using System;
using System.Security;

namespace Edubase.Services
{
    public class ApprovalService
    {
        public ApprovalDto GetAll(ClaimsPrincipal currentUser, int skip = 0, int take = 10, int? establishmentUrn = null)
        {
            var retVal = new ApprovalDto(skip, take);
            Verify(currentUser);
            
            using (var dc = new ApplicationDbContext())
            {
                var query = CreateQuery(dc, currentUser, establishmentUrn);
                
                if (establishmentUrn.HasValue)
                {
                    retVal.EstablishmentUrn = establishmentUrn;
                    retVal.EstablishmentName = dc.Establishments.First(x => x.Urn == establishmentUrn).Name;
                }

                retVal.Count = query.Count();

                query = query.OrderBy(x => x.CreatedUtc).Skip(skip).Take(take);

                retVal.Items = query.Select(x => new ApprovalItemDto
                {
                    DateOfChange = x.CreatedUtc,
                    EstablishmentName = x.Establishment.Name,
                    EstablishmentUrn = x.Urn,
                    Id = x.Id,
                    OldValue = x.OldValue,
                    NewValue = x.NewValue,
                    UpdatedFieldName = x.Name,
                    OriginatorName = x.OriginatorUser.UserName
                }).ToList();

                var svc = new LookupService();
                foreach (var item in retVal.Items)
                {
                    if (svc.IsLookupField(item.UpdatedFieldName))
                    {
                        if (item.NewValue.IsInteger()) item.NewValue = svc.GetName(item.UpdatedFieldName, item.NewValue.ToInteger().Value);
                        if (item.OldValue.IsInteger()) item.OldValue = svc.GetName(item.UpdatedFieldName, item.OldValue.ToInteger().Value);
                    }
                }
            }
            return retVal;
        }

        public int Count(ClaimsPrincipal currentUser, int? establishmentUrn = null)
        {
            Verify(currentUser);
            using (var dc = new ApplicationDbContext())
            {
                var query = CreateQuery(dc, currentUser, establishmentUrn);
                return query.Count();   
            }
        }

        public bool Any(ClaimsPrincipal currentUser, int? establishmentUrn = null)
        {
            Verify(currentUser);
            using (var dc = new ApplicationDbContext())
            {
                var query = CreateQuery(dc, currentUser, establishmentUrn);
                return query.Any();
            }
        }

        private static void Verify(ClaimsPrincipal currentUser)
        {
            if (currentUser == null) throw new ArgumentNullException(nameof(currentUser));
            if (!currentUser.Identity.IsAuthenticated)
                throw new SecurityException("Permission denied");
        }

        private IQueryable<EstablishmentApprovalQueue> CreateQuery(ApplicationDbContext dc, ClaimsPrincipal currentUser, int? establishmentUrn = null)
        {
            var q = dc.EstablishmentApprovalQueue.AsQueryable();

            if (!currentUser.IsInRole(Roles.Admin))
            {
                var roleName = Roles.RestrictiveRoles.FirstOrDefault(x => currentUser.IsInRole(x));
                if (roleName == null) throw new SecurityException("The current user is not in a restrictive role or admin role; cannot determine permissions for this operation");
                q = q.Join(dc.Permissions, eaq => new { PropertyName = eaq.Name, RoleName = roleName, AllowApproval = true }, p => new { p.PropertyName, p.RoleName, p.AllowApproval }, (x, y) => x);
            }

            q = q.Include(x => x.Establishment.Name)
                .Include(x => x.OriginatorUser.UserName)
                .AsQueryable()
                .Where(x => x.IsDeleted == false && (establishmentUrn == null || x.Urn == establishmentUrn) && x.IsApproved == false);

            return q;
        }

        

    }
}

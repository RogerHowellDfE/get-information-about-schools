using System.Collections.Generic;
using System.Linq;
using Edubase.Data.Entity;

namespace Edubase.Web.UI.Models.Notifications
{
    public class NotificationsBannerAuditViewModel
    {
        public IEnumerable<NotificationBanner> Banners { get; }

        public NotificationsBannerAuditViewModel(IEnumerable<NotificationBanner> items)
        {
            Banners = items.OrderBy(x => x.Version).ThenBy(x => x.AuditTimestamp).GroupBy(x => x.Tracker).SelectMany(g => g);
        }
    }
}

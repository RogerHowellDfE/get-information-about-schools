using Newtonsoft.Json;
using System;

namespace Edubase.Services.Establishments.Models
{
    public class EstablishmentSearchResultModel : EstablishmentModel
    {
        public string PredecessorName { get; set; }
        public string PredecessorUrn { get; set; }
        public string FullAddress { get; set; }
        public string StatusLabel { get; set; }

        public string LaEstabValue { get; set; }
        public string TypeLabel { get; set; }
        public string PhaseLabel { get; set; }
        public string LaName { get; set; }

        [JsonProperty("nextActionRequiredByWEL")]
        public DateTime? NextActionRequiredByWEL { get; set; }

        [JsonProperty("nextGeneralActionRequired")]
        public DateTime? NextGeneralActionRequired { get; set; }
    }
}

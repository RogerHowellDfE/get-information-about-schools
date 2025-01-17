using System;
using System.Configuration;
using System.Net;
using System.Net.Http;
using System.Runtime.Caching;
using System.Threading.Tasks;
using Edubase.Common;
using Polly;

namespace Edubase.Services.ExternalLookup
{
    public enum FbType
    {
        School,
        Federation,
        Trust
    }

    public class FBService : IFBService
    {
        private static HttpClient _client;
        private static string urlBaseAddress;
        private static string apiBaseAddress;

        private static readonly Policy RetryPolicy = Policy.TimeoutAsync(1).Wrap(Policy
            .Handle<HttpRequestException>()
            .WaitAndRetryAsync(new[]
            {
                TimeSpan.FromSeconds(1)
            }));

        public FBService(HttpClient client, string baseAddress = "FinancialBenchmarkingApiURL", int timeOut = 10)
        {
            apiBaseAddress = baseAddress == "FinancialBenchmarkingApiURL" ? ConfigurationManager.AppSettings[baseAddress] : baseAddress;
            urlBaseAddress = baseAddress == "FinancialBenchmarkingApiURL" ? ConfigurationManager.AppSettings["FinancialBenchmarkingURL"] : baseAddress;

            _client = new HttpClient
            {
                BaseAddress = new Uri(apiBaseAddress),
                Timeout = TimeSpan.FromSeconds(timeOut)
            };
        }

        public string PublicURL(int? lookupId, FbType lookupType)
        {
            return $"{urlBaseAddress}{PublicUrlPath(lookupId, lookupType)}";
        }

        private string PublicUrlPath(int? lookupId, FbType lookupType)
        {
            var url = $"school/detail?urn={lookupId}";
            switch (lookupType)
            {
                case FbType.Trust:
                    url = $"Trust?companyNo={lookupId}";
                    break;
                case FbType.Federation:
                    url = $"federation?fuid={lookupId}";
                    break;
            }

            return url;
        }

        public string ApiUrl(int? lookupId, FbType lookupType)
        {
            return $"{apiBaseAddress}{ApiUrlPath(lookupId, lookupType)}";
        }

        private string ApiUrlPath(int? lookupId, FbType lookupType)
        {
            var url = $"api/schoolstatus/{lookupId}";
            switch (lookupType)
            {
                case FbType.Trust:
                    url = $"api/truststatus/{lookupId}";
                    break;
                case FbType.Federation:
                    url = $"api/federationstatus/{lookupId}";
                    break;
            }

            return url;
        }

        private HttpRequestMessage HeadRestRequest(int? lookupId, FbType lookupType)
        {
            return new HttpRequestMessage(HttpMethod.Get, ApiUrl(lookupId, lookupType));
        }

        public async Task<bool> CheckExists(int? lookupId, FbType lookupType)
        {
            var key = $"sfb-{lookupType.ToString()}-{lookupId}";
            var value = MemoryCache.Default.Get(key);
            if (value != null)
            {
                return (bool) value;
            }
            else
            {
                var cacheTime = ConfigurationManager.AppSettings["FinancialBenchmarkingCacheHours"].ToInteger() ?? 8;
                var request = HeadRestRequest(lookupId, lookupType);

                try
                {
                    using (var response = await RetryPolicy.ExecuteAsync(async () => await _client.SendAsync(request, HttpCompletionOption.ResponseHeadersRead)))
                    {
                        var isOk = response.StatusCode == HttpStatusCode.OK;
                        MemoryCache.Default.Set(new CacheItem(key, isOk), new CacheItemPolicy { AbsoluteExpiration = DateTimeOffset.Now.AddHours(cacheTime) });
                        return isOk;
                    }
                }
                catch
                {
                    return false;
                }
            }
        }
    }
}

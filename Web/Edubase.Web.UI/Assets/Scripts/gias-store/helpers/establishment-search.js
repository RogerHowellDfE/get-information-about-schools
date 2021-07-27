import axios from "axios";

const fetchData = async (token) => {
  const response = await axios.get(`/Establishments/Search/estab-results-json?tok=${token}`);
  return {
    token: token,
    data: response.data,
    count: response.headers['x-count']
  };
}


export const serialize = async (obj) => {
  const out = [];
   for (const p in obj)
    if (obj.hasOwnProperty(p)) {
      if (Array.isArray(obj[p])) {
        for (let i = 0, len = obj[p].length; i< len; i++) {
          out.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p][i]));
        }
      }
      else {
        out.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
      }
    }
  return out.join('&');
};


export const getEstablishmentResults = async (params) => {
  const getToken = async () => {
    const response = await axios.post('/api/tokenize', params);
    return await response.data.token;
  };

  try {
    return await getToken().then((tok) => fetchData(tok));

  } catch (error) {
    throw new Error('there was a problem retrieving establishment results')
  }
};

export const getResultsWithToken = async (tok) => {
  try {
    return await fetchData(tok);

  } catch (error) {
    throw new Error('there was a problem retrieving results with the token')
  }
};


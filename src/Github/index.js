import sub from 'date-fns/sub';
import format from 'date-fns/format';
import axios from 'axios';

export const fetchRepos = (page = 0) =>{
    let result = sub(new Date(), { days: 30 })
    result = format(result, 'yyyy-MM-dd')
    let API_URL = `https://api.github.com/search/repositories?q=created:>${result}&sort=stars&order=desc&page=${page}
    `;
    return axios
    .get(API_URL)
    .then(repos => {
        const repositories = repos.data.items;
        return repositories
    })

}


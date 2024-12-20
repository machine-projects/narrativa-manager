export class BaseService {

    get({ url, headers, allowCache }) {
        const options = {
            method: 'GET',
            headers: headers,
            cache: 'no-store'
        };

        if (allowCache) {
            options.cache = 'no-store';
        }

        fetch(url, options).then((response) => {
            response.json().then((data) => {
                return data;
            });
        });
    }
}

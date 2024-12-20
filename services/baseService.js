export class BaseService {
    static get({ url, headers, allowCache }) {
        const options = {
            method: 'GET',
            headers: headers,
            cache: 'no-store'
        };

        if (allowCache) {
            options.cache = 'no-store';
        }

        return fetch(url, options).then((response) => {
            return response.json();
        });
    }

    static post(url, headers, body) {
        const options = {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(body)
        };
    
        return fetch(url, options).then(async (response) => {
            const jsonResponse = await response.json();
            return {
                statusCode: response.status,
                data: jsonResponse
            };
        });
    }
}
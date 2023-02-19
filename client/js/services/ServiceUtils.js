const toURL = (url) => {
    if(!(url instanceof URL))
        return new URL(url, location);
    return url;
};

export const getJSON = async (url) => {
    const response = await fetch(toURL(url), {headers:{"content-type": "application/json"}});
    return response.json();
};

export const postJSON = async (url, data) => {
    const response = await fetch(toURL(url), {method: "post" ,headers:{"content-type": "application/json"}, body: JSON.stringify(data)});
    if(response.status < 204)
        return response.json();
};

export const deleteJSON = async (url) => {
    await fetch(toURL(url), {method: "delete", headers:{"content-type": "application/json"}});
};
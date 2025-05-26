import httpClient from "./httpClient";


export const fetchAllCurrentAffairs = async ()=>{
    const response = await httpClient.get('/api/current-affairs')
    return response.data;
}

export const fetchCurrentAffairsById = async ()=>{
    const response = await httpClient.get(`/api/currenct-affairs/${id}`)
    return response.data;
}
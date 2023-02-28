import {getJSON, postJSON, deleteJSON} from "./ServiceUtils.js";

const ENDPOINT = `/api/teams`;

const CACHE = new Map();


export const getTeams = async () => {
    const teams = await getJSON(ENDPOINT);
    for(let team of teams)
        CACHE.set(team.id, team);

    return teams;
};

export const getTeam = async (id) => {
    if(CACHE.has(id))
        return CACHE.get(id);

    const team = await getJSON(`${ENDPOINT}/${id}`);
    CACHE.set(team.id, team);

    return team;
};

export const storeTeam = async (team) => {
    team = await postJSON(`${ENDPOINT}`, team );
    CACHE.set(team.id, team);

    return team;
};

export const deleteTeam = async (id) => {
    await deleteJSON(`${ENDPOINT}/${id}`);    
    CACHE.delete(id);
};
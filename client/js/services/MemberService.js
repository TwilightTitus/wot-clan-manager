import {getJSON, postJSON, deleteJSON} from "./ServiceUtils.js";
import { member } from "./LoginService.js";

const ENDPOINT = `/api/members`;

const CACHE = new Map();

export const currentMember = async () => {
    return member();
};

export const getMembers = async () => {
    let members = null
    if(CACHE.size == 0){
        members = await getJSON(ENDPOINT);
        for(const member of members)
            CACHE.set(member.id, member);
    }
    else 
        members = cache.values()

    console.log({members});

    return members;
};

export const getMember = async (id) => {
    if(CACHE.has(id))
        return CACHE.get(id);

    const member = await getJSON(`${ENDPOINT}/${id}`);
    
    console.log({member});
    if(member)
        CACHE.set(member.id, member);

    return member;
}

export const SORTING_ASC = "asc";
export const SORTING_DESC = "desc";

class Filter {
    #page;
    #size;
    #sortBy;
    #sorting;
    #sql

    constructor({page = 1, size = 10, sortBy = [], sorting = SORTING_ASC}){
        this.#page = page;
        this.#size = size;
        this.#sortBy = sortBy;
        this.#sorting = sorting;
        this.#sql = `ORDER BY ${this.#sortBy.join(", ")} ${this.#sorting} LIMIT ${this.#size} OFFSET ${(this.#page - 1) * this.#size}`;
    }

    get page(){
        return this.#page;
    }

    get size(){
        return this.#size;
    }

    get sortBy(){
        return this.#sortBy;
    }

    get sorting(){
        return this.#sorting;
    }

    get sql(){
        return this.#sql;
    }
}

export default Filter;
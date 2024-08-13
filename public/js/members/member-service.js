async function getData() {
    const url = "http://localhost:8000/member";
    let response = {};
    try {
        response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();
        //console.log(json);
        return json;

    } catch (error) {
        console.error(error);
        return error;
    }
}


async function deleteMember(id,tb) {
    console.log(`Delete member with id: ${id}`);
    let request = new Request("http://localhost:8000/member/" + id, {
        method: "DELETE"
    });
    let response = await fetch(request);
    let result = await response.json();
    console.log(result);
    
    return result;

}

async function addMember(member) {
    let request = new Request("http://localhost:8000/member", {
        method: "POST",
        body: JSON.stringify(member),
    });

    let response = await fetch(request);
    let result = await response.json();
    //console.log(result);

    return result;

}

const memberService = {
    add: addMember,
    delete: deleteMember,
    getlist: getData
};

export default memberService;
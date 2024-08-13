import { Members } from "./members/index.js";

import { helloMyJs } from "./myjs.js";


let tbodyMembers = document.getElementById('tbodyMembers');

function renderTable() {
    let members = Members.data;
    tbodyMembers.innerHTML = "";

    for (let idx = 0; idx < members.length; idx++) {
        let tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${members[idx].id}</td>
            <td>${members[idx].firstName}</td>
            <td>${members[idx].lastName}</td>
            <td>${members[idx].email}</td>
            <td>${members[idx].zipcode}</td>
            <td><button id="btnDel${members[idx].id}" type="button" class="btn btn-danger">Del</button></td>
        `;
        let btnDel = tr.querySelector(`#btnDel${members[idx].id}`);
        btnDel.addEventListener('click', async function(){
            console.log(`Delete member with id: ${members[idx].id}`);
            await Members.service.delete(members[idx].id);
            Members.data = await Members.service.getlist();
            renderTable();
        });
        tbodyMembers.appendChild(tr);  
    }

   

}
async function reloadTable(){
    Members.data = await Members.service.getlist();
    renderTable();
}
    
async function main(){

    helloMyJs();
    reloadTable();

    Members.form.buttonAdd.addEventListener('click', async function(){
        console.log(Members.form.getData());
        let _member = Members.form.getData();
        Members.service.add(_member);
        Members.data = await Members.service.getlist();
        renderTable();
    });

    Members.form.buttonGetAll.addEventListener('click', async function(){
        Members.data = await Members.service.getlist();
        renderTable();
    });



};

main();


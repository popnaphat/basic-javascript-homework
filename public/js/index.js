import { Members } from "./members/index.js";

//import { helloMyJs } from "./myjs.js";
//let thaiProvinceData = null;
async function getData() {
    const url =
      'https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_province_with_amphure_tambon.json';
  
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const json = await response.json();
      return json;
    } catch (error) {
      console.error(error.message);
    }
  }

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

    //helloMyJs();
    reloadTable();

    Members.form.buttonAdd.addEventListener('click', async function(){
        //console.log(Members.form.getData());
        let _member = Members.form.getData();
        Members.service.add(_member);
        reloadTable();
    });

    Members.form.buttonGetAll.addEventListener('click', async function(){
        reloadTable();
    });

   let selectedZipCode;
    document.getElementById('btnShowData').addEventListener('click', (event) => {
      event.preventDefault(); 
      
        const provinceSelect = document.getElementById('province');
        const amphureSelect = document.getElementById('amphure');
        const tambonSelect = document.getElementById('tambon');
        const zipCodeDisplay = document.getElementById('zip-code');
        let provinceData = null;

        async function fetchData() {
            try {
              provinceData = await getData();
              populateProvinces();
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        function populateProvinces() {
            provinceData.forEach(province => {
                let option = document.createElement('option');
                option.value = province.id;
                
                option.textContent = province.name_th;
                
                provinceSelect.appendChild(option);
            });
        }

        provinceSelect.addEventListener('change', async function() {
            amphureSelect.innerHTML = '<option value="">เลือกอำเภอ</option>';
            tambonSelect.innerHTML = '<option value="">เลือกตำบล</option>';
            zipCodeDisplay.textContent = '';

            const selectedProvinceId = this.value;
            const selectedProvince = provinceData[selectedProvinceId-1];
            
            if (selectedProvince) {
                selectedProvince.amphure.forEach(amphure => {
                    let option = document.createElement('option');
                    option.value = amphure.id;
                    // console.log(amphure.name_th)
                    option.textContent = amphure.name_th;
                    amphureSelect.appendChild(option);
                });
            }
        });

        amphureSelect.addEventListener('change', async function() {
            tambonSelect.innerHTML = '<option value="">เลือกตำบล</option>';
            zipCodeDisplay.textContent = '';

            const selectedProvinceId = provinceSelect.value;
            //console.log(selectedProvinceId)
            const selectedAmphureId = this.value;
            //console.log(selectedAmphureId)
            const selectedAmphureData = provinceData[selectedProvinceId-1].amphure.filter(_amphure => _amphure.id == selectedAmphureId)[0];
            //console.log(provinceData[selectedProvinceId-1].amphure.filter(_amphure => _amphure.id == selectedAmphureId)[0])
            if (selectedAmphureData) {
                
                    selectedAmphureData.tambon.forEach(tambon => {
                        let option = document.createElement('option');
                        option.value = tambon.id;
                        option.textContent = tambon.name_th;
                        tambonSelect.appendChild(option);
                        // console.log(tambon.id +'<br>'+tambon.zip_code)
                    });
                
            }
        });

        tambonSelect.addEventListener('change', function() {
            const selectedProvinceId = provinceSelect.value;
            const selectedAmphureId = amphureSelect.value;
            const selectedTambonId = this.value;
            selectedZipCode = provinceData[selectedProvinceId-1].amphure.filter(_amphure => _amphure.id == selectedAmphureId)[0].tambon.filter(_tambon => _tambon.id == selectedTambonId)[0].zip_code;
            zipCodeDisplay.textContent =`รหัสไปรษณีย์: ${selectedZipCode}`;

        });
        fetchData();
    });
    
    document.getElementById('submitZipCode').addEventListener('click', ()=>{
      document.getElementById('txtZipCode').value = selectedZipCode;
      bootstrap.Modal.getInstance(document.getElementById('exampleModal')).hide();
    })
};

main();


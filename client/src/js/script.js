let tbody = document.querySelector("tbody");
let addBtn = document.querySelector(".add");
let form = document.querySelector(".form-wrapper");
let saveBtn = document.querySelector(".save");
let cancelBtn = document.querySelector(".cancel");
let mobileEle = document.querySelector("#mobile");
let priceEle = document.querySelector("#price");
let ramEle = document.querySelector("#ram");
let storageEle = document.querySelector("#storage");

let httpm = null;

let url = "http://localhost:8001/getCars";

let mobiles = [];

let id = null;

let data = {};

addBtn.onclick = function () {
  httpm = "POST";
  clearForm();
  form.classList.add("active");
};

cancelBtn.onclick = function () {
  form.classList.remove("active");
};

saveBtn.onclick = function () {
  data.name = mobileEle.value;
  data.price = priceEle.value;
  data.ram = ramEle.value;
  data.storage = storageEle.value;
  if (httpm == "PUT") {
    data.id = id;
  }

  fetch(url, {
    method: httpm,
    body: JSON.stringify(data),
    headers: { "Content-type": "application/json" },
  }).then(() => {
    clearForm();
    form.classList.remove("active");
    getMobiles();
  });
};

function clearForm() {
  mobileEle.value = null;
  priceEle.value = null;
  ramEle.value = null;
  storageEle.value = null;
}

function getMobiles() {
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      mobiles = data;
      updateTable();
    });
}

getMobiles();

function updateTable() {
  let data = "";

  if (mobiles.length > 0) {
    for (i = 0; i < mobiles.length; i++) {
      data += `<tr id="${mobiles[i]["plate"]}">
                        <td>${mobiles[i]["categories"]}</td>
                        <td>${mobiles[i]["brand"]}</td>
                        <td>${mobiles[i]["series"]}</td>
                        <td>${mobiles[i]["year"]}</td>
                        <td>${mobiles[i]["color"]}</td>
                        <td>${mobiles[i]["km"]}</td>
                        <td>${mobiles[i]["engineCapacity"]}</td>
                        <td>${mobiles[i]["plate"]}</td>
                        <td><button class="btn btn-primary" onclick="editMobile(event)">Edit</button></td>
                        <td><button class="btn btn-danger" onclick="deleteMobile(event)">Delete</button></td>   
                     </tr>`;
    }

    tbody.innerHTML = data;
  }
}

function editMobile(e) {
  form.classList.add("active");
  httpm = "PUT";
  id = e.target.parentElement.parentElement.id;
  let selectedMobile = mobiles.filter((m) => {
    return m["id"] == id;
  })[0];
  mobileEle.value = selectedMobile.name;
  priceEle.value = selectedMobile.price;
  ramEle.value = selectedMobile.ram;
  storageEle.value = selectedMobile.storage;
}

function deleteMobile(e) {
  const plate = e.target.parentElement.parentElement.id;
  const data = {
    plate: plate,
  };
  console.log(data);
  fetch("http://localhost:8001/sellCar", {
    method: "POST", // or 'PUT'
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify(data),
  }).then(() => {
    getMobiles();
  });
}

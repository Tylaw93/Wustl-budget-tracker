let db;

const request = indexedDB.open("BudgetStore", 1);

// https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB#opening_a_database
request.onupgradeneeded = function(e) {
  const db = request.result;
  db.createObjectStore("BudgetStore", { autoIncrement: true });
};

request.onerror = function(e) {
  console.log("There was an error");
};

// See 19-PWA\01-Activities\13-Stu_Caching_Fetching_Files\Solved\public\assets\js
request.onsuccess = function(e) {
    // https://offering.solutions/blog/articles/2018/11/21/online-and-offline-sync-with-angular-and-indexeddb/
  db = e.target.result;
  if (navigator.onLine){
    checkDB();
  }
}

function checkDB(){
  // const db = event.target.result;
  const tx = db.transaction(["BudgetStore"], "readwrite");
  const store = tx.objectStore("BudgetStore");
  const getData = store.getAll();
  getData.onsuccess = function(){
    if (getData.result.length>0){
      fetch("/api/transaction/bulk", {
        method: "POST",
        body: JSON.stringify(getData.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json"
        }
      })
      // return the response as a json
      .then(res=>res.json())
      .then(()=>{
        const tx = db.transaction(["BudgetStore"], "readwrite");
        const store = tx.objectStore("BudgetStore");
        store.clear();
      })
    }
  }
}

// See Line 139 of ../index.js
function saveRecord(record){
  const tx = db.transaction(["BudgetStore"],"readwrite");
  const store = tx.objectStore("BudgetStore");
  store.add(record)
}

window.addEventListener("online",checkDB)
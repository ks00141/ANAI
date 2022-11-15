

const body = document.querySelector('body');
const table = document.createElement('table');
const fileInput = document.querySelector('input');
fileInput.addEventListener('change', (e)=>{
    loadData(e.target.files[0]);
})

const loadData = (file)=>{
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = (e)=>{
        const data = convertToObject(e.target.result);
        appendHeader(data.header);
        for(const d of data.data){
            appendRow(d);
        }
    }
}

const appendHeader = (headerData) => {
    const tr = document.createElement('tr');
    for(const header of headerData){
        const th = document.createElement('th');
        th.innerText = header;
        tr.appendChild(th);
    }
    table.appendChild(tr);
}

const appendRow = (data) => {
    const tr = document.createElement('tr');
    for(const d of data){
        const td = document.createElement('td');
        td.innerText = d;
        tr.appendChild(td);
    }
    table.appendChild(tr);
}

const convertToObject = (data) => {
    const segmentedData = data.split('\n').map(d => d.split(','));
    const header = segmentedData.shift();
    return {
        header : header,
        data : segmentedData
    };
}

body.appendChild(table);
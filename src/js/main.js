
// Use this code if you choose to do Node JS

const apiUrl = "https://web.scraper.workers.dev/";

const passMark = {
    url: "https://www.videocardbenchmark.net/high_end_gpus.html",
    scoreSelector: ">a>span.count"
};

const newEgg = {
    infoSelector: ".item-container>.item-info>a",
    priceSelector: ".item-container>.item-action>.price>.price-current>strong"
};

const RTX3090 = {
    brand: "nVidia",
    name: "GeForce RTX 3090",
    passMarkId: "rk4284",
    newEggListings: "https://www.newegg.com/p/pl?N=100007709%204814%20601357248%20601303642%204131&PageSize=96&Order=1"
};

const RTX3080Ti = {
    brand: "nVidia",
    name: "GeForce RTX 3080 Ti",
    passMarkId: "rk4409",
    newEggListings: "https://www.newegg.com/p/pl?N=100007709%204814%20601303642%204131%20601385735&PageSize=96&Order=1"
};

const RTX3080 = {
    brand: "nVidia",
    name: "GeForce RTX 3080",
    passMarkId: "rk4282",
    newEggListings: "https://www.newegg.com/p/pl?N=100007709%204814%20601303642%204131%20601357247&PageSize=96&Order=1"
};

const RX6900XT = {
    brand: "AMD",
    name: "Radeon RX 6900 XT",
    passMarkId: "rk4322",
    newEggListings: "https://www.newegg.com/p/pl?N=100007709%204814%20601303642%204131%20601359957&PageSize=96&Order=1"
};

const RX6800XT = {
    brand: "AMD",
    name: "Radeon RX 6800 XT",
    passMarkId: "rk4312",
    newEggListings: "https://www.newegg.com/p/pl?N=100007709%204814%20601303642%204131%20601359422&PageSize=96&Order=1"
};

function scrape(url,selector,callback){
    fetch(`${apiUrl}?url=${url}&selector=${selector}`)
    .then(response => response.json())
    .then(data => {
        let cleanSelector = selector.replace('%23','#');
        console.log(url,selector,data);
        let results = data.result[cleanSelector];
        callback(results);
    });
}

function getPassMarkScore(gpu,callback){
    scrape(passMark.url,`li%23${gpu.passMarkId}${passMark.scoreSelector}`,callback);
}

function getNewEggPrice(gpu,callback){
    scrape(gpu.newEggListings,newEgg.priceSelector,callback);
}

function getNewEggInfo(gpu,callback){
    scrape(gpu.newEggListings,newEgg.infoSelector,callback);
}

const GPUs = [RTX3090,RTX3080Ti,RTX3080,RX6900XT,RX6800XT];

export default() => {
    const appDiv = document.getElementById("app");
    appDiv.innerHTML = `<ul>
        ${GPUs.map(gpu=>{
            return `
                <li id="${gpu.passMarkId}">
                    <p><strong class="info"></strong></p>
                    <p>Newegg Price: $<strong class="price"></strong><sup>.99</sup></p>
                    <p>PassMark Score: <strong class="score"></strong></p>
                </li>
            `;
        }).join('')}
    </ul>`;

    GPUs.forEach(gpu => {
        let item = document.getElementById(gpu.passMarkId);
        let info = item.getElementsByClassName('info')[0];
        let price = item.getElementsByClassName('price')[0];
        let score = item.getElementsByClassName('score')[0];

        getNewEggInfo(gpu,(results)=>{
            info.innerText = results[0];
        });

        getNewEggPrice(gpu,(results)=>{
            let _price = results[0];
            gpu['price'] = _price;
            price.innerText = _price;
        });

        getPassMarkScore(gpu,(results)=>{
            let _score = results[0];
            gpu['score'] = _score;
            score.innerText = _score;
        });
    });
}


// Simply use this as your main JS if you want to use Vanilla JS

async function loadData(e){
    const reader = new FileReader();
    return new Promise((res, err) => {
        reader.readAsText(e.target.files[0]);
        reader.onload = () => {
            const data = reader.result.split('\n').map(row => row.split(',')).slice(0,-1);
            const header = data.shift();
            const cleaned = data.map(data => ({
                xSize : parseFloat(data[5]),
                ySize : parseFloat(data[6]),
                size : parseFloat(data[8]),
            }))
            .filter(data => (data.xSize != null && data.ySize != null));
            res([header,cleaned]);
        };
    });
}


function run(){
    document.querySelector('input')
    .addEventListener('change', async (e) => {
        const data = await loadData(e);
        const {inputs, labels} = convertToTensor(data[1]);
        console.log(inputs.slice([0,0],[1,2]).arraySync());
        const model = createModel();
        model.compile({
            optimizer:tf.train.adam(0.002),
            loss:tf.losses.meanSquaredError,
            metrics:['accuracy']
        });
        
        (
            async ()=>{
                model.fit(inputs, labels, {
                    batchSize:1000,
                    epochs:5000,
                    shuffle:true,
                    verbose:0,
                    callbacks:{
                        onTrainBegin:()=>{
                            console.log(`before train : ${model.predict(inputs.slice([0,0],[1,2]))}`);
                        },
                        onEpochEnd : (epoch, logs)=>{
                            console.log(`${epoch + 1} / loss : ${tf.sqrt(logs.loss).arraySync()}`);
                        },
                        onTrainEnd:()=>{
                            console.log(`after train : ${model.predict(inputs.slice([0,0],[1,2]))}`);
                            console.log(`target : ${labels.slice([0,0],[1,1])}`);
                        }
                    }
                })
            }
        );
    })
}

function createModel(){
    const model = tf.sequential({
        layers:[
            tf.layers.dense({units:3, inputShape:[2]}),
            tf.layers.dense({units:10}),
            tf.layers.dense({units:20}),
            tf.layers.dense({units:1})
        ]
    });
    return model;
}

document.addEventListener('DOMContentLoaded', run);

function convertToData(data, key){
    const extractedData = data.map(d => d[key]);
    const toTensor = tf.tensor(extractedData);
    console.log(toTensor);
    const minValue = toTensor.min();
    const maxValue = toTensor.max();

    return {
        toTensor:toTensor,
        minValue:minValue,
        maxValue:maxValue
    };
}

function convertToTensor(data){


    const input = data.map(d => [d.xSize, d.ySize]);
    const label = data.map(d => d.size);

    const inputTensor = tf.tensor2d(input, [input.length, 2]);
    const labelTensor = tf.tensor2d(label, [label.length, 1]);


    return {
        inputs:inputTensor,
        labels:labelTensor
    }
}
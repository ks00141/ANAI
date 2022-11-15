
const inputs = tf.tensor([1,2,3,4,5,6,7,8,9,10]);
const targets = tf.tensor([10,20,30,40,50,60,70,80,90,100]);

const model = tf.sequential({
    layers:[
        tf.layers.dense({inputShape:[1], units:1})
    ]
});

model.compile(
    {
        optimizer:tf.train.adam(0.5),
        loss:tf.losses.meanSquaredError
    }
);

const modelTrain = async ()=>{
    await model.fit(inputs, targets, {
        epochs: 100,
        verbose:0,
        callbacks: {
            onEpochEnd: (epoch, logs)=>{
                console.log(logs.loss);
            },
            onTrainEnd: ()=>{
                console.log("train end!!");
            }
        }
    })
}

const modelPredict = async (input)=>{
    const inputTensor = tf.tensor([parseInt(input)]);
    const value = await model.predict(inputTensor).array();
    return value[0][0];
}

const predictBtn = document.querySelector('.submit-btn');
const trainBtn = document.querySelector('.train-btn');
const input = document.querySelector('.input');
predictBtn.addEventListener('click', ()=>{
    console.log(`Test Value : ${input.value}`)
    console.log(`Target Value : ${input.value * 10}`)
    modelPredict(input.value).then((predict)=>{
        console.log(`Predict Value : ${predict}`);
    });
    input.value = '';
})
trainBtn.addEventListener('click', ()=>{
    modelTrain();
})

const body = document.querySelector('body');
const div = document.createElement('div');
const inputText = inputs;
const targetText = targets;
const xParagraph = document.createElement('p');
const yParagraph = document.createElement('p');
xParagraph.innerText = 'X : ';
xParagraph.innerText += inputText;
yParagraph.innerText = 'Y : ';
yParagraph.innerText += targetText;
div.appendChild(xParagraph);
div.appendChild(yParagraph);
body.appendChild(div);

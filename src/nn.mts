import { getRand } from "./main.mts";

class Neuron {
    value : number = 0;
    bias : number;
    weights : number[];
    inputs : Neuron[]|iNeuron[];

    constructor (bias : number, weights : number[], inputs : Neuron[]|iNeuron[]){
        this.bias = bias;
        this.weights = weights;
        this.inputs = inputs;
    }
    calc(){
        this.value = 0;
        for(let i = 0; i < this.inputs.length; i++){
            this.value += this.inputs[i].value*this.weights[i]
        }
        this.value +=this.bias;
        if(this.value < 0){
            this.value = 0;
        }
    }
}

class iNeuron {
    value : number = 0;
}

class oNeuron extends Neuron {
    calc(){
        this.value = 0;
        for(let i = 0; i < this.inputs.length; i++){
            this.value += this.inputs[i].value*this.weights[i]
        }
        this.value +=this.bias;
    }
}



export class Network {
    inputLayer : iNeuron[];
    layerOne : Neuron[];
    layerTwo : Neuron[];
    outputLayer : oNeuron[];

    constructor(l1 : iNeuron[], l2 : Neuron[], l3 : Neuron[], l4 : oNeuron[]){
        this.inputLayer = l1;
        this.layerOne = l2;
        this.layerTwo = l3;
        this.outputLayer = l4;
    }

    process(inputs : number[]){
        //Set the input neurons to the correct values
        for(let i = 0; i < inputs.length; i++){
            this.inputLayer[i].value = inputs[i];
        }

        //Process layer one
        for(let i = 0; i < this.layerOne.length; i++){
            this.layerOne[i].calc()
        }
        //Process layer two
        for(let i = 0; i < this.layerTwo.length; i++){
            this.layerTwo[i].calc()
        }
        //Process output layer
        for(let i = 0; i < this.layerTwo.length; i++){
            this.layerTwo[i].calc()
        }
        const dx = this.outputLayer[0].value * 5;
        const dy = this.outputLayer[1].value * 5;
        return {dx : dx, dy : dy};
    }
}

export function createRandNet():Network{
    /**
     * Inputs :
     * current x / canvas.width;
     * current y / canvas.height;
     * ---repeat 5 times ---
     * is predadtor (1 for yes, -1 for no)
     * contact location x / canvas.width
     * contact location y / canvas.height
     * --repeat 5 times---
     * 
     * Length : 18
     */
    const inputLayer = Array.from({length : 17},() => {
        return new iNeuron()
    })

    const layerOne = Array.from({ length: 5 }, () =>
        new Neuron(
        getRand(-1, 1),
        Array.from({ length: 17 }, () => getRand(-1, 1)),
        inputLayer
        )
    ) 
    const layerTwo = Array.from({ length: 5 }, () =>
        new Neuron(
        getRand(-1, 1),
        Array.from({ length: 5 }, () => getRand(-1, 1)),
        layerOne
        )
    );
    const outputLayer = Array.from({ length: 5 }, () =>
        new Neuron(
        getRand(-1, 1),
        Array.from({ length: 5 }, () => getRand(-1, 1)),
        layerOne
        )
    );
    return new Network(inputLayer,layerOne,layerTwo,outputLayer);
  }
export function breed (netA : Network, netB : Network):Network{
    
    //Input layer is static so just clone it from netA (net b will be the same)
    const inputLayer = netA.inputLayer;
    
    //Create layer one
    let layerOne : Neuron[] = [];
    for(let i = 0; i < netA.layerOne.length; i++){
        let weights : number[] = [];
        const rand = getRand(-1,1);

        for( let j = 0; j < netA.layerOne[j].weights.length; j++){
            const inRand = getRand(-1,1);
            if(inRand < 0){
                weights.push(netA.layerOne[i].weights[j])
            } else {
                weights.push(netB.layerOne[i].weights[j])
            }
        }
        layerOne.push(new Neuron(rand < 0 ? netA.layerOne[i].bias : netB.layerOne[i].bias,weights,inputLayer));

    }
        
    //Create layer two
    let layerTwo : Neuron[] = [];
    for(let i = 0; i < netA.layerTwo.length; i++){
        let weights : number[] = [];
        const rand = getRand(-1,1);

        for( let j = 0; j < netA.layerTwo[j].weights.length; j++){
            const inRand = getRand(-1,1);
            if(inRand < 0){
                weights.push(netA.layerTwo[i].weights[j])
            } else {
                weights.push(netB.layerTwo[i].weights[j])
            }
        }
        layerTwo.push(new Neuron(rand < 0 ? netA.layerTwo[i].bias : netB.layerTwo[i].bias,weights,layerOne));

    }
    //Create output layer
    let outputLayer : Neuron[] = [];
    for(let i = 0; i < netA.outputLayer.length; i++){
        let weights : number[] = [];
        const rand = getRand(-1,1);

        for( let j = 0; j < netA.outputLayer[j].weights.length; j++){
            const inRand = getRand(-1,1);
            if(inRand < 0){
                weights.push(netA.outputLayer[i].weights[j])
            } else {
                weights.push(netB.outputLayer[i].weights[j])
            }
        }
        outputLayer.push(new Neuron(rand < 0 ? netA.outputLayer[i].bias : netB.outputLayer[i].bias,weights,outputLayer));

    }
    return new Network(inputLayer, layerOne, layerTwo, outputLayer);
}


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
     * current time / 10
     * 
     * Length : 18
     */
    const inputLayer = Array.from({length : 18},() => {
        return new iNeuron()
    })

    const layerOne = Array.from({ length: 5 }, () =>
        new Neuron(
        getRand(-1, 1),
        Array.from({ length: 18 }, () => getRand(-1, 1)),
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

}


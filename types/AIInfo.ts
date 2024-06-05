interface ChoiceOption {
    [key: string]: string;
  }
  
  interface SliderInfo {
    max: number;
    min: number;
    step: number;
  }
  
  interface TextInput {
    name: string;
    type: "text";
    default: string;
    input_property_name: string;
  }
  
  interface ChoiceInput {
    name: string;
    type: "choice";
    default: string;
    input_property_name: string;
    info: {
      choices: ChoiceOption;
    };
  }
  
  interface SliderInput {
    name: string;
    type: "slider";
    default: number;
    input_property_name: string;
    info: SliderInfo;
  }
  
  interface ImageInput {
    name: string;
    type: "image";
    default: null;
    input_property_name: string;
    info: {
      accept: string;
    };
  }
  
  interface MultipleInput {
    name: string;
    type: "multiple";
    default: null;
    input_property_name: string;
    info: {
      inputs: GenerateInput[];
    };
  }
  
  interface ArrayInput {
    name: string;
    type: "array";
    default: any[];
    input_property_name: string;
    info: {
      element: MultipleInput;
    };
  }
  
  type GenerateInput = TextInput | ChoiceInput | SliderInput | ImageInput | ArrayInput;
  
  interface AIConfig {
    ai_name: string;
    inputs: GenerateInput[];
  }
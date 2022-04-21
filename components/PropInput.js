import { TextField } from "@mui/material";
import { useState, useEffect } from "react";
import { evaluateTable } from "../resources/evaluateTable";
import { validateInput } from "../resources/validate";

function PropInput(props) {
  const [inputText, setInputText] = useState("");
  const [errorText, setErrorText] = useState(false);

  const handleChange = (e) => {
    let newValue = e.target.value;
    setInputText(newValue);
    let error = validateInput(newValue);
    if (!error) {
        setErrorText(false);
      let propositionResult = evaluateTable(newValue);
      props.getPropositionResult(propositionResult);
    } else {
        if (error === true) {
            setErrorText(false);
        } else {
            setErrorText(error);
        }
        
      props.getPropositionResult([]);
    }
  };

  return (
    <div className="flex flex-col items-center py-6">
      <p className="font-sans text-xl">Enter proposition formula:</p>
      <br />
      <TextField
        value={inputText}
        onChange={handleChange}
        id="filled-basic"
        label="Example: p ^ q"
        color="primary"
        variant="filled"
        className="w-11/12"
        error={!(errorText === false)}
      />
      {errorText && <p className="mt-2 text-red-600 text-sm font-normal">{errorText}</p>}
    </div>
  );
}

export default PropInput;

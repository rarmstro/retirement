import React, { useState } from "react";
import { Button, Collapse } from "@blueprintjs/core";
import SchemaString from "./SchemaString";

interface SchemaObjectProps {
  schema: object;
}

const create = ( schema : object) => {
  if (schema["type"] === 'object') {
    return ( <div><SchemaObject schema={schema}/></div>);
  } else if (schema["type"] === 'string') {
    return ( <div><SchemaString schema={schema}/></div>);
  } else if (schema["type"] === 'number') {
    return ( <div> <Button>Number</Button> </div>);
  } else if (schema["type"] === 'integer') {
    return ( <div> <Button>Integer</Button> </div>);
  } else if (schema["type"] === 'boolean') {
    return ( <div> <Button>Boolean</Button> </div>);
  } else if (schema["type"] === 'enum') {
    return ( <div> <Button>Enum</Button> </div>);  
  } else if (schema["type"] === 'array') {
    return ( <div> <Button>Array</Button> </div>);  
  }
  
}

const SchemaObject: React.FC<SchemaObjectProps> = (props) => {

  const [isOpen, setIsOpen] = useState(false);

  return (<div>
    <Button onClick={() => setIsOpen(!isOpen)}>{isOpen ? "Hide" : "Show"} {props.schema["title"]}</Button>
      <Collapse isOpen={isOpen}> 
        <div style={{ width: '100%', margin: '10px 10px' }}>
        {Object.keys(props.schema["properties"]).map((key) => (
          <div id={key} key={key}>
            { create(props.schema["properties"][key]) } 
          </div>
        ))}
        </div>
      </Collapse>
    </div>
  );
};

export default SchemaObject;

import React, { useState } from "react";
import { Button, Collapse } from "@blueprintjs/core";

interface SchemaObjectProps {
  title: string;
  json: object;
  schema: object;
}

const create = ( schema : object, level : string) => {
  if (schema["type"] === 'object') {
    return createObject(schema["properties"], level);
  } else if (schema["type"] === 'string') {
    return ( <div> <Button>String</Button> </div>);
  } else if (schema["type"] === 'number') {
    return ( <div> <Button>Number</Button> </div>);
  } else if (schema["type"] === 'integer') {
    return ( <div> <Button>Integer</Button> </div>);
  } else if (schema["type"] === 'boolean') {
    return ( <div> <Button>Boolean</Button> </div>);
  } else if (schema["type"] === 'enum') {
    return ( <div> <Button>Enum</Button> </div>);  
  }
  
}

const createObject = (schema : object, level : string) => {

  return ( 
  <div>
    {Object.keys(schema).map((key) => (
      <div>
        <SchemaObject title={key} json={schema[key]} schema={schema[key]} />
      </div>
    ))}
    
  </div>
  );
};

const SchemaObject: React.FC<SchemaObjectProps> = (props) => {

  const [isOpen, setIsOpen] = useState(false);

  return (<div>
    <Button onClick={() => setIsOpen(!isOpen)}>{isOpen ? "Hide" : "Show"} {props.title}</Button>
      <Collapse isOpen={isOpen}> 
        <div style={{ width: '100%', margin: '10px 10px' }}>
          {create(props.schema, '')}
        </div>
      </Collapse>
    </div>
  );
};

export default SchemaObject;

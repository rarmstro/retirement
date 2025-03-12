interface PathResult {
  exists: boolean;
  value: any;
}

/**
 * Traverses a JSON object using a dot-notation path and returns the result
 * @param json The JSON object to traverse
 * @param path The path string (e.g., "$.person.addresses[0].street")
 * @returns Object containing existence status and value (if found)
 */
export function traverseJsonPath(json: any, path: string): PathResult {
  // Handle invalid input
  if (!json || !path || !path.startsWith('$.')) {
    return { exists: false, value: null };
  }

  // Remove the $. prefix
  const normalizedPath = path.substring(2);
  
  // If path is empty after removing $., return the root object
  if (!normalizedPath) {
    return { exists: true, value: json };
  }

  let current = json;
  const segments = normalizedPath.split('.');

  for (const segment of segments) {
    // Check if segment contains array index
    const arrayMatch = segment.match(/^(.+)\[(\d+)\]$/);
    
    if (arrayMatch) {
      // Handle array access
      const [, arrayName, indexStr] = arrayMatch;
      const index = parseInt(indexStr, 10);
      
      if (!current[arrayName] || !Array.isArray(current[arrayName]) || 
          index >= current[arrayName].length) {
        return { exists: false, value: null };
      }
      current = current[arrayName][index];
    } else {
      // Handle regular property access
      if (!current.hasOwnProperty(segment)) {
        return { exists: false, value: null };
      }
      current = current[segment];
    }
  }

  return { exists: true, value: current };
}

/**
 * Resolves a JSON schema reference
 * @param schema  The JSON schema object
 * @param ref   The reference string (e.g., "#/$defs/address")
 * @returns   The resolved schema object
 */
export const resolveRef = (schema: Record<string, any>, ref: string) => {
  const refPath = ref.slice(2).split("/");
  let resolvedRef = schema;
  for (const key of refPath) {
    if (resolvedRef[key]) {
      resolvedRef = resolvedRef[key];
    } else {
      throw new Error(`Invalid $ref: ${ref}`);
    }
  }
  return resolvedRef;
};

/**
 * Finds the schema object at the specified path. Handles $ref and arrays
 * @param schema 
 * @param path 
 * @returns Object containing existence status and schema value (if found)
 */
export function resolveSchema(schema: Record<string, any>, path: string): PathResult {
  // Handle invalid input
  if (!schema || !path || !path.startsWith('$')) {
    return { exists: false, value: null };
  }

  // Remove the $. prefix
  const normalizedPath = path.substring(2);
  
  // If path is empty after removing $., return the root object
  if (!normalizedPath) {
    return { exists: true, value: schema };
  }

  let currentSchema = schema;
  const segments = normalizedPath.split('.');
    
  for (const segment of segments) {

    // Extract everything before the first "[" character, or the entire string if there is no "["
    let key = segment.split("[")[0];

    if (currentSchema["type"] === "object" && currentSchema["properties"] && currentSchema["properties"][key]) {
      currentSchema = currentSchema["properties"][key];

      // Resolve $ref if present
      if (currentSchema.$ref) {
        try {   
          currentSchema = resolveRef(schema, currentSchema.$ref);
        } catch (error) {
          return { exists: false, value: null };
        }
      }
    }
    
    if (currentSchema["type"] === "array" && currentSchema["items"]) {
      currentSchema = currentSchema["items"];

      // Resolve $ref if present
      if (currentSchema.$ref) {
        try {   
          currentSchema = resolveRef(schema, currentSchema.$ref);
        } catch (error) {
          return { exists: false, value: null };
        }
      }
    }

  }

  return { exists: true, value: currentSchema };
}

// Get default value from schema
export function getDefaultValue(schema: Record<string, any>): any {
  // Resolve $ref if present
  if (schema.$ref) {
    schema = resolveRef(schema, schema.$ref);
  }
  
  // First check explicit default or enum values
  if (schema.default !== undefined) {
    return schema.default;
  }
  if (schema.enum && schema.enum.length > 0) {
    return schema.enum[0];
  }

  // Handle different types with proper return statements
  switch (schema.type) {
    case "string":
      return "";
    case "number":
    case "integer":
      return 0;
    case "boolean":
      return false;
    case "object":
      if (schema.properties) {
        const result: Record<string, any> = {};
        for (const [key, prop] of Object.entries(schema.properties)) {
          result[key] = getDefaultValue(prop as Record<string, any>);
        }
        return result;
      }
      return {};
    case "array":
      if (schema.items && schema.minItems > 0) {
        return [getDefaultValue(schema.items)];
      }
      return [];
    default:
      return null;
  }
}

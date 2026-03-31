function validateJSON(jsonString) {
  try {
    JSON.parse(jsonString);
    return "дійсний JSON";
  } catch (error) {
    return "недійсний JSON";
  }
}

const validString = '{"name": "John", "age": 30}';
const invalidString = '{name: "John", age: 30}'; 

console.log(`Рядок 1: ${validateJSON(validString)}`);
console.log(`Рядок 2: ${validateJSON(invalidString)}`);

export const validateRequired = (fields, body) => {
  const missing = [];
  for (const f of fields) {
    if (body[f] === undefined || body[f] === null || body[f] === "") {
      missing.push(f);
    }
  }
  return missing;
};

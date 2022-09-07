export const mappersNames = {
  DateNow: '~~~mapper:date:now()',
};

const mappers = {
  [mappersNames.DateNow]: () => new Date(),
};

export function applyMapper(value) {
  return mappers[value] ? mappers[value](value) : value;
}

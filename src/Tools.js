import { nest } from "d3-collection";

const getCumulData = (data, key) => {
  const dateEntries = nest()
    .key((d) => {
      return d.date;
    })
    .entries(data);

  return dateEntries.map((date) =>
    date.values.reduce(
      (acc, curr) => {
        return {
          date: curr.date,
          value: acc.value + parseInt(curr.ventes),
        };
      },
      { value: 0 }
    )
  );
};

const hasDuplicates = (array) => {
    return new Set(array).size !== array.length;
};

const isWellFormatted = ({ value, key, regexKey, regexValue }) => {
    if (key.match(regexKey)) {
        if (typeof value !== "string") return false;
        if (key === "date" && value.match(regexValue) && isNaN(Date.parse(value)))
        return false;
        if (key === "ventes" && !value.match(regexValue)) return false;
    }
    return true;
};

// VERIFICATIONS
// data exist
// has good labels,
// level is string,
// date is valid date and is string dd/mm/yyyy,
// value is number
// there is one date label
// there is one value label
// there is one of each level label
export const verifData = (data) => {
  if (!data.length) return "Please upload your hierarchy file.";

  for (let i = 0; i < data.length; i++) {
    const levelsLabels = Object.keys(data[i]).filter((key) =>
      key.match(/^niveau_\d+$/)
    );
    const hasLevelsLabels = !!levelsLabels.length;
    if (!hasLevelsLabels)
      return 'Level labels are not well formatted -> like "niveau_n+i"';
    const hasDuplicatesLevelsLabels = hasDuplicates(levelsLabels);
    if (hasDuplicatesLevelsLabels)
      return "Level labels are duplicated, you must have one value for each product";

    const dateLabel = Object.keys(data[i]).filter((key) => key === "date");
    const hasDateLabel = !!dateLabel.length;
    if (!hasDateLabel) return 'Date label is not well formatted -> like "date"';
    const hasDuplicatesDateLabel = hasDuplicates(dateLabel);
    if (hasDuplicatesDateLabel)
      return "Date label is duplicated, you must have one value for each product";

    const valueLabel = Object.keys(data[i]).filter((key) => key === "ventes");
    const hasValueLabel = !!valueLabel.length;
    if (!hasValueLabel)
      return 'Value label is not well formatted -> like "ventes"';
    const hasDuplicatesValueLabel = hasDuplicates(valueLabel);
    if (hasDuplicatesValueLabel)
      return "Value label is duplicated, you must have one value for each product";

    let levelValueIsString;
    let dateValueIsWellFormatted;
    let valueIsNumber;
    for (const [key, value] of Object.entries(data[i])) {
      levelValueIsString = isWellFormatted({
        key,
        value,
        regexKey: /^niveau_\d+$/,
      });
      if (!levelValueIsString) return "Levels are not type of string";
      dateValueIsWellFormatted = isWellFormatted({
        key,
        value,
        regexKey: /^date$/,
        regexValue: /^\d{1,2}\/\d{1,2}\/\d{4}$/,
      });
      if (!dateValueIsWellFormatted)
        return 'Dates are invalid or not formatted like "dd/mm/yyyy" string';
      valueIsNumber = isWellFormatted({
        key,
        value,
        regexKey: /^ventes$/,
        regexValue: /^\d+$/,
      });
      if (!valueIsNumber) return "Values are not numbers";
    }
  }
  return 1;
};

export const getHierarchy = (data, i) => {
  const nbLevel = data.reduce((acc, curr) => {
    const accNbLevels = Object.keys(acc).filter((key) =>
      key.includes("niveau")
    ).length;
    const currNbLevels = Object.keys(curr).filter((key) =>
      key.includes("niveau")
    ).length;
    return accNbLevels > currNbLevels ? accNbLevels : currNbLevels;
  }, 0);

  var entries = nest()
    .key((d) => {
      return d[`niveau_${i}`];
    })
    .entries(data);

  if (nbLevel >= i) {
    entries = entries.map((e) => {
      return {
        ...e,
        values: nbLevel === i ? e.values : getHierarchy(e.values, i + 1),
        cumul: getCumulData(e.values, e.key),
      };
    });
  }
  return entries;
};

import lodash from 'lodash';

const { map, mapKeys, isObject, isArray, camelCase, snakeCase, mapValues } =
    lodash;

/**
 * @param {object} object
 * @param {"cameCase"|"sneck_case"} type
 */
const transformVariableType = (object, type) => {
    if (isArray(object)) {
        return map(object, (item) => transformVariableType(item, type));
    }
    if (isObject(object)) {
        return mapValues(
            mapKeys(object, (value, key) =>
                type === 'cameCase' ? camelCase(key) : snakeCase(key)
            ),
            (item) => transformVariableType(item, type)
        );
    }
    return object;
};

export default transformVariableType;

'use strict';

const fp = require('lodash/fp');

const { addImport } = require('./imports');
const { logWarning, toType } = require('./utils');

const generateAttributesDefinition = (attributes, uid) => {
  const attributesDefinitions = [];

  for (const [attributeName, attribute] of Object.entries(attributes)) {
    const type = getAttributeType(attributeName, attribute, uid);

    attributesDefinitions.push([attributeName, type]);
  }

  const formattedDefinitions = attributesDefinitions
    .map(([name, attributeType]) => `    ${name}: ${attributeType};`)
    .join('\n');

  return `  attributes: {
${formattedDefinitions}
  }`;
};

const getAttributeType = (attributeName, attribute, uid) => {
  const mappers = {
    string() {
      return ['StringAttribute', null];
    },
    text() {
      return ['TextAttribute', null];
    },
    richtext() {
      return ['RichTextAttribute', null];
    },
    password() {
      return ['PasswordAttribute', null];
    },
    email() {
      return ['EmailAttribute', null];
    },
    date() {
      return ['DateAttribute', null];
    },
    time() {
      return ['TimeAttribute', null];
    },
    datetime() {
      return ['DateTimeAttribute', null];
    },
    timestamp() {
      return ['TimestampAttribute', null];
    },
    integer() {
      return ['IntegerAttribute', null];
    },
    biginteger() {
      return ['BigIntegerAttribute', null];
    },
    float() {
      return ['FloatAttribute', null];
    },
    decimal() {
      return ['DecimalAttribute', null];
    },
    uid() {
      return ['UIDAttribute', null];
    },
    enumeration() {
      return ['EnumerationAttribute', null];
    },
    boolean() {
      return ['BooleanAttribute', null];
    },
    json() {
      return ['JsonAttribute', null];
    },
    media() {
      return ['MediaAttribute', null];
    },
    relation() {
      const { relation, target } = attribute;

      if (relation.includes('morph') | relation.includes('Morph')) {
        return ['PolymorphicRelationAttribute', [`'${uid}'`, `'${relation}'`]];
      }

      return ['RelationAttribute', [`'${uid}'`, `'${relation}'`, `'${target}'`]];
    },
    component() {
      const target = attribute.component;

      return ['ComponentAttribute', [`'${target}'`]];
    },
    dynamiczone() {
      const components = JSON.stringify(attribute.components);

      return ['DynamicZoneAttribute', [components]];
    },
  };

  if (!Object.keys(mappers).includes(attribute.type)) {
    logWarning(
      `"${attributeName}" attribute from "${uid}" has an invalid type: "${attribute.type}"`
    );

    return null;
  }

  let [attributeType, typeParams] = mappers[attribute.type]();

  addImport(attributeType);

  let type = typeParams ? `${attributeType}<${typeParams.join(', ')}>` : attributeType;

  if (attribute.required) {
    addImport('RequiredAttribute');

    type = `${type} & RequiredAttribute`;
  }

  if (attribute.pluginOptions && !fp.isEmpty(attribute.pluginOptions)) {
    addImport('PluginOptionsAttribute');

    const pluginOptionsType = toType(attribute.pluginOptions, {
      inline: true,
      indent: 0,
    });

    type = `${type} & PluginOptionsAttribute<${pluginOptionsType}>`;
  }

  return type;
};

module.exports = {
  generateAttributesDefinition,
  getAttributeType,
};
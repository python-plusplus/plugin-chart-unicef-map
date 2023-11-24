/** * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import { t, validateNonEmpty, } from '@superset-ui/core';
import {
  ControlPanelConfig,
  ControlStateMapping,
  getStandardizedControls,
  sections,
} from '@superset-ui/chart-controls';
const csv = require(csvtojson);

export function formatSelectOptions(options: (string | number)[]) {
  return options.map(opt => [opt, opt.toString()]);
}

// Visibility check to check country or world map
function getWhichMap(controls: ControlStateMapping, wantMap : string): boolean { 
  const mapType = controls?.select_world_or_country?.value;
  return mapType == wantMap
}
function BoundaryDef(controls: ControlStateMapping) : boolean{
  const boundaryType = controls?.select_boundary?.value;
  if (boundaryType === 'Authoritative' || boundaryType === 'Humanitarian' || boundaryType == 'Open') {
    return true;
  }
  return false;
}

//Conditional Validation
const validate = (bool : any) => bool ? [validateNonEmpty] : undefined;
  

function getCountries(controls: ControlStateMapping){
  const boundaryType = controls?.select_boundary?.value;
  if (boundaryType === 'Authoritative' || boundaryType === 'Humanitarian' || boundaryType == 'Open') {
    const csvFilePath = `../geoBoundaries/releaseData/geoBoundaries${boundaryType}-meta.csv`
    // fetch(csv)
    //   .then(response => response.text())
    //   .then(responseText => {
    //     console.log(responseText);
    //   });
      return formatSelectOptions(['ga']);
  }
  return formatSelectOptions(['gang']);
}
// Getting Options for country
// const countries = 
// const countryOptions = formatSelectOptions(countries);




const config: ControlPanelConfig = {
  controlPanelSections: [
    sections.legacyRegularTime,
    {
      label: t('Map'),
      expanded: true,
      controlSetRows: [
        [
          {
            name: 'select_chart_type',
            config: {
              type: 'SelectControl',
              label: t('Chart Type'),
              default: '3D',
              choices: formatSelectOptions(['2D', '3D']),
              description: t('Which chart would you like to use to visualize your data?'),
              validators: [validateNonEmpty],
            }
          },
        ],
        [
          {
          name: 'select_world_or_country',
          config: {
            type: "SelectControl",
            label: t('Map Scope'),
            default: 'Country',
            choices: formatSelectOptions(['World', 'Country']),
            description: t("What's the scope of the map you want to display?"),
            valdiators: [validateNonEmpty],
            rerender: ['select_boundary']
          }
        }
      ],
        [
          {
            name: 'select_boundary',
            config: {
              mapStateToProps: ({ controls }) => ({
                validators: validate(getWhichMap(controls, 'Country'))
              }),
              type: 'SelectControl',
              label: t('Boundary Type'),
              choices: formatSelectOptions(['Authoritative', 'Humanitarian', 'Open']),
              description: t('What kind of boundary data should we use?'),
              visibility: ({ controls }) => getWhichMap(controls, 'Country'),
              rerender: ['select_country']
            }
          }
        ],
        [
          {
            name: 'select_country',
            config: {
              mapStateToProps: ({ controls }) => (
                {
                  choices: getCountries(controls),
                  validators: validate(getWhichMap(controls, 'Country'))
                }
              ),
              type: 'SelectControl',
              label: t('Country'),
              //TODO: get default, currently hardcoded to AFG
              description: t('Which Country do you want to display?'),
              visibility: ({controls}) => (getWhichMap(controls, 'Country') && BoundaryDef(controls))
            }
          }
        ],
      ],
    },
    {
      label: t('Query'),
      expanded: true,
      controlSetRows: [
        ['series'],
        ['metric'],
        ['adhoc_filters'],
        ['row_limit'],
        [
          {
            name: 'select_chart_type',
            config: {
              type: 'SelectControl',
              label: t('Chart Type'),
              default: '3D',
              choices: formatSelectOptions(['2D', '3D']),
              description: t('Which chart would you like to use to visualize your data?'),
              validators: [validateNonEmpty],
            }
          },
          {
            name: 'sort_by_metric',
            config: {
              type: 'CheckboxControl',
              label: t('Sort by metric'),
              description: t(
                'Whether to sort results by the selected metric in descending order.',
              ),
            },
          },
        ],
      ],
    },
    {
      label: t('Options'),
      expanded: true,
      controlSetRows: [
        [
          {
            name: 'size_from',
            config: {
              type: 'TextControl',
              isInt: true,
              label: t('Minimum Font Size'),
              renderTrigger: true,
              default: 10,
              description: t('Font size for the smallest value in the list'),
            },
          },
          {
            name: 'size_to',
            config: {
              type: 'TextControl',
              isInt: true,
              label: t('Maximum Font Size'),
              renderTrigger: true,
              default: 70,
              description: t('Font size for the biggest value in the list'),
            },
          },
        ],
        [
          {
            name: 'rotation',
            config: {
              type: 'SelectControl',
              label: t('Word Rotation'),
              choices: [
                ['random', t('random')],
                ['flat', t('flat')],
                ['square', t('square')],
              ],
              renderTrigger: true,
              default: 'square',
              clearable: false,
              description: t('Rotation to apply to words in the cloud'),
            },
          },
        ],
        ['color_scheme'],
      ],
    },
  ],
  controlOverrides: {
    series: {
      validators: [validateNonEmpty],
      clearable: false,
    },
    row_limit: {
      default: 100,
    },
  },
  formDataOverrides: formData => ({
    ...formData,
    series: getStandardizedControls().shiftColumn(),
    metric: getStandardizedControls().shiftMetric(),
  }),
};

export default config;

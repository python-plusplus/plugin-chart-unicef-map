/**
 * Licensed to the Apache Software Foundation (ASF) under one
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

import { t, validateNonEmpty } from '@superset-ui/core';
import {
  ControlPanelConfig,
  ControlPanelsContainerProps,
  ControlStateMapping,
  sections,
} from '@superset-ui/chart-controls';
// import { FeatureFlag, isFeatureEnabled, t, validateNonEmpty } from '@superset-ui/core';
// import timeGrainSqlaAnimationOverrides from './utils/controls';
import {
  filterNulls,
  autozoom,
  jsColumns,
  jsDataMutator,
  jsTooltip,
  jsOnclickHref,
  legendFormat,
  legendPosition,
  // lineColumn,
  fillColorPicker,
  strokeColorPicker,
  filled,
  stroked,
  extruded,
  viewport,
  pointRadiusFixed,
  multiplier,
  lineWidth,
  reverseLongLat,
  mapboxStyle,
} from './utils/Shared_DeckGL';
// import { dndLineColumn } from './utils/sharedDndControls';
import { readdirSync } from 'fs';
import React from 'react';

export function formatSelectOptions(options: (string | number)[]) {
  return options.map(opt => [opt, opt.toString()]);
}

// Visibility check to check country or world map
function getWhichMap(controls: ControlStateMapping): string {
  const mapType = JSON.stringify(controls?.select_world_or_country?.value);
  if (mapType === 'world' || mapType === 'Country') {
    return mapType as string;
  }
  return 'country'
}
function isWhichMap( mapType: string) {
  return ({ controls }: Pick<ControlPanelsContainerProps, 'controls'>) =>
    getWhichMap(controls) === mapType;
}
const isCountryMap = isWhichMap('country');


// Helper to get directories

const getDirectories = source =>
  readdirSync(source, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)

// Getting Options for country
const countryOptions = formatSelectOptions(getDirectories(__dirname + '/geoBoundaries/releaseData/gbOpen'));

//Get ID codes for specific country
function getCodesCountry(country: string | undefined) {
  if (country == undefined) {
    return undefined
  }
  const dirPath: string = __dirname + `/geoBoundaries/releaseData/gbOpen/${country}`
  //d = ADM0, or some other code
  return getDirectories(dirPath).map(d => [React.lazy(() => (import(`${dirPath}/${d}/geoBoundaries-${country}-${d}.geojson`))),d]) 
}

//Get ID codes for world

function getCodesWorld() {
  var dirPath: string = __dirname + `/geoBoundaries/releaseData/CGAZ/`
  // the list of js/ts files within the directory
  const files = readdirSync(dirPath).filter(
    (f) => f.endsWith('.geojson'),
  ); 
  return files.map(f => [React.lazy(() => (import(`${f}`))), f])
}



// const lines = isFeatureEnabled(FeatureFlag.ENABLE_EXPLORE_DRAG_AND_DROP)
//   ? dndLineColumn
//   : lineColumn;

const config: ControlPanelConfig = {
  controlPanelSections: [
    sections.legacyRegularTime,
    {
      label: t('Query'),
      expanded: true,
      controlSetRows: [
        [{
            name: 'select_chart_type',
            config: {
                type: 'SelectControl',
                label: t('Chart Type'),
                default: '3D',
                choices: formatSelectOptions(['2D', '3D']),
                description: t('Which chart would you like to use to visualize your data?'),
                validators: [validateNonEmpty],
            }
        }],
        [{
          name: 'select_world_or_country',
          config: {
            type: "SelectControl",
            label: t('Map Scope'),
            default: 'Country',
            choices: formatSelectOptions(['World', 'Country']),
            description: t("What's the scope of the map you want to display?"),
            valdiators: [validateNonEmpty],
            // rerender: ['select_country']
          }
        }], 
        // [
        //   isCountryMap ? {
        //   name: 'select_country',
        //   config: {
        //     type: 'SelectControl',
        //     label: t('Country'),
        //     //TODO: get default, currently hardcoded to AFG
        //     default: 'AFG',
        //     choices: countryOptions,
        //     description: t('Which Country do you want to display?'),
        //     validators: [validateNonEmpty],
        //     visibility: isCountryMap
        //   }
        // } : null
        // ],
        // [{
        //   name: 'select_id_code',
        //   config: {
        //     mapStateToProps: ({ controls }) => ({
        //       options: JSON.stringify(controls?.select_world_or_country?.value) === 'country' ? getCodesCountry(JSON.stringify(controls?.select_country?.value)) : getCodesWorld()
        //     }),
        //     type: 'SelectControl',
        //     label: t('Identifier Code'),
        //     default: null,
        //     description: t('Which division code does your dataset use?'),
        //     validators: [validateNonEmpty],
        //   }
        // }, 
        // ],  
      ],
    }
  ]
};

export default config;

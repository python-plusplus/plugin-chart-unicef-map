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
import {
  QueryFormData,
  supersetTheme,
  TimeseriesDataRecord,
} from '@superset-ui/core';

// export enum ChartType {
//   border = '2D',
//   polygon = '3D',
// }

export enum WorldQueryCode {
  iso3066_1 = 'iso3066-1 (National)',
  cioc = 'International Olympic Committee Code (National)',
  adm0 = 'Administration Level 0 (National)',
  custom = 'Custom Polygons',
}

export enum CountryQueryCode {
  iso3066_2 = 'iso3066-2 (Subnational)',
  adm1 = 'Administration Level 1 (Subnational)',
  adm2 = 'Administration Level 2 (Subnational)',
  adm3 = 'Administration Level 3 (Subnational)',
  adm4 = 'Administration Level 4 (Subnational)',
  custom = 'Custom Polygons',
}

export interface UnicefMapStylesProps {
  height: number;
  width: number;
  headerFontSize: keyof typeof supersetTheme.typography.sizes;
  boldText: boolean;
}

interface UnicefMapCustomizeProps {
  headerText: string;
}

export type UnicefMapQueryFormData = QueryFormData &
  UnicefMapStylesProps &
  UnicefMapCustomizeProps;

export type UnicefMapProps = UnicefMapStylesProps &
  UnicefMapCustomizeProps & {
    data: TimeseriesDataRecord[];
    // add typing here for the props you pass in from transformProps.ts!
  };

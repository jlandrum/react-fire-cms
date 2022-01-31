import React from 'react';

export type OnDataSet = (data: any) => void;

export interface ComponentDefinition<T = any> {
  name: string;
  key: string;
  component: any;
  Editor: React.FC<{onDataSet: OnDataSet, data: T, meta?: T}>;
}
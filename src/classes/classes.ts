import { storeType, storeItem } from '../types/types';

export class StoreType implements storeType {
  name: string;
  type: string;
  identifier: string;
  constructor(name: string, identifier: string, type: string) {
    this.name = name;
    this.identifier = identifier;
    this.type = type;
  }
}

export class StoreItem implements storeItem {
  storeType: string;
  id: number;
  dimension: string;
  defaultOrderAmount: number;
  mainType: string = '';
  secondType: string = '';
  additionalDescriptions: string = '';
  orderDescription: string = '';
  name: string;
  constructor(
    storeType: string,
    name: string,
    id: number,
    dimension: string,
    mainType: string,
    secondType: string,
    defaultOrderAmount: number,
    additionalDescription: string,
  ) {
    this.storeType = storeType;
    this.name = name.toUpperCase();
    this.id = id;
    this.dimension = dimension;
    this.mainType = mainType.toUpperCase();
    this.secondType = secondType.toUpperCase();
    this.defaultOrderAmount = defaultOrderAmount;
    this.additionalDescriptions = additionalDescription;
  }
}

export class Tag {
  id: string;
  description: string;
  dimension: string;
  constructor(id: string, description: string, dimension: string) {
    this.id = id;
    this.description = description;
    this.dimension = dimension;
  }
}
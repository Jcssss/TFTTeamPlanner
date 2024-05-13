export type ItemType = {
    apiName: string,
    itemType: string,
    name: string,
    composition: string[],
    img: string,
    unique: boolean,
    incompatibleTraits: string[],
};

export type UnitType = {
    name: string, 
    cost: number, 
    img: string, 
    traits: string[],
    uid: number,
};

export type TraitType = {
    name: string, 
    img: string, 
    intervals: number[],
};

export type HexType = {
    champData: UnitType, 
    itemData: ItemType[]
}

export type HexDragData = {
    champData: UnitType, 
    itemData: ItemType[],
    row: number,
    column: number,
    img: string
}

export type DnDType = {
    type: string,
    data: Object,
}

export type ToAddType = any;


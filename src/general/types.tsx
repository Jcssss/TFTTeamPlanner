export type ItemType = {
    'apiName': string,
    "name": string,
    "composition": string[],
    "img": string,
    "unique": boolean,
    "incompatibleTraits": string[],
} | null;

export type UnitType = {
    "name": string, 
    "cost": number, 
    "img": string, 
    "traits": string[],
    "uid": number,
} | null;

export type TraitType = {
    "name": string, 
    "img": string, 
    "intervals": number[],
};

export type HexType = {
    'champData': UnitType, 
    'itemData': ItemType[]
}

export type DnDType = {
    type: string,
    data: Object,
}

export type ToAddType = any;


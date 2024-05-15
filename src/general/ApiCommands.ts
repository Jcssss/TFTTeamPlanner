import {UnitType, ItemType, TraitType, ToAddType} from './types';

// A list of the sets of items that we want to be ignored
const ignorableItems: string[] = [
    'TFT_Item_ThiefsGloves_Empty',
    'TFT_Item_BlankSlot',
    'TFT_Item_EmptyBag',
    'TFT_Item_JammedSlot',
    'TFT_Item_Unknown',
    'TFT_Item_UnusableSlot',
    'TFT9_Item_WorldEnder_DarkinBlade',
    'TFT9_Item_QuickdrawEmblem',
    'TFT9_Item_ShadowIslesEmblem',
    'TFT9_Item_ForsakenEmblem',
    'TFT9_Item_SeekerEmblem',
    'TFT9_Item_DeadeyeEmblem',
    'TFT9_Item_BaronsHead',
    'TFT9_Item_PiltoverCharges',
    'TFT9_Item_PiltoverProgress',
    'TFT_Item_YoumuusGhostblade',
    'TFT_Item_FreeBFSword',
    'TFT9_Item_CrownOfDemacia_DU',
    'TFT_Item_MortalReminder',
    'TFT_Item_SeraphsEmbrace',
    'TFT_Item_GrantTomeOfTraits',
    'TFT_Item_KnightsVow',
    'TFT_Item_TitanicHydra',
    'TFT_Item_DebugBase',
    'TFT_Item_DebugUnitID',
    'TFT_Item_DebugShield',
    'TFT_Item_DebugDamage',
    'TFT_Item_DebugStun',
    'TFT_Item_DebugMana',
    'TFT_Item_FreeDeathblade',
    'TFT_Item_DebugCrit',
    'TFT_Item_GrantOrnnAnvil',
    'TFT10_Item_DJ_Mode1',
    'TFT10_Item_DJ_Mode2',
    'TFT10_Item_DJ_Mode3',
    'TFT_Item_DebugDamageAmp',
    'TFT4_Item_OrnnRocketPropelledFist',
    'TFT_Item_ChainVest',
    'TFT_Item_RecurveBow',
    'TFT_Item_TearOfTheGoddess',
    'TFT_Item_NegatronCloak',
    'TFT_Item_SparringGloves',
    'TFT_Item_BFSword',
    'TFT_Item_NeedlesslyLargeRod',
    'TFT_Item_GiantsBelt',
    'TFT_Item_Spatula',
]

const ignorableUnits: {[key: number] : string[]} = {
    9.5: [],
    10: [],
    11: [
        'SightWard',
        'Golden Tree',
    ]
}

// Renames certain traits from the API for debugging
const replaceNames: {[key: number] : {[key: string]: string}} = {
    9.5 : {
        'Marksman': 'Gunner',
        'Armorclad':'Juggernaut',
        'Preserver':'Invoker'
    },
    10: {
        'CrowdDive': 'Crowd Diver',
        'PopBand': 'Heartsteel',
        'Funk': 'Disco',
        'Deadeye': 'Big Shot',
        'Brawler': 'Bruiser',
        'Quickshot': 'Rapidfire',
        'Fighter': 'Mosher',
        'PunkRock': 'Punk',
        'KDA': 'K/DA',
        '8Bit': '8-bit',
        'TrueDamage': 'True Damage'
    },
    11: {
        'InkShadow': 'Inkshadow'
    }
}

const replaceItemTypes: {[key: string]: string} = {
    TFT4_Item_OrnnObsidianCleaver: 'support'
}

const convertSetToString = (setNumber: number): string => {
    let setString = `TFTSet${Math.floor(setNumber)}`;
    if (Math.floor(setNumber) !== setNumber) {
        setString = setString + '_Stage2';
    }
    return setString;
};

// Replaces trait names with their correct counterparts
const substituteTraitNames = (
    item: ItemType, 
    currentSet: number
): string[] => {
    let incompatibleTraits: string[] = [];

    // For each of the items traits
    item && item.incompatibleTraits.forEach((name: string) => {
        name = name.split('_')[1];

        // If a replacement exists replace it
        if (name in replaceNames[currentSet]) {
            incompatibleTraits.push(replaceNames[currentSet][name]);
        } else {
            incompatibleTraits.push(name);
        }
    });

    return incompatibleTraits;
}

// Given the JSON file, extracts relevant info about the set's items
export const fetchItems = function(
    entireJson: ToAddType, 
    currentSet: number
): ItemType[] {
    let imgName = ''

    let itemList = entireJson.items.map((item: ToAddType): ItemType | null => { 
        imgName = item.icon;

        // Filters items from the current set or in the general bin
        if (item.apiName.includes(`TFT${Math.floor(currentSet)}_Item`) || 
            item.apiName.includes('TFT_Item') ||
            item.apiName.includes('TFT4_Item_Ornn')) {

            // Filters out unwanted items
            if( item.name != null && 
                !ignorableItems.includes(item.apiName) &&
                !item.apiName.toLowerCase().includes('orbs') && 
                !item.name.toLowerCase().includes('component') && 
                !item.name.toLowerCase().includes('item')) {
                
                let itemType = '';
                if (replaceItemTypes.hasOwnProperty(item.apiName)) {
                    itemType = replaceItemTypes[item.apiName];
                } else if (item.apiName.includes(`TFT${Math.floor(currentSet)}_Item`)) {
                    if (item.apiName.includes('EmblemItem')) {
                        itemType = 'emblem';
                    } else {
                        itemType = 'other';
                    }
                } else if (item.apiName.includes('TFT_Item_Artifact') ||
                           item.apiName.includes('TFT4_Item_Ornn')) {
                    itemType = 'artifact';
                } else if (item.apiName.includes('TFT_Item') &&
                           item.composition.length == 0){
                    itemType = 'support';
                } else {
                    itemType = 'normal';
                }

                // Tracks and returns relevant data in an object
                return ({
                    "apiName": item.apiName,
                    "itemType": itemType,
                    "name": item.name.replace('<br>', ''),
                    "composition": item.composition,
                    "img": item.icon.substring(0, imgName.length - 3).toLowerCase() + 'png',
                    "unique": item.unique,
                    "incompatibleTraits": substituteTraitNames(item, currentSet)
                })
            }
        }
        return null;
    });
    
    // filters out the null values and returns the list
    return itemList.filter((item: ItemType) => item)
}

// Given the entire JSON, extracts info about the set's units
export const fetchUnits = function(
    entireJson: ToAddType, 
    currentSet: number
): UnitType[] {
    let imgName = '';
    let setString = convertSetToString(currentSet);
    let alreadyAdded = [];

    let setData = entireJson.setData.filter((set: ToAddType) => {
        return set.mutator == setString
    })[0];

    // takes the latest data on champions and iterates through them
    let champList = setData.champions.map((champion: ToAddType): UnitType | null=> {

        // Removes unnecessary units
        if (!Object.values(champion.stats).includes(null) &&
            !(ignorableUnits[currentSet].includes(champion.name))) {
            
            imgName = champion.squareIcon;
            alreadyAdded.push(champion.name);

            // Extracts relevant data about the unit
            return ({ 
                "name": champion.name, 
                "cost": (champion.traits.length === 0)? 0 : champion.cost, 
                "img": imgName.substring(0, imgName.length - 3).toLowerCase() + 'png', 
                "traits": champion.traits,
                "uid": alreadyAdded.filter((str) => str === champion.name).length
            });
        }
        return null;
    });
    
    // filters out the null values and returns the list
    return champList.filter((champ: UnitType) => champ);
}

// Given the entire JSON, extracts info about the set's traits
export const fetchTraits = function(
    entireJson: ToAddType, 
    currentSet: number,
): TraitType[] {
    let imgName = '';
    let setString = convertSetToString(currentSet);

    let setData = entireJson.setData.filter((set: ToAddType) => {
        return set.mutator == setString
    })[0];

    // takes the latest data on traits and iterates through them
    let traitList = setData.traits.map((trait: ToAddType) => {
        imgName = trait.icon;

        // Extracts relevant data about the trait
        return ({ 
            "name": trait.name, 
            "img": imgName.substring(0, imgName.length - 3).toLowerCase() + 'png', 
            "intervals": trait.effects.map((int: ToAddType) => int.minUnits),
        })
    });
    
    // filters out the null values
    return traitList.filter((trait: TraitType) => trait);
}
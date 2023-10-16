// A list of the sets of items that we want to be ignored
const ignorableItems = [
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
    'TFT_Item_DebugMana'
]

// Given the JSON file, extracts relevant info about the set's items
export const fetchItems = function(entireJson) {
    var imgName = ''

    return entireJson.items.map((item) => { 
        imgName = item.icon;

        // Filters items from the current set or in the general bin
        if (item.apiName.includes('TFT9_Item') || item.apiName.includes('TFT_Item')) {

            // Filters out unwanted items
            if( item.name != null && 
                !ignorableItems.includes(item.apiName) &&
                !item.name.toLowerCase().includes('orb') && 
                !item.name.toLowerCase().includes('component') && 
                !item.name.toLowerCase().includes('item')) {
                    
                    // Tracks and returns relevant data in an object
                    return ({
                        "apiName": item.apiName,
                        "name": item.name.replace('<br>', ''),
                        "composition": item.composition,
                        "img": item.icon.substring(0, imgName.length - 3).toLowerCase() + 'png',
                        "unique": item.unique,
                        "incompatibleTraits": item.incompatibleTraits.map(trait => trait.split('_')[1])
                    })
            }
        }
        return null;
    
    // filters out the null values
    }).filter(item => item)
}

// Given the entire JSON, extracts info about the set's units
export const fetchUnits = function(entireJson) {
    var addedUnits = [];
    var imgName = '';

    // takes the latest data on champions and iterates through them
    return entireJson.setData['0'].champions.map((champion) => {

        // Removes unnecessary units
        if (!Object.values(champion.stats).includes(null) && 
            !addedUnits.includes(champion.name)) {
            
            imgName = champion.squareIcon;

            // Prevents duplicate units (Set 9 Ryze)
            addedUnits.push(champion.name)

            // Extracts relevant data about the unit
            return ({ 
                "name": champion.name, 
                "cost": (champion.traits.length === 0)? 0 : champion.cost, 
                "img": imgName.substring(0, imgName.length - 3).toLowerCase() + 'png', 
                "traits": champion.traits
            })
        }
        return null;
    
    // filters out the null values
    }).filter(champ => champ);
}

// Given the entire JSON, extracts info about the set's traits
export const fetchTraits = function(entireJson) {
    var imgName = '';

    // takes the latest data on traits and iterates through them
    return entireJson.setData['0'].traits.map((trait) => {
        imgName = trait.icon;

        // Extracts relevant data about the trait
        return ({ 
            "name": trait.name, 
            "img": imgName.substring(0, imgName.length - 3).toLowerCase() + 'png', 
            "intervals": trait.effects.map((int) => int.minUnits),
        })

    // filters out the null values
    }).filter(champ => champ);
}
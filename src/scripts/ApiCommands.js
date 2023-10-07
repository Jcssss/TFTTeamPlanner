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
]

export const fetchItems = function(entireJson) {
    var imgName = ''

    return entireJson.items.map((item) => { 
        imgName = item.icon;
        if (item.apiName.includes('TFT9_Item') || item.apiName.includes('TFT_Item')) {
            if(item.name != null && !ignorableItems.includes(item.apiName)) {
                if (!item.name.toLowerCase().includes('orb') && !item.name.toLowerCase().includes('component') && !item.name.toLowerCase().includes('item')) {
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
        }

        return null;
    }).filter(item => item)
}

export const fetchUnits = function(entireJson) {
    var addedUnits = [];
    var imgName = '';

    return entireJson.setData['0'].champions.map((champion) => {
        if (!Object.values(champion.stats).includes(null) && !addedUnits.includes(champion.name)) {
            imgName = champion.squareIcon;
            addedUnits.push(champion.name)
            return ({ 
                "name": champion.name, 
                "cost": (champion.traits.length === 0)? 0 : champion.cost, 
                "img": imgName.substring(0, imgName.length - 3).toLowerCase() + 'png', 
                "traits": champion.traits
            })
        }

        return null;
    }).filter(champ => champ);
}

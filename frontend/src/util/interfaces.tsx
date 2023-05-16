interface FoodInterface{
    _id: string,
    user: string,
    food: string,
    foodname: string,
    expiration_date: string,
    days_to_expire: number,
    status: string,
    freshness: string,

}



interface ShoppingListItemInterface{
    user?: string | undefined,
    food: string,
}

interface shoppingFoodInterface{
    user: string,
    food:string,
    _id:string
}


export type {
   FoodInterface,
   ShoppingListItemInterface,
   shoppingFoodInterface
};


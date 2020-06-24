export interface Product {
    name: string
    supplier: string
    price: number
    stock: number
}

export interface ProductWithId extends Product {
    id: string
}

// 参数 tnt 是核弹当量，单位千吨（kt）
// 返回值是半径，单位千米（km）
export function fireball(tnt?:number) {
    return tnt ? 0.045 * (tnt/1000) ** (1/3) : NaN;
}

export function heavyBlast(tnt?:number) {
    return tnt ? 0.45 * (tnt/1000) ** (1/3) : NaN;
}

export function nuclearRadiation(tnt?:number) {
    return tnt ? 1.2 * (tnt/1000) ** (1/3) : NaN;
}

export function thermalRadiation(tnt?:number) {
    return tnt ? 2.5 * (tnt/1000) ** (1/3) :NaN;
}
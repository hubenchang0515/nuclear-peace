export function play(file:string) {
    const audio = new Audio(file);
    audio.play();
}
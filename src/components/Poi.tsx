export class Poi {
  type: string = "Feature";
  geometry: {
    type: string,
    coordinates: [number,number]
  };
  properties!: Object;
  key: number;
  constructor(key: number, name: string, coord: [number,number]) {
    this.key = key;
    this.geometry = { "type": "Point", 'coordinates': coord }
    this.properties = { 'name': name }
  }
  get center() {
    return this.geometry!.coordinates;
  }
}

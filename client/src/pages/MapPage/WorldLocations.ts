export default class WorldLocations {
  public static locations: any[] = [];
  public static capitals: any[] = [];
  public static cities: any[] = [];

  // get location of cities and capitals
  public static getAll(): any[] {
    if (this.locations.length === 0) this.init();
    return this.locations;
  }

  // get location of cities
  public static getCities(): any[] {
    if (this.cities.length === 0) this.init();
    return this.cities;
  }

  // get location of capitals
  public static getCapitals(): any[] {
    if (this.capitals.length === 0) this.init();
    return this.capitals;
  }

  public static init(): any[] {
    this.locations = [
      {
        name: "大水窟山屋",
        lon: 121.05624,
        lat: 23.459336,
        elevation: 3227,
        water: 0,
        electricity: 0,
      },
      {
        name: "塔芬谷山屋",
        lon: 121.026735,
        lat: 23.419595,
        elevation: 2643,
        water: 0,
        electricity: 0,
      },
      {
        name: "轆轆谷山屋",
        lon: 121.006483,
        lat: 23.386039,
        elevation: 2978,
        water: 0,
        electricity: 0,
      },
      {
        name: "白洋金礦山屋",
        lon: 121.047367,
        lat: 23.487918,
        elevation: 3383,
        water: 0,
        electricity: 0,
      },
      {
        name: "中央金礦山屋",
        lon: 121.027458,
        lat: 23.486466,
        elevation: 2928,
        water: 0,
        electricity: 0,
      },
      {
        name: "巴奈伊克山屋",
        lon: 121.016489,
        lat: 23.487669,
        elevation: 2809,
        water: 0,
        electricity: 0,
      },
      {
        name: "觀高山屋",
        lon: 121.001992,
        lat: 23.502384,
        elevation: 2537,
        water: 0,
        electricity: 0,
      },
      {
        name: "樂樂山屋",
        lon: 120.958072,
        lat: 23.546048,
        elevation: 1694,
        water: 0,
        electricity: 0,
      },
      {
        name: "向陽山屋",
        lon: 120.984401,
        lat: 23.262574,
        elevation: 2849,
        water: 0,
        electricity: 0,
      },
      {
        name: "嘉明湖山屋",
        lon: 120.996908,
        lat: 23.283986,
        elevation: 3369,
        water: 0,
        electricity: 0,
      },
      {
        name: "拉庫音溪山屋",
        lon: 121.025769,
        lat: 23.328229,
        elevation: 2714,
        water: 0,
        electricity: 0,
      },
    ];

    this.capitals = this.locations.filter((city) => city.cap);
    this.cities = this.locations.filter((city) => !city.cap);
    return this.locations;
  }
}

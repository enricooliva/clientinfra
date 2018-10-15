export class AppConstants {
    public static get baseURL(): string { return "http://pcoliva.uniurb.it/"; }
    public static get apiVer(): string { return "api/v1"; }

    public static get baseApiURL(): string { return this.baseURL + this.apiVer; }
}

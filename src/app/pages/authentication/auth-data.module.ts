export interface AuthData {
    firstname: string,
    secondname: string,
    email: string,
    password: string,
    telnumber: string,
    addresses: string,
    birthday: Date | string,
    photo: string
}
export interface LoginData {
    email:String,
    password : String,
}
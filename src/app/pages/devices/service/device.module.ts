export interface Attribute {
    id: string;
    attribute: string;
    unit: string;
  }
export interface Device {
  id: string;
  location : string ;
  name : string ;
  type : string ;
  factory_id:string;
}
export interface DeviceAttributes {
  idattribute : string ;
  iddevice : string;
}
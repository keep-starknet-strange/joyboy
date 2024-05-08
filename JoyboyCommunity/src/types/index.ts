export interface IPostNote {
  id?:string;
  content?:string;
  author?:string;
  source?:string;
  image?:string;
}


export interface IProfileNostr {

  handle?:string;
  pubkey?:string;
  description?:string;
  source?:string,

}
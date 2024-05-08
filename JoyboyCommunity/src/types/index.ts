interface IPost {
  id:string;
  content?:string;
  author?:string;
  source?:string;
  image?:string;
}


interface IProfileNostr {

  handle?:string;
  pubkey?:string;
  description?:string;
  source?:string,

}
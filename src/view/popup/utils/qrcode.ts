///<reference path="../../../lib/qrcode.d.ts" />
export default function QRCodeDemo(div:Element,address:string)
{

  /**
   * 创建DOM 对象
   */
  this.content = div;
  this.code = document.createElement('div');
  // this.input = document.createElement('input');

  /**
   * 创建 二维码对象
   */
  this.qrcode = new QRCode
    (
      this.code,
      {
        width: 230,
        height: 230
      }
    );    
    this.content.innerHTML = "";
    this.content.appendChild(this.code);
    this.qrcode.makeCode(address); 
}
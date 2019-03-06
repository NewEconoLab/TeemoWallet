export default function HeadImgDemo(div: Element, address: string)
{

  /**
   * 创建DOM 对象
   */
  this.content = div;
  this.canvas = document.createElement("canvas");
  this.ctx = this.canvas.getContext('2d');

  this.canvas.height = 30;
  this.canvas.width = 30;
  this.xylist = [
    [10, 0, 20, 20],
    [0, 0, 5, 15],
    [0, 0, 10, 10],
    [10, 0, 20, 10],
    [0, 11, 20, 10],
    [9, 0, 11, 15],
    [5, 0, 20, 10],
    [0, 0, 5, 5],
    [10, 0, 11, 5],
    [10, 11, 20, 10],
    [0, 0, 5, 15]
  ]
  this.colorlist = [
    'DBA4A4',
    'DBBEA4',
    'DBD2A4',
    'C9DBA4',
    'B3DBA4',
    'A4DBB8',
    'A4DBCD',
    'A4CEDB',
    'A4AEDB',
    'BAA4DB',
    'D7A4DB',
    'DBA4BA',
    'E57DA7',
    'D87DE5',
    '7E7DE5',
    '7DBDE5',
    '7DE5BD',
    '88E57D',
    'DFE57D',
    'E5AE7D'
  ]
  
  this.content.innerHTML = "";
  this.content.appendChild(this.canvas);
  let bty = ThinNeo.Helper.GetPublicKeyScriptHash_FromAddress(address);
  draw((bty[11] % 12), (bty[2] % 21), (bty[7] % 21), (bty[18] % 21), bty[7], bty[2], bty[17]);
}
const draw = (a, b, c, d, e, f, g) =>
{
  const PI = Math.PI;

  let gr1 = this.ctx.createLinearGradient(this.xylist[a][0], this.xylist[a][1], this.xylist[a][2], this.xylist[a][3]);
  gr1.addColorStop(0, `#${this.colorlist[b]}`);
  gr1.addColorStop(0.5, `#${this.colorlist[c]}`);
  gr1.addColorStop(1, `#${this.colorlist[d]}`);
  this.ctx.fillStyle = gr1;

  this.ctx.save();
  this.ctx.beginPath();
  this.ctx.moveTo(100, 100);
  this.ctx.arc(15, 15, 15, PI * 4 / 4, 120, false);
  this.ctx.closePath();
  this.ctx.restore();
  this.ctx.fill();
}

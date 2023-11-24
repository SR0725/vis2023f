function _1(md){return(
md`# HW6`
)}

function _artistPublicData(FileAttachment){return(
FileAttachment("artistPublic.csv").csv()
)}

function _artistVerData(FileAttachment){return(
FileAttachment("artistVer.csv").csv()
)}

function _yCounts(){return(
[]
)}

function _5(yCounts,artistVerData,artistPublicData)
{
  yCounts.length = 0;

  for (let index = 0; index < 5; ++index) {
    yCounts.push({x:index+1,type:"ver", count:0}); 
    yCounts.push({x:index+1,type:"public", count:0}); 
  }

  artistVerData.forEach (x => {
    yCounts[(Number(x["4） 您對於聯合國永續發展目標（SDGs）的瞭解在那個相對位置？"])-1)*2].count ++
  })
  
  artistPublicData.forEach (x => {
    yCounts[(Number(x["4）從1到5級距，您認為藝術產業的碳排放量在那個相對位置？"])-1)*2+1].count ++
  })
  return yCounts
}


function _plot(Inputs){return(
Inputs.form({
	display:  Inputs.checkbox(['artist','artistPublic'], { label: "display" }),
})
)}

function _7(Plot,plot,yCounts){return(
Plot.plot({
  grid: true,
  y: {label: "count"},
  marks: [
    Plot.ruleY([0]),
    Plot.barY([
      ...plot.display.includes("artist")
        ? yCounts.filter((d) => d.type === "ver")
        : [],
      ...plot.display.includes("artistPublic")
        ? yCounts.filter((d) => d.type === "public")
        : [],
    ]
              , {x: 'x', y: "count", tip: true , fill:"type"}),
  ],
})
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["artistPublic.csv", {url: new URL("./files/41a9c6bfdf8907c7f19b5a52517012d51d11afcdf769218a6b5c1af5288c865ca2bf10f0fdac5144f8d3676054b833c736642053e880c85ec6123fb15744ae7f.csv", import.meta.url), mimeType: "text/csv", toString}],
    ["artistVer.csv", {url: new URL("./files/363ea43eed3c6a6a6fed83d3e26ac23641da56f4f0689da720760208af84f1c3caff531322fc2ceeaf3924e4ff2f0ca4314a49adfe0e45701c6687fc36ee24d3.csv", import.meta.url), mimeType: "text/csv", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("artistPublicData")).define("artistPublicData", ["FileAttachment"], _artistPublicData);
  main.variable(observer("artistVerData")).define("artistVerData", ["FileAttachment"], _artistVerData);
  main.variable(observer("yCounts")).define("yCounts", _yCounts);
  main.variable(observer()).define(["yCounts","artistVerData","artistPublicData"], _5);
  main.variable(observer("viewof plot")).define("viewof plot", ["Inputs"], _plot);
  main.variable(observer("plot")).define("plot", ["Generators", "viewof plot"], (G, _) => G.input(_));
  main.variable(observer()).define(["Plot","plot","yCounts"], _7);
  return main;
}

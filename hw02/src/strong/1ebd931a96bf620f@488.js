function _1(md){return(
md`# HW02 Strong baseline (2pt)`
)}

function _2(md){return(
md`## 以 bar chart 呈現每個星座的人數，用顏色表示性別`
)}

function _3(md){return(
md`## 資料處理`
)}

function _data(FileAttachment){return(
FileAttachment("data.json").json()
)}

function _yCounts(){return(
[]
)}

function _stars(data){return(
data.map(item => item.Constellation)
)}

function _starNames(){return(
["牡羊座", "金牛座", "雙子座", "巨蟹座", "獅子座", "處女座", "天秤座", "天蠍座", "射手座", "摩羯座", "水瓶座", "雙魚座"]
)}

function _8(yCounts,stars,data)
{
  yCounts.length = 0; //將yCounts清空
  
  var minStar = Math.min(...stars); //最早出生年
  var maxStar = Math.max(...stars); //最晚出生年

  var starNames = ["牡羊座", "金牛座", "雙子座", "巨蟹座", "獅子座", "處女座", "天秤座", "天蠍座", "射手座", "摩羯座", "水瓶座", "雙魚座"];

  for (var y=minStar; y<=maxStar; y++) { 
    //所有年份都建立兩個Object，一個存放男性資料，一個存放女性資料
    
    yCounts.push({star:starNames[y], gender:"male", count:0}); 
    //Object包含：1. 星座，2.男性，3.人數(設為0)
    
    yCounts.push({star:starNames[y], gender:"female", count:0}); 
    //Object包含：1. 星座，2.女性，3.人數(設為0)

  }

  data.forEach (x=> {
    var i = (x.Constellation-minStar)*2 + (x.Gender== "男" ? 0 : 1); 
    yCounts[i].count++;
    //讀取data array，加總每個 星座 出生的人
  })
  
  return yCounts
}


function _9(Plot,starNames,yCounts){return(
Plot.plot({
  grid: true,
  y: {label: "count"},
  x: {label: "Constellation", domain: starNames}, 
  marks: [
    Plot.ruleY([0]),
    Plot.barY(yCounts, {x: "star", y: "count", tip: true , fill:"gender"}),
  ]
})
)}

function _10(md){return(
md`## 以 histogram 呈現每個星座的人數，用顏色表示性別
`
)}

function _11(md){return(
md`### 資料處理`
)}

function _newData(data,starNames){return(
data.map(item => {
  return {...item, Constellation: starNames[item.Constellation]};
})
)}

function _13(Plot,data,starNames){return(
Plot.plot({
  width:800,
  y: {grid: true, label: "count"},
  x: {label: "Constellation"},
  marks: [
    Plot.rectY(data, Plot.binX({y: "count"  }, {x: "Constellation", interval:1, fill:"Gender", tip: true} ), ),
    Plot.axisX({
      tickFormat: d => {
        return starNames[d]; 
      },
    }),
    Plot.ruleY([0]),
    
  ],
  
})
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["data.json", {url: new URL("../data.json", import.meta.url), mimeType: "application/json", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["md"], _2);
  main.variable(observer()).define(["md"], _3);
  main.variable(observer("data")).define("data", ["FileAttachment"], _data);
  main.variable(observer("yCounts")).define("yCounts", _yCounts);
  main.variable(observer("stars")).define("stars", ["data"], _stars);
  main.variable(observer("starNames")).define("starNames", _starNames);
  main.variable(observer()).define(["yCounts","stars","data"], _8);
  main.variable(observer()).define(["Plot","starNames","yCounts"], _9);
  main.variable(observer()).define(["md"], _10);
  main.variable(observer()).define(["md"], _11);
  main.variable(observer("newData")).define("newData", ["data","starNames"], _newData);
  main.variable(observer()).define(["Plot","data","starNames"], _13);
  return main;
}

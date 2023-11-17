function _1(md) {
  return md`
# HW2 Strong baseline
  `;
}

function _data(FileAttachment) {
  return FileAttachment("../data.json").json();
}

function _ZodiacSigns() {
  return [
    "牡羊座",
    "金牛座",
    "雙子座",
    "巨蟹座",
    "獅子座",
    "處女座",
    "天秤座",
    "天蠍座",
    "射手座",
    "摩羯座",
    "水瓶座",
    "雙魚座",
  ];
}

function _yCounts() {
  return [];
}

function _years(data) {
  return data.map((item) => item.Year);
}

function _6(yCounts, ZodiacSigns, data) {
  yCounts.length = 0; //將yCounts清空

  ZodiacSigns.forEach((sign) => {
    yCounts.push({ sign, gender: "male", count: 0 });
    yCounts.push({ sign, gender: "female", count: 0 });
  });

  data.forEach((x) => {
    const i = x.Constellation * 2 + (x.Gender == "男" ? 0 : 1);

    yCounts[i].count++;
  });
  return yCounts;
}

function _plot3(Inputs) {
  return Inputs.form({
    mt: Inputs.range([0, 100], { label: "marginTop", step: 1 }),
    mr: Inputs.range([0, 100], { label: "marginRight", step: 1 }),
    mb: Inputs.range([0, 100], { label: "marginBottom", step: 1 }),
    ml: Inputs.range([0, 100], { label: "marginLeft", step: 1 }),
  });
}

function _8(Plot, plot3, ZodiacSigns, yCounts) {
  return Plot.plot({
    marginTop: plot3.mt,
    marginRight: plot3.mr,
    marginBottom: plot3.mb,
    marginLeft: plot3.ml,
    grid: true,
    x: {
      domain: ZodiacSigns, // 設置 x 軸的顯示順序為 zodiacSigns 中的順序
    },
    y: { label: "count" },
    marks: [
      Plot.ruleY([0]),
      Plot.barY(yCounts, { x: "sign", y: "count", tip: true, fill: "gender" }),
    ],
  });
}

function _mapConstellationToChinese(ZodiacSigns) {
  return function mapConstellationToChinese(constellationIndex) {
    return ZodiacSigns[constellationIndex];
  };
}

function _10(Plot, plot3, mapConstellationToChinese, data) {
  return Plot.plot({
    marginTop: plot3.mt,
    marginRight: plot3.mr,
    marginBottom: plot3.mb,
    marginLeft: plot3.ml,
    x: {
      tickFormat: (d) => mapConstellationToChinese(d - 1),
      label: "星座",
    },
    y: { grid: true, label: "count" },
    marks: [
      Plot.rectY(
        data,
        Plot.binX(
          { y: "count" },
          { x: "Constellation", interval: 1, fill: "Gender", tip: true }
        )
      ),
      Plot.gridY({ interval: 1, stroke: "white", strokeOpacity: 0.5 }),
    ],
  });
}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() {
    return this.url;
  }
  const fileAttachments = new Map([
    [
      "data.json",
      {
        url: new URL(
          "./files/2259824662fb612853b8873b8814ace51e8cbac39ba881850d66e26df63f1897b01d1bd3459af6529669fd912da9dd607a30666a93278d7fdfa10bbe22b8913d.json",
          import.meta.url
        ),
        mimeType: "application/json",
        toString,
      },
    ],
  ]);
  main.builtin(
    "FileAttachment",
    runtime.fileAttachments((name) => fileAttachments.get(name))
  );
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("data")).define("data", ["FileAttachment"], _data);
  main.variable(observer("ZodiacSigns")).define("ZodiacSigns", _ZodiacSigns);
  main.variable(observer("yCounts")).define("yCounts", _yCounts);
  main.variable(observer("years")).define("years", ["data"], _years);
  main.variable(observer()).define(["yCounts", "ZodiacSigns", "data"], _6);
  main
    .variable(observer("viewof plot3"))
    .define("viewof plot3", ["Inputs"], _plot3);
  main
    .variable(observer("plot3"))
    .define("plot3", ["Generators", "viewof plot3"], (G, _) => G.input(_));
  main
    .variable(observer())
    .define(["Plot", "plot3", "ZodiacSigns", "yCounts"], _8);
  main
    .variable(observer("mapConstellationToChinese"))
    .define(
      "mapConstellationToChinese",
      ["ZodiacSigns"],
      _mapConstellationToChinese
    );
  main
    .variable(observer())
    .define(["Plot", "plot3", "mapConstellationToChinese", "data"], _10);
  return main;
}

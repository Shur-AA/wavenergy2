import colorbrewer from 'colorbrewer';
import $ from 'jquery';
import Feature from 'ol/Feature';
import Map from 'ol/Map';
import View from 'ol/View';
import Point from 'ol/geom/Point';
import { Vector as VectorLayer } from 'ol/layer.js';
import 'ol/ol.css';
import Vector from 'ol/source/Vector.js';
import 'ol/style';
import { Circle, Fill, Stroke, Style } from 'ol/style';
import * as tools from './components/maps_legend_builder';

var fun = require('./components/functions');
var layers = require('./components/layers');
var render_rose = require('./components/roserender');
var render_hist = require('./components/gistrender');
var baseWFSWMS = require('./components/base_layers_wfs');

function insert_legend(palette, from, to, by, id = 'td00') {
  document.getElementById(id).innerHTML = "";
  tools.layeredColoring(0, 0,
    fun.get_colors(palette, from, to, by),
    false, [30, 15], false,
    fun.get_values(from, to, by), "8pt Arial", "black", 30, 20,
    false, "", "bold 10pt Arial");
}

// insert clicked point
var addMarker = function (coordinates) {

  map.getLayers().forEach(function (layer) {
    if (layer.get('name') == 'xaxa') {
      map.removeLayer(layer);
    }
  });
  var fill = new Fill({
    color: 'yellow'
  });
  var stroke = new Stroke({
    color: 'red',
    width: 1
  });
  var style = new Style({
    image: new Circle({
      fill: fill,
      stroke: stroke,
      radius: 4
    }),
    fill: fill,
    stroke: stroke
  });
  var point_feature = new Feature({});
  var point_geom = new Point(coordinates);
  point_feature.setGeometry(point_geom);
  var vector_layer = new VectorLayer({
    name: 'xaxa',
    source: new Vector({
      features: [point_feature],
    })
  })
  vector_layer.setStyle(style);

  map.addLayer(vector_layer);
}


var center = [115, 63];




const map = new Map({
  target: 'map',
  layers: [
    layers.hs_lyr_group,
    baseWFSWMS.base110_lyr_group_bottom,
    baseWFSWMS.base50_lyr_group_bottom,
    baseWFSWMS.base10_lyr_group_bottom,
    baseWFSWMS.base110_lyr_group_top,
    baseWFSWMS.base50_lyr_group_top,
    baseWFSWMS.base10_lyr_group_top,

  ],
  view: new View({
    projection: 'EPSG:4326',
    center: center,
    zoom: 3,
  })
});


var coordinate = 0;
map.on('click', function (evt) {
  coordinate = evt.coordinate;
  // console.log(coordinate);
  addMarker(coordinate);
  var htbox = document.getElementsByClassName("tb-checkbox");
  htbox[0].checked = false;
  render_rose.render_rose(coordinate[1], coordinate[0]);
  render_hist.render_hist(coordinate[1], coordinate[0], 50);
  htbox[0].addEventListener('change', function (event) {
    if (htbox[0].checked) {
      render_hist.render_hist(coordinate[1], coordinate[0], 100);
    } else {
      render_hist.render_hist(coordinate[1], coordinate[0], 50);
    }
  });
  let coors_var = document.getElementById("coords-display");
  coors_var.innerHTML = 'Latitude: ' + coordinate[1].toFixed(2) + '°<br>' + 'Longitude: ' + coordinate[0].toFixed(2) + '°';
});


map.on('singleclick', function (evt) {
  const [lon, lat] = evt.coordinate;
  $.ajax({
    url: process.env.BACKEND_URL,
    type: "POST",
    data: JSON.stringify({
      "lon": lon,
      "lat": lat,
      "type": "voronoi"
    }),
    success: function (result) {
      console.log(result)
      if (result.length) {
        var table = document.getElementsByClassName("ww-table");
        document.getElementById("sea_name").innerHTML =
          result[0]['sea_en'] + '<hr class="uk-divider-small">';
        document.getElementById("wave_height").innerHTML =
          parseFloat(result[0]['hsr']).toFixed(2);
        document.getElementById("wave_lenght").innerHTML =
          parseFloat(result[0]['lsr']).toFixed(2);
        document.getElementById("wave_period").innerHTML =
          parseFloat(result[0]['psr']).toFixed(2);
        document.getElementById("wave_energy").innerHTML =
          parseFloat(result[0]['esr']).toFixed(2);
        document.getElementById("wave_maxh").innerHTML =
          parseFloat(result[0]['hs']).toFixed(2);
        var h3p_result = parseFloat(result[0]['h3p']).toFixed(2);
        if (h3p_result == 0) {
          document.getElementById("wave_maxh3p").innerHTML = ''
        } else {
          document.getElementById("wave_maxh3p").innerHTML =
            h3p_result;
        };
        document.getElementById("wind_spd50").innerHTML =
          parseFloat(result[0]['spd_50']).toFixed(2);
        document.getElementById("wind_spd100").innerHTML =
          parseFloat(result[0]['spd_100']).toFixed(2);
        document.getElementById("wind_grp50").innerHTML =
          parseFloat(result[0]['grp_50']).toFixed(2);
        document.getElementById("wind_grp100").innerHTML =
          parseFloat(result[0]['grp_100']).toFixed(2);
        table[0].style.visibility = 'visible';
      } else {
        document.getElementById("sea_name").innerHTML = '';
        document.getElementById("wave_height").innerHTML = '';
        document.getElementById("wave_lenght").innerHTML = '';
        document.getElementById("wave_period").innerHTML = '';
        document.getElementById("wave_energy").innerHTML = '';
        document.getElementById("wave_maxh").innerHTML = '';
        document.getElementById("wave_maxh3p").innerHTML = '';
      }
    }
  })
});

// ********************SUPPLY TABLE CHANGE******************

$("#period_input").on('change', e => {
  var changejson = {
    "period_in": $("#period_input")[0].value,
    "operator": $("#greater_less1")[0].value,
    "type": "supperiod"
  };
  var url = process.env.BACKEND_URL;
  $.ajax({
    url: url,
    type: "POST",
    data: JSON.stringify(changejson),
    success: function (data) {
      document.getElementById("periodsup_value").innerHTML = data[0].supply + ' %';
    }
  })
});


$("#greater_less1").on('change', e => {
  var v = document.getElementById("periodsup_value").innerHTML;
  v = Number((100 - parseFloat(v)).toFixed(1))
  document.getElementById("periodsup_value").innerHTML = v + ' %';
}
);


$("#energy_input").on('change', e => {
  var changejson = {
    "energy_in": $("#energy_input")[0].value,
    "operator": $("#greater_less2")[0].value,
    "type": "supenergy"
  };
  var url = process.env.BACKEND_URL;
  $.ajax({
    url: url,
    type: "POST",
    data: JSON.stringify(changejson),
    success: function (data) {
      document.getElementById("energysup_value").innerHTML = data[0].supply + ' %';
    }
  })
});

$("#greater_less2").on('change', e => {
  var v = document.getElementById("energysup_value").innerHTML;
  v = Number((100 - parseFloat(v)).toFixed(1))
  document.getElementById("energysup_value").innerHTML = v + ' %';
}
);

$("#len_input").on('change', e => {
  var changejson = {
    "wlen_in": $("#len_input")[0].value,
    "operator": $("#greater_less3")[0].value,
    "type": "suplen"
  };
  var url = process.env.BACKEND_URL;
  $.ajax({
    url: url,
    type: "POST",
    data: JSON.stringify(changejson),
    success: function (data) {
      document.getElementById("lensup_value").innerHTML = data[0].supply + ' %';
    }
  })
});

$("#greater_less3").on('change', e => {
  var v = document.getElementById("lensup_value").innerHTML;
  v = Number((100 - parseFloat(v)).toFixed(1))
  document.getElementById("lensup_value").innerHTML = v + ' %';
}
);

$("#hsig_input").on('change', e => {
  var changejson = {
    "hsig_in": $("#hsig_input")[0].value,
    "operator": $("#greater_less4")[0].value,
    "type": "supsig"
  };
  var url = process.env.BACKEND_URL;
  $.ajax({
    url: url,
    type: "POST",
    data: JSON.stringify(changejson),
    success: function (data) {
      document.getElementById("hsigsup_value").innerHTML = data[0].supply + ' %';
    }
  })
});

$("#greater_less4").on('change', e => {
  var v = document.getElementById("hsigsup_value").innerHTML;
  v = Number((100 - parseFloat(v)).toFixed(1));
  document.getElementById("hsigsup_value").innerHTML = v + ' %';
}
);



// ********************SUPPLY TABLE CHANGE END************************

function ready() {
  function drawMapName(intext) {
    const mapname = document.getElementsByClassName('curchoice');
    mapname[0].textContent = intext;
  };


  drawMapName('MAXIMUM SIGNIFICANT WAVE HEIGHT, M');

  var cur_var = layers.hs_lyr_group;
  // const lili = document.getElementsByClassName('uk-dropdown-nav');
  const lili = document.getElementById('dropdown-nav');
  lili.addEventListener('click', function (event) {
    event.preventDefault();
    let selection = event.target.parentElement;
    var MapRequestId = selection.id;
    drawMapName(selection.innerText);
    let lis = lili.childNodes;
    lis.forEach((item) => {
      if (item.classList) {
        if (item.classList.contains('uk-active')) {
          item.classList.remove('uk-active')
        }
      }
    });
    selection.classList.add('uk-active');

    // console.log(cur_var);
    map.removeLayer(cur_var);
    var level = 1;

    switch (MapRequestId) {
      case 'hs':
        cur_var = layers.hs_lyr_group;
        insert_legend(colorbrewer.RdPu, 0, 18, 1);
        break;
      case 'h3p':
        cur_var = layers.h3p_lyr_group;
        insert_legend(colorbrewer.PuRd, 0, 26, 2);
        break;
      case 'hsr':
        cur_var = layers.hsr_lyr_group;
        insert_legend(colorbrewer.OrRd, 0, 3.2, 0.2);
        break;
      case 'lsr':
        cur_var = layers.lsr_lyr_group;
        insert_legend(colorbrewer.Blues, 0, 140, 10);
        break;
      case 'psr':
        cur_var = layers.psr_lyr_group;
        insert_legend(colorbrewer.Greens, 0, 6, 0.5);
        break;
      case 'esr':
        cur_var = layers.esr_lyr_group;
        insert_legend(colorbrewer.YlGnBu, 0, 65, 5);
        break;
      case 'emax':
        cur_var = layers.emax_lyr_group;
        insert_legend(colorbrewer.YlOrBr, 0, 4000, 250);
        break;
      case 'osr':
        cur_var = layers.osr_lyr_group;
        insert_legend(colorbrewer.YlGn, 0, 100, 10);
        break;
      case 'wind_grp_50':
        cur_var = layers.wind_grp_50_lyr_group;
        insert_legend(colorbrewer.PuBuGn, 0, 1200, 100);
        level = 4;
        break;
      case 'wind_grp_100':
        cur_var = layers.wind_grp_100_lyr_group;
        insert_legend(colorbrewer.PuBuGn, 0, 1200, 100);
        level = 4;
        break;
      case 'wind_grp_50c':
        cur_var = layers.wind_grp_50c_lyr_group;
        insert_legend(colorbrewer.PuBuGn, 0, 1800, 100);
        level = 4;
        break;
      case 'wind_grp_100c':
        cur_var = layers.wind_grp_100c_lyr_group;
        insert_legend(colorbrewer.PuBuGn, 0, 1800, 100);
        level = 4;
        break;
      case 'wind_spd_50c_year':
        cur_var = layers.wind_spd_50c_lyr_group;
        insert_legend(colorbrewer.PuBuGn, 0, 12, 1);
        level = 4;
        break;
      case 'wind_spd_100c_year':
        cur_var = layers.wind_spd_100c_lyr_group;
        insert_legend(colorbrewer.PuBuGn, 0, 12, 1);
        level = 4;
        break;

    }

    map.getLayers().insertAt(level, cur_var);

  });

  tools.tablesInit(1, [1], "legendplace");
  insert_legend(colorbrewer.RdPu, 0, 18, 1);

  const closeBut = document.getElementsByClassName('fa-window-minimize');
  closeBut[0].addEventListener('click', function (event) {
    let rg = document.getElementsByClassName('rose-graphic');
    rg[0].style.visibility = 'hidden';
    let rtitle = document.getElementsByClassName('rose-title');
    rtitle[0].style.visibility = 'hidden';
    let prnt = document.getElementsByClassName('graphics');
    prnt[0].style.justifyContent = 'start';
    prnt[0].style.paddingLeft = '4px';
  })
  closeBut[1].addEventListener('click', function (event) {
    let fg = document.getElementsByClassName('freq-graphic');
    fg[0].style.visibility = 'hidden';
    let ftitle = document.getElementsByClassName('freq-title');
    ftitle[0].style.visibility = 'hidden';
    let prnt = document.getElementsByClassName('graphics');
    prnt[0].style.justifyContent = 'start';
    prnt[0].style.paddingLeft = '4px';
  })
  closeBut[0].addEventListener('click', function (event) {
    let tbl = document.getElementsByClassName('ww-table');
    tbl[0].style.visibility = 'hidden';
  })
};
document.addEventListener("DOMContentLoaded", ready);



const addsf = document.getElementById('freq-graphic');
addsf.addEventListener('mouseover', function (event) {
  let ftitle = document.getElementsByClassName('freq-title');
  ftitle[0].style.visibility = 'hidden';
});
addsf.addEventListener('mouseout', function (event) {
  let ftitle = document.getElementsByClassName('freq-title');
  let fg = document.getElementsByClassName('freq-graphic');
  if (fg[0].style.visibility == 'visible') {
    ftitle[0].style.visibility = 'visible';
  };
});

const addsr = document.getElementById('rose-graphic');
addsr.addEventListener('mouseover', function (event) {
  let rtitle = document.getElementsByClassName('rose-title');
  rtitle[0].style.visibility = 'hidden';
});
addsr.addEventListener('mouseout', function (event) {
  let rtitle = document.getElementsByClassName('rose-title');
  let rg = document.getElementsByClassName('rose-graphic');
  if (rg[0].style.visibility == 'visible') {
    rtitle[0].style.visibility = 'visible';
  };
});


//Zoom to the sea extent

const lisea = document.getElementById('dropdown-seas');
lisea.addEventListener('click', function (event) {
  event.preventDefault();
  let selection = event.target.parentElement;
  var SeaRequestId = selection.id;
  let lis = lisea.childNodes;
  lis.forEach((item) => {
    if (item.classList) {
      if (item.classList.contains('uk-active')) {
        item.classList.remove('uk-active')
      }
    }
  });
  selection.classList.add('uk-active');

  // console.log(cur_var);
  // map.getView().fit([35, 40, 60, 68]);
  var sea_extent = [];

  switch (SeaRequestId) {
    case 'ArcticO':
      sea_extent = [18, 63, 117, 82];
      break;
    case 'PaсificO':
      sea_extent = [125, 32, 207, 66];
      break;
    case 'BarentzS':
      sea_extent = [16, 63, 70, 82];
      break;
    case 'WhiteS':
      sea_extent = [31, 63, 45, 68];
      break;
    case 'KarskoeS':
      sea_extent = [54, 67, 117, 82];
      break;
    case 'LaptevS':
      sea_extent = [102, 70, 143, 82];
      break;
    case 'ChukchiS':
      sea_extent = [174, 66, 202, 78];
      break;
    case 'EastSibS':
      sea_extent = [140, 68, 177, 82];
      break;
    case 'BeringS':
      sea_extent = [160, 50, 207, 66];
      break;
    case 'OhotskS':
      sea_extent = [133, 43, 165, 63];
      break;
    case 'JapanS':
      sea_extent = [125, 32, 143, 53];
      break;
    case 'AtlanticO':
      sea_extent = [8, 40, 44, 67];
      break;
    case 'AzovS':
      sea_extent = [34, 45, 40, 48];
      break;
    case 'BalticS':
      sea_extent = [8, 53, 31, 67];
      break;
    case 'BlackS':
      sea_extent = [26, 40, 44, 48];
      break;
    case 'KaspyS':
      sea_extent = [46, 36, 56, 48];
      break;
    case 'AllSeas':
      sea_extent = [8, 32, 207, 82];
      break;
  }
  console.log(sea_extent);
  map.getView().fit(sea_extent);
});
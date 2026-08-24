import colorbrewer from 'colorbrewer';
import GeoJSON from 'ol/format/GeoJSON';
import { Group, Vector as VectorLayer } from 'ol/layer.js';
import VectorSource from 'ol/source/Vector.js';
import { Fill, Stroke, Style } from 'ol/style';


var styles = require('../appearence/styles');
var fun = require('./functions');


var epsg = 4326;

var host = process.env.GEOSERVER_URL;

function vector_source(host, name, epsg = 4326) {
  return new VectorSource({
    format: new GeoJSON(),
    url: `${host}/wavenergy/ows?service=wfs&version=1.1.0&request=GetFeature&typename=${name}&outputFormat=application/json&srsname=EPSG:${epsg}`
  });
}

var hs_lyr_group = new Group({
  combine: true,
  visible: true,
  title: 'Значительная высота волны',
  name: 'hs',
  layers: [
    new VectorLayer({
      style: function (feature, resolution) {
        var z = feature.get('z_mean');
        return new Style({
          fill: new Fill({
            color: fun.get_color(colorbrewer.RdPu, z, 0, 18, 1)
          })
        })
      },
      source: vector_source(host, 'wavenergy:hs_band_big', epsg)
    }),
    new VectorLayer({
      style: styles.cont_style,
      source: vector_source(host, 'wavenergy:hs_iso_big', epsg)
    }),
    new VectorLayer({
      declutter: true,
      style: styles.cont_label_style,
      source: vector_source(host, 'wavenergy:hs_iso_big', epsg)
    }),
    new VectorLayer({
      style: function (feature, resolution) {
        var z = feature.get('z_mean');
        return new Style({
          fill: new Fill({
            color: fun.get_color(colorbrewer.RdPu, z, 0, 18, 1)
          })
        })
      },
      source: vector_source(host, 'wavenergy:azov_10_hsig_plg', epsg)
    }),
    new VectorLayer({
      style: styles.cont_style,
      source: vector_source(host, 'wavenergy:azov_10_hsig_iso', epsg)
    }),
    new VectorLayer({
      declutter: true,
      style: styles.cont_label_style,
      source: vector_source(host, 'wavenergy:azov_10_hsig_iso', epsg)
    }),
    new VectorLayer({
      style: function (feature, resolution) {
        var z = feature.get('z_mean');
        return new Style({
          fill: new Fill({
            color: fun.get_color(colorbrewer.RdPu, z, 0, 18, 1)
          })
        })
      },
      source: vector_source(host, 'wavenergy:maxs_02_50_plg_ws', epsg)
    }),
    new VectorLayer({
      style: styles.cont_style,
      source: vector_source(host, 'wavenergy:maxs_02_50_iso_ws', epsg)
    }),
    new VectorLayer({
      declutter: true,
      style: styles.cont_label_style,
      source: vector_source(host, 'wavenergy:maxs_02_50_iso_ws', epsg)
    })
  ]
})

var h3p_lyr_group = new Group({
  combine: true,
  visible: true,
  title: 'Значительная высота волны',
  name: 'h3p',
  layers: [
    new VectorLayer({
      style: function (feature, resolution) {
        var z = feature.get('z_mean');
        return new Style({
          fill: new Fill({
            color: fun.get_color(colorbrewer.PuRd, z, 0, 26, 2)
          })
        })
      },
      source: vector_source(host, 'wavenergy:h3p_band', epsg)
    }),
    new VectorLayer({
      style: styles.cont_style,
      source: vector_source(host, 'wavenergy:h3p_cont', epsg)
    }),
    new VectorLayer({
      declutter: true,
      style: styles.cont_label_style,
      source: vector_source(host, 'wavenergy:h3p_cont', epsg)
    }),
    new VectorLayer({
      style: function (feature, resolution) {
        var z = feature.get('z_mean');
        return new Style({
          fill: new Fill({
            color: fun.get_color(colorbrewer.PuRd, z, 0, 26, 2)
          })
        })
      },
      source: vector_source(host, 'wavenergy:dv_h1p_plg', epsg)
    }),
    new VectorLayer({
      style: styles.cont_style,
      source: vector_source(host, 'wavenergy:dv_h1p_ln', epsg)
    }),
    new VectorLayer({
      declutter: true,
      style: styles.cont_label_style,
      source: vector_source(host, 'wavenergy:dv_h1p_ln', epsg)
    })
  ]
});

// color crutch
var hsr_colors = fun.get_colors(colorbrewer.OrRd, 0, 3.2, 0.2);
var bin_number = function (z, min, step) {
  var bin_num = Math.floor((z - min) / step);
  return bin_num
}

var hsr_lyr_group = new Group({
  combine: true,
  visible: true,
  name: 'hsr',
  layers: [
    new VectorLayer({
      style: function (feature, resolution) {
        var z = feature.get('z_mean');
        return new Style({
          fill: new Fill({
            // color: fun.get_color(colorbrewer.OrRd, z, 0, 2.6, 0.2)
            color: hsr_colors[bin_number(z, 0, 0.2)]
          })
        })
      },
      source: vector_source(host, 'wavenergy:hsr_band', epsg)
    }),
    new VectorLayer({
      style: styles.cont_style,
      source: vector_source(host, 'wavenergy:hsr_cont', epsg)
    }),
    new VectorLayer({
      declutter: true,
      style: styles.cont_label_style,
      source: vector_source(host, 'wavenergy:hsr_cont', epsg)
    }),
    new VectorLayer({
      style: function (feature, resolution) {
        var z = feature.get('z_mean');
        return new Style({
          fill: new Fill({
            // color: fun.get_color(colorbrewer.OrRd, z, 0, 2.6, 0.2)
            color: hsr_colors[bin_number(z, 0, 0.2)]
          })
        })
      },
      source: vector_source(host, 'wavenergy:azov_10_hsr_plg', epsg)
    }),
    new VectorLayer({
      style: styles.cont_style,
      source: vector_source(host, 'wavenergy:azov_10_hsr_iso', epsg)
    }),
    new VectorLayer({
      declutter: true,
      style: styles.cont_label_style,
      source: vector_source(host, 'wavenergy:azov_10_hsr_iso', epsg)
    }),
    new VectorLayer({
      style: function (feature, resolution) {
        var z = feature.get('z_mean');
        return new Style({
          fill: new Fill({
            color: hsr_colors[bin_number(z, 0, 0.2)]
          })
        })
      },
      source: vector_source(host, 'wavenergy:hsr_plg_dv', epsg)
    })
    ,
    new VectorLayer({
      style: styles.cont_style,
      source: vector_source(host, 'wavenergy:hsr_iso_dv', epsg)
    }),
    new VectorLayer({
      declutter: true,
      style: styles.cont_label_style,
      source: vector_source(host, 'wavenergy:hsr_iso_dv', epsg)
    }),
    new VectorLayer({
      style: function (feature, resolution) {
        var z = feature.get('z_mean');
        return new Style({
          fill: new Fill({
            color: hsr_colors[bin_number(z, 0, 0.2)]
          })
        })
      },
      source: vector_source(host, 'wavenergy:hsr_02_50_plg_ws', epsg)
    }),
    new VectorLayer({
      style: styles.cont_style,
      source: vector_source(host, 'wavenergy:hsr_02_50_iso_ws', epsg)
    }),
    new VectorLayer({
      declutter: true,
      style: styles.cont_label_style,
      source: vector_source(host, 'wavenergy:hsr_02_50_iso_ws', epsg)
    }),
  ]
});



var lsr_lyr_group = new Group({
  combine: true,
  visible: true,
  name: 'lsr',
  layers: [
    new VectorLayer({
      style: function (feature, resolution) {
        var z = feature.get('z_mean');
        return new Style({
          fill: new Fill({
            color: fun.get_color(colorbrewer.Blues, z, 0, 140, 10)
          })
        })
      },
      source: vector_source(host, 'wavenergy:lsr_band', epsg)
    }),
    new VectorLayer({
      style: styles.cont_style,
      source: vector_source(host, 'wavenergy:lsr_cont', epsg)
    }),
    new VectorLayer({
      declutter: true,
      style: styles.cont_label_style,
      source: vector_source(host, 'wavenergy:lsr_cont', epsg)
    }),
    new VectorLayer({
      style: function (feature, resolution) {
        var z = feature.get('z_mean');
        return new Style({
          fill: new Fill({
            color: fun.get_color(colorbrewer.Blues, z, 0, 140, 10)
          })
        })
      },
      source: vector_source(host, 'wavenergy:azov_10_lsr_plg', epsg)
    }),
    new VectorLayer({
      style: styles.cont_style,
      source: vector_source(host, 'wavenergy:azov_10_lsr_iso', epsg)
    }),
    new VectorLayer({
      declutter: true,
      style: styles.cont_label_style,
      source: vector_source(host, 'wavenergy:azov_10_lsr_iso', epsg)
    })
  ]
});




var psr_lyr_group = new Group({
  combine: true,
  visible: true,
  name: 'psr',
  layers: [
    new VectorLayer({
      style: function (feature, resolution) {
        var z = feature.get('z_mean');
        return new Style({
          fill: new Fill({
            color: fun.get_color(colorbrewer.Greens, z, 0, 7, 0.5)
          })
        })
      },
      source: vector_source(host, 'wavenergy:psr_band', epsg)
    }),
    new VectorLayer({
      style: styles.cont_style,
      source: vector_source(host, 'wavenergy:psr_cont', epsg)
    }),
    new VectorLayer({
      declutter: true,
      style: styles.cont_label_style,
      source: vector_source(host, 'wavenergy:psr_cont', epsg)
    }),
    new VectorLayer({
      style: function (feature, resolution) {
        var z = feature.get('z_mean');
        return new Style({
          fill: new Fill({
            color: fun.get_color(colorbrewer.Greens, z, 0, 7, 0.5)
          })
        })
      },
      source: vector_source(host, 'wavenergy:azov_10_psr_plg', epsg)
    }),
    new VectorLayer({
      style: styles.cont_style,
      source: vector_source(host, 'wavenergy:azov_10_psr_iso', epsg)
    }),
    new VectorLayer({
      declutter: true,
      style: styles.cont_label_style,
      source: vector_source(host, 'wavenergy:azov_10_psr_iso', epsg)
    })
  ]
});

var esr_lyr_group = new Group({
  combine: true,
  visible: true,
  name: 'esr',
  layers: [
    new VectorLayer({
      style: function (feature, resolution) {
        var z = feature.get('z_mean');
        return new Style({
          fill: new Fill({
            color: fun.get_color(colorbrewer.YlGnBu, z, 0, 65, 5)
          })
        })
      },
      source: vector_source(host, 'wavenergy:esr_02_50_plg', epsg)
    }),
    new VectorLayer({
      style: styles.cont_style,
      source: vector_source(host, 'wavenergy:esr_02_50_iso', epsg)
    }),
    new VectorLayer({
      declutter: true,
      style: styles.cont_label_style,
      source: vector_source(host, 'wavenergy:esr_02_50_iso', epsg)
    }),
    new VectorLayer({
      style: function (feature, resolution) {
        var z = feature.get('z_mean');
        return new Style({
          fill: new Fill({
            color: fun.get_color(colorbrewer.YlGnBu, z, 0, 65, 5)
          })
        })
      },
      source: vector_source(host, 'wavenergy:azov_10_esr_plg', epsg)
    }),
    new VectorLayer({
      style: styles.cont_style,
      source: vector_source(host, 'wavenergy:azov_10_esr_iso', epsg)
    }),
    new VectorLayer({
      declutter: true,
      style: styles.cont_label_style,
      source: vector_source(host, 'wavenergy:azov_10_esr_iso', epsg)
    }),
    new VectorLayer({
      style: function (feature, resolution) {
        var z = feature.get('z_mean');
        return new Style({
          fill: new Fill({
            color: fun.get_color(colorbrewer.YlGnBu, z, 0, 65, 5)
          })
        })
      },
      source: vector_source(host, 'wavenergy:esr_02_50_plg_ws', epsg)
    }),
    new VectorLayer({
      style: styles.cont_style,
      source: vector_source(host, 'wavenergy:esr_02_50_iso_ws', epsg)
    }),
    new VectorLayer({
      declutter: true,
      style: styles.cont_label_style,
      source: vector_source(host, 'wavenergy:esr_02_50_iso_ws', epsg)
    }),
    new VectorLayer({
      style: function (feature, resolution) {
        var z = feature.get('z_mean');
        return new Style({
          fill: new Fill({
            color: fun.get_color(colorbrewer.YlGnBu, z, 0, 65, 5)
          })
        })
      },
      source: vector_source(host, 'wavenergy:esr_band', epsg)
    }),
    new VectorLayer({
      style: styles.cont_style,
      source: vector_source(host, 'wavenergy:esr_cont', epsg)
    }),
    new VectorLayer({
      declutter: true,
      style: styles.cont_label_style,
      source: vector_source(host, 'wavenergy:esr_cont', epsg)
    })
  ]
});




var emax_lyr_group = new Group({
  combine: true,
  visible: true,
  name: 'emax',
  layers: [
    new VectorLayer({
      style: function (feature, resolution) {
        var z = feature.get('z_mean');
        return new Style({
          fill: new Fill({
            color: fun.get_color(colorbrewer.YlOrBr, z, 0, 4000, 250)
          })
        })
      },
      source: vector_source(host, 'wavenergy:azov_10_emax_plg', epsg)
    }),
    new VectorLayer({
      style: styles.cont_style,
      source: vector_source(host, 'wavenergy:azov_10_emax_iso', epsg)
    }),
    new VectorLayer({
      declutter: true,
      style: styles.cont_label_style,
      source: vector_source(host, 'wavenergy:azov_10_emax_iso', epsg)
    }),
    new VectorLayer({
      style: function (feature, resolution) {
        var z = feature.get('z_mean');
        return new Style({
          fill: new Fill({
            color: fun.get_color(colorbrewer.YlOrBr, z, 0, 4000, 250)
          })
        })
      },
      source: vector_source(host, 'wavenergy:emax_plg', epsg)
    }),
    new VectorLayer({
      style: styles.cont_style,
      source: vector_source(host, 'wavenergy:emax_iso', epsg)
    }),
    new VectorLayer({
      declutter: true,
      style: styles.cont_label_style,
      source: vector_source(host, 'wavenergy:emax_iso', epsg)
    })
  ]
});





var osr_lyr_group = new Group({
  combine: true,
  visible: true,
  name: 'osr',
  layers: [
    new VectorLayer({
      style: function (feature, resolution) {
        var z = feature.get('Z_MEAN');
        return new Style({
          fill: new Fill({
            color: fun.get_color(colorbrewer.YlGn, z, 0, 100, 10)
          })
        })
      },
      source: vector_source(host, 'wavenergy:osr_band', epsg)
    }),
    new VectorLayer({
      style: styles.cont_style,
      source: vector_source(host, 'wavenergy:osr_cont', epsg)
    }),
    new VectorLayer({
      declutter: true,
      style: styles.cont_label_style,
      source: vector_source(host, 'wavenergy:osr_cont', epsg)
    }),
    new VectorLayer({
      style: function (feature, resolution) {
        var z = feature.get('z_mean');
        return new Style({
          fill: new Fill({
            color: fun.get_color(colorbrewer.YlGn, z, 0, 100, 10)
          })
        })
      },
      source: vector_source(host, 'wavenergy:osr_plg', epsg)
    }),
    new VectorLayer({
      style: styles.cont_style,
      source: vector_source(host, 'wavenergy:osr_iso', epsg)
    }),
    new VectorLayer({
      declutter: true,
      style: styles.cont_label_style,
      source: vector_source(host, 'wavenergy:osr_iso', epsg)
    }),
    new VectorLayer({
      style: function (feature, resolution) {
        var z = feature.get('z_mean');
        return new Style({
          fill: new Fill({
            color: fun.get_color(colorbrewer.YlGn, z, 0, 100, 10)
          })
        })
      },
      source: vector_source(host, 'wavenergy:obesp_02_50_plg_ws', epsg)
    }),
    new VectorLayer({
      style: styles.cont_style,
      source: vector_source(host, 'wavenergy:obesp_02_50_iso_ws', epsg)
    }),
    new VectorLayer({
      declutter: true,
      style: styles.cont_label_style,
      source: vector_source(host, 'wavenergy:obesp_02_50_iso_ws', epsg)
    })
  ]
});

var wind_grp_50_lyr_group = new Group({
  combine: true,
  visible: true,
  name: 'psr',
  layers: [
    new VectorLayer({
      style: function (feature, resolution) {
        var z = feature.get('z_mean');
        return new Style({
          fill: new Fill({
            color: fun.get_color(colorbrewer.PuBuGn, z, 0, 900, 100)
          })
        })
      },
      source: vector_source(host, 'wavenergy:wind_grp50_band', epsg)
    }),
    new VectorLayer({
      style: styles.cont_style,
      source: vector_source(host, 'wavenergy:wind_grp50_cont', epsg)
    }),
    new VectorLayer({
      declutter: true,
      style: styles.cont_label_style,
      source: vector_source(host, 'wavenergy:wind_grp50_cont', epsg)
    })
  ]
});

var wind_grp_100_lyr_group = new Group({
  combine: true,
  visible: true,
  name: 'psr',
  layers: [
    new VectorLayer({
      style: function (feature, resolution) {
        var z = feature.get('z_mean');
        return new Style({
          fill: new Fill({
            color: fun.get_color(colorbrewer.PuBuGn, z, 0, 1100, 100)
          })
        })
      },
      source: vector_source(host, 'wavenergy:wind_grp100_band', epsg)
    }),
    new VectorLayer({
      style: styles.cont_style,
      source: vector_source(host, 'wavenergy:wind_grp100_cont', epsg)
    }),
    new VectorLayer({
      declutter: true,
      style: styles.cont_label_style,
      source: vector_source(host, 'wavenergy:wind_grp100_cont', epsg)
    })
  ]
});

var wind_grp_50c_lyr_group = new Group({
  combine: true,
  visible: true,
  name: 'grp_50',
  layers: [
    new VectorLayer({
      style: function (feature, resolution) {
        var sea = feature.get('layer');
        var conflict = feature.get('overlap');
        if (!(conflict == 1 && sea == 'barentsz_wind')) {
          var z = feature.get('grp_50');
          return new Style({
            fill: new Fill({
              color: fun.get_color(colorbrewer.PuBuGn, z, 0, 1800, 100)
            }),
            stroke: new Stroke({
              color: '#000000',
              width: 0.1
            })
          })
        }
      },
      source: vector_source(host, 'wavenergy:grpandblackwind', epsg)
    })
  ]
});

var wind_grp_100c_lyr_group = new Group({
  combine: true,
  visible: true,
  name: 'grp_100',
  layers: [
    new VectorLayer({
      style: function (feature, resolution) {
        var sea = feature.get('layer');
        var conflict = feature.get('overlap');
        if (!(conflict == 1 && sea == 'barentsz_wind')) {
          var z = feature.get('grp_100');
          return new Style({
            fill: new Fill({
              color: fun.get_color(colorbrewer.PuBuGn, z, 0, 1800, 100)
            }),
            stroke: new Stroke({
              color: '#000000',
              width: 0.1
            })
          })
        }
      },
      source: vector_source(host, 'wavenergy:grpandblackwind', epsg)
    })
  ]
});

var wind_spd_50c_lyr_group = new Group({
  combine: true,
  visible: true,
  name: 'wind_spd_50c_lyr_group',
  layers: [
    new VectorLayer({
      style: function (feature, resolution) {
        var z = feature.get('spd_50');
        if (z != null) {
          return new Style({
            fill: new Fill({
              color: fun.get_color(colorbrewer.PuBuGn, z, 0, 12, 1)
            }),
            stroke: new Stroke({
              color: '#000000',
              width: 0.1
            })
          })
        }
      },
      source: vector_source(host, 'wavenergy:grpandblackwind', epsg)
    })
  ]
});

var wind_spd_100c_lyr_group = new Group({
  combine: true,
  visible: true,
  name: 'wind_spd_100c_lyr_group',
  layers: [
    new VectorLayer({
      style: function (feature, resolution) {
        var z = feature.get('spd_100');
        if (z != null) {
          return new Style({
            fill: new Fill({
              color: fun.get_color(colorbrewer.PuBuGn, z, 0, 12, 1)
            }),
            stroke: new Stroke({
              color: '#000000',
              width: 0.1
            })
          })
        }
      },
      source: vector_source(host, 'wavenergy:grpandblackwind', epsg)
    })
  ]
});


module.exports = {
  hs_lyr_group,
  h3p_lyr_group,
  hsr_lyr_group,
  lsr_lyr_group,
  psr_lyr_group,
  esr_lyr_group,
  emax_lyr_group,
  osr_lyr_group,
  wind_grp_50_lyr_group,
  wind_grp_100_lyr_group,
  wind_grp_50c_lyr_group,
  wind_grp_100c_lyr_group,
  wind_spd_50c_lyr_group,
  wind_spd_100c_lyr_group,
}
